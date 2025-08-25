# backend/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from .database import container
from .models import Expense

app = FastAPI(title="Smart Expense Tracker API")

# ✅ CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add Expense
@app.post("/add_expense")
def add_expense(expense: Expense):
    try:
        # Do NOT send id from frontend; default_factory generates it
        item = expense.model_dump()
        container.create_item(body=item)
        return {"message": "Expense added successfully", "expense": item}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding expense: {str(e)}")

# Get Expenses by user_id
@app.get("/get_expenses/{user_id}", response_model=List[Expense])
def get_expenses(user_id: str):
    query = f"SELECT * FROM c WHERE c.userId = '{user_id}'"
    items = list(container.query_items(query=query, enable_cross_partition_query=True))
    return items

# Update Expense
@app.put("/update_expense/{expense_id}")
def update_expense(expense_id: str, updated_expense: Expense):
    try:
        # Read existing expense
        existing_item = container.read_item(item=expense_id, partition_key=updated_expense.userId)
        # Merge updates
        updated_item = {**existing_item, **updated_expense.model_dump()}
        container.replace_item(item=expense_id, body=updated_item)
        return {"message": "Expense updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Expense not found: {str(e)}")

# Delete Expense
@app.delete("/delete_expense/{expense_id}")
def delete_expense(expense_id: str):
    try:
        # Fetch to get partition key (userId)
        query = f"SELECT * FROM c WHERE c.id = '{expense_id}'"
        items = list(container.query_items(query=query, enable_cross_partition_query=True))
        if not items:
            raise HTTPException(status_code=404, detail="Expense not found")
        item = items[0]
        container.delete_item(item=expense_id, partition_key=item["userId"])
        return {"message": "Expense deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting expense: {str(e)}")

# Get all Expenses
@app.get("/get_expenses")
def get_all_expenses():
    query = "SELECT * FROM c"
    items = list(container.query_items(query=query, enable_cross_partition_query=True))
    return items


