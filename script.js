/**
 * JanSeva Portal - script.js
 * Logic for CSV loading, Eligibility Filtering, and Language Support
 */

// 1. Dataset Mockup (In production, this would be your 500+ line CSV)
// Format: Name, Ministry, State, Gender, AgeMin, AgeMax, IncomeMax, Category, Student, Farmer, BPL, Disability, Description, Benefits, Documents, URL
const CSV_PLACEHOLDER = `scheme_name,ministry,state,gender,age_min,age_max,income_max,category,is_student,is_farmer,is_bpl,is_disabled,description,benefits,documents,url
PM-Kisan Samman Nidhi,Agriculture,Central,Male,18,100,200000,All,No,Yes,No,No,Direct income support of Rs. 6000 per year.,Income Support,Aadhaar;Land Records,https://pmkisan.gov.in/
Pradhan Mantri Awas Yojana,Housing,Central,All,18,70,600000,All,No,No,Yes,No,Affordable housing for all citizens.,Home Subsidy,Income Cert;Aadhaar;Address Proof,https://pmaymis.gov.in/
Post-Matric Scholarship,Education,Central,All,15,30,250000,SC/ST/OBC,Yes,No,No,No,Financial assistance for higher education.,Tuition Fee Waiver,Caste Cert;Mark Sheet;Fee Receipt,https://scholarships.gov.in/
Sukanya Samriddhi Yojana,WCD,Central,Female,0,10,0,All,No,No,No,No,Small deposit scheme for the girl child.,High Interest Savings,Birth Cert;Guardian Aadhaar,https://www.indiapost.gov.in/
Ayushman Bharat (PM-JAY),Health,Central,All,0,100,120000,All,No,No,Yes,No,Health insurance cover of Rs. 5 Lakh.,Free Hospitalization,Ration Card;Aadhaar,https://pmjay.gov.in/
Rythu Bandhu,Agriculture,Telangana,All,18,100,0,All,No,Yes,No,No,Investment support for agriculture.,Rs 5000 per acre,Pattadar Passbook;Aadhaar,https://rythubandhu.telangana.gov.in/
Amma Vodi,Education,Andhra Pradesh,Female,18,60,120000,All,Yes,No,Yes,No,Support for mothers sending children to school.,Rs 15000 annually,Aadhaar;School ID,https://jaganannaammavodi.ap.gov.in/
`

// 2. Language Translations
const translations = {
    en: {
        nav_home: "Home", nav_schemes: "Schemes", nav_about: "About", nav_contact: "Contact",
        hero_title: "Empowering Every Indian Citizen",
        hero_subtitle: "Discover your eligibility for 500+ Central and State Government schemes in just a few clicks.",
        hero_cta: "Check Eligibility", hero_learn: "Learn More",
        stat_schemes: "Live Schemes", stat_states: "States Covered",
        filter_title: "User Profile", label_age: "Age", label_gender: "Gender",
        label_state: "State", label_income: "Annual Income (₹)", label_occupation: "Occupation",
        check_bpl: "BPL Card Holder", check_minority: "Minority", check_disability: "Disability",
        btn_check: "CHECK ELIGIBILITY"
    },
    hi: {
        nav_home: "होम", nav_schemes: "योजनाएं", nav_about: "परिचय", nav_contact: "संपर्क",
        hero_title: "हर भारतीय नागरिक का सशक्तिकरण",
        hero_subtitle: "बस कुछ ही क्लिक में 500+ केंद्र और राज्य सरकार की योजनाओं के लिए अपनी पात्रता खोजें।",
        hero_cta: "पात्रता जांचें", hero_learn: "अधिक जानें",
        stat_schemes: "सक्रिय योजनाएं", stat_states: "राज्यों की कवरेज",
        filter_title: "उपयोगकर्ता प्रोफाइल", label_age: "आयु", label_gender: "लिंग",
        label_state: "राज्य", label_income: "वार्षिक आय (₹)", label_occupation: "व्यवसाय",
        check_bpl: "बीपीएल कार्ड धारक", check_minority: "अल्पसंख्यक", check_disability: "विकलांगता",
        btn_check: "पात्रता जांचें"
    },
    te: {
        nav_home: "హోమ్", nav_schemes: "పథకాలు", nav_about: "గురించి", nav_contact: "సంప్రదించండి",
        hero_title: "ప్రతి భారతీయ పౌరుడికి సాధికారత",
        hero_subtitle: "కొన్ని క్లిక్‌లలో 500+ కేంద్ర మరియు రాష్ట్ర ప్రభుత్వ పథకాల కోసం మీ అర్హతను కనుగొనండి.",
        hero_cta: "అర్హతను తనిఖీ చేయండి", hero_learn: "మరింత తెలుసుకోండి",
        stat_schemes: "లైవ్ పథకాలు", stat_states: "రాష్ట్రాల పరిధి",
        filter_title: "యూజర్ ప్రొఫైల్", label_age: "వయస్సు", label_gender: "లింగం",
        label_state: "రాష్ట్రం", label_income: "వార్షిక ఆదాయం (₹)", label_occupation: "వృత్తి",
        check_bpl: "BPL కార్డు హోల్డర్", check_minority: "మైనారిటీ", check_disability: "వైకల్యం",
        btn_check: "అర్హత తనిఖీ"
    }
};

