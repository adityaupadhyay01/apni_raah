import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Card, { CardHeader } from "../components/common/Card";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import PageHeader, { EmptyState } from "../components/common/PageHeader";
import StatCard from "../components/common/StatCard";

import WarZone from "../components/warzone/WarZone";
import RoadmapList from "../components/roadmap/RoadmapList";
import RoadmapSidebar from "../components/roadmap/RoadmapSidebar";

import { useLang } from "../context/LanguageContext";
import { useProfile } from "../context/ProfileContext";
import { DEFAULT_STUDY_MINUTES } from "../utils/roadmap";

export default function Roadmap() {
  const navigate = useNavigate();

  // original behaviour: the Grind Zone opens inside the roadmap page
  const [inWarZone, setInWarZone] = useState(false);
  const { tr, trRole, trSkill, trLevel } = useLang();
  const {
    profile,
    roleData,
    summary,
    steps,
    totalWeeks,
    readiness,
    roadmapProgress,
    doneCount,
    topGap,
    updateProfile,
    toggleStep,
  } = useProfile();

  const minutes = profile.studyTime || DEFAULT_STUDY_MINUTES;
  const completed = profile.completedSteps || [];
  const gapCount = summary.improve.length + summary.missing.length;

  // translate each step into something the timeline can render directly
  const view = steps.map((s) => {
    if (s.type === "project") {
      const isProject = s.skill === "PORTFOLIO_PROJECT";
      return {
        ...s,
        title: tr(isProject ? "rm_project" : "rm_apply"),
        resource: tr(isProject ? "rm_project_res" : "rm_apply_res"),
        why: tr(isProject ? "why_project" : "why_apply"),
        deps: [],
      };
    }

    const why = s.blocked
      ? tr("why_blocked", { deps: s.deps.map((d) => trSkill(d)).join(", ") })
      : s.status === "improve"
      ? tr("why_improve", {
          have: trLevel(s.have),
          need: trLevel(s.need),
          role: trRole(profile.role),
        })
      : tr(`why_${s.priority.toLowerCase()}`, { role: trRole(profile.role) });

    return {
      ...s,
      title: tr(s.status === "improve" ? "rm_improve" : "rm_learn", {
        skill: trSkill(s.skill),
      }),
      resource: roleData.resources?.[s.skill] || tr("rm_resource_fallback"),
      why,
      deps: s.deps.map((d) => trSkill(d)),
    };
  });

  // Grind Zone takes over the roadmap page, exactly as it always did
  if (inWarZone) {
    return <WarZone onBack={() => setInWarZone(false)} focusSkill={topGap?.name} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={tr("rm_kicker")}
        title={tr("rm_steps_to", { n: gapCount, role: trRole(profile.role) })}
        subtitle={tr("rm_source")}
        actions={
          <>
            <Button variant="secondary" icon="chart" onClick={() => navigate("/analysis")}>
              {tr("rm_back_analysis")}
            </Button>
            <Button icon="play" onClick={() => setInWarZone(true)}>
              {tr("rm_grind")}
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon="route" tone="lilac" label={tr("rm_total_steps")} value={steps.length} />
        <StatCard icon="checkCircle" tone="sage" label={tr("rm_steps_done")} value={doneCount} suffix={`/ ${steps.length}`} progress={roadmapProgress} />
        <StatCard icon="clock" tone="amber" label={tr("rm_duration")} value={totalWeeks} suffix={tr("rm_weeks")} />
        <StatCard icon="target" tone="brand" label={tr("rm_current_readiness")} value={readiness} suffix="%" progress={readiness} />
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-5 items-start">
        {/* TIMELINE */}
        <Card>
          <CardHeader
            icon="route"
            tone="lilac"
            title={tr("rm_timeline")}
            subtitle={tr("rm_timeline_sub", { weeks: totalWeeks })}
            action={<Badge tone="lilac">{roadmapProgress}%</Badge>}
            className="mb-6"
          />

          {gapCount === 0 ? (
            <EmptyState
              icon="award"
              title={tr("rm_all_done")}
              body={tr("rm_all_done_sub")}
              action={
                <Button iconRight="arrowRight" onClick={() => navigate("/simulation")}>
                  {tr("rm_try_simulation")}
                </Button>
              }
            />
          ) : (
            <RoadmapList
              roadmap={view}
              completed={completed}
              onToggle={toggleStep}
              onStart={() => setInWarZone(true)}
            />
          )}
        </Card>

        {/* SIDEBAR */}
        <RoadmapSidebar
          score={readiness}
          progress={roadmapProgress}
          done={doneCount}
          totalSteps={steps.length}
          totalWeeks={totalWeeks}
          minutes={minutes}
          onPickTime={(m) => updateProfile({ studyTime: m })}
          onLearn={() => setInWarZone(true)}
          onRestart={() => navigate("/onboarding")}
        />
      </div>

      {/* NEXT DESTINATIONS */}
      <div className="grid sm:grid-cols-2 gap-5">
        <Card className="flex flex-wrap items-center gap-4 justify-between">
          <div className="min-w-0">
            <p className="font-bold text-[0.95rem]">{tr("rm_mentor_title")}</p>
            <p className="text-[0.83rem] text-ink-soft">{tr("rm_mentor_sub")}</p>
          </div>
          <Button variant="secondary" iconRight="arrowRight" onClick={() => navigate("/consultation")}>
            {tr("rm_consult")}
          </Button>
        </Card>

        <Card className="flex flex-wrap items-center gap-4 justify-between">
          <div className="min-w-0">
            <p className="font-bold text-[0.95rem]">{tr("rm_sim_title")}</p>
            <p className="text-[0.83rem] text-ink-soft">{tr("rm_sim_sub")}</p>
          </div>
          <Button variant="secondary" iconRight="arrowRight" onClick={() => navigate("/simulation")}>
            {tr("rm_sim")}
          </Button>
        </Card>
      </div>
    </div>
  );
}
