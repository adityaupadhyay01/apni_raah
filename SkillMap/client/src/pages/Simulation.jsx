import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Card, { CardHeader } from "../components/common/Card";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import Icon from "../components/common/Icon";
import Field from "../components/common/Field";
import PageHeader from "../components/common/PageHeader";

import { useLang } from "../context/LanguageContext";

const PYQ_DATA = {
  frontend: {
    google: [
      "Implement a debounce function from scratch.",
      "How does the virtual DOM differ from the real DOM? Explain reconciliation.",
      "Design a responsive navbar component with accessibility in mind.",
    ],
    amazon: [
      "Build a lazy-loading image component in React.",
      "Explain the event loop and how async/await works under the hood.",
      "How would you optimize a page with 10,000 list items?",
    ],
  },
  backend: {
    google: [
      "Design a URL shortener service — system design walkthrough.",
      "Explain CAP theorem with a real-world example.",
      "How do you handle database transactions with rollback logic?",
    ],
    amazon: [
      "How would you scale a REST API to handle 1M requests/sec?",
      "Explain the difference between SQL and NoSQL — when to use each.",
      "Design a distributed rate-limiter system.",
    ],
  },
  devops: {
    google: [
      "Walk us through a CI/CD pipeline you've built.",
      "How do you manage secrets and config in Kubernetes?",
      "Explain the difference between blue-green and canary deployments.",
    ],
    amazon: [
      "How do you monitor and alert on microservices in production?",
      "Describe your experience with Infrastructure as Code (Terraform, etc).",
      "How would you debug a production outage caused by a bad deploy?",
    ],
  },
};

const MENTORS = [
  {
    name: "Priya Sharma",
    role: "Senior SDE @ Google",
    exp: "6 yrs exp · 120+ mock sessions",
    emoji: "👩‍💻",
    rating: "⭐ 4.9",
  },
  {
    name: "Arjun Mehta",
    role: "Staff Engineer @ Amazon",
    exp: "9 yrs exp · 200+ mock sessions",
    emoji: "👨‍💻",
    rating: "⭐ 4.8",
  },
  {
    name: "Sneha Iyer",
    role: "ML Engineer @ Microsoft",
    exp: "5 yrs exp · 80+ mock sessions",
    emoji: "👩‍🔬",
    rating: "⭐ 4.7",
  },
];

const JOB_LINKS = [
  {
    label: "Frontend Jobs",
    icon: "🖥️",
    color: "#b8860b",
    badgeBg: "rgba(184,134,11,0.1)",
    meta: "React · Vue · Angular · CSS",
    url: "https://unstop.com/jobs?domain=frontend",
  },
  {
    label: "Backend Jobs",
    icon: "⚙️",
    color: "#b8860b",
    badgeBg: "rgba(184,134,11,0.1)",
    meta: "Node · Django · Spring · Go",
    url: "https://unstop.com/jobs?domain=backend",
  },
  {
    label: "Data Science Jobs",
    icon: "📊",
    color: "#b8860b",
    badgeBg: "rgba(184,134,11,0.1)",
    meta: "Python · ML · AI · Analytics",
    url: "https://unstop.com/jobs?domain=data-science",
  },
];


const TABS = [
  {
    id: "mock",
    key: "sim_mock",
    descKey: "sim_mock_desc",
    icon: "mic",
    tone: "brand",
  },
  {
    id: "pyq",
    key: "sim_pyq",
    descKey: "sim_pyq_desc",
    icon: "file",
    tone: "lilac",
  },
  {
    id: "jobs",
    key: "sim_jobs",
    descKey: "sim_jobs_desc",
    icon: "briefcase",
    tone: "sage",
  },
];

const TONE_CHIP = {
  brand: "bg-brand-soft text-brand",
  sage: "bg-sage-soft text-sage",
  peach: "bg-peach-soft text-peach",
  lilac: "bg-lilac-soft text-lilac",
  amber: "bg-amber-soft text-amber",
};

