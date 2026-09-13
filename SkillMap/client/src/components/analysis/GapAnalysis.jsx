import SkillRow from "./SkillRow";
import Icon from "../common/Icon";
import { useLang } from "../../context/LanguageContext";

const TABS = [
  { key: "all", label: "tab_all", icon: "grid" },
  { key: "matched", label: "tab_matched", icon: "checkCircle" },
  { key: "improve", label: "tab_improve", icon: "trending" },
  { key: "missing", label: "tab_missing", icon: "alert" },
  { key: "blocked", label: "tab_blocked", icon: "lock" },
];

/**
 * GapAnalysis — filterable list of every required skill.
 */
export default function GapAnalysis({ tab, setTab, allSkills, filtered, onLearn }) {
  const { tr } = useLang();

  const countFor = (key) => {
    if (key === "all") return allSkills.length;
    if (key === "blocked") return allSkills.filter((s) => s.blocked).length;
    return allSkills.filter((s) => s.status === key).length;
  };

  return (
    <div>
      {/* TABS */}
      <div className="flex flex-wrap gap-2 mb-5">
        {TABS.map((item) => {
          const active = tab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              aria-pressed={active}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-[14px] border text-[0.8rem] font-bold transition-all duration-150
                ${
                  active
                    ? "border-brand/35 bg-surface text-brand shadow-[0_1px_2px_rgba(41,39,34,.06)]"
                    : "border-line bg-canvas-deep/50 text-ink-soft hover:text-ink hover:border-ink-faint/35"
                }`}
            >
              <Icon name={item.icon} size={15} />
              {tr(item.label)}
              <span
                className={`px-1.5 py-0.5 rounded-md text-[0.68rem] ${
                  active ? "bg-brand-soft text-brand" : "bg-surface text-ink-faint"
                }`}
              >
                {countFor(item.key)}
              </span>
            </button>
          );
        })}
      </div>

      {/* LIST */}
      {filtered.length === 0 ? (
        <div className="sm-inset px-6 py-12 text-center">
          <span className="grid place-items-center w-12 h-12 rounded-2xl bg-surface border border-line text-ink-faint mx-auto mb-3">
            <Icon name="search" size={22} />
          </span>
          <p className="text-[0.88rem] text-ink-soft">{tr("an_empty")}</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((s) => (
            <SkillRow key={s.name} skill={s} onLearn={onLearn} />
          ))}
        </div>
      )}
    </div>
  );
}