let allSchemes = [];

// 3. Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadSchemes();
    setupEventListeners();
    applyLanguage('en');
});

// 4. Load & Parse CSV
async function loadSchemes() {
    try {
        // In actual project, use: const response = await fetch('data/government_schemes.csv');
        // const csvText = await response.text();
        const csvText = CSV_PLACEHOLDER; // Using placeholder for demo
        
        allSchemes = parseCSV(csvText);
        renderSchemes(allSchemes);
    } catch (err) {
        console.error("CSV Loading Error:", err);
    }
}

function parseCSV(text) {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',');
    
    return lines.slice(1).map(line => {
        const values = line.split(',');
        const obj = {};
        headers.forEach((header, i) => {
            obj[header.trim()] = values[i]?.trim();
        });
        return obj;
    });
}

// 5. Rendering Schemes
function renderSchemes(data) {
    const container = document.getElementById('schemes-container');
    container.innerHTML = '';

    if (data.length === 0) {
        container.innerHTML = `<div class="no-results">No schemes found for your profile. Try broadening your search.</div>`;
        return;
    }

    data.forEach(scheme => {
        const card = document.createElement('div');
        card.className = 'scheme-card';
        card.innerHTML = `
            <span class="state-tag">${scheme.state}</span>
            <div class="card-icon"><i class="fas fa-landmark"></i></div>
            <h3>${scheme.scheme_name}</h3>
            <p>${scheme.description.substring(0, 100)}...</p>
            <div class="card-actions">
                <button class="card-btn btn-details" onclick="showDetails('${scheme.scheme_name}')">Details</button>
                <button class="card-btn btn-docs" onclick="showDocs('${scheme.scheme_name}')">Docs</button>
                ${scheme.url !== 'None' ? `<a href="${scheme.url}" target="_blank" class="card-btn btn-apply">Apply</a>` : ''}
            </div>
        `;
        container.appendChild(card);
    });
}

