// src/utils/i18n.js
// Lightweight static translation layer — English + Hindi.
// No i18n library: one flat dictionary per language plus a tiny t() helper.

import en from "./i18n.en";
import hi from "./i18n.hi";

/** Languages the UI is actually translated into. */
export const LANGUAGES = {
  en: { label: "English", short: "EN" },
  hi: { label: "हिन्दी", short: "हिं" },
};

/**
 * Every major Indian language offered in the picker.
 * Only `supported: true` entries can be selected today — the rest are
 * listed as "coming soon" so the roadmap is visible to students.
 */
export const ALL_LANGUAGES = [
  { code: "en", native: "English", english: "English", short: "EN", supported: true },
  { code: "hi", native: "हिन्दी", english: "Hindi", short: "हिं", supported: true },
  { code: "bn", native: "বাংলা", english: "Bengali", short: "বাং" },
  { code: "mr", native: "मराठी", english: "Marathi", short: "मरा" },
  { code: "te", native: "తెలుగు", english: "Telugu", short: "తెలు" },
  { code: "ta", native: "தமிழ்", english: "Tamil", short: "தமி" },
  { code: "gu", native: "ગુજરાતી", english: "Gujarati", short: "ગુજ" },
  { code: "ur", native: "اردو", english: "Urdu", short: "اردو" },
  { code: "kn", native: "ಕನ್ನಡ", english: "Kannada", short: "ಕನ್" },
  { code: "or", native: "ଓଡ଼ିଆ", english: "Odia", short: "ଓଡ଼" },
  { code: "ml", native: "മലയാളം", english: "Malayalam", short: "മല" },
  { code: "pa", native: "ਪੰਜਾਬੀ", english: "Punjabi", short: "ਪੰਜ" },
  { code: "as", native: "অসমীয়া", english: "Assamese", short: "অস" },
];

export const DEFAULT_LANG = "en";

const UI = { en, hi };

export const ROLE_I18N = {
  "Data Analyst": { en: "Data Analyst", hi: "डेटा एनालिस्ट" },
  "Web Developer": { en: "Web Developer", hi: "वेब डेवलपर" },
  "ML Engineer": { en: "ML Engineer", hi: "एमएल इंजीनियर" },
  "Product Manager": { en: "Product Manager", hi: "प्रोडक्ट मैनेजर" },
  "DevOps Engineer": { en: "DevOps Engineer", hi: "डेवऑप्स इंजीनियर" },
};

/* ------------------------------------------------------------------ */
/* SKILL NAMES + ONE-LINE DESCRIPTIONS                                 */
/* ------------------------------------------------------------------ */

