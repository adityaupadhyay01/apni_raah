import { useNavigate } from "react-router-dom";

import Card, { CardHeader } from "../components/common/Card";
import Button from "../components/common/Button";
import Badge, { priorityTone } from "../components/common/Badge";
import Icon from "../components/common/Icon";
import StatCard from "../components/common/StatCard";
import PageHeader from "../components/common/PageHeader";
import { LevelMeter } from "../components/common/Progress";

import ReadinessHero, { FactorList } from "../components/reality/ReadinessHero";

import { useLang } from "../context/LanguageContext";
import { useProfile } from "../context/ProfileContext";
import { levelIndex } from "../utils/roadmap";

export default function Reality() {
  const navigate = useNavigate();
  const { tr, trRole, trSkill, trLevel, trPriority } = useLang();
  const { profile, skills, summary, readiness, criticalGaps, topGap, totalWeeks } =
    useProfile();

  const status = readiness < 40 ? "not-ready" : readiness < 70 ? "almost" : "ready";
  const gaps = summary.improve.length + summary.missing.length;

  const highGaps = [...summary.improve, ...summary.missing].filter(
    (s) => s.priority === "HIGH"
  );
  const medGaps = [...summary.improve, ...summary.missing].filter(
    (s) => s.priority === "MEDIUM"
  );

  const strengths = [...summary.matched]
    .sort((a, b) => levelIndex(b.have) - levelIndex(a.have))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={tr("rc_kicker")}
        title={tr("rc_page_title")}
        subtitle={tr("rc_page_sub")}
        actions={
          <Button variant="secondary" icon="arrowLeft" onClick={() => navigate("/analysis")}>
            {tr("back")}
          </Button>
        }
      />

      <ReadinessHero
        score={readiness}
        status={status}
        role={trRole(profile.role)}
        matched={summary.matched.length}
        total={skills.length}
        gaps={gaps}
        onPrimary={() => navigate("/roadmap")}
        onSecondary={() => navigate("/analysis")}
      />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon="alert" tone="rose" label={tr("rc_high_gaps")} value={highGaps.length} />
        <StatCard icon="trending" tone="amber" label={tr("rc_med_gaps")} value={medGaps.length} />
        <StatCard icon="checkCircle" tone="sage" label={tr("rc_you_have")} value={summary.matched.length} />
        <StatCard icon="clock" tone="lilac" label={tr("rc_time_to_ready")} value={totalWeeks} suffix={tr("rm_weeks")} />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* STRENGTHS */}
        <Card>
          <CardHeader
            icon="award"
            tone="sage"
            title={tr("rc_strengths")}
            subtitle={tr("rc_strengths_sub")}
          />
          <div className="mt-5">
            <FactorList items={strengths} tone="sage" icon="check" emptyLabel={tr("rc_no_strengths")} />
          </div>
        </Card>

        {/* IMPROVEMENT AREAS */}
        <Card>
          <CardHeader
            icon="target"
            tone="rose"
            title={tr("rc_improve_areas")}
            subtitle={tr("rc_improve_sub")}
          />

          <div className="mt-5 space-y-2.5">
            {criticalGaps.slice(0, 5).map((s) => (
              <div
                key={s.name}
                className="flex items-center gap-3 p-3 rounded-[16px] bg-surface-muted border border-line-soft"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[0.86rem] font-bold truncate">{trSkill(s.name)}</span>
                    <Badge tone={priorityTone(s.priority)} size="sm">
                      {trPriority(s.priority)}
                    </Badge>
                  </div>
                  <p className="text-[0.72rem] text-ink-faint">
                    {s.have ? trLevel(s.have) : tr("level_none")} → {trLevel(s.need)}
                  </p>
                </div>

                <LevelMeter
                  have={s.have ? levelIndex(s.have) + 1 : 0}
                  need={levelIndex(s.need) + 1}
                  tone={priorityTone(s.priority)}
                />
              </div>
            ))}

            {criticalGaps.length === 0 && (
              <p className="text-[0.84rem] text-ink-faint py-3">{tr("rc_no_critical")}</p>
            )}
          </div>
        </Card>
      </div>

      {/* NEXT ACTION */}
      <Card className="relative overflow-hidden">
        <span className="absolute inset-y-0 left-0 w-1 bg-brand" />
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <span className="grid place-items-center w-12 h-12 rounded-[16px] bg-brand-soft text-brand shrink-0">
            <Icon name="sparkle" size={23} />
          </span>

          <div className="flex-1 min-w-0">
            <div className="sm-eyebrow mb-1">{tr("rc_next_action")}</div>
            <p className="text-[1.05rem] font-bold leading-snug">
              {topGap
                ? tr("rc_next_line", {
                    skill: trSkill(topGap.name),
                    need: trLevel(topGap.need),
                  })
                : tr("rc_next_done")}
            </p>
            <p className="text-[0.84rem] text-ink-soft mt-1">
              {tr("rm_plan_summary_short", { weeks: totalWeeks })}
            </p>
          </div>

          <Button size="lg" iconRight="arrowRight" onClick={() => navigate("/roadmap")}>
            {tr("rc_open_roadmap")}
          </Button>
        </div>
      </Card>
    </div>
  );
}
