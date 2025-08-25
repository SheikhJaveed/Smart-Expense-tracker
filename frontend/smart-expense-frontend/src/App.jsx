import { useState, useEffect } from "react";
import API from "./api";
import "./App.css";
import {
  PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A569BD", "#F39C12"];

function App() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    userId: "",
    amount: "",
    category: "",
    description: "",
    date: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [summary, setSummary] = useState({
    categoryTotals: [],
    weeklyTotals: [],
    monthlyTotals: [],
    recommendations: [],
  });

  // Fetch all expenses
  const fetchExpenses = async () => {
    try {
      const res = await API.get("/get_expenses");
      setExpenses(res.data);
      calculateSummary(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const addExpense = async () => {
    try {
      const payload = { ...form };
      delete payload.id;
      await API.post("/add_expense", payload);
      setForm({ userId: "", amount: "", category: "", description: "", date: "" });
      fetchExpenses();
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const saveExpense = async (id) => {
    try {
      await API.put(`/update_expense/${id}`, editForm);
      setEditingId(null);
      setEditForm({});
      fetchExpenses();
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const deleteExpense = async (exp) => {
    try {
      await API.delete(`/delete_expense/${exp.id}`);
      fetchExpenses();
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const totalAmount = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);

  // Calculate category-wise, weekly and monthly summary
  const calculateSummary = (data) => {
    const catTotals = {};
    const weeklyTotals = {};
    const monthlyTotals = {};

    data.forEach((exp) => {
      // Category totals
      catTotals[exp.category] = (catTotals[exp.category] || 0) + parseFloat(exp.amount || 0);

      // Weekly totals
      const week = getWeek(exp.date);
      weeklyTotals[week] = (weeklyTotals[week] || 0) + parseFloat(exp.amount || 0);

      // Monthly totals
      const month = exp.date.slice(0, 7); // YYYY-MM
      monthlyTotals[month] = (monthlyTotals[month] || 0) + parseFloat(exp.amount || 0);
    });

    // Recommendations based on 30% budget threshold per category
    const recs = [];
    Object.keys(catTotals).forEach((cat) => {
      if (catTotals[cat] > totalAmount * 0.3) {
        recs.push(`High spending in ${cat}. Consider reducing it.`);
      }
    });

    setSummary({
      categoryTotals: Object.entries(catTotals).map(([name, value]) => ({ name, value })),
      weeklyTotals: Object.entries(weeklyTotals).map(([week, value]) => ({ week, value })),
      monthlyTotals: Object.entries(monthlyTotals).map(([month, value]) => ({ month, value })),
      recommendations: recs,
    });
  };

  // Helper to get week number from date
  const getWeek = (dateString) => {
    const date = new Date(dateString);
    const firstDay = new Date(date.getFullYear(), 0, 1);
    return `W${Math.ceil(((date - firstDay) / 86400000 + firstDay.getDay() + 1) / 7)}-${date.getFullYear()}`;
  };

  return (
    <div className="container">
      <h1>SpendWise</h1>

      {/* Form */}
      <div className="form-container">
        <input
          placeholder="User ID"
          value={form.userId}
          onChange={(e) => setForm({ ...form, userId: e.target.value })}
        />
        <input
          placeholder="Amount"
          type="number"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />
        <input
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          placeholder="Date (YYYY-MM-DD)"
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
        <button onClick={addExpense}>Add</button>
      </div>

      {/* Expenses Table */}
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Description</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp) => (
            <tr key={exp.id}>
              <td>{exp.userId}</td>
              <td>
                {editingId === exp.id ? (
                  <input
                    type="number"
                    value={editForm.amount}
                    onChange={(e) =>
                      setEditForm({ ...editForm, amount: parseFloat(e.target.value) })
                    }
                  />
                ) : (
                  exp.amount
                )}
              </td>
              <td>
                {editingId === exp.id ? (
                  <input
                    value={editForm.category}
                    onChange={(e) =>
                      setEditForm({ ...editForm, category: e.target.value })
                    }
                  />
                ) : (
                  exp.category
                )}
              </td>
              <td>
                {editingId === exp.id ? (
                  <input
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                  />
                ) : (
                  exp.description
                )}
              </td>
              <td>
                {editingId === exp.id ? (
                  <input
                    type="date"
                    value={editForm.date}
                    onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                  />
                ) : (
                  exp.date
                )}
              </td>
              <td>
                {editingId === exp.id ? (
                  <button className="update-btn" onClick={() => saveExpense(exp.id)}>
                    Save
                  </button>
                ) : (
                  <button
                    className="update-btn"
                    onClick={() => {
                      setEditingId(exp.id);
                      setEditForm({ ...exp });
                    }}
                  >
                    Update
                  </button>
                )}
                <button className="delete-btn" onClick={() => deleteExpense(exp)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
          <tr className="total-row">
            <td style={{ textAlign: "right" }}>Total:</td>
            <td>{totalAmount.toFixed(2)}</td>
            <td colSpan="4"></td>
          </tr>
        </tbody>
      </table>

      {/* Charts */}
      <div className="charts-container">
        <h2>Category-wise Spending</h2>
        <PieChart width={400} height={300}>
          <Pie
            data={summary.categoryTotals}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {summary.categoryTotals.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend 
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ marginTop: 10 }}
          />
        </PieChart>


        <h2>Weekly Spending</h2>
        <LineChart width={600} height={300} data={summary.weeklyTotals}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>

        <h2>Monthly Spending</h2>
        <LineChart width={600} height={300} data={summary.monthlyTotals}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#82ca9d" />
        </LineChart>

      </div>
    </div>
  );
}

export default App;