export const SKILL_I18N = {
  SQL: {
    hi: "एसक्यूएल",
    desc: "Query databases to pull and shape the data you need.",
    hiDesc: "डेटाबेस से ज़रूरी डेटा निकालना और व्यवस्थित करना।",
  },
  Excel: {
    hi: "एक्सेल",
    desc: "Spreadsheets, formulas and pivot tables for quick analysis.",
    hiDesc: "तेज़ विश्लेषण के लिए स्प्रेडशीट, फ़ॉर्मूला और पिवट टेबल।",
  },
  Python: {
    hi: "पायथन",
    desc: "The general-purpose language behind most data and ML work.",
    hiDesc: "डेटा और एमएल के अधिकतर काम की मुख्य प्रोग्रामिंग भाषा।",
  },
  Statistics: {
    hi: "सांख्यिकी",
    desc: "Averages, distributions and significance — how not to fool yourself.",
    hiDesc: "औसत, वितरण और सार्थकता — ग़लत नतीजों से बचने का तरीका।",
  },
  "Data Visualization": {
    hi: "डेटा विज़ुअलाइज़ेशन",
    desc: "Turning numbers into charts people can act on.",
    hiDesc: "आँकड़ों को ऐसे चार्ट में बदलना जिन पर लोग निर्णय ले सकें।",
  },
  "Data Cleaning": {
    hi: "डेटा क्लीनिंग",
    desc: "Fixing messy, missing and duplicate data before analysis.",
    hiDesc: "विश्लेषण से पहले अधूरे और दोहराए डेटा को ठीक करना।",
  },
  Tableau: {
    hi: "टैबलो",
    desc: "Drag-and-drop dashboards used widely in analytics teams.",
    hiDesc: "एनालिटिक्स टीमों में इस्तेमाल होने वाला आसान डैशबोर्ड टूल।",
  },
  "Power BI": {
    hi: "पावर बीआई",
    desc: "Microsoft's business dashboard tool, common in Indian enterprises.",
    hiDesc: "माइक्रोसॉफ़्ट का डैशबोर्ड टूल, भारतीय कंपनियों में आम।",
  },
  R: {
    hi: "आर",
    desc: "A statistics-first language used in research and reporting.",
    hiDesc: "शोध और रिपोर्टिंग में इस्तेमाल होने वाली सांख्यिकी भाषा।",
  },
  "Business Intelligence": {
    hi: "बिज़नेस इंटेलिजेंस",
    desc: "Connecting data work to the business questions behind it.",
    hiDesc: "डेटा के काम को व्यापार के असली सवालों से जोड़ना।",
  },
  HTML: {
    hi: "एचटीएमएल",
    desc: "The structure of every web page.",
    hiDesc: "हर वेब पेज का ढाँचा।",
  },
  CSS: {
    hi: "सीएसएस",
    desc: "Layout, spacing and styling for the web.",
    hiDesc: "वेब पेज की सजावट, लेआउट और स्टाइल।",
  },
  JavaScript: {
    hi: "जावास्क्रिप्ट",
    desc: "The language that makes web pages interactive.",
    hiDesc: "वह भाषा जो वेब पेज को इंटरैक्टिव बनाती है।",
  },
  React: {
    hi: "रिएक्ट",
    desc: "Component-based UI library used by most product teams.",
    hiDesc: "अधिकतर प्रोडक्ट टीमों में इस्तेमाल होने वाली यूआई लाइब्रेरी।",
  },
  "Node.js": {
    hi: "नोड.जेएस",
    desc: "Running JavaScript on the server to build APIs.",
    hiDesc: "सर्वर पर जावास्क्रिप्ट चलाकर एपीआई बनाना।",
  },
  Git: {
    hi: "गिट",
    desc: "Version control — non-negotiable for working on a team.",
    hiDesc: "वर्ज़न कंट्रोल — टीम में काम करने के लिए ज़रूरी।",
  },
  "REST APIs": {
    hi: "रेस्ट एपीआई",
    desc: "How front-end and back-end actually talk to each other.",
    hiDesc: "फ़्रंटएंड और बैकएंड आपस में कैसे बात करते हैं।",
  },
  TypeScript: {
    hi: "टाइपस्क्रिप्ट",
    desc: "Typed JavaScript — increasingly the default in job postings.",
    hiDesc: "टाइप वाली जावास्क्रिप्ट — अब अधिकतर नौकरियों में माँगी जाती है।",
  },
  Testing: {
    hi: "टेस्टिंग",
    desc: "Writing checks so your code keeps working after changes.",
    hiDesc: "बदलाव के बाद भी कोड सही चले, इसके लिए जाँच लिखना।",
  },
  Docker: {
    hi: "डॉकर",
    desc: "Packaging an app so it runs the same everywhere.",
    hiDesc: "ऐप को इस तरह पैक करना कि वह हर जगह एक जैसा चले।",
  },
  "Linear Algebra": {
    hi: "रैखिक बीजगणित",
    desc: "Vectors and matrices — the maths under every ML model.",
    hiDesc: "वेक्टर और मैट्रिक्स — हर एमएल मॉडल का गणितीय आधार।",
  },
  "Machine Learning": {
    hi: "मशीन लर्निंग",
    desc: "Training models that learn patterns from data.",
    hiDesc: "डेटा से पैटर्न सीखने वाले मॉडल तैयार करना।",
  },
  "Deep Learning": {
    hi: "डीप लर्निंग",
    desc: "Neural networks for images, text and speech.",
    hiDesc: "चित्र, पाठ और आवाज़ के लिए न्यूरल नेटवर्क।",
  },
  PyTorch: {
    hi: "पायटॉर्च",
    desc: "The framework most deep-learning jobs expect today.",
    hiDesc: "आज अधिकतर डीप लर्निंग नौकरियों में माँगा जाने वाला फ़्रेमवर्क।",
  },
  "Data Preprocessing": {
    hi: "डेटा प्रीप्रोसेसिंग",
    desc: "Shaping raw data into something a model can learn from.",
    hiDesc: "कच्चे डेटा को मॉडल के सीखने लायक बनाना।",
  },
  "Feature Engineering": {
    hi: "फ़ीचर इंजीनियरिंग",
    desc: "Creating the inputs that actually make a model accurate.",
    hiDesc: "ऐसे इनपुट बनाना जिनसे मॉडल सचमुच सटीक बने।",
  },
  "Model Deployment": {
    hi: "मॉडल डिप्लॉयमेंट",
    desc: "Getting a trained model into a real product.",
    hiDesc: "तैयार मॉडल को असली प्रोडक्ट में लगाना।",
  },
  MLOps: {
    hi: "एमएलऑप्स",
    desc: "Monitoring, retraining and versioning models in production.",
    hiDesc: "प्रोडक्शन में मॉडल की निगरानी, दोबारा ट्रेनिंग और वर्ज़निंग।",
  },
  "Product Strategy": {
    hi: "प्रोडक्ट रणनीति",
    desc: "Deciding what to build and, harder, what not to.",
    hiDesc: "क्या बनाना है और क्या नहीं — यह तय करना।",
  },
  "User Research": {
    hi: "यूज़र रिसर्च",
    desc: "Talking to users to find real problems, not assumed ones.",
    hiDesc: "यूज़र से बात कर असली समस्याएँ पहचानना।",
  },
  "Data Analysis": {
    hi: "डेटा विश्लेषण",
    desc: "Reading product numbers to decide the next move.",
    hiDesc: "प्रोडक्ट के आँकड़े पढ़कर अगला कदम तय करना।",
  },
  Roadmapping: {
    hi: "रोडमैप बनाना",
    desc: "Sequencing work so a team ships in the right order.",
    hiDesc: "काम को इस क्रम में रखना कि टीम सही समय पर डिलीवर करे।",
  },
  "Stakeholder Management": {
    hi: "हितधारक प्रबंधन",
    desc: "Keeping engineering, design and business aligned.",
    hiDesc: "इंजीनियरिंग, डिज़ाइन और बिज़नेस को एक दिशा में रखना।",
  },
  "A/B Testing": {
    hi: "ए/बी टेस्टिंग",
    desc: "Proving a change works instead of arguing about it.",
    hiDesc: "बहस के बजाय प्रयोग से साबित करना कि बदलाव काम करता है।",
  },
  Wireframing: {
    hi: "वायरफ़्रेमिंग",
    desc: "Sketching screens fast, before anything is built.",
    hiDesc: "कुछ बनाने से पहले स्क्रीन का खाका जल्दी तैयार करना।",
  },
  Agile: {
    hi: "एजाइल",
    desc: "Shipping in small cycles with regular feedback.",
    hiDesc: "छोटे चक्रों में काम पूरा करना और लगातार फ़ीडबैक लेना।",
  },
  "Market Research": {
    hi: "बाज़ार शोध",
    desc: "Understanding competitors and where the gap is.",
    hiDesc: "प्रतिस्पर्धियों और बाज़ार की खाली जगह को समझना।",
  },
  Linux: {
    hi: "लिनक्स",
    desc: "The command line and OS nearly all servers run on.",
    hiDesc: "कमांड लाइन और वह ओएस जिस पर लगभग सभी सर्वर चलते हैं।",
  },
  Kubernetes: {
    hi: "कुबरनेटीज़",
    desc: "Running and scaling containers across many machines.",
    hiDesc: "कई मशीनों पर कंटेनर चलाना और स्केल करना।",
  },
  "CI/CD": {
    hi: "सीआई/सीडी",
    desc: "Automating build, test and release pipelines.",
    hiDesc: "बिल्ड, टेस्ट और रिलीज़ को स्वचालित करना।",
  },
  Terraform: {
    hi: "टेराफ़ॉर्म",
    desc: "Defining cloud infrastructure as code you can review.",
    hiDesc: "क्लाउड इंफ़्रास्ट्रक्चर को कोड की तरह लिखना।",
  },
  AWS: {
    hi: "एडब्ल्यूएस",
    desc: "The cloud platform most Indian companies hire for.",
    hiDesc: "वह क्लाउड प्लेटफ़ॉर्म जिसके लिए अधिकतर भारतीय कंपनियाँ भर्ती करती हैं।",
  },
  Monitoring: {
    hi: "मॉनिटरिंग",
    desc: "Knowing something broke before your users tell you.",
    hiDesc: "यूज़र बताने से पहले ही गड़बड़ी पकड़ लेना।",
  },
  Scripting: {
    hi: "स्क्रिप्टिंग",
    desc: "Automating repetitive work with small scripts.",
    hiDesc: "छोटी स्क्रिप्ट से दोहराव वाले काम स्वचालित करना।",
  },
  Security: {
    hi: "सुरक्षा",
    desc: "Secrets, access control and safe defaults.",
    hiDesc: "पासवर्ड, एक्सेस नियंत्रण और सुरक्षित डिफ़ॉल्ट सेटिंग।",
  },
  Networking: {
    hi: "नेटवर्किंग",
    desc: "DNS, ports and routing — why things cannot reach each other.",
    hiDesc: "डीएनएस, पोर्ट और रूटिंग — कनेक्शन क्यों नहीं बनता।",
  },
};

