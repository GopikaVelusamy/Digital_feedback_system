import re

target_file = r"c:\Users\kavit\Downloads\CorporateFeedback\insightflow-react\frontend\src\pages\FeedbackPage.jsx"

with open(target_file, "r", encoding="utf-8") as f:
content = f.read()

# We need to find the start of: {activeView === 'legacy' && (
# and replace everything up to the next {activeView === 'gallery' && (
# Let's inspect the matches

start_marker = "activeView === 'legacy' && ("
end_marker = "activeView === 'gallery' && ("

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx == -1 or end_idx == -1:
print("Error: Could not locate markers in FeedbackPage.jsx")
print(f"start_idx: {start_idx}, end_idx: {end_idx}")
exit(1)

# Let's align start_idx and end_idx to correctly match the outermost brace boundaries
# The old block starts at: {activeView === 'legacy' && (
# and ends right before: {/* ─── VIEW 4: GALLERY GRID ─── */}
# or activeView === 'gallery'

# Let's search backwards or forwards to find the correct enclosing curly braces
# Let's read lines 2120 to 2380 in the python string to find the exact indices
lines = content.split('\n')
start_line = -1
end_line = -1
for i, line in enumerate(lines):
if "activeView === 'legacy' && (" in line:
start_line = i
if "/* ─── VIEW 4: GALLERY GRID ─── */" in line:
end_line = i
break

if start_line == -1 or end_line == -1:
print(f"Error: line markers not found. start_line={start_line}, end_line={end_line}")
exit(1)

print(f"Target lines range: {start_line+1} to {end_line+1}")

