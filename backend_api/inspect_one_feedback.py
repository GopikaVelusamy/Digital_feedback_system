from dotenv import load_dotenv
load_dotenv()
import os
from pymongo import MongoClient
from bson import ObjectId

uri = os.getenv('MONGODB_URI')
client = MongoClient(uri)
db = client["feedback_ai_db"]

f = db["feedbacks"].find_one({"_id": ObjectId("6a76d46b5b089cd7df409452")})
print("Full Record 6a76d46b:")
for k, v in f.items():
    print(f"  {k}: {v}")
