import os, json
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()
uri = os.getenv('MONGODB_URI', "mongodb+srv://gopikavelusamy3_db_user:ikYyOIznBWlIdBXd@cluster0.o9rz4hv.mongodb.net/?appName=Cluster0")
client = MongoClient(uri)
db = client['feedback_ai_db']
feedbacks = list(db.feedbacks.find({}))

print(f"Total Feedbacks in DB: {len(feedbacks)}")

departments = [
    "Government Schemes & Governance Department",
    "Infrastructure & Public Works Department",
    "Health, Safety & Welfare Department",
    "Education & Youth Affairs Department",
    "Agriculture & Rural Development Department",
    "Party Affairs & Leadership Department"
]

def matchesDepartment(f, deptName):
    if not deptName: return True
    targetDept = deptName.lower().strip()
    catRaw = f.get('type_of_feedback') or f.get('category') or (f.get('ai', {}) or {}).get('category') or (f.get('feedback', {}) or {}).get('type') or 'General'
    cat = str(catRaw).lower().strip()
    
    if cat in targetDept or targetDept in cat: return True
    
    if 'infra' in targetDept or 'public works' in targetDept:
        return ('road' in cat or 'infra' in cat or 'water' in cat or 
                'electric' in cat or 'power' in cat or 'sanitat' in cat or 
                'local' in cat or 'complaint' in cat or 'general' in cat or
                'public' in cat or 'other' in cat)
    if 'health' in targetDept or 'safety' in targetDept or 'welfare' in targetDept:
        return ('health' in cat or 'safety' in cat or 'women' in cat or 
                'medical' in cat or 'security' in cat or 'hospital' in cat)
    if 'education' in targetDept or 'youth' in targetDept:
        return ('educat' in cat or 'youth' in cat or 'employ' in cat or 
                'school' in cat or 'college' in cat)
    if 'agricultur' in targetDept or 'rural' in targetDept:
        return ('agri' in cat or 'farm' in cat or 'rural' in cat)
    if 'scheme' in targetDept or 'govern' in targetDept:
        return ('scheme' in cat or 'govern' in cat or 'suggest' in cat)
    if 'party' in targetDept or 'leader' in targetDept:
        return ('party' in cat or 'leader' in cat or 'candidate' in cat or 'election' in cat)
    return True

print("\n--- PETITION MATCHING BY DEPARTMENT ---")
for dept in departments:
    matched = [f for f in feedbacks if matchesDepartment(f, dept)]
    print(f"\nDepartment: {dept}")
    print(f"Total Matched: {len(matched)}")
    for m in matched:
        dist = m.get('district') or 'Salem (Default)'
        const = m.get('constituency') or 'N/A'
        cat = m.get('type_of_feedback') or m.get('category') or (m.get('ai', {}) or {}).get('category') or 'General'
        print(f"  - [{dist} | {const}] Category: {cat}")

