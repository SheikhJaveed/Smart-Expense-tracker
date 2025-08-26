# SpendWise

**SpendWise** is a modern, user-friendly **Expense Tracker Web Application** that helps users manage their personal finances efficiently. It allows users to **add, update, and delete expenses**, view expenses **category-wise**, and provides a **weekly/monthly breakdown** with total spending. The app is built using **React** for the frontend and **FastAPI + Azure Cosmos DB** for the backend.  

---

## Table of Contents

- Features  
- Demo  
- Tech Stack  
- Installation  
- Usage  
- API Endpoints 

---

## Features

- **Add Expenses:** Record new expenditures with details like amount, category, description, and date.  
- **Update Expenses:** Edit only the selected expense without affecting others.  
- **Delete Expenses:** Remove unwanted records easily.  
- **View All Expenses:** Display a **list of all expenses** with total spending.  
- **Category-wise Breakdown:** Easily visualize spending per category.  
- **Weekly/Monthly Summary:** Understand your expenditure patterns over time.  
- **Responsive Design:** Works on desktop and mobile.  

---

## Demo

You can run the project locally or deploy it to **Azure App Service**.  

---

## Tech Stack

- **Frontend:** React, HTML, CSS  
- **Backend:** FastAPI (Python)  
- **Database:** Azure Cosmos DB (NoSQL)  
- **Hosting:** Azure App Service (Optional)  
- **Others:** Axios for API calls  

---

## Installation

### Prerequisites

- Node.js >= 18.x  
- Python >= 3.10  
- Azure Cosmos DB account (or local alternative like MongoDB)  

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run React app
npm run dev
```
### Backend Setup
```
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate environment
source venv/bin/activate   # For Linux/Mac
venv\Scripts\activate      # For Windows

# Install dependencies
pip install -r requirements.txt

# Run FastAPI server
uvicorn main:app --reload
```

💻 Usage
--------

1.  Open the app in your browser → [http://localhost:5173](http://localhost:5173)
    
2.  Add expenses using the form.
    
3.  View your expense list and **total amount** at the bottom.
    
4.  Update or delete an expense using buttons.
    
5.  Explore **category-wise and time-based breakdown** with charts.

📡 API Endpoints
---------
| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/add_expense` | Add a new expense |
| GET | `/get_expenses/{userId}` | Fetch all expenses for user |
| PUT | `/update_expense/{id}` | Update an existing expense |
| DELETE | `/delete_expense/{id}` | Delete an expense by ID |

📝 Expense Model (JSON)
-------
{
  "userId": "123",
  "amount": 250.50,
  "category": "Food",
  "description": "Lunch at cafe",
  "date": "2025-08-25"
}

