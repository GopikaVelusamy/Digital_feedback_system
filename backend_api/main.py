# =============================================================
# main.py — InsightFlow FastAPI Backend
# Updated: 4-Layer Image Validation integrated into /api/feedback
# All original routes and logic preserved exactly.
# =============================================================

from fastapi import FastAPI, File, UploadFile, Form, HTTPException
import traceback
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from fastapi.staticfiles import StaticFiles
import shutil, os, smtplib
from dotenv import load_dotenv
load_dotenv()
from email.mime.text import MIMEText
from bson import ObjectId
from datetime import datetime

from backend.feedback_service import process_feedback

# ── 4-Layer Image Validation (NEW) ────────────────────────────
from backend.image_validator import validate_image

app = FastAPI()

@app.get("/")
def home():
    return {"status": "online", "message": "InsightFlow Backend is running"}

# ── Config (Loaded dynamically from environment variables) ─────
TWILIO_ACCOUNT_SID     = os.getenv('TWILIO_ACCOUNT_SID')
TWILIO_AUTH_TOKEN      = os.getenv('TWILIO_AUTH_TOKEN')
TWILIO_WHATSAPP_NUMBER = os.getenv('TWILIO_WHATSAPP_NUMBER', 'whatsapp:+14155238886')
EMAIL_SENDER           = os.getenv('EMAIL_SENDER')
EMAIL_PASSWORD         = os.getenv('EMAIL_PASSWORD')

try:
    from twilio.rest import Client
    twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    print("Twilio Client Initialized")
except Exception as e:
    twilio_client = None
    print(f"Twilio not available: {e}")

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Read MongoDB connection and Backend URL from environment variables
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/")
BACKEND_URL = os.getenv("BACKEND_URL", "http://127.0.0.1:8000")

client              = MongoClient(MONGODB_URI)
db                  = client["feedback_ai_db"]
users_collection    = db["users"]
feedback_collection = db["feedbacks"]
global_issues       = db["global_issues"]
press_releases_col  = db["press_releases"]
gallery_col         = db["gallery"]
legacy_col          = db["legacy"]

# ── Additional imports for news scraping ──────────────────────
import requests
from xml.etree import ElementTree as ET

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","http://127.0.0.1:3000","*"],
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)

def send_admin_email(receiver_email, admin_name, password):
    body = (f"Hello {admin_name},\n\nYou have been assigned as an Admin for InsightFlow.\n\n"
            f"Email: {receiver_email}\nPassword: {password}\n\nPlease login to the portal.")
    msg = MIMEText(body)
    msg['Subject'] = "InsightFlow | Admin Access Granted"
    msg['From'] = EMAIL_SENDER; msg['To'] = receiver_email
    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as s:
            s.login(EMAIL_SENDER, EMAIL_PASSWORD)
            s.sendmail(EMAIL_SENDER, receiver_email, msg.as_string())
        print(f"✅ Email sent to {receiver_email}")
    except Exception as e:
        print(f"❌ Email ERROR: {e}")

# ── Auth routes ───────────────────────────────────────────────
@app.post("/api/signup")
def signup(data: dict):
    try:
        if users_collection.find_one({"email": data.get("email")}):
            return {"message": "User already exists"}
        users_collection.insert_one({
            "name": data.get("name") or data.get("username"),
            "email": data.get("email"),
            "password": data.get("password"),
            "phone": data.get("phone"),
            "dob": data.get("dob"),
            "role": "user"
        })
        return {"message": "Signup success"}
    except Exception as e:
        print("ERROR in /api/signup:")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.post("/api/login")
def login(data: dict):
    try:
        user = users_collection.find_one({"email": data.get("email"), "password": data.get("password")})
        if user:
            return {
                "message": "Login success",
                "role": user.get("role", "user"),
                "name": user.get("name", ""),
                "district": user.get("district", ""),
                "constituency": user.get("constituency", "")
            }
        return {"message": "Invalid email or password"}
    except Exception as e:
        print("ERROR in /api/login:")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.post("/api/google-login")
def google_login(data: dict):
    email = data.get("email")
    name = data.get("name") or "Google User"
    role = data.get("role") or "user"
    
    # Check if user already exists
    user = users_collection.find_one({"email": email})
    if not user:
        return {"message": "Please signup first"}
        
    return {"message": "Login success", "role": user.get("role", "user"), "name": user.get("name", name)}

