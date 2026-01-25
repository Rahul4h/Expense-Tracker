from pydantic import BaseModel

# ---------- AUTH ----------
class UserCreate(BaseModel):
    email: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ---------- EXPENSE ----------
class ExpenseBase(BaseModel):
    name: str
    amount: float


class ExpenseCreate(ExpenseBase):
    pass


class Expense(ExpenseBase):
    id: int

    class Config:
        from_attributes = True

class BudgetUpdate(BaseModel):
    budget: float
