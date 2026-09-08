import os
import re
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGODB_URI", "mongodb+srv://gopikavelusamy3_db_user:ikYyOIznBWlIdBXd@cluster0.o9rz4hv.mongodb.net/?appName=Cluster0")
client = MongoClient(MONGO_URI)
db = client["feedback_ai_db"]
press_col = db["press_releases"]

def clean_text(text):
    if not text:
        return ""
    # Strip HTML tags complete or unclosed
    clean = re.sub(r'<[^>]*>?', '', text)
    clean = re.sub(r'href=["\']?https?://[^\s"\'>]+', '', clean)
    clean = re.sub(r'https?://[^\s"\'>]+', '', clean)
    clean = clean.replace('&nbsp;', ' ').replace('&amp;', '&').replace('&quot;', '"').replace('&#39;', "'").strip()
    return clean

docs = list(press_col.find())
print(f"Found {len(docs)} press release documents in MongoDB Atlas.")

updated_count = 0
for d in docs:
    title_en = clean_text(d.get("title_en") or d.get("title") or "")
    title_ta = clean_text(d.get("title_ta") or "")
    desc_en = clean_text(d.get("desc_en") or d.get("desc") or "")
    desc_ta = clean_text(d.get("desc_ta") or "")

    # If desc_en was just an HTML link snippet or contains google.com link
    if not desc_en or len(desc_en) < 5 or "google.com" in desc_en:
        desc_en = title_en or "Official AIADMK leadership release and news announcement."
    if not desc_ta or len(desc_ta) < 5 or "google.com" in desc_ta:
        desc_ta = title_ta or desc_en or "கழகத் தலைமைகளின் அதிகாரப்பூர்வ அறிவிப்புகள் மற்றும் செய்திகள்."

    if not title_ta:
        title_ta = title_en

    press_col.update_one(
        {"_id": d["_id"]},
        {"$set": {
            "title_en": title_en,
            "title_ta": title_ta,
            "desc_en": desc_en,
            "desc_ta": desc_ta
        }}
    )
    updated_count += 1
    print(f"Updated document {d['_id']}: {title_en[:40]}...")

print(f"Successfully cleaned {updated_count} press release documents in MongoDB!")