@app.post("/api/create-admin")
async def create_admin(data: dict):
    if users_collection.find_one({"email": data.get("email")}):
        return {"error": "Admin already exists"}
    data["role"] = "admin"
    users_collection.insert_one(data)
    send_admin_email(data.get("email"), data.get("name"), data.get("password"))
    return {"message": "Admin assigned successfully and Email sent"}

@app.get("/api/admins")
def get_admins():
    admins = list(users_collection.find({"role": "admin"}))
    for a in admins: a["_id"] = str(a["_id"])
    return admins

# ================================================================
# /api/feedback — SUBMIT FEEDBACK with 4-Layer Image Validation
# ================================================================
@app.post("/api/feedback")
async def submit_feedback(
    district:         str        = Form(...),
    constituency:     str        = Form(...),
    name:             str        = Form(None),
    age:              str        = Form(None),
    booth_no:         str        = Form(None),
    booth_ward_no:    str        = Form(None),
    local_body:       str        = Form(None),
    ward_village:     str        = Form(None),
    email:            str        = Form(None),
    type_of_feedback: str        = Form(...),
    feedback_title:   str        = Form(None),
    feedback_text:    str        = Form(...),
    rating:           str        = Form(None),
    importance:       str        = Form(None),
    need_response:    str        = Form(None),
    anonymous:        str        = Form(None),
    solution:         str        = Form(None),
    image:            UploadFile = File(None)
):
    image_path       = None
    image_bytes_data = None

    if image and image.filename:
        # Read bytes first (needed for validation)
        image_bytes_data = await image.read()
        await image.seek(0)

        safe_name     = image.filename.replace(" ", "_")
        file_location = f"{UPLOAD_DIR}/{safe_name}"
        with open(file_location, "wb") as buf:
            buf.write(image_bytes_data)
        image_path = file_location

    parsed_age = None
    if age:
        try:
            parsed_age = int(age)
        except Exception:
            parsed_age = None

    parsed_rating = 5
    if rating:
        try:
            parsed_rating = int(rating)
        except Exception:
            parsed_rating = 5

    # ── Base feedback document structure ──
    data = {
        "district": district, "constituency": constituency,
        "name": name, "age": parsed_age, "booth_no": booth_no, "booth_ward_no": booth_ward_no,
        "local_body": local_body, "ward_village": ward_village, "email": email,
        "type_of_feedback": type_of_feedback, "category": type_of_feedback,
        "feedback_title": feedback_title, "feedback_text": feedback_text,
        "rating": parsed_rating, "importance": importance, "need_response": need_response,
        "anonymous": anonymous, "solution": solution,
        "image": image_path, "status": "Pending", "created_at": datetime.now(),
        "ai": {
            "category": type_of_feedback,
            "priority": importance or "Medium",
            "summary": feedback_title or (feedback_text[:50] if feedback_text else "Grievance")
        }
    }

    # ── Save to MongoDB ───────────────────────────────────────────
    feedback_collection.insert_one(data)
    feedback_id_str = str(data["_id"])
    tracking_id = f"INF-{feedback_id_str[-6:].upper()}"
    data["feedback_id"] = feedback_id_str
    data["tracking_id"] = tracking_id
    feedback_collection.update_one({"_id": data["_id"]}, {"$set": {"tracking_id": tracking_id, "feedback_id": feedback_id_str}})

    # ── 4-Layer Image Validation ─────────────────────────────────
    image_validation = None
    if image_bytes_data:
        try:
            image_validation = validate_image(
                image_bytes              = image_bytes_data,
                claimed_district         = district,
                feedback_type            = type_of_feedback,
                feedback_collection      = feedback_collection,
                global_issues_collection = global_issues
            )
            data["image_validation"] = image_validation

            # Mark duplicates automatically
            if image_validation.get("action") == "link_to_existing":
                data["status"]       = "Duplicate"
                data["duplicate_of"] = (image_validation["layers"]["phash_dedup"]
                                        .get("matched_feedback_id"))

            print(f"🛡️  Validation: {image_validation['overall_flag']} "
                  f"(risk={image_validation['overall_risk']})")

        except Exception as ve:
            print(f"⚠️  Image validation error (non-blocking): {ve}")
            data["image_validation"] = {"overall_status": "error", "error": str(ve)}

    # ── Original AI pipeline (non-blocking) ───────────────────────
    ai_result = None
    try:
        ai_result = process_feedback(data)
    except Exception as ae:
        print(f"⚠️  AI Pipeline error (non-blocking): {ae}")
        ai_result = {"status": "skipped", "error": str(ae)}

    # ── Response ──────────────────────────────────────────────────
    response = {
        "message": "Feedback received",
        "feedback_id": feedback_id_str,
        "tracking_id": tracking_id,
        "ai_status": ai_result
    }
    if image_validation:
        ai_layer = image_validation["layers"].get("ela_authenticity", {})
        response["image_validation"] = {
            "status":     image_validation.get("overall_status"),
            "flag":       image_validation.get("overall_flag"),
            "risk_score": image_validation.get("overall_risk"),
            "action":     image_validation.get("action"),
            "layers": {
                "exif":     image_validation["layers"]["exif_geofence"]["status"],
                "semantic": image_validation["layers"]["semantic_alignment"]["status"],
                "phash":    image_validation["layers"]["phash_dedup"]["status"],
                "ela":      ai_layer.get("status", "inconclusive"),
            },
            "ai_detection": {
                "label":      ai_layer.get("label", "INCONCLUSIVE"),
                "ai_score":   ai_layer.get("ai_score", 0.0),
                "human_score":ai_layer.get("human_score", 1.0),
                "model":      ai_layer.get("model", "umm-maybe/AI-image-detector"),
            }
        }
    return response