export default function Simulation() {
  const navigate = useNavigate();
  const { tr } = useLang();

  const [activeTab, setActiveTab] = useState(null);
  const [pyqRole, setPyqRole] = useState("frontend");
  const [pyqCompany, setPyqCompany] = useState("google");

  const questions = PYQ_DATA[pyqRole]?.[pyqCompany] || [];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={tr("sim_eyebrow")}
        title={tr("sim_title")}
        subtitle={tr("sim_sub")}
        actions={
          activeTab ? (
            <Button variant="secondary" icon="arrowLeft" onClick={() => setActiveTab(null)}>
              {tr("sim_all_modes")}
            </Button>
          ) : (
            <Button variant="secondary" icon="route" onClick={() => navigate("/roadmap")}>
              {tr("rm_back_roadmap")}
            </Button>
          )
        }
      />

      {/* MODE PICKER */}
      {!activeTab && (
        <div className="grid sm:grid-cols-3 gap-5">
          {TABS.map((t) => (
            <Card key={t.id} hover as="button" className="text-left" onClick={() => setActiveTab(t.id)}>
              <span
                className={`grid place-items-center w-12 h-12 rounded-[18px] mb-4 ${TONE_CHIP[t.tone]}`}
              >
                <Icon name={t.icon} size={23} />
              </span>

              <h3 className="text-[1.08rem] font-bold mb-1.5">{tr(t.key)}</h3>
              <p className="text-[0.85rem] text-ink-soft leading-relaxed mb-4">
                {tr(t.descKey)}
              </p>

              <span className="inline-flex items-center gap-2 text-[0.83rem] font-bold text-brand">
                {tr("sim_open")}
                <Icon name="arrowRight" size={15} />
              </span>
            </Card>
          ))}
        </div>
      )}

      {/* MOCK INTERVIEW */}
      {activeTab === "mock" && (
        <div className="space-y-5 sm-rise">
          <Card>
            <CardHeader
              icon="mic"
              tone="brand"
              title={tr("sim_mock")}
              subtitle={tr("sim_mock_sub")}
            />
          </Card>

          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {MENTORS.map((m) => (
              <Card key={m.name} hover className="flex flex-col">
                <div className="flex items-center gap-3.5 mb-4">
                  <span className="grid place-items-center w-12 h-12 rounded-[18px] bg-brand-soft text-[1.4rem]">
                    {m.emoji}
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-[1rem] font-bold leading-tight">{m.name}</h4>
                    <p className="text-[0.8rem] text-ink-soft truncate">{m.role}</p>
                  </div>
                </div>

                <p className="text-[0.8rem] text-ink-faint mb-4 flex-1">{m.exp}</p>

                <div className="flex items-center justify-between gap-3">
                  <Badge tone="amber" icon="star">
                    {m.rating.replace("⭐ ", "")}
                  </Badge>
                  <Button size="sm" icon="mic">
                    {tr("sim_book")}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* PYQs */}
      {activeTab === "pyq" && (
        <Card className="sm-rise">
          <CardHeader
            icon="file"
            tone="lilac"
            title={tr("sim_pyq")}
            subtitle={tr("sim_pyq_sub")}
            action={<Badge tone="lilac">{questions.length} {tr("sim_questions")}</Badge>}
          />

          <div className="grid sm:grid-cols-2 gap-4 mt-5">
            <Field
              as="select"
              label={tr("sim_role")}
              value={pyqRole}
              onChange={(e) => setPyqRole(e.target.value)}
            >
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="devops">DevOps</option>
            </Field>

            <Field
              as="select"
              label={tr("sim_company")}
              value={pyqCompany}
              onChange={(e) => setPyqCompany(e.target.value)}
            >
              <option value="google">Google</option>
              <option value="amazon">Amazon</option>
            </Field>
          </div>

          <ol className="mt-6 space-y-2.5">
            {questions.map((q, i) => (
              <li
                key={i}
                className="flex items-start gap-3.5 p-4 rounded-[16px] bg-surface-muted border border-line-soft"
              >
                <span className="grid place-items-center w-7 h-7 rounded-lg bg-surface border border-line text-[0.75rem] font-bold text-ink-soft shrink-0">
                  {i + 1}
                </span>
                <p className="text-[0.88rem] leading-relaxed">{q}</p>
              </li>
            ))}

            {questions.length === 0 && (
              <p className="text-[0.85rem] text-ink-faint py-4">{tr("sim_no_questions")}</p>
            )}
          </ol>
        </Card>
      )}

      {/* JOB INSIGHTS */}
      {activeTab === "jobs" && (
        <div className="space-y-5 sm-rise">
          <Card>
            <CardHeader
              icon="briefcase"
              tone="sage"
              title={tr("sim_jobs")}
              subtitle={tr("sim_jobs_sub")}
            />
          </Card>

          <div className="grid sm:grid-cols-3 gap-5">
            {JOB_LINKS.map((job) => (
              <a
                key={job.label}
                href={job.url}
                target="_blank"
                rel="noreferrer"
                className="sm-card p-5 block transition-all duration-200 hover:-translate-y-1"
              >
                <span className="grid place-items-center w-12 h-12 rounded-[18px] bg-sage-soft text-[1.4rem] mb-4">
                  {job.icon}
                </span>
                <h4 className="text-[1rem] font-bold mb-1">{job.label}</h4>
                <p className="text-[0.8rem] text-ink-soft mb-4">{job.meta}</p>
                <span className="inline-flex items-center gap-2 text-[0.82rem] font-bold text-brand">
                  {tr("sim_view_unstop")}
                  <Icon name="arrowRight" size={15} />
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
