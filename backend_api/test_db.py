from dotenv import load_dotenv
load_dotenv()
import os
from pymongo import MongoClient

uri = os.getenv('MONGODB_URI')
print(f"Connecting to: {uri[:40]}...")
try:
    c = MongoClient(uri, serverSelectionTimeoutMS=8000)
    c.admin.command('ping')
    print("MongoDB Atlas CONNECTED successfully!")
    db = c["feedback_ai_db"]
    print(f"Collections: {db.list_collection_names()}")
    users = db["users"].count_documents({})
    print(f"Users in DB: {users}")
except Exception as e:
    print(f"Connection FAILED: {e}")
