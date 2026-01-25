from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    budget = Column(Float, default=0)  # 🔥 NEW

    expenses = relationship("Expense", back_populates="owner")



class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    amount = Column(Float)

    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="expenses")
