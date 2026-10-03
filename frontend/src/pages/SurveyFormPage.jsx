// ============================================================
// SurveyFormPage.jsx — Step 2: Fill & Submit Survey
// Fetches questions from /api/survey-questions
// Submits to /api/survey-responses
// ============================================================
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../config';

const LABELS = {
  en: {
    title: 'Public Survey',
    step: 'Step 2 of 3',
    respondent: 'Respondent Details (Optional)',
    resp_name: 'Name',
    resp_age: 'Age',
    resp_gender: 'Gender',
    gender_m: 'Male',
    gender_f: 'Female',
    gender_o: 'Other',
    loading: 'Loading questions...',
    no_q: 'No survey questions available. Please contact admin.',
    submit: 'Submit Survey',
    submitting: 'Submitting...',
    back: '← Back',
    required: 'This field is required',
    rating_label: ['Very Bad', 'Bad', 'Neutral', 'Good', 'Very Good'],
    yes: 'Yes',
    no: 'No',
  },
  ta: {
    title: 'பொது கணக்கெடுப்பு',
    step: 'படி 2 / 3',
    respondent: 'பதிலளிப்பவர் விவரங்கள் (விரும்பினால்)',
    resp_name: 'பெயர்',
    resp_age: 'வயது',
    resp_gender: 'பாலினம்',
    gender_m: 'ஆண்',
    gender_f: 'பெண்',
    gender_o: 'மற்றவை',
    loading: 'கேள்விகள் ஏற்றுகிறது...',
    no_q: 'கணக்கெடுப்பு கேள்விகள் இல்லை. நிர்வாகியை தொடர்புகொள்ளவும்.',
    submit: 'கணக்கெடுப்பை சமர்ப்பிக்கவும்',
    submitting: 'சமர்ப்பிக்கிறது...',
    back: '← திரும்பு',
    required: 'இந்த புலம் தேவை',
    rating_label: ['மிகவும் மோசம்', 'மோசம்', 'நடுநிலை', 'நல்லது', 'மிகவும் நல்லது'],
    yes: 'ஆம்',
    no: 'இல்லை',
  }
};

