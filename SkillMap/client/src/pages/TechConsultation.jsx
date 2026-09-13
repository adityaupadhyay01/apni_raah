import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import Icon from "../components/common/Icon";
import PageHeader from "../components/common/PageHeader";

import { LanguageSwitch } from "../components/layout/Topbar";
import { useLang } from "../context/LanguageContext";

// Each answer maps to a tech track score
const QUESTIONS = [
  {
    id: 1,
    text: {
      en: "What type of work excites you the most?",
      hi: "किस तरह का काम आपको सबसे ज़्यादा उत्साहित करता है?",
    },
    options: [
      {
        label: { en: "Designing interfaces (UI)", hi: "इंटरफ़ेस (UI) डिज़ाइन करना" },
        scores: { frontend: 2 },
      },
      {
        label: { en: "Solving logic problems", hi: "तर्क की समस्याएँ सुलझाना" },
        scores: { backend: 2 },
      },
      {
        label: { en: "Working with data", hi: "डेटा के साथ काम करना" },
        scores: { data: 2 },
      },
      {
        label: { en: "Building systems end-to-end", hi: "पूरा सिस्टम शुरू से आख़िर तक बनाना" },
        scores: { backend: 1, frontend: 1 },
      },
    ],
  },
  {
    id: 2,
    text: {
      en: "Which environment do you prefer?",
      hi: "आप किस तरह का माहौल पसंद करते हैं?",
    },
    options: [
      {
        label: { en: "Visual & interactive", hi: "विज़ुअल और इंटरैक्टिव" },
        scores: { frontend: 2 },
      },
      {
        label: { en: "Server-side logic", hi: "सर्वर-साइड लॉजिक" },
        scores: { backend: 2 },
      },
      {
        label: { en: "Numbers & analysis", hi: "संख्याएँ और विश्लेषण" },
        scores: { data: 2 },
      },
      {
        label: { en: "Mix of everything", hi: "सब कुछ थोड़ा-थोड़ा" },
        scores: { backend: 1, frontend: 1 },
      },
    ],
  },
  {
    id: 3,
    text: {
      en: "What are you more comfortable with?",
      hi: "आप किसमें ज़्यादा सहज हैं?",
    },
    options: [
      {
        label: { en: "Styling, layouts, UI polish", hi: "स्टाइलिंग, लेआउट, यूआई सुधार" },
        scores: { frontend: 2 },
      },
      {
        label: { en: "APIs, databases, logic", hi: "एपीआई, डेटाबेस, लॉजिक" },
        scores: { backend: 2 },
      },
      {
        label: { en: "Statistics, trends, insights", hi: "आँकड़े, रुझान, निष्कर्ष" },
        scores: { data: 2 },
      },
      {
        label: { en: "Still exploring", hi: "अभी तलाश रहे हैं" },
        scores: { frontend: 1, backend: 1, data: 1 },
      },
    ],
  },
  {
    id: 4,
    text: {
      en: "What have you tried before?",
      hi: "आपने पहले क्या आज़माया है?",
    },
    options: [
      {
        label: { en: "HTML/CSS/JS or UI work", hi: "HTML/CSS/JS या यूआई का काम" },
        scores: { frontend: 2 },
      },
      {
        label: { en: "DSA / backend / APIs", hi: "डीएसए / बैकएंड / एपीआई" },
        scores: { backend: 2 },
      },
      {
        label: { en: "Excel / analytics / ML basics", hi: "एक्सेल / एनालिटिक्स / एमएल बेसिक्स" },
        scores: { data: 2 },
      },
      {
        label: { en: "Nothing yet", hi: "अभी कुछ नहीं" },
        scores: { frontend: 1, backend: 1, data: 1 },
      },
    ],
  },
  {
    id: 5,
    text: {
      en: "What matters most to you right now?",
      hi: "अभी आपके लिए सबसे ज़्यादा क्या मायने रखता है?",
    },
    options: [
      {
        label: { en: "Creativity & visuals", hi: "रचनात्मकता और विज़ुअल" },
        scores: { frontend: 2 },
      },
      {
        label: { en: "Problem solving & systems", hi: "समस्या समाधान और सिस्टम" },
        scores: { backend: 2 },
      },
      {
        label: { en: "Insights & impact from data", hi: "डेटा से निष्कर्ष और प्रभाव" },
        scores: { data: 2 },
      },
      {
        label: { en: "Flexibility", hi: "लचीलापन" },
        scores: { frontend: 1, backend: 1 },
      },
    ],
  },
];

