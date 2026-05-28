from pydantic import BaseModel, EmailStr
from datetime import date
from typing import Optional


class UserCreate(BaseModel):
    first_name: str
    last_name: str
    phone_number: str

    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str


class TransactionCreate(BaseModel):
    amount: float
    category: str | None = None
    description: str
    date: date


class TransactionOut(BaseModel):
    id: int
    amount: float
    description: str
    date: date
    category: str

    class Config:
        from_attributes = True


class BudgetCreate(BaseModel):
    category: str
    monthly_limit: float


class TransactionUpdate(BaseModel):
    amount: float | None = None
    description: str | None = None
    date: Optional[date] = None
    category: str | None = None