# ── Feedbacks ────────────────────────────────────────────────
@app.get("/api/feedbacks")
def get_feedbacks():
    data = list(feedback_collection.find())
    for f in data:
        f["_id"] = str(f["_id"])
        if isinstance(f.get("created_at"), datetime):
            f["created_at"] = f["created_at"].isoformat()
    return data

@app.get("/api/feedback/track/{tracking_id}")
@app.get("/api/feedback/{feedback_id}")
async def get_single_feedback(feedback_id: str = None, tracking_id: str = None):
    target_id = (tracking_id or feedback_id or "").strip()
    if not target_id:
        raise HTTPException(status_code=400, detail="ID required")

    or_conditions = [
        {"tracking_id": target_id},
        {"tracking_id": target_id.upper()},
        {"feedback_id": target_id},
        {"_id": target_id}
    ]

    if len(target_id) == 24:
        try:
            or_conditions.append({"_id": ObjectId(target_id)})
        except Exception:
            pass

    f = feedback_collection.find_one({"$or": or_conditions})
    if not f:
        raise HTTPException(status_code=404, detail="No grievance record matches this Tracking ID")

    f["_id"] = str(f["_id"])
    if isinstance(f.get("created_at"), datetime):
        f["created_at"] = f["created_at"].isoformat()
    if f.get("image"):
        f["image_url"] = f"{BACKEND_URL}/{f['image']}"
    return f

# ── Validation report endpoint (new — for admin panel) ───────
@app.get("/api/feedback/{feedback_id}/validation")
async def get_validation_report(feedback_id: str):
    target_id = feedback_id.strip()
    or_conditions = [
        {"tracking_id": target_id},
        {"feedback_id": target_id},
        {"_id": target_id}
    ]
    if len(target_id) == 24:
        try:
            or_conditions.append({"_id": ObjectId(target_id)})
        except Exception:
            pass

    f = feedback_collection.find_one({"$or": or_conditions})
    if not f:
        raise HTTPException(status_code=404, detail="Not found")
    return {"feedback_id": str(f["_id"]), "tracking_id": f.get("tracking_id"), "validation": f.get("image_validation")}

