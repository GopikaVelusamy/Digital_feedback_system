// ============================================================
// FeedbackPage.jsx — Exact React conversion of feedback.html
// Star rating, district/constituency, image upload, status modal
// ============================================================
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { translationData, getLanguage, setLanguage } from '../utils/translations';
import { API } from '../config';

// Assembly data — exact from feedback.html
const assemblyData = {
  Chennai: ['Harbour','R.K. Nagar','Perambur','Kolathur','Villivakkam','Thiru-Vi-Ka-Nagar','Egmore','Royapuram','Chepauk-Thiruvallikeni','Thousand Lights','Anna Nagar','Virugampakkam','Saidapet','T. Nagar','Mylapore','Velachery'],
  Coimbatore: ['Mettupalayam','Sulur','Kavundampalayam','Coimbatore North','Thondamuthur','Coimbatore South','Singanallur','Kinathukadavu','Pollachi','Valparai'],
  Erode: ['Erode East','Erode West','Modakkurichi','Perundurai','Bhavani','Anthiyur','Gobichettipalayam','Bhavanisagar'],
  Madurai: ['Melur','Madurai East','Madurai West','Madurai North','Madurai South','Madurai Central','Thirupparankundram','Tirumangalam','Usilampatti'],
  Salem: ['Edappadi','Mettur','Omalur','Salem North','Salem South','Salem West','Veerapandi','Yercaud'],
  Tiruchirappalli: ['Srirangam','Tiruchirappalli West','Tiruchirappalli East','Thiruverumbur','Lalgudi','Manachanallur','Musiri','Thuraiyur'],
  Tirunelveli: ['Tirunelveli','Palayamkottai','Ambasamudram','Nanguneri','Radhapuram'],
  Vellore: ['Gudiyatham','Katpadi','Vellore','Anaikattu','Kilvaithinankuppam'],
  Dharmapuri: ['Dharmapuri','Pennagaram','Palacode','Pappireddippatti'],
  Namakkal: ['Rasipuram','Senthamangalam','Namakkal','Paramathi Velur','Tiruchengode','Kumarapalayam'],
  Dindigul: ['Palani','Oddanchatram','Athoor','Nilakkottai','Natham','Dindigul'],
  Thanjavur: ['Orathanadu','Papanasam','Thiruvaiyaru','Thanjavur','Pattukkottai','Peravurani'],
  Nagapattinam: ['Kilvelur','Nagapattinam','Vedaranyam'],
  Cuddalore: ['Panruti','Kurinjipadi','Bhuvanagiri','Chidambaram','Kattumannarkoil','Cuddalore','Neyveli'],
  Villupuram: ['Ulundurpettai','Rishivandiyam','Sankarapuram','Villupuram','Vanur','Tindivanam'],
  Kanchipuram: ['Uthiramerur','Kanchipuram','Sriperumbudur'],
  Tiruvallur: ['Gummidipoondi','Ponneri','Tiruttani','Thiruvallur','Poonamallee','Avadi','Madavaram'],
  Krishnagiri: ['Krishnagiri','Bargur','Hosur','Thalli','Uthangarai'],
  Thoothukudi: ['Thoothukudi','Tiruchendur','Srivaikuntam','Ottapidaram','Vilathikulam'],
  Virudhunagar: ['Rajapalayam','Srivilliputhur','Sattur','Sivakasi','Virudhunagar','Aruppukkottai'],
  Ramanathapuram: ['Paramakudi','Tiruvadanai','Ramanathapuram','Mudhukulathur'],
  Sivagangai: ['Sivaganga','Karaikudi','Tirupattur','Manamadurai'],
  Tenkasi: ['Tenkasi','Alangulam','Kadayanallur','Sankarankovil','Vasudevanallur'],
  Karur: ['Karur','Krishnarayapuram','Aravakurichi','Kulithalai'],
  Ariyalur: ['Ariyalur','Jayankondam'],
  Perambalur: ['Perambalur','Kunnam'],
  Theni: ['Bodinayakanur','Cumbum','Andipatti','Periyakulam'],
  Nilgiris: ['Ooty','Coonoor','Gudalur'],
};