// 6. Filtering Logic
function filterSchemes() {
    const age = parseInt(document.getElementById('user-age').value) || 0;
    const gender = document.getElementById('user-gender').value;
    const state = document.getElementById('user-state').value;
    const income = parseInt(document.getElementById('user-income').value) || 9999999;
    const occupation = document.getElementById('user-occupation').value;
    const isBpl = document.getElementById('is-bpl').checked;
    const isMinority = document.getElementById('is-minority').checked;
    const isDisabled = document.getElementById('is-disabled').checked;
    const searchQuery = document.getElementById('scheme-search').value.toLowerCase();

    const filtered = allSchemes.filter(s => {
        // Age Match
        const ageMatch = age >= parseInt(s.age_min) && age <= parseInt(s.age_max);
        
        // Gender Match
        const genderMatch = s.gender === 'All' || s.gender === gender;
        
        // State Match
        const stateMatch = s.state === 'Central' || s.state === state;
        
        // Income Match
        const incomeMatch = (parseInt(s.income_max) === 0) || (income <= parseInt(s.income_max));

        // Occupation/Category logic
        const farmerMatch = s.is_farmer === 'Yes' ? occupation === 'Farmer' : true;
        const studentMatch = s.is_student === 'Yes' ? occupation === 'Student' : true;
        
        // Special Status
        const bplMatch = s.is_bpl === 'Yes' ? isBpl : true;
        const disabledMatch = s.is_disabled === 'Yes' ? isDisabled : true;

        // Search Query
        const searchMatch = s.scheme_name.toLowerCase().includes(searchQuery) || 
                            s.description.toLowerCase().includes(searchQuery);

        return ageMatch && genderMatch && stateMatch && incomeMatch && farmerMatch && studentMatch && bplMatch && disabledMatch && searchMatch;
    });

    renderSchemes(filtered);
}

// 7. Event Handlers
function setupEventListeners() {
    // Form Submit
    document.getElementById('eligibility-form').addEventListener('submit', (e) => {
        e.preventDefault();
        filterSchemes();
        document.getElementById('search-section').scrollIntoView({ behavior: 'smooth' });
    });

    // Search Bar
    document.getElementById('scheme-search').addEventListener('input', filterSchemes);

    // Theme Toggle
    document.getElementById('theme-toggle').addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const icon = document.querySelector('#theme-toggle i');
        icon.classList.toggle('fa-moon');
        icon.classList.toggle('fa-sun');
    });

    // Language Toggle
    document.getElementById('lang-selector').addEventListener('change', (e) => {
        applyLanguage(e.target.value);
    });

    // Modal Close
    document.querySelector('.close-modal').addEventListener('click', () => {
        document.getElementById('details-modal').style.display = 'none';
    });
}

// 8. UI Helpers
function applyLanguage(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = translations[lang][key] || el.textContent;
    });
}

function showDetails(schemeName) {
    const scheme = allSchemes.find(s => s.scheme_name === schemeName);
    const modalBody = document.getElementById('modal-body');
    
    modalBody.innerHTML = `
        <h2 style="color: var(--navy)">${scheme.scheme_name}</h2>
        <p style="margin: 15px 0"><strong>Ministry:</strong> ${scheme.ministry}</p>
        <hr>
        <div class="modal-sec">
            <h4>Description</h4>
            <p>${scheme.description}</p>
        </div>
        <div class="modal-sec">
            <h4>Benefits</h4>
            <p>${scheme.benefits}</p>
        </div>
        <div class="modal-sec">
            <h4>Eligibility Criteria</h4>
            <ul>
                <li>Age: ${scheme.age_min} to ${scheme.age_max} years</li>
                <li>Income Limit: ₹${scheme.income_max || 'No limit'}</li>
                <li>Target: ${scheme.category}</li>
            </ul>
        </div>
        <br>
        <a href="${scheme.url}" target="_blank" class="btn primary-btn">Go to Official Website</a>
    `;
    
    document.getElementById('details-modal').style.display = 'flex';
}

function showDocs(schemeName) {
    const scheme = allSchemes.find(s => s.scheme_name === schemeName);
    const docs = scheme.documents.split(';');
    const modalBody = document.getElementById('modal-body');

    modalBody.innerHTML = `
        <h2 style="color: var(--primary)">Required Documents</h2>
        <p>Keep these digital copies ready before applying for <strong>${scheme.scheme_name}</strong>.</p>
        <ul class="doc-list" style="margin-top: 20px; list-style: none">
            ${docs.map(doc => `<li style="padding: 10px; border-bottom: 1px solid #eee"><i class="fas fa-file-pdf" style="color: red; margin-right: 10px"></i> ${doc}</li>`).join('')}
            <li style="padding: 10px; border-bottom: 1px solid #eee"><i class="fas fa-id-card" style="color: blue; margin-right: 10px"></i> Passport Size Photo</li>
        </ul>
    `;
    document.getElementById('details-modal').style.display = 'flex';
}
