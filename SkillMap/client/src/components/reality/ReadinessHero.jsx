import Button from "../common/Button";
import Icon from "../common/Icon";
import { ProgressRing } from "../common/Progress";
import { useLang } from "../../context/LanguageContext";

const STATUS = {
  "not-ready": { tone: "rose", icon: "alert", label: "status_not_ready", desc: "status_not_ready_desc" },
  almost: { tone: "amber", icon: "zap", label: "status_almost", desc: "status_almost_desc" },
  ready: { tone: "sage", icon: "target", label: "status_ready", desc: "status_ready_desc" },
};

/**
 * ReadinessHero — the headline verdict: score, status and what it means.
 */
export default function ReadinessHero({
  score,
  status,
  matched,
  total,
  gaps,
  onPrimary,
  onSecondary,
}) {
  const { tr } = useLang();
  const cfg = STATUS[status];

  return (
    <div className="sm-card overflow-hidden sm-rise">
      <div className="sm-glow">
        <div className="flex flex-col lg:flex-row items-center gap-8 p-6 sm:p-8">
          <ProgressRing
            value={score}
            size={200}
            thickness={15}
            tone={cfg.tone}
            caption={tr("rc_readiness")}
          />

          <div className="flex-1 min-w-0 text-center lg:text-left">
            <h2 className="text-[1.5rem] sm:text-[1.9rem] font-extrabold leading-tight mb-2.5">
              {tr("rc_headline", { score })}
            </h2>

            <p className="text-[0.95rem] text-ink-soft leading-relaxed max-w-xl mb-1">
              {tr(cfg.desc, { gaps })}
            </p>

            <p className="text-[0.84rem] text-ink-faint mb-6">
              {tr("rc_matched_of", { a: matched, b: total })}
            </p>

            <div className="flex flex-wrap gap-2.5 justify-center lg:justify-start">
              <Button size="lg" iconRight="arrowRight" onClick={onPrimary}>
                {tr("rc_cta")}
              </Button>
              <Button size="lg" variant="secondary" icon="chart" onClick={onSecondary}>
                {tr("rc_review_gaps")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * FactorList — strengths or improvement areas, same shape both ways.
 */
export function FactorList({ items, tone = "sage", icon = "check", emptyLabel }) {
  const { trSkill } = useLang();

  if (!items.length) {
    return <p className="text-[0.84rem] text-ink-faint py-3">{emptyLabel}</p>;
  }

  return (
    <ul className="space-y-2">
      {items.map((s) => (
        <li
          key={s.name}
          className="flex items-center gap-3 p-2.5 rounded-[14px] bg-surface-muted border border-line-soft"
        >
          <span
            className={`grid place-items-center w-7 h-7 rounded-lg shrink-0 ${
              tone === "sage" ? "bg-sage-soft text-sage" : "bg-rose-soft text-rose"
            }`}
          >
            <Icon name={icon} size={14} strokeWidth={2.4} />
          </span>
          <span className="text-[0.85rem] font-semibold truncate">{trSkill(s.name)}</span>
        </li>
      ))}
    </ul>
  );
}
