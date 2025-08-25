# backend/database.py
import os
from azure.cosmos import CosmosClient
from dotenv import load_dotenv

load_dotenv()  # load .env file

COSMOS_URI = os.getenv("COSMOS_URI")
COSMOS_KEY = os.getenv("COSMOS_KEY")

client = CosmosClient(COSMOS_URI, credential=COSMOS_KEY)

database_name = "SmartExpenseDB"
database = client.create_database_if_not_exists(id=database_name)

container_name = "Expenses"
container = database.create_container_if_not_exists(
    id=container_name,
    partition_key=("/userId",)
)
