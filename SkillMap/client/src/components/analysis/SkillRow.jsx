import Badge, { priorityTone, statusTone } from "../common/Badge";
import Icon from "../common/Icon";
import { LevelMeter } from "../common/Progress";
import { useLang } from "../../context/LanguageContext";
import { levelIndex } from "../../utils/roadmap";

const ACCENT = {
  matched: "bg-sage",
  improve: "bg-amber",
  missing: "bg-rose",
};

/**
 * SkillRow — one skill card in the gap analysis: current vs required level,
 * how big the gap is, how urgent it is, and what blocks it.
 */
export default function SkillRow({ skill, onLearn }) {
  const { tr, trSkill, trSkillDesc, trLevel, trPriority } = useLang();

  const have = skill.have ? levelIndex(skill.have) : -1;
  const need = levelIndex(skill.need);
  const distance = Math.max(0, need - Math.max(0, have)) + (have < 0 ? 1 : 0);
  const gapLabel =
    skill.status === "matched"
      ? tr("gap_none")
      : distance >= 2
      ? tr("gap_high")
      : distance === 1
      ? tr("gap_medium")
      : tr("gap_low");

  const desc = trSkillDesc(skill.name);

  return (
    <div className="relative overflow-hidden rounded-[18px] border border-line bg-surface p-4 sm:p-5 transition-all duration-200 hover:border-ink-faint/30 hover:-translate-y-0.5">
      <span className={`absolute inset-y-0 left-0 w-1 ${ACCENT[skill.status]}`} />

      <div className="flex flex-col lg:flex-row lg:items-center gap-4 pl-2">
        {/* IDENTITY */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h4 className="text-[0.98rem] font-bold">{trSkill(skill.name)}</h4>
            <Badge tone={statusTone(skill.status)} size="sm">
              {tr(`status_${skill.status}`)}
            </Badge>
            {skill.status !== "matched" && (
              <Badge tone={priorityTone(skill.priority)} size="sm">
                {trPriority(skill.priority)}
              </Badge>
            )}
          </div>

          {desc && (
            <p className="text-[0.78rem] text-ink-faint leading-snug max-w-xl">{desc}</p>
          )}

          {skill.blocked && (
            <p className="mt-2 inline-flex items-center gap-1.5 text-[0.74rem] font-semibold text-lilac">
              <Icon name="lock" size={13} />
              {tr("an_requires")}: {skill.blockers.map((b) => trSkill(b)).join(", ")}
            </p>
          )}
        </div>

        {/* LEVEL COMPARISON — wraps on narrow screens instead of overflowing */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 sm:gap-x-5 lg:shrink-0">
          <div className="text-center min-w-16 sm:min-w-20">
            <div className="sm-eyebrow mb-1">{tr("an_your_level")}</div>
            <div className="text-[0.84rem] font-bold">
              {skill.have ? trLevel(skill.have) : tr("level_none")}
            </div>
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <LevelMeter
              have={have + 1}
              need={need + 1}
              tone={statusTone(skill.status)}
            />
            <span className="text-[0.66rem] font-bold text-ink-faint">{gapLabel}</span>
          </div>

          <div className="text-center min-w-16 sm:min-w-20">
            <div className="sm-eyebrow mb-1">{tr("an_target_level")}</div>
            <div className="text-[0.84rem] font-bold">{trLevel(skill.need)}</div>
          </div>

          {skill.status !== "matched" && onLearn && (
            <button
              onClick={() => onLearn(skill)}
              title={tr("an_learn")}
              className="grid place-items-center w-9 h-9 rounded-xl border border-line text-ink-soft
                hover:text-brand hover:border-brand/40 transition-colors shrink-0 ml-auto lg:ml-0"
            >
              <Icon name="arrowRight" size={17} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
