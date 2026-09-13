// src/components/onboarding/ProficiencyList.jsx

import Icon from "../common/Icon";
import Badge from "../common/Badge";
import { LevelMeter } from "../common/Progress";
import { useLang } from "../../context/LanguageContext";
import { LEVELS, DEFAULT_LEVEL } from "../../utils/data";
import { levelIndex } from "../../utils/roadmap";

const LEVEL_TONE = ["rose", "amber", "sage"];

/**
 * ProficiencyList — rate every selected skill Beginner / Intermediate / Advanced.
 * Shows the level the target role expects, so the gap is obvious while rating.
 */
export default function ProficiencyList({
  selectedSkills,
  skillLevels,
  setSkillLevel,
  requiredLevels = {},
}) {
  const { tr, trSkill, trSkillDesc, trLevel } = useLang();

  if (selectedSkills.length === 0) {
    return (
      <div className="sm-inset p-8 text-center">
        <span className="grid place-items-center w-12 h-12 rounded-2xl bg-canvas-deep text-ink-faint mx-auto mb-3">
          <Icon name="layers" size={22} />
        </span>
        <p className="text-[0.88rem] text-ink-soft">{tr("ob_levels_empty")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {selectedSkills.map((skill) => {
        const level = skillLevels[skill] || DEFAULT_LEVEL;
        const have = levelIndex(level);
        const need = requiredLevels[skill] ? levelIndex(requiredLevels[skill]) : null;
        const desc = trSkillDesc(skill);
        const short = have < (need ?? 0);

        return (
          <div
            key={skill}
            className="p-4 rounded-[18px] border border-line bg-surface transition-colors hover:border-ink-faint/30"
          >
            <div className="flex flex-col lg:flex-row lg:items-center gap-3.5">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <h4 className="text-[0.94rem] font-bold">{trSkill(skill)}</h4>
                  {need !== null && (
                    <Badge tone={short ? "amber" : "sage"} size="sm">
                      {tr("an_target_level")}: {trLevel(requiredLevels[skill])}
                    </Badge>
                  )}
                </div>

                {desc && (
                  <p className="text-[0.76rem] text-ink-faint leading-snug">{desc}</p>
                )}

                <LevelMeter
                  have={have + 1}
                  need={need !== null ? need + 1 : null}
                  tone={LEVEL_TONE[have]}
                  className="mt-2"
                />
              </div>

              {/* SEGMENTED LEVEL CONTROL */}
              <div
                className="inline-flex p-1 rounded-[14px] bg-canvas-deep border border-line self-start lg:self-auto"
                role="group"
                aria-label={`${skill} ${tr("ob_section_levels")}`}
              >
                {LEVELS.map((lv) => (
                  <button
                    key={lv}
                    onClick={() => setSkillLevel(skill, lv)}
                    aria-pressed={level === lv}
                    className={`px-3 py-1.5 rounded-[10px] text-[0.74rem] font-bold transition-all duration-150
                      ${
                        level === lv
                          ? "bg-surface text-brand shadow-[0_1px_2px_rgba(41,39,34,.1)]"
                          : "text-ink-faint hover:text-ink"
                      }`}
                  >
                    {tr(`level_${lv}`)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
