from dotenv import load_dotenv
load_dotenv()
import os
from pymongo import MongoClient

uri = os.getenv('MONGODB_URI')
client = MongoClient(uri)
db = client["feedback_ai_db"]

feedbacks = list(db["feedbacks"].find())
print(f"Total Feedbacks in DB: {len(feedbacks)}")
for idx, f in enumerate(feedbacks, 1):
    dist = f.get("district") or f.get("location", {}).get("district")
    const = f.get("constituency") or f.get("location", {}).get("constituency")
    title = f.get("feedback_title") or f.get("title") or f.get("ai", {}).get("summary")
    text = f.get("feedback_text") or f.get("text")
    category = f.get("type_of_feedback") or f.get("category") or f.get("ai", {}).get("category")
    status = f.get("status", "Pending")
    print(f"\n--- Feedback #{idx} ---")
    print(f"ID: {f.get('_id')}")
    print(f"District: {dist}")
    print(f"Constituency: {const}")
    print(f"Category: {category}")
    print(f"Title: {title}")
    print(f"Text: {text}")
    print(f"Status: {status}")