export default function SurveyFormPage() {
  const navigate = useNavigate();
  const [lang, setLang] = useState('ta');
  const L = LABELS[lang];

  const surveyorRaw = localStorage.getItem('surveyor');
  const surveyor = surveyorRaw ? JSON.parse(surveyorRaw) : null;
  const locationRaw = sessionStorage.getItem('survey_location');
  const location = locationRaw ? JSON.parse(locationRaw) : null;

  useEffect(() => {
    if (!surveyor) navigate('/surveyor-login');
    if (!location) navigate('/survey/location');
  }, []);

  const [questions, setQuestions] = useState([]);
  const [loadingQ, setLoadingQ] = useState(true);
  const [answers, setAnswers] = useState({});
  const [respondentName, setRespondentName] = useState('');
  const [respondentAge, setRespondentAge] = useState('');
  const [respondentGender, setRespondentGender] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetch(`${API}/api/survey-questions`)
      .then(r => r.json())
      .then(data => { setQuestions(data); setLoadingQ(false); })
      .catch(() => setLoadingQ(false));
  }, []);

  function setAnswer(qid, value) {
    setAnswers(prev => ({ ...prev, [qid]: value }));
    setErrors(prev => ({ ...prev, [qid]: '' }));
  }

  function validate() {
    const errs = {};
    questions.forEach(q => {
      if (q.required && !answers[q._id]) {
        errs[q._id] = L.required;
      }
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const answersList = questions.map(q => ({
      question_id: q._id,
      question_text: q.question_text,
      answer: answers[q._id] || ''
    }));

    const payload = {
      surveyor_email: surveyor?.email || '',
      surveyor_name:  surveyor?.name  || '',
      ...location,
      answers: answersList,
      respondent_name:   respondentName,
      respondent_age:    respondentAge,
      respondent_gender: respondentGender,
    };

    try {
      const res = await fetch(`${API}/api/survey-responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.message && data.message.includes('success')) {
        sessionStorage.setItem('survey_submitted_id', data.id || '');
        navigate('/survey/success');
      } else {
        alert('Submission failed. Please try again.');
      }
    } catch (err) {
      // Offline fallback — save to localStorage queue
      const queue = JSON.parse(localStorage.getItem('offline_survey_queue') || '[]');
      queue.push({ ...payload, offline: true, queued_at: new Date().toISOString() });
      localStorage.setItem('offline_survey_queue', JSON.stringify(queue));
      navigate('/survey/success?offline=1');
    }
    setSubmitting(false);
  }

  function renderQuestion(q) {
    const qText = lang === 'ta' && q.question_text_ta ? q.question_text_ta : q.question_text;
    const opts = lang === 'ta' && q.options_ta?.length ? q.options_ta : q.options;

    return (
      <div key={q._id} style={styles.qCard}>
        <p style={styles.qText}>
          {q.required && <span style={styles.req}>* </span>}
          {qText}
        </p>

        {/* MCQ */}
        {q.type === 'mcq' && (
          <div style={styles.optionsList}>
            {(opts || []).map((opt, i) => (
              <label key={i} style={{
                ...styles.optionLabel,
                ...(answers[q._id] === opt ? styles.optionSelected : {})
              }}>
                <input
                  type="radio"
                  name={`q_${q._id}`}
                  value={opt}
                  checked={answers[q._id] === opt}
                  onChange={() => setAnswer(q._id, opt)}
                  style={{ marginRight: '8px' }}
                />
                {opt}
              </label>
            ))}
          </div>
        )}

        {/* Yes / No */}
        {q.type === 'yesno' && (
          <div style={{ display: 'flex', gap: '12px' }}>
            {[L.yes, L.no].map(opt => (
              <button
                type="button"
                key={opt}
                onClick={() => setAnswer(q._id, opt)}
                style={{
                  ...styles.yesNoBtn,
                  ...(answers[q._id] === opt ? styles.yesNoActive : {})
                }}
              >{opt}</button>
            ))}
          </div>
        )}

        {/* Rating 1-5 */}
        {q.type === 'rating' && (
          <div>
            <div style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  type="button"
                  key={n}
                  onClick={() => setAnswer(q._id, String(n))}
                  style={{
                    ...styles.ratingBtn,
                    ...(answers[q._id] === String(n) ? styles.ratingActive : {})
                  }}
                >{n}</button>
              ))}
            </div>
            {answers[q._id] && (
              <p style={styles.ratingHint}>
                {L.rating_label[parseInt(answers[q._id]) - 1]}
              </p>
            )}
          </div>
        )}

        {/* Text */}
        {q.type === 'text' && (
          <textarea
            value={answers[q._id] || ''}
            onChange={e => setAnswer(q._id, e.target.value)}
            rows={3}
            style={styles.textarea}
            placeholder={lang === 'ta' ? 'உங்கள் பதிலை இங்கே எழுதுங்கள்...' : 'Type your answer here...'}
          />
        )}

        {errors[q._id] && <p style={styles.errMsg}>{errors[q._id]}</p>}
      </div>
    );
  }

  return (
    <div style={styles.bg}>
      {/* Top bar */}
      <div style={styles.topBar}>
        <button onClick={() => navigate('/survey/location')} style={styles.backBtn}>{L.back}</button>
        <div style={styles.topCenter}>
          <span style={styles.stepBadge}>{L.step}</span>
          <span style={styles.topTitle}>{L.title}</span>
        </div>
        <div style={styles.langRow}>
          <button style={{ ...styles.langBtn, ...(lang === 'ta' ? styles.langActive : {}) }} onClick={() => setLang('ta')}>தமிழ்</button>
          <button style={{ ...styles.langBtn, ...(lang === 'en' ? styles.langActive : {}) }} onClick={() => setLang('en')}>EN</button>
        </div>
      </div>

      {/* Location summary banner */}
      {location && (
        <div style={styles.locBanner}>
          📍 {location.district} › {location.constituency}
          {location.ward && ` › Ward ${location.ward}`}
          {location.area_street && ` › ${location.area_street}`}
        </div>
      )}

      <div style={styles.container}>

        {/* Respondent details */}
        <div style={styles.respondentCard}>
          <p style={styles.sectionTitle}>{L.respondent}</p>
          <div style={styles.respondentRow}>
            <div style={styles.respondentField}>
              <label style={styles.label}>{L.resp_name}</label>
              <input value={respondentName} onChange={e => setRespondentName(e.target.value)}
                style={styles.input} placeholder={lang === 'ta' ? 'பெயர்' : 'Name'} />
            </div>
            <div style={styles.respondentField}>
              <label style={styles.label}>{L.resp_age}</label>
              <input value={respondentAge} onChange={e => setRespondentAge(e.target.value)}
                type="number" min="1" max="120"
                style={styles.input} placeholder="25" />
            </div>
          </div>
          <div style={styles.genderRow}>
            {[
              [L.gender_m, 'Male'],
              [L.gender_f, 'Female'],
              [L.gender_o, 'Other']
            ].map(([label, value]) => (
              <button
                type="button"
                key={value}
                onClick={() => setRespondentGender(value)}
                style={{
                  ...styles.genderBtn,
                  ...(respondentGender === value ? styles.genderActive : {})
                }}
              >{label}</button>
            ))}
          </div>
        </div>

        {/* Questions */}
        <form onSubmit={handleSubmit}>
          {loadingQ && <p style={styles.loadingText}>{L.loading}</p>}
          {!loadingQ && questions.length === 0 && (
            <p style={styles.noQText}>{L.no_q}</p>
          )}
          {questions.map(q => renderQuestion(q))}

          {questions.length > 0 && (
            <button
              id="survey-submit-btn"
              type="submit"
              disabled={submitting}
              style={{ ...styles.submitBtn, opacity: submitting ? 0.7 : 1 }}
            >
              {submitting ? L.submitting : L.submit}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

const styles = {
  bg: {
    minHeight: '100vh',
    background: 'linear-gradient(160deg, #f0faf5 0%, #e8f5ee 100%)',
    fontFamily: "'Noto Sans Tamil', 'Manrope', sans-serif",
    paddingBottom: '60px',
  },
  topBar: {
    background: 'linear-gradient(135deg, #0f4c35, #1a7a52)',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 3px 12px rgba(15,76,53,0.3)',
  },
  backBtn: {
    background: 'rgba(255,255,255,0.15)',
    border: '1.5px solid rgba(255,255,255,0.4)',
    color: '#fff',
    borderRadius: '8px',
    padding: '5px 12px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '700',
  },
  topCenter: { display: 'flex', alignItems: 'center', gap: '8px' },
  stepBadge: {
    background: 'rgba(255,255,255,0.2)',
    color: '#fff',
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '700',
  },
  topTitle: { color: '#fff', fontWeight: '700', fontSize: '14px' },
  langRow: { display: 'flex', gap: '4px' },
  langBtn: {
    padding: '4px 10px',
    borderRadius: '10px',
    border: '1.5px solid rgba(255,255,255,0.5)',
    background: 'transparent',
    color: 'rgba(255,255,255,0.8)',
    cursor: 'pointer',
    fontSize: '11px',
    fontWeight: '600',
  },
  langActive: { background: 'rgba(255,255,255,0.25)', color: '#fff', borderColor: '#fff' },
  locBanner: {
    background: '#d1fae5',
    borderBottom: '1px solid #a7f3d0',
    padding: '8px 16px',
    fontSize: '12px',
    color: '#065f46',
    fontWeight: '700',
  },
  container: { maxWidth: '520px', margin: '0 auto', padding: '16px' },
  respondentCard: {
    background: '#fff',
    borderRadius: '14px',
    padding: '16px',
    marginBottom: '16px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
  },
  sectionTitle: { fontSize: '13px', fontWeight: '700', color: '#6b7280', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  respondentRow: { display: 'flex', gap: '12px', marginBottom: '12px' },
  respondentField: { flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' },
  label: { fontSize: '12px', fontWeight: '700', color: '#1a4a2e' },
  input: {
    padding: '10px 12px',
    border: '2px solid #c8e6d4',
    borderRadius: '8px',
    fontSize: '13px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    background: '#f8fffe',
  },
  genderRow: { display: 'flex', gap: '8px' },
  genderBtn: {
    flex: 1,
    padding: '8px',
    border: '2px solid #c8e6d4',
    borderRadius: '8px',
    background: '#f8fffe',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '700',
    color: '#374151',
    transition: 'all 0.2s',
  },
  genderActive: { background: '#0f4c35', color: '#fff', borderColor: '#0f4c35' },
  qCard: {
    background: '#fff',
    borderRadius: '14px',
    padding: '18px',
    marginBottom: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
  },
  qText: { fontSize: '15px', fontWeight: '700', color: '#1a2e24', margin: '0 0 14px', lineHeight: '1.5' },
  req: { color: '#dc2626' },
  optionsList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  optionLabel: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 14px',
    border: '2px solid #e5e7eb',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#374151',
    transition: 'all 0.15s',
  },
  optionSelected: { borderColor: '#0f4c35', background: '#e6f7ef', color: '#0f4c35', fontWeight: '700' },
  yesNoBtn: {
    flex: 1,
    padding: '12px',
    border: '2px solid #e5e7eb',
    borderRadius: '10px',
    background: '#f9fafb',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '700',
    color: '#374151',
    transition: 'all 0.2s',
  },
  yesNoActive: { background: '#0f4c35', color: '#fff', borderColor: '#0f4c35' },
  ratingRow: { display: 'flex', gap: '8px' },
  ratingBtn: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    border: '2px solid #e5e7eb',
    background: '#f9fafb',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '800',
    color: '#374151',
    transition: 'all 0.2s',
  },
  ratingActive: { background: '#0f4c35', color: '#fff', borderColor: '#0f4c35' },
  ratingHint: { fontSize: '12px', color: '#6b7280', margin: '6px 0 0', fontWeight: '600' },
  textarea: {
    width: '100%',
    padding: '12px',
    border: '2px solid #c8e6d4',
    borderRadius: '10px',
    fontSize: '14px',
    resize: 'vertical',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  errMsg: { fontSize: '12px', color: '#dc2626', margin: '6px 0 0', fontWeight: '600' },
  loadingText: { textAlign: 'center', color: '#6b7280', padding: '40px 0', fontSize: '15px' },
  noQText: { textAlign: 'center', color: '#dc2626', padding: '40px 0', fontSize: '14px' },
  submitBtn: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #1a7a52, #0f4c35)',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '800',
    cursor: 'pointer',
    boxShadow: '0 6px 20px rgba(15,76,53,0.3)',
    marginTop: '8px',
  },
};