# ── Dashboard ────────────────────────────────────────────────
@app.get("/api/dashboard")
def dashboard(district: str = None, constituency: str = None, dateRange: str = None):
    query = {}
    if district:
        query["$or"] = [{"district": district}, {"location.district": district}]
    if constituency:
        if "$or" in query:
            query["$and"] = [
                {"$or": query.pop("$or")},
                {"$or": [{"constituency": constituency}, {"location.constituency": constituency}]}
            ]
        else:
            query["$or"] = [{"constituency": constituency}, {"location.constituency": constituency}]
    if dateRange and " to " in dateRange:
        try:
            parts = dateRange.split(" to ")
            start = datetime.strptime(parts[0].strip(), "%Y-%m-%d")
            end   = datetime.strptime(parts[1].strip(), "%Y-%m-%d").replace(hour=23, minute=59, second=59)
            query["created_at"] = {"$gte": start, "$lte": end}
        except Exception as e: print(f"Date parse error: {e}")

    feedbacks_list = list(feedback_collection.find(query))
    pos = neu = neg = 0
    departments = {
        "roads & infrastructure": {"pos":0,"neu":0,"neg":0},
        "electricity & power":    {"pos":0,"neu":0,"neg":0},
        "water supply":           {"pos":0,"neu":0,"neg":0},
        "public security":        {"pos":0,"neu":0,"neg":0},
        "sanitation":             {"pos":0,"neu":0,"neg":0},
    }
    cat_map = {
        "water":"water supply","sanitation":"sanitation","road":"roads & infrastructure",
        "electricity":"electricity & power","safety":"public security",
        "transport":"roads & infrastructure","health":"public security",
        "education":"public security","services":"public security",
    }
    for f in feedbacks_list:
        rate = f.get("feedback",{}).get("rating") or f.get("rating") or 0
        try: rate = int(rate)
        except: rate = 0
        if rate >= 4:   s="pos"; pos+=1
        elif rate == 3: s="neu"; neu+=1
        else:           s="neg"; neg+=1
        raw = (f.get("ai",{}).get("category","") or f.get("type_of_feedback","") or
               f.get("feedback",{}).get("type","")).lower().strip()
        fc  = cat_map.get(raw)
        if fc and fc in departments: departments[fc][s] += 1
    return {"total_feedbacks": len(feedbacks_list),
            "sentiment": {"positive":pos,"neutral":neu,"negative":neg},
            "departments": departments}

@app.get("/api/dashboard-stats")
def dashboard_stats(district: str=None, constituency: str=None, date_range: str=None):
    return dashboard(district=district, constituency=constituency, dateRange=date_range)

