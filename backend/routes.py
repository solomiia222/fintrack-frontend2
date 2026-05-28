from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
import re
import models, schemas
from dependencies import get_db, get_current_user
from auth import hash_password, verify_password, create_access_token
from services import categorize
from fastapi.responses import StreamingResponse
import csv
import io
from sqlalchemy import func
from fastapi import Query
from datetime import date
from ai import model
from dependencies import get_current_user



router = APIRouter()


@router.post("/register")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):

    # EMAIL VALIDATION
    email_regex = r"^[\w\.-]+@[\w\.-]+\.\w+$"

    if not re.match(email_regex, user.email):
        raise HTTPException(
            status_code=400,
            detail="Invalid email format"
        )

    # PASSWORD VALIDATION
    password = user.password

    if len(password) < 8:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 8 characters long"
        )

    if not re.search(r"[A-Z]", password):
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least one uppercase letter"
        )

    if not re.search(r"[a-z]", password):
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least one lowercase letter"
        )

    if not re.search(r"\d", password):
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least one number"
        )
    
    # PHONE VALIDATION
    phone_regex = r"^\+\d{7,15}$"

    if not re.match(phone_regex, user.phone_number):
        raise HTTPException(
            status_code=400,
            detail="Phone number must include country code (example: +49123456789)"
        )

    existing = db.query(models.User).filter_by(email=user.email).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="User already exists"
        )

    new_user = models.User(
        first_name=user.first_name,
        last_name=user.last_name,
        phone_number=user.phone_number,
        email=user.email,
        password=hash_password(password)
    )

    db.add(new_user)
    db.commit()

    return {
        "message": "User created successfully"
    }


@router.post("/login", response_model=schemas.Token)
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter_by(email=user.email).first()

    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": db_user.email})
    return {"access_token": token}


# TRANSACTIONS

