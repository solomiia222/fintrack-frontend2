from pydantic import BaseModel
from datetime import date

class UserCreate(BaseModel):
    email: str
    password: str


class Token(BaseModel):
    access_token: str


class TransactionCreate(BaseModel):
    amount: float
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