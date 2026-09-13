import { useNavigate } from "react-router-dom";

import Card, { CardHeader } from "../components/common/Card";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import Icon from "../components/common/Icon";
import StatCard from "../components/common/StatCard";
import PageHeader from "../components/common/PageHeader";
import { ProgressBar, LevelMeter } from "../components/common/Progress";

import { useLang } from "../context/LanguageContext";
import { useProfile, WEEKLY_MINUTES, LAB_PROGRESS } from "../context/ProfileContext";
import { LABS } from "../components/warzone/WarZone";
import { levelIndex } from "../utils/roadmap";

const DAYS = ["day_mon", "day_tue", "day_wed", "day_thu", "day_fri", "day_sat", "day_sun"];

// mock readiness history — six checkpoints leading to today
const READINESS_TREND = [18, 27, 34, 45, 52, 58];

const ACHIEVEMENTS = [
  { key: "ach_first_assessment", icon: "layers", tone: "brand", earned: true },
  { key: "ach_first_lab", icon: "code", tone: "sage", earned: true },
  { key: "ach_week_streak", icon: "flame", tone: "peach", earned: true },
  { key: "ach_half_roadmap", icon: "route", tone: "lilac", earned: false },
  { key: "ach_job_ready", icon: "award", tone: "amber", earned: false },
];

const TONE_CHIP = {
  brand: "bg-brand-soft text-brand",
  sage: "bg-sage-soft text-sage",
  peach: "bg-peach-soft text-peach",
  lilac: "bg-lilac-soft text-lilac",
  sky: "bg-sky-soft text-sky",
  amber: "bg-amber-soft text-amber",
};