@router.post("/transactions")
def create_transaction(
    data: schemas.TransactionCreate,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    category_name = data.category

    if not category_name:
        category_name = categorize(data.description)

    category = db.query(models.Category).filter_by(name=category_name).first()
    if not category:
        category = models.Category(name=category_name)
        db.add(category)
        db.commit()
        db.refresh(category)

    transaction = models.Transaction(
        user_id=user.id,
        amount=data.amount,
        description=data.description,
        date=data.date,
        category_id=category.id
    )

    db.add(transaction)
    db.commit()
    db.refresh(transaction)

    return {
        "id": transaction.id,
        "amount": transaction.amount,
        "description": transaction.description,
        "date": transaction.date,
        "category": category.name
    }


@router.get("/transactions")
def get_transactions(
    page: int = 1,
    limit: int = 10,
    category: str | None = None,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    query = db.query(models.Transaction).filter_by(user_id=user.id)

    if category:
        category_obj = db.query(models.Category).filter_by(name=category).first()

        if category_obj:
            query = query.filter_by(category_id=category_obj.id)

    transactions = query.offset((page - 1) * limit).limit(limit).all()

    result = []

    for t in transactions:
        category_obj = db.query(models.Category).get(t.category_id)

        result.append({
            "id": t.id,
            "amount": t.amount,
            "description": t.description,
            "date": t.date,
            "category": category_obj.name if category_obj else None
        })

    return result


@router.put("/transactions/{transaction_id}")
def update_transaction(
    transaction_id: int,
    data: schemas.TransactionUpdate,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    transaction = db.query(models.Transaction).filter_by(
        id=transaction_id,
        user_id=user.id
    ).first()

    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    if data.amount is not None:
        transaction.amount = data.amount

    if data.description is not None:
        transaction.description = data.description

    if data.date is not None:
        transaction.date = data.date

    if data.category is not None:
        category = db.query(models.Category).filter_by(name=data.category).first()

        if not category:
            category = db.query(models.Category).filter_by(name="Other").first()

        transaction.category_id = category.id

    db.commit()
    db.refresh(transaction)

    return {"message": "Transaction updated"}


@router.delete("/transactions/{transaction_id}")
def delete_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    transaction = db.query(models.Transaction).filter_by(
        id=transaction_id,
        user_id=user.id
    ).first()

    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    db.delete(transaction)
    db.commit()

    return {"message": "Transaction deleted"}


# ANALYTICS (VIEW)

@router.get("/analytics/monthly")
def monthly_analytics(
    db: Session = Depends(get_db),
    user = Depends(get_current_user),
    from_date: date = Query(None),
    to_date: date = Query(None)
):
    query = db.query(
        func.to_char(models.Transaction.date, "YYYY-MM").label("month"),
        func.sum(models.Transaction.amount).label("total")
    ).filter(models.Transaction.user_id == user.id)

    if from_date:
        query = query.filter(models.Transaction.date >= from_date)

    if to_date:
        query = query.filter(models.Transaction.date <= to_date)

    query = query.group_by("month").order_by("month")

    result = query.all()

    return [
        {
            "month": r.month,
            "total": float(r.total)
        }
        for r in result
    ]


@router.get("/analytics/categories")
def category_analytics(
    db: Session = Depends(get_db),
    user = Depends(get_current_user),
    from_date: date = Query(None),
    to_date: date = Query(None),
    page: int = 1,
    limit: int = Query(10, le=100)
):
    query = db.query(
        models.Category.name.label("category"),
        func.sum(models.Transaction.amount).label("total")
    ).join(models.Transaction, models.Transaction.category_id == models.Category.id)\
     .filter(models.Transaction.user_id == user.id)

    if from_date:
        query = query.filter(models.Transaction.date >= from_date)

    if to_date:
        query = query.filter(models.Transaction.date <= to_date)

    query = query.group_by(models.Category.name)\
                 .order_by(func.sum(models.Transaction.amount).desc())

    total_items = query.count()

    results = query.offset((page - 1) * limit).limit(limit).all()

    return {
        "page": page,
        "limit": limit,
        "total_items": total_items,
        "data": [
            {
                "category": r.category,
                "total": float(r.total)
            }
            for r in results
        ]
    }


@router.get("/analytics/budgets")
def budget_analytics(
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    result = db.execute(text("""
        SELECT
            c.name AS category,
            b.monthly_limit,
            COALESCE(SUM(t.amount), 0) AS spent,
            b.monthly_limit - COALESCE(SUM(t.amount), 0) AS remaining
        FROM budgets b
        JOIN categories c ON b.category_id = c.id
        LEFT JOIN transactions t
            ON t.category_id = c.id
            AND t.user_id = b.user_id
        WHERE b.user_id = :uid
        GROUP BY c.name, b.monthly_limit
    """), {"uid": user.id}).fetchall()

    return [dict(row._mapping) for row in result]

# BUDGETS
@router.post("/budgets")
def create_budget(
    data: schemas.BudgetCreate,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    category = db.query(models.Category).filter_by(name=data.category).first()

    if not category:
        raise HTTPException(status_code=400, detail="Invalid category")

    existing = db.query(models.Budget).filter_by(
        user_id=user.id,
        category_id=category.id
    ).first()

    if existing:
        existing.monthly_limit = data.monthly_limit
        db.commit()
        return {"message": "Budget updated"}

    budget = models.Budget(
        user_id=user.id,
        category_id=category.id,
        monthly_limit=data.monthly_limit
    )

    db.add(budget)
    db.commit()

    return {"message": "Budget created"}


@router.get("/budgets")
def get_budgets(
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    budgets = db.query(models.Budget).filter_by(user_id=user.id).all()

    result = []

    for b in budgets:
        category = db.query(models.Category).get(b.category_id)

        result.append({
            "category": category.name,
            "monthly_limit": b.monthly_limit
        })

    return result


# TABLE EXPORT
@router.get("/export/csv")
def export_csv(
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    transactions = db.query(models.Transaction).filter_by(user_id=user.id).all()

    output = io.StringIO()
    writer = csv.writer(output)

    writer.writerow(["ID", "Amount", "Description", "Date"])

    for t in transactions:
        writer.writerow([
            t.id,
            t.amount,
            t.description,
            t.date
        ])

    output.seek(0)

    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={
            "Content-Disposition": "attachment; filename=transactions.csv"
        }
    )

# AI PREDICTION
@router.get("/predict/spending")
def predict_spending(
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    result = db.execute(text("""
        SELECT
            DATE_TRUNC('month', date) AS month,
            SUM(amount) AS total
        FROM transactions
        WHERE user_id = :uid
        GROUP BY DATE_TRUNC('month', date)
        ORDER BY month
    """), {"uid": user.id}).fetchall()

    totals = [float(r.total) for r in result]

    if len(totals) == 0:
        return {
            "prediction": 0,
            "message": "Not enough data"
        }

    prediction = sum(totals) / len(totals)

    return {
        "predicted_next_month_spending": round(prediction, 2)
    }


@router.post("/ai/coach")
def financial_coach(
    message: str,
    db: Session = Depends(lambda: SessionLocal()),
    user = Depends(get_current_user)
):
    # Get summary data
    total = db.query(func.sum(models.Transaction.amount))\
        .filter(models.Transaction.user_id == user.id).scalar() or 0

    categories = db.query(
        models.Category.name,
        func.sum(models.Transaction.amount)
    ).join(models.Transaction)\
     .filter(models.Transaction.user_id == user.id)\
     .group_by(models.Category.name).all()

    context = f"""
User financial data:
Total spending: {total}

Category breakdown:
{categories}

User question:
{message}
"""

    response = model.generate_content(context)

    return {"response": response.text}


@router.get("/ai/report")
def monthly_report(
    db: Session = Depends(lambda: SessionLocal()),
    user = Depends(get_current_user)
):
    monthly = db.query(
        func.to_char(models.Transaction.date, "YYYY-MM").label("month"),
        func.sum(models.Transaction.amount)
    ).filter(models.Transaction.user_id == user.id)\
     .group_by("month")\
     .order_by("month").all()

    categories = db.query(
        models.Category.name,
        func.sum(models.Transaction.amount)
    ).join(models.Transaction)\
     .filter(models.Transaction.user_id == user.id)\
     .group_by(models.Category.name).all()

    prompt = f"""
Create a financial report for the user:

Monthly spending:
{monthly}

Category spending:
{categories}

Make it short, clear, and user friendly.
"""

    response = model.generate_content(prompt)

    return {"report": response.text}


@router.get("/ai/budget-suggestions")
def budget_suggestions(
    db: Session = Depends(lambda: SessionLocal()),
    user = Depends(get_current_user)
):
    categories = db.query(
        models.Category.name,
        func.avg(models.Transaction.amount)
    ).join(models.Transaction)\
     .filter(models.Transaction.user_id == user.id)\
     .group_by(models.Category.name).all()

    prompt = f"""
Based on the user's historical spending, suggest monthly budgets.

Data:
{categories}

Return:
- category
- recommended budget
- short explanation
"""

    response = model.generate_content(prompt)

    return {"suggestions": response.text}