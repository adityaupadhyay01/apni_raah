import Card, { CardHeader } from "../common/Card";
import Button from "../common/Button";
import Badge from "../common/Badge";
import Icon from "../common/Icon";
import { ProgressBar, ProgressRing } from "../common/Progress";
import { useLang } from "../../context/LanguageContext";
import { STUDY_TIME_OPTIONS } from "../../utils/roadmap";

/**
 * RoadmapSidebar — plan stats, study-time control and the learning entry point.
 */
export default function RoadmapSidebar({
  score,
  progress,
  done,
  totalSteps,
  totalWeeks,
  minutes,
  onPickTime,
  onLearn,
  onRestart,
}) {
  const { tr } = useLang();

  const timeLabel = tr(
    STUDY_TIME_OPTIONS.find((o) => o.minutes === minutes)?.key || "time_60"
  );

  return (
    <div className="space-y-5 lg:sticky lg:top-24">
      {/* PLAN SNAPSHOT */}
      <Card>
        <CardHeader icon="target" tone="brand" title={tr("rm_plan_snapshot")} />

        <div className="mt-5 flex items-center gap-5">
          <ProgressRing value={progress} size={104} thickness={10} tone="lilac" />

          <div className="min-w-0 space-y-2.5">
            <div>
              <div className="sm-eyebrow">{tr("rm_steps_done")}</div>
              <p className="text-[1.05rem] font-bold">
                {done}
                <span className="text-ink-faint font-bold text-[0.85rem]"> / {totalSteps}</span>
              </p>
            </div>
            <div>
              <div className="sm-eyebrow">{tr("rm_duration")}</div>
              <p className="text-[1.05rem] font-bold">
                {totalWeeks}
                <span className="text-ink-faint font-bold text-[0.85rem]"> {tr("rm_weeks")}</span>
              </p>
            </div>
          </div>
        </div>

        <ProgressBar
          value={score}
          tone="brand"
          size="sm"
          className="mt-5"
          label={tr("rm_current_readiness")}
          trailing={`${score}%`}
        />
      </Card>

      {/* STUDY TIME */}
      <Card>
        <CardHeader icon="clock" tone="amber" title={tr("rm_time_title")} subtitle={tr("rm_time_hint")} />

        <div className="mt-4 grid grid-cols-2 gap-2">
          {STUDY_TIME_OPTIONS.map((opt) => (
            <button
              key={opt.minutes}
              onClick={() => onPickTime(opt.minutes)}
              aria-pressed={minutes === opt.minutes}
              className={`px-3 py-2.5 rounded-[14px] border text-[0.78rem] font-bold transition-all duration-150
                ${
                  minutes === opt.minutes
                    ? "border-brand/40 bg-brand-soft text-brand"
                    : "border-line bg-surface-muted text-ink-soft hover:border-ink-faint/40 hover:text-ink"
                }`}
            >
              {tr(opt.key)}
            </button>
          ))}
        </div>

        <div className="mt-4 p-3 rounded-[14px] bg-surface-muted border border-line-soft">
          <p className="text-[0.8rem] text-ink-soft">
            {tr("rm_plan_summary", { weeks: totalWeeks, time: timeLabel })}
          </p>
        </div>
      </Card>

      {/* LEARNING CTA */}
      <Card className="relative overflow-hidden">
        <span className="absolute inset-y-0 left-0 w-1 bg-sage" />
        <div className="flex items-start gap-3">
          <span className="grid place-items-center w-10 h-10 rounded-[14px] bg-sage-soft text-sage shrink-0">
            <Icon name="code" size={19} />
          </span>
          <div className="min-w-0">
            <p className="font-bold text-[0.95rem] leading-snug">{tr("rm_grind_title")}</p>
            <p className="text-[0.8rem] text-ink-soft mt-0.5">{tr("rm_grind_sub")}</p>
          </div>
        </div>

        <Button variant="sage" size="sm" full icon="play" className="mt-4" onClick={onLearn}>
          {tr("rm_grind")}
        </Button>
      </Card>

      <Button variant="ghost" size="sm" full icon="refresh" onClick={onRestart}>
        {tr("rm_restart")}
      </Button>

      <div className="flex justify-center">
        <Badge tone="neutral" icon="sparkle">
          {tr("rm_personalised_note")}
        </Badge>
      </div>
    </div>
  );
}
