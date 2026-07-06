# InsightFlow — React Migration Guide
## Complete Setup & Run Instructions

---

## 📁 Full Project File Structure

```
insightflow-react/
├── public/
│   └── index.html              ← ALL CDN scripts live here (Tailwind, ApexCharts, Flatpickr, Leaflet, Fonts)
├── src/
│   ├── index.js                ← React entry point
│   ├── App.js                  ← React Router: all 7 routes + auth guards
│   ├── styles/
│   │   └── global.css          ← EXACT copy of your style.css (nothing changed)
│   ├── components/
│   │   └── Sidebar.jsx         ← Shared sidebar (Dashboard + Critical Issues + SuperAdmin)
│   └── pages/
│       ├── LoginPage.jsx       ← was: glass.html
│       ├── SuperLoginPage.jsx  ← was: super-login.html
│       ├── DashboardPage.jsx   ← was: Dashboard.html
│       ├── CriticalIssuesPage.jsx ← was: Criticalissues.html
│       ├── FeedbackPage.jsx    ← was: feedback.html
│       ├── FeedbackDetailPage.jsx ← was: feedback2.html
│       ├── SuperAdminPage.jsx  ← was: superadmin.html
│       └── CreateAdminPage.jsx ← was: createadmin.html
└── package.json
```

---

## 🚀 Step-by-Step Setup

### Step 1: Create a new React app

```bash
npx create-react-app insightflow-react
cd insightflow-react
```

### Step 2: Install required npm packages

```bash
npm install react-router-dom sweetalert2
```

> **Note:** ApexCharts, Flatpickr, Leaflet, and Tailwind are loaded via CDN in `public/index.html`
> — no npm install needed for those, exactly like your original HTML files.

### Step 3: Replace files

Replace the default files with the ones provided:

```
# Delete default src/ contents
rm src/App.js src/App.css src/index.js src/index.css src/logo.svg

# Copy all provided files into src/
# Copy public/index.html (replace the default one)
```

### Step 4: Create folders

```bash
mkdir src/pages src/components src/styles
```

### Step 5: Copy your static image assets

Your `feedback.html` uses these local images. Copy them to `public/`:
```
public/
├── original-b046f8051916131f3a59ae97bd20423d.webp   ← feedback page background
├── stars.png
├── both.png
├── phone2.png
└── like1-removebg-preview.png
```

### Step 6: Start development server

```bash
npm start
```

App opens at: **http://localhost:3000**

---

## 🔗 URL Routes (replaces .html file navigation)

| Old HTML File | New React Route |
|---|---|
| `glass.html` | `http://localhost:3000/` |
| `super-login.html` | `http://localhost:3000/super-login` |
| `Dashboard.html` | `http://localhost:3000/dashboard` |
| `Criticalissues.html` | `http://localhost:3000/critical-issues` |
| `feedback.html` | `http://localhost:3000/feedback` |
| `feedback2.html?id=xxx` | `http://localhost:3000/feedback-detail?id=xxx` |
| `superadmin.html` | `http://localhost:3000/super-admin` |
| `createadmin.html` | `http://localhost:3000/create-admin` |

---

## 🔄 How HTML → React Conversion Works

### 1. Navigation
```js
// OLD (HTML)
window.location.href = "Dashboard.html";

// NEW (React)
const navigate = useNavigate();
navigate('/dashboard');
```

### 2. URL Parameters
```js
// OLD (HTML)
const urlParams = new URLSearchParams(window.location.search);
const feedbackId = urlParams.get('id');

// NEW (React)
const [searchParams] = useSearchParams();
const feedbackId = searchParams.get('id');
```

### 3. Inline Scripts → useState / useEffect
```js
// OLD (HTML)
window.onload = function() { loadData(); }

// NEW (React)
useEffect(() => { loadData(); }, []);
```

### 4. DOM Manipulation → State
```js
// OLD (HTML)
document.getElementById('totalFeedback').innerText = data.total_feedbacks;

// NEW (React)
const [total, setTotal] = useState(0);
setTotal(data.total_feedbacks);
// In JSX: <h3>{total}</h3>
```

### 5. Security Guards (inline script) → Route Guards
```js
// OLD (HTML - inline script at top of page)
if (localStorage.getItem("role") !== "admin") {
  window.location.href = "glass.html";
}

// NEW (React - in App.js)
function AdminRoute({ children }) {
  const role = localStorage.getItem('role');
  if (role !== 'admin') return <Navigate to="/" />;
  return children;
}
```

### 6. CDN Libraries (ApexCharts, Flatpickr) — Still via CDN
These libraries are kept in `public/index.html` as `<script>` tags.
Access them in React via `window.ApexCharts` and `window.flatpickr`.

---

## 🎨 Styles — Zero Changes

Your `style.css` is copied **100% unchanged** to `src/styles/global.css`.

Every class you used:
- `.glass-card` ✅
- `.glass-panel` ✅
- `.bg-glow`, `.glow-grey`, `.glow-cherry` ✅
- `.nav-link`, `.active-link` ✅
- `.issue-card`, `.issue-card.active` ✅
- `.resolver-item` ✅
- `.gold-glass`, `.btn-master` ✅
- `.animate-float` ✅
- All responsive `@media` queries ✅
- All SweetAlert2 `.swal2-*` overrides ✅
- All Flatpickr `.flatpickr-*` overrides ✅
- All `@keyframes` animations ✅

---

## 📦 Dependencies

### npm packages (install these)
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.22.0",
  "react-scripts": "5.0.1",
  "sweetalert2": "^11.10.0"
}
```

### CDN (already in public/index.html — no install needed)
- Tailwind CSS v3
- ApexCharts
- Flatpickr
- Leaflet
- Google Fonts (Manrope, Space Grotesk, Public Sans)
- Material Symbols Outlined (icons)

---

## 🐍 Backend — No Changes Needed

Your Python FastAPI backend remains **exactly the same**.
All API calls still hit `http://127.0.0.1:8000`.

Make sure your Python server is running before using the React app:
```bash
uvicorn main:app --reload
# or
python main.py
```

---

## 🏗️ Build for Production

```bash
npm run build
```

This creates an optimized `build/` folder you can deploy to any web server.

---

## ✅ Checklist Before Running

- [ ] Python backend running on port 8000
- [ ] `npm install` completed
- [ ] All image assets copied to `public/`
- [ ] `src/styles/global.css` has your style.css content
- [ ] All page files in `src/pages/`
- [ ] `Sidebar.jsx` in `src/components/`
- [ ] `public/index.html` has all CDN links

---

*All original designs, animations, colors, fonts, glassmorphism effects, and functionality preserved exactly.*
