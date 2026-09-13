import { useNavigate } from "react-router-dom";

import Card, { CardHeader } from "../components/common/Card";
import Button from "../components/common/Button";
import Badge, { priorityTone, statusTone } from "../components/common/Badge";
import Icon from "../components/common/Icon";
import StatCard from "../components/common/StatCard";
import { ProgressBar, ProgressRing, LevelMeter } from "../components/common/Progress";

import { useLang } from "../context/LanguageContext";
import {
  useProfile,
  WEEKLY_MINUTES,
  ACTIVITY_FEED,
} from "../context/ProfileContext";
import { levelIndex } from "../utils/roadmap";

const DAYS = ["day_mon", "day_tue", "day_wed", "day_thu", "day_fri", "day_sat", "day_sun"];

const QUICK_ACTIONS = [
  { key: "qa_assess", icon: "layers", tone: "brand", to: "/onboarding" },
  { key: "qa_analysis", icon: "chart", tone: "lilac", to: "/analysis" },
  { key: "qa_labs", icon: "code", tone: "sage", to: "/learning" },
  { key: "qa_resume", icon: "file", tone: "peach", to: "/resume" },
];

const TONE_CHIP = {
  brand: "bg-brand-soft text-brand",
  sage: "bg-sage-soft text-sage",
  peach: "bg-peach-soft text-peach",
  lilac: "bg-lilac-soft text-lilac",
  sky: "bg-sky-soft text-sky",
  rose: "bg-rose-soft text-rose",
  amber: "bg-amber-soft text-amber",
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { tr, trSkill, trLevel, trPriority } = useLang();
  const {
    profile,
    hasProfile,
    readiness,
    summary,
    skills,
    steps,
    topGap,
    criticalGaps,
    roadmapProgress,
    doneCount,
    totalWeeks,
  } = useProfile();

  const hour = new Date().getHours();
  const greetKey =
    hour < 12 ? "dash_greet_morning" : hour < 17 ? "dash_greet_afternoon" : "dash_greet_evening";

  const peakMinutes = Math.max(...WEEKLY_MINUTES);
  const upcoming = steps
    .filter((s) => !(profile.completedSteps || []).includes(s.skill))
    .slice(0, 3);

  const gapBreakdown = [
    { key: "stat_matched", count: summary.matched.length, tone: "sage" },
    { key: "stat_improve", count: summary.improve.length, tone: "amber" },
    { key: "stat_missing", count: summary.missing.length, tone: "rose" },
  ];

  return (
    <div className="space-y-6">
      {/* ── HERO ───────────────────────────────────────────── */}
      <Card padded={false} className="overflow-hidden sm-rise">
        <div className="sm-glow">
          <div className="flex flex-col lg:flex-row lg:items-center gap-7 p-6 sm:p-8">
            <div className="flex-1 min-w-0">
              {!hasProfile && (
                <Badge tone="amber" icon="sparkle" className="mb-3">
                  {tr("dash_sample_badge")}
                </Badge>
              )}

              <h1 className="text-[1.7rem] sm:text-[2.15rem] font-extrabold leading-[1.12] mb-2">
                {tr(greetKey, { name: profile.name })}
              </h1>

              <p className="text-ink-soft text-[0.95rem] max-w-xl leading-relaxed mb-5">
                {hasProfile ? tr("dash_hero_sub") : tr("dash_sample_note")}
              </p>

              <div className="flex flex-wrap gap-2.5">
                <Button
                  size="lg"
                  icon="play"
                  onClick={() => navigate(hasProfile ? "/roadmap" : "/onboarding")}
                >
                  {hasProfile ? tr("dash_resume_cta") : tr("dash_sample_cta")}
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  iconRight="arrowRight"
                  onClick={() => navigate("/reality")}
                >
                  {tr("dash_view_readiness")}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-center lg:justify-end shrink-0">
              <div className="relative">
                <ProgressRing
                  value={readiness}
                  size={186}
                  thickness={14}
                  tone="brand"
                  caption={tr("rc_readiness")}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* ── KPI ROW ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon="target"
          tone="brand"
          label={tr("kpi_readiness")}
          value={readiness}
          suffix="%"
          progress={readiness}
        />
        <StatCard
          icon="checkCircle"
          tone="sage"
          label={tr("kpi_matched")}
          value={summary.matched.length}
          suffix={`/ ${skills.length}`}
          progress={(summary.matched.length / Math.max(1, skills.length)) * 100}
        />
        <StatCard
          icon="alert"
          tone="rose"
          label={tr("kpi_gaps")}
          value={criticalGaps.length}
          hint={tr("kpi_gaps_hint")}
        />
        <StatCard
          icon="route"
          tone="lilac"
          label={tr("kpi_roadmap")}
          value={roadmapProgress}
          suffix="%"
          hint={tr("kpi_roadmap_hint", { done: doneCount, total: steps.length })}
          progress={roadmapProgress}
        />
      </div>

      {/* ── MAIN GRID ──────────────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* LEFT (2 cols) */}
        <div className="lg:col-span-2 space-y-5">
          {/* Next best action */}
          <Card className="relative overflow-hidden">
            <span className="absolute inset-y-0 left-0 w-1 bg-peach" />
            <CardHeader
              icon="sparkle"
              tone="peach"
              title={tr("dash_next_action")}
              subtitle={tr("dash_next_action_sub")}
            />

            {topGap ? (
              <div className="mt-5 sm-inset p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h4 className="text-[1.15rem] font-bold">
                        {trSkill(topGap.name)}
                      </h4>
                      <Badge tone={priorityTone(topGap.priority)} size="sm">
                        {trPriority(topGap.priority)}
                      </Badge>
                      <Badge tone={statusTone(topGap.status)} size="sm">
                        {tr(`status_${topGap.status}`)}
                      </Badge>
                    </div>
                    <p className="text-[0.84rem] text-ink-soft leading-snug max-w-lg">
                      {tr("dash_gap_line", {
                        have: topGap.have ? trLevel(topGap.have) : tr("level_none"),
                        need: trLevel(topGap.need),
                      })}
                    </p>
                  </div>

                  <LevelMeter
                    have={topGap.have ? levelIndex(topGap.have) + 1 : 0}
                    need={levelIndex(topGap.need) + 1}
                    tone={priorityTone(topGap.priority)}
                    className="mt-1"
                  />
                </div>

                <div className="flex flex-wrap gap-2.5">
                  <Button size="sm" icon="play" onClick={() => navigate("/learning")}>
                    {tr("dash_start_learning")}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    iconRight="chevronRight"
                    onClick={() => navigate("/roadmap")}
                  >
                    {tr("dash_see_plan")}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-5 sm-inset p-6 text-center">
                <p className="font-bold mb-1">{tr("dash_no_gaps")}</p>
                <p className="text-sm text-ink-soft">{tr("dash_no_gaps_sub")}</p>
              </div>
            )}
          </Card>

          {/* Roadmap preview */}
          <Card>
            <CardHeader
              icon="route"
              tone="lilac"
              title={tr("dash_roadmap_preview")}
              subtitle={tr("dash_roadmap_sub", { weeks: totalWeeks })}
              action={
                <Button size="sm" variant="ghost" iconRight="arrowRight" onClick={() => navigate("/roadmap")}>
                  {tr("dash_view_all")}
                </Button>
              }
            />

            <ProgressBar
              value={roadmapProgress}
              tone="lilac"
              className="mt-5"
              label={tr("kpi_roadmap")}
              trailing={`${roadmapProgress}%`}
            />

            <ol className="mt-5 space-y-2.5">
              {upcoming.map((step, i) => (
                <li
                  key={step.skill}
                  className="flex items-center gap-3.5 p-3 rounded-[16px] border border-line-soft bg-surface-muted
                    hover:border-line transition-colors"
                >
                  <span className="grid place-items-center w-8 h-8 rounded-xl bg-surface border border-line text-[0.78rem] font-bold text-ink-soft shrink-0">
                    {step.startWeek || i + 1}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="text-[0.88rem] font-bold truncate">
                      {step.type === "project"
                        ? tr(step.skill === "PORTFOLIO_PROJECT" ? "rm_project" : "rm_apply")
                        : tr(step.status === "improve" ? "rm_improve" : "rm_learn", {
                            skill: trSkill(step.skill),
                          })}
                    </p>
                    <p className="text-[0.74rem] text-ink-faint">
                      {tr("rm_week")} {step.startWeek}–{step.endWeek} ·{" "}
                      {step.weeks} {step.weeks === 1 ? tr("rm_week") : tr("rm_weeks")}
                    </p>
                  </div>

                  {step.priority && (
                    <Badge tone={priorityTone(step.priority)} size="sm">
                      {trPriority(step.priority)}
                    </Badge>
                  )}
                </li>
              ))}
            </ol>
          </Card>

          {/* Weekly activity */}
          <Card>
            <CardHeader
              icon="trending"
              tone="sage"
              title={tr("dash_week_activity")}
              subtitle={tr("dash_week_sub")}
              action={
                <Button size="sm" variant="ghost" iconRight="arrowRight" onClick={() => navigate("/progress")}>
                  {tr("dash_view_all")}
                </Button>
              }
            />

            <div className="mt-6 flex items-end gap-2 sm:gap-3 h-36">
              {WEEKLY_MINUTES.map((m, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[0.68rem] font-bold text-ink-faint opacity-0 group-hover:opacity-100 transition-opacity">
                    {m}m
                  </span>
                  <div
                    className={`w-full rounded-t-[10px] rounded-b-sm transition-all duration-500 ${
                      m === peakMinutes ? "bg-sage" : "bg-sage/35 group-hover:bg-sage/55"
                    }`}
                    style={{ height: `${Math.max(8, (m / peakMinutes) * 100)}%` }}
                  />
                  <span className="text-[0.7rem] font-bold text-ink-faint">{tr(DAYS[i])}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-5">
          {/* Gap summary */}
          <Card>
            <CardHeader icon="chart" tone="brand" title={tr("dash_gap_summary")} />

            <div className="mt-5 space-y-3.5">
              {gapBreakdown.map((row) => (
                <div key={row.key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="flex items-center gap-2 text-[0.83rem] font-semibold text-ink-soft">
                      <span className={`w-2.5 h-2.5 rounded-full ${TONE_CHIP[row.tone].split(" ")[0]}`} />
                      {tr(row.key)}
                    </span>
                    <span className="text-[0.83rem] font-bold">{row.count}</span>
                  </div>
                  <ProgressBar
                    value={(row.count / Math.max(1, skills.length)) * 100}
                    tone={row.tone}
                    size="sm"
                  />
                </div>
              ))}
            </div>

            <Button
              variant="soft"
              size="sm"
              full
              iconRight="arrowRight"
              className="mt-5"
              onClick={() => navigate("/analysis")}
            >
              {tr("dash_open_analysis")}
            </Button>
          </Card>

          {/* Quick actions */}
          <Card>
            <CardHeader icon="zap" tone="amber" title={tr("dash_quick_actions")} />

            <div className="mt-4 grid grid-cols-2 gap-2.5">
              {QUICK_ACTIONS.map((qa) => (
                <button
                  key={qa.key}
                  onClick={() => navigate(qa.to)}
                  className="flex flex-col items-start gap-2.5 p-3.5 rounded-[16px] border border-line-soft
                    bg-surface-muted text-left transition-all duration-150
                    hover:border-line hover:-translate-y-0.5 hover:bg-surface"
                >
                  <span className={`grid place-items-center w-9 h-9 rounded-xl ${TONE_CHIP[qa.tone]}`}>
                    <Icon name={qa.icon} size={17} />
                  </span>
                  <span className="text-[0.8rem] font-bold leading-tight">{tr(qa.key)}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Recent activity */}
          <Card>
            <CardHeader icon="clock" tone="sky" title={tr("dash_recent")} />

            <ul className="mt-4 space-y-1">
              {ACTIVITY_FEED.map((item, i) => (
                <li key={i} className="flex items-start gap-3 py-2.5">
                  <span className={`grid place-items-center w-8 h-8 rounded-xl shrink-0 ${TONE_CHIP[item.tone]}`}>
                    <Icon name={item.icon} size={15} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.83rem] font-semibold leading-snug">{tr(item.key)}</p>
                    <p className="text-[0.72rem] text-ink-faint truncate">
                      {item.meta} · {tr(item.when)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
