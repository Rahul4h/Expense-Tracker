import { useState, useEffect } from "react";
import {
  getExpenses,
  createExpense,
  deleteExpense,
  signupUser,
  loginUser,
  getBudget,
  setBudget,
} from "./api";

function App() {
  const savedToken = localStorage.getItem("token");

  const [token, setToken] = useState(savedToken || "");
  const [user, setUser] = useState(savedToken ? "Logged User" : null);
  const [page, setPage] = useState(savedToken ? "tracker" : "signup");

  const [expenses, setExpenses] = useState([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const [budget, setBudgetState] = useState(0);
  const [budgetInput, setBudgetInput] = useState("");

  // ---------- Fetch ----------
  const fetchExpenses = async () => {
    if (!token) return;
    const res = await getExpenses();
    setExpenses(res.data);
  };

  const fetchBudget = async () => {
    const res = await getBudget();
    setBudgetState(res.data.budget);
  };

  useEffect(() => {
    if (token) {
      fetchExpenses();
      fetchBudget();
    }
  }, [token]);

  // ---------- Auth ----------
  const handleSignup = async (email, password) => {
    await signupUser(email, password);
    alert("Signup successful! Please login.");
    setPage("login");
  };

  const handleLogin = async (email, password) => {
    const res = await loginUser(email, password);
    localStorage.setItem("token", res.data.access_token);
    setToken(res.data.access_token);
    setUser(email);
    setPage("tracker");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
    setExpenses([]);
    setPage("login");
  };

  // ---------- Budget ----------
  const handleSetBudget = async () => {
    await setBudget(parseFloat(budgetInput));
    setBudgetInput("");
    fetchBudget();
  };

  // ---------- Expense ----------
  const handleAdd = async () => {
    if (!name || !amount) return;
    await createExpense({ name, amount: parseFloat(amount) });
    setName("");
    setAmount("");
    fetchExpenses();
    fetchBudget(); // 🔥 budget auto refresh
  };

  const handleDelete = async (id) => {
    await deleteExpense(id);
    fetchExpenses();
    fetchBudget();
  };

  // ---------- UI ----------
  return (
    <div style={{ padding: "20px", maxWidth: "700px", margin: "auto" }}>
      {/* NAVBAR */}
      <nav
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 20px",
    background: "#1f2937",
    color: "white",
    borderRadius: "8px",
    marginBottom: "20px",
  }}
>
  <div style={{ fontSize: "18px", fontWeight: "600" }}>
    💰 Expense Tracker
  </div>

  {!token ? (
    <div>
      <button onClick={() => setPage("signup")}>Signup</button>
      <button onClick={() => setPage("login")} style={{ marginLeft: "10px" }}>
        Login
      </button>
    </div>
  ) : (
    <div>
      <span style={{ marginRight: "15px" }}>{user}</span>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )}
</nav>

      

      {page === "signup" && !token && <SignupForm onSignup={handleSignup} />}
      {page === "login" && !token && <LoginForm onLogin={handleLogin} />}

      {page === "tracker" && token && (
        <>
          {/* BUDGET CARD */}
          <div
            style={{
              padding: "15px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            <h3>Remaining Budget: ৳ {budget}</h3>
            <input
              placeholder="Set / Update Budget"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
            />
            <button onClick={handleSetBudget}>Save Budget</button>
          </div>

          <ExpenseTracker
            expenses={expenses}
            name={name}
            setName={setName}
            amount={amount}
            setAmount={setAmount}
            handleAdd={handleAdd}
            handleDelete={handleDelete}
          />
        </>
      )}
    </div>
  );
}

/* ---------- Forms ---------- */

function SignupForm({ onSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <h2>Signup</h2>
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={() => onSignup(email, password)}>Signup</button>
    </>
  );
}

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <h2>Login</h2>
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={() => onLogin(email, password)}>Login</button>
    </>
  );
}

function ExpenseTracker({
  expenses,
  name,
  setName,
  amount,
  setAmount,
  handleAdd,
  handleDelete,
}) {
  return (
    <>
      <h2>Your Expenses</h2>
      <input
        placeholder="Expense name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleAdd}>Add Expense</button>

      <ul>
        {expenses.map((e) => (
          <li key={e.id}>
            {e.name} — ৳ {e.amount}
            <button onClick={() => handleDelete(e.id)}>❌</button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
