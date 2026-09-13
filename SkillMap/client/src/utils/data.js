export const ROLES = {
  "Data Analyst": {
    //icon:"📊",
    skills:["SQL","Excel","Python","Statistics","Data Visualization","Data Cleaning","Tableau","Power BI","R","Business Intelligence"],
    deps:{"Data Cleaning":["SQL"],"Data Visualization":["Data Cleaning","Excel"],"Tableau":["Data Visualization"],"Power BI":["Data Visualization"],"Business Intelligence":["SQL","Tableau"]},
    priorities:{"SQL":"HIGH","Python":"HIGH","Statistics":"HIGH","Data Cleaning":"HIGH","Excel":"MEDIUM","Data Visualization":"MEDIUM","Tableau":"MEDIUM","Power BI":"MEDIUM","R":"LOW","Business Intelligence":"LOW"},
    resources:{"SQL":"Mode Analytics, W3Schools SQL","Python":"Python.org, freeCodeCamp","Statistics":"Khan Academy Stats","Data Cleaning":"Kaggle courses","Tableau":"Tableau Public free training","Data Visualization":"Storytelling with Data (book)"}
  },
  "Web Developer": {
    //icon:"💻",
    skills:["HTML","CSS","JavaScript","React","Node.js","Git","REST APIs","TypeScript","Testing","Docker"],
    deps:{"CSS":["HTML"],"JavaScript":["HTML","CSS"],"React":["JavaScript"],"Node.js":["JavaScript"],"REST APIs":["JavaScript","Node.js"],"TypeScript":["JavaScript"],"Testing":["JavaScript"],"Docker":["Node.js"]},
    priorities:{"HTML":"HIGH","CSS":"HIGH","JavaScript":"HIGH","React":"HIGH","Git":"HIGH","Node.js":"MEDIUM","REST APIs":"MEDIUM","TypeScript":"MEDIUM","Testing":"LOW","Docker":"LOW"},
    resources:{"HTML":"MDN Web Docs","CSS":"CSS-Tricks, Flexbox Froggy","JavaScript":"javascript.info, Eloquent JS","React":"react.dev official docs","Node.js":"nodejs.org, The Odin Project","Git":"Oh My Git!, GitHub Learning Lab"}
  },
  "ML Engineer": {
    //icon:"🤖",
    skills:["Python","Linear Algebra","Statistics","Machine Learning","Deep Learning","PyTorch","Data Preprocessing","Feature Engineering","Model Deployment","MLOps"],
    deps:{"Machine Learning":["Python","Linear Algebra","Statistics"],"Deep Learning":["Machine Learning","PyTorch"],"Feature Engineering":["Data Preprocessing","Statistics"],"Model Deployment":["Machine Learning"],"MLOps":["Model Deployment"]},
    priorities:{"Python":"HIGH","Linear Algebra":"HIGH","Statistics":"HIGH","Machine Learning":"HIGH","Data Preprocessing":"HIGH","PyTorch":"MEDIUM","Deep Learning":"MEDIUM","Feature Engineering":"MEDIUM","Model Deployment":"LOW","MLOps":"LOW"},
    resources:{"Python":"fast.ai, Python Data Science Handbook","Linear Algebra":"3Blue1Brown (YouTube)","Machine Learning":"Andrew Ng's Coursera","Deep Learning":"fast.ai part 2","PyTorch":"pytorch.org tutorials","Data Preprocessing":"Kaggle micro-courses"}
  },
  "Product Manager": {
    //icon:"🎯",
    skills:["Product Strategy","User Research","Data Analysis","Roadmapping","Stakeholder Management","A/B Testing","SQL","Wireframing","Agile","Market Research"],
    deps:{"Roadmapping":["Product Strategy"],"A/B Testing":["Data Analysis","SQL"],"Stakeholder Management":["Product Strategy"],"Market Research":["User Research"]},
    priorities:{"Product Strategy":"HIGH","User Research":"HIGH","Data Analysis":"HIGH","Stakeholder Management":"HIGH","Roadmapping":"MEDIUM","A/B Testing":"MEDIUM","SQL":"MEDIUM","Wireframing":"MEDIUM","Agile":"LOW","Market Research":"LOW"},
    resources:{"Product Strategy":"Inspired by Marty Cagan","User Research":"Just Enough Research (book)","SQL":"Mode Analytics","Wireframing":"Figma free tier","A/B Testing":"Optimizely Academy"}
  },
  "DevOps Engineer": {
    //icon:"⚙️",
    skills:["Linux","Docker","Kubernetes","CI/CD","Terraform","AWS","Monitoring","Scripting","Security","Networking"],
    deps:{"Docker":["Linux"],"Kubernetes":["Docker"],"CI/CD":["Docker","Scripting"],"Terraform":["AWS","Scripting"],"Monitoring":["Linux","Docker"]},
    priorities:{"Linux":"HIGH","Docker":"HIGH","Scripting":"HIGH","AWS":"HIGH","CI/CD":"MEDIUM","Kubernetes":"MEDIUM","Terraform":"MEDIUM","Monitoring":"MEDIUM","Security":"LOW","Networking":"LOW"},
    resources:{"Linux":"Linux Journey, The Linux Command Line","Docker":"Docker official docs + play-with-docker","Kubernetes":"Kubernetes.io tutorials","AWS":"AWS Free Tier + Cloud Practitioner cert","Terraform":"HashiCorp Learn","Scripting":"Bash Guide for Beginners"}
  }
};