# Let's construct the replacement block
replacement_code = """          {activeView === 'legacy' && (
<div className="relative w-full min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-600 selection:text-white">
{/* Sticky Sidebar Nav for Desktop */}
<div className="hidden lg:flex flex-col fixed right-8 top-1/2 -translate-y-1/2 z-50 bg-slate-900/60 backdrop-blur-md border border-white/5 py-4 px-3 rounded-full gap-3 shadow-2xl">
useEffect(() => {
const handleLangChange = () => {
setLanguageState(getLanguage());
};
window.addEventListener("languageChange", handleLangChange);
return () => window.removeEventListener("languageChange", handleLangChange);
}, []);

// Form state
const [rating, setRating] = useState(0);
const [hoverRating, setHoverRating] = useState(0);
const [phone, setPhone] = useState('');
const [district, setDistrict] = useState('');
const [constituency, setConstituency] = useState('');
const [constituencies, setConstituencies] = useState([]);
const [boothWardNo, setBoothWardNo] = useState('');
const [category, setCategory] = useState('');
const [feedbackText, setFeedbackText] = useState('');
const [whatsappNotify, setWhatsappNotify] = useState('');
const [imageFile, setImageFile] = useState(null);
const [imagePreview, setImagePreview] = useState(null);

// Multi-step states
const [formStep, setFormStep] = useState(1); // 1 = Form, 2 = Solution expectations, 3 = Thank you
const [solution, setSolution] = useState('');

// Status modal state — mirrors original showStatus/closeStatus
const [modalVisible, setModalVisible] = useState(false);
const [modalType, setModalType] = useState('success'); // 'success' | 'error'
const [modalTitle, setModalTitle] = useState('');
const [modalDesc, setModalDesc] = useState('');
const [modalAnimOut, setModalAnimOut] = useState(false);

// ─── showStatus — exact mirror from feedback.html ───────────
function showStatus(type, title, desc) {
setModalType(type);
setModalTitle(title);
setModalDesc(desc);
setModalAnimOut(false);
setModalVisible(true);
}

// ─── closeStatus — exact mirror from feedback.html ──────────
function closeStatus() {
setModalAnimOut(true);
setTimeout(() => setModalVisible(false), 450);
}

// ─── Top Navbar Action Helpers ──────────────────────────────
const handleProfileClick = () => {
const word0 = getWordText(0);
const word1 = getWordText(1);
const word2 = getWordText(2);
const word3 = getWordText(3);

return (
<div className="flex flex-col gap-1 sm:gap-2 select-none mb-3">
{/* Line 1 (Top): நம்மில் ஒருவர் — Same Vivid Red for both words */}
<div className="flex items-center gap-3 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight drop-shadow-[0_4px_14px_rgba(0,0,0,0.9)]" style={{ fontFamily: "'Noto Sans Tamil', 'Manrope', sans-serif" }}>
<span className={`text-[#ff3b30] drop-shadow-[0_0_18px_rgba(255,59,48,0.85)] transition-all duration-300 ${(isFlashing || isFinished) ? 'animate-pulse text-[#ff5252] drop-shadow-[0_0_25px_rgba(255,59,48,1)]' : ''}`}>
{word0}
{activeWordIdx === 0 && !isFlashing && !isFinished && (
<span className="w-1.5 h-8 sm:h-10 md:h-12 bg-amber-400 inline-block animate-pulse ml-1 rounded-full shadow-[0_0_12px_#fbbf24]"></span>
)}
</span>
<span className={`text-[#ff3b30] drop-shadow-[0_0_18px_rgba(255,59,48,0.85)] transition-all duration-300 ${(isFlashing || isFinished) ? 'animate-pulse text-[#ff5252] drop-shadow-[0_0_25px_rgba(255,59,48,1)]' : ''}`}>
{word1}
{activeWordIdx === 1 && !isFlashing && !isFinished && (
<span className="w-1.5 h-8 sm:h-10 md:h-12 bg-amber-400 inline-block animate-pulse ml-1 rounded-full shadow-[0_0_12px_#fbbf24]"></span>
)}
</span>
</div>

{/* Line 2 (Bottom): நமக்கான தலைவர் */}
<div className="flex items-center gap-3 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight drop-shadow-[0_4px_14px_rgba(0,0,0,0.9)]" style={{ fontFamily: "'Noto Sans Tamil', 'Manrope', sans-serif" }}>
<span className={`text-[#10b981] drop-shadow-[0_0_18px_rgba(16,185,129,0.7)] transition-all duration-300 ${(isFlashing || isFinished) ? 'animate-pulse text-emerald-300 drop-shadow-[0_0_25px_rgba(16,185,129,1)]' : ''}`}>
{word2}
{activeWordIdx === 2 && !isFlashing && !isFinished && (
<span className="w-1.5 h-8 sm:h-10 md:h-12 bg-amber-400 inline-block animate-pulse ml-1 rounded-full shadow-[0_0_12px_#fbbf24]"></span>
)}
</span>
<span className={`text-[#34d399] drop-shadow-[0_0_18px_rgba(52,211,153,0.7)] transition-all duration-300 ${(isFlashing || isFinished) ? 'animate-pulse text-amber-300 drop-shadow-[0_0_25px_rgba(245,158,11,1)]' : ''}`}>
{word3}
{activeWordIdx === 3 && !isFlashing && !isFinished && (
<span className="w-1.5 h-8 sm:h-10 md:h-12 bg-amber-400 inline-block animate-pulse ml-1 rounded-full shadow-[0_0_12px_#fbbf24]"></span>
)}
</span>
</div>
</div>
);
}


// ─── 33 SCHEMES & ACHIEVEMENTS DATABASE (PDF SPECIFIED) ───
const SCHEMES_DATABASE = [
{
id: 1,
name_en: "Nutritious Meal Programme",
name_ta: "சத்துணவு திட்டம்",
year: 1982,
era_en: "MGR",
era_ta: "எம்.ஜி.ஆர்",
category_en: "Welfare",
category_ta: "சுகாதாரம் & நலத்திட்டங்கள்",
people_en: "Students",
people_ta: "மாணவர்கள்",
type_en: "Scheme",
type_ta: "திட்டம்",
served_en: "School Children",
served_ta: "பள்ளி மாணவர்கள்",
did_en: "Connected child nutrition with school participation and resolved student malnutrition.",
did_ta: "குழந்தைகளின் சத்துணவை பள்ளி வருகையுடன் இணைத்து பசிப்பிணியை போக்கியது.",
impact_en: "Over 50 Lakh students supported daily across Tamil Nadu",
impact_ta: "மாநிலம் முழுவதும் தினசரி 50 லட்சத்திற்கும் அதிகமான மாணவர்கள் பயன்பெற்றனர்",
source: "TN Social Welfare Records"
},
{
id: 2,
name_en: "Free Bicycles",
name_ta: "விலையில்லா மிதிவண்டிகள்",
year: 2001,
era_en: "Amma",
era_ta: "அம்மா",
category_en: "Education",
category_ta: "கல்வி",
people_en: "Students",
people_ta: "மாணவர்கள்",
type_en: "Scheme",
type_ta: "திட்டம்",
served_en: "High School Students",
served_ta: "உயர்நிலைப் பள்ளி மாணவர்கள்",
did_en: "Supported eligible students with mobility for their journey to education.",
did_ta: "பள்ளிக்குச் செல்லும் மாணவர்களின் போக்குவரத்தை எளிதாக்க மிதிவண்டிகள் வழங்கப்பட்டன.",
impact_en: "60 Lakh+ students supported to prevent school dropouts",
impact_ta: "பள்ளி இடைநிற்றலைத் தடுக்க 60 லட்சத்திற்கும் அதிகமான மாணவர்கள் பயனடைந்தனர்",
source: "Education Dept Records"
},
{
id: 3,
name_en: "Student Essentials Assistance",
name_ta: "மாணவர் கல்வி உபகரணங்கள்",
year: 2011,
era_en: "Amma",
era_ta: "அம்மா",
category_en: "Education",
category_ta: "கல்வி",
people_en: "Students",
people_ta: "மாணவர்கள்",
type_en: "Scheme",
type_ta: "திட்டம்",

const [submissionResult, setSubmissionResult] = useState(null); // { feedback_id, tracking_id }

// ─── TRACKING FORM STATES ───
const [trackId, setTrackId] = useState('');
const [trackResult, setTrackResult] = useState(null);
const [trackLoading, setTrackLoading] = useState(false);

// ─── LEADER/CONSTITUENCY STATISTICS ───
const [leaderDistrict, setLeaderDistrict] = useState(localStorage.getItem('user_district') || '');
const [leaderConstituency, setLeaderConstituency] = useState(localStorage.getItem('user_constituency') || '');
const [constituencyFeedbacks, setConstituencyFeedbacks] = useState([]);
const [allFeedbacks, setAllFeedbacks] = useState([]);
const [leaderLoading, setLeaderLoading] = useState(false);

// ─── DYNAMIC ADMK NEWS / PRESS RELEASES STATES ───
const [pressReleases, setPressReleases] = useState([]);
const [pressReleasesLoading, setPressReleasesLoading] = useState(false);
const [newsInbox, setNewsInbox] = useState([]);
const [newsInboxLoading, setNewsInboxLoading] = useState(false);
const [newsError, setNewsError] = useState(null);

// Edit & Approve modal state
const [showApproveModal, setShowApproveModal] = useState(false);
const [selectedInboxNews, setSelectedInboxNews] = useState(null);
const [editTitleEn, setEditTitleEn] = useState('');
const [editTitleTa, setEditTitleTa] = useState('');
const [editDescEn, setEditDescEn] = useState('');
const [editDescTa, setEditDescTa] = useState('');
const [editTagEn, setEditTagEn] = useState('Press Release');
const [editTagTa, setEditTagTa] = useState('செய்தி வெளியீடு');
const [editIcon, setEditIcon] = useState('📰');
const [editLink, setEditLink] = useState('');
const [dashboardSubTab, setDashboardSubTab] = useState('grievances');

// ─── DYNAMIC GALLERY STATES ───
const [galleryPhotos, setGalleryPhotos] = useState([]);
const [galleryLoading, setGalleryLoading] = useState(false);
const [galleryFilter, setGalleryFilter] = useState('All');
const [activeLightboxImage, setActiveLightboxImage] = useState(null);

// Admin upload gallery state
const [uploadTitleEn, setUploadTitleEn] = useState('');
const [uploadTitleTa, setUploadTitleTa] = useState('');
const [uploadCategoryEn, setUploadCategoryEn] = useState('Campaigns');
const [uploadCategoryTa, setUploadCategoryTa] = useState('பிரச்சாரம்');
const [uploadImageFile, setUploadImageFile] = useState(null);
const [uploadLoading, setUploadLoading] = useState(false);

const fetchGallery = async () => {
try {
setGalleryLoading(true);
const res = await fetch(API + '/api/gallery');
if (res.ok) {
const data = await res.json();
setGalleryPhotos(data);
}
} catch (err) {
console.error("Error fetching gallery:", err);
} finally {
setGalleryLoading(false);
}
};

const handleUploadGallery = async (e) => {
e.preventDefault();
if (!uploadImageFile) {
Swal.fire('Error', 'Please select an image file', 'error');
return;
}
try {
setUploadLoading(true);
const formData = new FormData();
formData.append('title_en', uploadTitleEn);
formData.append('title_ta', uploadTitleTa);
formData.append('category_en', uploadCategoryEn);
formData.append('category_ta', uploadCategoryTa);
formData.append('image', uploadImageFile);

const res = await fetch(API + '/api/gallery', {
text: language === 'English' ? 'Photo uploaded successfully.' : 'படம் வெற்றிகரமாக பதிவேற்றப்பட்டது.',
icon: 'success',
timer: 1500,
showConfirmButton: false
});
setUploadTitleEn('');
setUploadTitleTa('');
setUploadImageFile(null);
const fileInput = document.getElementById('gallery-file-input');
if (fileInput) fileInput.value = '';
fetchGallery();
} else {
Swal.fire('Error', 'Failed to upload photo', 'error');
}
} catch (err) {
console.error(err);
Swal.fire('Error', 'Network error uploading photo', 'error');
} finally {
setUploadLoading(false);
}
};

const handleDeleteGallery = async (id) => {
const confirm = await Swal.fire({
title: language === 'English' ? 'Are you sure?' : 'நிச்சயமாகவா?',
text: language === 'English' ? 'This photo will be permanently deleted.' : 'இந்தப் படம் நிரந்தரமாக நீக்கப்படும்.',
icon: 'warning',
showCancelButton: true,
confirmButtonColor: '#d33',
cancelButtonColor: '#3085d6',
confirmButtonText: language === 'English' ? 'Yes, delete!' : 'ஆம், நீக்கு!'
});

if (confirm.isConfirmed) {
try {
const res = await fetch(API + `/api/gallery/${id}`, {
method: 'DELETE'
});
if (res.ok) {
Swal.fire({
title: language === 'English' ? 'Deleted!' : 'நீக்கப்பட்டது!',
text: language === 'English' ? 'Photo deleted successfully.' : 'படம் வெற்றிகரமாக நீக்கப்பட்டது.',
icon: 'success',
timer: 1200,
showConfirmButton: false
});
fetchGallery();
} else {
Swal.fire('Error', 'Failed to delete photo', 'error');
}
} catch (err) {
console.error(err);
Swal.fire('Error', 'Network error deleting photo', 'error');
}
}
};

// ─── DYNAMIC LEGACY STATES ───
const [legacyMilestones, setLegacyMilestones] = useState([]);
}
} catch (err) {
console.error(err);
Swal.fire('Error', 'Network error deleting photo', 'error');
}
}
};

// ─── DYNAMIC LEGACY STATES ───
const [legacyMilestones, setLegacyMilestones] = useState([]);
const [legacyLoading, setLegacyLoading] = useState(false);
const [legacyFilter, setLegacyFilter] = useState('All');
const [activeIndex, setActiveIndex] = useState(0);

// Admin upload milestone state
const [uploadMilestoneYear, setUploadMilestoneYear] = useState('');
const [uploadMilestoneTitleEn, setUploadMilestoneTitleEn] = useState('');
const [uploadMilestoneTitleTa, setUploadMilestoneTitleTa] = useState('');
const [uploadMilestoneDescEn, setUploadMilestoneDescEn] = useState('');
const [uploadMilestoneDescTa, setUploadMilestoneDescTa] = useState('');
const [uploadMilestoneCategoryEn, setUploadMilestoneCategoryEn] = useState('Infrastructure & Elections');
const [uploadMilestoneCategoryTa, setUploadMilestoneCategoryTa] = useState('சட்டமன்றம் & தேர்தல்');
const [uploadMilestoneLoading, setUploadMilestoneLoading] = useState(false);

const fetchLegacy = async () => {
try {
setLegacyLoading(true);
const res = await fetch(API + '/api/legacy');
if (res.ok) {
const data = await res.json();
const sorted = data.sort((a, b) => a.year - b.year);
</head>
<body>
<div class="container">
<div class="google-title-bar">
<svg class="google-logo" viewBox="0 0 24 24">
<path fill="#4285F4" d="M21.35,11.1H12V13.8H18.7C18.4,15.6 15.2,19.3 12,19.3C8.4,19.3 5,16.3 5,12C5,7.9 8.2,4.7 12,4.7C15.3,4.7 17.1,6.7 17.1,6.7L19,4.7C19,4.7 16.6,2 12.1,2C6.4,2 2,6.8 2,12C2,17.2 6.4,22 12.1,22C17.6,22 21.5,18.3 21.5,12.9C21.5,11.8 21.3,11.1 21.3,11.1Z"/>
</svg>
<span>\${language === 'English' ? 'Sign in - Google Accounts' : 'உள்நுழைக - கூகுள் கணக்குகள்'}</span>
</div>

<div class="header">
<h1>\${language === 'English' ? 'Choose an account' : 'கணக்கைத் தேர்ந்தெடுக்கவும்'}</h1>
<p class="subtitle">\${language === 'English' ? 'to continue to' : 'தொடர'} <span class="subtitle-app">ADMK Grievance Portal</span></p>
</div>

<div class="account-list">
<button class="account-item" onclick="selectAcc('gopikavelusamy3@gmail.com', 'Gopika Velusamy', 'user')">
<div class="avatar" style="background-color: #ab47bc;">G</div>
<div>
<div class="name">Gopika Velusamy</div>
<div class="email">gopikavelusamy3@gmail.com</div>
</div>
</button>

<button class="account-item" onclick="selectAcc('kavithagopika14@gmail.com', 'Kavitha B', 'admin')">
<div class="avatar" style="background-color: #0f9d58;">K</div>
<div>
<div class="name">Kavitha B</div>
<div class="email">kavithagopika14@gmail.com</div>
</div>
</button>

<button class="account-item" onclick="selectAcc('gopikav255@gmail.com', 'V Gopika', 'user')">
<div class="avatar" style="background-color: #4285f4;">V</div>
<div>
<div class="name">V Gopika</div>
<div class="email">gopikav255@gmail.com</div>
</div>
</button>

<button class="account-item" onclick="selectAcc('amritavelusamy@gmail.com', 'Amrita', 'user')">
<div class="avatar" style="background-color: #e67c73;">A</div>
<div>
<div class="name">Amrita</div>
<div class="email">amritavelusamy@gmail.com</div>
</div>
</button>

<button class="account-item" onclick="showCustomInput()">
<div class="avatar another-avatar">
<span class="material-symbols-outlined" style="font-size: 18px; vertical-align: middle;">person_add</span>
</div>
<div>
<div class="name another-account">\${language === 'English' ? 'Use another account' : 'வேறு கணக்கைப் பயன்படுத்தவும்'}</div>
</div>
</button>
</div>

<p class="footer">
\${language === 'English' 
? 'To continue, Google will share your name, email address, profile picture, and language preference with ADMK Feedback. Before using this app, you can review its privacy policy and terms of service.' 
: 'தொடர, கூகுள் உங்கள் பெயர், மின்னஞ்சல் முகவரி, சுயவிவரப் படம் மற்றும் மொழி விருப்பங்களை ADMK Feedback உடன் பகிரும். இந்த செயலியைப் பயன்படுத்துவதற்கு முன், அதன் தனியுரிமைக் கொள்கை மற்றும் சேவை விதிமுறைகளை நீங்கள் மதிப்பாய்வு செய்யலாம்.'}
</p>
</div>

<div id="overlay" class="input-overlay">
<div class="input-card">
<h3>\${language === 'English' ? 'Enter Google email' : 'மின்னஞ்சலை உள்ளிடவும்'}</h3>
<input type="email" id="custom-email" placeholder="name@gmail.com">
fetchPressReleases();
} else {
Swal.fire('Error', 'Failed to delete press release', 'error');
}
} catch (err) {
console.error(err);
Swal.fire('Error', 'Network error deleting press release', 'error');
}
}
};
};

const fetchPressReleases = async () => {
try {
setPressReleasesLoading(true);
const res = await fetch(API + '/api/press-releases');
if (res.ok) {
const data = await res.json();
setPressReleases(data);
}
} catch (err) {
console.error("Error fetching press releases:", err);
} finally {
setPressReleasesLoading(false);
}
};

const fetchNewsInbox = async () => {
try {
setNewsInboxLoading(true);
setNewsError(null);
const res = await fetch(API + '/api/news-inbox');
if (res.ok) {
const data = await res.json();
setNewsInbox(data);
} else {
setNewsError("Failed to fetch live RSS news. Please try again.");
}
} catch (err) {
console.error("Error fetching news inbox:", err);
setNewsError("Network error fetching live RSS news.");
} finally {
setNewsInboxLoading(false);
}
};

const handleApproveNews = async (e) => {
e.preventDefault();
try {
const payload = {
title_en: editTitleEn,
title_ta: editTitleTa,
desc_en: editDescEn,
desc_ta: editDescTa,
tag_en: editTagEn,
tag_ta: editTagTa,
icon: editIcon,
source_link: editLink,
date: selectedInboxNews ? selectedInboxNews.date : new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
};

const res = await fetch(API + '/api/press-releases/approve', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(payload)
});

if (res.ok) {
Swal.fire({
title: language === 'English' ? 'Published!' : 'வெளியிடப்பட்டது!',
text: language === 'English' ? 'Press release successfully posted live.' : 'செய்தி வெளியீடு தளம் பதிவேற்றப்பட்டது.',
icon: 'success',
timer: 1500,
showConfirmButton: false
});

// Remove from list
if (selectedInboxNews) {
setNewsInbox(prev => prev.filter(item => item.source_link !== selectedInboxNews.source_link));
}

setShowApproveModal(false);
fetchPressReleases();
} else {
Swal.fire('Error', 'Failed to approve press release', 'error');
}
} catch (err) {
console.error(err);
Swal.fire('Error', 'Network error approving press release', 'error');
}
};

const handleDeletePressRelease = async (id) => {
const confirm = await Swal.fire({
title: language === 'English' ? 'Are you sure?' : 'நிச்சயமாகவா?',
text: language === 'English' ? 'This press release will be permanently deleted.' : 'இந்த செய்தி வெளியீடு நிரந்தரமாக நீக்கப்படும்.',
icon: 'warning',
showCancelButton: true,
confirmButtonColor: '#d33',
cancelButtonColor: '#3085d6',
confirmButtonText: language === 'English' ? 'Yes, delete!' : 'ஆம், நீக்கு!'
});

if (confirm.isConfirmed) {
try {
const res = await fetch(API + `/api/press-releases/${id}`, {
method: 'DELETE'
});
if (res.ok) {
Swal.fire({
title: language === 'English' ? 'Deleted!' : 'நீக்கப்பட்டது!',
text: language === 'English' ? 'Press release deleted successfully.' : 'செய்தி வெளியீடு நீக்கப்பட்டது.',
icon: 'success',
timer: 1200,
showConfirmButton: false
});
fetchPressReleases();
} else {
Swal.fire('Error', 'Failed to delete press release', 'error');
}
} catch (err) {
console.error(err);
Swal.fire('Error', 'Network error deleting press release', 'error');
}
}
};

useEffect(() => {
if (activeView === 'pulse') {
fetchPressReleases();
fetchPressReleases();
} else {
Swal.fire('Error', 'Failed to delete press release', 'error');
}
} catch (err) {
console.error(err);
Swal.fire('Error', 'Network error deleting press release', 'error');
}
}
};

useEffect(() => {
if (activeView === 'pulse') {
fetchPressReleases();
}
if (activeView === 'gallery') {
fetchGallery();
}
if (activeView === 'legacy') {
fetchLegacy();
}
if (activeView === 'constituency' && userRole === 'admin') {
fetchNewsInbox();
fetchPressReleases();
fetchGallery();
fetchLegacy();
}
}, [activeView, userRole]);

useEffect(() => {
const handleLangChange = () => {
setLanguageState(getLanguage());
};
window.addEventListener("languageChange", handleLangChange);

// If redirected from routing history with login state, open the modal

try {
const res = await fetch(API + '/api/google-login', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ email, name, role }),
});
const data = await res.json();

if (data.message === 'Login success') {
localStorage.setItem('user', email);
localStorage.setItem('role', data.role);
setCurrentUser(email);
setUserRole(data.role);

notify(
language === 'English' ? 'Access Granted' : 'அணுகல் அனுமதிக்கப்பட்டது',
language === 'English' ? 'Logged in successfully.' : 'வெற்றிகரமாக உள்நுழைந்தீர்கள்.',
'success'
);

setTimeout(() => {
setShowAuthModal(false);
if (redirectAfterAuth) {
setActiveView(redirectAfterAuth);
setRedirectAfterAuth(null);
} else if (data.role === 'admin') {
setActiveView('constituency');
} else {
setActiveView('home');
}
}, 1500);
} else {
notify(
language === 'English' ? 'Registration Required' : 'பதிவு தேவை',
language === 'English' ? 'Account not registered. Please signup first.' : 'கணக்கு பதிவு செய்யப்படவில்லை. முதலில் பதிவு செய்யவும்.',
'warning'
);
}
} catch (error) {
console.error('Google Auth Error:', error);
notify('Server Error', 'Google session validation failed.', 'error');
}
};

return () => {
window.removeEventListener("languageChange", handleLangChange);
window.onGoogleSelect = null;
};
}, [language, navigate, location, redirectAfterAuth]);

// ─── LOGIN LOGIC ──────────────────────────────────────────
async function login(e) {
e.preventDefault();
if (!loginEmail || !loginPassword) {
notify('Missing Fields', 'Please fill in all details.', 'warning');
return;
}
try {
const res = await fetch(API + '/api/login', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
try {
const res = await fetch(API + '/api/login', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ email: loginEmail, password: loginPassword }),
});
const data = await res.json();
if (data.message === 'Login success') {
localStorage.setItem('user', loginEmail);
localStorage.setItem('role', data.role);
setCurrentUser(loginEmail);
setUserRole(data.role);

setActiveView(redirectAfterAuth);
setRedirectAfterAuth(null);
} else if (data.role === 'admin') {
setActiveView('constituency');
} else {
setActiveView('home');
}
}, 1500);
} else {
notify('Login Failed', data.message, 'error');
}
} catch (error) {
console.error('Login Error:', error);
notify('Server Error', 'Connection failed. Check backend.', 'error');
}
}

// ─── SIGNUP LOGIC ─────────────────────────────────────────
async function signup(e) {
e.preventDefault();
if (!signupName || !signupEmail || !signupPassword) {
notify('Input Error', 'All fields are mandatory.', 'warning');
return;
}
try {
const res = await fetch(API + '/api/signup', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ name: signupName, email: signupEmail, password: signupPassword }),
});
const data = await res.json();
if (data.message === 'Signup success') {
notify('Account Created', 'Welcome! Redirecting to login...', 'success');
setTimeout(() => setActiveTab('login'), 2200);
} else {
notify('Signup Failed', data.message, 'error');
}
} catch (error) {
console.error('Signup Error:', error);
notify('Server Error', 'Registration failed.', 'error');
}
}

const handleLogout = () => {
localStorage.removeItem('user');
localStorage.removeItem('role');
setCurrentUser(null);
notify('Server Error', 'Registration failed.', 'error');
}
}

const handleLogout = () => {
localStorage.removeItem('user');
localStorage.removeItem('role');
setCurrentUser(null);
setUserRole(null);
setActiveView('home');
setFormStep(1);
setSelectedDistrict('');
setSelectedConstituency('');
setSelectedCategory('');
setFeedbackTitle('');
setFeedbackText('');
setExpectedSolution('');
setAttachedFile(null);
setSubmissionResult(null);
notify('Logged Out', 'Successfully logged out.', 'info');
const popup = window.open(
"",
"GoogleSignIn",
`width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no,resizable=yes`
);

if (popup) {
popup.document.write(`
<!DOCTYPE html>
<html>
<head>
<title>Sign in - Google Accounts</title>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
<style>
body {
</select>
<div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
<span className="material-symbols-outlined text-emerald-500 text-xs">expand_more</span>
</div>
</div>

{/* Portal Login Direct Link */}
<button
onClick={() => { setShowAuthModal(true); setActiveTab('login'); }}
className="flex items-center justify-center gap-1.5 px-3.5 h-8.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-extrabold text-2xs uppercase tracking-wider transition shadow-md hover:scale-[1.03] duration-300"
>
<span className="material-symbols-outlined text-xs">lock</span>
{language === 'English' ? 'Portal Login' : 'உள்நுழைக'}
</button>
</nav>

<div className="flex gap-2 items-center">
{/* Language Selector */}
<div className="relative">
<select
value={language}
onChange={(e) => setLanguage(e.target.value)}
className="appearance-none rounded-xl h-8.5 pl-3 pr-7.5 bg-emerald-955/60 border border-emerald-850/40 text-emerald-400 font-extrabold text-2xs focus:ring-1 focus:ring-emerald-500/20 transition outline-none cursor-pointer"
style={{ width: language === 'English' ? '68px' : '62px' }}
>
<option value="English">EN</option>
<option value="Tamil">தமிழ்</option>
</select>
<div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
<span className="material-symbols-outlined text-emerald-500 text-xs">expand_more</span>
</div>
</div>

{/* Portal Login / Logout Button */}
{currentUser ? (
<button
onClick={handleLogout}
className="flex items-center justify-center gap-1.5 px-3.5 h-8.5 rounded-xl border border-rose-500/35 hover:bg-rose-500/10 text-rose-450 font-extrabold text-2xs uppercase tracking-wider transition"
>
<span className="material-symbols-outlined text-xs">logout</span>
{language === 'English' ? 'Logout' : 'வெளியேறு'}
</button>
) : (
<button
<span className="material-symbols-outlined text-xs">lock</span>
{language === 'English' ? 'Portal Login' : 'உள்நுழைக'}
</button>
)}
</div>
</div>
</header>

{/* ─── FULL-SCREEN HIGH-IMPACT HERO BANNER ─── */}
<section 
className="relative w-full h-[92vh] overflow-hidden flex flex-col justify-end"
style={{
background: 'linear-gradient(to bottom, #7ac0e6 0%, #ffffff 55%, #f47a20 100%)',
}}
>
category_en: "Healthcare",
category_ta: "சுகாதாரம் & நலத்திட்டங்கள்",
people_en: "Women",
people_ta: "பெண்கள்",
type_en: "Scheme",
type_ta: "திட்டம்",
served_en: "Pregnant mothers",
served_ta: "கர்ப்பிணித் தாய்மார்கள்",
did_en: "Provided 11 types of herbal medicines and care accessories to protect the health of pregnant mothers.",
did_ta: "கர்ப்பிணித் தாய்மார்களின் உடல்நலனைப் பாதுகாக்க 11 வகையான மூலிகை மருந்துப் பெட்டகம் வழங்கப்பட்டது.",
impact_en: "Distributed to lakhs of expecting mothers in Govt health centers",
impact_ta: "அரசு ஆரம்ப சுகாதார நிலையங்களில் லட்சக்கணக்கான தாய்மார்கள் பயனடைந்தனர்",
source: "Integrated AYUSH Systems"
}
];


export default function FeedbackPage() {
const navigate = useNavigate();
const sliderRef = React.useRef(null);
const location = useLocation();

const [windowWidth, setWindowWidth] = useState(window.innerWidth);
useEffect(() => {
const handleResize = () => setWindowWidth(window.innerWidth);
window.addEventListener('resize', handleResize);
return () => window.removeEventListener('resize', handleResize);
}, []);

// Language state
const [language, setLanguageState] = useState(getLanguage());

// Active view state
const [activeView, setActiveView] = useState('home'); // 'home' | 'pulse' | 'legacy' | 'gallery' | 'constituency' | 'track'

// User session state
const [currentUser, setCurrentUser] = useState(localStorage.getItem('user') || null);
const [userRole, setUserRole] = useState(localStorage.getItem('role') || null);

// Auth modal state
const [showAuthModal, setShowAuthModal] = useState(false);
const [activeTab, setActiveTab] = useState('login'); // 'login' | 'signup'
const [redirectAfterAuth, setRedirectAfterAuth] = useState(null); // view to redirect to after successful auth

// Login form state
const [loginEmail, setLoginEmail] = useState('');
const [loginPassword, setLoginPassword] = useState('');

// Signup form state
const [signupName, setSignupName] = useState('');
const [signupEmail, setSignupEmail] = useState('');
const [signupPassword, setSignupPassword] = useState('');

// ─── SUBMISSION FORM STATES ───
const [formStep, setFormStep] = useState(1); // 1: Location, 2: Category, 3: Details, 4: Success
const [selectedState, setSelectedState] = useState('Tamil Nadu');
backgroundSize: 'contain',
backgroundPosition: 'center',
backgroundRepeat: 'no-repeat',
}}
/>

{/* ─── VIEW 1: HOME (LANDING ROADMAP + GRIEVANCE FORM) ─── */}
{activeView === 'home' && (
<>
{/* Main Purpose Section */}
<section id="purpose-section" className="relative px-6 py-16 md:py-24 max-w-4xl mx-auto w-full flex flex-col items-center text-center gap-6 overflow-hidden">
<span className="text-xs font-black tracking-widest text-emerald-700 uppercase">
{language === 'English' ? 'Portal Purpose' : 'தளத்தின் நோக்கம்'}
</span>
<h3 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-emerald-955 select-none">
{language === 'English' 
? 'Share your views on public issues, governance, leadership, development, and the priorities that matter to you. This platform serves as a direct bridge to report local grievances, submit suggestions, and follow up resolution progress.' 
: 'பொதுப் பிரச்சினைகள், ஆட்சி முறைமை, கட்சித் தலைமை, பகுதி மேம்பாடு மற்றும் மக்கள் நல முன்னுரிமைகள் குறித்த உங்கள் புகார்களை மற்றும் கருத்துக்களை நேரடியாக மக்கள் பிரதிநிதிகளிடம் பகிர்ந்து எளிதாகத் தீர்வு காணுங்கள்.'}
</p>
: 'பொதுப் பிரச்சினைகள், ஆட்சி முறைமை, கட்சித் தலைமை, பகுதி மேம்பாடு மற்றும் மக்கள் நல முன்னுரிமைகள் குறித்த உங்கள் புகார்களை மற்றும் கருத்துக்களை நேரடியாக மக்கள் பிரதிநிதிகளிடம் பகிர்ந்து எளிதாகத் தீர்வு காணுங்கள்.'}
</p>

<div className="flex flex-wrap justify-center gap-4 mt-2">
<button
onClick={handleGiveFeedbackClick}
className="px-8 py-3.5 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-black text-xs uppercase tracking-widest shadow-md hover:scale-[1.03] transition-all duration-300"
>
{language === 'English' ? 'Give Feedback' : 'கருத்தைச் சமர்ப்பிக்க'}
</button>
modalType === 'success'
? 'bg-gradient-to-r from-emerald-500 to-teal-600'
: 'bg-gradient-to-r from-red-500 to-rose-600'
}`}
>
Continue
</button>
</div>
</div>
)}
const [newsInboxLoading, setNewsInboxLoading] = useState(false);
const [newsError, setNewsError] = useState(null);


const [showApproveModal, setShowApproveModal] = useState(false);
const [selectedInboxNews, setSelectedInboxNews] = useState(null);
const [editTitleEn, setEditTitleEn] = useState('');
const [editTitleTa, setEditTitleTa] = useState('');
const [editDescEn, setEditDescEn] = useState('');
const [editDescTa, setEditDescTa] = useState('');
const [editTagEn, setEditTagEn] = useState('Press Release');
const [editTagTa, setEditTagTa] = useState('செய்தி வெளியீடு');
const [editIcon, setEditIcon] = useState('📰');
const [editLink, setEditLink] = useState('');
const [dashboardSubTab, setDashboardSubTab] = useState('grievances');

// ─── DYNAMIC GALLERY STATES ───
const [galleryPhotos, setGalleryPhotos] = useState([]);
const [galleryLoading, setGalleryLoading] = useState(false);
const [galleryFilter, setGalleryFilter] = useState('All');
const [activeLightboxImage, setActiveLightboxImage] = useState(null);

// Admin upload gallery state
const [uploadTitleEn, setUploadTitleEn] = useState('');
const [uploadTitleTa, setUploadTitleTa] = useState('');
const [uploadCategoryEn, setUploadCategoryEn] = useState('Campaigns');
const [uploadCategoryTa, setUploadCategoryTa] = useState('பிரச்சாரம்');
const [uploadImageFile, setUploadImageFile] = useState(null);
const [uploadLoading, setUploadLoading] = useState(false);

const fetchGallery = async () => {
try {
setGalleryLoading(true);
const res = await fetch(API + '/api/gallery');
if (res.ok) {
const data = await res.json();
setGalleryPhotos(data);
{language === 'English'
? 'Monitor the real-time status and representative resolution notes of your query.'
: 'சமர்ப்பிக்கப்பட்ட புகாரின் தற்போதைய தீர்வு நிலை மற்றும் குறிப்புகளைக் கண்டறியவும்.'}
</p>
</div>
<button 
onClick={handleTrackClick} 
className="mt-2 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs tracking-wider uppercase transition shadow-md focus:outline-none"
>
{language === 'English' ? 'Track Grievance' : 'நிலை அறிதல்'}
</button>
</div>

{/* Step 2: File a Grievance Card */}
<div className="flex-1 w-full max-w-sm rounded-[2rem] p-6 shadow-xl border border-emerald-100 bg-white/95 flex flex-col items-center text-center gap-5 hover:scale-[1.03] transition-transform duration-300 group hover:shadow-emerald-200/50 hover:shadow-2xl border-t-4 border-t-emerald-500">
<div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-255 text-emerald-600 flex items-center justify-center group-hover:scale-110 duration-300 transition-transform">
<span className="material-symbols-outlined text-3xl font-bold">mail</span>
</div>
<div className="space-y-2">
<h4 className="text-base font-black text-emerald-955">{language === 'English' ? '2. File a Grievance' : '2. குறை சமர்ப்பித்தல்'}</h4>
<p className="text-xs text-slate-600 leading-relaxed">
</section>
</>
)}                 ) : (
<span>{language === 'English' ? 'Submit Grievance' : 'கோரிக்கையைச் சமர்ப்பி'}</span>
)}
</button>
</div>
</form>
)}

{/* STEP 4: SUBMISSION SUCCESS SCREEN */}
{formStep === 4 && submissionResult && (
<div className="text-center space-y-6 py-6 animate-fadeIn">
<div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto shadow-inner text-emerald-600">
<span className="material-symbols-outlined text-4xl font-bold">check_circle</span>
</div>
<div className="space-y-2">
<h4 className="text-2xl font-black text-emerald-955">{language === 'English' ? 'Thank You for Making Your Voice Heard' : 'உங்கள் குரலை ஒலிக்கச் செய்ததற்கு நன்றி'}</h4>
<p className="text-xs text-slate-550">{language === 'English' ? 'Your grievance has been successfully logged into our database.' : 'உங்கள் கோரிக்கை எங்கள் தரவுத்தளத்தில் வெற்றிகரமாக பதிவு செய்யப்பட்டுள்ளது.'}</p>
</div>

{/* ID Display box */}
<div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 max-w-sm mx-auto flex items-center justify-between shadow-inner">
<div className="text-left">
<span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider block">{language === 'English' ? 'Grievance Tracking ID' : 'புகார் கண்காணிப்பு ஐடி'}</span>
<span className="text-lg font-black text-slate-800 tracking-wide">{submissionResult.tracking_id}</span>
</div>
<button
onClick={() => {
navigator.clipboard.writeText(submissionResult.tracking_id);
Swal.fire({ title: 'Copied!', text: 'Tracking ID copied to clipboard', icon: 'success', timer: 1200, showConfirmButton: false });
}}
className="p-2.5 rounded-xl bg-white hover:bg-emerald-100 text-emerald-700 transition shadow-sm"
title="Copy ID"
>
<span className="material-symbols-outlined text-sm font-bold">content_copy</span>
</button>
</div>

<div className="pt-6 flex flex-wrap justify-center gap-4">
<button
onClick={() => {
setTrackId(submissionResult.tracking_id);
setActiveView('track');
// Pre-trigger search
setTimeout(() => {
document.getElementById('search-track-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
}, 150);
}}
className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider shadow-md"
>
{language === 'English' ? 'Track Grievance Status' : 'விசாரணை நிலை அறிதல்'}
</button>
<button
onClick={() => {
// Reset state and return to Step 1
setFeedbackTitle('');
setFeedbackText('');
setExpectedSolution('');
setSelectedCategory('');
setAttachedFile(null);
setSubmissionResult(null);
} catch (err) {
console.error(err);
Swal.fire('Error', 'Network error deleting photo', 'error');
}
}
};

// ─── DYNAMIC LEGACY STATES ───
const [legacyMilestones, setLegacyMilestones] = useState([]);
const [legacyLoading, setLegacyLoading] = useState(false);
const [legacyFilter, setLegacyFilter] = useState('All');
const [legacySubView, setLegacySubView] = useState('history'); // 'history' | 'schemes'
const [schemesSearch, setSchemesSearch] = useState('');
const [schemesEraFilter, setSchemesEraFilter] = useState('All');
const [schemesCategoryFilter, setSchemesCategoryFilter] = useState('All');
const [schemesPeopleFilter, setSchemesPeopleFilter] = useState('All');
const [schemesTypeFilter, setSchemesTypeFilter] = useState('All');
const [activeStoryIdx, setActiveStoryIdx] = useState(0); // For impact stories
const [typedTitle, setTypedTitle] = useState('');
const [titleTypingDone, setTitleTypingDone] = useState(false);

const [activeIndex, setActiveIndex] = useState(0);

// Admin upload milestone state
const [uploadMilestoneYear, setUploadMilestoneYear] = useState('');
const [uploadMilestoneTitleEn, setUploadMilestoneTitleEn] = useState('');
const [uploadMilestoneTitleTa, setUploadMilestoneTitleTa] = useState('');
const [uploadMilestoneDescEn, setUploadMilestoneDescEn] = useState('');
const [uploadMilestoneDescTa, setUploadMilestoneDescTa] = useState('');
const [uploadMilestoneCategoryEn, setUploadMilestoneCategoryEn] = useState('Infrastructure & Elections');
const [uploadMilestoneCategoryTa, setUploadMilestoneCategoryTa] = useState('சட்டமன்றம் & தேர்தல்');
const [uploadMilestoneLoading, setUploadMilestoneLoading] = useState(false);

const fetchLegacy = async () => {
try {
setLegacyLoading(true);
const res = await fetch(API + '/api/legacy');
if (res.ok) {
const data = await res.json();
const sorted = data.sort((a, b) => a.year - b.year);
setLegacyMilestones(sorted);
const res = await fetch(API + '/api/feedback', {
method: 'POST',
body: formData,
});
const data = await res.json();
if (res.ok && data.tracking_id) {
setSubmissionResult({
feedback_id: data.feedback_id,
tracking_id: data.tracking_id,
});
setFormStep(4); // Success step
notify('Submitted', 'Thank you for your feedback.', 'success');
} else {
notify('Error', data.detail || 'Failed to submit grievance.', 'error');
}
} catch (err) {
console.error('Submission Error:', err);
notify('Server Error', 'Failed to connect to the backend server.', 'error');
} finally {
setSubmitLoading(false);
}
};

const handleTrackGrievance = async (e) => {
e.preventDefault();
if (!trackId.trim()) {
notify('Required', 'Please enter a valid Feedback ID.', 'warning');
return;
}
setTrackLoading(true);
<button 
onClick={() => setActiveView('home')} 
className={`text-[10px] font-black tracking-widest uppercase transition duration-300 ${activeView === 'home' ? 'text-white' : 'text-slate-350 hover:text-white'}`}
>
{language === 'English' ? 'Home' : 'முகப்பு'}
</button>
<button 
onClick={handleGiveFeedbackClick} 
className={`text-[10px] font-black tracking-widest uppercase transition duration-300 ${activeView === 'raise' ? 'text-emerald-400' : 'text-slate-355 hover:text-emerald-400'}`}
}
} catch (err) {
console.error('Tracking Error:', err);
notify('Server Error', 'Failed to connect to tracking services.', 'error');
} finally {
setTrackLoading(false);
}
};

const loadConstituencyGrievances = async () => {
if (!leaderConstituency) return;
setLeaderLoading(true);
try {
const res = await fetch(API + '/api/feedbacks');
if (res.ok) {
const data = await res.json();
setAllFeedbacks(data);
const filtered = data.filter(item => 
item.constituency?.toLowerCase() === leaderConstituency.toLowerCase() &&
item.district?.toLowerCase() === leaderDistrict.toLowerCase()
);
setConstituencyFeedbacks(filtered);
} else {
notify('Error', 'Failed to retrieve database list.', 'error');
}
} catch (err) {
console.error('Fetch Feedbacks Error:', err);
} finally {
setLeaderLoading(false);
}
};

useEffect(() => {
if (activeView === 'constituency') {
loadConstituencyGrievances();
}
}, [leaderConstituency, leaderDistrict, activeView]);

const handleGiveFeedbackClick = () => {
if (!currentUser) {
setRedirectAfterAuth('raise');
setShowAuthModal(true);
setActiveTab('login');
notify('Authentication Required', 'Please sign in to submit a grievance.', 'info');
} else {
setActiveView('raise');
</select>
<div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
<span className="material-symbols-outlined text-emerald-500 text-xs">expand_more</span>
</div>
</div>

{/* Portal Login / Logout Button */}
{currentUser ? (
<button
onClick={handleLogout}
className="flex items-center justify-center gap-1.5 px-3.5 h-8.5 rounded-xl border border-rose-500/35 hover:bg-rose-500/10 text-rose-450 font-extrabold text-2xs uppercase tracking-wider transition"
>
<span className="material-symbols-outlined text-xs">logout</span>
{language === 'English' ? 'Logout' : 'வெளியேறு'}
notify('Error', 'Failed to resolve grievance.', 'error');
}
};

const loadConstituencyGrievances = async () => {
if (!leaderConstituency) return;
setLeaderLoading(true);
try {
const res = await fetch(API + '/api/feedbacks');
if (res.ok) {
const data = await res.json();
setAllFeedbacks(data);
const filtered = data.filter(item => 
item.constituency?.toLowerCase() === leaderConstituency.toLowerCase() &&
item.district?.toLowerCase() === leaderDistrict.toLowerCase()
);
setConstituencyFeedbacks(filtered);
} else {
notify('Error', 'Failed to retrieve database list.', 'error');
}
} catch (err) {
console.error('Fetch Feedbacks Error:', err);
} finally {
setLeaderLoading(false);
}
};

useEffect(() => {
if (activeView === 'constituency') {
loadConstituencyGrievances();
}
}, [leaderConstituency, leaderDistrict, activeView]);

const handleGiveFeedbackClick = () => {
if (!currentUser) {
setRedirectAfterAuth('raise');
setShowAuthModal(true);
setActiveTab('login');
notify('Authentication Required', 'Please sign in to submit a grievance.', 'info');
} else {
setActiveView('raise');
<div className="text-left space-y-2 max-w-3xl">
<h2 className="text-2xl md:text-5xl font-black text-white leading-tight drop-shadow-xl" style={{ fontFamily: "'Noto Sans Tamil', 'Manrope', sans-serif" }}>
{language === 'English' ? 'Citizen Grievance & Response Portal' : 'மக்கள் குறைதீர்ப்பு மற்றும் கருத்து தளம்'}
</h2>
<p className="text-[10px] md:text-xs font-black text-[#10b981] uppercase tracking-widest leading-none drop-shadow-md">
{language === 'English' ? 'All India Anna Dravida Munnetra Kazhagam' : 'அனைத்திந்திய அண்ணா திராவிட முன்னேற்றக் கழகம்'}
</p>
</div>

{/* Right side scroll down arrow */}
<div className="flex-shrink-0 ml-6 pb-2">
<button
onClick={() => document.getElementById('purpose-section')?.scrollIntoView({ behavior: 'smooth' })}
className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-emerald-600 hover:bg-emerald-50 text-white flex items-center justify-center shadow-2xl transition hover:scale-110 active:scale-95 animate-bounce"
title="Scroll Down"
>
<span className="material-symbols-outlined font-black text-lg md:text-xl">arrow_downward</span>
</button>
</div>
</div>
</section>
)}

{/* ─── LIGHT-THEMED CONTENT WRAPPER (LIGHT GREEN PASTEL GRADIENT) ─── */}
<div 
className="text-slate-800 relative z-20"
style={{
background: 'linear-gradient(to bottom, #f0fdf4 0%, #dcfce7 60%, #bbf7d0 100%)',
}}
className={`text-[10px] font-black tracking-widest uppercase transition duration-300 ${activeView === 'track' ? 'text-emerald-400' : 'text-slate-350 hover:text-emerald-405'}`}
>
{language === 'English' ? 'Track Status' : 'விசாரணை நிலை'}
</button>
<button 
onClick={() => setActiveView('legacy')} 
className={`text-[10px] font-black tracking-widest uppercase transition duration-300 ${activeView === 'legacy' ? 'text-emerald-400' : 'text-slate-350 hover:text-emerald-405'}`}
>
{language === 'English' ? 'Legacy' : 'பாரம்பரியம்'}
</button>
<button 
onClick={() => setActiveView('gallery')} 
className={`text-[10px] font-black tracking-widest uppercase transition duration-300 ${activeView === 'gallery' ? 'text-emerald-400' : 'text-slate-350 hover:text-emerald-405'}`}
>
{language === 'English' ? 'Gallery' : 'கேலரி'}
</button>
</nav>

<div className="flex gap-2 items-center">
{/* Language Selector */}
<div className="relative">
<select
value={language}
onChange={(e) => setLanguage(e.target.value)}
className="appearance-none rounded-xl h-8.5 pl-3 pr-7.5 bg-emerald-955/60 border border-emerald-850/40 text-emerald-400 font-extrabold text-2xs focus:ring-1 focus:ring-emerald-500/20 transition outline-none cursor-pointer"
style={{ width: language === 'English' ? '68px' : '62px' }}
>
<option value="English">EN</option>
<option value="Tamil">தமிழ்</option>
</select>
<div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
<span className="material-symbols-outlined text-emerald-500 text-xs">expand_more</span>
</div>
</div>

{/* Portal Login / Logout Button */}
{currentUser ? (
<button
onClick={handleLogout}
className="flex items-center justify-center gap-1.5 px-3.5 h-8.5 rounded-xl border border-rose-500/35 hover:bg-rose-500/10 text-rose-450 font-extrabold text-2xs uppercase tracking-wider transition"
if (activeView === 'pulse') {
fetchPressReleases();
}
if (activeView === 'gallery') {
fetchGallery();
}
if (activeView === 'legacy') {
fetchLegacy();
}
if (activeView === 'constituency' && userRole === 'admin') {
fetchNewsInbox();
fetchPressReleases();
fetchGallery();
fetchLegacy();
}
}, [activeView, userRole]);

useEffect(() => {
if (activeView !== 'legacy') {
setTypedTitle('');
setTitleTypingDone(false);
return;
}
const fullText = language === 'English' 
? "A Movement. A History. A Legacy."
: "ஒரு இயக்கம். ஒரு வரலாறு. ஒரு பாரம்பரியம்.";

setTypedTitle('');
setTitleTypingDone(false);

let current = '';
let index = 0;

const interval = setInterval(() => {
if (index < fullText.length) {
current += fullText.charAt(index);
setTypedTitle(current);
index++;
} else {
clearInterval(interval);
setTitleTypingDone(true);
}
}, 60);

return () => clearInterval(interval);
}, [activeView, language]);
// If redirected from routing history with login state, open the modal
if (location.state?.showLogin) {
setShowAuthModal(true);
setActiveTab(location.state?.tab || 'login');
// Clear location state to prevent modal reopening on page reloads
{language === 'English' ? 'Citizen Grievance & Response Portal' : 'மக்கள் குறைதீர்ப்பு மற்றும் கருத்து தளம்'}
</h2>
<p className="text-[10px] md:text-xs font-black text-[#10b981] uppercase tracking-widest leading-none drop-shadow-md">
{language === 'English' ? 'All India Anna Dravida Munnetra Kazhagam' : 'அனைத்திந்திய அண்ணா திராவிட முன்னேற்றக் கழகம்'}
</p>
</div>

{/* Right side scroll down arrow */}
<div className="flex-shrink-0 ml-6 pb-2">
<button
onClick={() => document.getElementById('purpose-section')?.scrollIntoView({ behavior: 'smooth' })}
className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-emerald-600 hover:bg-emerald-50 text-white flex items-center justify-center shadow-2xl transition hover:scale-110 active:scale-95 animate-bounce"
title="Scroll Down"
>
<span className="material-symbols-outlined font-black text-lg md:text-xl">arrow_downward</span>
</button>
</div>
</div>
</section>
)}

{/* ─── LIGHT-THEMED CONTENT WRAPPER (LIGHT GREEN PASTEL GRADIENT) ─── */}
<div 
className="text-slate-800 relative z-20"
style={{
background: 'linear-gradient(to bottom, #f0fdf4 0%, #dcfce7 60%, #bbf7d0 100%)',
}}
>
{/* Centered Watermark Leaf Logo (Visible across all sub-views) */}
{activeView === 'home' && (
<>
{/* ─── HOME PAGE MIDDLE SECTIONS (FULL SCREEN RALLY CROWD BACKGROUND) ─── */}
<div 
className="relative w-full py-16 px-4 md:px-6 flex flex-col items-center justify-center bg-no-repeat bg-cover bg-center bg-fixed"
style={{
backgroundImage: 'linear-gradient(rgba(2, 31, 11, 0.75), rgba(2, 31, 11, 0.82)), url("/rally_bg.jpg")',
}}
>
{/* Main Purpose Section with Centered Background Leaf Watermark */}
<section id="purpose-section" className="relative px-6 py-12 md:py-16 max-w-4xl mx-auto w-full flex flex-col items-center text-center gap-6 z-10">
{/* Watermark Leaf Logo centered behind Purpose Section */}
<div 
className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] h-[85vw] md:w-[48vw] md:h-[48vw] max-w-[650px] max-h-[650px] opacity-[0.15] pointer-events-none select-none z-0"
style={{
backgroundImage: 'url("/irratai_ellai.png")',
backgroundSize: 'contain',
backgroundPosition: 'center',
backgroundRepeat: 'no-repeat',
filter: 'brightness(2)'
}}
/>

<span className="inline-block px-4 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-xs font-black tracking-widest text-amber-400 uppercase drop-shadow-sm relative z-10">
{language === 'English' ? 'Portal Purpose' : 'தளத்தின் நோக்கம்'}
</span>

<div className="flex flex-wrap justify-center gap-4 mt-2 relative z-10">
<button
onClick={handleGiveFeedbackClick}
localStorage.setItem('user_constituency', data.constituency || '');
setCurrentUser(loginEmail);
setUserRole(data.role);
setLeaderDistrict(data.district || '');
setLeaderConstituency(data.constituency || '');

notify('Access Granted', 'Logged in successfully.', 'success');
setTimeout(() => {
setShowAuthModal(false);
if (redirectAfterAuth) {
setActiveView(redirectAfterAuth);
setRedirectAfterAuth(null);
} else if (data.role === 'admin') {
setActiveView('constituency');
} else {
setActiveView('home');
}
}, 1500);
} else {
notify('Login Failed', data.message, 'error');
}
} catch (error) {
console.error('Login Error:', error);
notify('Server Error', 'Connection failed. Check backend.', 'error');
}
}

// ─── SIGNUP LOGIC ─────────────────────────────────────────
async function signup(e) {
e.preventDefault();
if (!signupName || !signupEmail || !signupPassword) {
notify('Input Error', 'All fields are mandatory.', 'warning');
return;
}
try {
const res = await fetch(API + '/api/signup', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ name: signupName, email: signupEmail, password: signupPassword }),
});
const data = await res.json();
if (data.message === 'Signup success') {
notify('Account Created', 'Welcome! Redirecting to login...', 'success');
setTimeout(() => setActiveTab('login'), 2200);
} else {
notify('Signup Failed', data.message, 'error');
}
} catch (error) {
console.error('Signup Error:', error);
notify('Server Error', 'Registration failed.', 'error');
}
}

const handleLogout = () => {
localStorage.removeItem('user');
localStorage.removeItem('role');
localStorage.removeItem('user_district');
localStorage.removeItem('user_constituency');
setCurrentUser(null);
setUserRole(null);
setLeaderDistrict('');
setLeaderConstituency('');
setActiveView('home');
setFormStep(1);
setSelectedDistrict('');
setSelectedConstituency('');
setSelectedCategory('');
setFeedbackTitle('');
setFeedbackText('');
setExpectedSolution('');
setAttachedFile(null);
setSubmissionResult(null);
notify('Logged Out', 'Successfully logged out.', 'info');
};

const handleGoogleLogin = () => {
const width = 500;
const height = 650;
const left = window.screen.width / 2 - width / 2;
const top = window.screen.height / 2 - height / 2;

const popup = window.open(
"",
"GoogleSignIn",
`width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no,resizable=yes`
);

if (popup) {
popup.document.write(`
<!DOCTYPE html>
<html>
<head>
<title>Sign in - Google Accounts</title>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
<style>
body {
background-color: #202124;
color: #e8eaed;
font-family: 'Roboto', sans-serif;
margin: 0;
padding: 0;
display: flex;
justify-content: center;
align-items: center;
height: 100vh;
box-sizing: border-box;
}
.container {
width: 100%;
max-width: 450px;
height: 100%;
background-color: #202124;
padding: 40px 30px;
box-sizing: border-box;
display: flex;
flex-direction: column;
}
.header {
margin-bottom: 24px;
}
.google-title-bar {
display: flex;
align-items: center;
gap: 8px;
font-size: 14px;
color: #e8eaed;
margin-bottom: 30px;
font-weight: 500;
}
.google-logo {
width: 20px;
height: 20px;
}
h1 {
font-size: 24px;
font-weight: 400;
margin: 0 0 8px 0;
color: #e8eaed;
}
.subtitle {
font-size: 14px;
color: #9cb3a5;
margin: 0;
}
.subtitle-app {
font-weight: 500;
color: #34d399;
}
.account-list {
border-top: 1px solid #3c4043;
border-bottom: 1px solid #3c4043;
margin-bottom: 30px;
}
.account-item {
display: flex;
align-items: center;
width: 100%;
padding: 14px 16px;
border: none;
background: none;
cursor: pointer;
text-align: left;
color: inherit;
font-family: inherit;
border-top: 1px solid #3c4043;
transition: background 0.15s;
}
.account-item:first-child {
border-top: none;
}
.account-item:hover {
background-color: #303134;
}
.avatar {
width: 32px;
height: 32px;
border-radius: 50%;
display: flex;
align-items: center;
justify-content: center;
font-weight: bold;
font-size: 14px;
margin-right: 12px;
color: white;
}
.name {
font-size: 14px;
font-weight: 500;
color: #e8eaed;
}
.email {
font-size: 12px;
color: #9aa0a6;
margin-top: 2px;
}
.another-account {
color: #8ab4f8;
font-size: 14px;
font-weight: 500;
}
.another-avatar {
background-color: #303134;
color: #8ab4f8;
display: flex;
align-items: center;
justify-content: center;
}
.footer {
font-size: 11px;
color: #9aa0a6;
line-height: 1.5;
margin-top: auto;
}
.input-overlay {
display: none;
position: fixed;
inset: 0;
background: rgba(0,0,0,0.85);
z-index: 1000;
justify-content: center;
align-items: center;
padding: 20px;
}
.input-card {
background: #2d2e30;
border: 1px solid #3c4043;
border-radius: 8px;
padding: 24px;
width: 100%;
max-width: 320px;
}
.input-card h3 {
margin-top: 0;
font-size: 16px;
font-weight: 500;
margin-bottom: 16px;
}
.input-card input {
width: 100%;
padding: 10px;
border: 1px solid #3c4043;
background: #202124;
color: white;
border-radius: 4px;
box-sizing: border-box;
outline: none;
margin-bottom: 16px;
font-size: 14px;
}
.input-card input:focus {
border-color: #8ab4f8;
}
.input-buttons {
display: flex;
justify-content: flex-end;
gap: 12px;
}
.input-buttons button {
padding: 8px 16px;
border: none;
background: none;
color: #8ab4f8;
cursor: pointer;
font-weight: 500;
border-radius: 4px;
}
.input-buttons button.submit {
background: #8ab4f8;
color: #202124;
}
</style>
</head>
<body>
<div class="container">
<div class="google-title-bar">
<svg class="google-logo" viewBox="0 0 24 24">
<path fill="#4285F4" d="M21.35,11.1H12V13.8H18.7C18.4,15.6 15.2,19.3 12,19.3C8.4,19.3 5,16.3 5,12C5,7.9 8.2,4.7 12,4.7C15.3,4.7 17.1,6.7 17.1,6.7L19,4.7C19,4.7 16.6,2 12.1,2C6.4,2 2,6.8 2,12C2,17.2 6.4,22 12.1,22C17.6,22 21.5,18.3 21.5,12.9C21.5,11.8 21.3,11.1 21.3,11.1Z"/>
</svg>
<span>\${language === 'English' ? 'Sign in - Google Accounts' : 'உள்நுழைக - கூகுள் கணக்குகள்'}</span>
</div>

<div class="header">
<h1>\${language === 'English' ? 'Choose an account' : 'கணக்கைத் தேர்ந்தெடுக்கவும்'}</h1>
<p class="subtitle">\${language === 'English' ? 'to continue to' : 'தொடர'} <span class="subtitle-app">ADMK Grievance Portal</span></p>
</div>

<div class="account-list">
<button class="account-item" onclick="selectAcc('gopikavelusamy3@gmail.com', 'Gopika Velusamy', 'user')">
<div class="avatar" style="background-color: #ab47bc;">G</div>
<div>
<div class="name">Gopika Velusamy</div>
<div class="email">gopikavelusamy3@gmail.com</div>
</div>
</button>

<button class="account-item" onclick="selectAcc('kavithagopika14@gmail.com', 'Kavitha B', 'admin')">
<div class="avatar" style="background-color: #0f9d58;">K</div>
<div>
<div class="name">Kavitha B</div>
<div class="email">kavithagopika14@gmail.com</div>
</div>
</button>

<button class="account-item" onclick="selectAcc('gopikav255@gmail.com', 'V Gopika', 'user')">
<div class="avatar" style="background-color: #4285f4;">V</div>
<div>
<div class="name">V Gopika</div>
<div class="email">gopikav255@gmail.com</div>
</div>
</button>

<button class="account-item" onclick="selectAcc('amritavelusamy@gmail.com', 'Amrita', 'user')">
<div class="avatar" style="background-color: #e67c73;">A</div>
<div>
<div class="name">Amrita</div>
<div class="email">amritavelusamy@gmail.com</div>
</div>
</button>

<button class="account-item" onclick="showCustomInput()">
<div class="avatar another-avatar">
<span class="material-symbols-outlined" style="font-size: 18px; vertical-align: middle;">person_add</span>
</div>
<div>
<div class="name another-account">\${language === 'English' ? 'Use another account' : 'வேறு கணக்கைப் பயன்படுத்தவும்'}</div>
</div>
</button>
</div>

<p class="footer">
\${language === 'English' 
? 'To continue, Google will share your name, email address, profile picture, and language preference with ADMK Feedback. Before using this app, you can review its privacy policy and terms of service.' 
: 'தொடர, கூகுள் உங்கள் பெயர், மின்னஞ்சல் முகவரி, சுயவிவரப் படம் மற்றும் மொழி விருப்பங்களை ADMK Feedback உடன் பகிரும். இந்த செயலியைப் பயன்படுத்துவதற்கு முன், அதன் தனியுரிமைக் கொள்கை மற்றும் சேவை விதிமுறைகளை நீங்கள் மதிப்பாய்வு செய்யலாம்.'}
</p>
</div>

<div id="overlay" class="input-overlay">
<div class="input-card">
<h3>\${language === 'English' ? 'Enter Google email' : 'மின்னஞ்சலை உள்ளிடவும்'}</h3>
<input type="email" id="custom-email" placeholder="name@gmail.com">
<div class="input-buttons">
<button onclick="hideCustomInput()">\${language === 'English' ? 'Cancel' : 'ரத்துசெய்'}</button>
<button class="submit" onclick="submitCustomEmail()">\${language === 'English' ? 'Next' : 'அடுத்து'}</button>
</div>
</div>
</div>

<script>
function selectAcc(email, name, role) {
if (window.opener && !window.opener.closed) {
window.opener.onGoogleSelect(email, name, role);
}
window.close();
}

function showCustomInput() {
document.getElementById('overlay').style.display = 'flex';
document.getElementById('custom-email').focus();
}

function hideCustomInput() {
document.getElementById('overlay').style.display = 'none';
}

function submitCustomEmail() {
const email = document.getElementById('custom-email').value.trim();
if (email) {
selectAcc(email, 'Google Citizen', 'user');
}
}
</script>
</body>
</html>
`);
popup.document.close();
}
};

const handleSubmitGrievance = async (e) => {
e.preventDefault();
if (!selectedDistrict || !selectedConstituency || !selectedCategory || !feedbackTitle || !feedbackText) {
notify('Input Error', 'Please complete all required fields.', 'warning');
return;
}

setSubmitLoading(true);
const formData = new FormData();
formData.append('state', selectedState);
formData.append('district', selectedDistrict);
formData.append('constituency', selectedConstituency);
formData.append('local_body', localBody || 'N/A');
formData.append('ward_village', wardVillage || 'N/A');
formData.append('type_of_feedback', selectedCategory);
formData.append('feedback_title', feedbackTitle);
formData.append('feedback_text', feedbackText);
formData.append('rating', rating);
formData.append('importance', importance);
formData.append('need_response', needResponse);
formData.append('anonymous', anonymous);
formData.append('email', currentUser || '');
formData.append('solution', expectedSolution || '');
if (anonymous === 'No') {
formData.append('name', citizenName || 'Citizen');
formData.append('age', citizenAge ? parseInt(citizenAge) : 0);
formData.append('booth_no', boothNo || ''); // Contact details
}
if (attachedFile) {
formData.append('image', attachedFile);
}

try {
const res = await fetch(API + '/api/feedback', {
method: 'POST',
body: formData,
});
const data = await res.json();
if (res.ok && data.tracking_id) {
setSubmissionResult({
feedback_id: data.feedback_id,
tracking_id: data.tracking_id,
});
setFormStep(4); // Success step
notify('Submitted', 'Thank you for your feedback.', 'success');
} else {
notify('Error', data.detail || 'Failed to submit grievance.', 'error');
}
} catch (err) {
console.error('Submission Error:', err);
notify('Server Error', 'Failed to connect to the backend server.', 'error');
} finally {
setSubmitLoading(false);
}
};

const handleTrackGrievance = async (e) => {
e.preventDefault();
if (!trackId.trim()) {
notify('Required', 'Please enter a valid Feedback ID.', 'warning');
return;
}
setTrackLoading(true);
setTrackResult(null);
try {
const res = await fetch(API + `/api/feedback/track/${trackId.trim()}`);
if (res.ok) {
const data = await res.json();
setTrackResult(data);
} else {
const errData = await res.json();
notify('Not Found', errData.detail || 'No record matches this ID.', 'warning');
}
} catch (err) {
console.error('Tracking Error:', err);
notify('Server Error', 'Failed to connect to tracking services.', 'error');
} finally {
setTrackLoading(false);
}
};

const resolveComplaint = async (id) => {
if (
!window.confirm(
"Are you sure? This will send the official 'Issue Resolved' WhatsApp notification to the citizen."
)
)
return;

try {
const res = await fetch(`${API}/api/update-status/${id}`, {
method: 'PUT',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ status: 'Resolved' }),
});
if (res.ok) {
Swal.fire({
title: 'Success',
text: 'Grievance marked as Resolved and WhatsApp notification sent.',
icon: 'success',
timer: 2000,
});
loadConstituencyGrievances();
}
} catch (err) {
console.error(err);
notify('Error', 'Failed to resolve grievance.', 'error');
}
};

const loadConstituencyGrievances = async () => {
if (!leaderConstituency) return;
setLeaderLoading(true);
try {
const res = await fetch(API + '/api/feedbacks');
if (res.ok) {
const data = await res.json();
setAllFeedbacks(data);
const filtered = data.filter(item => 
item.constituency?.toLowerCase() === leaderConstituency.toLowerCase() &&
item.district?.toLowerCase() === leaderDistrict.toLowerCase()
);
setConstituencyFeedbacks(filtered);
} else {
notify('Error', 'Failed to retrieve database list.', 'error');
}
} catch (err) {
console.error('Fetch Feedbacks Error:', err);
} finally {
setLeaderLoading(false);
}
};

useEffect(() => {
if (activeView === 'constituency') {
loadConstituencyGrievances();
}
}, [leaderConstituency, leaderDistrict, activeView]);

const handleGiveFeedbackClick = () => {
if (!currentUser) {
setRedirectAfterAuth('raise');
setShowAuthModal(true);
setActiveTab('login');
notify('Authentication Required', 'Please sign in to submit a grievance.', 'info');
} else {
setActiveView('raise');
}
};

const handleMyConstituencyClick = () => {
if (!currentUser) {
setRedirectAfterAuth('constituency');
setShowAuthModal(true);
setActiveTab('login');
notify('Authentication Required', 'Please sign in to access leadership tools.', 'info');
} else if (userRole !== 'admin') {
Swal.fire({
title: 'Access Restricted',
text: 'This section is only accessible to Party Leaders & Administrators.',
icon: 'warning',
confirmButtonColor: '#047857'
});
} else {
setActiveView('constituency');
}
};

const handleTrackClick = () => {
if (!currentUser) {
setRedirectAfterAuth('track');
setShowAuthModal(true);
setActiveTab('login');
notify('Authentication Required', 'Please sign in to track your grievances.', 'info');
} else {
setActiveView('track');
}
};



return (
<div
className="font-manrope min-h-screen relative overflow-x-hidden text-white bg-[#021f0b]"
style={{
background: 'linear-gradient(135deg, #021a08 0%, #032b11 50%, #011405 100%)',
}}
>      <div className="layout-container flex flex-col min-h-screen relative z-10">

{/* ─── PREMIUM GLASS NAVIGATION HEADER ─── */}
<header className="flex items-center justify-between border-b px-4 sm:px-8 py-3.5 sticky top-0 z-50 backdrop-blur-2xl bg-[#04210d]/85 border-emerald-955/30 shadow-xl">
<div className="flex items-center gap-3">
<div className="w-11 h-11 bg-white rounded-full border-2 border-emerald-500 shadow-lg flex items-center justify-center overflow-hidden hover:scale-105 duration-300 transition-transform">
<img src="/irratai_ellai.png" className="w-full h-full object-contain p-0.5" alt="ADMK Logo" />
</div>
<div className="flex flex-col">
<h1 className="text-[10px] sm:text-xs font-black tracking-tight text-white leading-tight uppercase" style={{ fontFamily: "'Noto Sans Tamil', 'Manrope', sans-serif" }}>
அனைத்திந்திய அண்ணா திராவிட முன்னேற்றக் கழகம்
</h1>
<p className="text-[6.5px] sm:text-[8px] text-emerald-400 font-extrabold tracking-widest uppercase leading-none mt-0.5">
All India Anna Dravida Munnetra Kazhagam
</p>
</div>
</div>

<div className="flex items-center gap-2 sm:gap-4">
<nav className="hidden xl:flex items-center gap-7">
<button 
onClick={() => setActiveView('home')} 
notify('Authentication Required', 'Please sign in to submit a grievance.', 'info');
} else {
setActiveView('raise');
}
};

const handleMyConstituencyClick = () => {
if (!currentUser) {
setRedirectAfterAuth('constituency');
setShowAuthModal(true);
setActiveTab('login');
notify('Authentication Required', 'Please sign in to access leadership tools.', 'info');
} else if (userRole !== 'admin') {
Swal.fire({
title: 'Access Restricted',
text: 'This section is only accessible to Party Leaders & Administrators.',
icon: 'warning',
confirmButtonColor: '#047857'
});
} else {
setActiveView('constituency');
}
};

const handleTrackClick = () => {
if (!currentUser) {
{language === 'English' ? 'Track Status' : 'விசாரணை நிலை'}
</button>
<button 
onClick={() => setActiveView('legacy')} 
className={`text-[10px] font-black tracking-widest uppercase transition duration-300 ${activeView === 'legacy' ? 'text-emerald-400' : 'text-slate-350 hover:text-emerald-405'}`}
>
{language === 'English' ? 'Legacy' : 'பாரம்பரியம்'}
</button>
<button 
onClick={() => setActiveView('gallery')} 
className={`text-[10px] font-black tracking-widest uppercase transition duration-300 ${activeView === 'gallery' ? 'text-emerald-400' : 'text-slate-350 hover:text-emerald-405'}`}
>
{language === 'English' ? 'Gallery' : 'கேலரி'}
</button>
</nav>

<div className="flex gap-2 items-center">
{/* Language Selector */}
<div className="relative">
<select
value={language}
onChange={(e) => setLanguage(e.target.value)}
className="appearance-none rounded-xl h-8.5 pl-3 pr-7.5 bg-emerald-955/60 border border-emerald-850/40 text-emerald-400 font-extrabold text-2xs focus:ring-1 focus:ring-emerald-500/20 transition outline-none cursor-pointer"
style={{ width: language === 'English' ? '68px' : '62px' }}
>
<option value="English">EN</option>
<option value="Tamil">தமிழ்</option>
</select>
<div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
<span className="material-symbols-outlined text-emerald-500 text-xs">expand_more</span>
</div>
</div>

{/* Portal Login / Logout Button */}
{currentUser ? (
<button
onClick={handleLogout}
className="flex items-center justify-center gap-1.5 px-3.5 h-8.5 rounded-xl border border-rose-500/35 hover:bg-rose-500/10 text-rose-450 font-extrabold text-2xs uppercase tracking-wider transition"
>
<span className="material-symbols-outlined text-xs">logout</span>
{language === 'English' ? 'Logout' : 'வெளியேறு'}
</button>
) : (
<button
onClick={() => { setShowAuthModal(true); setActiveTab('login'); }}
className="flex items-center justify-center gap-1.5 px-3.5 h-8.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-extrabold text-2xs uppercase tracking-wider transition shadow-md hover:scale-[1.03] duration-300"
>
<span className="material-symbols-outlined text-xs">lock</span>
{language === 'English' ? 'Portal Login' : 'உள்நுழைக'}
</button>
)}
</div>
</div>
</header>
</button>
<button 
onClick={() => setActiveView('pulse')} 
className={`text-[10px] font-black tracking-widest uppercase transition duration-300 ${activeView === 'pulse' ? 'text-emerald-400' : 'text-slate-350 hover:text-emerald-400'}`}
>
{language === 'English' ? 'Public Pulse' : 'கருத்துக்கணிப்பு'}
</button>
<button 
onClick={handleMyConstituencyClick} 
className={`text-[10px] font-black tracking-widest uppercase transition duration-300 ${activeView === 'constituency' ? 'text-emerald-400' : 'text-slate-350 hover:text-emerald-405'}`}
>
{language === 'English' ? 'My Constituency' : 'என் தொகுதி'}
</button>
<button 
onClick={handleTrackClick} 
className={`text-[10px] font-black tracking-widest uppercase transition duration-300 ${activeView === 'track' ? 'text-emerald-400' : 'text-slate-350 hover:text-emerald-405'}`}
>
{language === 'English' ? 'Track Status' : 'விசாரணை நிலை'}
</button>
<button 
onClick={() => setActiveView('gallery')} 
className={`text-[10px] font-black tracking-widest uppercase transition duration-300 ${activeView === 'gallery' ? 'text-emerald-400' : 'text-slate-350 hover:text-emerald-405'}`}
>
{language === 'English' ? 'Gallery' : 'கேலரி'}
</button>
</nav>

<div className="flex gap-2 items-center">
{/* Language Selector */}
<div className="relative">
<select

<h2 className="text-xl md:text-3xl font-black text-white/90 leading-tight drop-shadow-xl" style={{ fontFamily: "'Noto Sans Tamil', 'Manrope', sans-serif" }}>
{language === 'English' ? 'Citizen Grievance & Response Portal' : 'மக்கள் குறைதீர்ப்பு மற்றும் கருத்து தளம்'}
</h2>
<p className="text-[10px] md:text-xs font-black text-[#10b981] uppercase tracking-widest leading-none drop-shadow-md">
{language === 'English' ? 'All India Anna Dravida Munnetra Kazhagam' : 'அனைத்திந்திய அண்ணா திராவிட முன்னேற்றக் கழகம்'}
</p>
</div>

{/* Right side scroll down arrow */}
<div className="flex-shrink-0 ml-6 pb-2">
<button
onClick={() => document.getElementById('purpose-section')?.scrollIntoView({ behavior: 'smooth' })}
className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-emerald-600 hover:bg-emerald-50 text-white flex items-center justify-center shadow-2xl transition hover:scale-110 active:scale-95 animate-bounce"
title="Scroll Down"
>
<span className="material-symbols-outlined font-black text-lg md:text-xl">arrow_downward</span>
</button>
</div>
</div>
</section>
)}

{/* ─── LIGHT-THEMED CONTENT WRAPPER (LIGHT GREEN PASTEL GRADIENT) ─── */}
<div 
className="text-slate-800 relative z-20"
style={{
background: 'linear-gradient(to bottom, #f0fdf4 0%, #dcfce7 60%, #bbf7d0 100%)',
}}
</button>
)}
</div>
</div>
</header>

{/* ─── FULL-SCREEN HIGH-IMPACT HERO BANNER ─── */}
{activeView === 'home' && (
<section 
className="relative w-full h-[92vh] overflow-hidden flex flex-col justify-end"
style={{
background: 'linear-gradient(to bottom, #7ac0e6 0%, #ffffff 55%, #f47a20 100%)',
}}
>
{/* Panoramic background image positioned at the top to eliminate any black space below nav bar */}
<div 
className="absolute inset-0 z-0 bg-contain bg-top bg-no-repeat transition-transform duration-[12s] hover:scale-[1.01]"
style={{
backgroundImage: 'url("/admk_leaders_clear.png")',
imageRendering: '-webkit-optimize-contrast',
}}
/>
{/* Smooth custom gradient overlay: transitions from image orange to dark green body background */}
<div 
className="absolute inset-x-0 bottom-0 h-96 z-10" 
style={{
background: 'linear-gradient(to top, #021f0b 0%, rgba(244, 122, 32, 0.95) 45%, transparent 100%)',
}}
/>

{/* Banner Title & Scroll Arrow aligned in the gradient region */}
<div className="relative z-20 max-w-7xl mx-auto w-full px-6 pb-12 flex items-end justify-between">
{/* Left side text directly on the gradient overlay */}
<div className="text-left space-y-3 max-w-3xl">
{/* Clean 2-Line Animated Tamil Slogan (No boxes, no overlap with leader faces) */}
<AnimatedSloganText />

<h2 className="text-xl md:text-3xl font-black text-white/90 leading-tight drop-shadow-xl" style={{ fontFamily: "'Noto Sans Tamil', 'Manrope', sans-serif" }}>
{language === 'English' ? 'Citizen Grievance & Response Portal' : 'மக்கள் குறைதீர்ப்பு மற்றும் கருத்து தளம்'}
</h2>
<p className="text-[10px] md:text-xs font-black text-[#10b981] uppercase tracking-widest leading-none drop-shadow-md">
{language === 'English' ? 'All India Anna Dravida Munnetra Kazhagam' : 'அனைத்திந்திய அண்ணா திராவிட முன்னேற்றக் கழகம்'}
</p>
</div>

{/* Right side scroll down arrow */}
<div className="flex-shrink-0 ml-6 pb-2">
<button
onClick={() => document.getElementById('purpose-section')?.scrollIntoView({ behavior: 'smooth' })}
className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-emerald-600 hover:bg-emerald-50 text-white flex items-center justify-center shadow-2xl transition hover:scale-110 active:scale-95 animate-bounce"
title="Scroll Down"
>
<span className="material-symbols-outlined font-black text-lg md:text-xl">arrow_downward</span>
</button>
</div>
</div>
</section>
)}

{/* ─── LIGHT-THEMED CONTENT WRAPPER (LIGHT GREEN PASTEL GRADIENT) ─── */}
<div 
className="text-slate-800 relative z-20"
style={{
background: 'linear-gradient(to bottom, #f0fdf4 0%, #dcfce7 60%, #bbf7d0 100%)',
}}
>
{/* ─── VIEW 1: HOME (LANDING ROADMAP + GRIEVANCE FORM) ─── */}
{activeView === 'home' && (
<>
{/* ─── HOME PAGE MIDDLE SECTIONS (FULL SCREEN RALLY CROWD BACKGROUND) ─── */}
<div 
className="relative w-full py-16 px-4 md:px-6 flex flex-col items-center justify-center bg-no-repeat bg-cover bg-center bg-fixed"
style={{
backgroundImage: 'linear-gradient(rgba(2, 31, 11, 0.75), rgba(2, 31, 11, 0.82)), url("/rally_bg.jpg")',
}}
>
{/* Main Purpose Section */}
<section id="purpose-section" className="relative px-6 py-12 md:py-16 max-w-4xl mx-auto w-full flex flex-col items-center text-center gap-6 z-10">
<span className="inline-block px-4 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-xs font-black tracking-widest text-amber-400 uppercase drop-shadow-sm relative z-10">
{language === 'English' ? 'Portal Purpose' : 'தளத்தின் நோக்கம்'}
</span>
<h3 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white select-none relative z-10 drop-shadow-xl">
{language === 'English' ? 'Your Voice. Your Opinion. Your Future.' : 'உங்கள் குரல். உங்கள் கருத்து. உங்கள் எதிர்காலம்.'}
</h3>
<p className="text-sm sm:text-base md:text-lg font-medium text-slate-200 leading-relaxed max-w-2xl relative z-10 drop-shadow-md">
{language === 'English' 
? 'Share your views on public issues, governance, leadership, development, and the priorities that matter to you. This platform serves as a direct bridge to report local grievances, submit suggestions, and follow up resolution progress.' 
: 'பொதுப் பிரச்சினைகள், ஆட்சி முறைமை, கட்சித் தலைமை, பகுதி மேம்பாடு மற்றும் மக்கள் நல முன்னுரிமைகள் குறித்த உங்கள் புகார்களை மற்றும் கருத்துக்களை நேரடியாக மக்கள் பிரதிநிதிகளிடம் பகிர்ந்து எளிதாகத் தீர்வு காணுங்கள்.'}
</p>

<div className="flex flex-wrap justify-center gap-4 mt-2 relative z-10">
<button
onClick={handleGiveFeedbackClick}
className="px-8 py-3.5 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-black text-xs uppercase tracking-widest shadow-lg hover:scale-[1.03] transition-all duration-300"
>
{language === 'English' ? 'Give Feedback' : 'கருத்தைச் சமர்ப்பிக்க'}
</button>
<button
onClick={handleTrackClick}
className="px-8 py-3.5 rounded-full bg-white/90 hover:bg-white text-emerald-800 font-black text-xs uppercase tracking-widest shadow-md transition-all duration-300"
>
{language === 'English' ? 'Track Progress' : 'அறிக்கையைக் கண்காணிக்க'}
</button>
</div>
</section>

{/* Curvy S-Wave Engagement Roadmap */}
<section className="relative py-12 px-4 flex flex-col items-center gap-16 max-w-7xl mx-auto w-full z-10">
<div className="text-center space-y-3 z-10 relative">
<span className="inline-block px-4 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-xs font-black tracking-widest text-amber-400 uppercase drop-shadow-sm">
{language === 'English' ? 'Overview' : 'கண்ணோட்டம்'}
</span>
<h3 className="text-2xl md:text-4xl font-black text-white drop-shadow-xl">
{language === 'English' ? 'Citizen Engagement Roadmap' : 'குடிமக்கள் குறைதீர்ப்பு வழிமுறை'}
</h3>
<p className="text-xs text-slate-200 max-w-md mx-auto font-medium drop-shadow-md">
{language === 'English' ? 'Understand the three simple stages of feedback submission and validation.' : 'கருத்து சமர்ப்பித்தல் மற்றும் தீர்வு காணும் மூன்று எளிய படிகள்.'}
</p>
</div>

<div className="relative w-full max-w-5xl flex flex-col md:flex-row items-center justify-between gap-12 md:gap-8 z-10">
{/* SVG Connecting S-Curve Wave (Background) */}
<svg 
className="absolute inset-x-0 top-1/2 -translate-y-1/2 w-full h-24 hidden md:block pointer-events-none -z-10" 
viewBox="0 0 1000 100" 
fill="none" 
xmlns="http://www.w3.org/2000/svg"
>
<path 
d="M 160 50 C 300 0, 360 100, 500 50 C 640 0, 700 100, 840 50" 
stroke="rgba(255, 255, 255, 0.45)" 
strokeWidth="4" 
strokeDasharray="8 8"
className="animate-[dash_12s_linear_infinite]"
/>
<style>{`
@keyframes dash {
to { stroke-dashoffset: -160; }
}
`}</style>
</svg>

{/* Step 1: Track Grievance Card */}
<div className="flex-1 w-full max-w-sm rounded-[2rem] p-6 shadow-2xl border border-white/40 bg-white/95 backdrop-blur-xl flex flex-col items-center text-center gap-5 hover:scale-[1.03] transition-transform duration-300 group hover:shadow-blue-200/50 border-t-4 border-t-blue-500">
<div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 duration-300 transition-transform">
<span className="material-symbols-outlined text-3xl font-bold">lightbulb</span>
</div>
<div className="space-y-2">
<h4 className="text-base font-black text-emerald-955">{language === 'English' ? '1. Track Grievance' : '1. விசாரணை நிலை அறிதல்'}</h4>
<p className="text-xs text-slate-600 leading-relaxed">
{language === 'English'
? 'Monitor the real-time status and representative resolution notes of your query.'
: 'சமர்ப்பிக்கப்பட்ட புகாரின் தற்போதைய தீர்வு நிலை மற்றும் குறிப்புகளைக் கண்டறியவும்.'}
</p>
</div>
<button 
onClick={handleTrackClick} 
className="mt-2 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs tracking-wider uppercase transition shadow-md focus:outline-none"
>
{language === 'English' ? 'Track Grievance' : 'நிலை அறிதல்'}
</button>
</div>

{/* Step 2: File a Grievance Card */}
<div className="flex-1 w-full max-w-sm rounded-[2rem] p-6 shadow-2xl border border-white/40 bg-white/95 backdrop-blur-xl flex flex-col items-center text-center gap-5 hover:scale-[1.03] transition-transform duration-300 group hover:shadow-emerald-200/50 border-t-4 border-t-emerald-500">
<div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-255 text-emerald-600 flex items-center justify-center group-hover:scale-110 duration-300 transition-transform">
<span className="material-symbols-outlined text-3xl font-bold">mail</span>
</div>
<div className="space-y-2">
<h4 className="text-base font-black text-emerald-955">{language === 'English' ? '2. File a Grievance' : '2. குறை சமர்ப்பித்தல்'}</h4>
<p className="text-xs text-slate-600 leading-relaxed">
src="/eps_slide.jpg" 
className="w-full h-full object-cover object-center" 
alt="EPS Portrait"
onError={(e) => { e.currentTarget.src = "/rally_bg.jpg"; }}
/>
<div className="hidden lg:block absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#021207] to-transparent z-10"></div>
</div>
</div>

{/* Arrow navigation buttons overlay */}
<button
onClick={() => setActiveSlide(prev => (prev - 1 + 3) % 3)}
className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-slate-900/60 border border-white/10 hover:border-emerald-500/30 text-white flex items-center justify-center transition active:scale-90"
>
<span className="material-symbols-outlined font-black text-base">chevron_left</span>
</button>
<button
onClick={() => setActiveSlide(prev => (prev + 1) % 3)}
className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-slate-900/60 border border-white/10 hover:border-emerald-500/30 text-white flex items-center justify-center transition active:scale-90"
>
<span className="material-symbols-outlined font-black text-base">chevron_right</span>
</button>

{/* Bottom Dot indicators overlay */}
<div className="absolute bottom-6 left-6 z-30 flex items-center gap-2">
{[0, 1, 2].map((idx) => (
<button
key={idx}
onClick={() => setActiveSlide(idx)}
className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${activeSlide === idx ? 'bg-amber-400 scale-125' : 'bg-white/40 hover:bg-white/60'}`}
/>
))}
</div>
</section>
{/* 2. 1972 SECTION */}
>
{language === 'English' ? '[ EXPLORE 1972 ]' : '[ 1972-ஐ ஆராயுங்கள் ]'}
</button>
</div>
</div>

{/* Creative Hero Visual Block */}
<div className="relative group">
<div className="absolute inset-0 bg-emerald-500/10 rounded-3xl filter blur-2xl group-hover:bg-emerald-500/20 transition duration-500"></div>
<div className="relative rounded-3xl overflow-hidden border border-white/10 bg-slate-900 shadow-2xl transition duration-500 group-hover:scale-[1.02]">
<img 
src="/legacy_bg_1972.png" 
className="w-full h-80 object-cover object-center filter grayscale contrast-125"
alt="Early MGR" 
onError={(e) => { e.target.src = "/rally_bg.jpg"; }}
/>
<div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent">
<span className="text-[10px] font-black text-amber-400 tracking-widest uppercase">
{language === 'English' ? 'Early MGR / Party Formation' : 'கழகத் தொடக்கக் காலம்'}
</span>
<p className="text-xs text-slate-300 font-medium mt-1">
{language === 'English' ? 'Historic movement and cadre unity imagery.' : 'வரலாற்று சிறப்புமிக்க மக்கள் புரட்சி.'}
</p>
</div>
</div>
</div>
</div>
</section>

{/* 3. MGR SECTION */}
<section 
id="legacy-mgr"
className="w-full py-20 px-4 md:px-8 bg-slate-900/30 relative"
>
<div className="max-w-6xl mx-auto space-y-12">
<div className="text-center space-y-3">
<span className="text-xs font-black tracking-widest text-emerald-400 uppercase">
{language === 'English' ? 'MGR' : 'எம்.ஜி.ஆர்'}
</span>
<h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
{language === 'English' ? 'THE FOUNDER' : 'நிறுவனர்'}
</h3>
<p className="text-sm sm:text-base font-bold text-amber-400 italic max-w-xl mx-auto">
{language === 'English' ? "A LEADER WHO TURNED POPULARITY INTO A PEOPLE'S MOVEMENT." : "பிரபலத்தை மக்கள் இயக்கமாக மாற்றிய மக்கள் தலைவர்."}
</p>
</div>

<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
<div className="lg:col-span-7 flex flex-col justify-center space-y-6">
<div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
<p>
{language === 'English'
? "MGR's relationship with the people extended far beyond cinema. His public image, political journey and emphasis on welfare helped create a movement capable of reaching communities across Tamil Nadu."
: "மக்களுடனான எம்.ஜி.ஆரின் தொடர்பு திரையுலகையும் தாண்டியது. அவரது மக்கள் செல்வாக்கு, அரசியல் பயணம் மற்றும் மக்கள் நலனில் காட்டிய அக்கறை ஆகியவை தமிழகத்தின் அனைத்துப் பகுதிகளையும் சென்றடையும் ஒரு பேரியக்கத்தை உருவாக்க உதவின."}
</p>
<p>
{language === 'English'
? "In 1977, AIADMK formed the government in Tamil Nadu for the first time, with MGR becoming Chief Minister."
: "1977-இல், அதிமுக முதன்முறையாக தமிழகத்தில் ஆட்சி அமைத்தது, எம்.ஜி.ஆர் அவர்கள் முதலமைச்சராகப் பொறுப்பேற்றார்."}
</p>
<p>
{language === 'English'
? "Electoral mandates followed again in 1980 and 1984, making his leadership an era that firmly established the movement in Tamil Nadu politics."
: "1980 மற்றும் 1984-இல் தொடர் வெற்றிகள் மூலம், அவரது தலைமை தமிழக அரசியலில் இந்த இயக்கத்தை ஒரு நிரந்தர சக்தியாக நிலைநிறுத்தியது."}
</p>
</div>

<div className="pt-2">
<p className="text-xs font-black text-slate-400 uppercase tracking-wide">
{language === 'English' ? "His years in government strengthened the movement's association with welfare and policies aimed at ordinary households." : "அவரது ஆட்சிக் காலம் ஏழை எளிய குடும்பங்களை மையமாகக் கொண்ட மக்கள் நலத் திட்டங்களுக்கும் பேரியக்கத்திற்கும் இடையிலான பிணைப்பை மேலும் வலுப்படுத்தியது."}
</p>
<p className="text-sm font-black text-amber-400 uppercase tracking-widest mt-4">
{language === 'English' ? "MGR DIDN'T JUST BEGIN A PARTY. HE BUILT THE FOUNDATION OF AN ERA." : "எம்.ஜி.ஆர் ஒரு கட்சியை மட்டும் தொடங்கவில்லை. ஒரு புதிய யுகத்தின் அடித்தளத்தை அமைத்தார்."}
</p>
</div>
</div>

{/* Interactive milestones card block */}
<div className="lg:col-span-5 flex flex-col gap-4">
{[
{ year: '1972', title: language === 'English' ? 'THE MOVEMENT' : 'பேரியக்கம்', desc: language === 'English' ? 'AIADMK party founded' : 'அதிமுக தொடங்கப்பட்டது' },
{ year: '1977', title: language === 'English' ? 'THE MANDATE' : 'ஆட்சிப் பொறுப்பு', desc: language === 'English' ? 'First government victory, CM oath' : 'முதல் மாபெரும் ஆட்சி வெற்றி' },
{ year: '1980', title: language === 'English' ? 'THE CONTINUITY' : 'தொடர்ச்சி', desc: language === 'English' ? 'Re-elected with strong support' : 'அடுத்தடுத்து அரசு நிர்வாகத் தொடர்ச்சி' },
{ year: '1984', title: language === 'English' ? 'THE THIRD VICTORY' : 'மூன்றாவது வெற்றி', desc: language === 'English' ? 'Historic third assembly sweep' : 'சட்டமன்றத் தேர்தலில் 3-வது வெற்றி' }
].map((card, idx) => (
<div 
key={idx}
className="p-5 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-between hover:border-emerald-500/20 transition group"
>
<div className="space-y-1">
<span className="text-3xs font-black text-emerald-400 uppercase tracking-widest">{card.title}</span>
<h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition">{card.desc}</h4>
</div>
<span className="text-2xl font-black text-slate-700 group-hover:text-emerald-500 font-mono tracking-tighter transition">{card.year}</span>
</div>
))}
</div>
</div>

<div className="pt-6 text-center">
<button
onClick={() => document.getElementById('legacy-crossroads')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white text-xs font-black uppercase tracking-wider border border-white/5 hover:border-white/15 transition active:scale-95"
>
{language === 'English' ? '[ EXPLORE THE MGR ERA ]' : '[ எம்.ஜி.ஆர் காலத்தை ஆராயுங்கள் ]'}
})}
</div>
)}
</section>
)}

{/* ─── VIEW 5: TRACK GRIEVANCE (FULL SCREEN RALLY BACKGROUND) ─── */}
{activeView === 'track' && (
<div 
className="relative w-full min-h-[85vh] py-16 px-4 flex items-center justify-center bg-no-repeat bg-cover bg-center bg-fixed"
style={{
backgroundImage: 'linear-gradient(rgba(2, 31, 11, 0.70), rgba(2, 31, 11, 0.78)), url("/rally_bg.jpg")',
}}
>
<section className="max-w-3xl mx-auto w-full animate-fadeIn z-10 relative">
<div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-10 border border-white/40 shadow-2xl space-y-8">

{/* Header Info */}
<div className="border-b border-emerald-50 pb-4 flex items-center gap-3">
<div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
<span className="material-symbols-outlined text-2xl font-bold">radar</span>
</div>
<div>
<h3 className="text-xl font-black text-emerald-955">{language === 'English' ? 'Track Grievance' : 'புகார் விசாரணை நிலை'}</h3>
<p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">{language === 'English' ? 'Real-Time Resolution Tracking' : 'நிகழ்நேர விசாரணை கண்காணிப்பு'}</p>
</div>
</div>

{/* Tracking Query input Form */}
<form id="search-track-form" onSubmit={handleTrackGrievance} className="flex gap-3">
<input
type="text"
required
value={trackId}
onChange={(e) => setTrackId(e.target.value)}
<button
onClick={() => setDashboardSubTab('news_inbox')}
className={`px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${dashboardSubTab === 'news_inbox' ? 'bg-emerald-700 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
>
<span>{language === 'English' ? 'ADMK News Inbox' : 'செய்திகள் இன்பாக்ஸ்'}</span>
{newsInbox.length > 0 && (
<span className="w-5 h-5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
{newsInbox.length}
</span>
)}
</button>
<button
onClick={() => setDashboardSubTab('manage_gallery')}
className={`px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${dashboardSubTab === 'manage_gallery' ? 'bg-emerald-700 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
>
<span>{language === 'English' ? 'Manage Gallery' : 'கேலரி மேலாண்மை'}</span>
</button>
<button
onClick={() => setDashboardSubTab('manage_legacy')}
</div>

{/* Dashboard Sub-Tabs */}
<div className="flex flex-wrap justify-center gap-4 mb-10">
<button
onClick={() => setDashboardSubTab('grievances')}
className={`px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-wider transition-all ${dashboardSubTab === 'grievances' ? 'bg-emerald-700 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
>
{language === 'English' ? 'Grievance Dashboard' : 'மனுக்கள் மேலாண்மை'}
</button>
<button
onClick={() => setDashboardSubTab('news_inbox')}
className={`px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${dashboardSubTab === 'news_inbox' ? 'bg-emerald-700 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
>
<span>{language === 'English' ? 'ADMK News Inbox' : 'செய்திகள் இன்பாக்ஸ்'}</span>
/>
</div>

<div>
<label className="block text-xs font-bold text-emerald-955 mb-1.5 uppercase">{language === 'English' ? 'Expected Solution' : 'எதிர்பார்க்கும் தீர்வு'}</label>
<textarea
rows="2"
value={expectedSolution}
onChange={(e) => setExpectedSolution(e.target.value)}
placeholder="Describe how this issue can be resolved..."
className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-emerald-100 text-slate-800 text-xs focus:ring-1 focus:ring-emerald-600 focus:bg-white outline-none resize-none"
/>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
{/* Rating Star Selection */}
<div>
<label className="block text-xs font-bold text-emerald-955 mb-1.5 uppercase">{language === 'English' ? 'Overall Rating' : 'மதிப்பீடு'}</label>
<div className="flex items-center gap-2 h-10">
{[1, 2, 3, 4, 5].map((star) => (
<button
type="button"
key={star}
onClick={() => setRating(star)}
className="text-amber-400 hover:scale-110 transition-transform focus:outline-none"
>
<span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: ` 'FILL' ${rating >= star ? 1 : 0}` }}>star</span>
</button>
))}
</div>
</div>
<span className="text-xl font-black text-blue-600 mt-1 block">
{constituencyFeedbacks.filter(f => f.status === 'Pending').length}
</span>
</div>
<div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm text-center">
<span className="text-3xs text-slate-400 font-extrabold uppercase block">{language === 'English' ? 'Resolved' : 'தீர்க்கப்பட்டவை'}</span>
<span className="text-xl font-black text-green-700 mt-1 block">
{constituencyFeedbacks.filter(f => f.status === 'Resolved').length}
</span>
</div>
<div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm text-center">
<span className="text-3xs text-slate-400 font-extrabold uppercase block">{language === 'English' ? 'Duplicate Warnings' : 'நகல் எச்சரிக்கைகள்'}</span>
<span className="text-xl font-black text-orange-600 mt-1 block">
{constituencyFeedbacks.filter(f => f.status === 'Duplicate').length}
</span>
</div>
</div>

{/* Feedbacks complaints list */}
{leaderLoading ? (
<div className="text-center py-8 text-slate-500 font-medium">
{language === 'English' ? 'Loading constituency records...' : 'தரவுகளைப் பெறுகிறது...'}
</div>
) : constituencyFeedbacks.length === 0 ? (
<div className="text-center py-10 bg-white rounded-3xl border border-slate-100 text-slate-500 font-medium max-w-3xl mx-auto shadow-md">
{language === 'English' ? 'No complaints registered in this constituency yet.' : 'இந்த தொகுதியில் இதுவரை புகார்கள் எதுவும் பதிவு செய்யப்படவில்லை.'}
</div>
) : (
<div className="max-w-4xl mx-auto space-y-4">
{constituencyFeedbacks.map((complaint) => (
<div key={complaint._id} className="bg-white rounded-3xl border border-slate-100 shadow-md p-6 space-y-4 hover:shadow-lg transition-shadow">
<div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-50 pb-3">
<div className="flex items-center gap-2">
<span className="px-2.5 py-0.5 rounded text-3xs font-extrabold uppercase bg-emerald-50 text-emerald-800 border border-emerald-100">
{complaint.type_of_feedback}
</span>
<span className={`px-2 py-0.5 rounded text-3xs font-extrabold uppercase ${complaint.importance === 'Critical' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-slate-50 text-slate-600 border border-slate-100'}`}>
{complaint.importance}
</span>
</div>
<span className="text-3xs text-slate-400 font-bold">{new Date(complaint.created_at).toLocaleDateString()}</span>
</div>
<div>
<h4 className="text-base font-bold text-slate-800 leading-snug">{complaint.feedback_title}</h4>
<p className="text-xs text-slate-655 mt-1 leading-relaxed font-medium">{complaint.feedback_text}</p>
</div>
{complaint.solution && (
<div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
<span className="text-2xs font-extrabold uppercase text-slate-400 block">{language === 'English' ? 'Expected Solution' : 'எதிர்பார்க்கும் தீர்வு'}</span>
<p className="text-slate-600 font-medium mt-0.5">{complaint.solution}</p>
</div>
)}
<div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-50 pt-3">
<span className="text-3xs font-bold text-slate-400">ID: {complaint.tracking_id}</span>
<div className="flex items-center gap-2">
<span className={`px-3 py-1 rounded-full text-3xs font-black uppercase ${complaint.status === 'Resolved' ? 'bg-green-100 text-green-700' : complaint.status === 'Duplicate' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
{complaint.status}
</span>
</div>
</div>
)}

</div>
</section>
</div>
)}

{/* ─── VIEW 6: MY CONSTITUENCY (LEADER/ADMIN DASHBOARD FILTER) ─── */}
{activeView === 'constituency' && userRole === 'admin' && (
<section className="py-16 px-6 max-w-6xl mx-auto w-full animate-fadeIn min-h-[60vh]">
<div className="text-center space-y-3 mb-8">
<span className="text-xs font-black tracking-widest text-emerald-700 uppercase">{language === 'English' ? 'Leadership Review Desk' : 'தலைமை ஆய்வு தளம்'}</span>
<h3 className="text-3xl font-black text-emerald-955">{language === 'English' ? 'Constituency Grievance Monitoring' : 'தொகுதி வாரியாக கோரிக்கைகள்'}</h3>
<p className="text-xs text-slate-550 max-w-md mx-auto">{language === 'English' ? 'Select your local constituency area to view problems logged by local residents.' : 'தொகுதியைத் தேர்ந்தெடுத்து அப்பகுதி மக்கள் எழுப்பியுள்ள பிரச்சினைகளைக் கண்டறியவும்.'}</p>
</div>
)}

{/* ─── VIEW 6: MY CONSTITUENCY (LEADER/ADMIN DASHBOARD FILTER) ─── */}
{activeView === 'constituency' && userRole === 'admin' && (
<div 
className="relative w-full min-h-[95vh] py-16 px-4 md:px-6 flex flex-col items-center justify-center bg-no-repeat bg-cover bg-center bg-fixed"
style={{
backgroundImage: 'linear-gradient(rgba(2, 31, 11, 0.70), rgba(2, 31, 11, 0.78)), url("/rally_bg.jpg")',
}}
>
<section className="max-w-6xl mx-auto w-full animate-fadeIn z-10 relative">
<div className="text-center space-y-3 mb-8">
<span className="text-xs font-black tracking-widest text-amber-400 uppercase drop-shadow-sm">{language === 'English' ? 'Leadership Review Desk' : 'தலைமை ஆய்வு தளம்'}</span>
<h3 className="text-3xl sm:text-4xl font-black text-white drop-shadow-lg">{language === 'English' ? 'Constituency Grievance Monitoring' : 'தொகுதி வாரியாக கோரிக்கைகள்'}</h3>
<p className="text-xs text-slate-200 max-w-md mx-auto font-medium leading-relaxed drop-shadow-md">{language === 'English' ? 'Select your local constituency area to view problems logged by local residents.' : 'தொகுதியைத் தேர்ந்தெடுத்து அப்பகுதி மக்கள் எழுப்பியுள்ள பிரச்சினைகளைக் கண்டறியவும்.'}</p>
</div>

{/* Dashboard Sub-Tabs */}
{userRole !== 'admin' && (
<div className="flex flex-wrap justify-center gap-4 mb-10">
<button
onClick={() => setDashboardSubTab('grievances')}
className={`px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-wider transition-all ${dashboardSubTab === 'grievances' ? 'bg-emerald-700 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
>
{language === 'English' ? 'Grievance Dashboard' : 'மனுக்கள் மேலாண்மை'}
</button>
<button
onClick={() => setDashboardSubTab('news_inbox')}
className={`px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${dashboardSubTab === 'news_inbox' ? 'bg-emerald-700 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
>
<span>{language === 'English' ? 'ADMK News Inbox' : 'செய்திகள் இன்பாக்ஸ்'}</span>
{newsInbox.length > 0 && (
<span className="w-5 h-5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
{newsInbox.length}
</span>
)}
</button>
<button
onClick={() => setDashboardSubTab('manage_gallery')}
className={`px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${dashboardSubTab === 'manage_gallery' ? 'bg-emerald-700 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
>
<span>{language === 'English' ? 'Manage Gallery' : 'கேலரி மேலாண்மை'}</span>
</button>
<button
onClick={() => setDashboardSubTab('manage_legacy')}
className={`px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${dashboardSubTab === 'manage_legacy' ? 'bg-emerald-700 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
>
<span>{language === 'English' ? 'Manage Legacy' : 'சாதனைகள் மேலாண்மை'}</span>
</button>
</div>
)}

{dashboardSubTab === 'grievances' && (
<>
{/* Selector form inputs */}
</option>
))}
</select>
</div>

<div>
<label className="block text-2xs font-bold text-emerald-955 mb-1.5 uppercase">{language === 'English' ? 'Assembly Constituency' : 'சட்டமன்றத் தொகுதி'}</label>
<select
value={leaderConstituency}
onClick={() => {
navigator.clipboard.writeText(submissionResult.tracking_id);
Swal.fire({ title: 'Copied!', text: 'Tracking ID copied to clipboard', icon: 'success', timer: 1200, showConfirmButton: false });
}}
className="p-2.5 rounded-xl bg-white hover:bg-emerald-100 text-emerald-700 transition shadow-sm"
title="Copy ID"
>
<span className="material-symbols-outlined text-sm font-bold">content_copy</span>
</button>
</div>

<div className="pt-6 flex flex-wrap justify-center gap-4">
<button
onClick={() => {
setTrackId(submissionResult.tracking_id);
setActiveView('track');
// Pre-trigger search
setTimeout(() => {
document.getElementById('search-track-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
}, 150);
}}
className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider shadow-md"
>
{language === 'English' ? 'Track Grievance Status' : 'விசாரணை நிலை அறிதல்'}
</button>
<button
onClick={() => {
// Reset state and return to Step 1
setFeedbackTitle('');
setFeedbackText('');
setExpectedSolution('');
setSelectedCategory('');
setAttachedFile(null);
setSubmissionResult(null);
setFormStep(1);
}}
className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 font-bold text-xs uppercase"
>
{language === 'English' ? 'File Another Grievance' : 'மற்றொரு புகார்'}
</button>
</div>
</div>
)}

</div>
)}
</section>
</div>
)}

{/* ─── VIEW 2: PUBLIC PULSE (FULL SCREEN RALLY CROWD BACKGROUND) ─── */}
{activeView === 'pulse' && (
<div 
className="relative w-full min-h-[90vh] py-16 px-4 md:px-6 flex flex-col items-center justify-center bg-no-repeat bg-cover bg-center bg-fixed"
style={{
backgroundImage: 'linear-gradient(rgba(2, 31, 11, 0.70), rgba(2, 31, 11, 0.78)), url("/rally_bg.jpg")',
}}
>
<section className="max-w-6xl mx-auto w-full animate-fadeIn z-10 relative">
{/* Header Title */}
<div className="text-center space-y-3 mb-12">
<span className="inline-block px-4 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-xs font-black tracking-widest text-amber-400 uppercase drop-shadow-sm">
{language === 'English' ? 'Latest Press Releases' : 'செய்தி வெளியீடுகள்'}
</span>
<h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-xl">
{language === 'English' ? 'Public Pulse' : 'கருத்துக்கணிப்பு & செய்தி'}
</h3>
<p className="text-xs md:text-sm text-slate-200 max-w-md mx-auto font-medium leading-relaxed drop-shadow-md">
{language === 'English' ? 'Official statements, notices, and campaign news directly from the leadership desk.' : 'கட்சித் தலைமைகளின் அறிவிப்புகள் மற்றும் பிரச்சார நிகழ்வுகள்.'}
</p>
</div>

{pressReleasesLoading ? (
<div className="flex flex-col items-center justify-center py-20 gap-4">
<svg className="animate-spin h-10 w-10 text-emerald-400" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
<p className="text-xs font-black text-slate-200 uppercase tracking-widest">{language === 'English' ? 'Fetching News Feed...' : 'செய்திகளைப் பெறுகிறது...'}</p>
</div>
) : pressReleases.length === 0 ? (
<div className="text-center py-20 bg-white/95 rounded-[2rem] border border-white/40 shadow-xl">
<span className="material-symbols-outlined text-4xl text-emerald-500 animate-pulse">feed</span>
<p className="text-xs text-slate-600 mt-2 font-black uppercase tracking-wider">{language === 'English' ? 'No Press Releases Found' : 'செய்தி குறிப்புகள் எதுவும் இல்லை'}</p>
</div>
) : (
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
{pressReleases.map(item => (
<div key={item._id || item.id} className="bg-white/95 backdrop-blur-xl rounded-[2rem] overflow-hidden border border-white/40 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between">
{/* News Banner Image */}
<div className="w-full h-44 bg-slate-100 relative overflow-hidden flex-shrink-0 border-b border-slate-100">
<img
src={item.image_url || '/admk_leaders_clear.png'}
className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
alt={item.title_en || 'News Graphic'}
onError={(e) => { e.target.src = '/admk_leaders.jpg'; }}
/>
</div>
<div className="p-6 flex-1 flex flex-col justify-between space-y-4">
<div className="flex items-center justify-between">
<span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-extrabold text-[9px] uppercase tracking-wider">
{language === 'English' ? item.tag_en : item.tag_ta}
</span>
<span className="text-slate-400 text-2xs">{item.date}</span>
</div>
<div className="flex items-start gap-3">
<span className="text-2xl">{item.icon}</span>
<h4 className="text-base font-bold text-slate-800 leading-tight">
{language === 'English' ? item.title_en : item.title_ta}
</h4>
</div>
<p className="text-xs text-slate-550 leading-relaxed font-medium line-clamp-3">
{language === 'English' ? item.desc_en : item.desc_ta}
</p>
</div>
<div className="p-6 border-t border-slate-50 bg-slate-50/50 flex items-center justify-between">
<div>
{item.source_link && item.source_link.startsWith('http') && (
<a 
href={item.source_link} 
target="_blank" 
rel="noopener noreferrer" 
className="text-3xs font-extrabold text-blue-600 uppercase tracking-widest hover:underline hover:text-blue-750"
>
{language === 'English' ? 'Source ↗' : 'மூலம் ↗'}
</a>
)}
</div>

<div className="flex items-center gap-3">
<button
onClick={() => Swal.fire({ 
title: language === 'English' ? item.title_en : item.title_ta, 
html: `<div class="text-left text-xs leading-relaxed font-medium text-slate-600">
<p>${language === 'English' ? item.desc_en : item.desc_ta}</p>
</div>`, 
icon: 'info', 
confirmButtonColor: '#047857' 
})}
className="text-2xs font-extrabold text-emerald-700 uppercase tracking-widest hover:text-emerald-800"
>
{language === 'English' ? 'Read Full ➔' : 'பார் ➔'}
</button>
</div>
</div>
</div>
))}
</div>
)}
</section>
</div>
)}

{activeView === 'legacy' && (
<div className="relative w-full min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-600 selection:text-white">

{/* Legacy Sub-Tab Switcher */}
<div className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-white/5 py-4 px-4 flex justify-center items-center gap-4">
<button
onClick={() => {
setLegacySubView('history');
window.scrollTo({ top: 0, behavior: 'smooth' });
}}
className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition ${legacySubView === 'history' ? 'bg-emerald-700 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'}`}
>
{language === 'English' ? 'History & Eras' : 'வரலாறு & காலங்கள்'}
</button>
<button
onClick={() => {
setLegacySubView('schemes');
window.scrollTo({ top: 0, behavior: 'smooth' });
}}
className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition ${legacySubView === 'schemes' ? 'bg-emerald-700 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'}`}
>
{language === 'English' ? 'Schemes & Achievements' : 'திட்டங்கள் & சாதனைகள்'}
</button>
</div>

))}
</div>
)}
</section>
</div>
)}

{activeView === 'legacy' && (
<div className="relative w-full min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-600 selection:text-white">

{/* Legacy Sub-Tab Switcher */}
<div className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-white/5 py-4 px-4 flex justify-center items-center gap-4">
<button
onClick={() => {
setLegacySubView('history');
window.scrollTo({ top: 0, behavior: 'smooth' });
}}
className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition ${legacySubView === 'history' ? 'bg-emerald-700 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'}`}
>
{language === 'English' ? 'History & Eras' : 'வரலாறு & காலங்கள்'}
</button>
<button
onClick={() => {
setLegacySubView('schemes');
window.scrollTo({ top: 0, behavior: 'smooth' });
}}
className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition ${legacySubView === 'schemes' ? 'bg-emerald-700 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'}`}
>
{language === 'English' ? 'Schemes & Achievements' : 'திட்டங்கள் & சாதனைகள்'}
</button>
</div>
</div>
))}
</div>
)}
</section>
</div>
)}

{activeView === 'legacy' && (
<div className="relative w-full min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-600 selection:text-white">

{/* Legacy Sub-Tab Switcher */}
<div className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-white/5 py-4 px-4 flex justify-center items-center gap-4">
<button
onClick={() => {
setLegacySubView('history');
window.scrollTo({ top: 0, behavior: 'smooth' });
}}
className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition ${legacySubView === 'history' ? 'bg-emerald-700 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'}`}
>
{language === 'English' ? 'History & Eras' : 'வரலாறு & காலங்கள்'}
</button>
<button
onClick={() => {
setLegacySubView('schemes');
window.scrollTo({ top: 0, behavior: 'smooth' });
}}
className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition ${legacySubView === 'schemes' ? 'bg-emerald-700 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'}`}
>
{language === 'English' ? 'Schemes & Achievements' : 'திட்டங்கள் & சாதனைகள்'}
</button>
</div>

{/* ────────────────────────────────────────────────────────── */}
{/* SUB-VIEW 1: HISTORY TIMELINE VIEW */}
{/* ────────────────────────────────────────────────────────── */}
{legacySubView === 'history' && (
<div className="animate-fadeIn">
{/* Sticky Sidebar Nav for Desktop */}
<div className="hidden lg:flex flex-col fixed right-8 top-1/2 -translate-y-1/2 z-50 bg-slate-900/60 backdrop-blur-md border border-white/5 py-4 px-3 rounded-full gap-3 shadow-2xl">
{[
{ id: 'legacy-hero', label: language === 'English' ? 'Intro' : 'அறிமுகம்' },
{ id: 'legacy-1972', label: '1972' },
{ id: 'legacy-mgr', label: language === 'English' ? 'MGR' : 'எம்.ஜி.ஆர்' },
{ id: 'legacy-crossroads', label: language === 'English' ? 'Crossroads' : 'திருப்புமுனை' },
{ id: 'legacy-amma', label: language === 'English' ? 'Amma' : 'அம்மா' },
{ id: 'legacy-turningpoint', label: '2016' },
{ id: 'legacy-eps', label: language === 'English' ? 'EPS' : 'இ.பி.எஸ்' },
{ id: 'legacy-summary', label: language === 'English' ? 'Summary' : 'சுருக்கம்' },
{ id: 'legacy-symbol', label: language === 'English' ? 'Symbol' : 'சின்னம்' },
{ id: 'legacy-achievements', label: language === 'English' ? 'Governance' : 'ஆளுமை' },
{ id: 'legacy-timeline', label: language === 'English' ? 'Timeline' : 'காலவரிசை' },
{ id: 'legacy-people', label: language === 'English' ? 'People' : 'மக்கள்' },
{ id: 'legacy-generations', label: language === 'English' ? 'Generations' : 'தலைமுறைகள்' }
].map((item) => (
<button
key={item.id}
onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
className="group relative flex items-center justify-center w-3.5 h-3.5 rounded-full bg-slate-700/65 hover:bg-emerald-400 transition"
>
<span className="absolute right-7 py-1 px-2.5 rounded-lg bg-slate-900 border border-white/10 text-3xs font-black uppercase tracking-wider text-emerald-400 opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none whitespace-nowrap shadow-md">
{item.label}
</span>
</button>
))}
</div>

{/* 1. HERO SECTION */}
<section 
id="legacy-hero"
className="relative w-full md:h-[calc(100vh-140px)] md:min-h-[550px] flex flex-col items-center justify-start px-4 md:px-8 pt-6 md:pt-10 pb-6 bg-no-repeat bg-cover bg-center"
style={{
backgroundImage: 'linear-gradient(rgba(2, 31, 11, 0.88), rgba(0, 12, 4, 0.96)), url("/rally_bg.jpg")',
}}
>
{/* Floating Fixed Watermark */}
<div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none select-none z-0">
<img src="/irratai_ellai.png" className="w-[80vw] max-w-[600px] h-auto object-contain animate-pulse" alt="watermark" />
</div>

<div className="max-w-4xl mx-auto text-center z-10 space-y-5">
{/* Title with typewriter effect and smooth typing cursor caret */}
<div className="space-y-4">
<h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight uppercase drop-shadow-2xl min-h-[50px] sm:min-h-[90px] flex items-center justify-center" style={{ whiteSpace: 'pre-wrap' }}>
<span>{typedTitle}</span>
{!titleTypingDone && (
<span className="inline-block ml-1 w-1 h-10 sm:h-16 bg-emerald-400 animate-pulse">|</span>
)}
</h1>
</div>

{/* Remaining details only visible and animated once typing completes */}
{titleTypingDone && (
<div className="space-y-4">
{/* Subtitle - Stage 1 Flash Reveal */}
</div>

{/* Buttons - Stage 4 Flash Reveal */}
<div className="pt-8 flex flex-wrap justify-center gap-4 animate-flashReveal delay-700">
<button
onClick={() => document.getElementById('legacy-1972')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
className="px-8 py-4 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-black text-xs uppercase tracking-widest hover:from-emerald-500 hover:to-emerald-600 shadow-xl active:scale-95 transition-all duration-300 animate-bounce"
>
{language === 'English' ? '[ EXPLORE THE JOURNEY ]' : '[ பயணத்தை ஆராயுங்கள் ]'}
</button>
<button
onClick={() => {
setLegacySubView('schemes');
window.scrollTo({ top: 0, behavior: 'smooth' });
}}
className="px-8 py-4 rounded-full bg-slate-900 border border-white/10 hover:border-white/20 text-amber-400 hover:text-amber-300 font-black text-xs uppercase tracking-widest active:scale-95 transition-all"
>
{language === 'English' ? '[ EXPLORE SCHEMES & ACHIEVEMENTS ]' : '[ திட்டங்கள் & சாதனைகள் ]'}
</button>
<span className="px-5 py-2.5 rounded-xl btn-mgr-flag transition duration-300">{language === 'English' ? 'MGR' : 'எம்.ஜி.ஆர்'}</span>
<span className="text-amber-400 font-normal">•</span>
<span className="px-5 py-2.5 rounded-xl btn-amma-flag transition duration-300">{language === 'English' ? 'AMMA' : 'அம்மா'}</span>
<span className="text-amber-400 font-normal">•</span>
<span className="px-5 py-2.5 rounded-xl btn-eps-flag transition duration-300">{language === 'English' ? 'EPS' : 'இ.பி.எஸ்'}</span>
</div>

<p className="text-xs font-black uppercase text-slate-400 tracking-wider">
{language === 'English' ? 'Three Chapters. One Continuing Movement.' : 'மூன்று அத்தியாயங்கள். ஒரு தொடர் பேரியக்கம்.'}
</p>
</div>

{/* Buttons - Stage 4 Flash Reveal */}
<div className="pt-8 flex flex-wrap justify-center gap-4 animate-slideRevealLeft delay-1050">
<button
onClick={() => document.getElementById('legacy-1972')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
className="px-8 py-4 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-black text-xs uppercase tracking-widest hover:from-emerald-500 hover:to-emerald-600 shadow-xl active:scale-95 transition-all duration-300 animate-bounce"
>
{language === 'English' ? '[ EXPLORE THE JOURNEY ]' : '[ பயணத்தை ஆராயுங்கள் ]'}
</button>
<button
onClick={() => {
setLegacySubView('schemes');
window.scrollTo({ top: 0, behavior: 'smooth' });
}}
className="px-8 py-4 rounded-full bg-slate-900 border border-white/10 hover:border-white/20 text-amber-400 hover:text-amber-300 font-black text-xs uppercase tracking-widest active:scale-95 transition-all"
>
{language === 'English' ? '[ EXPLORE SCHEMES & ACHIEVEMENTS ]' : '[ திட்டங்கள் & சாதனைகள் ]'}
</button>
</div>
</div>
)}
</div>
</section>

{/* 2. 1972 SECTION */}
<section 
id="legacy-1972"
className="w-full py-20 px-4 md:px-8 bg-slate-950 border-t border-white/5 relative"
>
<div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
<div className="space-y-6">
<span className="text-5xl sm:text-7xl font-black text-emerald-500 font-mono tracking-tight block">1972</span>
<h3 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
{language === 'English' ? 'WHERE THE JOURNEY BEGAN' : 'பயணம் தொடங்கிய இடம்'}
</h3>
<div className="space-y-4 text-slate-350 text-sm sm:text-base leading-relaxed">
<p>
{language === 'English'
? "On 17 October 1972, Puratchi Thalaivar M.G. Ramachandran founded the movement that would grow into the All India Anna Dravida Munnetra Kazhagam."
: "1972 அக்டோபர் 17 அன்று, புரட்சித் தலைவர் எம்.ஜி. ராமச்சந்திரன் அவர்களால் அனைத்திந்திய அண்ணா திராவிட முன்னேற்றக் கழகம் என்ற பேரியக்கம் தோற்றுவிக்கப்பட்டது."}
</p>
<p className="font-bold text-white border-l-4 border-amber-400 pl-4 py-1.5 my-4 bg-slate-900/40 rounded-r-xl">
{language === 'English' ? "A new political force had entered Tamil Nadu." : "ஒரு புதிய அரசியல் சக்தி தமிழகத்தில் காலடி எடுத்து வைத்தது."}
</p>
<p>
{language === 'English'
? "Built around a leader with an extraordinary connection to ordinary people, the movement rapidly developed its own identity and support base."
: "ஏழை எளிய மக்களுடன் ஆழமான தார்மீகத் தொடர்பைக் கொண்ட ஒரு உன்னதத் தலைவரைச் சுற்றி உருவான இந்த இயக்கம், மிக விரைவாகத் தனக்கென ஒரு தனித்துவ அடையாளத்தையும் ஆதரவுத் தளத்தையும் வளர்த்துக் கொண்டது."}
</p>
<p>
{language === 'English'
? "What began in 1972 would go on to shape decades of Tamil Nadu's political history."
: "1972-இல் தொடங்கிய இப்பயணம் தமிழக அரசியல் வரலாற்றின் தசாப்தங்களை வடிவமைத்தது."}
</p>
</div>
<div className="text-sm font-black tracking-widest text-amber-400 uppercase pt-2">
{language === 'English' ? 'THIS WAS THE BEGINNING.' : 'இதுவே ஆரம்பம்.'}
</div>
<div className="pt-4">
<button
onClick={() => document.getElementById('legacy-mgr')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
className="px-6 py-3 rounded-xl border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wider hover:bg-emerald-500/10 transition"
>
{language === 'English' ? '[ EXPLORE 1972 ]' : '[ 1972-ஐ ஆராயுங்கள் ]'}
</button>
</div>
</div>

<div className="relative group">
<div className="absolute inset-0 bg-emerald-500/10 rounded-3xl filter blur-2xl group-hover:bg-emerald-500/20 transition duration-500"></div>
<div className="relative rounded-3xl overflow-hidden border border-white/10 bg-slate-900 shadow-2xl transition duration-500 group-hover:scale-[1.02]">
<img 
src="/legacy_bg_1972.png" 
className="w-full h-80 object-cover object-center filter grayscale contrast-125"
alt="Early MGR" 
onError={(e) => { e.target.src = "/rally_bg.jpg"; }}
/>
<div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent">
<span className="text-[10px] font-black text-amber-400 tracking-widest uppercase">
{language === 'English' ? 'Early MGR / Party Formation' : 'கழகத் தொடக்கக் காலம்'}
</span>
<p className="text-xs text-slate-300 font-medium mt-1">
{language === 'English' ? 'Historic movement and cadre unity imagery.' : 'வரலாற்று சிறப்புமிக்க மக்கள் புரட்சி.'}
</p>
</div>
</div>
</div>
</div>
</section>

{/* 3. MGR SECTION */}
<section 
id="legacy-mgr"
className="w-full py-20 px-4 md:px-8 bg-slate-900/30 relative"
>
<div className="max-w-6xl mx-auto space-y-12">
<div className="text-center space-y-3">
<span className="text-xs font-black tracking-widest text-emerald-400 uppercase">
{language === 'English' ? 'MGR' : 'எம்.ஜி.ஆர்'}
</span>
<h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
{language === 'English' ? 'THE FOUNDER' : 'நிறுவனர்'}
</h3>
<p className="text-sm sm:text-base font-bold text-amber-400 italic max-w-xl mx-auto">
{language === 'English' ? "A LEADER WHO TURNED POPULARITY INTO A PEOPLE'S MOVEMENT." : "பிரபலத்தை மக்கள் இயக்கமாக மாற்றிய மக்கள் தலைவர்."}
</p>
</div>

<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
<div className="lg:col-span-7 flex flex-col justify-center space-y-6">
<div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
<p>
{language === 'English'
? "MGR's relationship with the people extended far beyond cinema. His public image, political journey and emphasis on welfare helped create a movement capable of reaching communities across Tamil Nadu."
: "மக்களுடனான எம்.ஜி.ஆரின் தொடர்பு திரையுலகையும் தாண்டியது. அவரது மக்கள் செல்வாக்கு, அரசியல் பயணம் மற்றும் மக்கள் நலனில் காட்டிய அக்கறை ஆகியவை தமிழகத்தின் அனைத்துப் பகுதிகளையும் சென்றடையும் ஒரு பேரியக்கத்தை உருவாக்க உதவின."}
</p>
<p>
{language === 'English'
? "In 1977, AIADMK formed the government in Tamil Nadu for the first time, with MGR becoming Chief Minister."
: "1977-இல், அதிமுக முதன்முறையாக தமிழகத்தில் ஆட்சி அமைத்தது, எம்.ஜி.ஆர் அவர்கள் முதலமைச்சராகப் பொறுப்பேற்றார்."}
</p>
<p>
{language === 'English'
? "Electoral mandates followed again in 1980 and 1984, making his leadership an era that firmly established the movement in Tamil Nadu politics."
: "1980 மற்றும் 1984-இல் தொடர் வெற்றிகள் மூலம், அவரது தலைமை தமிழக அரசியலில் இந்த இயக்கத்தை ஒரு நிரந்தர சக்தியாக நிலைநிறுத்தியது."}
</p>
</div>

<div className="pt-2">
<p className="text-xs font-black text-slate-400 uppercase tracking-wide">
{language === 'English' ? "His years in government strengthened the movement's association with welfare and policies aimed at ordinary households." : "அவரது ஆட்சிக் காலம் ஏழை எளிய குடும்பங்களை மையமாகக் கொண்ட மக்கள் நலத் திட்டங்களுக்கும் பேரியக்கத்திற்கும் இடையிலான பிணைப்பை மேலும் வலுப்படுத்தியது."}
</p>
<p className="text-sm font-black text-amber-400 uppercase tracking-widest mt-4">
{language === 'English' ? "MGR DIDN'T JUST BEGIN A PARTY. HE BUILT THE FOUNDATION OF AN ERA." : "எம்.ஜி.ஆர் ஒரு கட்சியை மட்டும் தொடங்கவில்லை. ஒரு புதிய யுகத்தின் அடித்தளத்தை அமைத்தார்."}
</p>
</div>
</div>

<div className="lg:col-span-5 flex flex-col gap-4">
{[
{ year: '1972', title: language === 'English' ? 'THE MOVEMENT' : 'பேரியக்கம்', desc: language === 'English' ? 'AIADMK party founded' : 'அதிமுக தொடங்கப்பட்டது' },
{ year: '1977', title: language === 'English' ? 'THE MANDATE' : 'ஆட்சிப் பொறுப்பு', desc: language === 'English' ? 'First government victory, CM oath' : 'முதல் மாபெரும் ஆட்சி வெற்றி' },
{ year: '1980', title: language === 'English' ? 'THE CONTINUITY' : 'தொடர்ச்சி', desc: language === 'English' ? 'Re-elected with strong support' : 'அடுத்தடுத்து அரசு நிர்வாகத் தொடர்ச்சி' },
{ year: '1984', title: language === 'English' ? 'THE THIRD VICTORY' : 'மூன்றாவது வெற்றி', desc: language === 'English' ? 'Historic third assembly sweep' : 'சட்டமன்றத் தேர்தலில் 3-வது வெற்றி' }
].map((card, idx) => (
<div 
key={idx}
className="p-5 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-between hover:border-emerald-500/20 transition group"
>
<div className="space-y-1">
<span className="text-3xs font-black text-emerald-400 uppercase tracking-widest">{card.title}</span>
<h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition">{card.desc}</h4>
</div>
<span className="text-2xl font-black text-slate-700 group-hover:text-emerald-500 font-mono tracking-tighter transition">{card.year}</span>
</div>
))}
</div>
</div>
</div>
</section>

{/* 4. CROSSROADS SECTION */}
<section 
id="legacy-crossroads"
className="w-full py-16 px-4 md:px-8 bg-slate-950 border-y border-white/5 relative"
>
<div className="max-w-4xl mx-auto text-center space-y-6">
<span className="text-3xs font-black text-amber-500 tracking-widest uppercase">
{language === 'English' ? 'AFTER MGR' : 'எம்.ஜி.ஆருக்குப் பின்'}
</span>
<h3 className="text-xl sm:text-3xl font-black text-white uppercase tracking-tight">
{language === 'English' ? 'A MOVEMENT AT A CROSSROADS' : 'ஒரு திருப்புமுனையில் பேரியக்கம்'}
</h3>
<div className="max-w-2xl mx-auto space-y-4 text-slate-400 text-xs sm:text-sm leading-relaxed">
<p>
{language === 'English'
? "The passing of MGR in 1987 marked one of the most difficult moments in the movement's history."
: "1987-இல் புரட்சித் தலைவர் எம்.ஜி.ஆரின் மறைவு இந்த இயக்கத்தின் வரலாற்றில் மிகக் கடினமான தருணங்களில் ஒன்றாக அமைந்தது."}
</p>
<p>
{language === 'English'
? "The leader who had founded and led AIADMK was gone. The years that followed brought political uncertainty, internal challenges and questions about the movement's future."
: "அதிமுகவை தோற்றுவித்து வழிநடத்திய உன்னத தலைவர் மறைந்தார். அதைத் தொடர்ந்த ஆண்டுகள் அரசியல் நிச்சயமற்ற தன்மையையும், உட்பூசல்களையும், இயக்கத்தின் எதிர்காலம் குறித்த கேள்விகளையும் எழுப்பின."}
</p>
</div>
<div className="text-sm sm:text-base font-black text-amber-400 uppercase tracking-widest pt-4">
{language === 'English' ? "But the story was not over. A new chapter was emerging." : "ஆனால் கதை முடிந்துவிடவில்லை. ஒரு புதிய அத்தியாயம் மலர்ந்தது."}
</div>
</div>
</section>

{/* 5. AMMA SECTION */}
<section 
id="legacy-amma"
className="w-full py-20 px-4 md:px-8 bg-slate-900/20 relative"
>
<div className="max-w-6xl mx-auto space-y-12">
<div className="text-center space-y-3">
<span className="text-xs font-black tracking-widest text-emerald-400 uppercase">
{language === 'English' ? 'AMMA' : 'அம்மா'}
</span>
<h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
{language === 'English' ? 'THE RISE OF A NEW ERA' : 'ஒரு புதிய யுகத்தின் எழுச்சி'}
</h3>
<p className="text-sm sm:text-base font-bold text-amber-400 italic max-w-xl mx-auto">
{language === 'English' ? "FROM POLITICAL CHALLENGE TO COMMANDING LEADERSHIP." : "அரசியல் சவால்களில் இருந்து ஆளுமை மிக்க தலைமை வரை."}
</p>
</div>

<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
<div className="lg:col-span-5 flex flex-col gap-4">
{[
{ year: '1991', title: language === 'English' ? 'A NEW ERA' : 'ஒரு புதிய விடியல்', desc: language === 'English' ? 'Returned to government, CM' : 'அம்மா தலைமையில் முதலாவது அமைச்சரவை' },
{ year: '2001', title: language === 'English' ? 'THE RETURN' : 'கம்பீர மீளுகை', desc: language === 'English' ? 'Returned to power on welfare mandate' : 'மக்களின் பேராதரவுடன் மீண்டும் ஆட்சி' },
{ year: '2011', title: language === 'English' ? 'A MAJOR MANDATE' : 'மாபெரும் மக்கள் தீர்ப்பு', desc: language === 'English' ? 'Landslide electoral victory' : 'வரலாற்றுச் சிறப்புமிக்க இமாலய வெற்றி' },
{ year: '2016', title: language === 'English' ? 'CONSECUTIVE VICTORY' : 'தொடர் தேர்தல் வெற்றி', desc: language === 'English' ? 'Secured consecutive assembly term' : 'தொடர்ச்சியாக மீண்டும் மீண்டும் வெற்றி' }
].map((card, idx) => (
<div 
key={idx}
className="p-5 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-between hover:border-emerald-500/20 transition group"
>
<div className="space-y-1">
<span className="text-3xs font-black text-emerald-400 uppercase tracking-widest">{card.title}</span>
<h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition">{card.desc}</h4>
</div>
<span className="text-2xl font-black text-slate-700 group-hover:text-emerald-500 font-mono tracking-tighter transition">{card.year}</span>
</div>
))}
</div>

<div className="lg:col-span-7 flex flex-col justify-center space-y-6">
<div className="space-y-4 text-slate-350 text-sm sm:text-base leading-relaxed">
<p>
{language === 'English'
? "Puratchi Thalaivi J. Jayalalithaa emerged as the central figure who would take AIADMK into its next major era."
: "புரட்சித் தலைவி ஜெ. ஜெயலலிதா அவர்கள் அதிமுகவை அடுத்த கட்டத்திற்கு கொண்டுச் சென்ற முக்கிய மையப் புள்ளியாக உருவெடுத்தார்."}
</p>
<p>
{language === 'English'
? "Her political journey demanded resilience through intense competition, setbacks and changing political circumstances."
: "அவரது அரசியல் பயணம் கடும் போட்டிகள், பின்னடைவுகள் மற்றும் மாறிவரும் அரசியல் சூழ்நிலைகளைக் கடந்து மன உறுதியைக் கோரியது."}
</p>
<p>
{language === 'English'
? "Under her leadership, AIADMK returned to government in 1991, beginning a chapter that would define much of the movement's modern identity. She would go on to lead AIADMK governments following victories in 2001, 2011 and 2016."
: "அவரது தலைமையின் கீழ், அதிமுக 1991-இல் மீண்டும் ஆட்சிக்கு வந்து, இயக்கத்தின் நவீன அடையாளத்தை வரையறுத்த ஒரு புதிய அத்தியாயத்தைத் தொடங்கியது. 2001, 2011 மற்றும் 2016 ஆகிய ஆண்டுகளில் தொடர்ந்து மாபெரும் வெற்றிகளைப் பெற்று அவர் அதிமுக ஆட்சியை வழிநடத்தினார்."}
</p>
<p>
{language === 'English'
? "Over these years, Amma's political identity became strongly associated with welfare-oriented governance and programmes spanning food, education, healthcare, women, household support and social welfare. Her leadership built a political identity recognised across Tamil Nadu."
: "இந்த ஆண்டுகளில், அம்மாவின் அரசியல் அடையாளம் உணவு, கல்வி, சுகாதாரம், மகளிர் நலன், குடும்ப ஆதரவு மற்றும் சமூக மேம்பாடு ஆகியவற்றை உள்ளடக்கிய மக்கள் நலன் சார்ந்த ஆளுமையுடன் ஆழமாக இணைந்தது. அவரது தலைமை தமிழகம் முழுவதும் அங்கீகரிக்கப்பட்ட ஆளுமையை உருவாக்கியது."}
</p>
</div>

<div className="pt-2">
<p className="text-sm font-black text-amber-400 uppercase tracking-widest">
{language === 'English' ? "AMMA INHERITED A MOVEMENT. SHE CREATED AN ERA OF HER OWN." : "அம்மா ஒரு பேரியக்கத்தை மரபாகப் பெற்றார். ஆனால் தனக்கென ஒரு வரலாற்றுச் சரித்திரத்தை உருவாக்கினார்."}
</p>
</div>
</div>
</div>
</div>
</section>

{/* 6. TURNING POINT 2016 SECTION */}
<section 
id="legacy-turningpoint"
className="w-full py-16 px-4 md:px-8 bg-slate-950 border-y border-white/5 relative"
>
<div className="max-w-4xl mx-auto text-center space-y-6">
<span className="text-3xs font-black text-amber-500 tracking-widest uppercase">2016</span>
<h3 className="text-xl sm:text-3xl font-black text-white uppercase tracking-tight">
{language === 'English' ? 'ANOTHER TURNING POINT' : 'மற்றொரு வரலாற்றுத் திருப்புமுனை'}
</h3>
<div className="max-w-2xl mx-auto space-y-4 text-slate-400 text-xs sm:text-sm leading-relaxed">
<p>
{language === 'English'
? "The passing of Amma in December 2016 created another defining moment in AIADMK's history."
: "டிசம்பர் 2016-இல் அம்மாவின் மறைவு அதிமுகவின் வரலாற்றில் மற்றொரு கடினமான திருப்புமுனையை ஏற்படுத்தியது."}
</p>
<p>
{language === 'English'
? "For the second time, the movement faced the challenge of continuing after the loss of a leader who had defined an era. The political circumstances were different. The challenge remained significant. AIADMK entered another period of transition."
: "இரண்டாவது முறையாக, ஒரு சகாப்தத்தை வடிவமைத்த தலைவரை இழந்த பின்னர் பேரியக்கத்தை முன்னெடுத்துச் செல்லும் சவாலை இயக்கம் எதிர்கொண்டது. அரசியல் சூழ்நிலைகள் வேறுபட்டவையாக இருந்தன, ஆனால் சவால்கள் மிக முக்கியமானதாகத் தொடர்ந்தன. அதிமுக மற்றொரு மாற்றுக்கட்ட மாற்றத்திற்குள் நுழைந்தது."}
</p>
</div>
</div>
</section>

{/* 7. EPS SECTION */}
<section 
id="legacy-eps"
className="w-full py-20 px-4 md:px-8 bg-slate-900/20 relative"
>
<div className="max-w-6xl mx-auto space-y-12">
<div className="text-center space-y-3">
<span className="text-xs font-black tracking-widest text-emerald-400 uppercase">
{language === 'English' ? 'EPS' : 'இ.பி.எஸ்'}
</span>
<h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
{language === 'English' ? 'FROM GRASSROOTS TO LEADERSHIP' : 'சாதாரணத் தொண்டனில் இருந்து தலைமை வரை'}
</h3>
<p className="text-sm sm:text-base font-bold text-amber-400 italic max-w-xl mx-auto">
{language === 'English' ? "A POLITICAL JOURNEY BUILT OVER DECADES." : "தசாப்தங்களாகக் கட்டமைக்கப்பட்ட அரசியல் பயணம்."}
</p>
</div>

<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
<div className="space-y-6">
<div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
<p>
{language === 'English'
? "Edappadi K. Palaniswami's journey within AIADMK began long before he became the movement's most prominent contemporary leader."
: "எடப்பாடி கே. பழனிசாமி அவர்களின் அதிமுக உடனான பயணம், அவர் தற்போதைய சமகாலத் தலைவராக உருவெடுப்பதற்கு நீண்ட காலத்திற்கு முன்பே தொடங்கியது."}
</p>
<p>
{language === 'English'
? "Rising through the organisation and electoral politics, he represented Edappadi in the Tamil Nadu Legislative Assembly and served in ministerial responsibilities before becoming Chief Minister of Tamil Nadu in February 2017."
: "கட்சியின் அடிமட்டத்தில் இருந்து படிப்படியாக உயர்ந்து, எடப்பாடி தொகுதி சட்டமன்ற உறுப்பினராக, பல்வேறு அமைச்சரவைப் பொறுப்புகளை ஏற்று, பின்னர் பிப்ரவரி 2017-இல் தமிழக முதலமைச்சராகப் பொறுப்பேற்றார்."}
</p>
<p>
{language === 'English'
? "His tenure came during one of the movement's most challenging transitions. From 2017 to 2021, he led the Tamil Nadu government while AIADMK adjusted to a political era without Amma."
: "அவரது ஆட்சிக்காலம் பேரியக்கத்தின் மிகக் கடுமையான சவால்கள் நிறைந்த ஒரு காலகட்டத்தில் அமைந்தது. 2017 முதல் 2021 வரை, அம்மா இல்லாத அரசியல் சூழலை அதிமுக எதிர்கொண்டபோது, அவர் தமிழக அரசை வெற்றிகரமாக வழிநடத்தினார்."}
</p>
<p>
{language === 'English'
? "His journey later moved from government leadership to organisational leadership. In 2023, EPS became AIADMK's General Secretary. Today, he leads the movement through its current chapter."
: "அவரது பயணம் பின்னர் அரசுத் தலைமையில் இருந்து கட்சித் தலைமைக்கு நகர்ந்தது. 2023-இல், எடப்பாடியார் அதிமுகவின் பொதுச் செயலாளராக ஒருமனதாகத் தேர்ந்தெடுக்கப்பட்டார். இன்று, அவர் இயக்கத்தை தற்போதைய அத்தியாயத்தில் வழிநடத்துகிறார்."}
</p>
</div>

<div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/10 space-y-2">
<span className="text-3xs font-black text-amber-400 tracking-widest uppercase">
{language === 'English' ? 'EXPERIENCE • ORGANISATION • LEADERSHIP' : 'அனுபவம் • கட்டமைப்பு • தலைமை'}
</span>
<p className="text-xs font-bold text-white uppercase leading-normal">
{language === 'English'
? "FROM CADRE TO CHIEF MINISTER. FROM CHIEF MINISTER TO GENERAL SECRETARY."
: "தொண்டனில் இருந்து முதலமைச்சர் வரை. முதலமைச்சரில் இருந்து பொதுச் செயலாளர் வரை."}
</p>
</div>
</div>

<div className="space-y-4">
{[
{ step: '01', title: language === 'English' ? 'Early Career & MLA' : 'அரசியல் தொடக்கம் & எம்.எல்.ஏ', desc: language === 'English' ? 'Represented Edappadi constituency, serving organizational roles' : 'அடிமட்டத் தொண்டராகத் தொடங்கி சட்டமன்ற உறுப்பினராக தேர்வு' },
{ step: '02', title: language === 'English' ? 'Cabinet Minister' : 'அமைச்சரவைப் பொறுப்புகள்', desc: language === 'English' ? 'Held key ministerial portfolios, managing massive public portfolios' : 'நெடுஞ்சாலைத் துறை உள்ளிட்ட முக்கிய அமைச்சரவைப் பொறுப்புகள்' },
{ step: '03', title: language === 'English' ? 'Chief Minister (2017-2021)' : 'தமிழக முதலமைச்சர் (2017-2021)', desc: language === 'English' ? 'Took oath as CM, successfully leading TN development programs' : 'மாநிலத்தின் முதலமைச்சராகப் பொறுப்பேற்று சிறப்பான ஆட்சித் திறன்' },
{ step: '04', title: language === 'English' ? 'General Secretary (2023-Present)' : 'கழகப் பொதுச் செயலாளர் (2023-இன்று)', desc: language === 'English' ? 'Elected as General Secretary to lead the movement forward' : 'கழகத்தை வழிநடத்தும் பொதுச் செயலாளராகப் பொறுப்பேற்பு' }
].map((card, idx) => (
<div 
key={idx}
className="flex items-start gap-4 p-5 rounded-2xl bg-slate-900 border border-white/5 hover:border-emerald-500/20 transition group"
>
<span className="text-base font-black text-emerald-400 font-mono">{card.step}</span>
<div className="space-y-1">
<h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition">{card.title}</h4>
<p className="text-xs text-slate-450 leading-relaxed font-medium">{card.desc}</p>
</div>
</div>
))}
</div>
</div>
</div>
</section>

{/* 8. THREE ERAS SUMMARY CARDS */}
<section 
id="legacy-summary"
className="w-full py-20 px-4 md:px-8 bg-slate-950 border-t border-white/5"
>
<div className="max-w-6xl mx-auto space-y-12">
<div className="text-center space-y-2">
<span className="text-3xs font-black text-amber-500 tracking-widest uppercase">
{language === 'English' ? 'THREE ERAS' : 'மூன்று சகாப்தங்கள்'}
</span>
<h3 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
{language === 'English' ? 'EACH LEFT A DIFFERENT MARK.' : 'ஒவ்வொன்றும் தனி முத்திரை பதித்தன.'}
</h3>
</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
{[
{ 
title: 'MGR', 
subtitle: language === 'English' ? 'THE FOUNDATION' : 'அடித்தளம்', 
desc: language === 'English' ? 'A movement was born and established as a major political force.' : 'ஒரு புதிய பேரியக்கம் பிறந்து மாபெரும் அரசியல் சக்தியாக உருவெடுத்தது.',
color: 'from-emerald-500/20 to-emerald-950/20 border-emerald-500/30'
},
{ 
title: 'AMMA', 
subtitle: language === 'English' ? 'THE EXPANSION' : 'விரிவாக்கம்', 
desc: language === 'English' ? 'The movement entered a new era of leadership, electoral success and welfare-oriented governance.' : 'தலைமைத்துவம், தேர்தல் வெற்றிகள் மற்றும் மக்கள் நலன் சார்ந்த ஆளுமையில் புதிய சகாப்தம் பிறந்தது.',
color: 'from-amber-500/20 to-amber-950/20 border-amber-500/30'
},
{ 
title: 'EPS', 
subtitle: language === 'English' ? 'THE CONTINUATION' : 'தொடர்ச்சி', 
desc: language === 'English' ? 'The movement entered another generation of leadership and political competition.' : 'புதிய தலைமுறை தலைமை மற்றும் அரசியல் போட்டிகளில் பேரியக்கம் வெற்றிகரமாகத் தொடர்கிறது.',
color: 'from-blue-500/20 to-blue-950/20 border-blue-500/30'
}
].map((era, idx) => (
<div 
key={idx}
className={`p-8 rounded-[2rem] border bg-gradient-to-b ${era.color} flex flex-col justify-between hover:scale-[1.03] transition duration-500 group shadow-lg`}
>
<div className="space-y-4">
<h4 className="text-4xl font-black text-white font-mono tracking-tight">{era.title}</h4>
<span className="text-[10px] font-black text-amber-400 tracking-widest uppercase block">{era.subtitle}</span>
<p className="text-xs text-slate-300 font-medium leading-relaxed">{era.desc}</p>
</div>
<div className="pt-6">
<img src="/irratai_ellai.png" className="w-6 h-6 object-contain filter brightness-75 group-hover:brightness-100 transition" alt="logo" />
</div>
</div>
))}
</div>
</div>
</section>

{/* 9. THE TWO LEAVES */}
<section 
id="legacy-symbol"
className="w-full py-20 px-4 md:px-8 bg-slate-900/10 relative"
>
<div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
<div className="lg:col-span-5 flex justify-center relative group">
<div className="absolute inset-0 bg-emerald-500/10 rounded-full filter blur-3xl group-hover:bg-emerald-500/20 transition duration-500"></div>
<img 
src="/irratai_ellai.png" 
className="w-56 h-56 object-contain relative z-10 transition duration-700 group-hover:scale-110 drop-shadow-2xl" 
alt="Two Leaves" 
/>
</div>

<div className="lg:col-span-7 space-y-6">
<span className="text-xs font-black tracking-widest text-emerald-400 uppercase">
{language === 'English' ? 'THE TWO LEAVES' : 'இரட்டை இலை'}
</span>
<h3 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
{language === 'English' ? 'MORE THAN A SYMBOL.' : 'வெறும் சின்னம் மட்டுமல்ல, எங்களின் அடையாளம்.'}
</h3>
<div className="space-y-4 text-slate-350 text-sm sm:text-base leading-relaxed">
<p>
{language === 'English'
? "Across elections, generations and political change, the Two Leaves has remained one of the most recognisable symbols associated with AIADMK."
: "தேர்தல்கள், தலைமுறைகள் மற்றும் அரசியல் மாற்றங்களைக் கடந்து, இரட்டை இலை சின்னம் அதிமுகவுடன் இணைந்த மிக முக்கியமான அடையாளமாக நிலைத்து நிற்கிறது."}
</p>
<p>
{language === 'English'
? "For supporters, it represents decades of political history — leaders, campaigns, governments, victories, setbacks and memories."
: "ஆதரவாளர்களுக்கு, இது தசாப்த கால அரசியல் வரலாற்றை — தலைவர்கள், பிரசாரங்கள், அரசாங்கங்கள், வெற்றிகள் மற்றும் நினைவுகளைக் குறிக்கிறது."}
</p>
<p>
{language === 'English'
? "From hand-painted campaign walls and printed posters to television and today's digital platforms, the symbol has travelled through generations."
: "கைமுறைச் சுவரோவியங்கள் மற்றும் அச்சிடப்பட்ட சுவரொட்டிகளில் தொடங்கி தொலைக்காட்சி மற்றும் இன்றைய டிஜிட்டல் தளங்கள் வரை, இந்த சின்னம் தலைமுறைகளைக் கடந்து பயணித்துள்ளது."}
</p>
</div>
</div>
</div>
</section>

{/* 10. GOVERNANCE ACHIEVEMENTS GRID */}
<section 
id="legacy-achievements"
className="w-full py-20 px-4 md:px-8 bg-slate-950 border-t border-white/5"
>
<div className="max-w-6xl mx-auto space-y-12">
<div className="text-center space-y-3">
<span className="text-3xs font-black text-amber-500 tracking-widest uppercase">
{language === 'English' ? 'GOVERNANCE THROUGH GENERATIONS' : 'தலைமுறைகளைக் கடந்த ஆளுமை'}
</span>
<h3 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
{language === 'English' ? 'FROM HISTORY TO EVERYDAY LIFE.' : 'வரலாற்றிலிருந்து அன்றாட வாழ்க்கை வரை.'}
</h3>
<p className="text-xs md:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
{language === 'English'
? "Across different AIADMK governments, policies and programmes have addressed areas of healthcare, education, agriculture, water conservation and infrastructure development."
: "பல்வேறு அதிமுக ஆட்சிக் காலங்களில், மக்கள் நலத் திட்டங்கள் மற்றும் உள்கட்டமைப்பு வளர்ச்சித் திட்டங்கள் மூலமாகப் பல சாதனைகள் நிகழ்த்தப்பட்டுள்ளன."}
</p>
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
{[
{ icon: '🎓', title: language === 'English' ? 'Education & Students' : 'கல்வி & மாணவர்கள்', desc: language === 'English' ? 'Free Laptop schemes, specialized digital classrooms' : 'விலையில்லா மடிக்கணினி, கல்வி நிதியுதவிகள்' },
{ icon: '👩', title: language === 'English' ? 'Women & Families' : 'மகளிர் & குடும்பங்கள்', desc: language === 'English' ? 'Cradle baby program, marriage gold assistance' : 'தொட்டில் குழந்தை திட்டம், திருமண தாலிக்கு தங்கம்' },
{ icon: '🍲', title: language === 'English' ? 'Food & Social Welfare' : 'உணவு & சமூக நலன்', desc: language === 'English' ? 'Amma Canteens (Amma Unavagam), subsidized food security' : 'அம்மா உணவகம், விலையில்லா அரிசி' },
{ icon: '🏥', title: language === 'English' ? 'Healthcare' : 'சுகாதாரம் & மருத்துவம்', desc: language === 'English' ? 'Baby care kits, comprehensive family insurance card' : 'அம்மா குழந்தை நலப் பெட்டகம், மருத்துவக் காப்பீடு' },
{ icon: '🚜', title: language === 'English' ? 'Agriculture & Rural Dev' : 'விவசாயம் & கிராமப்புறம்', desc: language === 'English' ? 'Fertilizer subsidies, crop relief funds, farm aid' : 'விவசாய மானியங்கள், இலவச மின்சாரம்' },
{ icon: '🛣️', title: language === 'English' ? 'Infrastructure & Transport' : 'உள்கட்டமைப்பு & போக்குவரத்து', desc: language === 'English' ? 'Flyovers, metro transit connectivity, public bus networks' : 'மேம்பாலங்கள், புதிய சாலைகள், மெட்ரோ இரயில்' },
{ icon: '🚰', title: language === 'English' ? 'Water Management' : 'நீர் மேலாண்மை', desc: language === 'English' ? 'Rainwater harvesting mandate, Kudimaramathu channel desilting' : 'மழைநீர் சேகரிப்புத் திட்டம், குடிமராமத்து' },
{ icon: '💼', title: language === 'English' ? 'Economic Development' : 'பொருளாதாரம் & தொழில்துறை', desc: language === 'English' ? 'Global Investors Meet, single-window industry approvals' : 'உலக முதலீட்டாளர்கள் மாநாடு, தொழில் வளர்ச்சி' }
].map((cat, idx) => (
<div 
key={idx}
onClick={() => {
setLegacySubView('schemes');
setSchemesCategoryFilter(cat.title.split(' ')[0]); // Map category
setTimeout(() => {
document.getElementById('schemes-database-section')?.scrollIntoView({ behavior: 'smooth' });
}, 150);
}}
className="p-6 rounded-2xl bg-slate-900 border border-white/5 hover:border-emerald-500/20 hover:scale-[1.02] cursor-pointer transition duration-300 flex flex-col justify-between gap-4"
>
<div className="space-y-3">
<span className="text-3xl block">{cat.icon}</span>
<h4 className="text-sm font-extrabold text-white">{cat.title}</h4>
<p className="text-2xs text-slate-400 leading-relaxed font-medium">{cat.desc}</p>
</div>
</div>
))}
</div>

<div className="text-center pt-4">
<button
onClick={() => {
setLegacySubView('schemes');
window.scrollTo({ top: 0, behavior: 'smooth' });
}}
className="px-6 py-3 rounded-xl border border-white/10 hover:border-white/20 text-slate-350 hover:text-white text-xs font-black uppercase tracking-wider transition active:scale-95"
>
{language === 'English' ? '[ EXPLORE SCHEMES & ACHIEVEMENTS ]' : '[ திட்டங்கள் & சாதனைகளை ஆராயுங்கள் ]'}
</button>
</div>
</div>
</section>

{/* 11. MOMENTS THAT MADE HISTORY (VERTICAL TIMELINE) */}
<section 
id="legacy-timeline"
className="w-full py-20 px-4 md:px-8 bg-slate-900/10 relative"
>
<div className="max-w-4xl mx-auto space-y-12">
<div className="text-center space-y-3">
<span className="text-xs font-black tracking-widest text-emerald-400 uppercase">
{language === 'English' ? 'MOMENTS THAT MADE HISTORY' : 'வரலாறு படைத்த தருணங்கள்'}
</span>
<h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
1972 → TODAY
</h3>
</div>

<div className="relative border-l border-white/15 ml-4 sm:ml-32 py-4 space-y-10">
{[
{ year: '1972', title: language === 'English' ? 'THE BEGINNING' : 'தொடக்கம்', desc: language === 'English' ? 'The movement is founded under MGR.' : 'எம்.ஜி.ஆர் தலைமையில் பேரியக்கம் தோற்றுவிக்கப்பட்டது.' },
{ year: '1977', title: language === 'English' ? 'FIRST GOVERNMENT' : 'முதல் அரசாங்கம்', desc: language === 'English' ? 'AIADMK forms the government in Tamil Nadu.' : 'அதிமுக தமிழகத்தில் முதன்முறையாக ஆட்சி அமைத்தது.' },
{ year: '1980', title: language === 'English' ? 'SECOND MANDATE' : 'இரண்டாவது முறை', desc: language === 'English' ? 'MGR returns to government.' : 'எம்.ஜி.ஆர் மீண்டும் ஆட்சி அமைத்தார்.' },
{ year: '1984', title: language === 'English' ? 'THIRD MANDATE' : 'மூன்றாவது முறை', desc: language === 'English' ? 'Another Assembly victory under MGR.' : 'எம்.ஜி.ஆர் தலைமையில் சட்டமன்றத்தில் மாபெரும் வெற்றி.' },
{ year: '1987', title: language === 'English' ? 'END OF AN ERA' : 'சகாப்தத்தின் முடிவு', desc: language === 'English' ? 'MGR passes away.' : 'புரட்சித் தலைவர் எம்.ஜி.ஆர் காலமானார்.' },
{ year: '1991', title: language === 'English' ? 'THE AMMA ERA' : 'அம்மா சகாப்தம்', desc: language === 'English' ? 'AIADMK forms the government under Jayalalithaa.' : 'ஜெயலலிதா அவர்களின் தலைமையில் முதன்முறையாக ஆட்சி.' },
{ year: '2001', title: language === 'English' ? 'THE RETURN' : 'மீளுகை', desc: language === 'English' ? 'AIADMK returns to government.' : 'அதிமுக மீண்டும் ஆட்சிப் பொறுப்பை ஏற்றது.' },
{ year: '2011', title: language === 'English' ? 'A NEW MANDATE' : 'புதிய சகாப்தம்', desc: language === 'English' ? 'AIADMK returns to power under Amma.' : 'அம்மா தலைமையில் புதிய வரலாற்று வெற்றி.' },
{ year: '2016', title: language === 'English' ? 'CONSECUTIVE VICTORY' : 'தொடர் வெற்றி', desc: language === 'English' ? 'AIADMK secures another Assembly mandate under Amma.' : 'அம்மா தலைமையில் தொடர்ச்சியாக மீண்டும் சட்டமன்றத் தேர்தல் வெற்றி.' },
{ year: '2017', title: language === 'English' ? 'THE EPS GOVERNMENT' : 'இ.பி.எஸ் ஆட்சிக் காலம்', desc: language === 'English' ? 'Edappadi K. Palaniswami becomes Chief Minister.' : 'எடப்பாடி கே. பழனிசாமி முதலமைச்சராகப் பொறுப்பேற்றார்.' },
{ year: '2021', title: language === 'English' ? 'A NEW POLITICAL PHASE' : 'புதிய அரசியல் களம்', desc: language === 'English' ? 'AIADMK moves from government to opposition.' : 'அதிமுக எதிர்க்கட்சிப் பொறுப்பை ஏற்றது.' },
{ year: '2023', title: language === 'English' ? 'GENERAL SECRETARY' : 'பொதுச் செயலாளர்', desc: language === 'English' ? 'EPS becomes General Secretary of AIADMK.' : 'எடப்பாடியார் கழகப் பொதுச் செயலாளராகப் பொறுப்பேற்றார்.' },
{ year: 'TODAY', title: language === 'English' ? 'THE STORY CONTINUES' : 'பயணம் தொடர்கிறது', desc: language === 'English' ? 'Another chapter is being written.' : 'மற்றொரு வரலாற்று அத்தியாயம் எழுதப்பட்டு வருகிறது.' }
].map((milestone, idx) => (
<div key={idx} className="relative pl-6 sm:pl-10 group">
<div className="absolute -left-2.5 top-1.5 w-5 h-5 rounded-full border-4 border-slate-950 bg-slate-700 group-hover:bg-emerald-400 group-hover:scale-125 transition duration-300"></div>

<span className="hidden sm:inline-block absolute -left-36 top-0 w-28 text-right font-black font-mono text-base text-slate-500 group-hover:text-emerald-400 transition">
{milestone.year}
</span>

<div className="space-y-1">
<span className="sm:hidden font-black font-mono text-emerald-400 block">{milestone.year}</span>
<h4 className="text-sm font-extrabold text-white group-hover:text-amber-400 transition">{milestone.title}</h4>
<p className="text-xs text-slate-450 leading-relaxed font-medium">{milestone.desc}</p>
</div>
</div>
))}
</div>
</div>
</section>

{/* 12. THE PEOPLE BEHIND THE HISTORY */}
<section 
id="legacy-people"
className="w-full py-20 px-4 md:px-8 bg-slate-950 border-t border-white/5"
>
<div className="max-w-4xl mx-auto text-center space-y-8">
<div className="space-y-3">
<span className="text-3xs font-black text-amber-500 tracking-widest uppercase">
{language === 'English' ? 'THE PEOPLE BEHIND THE HISTORY' : 'வரலாற்றின் பின்னால் உள்ள மக்கள்'}
</span>
<h3 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
{language === 'English' ? 'HISTORY IS MORE THAN DATES.' : 'வரலாறு என்பது வெறும் தேதிகள் மட்டுமல்ல.'}
</h3>
</div>

<div className="max-w-2xl mx-auto space-y-3 text-slate-350 text-xs sm:text-sm font-semibold text-left border-l-2 border-emerald-500 pl-6 py-4 bg-slate-900/30 rounded-r-2xl">
<p>{language === 'English' ? '• Behind every election were voters.' : '• ஒவ்வொரு தேர்தலின் பின்னாலும் வாக்காளர்கள் இருந்தனர்.'}</p>
<p>{language === 'English' ? '• Behind every campaign were cadres.' : '• ஒவ்வொரு பிரசாரத்தின் பின்னாலும் தொண்டர்கள் இருந்தனர்.'}</p>
<p>{language === 'English' ? '• Behind every government programme were people whose lives were affected.' : '• ஒவ்வொரு அரசு திட்டத்தின் பின்னாலும் அதனால் பயனடைந்த மக்கள் இருந்தனர்.'}</p>
<p>{language === 'English' ? '• Behind every political era are memories carried by families and communities.' : '• ஒவ்வொரு அரசியல் காலத்தின் பின்னாலும் குடும்பங்களும் சமூகங்களும் சுமந்து செல்லும் நினைவுகள் உள்ளன.'}</p>
<p className="text-slate-450 italic mt-3">
{language === 'English' ? 'Photographs fade. Posters disappear. Generations change.' : 'புகைப்படங்கள் மங்கலாம். சுவரொட்டிகள் அழியலாம். தலைமுறைகள் மாறலாம்.'}
</p>
<p className="text-amber-400 font-bold">
{language === 'English' ? 'But stories can be preserved.' : 'ஆனால் வரலாற்றை அழியாமல் பாதுகாக்க முடியும்.'}
</p>
</div>

<div className="flex flex-wrap justify-center gap-4 pt-4">
<button 
onClick={() => setActiveView('gallery')}
className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-wider shadow-lg active:scale-95 transition"
>
{language === 'English' ? 'VISIT THE ARCHIVES' : 'ஆவணக் காப்பகத்தைப் பார்வையிடுங்கள்'}
</button>
</div>
</div>
</section>

{/* 13. FROM ONE GENERATION TO THE NEXT (2K ADMK) */}
<section 
id="legacy-generations"
className="w-full py-20 px-4 md:px-8 bg-slate-900/10 relative border-t border-white/5 overflow-hidden"
>
<div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
<span className="text-xs font-black tracking-widest text-emerald-400 uppercase">
{language === 'English' ? 'FROM ONE GENERATION TO THE NEXT' : 'ஒரு தலைமுறையிலிருந்து அடுத்த தலைமுறைக்கு'}
</span>

<div className="max-w-2xl mx-auto space-y-4 text-slate-350 text-sm sm:text-base leading-relaxed">
<p>
{language === 'English'
? "1972 belongs to history. The generations that witnessed MGR carry their memories. The generations that lived through Amma's era carry theirs. The present generation is witnessing another chapter."
: "1972 என்பது இப்போது வரலாறு. எம்.ஜி.ஆரை நேரில் பார்த்த தலைமுறையினர் அந்த நினைவுகளைத் தாங்கி நிற்கிறார்கள். அம்மாவின் காலத்தில் வாழ்ந்தவர்கள் தங்களுடைய நினைவுகளைச் சுமந்து நிற்கிறார்கள். தற்போதைய தலைமுறையினர் மற்றொரு வரலாற்று அத்தியாயத்தைக் கண்டு வருகிறார்கள்."}
</p>
</div>

<div className="p-6 rounded-[2rem] border border-amber-400/20 bg-amber-400/5 max-w-xl mx-auto text-xs sm:text-sm font-bold text-amber-400 uppercase leading-normal tracking-wide">
{language === 'English'
? "Legacy is not only about remembering where we came from. IT IS ABOUT UNDERSTANDING WHAT CAME BEFORE WHAT COMES NEXT."
: "பாரம்பரியம் என்பது நாம் எங்கிருந்து வந்தோம் என்பதை நினைவு கூர்வது மட்டுமல்ல. அடுத்து என்ன வரப்போகிறது என்பதை அறிந்து கொள்வதற்காக அதற்கு முன் என்ன நடந்தது என்பதைப் புரிந்து கொள்வதே ஆகும்."}
</div>
<div className="pt-6">
<button
onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-350 hover:text-white text-2xs font-black uppercase tracking-wider border border-white/5 hover:border-white/10 transition"
>
{language === 'English' ? 'Back to top' : 'மேலே செல்லவும்'}
</button>
</div>
</div>
</section>
</div>
)}

{/* ────────────────────────────────────────────────────────── */}
{/* SUB-VIEW 2: SCHEMES & ACHIEVEMENTS DATABASE VIEW */}
{/* ────────────────────────────────────────────────────────── */}
{legacySubView === 'schemes' && (
<div className="animate-fadeIn w-full py-12 px-4 md:px-8 max-w-6xl mx-auto space-y-12">

{/* Schemes Hero Banner */}
<section 
className="relative rounded-3xl overflow-hidden py-16 px-6 text-center border border-white/10 bg-no-repeat bg-cover bg-center"
style={{
backgroundImage: 'linear-gradient(rgba(2, 31, 11, 0.90), rgba(0, 12, 4, 0.96)), url("/rally_bg.jpg")',
}}
>
<div className="max-w-3xl mx-auto space-y-6 relative z-10">
<span className="inline-block px-4 py-1 rounded-full bg-amber-400/10 border border-amber-400/25 text-3xs font-black tracking-widest text-amber-400 uppercase">
{language === 'English' ? 'SCHEMES & ACHIEVEMENTS' : 'திட்டங்கள் & சாதனைகள்'}
</span>
<h2 className="text-3xl sm:text-5xl font-black text-white leading-tight uppercase">
{language === 'English' ? 'WELFARE THAT TOUCHED LIVES. DEVELOPMENT THAT SHAPED TAMIL NADU.' : 'மக்களின் வாழ்வை மேம்படுத்திய நலத்திட்டங்கள். தமிழகத்தை செதுக்கிய பெருவளர்ச்சி.'}
</h2>
<div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3 font-medium">
<p>
{language === 'English'
? "From a nutritious meal that helped a child continue school to opportunities that opened the doors of medical education. From support for women and farmers to water conservation, healthcare, infrastructure and industrial development."
: "ஏழை எளிய குழந்தைகளின் சத்துணவில் தொடங்கி, மருத்துவக் கல்விக்கான நுழைவு வாயில் வரை. பெண்கள் மற்றும் விவசாயிகளின் பேராதரவில் தொடங்கி நீர் மேலாண்மை, சுகாதாரம், உள்கட்டமைப்பு மற்றும் தொழில்துறை வளர்ச்சி வரை."}
</p>
<p>
{language === 'English'
? "Across different eras, AIADMK governments introduced policies, programmes and projects addressing the changing needs of Tamil Nadu."
: "பல்வேறு காலகட்டங்களில், அதிமுக அரசுகள் தமிழக மக்களின் தேவைகளை உடனுக்குடன் பூர்த்தி செய்யும் வகையில் முன்னோடித் திட்டங்களைச் செயல்படுத்தி வந்துள்ளன."}
</p>
</div>
<div className="text-xs font-black text-amber-400 uppercase tracking-widest">
MGR • AMMA • EPS
</div>
<p className="text-2xs text-slate-450 uppercase font-black tracking-wider">
<div className="animate-fadeIn w-full">

{/* Schemes Hero Banner - Full-bleed, full-screen fit, matching History & Eras */}
<section 
className="relative w-full md:h-[calc(100vh-140px)] md:min-h-[550px] flex flex-col items-center justify-start px-4 md:px-8 pt-6 md:pt-10 pb-6 bg-no-repeat bg-cover bg-center"
style={{
backgroundImage: 'linear-gradient(rgba(2, 31, 11, 0.90), rgba(0, 12, 4, 0.96)), url("/rally_bg.jpg")',
}}
>
{/* Floating Fixed Watermark */}
{language === 'English' ? 'Continuing Story' : 'தொடர்கதை'}
</div>
</div>
</div>

<div className="pt-6">
<button
onClick={() => document.getElementById('legacy-hero')?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })}
className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-350 hover:text-white text-2xs font-black uppercase tracking-wider border border-white/5 hover:border-white/10 transition"
>
{language === 'English' ? 'Back to Intro' : 'அறிமுகத்திற்குச் செல்க'}
</button>
</div>
</div>
</section>

</div> {/* Closed scroll-smooth horizontal wrapper */}
</div> {/* Closed relative outer container */}
)}

{/* ────────────────────────────────────────────────────────── */}
{/* SUB-VIEW 2: SCHEMES & ACHIEVEMENTS DATABASE VIEW */}
{/* ────────────────────────────────────────────────────────── */}
{legacySubView === 'schemes' && (
<div className="animate-fadeIn w-full">

{/* Schemes Hero Banner - Full-bleed, full-screen fit, matching History & Eras */}
<section 
className="relative w-full md:h-[calc(100vh-140px)] md:min-h-[550px] flex flex-col items-center justify-start px-4 md:px-8 pt-6 md:pt-10 pb-6 bg-no-repeat bg-cover bg-center"
style={{
backgroundImage: 'linear-gradient(rgba(2, 31, 11, 0.90), rgba(0, 12, 4, 0.96)), url("/rally_bg.jpg")',
}}
>


<div className="max-w-4xl mx-auto text-center z-10 space-y-5">




<p className="text-center text-xs text-slate-450 italic font-medium pt-2">
{language === 'English' ? 'Together, these initiatives tell a wider story of governance across generations.' : 'இவை அனைத்தும் இணைந்து தலைமுறைகளைக் கடந்த சிறந்த ஆளுமையின் வரலாற்றை நமக்கு உரைக்கின்றன.'}
</p>
</section>

{/* Explore by Impact Grid (8 Cards) */}
<section className="space-y-6">
<h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-wider text-center">{language === 'English' ? 'EXPLORE BY IMPACT' : 'தாக்கத்தின் அடிப்படையில் ஆராயுங்கள்'}</h3>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
{[
{ key: 'Education', title_en: 'Education & Students', title_ta: 'கல்வி & மாணவர்கள்', sub_en: 'Learning. Access. Opportunity.', sub_ta: 'கல்வி. அணுகுமுறை. வாய்ப்புகள்.' },
{ key: 'Women', title_en: 'Women & Families', title_ta: 'மகளிர் & குடும்பங்கள்', sub_en: 'Welfare. Mobility. Empowerment.', sub_ta: 'நலன். பயணம். மகளிர் சௌபாக்யா.' },
{ key: 'Healthcare', title_en: 'Healthcare', title_ta: 'சுகாதாரம் & மருத்துவம்', sub_en: 'Treatment. Infrastructure. Access.', sub_ta: 'சிகிச்சை. கட்டமைப்பு. மருத்துவக் காப்பீடு.' },
{ key: 'Welfare', title_en: 'Food & Social Welfare', title_ta: 'உணவு & சமூக நலன்', sub_en: 'Nutrition. Security. Support.', sub_ta: 'சத்துணவு. பாதுகாப்பு. குடும்ப ஆதரவு.' },
{ key: 'Agriculture', title_en: 'Farmers & Rural Tamil Nadu', title_ta: 'விவசாயிகள் & கிராமப்புறம்', sub_en: 'Agriculture. Livelihoods. Development.', sub_ta: 'விவசாயம். வாழ்வாதாரம். கிராம வளர்ச்சி.' },
{ key: 'Water', title_en: 'Water & Irrigation', title_ta: 'விவசாயம் & நீர் வளங்கள்', sub_en: 'Conservation. Restoration. Security.', sub_ta: 'சேமிப்பு. தூர்வாருதல். நீர் மேலாண்மை.' },
{ key: 'Infrastructure', title_en: 'Infrastructure & Transport', title_ta: 'உள்கட்டமைப்பு & போக்குவரத்து', sub_en: 'Connectivity. Mobility. Growth.', sub_ta: 'இணைப்பு. பயணம். பெருவளர்ச்சி.' },
{ key: 'Economy', title_en: 'Industry & Economy', title_ta: 'தொழில் & பொருளாதாரம்', sub_en: 'Investment. Enterprise. Employment.', sub_ta: 'முதலீடு. சிறுதொழில்கள். வேலைவாய்ப்பு.' }
].map((cat, idx) => (
<div 
key={idx}
onClick={() => {
setSchemesCategoryFilter(cat.key);
document.getElementById('schemes-database-section')?.scrollIntoView({ behavior: 'smooth' });
}}
className="p-5 rounded-2xl bg-slate-900 border border-white/5 hover:border-emerald-500/20 hover:scale-[1.02] cursor-pointer transition flex flex-col justify-between min-h-[120px] group"
>
<h4 className="text-xs font-black text-white group-hover:text-amber-400 transition">{language === 'English' ? cat.title_en : cat.title_ta}</h4>
<span className="text-3xs text-emerald-400 font-extrabold uppercase block mt-2">{language === 'English' ? cat.sub_en : cat.sub_ta}</span>
</div>
))}
</div>
</section>

{/* Numbers That Tell the Story (Impact Stats counters) */}
<section className="py-12 px-6 rounded-3xl bg-slate-900/40 border border-white/5 space-y-8">
<div className="text-center space-y-1">
<span className="text-3xs font-black text-amber-500 tracking-widest uppercase">NUMBERS THAT TELL THE STORY</span>
<h3 className="text-xl sm:text-2xl font-black text-white uppercase">{language === 'English' ? 'IMPACT AT A GLANCE' : 'ஒரே பார்வையில் சாதனைகளின் தாக்கம்'}</h3>
<p className="text-3xs text-slate-450 uppercase font-black">{language === 'English' ? 'Figures verified from state archive databases.' : 'அரசு ஆவணங்கள் மற்றும் தரவுகளின் அடிப்படையில் சரிபார்க்கப்பட்டது.'}</p>
</div>

<div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
{[
{ label_en: 'Students supported', label_ta: 'கல்வி நிதியுதவி பெற்ற மாணவர்கள்', value: '50 LAKH+' },
{ label_en: 'Medical / infrastructure projects', label_ta: 'மருத்துவ & கட்டமைப்புத் திட்டங்கள்', value: '75+' },
{ label_en: 'Women beneficiaries', label_ta: 'பயனடைந்த மகளிர்', value: '1 CRORE+' },
{ label_en: 'Water bodies restored', label_ta: 'தூர்வாரிப் புதுப்பிக்கப்பட்ட நீர்நிலைகள்', value: '6,000+' },
{ label_en: 'Investment value attracted', label_ta: 'ஈர்க்கப்பட்ட தொழில் முதலீடுகள்', value: '₹2.4 LAKH CR' },
{ label_en: 'Farmers / families supported', label_ta: 'பயனடைந்த விவசாயக் குடும்பங்கள்', value: '40 LAKH+' }
].map((stat, idx) => (
<div key={idx} className="p-5 rounded-2xl bg-slate-950 border border-white/5 text-center space-y-2 hover:border-amber-500/20 transition">
<span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono tracking-tight block">{stat.value}</span>
<span className="text-3xs font-bold text-slate-400 uppercase block tracking-wider leading-relaxed">
{language === 'English' ? stat.label_en : stat.label_ta}
</span>
</div>
))}
</div>
</section>

{/* Searchable Complete Record Database */}
<section 
id="schemes-database-section"
className="p-6 md:p-8 rounded-[2rem] bg-slate-900 border border-white/5 space-y-6"
>
<div className="text-center space-y-1">
<span className="text-3xs font-black text-emerald-400 tracking-widest uppercase">EXPLORE THE RECORD</span>
<h3 className="text-lg sm:text-xl font-black text-white uppercase">{language === 'English' ? 'ONE PLACE. EVERY INITIATIVE.' : 'ஒரே தளம். அனைத்து மக்கள் நலத்திட்டங்கள்.'}</h3>
<p className="text-3xs text-slate-400 uppercase font-black">{language === 'English' ? 'Let visitors search the complete record.' : 'அனைத்து திட்டங்களின் முழுமையான ஆவணம்.'}</p>
</div>

{/* Search and Filters panel */}
<div className="space-y-4">
{/* Search Input */}
<div className="relative max-w-lg mx-auto">
<input
type="text"
value={schemesSearch}
onChange={(e) => setSchemesSearch(e.target.value)}
placeholder={language === 'English' ? "Search by scheme, project or achievement..." : "திட்டம், கொள்கை அல்லது சாதனையைத் தேடுங்கள்..."}
className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 px-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
/>
</div>

{/* Dropdown Filters Grid */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">

{/* 1. Filter by Era */}
<div className="space-y-1">
<label className="text-3xs font-black uppercase text-slate-400 block tracking-wider">{language === 'English' ? 'Filter by Era' : 'காலவரிசை'}</label>
<select
value={schemesEraFilter}
onChange={(e) => setSchemesEraFilter(e.target.value)}
className="w-full bg-slate-950 border border-white/10 rounded-lg py-2 px-3 text-2xs text-slate-300 focus:outline-none focus:border-emerald-500"
>
<option value="All">{language === 'English' ? 'All Eras' : 'அனைத்து காலங்கள்'}</option>
<option value="MGR">{language === 'English' ? 'MGR Era' : 'எம்.ஜி.ஆர் காலம்'}</option>
<option value="Amma">{language === 'English' ? 'Amma Era' : 'அம்மா காலம்'}</option>
<option value="EPS">{language === 'English' ? 'EPS Era' : 'இ.பி.எஸ் காலம்'}</option>
</select>























































































































{[0, 1, 2, 3, 4].map(idx => (
<button
key={idx}
onClick={() => setActiveStoryIdx(idx)}
className={`w-2 h-2 rounded-full transition \${activeStoryIdx === idx ? 'bg-amber-400 scale-125' : 'bg-slate-700 hover:bg-slate-600'}`}
onClick={() => setShowMemoryModal(true)}
className="px-8 py-3.5 rounded-full bg-slate-900 border border-white/10 hover:border-white/20 text-amber-400 hover:text-amber-300 font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition"
>
{language === 'English' ? '[ SHARE YOUR STORY ]' : '[ உங்கள் கதையைப் பகிர்க ]'}
</button>
</div>
</div>
</section>

{/* 12. THE PEOPLE BEHIND THE HISTORY */}
<section 
id="legacy-people"
className="w-full min-w-full h-full snap-start overflow-y-auto px-4 md:px-8 py-10 flex flex-col justify-center items-center bg-slate-950 relative"
>
<section 
id="legacy-people"
className="w-full min-w-full h-full snap-start overflow-y-auto px-4 md:px-8 py-10 flex flex-col justify-center items-center bg-slate-950 relative"
>
<div className="max-w-4xl mx-auto text-center space-y-8">
<div className="space-y-3">
<span className="text-3xs font-black text-amber-500 tracking-widest uppercase">
{language === 'English' ? 'THE PEOPLE BEHIND THE HISTORY' : 'வரலாற்றின் பின்னால் உள்ள மக்கள்'}
</span>
<h3 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
{language === 'English' ? 'HISTORY IS MORE THAN DATES.' : 'வரலாறு என்பது வெறும் தேதிகள் மட்டுமல்ல.'}
</h3>
</div>

<div className="max-w-2xl mx-auto space-y-3 text-slate-350 text-xs sm:text-sm font-semibold text-left border-l-2 border-emerald-500 pl-6 py-4 bg-slate-900/30 rounded-r-2xl">
<p>{language === 'English' ? '• Behind every election were voters.' : '• ஒவ்வொரு தேர்தலின் பின்னாலும் வாக்காளர்கள் இருந்தனர்.'}</p>
<p>{language === 'English' ? '• Behind every campaign were cadres.' : '• ஒவ்வொரு பிரசாரத்தின் பின்னாலும் தொண்டர்கள் இருந்தனர்.'}</p>
>
<span className="text-3xs font-black text-amber-500 tracking-widest uppercase block">{language === 'English' ? story.label_en : story.label_ta}</span>
<p className="text-sm font-bold text-white leading-relaxed">
"{language === 'English' ? story.quote_en : story.quote_ta}"
</p>
</div>
))}

{/* Testimonial slider navigation */}
<div className="flex justify-center gap-2 pt-2">
{[0, 1, 2, 3, 4].map(idx => (
<button
key={idx}
onClick={() => setActiveStoryIdx(idx)}
className={`w-2 h-2 rounded-full transition ${activeStoryIdx === idx ? 'bg-amber-400 scale-125' : 'bg-slate-700 hover:bg-slate-600'}`}
/>
))}
</div>
</div>

<div className="text-center space-y-1 pt-4">
<p className="text-xs font-black text-slate-450 uppercase tracking-widest">
{language === 'English' ? 'GOVERNANCE BECOMES HISTORY. IMPACT BECOMES MEMORY.' : 'ஆளுமை வரலாறாக மாறுகிறது. தாக்கம் அழியா நினைவாகிறது.'}
</p>
<p className="text-2xs font-extrabold text-emerald-400 uppercase tracking-wider">
2K ADMK • Governance • Development • People
</p>
</div>
</section>

{/* Back to top button */}
<div className="text-center pt-6">
<button
onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-350 hover:text-white text-2xs font-black uppercase tracking-wider border border-white/5 hover:border-white/10 transition"
>
{language === 'English' ? 'Back to top' : 'மேலே செல்லவும்'}
</button>
</div>

</div>
)}

</div>
)}



















{language === 'English' ? 'Present Chapter' : 'தற்காலம்'}
</div>
<div className="p-4 rounded-xl bg-slate-900 border border-white/5">
<span className="text-slate-450 block mb-1">PEOPLE</span>
{language === 'English' ? 'Continuing Story' : 'தொடர்கதை'}
</div>
</div>
</div>

<div className="pt-6">
<button
onClick={() => document.getElementById('legacy-hero')?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })}
className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-350 hover:text-white text-2xs font-black uppercase tracking-wider border border-white/5 hover:border-white/10 transition"
>
{language === 'English' ? 'Back to Intro' : 'அறிமுகத்திற்குச் செல்க'}
</button>
</div>
</div>
</section>

</div>
</div>
)}

{/* ────────────────────────────────────────────────────────── */}
{/* SUB-VIEW 2: SCHEMES & ACHIEVEMENTS DATABASE VIEW */}
{/* ────────────────────────────────────────────────────────── */}
{legacySubView === 'schemes' && (
<div className="animate-fadeIn w-full">

{/* Schemes Hero Banner - Full-bleed, full-screen fit, matching History & Eras */}
<section 
className="relative w-full md:h-[calc(100vh-140px)] md:min-h-[550px] flex flex-col items-center justify-start px-4 md:px-8 pt-6 md:pt-10 pb-6 bg-no-repeat bg-cover bg-center"
style={{
backgroundImage: 'linear-gradient(rgba(2, 31, 11, 0.90), rgba(0, 12, 4, 0.96)), url("/rally_bg.jpg")',
}}
>


<div className="max-w-4xl mx-auto text-center z-10 space-y-5">
{/* Title with typewriter effect and smooth typing cursor caret */}
/>
))}
</div>
</div>

<div className="text-center space-y-1 pt-4">
<p className="text-xs font-black text-slate-450 uppercase tracking-widest">
{language === 'English' ? 'GOVERNANCE BECOMES HISTORY. IMPACT BECOMES MEMORY.' : 'ஆளுமை வரலாறாக மாறுகிறது. தாக்கம் அழியா நினைவாகிறது.'}
</p>
<p className="text-2xs font-extrabold text-emerald-400 uppercase tracking-wider">
2K ADMK • Governance • Development • People
</p>
</div>
</section>

{/* Back to top button */}
<div className="text-center pt-6">
<button
onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-350 hover:text-white text-2xs font-black uppercase tracking-wider border border-white/5 hover:border-white/10 transition"
>
{language === 'English' ? 'Back to top' : 'மேலே செல்லவும்'}
</button>
</div>

</div> {/* Closed Rest of Schemes Database wrapper */}
</div>
)}

</div>
)}
{activeView === 'gallery' && (
<div 
className="relative w-full min-h-[95vh] py-16 px-4 md:px-6 flex flex-col items-center justify-center bg-no-repeat bg-cover bg-center bg-fixed"
style={{
backgroundImage: 'linear-gradient(rgba(2, 31, 11, 0.70), rgba(2, 31, 11, 0.78)), url("/rally_bg.jpg")',
}}
>
<section className="max-w-6xl mx-auto w-full animate-fadeIn z-10 relative">
<div className="text-center space-y-3 mb-10">





































































































































































































































</section>
</div>
)}

{/* ─── VIEW 6: MY CONSTITUENCY (LEADER/ADMIN DASHBOARD FILTER) ─── */}
{activeView === 'constituency' && userRole === 'admin' && (
<div 
className="relative w-full min-h-[95vh] py-16 px-4 md:px-6 flex flex-col items-center justify-center bg-no-repeat bg-cover bg-center bg-fixed"
style={{
backgroundImage: 'linear-gradient(rgba(2, 31, 11, 0.70), rgba(2, 31, 11, 0.78)), url("/rally_bg.jpg")',
}}
>
<section className="max-w-6xl mx-auto w-full animate-fadeIn z-10 relative">
<div className="text-center space-y-3 mb-8">
<span className="text-xs font-black tracking-widest text-amber-400 uppercase drop-shadow-sm">{language === 'English' ? 'Leadership Review Desk' : 'தலைமை ஆய்வு தளம்'}</span>
<h3 className="text-3xl sm:text-4xl font-black text-white drop-shadow-lg">{language === 'English' ? 'Constituency Grievance Monitoring' : 'தொகுதி வாரியாக கோரிக்கைகள்'}</h3>
<p className="text-xs text-slate-200 max-w-md mx-auto font-medium leading-relaxed drop-shadow-md">{language === 'English' ? 'Select your local constituency area to view problems logged by local residents.' : 'தொகுதியைத் தேர்ந்தெடுத்து அப்பகுதி மக்கள் எழுப்பியுள்ள பிரச்சினைகளைக் கண்டறியவும்.'}</p>
</div>

{/* Dashboard Sub-Tabs */}
{userRole !== 'admin' && (
<div className="flex flex-wrap justify-center gap-4 mb-10">
<button
onClick={() => setDashboardSubTab('grievances')}
className={`px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-wider transition-all ${dashboardSubTab === 'grievances' ? 'bg-emerald-700 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
>
{language === 'English' ? 'Grievance Dashboard' : 'மனுக்கள் மேலாண்மை'}
</button>
<button
onClick={() => setDashboardSubTab('news_inbox')}
className={`px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${dashboardSubTab === 'news_inbox' ? 'bg-emerald-700 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
>
<span>{language === 'English' ? 'ADMK News Inbox' : 'செய்திகள் இன்பாக்ஸ்'}</span>
{newsInbox.length > 0 && (
<span className="w-5 h-5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
{newsInbox.length}
</span>
)}
</button>
<button
onClick={() => setDashboardSubTab('manage_gallery')}




</div>

<div className="space-y-1 md:border-l md:border-white/5 md:pl-4 text-3xs font-extrabold uppercase text-slate-400">
<div>{language === 'English' ? 'Category: ' : 'வகைப்பாடு: '} <span className="text-white">{language === 'English' ? item.category_en : item.category_ta}</span></div>
<div>{language === 'English' ? 'Served: ' : 'பயனாளிகள்: '} <span className="text-white">{language === 'English' ? item.served_en : item.served_ta}</span></div>
<div>{language === 'English' ? 'Type: ' : 'திட்ட வகை: '} <span className="text-white">{language === 'English' ? item.type_en : item.type_ta}</span></div>
<div>{language === 'English' ? 'Source: ' : 'மூல ஆவணம்: '} <span className="text-slate-500 font-bold lowercase">{item.source}</span></div>
</div>
</div>

</div>
))
)}
</div>
</section>

{/* Behind the Numbers are People (Testimonial impact stories slider) */}
<section className="p-8 rounded-3xl bg-slate-900 border border-white/5 space-y-8">
<div className="text-center space-y-1">
<span className="text-3xs font-black text-amber-400 tracking-widest uppercase">BEHIND THE NUMBERS ARE PEOPLE</span>
<h3 className="text-xl sm:text-2xl font-black text-white uppercase">{language === 'English' ? 'IMPACT STORY STORIES' : 'நம்பிக்கை தரும் மனிதர்களின் கதைகள்'}</h3>
</div>

<div className="max-w-2xl mx-auto p-6 rounded-2xl bg-slate-950 border border-emerald-500/10 min-h-[140px] flex flex-col justify-between gap-4">
{[
{ label_en: 'THE STUDENT', label_ta: 'மாணவர்', quote_en: 'Who received an opportunity to study and pursue higher professional education.', quote_ta: 'உயர்கல்வி மற்றும் தொழில்முறை சார்ந்த கல்வியைத் தொடர அரிய வாய்ப்பைப் பெற்றவர்.' },
{ label_en: 'THE WOMAN', label_ta: 'பெண்மணி', quote_en: 'Who gained greater mobility, economic livelihood, and social safety.', quote_ta: 'அதிகாரப் பகிர்வு, இருசக்கர வாகன மானியம் மற்றும் சுயஉதவிக் குழுக்கள் மூலம் வாழ்வாதாரம் அடைந்தவர்.' },
{ label_en: 'THE FARMER', label_ta: 'விவசாயி', quote_en: 'Whose livelihood depended on water and received cooperative crop loan waivers.', quote_ta: 'கூட்டுறவு பயிர்க்கடன் தள்ளுபடி மற்றும் நீர் மேலாண்மை திட்டங்கள் மூலம் விவசாயத்தைக் காத்தவர்.' },
{ label_en: 'THE PATIENT', label_ta: 'நோயாளி', quote_en: 'Who accessed specialized life-saving medical treatment through comprehensive insurance.', quote_ta: 'இலவச மருத்துவக் காப்பீடு மற்றும் அரசு மருத்துவக் கட்டமைப்பு மூலம் உயிர் காக்கும் சிகிச்சை பெற்றவர்.' },
{ label_en: 'THE FAMILY', label_ta: 'ஏழை எளிய குடும்பங்கள்', quote_en: 'Who received subsidized food, canteens, and essential household welfare support.', quote_ta: 'அம்மா உணவகம் மற்றும் நியாய விலைக்கடைப் பொருட்கள் மூலம் அத்தியாவசிய உணவுத் தேவை பூர்த்தியடைந்த குடும்பங்கள்.' }
].map((story, idx) => (
<div 
key={idx} 
className="space-y-2 transition duration-500 text-center"
style={{ display: activeStoryIdx === idx ? 'block' : 'none' }}
>
<span className="text-3xs font-black text-amber-500 tracking-widest uppercase block">{language === 'English' ? story.label_en : story.label_ta}</span>
<p className="text-sm font-bold text-white leading-relaxed">
"{language === 'English' ? story.quote_en : story.quote_ta}"
</p>
</div>
))}

{/* Testimonial slider navigation */}
<div className="flex justify-center gap-2 pt-2">
{[0, 1, 2, 3, 4].map(idx => (
<button
key={idx}
onClick={() => setActiveStoryIdx(idx)}
className={`w-2 h-2 rounded-full transition ${activeStoryIdx === idx ? 'bg-amber-400 scale-125' : 'bg-slate-700 hover:bg-slate-600'}`}
/>
))}
</div>
</div>

<p className="text-2xs font-extrabold text-emerald-400 uppercase tracking-wider">
2K ADMK • Governance • Development • People
</p>
</div>
</section>

{/* Back to top button */}
<div className="text-center pt-6">
<button
onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-350 hover:text-white text-2xs font-black uppercase tracking-wider border border-white/5 hover:border-white/10 transition"
>
{language === 'English' ? 'Back to top' : 'மேலே செல்லவும்'}
</button>
</div>

</section>
</div>
)
)}

</div>
)}
{activeView === 'gallery' && (
<div 
className="relative w-full min-h-[95vh] py-16 px-4 md:px-6 flex flex-col items-center justify-center bg-no-repeat bg-cover bg-center bg-fixed"
style={{
backgroundImage: 'linear-gradient(rgba(2, 31, 11, 0.70), rgba(2, 31, 11, 0.78)), url("/rally_bg.jpg")',
}}
>
<section className="max-w-6xl mx-auto w-full animate-fadeIn z-10 relative">
<div className="text-center space-y-3 mb-10">
<span className="text-xs font-black tracking-widest text-amber-400 uppercase drop-shadow-sm">{language === 'English' ? 'Campaign Snapshots' : 'புகைப்படங்கள்'}</span>
<h3 className="text-3xl sm:text-4xl font-black text-white drop-shadow-lg">{language === 'English' ? 'Media Gallery' : 'புகைப்படக் கேலரி'}</h3>
<p className="text-xs text-slate-200 max-w-md mx-auto font-medium leading-relaxed drop-shadow-md">{language === 'English' ? 'Pictures of leadership campaigns, public outreach tours, and volunteer services.' : 'மக்கள் தொடர்புப் பயணங்கள் மற்றும் நற்பணி மன்ற நிகழ்வுகள்.'}</p>
</div>

{/* Gallery Filters */}
<div className="flex flex-wrap justify-center gap-3 mb-10">
{[
{ key: 'All', en: 'All Photos', ta: 'அனைத்தும்' },









onClick={() => setGalleryFilter(tab.key)}
className={`px-5 py-2 rounded-full text-2xs font-extrabold uppercase tracking-wider transition-all duration-300 ${galleryFilter === tab.key ? 'bg-emerald-700 text-white shadow-md' : 'bg-white hover:bg-slate-100 text-slate-500 border border-slate-100'}`}
>
{language === 'English' ? tab.en : tab.ta}
</button>
))}
</div>

{galleryLoading ? (
<div className="flex flex-col items-center justify-center py-20 gap-4">
<svg className="animate-spin h-8 w-8 text-emerald-600" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
<p className="text-2xs font-black text-slate-500 uppercase tracking-widest">{language === 'English' ? 'Loading gallery photos...' : 'படங்களைப் பெறுகிறது...'}</p>
</div>
) : galleryPhotos.length === 0 ? (
<div className="text-center py-20 bg-white/70 rounded-[2rem] border border-slate-100 shadow-md">
<span className="material-symbols-outlined text-4xl text-slate-300">image</span>
<p className="text-xs text-slate-550 mt-2 font-black uppercase tracking-wider">{language === 'English' ? 'No Campaign Photos Found' : 'புகைப்படங்கள் எதுவும் இல்லை'}</p>
</div>
) : (
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
{galleryPhotos
.filter(photo => galleryFilter === 'All' || photo.category_en === galleryFilter || photo.category_ta === galleryFilter)
.map(photo => {
const src = photo.image_url.startsWith('/uploads') ? (API + photo.image_url) : photo.image_url;
return (
<div 
key={photo._id || photo.id} 
onClick={() => setActiveLightboxImage(photo)}
className="group relative overflow-hidden rounded-[2rem] bg-white border border-slate-100 shadow-md hover:shadow-xl hover:scale-[1.02] cursor-pointer transition-all duration-300 flex flex-col h-64"
>
<div className="flex-1 bg-slate-100 overflow-hidden relative">
<img 
src={src} 
className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
alt={photo.title_en}
/>
<div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
<span className="material-symbols-outlined text-white text-3xl font-black">zoom_in</span>
</div>
</div>
<div className="p-4 bg-white z-10 border-t border-slate-50 text-center">
<span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-extrabold text-[8px] uppercase tracking-wider">
{language === 'English' ? photo.category_en : photo.category_ta}
</span>
<h4 className="text-xs font-bold text-slate-700 mt-1.5 truncate">
{language === 'English' ? photo.title_en : photo.title_ta}
</h4>
</div>
</div>
);
})}
</div>
)}
</section>
</div>
)}

{/* ─── VIEW 5: TRACK GRIEVANCE (FULL SCREEN RALLY BACKGROUND) ─── */}
{activeView === 'track' && (
<div 
className="relative w-full min-h-[85vh] py-16 px-4 flex items-center justify-center bg-no-repeat bg-cover bg-center bg-fixed"
style={{
backgroundImage: 'linear-gradient(rgba(2, 31, 11, 0.70), rgba(2, 31, 11, 0.78)), url("/rally_bg.jpg")',
}}
>
<section className="max-w-3xl mx-auto w-full animate-fadeIn z-10 relative">
<div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-10 border border-white/40 shadow-2xl space-y-8">

{/* Header Info */}
<div className="border-b border-emerald-50 pb-4 flex items-center gap-3">
<div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
<span className="material-symbols-outlined text-2xl font-bold">radar</span>
</div>
<div>
<h3 className="text-xl font-black text-emerald-955">{language === 'English' ? 'Track Grievance' : 'புகார் விசாரணை நிலை'}</h3>
<p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">{language === 'English' ? 'Real-Time Resolution Tracking' : 'நிகழ்நேர விசாரணை கண்காணிப்பு'}</p>
</div>
</div>

{/* Tracking Query input Form */}
<form id="search-track-form" onSubmit={handleTrackGrievance} className="flex gap-3">
<input
type="text"
required
value={trackId}
onChange={(e) => setTrackId(e.target.value)}
placeholder="Enter Tracking ID (e.g. PF202612345)"
className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-emerald-100 text-slate-800 text-xs focus:ring-1 focus:ring-emerald-600 focus:bg-white outline-none"
/>
<button
type="submit"
disabled={trackLoading}
className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider shadow-md focus:outline-none flex items-center gap-1.5"
>
{trackLoading ? (
<svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
) : (
<>
<span className="material-symbols-outlined text-sm font-bold">search</span>
<span>{language === 'English' ? 'Track' : 'தேடு'}</span>
</>
)}
</button>
</form>

{/* Stepper details results view */}
{trackResult && (
<div className="space-y-6 pt-4 border-t border-slate-100 animate-fadeIn">

{/* Summary Metadata card */}
<div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 grid grid-cols-2 gap-4 text-xs font-medium">
<div>
<span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide block">{language === 'English' ? 'Category' : 'வகை'}</span>
<span className="text-slate-800 font-bold">{trackResult.type_of_feedback}</span>
</div>
<div>
<span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide block">{language === 'English' ? 'Status' : 'விசாரணை நிலை'}</span>
<span className={`px-2 py-0.5 rounded text-3xs font-extrabold uppercase tracking-wider ${trackResult.status === 'Resolved' ? 'bg-green-150 text-green-700 border border-green-200' : trackResult.status === 'Duplicate' ? 'bg-orange-100 text-orange-700 border border-orange-200' : 'bg-blue-50 text-blue-600 border border-blue-200'}`}>
{trackResult.status}
</span>
</div>
<div className="col-span-2">
<span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide block">{language === 'English' ? 'Grievance Title' : 'தலைப்பு'}</span>
<span className="text-slate-850 font-bold">{trackResult.feedback_title}</span>
</div>
<div className="col-span-2">
<span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide block">{language === 'English' ? 'Description' : 'விளக்கம்'}</span>
<p className="text-slate-655 font-medium leading-relaxed">{trackResult.feedback_text}</p>
</div>
{trackResult.solution && (
<div className="col-span-2">
<span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide block">{language === 'English' ? 'Expected Solution' : 'எதிர்பார்க்கும் தீர்வு'}</span>
<p className="text-slate-655 font-medium leading-relaxed">{trackResult.solution}</p>
</div>
)}
</div>

{/* Timeline Stepper Component */}
<div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-4">
<span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide block mb-2">{language === 'English' ? 'Resolution Lifecycle Progress' : 'தீர்வு செயற்பாட்டு நிலை'}</span>

<div className="flex items-center justify-between relative">
<div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0"></div>

{/* Step 1: Received */}
<div className="flex flex-col items-center gap-1.5 z-10 relative">
<div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm">
<span className="material-symbols-outlined text-xs">done</span>
</div>
<span className="text-3xs font-black uppercase tracking-wider text-emerald-800">{language === 'English' ? 'Submitted' : 'சமர்ப்பிக்கப்பட்டது'}</span>
</div>

























































































































































































































































































































































































































































































































































































<option value="🤝">🤝 Volunteer / Camps</option>
<option value="💡">💡 Suggestion / Milestone</option>
</select>
</div>
</div>

<div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
<button
type="button"
onClick={() => setShowApproveModal(false)}
className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-500 font-bold text-xs uppercase tracking-wide hover:bg-slate-50"
>
{language === 'English' ? 'Cancel' : 'ரத்து செய்'}
</button>
<button
type="submit"
className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs uppercase tracking-wider shadow-md hover:scale-[1.01] transition"
>
{language === 'English' ? 'Publish Statement Live' : 'தளத்தில் வெளியிடு'}
</button>
</div>
</form>
</div>
</div>
)}

{/* ─── LIGHTBOX VIEWER OVERLAY ─── */}
{activeLightboxImage && (
<div className="fixed inset-0 z-[120] flex items-center justify-center p-4 backdrop-blur-xl bg-black/80 animate-fadeIn select-none">
<button 
onClick={() => setActiveLightboxImage(null)}
className="absolute right-6 top-6 text-white/70 hover:text-white transition-colors focus:outline-none bg-black/40 p-2.5 rounded-full"
title="Close"
>
<span className="material-symbols-outlined text-2xl font-black">close</span>
</button>

{/* Navigation controls */}
<div className="absolute left-4 top-1/2 -translate-y-1/2 z-[130]">
<button
onClick={() => {
const filtered = galleryFilter === 'All' ? galleryPhotos : galleryPhotos.filter(p => p.category_en === galleryFilter || p.category_ta === galleryFilter);
const idx = filtered.findIndex(p => p._id === activeLightboxImage._id);
if (idx > 0) setActiveLightboxImage(filtered[idx - 1]);
else setActiveLightboxImage(filtered[filtered.length - 1]);
}}
className="text-white hover:text-emerald-400 bg-black/40 hover:bg-black/60 p-3 rounded-full transition"
>
<span className="material-symbols-outlined font-black">chevron_left</span>
</button>
</div>

<div className="absolute right-4 top-1/2 -translate-y-1/2 z-[130]">
<button
onClick={() => {
const filtered = galleryFilter === 'All' ? galleryPhotos : galleryPhotos.filter(p => p.category_en === galleryFilter || p.category_ta === galleryFilter);
const idx = filtered.findIndex(p => p._id === activeLightboxImage._id);
if (idx < filtered.length - 1) setActiveLightboxImage(filtered[idx + 1]);
else setActiveLightboxImage(filtered[0]);
}}
className="text-white hover:text-emerald-400 bg-black/40 hover:bg-black/60 p-3 rounded-full transition"
>
<span className="material-symbols-outlined font-black">chevron_right</span>
</button>
</div>

{/* Image & Captions Card */}
<div className="relative max-w-4xl w-full flex flex-col items-center gap-4">
<img 
src={activeLightboxImage.image_url.startsWith('/uploads') ? (API + activeLightboxImage.image_url) : activeLightboxImage.image_url} 
className="max-h-[70vh] max-w-full rounded-[2rem] border border-white/10 shadow-2xl object-contain animate-scaleIn"
alt="Campaign view"
/>
<div className="bg-black/50 p-6 rounded-[2rem] text-center w-full max-w-xl border border-white/5 space-y-2 backdrop-blur-md">
<span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-extrabold text-[10px] uppercase tracking-wider">
{language === 'English' ? activeLightboxImage.category_en : activeLightboxImage.category_ta}
</span>
<h4 className="text-base font-bold text-white leading-tight">
{language === 'English' ? activeLightboxImage.title_en : activeLightboxImage.title_ta}
</h4>
<p className="text-3xs text-slate-400 font-bold uppercase tracking-widest">{activeLightboxImage.date}</p>
</div>
</div>
</div>
)}
</div>
);
}

