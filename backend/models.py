from pydantic import BaseModel, Field
from typing import Optional
import uuid

class Expense(BaseModel):
    id: str = Field(default_factory=lambda: uuid.uuid4().hex)  # auto-generated if not passed
    userId: str
    amount: float
    category: str
    description: Optional[str] = None
    date: str
