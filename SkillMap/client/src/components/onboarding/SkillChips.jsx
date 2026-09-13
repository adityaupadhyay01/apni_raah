// src/components/onboarding/SkillChips.jsx

import { useState } from "react";

import Icon from "../common/Icon";
import Badge from "../common/Badge";
import Button from "../common/Button";
import { useLang } from "../../context/LanguageContext";

/**
 * SkillChips — searchable skill picker.
 * Role-required skills are surfaced first so the assessment stays relevant.
 */
export default function SkillChips({
  ALL_SKILLS,
  selectedSkills,
  toggleSkill,
  customSkill,
  setCustomSkill,
  addCustom,
  requiredSkills = [],
}) {
  const { tr, trSkill, trSkillDesc } = useLang();
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const pool = [...new Set([...requiredSkills, ...ALL_SKILLS])].sort((a, b) => {
    const ra = requiredSkills.includes(a) ? 0 : 1;
    const rb = requiredSkills.includes(b) ? 0 : 1;
    return ra - rb || a.localeCompare(b);
  });

  const visible = q ? pool.filter((s) => s.toLowerCase().includes(q)) : pool;
  const custom = selectedSkills.filter((s) => !pool.includes(s));

  return (
    <div>
      {/* SEARCH */}
      <div className="relative mb-4">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint pointer-events-none">
          <Icon name="search" size={17} />
        </span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={tr("ob_search_skills")}
          className="w-full pl-10 pr-4 py-2.5 rounded-[14px] bg-surface-muted border border-line
            text-[0.86rem] placeholder:text-ink-faint outline-none transition-all
            focus:border-brand/40 focus:ring-4 focus:ring-brand/8 focus:bg-surface"
        />
      </div>

      {/* CHIPS */}
      <div className="flex flex-wrap gap-2 mb-5 max-h-72 overflow-y-auto pr-1">
        {visible.map((s) => {
          const on = selectedSkills.includes(s);
          const required = requiredSkills.includes(s);

          return (
            <button
              key={s}
              onClick={() => toggleSkill(s)}
              aria-pressed={on}
              title={trSkillDesc(s) || undefined}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border
                text-[0.8rem] font-semibold transition-all duration-150
                ${
                  on
                    ? "border-brand bg-brand text-white shadow-[0_6px_14px_-9px_rgba(169,84,59,.45)]"
                    : required
                    ? "border-brand/30 bg-brand-soft text-brand hover:border-brand/60"
                    : "border-line bg-surface text-ink-soft hover:border-ink-faint/45 hover:text-ink"
                }`}
            >
              {on && <Icon name="check" size={12} strokeWidth={3} />}
              {s}
              {required && !on && <span className="w-1.5 h-1.5 rounded-full bg-brand/50" />}
            </button>
          );
        })}

        {visible.length === 0 && (
          <p className="text-[0.84rem] text-ink-faint py-3">{tr("ob_no_match")}</p>
        )}
      </div>

      {/* CUSTOM SKILL */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <input
          type="text"
          placeholder={tr("ob_custom_placeholder")}
          value={customSkill}
          onChange={(e) => setCustomSkill(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addCustom()}
          className="flex-1 px-4 py-2.5 rounded-[14px] bg-surface border border-line
            text-[0.86rem] placeholder:text-ink-faint outline-none transition-all
            focus:border-brand/40 focus:ring-4 focus:ring-brand/8"
        />
        <Button variant="secondary" icon="plus" onClick={addCustom}>
          {tr("ob_add")}
        </Button>
      </div>

      {custom.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="sm-eyebrow">{tr("ob_custom_added")}</span>
          {custom.map((s) => (
            <button key={s} onClick={() => toggleSkill(s)} title={tr("ob_remove")}>
              <Badge tone="sage" icon="close">
                {trSkill(s)}
              </Badge>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