/* ------------------------------------------------------------------ */
/* HELPERS                                                             */
/* ------------------------------------------------------------------ */

/** Translate a UI key. Extra values fill {placeholders}. */
export function t(lang, key, vars) {
  const dict = UI[lang] || UI[DEFAULT_LANG];
  let str = dict[key] ?? UI[DEFAULT_LANG][key] ?? key;

  if (vars) {
    Object.entries(vars).forEach(([k, v]) => {
      str = str.split(`{${k}}`).join(v);
    });
  }

  return str;
}

/** Role name in the active language (falls back to the raw key). */
export function tRole(lang, role) {
  return ROLE_I18N[role]?.[lang] || role;
}

/** Skill name — technical names stay, Hindi gets a transliteration hint. */
export function tSkill(lang, skill) {
  if (lang === "hi" && SKILL_I18N[skill]?.hi) {
    return `${skill} (${SKILL_I18N[skill].hi})`;
  }
  return skill;
}

/** One-line description of what a skill is / why it matters. */
export function tSkillDesc(lang, skill) {
  const entry = SKILL_I18N[skill];
  if (!entry) return "";
  return lang === "hi" ? entry.hiDesc : entry.desc;
}

/** Proficiency level label. */
export function tLevel(lang, level) {
  return t(lang, `level_${level}`);
}

/** HIGH / MEDIUM / LOW -> High / उच्च etc. */
export function tPriority(lang, priority) {
  return t(lang, `priority_${priority}`);
}
