import { useState, useEffect } from "react";
import { getExpenses, createExpense, deleteExpense } from "./api";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const fetchExpenses = async () => {
    const response = await getExpenses();
    setExpenses(response.data);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAdd = async () => {
    if (!name || !amount) return;
    await createExpense({ name, amount: parseFloat(amount) });
    setName("");
    setAmount("");
    fetchExpenses();
  };

  const handleDelete = async (id) => {
    await deleteExpense(id);
    fetchExpenses();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Expense Tracker</h1>

      <div>
        <input
          placeholder="Expense Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={handleAdd}>Add Expense</button>
      </div>

      <ul>
        {expenses.map((exp) => (
          <li key={exp.id}>
            {exp.name}: ${exp.amount}{" "}
            <button onClick={() => handleDelete(exp.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
