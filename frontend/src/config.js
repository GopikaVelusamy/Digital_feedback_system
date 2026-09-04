// Central configuration for the application
export const API = process.env.REACT_APP_API_URL || (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://127.0.0.1:8000' : 'https://digital-feedback-system.onrender.com');