export const ALL_SKILLS = ["Python","JavaScript","SQL","HTML","CSS","React","Node.js","Git","Excel","Statistics","Machine Learning","Deep Learning","Data Visualization","Docker","Kubernetes","Linux","AWS","Tableau","Power BI","TypeScript","R","REST APIs","Agile","Wireframing","User Research","Product Strategy","Figma","Java","C++","PostgreSQL","MongoDB","Redux","GraphQL","Pandas","NumPy","PyTorch","TensorFlow","Terraform","Jenkins","Bash"];

/* ------------------------------------------------------------------ */
/* PROFICIENCY LEVELS                                                  */
/* ------------------------------------------------------------------ */

// Ordered weakest → strongest. Index is used to compare against the
// level a role actually expects for a skill.
export const LEVELS = ["Beginner", "Intermediate", "Advanced"];

export const DEFAULT_LEVEL = "Beginner";

// What a role expects for a skill, derived from its priority.
// HIGH priority skills must be strong; LOW priority ones just need exposure.
export const REQUIRED_LEVEL_BY_PRIORITY = {
  HIGH: "Advanced",
  MEDIUM: "Intermediate",
  LOW: "Beginner",
};

/* ------------------------------------------------------------------ */
/* CAREER DISCOVERY — mock role matching for the counselling quiz      */
/* ------------------------------------------------------------------ */

// How strongly each interest domain points at each target role.
// Used to turn quiz scores into a match percentage.
export const CAREER_MATCH = {
  tech: [
    { role: "Web Developer", weight: 1.0 },
    { role: "DevOps Engineer", weight: 0.75 },
    { role: "ML Engineer", weight: 0.7 },
  ],
  finance: [
    { role: "Data Analyst", weight: 1.0 },
    { role: "Product Manager", weight: 0.65 },
    { role: "ML Engineer", weight: 0.5 },
  ],
  design: [
    { role: "Product Manager", weight: 0.9 },
    { role: "Web Developer", weight: 0.85 },
    { role: "Data Analyst", weight: 0.4 },
  ],
  business: [
    { role: "Product Manager", weight: 1.0 },
    { role: "Data Analyst", weight: 0.7 },
    { role: "Web Developer", weight: 0.5 },
  ],
  research: [
    { role: "ML Engineer", weight: 1.0 },
    { role: "Data Analyst", weight: 0.85 },
    { role: "DevOps Engineer", weight: 0.45 },
  ],
};

// Short, human reason shown under each recommendation.
export const CAREER_REASONS = {
  "Web Developer": {
    en: "You like building things people can see and use, and you are comfortable with logic and structure.",
    hi: "आपको ऐसी चीज़ें बनाना पसंद है जिन्हें लोग देख और इस्तेमाल कर सकें, और तर्क व संरचना में आप सहज हैं।",
  },
  "Data Analyst": {
    en: "You think in numbers and patterns, and you enjoy turning messy information into clear answers.",
    hi: "आप आँकड़ों और पैटर्न में सोचते हैं, और बिखरी जानकारी से साफ़ जवाब निकालना आपको पसंद है।",
  },
  "ML Engineer": {
    en: "You are drawn to deep analysis and theory, and you are patient with problems that take time to crack.",
    hi: "गहरे विश्लेषण और सिद्धांत में आपकी रुचि है, और कठिन समस्याओं पर धैर्य से काम कर सकते हैं।",
  },
  "Product Manager": {
    en: "You connect people, ideas and priorities well, and you like deciding what matters most.",
    hi: "आप लोगों, विचारों और प्राथमिकताओं को अच्छे से जोड़ते हैं, और यह तय करना पसंद करते हैं कि सबसे ज़रूरी क्या है।",
  },
  "DevOps Engineer": {
    en: "You like systems that run reliably, and automating the boring parts appeals to you.",
    hi: "आपको भरोसेमंद तरीके से चलने वाले सिस्टम पसंद हैं, और उबाऊ कामों को स्वचालित करना आपको भाता है।",
  },
};
