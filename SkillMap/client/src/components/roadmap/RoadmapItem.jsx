import Badge, { priorityTone } from "../common/Badge";
import Icon from "../common/Icon";
import { LevelMeter } from "../common/Progress";
import { useLang } from "../../context/LanguageContext";
import { levelIndex } from "../../utils/roadmap";

/**
 * RoadmapItem — one node on the learning timeline.
 */
export default function RoadmapItem({ step, index, isLast, done, onToggle, onStart }) {
  const { tr, trLevel, trPriority } = useLang();

  const isMilestone = step.type === "project";
  const have = step.have ? levelIndex(step.have) : -1;
  const need = step.need ? levelIndex(step.need) : null;

  return (
    <li className="relative flex gap-4 sm:gap-5">
      {/* RAIL */}
      <div className="flex flex-col items-center shrink-0">
        <span
          className={`grid place-items-center w-10 h-10 rounded-[14px] text-[0.8rem] font-bold border-2 transition-all duration-200
            ${
              done
                ? "bg-sage border-sage text-white"
                : isMilestone
                ? "bg-lilac-soft border-lilac/35 text-lilac"
                : "bg-surface border-line text-ink-soft"
            }`}
        >
          {done ? <Icon name="check" size={17} strokeWidth={3} /> : index + 1}
        </span>

        {!isLast && (
          <span
            className={`w-0.5 flex-1 my-1.5 rounded-full ${done ? "bg-sage/35" : "bg-line"}`}
          />
        )}
      </div>

      {/* CARD */}
      <div
        className={`flex-1 min-w-0 mb-4 p-4 sm:p-5 rounded-[18px] border transition-all duration-200
          ${
            done
              ? "border-sage/25 bg-sage-soft/35"
              : "border-line bg-surface hover:border-ink-faint/30 hover:-translate-y-0.5"
          }`}
      >
        {/* META ROW */}
        <div className="flex flex-wrap items-center gap-2 mb-2.5">
          <Badge tone="neutral" icon="clock" size="sm">
            {tr("rm_week")} {step.startWeek}–{step.endWeek}
          </Badge>

          {!isMilestone && step.priority && (
            <Badge tone={priorityTone(step.priority)} size="sm">
              {trPriority(step.priority)}
            </Badge>
          )}

          {isMilestone && (
            <Badge tone="lilac" icon="award" size="sm">
              {tr("rm_milestone")}
            </Badge>
          )}

          <Badge tone="neutral" size="sm">
            {step.weeks} {step.weeks === 1 ? tr("rm_week") : tr("rm_weeks")}
          </Badge>

          {done && (
            <Badge tone="sage" icon="check" size="sm">
              {tr("rm_done")}
            </Badge>
          )}
        </div>

        <h4
          className={`text-[1.02rem] font-bold leading-snug mb-1.5 ${
            done ? "line-through decoration-sage/50" : ""
          }`}
        >
          {step.title}
        </h4>

        {step.why && (
          <p className="text-[0.85rem] text-ink-soft leading-relaxed mb-3">
            <span className="font-bold text-ink">{tr("rm_why")}: </span>
            {step.why}
          </p>
        )}

        {/* LEVEL TARGET */}
        {!isMilestone && need !== null && (
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[0.74rem] font-semibold text-ink-faint">
              {step.have ? trLevel(step.have) : tr("level_none")} → {trLevel(step.need)}
            </span>
            <LevelMeter have={have + 1} need={need + 1} tone={priorityTone(step.priority)} />
          </div>
        )}

        {step.resource && (
          <p className="flex items-start gap-2 text-[0.8rem] text-ink-soft mb-3">
            <span className="text-ink-faint shrink-0 mt-0.5">
              <Icon name="book" size={14} />
            </span>
            <span>
              <span className="font-semibold">{tr("rm_resource")}:</span> {step.resource}
            </span>
          </p>
        )}

        {step.deps?.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            <span className="text-[0.72rem] font-semibold text-ink-faint">
              {tr("an_requires")}:
            </span>
            {step.deps.map((d) => (
              <span
                key={d}
                className="px-2 py-0.5 rounded-md bg-surface-muted border border-line-soft text-[0.7rem] font-semibold text-ink-soft"
              >
                {d}
              </span>
            ))}
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={onToggle}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[0.76rem] font-bold border transition-all
              ${
                done
                  ? "border-sage/35 bg-surface text-sage"
                  : "border-line bg-surface-muted text-ink-soft hover:border-sage/45 hover:text-sage"
              }`}
          >
            <Icon name={done ? "checkCircle" : "check"} size={14} strokeWidth={2.4} />
            {done ? tr("rm_mark_undone") : tr("rm_mark_done")}
          </button>

          {!isMilestone && onStart && (
            <button
              onClick={onStart}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[0.76rem] font-bold
                border border-line bg-surface-muted text-ink-soft hover:border-brand/45 hover:text-brand transition-all"
            >
              <Icon name="play" size={13} />
              {tr("rm_start_step")}
            </button>
          )}
        </div>
      </div>
    </li>
  );
}
