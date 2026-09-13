import { useNavigate } from "react-router-dom";

import Card, { CardHeader } from "../components/common/Card";
import Button from "../components/common/Button";
import Badge, { priorityTone } from "../components/common/Badge";
import Icon from "../components/common/Icon";
import PageHeader from "../components/common/PageHeader";
import { LevelMeter } from "../components/common/Progress";

import WarZone from "../components/warzone/WarZone";

import { useLang } from "../context/LanguageContext";
import { useProfile } from "../context/ProfileContext";
import { levelIndex } from "../utils/roadmap";

export default function Learning() {
  const navigate = useNavigate();
  const { tr, trSkill, trLevel, trPriority } = useLang();
  const { topGap, nextStep } = useProfile();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={tr("lrn_eyebrow")}
        title={tr("lrn_title")}
        subtitle={tr("lrn_sub")}
        actions={
          <Button variant="secondary" icon="route" onClick={() => navigate("/roadmap")}>
            {tr("lrn_back_roadmap")}
          </Button>
        }
      />

      {/* CURRENT FOCUS */}
      {topGap && (
        <Card className="relative overflow-hidden sm-rise">
          <span className="absolute inset-y-0 left-0 w-1 bg-brand" />
          <CardHeader
            icon="target"
            tone="brand"
            title={tr("lrn_focus")}
            subtitle={tr("lrn_focus_sub")}
          />

          <div className="mt-5 flex flex-col lg:flex-row lg:items-center gap-5">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <h3 className="text-[1.25rem] font-bold">{trSkill(topGap.name)}</h3>
                <Badge tone={priorityTone(topGap.priority)} size="sm">
                  {trPriority(topGap.priority)}
                </Badge>
              </div>

              <p className="text-[0.86rem] text-ink-soft mb-3">
                {tr("dash_gap_line", {
                  have: topGap.have ? trLevel(topGap.have) : tr("level_none"),
                  need: trLevel(topGap.need),
                })}
              </p>

              <LevelMeter
                have={topGap.have ? levelIndex(topGap.have) + 1 : 0}
                need={levelIndex(topGap.need) + 1}
                tone={priorityTone(topGap.priority)}
              />
            </div>

            {nextStep && (
              <div className="sm-inset p-4 lg:w-72 shrink-0">
                <div className="sm-eyebrow mb-1.5">{tr("lrn_next_step")}</div>
                <p className="text-[0.9rem] font-bold leading-snug mb-1">
                  {nextStep.type === "project"
                    ? tr(nextStep.skill === "PORTFOLIO_PROJECT" ? "rm_project" : "rm_apply")
                    : trSkill(nextStep.skill)}
                </p>
                <p className="text-[0.76rem] text-ink-faint">
                  {tr("rm_week")} {nextStep.startWeek}–{nextStep.endWeek} · {nextStep.weeks}{" "}
                  {nextStep.weeks === 1 ? tr("rm_week") : tr("rm_weeks")}
                </p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* LABS */}
      <div>
        <div className="flex items-center gap-2.5 mb-4">
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-sage-soft text-sage">
            <Icon name="code" size={18} />
          </span>
          <div>
            <h2 className="text-[1.1rem] font-bold leading-tight">{tr("lrn_labs")}</h2>
            <p className="text-[0.8rem] text-ink-faint">{tr("lrn_labs_sub")}</p>
          </div>
        </div>

        <WarZone focusSkill={topGap?.name} />
      </div>
    </div>
  );
}