const ROLE_INFO = {
  frontend: {
    title: { en: "Frontend Developer", hi: "फ़्रंटएंड डेवलपर" },
    mapsTo: "Web Developer",
    tone: "brand",
    icon: "code",
    why: {
      en: [
        "You lean towards visual and interactive work",
        "You enjoy building UI and user experiences",
        "You prefer creative implementation over heavy math",
      ],
      hi: [
        "आपका झुकाव विज़ुअल और इंटरैक्टिव काम की ओर है",
        "आपको यूआई और यूज़र अनुभव बनाना पसंद है",
        "भारी गणित से ज़्यादा आपको रचनात्मक अमल पसंद है",
      ],
    },
    next: {
      en: "Start with HTML, CSS, JavaScript then React",
      hi: "HTML, CSS, JavaScript से शुरू करें, फिर React",
    },
    alternatives: ["UI/UX Designer", "Product Designer"],
  },
  backend: {
    title: { en: "Backend Developer", hi: "बैकएंड डेवलपर" },
    mapsTo: "DevOps Engineer",
    tone: "sage",
    icon: "settings",
    why: {
      en: [
        "You enjoy logic, systems, and problem solving",
        "You prefer APIs, databases, and server-side work",
        "You are comfortable with structured thinking",
      ],
      hi: [
        "आपको लॉजिक, सिस्टम और समस्या सुलझाना पसंद है",
        "आप एपीआई, डेटाबेस और सर्वर-साइड काम पसंद करते हैं",
        "व्यवस्थित सोच में आप सहज हैं",
      ],
    },
    next: {
      en: "Start with Node.js / Java / Python then APIs & databases",
      hi: "Node.js / Java / Python से शुरू करें, फिर एपीआई और डेटाबेस",
    },
    alternatives: ["Full Stack Developer", "DevOps"],
  },
  data: {
    title: { en: "Data Analyst / Data Scientist", hi: "डेटा एनालिस्ट / डेटा साइंटिस्ट" },
    mapsTo: "Data Analyst",
    tone: "lilac",
    icon: "chart",
    why: {
      en: [
        "You enjoy working with data and insights",
        "You prefer analytical thinking",
        "You are comfortable with trends and numbers",
      ],
      hi: [
        "आपको डेटा और निष्कर्षों के साथ काम करना पसंद है",
        "आप विश्लेषणात्मक सोच पसंद करते हैं",
        "रुझानों और संख्याओं में आप सहज हैं",
      ],
    },
    next: {
      en: "Start with Python then Pandas then visualization",
      hi: "Python से शुरू करें, फिर Pandas, फिर विज़ुअलाइज़ेशन",
    },
    alternatives: ["Business Analyst", "ML Engineer"],
  },
};

/** Minimal page chrome for the pre-dashboard discovery screens. */
function QuizHeader({ onBack }) {
  const { tr } = useLang();

  return (
    <header className="px-5 sm:px-8 py-5 flex items-center justify-between max-w-3xl mx-auto">
      <Button variant="ghost" size="sm" icon="arrowLeft" onClick={onBack}>
        {tr("back")}
      </Button>
      <LanguageSwitch />
    </header>
  );
}

const TONE_CHIP = {
  brand: "bg-brand-soft text-brand",
  sage: "bg-sage-soft text-sage",
  lilac: "bg-lilac-soft text-lilac",
};

