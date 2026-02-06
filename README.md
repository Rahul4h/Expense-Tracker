💸 Expense Tracker

FastAPI Backend + React (Vite) Frontend

A full-stack Expense Tracker web application that allows users to add, view, update, and delete expenses.
Backend is built with FastAPI, and frontend is built with React (Vite).

🚀 Features

Add daily expenses (title, amount, category, date)

View all expenses in a list

Delete expenses

REST API using FastAPI

Modern React frontend

Beginner-friendly project structure

🛠 Tech Stack
Backend

FastAPI

Python

SQLAlchemy

SQLite

Pydantic

Uvicorn

Frontend

React

Vite

JavaScript

Axios

CSS

📂 Project Structure
expense-tracker/
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   └── requirements.txt
│
├── frontend/
│   ├── expense-tracker-frontend/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── App.jsx
│   │   │   └── main.jsx
│   │   ├── index.html
│   │   └── package.json
│
└── README.md

⚙️ Backend Setup (FastAPI)
1️⃣ Create virtual environment
python -m venv venv
venv\Scripts\activate   # Windows

2️⃣ Install dependencies
pip install -r requirements.txt

3️⃣ Run the server
uvicorn main:app --reload


Backend will run at:
👉 http://127.0.0.1:8000

Swagger Docs:
👉 http://127.0.0.1:8000/docs

⚛️ Frontend Setup (React)
1️⃣ Go to frontend folder
cd frontend/expense-tracker-frontend

2️⃣ Install dependencies
npm install

3️⃣ Start development server
npm run dev


Frontend will run at:
👉 http://localhost:5173

🔗 API Endpoints
Method	Endpoint	Description
GET	/expenses	Get all expenses
POST	/expenses	Add a new expense
DELETE	/expenses/{id}	Delete an expense
📌 Example Expense JSON
{
  "title": "Lunch",
  "amount": 150,
  "category": "Food"
}

🧠 Future Improvements

User authentication

Expense filtering by date/category

Monthly summary & charts

Export expenses to CSV




👤 Author

Rahul
Backend: FastAPI
Frontend: React
