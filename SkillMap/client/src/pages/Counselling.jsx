import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import Icon from "../components/common/Icon";
import Field from "../components/common/Field";
import { ProgressBar } from "../components/common/Progress";
import PageHeader from "../components/common/PageHeader";

import { LanguageSwitch } from "../components/layout/Topbar";
import { useLang } from "../context/LanguageContext";
import { CAREER_MATCH, CAREER_REASONS, ROLES } from "../utils/data";

const QUESTIONS = [
  {
    id: 1,
    text: {
      en: "What type of work naturally interests you the most?",
      hi: "आपको किस तरह का काम सबसे ज़्यादा पसंद आता है?",
    },
    options: [
      {
        label: {
          en: "Building apps, systems, or technology",
          hi: "ऐप, सिस्टम या तकनीक बनाना",
        },
        scores: { tech: 2 },
      },
      {
        label: {
          en: "Managing money or financial plans",
          hi: "पैसे और वित्तीय योजनाओं का प्रबंधन",
        },
        scores: { finance: 2 },
      },
      {
        label: { en: "Creating visuals or designs", hi: "डिज़ाइन और विज़ुअल बनाना" },
        scores: { design: 2 },
      },
      {
        label: { en: "Leading people or projects", hi: "लोगों या प्रोजेक्ट का नेतृत्व" },
        scores: { business: 2 },
      },
      {
        label: { en: "Researching and deep analysis", hi: "शोध और गहरा विश्लेषण" },
        scores: { research: 2 },
      },
    ],
  },
  {
    id: 2,
    text: {
      en: "Which environment do you enjoy most?",
      hi: "आपको किस तरह का माहौल सबसे अच्छा लगता है?",
    },
    options: [
      {
        label: { en: "Technical / coding work", hi: "तकनीकी / कोडिंग का काम" },
        scores: { tech: 2 },
      },
      {
        label: { en: "Financial / data analysis", hi: "वित्तीय / डेटा विश्लेषण" },
        scores: { finance: 2 },
      },
      {
        label: { en: "Creative / design space", hi: "रचनात्मक / डिज़ाइन का माहौल" },
        scores: { design: 2 },
      },
      {
        label: {
          en: "Meetings / planning / strategy",
          hi: "बैठकें / योजना / रणनीति",
        },
        scores: { business: 2 },
      },
      {
        label: { en: "Academic / theory-based", hi: "शैक्षणिक / सैद्धांतिक" },
        scores: { research: 2 },
      },
    ],
  },
  {
    id: 3,
    text: {
      en: "What are you naturally good at?",
      hi: "आप स्वाभाविक रूप से किसमें अच्छे हैं?",
    },
    options: [
      {
        label: { en: "Logic & problem solving", hi: "तर्क और समस्या सुलझाना" },
        scores: { tech: 2 },
      },
      {
        label: { en: "Numbers & calculations", hi: "संख्याएँ और गणना" },
        scores: { finance: 2 },
      },
      {
        label: { en: "Creativity & visuals", hi: "रचनात्मकता और विज़ुअल" },
        scores: { design: 2 },
      },
      {
        label: {
          en: "Communication & leadership",
          hi: "संवाद और नेतृत्व",
        },
        scores: { business: 2 },
      },
      {
        label: { en: "Deep thinking", hi: "गहरी सोच" },
        scores: { research: 2 },
      },
    ],
  },
  {
    id: 4,
    text: {
      en: "What have you explored before?",
      hi: "आपने पहले क्या आज़माया है?",
    },
    options: [
      {
        label: { en: "Coding / tech tools", hi: "कोडिंग / तकनीकी टूल" },
        scores: { tech: 2 },
      },
      {
        label: { en: "Finance / trading", hi: "वित्त / ट्रेडिंग" },
        scores: { finance: 2 },
      },
      {
        label: { en: "Design / editing", hi: "डिज़ाइन / एडिटिंग" },
        scores: { design: 2 },
      },
      {
        label: { en: "Managing teams / ideas", hi: "टीम या विचारों का प्रबंधन" },
        scores: { business: 2 },
      },
      {
        label: { en: "Academic subjects", hi: "शैक्षणिक विषय" },
        scores: { research: 2 },
      },
      {
        label: { en: "Nothing yet", hi: "अभी कुछ नहीं" },
        scores: { tech: 1, finance: 1, design: 1, business: 1, research: 1 },
      },
    ],
  },
  {
    id: 5,
    text: {
      en: "What matters most to you?",
      hi: "आपके लिए सबसे ज़्यादा मायने क्या रखता है?",
    },
    options: [
      { label: { en: "Innovation", hi: "नवाचार" }, scores: { tech: 2 } },
      {
        label: { en: "Money & stability", hi: "पैसा और स्थिरता" },
        scores: { finance: 2 },
      },
      { label: { en: "Creativity", hi: "रचनात्मकता" }, scores: { design: 2 } },
      { label: { en: "Leadership", hi: "नेतृत्व" }, scores: { business: 2 } },
      { label: { en: "Knowledge", hi: "ज्ञान" }, scores: { research: 2 } },
    ],
  },
];

