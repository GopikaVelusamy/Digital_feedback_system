from dotenv import load_dotenv
load_dotenv()
import os
from pymongo import MongoClient

uri = os.getenv('MONGODB_URI')
client = MongoClient(uri)
db = client["feedback_ai_db"]

feedbacks = list(db["feedbacks"].find())
print(f"Updating categories for {len(feedbacks)} documents...")

for f in feedbacks:
    # Determine best category from existing fields
    cat = f.get("type_of_feedback") or f.get("category") or f.get("feedback", {}).get("type")
    
    # If category is Other or missing, infer from text or title
    text = (f.get("feedback_text") or f.get("text") or f.get("feedback_title") or f.get("title") or "").lower()
    if not cat or cat.lower() == "other":
        if "water" in text or "thanni" in text or "pipe" in text:
            cat = "Water Supply & Irrigation"
        elif "road" in text or "bus" in text or "transit" in text or "street" in text or "saalai" in text:
            cat = "Infrastructure & Roads"
        elif "current" in text or "power" in text or "electric" in text or "transformer" in text:
            cat = "Electricity & Power"
        elif "health" in text or "nurse" in text or "doctor" in text or "hospital" in text:
            cat = "Healthcare"
        elif "school" in text or "education" in text or "teacher" in text:
            cat = "Education"
        elif "cadre" in text or "public interaction" in text or "candidate" in text:
            cat = "Candidate Feedback"
        else:
            cat = "Local Issues"

    db["feedbacks"].update_one(
        {"_id": f["_id"]},
        {"$set": {
            "type_of_feedback": cat,
            "category": cat,
            "ai.category": cat
        }}
    )

print("SUCCESS: Existing MongoDB records updated with petitioner categories!")
