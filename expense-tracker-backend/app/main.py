from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from . import models, schemas, database, auth, deps

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- AUTH ----------
@app.post("/auth/signup")
def signup(user: schemas.UserCreate, db: Session = Depends(deps.get_db)):
    existing = db.query(models.User).filter(models.User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")
    new_user = models.User(
        email=user.email,
        hashed_password=auth.get_password_hash(user.password),
    )
    db.add(new_user)
    db.commit()
    return {"message": "User created"}


@app.post("/auth/login", response_model=schemas.Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(deps.get_db),
):
    user = auth.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = auth.create_access_token({"sub": user.id})
    return {"access_token": token, "token_type": "bearer"}

@app.post("/budget")
def set_budget(
    data: schemas.BudgetUpdate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user),
):
    current_user.budget = data.budget
    db.commit()
    return {"budget": current_user.budget}


@app.get("/budget")
def get_budget(
    current_user: models.User = Depends(deps.get_current_user),
):
    return {"budget": current_user.budget}

# ---------- EXPENSE ----------
@app.get("/expenses", response_model=list[schemas.Expense])
def read_expenses(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user)
):
    return db.query(models.Expense).filter(
        models.Expense.owner_id == current_user.id
    ).all()

@app.post("/expenses", response_model=schemas.Expense)
def create_expense(
    expense: schemas.ExpenseCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user)
):
    # 🔥 STEP 1: budget check
    if current_user.budget < expense.amount:
        raise HTTPException(
            status_code=400,
            detail="Insufficient budget"
        )

    # 🔥 STEP 2: reduce budget
    current_user.budget -= expense.amount

    # 🔥 STEP 3: create expense
    db_expense = models.Expense(
        name=expense.name,
        amount=expense.amount,
        owner_id=current_user.id
    )

    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense





@app.delete("/expenses/{expense_id}")
def delete_expense(
    expense_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user)
):
    expense = db.query(models.Expense).filter(
        models.Expense.id == expense_id,
        models.Expense.owner_id == current_user.id
    ).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    db.delete(expense)
    db.commit()
    return {"message": "Deleted successfully"}
