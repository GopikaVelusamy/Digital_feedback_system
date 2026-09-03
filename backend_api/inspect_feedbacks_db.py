import os
from pymongo import MongoClient

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb+srv://varunthanwar18:18181818@cluster0.o9nfg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

client = MongoClient(MONGODB_URI)
db = client["feedback_ai_db"]
feedback_col = db["feedbacks"]

print("--- ALL FEEDBACKS IN MONGODB ATLAS ---")
count = 0
for f in feedback_col.find():
    count += 1
    cat = f.get("type_of_feedback") or f.get("category") or (f.get("ai") or {}).get("category") or (f.get("feedback") or {}).get("type") or "General"
    dist = (f.get("location") or {}).get("district") or f.get("district") or "TN"
    consti = (f.get("location") or {}).get("constituency") or f.get("constituency") or ""
    print(f"ID: {f.get('_id')}, Dist: {dist}, Consti: {consti}, Category: '{cat}'")

print(f"\nTotal feedbacks: {count}")
