// ============================================================
// FeedbackPage.jsx — Clean Visual Landing Page
// Theme: Premium Green (AIADMK)
// Layout: Full-viewport leaders cover background with bottom gradient,
//         high-contrast centered fixed leaf watermark, curvy S-wave
//         interactive roadmap flow, and direct login redirection.
// ============================================================
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { translationData, getLanguage, setLanguage } from '../utils/translations';
import { API } from '../config';
import constituencyData from '../utils/TN_Assembly_Constituencies_FULL.json';

function notify(title, text, icon) {
  Swal.fire({
    title,
    text,
    icon,
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    backdrop: `rgba(0,0,0,0.4) blur(10px)`,
    customClass: { popup: 'glass-popup' },
  });
}

// ─── 4 TAMIL WORDS ANIMATED SLOGAN (CLEAN 2-LINE TYPING, NO BOXES) ───
const FOUR_TAMIL_WORDS = ["நம்மில்", "ஒருவர்", "நமக்கான", "தலைவர்"];

// ─── AUTHENTIC TAMIL DISTRICT NAMES DICTIONARY FOR ALL 38 DISTRICTS ───
const TN_DISTRICT_TAMIL_NAMES = {
  'Thiruvallur': 'திருவள்ளூர்',
  'Chennai': 'சென்னை',
  'Kancheepuram': 'காஞ்சிபுரம்',
  'Chengalpattu': 'செங்கல்பட்டு',
  'Ranipet': 'இராணிப்பேட்டை',
  'Vellore': 'வேலூர்',
  'Tirupattur': 'திருப்பத்தூர்',
  'Krishnagiri': 'கிருஷ்ணகிரி',
  'Dharmapuri': 'தர்மபுரி',
  'Tiruvannamalai': 'திருவண்ணாமலை',
  'Viluppuram': 'விழுப்புரம்',
  'Kallakurichi': 'கள்ளக்குறிச்சி',
  'Salem': 'சேலம்',
  'Namakkal': 'நாமக்கல்',
  'Erode': 'ஈரோடு',
  'Tiruppur': 'திருப்பூர்',
  'Nilgiris': 'நீலகிரி',
  'Coimbatore': 'கோயம்புத்தூர்',
  'Dindigul': 'திண்டுக்கல்',
  'Karur': 'கரூர்',
  'Tiruchirappalli': 'திருச்சிராப்பள்ளி',
  'Perambalur': 'பெரம்பலூர்',
  'Ariyalur': 'அரியலூர்',
  'Cuddalore': 'கடலூர்',
  'Mayiladuthurai': 'மயிலாடுதுறை',
  'Nagapattinam': 'நாகப்பட்டினம்',
  'Thiruvarur': 'திருவாரூர்',
  'Thanjavur': 'தஞ்சாவூர்',
  'Pudukkottai': 'புதுக்கோட்டை',
  'Sivaganga': 'சிவகங்கை',
  'Madurai': 'மதுரை',
  'Theni': 'தேனி',
  'Virudhunagar': 'விருதுநகர்',
  'Ramanathapuram': 'இராமநாதபுரம்',
  'Thoothukudi': 'தூத்துக்குடி',
  'Thoothukkudi': 'தூத்துக்குடி',
  'Tenkasi': 'தென்காசி',
  'Tirunelveli': 'திருநெல்வேலி',
  'Kanniyakumari': 'கன்னியாகுமரி'
};

// ─── AUTHENTIC TAMIL ASSEMBLY CONSTITUENCIES DICTIONARY (234 SEATS) ───
const TN_CONSTITUENCY_TAMIL_NAMES = {
  // Thiruvallur
  'Gummidipoondi': 'கும்மிடிப்பூண்டி',
  'Ponneri': 'பொன்னேரி',
  'Tiruttani': 'திருத்தணி',
  'Thiruvallur': 'திருவள்ளூர்',
  'Poonamallee': 'பூவிருந்தவல்லி',
  'Avadi': 'ஆவடி',

  // Chennai
  'Maduravoyal': 'மதுரவாயல்',
  'Ambattur': 'அம்பத்தூர்',
  'Madavaram': 'மாதவரம்',
  'Thiruvottiyur': 'திருவொற்றியூர்',
  'Dr. Radhakrishnan Nagar': 'டாக்டர் ராதாகிருஷ்ணன் நகர்',
  'Perambur': 'பெரம்பூர்',
  'Kolathur': 'கொளத்தூர்',
  'Villivakkam': 'வில்லிவாக்கம்',
  'Thiru-Vi-Ka-Nagar': 'திரு. வி. க. நகர்',
  'Egmore': 'எழும்பூர்',
  'Royapuram': 'இராயபுரம்',
  'Harbour': 'துறைமுகம்',
  'Chepauk-Thiruvallikeni': 'சேப்பாக்கம்-திருவல்லிக்கேணி',
  'Thousand Lights': 'ஆயிரம் விளக்கு',
  'Anna Nagar': 'அண்ணா நகர்',
  'Virugambakkam': 'விருகம்பாக்கம்',
  'Saidapet': 'சைதாப்பேட்டை',
  'Thiyagarayanagar': 'தியாகராய நகர்',
  'Mylapore': 'மயிலாப்பூர்',
  'Velachery': 'வேளச்சேரி',
  'Shozhinganallur': 'சோழிங்கநல்லூர்',
  'Alandur': 'ஆலந்தூர்',

  // Kancheepuram & Chengalpattu
  'Sriperumbudur': 'ஸ்ரீபெரும்புதூர்',
  'Uthiramerur': 'உத்திரமேரூர்',
  'Kancheepuram': 'காஞ்சிபுரம்',
  'Pallavaram': 'பல்லாவரம்',
  'Tambaram': 'தாம்பரம்',
  'Chengalpattu': 'செங்கல்பட்டு',
  'Thiruporur': 'திருப்போரூர்',
  'Cheyyur': 'செய்யூர்',
  'Madurantakam': 'மதுராந்தகம்',

  // Ranipet, Vellore & Tirupattur
  'Arakkonam': 'அரக்கோணம்',
  'Sholinghur': 'சோளிங்கர்',
  'Ranipet': 'இராணிப்பேட்டை',
  'Arcot': 'ஆற்காடு',
  'Katpadi': 'காட்பாடி',
  'Vellore': 'வேலூர்',
  'Anaikattu': 'அணைக்கட்டு',
  'Kilvaithinankuppam': 'கீழ்வைத்தியனான்குப்பம்',
  'Gudiyattam': 'குடியாத்தம்',
  'Vaniyambadi': 'வாணியம்பாடி',
  'Ambur': 'ஆம்பூர்',
  'Jolarpet': 'ஜோலார்பேட்டை',
  'Tirupattur': 'திருப்பத்தூர்',

  // Krishnagiri & Dharmapuri
  'Uthangarai': 'உத்தங்கரை',
  'Bargur': 'பர்கூர்',
  'Krishnagiri': 'கிருஷ்ணகிரி',
  'Veppanahalli': 'வேப்பனஹள்ளி',
  'Hosur': 'ஓசூர்',
  'Thalli': 'தளி',
  'Palacode': 'பாலக்கோடு',
  'Pennagaram': 'பென்னாகரம்',
  'Dharmapuri': 'தர்மபுரி',
  'Pappireddippatti': 'பாப்பிரெட்டிப்பட்டி',
  'Harur': 'அரூர்',

  // Tiruvannamalai
  'Chengam': 'செங்கம்',
  'Tiruvannamalai': 'திருவண்ணாமலை',
  'Kilpennathur': 'கீழ்பென்னாத்தூர்',
  'Kalasapakkam': 'கலசப்பாக்கம்',
  'Polur': 'போளூர்',
  'Arani': 'ஆரணி',
  'Cheyyar': 'செய்யாறு',
  'Vandavasi': 'வந்தவாசி',

  // Viluppuram & Kallakurichi
  'Gingee': 'செஞ்சி',
  'Mailam': 'மைலம்',
  'Tindivanam': 'திண்டிவனம்',
  'Vanur': 'வானூர்',
  'Villupuram': 'விழுப்புரம்',
  'Vikravandi': 'விக்கிரவாண்டி',
  'Tirukkoyilur': 'திருக்கோவிலூர்',
  'Ulundurpettai': 'உளுந்தூர்பேட்டை',
  'Rishivandiyam': 'ரிஷிவந்தியம்',
  'Sankarapuram': 'சங்கராபுரம்',
  'Kallakurichi': 'கள்ளக்குறிச்சி',

  // Salem & Namakkal
  'Gangavalli': 'கெங்கவல்லி',
  'Attur': 'ஆத்தூர்',
  'Yercaud': 'ஏற்காடு',
  'Omalur': 'ஓமலூர்',
  'Mettur': 'மேட்டூர்',
  'Edappadi': 'எடப்பாடி',
  'Sankari': 'சங்ககிரி',
  'Salem (West)': 'சேலம் (மேற்கு)',
  'Salem (North)': 'சேலம் (வடக்கு)',
  'Salem (South)': 'சேலம் (தெற்கு)',
  'Veerapandi': 'வீரபாண்டி',
  'Rasipuram': 'ராசிபுரம்',
  'Senthamangalam': 'சேந்தமங்கலம்',
  'Namakkal': 'நாமக்கல்',
  'Paramathi Velur': 'பரமத்தி வேலூர்',
  'Tiruchengodu': 'திருச்செங்கோடு',
  'Kumarapalayam': 'குமாரபாளையம்',

  // Erode, Tiruppur & Nilgiris
  'Erode (East)': 'ஈரோடு (கிழக்கு)',
  'Erode (West)': 'ஈரோடு (மேற்கு)',
  'Modakkurichi': 'மொடக்குறிச்சி',
  'Perundurai': 'பெருந்துறை',
  'Bhavani': 'பவானி',
  'Anthiyur': 'அந்தியூர்',
  'Gobichettipalayam': 'கோபிசெட்டிபாளையம்',
  'Bhavanisagar': 'பவானிசாகர்',
  'Dharapuram': 'தாராபுரம்',
  'Kangayam': 'காங்கேயம்',
  'Avanashi': 'அவனாசி',
  'Tiruppur (North)': 'திருப்பூர் (வடக்கு)',
  'Tiruppur (South)': 'திருப்பூர் (தெற்கு)',
  'Palladam': 'பல்லடம்',
  'Udumalaipettai': 'உடுமலைப்பேட்டை',
  'Madathukulam': 'மடத்துக்குளம்',
  'Udhagamandalam': 'உதகமண்டலம்',
  'Gudalur': 'கூடலூர்',
  'Coonoor': 'குன்னூர்',

  // Coimbatore & Dindigul
  'Mettupalayam': 'மேட்டுப்பாளையம்',
  'Sulur': 'சூலூர்',
  'Kavundampalayam': 'கவுண்டம்பாளையம்',
  'Coimbatore (North)': 'கோயம்புத்தூர் (வடக்கு)',
  'Thondamuthur': 'தொண்டாமுத்தூர்',
  'Coimbatore (South)': 'கோயம்புத்தூர் (தெற்கு)',
  'Singanallur': 'சிங்காநல்லூர்',
  'Kinathukadavu': 'கிணத்துக்கடவு',
  'Pollachi': 'பொள்ளாச்சி',
  'Valparai': 'வால்பாறை',
  'Palani': 'பழனி',
  'Oddanchatram': 'ஒட்டன்சத்திரம்',
  'Athoor': 'ஆத்தூர்',
  'Nilakottai': 'நிலக்கோட்டை',
  'Natham': 'நத்தம்',
  'Dindigul': 'திண்டுக்கல்',
  'Vedasandur': 'வேடசந்தூர்',

  // Karur, Tiruchirappalli, Perambalur & Ariyalur
  'Aravakurichi': 'அரவக்குறிச்சி',
  'Karur': 'கரூர்',
  'Krishnarayapuram': 'கிருஷ்ணராயபுரம்',
  'Kulithalai': 'குளித்தலை',
  'Manapaarai': 'மணப்பாறை',
  'Srirangam': 'ஸ்ரீரங்கம்',
  'Tiruchirappalli (West)': 'திருச்சிராப்பள்ளி (மேற்கு)',
  'Tiruchirappalli (East)': 'திருச்சிராப்பள்ளி (கிழக்கு)',
  'Thiruverumbur': 'திருவெறும்பூர்',
  'Lalgudi': 'லால்குடி',
  'Manachanallur': 'மண்ணச்சநல்லூர்',
  'Musiri': 'முசிறி',
  'Thuraiyur': 'துறையூர்',
  'Perambalur': 'பெரம்பலூர்',
  'Kunnam': 'குன்னம்',
  'Ariyalur': 'அரியலூர்',
  'Jayankondam': 'ஜெயங்கொண்டம்',

  // Cuddalore, Mayiladuthurai, Nagapattinam & Thiruvarur
  'Tittakudi': 'திட்டக்குடி',
  'Virudhachalam': 'விருத்தாசலம்',
  'Neyveli': 'நெய்வேலி',
  'Panruti': 'பண்ருட்டி',
  'Cuddalore': 'கடலூர்',
  'Kurinjipadi': 'குறிஞ்சிப்பாடி',
  'Bhuvanagiri': 'புவனகிரி',
  'Chidambaram': 'சிதம்பரம்',
  'Kattumannarkoil': 'காட்டுமன்னார்கோவில்',
  'Sirkazhi': 'சீர்காழி',
  'Mayiladuturai': 'மயிலாடுதுறை',
  'Poompuhar': 'பூம்புகார்',
  'Nagapattinam': 'நாகப்பட்டினம்',
  'Kilvelur': 'கீழ்வேளூர்',
  'Vedaranyam': 'வேதாரண்யம்',
  'Thiruthuraipoondi': 'திருத்துறைப்பூண்டி',
  'Mannargudi': 'மன்னார்குடி',
  'Thiruvarur': 'திருவாரூர்',
  'Nannilam': 'நன்னிலம்',

  // Thanjavur, Pudukkottai, Sivaganga & Madurai
  'Thiruvidaimarudur': 'திருவிடைமருதூர்',
  'Kumbakonam': 'கும்பகோணம்',
  'Papanasam': 'பாபநாசம்',
  'Thiruvaiyaru': 'திருவையாறு',
  'Thanjavur': 'தஞ்சாவூர்',
  'Orathanadu': 'ஒரத்தநாடு',
  'Pattukkottai': 'பட்டுக்கோட்டை',
  'Peravurani': 'பேராவூரணி',
  'Gandarvakottai': 'கந்தர்வகோட்டை',
  'Viralimalai': 'விராலிமலை',
  'Pudukkottai': 'புதுக்கோட்டை',
  'Thirumayam': 'திருமயம்',
  'Alangudi': 'ஆலங்குடி',
  'Aranthangi': 'அறந்தாங்கி',
  'Karaikudi': 'காரைக்குடி',
  'Tiruppattur': 'திருப்பத்தூர்',
  'Sivaganga': 'சிவகங்கை',
  'Manamadurai': 'மானாமதுரை',
  'Melur': 'மேலூர்',
  'Madurai East': 'மதுரை (கிழக்கு)',
  'Sholavandan': 'சோழவந்தான்',
  'Madurai North': 'மதுரை (வடக்கு)',
  'Madurai South': 'மதுரை (தெற்கு)',
  'Madurai Central': 'மதுரை (மத்தியில்)',
  'Madurai West': 'மதுரை (மேற்கு)',
  'Thiruparankundram': 'திருப்பரங்குன்றம்',
  'Thirumangalam': 'திருமங்கலம்',
  'Usilampatti': 'உசிலம்பட்டி',

  // Theni, Virudhunagar, Ramanathapuram & Thoothukudi
  'Andipatti': 'ஆண்டிபட்டி',
  'Periyakulam': 'பெரியகுளம்',
  'Bodinayakanur': 'போடிநாயக்கனூர்',
  'Cumbum': 'கம்பம்',
  'Rajapalayam': 'ராஜபாளையம்',
  'Srivilliputhur': 'ஸ்ரீவில்லிபுத்தூர்',
  'Sattur': 'சாத்தூர்',
  'Sivakasi': 'சிவகாசி',
  'Virudhunagar': 'விருதுநகர்',
  'Aruppukkottai': 'அருப்புக்கோட்டை',
  'Tiruchuli': 'திருச்சுழி',
  'Paramakudi': 'பரமக்குடி',
  'Tiruvadanai': 'திருவாடானை',
  'Ramanathapuram': 'இராமநாதபுரம்',
  'Mudhukulathur': 'முதுகுளத்தூர்',
  'Vilathikulam': 'விளாத்திகுளம்',
  'Thoothukkudi': 'தூத்துக்குடி',
  'Tiruchendur': 'திருச்செந்தூர்',
  'Srivaikuntam': 'ஸ்ரீவைகுண்டம்',
  'Ottapidaram': 'ஓட்டப்பிடாரம்',
  'Kovilpatti': 'கோவில்பட்டி',

  // Tenkasi, Tirunelveli & Kanniyakumari
  'Sankarankovil': 'சங்கரன்கோவில்',
  'Vasudevanallur': 'வாசுதேவநல்லூர்',
  'Kadayanallur': 'கடையநல்லூர்',
  'Tenkasi': 'தென்காசி',
  'Alangulam': 'ஆலங்குளம்',
  'Tirunelveli': 'திருநெல்வேலி',
  'Ambasamudram': 'அம்பாசமுத்திரம்',
  'Palayamkottai': 'பாளையங்கோட்டை',
  'Nanguneri': 'நாங்குநேரி',
  'Radhapuram': 'ராதாபுரம்',
  'Kanniyakumari': 'கன்னியாகுமரி',
  'Nagercoil': 'நாகர்கோவில்',
  'Colachal': 'குளச்சல்',
  'Padmanabhapuram': 'பத்மநாபபுரம்',
  'Vilavancode': 'விளவங்கோடு',
  'Killiyoor': 'கிள்ளியூர்'
};

// ─── LOCAL BODY COMMON TAMIL WORDS & AUTOMATIC TRANSLITERATION HELPER ───
const TN_COMMON_TAMIL_WORDS = {
  'corporation': 'மாநகராட்சி',
  'municipality': 'நகராட்சி',
  'town panchayat': 'பேரூராட்சி',
  'village panchayat': 'கிராம ஊராட்சி',
  'panchayat union': 'ஊராட்சி ஒன்றியம்',
  'panchayat': 'ஊராட்சி',
  'ward': 'வார்டு',
  'village': 'கிராமம்',
  'zone': 'மண்டலம்',
  'salem': 'சேலம்',
  'coimbatore': 'கோயம்புத்தூர்',
  'chennai': 'சென்னை',
  'madurai': 'மதுரை',
  'trichy': 'திருச்சி',
  'tiruchirappalli': 'திருச்சிராப்பள்ளி',
  'tirunelveli': 'திருநெல்வேலி',
  'erode': 'ஈரோடு',
  'vellore': 'வேலூர்',
  'thanjavur': 'தஞ்சாவூர்',
  'dindigul': 'திண்டுக்கல்',
  'tiruppur': 'திருப்பூர்',
  'karur': 'கரூர்',
  'hosur': 'ஓசூர்',
  'kancheepuram': 'காஞ்சிபுரம்',
  'cuddalore': 'கடலூர்',
  'tuticorin': 'தூத்துக்குடி',
  'thoothukudi': 'தூத்துக்குடி',
  'sulur': 'சூலூர்',
  'edappadi': 'எடப்பாடி',
  'omalur': 'ஓமலூர்',
  'attur': 'ஆத்தூர்',
  'mettupalayam': 'மேட்டுப்பாளையம்',
  'pollachi': 'பொள்ளாச்சி',
  'tambaram': 'தாம்பரம்',
  'avadi': 'ஆவடி',
  'kadampadi': 'கடம்பாடி',
  'kannampalayam': 'கண்ணம்பாளையம்',
  'ravathur': 'ராவத்தூர்',
  'muthugoundenpudur': 'முத்துக்கவுண்டன்புதூர்',
  'iramathur': 'இராமத்தூர்',
  'neelambur': 'நீலம்பூர்',
  'kalangal': 'கலங்கல்',
  'rasipalayam': 'ராசிபாளையம்',
  'peedampalli': 'பீடம்பள்ளி',
  'pattanam': 'பட்டணம்',
  'vellalore': 'வெள்ளலூர்',
  'singanallur': 'சிங்காநல்லூர்',
  'kinathukadavu': 'கிணத்துக்கடவு'
};

function autoTransliterateToTamil(text) {
  if (!text) return '';
  let words = text.split(' ');
  let converted = words.map(w => {
    let lower = w.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (TN_COMMON_TAMIL_WORDS[lower]) return TN_COMMON_TAMIL_WORDS[lower];
    if (TN_DISTRICT_TAMIL_NAMES[w]) return TN_DISTRICT_TAMIL_NAMES[w];
    if (TN_CONSTITUENCY_TAMIL_NAMES[w]) return TN_CONSTITUENCY_TAMIL_NAMES[w];

    // Phonetic rule mapping for English to Tamil
    let s = lower;
    s = s.replace(/kadampadi/g, 'கடம்பாடி')
      .replace(/kannampalayam/g, 'கண்ணம்பாளையம்')
      .replace(/ravathur/g, 'ராவத்தூர்')
      .replace(/sulur/g, 'சூலூர்')
      .replace(/panchayat/g, 'ஊராட்சி')
      .replace(/corporation/g, 'மாநகராட்சி')
      .replace(/municipality/g, 'நகராட்சி')
      .replace(/village/g, 'கிராமம்')
      .replace(/ward/g, 'வார்டு')
      .replace(/ka/g, 'க').replace(/ki/g, 'கி').replace(/ku/g, 'கு').replace(/ke/g, 'கெ').replace(/ko/g, 'கொ')
      .replace(/ga/g, 'க').replace(/gi/g, 'கி').replace(/gu/g, 'கு')
      .replace(/ta/g, 'ட').replace(/ti/g, 'டி').replace(/tu/g, 'டு').replace(/te/g, 'டெ').replace(/to/g, 'டொ')
      .replace(/tha/g, 'த').replace(/thi/g, 'தி').replace(/thu/g, 'து').replace(/the/g, 'தெ').replace(/tho/g, 'தொ')
      .replace(/pa/g, 'ப').replace(/pi/g, 'பி').replace(/pu/g, 'பு').replace(/pe/g, 'பெ').replace(/po/g, 'பொ')
      .replace(/ba/g, 'ப').replace(/bi/g, 'பி').replace(/bu/g, 'பு')
      .replace(/ma/g, 'ம').replace(/mi/g, 'மி').replace(/mu/g, 'மு').replace(/me/g, 'மெ').replace(/mo/g, 'மொ')
      .replace(/na/g, 'ன').replace(/ni/g, 'னி').replace(/nu/g, 'னு').replace(/ne/g, 'னெ').replace(/no/g, 'னொ')
      .replace(/ra/g, 'ர').replace(/ri/g, 'ரி').replace(/ru/g, 'ரு').replace(/re/g, 'ரெ').replace(/ro/g, 'ரொ')
      .replace(/la/g, 'ல').replace(/li/g, 'லி').replace(/lu/g, 'லு').replace(/le/g, 'லெ').replace(/lo/g, 'லொ')
      .replace(/va/g, 'வ').replace(/vi/g, 'வி').replace(/vu/g, 'வு').replace(/ve/g, 'வெ').replace(/vo/g, 'வொ')
      .replace(/sa/g, 'ச').replace(/si/g, 'சி').replace(/su/g, 'சு').replace(/se/g, 'செ').replace(/so/g, 'சொ')
      .replace(/ya/g, 'ய').replace(/yi/g, 'யி').replace(/yu/g, 'யு')
      .replace(/m/g, 'ம்').replace(/n/g, 'ன்').replace(/k/g, 'க்').replace(/p/g, 'ப்').replace(/t/g, 'ட்').replace(/l/g, 'ல்').replace(/r/g, 'ர்').replace(/s/g, 'ஸ்');
    return s || w;
  });
  return converted.join(' ');
}

// ─── CATEGORY-SPECIFIC GRIEVANCE TITLES DICTIONARY (EN & TA) ───
const CATEGORY_TITLES_MAP = {
  "Governance": {
    en: ["Government Office Service Delay", "Ration / Welfare Scheme Benefit Delay", "Official Corruption / Red Tape Complaint", "Certificate Issuance Delay (Community/Nativity)", "General Governance Suggestion", "Custom Title..."],
    ta: ["அரசு அலுவலக சேவை தாமதம்", "ரேஷன் / நலத்திட்ட உதவி தாமதம்", "அதிகாரிகள் முறைகேடு / லஞ்ச புகார்", "சான்றிதழ் வழங்கல் தாமதம் (சாதி/இருப்பிடம்)", "பொது ஆட்சிமுறை ஆலோசனை", "சொந்தத் தலைப்பு உள்ளிட..."]
  },
  "Leadership": {
    en: ["Constituency Representative Visit Request", "Leader Public Meeting & Grievance Camp", "Local Cadre & Leadership Outreach", "Youth & Executive Committee Meeting", "Custom Title..."],
    ta: ["தொகுதி மக்கள் பிரதிநிதி வருகை கோரிக்கை", "தலைவர் மக்கள் சந்திப்பு & முகாம்", "உள்ளூர்க் கழக வளர்ச்சி பணிகள்", "இளைஞரணி & நிர்வாகிகள் கூட்டம்", "சொந்தத் தலைப்பு உள்ளிட..."]
  },
  "Local Issues": {
    en: ["Garbage Clearance & Street Cleanliness", "Street Light Fault / Dark Street Area", "Drainage Blockage & Water Stagnation", "Stray Dog & Animal Nuisance", "Public Toilet Sanitation & Maintenance", "Custom Title..."],
    ta: ["குப்பை அகற்றுதல் & தெரு சுத்தம்", "தெருவிளக்கு பழுது / இருண்ட பகுதி", "வடிகால் அடைப்பு & கழிவுநீர் தேக்கம்", "தெரு நாய் & விலங்கு தொல்லை", "பொதுக் கழிப்பறை சுத்தம் & பராமரிப்பு", "சொந்தத் தலைப்பு உள்ளிட..."]
  },
  "Infrastructure": {
    en: ["Damaged Road & Pothole Repair", "New Tar / Cement Road Construction", "Storm Water Drain Construction", "Bridge & Culvert Maintenance", "Bus Shelter / Park Renovation", "Custom Title..."],
    ta: ["பழுதடைந்த சாலை & குழி சீரமைப்பு", "புதிய தார் / சிமெண்ட் சாலை அமைத்தல்", "மழைநீர் வடிகால் அமைக்கும் பணி", "பாலம் & சிறுபாலம் பராமரிப்பு", "பேருந்து நிழற்குடை / பூங்கா சீரமைப்பு", "சொந்தத் தலைப்பு உள்ளிட..."]
  },
  "Education": {
    en: ["School Building Repair & Classrooms", "Drinking Water & Toilet Facilities in School", "Educational Scholarship Disbursement", "Free Laptop & Uniform Distribution", "Teacher Vacancy Filling Request", "Custom Title..."],
    ta: ["பள்ளி கட்டிட பராமரிப்பு & வகுப்பறைகள்", "பள்ளியில் குடிநீர் & கழிப்பறை வசதி", "கல்வி உதவித்தொகை வழங்கல்", "இலவச மடிக்கணினி & சீருடை விநியோகம்", "ஆசிரியர் காலியிடம் நிரப்பும் கோரிக்கை", "சொந்தத் தலைப்பு உள்ளிட..."]
  },
  "Healthcare": {
    en: ["Primary Health Centre (PHC) Medicine Shortage", "Doctor & Nursing Staff Availability", "Mosquito Spraying & Dengue Control", "Ambulance & Emergency Response Service", "Government Hospital Facility Improvement", "Custom Title..."],
    ta: ["ஆரம்ப சுகாதார நிலைய மருந்து தட்டுப்பாடு", "மருத்துவர் & செவிலியர் வருகை இன்மை", "கொசு மருந்து தெளித்தல் & டெங்கு கட்டுப்பாடு", "ஆம்புலன்ஸ் & அவசர உதவி சேவை", "அரசு மருத்துவமனை வசதிகள் மேம்பாடு", "சொந்தத் தலைப்பு உள்ளிட..."]
  },
  "Employment": {
    en: ["MNREGA 100-Day Work Wages Disbursement", "Youth Skill Training & Job Fair Request", "Local Industrial Job Reservation", "Self-Employment Loan & Subsidy Support", "Custom Title..."],
    ta: ["100 நாள் வேலை திட்ட ஊதியம் வழங்கல்", "இளைஞர் திறன் பயிற்சி & வேலைவாய்ப்பு முகாம்", "உள்ளூர் தொழிற்சாலை வேலைவாய்ப்பு", "சுயவேலைவாய்ப்பு கடன் & மானிய உதவி", "சொந்தத் தலைப்பு உள்ளிட..."]
  },
  "Agriculture": {
    en: ["Irrigation Canal Water Flow & Desilting", "Crop Subsidy & Flood Relief Disbursement", "Fertilizer & Quality Seeds Shortage", "Direct Paddy Procurement Center (DPC) Request", "Crop Insurance Claim Processing", "Custom Title..."],
    ta: ["பாசனக் கால்வாய் தூர்வாருதல் & நீர் வரத்து", "பயிர் நிவாரணம் & மானியத் தொகை", "உரம் & தரமான விதைகள் தட்டுப்பாடு", "நேரடி நெல் கொள்முதல் நிலைய கோரிக்கை", "பயிர் காப்பீட்டுத் தொகை வழங்கல்", "சொந்தத் தலைப்பு உள்ளிட..."]
  },
  "Women's Welfare": {
    en: ["Self-Help Group (SHG) Loan & Revolving Fund", "Women Safety & Street Light Security", "Tailoring / Cottage Industry Training", "Maternal & Child Health Support", "Custom Title..."],
    ta: ["மகளிர் சுயஉதவிக் குழு கடன் & சுழல்நிதி", "பெண்கள் பாதுகாப்பு & தெருவிளக்கு வசதி", "தையல் / குடிசைத் தொழில் பயிற்சி", "தாய் சேய் நல உதவி & ஊட்டச்சத்து", "சொந்தத் தலைப்பு உள்ளிட..."]
  },
  "Youth Development": {
    en: ["Public Sports Ground & Gym Equipment", "Youth Club & Library Facility", "Competitive Exam Coaching Center", "Sports Kit & Tournament Support", "Custom Title..."],
    ta: ["விளையாட்டு மைதானம் & உடற்பயிற்சிகூடம்", "இளைஞர் மன்றம் & நூலக வசதி", "போட்டித் தேர்வு பயிற்சி மையம்", "விளையாட்டு உபகரணங்கள் & போட்டி உதவி", "சொந்தத் தலைப்பு உள்ளிட..."]
  },
  "Public Safety": {
    en: ["CCTV Camera Installation in Public Areas", "Police Patrolling & Night Security", "Speed Breaker & Traffic Zebra Crossing", "Hazardous Tree / Electric Wire Removal", "Custom Title..."],
    ta: ["பொது இடங்களில் சிசிடிவி கேமரா அமைத்தல்", "காவலறை இரவு ரோந்து & பாதுகாப்பு", "வேகத்தடை & போக்குவரத்து பாதுகாப்பு", "அபாயகரமான மரம் / மின்வயர் அகற்றுதல்", "சொந்தத் தலைப்பு உள்ளிட..."]
  },
  "Government Schemes": {
    en: ["Magalir Urimai Thogai / Financial Scheme", "Old Age Pension (OAP) Disbursement", "Free House Site Patta Application", "Gas Cylinder / Housing Subsidy Issue", "Custom Title..."],
    ta: ["மகளிர் உரிமைத் தொகை / உதவித்தொகை", "முதியோர் உதவித்தொகை (OAP) வழங்கல்", "இலவச வீட்டு மனை பட்டா விண்ணப்பம்", "எரிவாயு உருளை / வீட்டு வசதி மானியம்", "சொந்தத் தலைப்பு உள்ளிட..."]
  },
  "Party Organisation": {
    en: ["Ward & Booth Level Committee Strengthening", "New Member Enrolment Drive", "Party Flag Mast & Information Board", "Cadre Welfare & Recognition", "Custom Title..."],
    ta: ["வார்டு & பூத் கமிட்டி வலுப்படுத்துதல்", "புதிய உறுப்பினர் சேர்க்கை முகாம்", "கட்சிக் கொடிக் கம்பம் & அறிவிப்புப் பலகை", "கழகத் தோழர்கள் நலன் & அங்கீகாரம்", "சொந்தத் தலைப்பு உள்ளிட..."]
  },
  "Candidate Feedback": {
    en: ["Local Representative Accessibility & Service", "Constituency Development Work Performance", "Cadre & Public Interaction Quality", "Custom Title..."],
    ta: ["மக்கள் பிரதிநிதி அணுகுமுறை & சேவை", "தொகுதி வளர்ச்சிப் பணிகள் செயல்பாடு", "கழகத் தோழர்கள் & மக்கள் தொடர்பு", "சொந்தத் தலைப்பு உள்ளிட..."]
  },
  "Election Issues": {
    en: ["Voter List Inclusion & Correction", "Booth Location & Transport Facility", "Election Manifesto Priority Suggestion", "Custom Title..."],
    ta: ["வாக்காளர் பட்டியல் பெயர் சேர்க்கை & திருத்தம்", "வாக்குச்சாவடி இடம் & போக்குவரத்து வசதி", "தேர்தல் அறிக்கை முன்னுரிமை ஆலோசனை", "சொந்தத் தலைப்பு உள்ளிட..."]
  },
  "Suggestions": {
    en: ["Town Infrastructure Development Idea", "Eco-Friendly Park & Tree Planting Drive", "Traffic Flow Streamlining Suggestion", "Custom Title..."],
    ta: ["நகர கட்டமைப்பு மேம்பாட்டு யோசனை", "சுற்றுச்சூழல் பூங்கா & மரக்கன்று நடுதல்", "போக்குவரத்து நெரிசல் சீரமைப்பு யோசனை", "சொந்தத் தலைப்பு உள்ளிட..."]
  },
  "Complaints": {
    en: ["Public Disturbance & Noise Pollution", "Illegal Encroachment Removal", "Drinking Water Supply Interruption", "Unattended Garbage Overflow", "Custom Title..."],
    ta: ["பொது அமைதிப் பாதிப்பு & ஒலி மாசுபாடு", "ஆக்கிரமிப்பு அகற்றும் கோரிக்கை", "குடிநீர் விநியோகத் தடை", "அகற்றப்படாத குப்பைக் கழிவுகள்", "சொந்தத் தலைப்பு உள்ளிட..."]
  }
};

const INITIAL_PRESS_RELEASES = [
  {
    _id: 'pr-1',
    tag_en: 'WELFARE BENEFITS',
    tag_ta: 'நலத்திட்டங்கள்',
    date: '08 July 2026',
    icon: '🎓',
    title_en: 'Distribution of Educational Scholarships and Aid',
    title_ta: 'கல்வி உதவித்தொகை மற்றும் உபகரணங்கள் வழங்குதல்',
    desc_en: 'Over 500 eligible students received laptop awards and higher scholarship grants under the community education initiative this week.',
    desc_ta: 'சமூக கல்வி முன்முயற்சியின் கீழ் 500க்கும் மேற்பட்ட தகுதியுள்ள மாணவர்களுக்கு மடிக்கணினி மற்றும் கல்வி உதவித்தொகை வழங்கப்பட்டது.',
    image_url: '/admk_leaders_clear.png',
    source_link: '#'
  },
  {
    _id: 'pr-2',
    tag_en: 'CAMPAIGN OUTREACH',
    tag_ta: 'பிரச்சார நிகழ்வு',
    date: '12 July 2026',
    icon: '📣',
    title_en: 'Constituency Outreach & Grievance Camps Launch',
    title_ta: 'தொகுதி மக்கள் குறை தீர்க்கும் முகாம்கள் தொடக்கம்',
    desc_en: 'Special camps are being organized across Salem and Coimbatore constituencies to gather local suggestions directly and solve public utility concerns.',
    desc_ta: 'சேலம் மற்றும் கோவை தொகுதிகளில் மக்களின் கோரிக்கைகளை நேரடியாக பெற சிறப்பு முகாம்கள் நடத்தப்படுகின்றன.',
    image_url: '/admk_leaders_clear.png',
    source_link: '#'
  },
  {
    _id: 'pr-3',
    tag_en: 'PRESS RELEASE',
    tag_ta: 'செய்தி வெளியீடு',
    date: '16 July 2026',
    icon: '📰',
    title_en: 'Official Press Statement on Crop Insurance Subsidy',
    title_ta: 'பயிர் காப்பீட்டு மானியம் குறித்த அதிகாரப்பூர்வ அறிக்கை',
    desc_en: 'The party leadership has urged immediate crop subsidy clearance for local farmers in Salem district to relieve rural economic burden.',
    desc_ta: 'சேலம் மாவட்ட விவசாயிகளுக்கு பயிர் காப்பீட்டு மானியத்தை உடனடியாக வழங்க கட்சி தலைமை வலியுறுத்தியுள்ளது.',
    image_url: '/admk_leaders_clear.png',
    source_link: '#'
  }
];

const INITIAL_GALLERY_PHOTOS = [
  {
    _id: 'gal-1',
    title_en: 'Massive AIADMK State Campaign Rally',
    title_ta: 'அதிமுக மாபெரும் மாநில பிரச்சார பேரணி',
    category_en: 'Campaigns',
    category_ta: 'பிரச்சாரம்',
    image_url: '/eps-aiadmk-rally.webp'
  },
  {
    _id: 'gal-2',
    title_en: 'Public Leadership Outreach & Meet',
    title_ta: 'மக்கள் சந்திப்பு & தலைவர்கள் உரையாடல்',
    category_en: 'Public Meetings',
    category_ta: 'பொதுக்கூட்டம்',
    image_url: '/admk_grand_trio_today.jpg'
  },
  {
    _id: 'gal-3',
    title_en: 'Historic Grassroots Mass Rally',
    title_ta: 'வரலாற்று சிறப்புமிக்க மக்கள் பேரணி',
    category_en: 'Campaigns',
    category_ta: 'பிரச்சாரம்',
    image_url: '/mgr_crowd_1972.jpg'
  },
  {
    _id: 'gal-4',
    title_en: 'Statewide Welfare Scheme Delivery',
    title_ta: 'மாநில அளவிலான நலத்திட்டங்கள் வழங்கல்',
    category_en: 'Welfare Schemes',
    category_ta: 'நலத்திட்டங்கள்',
    image_url: '/amma_free_laptops.jpg'
  },
  {
    _id: 'gal-5',
    title_en: 'Regional Cadre Conference & Rally',
    title_ta: 'மண்டல கழக நிர்வாகிகள் மாநாடு',
    category_en: 'Campaigns',
    category_ta: 'பிரச்சாரம்',
    image_url: '/eps_rally_2021.jpg'
  },
  {
    _id: 'gal-6',
    title_en: 'ADMK Party Headquarters Public Service',
    title_ta: 'தலைமைக் கழக மக்கள் சேவை மையம்',
    category_en: 'Public Meetings',
    category_ta: 'பொதுக்கூட்டம்',
    image_url: '/legacy_headquarters.png'
  }
];

const ADMK_JOURNEY_TIMELINE = [
  {
    year: '1972',
    tag_en: 'THE BEGINNING',
    tag_ta: 'தொடக்கக் காலம்',
    heading_en: 'THE BEGINNING',
    heading_ta: 'தொடக்கக் காலம்',
    desc_en: 'The movement is founded under MGR.',
    desc_ta: 'புரட்சித் தலைவர் எம்.ஜி.ஆர் அவர்களின் தலைமையில் கழகம் தொடங்கியது.',
    bg: '/mgr_crowd_1972.jpg',
    bgPos: 'right 0%'
  },
  {
    year: '1977',
    tag_en: 'FIRST GOVERNMENT',
    tag_ta: 'முதல் அரசு',
    heading_en: 'FIRST GOVERNMENT',
    heading_ta: 'முதல் ஆட்சி',
    desc_en: 'AIADMK forms the government in Tamil Nadu.',
    desc_ta: 'அதிமுக தமிழகத்தில் ஆட்சியை அமைத்தது.',
    bg: '/mgr_swearing_1977.jpg'
  },
  {
    year: '1980',
    tag_en: 'SECOND MANDATE',
    tag_ta: '2-வது ஆட்சி',
    heading_en: 'SECOND MANDATE',
    heading_ta: 'இரண்டாவது முறை ஆட்சி',
    desc_en: 'MGR returns to government.',
    desc_ta: 'புரட்சித் தலைவர் எம்.ஜி.ஆர் மீண்டும் முதலமைச்சராகப் பொறுப்பேற்றார்.',
    bg: '/mgr_speech_1980.jpg',
    bgPos: 'center 75%'
  },
  {
    year: '1984',
    tag_en: 'THIRD MANDATE',
    tag_ta: '3-வது ஆட்சி',
    heading_en: 'THIRD MANDATE',
    heading_ta: 'மூன்றாவது முறை வெற்றி',
    desc_en: 'Another Assembly victory under MGR.',
    desc_ta: 'எம்.ஜி.ஆர் தலைமையில் மேலும் ஒரு சட்டமன்ற வெற்றி.',
    bg: '/mgr_crowd_1972.jpg',
    bgPos: 'right 0%'
  },
  {
    year: '1987',
    tag_en: 'END OF AN ERA',
    tag_ta: 'ஒரு சகாப்தத்தின் முடிவு',
    heading_en: 'END OF AN ERA',
    heading_ta: 'ஒரு சகாப்தத்தின் முடிவு',
    desc_en: 'MGR passes away.',
    desc_ta: 'புரட்சித் தலைவர் எம்.ஜி.ஆர் அவர்கள் மறைந்தார்.',
    bg: '/mgr_1987_new.jpg',
    bgPos: 'right center',
    bgSize: 'contain'
  },
  {
    year: '1991',
    tag_en: 'THE AMMA ERA',
    tag_ta: 'அம்மா அவர்களின் ஆட்சி',
    heading_en: 'THE AMMA ERA',
    heading_ta: 'அம்மா அவர்களின் பொற்காலம்',
    desc_en: 'AIADMK forms the government under Jayalalithaa.',
    desc_ta: 'புரட்சித் தலைவி ஜெயலலிதா அவர்களின் தலைமையில் அதிமுக ஆட்சி அமைத்தது.',
    bg: '/amma_oath_1991.jpg',
    bgPos: 'right 30%',
    bgSize: 'cover'
  },
  {
    year: '2001',
    tag_en: 'THE RETURN',
    tag_ta: 'மீண்டும் வெற்றி',
    heading_en: 'THE RETURN',
    heading_ta: 'மீண்டும் ஆட்சிப் பொறுப்பு',
    desc_en: 'AIADMK returns to government.',
    desc_ta: 'அதிமுக மீண்டும் தமிழகத்தில் ஆட்சி அமைத்தது.',
    bg: '/amma_2001.jpg',
    bgPos: 'center 40%',
    bgSize: 'cover'
  },
  {
    year: '2011',
    tag_en: 'A NEW MANDATE',
    tag_ta: 'புதிய வெற்றிப் பயணம்',
    heading_en: 'A NEW MANDATE',
    heading_ta: 'புதிய வெற்றிப் பயணம்',
    desc_en: 'AIADMK returns to power under Amma.',
    desc_ta: 'அம்மா அவர்களின் தலைமையில் அதிமுக மீண்டும் ஆட்சிக்கு வந்தது.',
    bg: '/amma_2011.jpg',
    bgPos: 'right center',
    bgSize: 'auto 100%'
  },
  {
    year: '2016',
    tag_en: 'CONSECUTIVE VICTORY',
    tag_ta: 'வரலாற்றுத் தொடர் வெற்றி',
    heading_en: 'CONSECUTIVE VICTORY',
    heading_ta: 'வரலாற்றுத் தொடர் வெற்றி',
    desc_en: 'AIADMK secures another Assembly mandate under Amma.',
    desc_ta: 'அம்மா அவர்களின் தலைமையில் அதிமுக மீண்டும் தொடர் வெற்றி பெற்றது.',
    bg: '/amma_oath_2016.jpg',
    bgPos: 'center 10%',
    bgSize: 'cover'
  },
  {
    year: '2017',
    tag_en: 'THE EPS GOVERNMENT',
    tag_ta: 'EPS அவர்களின் ஆட்சி',
    heading_en: 'THE EPS GOVERNMENT',
    heading_ta: 'எடப்பாடியார் அவர்களின் ஆட்சி',
    desc_en: 'Edappadi K. Palaniswami becomes Chief Minister.',
    desc_ta: 'மாண்புமிகு எடப்பாடி K. பழனிசாமி அவர்கள் முதலமைச்சரானார்.',
    bg: '/eps_2017.jpg',
    bgPos: 'right 30%',
    bgSize: 'cover'
  },
  {
    year: '2021',
    tag_en: 'A NEW POLITICAL PHASE',
    tag_ta: 'புதிய அரசியல் களம்',
    heading_en: 'A NEW POLITICAL PHASE',
    heading_ta: 'புதிய அரசியல் களம்',
    desc_en: 'AIADMK moves from government to opposition.',
    desc_ta: 'அதிமுக அரசிலிருந்து முதன்மை எதிர்க்கட்சியாகப் புதிய களம் கண்டது.',
    bg: '/eps_rally_2021.jpg',
    bgPos: 'center 30%',
    bgSize: 'cover'
  },
  {
    year: '2023',
    tag_en: 'GENERAL SECRETARY',
    tag_ta: 'பொதுச்செயலாளர்',
    heading_en: 'GENERAL SECRETARY',
    heading_ta: 'கழகப் பொதுச்செயலாளர்',
    desc_en: 'EPS becomes General Secretary of AIADMK.',
    desc_ta: 'எடப்பாடி K. பழனிசாமி அவர்கள் அதிமுகவின் பொதுச்செயலாளரானார்.',
    bg: '/eps_2023_gs.jpg',
    bgPos: 'center 20%',
    bgSize: 'cover'
  },
  {
    year: 'TODAY',
    tag_en: 'THE STORY CONTINUES',
    tag_ta: 'வரலாறு தொடர்கிறது',
    heading_en: 'THE STORY CONTINUES',
    heading_ta: 'வரலாற்றுப் பயணம் தொடர்கிறது',
    desc_en: 'Another chapter is being written.',
    desc_ta: 'அடுத்த வரலாற்று அத்தியாயம் எழுதப்பட்டு வருகிறது.',
    bg: '/admk_grand_trio_today.jpg',
    bgPos: 'center center',
    bgSize: 'cover'
  }
];

function splitTamilGraphemes(text) {
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    try {
      const segmenter = new Intl.Segmenter('ta', { granularity: 'grapheme' });
      return Array.from(segmenter.segment(text), s => s.segment);
    } catch (e) { }
  }
  const graphemes = [];
  const re = /[\u0B80-\u0BFF][\u0BBE-\u0BCD\u0BD7]*/g;
  let match;
  let lastIndex = 0;
  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      graphemes.push(...text.slice(lastIndex, match.index).split(''));
    }
    graphemes.push(match[0]);
    lastIndex = re.lastIndex;
  }
  if (lastIndex < text.length) {
    graphemes.push(...text.slice(lastIndex).split(''));
  }
  return graphemes.length > 0 ? graphemes : Array.from(text);
}

function AnimatedSloganText() {
  const [revealedCounts, setRevealedCounts] = useState([0, 0, 0, 0]);
  const [activeWordIdx, setActiveWordIdx] = useState(0);
  const [isFlashing, setIsFlashing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let timer;
    if (isFinished) return;

    if (isFlashing) {
      timer = setTimeout(() => {
        setIsFlashing(false);
        setIsFinished(true);
      }, 1800);
    } else {
      timer = setTimeout(() => {
        if (activeWordIdx < 4) {
          const currentWord = FOUR_TAMIL_WORDS[activeWordIdx];
          const graphemes = splitTamilGraphemes(currentWord);
          const currentCount = revealedCounts[activeWordIdx];

          if (currentCount < graphemes.length) {
            setRevealedCounts(prev => {
              const next = [...prev];
              next[activeWordIdx] = currentCount + 1;
              return next;
            });
          } else {
            if (activeWordIdx < 3) {
              setActiveWordIdx(activeWordIdx + 1);
            } else {
              setIsFlashing(true);
            }
          }
        }
      }, 95);
    }
    return () => clearTimeout(timer);
  }, [revealedCounts, activeWordIdx, isFlashing, isFinished]);

  const getWordText = (idx) => {
    const graphemes = splitTamilGraphemes(FOUR_TAMIL_WORDS[idx]);
    return graphemes.slice(0, revealedCounts[idx]).join('');
  };

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
    image: "/mgr_nutritious_meal.jpg",
    source: "TN Social Welfare Records"
  },
  {
    id: 34,
    name_en: "Backward Classes Social Justice Reservation Enhancement",
    name_ta: "பிற்படுத்தப்பட்ட மக்களுக்கான சமூக நீதி இட ஒதுக்கீடு அதிகரிப்பு",
    year: 1980,
    era_en: "MGR",
    era_ta: "எம்.ஜி.ஆர்",
    category_en: "Welfare",
    category_ta: "சமூக நீதி & இட ஒதுக்கீடு",
    people_en: "Families",
    people_ta: "பிற்படுத்தப்பட்ட மக்கள்",
    type_en: "Policy",
    type_ta: "கொள்கை & இட ஒதுக்கீடு",
    served_en: "Backward Class Communities",
    served_ta: "பிற்படுத்தப்பட்ட சமுதாய மக்கள்",
    did_en: "Increased Backward Classes reservation quota to 50% ensuring historic social justice and educational empowerment.",
    did_ta: "பிற்படுத்தப்பட்ட மக்களுக்கான இட ஒதுக்கீட்டை 50% ஆக உயர்த்தி வரலாற்று சிறப்புமிக்க சமூக நீதியை உறுதி செய்தார்.",
    impact_en: "Expanded educational & employment opportunities for millions of BC families",
    impact_ta: "கோடிக்கணக்கான பிற்படுத்தப்பட்ட குடும்பங்களுக்கு கல்வி மற்றும் வேலைவாய்ப்பை உறுதி செய்தது",
    image: "/mgr_reservation_bc.jpg",
    source: "TN Social Justice Policy Records"
  },
  {
    id: 35,
    name_en: "Free Electricity Power Supply for Farmers",
    name_ta: "விவசாயிகளுக்கு இலவச மின்சாரம்",
    year: 1984,
    era_en: "MGR",
    era_ta: "எம்.ஜி.ஆர்",
    category_en: "Agriculture",
    category_ta: "வேளாண்மை & விவசாயிகள் நலன்",
    people_en: "Farmers",
    people_ta: "விவசாயிகள்",
    type_en: "Scheme",
    type_ta: "திட்டம்",
    served_en: "Tamil Nadu Farmers",
    served_ta: "தமிழக விவசாயிகள்",
    did_en: "Pioneered free agricultural electricity to empower farmers and boost agricultural productivity across Tamil Nadu.",
    did_ta: "விவசாய உற்பத்தியை பெருக்கவும் விவசாயிகளின் வாழ்வாதாரத்தை உயர்த்தவும் இலவச மின்சாரம் வழங்கும் திட்டத்தை தொடங்கி வைத்தார்.",
    impact_en: "Benefited lakhs of farming families with 24x7 free irrigation power",
    impact_ta: "லட்சக்கணக்கான விவசாய குடும்பங்கள் இலவச பாசன மின்சாரத்தால் பயனடைந்தனர்",
    image: "/mgr_free_electricity.jpg",
    source: "TN Agriculture & Power Dept"
  },
  {
    id: 36,
    name_en: "Direct Appointment of Village Administrative Officers (VAO)",
    name_ta: "கிராம நிர்வாக அலுவலர் நியமனங்கள்",
    year: 1980,
    era_en: "MGR",
    era_ta: "எம்.ஜி.ஆர்",
    category_en: "Governance",
    category_ta: "நிர்வாக சீர்திருத்தம்",
    people_en: "Youth & Rural People",
    people_ta: "கிராமப்புற மக்கள் & இளைஞர்கள்",
    type_en: "Administrative Reform",
    type_ta: "நிர்வாக சீர்திருத்தம்",
    served_en: "Rural Citizens & Educated Youth",
    served_ta: "கிராம மக்கள் & தகுதியான இளைஞர்கள்",
    did_en: "Abolished legacy hereditary Karnam system and introduced merit-based direct appointments for Village Administrative Officers (VAO).",
    did_ta: "பழைய கர்ணம் முறையை ஒழித்து, தகுதியின் அடிப்படையில் நேரடியாக கிராம நிர்வாக அலுவலர்களை (VAO) நியமித்து புரட்சி செய்தார்.",
    impact_en: "Modernized rural administration and provided government jobs to thousands of educated youth",
    impact_ta: "கிராம நிர்வாகத்தை நவீனமயமாக்கி ஆயிரக்கணக்கான பட்டதாரி இளைஞர்களுக்கு அரசுப்பணி வழங்கியது",
    image: "/mgr_vao_appointments.jpg",
    source: "TN Revenue Dept Records"
  },
  {
    id: 37,
    name_en: "Establishment of Landmark Universities & Higher Education Colleges",
    name_ta: "பல்கலைக்கழகம் மற்றும் கல்லூரிகள் திறப்பு",
    year: 1978,
    era_en: "MGR",
    era_ta: "எம்.ஜி.ஆர்",
    category_en: "Education",
    category_ta: "உயர்கல்வி & பல்கலைக்கழகங்கள்",
    people_en: "Students & Youth",
    people_ta: "மாணவர்கள் & இளைஞர்கள்",
    type_en: "Higher Education Reform",
    type_ta: "கல்வி வளர்ச்சி",
    served_en: "College Students & Researchers",
    served_ta: "கல்லூரி மாணவர்கள் & ஆராய்ச்சியாளர்கள்",
    did_en: "Established premier universities including Anna University, Tamil University Thanjavur, Bharathiar University, and Mother Teresa Women's University.",
    did_ta: "அண்ணா பல்கலைக்கழகம், தமிழ் பல்கலைக்கழகம், பாரதியார் பல்கலைக்கழகம் மற்றும் மகளிர் பல்கலைக்கழகம் போன்ற புகழ்பெற்ற உயர்கல்வி மையங்களை உருவாக்கினார்.",
    impact_en: "Transformed Tamil Nadu into India's premier higher education hub for lakhs of students",
    impact_ta: "லட்சக்கணக்கான மாணவர்கள் உயர்கல்வி பெற தமிழ்நாட்டை முதன்மை மாநிலமாக உயர்த்தியது",
    image: "/mgr_universities_colleges.jpg",
    source: "TN Higher Education Dept"
  },
  {
    id: 38,
    name_en: "Expansion & Strengthening of Public Distribution System (Ration Shops)",
    name_ta: "பொதுமக்கள் பயன்பாட்டிற்காக ரேஷன் கடை திறப்பு",
    year: 1977,
    era_en: "MGR",
    era_ta: "எம்.ஜி.ஆர்",
    category_en: "Welfare",
    category_ta: "உணவுப் பாதுகாப்பு & பொது விநியோகம்",
    people_en: "Families",
    people_ta: "பொதுமக்கள் & ஏழை குடும்பங்கள்",
    type_en: "Scheme",
    type_ta: "திட்டம்",
    served_en: "All Tamil Nadu Households",
    served_ta: "அனைத்து குடும்பங்கள்",
    did_en: "Expanded network of Fair Price Ration Shops to every village ensuring subsidized essential food commodities for all families.",
    did_ta: "அனைத்து கிராமங்களுக்கும் நியாயவிலைக் கடைகளை விரிவுபடுத்தி ஏழை மக்களுக்கு மானிய விலையில் அத்தியாவசிய உணவுப் பொருட்களை வழங்கினார்.",
    impact_en: "Guaranteed food security and hunger relief for over 1.5 Crore families across Tamil Nadu",
    impact_ta: "1.5 கோடிக்கும் அதிகமான குடும்பங்களின் உணவுப் பாதுகாப்பை உறுதி செய்தது",
    image: "/mgr_ration_shops.jpg",
    source: "TN Civil Supplies Dept"
  },
  {
    id: 39,
    name_en: "Chief Minister's Solar Powered Green Housing Scheme",
    name_ta: "அம்மா பசுமை வீடு திட்டம்",
    year: 2011,
    era_en: "Amma",
    era_ta: "அம்மா",
    category_en: "Housing & Infrastructure",
    category_ta: "வீட்டுவசதி & கிராமப்புற வளர்ச்சி",
    people_en: "Poor Rural Families",
    people_ta: "கிராமப்புற ஏழை குடும்பங்கள்",
    type_en: "Housing Scheme",
    type_ta: "வீட்டுவசதி திட்டம்",
    served_en: "Below Poverty Line Households",
    served_ta: "வறுமைக் கோட்டிற்குட்பட்ட குடும்பங்கள்",
    did_en: "Constructed 300 sq.ft concrete green houses powered by solar energy free of cost for rural poor families.",
    did_ta: "கிராமப்புற ஏழை மக்களுக்காக சூரிய சக்தியால் இயங்கும் இலவச பசுமை வீடுகளைக் கட்டித் தந்தது.",
    impact_en: "Constructed over 3 Lakh solar-powered houses across rural Tamil Nadu",
    impact_ta: "3 லட்சத்திற்கும் அதிகமான கிராமப்புற குடும்பங்களுக்கு இலவச பசுமை வீடுகள் வழங்கப்பட்டன",
    image: "/amma_green_housing.jpg",
    source: "TN Rural Development Dept"
  },
  {
    id: 40,
    name_en: "Historic Total Ban on Sale of Lottery Tickets",
    name_ta: "லாட்டரி சீட்டு ஒழிப்பு",
    year: 2003,
    era_en: "Amma",
    era_ta: "அம்மா",
    category_en: "Social Welfare & Protection",
    category_ta: "சமூக பாதுகாப்பு & ஒழுக்கம்",
    people_en: "Working Class & Families",
    people_ta: "உழைக்கும் வர்க்கம் & குடும்பங்கள்",
    type_en: "Policy Reform",
    type_ta: "சமூக பாதுகாப்பு நடவடிக்கை",
    served_en: "All Poor & Working Class Families",
    served_ta: "அனைத்து எளிய குடும்பங்கள்",
    did_en: "Completely banned online and paper lotteries in Tamil Nadu to safeguard poor and working-class families from financial ruin.",
    did_ta: "ஏழை எளிய குடும்பங்கள் நிதி ரீதியாக சீரழிவதைத் தடுக்க தமிழ்நாட்டில் லாட்டரி சீட்டுகளை முற்றிலுமாக ஒழித்து கட்டுப்படுத்தினார்.",
    impact_en: "Protected millions of poor families from gambling addiction and economic distress",
    impact_ta: "கோடிக்கணக்கான எளிய குடும்பங்களின் பொருளாதார சீரழிவைத் தடுத்து காப்பாற்றியது",
    image: "/amma_lottery_ban.jpg",
    source: "TN Home Dept Records"
  },
  {
    id: 41,
    name_en: "Free Rice Supply for Ramadan Iftar Nonbu Kanji Scheme",
    name_ta: "இஸ்லாமியர்களுக்காக ரமலான் நோன்பு கஞ்சி திட்டம்",
    year: 2001,
    era_en: "Amma",
    era_ta: "அம்மா",
    category_en: "Welfare & Minority Welfare",
    category_ta: "சிறுபான்மையினர் நலன்",
    people_en: "Muslim Community",
    people_ta: "இஸ்லாமிய சமுதாய மக்கள்",
    type_en: "Welfare Scheme",
    type_ta: "நலத்திட்டம்",
    served_en: "Mosques & Islamic Pilgrims across TN",
    served_ta: "தமிழக பள்ளிவாசல்கள்",
    did_en: "Provided thousands of metric tonnes of free raw rice to mosques across Tamil Nadu during the holy month of Ramadan for preparing Iftar Nonbu Kanji.",
    did_ta: "புனித ரமலான் மாதத்தில் தமிழ்நாடு முழுவதிலும் உள்ள பள்ளிவாசல்களுக்கு இலவச அரிசி வழங்கி நோன்பு கஞ்சி காய்ச்ச உதவினார்.",
    impact_en: "Distributed over 5,000 MT of free rice annually to 3,000+ mosques nationwide",
    impact_ta: "3,000-க்கும் மேற்பட்ட பள்ளிவாசல்களுக்கு ஆண்டுதோறும் 5,000 மெட்ரிக் டன் இலவச அரிசி விநியோகம்",
    image: "/amma_ramadan_kanji.jpg",
    source: "TN Backward Classes & Minority Dept"
  },
  {
    id: 42,
    name_en: "Temple Annadhanam Free Meal Scheme",
    name_ta: "திருக்கோயில் அன்னதான திட்டம்",
    year: 2002,
    era_en: "Amma",
    era_ta: "அம்மா",
    category_en: "Welfare & Culture",
    category_ta: "அறநிலையம் & உணவுப்பணி",
    people_en: "Devotees & Pilgrims",
    people_ta: "பக்தர்கள் & பொதுமக்கள்",
    type_en: "Welfare Scheme",
    type_ta: "நலத்திட்டம்",
    served_en: "Temple Visitors & Pilgrims",
    served_ta: "கோயில் பக்தர்கள்",
    did_en: "Launched free wholesome meals serving lakhs of devotees daily across 750+ major temples in Tamil Nadu.",
    did_ta: "தமிழ்நாட்டின் 750-க்கும் மேற்பட்ட முக்கிய திருக்கோயில்களில் தினசரி லட்சக்கணக்கான பக்தர்களுக்கு இலவச அன்னதானம் வழங்கும் திட்டத்தைத் தொடங்கினார்.",
    impact_en: "Provides free daily meals to over 1 Lakh devotees across major temples nationwide",
    impact_ta: "தினசரி 1 லட்சத்திற்கும் அதிகமான பக்தர்களுக்கு இலவச உணவு வழங்கும் தொண்டு",
    image: "/amma_temple_annadhanam.jpg",
    source: "TN HR&CE Dept Records"
  },
  {
    id: 43,
    name_en: "Special Anti-Land Grabbing Cell & Property Recovery Act",
    name_ta: "நில அபகரிப்பு தடுப்பு சட்டம்",
    year: 2011,
    era_en: "Amma",
    era_ta: "அம்மா",
    category_en: "Law & Order",
    category_ta: "சட்டம் ஒழுங்கு & நில பாதுகாப்பு",
    people_en: "Property Owners & Citizens",
    people_ta: "நில உரிமையாளர்கள் & பொதுமக்கள்",
    type_en: "Legal Protection Act",
    type_ta: "சட்ட நடவடிக்கை",
    served_en: "Victims of Land Grabbers",
    served_ta: "பாதிக்கப்பட்ட நில உரிமையாளர்கள்",
    did_en: "Formed dedicated Police Anti-Land Grabbing Special Cells across all districts to legally reclaim usurped private & public lands.",
    did_ta: "அபகரிக்கப்பட்ட தனியார் மற்றும் பொது நிலங்களை மீட்க அனைத்து மாவட்டங்களிலும் சிறப்பு நில அபகரிப்பு தடுப்பு பிரிவுகளை அமைத்தார்.",
    impact_en: "Restored over ₹3,500 Crore worth of stolen lands back to rightful owners",
    impact_ta: "ரூ.3,500 கோடிக்கும் அதிகமான மதிப்புள்ள அபகரிக்கப்பட்ட நிலங்கள் மீட்கப்பட்டு உரிமையாளர்களிடம் ஒப்படைக்கப்பட்டன",
    image: "/amma_anti_land_grabbing.jpg",
    source: "TN Police & Law Dept"
  },
  {
    id: 44,
    name_en: "Free Electric Mixie, Grinder & Fan Scheme",
    name_ta: "ஏழை எளிய மக்களுக்கு விலையில்லா கிரைண்டர், மிக்சி, மின்விசிறி",
    year: 2011,
    era_en: "Amma",
    era_ta: "அம்மா",
    category_en: "Welfare",
    category_ta: "சமூக நலம் & மகளிர் மேன்மை",
    people_en: "Women & Household Families",
    people_ta: "மகளிர் & எளிய குடும்பங்கள்",
    type_en: "Scheme",
    type_ta: "திட்டம்",
    served_en: "Women & Housewives",
    served_ta: "இல்லத்தரசிகள் & எளிய குடும்பங்கள்",
    did_en: "Distributed free electric wet grinders, mixies, and table fans to empower housewives and modernize rural kitchens.",
    did_ta: "இல்லத்தரசிகளின் பணிச்சுமையைக் குறைத்து வாழ்க்கைத் தரத்தை உயர்த்த விலையில்லா கிரைண்டர், மிக்சி, மின்விசிறி வழங்கினார்.",
    impact_en: "Distributed to over 1.85 Crore poor household families across Tamil Nadu",
    impact_ta: "1.85 கோடிக்கும் அதிகமான எளிய குடும்பங்களுக்கு விலையில்லா சாதனங்கள் வழங்கப்பட்டன",
    image: "/amma_mixie_grinder.jpg",
    source: "TN Civil Supplies & Welfare Dept"
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
    image: "/amma_free_bicycles.jpg",
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
    served_en: "Government School Students",
    served_ta: "அரசுப் பள்ளி மாணவர்கள்",
    did_en: "Provided textbooks, notebooks, uniforms, school bags, and footwear to reduce everyday schooling expenses.",
    did_ta: "பாடப்புத்தகங்கள், சீருடைகள், காலணிகள், பள்ளிப் பைகள் வழங்கி எளிய குடும்பங்களின் செலவைக் குறைத்தது.",
    impact_en: "70 Lakh+ students supported annually",
    impact_ta: "ஒவ்வொரு ஆண்டும் 70 லட்சத்திற்கும் அதிகமான மாணவர்கள் பயன்பெற்றனர்",
    image: "/amma_student_essentials.jpg",
    source: "Social Welfare Dept"
  },
  {
    id: 4,
    name_en: "Free Laptop Scheme",
    name_ta: "விலையில்லா மடிக்கணினி திட்டம்",
    year: 2011,
    era_en: "Amma",
    era_ta: "அம்மா",
    category_en: "Education",
    category_ta: "கல்வி",
    people_en: "Students",
    people_ta: "மாணவர்கள்",
    type_en: "Scheme",
    type_ta: "திட்டம்",
    served_en: "Higher Secondary & College Students",
    served_ta: "மேல்நிலைப் பள்ளி மற்றும் கல்லூரி மாணவர்கள்",
    did_en: "Expanded access to computers and digital learning during a period when technology became important.",
    did_ta: "தொழில்நுட்பக் கல்வியை ஊக்குவிக்க மேல்நிலை மற்றும் கல்லூரி மாணவர்களுக்கு மடிக்கணினிகள் வழங்கப்பட்டன.",
    impact_en: "52 Lakh+ laptops distributed across Tamil Nadu",
    impact_ta: "தமிழ்நாடு முழுவதும் 52 லட்சத்திற்கும் அதிகமான மடிக்கணினிகள் வழங்கப்பட்டன",
    image: "/amma_free_laptops.jpg",
    source: "IT Dept Statistics"
  },
  {
    id: 5,
    name_en: "7.5% Preferential Medical Admission",
    name_ta: "அரசு பள்ளியில் படித்து நீட் தேர்வில் தேர்ச்சி பெற்ற மாணவர்களுக்கு 7.5% இட ஒதுக்கீடு",
    year: 2020,
    era_en: "EPS",
    era_ta: "இ.பி.எஸ்",
    category_en: "Education",
    category_ta: "கல்வி",
    people_en: "Students",
    people_ta: "மாணவர்கள்",
    type_en: "Policy",
    type_ta: "கொள்கை",
    served_en: "Government School Students qualifying NEET",
    served_ta: "நீட் தேர்வில் தேர்ச்சி பெற்ற அரசுப் பள்ளி மாணவர்கள்",
    did_en: "Enacted 7.5% preferential admission within government seats for eligible government-school students.",
    did_ta: "அரசுப் பள்ளி மாணவர்களின் மருத்துவராகும் கனவை நனவாக்க 7.5 விழுக்காடு முன்னுரிமை இடஒதுக்கீடு கொண்டுவரப்பட்டது.",
    impact_en: "Created a dedicated pathway for 2,000+ government students to become doctors",
    impact_ta: "2,000-க்கும் மேற்பட்ட அரசுப் பள்ளி மாணவர்கள் மருத்துவராக வழிவகுத்துள்ளது",
    image: "/eps_7point5_reservation.jpg",
    source: "Medical Education Directorate"
  },
  {
    id: 6,
    name_en: "Cradle Baby Scheme",
    name_ta: "தொட்டில் குழந்தை திட்டம்",
    year: 1992,
    era_en: "Amma",
    era_ta: "அம்மா",
    category_en: "Women",
    category_ta: "சுகாதாரம் & நலத்திட்டங்கள்",
    people_en: "Women",
    people_ta: "பெண்கள்",
    type_en: "Scheme",
    type_ta: "திட்டம்",
    served_en: "Infant Girls & Mothers",
    served_ta: "பெண் குழந்தைகள் & தாய்மார்கள்",
    did_en: "Initiative aimed at protecting vulnerable girl children and addressing female infanticide.",
    did_ta: "பெண் சிசுக்கொலையை ஒழிக்கவும், பெண் குழந்தைகளைப் பாதுகாக்கவும் தொடங்கப்பட்ட புரட்சிகரத் திட்டம்.",
    impact_en: "Saved thousands of female lives and improved child sex ratio",
    impact_ta: "ஆயிரக்கணக்கான பெண் குழந்தைகளின் உயிர்களைக் காப்பாற்றி பாலின விகிதத்தை உயர்த்தியது",
    image: "/amma_cradle_baby.jpg",
    source: "Health Ministry Bulletin"
  },
  {
    id: 7,
    name_en: "All-Women Police Stations",
    name_ta: "அனைத்து மகளிர் காவல் நிலையங்கள்",
    year: 1992,
    era_en: "Amma",
    era_ta: "அம்மா",
    category_en: "Women",
    category_ta: "சுகாதாரம் & நலத்திட்டங்கள்",
    people_en: "Women",
    people_ta: "பெண்கள்",
    type_en: "Project",
    type_ta: "திட்டம்",
    served_en: "Women seeking safety & justice",
    served_ta: "பாதுகாப்பு மற்றும் நீதி தேவைப்படும் பெண்கள்",
    did_en: "Dedicated police stations created to provide specialised access to policing and support for women.",
    did_ta: "பெண்களின் புகார்களுக்கு முன்னுரிமை அளித்து தீர்வு காண பிரத்யேக மகளிர் காவல் நிலையங்கள் அமைக்கப்பட்டன.",
    impact_en: "Over 200+ dedicated stations functioning statewide",
    impact_ta: "மாநிலம் முழுவதும் 200-க்கும் மேற்பட்ட மகளிர் காவல் நிலையங்கள் செயல்படுகின்றன",
    image: "/amma_women_police.jpg",
    source: "Home Dept Police records"
  },
  {
    id: 8,
    name_en: "Marriage Assistance Schemes",
    name_ta: "திருமண நிதியுதவி திட்டம்",
    year: 2011,
    era_en: "Amma",
    era_ta: "அம்மா",
    category_en: "Women",
    category_ta: "சுகாதாரம் & நலத்திட்டங்கள்",
    people_en: "Women",
    people_ta: "பெண்கள்",
    type_en: "Scheme",
    type_ta: "திட்டம்",
    served_en: "Underprivileged Brides & Families",
    served_ta: "ஏழை எளிய மணப்பெண்கள் & குடும்பங்கள்",
    did_en: "Support for eligible women and families through state marriage-assistance programmes.",
    did_ta: "ஏழைப் பெண்களின் திருமணச் சுமையைக் குறைக்க நிதியுதவியுடன் கூடிய திருமணத் திட்டம்.",
    impact_en: "12 Lakh+ brides assisted with financial grants",
    impact_ta: "12 லட்சத்திற்கும் அதிகமான மணப்பெண்களுக்கு நிதியுதவி வழங்கப்பட்டுள்ளது",
    image: "/amma_marriage_assistance.jpg",
    source: "Social Welfare Records"
  },
  {
    id: 9,
    name_en: "Gold for Thali (Thaliku Thangam)",
    name_ta: "தாலிக்கு தங்கம் திட்டம்",
    year: 2011,
    era_en: "Amma",
    era_ta: "அம்மா",
    category_en: "Women",
    category_ta: "சுகாதாரம் & நலத்திட்டங்கள்",
    people_en: "Women",
    people_ta: "பெண்கள்",
    type_en: "Scheme",
    type_ta: "திட்டம்",
    served_en: "Eligible brides",
    served_ta: "தகுதியான மணப்பெண்கள்",
    did_en: "Gold assistance (initially 4g, expanded to 8g of 22-carat gold) provided alongside marriage support.",
    did_ta: "திருமண நிதியுதவியுடன் தாலிக்குத் தங்கம் (4 கிராம் முதல் 8 கிராம் வரை) விலையில்லாமல் வழங்கப்பட்டது.",
    impact_en: "Over 8,000 kg of gold distributed to poor brides",
    impact_ta: "ஏழை மணப்பெண்களுக்கு 8,000 கிலோவிற்கும் அதிகமான தங்கம் வழங்கப்பட்டுள்ளது",
    image: "/amma_thaalikku_thangam.jpg",
    source: "Welfare Directorate Report"
  },
  {
    id: 10,
    name_en: "Amma Two-Wheeler Scheme",
    name_ta: "அம்மா இருசக்கர வாகன மானியத் திட்டம்",
    year: 2018,
    era_en: "Amma",
    era_ta: "அம்மா",
    category_en: "Women",
    category_ta: "சுகாதாரம் & நலத்திட்டங்கள்",
    people_en: "Women",
    people_ta: "பெண்கள்",
    type_en: "Scheme",
    type_ta: "திட்டம்",
    served_en: "Working Women & Self-Employed Women",
    served_ta: "பணிபுரியும் பெண்கள் & சுயதொழில் புரியும் பெண்கள்",
    did_en: "Designed to improve mobility and empowerment for eligible working women through 50% subsidy.",
    did_ta: "பணிபுரியும் பெண்களின் பயணத்தை எளிதாக்க இருசக்கர வாகனங்களுக்கு 50 விழுக்காடு மானியம் வழங்கப்பட்டது.",
    impact_en: "3.5 Lakh+ working women benefited with mobility",
    impact_ta: "3.5 லட்சத்திற்கும் அதிகமான உழைக்கும் பெண்கள் பயனடைந்தனர்",
    image: "/amma_two_wheeler.jpg",
    source: "Social Welfare Dept"
  },
  {
    id: 11,
    name_en: "Women's Self-Help Groups (SHGs)",
    name_ta: "மகளிர் சுயஉதவிக் குழுக்கள்",
    year: 2001,
    era_en: "Amma",
    era_ta: "அம்மா",
    category_en: "Women",
    category_ta: "சுகாதாரம் & நலத்திட்டங்கள்",
    people_en: "Women",
    people_ta: "பெண்கள்",
    type_en: "Policy",
    type_ta: "கொள்கை",
    served_en: "Rural & Urban Poor Women",
    served_ta: "கிராமப்புற மற்றும் நகர்ப்புற ஏழைப் பெண்கள்",
    did_en: "Institutional and financial support helped women participate in savings, enterprise and livelihood.",
    did_ta: "நிதி மற்றும் கட்டமைப்பு உதவிகள் மூலம் பெண்கள் சிறுதொழில் தொடங்கவும் சேமிக்கவும் வழிவகை செய்யப்பட்டது.",
    impact_en: "Empowered 1 Crore+ women through micro-credit",
    impact_ta: "நுண்கடன் மூலம் 1 கோடிக்கும் அதிகமான பெண்களுக்கு பொருளாதார சுதந்திரம் கிடைத்தது",
    image: "/amma_shg_groups.jpg",
    source: "TN Women Development Corporation"
  },
  {
    id: 12,
    name_en: "Amma Unavagam (Amma Canteens)",
    name_ta: "அம்மா உணவகம்",
    year: 2013,
    era_en: "Amma",
    era_ta: "அம்மா",
    category_en: "Welfare",
    category_ta: "சுகாதாரம் & நலத்திட்டங்கள்",
    people_en: "Families",
    people_ta: "குடும்பங்கள்",
    type_en: "Project",
    type_ta: "திட்டம்",
    served_en: "Urban Poor, Labourers & Daily wagers",
    served_ta: "நகர்ப்புற ஏழைகள், தொழிலாளர்கள் & தினக்கூலிகள்",
    did_en: "Affordable freshly cooked meals through government-supported canteens (Re 1 Idli, Rs 5 Variety Rice).",
    did_ta: "எளிய உழைப்பாளர்களின் பசி போக்க குறைந்த விலையில் சுகாதாரமான உணவு வழங்கும் அம்மா உணவகம் தொடங்கப்பட்டது.",
    impact_en: "Served over 40 Crore meals to daily wagers",
    impact_ta: "தினக்கூலி உழைப்பாளர்களுக்கு 40 கோடிக்கும் அதிகமான உணவுகள் வழங்கப்பட்டுள்ளன",
    image: "/amma_unavagam.jpg",
    source: "Municipal Administration Records"
  },
  {
    id: 13,
    name_en: "Universal Public Distribution System",
    name_ta: "பொது விநியோகத் திட்டம்",
    year: 2011,
    era_en: "Amma",
    era_ta: "அம்மா",
    category_en: "Welfare",
    category_ta: "சுகாதாரம் & நலத்திட்டங்கள்",
    people_en: "Families",
    people_ta: "குடும்பங்கள்",
    type_en: "Scheme",
    type_ta: "திட்டம்",
    served_en: "Ration Cardholders",
    served_ta: "குடும்ப அட்டைதாரர்கள்",
    did_en: "Support for household access to essential commodities (free rice, subsidized sugar, pulses and oil).",
    did_ta: "குடும்பங்களுக்குத் தேவையான அத்தியாவசியப் பொருட்களை விலையில்லாமலும் மானிய விலையிலும் வழங்கியது.",
    impact_en: "2 Crore+ ration cards supplied with free food grains",
    impact_ta: "2 கோடிக்கும் அதிகமான குடும்பங்களுக்கு விலையில்லா உணவுப் பொருட்கள் வழங்கப்பட்டன",
    image: "/amma_public_distribution.jpg",
    source: "Food & Consumer Protection"
  },
  {
    id: 14,
    name_en: "Social Security Pension",
    name_ta: "சமூக பாதுகாப்பு ஓய்வூதியம்",
    year: 2011,
    era_en: "Amma",
    era_ta: "அம்மா",
    category_en: "Welfare",
    category_ta: "சுகாதாரம் & நலத்திட்டங்கள்",
    people_en: "Senior Citizens",
    people_ta: "முதியோர்கள்",
    type_en: "Policy",
    type_ta: "கொள்கை",
    served_en: "Senior Citizens, Widows, & Differently Abled",
    served_ta: "முதியோர்கள், விதவைகள் & மாற்றுத்திறனாளிகள்",
    did_en: "Financial pension assistance for senior citizens, widows, and other vulnerable groups.",
    did_ta: "ஆதரவற்ற முதியோர்கள், விதவைகள் மற்றும் மாற்றுத்திறனாளிகளுக்கு மாதாந்திர நிதியுதவி ஓய்வூதியம்.",
    impact_en: "35 Lakh+ beneficiaries received monthly assistance",
    impact_ta: "35 லட்சத்திற்கும் அதிகமான பயனாளிகள் மாதாந்திர ஓய்வூதியம் பெற்றனர்",
    image: "/amma_social_pension.jpg",
    source: "Revenue Dept Pensions"
  },
  {
    id: 15,
    name_en: "Amma Comprehensive Health Insurance",
    name_ta: "அம்மா விரிவான காப்பீட்டுத் திட்டம்",
    year: 2012,
    era_en: "Amma",
    era_ta: "அம்மா",
    category_en: "Healthcare",
    category_ta: "சுகாதாரம் & நலத்திட்டங்கள்",
    people_en: "Families",
    people_ta: "குடும்பங்கள்",
    type_en: "Scheme",
    type_ta: "திட்டம்",
    served_en: "Low-income families",
    served_ta: "குறைந்த வருமானம் கொண்ட குடும்பங்கள்",
    did_en: "Government-supported insurance initiatives expanded access to specified treatments for eligible families.",
    did_ta: "ஏழை எளிய மக்களுக்கு தனியார் மருத்துவமனைகளிலும் உயர்தர சிகிச்சை கிடைக்க காப்பீடு வழங்கப்பட்டது.",
    impact_en: "1.5 Crore+ families covered for major treatments",
    impact_ta: "1.5 கோடிக்கும் அதிகமான குடும்பங்களுக்கு மருத்துவக் காப்பீடு வழங்கப்பட்டது",
    image: "/amma_comprehensive_health_insurance.jpg",
    source: "Health Dept Insurance Wing"
  },
  {
    id: 16,
    name_en: "Amma Pharmacy (Amma Marundhagam)",
    name_ta: "அம்மா மருந்தகம்",
    year: 2014,
    era_en: "Amma",
    era_ta: "அம்மா",
    category_en: "Healthcare",
    category_ta: "சுகாதாரம் & நலத்திட்டங்கள்",
    people_en: "Families",
    people_ta: "குடும்பங்கள்",
    type_en: "Project",
    type_ta: "திட்டம்",
    served_en: "Public",
    served_ta: "பொதுமக்கள்",
    did_en: "Affordable medicine initiatives (offering up to 15% discount) aimed to reduce everyday cost of healthcare.",
    did_ta: "பொதுமக்களுக்குத் தேவையான மருந்துகளைக் குறைந்த விலையில் வழங்க அம்மா மருந்தகம் தொடங்கப்பட்டது.",
    impact_en: "100+ stores supplying affordable generic & branded medicines",
    impact_ta: "100-க்கும் மேற்பட்ட மருந்தகங்கள் மூலம் மக்கள் மலிவு விலையில் மருந்து பெற்றனர்",
    image: "/amma_pharmacy.jpg",
    source: "Cooperative Dept Records"
  },
  {
    id: 17,
    name_en: "Amma Baby Care Kit",
    name_ta: "அம்மா குழந்தை நலப் பெட்டகம்",
    year: 2015,
    era_en: "Amma",
    era_ta: "அம்மா",
    category_en: "Healthcare",
    category_ta: "சுகாதாரம் & நலத்திட்டங்கள்",
    people_en: "Women",
    people_ta: "பெண்கள்",
    type_en: "Scheme",
    type_ta: "திட்டம்",
    served_en: "Newborn infants & mothers in Govt Hospitals",
    served_ta: "அரசு மருத்துவமனையில் பிறக்கும் குழந்தைகள் & தாய்மார்கள்",
    did_en: "Provided 16 essential newborn baby and maternal items to promote infant hygiene and maternal health.",
    did_ta: "பிறந்த குழந்தையைப் பாதுகாக்க தேவையான 16 பொருட்கள் அடங்கிய பெட்டகம் வழங்கப்பட்டது.",
    impact_en: "6 Lakh+ kits distributed annually to poor mothers",
    impact_ta: "ஒவ்வொரு ஆண்டும் 6 லட்சத்திற்கும் அதிகமான தாய்மார்களுக்கு வழங்கப்படுகிறது",
    image: "/amma_maternal_sanjeevi.jpg",
    source: "Health & Family Welfare"
  },
  {
    id: 18,
    name_en: "Government Medical Institutions Expansion",
    name_ta: "தமிழ்நாட்டில் 11 மருத்துவக்கல்லூரிகள் திறப்பு",
    year: 2020,
    era_en: "EPS",
    era_ta: "இ.பி.எஸ்",
    category_en: "Healthcare",
    category_ta: "சுகாதாரம் & நலத்திட்டங்கள்",
    people_en: "Students",
    people_ta: "மாணவர்கள்",
    type_en: "Project",
    type_ta: "திட்டம்",
    served_en: "Medical Students & Public",
    served_ta: "மருத்துவ மாணவர்கள் & பொதுமக்கள்",
    did_en: "Sanctioned and established 11 new government medical colleges in Tamil Nadu in a single year.",
    did_ta: "தமிழகத்தில் ஒரே ஆண்டில் 11 புதிய அரசு மருத்துவக் கல்லூரிகளுக்கு அனுமதி பெற்றுத் தொடங்கப்பட்டது.",
    impact_en: "Increased state MBBS seats capacity by 1,650 seats",
    impact_ta: "மாநிலத்தில் மருத்துவப் படிப்பு இடங்களை 1,650 ஆக உயர்த்தியது",
    image: "/eps_11_medical_colleges.jpg",
    source: "Directorate of Medical Education"
  },
  {
    id: 19,
    name_en: "Cooperative Farm Loan Waiver",
    name_ta: "12,110 கோடி விவசாய கடன் தள்ளுபடி",
    year: 2021,
    era_en: "EPS",
    era_ta: "இ.பி.எஸ்",
    category_en: "Agriculture",
    category_ta: "விவசாயம் & நீர் திட்டங்கள்",
    people_en: "Farmers",
    people_ta: "விவசாயிகள்",
    type_en: "Policy",
    type_ta: "கொள்கை",
    served_en: "Cooperative bank borrowing farmers",
    served_ta: "கூட்டுறவு வங்கிகளில் பயிர்க்கடன் பெற்ற விவசாயிகள்",
    did_en: "Waived cooperative agricultural crop loans to relieve rural debt burdens following monsoon failure.",
    did_ta: "வறட்சியால் பாதிக்கப்பட்ட விவசாயிகளின் கூட்டுறவு வங்கிக் கடன்கள் முழுமையாகத் தள்ளுபடி செய்யப்பட்டன.",
    impact_en: "16 Lakh+ farmers benefited with Rs 12,110 Crore waiver",
    impact_ta: "16 லட்சம் விவசாயிகள் ரூ.12,110 கோடி கடன் தள்ளுபடி மூலம் பயனடைந்தனர்",
    image: "/eps_farm_loan_waiver.jpg",
    source: "Cooperation Dept Gazettes"
  },
  {
    id: 20,
    name_en: "Uzhavan Mobile Application",
    name_ta: "உழவன் கைபேசி செயலி",
    year: 2018,
    era_en: "EPS",
    era_ta: "இ.பி.எஸ்",
    category_en: "Agriculture",
    category_ta: "விவசாயம் & நீர் திட்டங்கள்",
    people_en: "Farmers",
    people_ta: "விவசாயிகள்",
    type_en: "Project",
    type_ta: "திட்டம்",
    served_en: "Tamil Nadu Farmers",
    served_ta: "தமிழக விவசாயிகள்",
    did_en: "Digital technology tool bringing real-time agricultural scheme information and seed availability close to farmers.",
    did_ta: "விவசாயிகளுக்கு தேவையான அரசு திட்டங்கள், மானியங்கள் மற்றும் விதைகள் குறித்த விவரங்களை வழங்கும் செயலி.",
    impact_en: "10 Lakh+ downloads and active farmer engagement",
    impact_ta: "10 லட்சத்திற்கும் அதிகமான விவசாயிகள் பயன்படுத்தி வருகின்றனர்",
    image: "/eps_uzhavan_app.jpg",
    source: "Agriculture Dept"
  },
  {
    id: 45,
    name_en: "Gazette Notification & Formation of Cauvery Water Management Authority",
    name_ta: "காவிரி நீர் மேலாண்மை ஆணையம் மற்றும் முறைப்படுத்தும் குழு",
    year: 2018,
    era_en: "EPS",
    era_ta: "இ.பி.எஸ்",
    category_en: "Agriculture & Water",
    category_ta: "விவசாயம் & நீர் மேலாண்மை",
    people_en: "Delta Farmers & Citizens",
    people_ta: "காவிரி பாசன விவசாயிகள்",
    type_en: "Historic Achievement",
    type_ta: "வரலாற்று சாதனை",
    served_en: "Cauvery Delta Farmers",
    served_ta: "காவிரி டெல்டா விவசாயிகள்",
    did_en: "Secured historic Union Gazette notification establishing Cauvery Water Management Authority & Regulation Committee safeguarding TN delta rights.",
    did_ta: "தமிழக காவிரி டெல்டா விவசாயிகளின் உரிமைகளை நிலைநிறுத்த காவிரி நீர் மேலாண்மை ஆணையத்தை அமைத்து மத்திய அரசாணை வெளியிட்ட சாதனை.",
    impact_en: "Guaranteed Tamil Nadu's legitimate water share protecting 25 Lakh acres of delta farmland",
    impact_ta: "25 லட்சம் ஏக்கர் காவிரி டெல்டா விவசாய நிலங்களின் நீருரிமையை பாதுகாத்தது",
    image: "/eps_cauvery_authority.jpg",
    source: "TN Public Works Dept (PWD)"
  },
  {
    id: 46,
    name_en: "Tamil Nadu Ranked No.1 in India for Wind Energy Generation",
    name_ta: "காற்றாலை மின் உற்பத்தியில் தமிழ்நாடு முதலிடம்",
    year: 2019,
    era_en: "EPS",
    era_ta: "இ.பி.எஸ்",
    category_en: "Infrastructure & Energy",
    category_ta: "மின்சாரம் & உள்கட்டமைப்பு",
    people_en: "State Industry & Citizens",
    people_ta: "தொழில்துறை & பொதுமக்கள்",
    type_en: "National Recognition",
    type_ta: "தேசிய சாதனை",
    served_en: "All Electricity Consumers",
    served_ta: "தமிழக மின் நுகர்வோர்கள்",
    did_en: "Positioned Tamil Nadu as India's pioneer leader in green renewable wind power capacity achieving national 1st position.",
    did_ta: "காற்றாலை மற்றும் புதுப்பிக்கத்தக்க பசுமை மின் உற்பத்தியில் தமிழ்நாட்டை இந்தியாவிலேயே முதலிடத்திற்கு உயர்த்தினார்.",
    impact_en: "Achieved over 9,300 MW wind power capacity making TN a power surplus state",
    impact_ta: "9,300 மெகாவாட்டிற்கும் அதிகமான காற்றாலை மின்சாரத்துடன் மின்சார உபரி மாநிலமாக திகழ்ந்தது",
    image: "/eps_wind_energy.jpg",
    source: "TANGEDCO & Ministry of New Renewable Energy"
  },
  {
    id: 47,
    name_en: "Kudimaramathu Water Bodies Desilting & Restoration Scheme",
    name_ta: "குடிமராமத்து திட்டத்தின் கீழ் 1132 கோடி மதிப்பில் 5,586 நீர்நிலைகள் தூர்வாரப்பட்டது",
    year: 2017,
    era_en: "EPS",
    era_ta: "இ.பி.எஸ்",
    category_en: "Agriculture & Water",
    category_ta: "நீர் மேலாண்மை & விவசாயம்",
    people_en: "Farmers & Rural Citizens",
    people_ta: "விவசாயிகள் & கிராம மக்கள்",
    type_en: "Flagship Scheme",
    type_ta: "முக்கிய சாதனை",
    served_en: "Agricultural Farmers & Water Bodies",
    served_ta: "விவசாயிகள் & நீர்நிலைகள்",
    did_en: "Desilted and restored 5,586 water bodies and lakes at a cost of Rs 1,132 Crore through public participation.",
    did_ta: "மக்கள் பங்கேற்புடன் ரூ.1,132 கோடி மதிப்பில் 5,586 நீர்நிலைகளை வெற்றிகரமாக தூர்வாரி நீர் சேமிப்பை உயர்த்தினார்.",
    impact_en: "Desilted 5,586 lakes boosting groundwater storage across 32 districts",
    impact_ta: "5,586 நீர்நிலைகள் தூர்வாரப்பட்டு நிலத்தடி நீர்மட்டம் கணிசமாக உயர்ந்தது",
    image: "/eps_kudimaramathu.jpg",
    source: "TN PWD & Water Resources Dept"
  },
  {
    id: 48,
    name_en: "Declaration of Cauvery Delta as Protected Agricultural Zone",
    name_ta: "விவசாயிகள் நலனுக்காக டெல்டா பகுதியை பாதுகாக்கப்பட்ட வேளாண் மண்டலமாக அறிவித்தது",
    year: 2020,
    era_en: "EPS",
    era_ta: "இ.பி.எஸ்",
    category_en: "Agriculture",
    category_ta: "வேளாண்மை & டெல்டா பாதுகாப்பு",
    people_en: "Delta Farmers",
    people_ta: "டெல்டா விவசாயிகள்",
    type_en: "Historic Legislation",
    type_ta: "வரலாற்றுச் சட்டம்",
    served_en: "Cauvery Delta Farming Communities",
    served_ta: "காவிரி டெல்டா விவசாயிகள்",
    did_en: "Enacted landmark legislation declaring Cauvery Delta districts as a Protected Agricultural Zone banning industrial hydrocarbon projects.",
    did_ta: "டெல்டா மாவட்டங்களில் ஹைட்ரோகார்பன் போன்ற தொழில் திட்டங்களைத் தடுத்து பாதுகாக்கப்பட்ட வேளாண் மண்டலமாக சட்டப்பூர்வமாக அறிவித்தார்.",
    impact_en: "Protected the food bowl of Tamil Nadu spanning 8 delta districts",
    impact_ta: "8 டெல்டா மாவட்டங்களின் விவசாய நிலங்களைப் பாதுகாத்து உணவுப் பாதுகாப்பை உறுதி செய்தது",
    image: "/eps_protected_agricultural_zone.jpg",
    source: "TN Legislative Assembly Acts"
  },
  {
    id: 49,
    name_en: "National Award for Best State in India for Water Management",
    name_ta: "நீர் மேலாண்மையில் இந்தியாவிலேயே சிறந்த மாநிலமாக திகழ்ந்தது",
    year: 2019,
    era_en: "EPS",
    era_ta: "இ.பி.எஸ்",
    category_en: "Water Resources",
    category_ta: "நீர் மேலாண்மை",
    people_en: "All Citizens & Farmers",
    people_ta: "தமிழக மக்கள் & விவசாயிகள்",
    type_en: "National Award",
    type_ta: "தேசிய விருது",
    served_en: "State Water Management Sector",
    served_ta: "மாநில நீர் மேலாண்மை",
    did_en: "Conferred 1st Prize National Water Award by Ministry of Jal Shakti for exemplary water conservation and management.",
    did_ta: "சிறந்த நீர் மேலாண்மை மற்றும் நீர் சேமிப்பிற்காக மத்திய அரசின் ஜல் சக்தி அமைச்சகத்தின் தேசிய முதன்மை விருதைப் பெற்றது.",
    impact_en: "Awarded 1st Rank in National Water Awards among all Indian states",
    impact_ta: "இந்திய மாநிலங்களில் சிறந்த நீர் மேலாண்மைக்கான முதலிட தேசிய விருது வென்றது",
    image: "/eps_water_management_best_state.jpg",
    source: "Ministry of Jal Shakti Govt of India"
  },
  {
    id: 50,
    name_en: "National Krishi Karman Award - No.1 in Food Grain Production",
    name_ta: "உணவு தானிய உற்பத்தியில் தமிழகம் முதலிடம்",
    year: 2020,
    era_en: "EPS",
    era_ta: "இ.பி.எஸ்",
    category_en: "Agriculture",
    category_ta: "வேளாண் உற்பத்தி",
    people_en: "Farmers",
    people_ta: "விவசாயிகள்",
    type_en: "National Excellence",
    type_ta: "தேசிய சாதனை",
    served_en: "Agricultural Sector",
    served_ta: "விவசாயத் துறை",
    did_en: "Achieved record food grain production exceeding 100 Lakh Metric Tonnes winning prestigious Krishi Karman Award.",
    did_ta: "100 லட்சம் மெட்ரிக் டன்னிற்கும் அதிகமான சாதனை உணவு தானிய உற்பத்தி செய்து மத்திய அரசின் கிருஷி கர்மான் விருதைப் பெற்றது.",
    impact_en: "Produced over 100 Lakh MT food grains securing national Krishi Karman award",
    impact_ta: "100 லட்சம் மெட்ரிக் டன் தானிய உற்பத்தி செய்து தேசிய கிருஷி கர்மான் விருது பெற்றது",
    image: "/eps_food_grain_production_no1.jpg",
    source: "Ministry of Agriculture Govt of India"
  },
  {
    id: 21,
    name_en: "Rainwater Harvesting Mandate",
    name_ta: "மழைநீர் சேகரிப்பு திட்டம்",
    year: 2001,
    era_en: "Amma",
    era_ta: "அம்மா",
    category_en: "Water",
    category_ta: "விவசாயம் & நீர் திட்டங்கள்",
    people_en: "Families",
    people_ta: "குடும்பங்கள்",
    type_en: "Policy",
    type_ta: "கொள்கை",
    served_en: "Tamil Nadu building structures",
    served_ta: "தமிழ்நாட்டிலுள்ள அனைத்து கட்டடங்கள்",
    did_en: "Made rainwater harvesting structure installations mandatory across buildings to restore ground water.",
    did_ta: "நிலத்தடி நீர்மட்டத்தை உயர்த்த தமிழ்நாட்டிலுள்ள அனைத்து கட்டடங்களிலும் இத்திட்டம் கட்டாயமாக்கப்பட்டது.",
    impact_en: "Restored groundwater tables across major urban districts",
    impact_ta: "நகர்ப்புறங்களில் நிலத்தடி நீர்மட்டம் பெருமளவு உயர வழிவகுத்தது",
    image: "/amma_rainwater_harvesting.jpg",
    source: "Municipal Administration"
  },
  {
    id: 24,
    name_en: "Athikadavu-Avinashi Scheme Implementation",
    name_ta: "அத்திக்கடவு-அவிநாசி திட்டம்",
    year: 2019,
    era_en: "EPS",
    era_ta: "இ.பி.எஸ்",
    category_en: "Water",
    category_ta: "விவசாயம் & நீர் திட்டங்கள்",
    people_en: "Farmers",
    people_ta: "விவசாயிகள்",
    type_en: "Project",
    type_ta: "திட்டம்",
    served_en: "Western districts water surplus routing",
    served_ta: "மேற்கு மாவட்டங்களின் நீர் ஆதாரங்கள்",
    did_en: "Implemented the long-discussed water scheme routing water to replenish dry western reservoirs.",
    did_ta: "மேற்கு மாவட்டங்களின் வறண்ட ஏரி மற்றும் குளங்களுக்கு நீர் ஆதாரங்களை மடைமாற்றித் தந்த திட்டம்.",
    impact_en: "1,000+ water bodies replenished in Erode, Tiruppur & Coimbatore",
    impact_ta: "ஈரோடு, திருப்பூர், கோவை மாவட்டங்களில் 1,000-க்கும் மேற்பட்ட நீர்நிலைகள் நிரப்பப்பட்டன",
    image: "/eps_athikadavu_avinashi.jpg",
    source: "PWD Water Resources"
  },
  {
    id: 25,
    name_en: "Infrastructure Expressway Network",
    name_ta: "பெருவழி உள்கட்டமைப்பு சாலைகள்",
    year: 2018,
    era_en: "EPS",
    era_ta: "இ.பி.எஸ்",
    category_en: "Infrastructure",
    category_ta: "சட்டமன்றம் & தேர்தல்",
    people_en: "Families",
    people_ta: "குடும்பங்கள்",
    type_en: "Project",
    type_ta: "திட்டம்",
    served_en: "Tamil Nadu public & trade logistics",
    served_ta: "தமிழக பொதுமக்கள் & வர்த்தகப் போக்குவரத்து",
    did_en: "Constructed extensive multi-lane bypass flyovers and highways to connect major economic centres.",
    did_ta: "மாநிலத்தின் போக்குவரத்து வேகத்தை அதிகரிக்க மேம்பாலங்கள் மற்றும் நான்கு வழிச் சாலைகள் அமைக்கப்பட்டன.",
    impact_en: "10,000+ km of state highways widened",
    impact_ta: "10,000 கிலோமீட்டருக்கும் அதிகமான மாநில நெடுஞ்சாலைகள் விரிவுபடுத்தப்பட்டன",
    image: "/eps_expressways.jpg",
    source: "Highways & Ports Dept"
  },
  {
    id: 51,
    name_en: "Single-Window Clearance System for Industries",
    name_ta: "தொழில் தொடங்க ஒற்றைச் சாளர அனுமதி",
    year: 2018,
    era_en: "EPS",
    era_ta: "இ.பி.எஸ்",
    category_en: "Economy & Industry",
    category_ta: "தொழில் வளர்ச்சி & முதலீடு",
    people_en: "Entrepreneurs & Investors",
    people_ta: "தொழில்முனைவோர் & முதலீட்டாளர்கள்",
    type_en: "Ease of Doing Business",
    type_ta: "தொழில் துறை சாதனை",
    served_en: "Industrialists & Job Seekers",
    served_ta: "தொழிலதிபர்கள் & வேலைதேடும் இளைஞர்கள்",
    did_en: "Implemented digital single-window portal providing fast-track business approvals within stipulated timelines.",
    did_ta: "தொழில்முனைவோருக்கு தேவையான அனைத்து துறை அனுமதிகளையும் விரைவாக வழங்க டிஜிட்டல் ஒற்றைச் சாளர இணையதளத்தை அமைத்தார்.",
    impact_en: "Secured over ₹3 Lakh Crore investments creating lakhs of employment opportunities",
    impact_ta: "ரூ.3 லட்சம் கோடிக்கும் அதிகமான தொழில் முதலீடுகளை ஈர்த்து இளைஞர்களுக்கு வேலைவாய்ப்பு அளித்தது",
    image: "/eps_single_window_clearance.jpg",
    source: "Guidance Tamil Nadu & Industries Dept"
  },
  {
    id: 26,
    name_en: "Global Investors Meet (GIM)",
    name_ta: "உலக முதலீட்டாளர்கள் மாநாடு",
    year: 2015,
    era_en: "Amma",
    era_ta: "அம்மா",
    category_en: "Economy",
    category_ta: "சட்டமன்றம் & தேர்தல்",
    people_en: "Entrepreneurs",
    people_ta: "தொழில்முனைவோர்",
    type_en: "Achievement",
    type_ta: "சாதனை",
    served_en: "State economy & skilled youth",
    served_ta: "மாநிலப் பொருளாதாரம் & இளைஞர்கள்",
    did_en: "Hosted global investor summits to attract multinational industrial investments to Tamil Nadu.",
    did_ta: "தமிழகத்திற்கு பெருமளவு தொழில் முதலீடுகளை ஈர்க்க உலக முதலீட்டாளர்கள் மாநாடு நடத்தப்பட்டது.",
    impact_en: "Attracted Rs 2.4 Lakh Crore investments creating 10 Lakh jobs",
    impact_ta: "ரூ.2.4 லட்சம் கோடி முதலீடுகள் ஈர்க்கப்பட்டு 10 லட்சம் வேலைவாய்ப்புகள் உருவாயின",
    image: "/amma_gim_investors.jpg",
    source: "Industries Dept Report"
  },
  {
    id: 27,
    name_en: "Amma Packaged Drinking Water (Amma Kudineer)",
    name_ta: "அம்மா குடிநீர் திட்டம்",
    year: 2013,
    era_en: "Amma",
    era_ta: "அம்மா",
    category_en: "Welfare",
    category_ta: "சுகாதாரம் & நலத்திட்டங்கள்",
    people_en: "Families",
    people_ta: "குடும்பங்கள்",
    type_en: "Project",
    type_ta: "திட்டம்",
    served_en: "Public & Long-distance travellers",
    served_ta: "பொதுமக்கள் & தொலைதூரப் பயணிகள்",
    did_en: "Offered safe packaged purified mineral water at highly subsidized rate (Rs 10 per bottle).",
    did_ta: "ஏழை எளிய மக்களுக்கு தூய்மையான குடிநீர் ஒரு லிட்டர் 10 ரூபாய்க்கு கிடைக்கச் செய்த திட்டம்.",
    impact_en: "Benefited lakhs of bus travelers daily across state depots",
    impact_ta: "தினசரி லட்சக்கணக்கான பேருந்துப் பயணிகள் பயனடைந்தனர்",
    image: "/amma_kudineer_water.jpg",
    source: "Transport Corporation Records"
  },
  {
    id: 28,
    name_en: "Amma Salt Initiative",
    name_ta: "அம்மா உப்புத் திட்டம்",
    year: 2014,
    era_en: "Amma",
    era_ta: "அம்மா",
    category_en: "Welfare",
    category_ta: "சுகாதாரம் & நலத்திட்டங்கள்",
    people_en: "Families",
    people_ta: "குடும்பங்கள்",
    type_en: "Project",
    type_ta: "திட்டம்",
    served_en: "Common households",
    served_ta: "சாதாரண நுகர்வோர்",
    did_en: "Launched double-fortified essential salt at highly subsidized rates to combat iodine deficiency.",
    did_ta: "சத்து குறைபாட்டை போக்க தரமான உப்பு மலிவு விலையில் நியாயவிலைக் கடைகள் மூலம் வழங்கப்பட்டது.",
    impact_en: "Supplied affordable salt to millions of low-income kitchens",
    impact_ta: "மலிவு விலையில் கோடிக்கணக்கான ஏழை எளிய குடும்பங்களுக்கு வழங்கப்பட்டது",
    image: "/amma_salt_initiative.jpg",
    source: "Salt Corporation Data"
  },
  {
    id: 29,
    name_en: "Free Uniforms & School Bags",
    name_ta: "விலையில்லா சீருடை & பள்ளிப் பை",
    year: 2011,
    era_en: "Amma",
    era_ta: "அம்மா",
    category_en: "Education",
    category_ta: "கல்வி",
    people_en: "Students",
    people_ta: "மாணவர்கள்",
    type_en: "Scheme",
    type_ta: "திட்டம்",
    served_en: "Government school students",
    served_ta: "அரசுப் பள்ளி மாணவர்கள்",
    did_en: "Distributed four sets of uniforms and sturdy school bags to all school students.",
    did_ta: "அரசுப் பள்ளியில் பயிலும் அனைத்து மாணவர்களுக்கும் நான்கு ஜோடி சீருடைகள் மற்றும் பள்ளிப் பைகள் வழங்கப்பட்டன.",
    impact_en: "Encouraged enrollment for rural poor children",
    impact_ta: "கிராமப்புற ஏழை எளிய மாணவர்களின் பள்ளிச் சேர்க்கையை அதிகரித்தது",
    image: "/amma_free_uniforms_bags.jpg",
    source: "School Education Directorate"
  },
  {
    id: 30,
    name_en: "Free Footwear Distribution",
    name_ta: "விலையில்லா காலணிகள் வழங்கும் திட்டம்",
    year: 2011,
    era_en: "Amma",
    era_ta: "அம்மா",
    category_en: "Education",
    category_ta: "கல்வி",
    people_en: "Students",
    people_ta: "மாணவர்கள்",
    type_en: "Scheme",
    type_ta: "திட்டம்",
    served_en: "School students",
    served_ta: "அரசுப் பள்ளி மாணவர்கள்",
    did_en: "Distributed free shoes and socks to government school students to ensure health and hygiene.",
    did_ta: "அரசுப் பள்ளி மாணவர்களின் உடல்நலம் மற்றும் பாதுகாப்பிற்காக விலையில்லா காலணிகள் வழங்கப்பட்டன.",
    impact_en: "Prevented soil-borne diseases for rural children",
    impact_ta: "கிராமப்புற குழந்தைகள் மண் மூலம் பரவும் நோய்களிலிருந்து பாதுகாக்கப்பட்டனர்",
    image: "/amma_free_footwear.jpg",
    source: "School Education Dept"
  },

  {
    id: 33,
    name_en: "Amma Baby Care Kits",
    name_ta: "அம்மா மகப்பேறு சஞ்சீவிப் பெட்டகம்",
    year: 2015,
    era_en: "Amma",
    era_ta: "அம்மா",
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
    image: "/amma_maternal_sanjeevi.jpg",
    source: "Integrated AYUSH Systems"
  }
];

// ─── BEHIND THE NUMBERS ARE PEOPLE (AUTO-SLIDING IMPACT STORIES COMPONENT) ───
function ImpactStoriesSlider({ language }) {
  const [activeIdx, setActiveIdx] = React.useState(0);

  const STORIES = [
    {
      label_en: 'THE STUDENT',
      label_ta: 'மாணவர்',
      quote_en: 'Empowered with free laptops, higher education fee waivers, and specialized training to achieve professional excellence.',
      quote_ta: 'விலையில்லா மடிக்கணினி, உயர்கல்வி கட்டணத் தள்ளுபடி மற்றும் சிறப்புத் தொழிற்பயிற்சிகளால் எதிர்காலம் பிரகாசித்த மாணவர்.'
    },
    {
      label_en: 'THE WOMAN',
      label_ta: 'பெண்மணி',
      quote_en: 'Gained economic independence, subsidized two-wheeler mobility, and social security through self-help groups.',
      quote_ta: 'சுயஉதவிக் குழுக்கள், மானிய விலை இருசக்கர வாகனம் மற்றும் தாலிக்கு தங்கம் திட்டத்தால் சமூகப் பாதுகாப்பு பெற்ற பெண்மணி.'
    },
    {
      label_en: 'THE FARMER',
      label_ta: 'விவசாயி',
      quote_en: 'Protected with ₹12,110 Cr crop loan waivers, Cauvery delta protection, and 24x7 free agricultural power supply.',
      quote_ta: '₹12,110 கோடி பயிர்க்கடன் தள்ளுபடி, பாதுகாக்கப்பட்ட வேளாண் மண்டலம் மற்றும் இலவச மின்சாரத்தால் வாழ்வு மலர்ந்த விவசாயி.'
    },
    {
      label_en: 'THE PATIENT',
      label_ta: 'நோயாளி',
      quote_en: 'Received life-saving specialized medical treatment and surgeries through world-class government health insurance.',
      quote_ta: 'முதலமைச்சரின் விரிவான மருத்துவக் காப்பீட்டுத் திட்டம் மூலம் உயர் ரக மருத்துவ சிகிச்சை இலவசமாகப் பெற்ற நோயாளி.'
    },
    {
      label_en: 'THE FAMILY',
      label_ta: 'ஏழை எளிய குடும்பங்கள்',
      quote_en: 'Ensured daily food security through Amma Canteens, public distribution, and essential household welfare support.',
      quote_ta: 'அம்மா உணவகம், விலையில்லா அரிசி மற்றும் நியாயவிலைக் கடைகள் மூலம் பசியின்றி பாதுகாக்கப்பட்ட ஏழை குடும்பங்கள்.'
    }
  ];

  // Automatic sliding every 4 seconds
  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx(prev => (prev + 1) % STORIES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [STORIES.length]);

  return (
    <section className="p-8 sm:p-10 rounded-3xl bg-slate-950/80 border border-white/10 backdrop-blur-md space-y-6 shadow-2xl relative overflow-hidden">
      <div className="text-center space-y-1">
        <span className="text-3xs font-black text-amber-400 tracking-widest uppercase">BEHIND THE NUMBERS ARE PEOPLE</span>
        <h3 className="text-xl sm:text-2xl font-black text-white uppercase">
          {language === 'English' ? 'IMPACT STORIES' : 'நம்பிக்கை தரும் மனிதர்களின் கதைகள்'}
        </h3>
      </div>

      <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-emerald-500/20 min-h-[170px] flex flex-col justify-between gap-5 relative overflow-hidden shadow-inner">
        {/* Decorative Quote Marks */}
        <div className="absolute top-2 left-4 text-4xl font-serif text-amber-400/20 pointer-events-none select-none">“</div>
        <div className="absolute bottom-2 right-4 text-4xl font-serif text-amber-400/20 pointer-events-none select-none">”</div>

        {STORIES.map((story, idx) => (
          activeIdx === idx && (
            <div key={idx} className="space-y-3 text-center animate-fadeIn">
              <span className="inline-block px-4 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-3xs font-black text-amber-400 tracking-widest uppercase shadow-sm">
                {language === 'English' ? story.label_en : story.label_ta}
              </span>
              <p className="text-base sm:text-lg font-extrabold text-white leading-relaxed max-w-2xl mx-auto drop-shadow-md">
                "{language === 'English' ? story.quote_en : story.quote_ta}"
              </p>
            </div>
          )
        ))}

        {/* Controls Bar: Prev Button < | Indicator Pills | Next Button > */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setActiveIdx(prev => (prev > 0 ? prev - 1 : STORIES.length - 1))}
            className="w-8 h-8 rounded-full bg-slate-955 border border-white/20 hover:border-amber-400 text-amber-400 flex items-center justify-center transition active:scale-95 shadow"
            title="Previous Story"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {STORIES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${activeIdx === idx ? 'w-7 bg-amber-400 shadow-[0_0_8px_#fbbf24]' : 'w-2 bg-slate-700 hover:bg-slate-500'}`}
            />
          ))}

          <button
            onClick={() => setActiveIdx(prev => (prev < STORIES.length - 1 ? prev + 1 : 0))}
            className="w-8 h-8 rounded-full bg-slate-955 border border-white/20 hover:border-amber-400 text-amber-400 flex items-center justify-center transition active:scale-95 shadow"
            title="Next Story"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
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
  );
}

// ─── TOP HERO 3-SLIDE AUTO-SLIDING BANNER (ROW 0 WITH RALLY BACKGROUND) ───
function TopHeroTripleSlider({ language, typedSchemesTitle, schemesTitleTypingDone, setSchemesTypeFilter }) {
  const [activeSlide, setActiveSlide] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  // Pure automatic slide transition every 5 seconds
  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % 2);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const stats = [
    { label_en: 'Students supported', label_ta: 'கல்வி நிதியுதவி பெற்ற மாணவர்கள்', value: '50 LAKH+' },
    { label_en: 'Medical / infrastructure projects', label_ta: 'மருத்துவ & கட்டமைப்புத் திட்டங்கள்', value: '75+' },
    { label_en: 'Women beneficiaries', label_ta: 'பயனடைந்த மகளிர்', value: '1 CRORE+' },
    { label_en: 'Water bodies restored', label_ta: 'தூர்வாரிப் புதுப்பிக்கப்பட்ட நீர்நிலைகள்', value: '6,000+' },
    { label_en: 'Investment value attracted', label_ta: 'ஈர்க்கப்பட்ட தொழில் முதலீடுகள்', value: '₹2.4 LAKH CR' },
    { label_en: 'Farmers / families supported', label_ta: 'பயனடைந்த விவசாயக் குடும்பங்கள்', value: '40 LAKH+' }
  ];

  return (
    <section
      className="relative w-full min-h-[520px] flex flex-col justify-between px-4 md:px-8 py-8 bg-no-repeat bg-cover bg-center transition-all duration-700 overflow-hidden"
      style={{
        backgroundImage: 'linear-gradient(rgba(4, 52, 23, 0.62), rgba(2, 32, 14, 0.76)), url("/rally_bg.jpg")',
      }}
    >
      {/* Slide Content Area */}
      <div className="w-full max-w-6xl mx-auto my-auto py-6 z-10 min-h-[380px] flex items-center justify-center">

        {/* SLIDE 0: MAIN HERO TITLE & INTRO */}
        {activeSlide === 0 && (
          <div className="animate-fadeIn max-w-4xl mx-auto text-center space-y-5">
            <div className="space-y-4">
              <h1 className={`font-black text-white tracking-tight leading-tight uppercase drop-shadow-2xl flex items-center justify-center ${language === 'English' ? 'text-2xl sm:text-4xl md:text-5xl lg:text-6xl min-h-[50px] sm:min-h-[90px]' : 'text-xl sm:text-2xl md:text-3xl lg:text-4xl min-h-[60px] sm:min-h-[80px]'}`} style={{ whiteSpace: 'pre-wrap' }}>
                <span>{typedSchemesTitle}</span>
                {!schemesTitleTypingDone && (
                  <span className="inline-block ml-1 w-1 h-8 sm:h-12 bg-emerald-400 animate-pulse">|</span>
                )}
              </h1>
            </div>

            {schemesTitleTypingDone && (
              <div className="space-y-4">
                <span className="inline-block px-4 py-1 rounded-full bg-amber-400/10 border border-amber-400/25 text-3xs font-black tracking-widest text-amber-400 uppercase animate-slideRevealLeft delay-150">
                  {language === 'English' ? 'SCHEMES & ACHIEVEMENTS' : 'திட்டங்கள் & சாதனைகள்'}
                </span>

                <div className={`max-w-2xl mx-auto space-y-2 text-slate-350 font-medium leading-relaxed animate-slideRevealLeft delay-450 ${language === 'English' ? 'text-xs sm:text-sm md:text-base' : 'text-3xs sm:text-2xs md:text-xs'}`}>
                  <p>
                    {language === 'English'
                      ? "From pioneering nutrition and education programs to healthcare, infrastructure, and rural development, AIADMK governments across different eras have introduced schemes addressing the changing needs of Tamil Nadu."
                      : "சத்துணவு, கல்வி, சுகாதாரம், உள்கட்டமைப்பு மற்றும் விவசாயத் துறை எனப் பல்வேறு துறைகளில், அதிமுக அரசு தமிழக மக்களின் தேவைகளை உடனுக்குடன் பூர்த்தி செய்யும் முன்னோடித் திட்டங்களைச் செயல்படுத்தி வந்துள்ளது."}
                  </p>
                </div>

                <div className="flex flex-wrap justify-center items-center gap-3 pt-2 text-xs font-black tracking-widest uppercase text-white animate-slideRevealLeft delay-750">
                  <span className="px-5 py-2 rounded-xl btn-mgr-flag transition duration-300">{language === 'English' ? 'MGR' : 'எம்.ஜி.ஆர்'}</span>
                  <span className="text-amber-400 font-normal">•</span>
                  <span className="px-5 py-2 rounded-xl btn-amma-flag transition duration-300">{language === 'English' ? 'AMMA' : 'அம்மா'}</span>
                  <span className="text-amber-400 font-normal">•</span>
                  <span className="px-5 py-2 rounded-xl btn-eps-flag transition duration-300">{language === 'English' ? 'EPS' : 'இ.பி.எஸ்'}</span>
                </div>

                <p className="text-xs font-black uppercase text-slate-400 tracking-wider animate-slideRevealLeft delay-750">
                  {language === 'English' ? 'Explore the initiatives. Discover the achievements. Understand the impact.' : 'திட்டங்களை ஆராயுங்கள். சாதனைகளைக் கண்டறியுங்கள். தாக்கத்தைப் புரிந்து கொள்ளுங்கள்.'}
                </p>

                <div className="pt-2 flex flex-wrap justify-center gap-4 animate-slideRevealLeft delay-1050">
                  <button
                    onClick={() => {
                      setSchemesTypeFilter('Scheme');
                      document.getElementById('schemes-database-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`px-6 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-black uppercase tracking-widest hover:from-emerald-500 hover:to-emerald-600 shadow-xl active:scale-95 transition-all duration-300 animate-bounce ${language === 'English' ? 'text-xs' : 'text-3xs sm:text-2xs'}`}
                  >
                    {language === 'English' ? 'EXPLORE SCHEMES' : 'திட்டங்களை ஆராயுங்கள்'}
                  </button>
                  <button
                    onClick={() => {
                      setSchemesTypeFilter('Achievement');
                      document.getElementById('schemes-database-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`px-6 py-3 rounded-full bg-slate-900 border border-white/10 hover:border-white/20 text-amber-400 hover:text-amber-300 font-black uppercase tracking-widest active:scale-95 transition-all ${language === 'English' ? 'text-xs' : 'text-3xs sm:text-2xs'}`}
                  >
                    {language === 'English' ? 'EXPLORE ACHIEVEMENTS' : 'சாதனைகளை ஆராயுங்கள்'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SLIDE 1: NUMBERS THAT TELL THE STORY */}
        {activeSlide === 1 && (
          <div className="animate-fadeIn w-full space-y-6">
            <div className="text-center space-y-1">
              <span className="text-3xs font-black text-amber-500 tracking-widest uppercase block">NUMBERS THAT TELL THE STORY</span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
                {language === 'English' ? 'IMPACT AT A GLANCE' : 'ஒரே பார்வையில் சாதனைகளின் தாக்கம்'}
              </h2>
              <p className="text-xs text-slate-400 uppercase font-black">
                {language === 'English' ? 'Figures verified from state archive databases.' : 'அரசு ஆவணங்கள் மற்றும் தரவுகளின் அடிப்படையில் சரிபார்க்கப்பட்டது.'}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto pt-2">
              {stats.map((stat, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-950/85 border border-white/10 text-center space-y-2 hover:border-amber-400/40 transition shadow-lg">
                  <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono tracking-tight block">{stat.value}</span>
                  <span className="text-3xs font-bold text-slate-300 uppercase block tracking-wider leading-relaxed">
                    {language === 'English' ? stat.label_en : stat.label_ta}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── ERA SCHEME AUTO-SLIDING ROW COMPONENT ───
// ─── 3D COVERFLOW ERA CAROUSEL COMPONENT (AIADMK OFFICIAL WEBPAGE 3D EFFECT) ───
function EraRowSlider({ eraKey, eraTitle_en, eraTitle_ta, eraSubtitle_en, eraSubtitle_ta, eraBadgeColor, schemes, language }) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  // Automatic sliding every 3.5 seconds
  React.useEffect(() => {
    const totalSchemes = schemes?.length || 0;
    if (isPaused || totalSchemes === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % totalSchemes);
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused, schemes?.length]);

  if (!schemes || schemes.length === 0) return null;

  const total = schemes.length;

  return (
    <div
      className="space-y-6 py-8 border-b border-white/10 last:border-0 w-full overflow-hidden"
    >
      {/* Era Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2">
        <div className="flex items-center gap-3">
          <span className={`px-4 py-1.5 rounded-full bg-gradient-to-r ${eraBadgeColor} text-white font-mono text-xs font-black uppercase tracking-widest shadow-lg flex items-center gap-2`}>
            <span>{eraKey} ERA</span>
          </span>
          <div>
            <h4 className="text-base sm:text-lg md:text-xl font-black text-white uppercase tracking-tight">
              {language === 'English' ? eraTitle_en : eraTitle_ta}
            </h4>
            <span className="text-3xs font-mono font-bold text-amber-400 uppercase tracking-wider block">
              {language === 'English' ? eraSubtitle_en : eraSubtitle_ta}
            </span>
          </div>
        </div>

        {/* Counter */}
        <div className="flex items-center gap-3 self-end sm:self-center">
          <span className="text-2xs font-mono text-slate-400 uppercase tracking-widest">
            {currentIndex + 1} / {schemes.length}
          </span>
        </div>
      </div>

      {/* 3D COVERFLOW STAGE */}
      <div className="relative w-full h-[420px] sm:h-[480px] md:h-[520px] flex items-center justify-center perspective-[1200px] overflow-hidden py-4">
        {schemes.map((item, idx) => {
          let offset = idx - currentIndex;
          if (offset < -Math.floor(total / 2)) offset += total;
          if (offset > Math.floor(total / 2)) offset -= total;

          const isCenter = offset === 0;
          const absOffset = Math.abs(offset);

          if (absOffset > 2) return null;

          const eraLeaderTag = item.era_en === 'MGR'
            ? (language === 'English' ? "PURATCHI THALAIVAR MGR'S LANDMARK INITIATIVE" : "புரட்சித்தலைவரின் சாதனைகள்")
            : item.era_en === 'Amma'
              ? (language === 'English' ? "PURATCHI THALAIVI AMMA'S LANDMARK INITIATIVE" : "புரட்சித்தலைவியின் சாதனைகள்")
              : (language === 'English' ? "HON'BLE EPS'S LANDMARK INITIATIVE" : "மாண்புமிகு எடப்பாடியாரின் சாதனைகள்");

          const defaultImage = item.image || (
            item.era_en === 'MGR' ? '/mgr_speech_1977.jpg'
              : item.era_en === 'Amma' ? '/amma_oath_2016.jpg'
                : '/eps_2023_gs.jpg'
          );

          let translateX = '0%';
          let rotateY = '0deg';
          let scale = 1;
          let zIndex = 30;
          let opacity = 1;

          if (offset === -1) {
            translateX = '-55%';
            rotateY = '28deg';
            scale = 0.82;
            zIndex = 20;
            opacity = 0.65;
          } else if (offset === 1) {
            translateX = '55%';
            rotateY = '-28deg';
            scale = 0.82;
            zIndex = 20;
            opacity = 0.65;
          } else if (offset === -2) {
            translateX = '-95%';
            rotateY = '40deg';
            scale = 0.68;
            zIndex = 10;
            opacity = 0.35;
          } else if (offset === 2) {
            translateX = '95%';
            rotateY = '-40deg';
            scale = 0.68;
            zIndex = 10;
            opacity = 0.35;
          }

          return (
            <div
              key={item.id || idx}
              onClick={() => setCurrentIndex(idx)}
              className="absolute w-[88%] sm:w-[70%] max-w-[680px] h-[380px] sm:h-[440px] md:h-[480px] rounded-3xl overflow-hidden cursor-pointer transition-all duration-700 ease-out border-4 border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.8)] bg-slate-950 flex flex-col justify-between"
              style={{
                transform: `translateX(${translateX}) rotateY(${rotateY}) scale(${scale})`,
                zIndex: zIndex,
                opacity: opacity,
                transformStyle: 'preserve-3d',
                boxShadow: isCenter ? '0 0 35px rgba(251,191,36,0.3), 0 20px 50px rgba(0,0,0,0.9)' : '0 10px 30px rgba(0,0,0,0.7)',
                borderColor: isCenter ? 'rgba(251,191,36,0.8)' : 'rgba(255,255,255,0.2)',
              }}
            >
              {/* Poster Image */}
              <div className="relative w-full h-full overflow-hidden">
                <img
                  src={defaultImage}
                  alt={item.name_en}
                  className="w-full h-full object-cover object-center transition-transform duration-1000"
                />

                {/* Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none" />

                {/* Top Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
                  <span className="px-3.5 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/50 text-emerald-400 font-mono text-xs font-black uppercase tracking-wider shadow-lg">
                    {language === 'English' ? item.era_en : item.era_ta} ERA
                  </span>
                  <span className="px-3.5 py-1 rounded-full bg-black/85 border border-amber-400/50 text-amber-400 font-mono text-xs font-black shadow-lg">
                    {item.year}
                  </span>
                </div>

                {/* Content Banner at Bottom of Active Center Card */}
                {isCenter && (
                  <div className="absolute bottom-0 inset-x-0 p-5 sm:p-7 space-y-2 z-10 bg-gradient-to-t from-black via-black/90 to-transparent animate-fadeIn">
                    <span className="text-3xs font-mono font-black text-amber-400 uppercase tracking-widest block">
                      {eraLeaderTag} • {item.served_en || item.served_ta}
                    </span>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white leading-tight uppercase drop-shadow-md">
                      {language === 'English' ? item.name_en : item.name_ta}
                    </h3>
                    <p className="text-slate-200 text-xs sm:text-sm font-medium line-clamp-2 leading-relaxed">
                      {language === 'English' ? item.did_en : item.did_ta}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* BOTTOM NAV CONTROLS (MATCHING AIADMK OFFICIAL CAROUSEL CONTROLS) */}
      <div className="flex items-center justify-center gap-4 pt-2 z-20 relative">
        <button
          onClick={() => setCurrentIndex(prev => (prev > 0 ? prev - 1 : total - 1))}
          className="w-10 h-10 rounded-full bg-slate-950/90 border border-white/20 hover:border-amber-400 text-amber-400 hover:bg-slate-900 flex items-center justify-center transition active:scale-95 shadow-xl"
          title="Previous Scheme"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Center Circular Auto-Play / Pause Button Indicator (Exact match to official site) */}
        <button
          onClick={() => setIsPaused(prev => !prev)}
          className={`w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all duration-300 shadow-xl ${isPaused
            ? 'bg-slate-950/90 border-slate-500 text-slate-400'
            : 'bg-amber-400 text-slate-950 border-white shadow-[0_0_15px_#fbbf24] scale-105'
            }`}
          title={isPaused ? "Resume Auto-Slide" : "Pause Auto-Slide"}
        >
          {isPaused ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 12a8 8 0 018-8v0a8 8 0 018 8v0a8 8 0 01-8 8v0a8 8 0 01-8-8z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v4" />
            </svg>
          )}
        </button>

        <button
          onClick={() => setCurrentIndex(prev => (prev + 1) % total)}
          className="w-10 h-10 rounded-full bg-slate-950/90 border border-white/20 hover:border-amber-400 text-amber-400 hover:bg-slate-900 flex items-center justify-center transition active:scale-95 shadow-xl"
          title="Next Scheme"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Progress Dots */}
      <div className="flex items-center justify-center gap-1.5 pt-1">
        {schemes.map((s, idx) => (
          <button
            key={s.id || idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex
              ? 'w-8 bg-amber-400 shadow-[0_0_8px_#fbbf24]'
              : 'w-2 bg-white/20 hover:bg-white/50'
              }`}
            title={s.name_en}
          />
        ))}
      </div>
    </div>
  );
}

// ─── INTERACTIVE TAMIL NADU GRAPHIC MAP COMPONENT ───
function TamilNaduSvgMap({
  selectedDistrict,
  onSelectDistrict,
  language,
  constituencyData,
  TN_DISTRICT_REGIONS,
  selectedRegionFilter,
  searchQuery
}) {
  const [hoveredDistrict, setHoveredDistrict] = useState(null);

  const districtMapNodes = [
    // Northern Region
    { id: 'Chennai', top: 11, left: 88 },
    { id: 'Thiruvallur', top: 7, left: 82 },
    { id: 'Kanchipuram', top: 20, left: 85 },
    { id: 'Chengalpattu', top: 25, left: 82 },
    { id: 'Ranipet', top: 16, left: 66 },
    { id: 'Vellore', top: 16, left: 64 },
    { id: 'Tirupathur', top: 22, left: 55 },
    { id: 'Krishnagiri', top: 18, left: 44 },
    { id: 'Dharmapuri', top: 31, left: 45 },
    { id: 'Thiruvannamalai', top: 25, left: 67 },
    { id: 'Villupuram', top: 35, left: 66 },
    { id: 'Kallakurichi', top: 37, left: 58 },
    { id: 'Cuddalore', top: 42, left: 75 },

    // Western Region (Kongu)
    { id: 'Salem', top: 36, left: 45 },
    { id: 'Erode', top: 39, left: 28 },
    { id: 'Nilgiris', top: 39, left: 13 },
    { id: 'Coimbatore', top: 52, left: 18 },
    { id: 'Tiruppur', top: 53, left: 30 },
    { id: 'Namakkal', top: 46, left: 45 },

    // Central & Delta Region
    { id: 'Karur', top: 55, left: 43 },
    { id: 'Perambalur', top: 47, left: 63 },
    { id: 'Ariyalur', top: 50, left: 72 },
    { id: 'Mayiladuthurai', top: 48, left: 80 },
    { id: 'Tiruchirappalli', top: 56, left: 57 },
    { id: 'Thanjavur', top: 59, left: 70 },
    { id: 'Tiruvarur', top: 60, left: 81 },
    { id: 'Nagapattinam', top: 51, left: 88 },
    { id: 'Pudukkottai', top: 66, left: 61 },

    // Southern Region
    { id: 'Dindigul', top: 64, left: 38 },
    { id: 'Theni', top: 71, left: 28 },
    { id: 'Madurai', top: 73, left: 41 },
    { id: 'Sivagangai', top: 73, left: 57 },
    { id: 'Virudhunagar', top: 81, left: 38 },
    { id: 'Ramanathapuram', top: 79, left: 50 },
    { id: 'Tenkasi', top: 88, left: 29 },
    { id: 'Tirunelveli', top: 92, left: 29 },
    { id: 'Thoothukudi', top: 89, left: 41 },
    { id: 'Kanniyakumari', top: 97, left: 29 }
  ];

  return (
    <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center select-none py-2">

      {/* GRAPHIC MAP CANVAS CONTAINER WITH VECTOR SILHOUETTE MAP ASSET */}
      <div className="relative w-full max-w-[850px] h-[720px] sm:h-[820px] flex items-center justify-center rounded-[3rem] overflow-hidden p-6 bg-slate-950/90 border border-amber-400/30 backdrop-blur-xl shadow-[0_0_60px_rgba(245,158,11,0.25)] group">

        {/* Ambient Radar Scanner Beam Overlay Animation */}
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 via-transparent to-emerald-500/5 opacity-40 pointer-events-none animate-pulse"></div>

        {/* High-Definition Tamil Nadu Vector Map Silhouette */}
        <img
          src="/tamilnadu_map.png"
          alt="Tamil Nadu Political Vector Map"
          className="w-full h-full object-contain filter drop-shadow-[0_0_40px_rgba(245,158,11,0.45)] opacity-95 transition-all duration-700 group-hover:scale-[1.02]"
        />

        {/* INTERACTIVE DISTRICT HOTSPOT DOT BEACONS */}
        {districtMapNodes.map((node) => {
          const meta = TN_DISTRICT_REGIONS[node.id] || { region: 'North' };
          const constList = constituencyData[node.id]?.constituencies || [];
          const isSelected = selectedDistrict === node.id;
          const isHovered = hoveredDistrict === node.id;

          const matchesRegion = selectedRegionFilter === 'All' || meta.region === selectedRegionFilter;
          const matchesSearch = !searchQuery || node.id.toLowerCase().includes(searchQuery.toLowerCase()) || (constituencyData[node.id]?.ta || '').includes(searchQuery);
          const isDimmed = !matchesRegion || !matchesSearch;

          return (
            <div
              key={node.id}
              style={{ top: `${node.top}%`, left: `${node.left}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 z-20 flex items-center justify-center ${isDimmed ? 'opacity-20 scale-75' : 'opacity-100 scale-100 hover:scale-150'}`}
              onClick={() => onSelectDistrict(node.id)}
              onMouseEnter={() => setHoveredDistrict(node.id)}
              onMouseLeave={() => setHoveredDistrict(null)}
            >
              {/* Pulsing Highlight Ring Animation */}
              {(isSelected || isHovered) && (
                <div className="absolute inset-0 -m-3 rounded-full border-2 border-amber-400 animate-ping opacity-85"></div>
              )}

              {/* Glowing Map Dot Beacon */}
              <div
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full transition-all duration-300 shadow-2xl flex items-center justify-center ${isSelected ? 'bg-amber-400 ring-4 ring-amber-400/60 scale-125 shadow-[0_0_25px_#fbbf24]' : isHovered ? 'bg-emerald-400 ring-4 ring-emerald-300/80 scale-125 shadow-[0_0_20px_#34d399]' : 'bg-amber-400/90 border-2 border-slate-950 shadow-[0_0_12px_rgba(251,191,36,0.85)]'}`}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-slate-950"></div>
              </div>
            </div>
          );
        })}

        {/* FLOATING HOVER TOOLTIP BANNER WITH ENTRANCE ANIMATION */}
        {hoveredDistrict && (() => {
          const meta = TN_DISTRICT_REGIONS[hoveredDistrict] || { region: 'North' };
          const constList = constituencyData[hoveredDistrict]?.constituencies || [];
          return (
            <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-slate-900/95 border-2 border-amber-400 backdrop-blur-xl px-7 py-3.5 rounded-2xl shadow-[0_0_40px_rgba(251,191,36,0.5)] text-center pointer-events-none z-40 animate-bounce space-y-0.5">
              <span className="text-3xs font-black text-amber-400 uppercase tracking-widest block">
                {language === 'English' ? `${meta.region} TAMIL NADU` : meta.region_ta}
              </span>
              <h5 className="text-lg font-black text-white uppercase leading-tight tracking-tight">
                {language === 'English' ? hoveredDistrict : (TN_DISTRICT_TAMIL_NAMES[hoveredDistrict] || constituencyData[hoveredDistrict]?.ta || hoveredDistrict)}
              </h5>
              <span className="text-3xs font-black text-emerald-400 uppercase block tracking-wider">
                {constList.length} {language === 'English' ? 'Assembly Seats — Click to View News & Details' : 'சட்டமன்றத் தொகுதிகள்'}
              </span>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

// ─── HERO CAROUSEL COMPONENT WITH DYNAMIC PER-SLIDE TEXT & ANIMATIONS ───
function HeroCarousel({ language, onExploreJourney, onGiveFeedback }) {
  const SLIDES = [
    {
      image: '/admk_leaders_clear.png',
      bgStyle: { backgroundImage: 'url("/admk_leaders_clear.png")', backgroundSize: 'contain', backgroundPosition: 'top center', backgroundRepeat: 'no-repeat' },
      bgGradient: 'linear-gradient(to bottom, #7ac0e6 0%, #ffffff 55%, #f47a20 100%)',
      overlayGradient: 'linear-gradient(to top, #021f0b 0%, rgba(244, 122, 32, 0.95) 45%, transparent 100%)',
      badgeTag: '2K ADMK',
      badgeSub: language === 'English' ? 'THEN. NOW. FOREVER.' : 'அன்றும். இன்றும். என்றும்.',
      slogans: [
        { text: 'நம்மில் ஒருவர்', color: '#f97316' },
        { text: 'நமக்கான தலைவர்', color: '#22c55e' }
      ],
      sloganLine1: 'நம்மில் ஒருவர்',
      sloganLine1Color: '#f97316',
      sloganLine2: 'நமக்கான தலைவர்',
      sloganLine2Color: '#22c55e',
      title: language === 'English' ? "AIADMK IS THE PEOPLE'S CHOICE." : 'அதிமுக - மக்களின் முதன்மைத் தேர்வு.',
      subtitle: language === 'English'
        ? "Born from a people's movement. Built through public service. Carried forward across generations."
        : 'மக்கள் இயக்கமாக பிறந்து, மக்கள் சேவையால் வளர்ந்து, தலைமுறை கடந்து தொடரும் மக்கள் இயக்கம்.',
      pillTag: 'MGR • AMMA • EPS',
      pillSub: language === 'English' ? 'One Movement. One Legacy. One Future.' : 'ஒரே இயக்கம். ஒரே பாரம்பரியம். ஒரே எதிர்காலம்.',
    },
    {
      image: '/hero_slide_2.png',
      bgStyle: { backgroundImage: 'url("/hero_slide_2.png")', backgroundSize: 'cover', backgroundPosition: 'center top', backgroundRepeat: 'no-repeat' },
      imageTransform: 'translateY(-90px) scale(1.15)',
      bgGradient: 'linear-gradient(to bottom, #8b4513 0%, #d2691e 55%, #f47a20 100%)',
      overlayGradient: 'linear-gradient(to top, #021f0b 0%, rgba(139, 69, 19, 0.90) 55%, transparent 100%)',
      badgeTag: 'GOVERNANCE AT HOME',
      badgeSub: language === 'English' ? 'IMPACT BECOMES PERSONAL' : 'மக்களுக்கான நல் ஆட்சி',
      slogans: [
        { text: 'மரபை அறிவோம்', color: '#f59e0b' },
        { text: 'மக்களின் குரலைக்', color: '#10b981' },
        { text: 'கேட்போம்', color: '#10b981' }
      ],
      sloganLine1: 'மரபை அறிவோம்',
      sloganLine1Color: '#f59e0b',
      sloganLine2: 'மக்களின் குரலைக் கேட்போம்',
      sloganLine2Color: '#10b981',
      title: language === 'English' ? 'WHEN GOVERNANCE REACHES HOME.' : 'வீடு தோறும் அரசின் மக்கள் நலன்.',
      subtitle: language === 'English'
        ? 'Policies become meaningful when they make a difference in everyday life — education, women empowerment, & welfare.'
        : 'மக்களின் அன்றாட வாழ்க்கையில் மாற்றம் ஏற்படுத்தும் மக்கள் நலத் திட்டங்கள்.',
      pillTag: 'COURAGE • LEADERSHIP • LEGACY',
      pillSub: language === 'English' ? 'Standing With Every Household' : 'ஒவ்வொரு குடும்பத்துடனும் துணை நிற்போம்',
    },
    {
      image: '/hero_slide_1.jpg',
      bgStyle: { backgroundImage: 'url("/hero_slide_1.jpg")', backgroundSize: 'cover', backgroundPosition: 'center top', backgroundRepeat: 'no-repeat' },
      imageTransform: 'translateY(-70px) scale(1.12)',
      bgGradient: 'linear-gradient(to bottom, #4a7c2f 0%, #8fbc3c 65%, #f47a20 100%)',
      overlayGradient: 'linear-gradient(to top, #021f0b 0%, rgba(74, 124, 47, 0.80) 55%, transparent 100%)',
      badgeTag: '2K GENERATION',
      badgeSub: language === 'English' ? 'BORN INTO CHANGE' : 'எதிர்காலத் தலைமுறை',
      slogans: [
        { text: 'எதிர்காலத்தை', color: '#38bdf8' },
        { text: 'உருவாக்குவோம்', color: '#fbbf24' }
      ],
      sloganLine1: 'எதிர்காலத்தை',
      sloganLine1Color: '#38bdf8',
      sloganLine2: 'உருவாக்குவோம்',
      sloganLine2Color: '#fbbf24',
      title: language === 'English' ? "TAMIL NADU 2031 — WHAT'S NEXT?" : 'தமிழ்நாடு 2031 — அடுத்த கட்டப் பார்வை.',
      subtitle: language === 'English'
        ? 'We respect where the journey began. But our job is to think about where it goes next.'
        : 'கடந்த கால வரலாற்றைப் போற்றுவோம், எதிர்காலத் தமிழகத்தைச் சிறப்பாக உருவாக்குவோம்.',
      pillTag: 'JOBS • TECH • SUSTAINABILITY',
      pillSub: language === 'English' ? 'Building Next Gen Tamil Nadu' : 'எதிர்காலத் தமிழகத்தை உருவாக்குவோம்',
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-advance every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      goToSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  function goToSlide(indexOrUpdater) {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(indexOrUpdater);
      setIsTransitioning(false);
    }, 350);
  }

  function handlePrev() {
    goToSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }

  function handleNext() {
    goToSlide((prev) => (prev + 1) % SLIDES.length);
  }

  const slide = SLIDES[currentSlide];

  return (
    <section
      className="relative w-full h-[96vh] overflow-hidden flex flex-col justify-end select-none"
      style={{ background: slide.bgGradient, transition: 'background 0.8s ease' }}
    >
      {/* Slides: background images with transform and opacity transition */}
      {SLIDES.map((s, idx) => (
        <div
          key={idx}
          className="absolute inset-0 z-0 transition-opacity duration-700 ease-in-out overflow-hidden"
          style={{
            opacity: idx === currentSlide ? (isTransitioning ? 0 : 1) : 0,
            pointerEvents: idx === currentSlide ? 'auto' : 'none',
          }}
        >
          <div
            className="w-full h-full transition-transform duration-700"
            style={{
              ...s.bgStyle,
              transform: s.imageTransform || 'none',
            }}
          />
        </div>
      ))}

      {/* Bottom gradient overlay */}
      <div
        className="absolute inset-x-0 bottom-0 h-[30rem] z-10 transition-all duration-700"
        style={{ background: slide.overlayGradient }}
      />

      {/* Left Arrow */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center shadow-xl backdrop-blur-sm transition hover:scale-110 active:scale-95 border border-white/20"
        aria-label="Previous slide"
      >
        <span className="material-symbols-outlined text-xl font-black">chevron_left</span>
      </button>

      {/* Right Arrow */}
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center shadow-xl backdrop-blur-sm transition hover:scale-110 active:scale-95 border border-white/20"
        aria-label="Next slide"
      >
        <span className="material-symbols-outlined text-xl font-black">chevron_right</span>
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-7 h-2.5 bg-white shadow-lg' : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'}`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Top Slide Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 z-30 bg-white/10">
        <div
          key={currentSlide}
          className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-none shadow-md"
          style={{
            width: '100%',
            animation: 'slideProgress 5s linear infinite',
          }}
        />
      </div>

      {/* ─── DYNAMIC PER-SLIDE TEXT & ACTION BUTTONS WITH STAGGERED ANIMATION ─── */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-6 pb-8 sm:pb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="text-left space-y-3 max-w-3xl">
          {/* Badge Tag */}
          <div
            className={`flex items-center gap-2.5 transition-all duration-500 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
          >
            <span className="px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs uppercase tracking-widest shadow-lg">
              {slide.badgeTag}
            </span>
            <span className="text-sm sm:text-base md:text-lg font-black uppercase tracking-[0.22em] text-slate-950 drop-shadow-[0_2px_6px_rgba(255,255,255,0.8)]">
              {slide.badgeSub}
            </span>
          </div>

          <div
            className={`transition-all duration-500 delay-100 space-y-4 sm:space-y-5 ${isTransitioning ? 'opacity-0 translate-y-6' : 'opacity-100 translate-y-0'}`}
          >
            {/* Dynamic Tamil Slogan Lines */}
            <div className="space-y-2.5 sm:space-y-3.5">
              {slide.slogans ? (
                slide.slogans.map((lineItem, lIdx) => (
                  <p
                    key={lIdx}
                    className="text-3xl sm:text-4xl md:text-5xl font-black drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)] leading-[1.38] tracking-normal"
                    style={{
                      fontFamily: language === 'English' ? "'Space Grotesk', 'Manrope', sans-serif" : "'Noto Sans Tamil', 'Manrope', sans-serif",
                      color: lineItem.color,
                      wordSpacing: '0.18em',
                      letterSpacing: '0.025em'
                    }}
                  >
                    {lineItem.text}
                  </p>
                ))
              ) : (
                <>
                  <p
                    className="text-3xl sm:text-4xl md:text-5xl font-black drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)] leading-[1.38] tracking-normal"
                    style={{
                      fontFamily: language === 'English' ? "'Space Grotesk', 'Manrope', sans-serif" : "'Noto Sans Tamil', 'Manrope', sans-serif",
                      color: slide.sloganLine1Color,
                      wordSpacing: '0.18em',
                      letterSpacing: '0.025em'
                    }}
                  >
                    {slide.sloganLine1}
                  </p>
                  <p
                    className="text-3xl sm:text-4xl md:text-5xl font-black drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)] leading-[1.38] tracking-normal"
                    style={{
                      fontFamily: language === 'English' ? "'Space Grotesk', 'Manrope', sans-serif" : "'Noto Sans Tamil', 'Manrope', sans-serif",
                      color: slide.sloganLine2Color,
                      wordSpacing: '0.18em',
                      letterSpacing: '0.025em'
                    }}
                  >
                    {slide.sloganLine2}
                  </p>
                </>
              )}
            </div>

            {/* Dynamic Title */}
            <h1
              className="text-xl sm:text-3xl md:text-4xl font-black drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)] leading-[1.4] text-white/95 mt-4 pt-3 uppercase tracking-normal"
              style={{
                fontFamily: language === 'English' ? "'Space Grotesk', 'Manrope', sans-serif" : "'Noto Sans Tamil', 'Manrope', sans-serif",
                wordSpacing: '0.18em',
                letterSpacing: '0.025em'
              }}
            >
              {slide.title}
            </h1>

            {/* Dynamic Subtitle */}
            <p
              className="text-sm sm:text-base md:text-lg font-bold text-amber-100 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] max-w-2xl leading-[1.65] mt-3 pt-1"
              style={{ wordSpacing: '0.1em', letterSpacing: '0.01em' }}
            >
              {slide.subtitle}
            </p>
          </div>

          {/* Dynamic Leaders/Focus Pill Tagline */}
          <div className={`mt-4 pt-2 flex flex-wrap items-center gap-2.5 text-xs font-black text-emerald-400 tracking-wider transition-all duration-500 delay-200 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            <span className="bg-slate-950/80 border border-emerald-500/40 px-3 py-1 rounded-lg shadow-md drop-shadow text-xs">
              {slide.pillTag}
            </span>
            <span className="text-slate-200 text-2xs uppercase tracking-widest font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
              {slide.pillSub}
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
}

// ─── SECTION 1: A MOVEMENT BUILT WITH THE PEOPLE ───
function MovementHistorySection({ language, onDiscover }) {
  return (
    <section className="relative py-16 px-6 bg-slate-950 text-white border-y border-emerald-900/40">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
        <div className="space-y-4 max-w-2xl text-left">
          <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-widest">
            {language === 'English' ? '50+ YEARS OF LEGACY' : '50 ஆண்டுகளுக்கும் மேலான வரலாறு'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            {language === 'English' ? 'A MOVEMENT BUILT WITH THE PEOPLE' : 'மக்களோடு கட்டியெழுப்பப்பட்ட இயக்கம்'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            {language === 'English'
              ? 'In 1972, Puratchi Thalaivar MGR began a movement that would become an enduring force in Tamil Nadu politics. What followed was a journey through changing generations, historic mandates, welfare initiatives, political challenges, and different eras of leadership.'
              : '1972-இல் புரட்சித் தலைவர் எம்.ஜி.ஆர் அவர்கள் தொடங்கிய இயக்கம் தமிழ்நாட்டின் அரசியல் வரலாற்றை மாற்றியமைத்தது.'}
          </p>
          <p className="text-xs text-amber-300 font-extrabold">
            {language === 'English'
              ? 'From MGR, through Puratchi Thalaivi Amma, to Edappadi K. Palaniswami, AIADMK\'s story continues to be written alongside the story of Tamil Nadu.'
              : 'எம்.ஜி.ஆர் முதல் புரட்சித் தலைவி அம்மா மற்றும் எடப்பாடியார் வரை அதிமுகவின் வரலாறு தொடர்கிறது.'}
          </p>
          <div className="pt-2">
            <button
              onClick={onDiscover}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-black text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition duration-300 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">history_edu</span>
              <span>{language === 'English' ? 'DISCOVER THE MOVEMENT' : 'வரலாற்றை அறிந்துகொள்ள'}</span>
            </button>
          </div>
        </div>

        <div className="w-full lg:w-96 rounded-3xl overflow-hidden border border-white/15 bg-slate-900/90 shadow-2xl p-4 space-y-3">
          <img src="/mgr_crowd_1972.jpg" onError={(e) => { e.target.src = '/admk_leaders_clear.png'; }} alt="Archival AIADMK" className="w-full h-48 object-cover rounded-2xl border border-white/10" />
          <div className="text-center p-2">
            <span className="text-3xs font-black uppercase tracking-widest text-emerald-400 block">1972 → PRESENT</span>
            <p className="text-2xs text-slate-300 font-bold mt-1">{language === 'English' ? 'Archival AIADMK imagery transitioning across 5 decades' : '5 தசாப்த கால அதிமுக வரலாறு'}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 2: THREE LEADERS. THREE CHAPTERS. (AIADMK FLAG TRI-COLOR: RED, WHITE, BLACK) ───
function ThreeLeadersSection({ language, onExploreLeader }) {
  const LEADERS = [
    {
      id: 'mgr',
      title: language === 'English' ? 'Shri M. G. Ramachandran' : 'புரட்சித் தலைவர் எம்.ஜி.ஆர்',
      years: '1972 – 1987',
      img: '/bjp_style_mgr.jpg',
      bgColor: 'bg-gradient-to-b from-[#991b1b] via-[#7f1d1d] to-[#450a0a]', // AIADMK Red
      titleColor: 'text-white group-hover:text-amber-300',
      yearsColor: 'text-amber-300',
      borderColor: 'border-r border-white/20'
    },
    {
      id: 'amma',
      title: language === 'English' ? 'Selvi J. Jayalalithaa' : 'புரட்சித் தலைவி அம்மா',
      years: '1989 – 2016',
      img: '/bjp_style_amma.jpg',
      bgColor: 'bg-gradient-to-b from-[#ffffff] via-[#f8fafc] to-[#e2e8f0]', // AIADMK White
      titleColor: 'text-slate-950 group-hover:text-emerald-700',
      yearsColor: 'text-emerald-700 font-extrabold',
      borderColor: 'border-r border-slate-300'
    },
    {
      id: 'eps',
      title: language === 'English' ? 'Thiru Edappadi K. Palaniswami' : 'திரு எடப்பாடி கே. பழனிசாமி',
      years: '2017 – Present',
      img: '/bjp_style_eps.jpg',
      bgColor: 'bg-gradient-to-b from-[#1c1917] via-[#0c0a09] to-[#000000]', // AIADMK Black
      titleColor: 'text-white group-hover:text-amber-300',
      yearsColor: 'text-amber-300',
      borderColor: ''
    }
  ];

  return (
    <section className="relative w-full overflow-hidden select-none bg-slate-950 border-y border-emerald-900/30">
      {/* Top Center Banner Header */}
      <div className="py-10 px-6 text-center space-y-2 bg-slate-950 border-b border-white/10">
        <span className="px-4 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-black uppercase tracking-widest">
          {language === 'English' ? 'PILLARS OF AIADMK' : 'கழகத்தின் 3 தூண்கள்'}
        </span>
        <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white drop-shadow-lg">
          {language === 'English' ? 'THREE LEADERS. THREE CHAPTERS.' : 'மூன்று தலைவர்கள். மூன்று அத்தியாயங்கள்.'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-medium">
          {language === 'English' ? 'Discover the iconic leadership eras that shaped Tamil Nadu.' : 'தமிழக வரலாற்றை மாற்றியமைத்த மூன்று மாபெரும் தலைவர்கள்.'}
        </p>
      </div>

      {/* 3 Full-Height Split Column Cards (AIADMK Flag Tri-Color: Red, White, Black) */}
      <div className="grid grid-cols-1 md:grid-cols-3 h-[78vh] min-h-[580px] max-h-[780px] w-full relative">
        {LEADERS.map((leader) => (
          <div
            key={leader.id}
            onClick={() => onExploreLeader(leader.id)}
            className={`relative flex flex-col justify-between pt-10 px-6 sm:px-10 pb-0 ${leader.bgColor} ${leader.borderColor} cursor-pointer group hover:brightness-105 transition-all duration-500 overflow-hidden h-full`}
          >
            {/* Top Text Header (Name & Years) */}
            <div className="relative z-20 space-y-2 text-center">
              <h3 className={`text-2xl sm:text-3xl lg:text-4xl font-black leading-tight tracking-tight drop-shadow-sm transition-colors duration-300 ${leader.titleColor}`}>
                {leader.title}
              </h3>
              <p className={`text-xs sm:text-sm font-bold tracking-[0.25em] uppercase drop-shadow ${leader.yearsColor}`}>
                {leader.years}
              </p>
            </div>

            {/* Full Bleed Cut-Out Portrait Image */}
            <div className="relative w-full flex-1 mt-6 flex items-end justify-center z-10 overflow-hidden">
              <img
                src={leader.img}
                alt={leader.title}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 shadow-2xl"
              />
              {/* Soft bottom blend shadow */}
              <div className={`absolute inset-x-0 bottom-0 h-24 ${leader.id === 'amma' ? 'bg-gradient-to-t from-slate-200/90 to-transparent' : 'bg-gradient-to-t from-slate-950/70 to-transparent'} pointer-events-none`} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── SECTION 3: WHEN GOVERNANCE REACHES HOME (RALLY BG + RIGHT-TO-LEFT SLIDING MARQUEE WITH SCHEME IMAGES) ───
function GovernanceHomeSection({ language, onExploreSchemes }) {
  const HIGHLIGHTS = [
    { title: language === 'English' ? 'EDUCATION' : 'கல்வி', subtitle: language === 'English' ? 'Free laptops, bicycles & school kits for 52L+ students.' : 'இலவச மடிக்கணினி, மிதிவண்டி & கல்வி உபகரணங்கள்.', img: '/amma_free_laptops.jpg', icon: 'school', color: 'border-blue-400/40 bg-slate-900/90' },
    { title: language === 'English' ? 'WOMEN EMPOWERMENT' : 'மகளிர் நலன்', subtitle: language === 'English' ? 'Thaali-ku-Thangam & 12.5L+ maternity benefit beneficiaries.' : 'தாலிக்குத் தங்கம் & மகப்பேறு நிதியுதவித் திட்டங்கள்.', img: '/amma_thaalikku_thangam.jpg', icon: 'diversity_1', color: 'border-amber-400/40 bg-slate-900/90' },
    { title: language === 'English' ? 'HEALTHCARE' : 'மருத்துவம்', subtitle: language === 'English' ? 'Comprehensive Health Insurance covering 1.5 Cr+ families.' : 'முதலமைச்சரின் விரிவான மருத்துவக் காப்பீட்டுத் திட்டம்.', img: '/amma_comprehensive_health_insurance.jpg', icon: 'local_hospital', color: 'border-emerald-400/40 bg-slate-900/90' },
    { title: language === 'English' ? 'SOCIAL WELFARE' : 'சமூக நலன்', subtitle: language === 'English' ? 'Amma Canteens & free public distribution system.' : 'அம்மா உணவகம், இலவச அரிசி & முதியோர் ஓய்வூதியம்.', img: '/amma_public_distribution.jpg', icon: 'family_restroom', color: 'border-purple-400/40 bg-slate-900/90' },
    { title: language === 'English' ? 'AGRICULTURE' : 'விவசாயம்', subtitle: language === 'English' ? 'Kudimaramathu 5,500+ water bodies & farm loan waivers.' : 'குடிமராமத்து நீர் மேலாண்மை & கூட்டுறவு பயிர்க்கடன் தள்ளுபடி.', img: '/eps_kudimaramathu.jpg', icon: 'agriculture', color: 'border-green-400/40 bg-slate-900/90' },
    { title: language === 'English' ? 'INFRASTRUCTURE' : 'உட்கட்டமைப்பு', subtitle: language === 'English' ? 'Expressways, flyovers, power grid & metro expansion.' : 'நெடுஞ்சாலைகள், மேம்பாலங்கள் & மின் திட்டங்கள்.', img: '/eps_expressways.jpg', icon: 'engineering', color: 'border-cyan-400/40 bg-slate-900/90' },
  ];

  // Duplicate for seamless infinite right-to-left loop
  const TICKER_ITEMS = [...HIGHLIGHTS, ...HIGHLIGHTS];

  return (
    <section
      className="relative py-20 px-4 md:px-6 text-white overflow-hidden border-t border-emerald-900/40 bg-no-repeat bg-cover bg-center bg-fixed select-none"
      style={{
        backgroundImage: 'linear-gradient(rgba(2, 28, 10, 0.88), rgba(4, 45, 19, 0.94)), url("/rally_bg.jpg")',
      }}
    >
      <div className="max-w-7xl mx-auto space-y-12 text-center relative z-10">
        {/* Top Header Banner */}
        <div className="space-y-3 max-w-3xl mx-auto">
          <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black uppercase tracking-widest inline-block shadow-lg backdrop-blur-md">
            {language === 'English' ? 'CITIZEN WELFARE IMPACT' : 'நலத்திட்டங்களின் தாக்கம்'}
          </span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white drop-shadow-2xl">
            WHEN GOVERNANCE REACHES HOME
          </h2>
          <p className="text-sm sm:text-base font-black text-amber-400 uppercase tracking-widest drop-shadow-md">
            ITS IMPACT BECOMES PERSONAL.
          </p>
          <p className="text-xs sm:text-sm text-slate-200 font-medium max-w-xl mx-auto leading-relaxed drop-shadow">
            {language === 'English'
              ? 'Policies become meaningful when they make a tangible difference in everyday life — education, healthcare, agriculture & public welfare.'
              : 'மக்களின் அன்றாட வாழ்க்கையில் மாற்றம் ஏற்படுத்தும் போதுதான் நல் ஆட்சி சாத்தியமாகிறது.'}
          </p>
        </div>

        {/* ─── RIGHT-TO-LEFT INFINITE SLIDING CARDS TRACK (WITH SCHEME POSTER IMAGES) ─── */}
        <div className="relative w-full overflow-hidden py-4">
          {/* Gradient Blur Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#021c0a] to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#021c0a] to-transparent z-20 pointer-events-none" />

          {/* Sliding Track */}
          <div className="flex gap-6 w-max animate-[scrollRightToLeft_28s_linear_infinite] hover:[animation-play-state:paused]">
            {TICKER_ITEMS.map((item, idx) => (
              <div
                key={idx}
                className={`w-72 sm:w-80 rounded-2xl ${item.color} border backdrop-blur-xl flex flex-col justify-between overflow-hidden text-left shadow-2xl hover:scale-105 transition-all duration-300 group cursor-pointer`}
              >
                {/* Official Scheme Poster Image Header */}
                <div className="h-44 w-full relative overflow-hidden">
                  <img
                    src={item.img}
                    onError={(e) => { e.target.src = '/admk_leaders_clear.png'; }}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                  
                  {/* Floating Sector Badge Icon */}
                  <div className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-slate-950/80 border border-white/20 flex items-center justify-center text-amber-400 shadow-md">
                    <span className="material-symbols-outlined text-xl font-bold">{item.icon}</span>
                  </div>

                  <span className="absolute bottom-3 left-3 text-3xs font-extrabold text-amber-300 uppercase tracking-widest bg-slate-950/80 px-2.5 py-1 rounded-md border border-amber-400/30">
                    AIADMK SCHEME
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-2">
                  <h4 className="text-sm font-black text-amber-400 uppercase tracking-wider">{item.title}</h4>
                  <p className="text-xs text-slate-200 font-medium leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Button */}
        <div className="pt-4">
          <button
            onClick={onExploreSchemes}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-widest shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto border border-amber-300/40"
          >
            <span className="material-symbols-outlined text-base font-bold">verified</span>
            <span>{language === 'English' ? 'EXPLORE ALL SCHEMES & ACHIEVEMENTS' : 'அனைத்துத் திட்டங்களையும் அறிய'}</span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes scrollRightToLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}

// ─── SECTION 4: THE 2K GENERATION (RALLY BG + FLOATING ANIMATED CARDS) ───
function Generation2KSection({ language }) {
  const PILLARS = [
    { title: language === 'English' ? 'TECHNOLOGY' : 'தொழில்நுட்பம்', subtitle: language === 'English' ? 'Digital Learning & Smart Classrooms' : 'டிஜிட்டல் கற்றல் & ஸ்மார்ட் வகுப்பறைகள்', img: '/amma_free_laptops.jpg', icon: 'computer', delay: 'delay-100' },
    { title: language === 'English' ? 'ENTREPRENEURSHIP' : 'தொழில்முனைவு', subtitle: language === 'English' ? 'Global Investments & Startup Support' : 'உலகளாவிய முதலீடுகள் & ஸ்டார்ட்-அப் ஆதரவு', img: '/amma_gim_investors.jpg', icon: 'rocket_launch', delay: 'delay-200' },
    { title: language === 'English' ? 'EDUCATION' : 'உயர்கல்வி', subtitle: language === 'English' ? '11 New Government Medical Colleges' : '11 புதிய அரசு மருத்துவக் கல்லூரிகள்', img: '/eps_11_medical_colleges.jpg', icon: 'school', delay: 'delay-300' },
    { title: language === 'English' ? 'AGRICULTURE 2.0' : 'நவீன விவசாயம்', subtitle: language === 'English' ? 'Uzhavan App & Tech Irrigation' : 'உழவர் செயலி & நவீன நீர் மேலாண்மை', img: '/eps_uzhavan_app.jpg', icon: 'smartphone', delay: 'delay-400' }
  ];

  return (
    <section
      className="relative py-20 px-6 text-white overflow-hidden border-t border-emerald-900/40 bg-no-repeat bg-cover bg-center bg-fixed select-none"
      style={{
        backgroundImage: 'linear-gradient(rgba(2, 28, 10, 0.88), rgba(4, 45, 19, 0.94)), url("/rally_bg.jpg")',
      }}
    >
      <div className="max-w-7xl mx-auto text-center space-y-10 relative z-10">
        {/* Header Banner */}
        <div className="space-y-3 max-w-3xl mx-auto">
          <span className="px-4 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-widest inline-block shadow-lg backdrop-blur-md">
            {language === 'English' ? 'THE 2K GENERATION • TAMIL NADU 2031' : '2K எதிர்காலத் தலைமுறை • தமிழ்நாடு 2031'}
          </span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white drop-shadow-2xl">
            {language === 'English' ? 'BORN INTO CHANGE. BUILDING WHAT\'S NEXT.' : 'மாற்றத்தில் பிறந்து, எதிர்காலத்தை உருவாக்குவோம்.'}
          </h2>
          
          {/* Single Focal Quote */}
          <div className="pt-2">
            <p className="text-sm sm:text-base font-extrabold text-amber-300 uppercase tracking-wide bg-slate-950/90 px-6 py-3 rounded-2xl border border-amber-400/40 inline-block shadow-2xl backdrop-blur-xl">
              {language === 'English'
                ? 'We respect where the journey began — our job is to shape where it goes next.'
                : 'கடந்த கால வரலாற்றைப் போற்றுவோம் — எதிர்காலத் தமிழகத்தை சிறப்பாக உருவாக்குவோம்.'}
            </p>
          </div>
        </div>

        {/* 4 Interactive Animated Pillar Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {PILLARS.map((card, i) => (
            <div
              key={i}
              className={`bg-slate-950/85 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/15 p-4 text-left space-y-4 hover:border-amber-400 hover:-translate-y-2 hover:scale-[1.04] transition-all duration-500 shadow-2xl hover:shadow-[0_12px_35px_rgba(245,158,11,0.25)] group cursor-pointer ${card.delay}`}
            >
              <div className="h-44 rounded-2xl overflow-hidden relative border border-white/10">
                <img
                  src={card.img}
                  onError={(e) => { e.target.src = '/admk_leaders_clear.png'; }}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-slate-950/90 border border-white/20 flex items-center justify-center text-amber-400 shadow-lg group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-xl font-bold">{card.icon}</span>
                </div>
              </div>

              <div className="space-y-1.5 px-1 pb-1">
                <h4 className="text-sm font-black uppercase text-amber-400 tracking-wider group-hover:text-white transition-colors">
                  {card.title}
                </h4>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  {card.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 7: 1972 → TODAY (JOURNEY IN MOMENTS TIMELINE) ───
function JourneyTimelineSection({ language, onExploreTimeline }) {
  const MOMENTS = [
    { year: '1972', title: 'THE BEGINNING', desc: 'AIADMK is founded under MGR.' },
    { year: '1977', title: 'FIRST GOVERNMENT', desc: 'MGR leads AIADMK to form the government.' },
    { year: '1980', title: 'ANOTHER MANDATE', desc: 'AIADMK returns to government.' },
    { year: '1984', title: 'THIRD VICTORY', desc: 'Another Assembly victory under MGR.' },
    { year: '1991', title: 'THE AMMA ERA', desc: 'Jayalalithaa leads AIADMK into a new chapter.' },
    { year: '2001', title: 'THE RETURN', desc: 'AIADMK returns to government under Amma.' },
    { year: '2011', title: 'A NEW MANDATE', desc: 'AIADMK returns to power under Amma.' },
    { year: '2016', title: 'CONSECUTIVE VICTORY', desc: 'AIADMK secures another Assembly mandate.' },
    { year: '2017-2021', title: 'THE EPS GOVERNMENT', desc: 'Edappadi K. Palaniswami serves as Chief Minister.' },
    { year: 'TODAY', title: 'A NEW CHAPTER', desc: 'The movement continues under EPS.' }
  ];

  return (
    <section className="py-20 px-6 bg-slate-950 text-white border-t border-emerald-900/30 select-none">
      <div className="max-w-7xl mx-auto space-y-12 text-center">
        <div className="space-y-3">
          <span className="px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-widest">
            HISTORICAL TIMELINE
          </span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
            1972 → TODAY: THE JOURNEY IN MOMENTS.
          </h2>
        </div>

        {/* Horizontally Scrollable Timeline Bar */}
        <div className="overflow-x-auto pb-4 hide-scrollbar">
          <div className="flex gap-4 min-w-max px-2">
            {MOMENTS.map((m, idx) => (
              <div key={idx} className="w-64 p-5 rounded-2xl bg-slate-900 border border-white/15 text-left space-y-2 hover:border-amber-400 transition-all flex flex-col justify-between">
                <div>
                  <span className="text-lg font-black text-amber-400 block">{m.year}</span>
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">{m.title}</h4>
                  <p className="text-3xs text-slate-400 font-medium leading-relaxed mt-1">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={onExploreTimeline}
            className="px-8 py-3.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-widest shadow-xl transition-all hover:scale-105"
          >
            [ EXPLORE THE FULL TIMELINE ]
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── UNIFIED MASTER CITIZEN ENGAGEMENT HUB (ACTIONS, VISION 2031, SCRAPBOOK & QUIZ) ───
function InteractiveEngagementHub({
  language,
  onExploreTimeline,
  handleTrackClick,
  handleGiveFeedbackClick,
  handleMyConstituencyClick
}) {
  const [activeTab, setActiveTab] = useState('2031'); // '2031' | 'scrapbook' | 'quiz'

  // Tab 1: Vision 2031 Ideas State (Persisted in localStorage & Backend API)
  const [ideas, setIdeas] = useState(() => {
    try {
      const saved = localStorage.getItem('insightflow_user_ideas');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      { title: 'AI-Powered Crop Advisory', author: 'Karthik (Coimbatore)', votes: 42 },
      { title: 'Solar Powered Public Bus Shelters', author: 'Anitha (Salem)', votes: 38 },
      { title: 'Free High-Speed Wi-Fi in Panchayats', author: 'Pradeep (Madurai)', votes: 29 }
    ];
  });
  const [newIdea, setNewIdea] = useState('');
  const [showIdeaModal, setShowIdeaModal] = useState(false);

  async function handleAddIdea(e) {
    e.preventDefault();
    if (!newIdea.trim()) return;

    const ideaObj = {
      title: newIdea.trim(),
      author: 'You (Public Voice)',
      votes: 1,
      created_at: new Date().toISOString()
    };

    const updatedIdeas = [ideaObj, ...ideas];
    setIdeas(updatedIdeas);

    try {
      localStorage.setItem('insightflow_user_ideas', JSON.stringify(updatedIdeas));
    } catch (err) {
      console.warn('LocalStorage error:', err);
    }

    // Save to Backend API / MongoDB Atlas
    try {
      await fetch(`${API}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type_of_feedback: 'Tamil Nadu 2031 Idea',
          category: 'Vision 2031',
          feedback_title: 'Public Vision 2031 Idea',
          feedback_text: newIdea.trim(),
          district: 'Salem',
          importance: 'Normal',
          user: { name: 'Public Voice', email: 'citizen@tn2031.org' }
        })
      });
    } catch (apiErr) {
      console.warn('Backend idea submission error:', apiErr);
    }

    setNewIdea('');
    setShowIdeaModal(false);

    // Show Thank You Success Alert
    Swal.fire({
      title: language === 'English' ? 'Thank You!' : 'நன்றி!',
      html: language === 'English'
        ? '<div style="text-align:center; padding:10px;"><p style="font-size:16px; font-weight:800; color:#065f46; margin-bottom:6px;">Your Idea Has Been Saved Successfully!</p><p style="font-size:13px; color:#334155;">Your vision for <strong>Tamil Nadu 2031</strong> has been added to the public idea wall.</p></div>'
        : '<div style="text-align:center; padding:10px;"><p style="font-size:16px; font-weight:800; color:#065f46; margin-bottom:6px;">உங்களது கருத்து வெற்றிகரமாகப் பதிவு செய்யப்பட்டது!</p><p style="font-size:13px; color:#334155;">தமிழ்நாடு 2031-ற்கான உங்களது ஆலோசனை கருத்துச் சுவரில் சேர்க்கப்பட்டது.</p></div>',
      icon: 'success',
      confirmButtonText: language === 'English' ? 'Awesome' : 'சரி',
      confirmButtonColor: '#10b981',
      customClass: { popup: 'glass-popup' },
    });
  }

  // Tab 3: Legacy Quiz Modal State
  const [showQuizModal, setShowQuizModal] = useState(false);
  const QUIZ_QUESTIONS = [
    {
      q: 'In which year was AIADMK founded by Puratchi Thalaivar MGR?',
      options: ['1967', '1972', '1977', '1980'],
      ans: 1,
      exp: 'AIADMK was founded on 17 October 1972 by Puratchi Thalaivar MGR.'
    },
    {
      q: 'Who led AIADMK into historic welfare governance known as the Amma Era?',
      options: ['MGR', 'Puratchi Thalaivi Jayalalithaa', 'EPS', 'C.N. Annadurai'],
      ans: 1,
      exp: 'Puratchi Thalaivi Jayalalithaa led AIADMK with historic welfare initiatives.'
    },
    {
      q: 'Who served as Chief Minister of Tamil Nadu from 2017 to 2021?',
      options: ['MGR', 'Amma', 'Edappadi K. Palaniswami', 'O. Panneerselvam'],
      ans: 2,
      exp: 'Edappadi K. Palaniswami served as Chief Minister during 2017-2021.'
    },
    {
      q: 'Which historic scheme provided free laptops to school students in Tamil Nadu?',
      options: ['Amma Unavagam', 'Free Laptop Scheme', 'Thaalikku Thangam', 'Kudimaramathu'],
      ans: 1,
      exp: 'The Amma Free Laptop Scheme empowered lakhs of school students across TN.'
    }
  ];

  const [currQ, setCurrQ] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  function handleSelect(idx) {
    if (selectedOpt !== null) return;
    setSelectedOpt(idx);
    if (idx === QUIZ_QUESTIONS[currQ].ans) {
      setScore(s => s + 1);
    }
  }

  function handleNextQ() {
    if (currQ + 1 < QUIZ_QUESTIONS.length) {
      setCurrQ(currQ + 1);
      setSelectedOpt(null);
    } else {
      setQuizFinished(true);
    }
  }

  function handleRestart() {
    setCurrQ(0);
    setSelectedOpt(null);
    setScore(0);
    setQuizFinished(false);
  }

  const STORIES = [
    { text: 'Some remember MGR from a public meeting in 1977.' },
    { text: 'Some remember an Amma announcement that reached their family.' },
    { text: 'Some remember a government initiative that supported their education.' },
    { text: 'Others remember a road, hospital, school or public project that changed their community.' }
  ];

  return (
    <section
      className="relative py-20 px-6 text-white border-t border-emerald-900/40 select-none bg-no-repeat bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: 'linear-gradient(rgba(2, 28, 10, 0.90), rgba(4, 45, 19, 0.95)), url("/rally_bg.jpg")',
      }}
    >
      <div className="max-w-6xl mx-auto text-center space-y-12 relative z-10">
        {/* Top Header Banner */}
        <div className="space-y-3 max-w-3xl mx-auto">
          <span className="px-4 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-widest inline-block shadow-md backdrop-blur-md">
            {language === 'English' ? 'MASTER CITIZEN ENGAGEMENT HUB' : 'பிரதான மக்கள் பங்கேற்பு மையம்'}
          </span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white drop-shadow-2xl">
            {language === 'English' ? 'YOUR VOICE. YOUR ACTIONS. YOUR LEGACY.' : 'உங்கள் குரல் • உங்கள் நடவடிக்கை • உங்கள் வரலாறு'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 max-w-xl mx-auto font-medium">
            {language === 'English'
              ? 'Lodge public grievances, monitor real-time tracking, or participate in vision, memories, & quiz.'
              : 'பொதுக் கோரிக்கைகளைச் சமர்ப்பித்து, தற்போதைய நிலையைக் கண்காணித்து, மக்கள் பங்கேற்பு அமைப்பில் இணைந்து செயல்படுங்கள்.'}
          </p>
        </div>

        {/* ─── PART 1: 3 PRIMARY CITIZEN ACTION ROADMAP CARDS ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Card 1: Track Grievance */}
          <div className="rounded-3xl p-6 shadow-2xl border border-white/20 bg-slate-950/85 backdrop-blur-xl flex flex-col items-center text-center gap-4 hover:scale-[1.03] transition-all duration-300 group border-t-4 border-t-blue-500">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-400/30 text-blue-400 flex items-center justify-center group-hover:scale-110 duration-300 transition-transform">
              <span className="material-symbols-outlined text-3xl font-bold">search</span>
            </div>
            <div className="space-y-1.5">
              <h4 className="text-base font-black text-white">{language === 'English' ? 'Track Grievance' : 'விசாரணை நிலை அறிதல்'}</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {language === 'English'
                  ? 'Monitor real-time resolution progress of your query.'
                  : 'சமர்ப்பிக்கப்பட்ட புகாரின் தற்போதைய தீர்வு நிலை அறிய.'}
              </p>
            </div>
            <button
              onClick={handleTrackClick}
              className="mt-auto w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs tracking-wider uppercase transition shadow-lg"
            >
              {language === 'English' ? 'Track Status →' : 'நிலை அறிதல் →'}
            </button>
          </div>

          {/* Card 2: File a Grievance */}
          <div className="rounded-3xl p-6 shadow-2xl border border-white/20 bg-slate-950/85 backdrop-blur-xl flex flex-col items-center text-center gap-4 hover:scale-[1.03] transition-all duration-300 group border-t-4 border-t-emerald-500">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 flex items-center justify-center group-hover:scale-110 duration-300 transition-transform">
              <span className="material-symbols-outlined text-3xl font-bold">rate_review</span>
            </div>
            <div className="space-y-1.5">
              <h4 className="text-base font-black text-white">{language === 'English' ? 'File a Grievance' : 'குறை சமர்ப்பித்தல்'}</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {language === 'English'
                  ? 'Lodge local issues or suggestions directly to representatives.'
                  : 'உள்ளூர்ப் பிரச்சினைகளை பிரதிநிதிகளிடம் நேரடியாகச் சமர்ப்பிக்க.'}
              </p>
            </div>
            <button
              onClick={handleGiveFeedbackClick}
              className="mt-auto w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs tracking-wider uppercase transition shadow-lg"
            >
              {language === 'English' ? 'File Grievance →' : 'புகார் சமர்ப்பித்தல் →'}
            </button>
          </div>

          {/* Card 3: Officer Log In */}
          <div className="rounded-3xl p-6 shadow-2xl border border-white/20 bg-slate-950/85 backdrop-blur-xl flex flex-col items-center text-center gap-4 hover:scale-[1.03] transition-all duration-300 group border-t-4 border-t-amber-500">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-amber-400 flex items-center justify-center group-hover:scale-110 duration-300 transition-transform">
              <span className="material-symbols-outlined text-3xl font-bold">badge</span>
            </div>
            <div className="space-y-1.5">
              <h4 className="text-base font-black text-white">{language === 'English' ? 'Officer Log In' : 'பிரதிநிதி உள்நுழைவு'}</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {language === 'English'
                  ? 'Administrative desk portal to review and solve public queries.'
                  : 'நிர்வாகப் பிரதிநிதிகள் கோரிக்கைகளை ஆய்வு செய்ய.'}
              </p>
            </div>
            <button
              onClick={handleMyConstituencyClick}
              className="mt-auto w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs tracking-wider uppercase transition shadow-lg"
            >
              {language === 'English' ? 'Officer Login →' : 'உள்நுழைவு →'}
            </button>
          </div>
        </div>

        {/* ─── PART 2: INTERACTIVE ENGAGEMENT TAB BUTTONS ─── */}
        <div className="flex flex-wrap justify-center gap-3 p-2 rounded-2xl bg-slate-900/90 border border-white/15 max-w-2xl mx-auto shadow-2xl">
          <button
            onClick={() => setActiveTab('2031')}
            className={`px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === '2031' ? 'bg-amber-400 text-slate-950 shadow-lg scale-105' : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>💡</span>
            <span>TAMIL NADU 2031</span>
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'quiz' ? 'bg-amber-400 text-slate-950 shadow-lg scale-105' : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>🏆</span>
            <span>LEGACY QUIZ</span>
          </button>
          <button
            onClick={onExploreTimeline}
            className="px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-900 hover:text-white shadow-md"
          >
            <span>📜</span>
            <span>1972 → TODAY TIMELINE</span>
          </button>
        </div>

        {/* ─── TAB 1: TAMIL NADU 2031 (SUBMIT YOUR IDEA) ─── */}
        {activeTab === '2031' && (
          <div className="space-y-6 animate-fadeIn max-w-2xl mx-auto">
            <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/95 border-2 border-emerald-500/40 shadow-2xl text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto text-3xl shadow-inner">
                💡
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                  {language === 'English' ? 'VISION 2031: PUBLIC IDEA WALL' : 'தமிழ்நாடு 2031: உங்கள் கருத்துக்கள்'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-lg mx-auto">
                  {language === 'English'
                    ? 'Share your direct vision and innovative ideas for job creation, infrastructure, education, & sustainability across Tamil Nadu!'
                    : 'வேலைவாய்ப்பு, கட்டமைப்பு, கல்வி மற்றும் வளர்ச்சிக்கான உங்கள் யோசனைகளைப் பகிர்ந்து புதிய தமிழகத்தைக் கட்டமைப்போம்!'}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setShowIdeaModal(true)}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-widest shadow-2xl transition hover:scale-105 active:scale-95 flex items-center justify-center gap-2 mx-auto"
                >
                  <span className="material-symbols-outlined text-lg">add_circle</span>
                  <span>{language === 'English' ? 'SUBMIT YOUR IDEA FOR TAMIL NADU 2031' : 'உங்கள் யோசனையைச் சமர்ப்பிக்க'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 3: LEGACY QUIZ INVITATION CARD ─── */}
        {activeTab === 'quiz' && (
          <div className="space-y-6 animate-fadeIn max-w-2xl mx-auto">
            <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/95 border-2 border-amber-400/40 shadow-2xl text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mx-auto text-3xl shadow-inner">
                🏆
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                  KNOW YOUR LEGACY QUIZ
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-lg mx-auto">
                  Test your knowledge of AIADMK's 50-year history, iconic leaders (MGR, Amma, EPS), historic election mandates, & landmark welfare schemes!
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    handleRestart();
                    setShowQuizModal(true);
                  }}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-widest shadow-2xl transition hover:scale-105 active:scale-95 flex items-center justify-center gap-2 mx-auto"
                >
                  <span className="material-symbols-outlined text-lg">play_arrow</span>
                  <span>{language === 'English' ? 'START LEGACY QUIZ' : 'வினாடி-வினாவைத் தொடங்க'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Idea / Story Submission Modal */}
        {showIdeaModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-amber-400/40 rounded-3xl p-6 w-full max-w-lg space-y-4 text-left shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-amber-400 uppercase">
                  {activeTab === 'scrapbook' ? 'Share Your Memory / Story' : 'Submit Your Idea for Tamil Nadu 2031'}
                </h3>
                <button onClick={() => setShowIdeaModal(false)} className="text-slate-400 hover:text-white font-black">✕</button>
              </div>
              <form onSubmit={handleAddIdea} className="space-y-4">
                <textarea
                  rows="4"
                  required
                  value={newIdea}
                  onChange={(e) => setNewIdea(e.target.value)}
                  placeholder={activeTab === 'scrapbook' ? "Share your memory of an AIADMK scheme or event..." : "Describe your vision or idea for Tamil Nadu..."}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-white/20 text-white text-xs focus:ring-1 focus:ring-amber-400 outline-none"
                />
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setShowIdeaModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs uppercase">Cancel</button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-amber-400 text-slate-950 font-black text-xs uppercase shadow-md">Submit</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ─── DEDICATED FULLSCREEN INTERACTIVE QUIZ MODAL ─── */}
        {showQuizModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-slate-900 border-2 border-amber-400/40 rounded-3xl p-6 sm:p-10 w-full max-w-2xl text-left space-y-6 shadow-2xl relative my-auto">
              <button
                onClick={() => setShowQuizModal(false)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>

              {!quizFinished ? (
                <>
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <span className="text-xs font-black text-amber-400 uppercase tracking-widest">
                      Question {currQ + 1} of {QUIZ_QUESTIONS.length}
                    </span>
                    <span className="text-xs font-bold text-emerald-400">Score: {score}</span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-black text-white leading-relaxed">
                    {QUIZ_QUESTIONS[currQ].q}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {QUIZ_QUESTIONS[currQ].options.map((opt, idx) => {
                      let isCorrect = idx === QUIZ_QUESTIONS[currQ].ans;
                      let btnClass = 'bg-slate-950 border-white/15 text-white hover:border-amber-400';
                      if (selectedOpt !== null) {
                        if (isCorrect) btnClass = 'bg-emerald-600 text-white border-emerald-400 font-black';
                        else if (selectedOpt === idx) btnClass = 'bg-rose-600 text-white border-rose-400 font-black';
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelect(idx)}
                          className={`p-4 rounded-2xl border text-xs font-bold transition-all text-left ${btnClass}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {selectedOpt !== null && (
                    <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-3">
                      <p className="text-xs text-emerald-400 font-semibold">{QUIZ_QUESTIONS[currQ].exp}</p>
                      <button
                        onClick={handleNextQ}
                        className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md"
                      >
                        {currQ + 1 < QUIZ_QUESTIONS.length ? 'Next Question →' : 'View Results 🏆'}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 space-y-6">
                  <div className="text-6xl">🏆</div>
                  <h3 className="text-2xl font-black text-amber-400 uppercase">Quiz Completed!</h3>
                  <p className="text-lg text-white font-bold">You scored {score} out of {QUIZ_QUESTIONS.length}</p>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={handleRestart}
                      className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-widest shadow-lg"
                    >
                      Retake Quiz 🔄
                    </button>
                    <button
                      onClick={() => setShowQuizModal(false)}
                      className="px-8 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-black text-xs uppercase tracking-widest"
                    >
                      Close ✕
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── SECTION 9: HOME FOOTER SLOGAN SECTION (WITH ANIMATED FLASHING TEXT & GLOW EFFECTS) ───
function HomeFooterSloganSection({ language, onExplore, onFeedback }) {
  return (
    <section className="py-20 px-6 bg-slate-950 text-white border-t border-emerald-900/40 text-center relative overflow-hidden select-none">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto space-y-10 relative z-10">

        {/* Flashing Animated Tag & Main Title */}
        <div className="space-y-3">
          <span className="inline-block px-5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(245,158,11,0.25)] animate-pulse">
            ✨ THEN • NOW • FOREVER ✨
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase bg-clip-text text-transparent bg-gradient-to-r from-white via-amber-200 to-white drop-shadow-2xl">
            AIADMK IS THE PEOPLE'S CHOICE.
          </h2>
        </div>

        {/* 4 Flashing Generation Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { tag: 'MGR', label: 'THE BEGINNING', icon: '⭐', color: 'border-amber-400/40 text-amber-400 bg-amber-500/5' },
            { tag: 'AMMA', label: 'THE LEGACY', icon: '👑', color: 'border-emerald-400/40 text-emerald-400 bg-emerald-500/5' },
            { tag: 'EPS', label: 'THE PRESENT', icon: '🛡️', color: 'border-amber-400/40 text-amber-400 bg-amber-500/5' },
            { tag: '2K', label: 'THE GENERATION AHEAD', icon: '🚀', color: 'border-emerald-400/40 text-emerald-400 bg-emerald-500/5' },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border ${item.color} backdrop-blur-md shadow-lg hover:scale-105 transition-all duration-300 group cursor-default flex flex-col items-center justify-center gap-1 hover:border-amber-300`}
            >
              <span className="text-xl group-hover:scale-125 transition-transform duration-300">{item.icon}</span>
              <span className="text-sm sm:text-base font-black tracking-wider block group-hover:animate-pulse">{item.tag}</span>
              <span className="text-3xs text-slate-300 uppercase font-bold tracking-widest">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Flashing Tamil & English Golden Slogan Box */}
        <div className="relative p-6 sm:p-8 rounded-3xl bg-slate-900/90 border-2 border-amber-400/50 max-w-3xl mx-auto space-y-3 shadow-[0_0_40px_rgba(245,158,11,0.25)] animate-[pulse_3s_infinite]">
          <p
            className="text-lg sm:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-amber-100 to-amber-400 drop-shadow-md leading-relaxed"
            style={{ fontFamily: "'Noto Sans Tamil', sans-serif" }}
          >
            மரபை அறிவோம். மக்களின் குரலைக் கேட்போம். எதிர்காலத்தை உருவாக்குவோம்.
          </p>
          <p className="text-xs sm:text-sm font-extrabold text-slate-200 uppercase tracking-widest drop-shadow-sm">
            KNOW THE LEGACY. HEAR THE PEOPLE. SHAPE THE FUTURE.
          </p>
        </div>

        {/* Action Buttons with Dynamic Hover Shine */}
        <div className="pt-2 flex flex-wrap justify-center gap-5">
          <button
            onClick={onExplore}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-widest shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
          >
            EXPLORE 2K ADMK
          </button>
          <button
            onClick={onFeedback}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-black text-xs uppercase tracking-widest shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
          >
            GIVE FEEDBACK
          </button>
        </div>

      </div>
    </section>
  );
}
function SalemDistrictMap({ selectedConstituency, onSelectConstituency, language }) {
  const [hoveredConst, setHoveredConst] = useState(null);

  // 11 Assembly constituencies of Salem District mapped to image coordinates
  const SALEM_CONSTITUENCIES = [
    { id: 'Mettur', number: 5, ta: 'மேட்டூர்', top: '24%', left: '8%', width: '16%', height: '42%' },
    { id: 'Edappadi', number: 6, ta: 'எடப்பாடி', top: '34%', left: '22%', width: '15%', height: '32%' },
    { id: 'Sankari', number: 7, ta: 'சங்ககிரி', top: '64%', left: '16%', width: '20%', height: '28%' },
    { id: 'Omalur', number: 4, ta: 'ஓமலூர்', top: '14%', left: '36%', width: '18%', height: '32%' },
    { id: 'Salem (West)', number: 8, ta: 'சேலம் (மேற்கு)', top: '32%', left: '33%', width: '16%', height: '26%' },
    { id: 'Salem (North)', number: 9, ta: 'சேலம் (வடக்கு)', top: '38%', left: '47%', width: '16%', height: '24%' },
    { id: 'Salem (South)', number: 10, ta: 'சேலம் (தெற்கு)', top: '54%', left: '58%', width: '16%', height: '34%' },
    { id: 'Veerapandi', number: 11, ta: 'வீரபாண்டி', top: '56%', left: '40%', width: '18%', height: '26%' },
    { id: 'Yercaud', number: 3, ta: 'ஏற்காடு', top: '18%', left: '52%', width: '20%', height: '28%' },
    { id: 'Attur', number: 2, ta: 'ஆத்தூர்', top: '40%', left: '72%', width: '18%', height: '28%' },
    { id: 'Gangavalli', number: 1, ta: 'கெங்கவல்லி', top: '66%', left: '76%', width: '20%', height: '30%' }
  ];

  return (
    <div className="relative w-full flex flex-col items-center select-none animate-fadeIn">
      <div className="relative w-full max-w-4xl rounded-3xl overflow-hidden bg-slate-950 border-2 border-amber-400/30 p-3 sm:p-5 shadow-2xl group">
        {/* High-Resolution Salem Constituencies Map Image (2nd Image requested by user) */}
        <div className="relative w-full flex items-center justify-center bg-white/95 rounded-2xl p-4 shadow-inner overflow-hidden">
          <img
            src="/salem_constituencies_map.png?v=3"
            alt="Salem District 11 Assembly Constituencies Map"
            className="w-full h-auto object-contain max-h-[520px] filter drop-shadow-md transition duration-500 group-hover:scale-[1.01]"
          />

          {/* Interactive Click Hotspots overlay for all 11 Constituencies */}
          {SALEM_CONSTITUENCIES.map((c) => {
            const isSelected = selectedConstituency === c.id;
            const isHovered = hoveredConst === c.id;

            return (
              <button
                key={c.id}
                onClick={() => onSelectConstituency(c.id)}
                onMouseEnter={() => setHoveredConst(c.id)}
                onMouseLeave={() => setHoveredConst(null)}
                style={{ top: c.top, left: c.left, width: c.width, height: c.height }}
                className="absolute bg-transparent border-none outline-none cursor-pointer z-10"
                title={`Click to view ${c.id} Constituency details`}
              />
            );
          })}
        </div>

        {/* Hover Tooltip Badge */}
        {hoveredConst && (() => {
          const item = SALEM_CONSTITUENCIES.find(c => c.id === hoveredConst);
          return (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-slate-950 border-2 border-amber-400 text-white px-6 py-2.5 rounded-2xl shadow-2xl text-center pointer-events-none animate-fadeIn z-30">
              <span className="text-3xs font-black text-amber-400 uppercase tracking-widest block">
                Seat #{item?.number} • Salem District
              </span>
              <h5 className="text-sm font-black text-white uppercase tracking-tight">
                {language === 'English' ? item?.id : item?.ta}
              </h5>
              <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider block mt-0.5">
                {language === 'English' ? 'Click to View Grievances & Statistics' : 'மனுக்கள் & புள்ளிவிவரங்களைக் காண கிளிக் செய்க'}
              </span>
            </div>
          );
        })()}
      </div>
    </div>
  );
}


// ─── DEDICATED CONSTITUENCY GRIEVANCES & STATISTICS PAGE COMPONENT ───
function ConstituencyDetailsPage({
  constituencyName,
  districtName = 'Salem',
  language,
  userRole,
  onBackToSalemMap,
  onBackToTNMap,
  allFeedbacks = []
}) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('All');

  // Filter real feedbacks for this constituency from MongoDB Atlas
  const constituencyGrievances = React.useMemo(() => {
    return (allFeedbacks || []).filter(item => {
      const itemConst = (item.constituency || item.location?.constituency || item.location?.constituency_en || '').toLowerCase().trim();
      const itemDist = (item.district || item.location?.district || item.location?.district_en || '').toLowerCase().trim();
      const targetConst = constituencyName.toLowerCase().replace(/[\(\)]/g, '').trim();
      const targetDist = districtName.toLowerCase().replace(/[\(\)]/g, '').trim();

      const cleanItemConst = itemConst.replace(/[\(\)]/g, '').trim();
      const cleanItemDist = itemDist.replace(/[\(\)]/g, '').trim();

      const matchConst = cleanItemConst === targetConst || cleanItemConst.includes(targetConst) || targetConst.includes(cleanItemConst);
      const matchDist = !targetDist || cleanItemDist.includes(targetDist) || targetDist.includes(cleanItemDist);

      return matchConst && matchDist;
    });
  }, [allFeedbacks, constituencyName, districtName]);

  // Statistics calculation
  const totalCount = constituencyGrievances.length;
  const resolvedCount = constituencyGrievances.filter(g => g.status === 'Resolved' || g.status === 'Solved').length;
  const pendingCount = constituencyGrievances.filter(g => g.status !== 'Resolved' && g.status !== 'Solved').length;
  const resolutionRate = totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 0;

  // Filtered grievances list
  const filteredList = constituencyGrievances.filter(item => {
    const matchesSearch = !searchQuery ||
      (item.title_en || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.title_ta || '').includes(searchQuery) ||
      (item.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.tracking_id || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' ||
      (statusFilter === 'Resolved' && (item.status === 'Resolved' || item.status === 'Solved')) ||
      (statusFilter === 'Pending' && item.status !== 'Resolved' && item.status !== 'Solved');

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fadeIn text-white py-4">
      {/* Navigation Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/90 border border-white/10 backdrop-blur-xl shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToSalemMap}
            className="px-5 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-widest transition shadow-lg flex items-center gap-2"
          >
            <span>← {language === 'English' ? 'Back to Salem Map' : 'சேலம் வரைபடம்'}</span>
          </button>

          <button
            onClick={onBackToTNMap}
            className="px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs uppercase tracking-wider border border-white/10 transition"
          >
            <span>{language === 'English' ? 'TN Map' : 'தமிழக வரைபடம்'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-2xs font-black uppercase tracking-widest">
            {districtName} District
          </span>
          <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-2xs font-black uppercase tracking-widest">
            Assembly Seat
          </span>
        </div>
      </div>

      {/* Constituency Hero Header */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-955 border border-amber-400/30 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 text-center md:text-left z-10 max-w-2xl">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="text-3xs font-black text-amber-400 uppercase tracking-widest">CONSTITUENCY DASHBOARD</span>
            <span className="text-amber-400">•</span>
            <span className="text-3xs font-black text-slate-400 uppercase tracking-wider">SALEM REGION</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight leading-none drop-shadow-md">
            {constituencyName} {language === 'English' ? 'CONSTITUENCY' : 'தொகுதி'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            {language === 'English'
              ? `Real-time public grievance tracking, citizen requests, and resolution statistics for ${constituencyName} Assembly Constituency.`
              : `${constituencyName} சட்டமன்றத் தொகுதியின் பொதுமக்கள் கோரிக்கைகள் மற்றும் குறைதீர்ப்பு புள்ளிவிவரங்கள்.`}
          </p>
        </div>

        {/* Quick Stat Pill Highlights */}
        <div className="grid grid-cols-3 gap-3 z-10 w-full md:w-auto">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 text-center shadow">
            <span className="text-3xs font-black text-slate-400 uppercase block">{language === 'English' ? 'Total' : 'மொத்தம்'}</span>
            <span className="text-2xl font-black text-white font-mono">{totalCount}</span>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-center shadow">
            <span className="text-3xs font-black text-emerald-400 uppercase block">{language === 'English' ? 'Resolved' : 'தீர்க்கப்பட்டது'}</span>
            <span className="text-2xl font-black text-emerald-400 font-mono">{resolvedCount}</span>
          </div>
          <div className="p-4 rounded-2xl bg-amber-950/80 border border-amber-500/40 text-center shadow">
            <span className="text-3xs font-black text-amber-400 uppercase block">{language === 'English' ? 'Pending' : 'நிலுவையில்'}</span>
            <span className="text-2xl font-black text-amber-400 font-mono">{pendingCount}</span>
          </div>
        </div>
      </div>

      {/* Constituency Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Resolution Rate Meter */}
        <div className="p-6 rounded-3xl bg-slate-950/80 border border-white/10 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-3xs font-black text-amber-400 uppercase tracking-widest">{language === 'English' ? 'RESOLUTION EFFICIENCY' : 'தீர்வு விகிதம்'}</span>
            <span className="text-xs font-mono font-black text-emerald-400">{resolutionRate}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden p-0.5">
            <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700" style={{ width: `${resolutionRate}%` }} />
          </div>
          <p className="text-3xs text-slate-400 font-medium">
            {language === 'English' ? 'Percentage of grievances successfully resolved by constituency office.' : 'தொகுதி அலுவலகத்தால் தீர்வு காணப்பட்ட கோரிக்கைகளின் விழுக்காடு.'}
          </p>
        </div>

        {/* Card 2: Top Sector Priority */}
        <div className="p-6 rounded-3xl bg-slate-950/80 border border-white/10 shadow-xl space-y-3">
          <span className="text-3xs font-black text-amber-400 uppercase tracking-widest block">{language === 'English' ? 'KEY FOCUS SECTORS' : 'முதன்மைத் துறைகள்'}</span>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-3xs font-bold uppercase">
              {language === 'English' ? '💧 Irrigation & Water' : '💧 நீர்ப்பாசனம்'}
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-3xs font-bold uppercase">
              {language === 'English' ? '🛣️ Roads & Transit' : '🛣️ சாலை உள்கட்டமைப்பு'}
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-3xs font-bold uppercase">
              {language === 'English' ? '🌾 Farmer Loans' : '🌾 பயிர்க்கடன்'}
            </span>
          </div>
        </div>

        {/* Card 3: Constituency Office Info */}
        <div className="p-6 rounded-3xl bg-slate-950/80 border border-white/10 shadow-xl space-y-2">
          <span className="text-3xs font-black text-amber-400 uppercase tracking-widest block">{language === 'English' ? 'CONSTITUENCY DESK' : 'தொகுதி மையம்'}</span>
          <h4 className="text-sm font-bold text-white uppercase">{constituencyName} {language === 'English' ? 'Nodal Desk' : 'தகவல் மையம்'}</h4>
          <p className="text-3xs text-slate-400 font-medium">
            {language === 'English' ? 'AIADMK Public Service & Grievance Redressal Center' : 'அதிமுக மக்கள் குறைதீர்ப்பு மையம்'}
          </p>
        </div>
      </div>

      {/* Filtered Public Grievances Records List */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/90 border border-white/10 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h3 className="text-lg font-black text-white uppercase tracking-wide">{language === 'English' ? 'PUBLIC GRIEVANCES & PETITIONS' : 'பொதுமக்கள் மனுக்கள் & கோரிக்கைகள்'}</h3>
            <p className="text-xs sm:text-sm text-amber-200 uppercase font-bold tracking-wide">{language === 'English' ? 'Showing public requests for ' + constituencyName : constituencyName + ' தொகுதிக்கான மனுக்கள்'}</p>
          </div>

          {/* Search & Status Filter */}
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'English' ? 'Search grievances...' : 'தேடுக...'}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-300 focus:outline-none"
            >
              <option value="All">{language === 'English' ? 'All Status' : 'அனைத்து நிலைகள்'}</option>
              <option value="Resolved">{language === 'English' ? 'Resolved' : 'தீர்க்கப்பட்டது'}</option>
              <option value="Pending">{language === 'English' ? 'Pending' : 'நிலுவையில்'}</option>
            </select>
          </div>
        </div>

        {/* Grievance Cards List */}
        {filteredList.length === 0 ? (
          <div className="p-12 text-center text-slate-400 font-bold uppercase text-xs border border-dashed border-white/15 rounded-2xl space-y-2">
            <span className="material-symbols-outlined text-4xl text-slate-500 block">inbox</span>
            <p>{language === 'English' ? `0 Grievances Submitted in ${constituencyName} Constituency` : `${constituencyName} தொகுதியில் இதுவரை மனுக்கள் எதுவும் பதிவு செய்யப்படவில்லை.`}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredList.map((g) => (
              <div key={g._id || g.tracking_id} className="p-6 rounded-2xl bg-slate-900/90 border border-white/10 space-y-4 hover:border-amber-400/50 transition duration-300">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-3xs font-black uppercase">
                      {g.category_en || g.type_of_feedback || g.category || 'General'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-3xs font-black uppercase ${g.importance === 'Critical' || g.importance === 'High' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-slate-800 text-slate-300 border border-white/10'}`}>
                      {g.importance || 'Normal'}
                    </span>
                  </div>
                  <span className="text-3xs font-mono text-slate-200 font-bold">{g.date || g.created_at || new Date().toLocaleDateString()}</span>
                </div>

                <div>
                  <h4 className="text-base font-extrabold text-white leading-tight">
                    {g.feedback_title || g.title_en || g.title_ta || g.title || (language === 'English' ? 'Public Grievance Petition' : 'பொதுமக்கள் மனு')}
                  </h4>
                  <p className="text-xs text-slate-200 font-medium leading-relaxed mt-1">
                    {g.feedback_text || g.text_en || g.text_ta || g.text || ''}
                  </p>
                </div>

                {(g.solution || g.expected_solution || g.ai?.solution) ? (
                  <div className="p-3 rounded-xl bg-slate-955 border border-white/5 text-2xs space-y-1">
                    <span className="text-3xs font-black text-amber-400 uppercase tracking-widest block">{language === 'English' ? 'Requested Solution' : 'எதிர்பார்க்கும் தீர்வு'}</span>
                    <p className="text-slate-200 font-medium">{g.solution || g.expected_solution || g.ai?.solution}</p>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-955/60 border border-white/5 text-2xs space-y-1">
                    <span className="text-3xs font-black text-amber-400/80 uppercase tracking-widest block">{language === 'English' ? 'Requested Solution' : 'எதிர்பார்க்கும் தீர்வு'}</span>
                    <p className="text-slate-300 font-medium italic">{language === 'English' ? 'No specific solution requested by citizen.' : 'குறிப்பிட்ட தீர்வு கோரப்படவில்லை.'}</p>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5">
                  <div className="text-3xs font-mono text-slate-200">
                    <span className="text-slate-500 uppercase">Petitioner: </span>
                    {(userRole === 'leader' || userRole === 'admin') ? (
                      <span className="font-bold text-amber-300">
                        {g.name || g.user?.name || g.email || g.user?.email || g.citizen_name || 'Registered Citizen'}
                        <span className="text-[9px] text-emerald-400 font-extrabold bg-emerald-955/60 px-1.5 py-0.5 rounded border border-emerald-500/30 ml-1">🔒 Leader View</span>
                      </span>
                    ) : (
                      <span className="font-bold text-slate-300">🔒 Anonymous Citizen</span>
                    )}
                    <span className="ml-3 text-slate-500">ID: {g.tracking_id || g.feedback_id || (g._id ? String(g._id).substring(0, 8) : 'INF-PET')}</span>
                  </div>

                  <span className={`px-4 py-1 rounded-full text-3xs font-black uppercase tracking-wider ${g.status === 'Resolved' || g.status === 'Solved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'}`}>
                    {g.status === 'Resolved' || g.status === 'Solved' ? (language === 'English' ? '✓ RESOLVED' : '✓ தீர்க்கப்பட்டது') : (language === 'English' ? '⏳ PENDING REVIEW' : '⏳ பரிசீலனையில்')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── DISTRICT DETAILS POP-UP MODAL COMPONENT ───
function DistrictDetailsModal({
  distName,
  onClose,
  language,
  constituencyData,
  TN_DISTRICT_REGIONS,
  pressReleases,
  newsInbox,
  userRole,
  setRedirectAfterAuth,
  setShowAuthModal,
  setActiveView,
  setSelectedDistrict,
  setSelectedConstituency
}) {
  const [selectedTab, setSelectedTab] = useState('overview');
  const meta = TN_DISTRICT_REGIONS[distName] || {
    region: 'North',
    region_ta: 'வட தமிழகம்',
    icon: '🏛️',
    focus_en: 'General Infrastructure & Urban Welfare',
    focus_ta: 'பொதுக் கட்டமைப்பு & நகர்ப்புற வசதிகள்',
    sec_en: 'District Secretary & ADMK Leadership',
    hq_en: 'ADMK District Office Headquarters'
  };
  const constList = constituencyData[distName]?.constituencies || [];

  const matchedPress = pressReleases.filter(pr =>
    (pr.title_en && pr.title_en.toLowerCase().includes(distName.toLowerCase())) ||
    (pr.title_ta && pr.title_ta.includes(distName)) ||
    (pr.desc_en && pr.desc_en.toLowerCase().includes(distName.toLowerCase()))
  );
  const matchedInbox = newsInbox.filter(ni =>
    (ni.title && ni.title.toLowerCase().includes(distName.toLowerCase())) ||
    (ni.desc && ni.desc.toLowerCase().includes(distName.toLowerCase()))
  );
  const combinedNews = [...matchedPress, ...matchedInbox];
  const displayNews = combinedNews.length > 0 ? combinedNews : pressReleases.slice(0, 3);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn select-none">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-white/20 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl space-y-6 text-white max-h-[90vh] overflow-y-auto hide-scrollbar">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 w-10 h-10 rounded-full bg-white/10 hover:bg-red-600 text-white flex items-center justify-center transition shadow-lg z-20"
          title="Close Modal"
        >
          <span className="material-symbols-outlined text-xl font-bold">close</span>
        </button>

        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 pr-12">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-400 flex items-center justify-center text-3xl shadow-inner">
              📍
            </div>
            <div>
              <span className="text-3xs font-black text-amber-400 tracking-widest uppercase block">
                {language === 'English' ? `${meta.region} Tamil Nadu Region` : meta.region_ta}
              </span>
              <h3 className="text-2xl sm:text-4xl font-black uppercase text-white tracking-tight">
                {language === 'English' ? distName : (TN_DISTRICT_TAMIL_NAMES[distName] || constituencyData[distName]?.ta || distName)}
              </h3>
            </div>
          </div>

          <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 font-black text-xs uppercase tracking-wider self-start sm:self-auto">
            {constList.length} {language === 'English' ? 'Assembly Seats' : 'சட்டமன்றத் தொகுதிகள்'}
          </span>
        </div>

        {/* Sub-Tabs Bar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
          {[
            { id: 'overview', icon: 'bar_chart', en: 'Overview', ta: 'மேலோட்டம்' },
            { id: 'leadership', icon: 'account_balance', en: 'Party Desk', ta: 'கழகத் தலைமை' },
            { id: 'news', icon: 'newspaper', en: 'District News', ta: 'செய்திகள்' },
            { id: 'constituencies', icon: 'location_on', en: 'Seats & Wards', ta: 'தொகுதிகள்' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${selectedTab === tab.id ? 'bg-amber-400 text-slate-950 shadow-md scale-105' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}
            >
              <span className="material-symbols-outlined text-sm font-bold">{tab.icon}</span>
              <span>{language === 'English' ? tab.en : tab.ta}</span>
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {selectedTab === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <span className="text-3xs font-black text-amber-400 uppercase tracking-widest block">
                {language === 'English' ? 'PRIMARY REGIONAL FOCUS' : 'முக்கிய மண்டல இலக்கு'}
              </span>
              <p className="text-base font-bold text-white leading-snug">
                {language === 'English' ? meta.focus_en : meta.focus_ta}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-extrabold uppercase">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-slate-400 block">{language === 'English' ? 'RURAL / URBAN MIX' : 'கிராமப்புற விகிதம்'}</span>
                <span className="text-base font-black text-emerald-400">
                  {distName === 'Chennai' ? '5% Rural / 95% Urban' : '65% Rural / 35% Urban'}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-slate-400 block">{language === 'English' ? 'COMPLETED SCHEMES' : 'நிறைவேற்றப்பட்ட திட்டங்கள்'}</span>
                <span className="text-base font-black text-amber-400">94%+ Delivery Rate</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 space-y-1.5">
              <span className="text-3xs font-black text-emerald-400 uppercase tracking-widest block">
                {language === 'English' ? 'KEY WELFARE PROJECTS' : 'முக்கிய மக்கள் நல திட்டங்கள்'}
              </span>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                {language === 'English'
                  ? `Active community welfare infrastructure, solar crop pumps, drinking water pipelines, and self-help group revolving funds in ${distName}.`
                  : `${distName} மாவட்டத்தில் குடிநீர் திட்டம், விவசாய பம்ப்செட் மின்சாரம், மகளிர் சுயஉதவிக் குழு சுழல்நிதி மற்றும் சாலை வசதிகள்.`}
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Leadership */}
        {selectedTab === 'leadership' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <span className="text-3xs font-black text-amber-400 uppercase tracking-widest block">
                {language === 'English' ? 'AIADMK DISTRICT SECRETARY' : 'அதிமுக மாவட்டச் செயலாளர்'}
              </span>
              <h4 className="text-lg font-black text-white">{meta.sec_en}</h4>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <span className="text-3xs font-black text-emerald-400 uppercase tracking-widest block">
                {language === 'English' ? 'DISTRICT HEADQUARTERS' : 'மாவட்டக் கழக அலுவலகம்'}
              </span>
              <p className="text-xs text-slate-200 font-bold">📍 {meta.hq_en}</p>
            </div>
          </div>
        )}

        {/* Tab 3: News */}
        {selectedTab === 'news' && (
          <div className="space-y-3 animate-fadeIn max-h-[340px] overflow-y-auto pr-1">
            {displayNews.map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-wider">
                  {distName} News Update
                </span>
                <h5 className="text-sm font-bold text-white leading-snug">
                  {language === 'English' ? (item.title_en || item.title) : (item.title_ta || item.title)}
                </h5>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {language === 'English' ? (item.desc_en || item.desc) : (item.desc_ta || item.desc)}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Assembly Seats & Wards */}
        {selectedTab === 'constituencies' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {constList.map((c, idx) => {
                const cEn = typeof c === 'object' ? c.en : c;
                const cTa = TN_CONSTITUENCY_TAMIL_NAMES[cEn] || (typeof c === 'object' && c.ta && c.ta !== cEn ? c.ta : cEn);
                const cName = language === 'English' ? cEn : cTa;
                return (
                  <div key={idx} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs font-extrabold text-white flex items-center justify-between">
                    <span>{cName}</span>
                    <span className="text-3xs font-black text-amber-400">Seat #{idx + 1}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer CTAs */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={() => {
              setSelectedDistrict(distName);
              if (constList.length > 0) {
                const first = constList[0];
                setSelectedConstituency(typeof first === 'object' ? first.en : first);
              }
              onClose();
              setActiveView('raise');
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-black text-xs uppercase tracking-widest shadow-lg flex items-center justify-center gap-2"
          >
            <span>{language === 'English' ? `Voice Grievance for ${distName}` : `${distName} கோரிக்கையைப் பதிவிடுக`}</span>
            <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
          </button>

          {(!userRole || (userRole !== 'admin' && userRole !== 'leader')) && (
            <button
              onClick={() => {
                onClose();
                setRedirectAfterAuth('constituency');
                setShowAuthModal(true);
              }}
              className="px-5 py-3 rounded-xl bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider hover:bg-amber-300 transition shadow-md whitespace-nowrap"
            >
              {language === 'English' ? 'Leader Sign In' : 'நிர்வாகி உள்நுழைவு'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}


export default function FeedbackPage() {
  const navigate = useNavigate();
  const sliderRef = React.useRef(null);
  const timelineScrollRef = React.useRef(null);
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
  const [signupPhone, setSignupPhone] = useState('');
  const [signupDob, setSignupDob] = useState('');

  // ─── SUBMISSION FORM STATES ───
  const [formStep, setFormStep] = useState(1); // 1: Location, 2: Category, 3: Details, 4: Success
  const [selectedState, setSelectedState] = useState('Tamil Nadu');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedConstituency, setSelectedConstituency] = useState('');
  const [localBody, setLocalBody] = useState('');
  const [wardVillage, setWardVillage] = useState('');

  const [selectedCategory, setSelectedCategory] = useState('');

  const [feedbackTitle, setFeedbackTitle] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [rating, setRating] = useState(5);
  const [importance, setImportance] = useState('Medium');
  const [needResponse, setNeedResponse] = useState('No');
  const [anonymous, setAnonymous] = useState('No');
  const [citizenName, setCitizenName] = useState('');
  const [citizenAge, setCitizenAge] = useState('');
  const [boothNo, setBoothNo] = useState(''); // Mobile/Contact
  const [expectedSolution, setExpectedSolution] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [submissionResult, setSubmissionResult] = useState(null); // { feedback_id, tracking_id }

  // ─── TRACKING FORM STATES ───
  const [trackId, setTrackId] = useState('');
  const [trackResult, setTrackResult] = useState(null);
  const [trackLoading, setTrackLoading] = useState(false);

  // ─── LEADER/CONSTITUENCY STATISTICS ───
  const [leaderDistrict, setLeaderDistrict] = useState(localStorage.getItem('user_district') || '');
  const [leaderConstituency, setLeaderConstituency] = useState(() => {
    const val = localStorage.getItem('user_constituency');
    return (val && val !== 'None' && val !== 'null') ? val : '';
  });
  const [leaderFilterDistrict, setLeaderFilterDistrict] = useState(localStorage.getItem('user_district') || '');
  const [leaderFilterConstituency, setLeaderFilterConstituency] = useState(() => {
    const val = localStorage.getItem('user_constituency');
    return (val && val !== 'None' && val !== 'null') ? val : '';
  });
  const [constituencyFeedbacks, setConstituencyFeedbacks] = useState([]);
  const [allFeedbacks, setAllFeedbacks] = useState([]);
  const [leaderLoading, setLeaderLoading] = useState(false);

  // ─── DYNAMIC ADMK NEWS / PRESS RELEASES STATES ───
  const [pressReleases, setPressReleases] = useState(INITIAL_PRESS_RELEASES);
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
  const [galleryPhotos, setGalleryPhotos] = useState(INITIAL_GALLERY_PHOTOS);
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
        if (Array.isArray(data) && data.length > 0) {
          setGalleryPhotos(data);
        }
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
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        Swal.fire({
          title: language === 'English' ? 'Uploaded!' : 'பதிவேற்றப்பட்டது!',
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
  const [legacyLoading, setLegacyLoading] = useState(false);
  const [legacyFilter, setLegacyFilter] = useState('All');
  const [legacySubView, setLegacySubView] = useState('history'); // 'history' | 'schemes'
  const [legacyDropdownOpen, setLegacyDropdownOpen] = useState(false);
  const [schemesSearch, setSchemesSearch] = useState('');
  const [schemesEraFilter, setSchemesEraFilter] = useState('All');
  const [schemesCategoryFilter, setSchemesCategoryFilter] = useState('All');
  const [schemesPeopleFilter, setSchemesPeopleFilter] = useState('All');
  const [schemesTypeFilter, setSchemesTypeFilter] = useState('All');
  const [activeStoryIdx, setActiveStoryIdx] = useState(0); // For impact stories
  const [typedTitle, setTypedTitle] = useState('');
  const [titleTypingDone, setTitleTypingDone] = useState(false);
  const [typedSchemesTitle, setTypedSchemesTitle] = useState('');
  const [schemesTitleTypingDone, setSchemesTitleTypingDone] = useState(false);
  const [bjpJourneyIdx, setBjpJourneyIdx] = useState(0); // 0 to 12 for BJP-style timeline slider
  const [isAutoSlidePaused, setIsAutoSlidePaused] = useState(false);
  const [isStoryPaused, setIsStoryPaused] = useState(false);

  // Auto-sliding Effect for ADMK History Timeline (4-second interval)
  useEffect(() => {
    if (activeView === 'legacy' && legacySubView === 'history' && !isAutoSlidePaused) {
      const timer = setInterval(() => {
        setBjpJourneyIdx(prev => (prev + 1) % ADMK_JOURNEY_TIMELINE.length);
      }, 4000); // 4 seconds per slide
      return () => clearInterval(timer);
    }
  }, [activeView, legacySubView, isAutoSlidePaused]);

  // Auto-sliding Effect for Impact Stories in Schemes View (3.5-second interval)
  useEffect(() => {
    if (activeView === 'legacy' && legacySubView === 'schemes' && !isStoryPaused) {
      const timer = setInterval(() => {
        setActiveStoryIdx(prev => (prev + 1) % 5);
      }, 3500);
      return () => clearInterval(timer);
    }
  }, [activeView, legacySubView, isStoryPaused]);

  // Close LEGACY dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (legacyDropdownOpen && !e.target.closest('.legacy-dropdown-container')) {
        setLegacyDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [legacyDropdownOpen]);

  // --- NEW FEATURES STATES ---
  // A. Quiz States
  const [quizStep, setQuizStep] = useState('intro'); // 'intro' | 'question' | 'result'
  const [quizQuestionIdx, setQuizQuestionIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSelectedAns, setQuizSelectedAns] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // B. TN 2031 Future Vision / Idea Wall States
  const [showIdeaModal, setShowIdeaModal] = useState(false);
  const [newIdeaText, setNewIdeaText] = useState('');
  const [newIdeaCategory, setNewIdeaCategory] = useState('Jobs');
  const [newIdeaAuthor, setNewIdeaAuthor] = useState('');
  const [tn2031Ideas, setTn2031Ideas] = useState(() => {
    try {
      const saved = localStorage.getItem('tn_2031_ideas');
      return saved ? JSON.parse(saved) : [
        { id: 1, category: 'Jobs', text: 'Promote tech hubs in tier-2 cities like Trichy and Salem to retain local talent.', author: 'Karthik', date: 'Just now' },
        { id: 2, category: 'Education', text: 'Integrate coding and entrepreneurship courses early in high school curriculums.', author: 'Divya', date: '5 mins ago' },
        { id: 3, category: 'Sustainability', text: 'Encourage mass solar panel installations across rural cooperative farming societies.', author: 'Ramanathan', date: '10 mins ago' }
      ];
    } catch (e) {
      return [
        { id: 1, category: 'Jobs', text: 'Promote tech hubs in tier-2 cities like Trichy and Salem to retain local talent.', author: 'Karthik', date: 'Just now' },
        { id: 2, category: 'Education', text: 'Integrate coding and entrepreneurship courses early in high school curriculums.', author: 'Divya', date: '5 mins ago' },
        { id: 3, category: 'Sustainability', text: 'Encourage mass solar panel installations across rural cooperative farming societies.', author: 'Ramanathan', date: '10 mins ago' }
      ];
    }
  });

  // C. People Remember Scrapbook States
  const [showMemoryModal, setShowMemoryModal] = useState(false);
  const [newMemoryText, setNewMemoryText] = useState('');
  const [newMemoryAuthor, setNewMemoryAuthor] = useState('');
  const [newMemoryYear, setNewMemoryYear] = useState('1982');
  const [newMemoryImageIdx, setNewMemoryImageIdx] = useState(0);
  const [scrapbookMemories, setScrapbookMemories] = useState(() => {
    try {
      const saved = localStorage.getItem('scrapbook_memories');
      return saved ? JSON.parse(saved) : [
        { id: 1, text: "I remember attending my first MGR rally in Madurai in 1980. The energy of the crowd and his charismatic speech still gives me goosebumps.", author: "Subramanian (68)", year: "1980", imgIdx: 0 },
        { id: 2, text: "My mother received a gold assistance card for marriage from Amma. It helped our family cover wedding costs and was a huge support.", author: "Kokila (35)", year: "2011", imgIdx: 1 },
        { id: 3, text: "The Kudimaramathu desilting scheme helped revive our village lake under EPS leadership, securing water supply for the summer crops.", author: "Selvam (42)", year: "2018", imgIdx: 2 }
      ];
    } catch (e) {
      return [
        { id: 1, text: "I remember attending my first MGR rally in Madurai in 1980. The energy of the crowd and his charismatic speech still gives me goosebumps.", author: "Subramanian (68)", year: "1980", imgIdx: 0 },
        { id: 2, text: "My mother received a gold assistance card for marriage from Amma. It helped our family cover wedding costs and was a huge support.", author: "Kokila (35)", year: "2011", imgIdx: 1 },
        { id: 3, text: "The Kudimaramathu desilting scheme helped revive our village lake under EPS leadership, securing water supply for the summer crops.", author: "Selvam (42)", year: "2018", imgIdx: 2 }
      ];
    }
  });

  // D. Public Constituency & Interactive TN District Map states
  const [publicConstituencySearch, setPublicConstituencySearch] = useState('');
  const [selectedPublicDistrict, setSelectedPublicDistrict] = useState('');
  const [selectedPublicConstituency, setSelectedPublicConstituency] = useState('');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState('All');
  const [selectedDistrictTab, setSelectedDistrictTab] = useState('overview');
  const [constituencyMapViewMode, setConstituencyMapViewMode] = useState('visual'); // 'visual' | 'grid'
  const [selectedModalDistrict, setSelectedModalDistrict] = useState(null);
  const [constituencyStats, setConstituencyStats] = useState({ total: 0, resolved: 0, pending: 0 });
  const [statsLoading, setStatsLoading] = useState(false);

  const TN_DISTRICT_REGIONS = {
    // Northern Region
    Chennai: { region: 'North', region_ta: 'வட தமிழகம்', icon: '🏙️', focus_en: 'Urban Mobility & Infrastructure', focus_ta: 'நகர்ப்புற வசதிகள் & போக்குவரத்து', sec_en: 'Thiru. D. Jayakumar (District Sec.)', hq_en: 'Puratchi Thalaivar MGR Maaligai, Royapettah, Chennai' },
    Thiruvallur: { region: 'North', region_ta: 'வட தமிழகம்', icon: '🏭', focus_en: 'Industrial Corridors & Port Infrastructure', focus_ta: 'தொழில்நுட்ப பூங்கா & துறைமுக கட்டமைப்பு', sec_en: 'Thiru. P. Benjamin (Ex-Minister)', hq_en: 'ADMK District Office, Avadi, Thiruvallur' },
    Kanchipuram: { region: 'North', region_ta: 'வட தமிழகம்', icon: '🛕', focus_en: 'Silk Weaving, Heritage & Industrial Clusters', focus_ta: 'பட்டு நெசவு & பாரம்பரிய தொழில் வளர்ச்சி', sec_en: 'Thiru. V. Somasundaram', hq_en: 'ADMK District Office, Kanchipuram' },
    Chengalpattu: { region: 'North', region_ta: 'வட தமிழகம்', icon: '🏢', focus_en: 'IT Parks, Auto Hubs & Coastal Safety', focus_ta: 'தகவல் தொழில்நுட்பம் & வாகன உற்பத்தி', sec_en: 'Thiru. Chitlapakkam Rajendra', hq_en: 'ADMK District Office, Tambaram' },
    Ranipet: { region: 'North', region_ta: 'வட தமிழகம்', icon: '👞', focus_en: 'Leather Export Units & Environmental Safety', focus_ta: 'தோல் ஏற்றுமதி தொழில் & சுற்றுச்சூழல்', sec_en: 'Thiru. S. M. Sugumar', hq_en: 'ADMK District Office, Ranipet' },
    Vellore: { region: 'North', region_ta: 'வட தமிழகம்', icon: '🏥', focus_en: 'Healthcare Hub, Higher Education & Tannery Relief', focus_ta: 'மருத்துவ மையம் & உயர்கல்வி வளர்ச்சி', sec_en: 'Thiru. S. R. K. Appavu', hq_en: 'ADMK District Office, Vellore' },
    Tirupathur: { region: 'North', region_ta: 'வட தமிழகம்', icon: '🌲', focus_en: 'Hilly Agriculture, Eco-tourism & Tribal Welfare', focus_ta: 'மலைவாழ் மக்கள் நலன் & வனப்பகுதி வளர்ச்சி', sec_en: 'Thiru. K. C. Veeramani (Ex-Minister)', hq_en: 'ADMK District Office, Vaniyambadi' },
    Thiruvannamalai: { region: 'North', region_ta: 'வட தமிழகம்', icon: '🛕', focus_en: 'Spiritual Tourism, Lake Desilting & Milk Cooperatives', focus_ta: 'ஆன்மீக சுற்றுலா & ஏரி தூர்வாருதல்', sec_en: 'Thiru. Agri S. S. Krishnamoorthy', hq_en: 'ADMK District Office, Thiruvannamalai' },
    Villupuram: { region: 'North', region_ta: 'வட தமிழகம்', icon: '🌾', focus_en: 'Sugar Mills, Farmer Loan Relief & Rural Education', focus_ta: 'சர்க்கரை ஆலைகள் & பயிர்க்கடன் தள்ளுபடி', sec_en: 'Thiru. C. Ve. Shanmugam (Ex-Minister)', hq_en: 'ADMK District Office, Villupuram' },
    Kallakurichi: { region: 'North', region_ta: 'வட தமிழகம்', icon: '⛰️', focus_en: 'Hill Tribal Development & Agricultural Support', focus_ta: 'மலை கிராமங்கள் & விவசாய மேம்பாடு', sec_en: 'Thiru. R. Kumaraguru', hq_en: 'ADMK District Office, Kallakurichi' },
    Cuddalore: { region: 'North', region_ta: 'வட தமிழகம்', icon: '⚓', focus_en: 'Cashew Industry, Coastal Relief & Lignite Mining Support', focus_ta: 'முந்திரி உற்பத்தி & கடலோரப் பாதுகாப்பு', sec_en: 'Thiru. M. C. Sampath (Ex-Minister)', hq_en: 'ADMK District Office, Cuddalore' },

    // Western Region (Kongu)
    Salem: { region: 'West', region_ta: 'கொங்கு மண்டலம்', icon: '👑', focus_en: 'Specialty Steel, Textiles & Sarabanga Lift Irrigation', focus_ta: 'சரபங்கா எற்று நீர்ப்பாசனம் & ஜவுளி மையம்', sec_en: 'Hon’ble Edappadi K. Palaniswami (General Sec.)', hq_en: 'Puratchi Thalaivi Amma Maaligai, Salem' },
    Coimbatore: { region: 'West', region_ta: 'கொங்கு மண்டலம்', icon: '🚀', focus_en: 'Engineering Exports, Defense Corridor & Flyovers', focus_ta: 'தொழில்துறை ஏற்றுமதி & உள்கட்டமைப்பு', sec_en: 'Thiru. S. P. Velumani (Ex-Minister)', hq_en: 'ADMK District Office, Coimbatore' },
    Tiruppur: { region: 'West', region_ta: 'கொங்கு மண்டலம்', icon: '👕', focus_en: 'Knitwear Dollar City, Effluent Treatment & Labor Welfare', focus_ta: 'பின்னலாடை தொழில் மையம் & தொழிலாளர் நலன்', sec_en: 'Thiru. Pollachi V. Jayaraman (Ex-Speaker)', hq_en: 'ADMK District Office, Tiruppur' },
    Erode: { region: 'West', region_ta: 'கொங்கு மண்டலம்', icon: '🌾', focus_en: 'Turmeric Hub, Lower Bhavani Canal & Textile Dyes', focus_ta: 'மஞ்சள் வணிக மையம் & பவானி பாசனத் திட்டம்', sec_en: 'Thiru. K. A. Sengottaiyan (Ex-Minister)', hq_en: 'ADMK District Office, Erode' },
    Nilgiris: { region: 'West', region_ta: 'கொங்கு மண்டலம்', icon: '🍃', focus_en: 'Tea Smallholders, Eco-tourism & Tribal Healthcare', focus_ta: 'தேயிலை விவசாயிகள் & மலைப்பாதை பராமரிப்பு', sec_en: 'Thiru. Rambabu', hq_en: 'ADMK District Office, Udhagamandalam' },
    Namakkal: { region: 'West', region_ta: 'கொங்கு மண்டலம்', icon: '🥚', focus_en: 'Poultry Hub, Lorry Bodybuilding & Water Canal Works', focus_ta: 'முட்டை உற்பத்தி & லாரி கட்டமைப்பு மையம்', sec_en: 'Thiru. P. Thangamani (Ex-Minister)', hq_en: 'ADMK District Office, Namakkal' },
    Dharmapuri: { region: 'West', region_ta: 'கொங்கு மண்டலம்', icon: '💧', focus_en: 'Cauvery Surplus Water Scheme & Horticulture Export', focus_ta: 'ஒகேனக்கல் குடிநீர் & உபரினீர் பாசனத் திட்டம்', sec_en: 'Thiru. K. P. Anbalagan (Ex-Minister)', hq_en: 'ADMK District Office, Dharmapuri' },
    Krishnagiri: { region: 'West', region_ta: 'கொங்கு மண்டலம்', icon: '🥭', focus_en: 'Mango Processing, EV Manufacturing Hub & Granite Units', focus_ta: 'மாம்பழ பதப்படுத்துதல் & எலக்ட்ரிக் வாகன மையம்', sec_en: 'Thiru. V. Govindaraj', hq_en: 'ADMK District Office, Krishnagiri' },

    // Central & Delta Region
    Tiruchirappalli: { region: 'Central', region_ta: 'மத்திய & டெல்டா', icon: '🕌', focus_en: 'Cauvery Riverbed Protection, Fabrication & Central Transport', focus_ta: 'காாவேரி பாசனம் & மத்திய தொழில் மையம்', sec_en: 'Thiru. Vellamandi N. Natarajan', hq_en: 'ADMK District Office, Trichy' },
    Thanjavur: { region: 'Central', region_ta: 'மத்திய & டெல்டா', icon: '🌾', focus_en: 'Protected Agricultural Zone, Paddy Procurement & Heritage', focus_ta: 'பாதுகாக்கப்பட்ட வேளாண் மண்டலம் & நெல் கொள்முதல்', sec_en: 'Thiru. R. Vaithilingam', hq_en: 'ADMK District Office, Thanjavur' },
    Tiruvarur: { region: 'Central', region_ta: 'மத்திய & டெல்டா', icon: '🚜', focus_en: 'Delta Canal Desilting & Paddy Farmers Relief', focus_ta: 'டெல்டா பாசன கால்வாய் தூர்வாருதல்', sec_en: 'Thiru. R. Kamaraj (Ex-Minister)', hq_en: 'ADMK District Office, Tiruvarur' },
    Nagapattinam: { region: 'Central', region_ta: 'மத்திய & டெல்டா', icon: '🐟', focus_en: 'Fishermen Safety, Cold Storage & Coastal Embankment', focus_ta: 'மீனவர் பாதுகாப்பு & குளிர்சாதன கிடங்கு', sec_en: 'Thiru. O. S. Manian (Ex-Minister)', hq_en: 'ADMK District Office, Nagapattinam' },
    Mayiladuthurai: { region: 'Central', region_ta: 'மத்திய & டெல்டா', icon: '🌊', focus_en: 'Poompuhar Coastal Infrastructure & Rural Temple Welfare', focus_ta: 'பூம்புகார் கடலோர வசதிகள் & பாசன ஆதரவு', sec_en: 'Thiru. S. Pavunraj', hq_en: 'ADMK District Office, Mayiladuthurai' },
    Karur: { region: 'Central', region_ta: 'மத்திய & டெல்டா', icon: '🧺', focus_en: 'Home Textile Exports, Bus Bodybuilding & Canal Ring', focus_ta: 'ஜவுளி ஏற்றுமதி & பஸ் பாடி கட்டமைப்பு', sec_en: 'Thiru. M. R. Vijayabhaskar (Ex-Minister)', hq_en: 'ADMK District Office, Karur' },
    Perambalur: { region: 'Central', region_ta: 'மத்திய & டெல்டா', icon: '🌱', focus_en: 'Maize & Shallot Processing Units, Industrial Park', focus_ta: 'மக்காச்சோளம் & சின்ன வெங்காய பதப்படுத்துதல்', sec_en: 'Thiru. R. T. Ramachandran', hq_en: 'ADMK District Office, Perambalur' },
    Ariyalur: { region: 'Central', region_ta: 'மத்திய & டெல்டா', icon: '🧱', focus_en: 'Cement Factories, Fossil Heritage & Irrigation Canals', focus_ta: 'சிமெண்ட் ஆலைகள் & பாசன கால்வாய்கள்', sec_en: 'Thiru. Thamarai S. Rajendran', hq_en: 'ADMK District Office, Ariyalur' },
    Pudukkottai: { region: 'Central', region_ta: 'மத்திய & டெல்டா', icon: '🏛️', focus_en: 'Traditional Architecture, Groundnut Crops & Lake Desilting', focus_ta: 'நிலக்கடலை சாகுபடி & ஏரி சீரமைப்பு', sec_en: 'Thiru. C. Vijayabaskar (Ex-Minister)', hq_en: 'ADMK District Office, Pudukkottai' },

    // Southern Region
    Madurai: { region: 'South', region_ta: 'தென் தமிழகம்', icon: '🏛️', focus_en: 'AIIMS Infrastructure, Cultural Heritage & Ring Road', focus_ta: 'எய்ம்ஸ் மருத்துவமனை & கலாச்சார பாரம்பரியம்', sec_en: 'Thiru. Sellur K. Raju (Ex-Minister)', hq_en: 'ADMK District Office, Madurai' },
    Dindigul: { region: 'South', region_ta: 'தென் தமிழகம்', icon: '🔒', focus_en: 'Lock Industry, Vegetable Markets & Sirumalai Eco-Tourism', focus_ta: 'பூட்டு தொழில் & சிறுமலை விவசாய மேம்பாடு', sec_en: 'Thiru. C. Sreenivasan (Ex-Minister)', hq_en: 'ADMK District Office, Dindigul' },
    Theni: { region: 'South', region_ta: 'தென் தமிழகம்', icon: '🍇', focus_en: 'Mullaperiyar Water Line, Cumbum Grape Farms & Spices', focus_ta: 'முல்லைப்பொரியாறு நீர் மேலாண்மை & திராட்சை சாகுபடி', sec_en: 'Thiru. S. T. K. Jakkaiyan', hq_en: 'ADMK District Office, Theni' },
    Virudhunagar: { region: 'South', region_ta: 'தென் தமிழகம்', icon: '🎆', focus_en: 'Fireworks Safety Standards, Printing Industry & Textiles', focus_ta: 'பட்டாசு தொழில் பாதுகாப்பு & அச்சுக்கலை மையம்', sec_en: 'Thiru. K. T. Rajenthra Bhalaji (Ex-Minister)', hq_en: 'ADMK District Office, Virudhunagar' },
    Sivagangai: { region: 'South', region_ta: 'தென் தமிழகம்', icon: '📜', focus_en: 'Freedom Heritage (Keezhadi), Irrigation Tanks & Rural Craft', focus_ta: 'கீழடி தொல்லியல் பெருமை & நீர்நிலை பாதுகாப்பு', sec_en: 'Thiru. PR. Senthilnathan', hq_en: 'ADMK District Office, Sivagangai' },
    Ramanathapuram: { region: 'South', region_ta: 'தென் தமிழகம்', icon: '⚓', focus_en: 'Desalination Plants, Island Tourism & Deep-Sea Fisheries', focus_ta: 'கடல்நீர் குடிநீராக்கும் திட்டம் & ஆழ்கடல் மீன்பிடி', sec_en: 'Thiru. M. Manikandan (Ex-Minister)', hq_en: 'ADMK District Office, Ramanathapuram' },
    Tirunelveli: { region: 'South', region_ta: 'தென் தமிழகம்', icon: '🌊', focus_en: 'Tamiraparani River Protection, Renewable Wind Energy & Tech', focus_ta: 'தாமிரபரணி நீர் மேலாண்மை & காற்றாலை மின்சாரம்', sec_en: 'Thiru. Thachai N. Ganesan', hq_en: 'ADMK District Office, Tirunelveli' },
    Tenkasi: { region: 'South', region_ta: 'தென் தமிழகம்', icon: '🏞️', focus_en: 'Courtallam Tourism, Agricultural Produce & Western Ghats Safety', focus_ta: 'குற்றாலம் சுற்றுலா & மேற்குத் தொடர்ச்சி மலை பாதுகாப்பு', sec_en: 'Thiru. Selvamohandas Pandian', hq_en: 'ADMK District Office, Tenkasi' },
    Thoothukudi: { region: 'South', region_ta: 'தென் தமிழகம்', icon: '⚓', focus_en: 'VOC Port Expansion, Salt Pans & Heavy Chemical Industries', focus_ta: 'வ.உ.சி துறைமுக விரிவாக்கம் & உப்பளத் தொழிலாளர் நலன்', sec_en: 'Thiru. S. T. Chellapandian', hq_en: 'ADMK District Office, Thoothukudi' },
    Kanniyakumari: { region: 'South', region_ta: 'தென் தமிழகம்', icon: '🌅', focus_en: 'Rubber Plantations, Seaport Safety & International Tourism', focus_ta: 'ரப்பர் தோட்டம் & சர்வதேச சுற்றுலா மேம்பாடு', sec_en: 'Thiru. D. John Thangam', hq_en: 'ADMK District Office, Nagercoil' }
  };

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
        setActiveIndex(0);
      }
    } catch (err) {
      console.error("Error fetching legacy milestones:", err);
    } finally {
      setLegacyLoading(false);
    }
  };

  const handleUploadLegacyMilestone = async (e) => {
    e.preventDefault();
    if (!uploadMilestoneYear || !uploadMilestoneTitleTa || !uploadMilestoneDescTa) {
      Swal.fire('Error', 'Please fill in all required fields (Year, Title TA, Desc TA)', 'error');
      return;
    }
    try {
      setUploadMilestoneLoading(true);
      const payload = {
        year: parseInt(uploadMilestoneYear),
        title_en: uploadMilestoneTitleEn,
        title_ta: uploadMilestoneTitleTa,
        desc_en: uploadMilestoneDescEn,
        desc_ta: uploadMilestoneDescTa,
        category_en: uploadMilestoneCategoryEn,
        category_ta: uploadMilestoneCategoryTa
      };

      const res = await fetch(API + '/api/legacy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        Swal.fire({
          title: language === 'English' ? 'Published!' : 'பதிவேற்றப்பட்டது!',
          text: language === 'English' ? 'Milestone published successfully.' : 'சாதனை வெற்றிகரமாக பதிவேற்றப்பட்டது.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
        setUploadMilestoneYear('');
        setUploadMilestoneTitleEn('');
        setUploadMilestoneTitleTa('');
        setUploadMilestoneDescEn('');
        setUploadMilestoneDescTa('');
        fetchLegacy();
      } else {
        Swal.fire('Error', 'Failed to publish milestone', 'error');
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Network error publishing milestone', 'error');
    } finally {
      setUploadMilestoneLoading(false);
    }
  };

  const handleDeleteLegacyMilestone = async (id) => {
    const confirm = await Swal.fire({
      title: language === 'English' ? 'Are you sure?' : 'நிச்சயமாகவா?',
      text: language === 'English' ? 'This milestone will be permanently deleted.' : 'இந்த சாதனை மைல்கல் நிரந்தரமாக நீக்கப்படும்.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: language === 'English' ? 'Yes, delete!' : 'ஆம், நீக்கு!'
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(API + `/api/legacy/${id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          Swal.fire({
            title: language === 'English' ? 'Deleted!' : 'நீக்கப்பட்டது!',
            text: language === 'English' ? 'Milestone deleted successfully.' : 'சாதனை வெற்றிகரமாக நீக்கப்பட்டது.',
            icon: 'success',
            timer: 1200,
            showConfirmButton: false
          });
          fetchLegacy();
        } else {
          Swal.fire('Error', 'Failed to delete milestone', 'error');
        }
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Network error deleting milestone', 'error');
      }
    }
  };

  const fetchPressReleases = async () => {
    try {
      setPressReleasesLoading(true);
      const res = await fetch(API + '/api/press-releases');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setPressReleases(data);
        }
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

  const fetchConstituencyFeedbacks = async () => {
    try {
      setLeaderLoading(true);
      const res = await fetch(API + '/api/feedbacks');
      if (res.ok) {
        const data = await res.json();
        setAllFeedbacks(data);

        // District-wise statistics access restriction:
        // Constituency Leaders only see grievances & statistics for their assigned district
        // Super Admin (admin) sees system-wide statistics across all districts
        if (userRole === 'leader' && leaderDistrict) {
          const filtered = data.filter(item => {
            const itemDist = (item.district || item.location?.district || '').toLowerCase();
            const itemConst = (item.constituency || item.location?.constituency || '').toLowerCase();
            const matchDistrict = itemDist === leaderDistrict.toLowerCase();
            const matchConst = !leaderConstituency || itemConst === leaderConstituency.toLowerCase();
            return matchDistrict && matchConst;
          });
          setConstituencyFeedbacks(filtered);
        } else {
          setConstituencyFeedbacks(data);
        }
      }
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
    } finally {
      setLeaderLoading(false);
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
    if (activeView === 'constituency') {
      fetchConstituencyFeedbacks();
      if (userRole === 'admin') {
        fetchNewsInbox();
        fetchPressReleases();
        fetchGallery();
        fetchLegacy();
      }
    }
  }, [activeView, userRole, leaderDistrict, leaderConstituency]);

  useEffect(() => {
    localStorage.setItem('tn_2031_ideas', JSON.stringify(tn2031Ideas));
  }, [tn2031Ideas]);

  useEffect(() => {
    localStorage.setItem('scrapbook_memories', JSON.stringify(scrapbookMemories));
  }, [scrapbookMemories]);

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

  useEffect(() => {
    if (activeView !== 'legacy' || legacySubView !== 'schemes') {
      setTypedSchemesTitle('');
      setSchemesTitleTypingDone(false);
      return;
    }
    const fullText = language === 'English'
      ? "Welfare That Touched Lives. Development That Shaped Tamil Nadu."
      : "மக்களின் வாழ்வை மேம்படுத்திய நலத்திட்டங்கள். தமிழகத்தை செதுக்கிய பெருவளர்ச்சி.";

    setTypedSchemesTitle('');
    setSchemesTitleTypingDone(false);

    let current = '';
    let index = 0;

    const interval = setInterval(() => {
      if (index < fullText.length) {
        current += fullText.charAt(index);
        setTypedSchemesTitle(current);
        index++;
      } else {
        clearInterval(interval);
        setSchemesTitleTypingDone(true);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [activeView, legacySubView, language]);

  useEffect(() => {
    const handleLangChange = () => {
      setLanguageState(getLanguage());
    };
    window.addEventListener("languageChange", handleLangChange);

    // If redirected from routing history with login state, open the modal
    if (location.state?.showLogin) {
      setShowAuthModal(true);
      setActiveTab(location.state?.tab || 'login');
      // Clear location state to prevent modal reopening on page reloads
      window.history.replaceState({}, document.title);
    }

    // Google Sign-In Callback
    window.onGoogleSelect = async (email, name, role) => {
      Swal.fire({
        title: language === 'English' ? 'Signing in...' : 'உள்நுழைக்கிறது...',
        html: language === 'English' ? `Authenticating as <b>${email}</b>` : `<b>${email}</b> ஆக அங்கீகரிக்கிறது`,
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
      });

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
          localStorage.setItem('user_district', data.district || '');
          localStorage.setItem('user_constituency', data.constituency || '');
          setCurrentUser(email);
          setUserRole(data.role);
          setLeaderDistrict(data.district || '');
          setLeaderConstituency(data.constituency || '');
          setLeaderFilterDistrict(data.district || '');
          setLeaderFilterConstituency(data.constituency || '');

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
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (data.message === 'Login success') {
        localStorage.setItem('user', loginEmail);
        localStorage.setItem('role', data.role);
        localStorage.setItem('user_district', data.district || '');
        localStorage.setItem('user_constituency', data.constituency || '');
        setCurrentUser(loginEmail);
        setUserRole(data.role);
        setLeaderDistrict(data.district || '');
        setLeaderConstituency(data.constituency || '');
        setLeaderFilterDistrict(data.district || '');
        setLeaderFilterConstituency(data.constituency || '');
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
    if (!signupName || !signupEmail || !signupPassword || !signupPhone || !signupDob) {
      notify('Input Error', 'All fields are mandatory.', 'warning');
      return;
    }
    try {
      const res = await fetch(API + '/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signupName,
          email: signupEmail,
          password: signupPassword,
          phone: signupPhone,
          dob: signupDob,
        }),
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
      notify(
        language === 'English' ? 'Missing Required Fields' : 'தேவையான விவரங்கள் விடுபட்டுள்ளன',
        language === 'English' ? 'Please complete all required fields (Category, Title, and Problem Description).' : 'வகை, தலைப்பு மற்றும் பிரச்சனை விளக்கம் போன்ற தேவையான விவரங்களை நிரப்பவும்.',
        'warning'
      );
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
    formData.append('need_response', needResponse || 'Yes');
    formData.append('anonymous', 'Yes'); // Appears anonymous to users
    formData.append('email', currentUser || 'citizen@portal.local');
    formData.append('solution', expectedSolution || '');
    formData.append('name', citizenName || (currentUser ? currentUser.split('@')[0] : 'Registered Citizen'));
    formData.append('age', citizenAge ? parseInt(citizenAge) : 30);
    formData.append('booth_no', boothNo || 'Verified User'); // Contact details logged for DB
    if (attachedFile) {
      formData.append('image', attachedFile);
    }

    try {
      const res = await fetch(API + '/api/feedback', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && (data.tracking_id || data.feedback_id || data.message === 'Feedback received')) {
        const trackingId = data.tracking_id || data.feedback_id || 'INF-SUCCESS';
        const feedbackId = data.feedback_id || data.tracking_id || 'INF-SUCCESS';
        setSubmissionResult({
          feedback_id: feedbackId,
          tracking_id: trackingId,
        });
        setFormStep(4); // Success step
        notify('Submitted', `Thank you for your feedback! Tracking ID: ${trackingId}`, 'success');
      } else {
        notify('Error', data.detail || data.message || 'Failed to submit grievance.', 'error');
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
    const queryId = trackId.trim();
    if (!queryId) {
      notify(
        language === 'English' ? 'Required' : 'தேவை',
        language === 'English' ? 'Please enter a valid Tracking ID.' : 'செல்லுபடியாகும் பிஃட்பேக் ஐடி உள்ளிடவும்.',
        'warning'
      );
      return;
    }
    setTrackLoading(true);
    setTrackResult(null);
    try {
      let res = await fetch(API + `/api/feedback/track/${encodeURIComponent(queryId)}`);
      if (!res.ok) {
        res = await fetch(API + `/api/feedback/${encodeURIComponent(queryId)}`);
      }
      if (res.ok) {
        const data = await res.json();
        setTrackResult(data);
      } else {
        const errData = await res.json().catch(() => ({}));
        notify(
          language === 'English' ? 'Not Found' : 'கண்டுபிடிக்கப்படவில்லை',
          errData.detail || (language === 'English' ? 'No grievance record matches this Tracking ID.' : 'இந்தக் கண்காணிப்பு ஐடிக்கு விவரங்கள் எதுவும் கிடைக்கவில்லை.'),
          'warning'
        );
      }
    } catch (err) {
      console.error('Tracking Error:', err);
      notify(
        language === 'English' ? 'Server Error' : 'சேவையகப் பிழை',
        language === 'English' ? 'Failed to connect to tracking services.' : 'கண்காணிப்புச் சேவையைத் தொடர்புகொள்ள முடியவில்லை.',
        'error'
      );
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
    if (!leaderFilterDistrict) return;
    setLeaderLoading(true);
    try {
      const res = await fetch(API + '/api/feedbacks');
      if (res.ok) {
        const data = await res.json();
        setAllFeedbacks(data);
        const filtered = data.filter(item => {
          const itemDist = (item.district || item.location?.district || '').toLowerCase();
          const itemConst = (item.constituency || item.location?.constituency || '').toLowerCase();
          const matchDistrict = itemDist === leaderFilterDistrict.toLowerCase();
          const matchConst = !leaderFilterConstituency || itemConst === leaderFilterConstituency.toLowerCase();
          return matchDistrict && matchConst;
        });
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

  const computeConstituencyStats = (district, constituency, feedbacks) => {
    const filtered = feedbacks.filter(item => {
      const itemDist = (item.district || item.location?.district || '').toLowerCase();
      const itemConst = (item.constituency || item.location?.constituency || '').toLowerCase();
      return itemDist === district.toLowerCase() && itemConst === constituency.toLowerCase();
    });

    const resolved = filtered.filter(f => ['Solved', 'Resolved'].includes(f.status)).length;
    const pending = filtered.filter(f => !['Solved', 'Resolved'].includes(f.status)).length;

    return { total: filtered.length, resolved, pending };
  };

  const loadPublicConstituencyStats = async (district, constituency) => {
    if (!district || !constituency) return;
    setStatsLoading(true);
    try {
      let feedbacks = allFeedbacks;
      if (!feedbacks?.length) {
        const res = await fetch(API + '/api/feedbacks');
        if (res.ok) {
          feedbacks = await res.json();
          setAllFeedbacks(feedbacks);
        } else {
          return;
        }
      }
      setConstituencyStats(computeConstituencyStats(district, constituency, feedbacks));
    } catch (err) {
      console.error('Constituency Stats Error:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    if (activeView === 'constituency') {
      loadConstituencyGrievances();
    }
  }, [leaderFilterDistrict, leaderFilterConstituency, activeView]);

  useEffect(() => {
    if (activeView !== 'constituency') return;
    if (selectedPublicDistrict && selectedPublicConstituency) {
      loadPublicConstituencyStats(selectedPublicDistrict, selectedPublicConstituency);
    }
  }, [activeView, selectedPublicDistrict, selectedPublicConstituency]);

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
    setActiveView('constituency');
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
                className={`text-[10px] font-black tracking-widest uppercase transition duration-300 ${activeView === 'home' ? 'text-white' : 'text-slate-350 hover:text-white'}`}
              >
                {language === 'English' ? 'Home' : 'முகப்பு'}
              </button>
              {/* ─── LEGACY DROPDOWN MENU ─── */}
              <div className="relative legacy-dropdown-container py-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLegacyDropdownOpen(prev => !prev);
                  }}
                  className={`flex items-center gap-1 text-[10px] font-black tracking-widest uppercase transition duration-300 ${activeView === 'legacy' ? 'text-amber-400 font-extrabold' : 'text-slate-350 hover:text-emerald-400'}`}
                >
                  <span>{language === 'English' ? 'LEGACY' : 'பாரம்பரியம்'}</span>
                  <span className={`material-symbols-outlined text-xs transition-transform duration-200 ${legacyDropdownOpen ? 'rotate-180 text-amber-400' : 'text-slate-400'}`}>
                    expand_more
                  </span>
                </button>

                {/* Simple & Clean Dropdown Box */}
                <div
                  className={`absolute left-0 top-full mt-2 w-56 rounded-xl bg-slate-950/95 backdrop-blur-xl border border-emerald-500/30 shadow-2xl p-1.5 transition-all duration-200 z-50 ${legacyDropdownOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}
                >
                  <button
                    onClick={() => {
                      setActiveView('legacy');
                      setLegacySubView('history');
                      setLegacyDropdownOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-bold tracking-wider transition-all duration-200 ${activeView === 'legacy' && legacySubView === 'history' ? 'bg-emerald-700 text-white shadow-sm' : 'text-slate-200 hover:bg-emerald-900/60 hover:text-white'}`}
                  >
                    {language === 'English' ? 'History & Eras' : 'வரலாறு & காலங்கள்'}
                  </button>

                  <button
                    onClick={() => {
                      setActiveView('legacy');
                      setLegacySubView('schemes');
                      setLegacyDropdownOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-bold tracking-wider transition-all duration-200 mt-1 ${activeView === 'legacy' && legacySubView === 'schemes' ? 'bg-emerald-700 text-white shadow-sm' : 'text-slate-200 hover:bg-emerald-900/60 hover:text-white'}`}
                  >
                    {language === 'English' ? 'Schemes & Achievements' : 'திட்டங்கள் & சாதனைகள்'}
                  </button>
                </div>
              </div>
              <button
                onClick={handleGiveFeedbackClick}
                className={`text-[10px] font-black tracking-widest uppercase transition duration-300 ${activeView === 'raise' ? 'text-emerald-400' : 'text-slate-355 hover:text-emerald-400'}`}
              >
                {language === 'English' ? 'Give Feedback' : 'கருத்துக்கள்'}
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

        {/* ─── FULL-SCREEN AUTO-SLIDING HERO CAROUSEL ─── */}
        {activeView === 'home' && (
          <HeroCarousel
            language={language}
            onExploreJourney={() => {
              setActiveView('legacy');
              setLegacySubView('history');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onGiveFeedback={handleGiveFeedbackClick}
          />
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
              {/* ─── PDF SPECIFIED HOME PAGE SECTIONS ─── */}
              <ThreeLeadersSection
                language={language}
                onExploreLeader={(leaderId) => {
                  setActiveView('legacy');
                  setLegacySubView('history');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />

              <GovernanceHomeSection
                language={language}
                onExploreSchemes={() => {
                  setActiveView('legacy');
                  setLegacySubView('schemes');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />

              <Generation2KSection language={language} />

              <InteractiveEngagementHub
                language={language}
                onExploreTimeline={() => {
                  setActiveView('legacy');
                  setLegacySubView('history');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                handleTrackClick={handleTrackClick}
                handleGiveFeedbackClick={handleGiveFeedbackClick}
                handleMyConstituencyClick={handleMyConstituencyClick}
              />

              <HomeFooterSloganSection
                language={language}
                onExplore={() => {
                  setActiveView('legacy');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onFeedback={handleGiveFeedbackClick}
              />
            </>
          )}

          {/* ─── VIEW 1.5: RAISE GRIEVANCE (DEDICATED VIEW WITH FULL SCREEN RALLY BACKGROUND) ─── */}
          {activeView === 'raise' && (
            <div
              className="relative w-full min-h-[90vh] py-16 px-4 flex items-center justify-center bg-no-repeat bg-cover bg-center bg-fixed"
              style={{
                backgroundImage: 'linear-gradient(rgba(4, 52, 23, 0.54), rgba(2, 32, 14, 0.68)), url("/rally_bg.jpg")',
              }}
            >
              <section id="feedback-form-section" className="max-w-3xl mx-auto w-full scroll-mt-24 z-10 relative">
                {!currentUser ? (
                  /* Call-to-action for Guest visitors */
                  <div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 text-center border border-white/40 shadow-2xl space-y-6">
                    <div className="w-20 h-20 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto shadow-inner">
                      <span className="material-symbols-outlined text-4xl text-emerald-600 font-bold">rate_review</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black text-emerald-955">
                      {language === 'English' ? 'Share Your Grievance or Suggestion' : 'உங்கள் கோரிக்கைகள் அல்லது கருத்துக்களை சமர்ப்பிக்கவும்'}
                    </h3>
                    <p className="text-sm text-slate-655 max-w-lg mx-auto leading-relaxed">
                      {language === 'English'
                        ? 'To ensure that each complaint is verified and unique Tracking IDs are created, citizens must login or sign up first.'
                        : 'அனைத்து புகார்களும் முறையாக சரிபார்க்கப்பட்டு தனித்துவமான கண்காணிப்பு ஐடி உருவாக்கப்படுவதை உறுதிப்படுத்த, முதலில் உள்நுழையவும்.'}
                    </p>
                    <button
                      onClick={handleGiveFeedbackClick}
                      className="px-10 py-4 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-black text-xs uppercase tracking-widest shadow-lg hover:scale-[1.03] transition-all duration-300 focus:outline-none"
                    >
                      {language === 'English' ? 'Log In to Give Feedback' : 'உள்நுழைந்து கருத்துக்களை வழங்கவும்'}
                    </button>
                  </div>
                ) : (
                  /* Active Multi-step Feedback Form */
                  <div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-10 border border-white/40 shadow-2xl relative">
                    <h3 className="text-2xl font-black text-emerald-955 border-b border-emerald-50 pb-4 mb-6">
                      {language === 'English' ? 'Submit Public Grievance' : 'பொதுக் கோரிக்கை சமர்ப்பித்தல்'}
                    </h3>

                    {/* Progress Step Indicator */}
                    <div className="flex items-center justify-between mb-8 text-2xs font-extrabold uppercase tracking-wider text-slate-400">
                      <div className={`flex flex-col items-center gap-1.5 flex-1 ${formStep >= 1 ? 'text-emerald-700' : ''}`}>
                        <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${formStep >= 1 ? 'bg-emerald-50 border-emerald-600 text-emerald-700' : 'border-slate-200 bg-white'}`}>1</div>
                        <span>{language === 'English' ? 'Location' : 'இருப்பிடம்'}</span>
                      </div>
                      <div className="h-0.5 bg-slate-200 flex-1 -mt-4"></div>
                      <div className={`flex flex-col items-center gap-1.5 flex-1 ${formStep >= 2 ? 'text-emerald-700' : ''}`}>
                        <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${formStep >= 2 ? 'bg-emerald-50 border-emerald-600 text-emerald-700' : 'border-slate-200 bg-white'}`}>2</div>
                        <span>{language === 'English' ? 'Category' : 'வகை'}</span>
                      </div>
                      <div className="h-0.5 bg-slate-200 flex-1 -mt-4"></div>
                      <div className={`flex flex-col items-center gap-1.5 flex-1 ${formStep >= 3 ? 'text-emerald-700' : ''}`}>
                        <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${formStep >= 3 ? 'bg-emerald-50 border-emerald-600 text-emerald-700' : 'border-slate-200 bg-white'}`}>3</div>
                        <span>{language === 'English' ? 'Details' : 'விவரங்கள்'}</span>
                      </div>
                    </div>

                    {/* STEP 1: SELECT LOCATION */}
                    {formStep === 1 && (
                      <div className="space-y-5">
                        <h4 className="text-sm font-black text-slate-700 uppercase tracking-wider mb-2">Step 1: Political Geography</h4>

                        <div>
                          <label className="block text-xs font-bold text-emerald-950 mb-1.5 uppercase">{language === 'English' ? 'State' : 'மாநிலம்'}</label>
                          <select disabled className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-xs font-bold">
                            <option>Tamil Nadu</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-emerald-955 mb-1.5 uppercase">{language === 'English' ? 'District' : 'மாவட்டம்'}</label>
                          <select
                            value={selectedDistrict}
                            onChange={(e) => {
                              setSelectedDistrict(e.target.value);
                              setSelectedConstituency('');
                            }}
                            className="w-full pl-4 pr-10 py-3 rounded-xl bg-slate-50 border border-emerald-100 text-slate-800 text-xs font-bold focus:ring-1 focus:ring-emerald-600 focus:bg-white outline-none truncate cursor-pointer shadow-sm"
                          >
                            <option value="">{language === 'English' ? '-- Select District --' : '-- மாவட்டம் தேர்ந்தெடுக்கவும் --'}</option>
                            {Object.keys(constituencyData).map(dist => (
                              <option key={dist} value={dist}>
                                {language === 'English' ? dist : (TN_DISTRICT_TAMIL_NAMES[dist] || constituencyData[dist]?.ta || dist)}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-emerald-955 mb-1.5 uppercase">{language === 'English' ? 'Assembly Constituency' : 'சட்டமன்றத் தொகுதி'}</label>
                          <select
                            value={selectedConstituency}
                            onChange={(e) => setSelectedConstituency(e.target.value)}
                            disabled={!selectedDistrict}
                            className="w-full pl-4 pr-10 py-3 rounded-xl bg-slate-50 border border-emerald-100 text-slate-800 text-xs font-bold focus:ring-1 focus:ring-emerald-600 focus:bg-white outline-none truncate cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <option value="">{language === 'English' ? '-- Select Constituency --' : '-- தொகுதி தேர்ந்தெடுக்கவும் --'}</option>
                            {selectedDistrict && constituencyData[selectedDistrict]?.constituencies.map(c => {
                              const cEn = typeof c === 'object' ? c.en : c;
                              const cTa = TN_CONSTITUENCY_TAMIL_NAMES[cEn] || (typeof c === 'object' && c.ta && c.ta !== cEn ? c.ta : cEn);
                              return (
                                <option key={cEn} value={cEn}>
                                  {language === 'English' ? cEn : cTa}
                                </option>
                              );
                            })}
                          </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-emerald-955 mb-1.5 uppercase">{language === 'English' ? 'Local Body (Corporation/Panchayat)' : 'உள்ளாட்சி அமைப்பு'}</label>
                            <input
                              type="text"
                              value={localBody}
                              onChange={(e) => setLocalBody(e.target.value)}
                              placeholder={language === 'English' ? "e.g. Salem Corporation" : "எ.கா: சேலம் மாநகராட்சி"}
                              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-emerald-100 text-slate-800 text-xs focus:ring-1 focus:ring-emerald-600 focus:bg-white outline-none"
                            />
                            {/* Auto-Transliteration Live Tamil Conversion Button */}
                            {localBody && /[a-zA-Z]/.test(localBody) && (
                              <button
                                type="button"
                                onClick={() => setLocalBody(autoTransliterateToTamil(localBody))}
                                className="mt-2 px-3.5 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-950 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer animate-fadeIn"
                              >
                                <span>✨ தமிழில் மாற்றுக:</span>
                                <span className="font-black text-emerald-800 underline decoration-emerald-500">{autoTransliterateToTamil(localBody)}</span>
                              </button>
                            )}
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-emerald-955 mb-1.5 uppercase">{language === 'English' ? 'Ward / Village' : 'வார்டு / கிராமம்'}</label>
                            <input
                              type="text"
                              value={wardVillage}
                              onChange={(e) => setWardVillage(e.target.value)}
                              placeholder={language === 'English' ? "e.g. Ward 5 / Village Name" : "எ.கா: வார்டு 5 / கிராமம் பெயர்"}
                              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-emerald-100 text-slate-800 text-xs focus:ring-1 focus:ring-emerald-600 focus:bg-white outline-none"
                            />
                            {/* Auto-Transliteration Live Tamil Conversion Button */}
                            {wardVillage && /[a-zA-Z]/.test(wardVillage) && (
                              <button
                                type="button"
                                onClick={() => setWardVillage(autoTransliterateToTamil(wardVillage))}
                                className="mt-2 px-3.5 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-950 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer animate-fadeIn"
                              >
                                <span>✨ தமிழில் மாற்றுக:</span>
                                <span className="font-black text-emerald-800 underline decoration-emerald-500">{autoTransliterateToTamil(wardVillage)}</span>
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                          <button
                            disabled={!selectedDistrict || !selectedConstituency}
                            onClick={() => setFormStep(2)}
                            className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {language === 'English' ? 'Next: Category' : 'அடுத்து: வகை'}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STEP 2: SELECT CATEGORY */}
                    {formStep === 2 && (
                      <div className="space-y-6">
                        <h4 className="text-sm font-black text-slate-700 uppercase tracking-wider mb-2">Step 2: Choose Topic Category</h4>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[360px] overflow-y-auto pr-1">
                          {[
                            { name: "Governance", icon: "domain", labelTa: "ஆட்சி முறைமை" },
                            { name: "Leadership", icon: "groups", labelTa: "தலைமைத்துவம்" },
                            { name: "Local Issues", icon: "location_home", labelTa: "உள்ளூர் பிரச்சினைகள்" },
                            { name: "Infrastructure", icon: "construction", labelTa: "கட்டமைப்பு" },
                            { name: "Education", icon: "school", labelTa: "கல்வி" },
                            { name: "Healthcare", icon: "medical_services", labelTa: "சுகாதாரம்" },
                            { name: "Employment", icon: "work", labelTa: "வேலைவாய்ப்பு" },
                            { name: "Agriculture", icon: "agriculture", labelTa: "விவசாயம்" },
                            { name: "Women's Welfare", icon: "female", labelTa: "பெண்கள் நலம்" },
                            { name: "Youth Development", icon: "sports_kabaddi", labelTa: "இளைஞர் மேம்பாடு" },
                            { name: "Public Safety", icon: "shield_person", labelTa: "பொது பாதுகாப்பு" },
                            { name: "Government Schemes", icon: "auto_stories", labelTa: "அரசு திட்டங்கள்" },
                            { name: "Party Organisation", icon: "hub", labelTa: "கட்சி அமைப்பு" },
                            { name: "Candidate Feedback", icon: "person_check", labelTa: "வேட்பாளர் கருத்து" },
                            { name: "Election Issues", icon: "how_to_vote", labelTa: "தேர்தல் விவகாரங்கள்" },
                            { name: "Suggestions", icon: "emoji_objects", labelTa: "பரிந்துரைகள்" },
                            { name: "Complaints", icon: "report", labelTa: "புகார்கள்" }
                          ].map(cat => (
                            <button
                              key={cat.name}
                              onClick={() => setSelectedCategory(cat.name)}
                              className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-2 transition-all duration-300 ${selectedCategory === cat.name ? 'border-emerald-600 bg-emerald-50/70 text-emerald-800 font-extrabold shadow-md scale-[1.02]' : 'border-slate-100 bg-slate-50 hover:bg-slate-100 text-slate-600'}`}
                            >
                              <span className="material-symbols-outlined text-emerald-600 text-xl">{cat.icon}</span>
                              <div className="text-[10px] uppercase leading-tight select-none">
                                {language === 'English' ? cat.name : cat.labelTa}
                              </div>
                            </button>
                          ))}
                        </div>

                        <div className="pt-4 flex justify-between border-t border-emerald-50">
                          <button
                            onClick={() => setFormStep(1)}
                            className="px-6 py-3 rounded-xl border border-slate-200 text-slate-500 font-bold text-xs uppercase"
                          >
                            {language === 'English' ? 'Back' : 'பின்செல்'}
                          </button>
                          <button
                            disabled={!selectedCategory}
                            onClick={() => setFormStep(3)}
                            className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider shadow-md disabled:opacity-50"
                          >
                            {language === 'English' ? 'Next: Details' : 'அடுத்து: விவரங்கள்'}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STEP 3: SUBMIT DETAILS */}
                    {formStep === 3 && (
                      <form onSubmit={handleSubmitGrievance} className="space-y-4">
                        <h4 className="text-sm font-black text-slate-700 uppercase tracking-wider">Step 3: Grievance Content</h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-emerald-955 mb-1.5 uppercase">{language === 'English' ? 'Grievance Title *' : 'விஷயத்தின் தலைப்பு *'}</label>

                            {/* Single Clean Category-Specific Title Dropdown */}
                            <select
                              required
                              value={feedbackTitle}
                              onChange={(e) => setFeedbackTitle(e.target.value)}
                              className="w-full pl-4 pr-10 py-3 rounded-xl bg-slate-50 border border-emerald-100 text-slate-800 text-xs font-bold focus:ring-1 focus:ring-emerald-600 focus:bg-white outline-none truncate cursor-pointer shadow-sm"
                            >
                              <option value="">{language === 'English' ? '📋 Select Title for ' + (selectedCategory || 'Category') + '...' : '📋 ' + (selectedCategory || 'வகை') + ' சார்ந்த தலைப்பைத் தேர்ந்தெடுக்கவும்...'}</option>
                              {(() => {
                                const catObj = CATEGORY_TITLES_MAP[selectedCategory] || CATEGORY_TITLES_MAP["Local Issues"];
                                const titles = language === 'English' ? catObj.en : catObj.ta;
                                return titles.map((t, idx) => (
                                  <option key={idx} value={t}>{t}</option>
                                ));
                              })()}
                            </select>

                            {/* Custom Title input appears only if Custom Title option selected */}
                            {(feedbackTitle === 'Custom Title...' || feedbackTitle === 'சொந்தத் தலைப்பு உள்ளிட...') && (
                              <input
                                type="text"
                                required
                                onChange={(e) => setFeedbackTitle(e.target.value)}
                                placeholder={language === 'English' ? "Type your custom title..." : "உங்கள் சொந்தத் தலைப்பை உள்ளிடவும்..."}
                                className="w-full px-4 py-3 rounded-xl bg-white border border-emerald-300 text-slate-800 text-xs outline-none focus:ring-1 focus:ring-emerald-600 mt-2 animate-fadeIn"
                              />
                            )}
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-emerald-955 mb-1.5 uppercase">{language === 'English' ? 'How important is this issue?' : 'பிரச்சினையின் முக்கியத்துவம்'}</label>
                            <select
                              value={importance}
                              onChange={(e) => setImportance(e.target.value)}
                              className="w-full pl-4 pr-10 py-3 rounded-xl bg-slate-50 border border-emerald-100 text-slate-800 text-xs focus:ring-1 focus:ring-emerald-600 focus:bg-white outline-none truncate cursor-pointer shadow-sm"
                            >
                              <option value="Low">{language === 'English' ? 'Low' : 'குறைவானது'}</option>
                              <option value="Medium">{language === 'English' ? 'Medium' : 'நடுத்தரமானது'}</option>
                              <option value="High">{language === 'English' ? 'High' : 'உயர்வானது'}</option>
                              <option value="Critical">{language === 'English' ? 'Critical' : 'முக்கியமானது'}</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-emerald-955 mb-1.5 uppercase">{language === 'English' ? 'Problem Description *' : 'விளக்கம் *'}</label>
                          <textarea
                            required
                            rows="3"
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            placeholder="Explain the issues in details..."
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-emerald-100 text-slate-800 text-xs focus:ring-1 focus:ring-emerald-600 focus:bg-white outline-none resize-none"
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

                          {/* Image Attachment File Selector */}
                          <div>
                            <label className="block text-xs font-bold text-emerald-955 mb-1.5 uppercase">{language === 'English' ? 'Upload Image / Document' : 'கோப்புப் பதிவேற்றம் (விருப்பம்)'}</label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => setAttachedFile(e.target.files[0])}
                              className="w-full text-xs text-slate-555 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 outline-none cursor-pointer"
                            />
                          </div>
                        </div>

                        {/* CONFIDENTIAL ANONYMOUS CITIZEN SUBMISSION BANNER */}
                        <div className="rounded-2xl bg-emerald-50 border border-emerald-200/90 p-4 flex items-center gap-3.5 shadow-sm mt-4 animate-fadeIn">
                          <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                            <span className="material-symbols-outlined text-xl">encrypted</span>
                          </div>
                          <div>
                            <h5 className="text-xs font-black text-emerald-955 uppercase tracking-wider">
                              {language === 'English' ? '🔒 Confidential Anonymous Submission' : '🔒 ரகசிய அனானிய மனு சமர்ப்பிப்பு'}
                            </h5>
                            <p className="text-[11px] text-emerald-800 font-medium leading-relaxed mt-0.5">
                              {language === 'English'
                                ? 'Your identity is 100% protected and hidden from public view. Grievances are submitted anonymously for citizen privacy.'
                                : 'உங்கள் அடையாளம் பொதுமக்கள் பார்வையிலிருந்து 100% பாதுகாப்பாக வைக்கப்படும். உங்கள் மனு அனானியமாக செயலாக்கப்படும்.'}
                            </p>
                          </div>
                        </div>

                        <div className="pt-4 flex justify-between border-t border-emerald-50">
                          <button
                            type="button"
                            onClick={() => setFormStep(2)}
                            className="px-6 py-3 rounded-xl border border-slate-200 text-slate-500 font-bold text-xs uppercase"
                          >
                            {language === 'English' ? 'Back' : 'பின்செல்'}
                          </button>
                          <button
                            type="submit"
                            disabled={submitLoading}
                            className="px-8 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs uppercase tracking-wider shadow-md hover:scale-[1.01] transition-all disabled:opacity-50"
                          >
                            {submitLoading ? (
                              <div className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                <span>{language === 'English' ? 'Submitting...' : 'சமர்ப்பிக்கிறது...'}</span>
                              </div>
                            ) : (
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
                backgroundImage: 'linear-gradient(rgba(4, 52, 23, 0.54), rgba(2, 32, 14, 0.68)), url("/rally_bg.jpg")',
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
                  <p className="text-sm sm:text-base md:text-lg text-amber-200 max-w-xl mx-auto font-bold leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
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
                            onError={(e) => { e.target.src = '/admk_leaders_clear.png'; }}
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



              {/* ────────────────────────────────────────────────────────── */}
              {/* SUB-VIEW 1: BJP-STYLE ADMK HISTORY TIMELINE */}
              {/* ────────────────────────────────────────────────────────── */}
              {legacySubView === 'history' && (
                <div
                  onMouseEnter={() => setIsAutoSlidePaused(true)}
                  onMouseLeave={() => setIsAutoSlidePaused(false)}
                  className="animate-fadeIn relative w-full h-[calc(100vh-140px)] min-h-[620px] bg-black overflow-hidden select-none"
                >
                  {/* Full-Screen Visual Slide for Current Active Year */}
                  {(() => {
                    const currentJourney = ADMK_JOURNEY_TIMELINE[bjpJourneyIdx] || ADMK_JOURNEY_TIMELINE[0];
                    return (
                      <div
                        key={bjpJourneyIdx}
                        className="relative w-full h-full flex items-center transition-all duration-700 animate-fadeIn"
                        style={{
                          backgroundImage: `url("${currentJourney.bg}")`,
                          backgroundSize: currentJourney.bgSize || 'cover',
                          backgroundPosition: currentJourney.bgPos || 'center 50%',
                          backgroundRepeat: 'no-repeat',
                          backgroundColor: '#050c07'
                        }}
                      >
                        {/* Heavy dark cinematic overlay for text legibility (like BJP site) */}
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background: 'linear-gradient(to right, rgba(2,16,8,0.96) 0%, rgba(2,16,8,0.80) 50%, rgba(0,0,0,0.35) 100%)'
                          }}
                        />



                        {/* MAIN CONTENT AREA */}
                        <div className="relative z-20 w-full pl-6 sm:pl-12 md:pl-20 pr-6 space-y-6 pb-24 max-w-3xl">
                          {/* OUR JOURNEY Title tag */}
                          <div className="flex items-center gap-3">
                            <span className="h-0.5 w-10 bg-amber-400"></span>
                            <span className="text-xs sm:text-sm font-black tracking-[0.3em] uppercase text-amber-400 drop-shadow-md">
                              {language === 'English' ? 'OUR JOURNEY' : 'எங்கள் பயணம்'}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-black uppercase tracking-widest">
                              {language === 'English' ? currentJourney.tag_en : currentJourney.tag_ta}
                            </span>
                          </div>

                          {/* Huge Year Typography */}
                          <div>
                            <span className="text-7xl sm:text-9xl font-black text-white font-mono tracking-tighter leading-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] block">
                              {currentJourney.year}
                            </span>
                          </div>

                          {/* Subheading / Title */}
                          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-tight max-w-3xl drop-shadow-lg">
                            {language === 'English' ? currentJourney.heading_en : currentJourney.heading_ta}
                          </h2>

                          {/* Minimized Concise Description (1-2 lines max) */}
                          <p className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl font-medium drop-shadow-md">
                            {language === 'English' ? currentJourney.desc_en : currentJourney.desc_ta}
                          </p>
                        </div>

                        {/* ────────────────────────────────────────────────────────── */}
                        {/* BJP-STYLE HORIZONTAL BOTTOM TIMELINE RULER BAR */}
                        {/* ────────────────────────────────────────────────────────── */}
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/95 to-transparent pt-6 pb-4 px-4 sm:px-10 flex items-center justify-between z-30 border-t border-white/10 backdrop-blur-md">

                          {/* Ruler Timeline Year Items */}
                          <div className="flex-1 overflow-x-auto hide-scrollbar flex items-center justify-start sm:justify-center gap-4 sm:gap-8 px-2 py-1">
                            {ADMK_JOURNEY_TIMELINE.map((item, idx) => {
                              const isActive = idx === bjpJourneyIdx;
                              return (
                                <button
                                  key={idx}
                                  onClick={() => setBjpJourneyIdx(idx)}
                                  className="group flex flex-col items-center focus:outline-none transition-all duration-300 flex-shrink-0 cursor-pointer"
                                >
                                  {/* Year Label */}
                                  <span
                                    className={`text-sm sm:text-base font-black font-mono tracking-tight transition-all duration-300 ${isActive
                                      ? 'text-amber-400 scale-125 drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]'
                                      : 'text-slate-400 group-hover:text-white group-hover:scale-105 opacity-70 group-hover:opacity-100'
                                      }`}
                                  >
                                    {item.year}
                                  </span>

                                  {/* Underline Active Indicator Bar */}
                                  <div className="w-full h-1 mt-1.5 flex justify-center items-center">
                                    {isActive ? (
                                      <div className="w-full h-1 bg-amber-400 rounded-full shadow-[0_0_10px_#fbbf24] animate-pulse" />
                                    ) : (
                                      <div className="w-0 group-hover:w-full h-0.5 bg-white/40 rounded-full transition-all duration-300" />
                                    )}
                                  </div>

                                  {/* Fine Ruler Tick Mark below each year */}
                                  <div className={`w-0.5 h-3 mt-1 transition-colors ${isActive ? 'bg-amber-400' : 'bg-white/20 group-hover:bg-white/50'}`} />
                                </button>
                              );
                            })}
                          </div>

                          {/* Arrow Controls (Next / Prev) */}
                          <div className="flex items-center gap-2 pl-4 border-l border-white/10 flex-shrink-0">
                            <button
                              onClick={() => setBjpJourneyIdx(prev => (prev > 0 ? prev - 1 : ADMK_JOURNEY_TIMELINE.length - 1))}
                              className="w-10 h-10 rounded-full bg-slate-900/90 border border-amber-400/50 hover:border-amber-400 text-amber-400 hover:bg-amber-400/10 flex items-center justify-center hover:scale-110 active:scale-95 transition shadow-[0_0_15px_rgba(251,191,36,0.2)]"
                              title="Previous Year"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>

                            <button
                              onClick={() => setBjpJourneyIdx(prev => (prev < ADMK_JOURNEY_TIMELINE.length - 1 ? prev + 1 : 0))}
                              className="w-10 h-10 rounded-full bg-slate-900/90 border border-amber-400/50 hover:border-amber-400 text-amber-400 hover:bg-amber-400/10 flex items-center justify-center hover:scale-110 active:scale-95 transition shadow-[0_0_15px_rgba(251,191,36,0.2)]"
                              title="Next Year"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                              </svg>
                            </button>

                            <span className="hidden sm:inline-block text-xs font-mono font-black text-amber-400/90 ml-2 drop-shadow-sm">
                              {bjpJourneyIdx + 1}/{ADMK_JOURNEY_TIMELINE.length}
                            </span>
                          </div>

                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* ────────────────────────────────────────────────────────── */}
              {/* SUB-VIEW 2: SCHEMES & ACHIEVEMENTS DATABASE VIEW */}
              {/* ────────────────────────────────────────────────────────── */}
              {legacySubView === 'schemes' && (
                <div
                  className="animate-fadeIn w-full min-h-screen bg-no-repeat bg-cover bg-center"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(4, 52, 23, 0.62), rgba(2, 32, 14, 0.76)), url("/rally_bg.jpg")',
                    backgroundAttachment: 'fixed',
                  }}
                >

                  {/* ROW 0: TOP HERO 3-SLIDE AUTO-SLIDING BANNER (RALLY BG WITH TITLE, GOVERNANCE & STATS SLIDES) */}
                  <TopHeroTripleSlider
                    language={language}
                    typedSchemesTitle={typedSchemesTitle}
                    schemesTitleTypingDone={schemesTitleTypingDone}
                    setSchemesTypeFilter={setSchemesTypeFilter}
                  />

                  {/* Wrapper for the rest of Schemes view (Full Width Un-boxed Layout) */}
                  <div className="w-full py-10 px-4 md:px-12 max-w-7xl mx-auto space-y-12">

                    {/* Searchable Complete Record Database */}
                    <div id="schemes-database-section" className="space-y-8">
                      <div className="text-center space-y-1">
                        <span className="text-3xs font-black text-emerald-400 tracking-widest uppercase">EXPLORE THE RECORD</span>
                        <h3 className="text-lg sm:text-xl font-black text-white uppercase">{language === 'English' ? 'ONE PLACE. EVERY INITIATIVE.' : 'ஒரே தளம். அனைத்து மக்கள் நலத்திட்டங்கள்.'}</h3>
                        <p className="text-xs sm:text-sm md:text-base text-amber-200 uppercase font-bold tracking-wider">{language === 'English' ? 'Let visitors search the complete record.' : 'அனைத்து திட்டங்களின் முழுமையான ஆவணம்.'}</p>
                      </div>

                      {/* Era Segregation Category Header Tabs */}
                      <div className="space-y-4">
                        <div className="flex flex-wrap justify-center gap-3 border-b border-white/10 pb-6">
                          {[
                            { key: 'All', label_en: 'ALL ERAS', label_ta: 'அனைத்து காலங்கள்', color: 'from-emerald-600 to-emerald-800' },
                            { key: 'MGR', label_en: 'MGR ERA (1977-1987)', label_ta: 'புரட்சித்தலைவர் எம்.ஜி.ஆர் காலம்', color: 'from-amber-600 to-yellow-700' },
                            { key: 'Amma', label_en: 'AMMA ERA (1991-2016)', label_ta: 'புரட்சித்தலைவி அம்மா காலம்', color: 'from-emerald-600 to-teal-700' },
                            { key: 'EPS', label_en: 'EPS ERA (2017-2021)', label_ta: 'மாண்புமிகு எடப்பாடியார் காலம்', color: 'from-emerald-700 to-green-900' }
                          ].map(eraTab => (
                            <button
                              key={eraTab.key}
                              onClick={() => setSchemesEraFilter(eraTab.key)}
                              className={`px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${schemesEraFilter === eraTab.key
                                ? `bg-gradient-to-r ${eraTab.color} text-white shadow-xl scale-105 ring-2 ring-amber-400/50`
                                : 'bg-slate-950 text-slate-400 border border-white/10 hover:text-white hover:border-white/20 hover:scale-102'
                                }`}
                            >
                              <span>{language === 'English' ? eraTab.label_en : eraTab.label_ta}</span>
                            </button>
                          ))}
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
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-4xl mx-auto">

                            {/* 1. Filter by Category */}
                            <div className="space-y-1">
                              <label className="text-3xs font-black uppercase text-amber-300 block tracking-wider">{language === 'English' ? 'Filter by Category' : 'வகைப்பாடு'}</label>
                              <select
                                value={schemesCategoryFilter}
                                onChange={(e) => setSchemesCategoryFilter(e.target.value)}
                                className="w-full bg-slate-950 border border-white/10 rounded-lg py-2 px-3 text-2xs text-slate-300 focus:outline-none focus:border-emerald-500"
                              >
                                <option value="All">{language === 'English' ? 'All Categories' : 'அனைத்து பிரிவுகள்'}</option>
                                <option value="Education">{language === 'English' ? 'Education & Students' : 'கல்வி & மாணவர்கள்'}</option>
                                <option value="Women">{language === 'English' ? 'Women & Families' : 'மகளிர் & குடும்பங்கள்'}</option>
                                <option value="Healthcare">{language === 'English' ? 'Healthcare' : 'சுகாதாரம்'}</option>
                                <option value="Welfare">{language === 'English' ? 'Food & Welfare' : 'உணவு & சமூக நலம்'}</option>
                                <option value="Agriculture">{language === 'English' ? 'Farmers & Agriculture' : 'விவசாயம்'}</option>
                                <option value="Water">{language === 'English' ? 'Water & Irrigation' : 'நீர் மேலாண்மை'}</option>
                                <option value="Infrastructure">{language === 'English' ? 'Infrastructure' : 'உள்கட்டமைப்பு'}</option>
                                <option value="Economy">{language === 'English' ? 'Industry & Economy' : 'தொழில் & பொருளாதாரம்'}</option>
                              </select>
                            </div>

                            {/* 2. Filter by People */}
                            <div className="space-y-1">
                              <label className="text-3xs font-black uppercase text-amber-300 block tracking-wider">{language === 'English' ? 'Filter by People' : 'பயனாளிகள்'}</label>
                              <select
                                value={schemesPeopleFilter}
                                onChange={(e) => setSchemesPeopleFilter(e.target.value)}
                                className="w-full bg-slate-950 border border-white/10 rounded-lg py-2 px-3 text-2xs text-slate-300 focus:outline-none focus:border-emerald-500"
                              >
                                <option value="All">{language === 'English' ? 'All People' : 'அனைவரும்'}</option>
                                <option value="Students">{language === 'English' ? 'Students' : 'மாணவர்கள்'}</option>
                                <option value="Women">{language === 'English' ? 'Women' : 'பெண்கள்'}</option>
                                <option value="Farmers">{language === 'English' ? 'Farmers' : 'விவசாயிகள்'}</option>
                                <option value="Families">{language === 'English' ? 'Families' : 'குடும்பங்கள்'}</option>
                                <option value="Senior Citizens">{language === 'English' ? 'Senior Citizens' : 'முதியோர்கள்'}</option>
                                <option value="Entrepreneurs">{language === 'English' ? 'Entrepreneurs' : 'தொழில்முனைவோர்'}</option>
                              </select>
                            </div>

                            {/* 3. Filter by Type */}
                            <div className="space-y-1">
                              <label className="text-3xs font-black uppercase text-amber-300 block tracking-wider">{language === 'English' ? 'Filter by Type' : 'திட்ட வகை'}</label>
                              <select
                                value={schemesTypeFilter}
                                onChange={(e) => setSchemesTypeFilter(e.target.value)}
                                className="w-full bg-slate-950 border border-white/10 rounded-lg py-2 px-3 text-2xs text-slate-300 focus:outline-none focus:border-emerald-500"
                              >
                                <option value="All">{language === 'English' ? 'All Types' : 'அனைத்து வகை'}</option>
                                <option value="Scheme">{language === 'English' ? 'Scheme' : 'நலத்திட்டம்'}</option>
                                <option value="Policy">{language === 'English' ? 'Policy' : 'கொள்கை'}</option>
                                <option value="Project">{language === 'English' ? 'Project' : 'திட்டம்/திட்டப்பணி'}</option>
                                <option value="Achievement">{language === 'English' ? 'Achievement' : 'உள்கட்டமைப்புச் சாதனை'}</option>
                              </select>
                            </div>

                          </div>
                        </div>
                      </div>

                      {/* Visual Schemes & Achievements Auto-Sliding 3 Era Rows */}
                      {(() => {
                        const filterFn = (item) => {
                          const s = schemesSearch.toLowerCase();
                          const matchesSearch =
                            item.name_en.toLowerCase().includes(s) ||
                            item.name_ta.includes(s) ||
                            item.did_en.toLowerCase().includes(s) ||
                            item.did_ta.includes(s);

                          const matchesCategory = schemesCategoryFilter === 'All' || item.category_en.includes(schemesCategoryFilter);
                          const matchesPeople = schemesPeopleFilter === 'All' || item.people_en === schemesPeopleFilter;
                          const matchesType = schemesTypeFilter === 'All' || item.type_en === schemesTypeFilter;

                          return matchesSearch && matchesCategory && matchesPeople && matchesType;
                        };

                        const mgrSchemes = SCHEMES_DATABASE.filter(item => item.era_en === 'MGR' && filterFn(item));
                        const ammaSchemes = SCHEMES_DATABASE.filter(item => item.era_en === 'Amma' && filterFn(item));
                        const epsSchemes = SCHEMES_DATABASE.filter(item => item.era_en === 'EPS' && filterFn(item));

                        const totalFilteredCount = (schemesEraFilter === 'All' || schemesEraFilter === 'MGR' ? mgrSchemes.length : 0) +
                          (schemesEraFilter === 'All' || schemesEraFilter === 'Amma' ? ammaSchemes.length : 0) +
                          (schemesEraFilter === 'All' || schemesEraFilter === 'EPS' ? epsSchemes.length : 0);

                        if (totalFilteredCount === 0) {
                          return (
                            <div className="p-12 text-center text-slate-500 font-bold uppercase text-2xs border border-dashed border-white/10 rounded-2xl">
                              {language === 'English' ? 'No matching schemes found for selected era or filters.' : 'தேர்ந்தெடுக்கப்பட்ட காலம் அல்லது வடிகட்டிகளுக்குப் பொருத்தமான திட்டங்கள் எதுவும் கண்டறியப்படவில்லை.'}
                            </div>
                          );
                        }

                        return (
                          <div className="space-y-8 w-full overflow-hidden">
                            {/* ROW 1: MGR ERA SCHEMES */}
                            {(schemesEraFilter === 'All' || schemesEraFilter === 'MGR') && mgrSchemes.length > 0 && (
                              <EraRowSlider
                                eraKey="MGR"
                                eraTitle_en="PURATCHI THALAIVAR MGR ERA SCHEMES & ACHIEVEMENTS"
                                eraTitle_ta="புரட்சித்தலைவர் எம்.ஜி.ஆர் காலம் — திட்டங்கள் & சாதனைகள்"
                                eraSubtitle_en="1977 – 1987 • Landmark Welfare Initiatives"
                                eraSubtitle_ta="1977 – 1987 • வரலாற்று சிறப்புமிக்க நலத்திட்டங்கள்"
                                eraBadgeColor="from-amber-600 via-amber-700 to-yellow-800"
                                schemes={mgrSchemes}
                                language={language}
                              />
                            )}

                            {/* ROW 2: AMMA ERA SCHEMES */}
                            {(schemesEraFilter === 'All' || schemesEraFilter === 'Amma') && ammaSchemes.length > 0 && (
                              <EraRowSlider
                                eraKey="AMMA"
                                eraTitle_en="PURATCHI THALAIVI AMMA ERA SCHEMES & ACHIEVEMENTS"
                                eraTitle_ta="புரட்சித்தலைவி அம்மா காலம் — திட்டங்கள் & சாதனைகள்"
                                eraSubtitle_en="1991 – 2016 • Flagship Welfare & Development Initiatives"
                                eraSubtitle_ta="1991 – 2016 • தொலைநோக்கு நலத்திட்டங்கள்"
                                eraBadgeColor="from-emerald-600 via-teal-700 to-emerald-900"
                                schemes={ammaSchemes}
                                language={language}
                              />
                            )}

                            {/* ROW 3: EPS ERA SCHEMES */}
                            {(schemesEraFilter === 'All' || schemesEraFilter === 'EPS') && epsSchemes.length > 0 && (
                              <EraRowSlider
                                eraKey="EPS"
                                eraTitle_en="HON'BLE EPS ERA SCHEMES & ACHIEVEMENTS"
                                eraTitle_ta="மாண்புமிகு எடப்பாடியார் காலம் — திட்டங்கள் & சாதனைகள்"
                                eraSubtitle_en="2017 – 2021 • Major Governance & Development Achievements"
                                eraSubtitle_ta="2017 – 2021 • முதன்மை ஆளுமை மற்றும் கட்டமைப்பு சாதனைகள்"
                                eraBadgeColor="from-emerald-700 via-green-800 to-slate-900"
                                schemes={epsSchemes}
                                language={language}
                              />
                            )}
                          </div>
                        );
                      })()}
                    </div>

                    {/* Behind the Numbers are People (Enhanced Auto-Sliding Impact Stories) */}
                    {(() => {
                      return <ImpactStoriesSlider language={language} />;
                    })()}



                  </div>
                </div>
              )}

            </div>
          )}
          {activeView === 'gallery' && (
            <div
              className="relative w-full min-h-[95vh] py-16 px-4 md:px-6 flex flex-col items-center justify-center bg-no-repeat bg-cover bg-center bg-fixed"
              style={{
                backgroundImage: 'linear-gradient(rgba(4, 52, 23, 0.54), rgba(2, 32, 14, 0.68)), url("/rally_bg.jpg")',
              }}
            >
              <section className="max-w-6xl mx-auto w-full animate-fadeIn z-10 relative">
                <div className="text-center space-y-3 mb-10">
                  <span className="text-xs font-black tracking-widest text-amber-400 uppercase drop-shadow-sm">{language === 'English' ? 'Campaign Snapshots' : 'புகைப்படங்கள்'}</span>
                  <h3 className="text-3xl sm:text-4xl font-black text-white drop-shadow-lg">{language === 'English' ? 'Media Gallery' : 'புகைப்படக் கேலரி'}</h3>
                  <p className="text-sm sm:text-base md:text-lg text-amber-200 max-w-xl mx-auto font-bold leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">{language === 'English' ? 'Pictures of leadership campaigns, public outreach tours, and volunteer services.' : 'மக்கள் தொடர்புப் பயணங்கள் மற்றும் நற்பணி மன்ற நிகழ்வுகள்.'}</p>
                </div>

                {/* Gallery Filters */}
                <div className="flex flex-wrap justify-center gap-3 mb-10">
                  {[
                    { key: 'All', en: 'All Photos', ta: 'அனைத்தும்' },
                    { key: 'Campaigns', en: '📢 Campaigns', ta: '📢 பிரச்சாரம்' },
                    { key: 'Public Meetings', en: '🤝 Public Meetings', ta: '🤝 பொதுக்கூட்டங்கள்' },
                    { key: 'Welfare Ceremonies', en: '🎓 Welfare Schemes', ta: '🎓 மக்கள் நல உதவிகள்' }
                  ].map(tab => (
                    <button
                      key={tab.key}
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
                backgroundImage: 'linear-gradient(rgba(4, 52, 23, 0.54), rgba(2, 32, 14, 0.68)), url("/rally_bg.jpg")',
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

                          {/* Step 2: Under Review */}
                          <div className="flex flex-col items-center gap-1.5 z-10 relative">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${trackResult.status !== 'Submitted' ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white animate-pulse'}`}>
                              {trackResult.status !== 'Submitted' ? (
                                <span className="material-symbols-outlined text-xs">done</span>
                              ) : (
                                <span className="text-3xs font-bold">2</span>
                              )}
                            </div>
                            <span className="text-3xs font-black uppercase tracking-wider text-slate-700">{language === 'English' ? 'In Progress' : 'பரிசீலனையில்'}</span>
                          </div>

                          {/* Step 3: Resolved */}
                          <div className="flex flex-col items-center gap-1.5 z-10 relative">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${trackResult.status === 'Resolved' ? 'bg-emerald-600 text-white' : 'bg-white border-2 border-slate-200 text-slate-400'}`}>
                              {trackResult.status === 'Resolved' ? (
                                <span className="material-symbols-outlined text-xs">done</span>
                              ) : (
                                <span className="text-3xs font-bold">3</span>
                              )}
                            </div>
                            <span className="text-3xs font-black uppercase tracking-wider text-slate-700">{language === 'English' ? 'Resolved' : 'தீர்க்கப்பட்டது'}</span>
                          </div>

                        </div>
                      </div>

                      {/* Admin comments/feedback section */}
                      {trackResult.status === 'Resolved' && (
                        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-1">
                          <span className="text-[10px] text-emerald-800 font-extrabold uppercase tracking-wide block">{language === 'English' ? 'Representative Action Notes' : 'பிரதிநிதி தீர்வு குறிப்பு'}</span>
                          <p className="text-xs text-slate-700 font-medium leading-relaxed">
                            {trackResult.admin_comment || (language === 'English' ? 'The issue has been reviewed and solved by local constituency representatives.' : 'தொகுதி மக்கள் பிரதிநிதிகளால் சரிபார்க்கப்பட்டு இப்பிரச்சினைக்கு தீர்வு காணப்பட்டுள்ளது.')}
                          </p>
                        </div>
                      )}

                      {trackResult.status === 'Duplicate' && (
                        <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100 space-y-1">
                          <span className="text-[10px] text-orange-850 font-extrabold uppercase tracking-wide block">{language === 'English' ? 'Duplicate Alert' : 'நகல் புகார் அறிவிப்பு'}</span>
                          <p className="text-xs text-slate-700 font-medium leading-relaxed">
                            {language === 'English'
                              ? 'Our system detected an existing report representing the exact same image/location. It has been merged to avoid duplicate actions.'
                              : 'இதே பகுதியில் உள்ள இதே பிரச்சினை ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது. விரைவான நடவடிக்கைக்கு இது முதன்மை புகாருடன் இணைக்கப்பட்டுள்ளது.'}
                          </p>
                        </div>
                      )}

                      {/* Detail verification info */}
                      <div className="flex justify-end pt-2">
                        <button
                          onClick={() => { setTrackResult(null); setTrackId(''); }}
                          className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-500 font-bold text-xs uppercase"
                        >
                          {language === 'English' ? 'Track Another ID' : 'வேறு ஐடி தேடு'}
                        </button>
                      </div>

                    </div>
                  )}

                </div>
              </section>
            </div>
          )}

          {/* ─── VIEW 6: MY CONSTITUENCY (INTERACTIVE TAMIL NADU DISTRICT MAP & REGIONAL EXPLORER) ─── */}
          {activeView === 'constituency' && (
            <div
              className="relative w-full min-h-[95vh] py-12 px-4 md:px-8 flex flex-col items-center justify-center bg-no-repeat bg-cover bg-center bg-fixed"
              style={{
                backgroundImage: 'linear-gradient(rgba(4, 52, 23, 0.62), rgba(2, 32, 14, 0.76)), url("/rally_bg.jpg")',
              }}
            >
              <section className="max-w-6xl mx-auto w-full animate-fadeIn z-10 relative space-y-8">

                {/* SECTION HEADER BANNER */}
                <div className="text-center space-y-3">
                  <span className="inline-block px-4 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-xs font-black tracking-widest text-amber-400 uppercase drop-shadow-sm">
                    {language === 'English' ? 'Tamil Nadu Regional Explorer' : 'தமிழக மாவட்டங்கள் & தொகுதிகள்'}
                  </span>
                  <h3 className="text-3xl sm:text-5xl font-black text-white drop-shadow-lg leading-tight uppercase">
                    {language === 'English' ? '38 DISTRICTS. 234 CONSTITUENCIES.' : '38 மாவட்டங்கள். 234 சட்டமன்றத் தொகுதிகள்.'}
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg text-amber-200 max-w-3xl mx-auto font-bold leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                    {language === 'English'
                      ? 'Explore Tamil Nadu district by district. Select any district to view party leadership, assembly constituencies, local projects, and regional priorities.'
                      : 'தமிழ்நாட்டின் ஒவ்வொரு மாவட்டத்தின் கட்சித் தலைமை, சட்டமன்றத் தொகுதிகள் மற்றும் உள்ளூர் திட்டங்களை அறிந்து கொள்ள மாவட்டத்தைத் தேர்ந்தெடுக்கவும்.'}
                  </p>
                </div>

                {/* Simple District Selector: show 'All 38 Districts' label and a dropdown (Salem only for now) */}
                <div className="bg-slate-950/90 border border-white/10 backdrop-blur-xl rounded-full px-5 py-4 flex flex-wrap items-center justify-center gap-4 shadow-[0_30px_60px_rgba(15,23,42,0.45)]">
                  <span className="px-5 py-2 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-[0.35em] shadow-sm">
                    {language === 'English' ? 'All 38 Districts' : 'அனைத்து 38 மாவட்டங்கள்'}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-2xs text-amber-200 uppercase tracking-[0.35em] font-bold">{language === 'English' ? 'District' : 'மாவட்டம்'}</span>
                    <div className="relative min-w-[240px]">
                      <select
                        id="publicDistrictSelect"
                        value={selectedPublicDistrict}
                        onChange={(e) => {
                          const dist = e.target.value;
                          setSelectedPublicDistrict(dist);
                          setSelectedPublicConstituency('');
                          if (dist) {
                            setSelectedModalDistrict(dist);
                          }
                        }}
                        className="w-full bg-white text-slate-950 text-sm font-bold rounded-2xl pl-4 pr-10 py-2.5 border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition duration-200 appearance-none cursor-pointer"
                        style={{ WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none', backgroundImage: 'none' }}
                      >
                        <option value="">{language === 'English' ? 'Select your district' : 'உங்கள் மாவட்டத்தைத் தேர்ந்தெடுக்கவும்'}</option>
                        <option value="Salem">{language === 'English' ? 'Salem' : 'சேலம்'}</option>
                      </select>
                      <svg
                        className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* ─── DYNAMIC MAP CONTAINER: TN MAP VS SALEM DISTRICT MAP ─── */}
                <div className="w-full flex justify-center py-2 animate-fadeIn">
                  {selectedPublicDistrict === 'Salem' ? (
                    selectedPublicConstituency ? (
                      (userRole === 'leader' || userRole === 'admin' || currentUser) ? (
                        /* ─── DEDICATED CONSTITUENCY GRIEVANCES & STATISTICS PAGE (LEADERS ONLY) ─── */
                        <ConstituencyDetailsPage
                          constituencyName={selectedPublicConstituency}
                          districtName="Salem"
                          language={language}
                          userRole={userRole}
                          onBackToSalemMap={() => setSelectedPublicConstituency('')}
                          onBackToTNMap={() => {
                            setSelectedPublicConstituency('');
                            setSelectedPublicDistrict('');
                          }}
                          allFeedbacks={allFeedbacks}
                        />
                      ) : (
                        /* ─── LEADER LOGIN REQUIRED PROMPT ─── */
                        <div className="w-full max-w-4xl mx-auto py-8 px-4 flex justify-center animate-fadeIn">
                          <div className="w-full p-8 sm:p-12 rounded-[2.5rem] bg-slate-950/90 border border-amber-400/30 backdrop-blur-xl shadow-2xl text-center space-y-6">
                            <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center text-3xl mx-auto shadow-inner">
                              🔒
                            </div>
                            
                            <div className="space-y-2">
                              <span className="text-3xs font-black text-amber-400 tracking-widest uppercase block">
                                {language === 'English' ? 'CONSTITUENCY LEADER ACCESS REQUIRED' : 'தொகுதி நிர்வாகி அணுகல் தேவை'}
                              </span>
                              <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                                {selectedPublicConstituency} {language === 'English' ? 'GRIEVANCES & STATISTICS DESK' : 'குறைதீர்ப்பு புள்ளிவிவர தளம்'}
                              </h3>
                              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-medium leading-relaxed">
                                {language === 'English'
                                  ? `Detailed public grievance records, ward statistics, and resolution management for ${selectedPublicConstituency} Constituency are strictly reserved for authorized party leaders. Please sign in as a Leader to view.`
                                  : `${selectedPublicConstituency} தொகுதிக்கான பொதுமக்கள் மனுக்கள் மற்றும் புள்ளிவிவரங்களை பார்வையிட கழக நிர்வாகிகள் உள்நுழையவும்.`}
                              </p>
                            </div>

                            <div className="pt-2 flex flex-wrap justify-center gap-4">
                              <button
                                onClick={() => {
                                  setRedirectAfterAuth('constituency');
                                  setShowAuthModal(true);
                                }}
                                className="px-8 py-3.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-widest transition shadow-lg active:scale-95 flex items-center gap-2"
                              >
                                <span className="material-symbols-outlined text-base font-bold">lock</span>
                                <span>{language === 'English' ? 'Leader Sign In' : 'நிர்வாகி உள்நுழைவு'}</span>
                              </button>

                              <button
                                onClick={() => setSelectedPublicConstituency('')}
                                className="px-6 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs uppercase tracking-wider border border-white/10 transition"
                              >
                                <span>← {language === 'English' ? 'Back to Salem Map' : 'சேலம் வரைபடம்'}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    ) : (
                      /* ─── SALEM DISTRICT MAP ALONE ─── */
                      <div className="w-full max-w-4xl flex flex-col items-center animate-fadeIn space-y-4">

                        {/* Top Bar: Back to TN Map Button + Title */}
                        <div className="w-full flex items-center justify-between px-2">
                          <button
                            onClick={() => {
                              setSelectedPublicDistrict('');
                              setSelectedModalDistrict(null);
                              setSelectedPublicConstituency('');
                            }}
                            className="px-5 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-widest transition shadow-lg flex items-center gap-2"
                          >
                            <span>← {language === 'English' ? 'Back to Tamil Nadu Map' : 'தமிழக வரைபடம்'}</span>
                          </button>

                          <span className="text-xs font-black text-amber-400 uppercase tracking-[0.25em]">
                            {language === 'English' ? 'Salem District Map (11 Constituencies)' : 'சேலம் மாவட்டம் (11 தொகுதிகள்)'}
                          </span>
                        </div>

                        {/* Salem Map Alone */}
                        <SalemDistrictMap
                          selectedConstituency={selectedPublicConstituency}
                          onSelectConstituency={(cName) => setSelectedPublicConstituency(cName)}
                          language={language}
                        />

                      </div>
                    )
                  ) : (
                    /* ─── FULL TAMIL NADU STATE SVG MAP VIEW (DEFAULT) ─── */
                    constituencyMapViewMode === 'visual' ? (
                      <TamilNaduSvgMap
                        selectedDistrict={selectedPublicDistrict}
                        onSelectDistrict={(distName) => {
                          setSelectedPublicDistrict(distName);
                          setSelectedPublicConstituency('');
                        }}
                        language={language}
                        constituencyData={constituencyData}
                        TN_DISTRICT_REGIONS={TN_DISTRICT_REGIONS}
                        selectedRegionFilter={selectedRegionFilter}
                        searchQuery={publicConstituencySearch}
                      />
                    ) : (
                      <div className="w-full max-w-4xl mx-auto space-y-4">
                        <div className="flex items-center justify-between px-2">
                          <span className="text-3xs font-black text-amber-400 uppercase tracking-widest">
                            {language === 'English' ? 'SELECT DISTRICT TO VIEW DETAILS' : 'விவரங்களைக் காண மாவட்டத்தைத் தேர்ந்தெடுக்கவும்'}
                          </span>
                          <span className="text-3xs font-extrabold text-slate-400 uppercase">
                            {Object.keys(constituencyData).length} {language === 'English' ? 'Districts' : 'மாவட்டங்கள்'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-1">
                          {Object.keys(constituencyData)
                            .filter(distName => {
                              const meta = TN_DISTRICT_REGIONS[distName] || { region: 'North' };
                              const matchesRegion = selectedRegionFilter === 'All' || meta.region === selectedRegionFilter;
                              const matchesQuery = !publicConstituencySearch || distName.toLowerCase().includes(publicConstituencySearch.toLowerCase()) || (constituencyData[distName]?.ta || '').includes(publicConstituencySearch);
                              return matchesRegion && matchesQuery;
                            })
                            .map(distName => {
                              const meta = TN_DISTRICT_REGIONS[distName] || { region: 'North', icon: '🏛️' };
                              const constList = constituencyData[distName]?.constituencies || [];
                              const isSelected = selectedPublicDistrict === distName;

                              return (
                                <div
                                  key={distName}
                                  onClick={() => {
                                    setSelectedPublicDistrict(distName);
                                    setSelectedPublicConstituency('');
                                  }}
                                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between h-28 group ${isSelected ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.4)] scale-105' : 'bg-slate-900/90 border-white/10 hover:border-amber-400 hover:bg-slate-850 text-white'}`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-black uppercase text-amber-400">{meta.region}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${isSelected ? 'bg-slate-950 text-amber-400' : 'bg-white/10 text-emerald-400'}`}>
                                      {constList.length} Seats
                                    </span>
                                  </div>

                                  <div>
                                    <h4 className={`text-base font-black uppercase tracking-tight truncate ${isSelected ? 'text-slate-950' : 'text-white group-hover:text-amber-400'}`}>
                                      {language === 'English' ? distName : (constituencyData[distName]?.ta || distName)}
                                    </h4>
                                    <span className="text-[9px] font-extrabold uppercase block truncate text-slate-400">
                                      {language === 'English' ? 'Click for Details' : 'விவரங்களைக் காண கிளிக் செய்க'}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </section>

              {userRole !== 'leader' && userRole !== 'admin' && !currentUser && (
                <div className="w-full py-12 px-4 sm:px-8 relative z-10 flex justify-center">
                  <div className="max-w-4xl w-full p-8 sm:p-10 rounded-[2.5rem] bg-slate-900/90 border border-white/10 backdrop-blur-xl shadow-2xl text-center space-y-6 animate-fadeIn">
                    <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center text-3xl mx-auto shadow-inner">
                      🏛️
                    </div>
                    <div className="space-y-2">
                      <span className="text-3xs font-black text-amber-400 tracking-widest uppercase block">
                        {language === 'English' ? 'WARD & DISTRICT LEADER DESK' : 'கழக நிர்வாகிகள் குறைதீர்ப்பு ஆய்வுத் தளம்'}
                      </span>
                      <h4 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                        {language === 'English' ? 'WARD GRIEVANCE STATISTICS & ANALYTICS' : 'வார்டு குறைதீர்ப்பு புள்ளிவிவரங்கள்'}
                      </h4>
                      <p className="text-xs text-slate-300 max-w-xl mx-auto font-medium leading-relaxed">
                        {language === 'English'
                          ? 'Public visitors can explore the Tamil Nadu Political Map, district profiles, local leader info, and regional news above. Detailed ward grievance statistics, petitioner heatmaps, and resolution action tools are strictly restricted to authorized ADMK party leaders.'
                          : 'பொதுமக்கள் வரைபடம், மாவட்ட விவரங்கள் மற்றும் உள்ளூர் செய்திகளைக் காணலாம். வார்டு புகார்கள் மற்றும் தீர்வு நடவடிக்கைகளுக்கான அணுகல் கழக நிர்வாகிகளுக்கு மட்டுமே உரியது.'}
                      </p>
                    </div>
                    <div className="pt-2 flex justify-center">
                      <button
                        onClick={() => {
                          setRedirectAfterAuth('constituency');
                          setShowAuthModal(true);
                        }}
                        className="px-6 py-3.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider hover:bg-amber-300 transition shadow-lg active:scale-95 flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-sm font-bold">lock</span>
                        <span>{language === 'English' ? 'Leader Sign In' : 'நிர்வாகி உள்நுழைவு'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )
          }

          {
            dashboardSubTab === 'curate_news' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-slate-100 max-w-4xl mx-auto">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h4 className="text-base font-black text-emerald-955 flex items-center gap-2">
                        <span className="material-symbols-outlined text-emerald-600">newspaper</span>
                        <span>{language === 'English' ? 'ADMK News Curation Inbox' : 'அதிமுக செய்தி மேலாண்மை'}</span>
                      </h4>
                      <p className="text-2xs text-slate-550 mt-1">
                        {language === 'English'
                          ? 'Real-time search results for "AIADMK" / "அதிமுக" from online news channels. Edit and approve to publish.'
                          : 'இணையத்தில் வெளியாகும் அதிமுக செய்திகள். தகுதியானவற்றைத் திருத்தி தளத்தில் வெளியிடுங்கள்.'}
                      </p>
                    </div>
                    <button
                      onClick={fetchNewsInbox}
                      disabled={newsInboxLoading}
                      className="px-5 py-2.5 rounded-xl border border-emerald-100 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-black text-xs uppercase tracking-wider transition flex items-center gap-2 disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-sm font-black">refresh</span>
                      <span>{language === 'English' ? 'Refresh Feed' : 'புதுப்பி'}</span>
                    </button>
                  </div>
                </div>

                {newsInboxLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <svg className="animate-spin h-8 w-8 text-emerald-600" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <p className="text-2xs font-extrabold text-slate-500 uppercase tracking-widest">{language === 'English' ? 'Scanning online channels...' : 'செய்திகளைத் தேடுகிறது...'}</p>
                  </div>
                ) : newsError ? (
                  <div className="text-center py-12 bg-red-50 text-red-700 rounded-3xl border border-red-100 text-xs font-bold max-w-4xl mx-auto">
                    {newsError}
                  </div>
                ) : newsInbox.length === 0 ? (
                  <div className="text-center py-20 bg-white/70 rounded-[2rem] border border-slate-100 shadow-md max-w-4xl mx-auto">
                    <span className="material-symbols-outlined text-4xl text-slate-300">inbox</span>
                    <p className="text-xs text-slate-550 mt-2 font-black uppercase tracking-wider">{language === 'English' ? 'No news articles found in current search query' : 'புதிய செய்திகள் எதுவும் இல்லை'}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {newsInbox.map((item, idx) => (
                      <div key={idx} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-lg hover:shadow-xl transition flex flex-col justify-between gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-extrabold text-[8px] uppercase tracking-wider">
                              {item.source}
                            </span>
                            <span className="text-slate-400 text-3xs font-bold">{item.date}</span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-800 leading-snug">
                            {item.title}
                          </h4>
                          <p className="text-2xs text-slate-500 leading-relaxed font-medium line-clamp-3">
                            {item.desc}
                          </p>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-auto">
                          <a
                            href={item.source_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-3xs font-extrabold text-blue-600 hover:text-blue-750 uppercase tracking-widest hover:underline"
                          >
                            {language === 'English' ? 'Read Source ↗' : 'மூலம் வாசி ↗'}
                          </a>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                // Discard news from inbox list
                                setNewsInbox(prev => prev.filter(n => n.source_link !== item.source_link));
                              }}
                              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 font-bold text-[10px] uppercase tracking-wide transition-colors"
                            >
                              {language === 'English' ? 'Discard' : 'தவிர்'}
                            </button>
                            <button
                              onClick={() => {
                                setSelectedInboxNews(item);
                                // Pre-fill edit fields
                                if (item.lang === 'ta') {
                                  setEditTitleTa(item.title);
                                  setEditDescTa(item.desc);
                                  setEditTitleEn('');
                                  setEditDescEn('');
                                } else {
                                  setEditTitleEn(item.title);
                                  setEditDescEn(item.desc);
                                  setEditTitleTa('');
                                  setEditDescTa('');
                                }
                                setEditLink(item.source_link);
                                setEditTagEn('Press Release');
                                setEditTagTa('செய்தி வெளியீடு');
                                setEditIcon('📰');
                                setShowApproveModal(true);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-emerald-650 hover:bg-emerald-700 text-white font-bold text-[10px] uppercase tracking-wide shadow-sm hover:scale-[1.02] transition"
                            >
                              {language === 'English' ? 'Approve & Edit' : 'பதிவிடு'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          }

          {
            dashboardSubTab === 'manage_legacy' && (
              <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">

                {/* Upload Form Card */}
                <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-slate-100">
                  <div className="border-b border-slate-100 pb-3 mb-6">
                    <h4 className="text-base font-black text-emerald-955 flex items-center gap-2">
                      <span className="material-symbols-outlined text-emerald-600 font-black">history_edu</span>
                      <span>{language === 'English' ? 'Add Legacy Milestone' : 'வரலாற்று சாதனைப் பதிவு'}</span>
                    </h4>
                    <p className="text-2xs text-slate-550 mt-1">
                      {language === 'English'
                        ? 'Publish historical milestones, welfare schemes, and governance accomplishments.'
                        : 'கட்சியின் உள்கட்டமைப்பு சாதனைகள் மற்றும் மக்கள் நலத் திட்டங்களைப் பதிவிடவும்.'}
                    </p>
                  </div>

                  <form onSubmit={handleUploadLegacyMilestone} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-2xs font-extrabold text-slate-500 uppercase mb-1.5">Year (Numerical)</label>
                        <input
                          type="number"
                          required
                          min="1972"
                          max="2030"
                          value={uploadMilestoneYear}
                          onChange={(e) => setUploadMilestoneYear(e.target.value)}
                          placeholder="e.g. 1982"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs focus:ring-1 focus:ring-emerald-600 focus:bg-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-2xs font-extrabold text-slate-500 uppercase mb-1.5">Title (English)</label>
                        <input
                          type="text"
                          value={uploadMilestoneTitleEn}
                          onChange={(e) => setUploadMilestoneTitleEn(e.target.value)}
                          placeholder="Enter English Title..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs focus:ring-1 focus:ring-emerald-600 focus:bg-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-2xs font-extrabold text-slate-500 uppercase mb-1.5">தலைப்பு (Tamil)</label>
                        <input
                          type="text"
                          required
                          value={uploadMilestoneTitleTa}
                          onChange={(e) => setUploadMilestoneTitleTa(e.target.value)}
                          placeholder="தமிழில் தலைப்பு..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs focus:ring-1 focus:ring-emerald-600 focus:bg-white outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-2xs font-extrabold text-slate-500 uppercase mb-1.5">Description (English)</label>
                        <textarea
                          rows="2"
                          value={uploadMilestoneDescEn}
                          onChange={(e) => setUploadMilestoneDescEn(e.target.value)}
                          placeholder="Describe in English..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs focus:ring-1 focus:ring-emerald-600 focus:bg-white outline-none resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-2xs font-extrabold text-slate-500 uppercase mb-1.5">விளக்கம் (Tamil)</label>
                        <textarea
                          rows="2"
                          required
                          value={uploadMilestoneDescTa}
                          onChange={(e) => setUploadMilestoneDescTa(e.target.value)}
                          placeholder="தமிழில் விளக்கம்..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs focus:ring-1 focus:ring-emerald-600 focus:bg-white outline-none resize-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-2xs font-extrabold text-slate-500 uppercase mb-1.5">Category</label>
                        <select
                          value={uploadMilestoneCategoryEn}
                          onChange={(e) => {
                            const val = e.target.value;
                            setUploadMilestoneCategoryEn(val);
                            if (val === 'Infrastructure & Elections') setUploadMilestoneCategoryTa('சட்டமன்றம் & தேர்தல்');
                            else if (val === 'Healthcare & Welfare') setUploadMilestoneCategoryTa('சுகாதாரம் & நலத்திட்டங்கள்');
                            else if (val === 'Water Schemes & Agriculture') setUploadMilestoneCategoryTa('விவசாயம் & நீர் திட்டங்கள்');
                            else if (val === 'Education') setUploadMilestoneCategoryTa('கல்வி');
                          }}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs focus:ring-1 focus:ring-emerald-600 focus:bg-white outline-none"
                        >
                          <option value="Infrastructure & Elections">🏛️ Infrastructure & Elections</option>
                          <option value="Healthcare & Welfare">🏥 Healthcare & Welfare</option>
                          <option value="Water Schemes & Agriculture">🚰 Water Schemes & Agriculture</option>
                          <option value="Education">🎓 Education</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={uploadMilestoneLoading}
                        className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs uppercase tracking-wider shadow-md hover:scale-[1.01] transition disabled:opacity-50"
                      >
                        {uploadMilestoneLoading ? (language === 'English' ? 'Publishing...' : 'பதிவேற்றுகிறது...') : (language === 'English' ? 'Publish Milestone' : 'பதிவிடு')}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Milestones Catalog Table */}
                <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-slate-100">
                  <div className="border-b border-slate-100 pb-3 mb-6">
                    <h4 className="text-base font-black text-slate-800">
                      {language === 'English' ? 'Legacy Milestones Catalog' : 'தற்போதைய சாதனைகள் பட்டியல்'}
                    </h4>
                  </div>

                  {legacyMilestones.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-8">{language === 'English' ? 'No milestones in catalog' : 'சாதனைகள் எதுவும் இல்லை'}</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-100 text-slate-400 font-extrabold uppercase text-[10px]">
                            <th className="py-3 px-4">{language === 'English' ? 'Year' : 'ஆண்டு'}</th>
                            <th className="py-3 px-4">{language === 'English' ? 'Category' : 'பிரிவு'}</th>
                            <th className="py-3 px-4">{language === 'English' ? 'Milestone' : 'சாதனைத் தலைப்பு'}</th>
                            <th className="py-3 px-4 text-center">{language === 'English' ? 'Action' : 'செயல்'}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {legacyMilestones.map((m) => (
                            <tr key={m._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                              <td className="py-3 px-4 font-extrabold text-emerald-800">{m.year}</td>
                              <td className="py-3 px-4">
                                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[9px] font-extrabold uppercase">
                                  {language === 'English' ? m.category_en : m.category_ta}
                                </span>
                              </td>
                              <td className="py-3 px-4 font-bold text-slate-700">
                                {language === 'English' ? m.title_en : m.title_ta}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <button
                                  onClick={() => handleDeleteLegacyMilestone(m._id)}
                                  className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 transition"
                                  title="Delete Milestone"
                                >
                                  <span className="material-symbols-outlined text-xs font-black">delete</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )
          }

          {
            dashboardSubTab === 'manage_gallery' && (
              <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">

                {/* Upload Form Card */}
                <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-slate-100">
                  <div className="border-b border-slate-100 pb-3 mb-6">
                    <h4 className="text-base font-black text-emerald-955 flex items-center gap-2">
                      <span className="material-symbols-outlined text-emerald-600 font-black">add_photo_alternate</span>
                      <span>{language === 'English' ? 'Upload Campaign Photo' : 'கேலரியில் புகைப்படம் பதிவேற்று'}</span>
                    </h4>
                    <p className="text-2xs text-slate-550 mt-1">
                      {language === 'English'
                        ? 'Publish rallies, meetings, or public events to the dynamic Media Gallery.'
                        : 'பிரச்சாரப் பேரணிகள் அல்லது பொது நல நிகழ்வுகளின் புகைப்படங்களை கேலரியில் வெளியிடவும்.'}
                    </p>
                  </div>

                  <form onSubmit={handleUploadGallery} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-2xs font-extrabold text-slate-500 uppercase mb-1.5">Caption (English)</label>
                        <input
                          type="text"
                          value={uploadTitleEn}
                          onChange={(e) => setUploadTitleEn(e.target.value)}
                          placeholder="Enter English Caption..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs focus:ring-1 focus:ring-emerald-600 focus:bg-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-2xs font-extrabold text-slate-500 uppercase mb-1.5">தலைப்பு (Tamil)</label>
                        <input
                          type="text"
                          required
                          value={uploadTitleTa}
                          onChange={(e) => setUploadTitleTa(e.target.value)}
                          placeholder="தமிழில் தலைப்பு..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs focus:ring-1 focus:ring-emerald-600 focus:bg-white outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-2xs font-extrabold text-slate-500 uppercase mb-1.5">Category</label>
                        <select
                          value={uploadCategoryEn}
                          onChange={(e) => {
                            const val = e.target.value;
                            setUploadCategoryEn(val);
                            if (val === 'Campaigns') setUploadCategoryTa('பிரச்சாரம்');
                            else if (val === 'Public Meetings') setUploadCategoryTa('பொது மக்கள் சந்திப்பு');
                            else if (val === 'Welfare Ceremonies') setUploadCategoryTa('மக்கள் நல உதவிகள்');
                          }}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs focus:ring-1 focus:ring-emerald-600 focus:bg-white outline-none"
                        >
                          <option value="Campaigns">📢 Campaigns</option>
                          <option value="Public Meetings">🤝 Public Meetings</option>
                          <option value="Welfare Ceremonies">🎓 Welfare Schemes</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-2xs font-extrabold text-slate-500 uppercase mb-1.5">Select Image File</label>
                        <input
                          id="gallery-file-input"
                          type="file"
                          accept="image/*"
                          required
                          onChange={(e) => setUploadImageFile(e.target.files[0])}
                          className="w-full text-xs text-slate-550 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-2xs file:font-black file:uppercase file:tracking-wide file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={uploadLoading}
                        className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs uppercase tracking-wider shadow-md hover:scale-[1.01] transition disabled:opacity-50"
                      >
                        {uploadLoading ? (language === 'English' ? 'Uploading...' : 'பதிவேற்றுகிறது...') : (language === 'English' ? 'Upload Photo Live' : 'படம் வெளியிடு')}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Photo Management List Card */}
                <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-slate-100">
                  <div className="border-b border-slate-100 pb-3 mb-6">
                    <h4 className="text-base font-black text-slate-800">
                      {language === 'English' ? 'Current Gallery Catalog' : 'தற்போதைய கேலரிப் படங்கள்'}
                    </h4>
                    <p className="text-2xs text-slate-555 mt-1">
                      {language === 'English'
                        ? 'Review and manage the active photos displayed on your public gallery portal.'
                        : 'பொது மக்கள் கேலரியில் உள்ள படங்களை ஆய்வு செய்து நிர்வகிக்கவும்.'}
                    </p>
                  </div>

                  {galleryPhotos.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-8">{language === 'English' ? 'No photos in catalog' : 'வட்டவணையில் புகைப்படங்கள் எதுவும் இல்லை'}</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {galleryPhotos.map((photo) => {
                        const src = photo.image_url.startsWith('/uploads') ? (API + photo.image_url) : photo.image_url;
                        return (
                          <div key={photo._id || photo.id} className="relative rounded-2xl overflow-hidden border border-slate-100 shadow-sm flex flex-col group h-40">
                            <img src={src} className="w-full h-24 object-cover" alt="catalog" />
                            <div className="p-2 flex-1 flex flex-col justify-between bg-slate-50/50">
                              <span className="text-[8px] font-extrabold uppercase text-emerald-700 truncate">{language === 'English' ? photo.category_en : photo.category_ta}</span>
                              <h5 className="text-[10px] font-bold text-slate-800 truncate leading-snug">{language === 'English' ? photo.title_en : photo.title_ta}</h5>
                            </div>
                            <button
                              onClick={() => handleDeleteGallery(photo._id)}
                              className="absolute right-2 top-2 p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 shadow-md opacity-0 group-hover:opacity-100"
                              title="Delete Photo"
                            >
                              <span className="material-symbols-outlined text-xs font-black">delete</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )
          }
        </div>

        {/* ─── SLEEK MINIMAL SITE FOOTER ─── */}
        <footer className="w-full bg-slate-950 text-slate-300 border-t border-emerald-900/60 relative z-10 py-6 px-6 sm:px-12 select-none">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold">
            
            {/* Left: Logo & Party Identity */}
            <div className="flex items-center gap-3 text-center sm:text-left">
              <img src="/irratai_ellai.png" className="w-8 h-8 object-contain bg-white rounded-full p-0.5 shadow-md border border-amber-400" alt="ADMK Leaves" />
              <div>
                <span className="font-black text-amber-400 uppercase tracking-wider block text-xs">
                  {language === 'English' ? 'AIADMK Public Governance Portal' : 'அதிமுக மக்கள் குறை தீர்ப்பு மையம்'}
                </span>
                <span className="text-3xs text-slate-400">Puratchi Thalaivar MGR Maaligai, Royapettah, Chennai</span>
              </div>
            </div>

            {/* Right: Copyright & Developed By Notice */}
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 text-2xs sm:text-xs">
              <span className="text-slate-400">© {new Date().getFullYear()} AIADMK. All Rights Reserved.</span>
              <span className="px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 font-black text-2xs uppercase tracking-wider shadow-sm animate-pulse">
                ⚡ Developed by Strategic Knights
              </span>
            </div>

          </div>
        </footer>

        {/* Global Floating Back-to-Top Upward Arrow Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-slate-900/90 hover:bg-amber-400 text-amber-400 hover:text-slate-950 border border-amber-400/50 hover:border-white flex items-center justify-center transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.8)] hover:scale-110 active:scale-95 group"
          title={language === 'English' ? 'Back to top' : 'மேலே செல்லவும்'}
          aria-label="Back to top"
        >
          <svg className="w-6 h-6 transition-transform duration-300 group-hover:-translate-y-1" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </div>

      {/* ─── CENTRED AUTH MODAL OVERLAY (FULL SCREEN RALLY BACKGROUND) ─── */}
      {
        showAuthModal && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto animate-fadeIn bg-no-repeat bg-cover bg-center"
            style={{
              backgroundImage: 'linear-gradient(rgba(4, 52, 23, 0.62), rgba(2, 32, 14, 0.76)), url("/rally_bg.jpg")',
            }}
          >
            {/* Centered Auth Card (Light glass theme card box) */}
            <div className="relative w-full max-w-[460px] bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl p-6 sm:p-8 border border-white/40 flex flex-col justify-between transition-all duration-300">
              {/* Close Button */}
              <button
                onClick={() => setShowAuthModal(false)}
                className="absolute right-5 top-5 text-slate-400 hover:text-slate-655 transition-colors focus:outline-none"
                title="Close"
              >
                <span className="material-symbols-outlined font-black">close</span>
              </button>

              <div>
                {/* Top Logo Badge */}
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-[#f0fdf4] rounded-full border border-emerald-200 flex items-center justify-center shadow-inner">
                    <img src="/irratai_ellai.png" className="w-10 h-10 object-contain" alt="Leaves" />
                  </div>
                </div>

                {/* Tab switch header */}
                <div className="flex items-center justify-between mb-6 border-b border-emerald-100 pb-2">
                  <div className="flex items-center gap-6">
                    <button
                      className={`text-base font-bold pb-2 transition-all focus:outline-none ${activeTab === 'login' ? 'text-emerald-800 border-b-2 border-emerald-600' : 'text-slate-400 hover:text-emerald-700'}`}
                      onClick={() => setActiveTab('login')}
                    >
                      {language === 'English' ? 'Sign In' : 'உள்நுழைவு'}
                    </button>
                    <button
                      className={`text-base font-bold pb-2 transition-all focus:outline-none ${activeTab === 'signup' ? 'text-emerald-800 border-b-2 border-emerald-600' : 'text-slate-400 hover:text-emerald-700'}`}
                      onClick={() => setActiveTab('signup')}
                    >
                      {language === 'English' ? 'Register' : 'பதிவு செய்ய'}
                    </button>
                  </div>

                  {/* Direct Super Admin Switch Link */}
                  <button
                    type="button"
                    onClick={() => { setShowAuthModal(false); navigate('/super-login'); }}
                    className="text-3xs font-black text-amber-600 hover:text-amber-700 uppercase tracking-wide bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 transition"
                  >
                    🛡️ {language === 'English' ? 'Super Admin' : 'நிர்வாகி'}
                  </button>
                </div>

                {/* Login Form */}
                {activeTab === 'login' && (
                  <form className="space-y-4" onSubmit={login}>
                    <div>
                      <label className="block text-xs font-bold text-emerald-800 mb-1.5 uppercase tracking-wide">
                        {language === 'English' ? 'Email Address' : 'மின்னஞ்சல் முகவரி'}
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 text-sm">mail</span>
                        <input
                          type="email"
                          required
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="w-full pl-11 pr-5 py-3 rounded-xl bg-slate-50 border border-emerald-100 text-slate-800 placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-1 focus:ring-emerald-600 transition-all outline-none text-xs shadow-sm"
                          placeholder="name@example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-emerald-800 mb-1.5 uppercase tracking-wide">
                        {language === 'English' ? 'Password' : 'கடவுச்சொல்'}
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 text-sm">lock</span>
                        <input
                          type="password"
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="w-full pl-11 pr-5 py-3 rounded-xl bg-slate-50 border border-emerald-100 text-slate-800 placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-1 focus:ring-emerald-600 transition-all outline-none text-xs shadow-sm"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-md active:scale-98 transition-all text-xs mt-2 focus:outline-none"
                    >
                      {language === 'English' ? 'Sign In' : 'உள்நுழைக'}
                    </button>
                  </form>
                )}

                {/* Signup Form */}
                {activeTab === 'signup' && (
                  <form className="space-y-4" onSubmit={signup}>
                    <div>
                      <label className="block text-xs font-bold text-emerald-800 mb-1.5 uppercase tracking-wide">
                        {language === 'English' ? 'Full Name' : 'முழு பெயர்'}
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 text-sm">person</span>
                        <input
                          type="text"
                          required
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                          className="w-full pl-11 pr-5 py-3 rounded-xl bg-slate-50 border border-emerald-100 text-slate-800 placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-1 focus:ring-emerald-600 transition-all outline-none text-xs shadow-sm"
                          placeholder={language === 'English' ? 'Enter your name' : 'உங்கள் பெயர்'}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-emerald-800 mb-1.5 uppercase tracking-wide">
                        {language === 'English' ? 'Email Address' : 'மின்னஞ்சல் முகவரி'}
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 text-sm">mail</span>
                        <input
                          type="email"
                          required
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          className="w-full pl-11 pr-5 py-3 rounded-xl bg-slate-50 border border-emerald-100 text-slate-800 placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-1 focus:ring-emerald-600 transition-all outline-none text-xs shadow-sm"
                          placeholder="name@example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-emerald-800 mb-1.5 uppercase tracking-wide">
                        {language === 'English' ? 'Create Password' : 'புதிய கடவுச்சொல்'}
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 text-sm">lock</span>
                        <input
                          type="password"
                          required
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          className="w-full pl-11 pr-5 py-3 rounded-xl bg-slate-50 border border-emerald-100 text-slate-800 placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-1 focus:ring-emerald-600 transition-all outline-none text-xs shadow-sm"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-emerald-800 mb-1.5 uppercase tracking-wide">
                        {language === 'English' ? 'Phone Number' : 'தொலைபேசி எண்'}
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 text-sm">phone</span>
                        <input
                          type="tel"
                          required
                          value={signupPhone}
                          onChange={(e) => setSignupPhone(e.target.value)}
                          className="w-full pl-11 pr-5 py-3 rounded-xl bg-slate-50 border border-emerald-100 text-slate-800 placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-1 focus:ring-emerald-600 transition-all outline-none text-xs shadow-sm"
                          placeholder={language === 'English' ? 'Enter mobile number' : 'மொபைல் எண்'}
                          inputMode="numeric"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-emerald-800 mb-1.5 uppercase tracking-wide">
                        {language === 'English' ? 'Date of Birth' : 'பிறந்த தேதி'}
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 text-sm">calendar_month</span>
                        <input
                          type="date"
                          required
                          value={signupDob}
                          onChange={(e) => setSignupDob(e.target.value)}
                          className="w-full pl-11 pr-5 py-3 rounded-xl bg-slate-50 border border-emerald-100 text-slate-800 placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-1 focus:ring-emerald-600 transition-all outline-none text-xs shadow-sm"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-md active:scale-98 transition-all text-xs mt-2 focus:outline-none"
                    >
                      {language === 'English' ? 'Create Account' : 'கணக்கை உருவாக்கு'}
                    </button>
                  </form>
                )}

                {/* Social Authentication / Google Login */}
                <div className="mt-8 relative z-10" data-purpose="social-auth">
                  <div className="relative flex items-center justify-center mb-6">
                    <div className="border-t border-slate-200 w-full absolute"></div>
                    <span className="relative bg-white px-4 text-[10px] font-bold text-slate-450 uppercase tracking-widest">
                      {language === 'English' ? 'Or continue with' : 'அல்லது இதனுடன் தொடரவும்'}
                    </span>
                  </div>
                  <div className="w-full flex justify-center">
                    <button
                      onClick={handleGoogleLogin}
                      className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold transition-all active:scale-[0.98] text-sm focus:outline-none shadow-sm"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z"
                          fill="#4285F4"
                        ></path>
                      </svg>
                      <span className="text-sm font-bold">{language === 'English' ? 'Google Account' : 'கூகுள் கணக்கு'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer inside the card */}
              <div className="pt-6 border-t border-slate-100 text-center mt-8">
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">
                  InsightFlow Corporate Feedback &copy; {new Date().getFullYear()}
                </p>
              </div>
            </div>
          </div>
        )
      }

      {/* ─── NEWS CURATION/APPROVAL EDIT MODAL ─── */}
      {
        showApproveModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-black/55 overflow-y-auto animate-fadeIn">
            <div className="relative w-full max-w-[620px] bg-white rounded-[2.5rem] shadow-2xl p-6 sm:p-8 border border-emerald-100 flex flex-col justify-between transition-all duration-300">
              <button
                onClick={() => setShowApproveModal(false)}
                className="absolute right-5 top-5 text-slate-400 hover:text-slate-550 transition-colors focus:outline-none"
                title="Close"
              >
                <span className="material-symbols-outlined font-black">close</span>
              </button>

              <form onSubmit={handleApproveNews} className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-lg font-black text-emerald-955 flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-600">article</span>
                    <span>{language === 'English' ? 'Edit & Publish ADMK Statement' : 'செய்தியைத் திருத்தி வெளியிடுதல்'}</span>
                  </h3>
                  <p className="text-3xs text-slate-450 mt-1 uppercase tracking-wide">
                    {language === 'English' ? 'Source: ' : 'மூலம்: '} {selectedInboxNews?.source} ({selectedInboxNews?.date})
                  </p>
                </div>

                {/* Title Inputs */}
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-2xs font-extrabold text-slate-500 uppercase mb-1">
                      Title (English) <span className="text-slate-350 font-normal">(Leave blank if not translating)</span>
                    </label>
                    <input
                      type="text"
                      value={editTitleEn}
                      onChange={(e) => setEditTitleEn(e.target.value)}
                      placeholder="Enter English Title..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs focus:ring-1 focus:ring-emerald-600 focus:bg-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-2xs font-extrabold text-slate-500 uppercase mb-1">
                      தலைப்பு (Tamil) <span className="text-slate-350 font-normal">(தமிழில் செய்தி தலைப்பு)</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editTitleTa}
                      onChange={(e) => setEditTitleTa(e.target.value)}
                      placeholder="தமிழில் தலைப்பை உள்ளிடவும்..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs focus:ring-1 focus:ring-emerald-600 focus:bg-white outline-none"
                    />
                  </div>
                </div>

                {/* Description/Body textareas */}
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-2xs font-extrabold text-slate-500 uppercase mb-1">Description (English)</label>
                    <textarea
                      rows="3"
                      value={editDescEn}
                      onChange={(e) => setEditDescEn(e.target.value)}
                      placeholder="Enter English Summary / Statement text..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs focus:ring-1 focus:ring-emerald-600 focus:bg-white outline-none resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-2xs font-extrabold text-slate-500 uppercase mb-1">விளக்கம் / அறிக்கை (Tamil)</label>
                    <textarea
                      rows="3"
                      required
                      value={editDescTa}
                      onChange={(e) => setEditDescTa(e.target.value)}
                      placeholder="தமிழில் செய்தி விவரங்களை உள்ளிடவும்..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs focus:ring-1 focus:ring-emerald-600 focus:bg-white outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Customizing tags, icon and source URL link */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-2xs font-extrabold text-slate-500 uppercase mb-1">Category (EN)</label>
                    <input
                      type="text"
                      value={editTagEn}
                      onChange={(e) => setEditTagEn(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-100 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-2xs font-extrabold text-slate-500 uppercase mb-1">வகை (TA)</label>
                    <input
                      type="text"
                      value={editTagTa}
                      onChange={(e) => setEditTagTa(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-100 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-2xs font-extrabold text-slate-500 uppercase mb-1">Icon Emoji</label>
                    <select
                      value={editIcon}
                      onChange={(e) => setEditIcon(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-100 text-xs outline-none"
                    >
                      <option value="📰">📰 Press Release / News</option>
                      <option value="📢">📢 Announcement / Campaign</option>
                      <option value="🎓">🎓 Scholarship / Welfare</option>
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
        )
      }

      {/* ─── IDEA SUBMISSION MODAL ─── */}
      {
        showIdeaModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-black/60 animate-fadeIn text-slate-800">
            <div className="relative w-full max-w-md p-8 rounded-[2rem] border border-white/20 bg-white shadow-2xl space-y-6">
              <div className="text-center space-y-1">
                <h3 className="text-xl font-black text-emerald-955 uppercase">{language === 'English' ? 'Submit Your Idea' : 'ஆலோசனை வழங்குக'}</h3>
                <p className="text-3xs text-slate-500 uppercase font-black">{language === 'English' ? 'Draft your goal for Tamil Nadu 2031' : 'விஷன் 2031-க்கான ஆலோசனை'}</p>
              </div>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!newIdeaText.trim() || !newIdeaAuthor.trim()) {
                    notify('Incomplete Form', 'Please fill in all fields.', 'warning');
                    return;
                  }
                  const newIdea = {
                    id: tn2031Ideas.length + 1,
                    category: newIdeaCategory,
                    text: newIdeaText,
                    author: newIdeaAuthor,
                    date: 'Just now'
                  };
                  const updatedTN = [newIdea, ...tn2031Ideas];
                  setTn2031Ideas(updatedTN);
                  try {
                    localStorage.setItem('insightflow_tn2031_ideas', JSON.stringify(updatedTN));
                  } catch (err) {}

                  // Send to backend API
                  try {
                    await fetch(`${API}/feedback`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        type_of_feedback: 'Tamil Nadu 2031 Idea',
                        category: newIdeaCategory || 'Vision 2031',
                        feedback_title: `Idea by ${newIdeaAuthor}`,
                        feedback_text: newIdeaText.trim(),
                        district: 'Salem',
                        importance: 'Normal',
                        user: { name: newIdeaAuthor, email: 'citizen@tn2031.org' }
                      })
                    });
                  } catch (apiErr) {}

                  setNewIdeaText('');
                  setNewIdeaAuthor('');
                  setShowIdeaModal(false);

                  // Show Thank You Alert
                  Swal.fire({
                    title: language === 'English' ? 'Thank You!' : 'நன்றி!',
                    html: language === 'English'
                      ? '<div style="text-align:center; padding:10px;"><p style="font-size:16px; font-weight:800; color:#065f46; margin-bottom:6px;">Your Idea Has Been Saved Successfully!</p><p style="font-size:13px; color:#334155;">Your vision for <strong>Tamil Nadu 2031</strong> has been added to the public idea wall.</p></div>'
                      : '<div style="text-align:center; padding:10px;"><p style="font-size:16px; font-weight:800; color:#065f46; margin-bottom:6px;">உங்களது கருத்து வெற்றிகரமாகப் பதிவு செய்யப்பட்டது!</p><p style="font-size:13px; color:#334155;">தமிழ்நாடு 2031-ற்கான உங்களது ஆலோசனை கருத்துச் சுவரில் சேர்க்கப்பட்டது.</p></div>',
                    icon: 'success',
                    confirmButtonText: language === 'English' ? 'Awesome' : 'சரி',
                    confirmButtonColor: '#10b981',
                    customClass: { popup: 'glass-popup' },
                  });
                }}
                className="space-y-4"
              >
                <div className="space-y-1">
                  <label className="text-3xs font-black uppercase text-slate-505 block tracking-wider">{language === 'English' ? 'Category' : 'வகை'}</label>
                  <select
                    value={newIdeaCategory}
                    onChange={(e) => setNewIdeaCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-2xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Jobs">Jobs & Economy</option>
                    <option value="Education">Education & Tech</option>
                    <option value="Women">Women Empowerment</option>
                    <option value="Agriculture">Agriculture & Water</option>
                    <option value="Sustainability">Sustainability</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-3xs font-black uppercase text-slate-505 block tracking-wider">{language === 'English' ? 'Your Suggestion' : 'ஆலோசனை விவரம்'}</label>
                  <textarea
                    value={newIdeaText}
                    onChange={(e) => setNewIdeaText(e.target.value)}
                    rows="3"
                    maxLength="120"
                    placeholder="Limit to 120 characters..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-xs focus:outline-none focus:border-emerald-500 placeholder-slate-405"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-3xs font-black uppercase text-slate-505 block tracking-wider">{language === 'English' ? 'Your Name' : 'உங்கள் பெயர்'}</label>
                  <input
                    type="text"
                    value={newIdeaAuthor}
                    onChange={(e) => setNewIdeaAuthor(e.target.value)}
                    placeholder="Enter name..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-xs focus:outline-none focus:border-emerald-500 placeholder-slate-405"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowIdeaModal(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-505 font-bold text-xs uppercase tracking-wide hover:bg-slate-50"
                  >
                    {language === 'English' ? 'Cancel' : 'ரத்து செய்'}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-805 text-white font-black text-xs uppercase tracking-wider shadow-md transition"
                  >
                    {language === 'English' ? 'Post to Idea Wall' : 'சுவரில் பதிவிடு'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )
      }

      {/* ─── SCRAPBOOK MODAL ─── */}
      {
        showMemoryModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-black/60 animate-fadeIn text-slate-800">
            <div className="relative w-full max-w-md p-8 rounded-[2rem] border border-white/20 bg-white shadow-2xl space-y-6">
              <div className="text-center space-y-1">
                <h3 className="text-xl font-black text-emerald-955 uppercase">{language === 'English' ? 'Share Your Memory' : 'நினைவைப்பகிர்'}</h3>
                <p className="text-3xs text-slate-500 uppercase font-black">{language === 'English' ? 'Add your story to our digital archives' : 'கழக வரலாற்றில் உங்கள் குடும்பத்தின் கதை'}</p>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newMemoryText.trim() || !newMemoryAuthor.trim() || !newMemoryYear.trim()) {
                    notify('Incomplete Form', 'Please fill in all fields.', 'warning');
                    return;
                  }
                  const newMem = {
                    id: scrapbookMemories.length + 1,
                    text: newMemoryText,
                    author: newMemoryAuthor,
                    year: newMemoryYear,
                    imgIdx: newMemoryImageIdx
                  };
                  setScrapbookMemories(prev => [newMem, ...prev]);
                  setNewMemoryText('');
                  setNewMemoryAuthor('');
                  setNewMemoryYear('1982');
                  setNewMemoryImageIdx(prev => prev + 1);
                  setShowMemoryModal(false);
                  notify('Success', 'Your story was pinned to the scrapbook wall!', 'success');
                }}
                className="space-y-4"
              >
                <div className="space-y-1">
                  <label className="text-3xs font-black uppercase text-slate-505 block tracking-wider">{language === 'English' ? 'Approximate Year' : 'தோராயமான ஆண்டு'}</label>
                  <input
                    type="text"
                    value={newMemoryYear}
                    onChange={(e) => setNewMemoryYear(e.target.value)}
                    placeholder="e.g. 1984"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-xs focus:outline-none focus:border-emerald-500 placeholder-slate-405"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-3xs font-black uppercase text-slate-505 block tracking-wider">{language === 'English' ? 'Your Anecdote' : 'நினைவலை'}</label>
                  <textarea
                    value={newMemoryText}
                    onChange={(e) => setNewMemoryText(e.target.value)}
                    rows="3"
                    maxLength="140"
                    placeholder="Limit to 140 characters..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-xs focus:outline-none focus:border-emerald-500 placeholder-slate-405"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-3xs font-black uppercase text-slate-505 block tracking-wider">{language === 'English' ? 'Your Name' : 'உங்கள் பெயர்'}</label>
                  <input
                    type="text"
                    value={newMemoryAuthor}
                    onChange={(e) => setNewMemoryAuthor(e.target.value)}
                    placeholder="e.g. Ganesan (54)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-xs focus:outline-none focus:border-emerald-500 placeholder-slate-405"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowMemoryModal(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-550 font-bold text-xs uppercase tracking-wide hover:bg-slate-50"
                  >
                    {language === 'English' ? 'Cancel' : 'ரத்து செய்'}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-805 text-white font-black text-xs uppercase tracking-wider shadow-md transition"
                  >
                    {language === 'English' ? 'Pin to Scrapbook' : 'நினைவேட்டில் சேர்'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )
      }

      {/* ─── LIGHTBOX VIEWER OVERLAY ─── */}
      {
        activeLightboxImage && (
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
        )
      }

      {/* ─── DISTRICT DETAILS POP-UP MODAL ─── */}
      {selectedModalDistrict && (
        <DistrictDetailsModal
          distName={selectedModalDistrict}
          onClose={() => setSelectedModalDistrict(null)}
          language={language}
          constituencyData={constituencyData}
          TN_DISTRICT_REGIONS={TN_DISTRICT_REGIONS}
          pressReleases={pressReleases}
          newsInbox={newsInbox}
          userRole={userRole}
          setRedirectAfterAuth={setRedirectAfterAuth}
          setShowAuthModal={setShowAuthModal}
          setActiveView={setActiveView}
          setSelectedDistrict={setSelectedDistrict}
          setSelectedConstituency={setSelectedConstituency}
        />
      )}
    </div>
  );
}