const DOMAIN_TITLE = {
  tech: { en: "Technology (Software / IT)", hi: "तकनीक (सॉफ़्टवेयर / आईटी)" },
  finance: { en: "Finance", hi: "वित्त" },
  design: { en: "Design", hi: "डिज़ाइन" },
  business: { en: "Business", hi: "व्यापार" },
  research: { en: "Research", hi: "शोध" },
};

// total points available across the quiz (5 questions x 2 points)
const MAX_POINTS = QUESTIONS.length * 2;


/** Minimal page chrome for the pre-dashboard discovery screens. */
function QuizHeader({ onBack }) {
  const { tr } = useLang();

  return (
    <header className="px-5 sm:px-8 py-5 flex items-center justify-between max-w-4xl mx-auto">
      <Button variant="ghost" size="sm" icon="arrowLeft" onClick={onBack}>
        {tr("back")}
      </Button>
      <LanguageSwitch />
    </header>
  );
}

const RANK_TONE = ["sage", "brand", "lilac"];

export default function Counselling() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [ownRole, setOwnRole] = useState("");
  const [ownResult, setOwnResult] = useState(null);
  const navigate = useNavigate();
  const { lang, tr, trRole, trSkill } = useLang();

  const handleSelect = (option) => {
    setAnswers((prev) => {
      const updated = [...prev];
      updated[step] = option.scores;
      return updated;
    });
    setStep((prev) => prev + 1);
  };

  // domain scores -> ranked career recommendations with a match %
  const calculateMatches = () => {
    const domainScore = {
      tech: 0,
      finance: 0,
      design: 0,
      business: 0,
      research: 0,
    };

    answers.forEach((ans) => {
      Object.entries(ans || {}).forEach(([key, val]) => {
        if (key in domainScore) domainScore[key] += val;
      });
    });

    const topDomain = Object.keys(domainScore).reduce((a, b) =>
      domainScore[a] >= domainScore[b] ? a : b
    );

    const roleScore = {};

    Object.entries(domainScore).forEach(([domain, points]) => {
      if (!points) return;
      (CAREER_MATCH[domain] || []).forEach(({ role, weight }) => {
        roleScore[role] = (roleScore[role] || 0) + points * weight;
      });
    });

    const toMatch = (raw) =>
      Math.min(99, Math.max(35, Math.round(((raw || 0) / MAX_POINTS) * 100)));

    const ranked = Object.entries(roleScore)
      .map(([role, raw]) => ({ role, match: toMatch(raw) }))
      .sort((a, b) => b.match - a.match)
      .slice(0, 3);

    // same engine, but for a role the student names themselves
    const scoreFor = (role) => toMatch(roleScore[role]);

    return { ranked, topDomain, scoreFor };
  };

  // Beginner path: picking a recommended career goes straight into the
  // existing skill assessment, with that role pre-selected.
  const startAssessment = (role) => {
    navigate("/onboarding", { state: { role, from: "counselling" } });
  };

  // Still available: browse the domain screen instead of taking a suggestion.
  const browseDomains = () => {
    navigate("/landing", { state: { from: "counselling" } });
  };

  const isComplete = step >= QUESTIONS.length;
  const progress = Math.round((step / QUESTIONS.length) * 100);

  /* ── RESULTS ─────────────────────────────────────────── */
  if (isComplete) {
    const { ranked, topDomain, scoreFor } = calculateMatches();

    return (
      <div className="min-h-screen sm-glow">
        <QuizHeader onBack={() => navigate("/")} />
        <div className="max-w-4xl mx-auto px-5 sm:px-8 pb-16">
        <PageHeader
          eyebrow={tr("cd_eyebrow")}
          title={tr("cd_result_title")}
          subtitle={tr("cd_result_sub")}
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

        <Card className="mb-5 sm-rise">
          <div className="min-w-0">
            <div className="sm-eyebrow">{tr("cd_domain")}</div>
            <p className="text-[1.05rem] font-bold">
              {DOMAIN_TITLE[topDomain][lang]}
            </p>
          </div>
        </Card>

        <div className="space-y-4">
          {ranked.map((rec, i) => {
            const roleData = ROLES[rec.role];
            const tone = RANK_TONE[i] || "brand";

            return (
              <Card key={rec.role} className={i === 0 ? "border-sage/30" : ""}>
                <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                      <h3 className="text-[1.2rem] font-bold">
                        {trRole(rec.role)}
                      </h3>
                    </div>

                    <p className="text-[0.88rem] text-ink-soft leading-relaxed mb-3.5">
                      <span className="font-bold text-ink">{tr("cd_why")}: </span>
                      {CAREER_REASONS[rec.role]?.[lang]}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {roleData?.skills.slice(0, 5).map((s) => (
                        <span
                          key={s}
                          className="px-2.5 py-1 rounded-full bg-surface-muted border border-line-soft text-[0.71rem] font-semibold text-ink-soft"
                        >
                          {trSkill(s)}
                        </span>
                      ))}
                      {roleData && roleData.skills.length > 5 && (
                        <span className="px-2.5 py-1 text-[0.71rem] font-semibold text-ink-faint">
                          +{roleData.skills.length - 5}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="sm:w-56 shrink-0">
                    <div className="sm-inset p-4 text-center">
                      <div className="text-[2rem] font-extrabold leading-none mb-1">
                        {rec.match}%
                      </div>
                      <div className="sm-eyebrow mb-3">{tr("cd_match")}</div>
                      <ProgressBar value={rec.match} tone={tone} size="sm" />
                    </div>

                    <Button
                      full
                      size="sm"
                      variant={i === 0 ? "primary" : "secondary"}
                      iconRight="arrowRight"
                      className="mt-3"
                      onClick={() => startAssessment(rec.role)}
                    >
                      {tr("cd_start")}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* OWN CHOICE — student names a career, the engine scores it */}
        <Card className="mt-5">
          <div className="mb-4">
            <div className="min-w-0">
              <h3 className="text-[1rem] font-bold leading-snug">
                {tr("cd_own_title")}
              </h3>
              <p className="text-[0.84rem] text-ink-soft">{tr("cd_own_body")}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <Field
              as="select"
              className="flex-1"
              value={ownRole}
              onChange={(e) => {
                setOwnRole(e.target.value);
                setOwnResult(null);
              }}
            >
              <option value="">{tr("cd_own_select")}</option>
              {Object.keys(ROLES).map((r) => (
                <option key={r} value={r}>
                  {trRole(r)}
                </option>
              ))}
            </Field>

            <Button
              icon="chart"
              disabled={!ownRole}
              onClick={() => setOwnResult(scoreFor(ownRole))}
            >
              {tr("cd_own_cta")}
            </Button>
          </div>

          {ownResult !== null && (
            <div className="mt-4 sm-inset p-4 sm:p-5 sm-rise">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <div className="sm-eyebrow mb-1">{tr("cd_own_result")}</div>
                  <p className="text-[1.05rem] font-bold">{trRole(ownRole)}</p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[1.7rem] font-extrabold leading-none">
                    {ownResult}%
                  </div>
                  <div className="sm-eyebrow">{tr("cd_match")}</div>
                </div>
              </div>

              <ProgressBar
                value={ownResult}
                tone={ownResult >= 70 ? "sage" : ownResult >= 50 ? "amber" : "rose"}
                size="sm"
              />

              <p className="text-[0.85rem] text-ink-soft leading-relaxed mt-3">
                {ownResult >= 70
                  ? tr("cd_own_strong")
                  : ownResult >= 50
                  ? tr("cd_own_ok")
                  : tr("cd_own_weak")}
              </p>

              <Button
                size="sm"
                iconRight="arrowRight"
                className="mt-4"
                onClick={() => startAssessment(ownRole)}
              >
                {tr("cd_start")}
              </Button>
            </div>
          )}
        </Card>

        <div className="mt-5 flex justify-center">
          <Button variant="ghost" iconRight="chevronRight" onClick={browseDomains}>
            {tr("cd_explore")}
          </Button>
        </div>
        </div>
      </div>
    );
  }

  /* ── QUESTION FLOW ───────────────────────────────────── */
  const question = QUESTIONS[step];

  return (
    <div className="min-h-screen sm-glow">
      <QuizHeader onBack={() => navigate("/")} />
      <div className="max-w-3xl mx-auto px-5 sm:px-8 pb-16">
      <PageHeader
        eyebrow={tr("cd_eyebrow")}
        title={tr("cd_title")}
        subtitle={tr("cd_sub")}
      />

      {/* STEP DOTS */}
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
        <h2 className="text-[1.25rem] sm:text-[1.45rem] font-bold leading-snug mb-1.5">
          {question.text[lang]}
        </h2>
        <p className="text-[0.84rem] text-ink-faint mb-6">{tr("cd_pick_one")}</p>

        <div className="grid gap-2.5">
          {question.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSelect(opt)}
              className="group flex items-center gap-3.5 text-left px-4 py-3.5 rounded-[16px] border border-line bg-surface-muted transition-all duration-150 hover:border-brand/40 hover:bg-brand-soft/60 hover:translate-x-0.5"
            >
              <span className="grid place-items-center w-6 h-6 rounded-full border-2 border-line-soft bg-surface text-transparent shrink-0 transition-all group-hover:border-brand group-hover:text-brand">
                <Icon name="check" size={12} strokeWidth={3} />
              </span>

              <span className="text-[0.92rem] font-semibold flex-1">
                {opt.label[lang]}
              </span>

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