@app.put("/api/update-status/{feedback_id}")
async def update_status(feedback_id: str, payload: dict):
    new_status = payload.get("status")
    result = feedback_collection.update_one(
        {"_id": ObjectId(feedback_id)}, {"$set": {"status": new_status}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Feedback not found")
    if new_status == "Solved" and twilio_client:
        upd = feedback_collection.find_one({"_id": ObjectId(feedback_id)})
        try:
            twilio_client.messages.create(
                from_=TWILIO_WHATSAPP_NUMBER,
                body=(f"✅ Corporate Feedback Alert: Your issue regarding "
                      f"{upd.get('type_of_feedback','Feedback')} has been RESOLVED. Thank you!"),
                to="whatsapp:+919384155076"
            )
        except Exception as e: print(f"❌ WhatsApp Error: {e}")
    return {"message": "Status updated successfully", "status": new_status}

@app.get("/api/issues")
def get_issues():
    issues = list(global_issues.find().sort("total_reports", -1).limit(10))
    for i in issues: i["_id"] = str(i["_id"])
    return issues


# ================================================================
# /api/news-inbox — Scrape Google News RSS for AIADMK / அதிமுக
# Returns live news articles from Google News for the Super Admin
# to curate and approve for the public website.
# ================================================================
@app.get("/api/news-inbox")
def get_news_inbox():
    """Scrape Google News RSS feed for AIADMK news articles."""
    QUERIES = [
        "AIADMK",
        "EPS Edappadi Palaniswami",
        "ADMK",
    ]
    articles = []
    seen_links = set()

    for query in QUERIES:
        try:
            rss_url = f"https://news.google.com/rss/search?q={requests.utils.quote(query)}&hl=en-IN&gl=IN&ceid=IN:en"
            response = requests.get(rss_url, timeout=8, headers={"User-Agent": "Mozilla/5.0"})
            if response.status_code != 200:
                continue

            root = ET.fromstring(response.content)
            channel = root.find("channel")
            if not channel:
                continue

            for item in channel.findall("item")[:8]:
                title = (item.findtext("title") or "").strip()
                link  = (item.findtext("link") or "").strip()
                pub   = (item.findtext("pubDate") or "").strip()
                desc  = (item.findtext("description") or "").strip()

                # Clean Google News redirect links
                if link and link not in seen_links:
                    seen_links.add(link)

                    # Try to parse pub date into readable format
                    date_str = ""
                    try:
                        from email.utils import parsedate_to_datetime
                        dt = parsedate_to_datetime(pub)
                        date_str = f"{dt.day} {dt.strftime('%B %Y')}"
                    except Exception:
                        date_str = pub[:16] if pub else ""

                    # Extract source from title if present (Google includes "- Source" at end)
                    source = "Google News"
                    if " - " in title:
                        parts = title.rsplit(" - ", 1)
                        title = parts[0].strip()
                        source = parts[1].strip()

                    # Determine language
                    lang = "ta" if any(ord(c) > 2944 for c in title) else "en"

                    articles.append({
                        "title": title,
                        "desc": desc[:300] if desc else "",
                        "source_link": link,
                        "source": source,
                        "date": date_str,
                        "lang": lang
                    })
        except Exception as e:
            print(f"⚠️  RSS fetch error for '{query}': {e}")
            continue

    # Remove duplicates by title similarity
    unique = []
    unique_titles = set()
    for art in articles:
        key = art["title"][:40].lower().strip()
        if key not in unique_titles:
            unique_titles.add(key)
            unique.append(art)

    return unique[:20]  # Return max 20 articles


# ================================================================
# /api/press-releases — Published Live News for Public Pulse Portal
# ================================================================
@app.get("/api/press-releases")
def get_press_releases():
    releases = list(press_releases_col.find().sort("_id", -1))
    for r in releases:
        r["_id"] = str(r["_id"])
    return releases

@app.post("/api/press-releases/approve")
async def approve_press_release(data: dict):
    """Save an approved/edited news article from the inbox to MongoDB (Public Pulse)."""
    if not data.get("title_en") and not data.get("title_ta"):
        raise HTTPException(status_code=400, detail="At least English or Tamil title required")
    data["created_at"] = datetime.now().isoformat()
    press_releases_col.insert_one(data)
    return {"message": "Press release published successfully"}

@app.delete("/api/press-releases/{release_id}")
def delete_press_release(release_id: str):
    result = press_releases_col.delete_one({"_id": ObjectId(release_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Press release not found")
    return {"message": "Press release deleted"}


# ================================================================
# /api/gallery — Media Gallery Photo Upload (Super Admin)
# ================================================================
@app.get("/api/gallery")
def get_gallery():
    photos = list(gallery_col.find().sort("_id", -1))
    for p in photos:
        p["_id"] = str(p["_id"])
    return photos

@app.post("/api/gallery")
async def upload_gallery_photo(
    title_en:    str        = Form(None),
    title_ta:    str        = Form(...),
    category_en: str        = Form("Campaigns"),
    category_ta: str        = Form("பிரச்சாரம்"),
    image:       UploadFile = File(...)
):
    """Upload a new campaign photo to the gallery."""
    if not image or not image.filename:
        raise HTTPException(status_code=400, detail="Image file required")

    safe_name = image.filename.replace(" ", "_")
    file_path = f"{UPLOAD_DIR}/{safe_name}"
    contents = await image.read()
    with open(file_path, "wb") as f:
        f.write(contents)

    doc = {
        "title_en": title_en or title_ta,
        "title_ta": title_ta,
        "category_en": category_en,
        "category_ta": category_ta,
        "image_url": f"/uploads/{safe_name}",
        "created_at": datetime.now().isoformat()
    }
    gallery_col.insert_one(doc)
    return {"message": "Photo uploaded successfully", "image_url": doc["image_url"]}

@app.delete("/api/gallery/{photo_id}")
def delete_gallery_photo(photo_id: str):
    photo = gallery_col.find_one({"_id": ObjectId(photo_id)})
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")

    # Remove file from disk
    img_url = photo.get("image_url", "")
    if img_url.startswith("/uploads/"):
        file_path = img_url.lstrip("/")
        if os.path.exists(file_path):
            os.remove(file_path)

    gallery_col.delete_one({"_id": ObjectId(photo_id)})
    return {"message": "Photo deleted successfully"}


# ================================================================
# /api/legacy — Historical Legacy Milestones (Super Admin)
# ================================================================
@app.get("/api/legacy")
def get_legacy():
    milestones = list(legacy_col.find().sort("year", 1))
    for m in milestones:
        m["_id"] = str(m["_id"])
    return milestones

@app.post("/api/legacy")
async def create_legacy_milestone(data: dict):
    """Publish a new historical milestone."""
    if not data.get("year") or not data.get("title_ta"):
        raise HTTPException(status_code=400, detail="Year and Tamil title are required")
    data["created_at"] = datetime.now().isoformat()
    legacy_col.insert_one(data)
    return {"message": "Milestone published successfully"}

@app.delete("/api/legacy/{milestone_id}")
def delete_legacy_milestone(milestone_id: str):
    result = legacy_col.delete_one({"_id": ObjectId(milestone_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Milestone not found")
    return {"message": "Milestone deleted"}
