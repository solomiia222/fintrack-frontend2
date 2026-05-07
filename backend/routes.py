from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text

import models, schemas
from dependencies import get_db, get_current_user
from auth import hash_password, verify_password, create_access_token
from services import categorize

router = APIRouter()


# AUTH ROUTES

@router.post("/register")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter_by(email=user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User exists")

    new_user = models.User(
        email=user.email,
        password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()

    return {"message": "User created"}


@router.post("/login", response_model=schemas.Token)
def login(user: schemas.UserCreate, db: Session = Depends(get_db)):
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
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    transactions = db.query(models.Transaction).filter_by(user_id=user.id).all()

    result = []
    for t in transactions:
        category = db.query(models.Category).get(t.category_id)
        result.append({
            "id": t.id,
            "amount": t.amount,
            "description": t.description,
            "date": t.date,
            "category": category.name if category else None
        })

    return result


# ANALYTICS (VIEW)

@router.get("/analytics/monthly")
def monthly_analytics(
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    result = db.execute(
        text("SELECT * FROM monthly_spending WHERE user_id = :uid"),
        {"uid": user.id}
    ).fetchall()

    return [dict(row._mapping) for row in result]