export default function FeedbackPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Language state
  const [language, setLanguageState] = useState(getLanguage());
  const t = translationData[language];

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
    const userEmail = localStorage.getItem('user');
    const userRole = localStorage.getItem('role');
    Swal.fire({
      title: language === 'English' ? 'User Profile' : 'பயனர் சுயவிவரம்',
      html: `
        <div style="text-align: left; font-family: 'Manrope', sans-serif; line-height: 1.8;">
          <p><b>${language === 'English' ? 'Email Address' : 'மின்னஞ்சல் முகவரி'}:</b> ${userEmail}</p>
          <p><b>${language === 'English' ? 'Role' : 'பங்கு'}:</b> ${userRole === 'admin' ? (language === 'English' ? 'Administrator' : 'நிர்வாகி') : (language === 'English' ? 'Citizen' : 'குடிமகன்')}</p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: language === 'English' ? 'Logout' : 'வெளியேறு',
      confirmButtonColor: '#ef4444',
      cancelButtonText: language === 'English' ? 'Close' : 'மூடு',
      customClass: { popup: 'glass-popup' }
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        navigate('/');
      }
    });
  };

  const handleNotificationsClick = () => {
    Swal.fire({
      title: language === 'English' ? 'Notifications' : 'அறிவிப்புகள்',
      html: `
        <div style="text-align: left; font-family: 'Manrope', sans-serif; display: flex; flex-direction: column; gap: 12px;">
          <div style="padding: 12px; background: rgba(16, 185, 129, 0.1); border-radius: 8px; border: 1px solid rgba(16, 185, 129, 0.2);">
            <div style="font-weight: bold; color: #065f46; font-size: 14px;">
              ${language === 'English' ? 'System Welcome' : 'அமைப்பு வரவேற்பு'}
            </div>
            <div style="font-size: 12px; color: #1e293b; margin-top: 4px;">
              ${language === 'English' ? 'Welcome to Feedback. Submit your issues dynamically.' : 'கருத்துக்கு உங்களை வரவேற்கிறோம். உங்கள் பிரச்சனைகளை உடனுக்குடன் சமர்ப்பிக்கவும்.'}
            </div>
          </div>
          <div style="padding: 12px; background: rgba(16, 185, 129, 0.1); border-radius: 8px; border: 1px solid rgba(16, 185, 129, 0.2);">
            <div style="font-weight: bold; color: #065f46; font-size: 14px;">
              ${language === 'English' ? 'Issue Updates' : 'பிரச்சினை மேம்பாடுகள்'}
            </div>
            <div style="font-size: 12px; color: #1e293b; margin-top: 4px;">
              ${language === 'English' ? 'Updates on submitted issues will be notified via WhatsApp.' : 'சமர்ப்பிக்கப்பட்ட பிரச்சினைகளின் நிலை குறித்த அறிவிப்புகள் வாட்ஸ்அப் மூலம் உங்களுக்கு அனுப்பப்படும்.'}
            </div>
          </div>
        </div>
      `,
      confirmButtonText: language === 'English' ? 'Close' : 'மூடு',
      confirmButtonColor: '#15803d',
      customClass: { popup: 'glass-popup' }
    });
  };

  const handleInsightsClick = () => {
    Swal.fire({
      title: language === 'English' ? 'Constituency Insights' : 'தொகுதி நுண்ணறிவு',
      html: `
        <div style="text-align: left; font-family: 'Manrope', sans-serif; display: flex; flex-direction: column; gap: 16px;">
          <p style="font-size: 14px; color: #1e293b;">
            ${language === 'English' ? 'Here are the live public feedback trends in your region:' : 'உங்கள் பிராந்தியத்தின் தற்போதைய கருத்து போக்குகள்:'}
          </p>
          <div style="display: grid; grid-template-cols: 1fr 1fr; gap: 12px; text-align: center;">
            <div style="padding: 12px; background: #f1f5f9; border-radius: 8px;">
              <div style="font-size: 24px; font-weight: bold; color: #0f172a;">89%</div>
              <div style="font-size: 10px; color: #64748b; text-transform: uppercase; font-weight: bold; margin-top: 4px;">
                ${language === 'English' ? 'Resolution Rate' : 'தீர்வு விகிதம்'}
              </div>
            </div>
            <div style="padding: 12px; background: #f1f5f9; border-radius: 8px;">
              <div style="font-size: 24px; font-weight: bold; color: #0f172a;">2.4 Days</div>
              <div style="font-size: 10px; color: #64748b; text-transform: uppercase; font-weight: bold; margin-top: 4px;">
                ${language === 'English' ? 'Avg Response' : 'சராசரி பதில் நேரம்'}
              </div>
            </div>
          </div>
        </div>
      `,
      confirmButtonText: language === 'English' ? 'Close' : 'மூடு',
      confirmButtonColor: '#15803d',
      customClass: { popup: 'glass-popup' }
    });
  };

  const handleResourcesClick = () => {
    Swal.fire({
      title: language === 'English' ? 'Supporting Resources' : 'ஆதரவு ஆதாரங்கள்',
      html: `
        <div style="text-align: left; font-family: 'Manrope', sans-serif; line-height: 1.8;">
          <p style="font-size: 14px; color: #1e293b;">
            ${language === 'English' ? 'Useful contacts and official helpline links:' : 'பயனுள்ள தொடர்புகள் மற்றும் அதிகாரப்பூர்வ உதவிக்குறிப்பு இணைப்புகள்:'}
          </p>
          <ul style="padding-left: 20px; font-size: 13px; color: #334155; margin-top: 10px;">
            <li><b>${language === 'English' ? 'State Helpline' : 'மாநில உதவி எண்'}:</b> 1100</li>
            <li><b>${language === 'English' ? 'Grievance Portal' : 'குறைதீர்க்கும் போர்டல்'}:</b> tnegovernance.gov.in</li>
            <li><b>${language === 'English' ? 'Support Desk' : 'ஆதரவு மையம்'}:</b> contact@feedbackportal.org</li>
          </ul>
        </div>
      `,
      confirmButtonText: language === 'English' ? 'Close' : 'மூடு',
      confirmButtonColor: '#15803d',
      customClass: { popup: 'glass-popup' }
    });
  };

  // ─── District change → update constituencies ────────────────
  function handleDistrictChange(val) {
    setDistrict(val);
    setConstituency('');
    setConstituencies(assemblyData[val] || []);
  }

  // ─── WhatsApp radio + phone focus — exact from feedback.html ─
  function handleWhatsappChange(val) {
    setWhatsappNotify(val);
    if (val === 'yes') {
      document.getElementById('phone')?.focus();
    }
  }

  // ─── Image upload + preview — exact from feedback.html ──────
  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      showStatus('error', 'File Too Large', 'Maximum limit is 10MB.');
      e.target.value = '';
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  }

  function removePreview() {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  // ─── Step 1 to Step 2 Validation Check ──────────────────────
  function handleNextStep(e) {
    e.preventDefault();
    if (!phone || !district || !constituency || !boothWardNo || !category || !feedbackText) {
      showStatus('error', t.incompleteTitle, t.incompleteDesc);
      return;
    }
    if (!imageFile) {
      showStatus(
        'error', 
        language === 'English' ? 'Document Required' : 'ஆவணம் தேவை', 
        language === 'English' ? 'Please upload supporting documentation to proceed.' : 'தொடர ஆதரவு ஆவணங்களை பதிவேற்றவும்.'
      );
      return;
    }
    setFormStep(2);
  }

  // ─── Step 2 to Step 3 Final Submit ──────────────────────────
  async function handleFinalSubmit(e) {
    e.preventDefault();
    if (!solution) {
      showStatus(
        'error', 
        t.incompleteTitle, 
        language === 'English' ? 'Please describe your expected solution steps.' : 'எதிர்பார்க்கப்படும் தீர்வுப் படிகளை விவரிக்கவும்.'
      );
      return;
    }
    
    const email = localStorage.getItem('user');
    const formData = new FormData();
    formData.append('district', district);
    formData.append('constituency', constituency);
    formData.append('booth_no', phone);
    formData.append('booth_ward_no', boothWardNo);
    formData.append('email', email);
    formData.append('type_of_feedback', category);
    formData.append('feedback_text', feedbackText);
    formData.append('rating', rating);
    formData.append('solution', solution);
    if (imageFile) formData.append('image', imageFile);

    try {
      const res = await fetch(`${API}/api/feedback`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        setFormStep(3);
      } else {
        showStatus('error', t.serverErrorTitle, t.serverErrorDesc);
      }
    } catch (err) {
      showStatus('error', t.syncErrorTitle, t.syncErrorDesc);
    }
  }

  // ─── Reset / Redirect to Fresh Form ────────────────────────
  function handleReset() {
    setRating(0);
    setPhone('');
    setDistrict('');
    setConstituency('');
    setConstituencies([]);
    setBoothWardNo('');
    setCategory('');
    setFeedbackText('');
    setSolution('');
    setWhatsappNotify('');
    removePreview();
    setFormStep(1);
  }

  return (
    // ─── feedback.html body structure — exact ────────────────────
    <div
      className="font-body min-h-screen relative overflow-x-hidden text-[#064e3b] page-feedback-body sidebar-page"
      style={{
        fontFamily: "'Manrope', sans-serif",
        background: 'linear-gradient(135deg, #f0fdf4 0%, #e8fbf0 50%, #dcfce7 100%)',
      }}
    >
      {/* Background Blobs */}
      <div className="blob blob-1 opacity-20"></div>
      <div className="blob blob-2 opacity-20"></div>

      <div className="layout-container flex flex-col min-h-screen">

        {/* Header */}
        <header 
          className="flex items-center justify-between whitespace-nowrap border-b px-6 md:px-10 py-4 sticky top-0 z-50 backdrop-blur-xl transition-all duration-300"
          style={{
            background: 'rgba(255, 255, 255, 0.75)',
            borderColor: 'rgba(16, 185, 129, 0.15)',
          }}
        >
          <div className="flex items-center gap-3 md:gap-5">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-full border-2 border-[#15803d] shadow-md flex items-center justify-center overflow-hidden hover:scale-105 duration-300 transition-transform">
              <img src="/irratai_ellai.png" className="w-full h-full object-contain p-1" alt="ADMK Logo" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xs md:text-lg font-extrabold tracking-tight text-[#064e3b] select-none leading-tight font-serif">
                <span className="text-[#c0392b] block md:inline mr-1">அனைத்திந்திய</span>
                <span className="text-emerald-800 block md:inline mr-1">அண்ணா திராவிட</span>
                <span className="text-[#15803d] block md:inline">முன்னேற்றக் கழகம்</span>
              </h1>
              <p className="text-[8px] md:text-[10px] text-emerald-800/80 tracking-wide uppercase select-none mt-0.5">
                All India Anna Dravida Munnetra Kazhagam
              </p>
            </div>
          </div>
          <div className="flex flex-1 justify-end gap-4 md:gap-8">
            <nav className="hidden lg:flex items-center gap-9">
              {localStorage.getItem('role') === 'admin' && (
                <a
                  className="text-sm font-bold hover:text-emerald-700 transition-colors text-emerald-800"
                  href="#"
                  onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }}
                >
                  {t.dashboardLink}
                </a>
              )}
              <a
                className="text-sm font-bold hover:text-emerald-700 transition-colors text-emerald-800"
                href="#"
                onClick={(e) => { e.preventDefault(); handleInsightsClick(); }}
              >
                {t.insightsLink}
              </a>
              <a
                className="text-sm font-bold hover:text-emerald-700 transition-colors text-emerald-800"
                href="#"
                onClick={(e) => { e.preventDefault(); handleResourcesClick(); }}
              >
                {t.resourcesLink}
              </a>
            </nav>
            <div className="flex gap-2 items-center">
              {/* Language Switcher */}
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="appearance-none rounded-xl h-10 pl-4 pr-10 bg-white border border-emerald-200 text-emerald-800 font-bold text-sm focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none cursor-pointer shadow-sm"
                >
                  <option value="English" className="bg-white text-emerald-850">English</option>
                  <option value="Tamil" className="bg-white text-emerald-850">தமிழ்</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
                  <span className="material-symbols-outlined text-emerald-600 text-lg">expand_more</span>
                </div>
              </div>

              <button
                onClick={handleNotificationsClick}
                className="flex items-center justify-center rounded-xl h-10 w-10 bg-white hover:bg-emerald-50 border border-emerald-200 text-emerald-700 hover:text-emerald-950 transition shadow-sm"
              >
                <span className="material-symbols-outlined text-[20px]">notifications</span>
              </button>
              <button
                onClick={handleProfileClick}
                className="flex items-center justify-center rounded-xl h-10 w-10 bg-white hover:bg-emerald-50 border border-emerald-200 text-emerald-700 hover:text-emerald-950 transition shadow-sm"
              >
                <span className="material-symbols-outlined text-[20px]">account_circle</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 relative py-12 md:py-24 overflow-hidden flex justify-center px-4">
          <img
            src="/stars.png"
            className="absolute left-[-20px] bottom-[-50px] w-[40vw] max-w-[400px] opacity-10 pointer-events-none"
            style={{ zIndex: 1 }}
            alt="Stars Background"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <img
            src="/both.png"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] max-w-[700px] opacity-10 pointer-events-none blur-[1px]"
            style={{ zIndex: 1 }}
            alt="Background 3D"
            onError={(e) => { e.target.style.display = 'none'; }}
          />

          <div className="w-full max-w-[800px] flex flex-col gap-8 relative z-10">
            {/* Title */}
            <div className="flex flex-col gap-3 text-center md:text-left">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight text-[#064e3b] select-none font-['Tiro_Tamil',serif]">
                {t.shareInsight}
              </h1>
              <p className="text-sm md:text-lg font-body text-emerald-900/90 font-semibold leading-relaxed max-w-2xl">
                {t.feedbackSubtitle}
              </p>
            </div>

            {/* Form Card */}
            <div 
              className="rounded-[2rem] p-6 md:p-12 shadow-2xl overflow-hidden relative mx-auto w-full"
              style={{
                background: 'rgba(255, 255, 255, 0.75)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                backdropFilter: 'blur(24px)',
              }}
            >
              <div className="flex flex-col gap-8 relative z-10">
                {formStep === 1 && (
                  <>
                    {/* Form Header */}
                    <div className="flex items-center gap-4 bg-emerald-50 border-b border-emerald-200/50 p-6 rounded-t-[2rem] -mx-12 -mt-12 mb-4 shadow-sm">
                      <div className="p-3 rounded-lg bg-emerald-100 text-emerald-800">
                        <span className="material-symbols-outlined text-3xl">rate_review</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-display font-bold text-[#064e3b]">{t.feedbackDetails}</h3>
                        <p className="text-sm text-emerald-700 font-medium">{t.feedbackDetailsDesc}</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-6">
                      {/* Star Rating */}
                      <label className="text-sm font-display font-bold uppercase tracking-[2px] text-emerald-800 text-center md:text-left">
                        {t.ratingLabel}
                      </label>
                      <div className="flex justify-center gap-3 text-4xl cursor-pointer star-rating">
                        {[1, 2, 3, 4, 5].map((val) => (
                          <span
                            key={val}
                            data-value={val}
                            className={`star transition-all duration-300 ${
                              val <= (hoverRating || rating) ? 'text-yellow-400 text-shadow-glow' : 'text-slate-300'
                            }`}
                            style={{
                              transform: val <= (hoverRating || rating) ? 'scale(1.2)' : 'scale(1)',
                            }}
                            onClick={() => setRating(val)}
                            onMouseEnter={() => setHoverRating(val)}
                            onMouseLeave={() => setHoverRating(0)}
                          >
                            ★
                          </span>
                        ))}
                      </div>

                      {/* Phone + District Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-display font-bold uppercase tracking-wider text-emerald-800">
                            {t.phoneLabel}
                          </label>
                          <input
                            id="phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder={t.phonePlaceholder}
                            required
                            className="w-full rounded-xl border border-emerald-200 bg-white text-[#064e3b] p-4 font-body focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none shadow-sm"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-display font-bold uppercase tracking-wider text-emerald-800">
                            {t.districtLabel}
                          </label>
                          <div className="relative">
                            <select
                              id="district"
                              value={district}
                              onChange={(e) => handleDistrictChange(e.target.value)}
                              className="appearance-none w-full rounded-xl border border-emerald-200 bg-white text-[#064e3b] p-4 font-body focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none shadow-sm"
                            >
                              <option value="" className="bg-white text-emerald-950">{t.districtPlaceholder}</option>
                              {Object.keys(assemblyData).map((d) => (
                                <option key={d} value={d} className="bg-white text-emerald-950">{d}</option>
                              ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                              <span className="material-symbols-outlined text-emerald-600">expand_more</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Constituency + Booth/Ward No Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-display font-bold uppercase tracking-wider text-emerald-800">
                            {t.constituencyLabel}
                          </label>
                          <div className="relative">
                            <select
                              id="constituency"
                              value={constituency}
                              onChange={(e) => setConstituency(e.target.value)}
                              className="appearance-none w-full rounded-xl border border-emerald-200 bg-white text-[#064e3b] p-4 font-body focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none shadow-sm"
                            >
                              <option value="" className="bg-white text-emerald-950">{t.constituencyPlaceholder}</option>
                              {constituencies.map((c) => (
                                <option key={c} value={c} className="bg-white text-emerald-950">{c}</option>
                              ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                              <span className="material-symbols-outlined text-emerald-600">expand_more</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-display font-bold uppercase tracking-wider text-emerald-800">
                            {t.boothWardLabel}
                          </label>
                          <input
                            id="boothWardNo"
                            type="text"
                            value={boothWardNo}
                            onChange={(e) => setBoothWardNo(e.target.value)}
                            placeholder={t.boothWardPlaceholder}
                            required
                            className="w-full rounded-xl border border-emerald-200 bg-white text-[#064e3b] p-4 font-body focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none shadow-sm"
                          />
                        </div>
                      </div>

                      {/* Category */}
                      <div className="grid grid-cols-1 gap-6 mt-4">
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-display font-bold uppercase tracking-wider text-emerald-800">
                            {t.categoryLabel}
                          </label>
                          <div className="relative">
                            <select
                              id="category"
                              value={category}
                              onChange={(e) => setCategory(e.target.value)}
                              className="appearance-none w-full rounded-xl border border-emerald-200 bg-white text-[#064e3b] p-4 font-body focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none shadow-sm"
                            >
                              <option value="" className="bg-white text-emerald-950">{t.categoryPlaceholder}</option>
                              <option value="road" className="bg-white text-emerald-950">{t.catRoad}</option>
                              <option value="power" className="bg-white text-emerald-950">{t.catPower}</option>
                              <option value="water" className="bg-white text-emerald-950">{t.catWater}</option>
                              <option value="security" className="bg-white text-emerald-950">{t.catSecurity}</option>
                              <option value="sanitation" className="bg-white text-emerald-950">{t.catSanitation}</option>
                              <option value="other" className="bg-white text-emerald-950">{t.catOther}</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                              <span className="material-symbols-outlined text-emerald-600">expand_more</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Textarea */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-display font-bold uppercase tracking-wider text-emerald-800">
                          {t.messageLabel}
                        </label>
                        <textarea
                          id="feedback"
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                          className="w-full min-h-[180px] font-body rounded-xl border border-emerald-200 bg-white text-[#064e3b] p-4 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none placeholder:text-emerald-600/40"
                          placeholder={t.messagePlaceholder}
                        />
                        <div className="flex justify-end mt-1">
                          <span className="text-[10px] text-emerald-700/60 uppercase font-display font-bold">
                            {t.maxChars}
                          </span>
                        </div>
                      </div>

                      {/* File Upload */}
                      <div className="flex flex-col gap-2">
                        <label className="text-emerald-850 text-xs font-display font-bold uppercase tracking-wider text-center">
                          {t.docLabel}
                        </label>
                        <div
                          className="border-2 border-dashed border-emerald-200 rounded-xl p-8 flex flex-col items-center justify-center gap-2 bg-white hover:bg-emerald-50/50 transition-colors cursor-pointer group"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <span className="material-symbols-outlined text-4xl text-emerald-600 group-hover:scale-110 transition-transform">
                            cloud_upload
                          </span>
                          <div className="text-center font-body">
                            <p className="text-sm font-bold text-emerald-800">
                              {t.docDesc}
                            </p>
                            <input
                              type="file"
                              id="fileUpload"
                              ref={fileInputRef}
                              className="hidden"
                              onChange={handleFileChange}
                              accept="image/*,.pdf"
                            />
                            <p className="text-xs text-emerald-700/60">{t.docSizeLimit}</p>
                          </div>
                        </div>
                        {/* Image Preview */}
                        {imagePreview && (
                          <div
                            id="previewContainer"
                            className="mt-6 p-4 bg-white border border-emerald-200 rounded-2xl flex flex-col items-center gap-3 animate-in fade-in zoom-in duration-500 shadow-sm"
                          >
                            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                              {t.selectedPreview}
                            </p>
                            <img
                              src={imagePreview}
                              className="max-w-full h-48 object-cover rounded-xl shadow-2xl border-2 border-emerald-200"
                              alt="Preview"
                            />
                            <button
                              type="button"
                              onClick={removePreview}
                              className="text-xs text-red-600 font-bold hover:underline mt-2"
                            >
                              {t.removeImage}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* WhatsApp Notification */}
                      <div className="flex flex-col gap-4 mt-6">
                        <label className="text-xs font-display font-bold uppercase tracking-wider text-emerald-800">
                          {t.notifLabel}
                        </label>
                        <p className="text-xs text-emerald-800/80">
                          {t.notifDesc}
                        </p>
                        <div className="flex gap-6 mt-2">
                          <label className="flex items-center gap-2 cursor-pointer text-emerald-800 hover:text-emerald-950 font-semibold">
                            <input
                              type="radio"
                              name="whatsappNotify"
                              value="yes"
                              className="accent-emerald-600 w-4 h-4"
                              checked={whatsappNotify === 'yes'}
                              onChange={() => handleWhatsappChange('yes')}
                            />
                            <span className="text-sm">{t.yes}</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer text-emerald-800 hover:text-emerald-950 font-semibold">
                            <input
                              type="radio"
                              name="whatsappNotify"
                              value="no"
                              className="accent-emerald-600 w-4 h-4"
                              checked={whatsappNotify === 'no'}
                              onChange={() => handleWhatsappChange('no')}
                            />
                            <span className="text-sm">{t.no}</span>
                          </label>
                        </div>
                      </div>

                      {/* Next Button */}
                      <div className="flex flex-col items-center pt-4">
                        <button
                          onClick={handleNextStep}
                          className="px-10 py-4 rounded-full bg-emerald-600 text-white font-display font-bold tracking-wide shadow-md hover:shadow-lg hover:bg-emerald-700 hover:-translate-y-1 transition-all duration-300"
                        >
                          {language === 'English' ? 'Next' : 'அடுத்து'}
                        </button>
                        <p className="text-[11px] text-emerald-700/60 mt-4 max-w-sm text-center font-body">
                          {language === 'English' 
                            ? 'By submitting, you agree to our Terms of Service and recognize that your feedback will be reviewed by the Ethics Committee.'
                            : 'சமர்ப்பிப்பதன் மூலம், நீங்கள் எங்கள் சேவை விதிமுறைகளை ஒப்புக்கொள்கிறீர்கள் மற்றும் உங்கள் கருத்து ஒழுங்குமுறைக் குழுவால் மதிப்பாய்வு செய்யப்படும் என்பதை அங்கீகரிக்கிறீர்கள்.'}
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {formStep === 2 && (
                  <>
                    {/* Step 2 Header */}
                    <div className="flex items-center gap-4 bg-emerald-50 border-b border-emerald-200/50 p-6 rounded-t-[2rem] -mx-12 -mt-12 mb-4 shadow-md">
                      <div className="p-3 rounded-lg bg-emerald-100 text-emerald-800">
                        <span className="material-symbols-outlined text-3xl">lightbulb</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-display font-bold text-[#064e3b]">
                          {language === 'English' ? 'Expected Solution' : 'எதிர்பார்க்கப்படும் தீர்வு'}
                        </h3>
                        <p className="text-sm text-emerald-700 font-medium">
                          {language === 'English' ? 'How are you expecting the problem to be solved?' : 'பிரச்சனை எவ்வாறு தீர்க்கப்பட வேண்டும் என்று எதிர்பார்க்கிறீர்கள்?'}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-display font-bold uppercase tracking-wider text-emerald-800">
                          {language === 'English' ? 'Expected solutions / steps to be taken' : 'எதிர்பார்க்கப்படும் தீர்வுகள் / எடுக்கப்பட வேண்டிய நடவடிக்கைகள்'}
                        </label>
                        <textarea
                          value={solution}
                          onChange={(e) => setSolution(e.target.value)}
                          className="w-full min-h-[180px] font-body rounded-xl border border-emerald-200 bg-white text-[#064e3b] p-4 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none placeholder:text-emerald-600/40"
                          placeholder={language === 'English' ? 'Describe the steps or actions you expect to be taken...' : 'எடுக்கப்பட வேண்டிய நடவடிக்கைகள் அல்லது படிகளை விவரிக்கவும்...'}
                          required
                        />
                      </div>

                      <div className="flex justify-between items-center pt-4">
                        <button
                          onClick={() => setFormStep(1)}
                          className="px-8 py-3 rounded-full border border-emerald-200 text-emerald-700 font-display font-bold hover:bg-emerald-50 transition-all duration-300"
                        >
                          {language === 'English' ? 'Back' : 'பின்செல்லவும்'}
                        </button>
                        <button
                          onClick={handleFinalSubmit}
                          className="px-10 py-4 rounded-full bg-emerald-600 text-white font-display font-bold tracking-wide shadow-md hover:shadow-lg hover:bg-emerald-700 transition-all duration-300"
                        >
                          {language === 'English' ? 'Submit Feedback' : 'கருத்தைச் சமர்ப்பிக்கவும்'}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {formStep === 3 && (
                  <>
                    {/* Step 3 Header */}
                    <div className="flex items-center gap-4 bg-emerald-50 border-b border-emerald-200/50 p-6 rounded-t-[2rem] -mx-12 -mt-12 mb-4 shadow-md">
                      <div className="p-3 rounded-lg bg-emerald-100 text-emerald-800">
                        <span className="material-symbols-outlined text-3xl">task_alt</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-display font-bold text-[#064e3b]">
                          {language === 'English' ? 'Submission Successful' : 'வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது'}
                        </h3>
                        <p className="text-sm text-emerald-700 font-medium">
                          {language === 'English' ? 'Feedback Submitted' : 'கருத்து சமர்ப்பிக்கப்பட்டது'}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-6 py-8 text-center">
                      <div className="w-20 h-20 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700">
                        <span className="material-symbols-outlined" style={{ fontSize: '48px' }}>check_circle</span>
                      </div>
                      
                      <div className="space-y-3">
                        <h2 className="text-2xl font-bold text-[#064e3b]">
                          {language === 'English' ? 'Your query got submitted' : 'உங்கள் கேள்வி சமர்ப்பிக்கப்பட்டது'}
                        </h2>
                        <p className="text-base text-emerald-900/80 max-w-md leading-relaxed font-semibold">
                          {language === 'English'
                            ? 'Thank you for submitting, reach us again.'
                            : 'சமர்ப்பித்ததற்கு நன்றி, மீண்டும் எங்களைத் தொடர்பு கொள்ளவும்.'}
                        </p>
                        <p className="text-xs text-emerald-700/60 max-w-sm mt-4 mx-auto">
                          {language === 'English'
                            ? 'If you have any further queries, please email us at contact@feedbackportal.org or call 1800-425-4789.'
                            : 'உங்களுக்கு ஏதேனும் கூடுதல் கேள்விகள் இருந்தால், எங்களை contact@feedbackportal.org இல் தொடர்பு கொள்ளவும் அல்லது 1800-425-4789 என்ற எண்ணை அழைக்கவும்.'}
                        </p>
                      </div>

                      <button
                        onClick={handleReset}
                        className="mt-6 px-10 py-4 rounded-full bg-emerald-600 text-white font-display font-bold tracking-wide shadow-md hover:shadow-lg hover:bg-emerald-700 transition-all duration-300"
                      >
                        {language === 'English' ? 'Continue' : 'தொடரவும்'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white/70 border border-emerald-100 flex items-center gap-4 shadow-sm">
                <div className="size-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
                  <span className="material-symbols-outlined">verified_user</span>
                </div>
                <div>
                  <p className="text-xs font-display font-bold text-emerald-700">Secure</p>
                  <p className="text-xs font-display font-bold text-emerald-900/85">End-to-end encrypted</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/70 border border-emerald-100 flex items-center gap-4 shadow-sm">
                <div className="size-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
                  <span className="material-symbols-outlined">history</span>
                </div>
                <div>
                  <p className="text-xs font-display font-bold text-emerald-700">History</p>
                  <p className="text-xs font-display font-bold text-emerald-900/85">Track your progress</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/70 border border-emerald-100 flex items-center gap-4 shadow-sm">
                <div className="size-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
                  <span className="material-symbols-outlined">support_agent</span>
                </div>
                <div>
                  <p className="text-xs font-display font-bold text-emerald-700">Support</p>
                  <p className="text-xs font-display font-bold text-emerald-900/85">24/7 internal assistance</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-10 px-10 border-t border-emerald-100 mt-auto bg-white/60">
          <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 text-emerald-700/50">
              <span className="material-symbols-outlined text-[18px]">copyright</span>
              <span className="text-sm font-medium font-body">2026 Feedback</span>
            </div>
            <div className="flex gap-8">
              <a className="text-sm hover:text-emerald-700 transition-colors font-body text-emerald-750/60" href="#">Help Center</a>
              <a className="text-sm hover:text-emerald-700 transition-colors font-body text-emerald-750/60" href="#">Data Processing</a>
              <a className="text-sm hover:text-emerald-700 transition-colors font-body text-emerald-750/60" href="#">Legal Notice</a>
            </div>
          </div>
        </footer>
      </div>

      {/* ── Status Overlay Modal — exact from feedback.html ── */}
      {modalVisible && (
        <div id="statusOverlay" className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            id="statusBlur"
            className="absolute inset-0 bg-black/20 backdrop-blur-md"
            onClick={closeStatus}
          ></div>
          <div
            id="statusCard"
            className={`relative w-full max-w-md p-10 rounded-[2.5rem] border border-white/40 shadow-2xl flex flex-col items-center gap-8 text-center transition-all duration-500 ${
              modalType === 'success' ? 'glass-success' : 'glass-error'
            } ${modalAnimOut ? 'modal-outro' : 'scale-100 opacity-100'}`}
          >
            <div id="iconBox" className="size-24 rounded-full flex items-center justify-center shadow-inner relative overflow-hidden icon-pop">
              {modalType === 'success' ? (
                <svg id="svgSuccess" className="size-16" viewBox="0 0 52 52">
                  <circle cx="26" cy="26" r="25" fill="none" stroke="#10B981" strokeWidth="2" />
                  <path className="checkmark-path" fill="none" stroke="#10B981" strokeWidth="4" strokeLinecap="round" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                </svg>
              ) : (
                <svg id="svgError" className="size-16" viewBox="0 0 52 52">
                  <circle cx="26" cy="26" r="25" fill="none" stroke="#EF4444" strokeWidth="2" />
                  <path className="checkmark-path" fill="none" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" d="M16 16l20 20M36 16L16 36" />
                </svg>
              )}
            </div>
            <div>
              <h3 id="statusTitle" style={{ color: '#0f291b', fontWeight: 900 }} className="text-3xl font-display tracking-tight">
                {modalTitle}
              </h3>
              <p id="statusDesc" style={{ color: '#374151', fontWeight: 600 }} className="mt-3 font-body leading-relaxed">
                {modalDesc}
              </p>
            </div>
            <button
              id="statusBtn"
              onClick={closeStatus}
              className={`w-full py-5 rounded-[1.5rem] font-bold text-white shadow-xl transition-all active:scale-95 hover:brightness-110 tracking-widest uppercase text-xs ${
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
    </div>
  );
}
