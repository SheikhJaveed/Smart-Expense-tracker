import os
from azure.cosmos import CosmosClient, PartitionKey
from dotenv import load_dotenv

# Load .env file
load_dotenv()

URI = os.getenv("COSMOS_URI")
KEY = os.getenv("COSMOS_KEY")

if not URI or not KEY:
    raise ValueError("COSMOS_URI or COSMOS_KEY is not set!")

client = CosmosClient(URI, credential=KEY)

database_name = "SmartExpenseDB"
database = client.create_database_if_not_exists(id=database_name)

container_name = "Expenses"
container = database.create_container_if_not_exists(
    id=container_name,
    partition_key=PartitionKey(path="/userId")
)

print("Connected to Cosmos DB successfully!")
