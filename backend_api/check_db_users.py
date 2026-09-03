import os
from pymongo import MongoClient

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb+srv://varunthanwar18:18181818@cluster0.o9nfg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

client = MongoClient(MONGODB_URI)
db = client["feedback_ai_db"]
users_collection = db["users"]

print("--- ALL USERS IN MONGODB ATLAS ---")
for u in users_collection.find():
    print(f"Email: {u.get('email')}, Role: {u.get('role')}, Dept: {u.get('assigned_department')}, Password: {u.get('password')}")
