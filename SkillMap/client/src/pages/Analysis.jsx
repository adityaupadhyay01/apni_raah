import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Card, { CardHeader } from "../components/common/Card";
import Button from "../components/common/Button";
import Badge, { priorityTone } from "../components/common/Badge";
import Icon from "../components/common/Icon";
import PageHeader from "../components/common/PageHeader";
import { ProgressBar } from "../components/common/Progress";

import StatsRow from "../components/analysis/StatsRow";
import GapAnalysis from "../components/analysis/GapAnalysis";

import { useLang } from "../context/LanguageContext";
import { useProfile } from "../context/ProfileContext";

export default function Analysis() {
  const navigate = useNavigate();
  const { tr, trRole, trSkill, trPriority } = useLang();
  const { profile, skills, summary, readiness, criticalGaps } = useProfile();

  const [tab, setTab] = useState("all");

  const filtered =
    tab === "all"
      ? skills
      : tab === "blocked"
      ? skills.filter((s) => s.blocked)
      : skills.filter((s) => s.status === tab);

  const total = Math.max(1, skills.length);
  const share = (n) => (n / total) * 100;

  const byPriority = ["HIGH", "MEDIUM", "LOW"].map((p) => ({
    priority: p,
    gaps: [...summary.improve, ...summary.missing].filter((s) => s.priority === p),
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`${tr("an_eyebrow")} · ${trRole(profile.role)}`}
        title={tr("an_title")}
        subtitle={tr("an_legend")}
        actions={
          <>
            <Button variant="secondary" icon="arrowLeft" onClick={() => navigate("/onboarding")}>
              {tr("an_reassess")}
            </Button>
            <Button iconRight="arrowRight" onClick={() => navigate("/reality")}>
              {tr("an_cta")}
            </Button>
          </>
        }
      />

      <StatsRow
        matched={summary.matched}
        improve={summary.improve}
        missing={summary.missing}
        blocked={summary.blocked}
        total={skills.length}
      />

      {/* OVERVIEW STRIP */}
      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2">
          <CardHeader
            icon="chart"
            tone="brand"
            title={tr("an_distribution")}
            subtitle={tr("an_distribution_sub")}
            action={<Badge tone="brand">{readiness}% {tr("rc_readiness")}</Badge>}
          />

          {/* stacked share bar */}
          <div className="mt-5 flex h-4 rounded-full overflow-hidden bg-canvas-deep">
            <div className="bg-sage transition-all duration-700" style={{ width: `${share(summary.matched.length)}%` }} />
            <div className="bg-amber transition-all duration-700" style={{ width: `${share(summary.improve.length)}%` }} />
            <div className="bg-rose transition-all duration-700" style={{ width: `${share(summary.missing.length)}%` }} />
          </div>

          <div className="mt-4 flex flex-wrap gap-4">
            {[
              { tone: "bg-sage", label: tr("stat_matched"), n: summary.matched.length },
              { tone: "bg-amber", label: tr("stat_improve"), n: summary.improve.length },
              { tone: "bg-rose", label: tr("stat_missing"), n: summary.missing.length },
            ].map((l) => (
              <span key={l.label} className="inline-flex items-center gap-2 text-[0.8rem] font-semibold text-ink-soft">
                <span className={`w-2.5 h-2.5 rounded-full ${l.tone}`} />
                {l.label}
                <span className="font-bold text-ink">{l.n}</span>
              </span>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader icon="alert" tone="rose" title={tr("an_by_priority")} />

          <div className="mt-5 space-y-3.5">
            {byPriority.map((row) => (
              <div key={row.priority}>
                <div className="flex items-center justify-between mb-1.5">
                  <Badge tone={priorityTone(row.priority)} size="sm">
                    {trPriority(row.priority)}
                  </Badge>
                  <span className="text-[0.8rem] font-bold">
                    {row.gaps.length} {tr("an_gaps_word")}
                  </span>
                </div>
                <ProgressBar
                  value={share(row.gaps.length)}
                  tone={priorityTone(row.priority)}
                  size="sm"
                />
              </div>
            ))}
          </div>

          {criticalGaps.length > 0 && (
            <div className="mt-5 p-3.5 rounded-[16px] bg-rose-soft border border-rose/20">
              <p className="flex items-center gap-2 text-[0.78rem] font-bold text-rose mb-1.5">
                <Icon name="alert" size={14} />
                {tr("an_critical_first")}
              </p>
              <p className="text-[0.8rem] text-ink-soft leading-snug">
                {criticalGaps.slice(0, 3).map((s) => trSkill(s.name)).join(" · ")}
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* SKILL LIST */}
      <Card padded={false} className="p-5 sm:p-6">
        <CardHeader
          icon="layers"
          tone="lilac"
          title={tr("an_all_skills")}
          subtitle={tr("an_all_skills_sub")}
          className="mb-5"
        />
        <GapAnalysis
          tab={tab}
          setTab={setTab}
          allSkills={skills}
          filtered={filtered}
          onLearn={() => navigate("/roadmap")}
        />
      </Card>
    </div>
  );
}
