from dotenv import load_dotenv
load_dotenv()
import os
from pymongo import MongoClient

uri = os.getenv('MONGODB_URI')
client = MongoClient(uri)
db = client["feedback_ai_db"]

# Ensure Super Admin accounts exist and clean up old obsolete static leader entries
super_admins = [
    {
        "email": "admin@admk.org",
        "name": "Super Admin (Salem Master)",
        "password": "admin123",
        "role": "admin",
        "district": "Salem",
        "constituency": "All"
    },
    {
        "email": "varunthanwar@gmail.com",
        "name": "Super Admin (Varun)",
        "password": "181818",
        "role": "admin",
        "district": "Salem",
        "constituency": "All"
    }
]

# Delete old hardcoded coimbatore and salem static leader accounts
db["users"].delete_many({"email": {"$in": ["coimbatore_leader@admk.org", "salem_leader@admk.org"]}})
print("Cleaned up old hardcoded static leader accounts.")

for sa in super_admins:
    db["users"].update_one(
        {"email": sa["email"]},
        {"$set": sa},
        upsert=True
    )
    print(f"Verified Super Admin account: {sa['email']}")

print("Super Admin seeding completed successfully!")
