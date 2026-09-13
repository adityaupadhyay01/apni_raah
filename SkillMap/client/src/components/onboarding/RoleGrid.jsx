// src/components/onboarding/RoleGrid.jsx

import Icon from "../common/Icon";
import Badge from "../common/Badge";
import { useLang } from "../../context/LanguageContext";

const ROLE_META = {
  "Data Analyst": { icon: "chart", tone: "sky" },
  "Web Developer": { icon: "code", tone: "brand" },
  "ML Engineer": { icon: "sparkle", tone: "lilac" },
  "Product Manager": { icon: "target", tone: "peach" },
  "DevOps Engineer": { icon: "settings", tone: "sage" },
};

const TONE_CHIP = {
  brand: "bg-brand-soft text-brand",
  sage: "bg-sage-soft text-sage",
  peach: "bg-peach-soft text-peach",
  lilac: "bg-lilac-soft text-lilac",
  sky: "bg-sky-soft text-sky",
};

export default function RoleGrid({ ROLES, selectedRole, setSelectedRole }) {
  const { tr, trRole } = useLang();

  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
      {Object.entries(ROLES).map(([role, data]) => {
        const meta = ROLE_META[role] || { icon: "briefcase", tone: "brand" };
        const active = selectedRole === role;
        const core = Object.entries(data.priorities || {})
          .filter(([, p]) => p === "HIGH")
          .slice(0, 3)
          .map(([s]) => s);

        return (
          <button
            key={role}
            onClick={() => setSelectedRole(role)}
            aria-pressed={active}
            className={`group text-left p-4 sm:p-5 rounded-[18px] border transition-all duration-200
              ${
                active
                  ? "border-brand/45 bg-brand-soft/55 shadow-[0_1px_1.5px_rgba(41,39,34,.04),0_10px_22px_-15px_rgba(169,84,59,.38)]"
                  : "border-line bg-surface hover:border-ink-faint/40 hover:-translate-y-0.5"
              }`}
          >
            <div className="flex items-start justify-between mb-3.5">
              <span
                className={`grid place-items-center w-11 h-11 rounded-[15px] transition-colors ${
                  active ? "bg-brand text-white" : TONE_CHIP[meta.tone]
                }`}
              >
                <Icon name={meta.icon} size={21} />
              </span>

              <span
                className={`grid place-items-center w-6 h-6 rounded-full border-2 transition-all ${
                  active
                    ? "border-brand bg-brand text-white"
                    : "border-line-soft text-transparent group-hover:border-ink-faint/50"
                }`}
              >
                <Icon name="check" size={12} strokeWidth={3} />
              </span>
            </div>

            <h4 className="text-[1.02rem] font-bold leading-tight mb-1.5">
              {trRole(role)}
            </h4>

            <p className="text-[0.76rem] text-ink-faint font-semibold mb-3">
              {tr("ob_role_skills", { n: data.skills.length })}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {core.map((s) => (
                <Badge key={s} tone={active ? "brand" : "neutral"} size="sm">
                  {s}
                </Badge>
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
}