export default function TechConsultation() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const navigate = useNavigate();
  const { lang, tr } = useLang();

  const handleSelect = (option) => {
    setAnswers((prev) => {
      const updated = [...prev];
      updated[step] = option.scores;
      return updated;
    });
    setStep((s) => s + 1);
  };

  const calculateResult = () => {
    const score = { frontend: 0, backend: 0, data: 0 };

    answers.forEach((ans) => {
      Object.entries(ans || {}).forEach(([key, val]) => {
        score[key] += val;
      });
    });

    const best = Object.keys(score).reduce((a, b) => (score[a] >= score[b] ? a : b));
    const total = Object.values(score).reduce((a, b) => a + b, 0) || 1;

    return {
      ...ROLE_INFO[best],
      match: Math.min(99, Math.max(40, Math.round((score[best] / total) * 100))),
    };
  };

  const isComplete = step >= QUESTIONS.length;
  const progress = Math.round((step / QUESTIONS.length) * 100);

  /* ── RESULT ─────────────────────────────────────────── */
  if (isComplete) {
    const result = calculateResult();

    return (
      <div className="min-h-screen sm-glow">
        <QuizHeader onBack={() => navigate("/landing")} />
        <div className="max-w-3xl mx-auto px-5 sm:px-8 pb-16">
        <PageHeader
          eyebrow={tr("tc_eyebrow")}
          title={tr("tc_result_title")}
          subtitle={tr("tc_result_sub")}
          actions={
            <Button
              variant="secondary"
              icon="refresh"
              onClick={() => {
                setStep(0);
                setAnswers([]);
              }}
            >
              {tr("cd_restart")}
            </Button>
          }
        />

        <Card className="sm-rise">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-6">
            <span
              className={`grid place-items-center w-14 h-14 rounded-[20px] shrink-0 ${
                TONE_CHIP[result.tone]
              }`}
            >
              <Icon name={result.icon} size={26} />
            </span>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h2 className="text-[1.4rem] font-bold">{result.title[lang]}</h2>
                <Badge tone="sage">{result.match}% {tr("cd_match")}</Badge>
              </div>
              <p className="text-[0.86rem] text-ink-soft">
                {tr("tc_alternatives")}: {result.alternatives.join(", ")}
              </p>
            </div>
          </div>

          <div className="sm-inset p-4 sm:p-5 mb-4">
            <div className="sm-eyebrow mb-3">{tr("cd_why")}</div>
            <ul className="space-y-2">
              {result.why[lang].map((w, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[0.88rem] text-ink-soft">
                  <span className="grid place-items-center w-5 h-5 rounded-full bg-sage-soft text-sage shrink-0 mt-0.5">
                    <Icon name="check" size={11} strokeWidth={3} />
                  </span>
                  {w}
                </li>
              ))}
            </ul>
          </div>

          <div className="sm-inset p-4 sm:p-5 mb-6">
            <div className="sm-eyebrow mb-2">{tr("tc_next_step")}</div>
            <p className="text-[0.92rem] font-semibold">{result.next[lang]}</p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Button
              size="lg"
              iconRight="arrowRight"
              onClick={() =>
                navigate("/onboarding", {
                  state: { role: result.mapsTo, from: "counselling" },
                })
              }
            >
              {tr("cd_start")}
            </Button>
            <Button size="lg" variant="secondary" onClick={() => navigate("/login")}>
              {tr("tc_save_account")}
            </Button>
          </div>
        </Card>
        </div>
      </div>
    );
  }

  /* ── QUESTIONS ──────────────────────────────────────── */
  const question = QUESTIONS[step];

  return (
    <div className="min-h-screen sm-glow">
      <QuizHeader onBack={() => navigate("/landing")} />
      <div className="max-w-3xl mx-auto px-5 sm:px-8 pb-16">
      <PageHeader
        eyebrow={tr("tc_eyebrow")}
        title={tr("tc_title")}
        subtitle={tr("tc_sub")}
      />

      <div className="flex items-center gap-2 mb-5">
        {QUESTIONS.map((q, i) => (
          <div
            key={q.id}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i < step ? "bg-brand" : i === step ? "bg-brand/45" : "bg-canvas-deep"
            }`}
          />
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-[0.8rem] font-bold text-ink-soft">
          {tr("cd_question")} {step + 1} / {QUESTIONS.length}
        </span>
        <Badge tone="brand">{progress}%</Badge>
      </div>

      <Card key={step} className="sm-rise">
        <h2 className="text-[1.25rem] sm:text-[1.4rem] font-bold leading-snug mb-1.5">
          {question.text[lang]}
        </h2>
        <p className="text-[0.84rem] text-ink-faint mb-6">{tr("cd_pick_one")}</p>

        <div className="grid gap-2.5">
          {question.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSelect(opt)}
              className="group flex items-center gap-3.5 text-left px-4 py-3.5 rounded-[16px]
                border border-line bg-surface-muted transition-all duration-150
                hover:border-brand/40 hover:bg-brand-soft/60 hover:translate-x-0.5"
            >
              <span
                className="grid place-items-center w-6 h-6 rounded-full border-2 border-line-soft
                  bg-surface text-transparent shrink-0 transition-all
                  group-hover:border-brand group-hover:text-brand"
              >
                <Icon name="check" size={12} strokeWidth={3} />
              </span>
              <span className="text-[0.92rem] font-semibold flex-1">{opt.label[lang]}</span>
              <Icon
                name="chevronRight"
                size={16}
                className="text-ink-faint opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </button>
          ))}
        </div>
      </Card>

      <div className="mt-5 flex items-center justify-between">
        <Button
          variant="ghost"
          icon="arrowLeft"
          disabled={step === 0}
          onClick={() => setStep((s) => Math.max(0, s - 1))}
        >
          {tr("cd_previous")}
        </Button>
        <span className="text-[0.78rem] text-ink-faint">{tr("cd_no_wrong")}</span>
      </div>
      </div>
    </div>
  );
}