export default function Progress() {
  const navigate = useNavigate();
  const { tr, trSkill, trLevel } = useLang();
  const { skills, summary, readiness, roadmapProgress, doneCount, steps } = useProfile();

  const totalMinutes = WEEKLY_MINUTES.reduce((a, b) => a + b, 0);
  const peak = Math.max(...WEEKLY_MINUTES);
  const trend = [...READINESS_TREND, readiness];
  const gained = readiness - READINESS_TREND[0];
  const labAvg = Math.round(
    LABS.reduce((s, l) => s + (LAB_PROGRESS[l.id] || 0), 0) / LABS.length
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={tr("pr_eyebrow")}
        title={tr("pr_title")}
        subtitle={tr("pr_sub")}
        actions={
          <Button variant="secondary" icon="route" onClick={() => navigate("/roadmap")}>
            {tr("pr_open_roadmap")}
          </Button>
        }
      />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon="target"
          tone="brand"
          label={tr("kpi_readiness")}
          value={readiness}
          suffix="%"
          hint={tr("pr_gained", { n: gained })}
          progress={readiness}
        />
        <StatCard
          icon="checkCircle"
          tone="sage"
          label={tr("pr_skills_mastered")}
          value={summary.matched.length}
          suffix={`/ ${skills.length}`}
          progress={(summary.matched.length / Math.max(1, skills.length)) * 100}
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
        <StatCard
          icon="flame"
          tone="peach"
          label={tr("pr_streak")}
          value={7}
          suffix={tr("pr_days")}
          hint={tr("pr_minutes_week", { n: totalMinutes })}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* READINESS TREND */}
        <Card className="lg:col-span-2">
          <CardHeader
            icon="trending"
            tone="brand"
            title={tr("pr_trend")}
            subtitle={tr("pr_trend_sub")}
            action={<Badge tone="sage" icon="trending">+{gained}%</Badge>}
          />

          <div className="mt-6 flex items-end gap-2 sm:gap-3 h-44">
            {trend.map((v, i) => {
              const last = i === trend.length - 1;
              return (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-2 h-full justify-end"
                >
                  <span
                    className={`text-[0.7rem] font-bold ${
                      last ? "text-brand" : "text-ink-faint"
                    }`}
                  >
                    {v}%
                  </span>
                  <div
                    className={`w-full rounded-t-[10px] rounded-b-sm transition-all duration-700 ${
                      last ? "bg-brand" : "bg-brand/25"
                    }`}
                    style={{ height: `${Math.max(6, v)}%` }}
                  />
                  <span className="text-[0.68rem] font-bold text-ink-faint">
                    {last ? tr("pr_now") : `W${i + 1}`}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* WEEKLY STUDY */}
        <Card>
          <CardHeader
            icon="clock"
            tone="sage"
            title={tr("dash_week_activity")}
            subtitle={tr("pr_minutes_week", { n: totalMinutes })}
          />

          <div className="mt-6 space-y-2.5">
            {WEEKLY_MINUTES.map((m, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-9 text-[0.72rem] font-bold text-ink-faint shrink-0">
                  {tr(DAYS[i])}
                </span>
                <ProgressBar
                  value={(m / peak) * 100}
                  tone={m === peak ? "sage" : "brand"}
                  size="sm"
                  className="flex-1"
                />
                <span className="w-11 text-right text-[0.72rem] font-bold text-ink-soft shrink-0">
                  {m}m
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* SKILL MASTERY */}
        <Card>
          <CardHeader
            icon="layers"
            tone="lilac"
            title={tr("pr_mastery")}
            subtitle={tr("pr_mastery_sub")}
            action={
              <Button
                size="sm"
                variant="ghost"
                iconRight="arrowRight"
                onClick={() => navigate("/analysis")}
              >
                {tr("dash_view_all")}
              </Button>
            }
          />

          <div className="mt-5 space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {skills.map((s) => (
              <div
                key={s.name}
                className="flex items-center gap-3 p-3 rounded-[14px] bg-surface-muted border border-line-soft"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[0.85rem] font-bold truncate">{trSkill(s.name)}</p>
                  <p className="text-[0.72rem] text-ink-faint">
                    {s.have ? trLevel(s.have) : tr("level_none")} → {trLevel(s.need)}
                  </p>
                </div>
                <LevelMeter
                  have={s.have ? levelIndex(s.have) + 1 : 0}
                  need={levelIndex(s.need) + 1}
                  tone={
                    s.status === "matched"
                      ? "sage"
                      : s.status === "improve"
                      ? "amber"
                      : "rose"
                  }
                />
              </div>
            ))}
          </div>
        </Card>

        {/* LABS + ACHIEVEMENTS */}
        <div className="space-y-5">
          <Card>
            <CardHeader
              icon="code"
              tone="sage"
              title={tr("pr_labs")}
              subtitle={tr("pr_labs_sub", { n: labAvg })}
              action={
                <Button
                  size="sm"
                  variant="ghost"
                  iconRight="arrowRight"
                  onClick={() => navigate("/learning")}
                >
                  {tr("lab_continue")}
                </Button>
              }
            />

            <div className="mt-5 space-y-3.5">
              {LABS.map((l) => (
                <ProgressBar
                  key={l.id}
                  value={LAB_PROGRESS[l.id] || 0}
                  tone={l.tone}
                  size="sm"
                  label={l.name}
                  trailing={`${LAB_PROGRESS[l.id] || 0}%`}
                />
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader icon="award" tone="amber" title={tr("pr_achievements")} />

            <div className="mt-5 grid grid-cols-2 gap-2.5">
              {ACHIEVEMENTS.map((a) => (
                <div
                  key={a.key}
                  className={`flex items-center gap-2.5 p-3 rounded-[14px] border transition-opacity ${
                    a.earned
                      ? "border-line-soft bg-surface-muted"
                      : "border-dashed border-line bg-transparent opacity-55"
                  }`}
                >
                  <span
                    className={`grid place-items-center w-8 h-8 rounded-lg shrink-0 ${
                      a.earned ? TONE_CHIP[a.tone] : "bg-canvas-deep text-ink-faint"
                    }`}
                  >
                    <Icon name={a.earned ? a.icon : "lock"} size={15} />
                  </span>
                  <span className="text-[0.76rem] font-bold leading-tight">
                    {tr(a.key)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
