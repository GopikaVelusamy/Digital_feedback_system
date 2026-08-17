from dotenv import load_dotenv
load_dotenv()
import os
from pymongo import MongoClient

uri = os.getenv('MONGODB_URI')
client = MongoClient(uri)
db = client["feedback_ai_db"]

leaders = [
    {
        "email": "coimbatore_leader@admk.org",
        "name": "Coimbatore Leader",
        "password": "leader123",
        "role": "leader",
        "district": "Coimbatore",
        "constituency": "Coimbatore South"
    },
    {
        "email": "salem_leader@admk.org",
        "name": "Salem Constituency Leader",
        "password": "leader123",
        "role": "leader",
        "district": "Salem",
        "constituency": "Edappadi"
    },
    {
        "email": "admin@admk.org",
        "name": "Super Admin",
        "password": "admin123",
        "role": "admin",
        "district": "All",
        "constituency": "All"
    }
]

for l in leaders:
    existing = db["users"].find_one({"email": l["email"]})
    if not existing:
        db["users"].insert_one(l)
        print(f"Created user: {l['email']}")
    else:
        db["users"].update_one({"email": l["email"]}, {"$set": l})
        print(f"Updated user: {l['email']}")

print("All leader accounts updated successfully!")
