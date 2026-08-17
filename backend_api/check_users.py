from dotenv import load_dotenv
load_dotenv()
import os
from pymongo import MongoClient

uri = os.getenv('MONGODB_URI')
client = MongoClient(uri)
db = client["feedback_ai_db"]

users = list(db["users"].find())
print(f"Total Users: {len(users)}")
for u in users:
    print({
        "email": u.get("email"),
        "role": u.get("role"),
        "name": u.get("name"),
        "district": u.get("district"),
        "constituency": u.get("constituency"),
        "password": u.get("password")
    })
