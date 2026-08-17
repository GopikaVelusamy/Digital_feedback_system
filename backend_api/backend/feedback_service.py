from datetime import datetime, timezone
from uuid import uuid4
from pymongo import ReturnDocument

from backend.utils.security import hash_mobile, mask_mobile
from backend.db import feedbacks, batches, analysis_results, global_issues
from backend.ai_engine import analyze_feedback_batch

print("feedback_service.py loaded")

# --------------------------------------------------
# Batch Handling (Hidden)
# --------------------------------------------------
def get_or_create_batch(district, constituency, limit=1):  # SET TO 15
    batch = batches.find_one_and_update(
        {
            "district": district,
            "constituency": constituency,
            "status": "collecting"
        },
        {"$inc": {"count": 1}},
        return_document=ReturnDocument.AFTER
    )

    if not batch:
        batch = {
            "batch_id": str(uuid4()),
            "district": district,
            "constituency": constituency,
            "count": 1,
            "limit": limit,
            "status": "collecting",
            "created_at": datetime.now(timezone.utc)
        }
        batches.insert_one(batch)

    return batch


# --------------------------------------------------
# Main Entry Point
# --------------------------------------------------
def process_feedback(form_data):
    print("🔥 process_feedback called with:", form_data)

    # --------------------------------------------------
    # 🔐 MOBILE NUMBER SECURITY (SAFE FIX)
    # --------------------------------------------------
    mobile_no = form_data.get("booth_no")

    if mobile_no:
        mobile_hash = hash_mobile(mobile_no)
        mobile_masked = mask_mobile(mobile_no)
    else:
        mobile_hash = None
        mobile_masked = None

    # --------------------------------------------------
    # 1. Add to Batch
    # --------------------------------------------------
    batch = get_or_create_batch(
        form_data["district"],
        form_data["constituency"],
        limit=1   # change to 15 for production
    )

    # --------------------------------------------------
    # 2. Save Feedback
    # --------------------------------------------------
    chosen_category = form_data.get("type_of_feedback") or "General"
    result = feedbacks.insert_one({
        "location": {
            "district": form_data["district"],
            "constituency": form_data["constituency"],
            "booth_ward_no": form_data.get("booth_ward_no")
        },
        "user": {
            "name": form_data.get("name"),
            "age": form_data.get("age"),
            "mobile_hash": mobile_hash,
            "mobile_masked": mobile_masked,
            "email": form_data.get("email")
        },
        "feedback": {
            "type": chosen_category,
            "original_text": form_data["feedback_text"],
            "rating": form_data.get("rating"),
            "need_update": form_data.get("need_update", False)
        },
        "type_of_feedback": chosen_category,
        "category": chosen_category,
        "district": form_data["district"],
        "constituency": form_data["constituency"],
        "feedback_title": form_data.get("feedback_title"),
        "feedback_text": form_data.get("feedback_text"),
        "solution": form_data.get("solution"),
        "importance": form_data.get("importance", "Normal"),
        "image": form_data.get("image"),
        "status": "Pending",
        "batch_id": batch["batch_id"],
        "created_at": datetime.now(timezone.utc),
        "ai": {
            "category": chosen_category,
            "priority": form_data.get("importance", "Medium"),
            "summary": form_data.get("feedback_title") or (form_data.get("feedback_text", "")[:50] if form_data.get("feedback_text") else "Grievance")
        }
    })

    print("✅ RAW FEEDBACK STORED IN:", feedbacks.full_name)
    print("✅ INSERTED ID:", result.inserted_id)

    # --------------------------------------------------
    # 3. Check Limit (Run AI if full)
    # --------------------------------------------------
    if batch["count"] >= batch["limit"] and batch["status"] == "collecting":
        batches.update_one(
            {"batch_id": batch["batch_id"]},
            {"$set": {"status": "processing"}}
        )
        analyze_and_store_batch(batch["batch_id"])
        return {"message": "Batch Full - AI Analysis Started!"}

    remaining = batch["limit"] - batch["count"]
    return {"message": f"Feedback stored. Waiting for {remaining} more users."}


# --------------------------------------------------
# AI Processing
# --------------------------------------------------
def analyze_and_store_batch(batch_id):
    print(f"🚀 Analyzing Batch: {batch_id}")

    docs = list(feedbacks.find({"batch_id": batch_id}))
    texts = [d["feedback"]["original_text"] for d in docs]

    try:
        results = analyze_feedback_batch(texts)
    except Exception as e:
        print(f"❌ AI Failed: {e}")
        return

    # Update Feedback Docs
    for doc, res in zip(docs, results):
        feedbacks.update_one(
            {"_id": doc["_id"]},
            {"$set": {"ai": res}}
        )

    # Update Global Issues (Smart Merging)
    update_global_issues(docs, batch_id)

    # Mark Batch Complete
    batches.update_one(
        {"batch_id": batch_id},
        {"$set": {"status": "completed"}}
    )
    print(f"✅ Batch {batch_id} Completed.")


# --------------------------------------------------
# Global Issue Priority Logic
# --------------------------------------------------
def calculate_priority(count):
    if count >= 20:
        return "CRITICAL"
    elif count >= 10:
        return "HIGH"
    elif count >= 5:
        return "MEDIUM"
    return "LOW"


# --------------------------------------------------
# Global Issue Merging (Smart Logic)
# --------------------------------------------------
def update_global_issues(docs, batch_id):
    for fb in docs:
        if "ai" not in fb:
            continue

        category = fb["ai"].get("category", "Other")
        main_issue = fb["ai"].get("main_issue", "General Issue")

        issue_key = f"{category}_{main_issue}".replace(" ", "_").lower()

        user_info = {
            "name": fb["user"]["name"],
            "mobile": fb["user"]["mobile_masked"],
            "batch_id": batch_id,

            # ⭐ IMAGE INCLUDED IN GLOBAL ISSUE USERS
            "image": fb.get("image"),

            "text": fb["feedback"]["original_text"]
        }

        existing = global_issues.find_one({"issue_key": issue_key})

        if existing:
            new_total = existing["total_reports"] + 1
            global_issues.update_one(
                {"issue_key": issue_key},
                {
                    "$inc": {"total_reports": 1},
                    "$push": {"users": user_info},
                    "$addToSet": {"batches": batch_id},
                    "$set": {
                        "priority": calculate_priority(new_total),
                        "last_updated": datetime.now(timezone.utc)
                    }
                }
            )
        else:
            global_issues.insert_one({
                "issue_key": issue_key,
                "category": category,
                "issue_text": main_issue,
                "total_reports": 1,
                "priority": "LOW",
                "batches": [batch_id],
                "users": [user_info],
                "last_updated": datetime.now(timezone.utc)
            })