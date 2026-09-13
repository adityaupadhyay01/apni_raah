import { useState } from "react";

import CertificateBuilder from "./CertificateBuilderComp";
import LabScreen from "./LabScreen";
import { HTML_LEVELS } from "./data";

import Card, { CardHeader } from "../common/Card";
import Button from "../common/Button";
import Badge from "../common/Badge";
import Icon from "../common/Icon";
import { ProgressBar } from "../common/Progress";
import { useLang } from "../../context/LanguageContext";
import { LabFrame } from "./WarZone";

// Static display info for the UI path
const LEVEL_META = [
  { id: 1, subtitle: "Learn <!DOCTYPE html>", locked: false },
  { id: 2, subtitle: "Master <html>, <body>, <p>", locked: false },
  { id: 3, subtitle: "Add <head> and <title>", locked: false },
];

const FINAL_LEVEL = {
  id: "final",
  title: "Build your certificate",
  subtitle: "Final mission — put the whole page together",
  xp: "1000 XP",
  locked: false,
  done: false,
  isFinal: true,
};

export default function LevelSelector({ skill, onBack }) {
  const { tr } = useLang();

  const [activeLevel, setActiveLevel] = useState(null); // number | "final" | null
  const [passedLevels, setPassedLevels] = useState({}); // { [id]: xp }
  const [totalXP, setTotalXP] = useState(0);

  // Mark level as passed and accumulate XP
  const handlePass = (id, xp) => {
    setPassedLevels((prev) => {
      if (prev[id]) return prev;
      setTotalXP((x) => x + xp);
      return { ...prev, [id]: xp };
    });
  };

  if (activeLevel && activeLevel !== "final") {
    const levelData = HTML_LEVELS.find((l) => l.id === activeLevel);

    return (
      <LabFrame>
        <LabScreen
          level={levelData}
          onBack={() => setActiveLevel(null)}
          onPass={() => handlePass(levelData.id, levelData.xp)}
        />
      </LabFrame>
    );
  }

  if (activeLevel === "final") {
    return (
      <LabFrame>
        <CertificateBuilder onBack={() => setActiveLevel(null)} />
      </LabFrame>
    );
  }

  const allPracticeLevels = LEVEL_META.map((meta) => {
    const data = HTML_LEVELS.find((l) => l.id === meta.id) || {};
    return {
      ...meta,
      title: data.title,
      xp: `${data.xp} XP`,
      done: !!passedLevels[meta.id],
    };
  });

  const displayLevels = [...allPracticeLevels, FINAL_LEVEL];
  const doneCount = allPracticeLevels.filter((l) => l.done).length;
  const progress = Math.round((doneCount / allPracticeLevels.length) * 100);

  return (
    <div>
      {/* HEADER */}
      <div className="flex flex-wrap items-center gap-3 justify-between mb-5">
        <div className="flex items-center gap-3 min-w-0">
          <Button variant="secondary" size="sm" icon="arrowLeft" onClick={onBack}>
            {tr("lab_exit")}
          </Button>
          <div className="min-w-0">
            <h2 className="text-[1.1rem] font-bold truncate">
              {tr("lab_title", { name: skill?.name || "HTML" })}
            </h2>
            <p className="text-[0.8rem] text-ink-faint">{tr("lab_pick_mission")}</p>
          </div>
        </div>

        <Badge tone="amber" icon="star">
          {totalXP} XP
        </Badge>
      </div>

      <Card className="mb-5">
        <CardHeader
          icon="award"
          tone="peach"
          title={tr("lab_mission_path")}
          subtitle={tr("lab_mission_sub")}
          action={<Badge tone="sage">{doneCount}/{allPracticeLevels.length}</Badge>}
        />
        <ProgressBar value={progress} tone="peach" size="sm" className="mt-5" />
      </Card>

      {/* MISSION LIST */}
      <ol className="relative">
        {displayLevels.map((level, i) => (
          <li key={level.id} className="relative flex gap-4 sm:gap-5">
            <div className="flex flex-col items-center shrink-0">
              <span
                className={`grid place-items-center w-10 h-10 rounded-[14px] text-[0.8rem] font-bold border-2 transition-all
                  ${
                    level.done
                      ? "bg-sage border-sage text-white"
                      : level.isFinal
                      ? "bg-amber-soft border-amber/35 text-amber"
                      : "bg-surface border-line text-ink-soft"
                  }`}
              >
                {level.locked ? (
                  <Icon name="lock" size={16} />
                ) : level.done ? (
                  <Icon name="check" size={17} strokeWidth={3} />
                ) : level.isFinal ? (
                  <Icon name="award" size={17} />
                ) : (
                  i + 1
                )}
              </span>

              {i < displayLevels.length - 1 && (
                <span
                  className={`w-0.5 flex-1 my-1.5 rounded-full ${
                    level.done ? "bg-sage/35" : "bg-line"
                  }`}
                />
              )}
            </div>

            <button
              disabled={level.locked}
              onClick={() => !level.locked && setActiveLevel(level.id)}
              className={`flex-1 min-w-0 mb-4 p-4 sm:p-5 rounded-[18px] border text-left transition-all duration-200
                disabled:opacity-55 disabled:cursor-not-allowed
                ${
                  level.done
                    ? "border-sage/25 bg-sage-soft/35"
                    : level.isFinal
                    ? "border-amber/30 bg-amber-soft/40 hover:-translate-y-0.5"
                    : "border-line bg-surface hover:border-ink-faint/30 hover:-translate-y-0.5"
                }`}
            >
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge tone={level.isFinal ? "amber" : "neutral"} size="sm">
                  {level.isFinal ? tr("lab_final") : `${tr("lab_level")} ${level.id}`}
                </Badge>
                <Badge tone={level.done ? "sage" : "neutral"} size="sm" icon="star">
                  {level.xp}
                </Badge>
                {level.done && (
                  <Badge tone="sage" icon="check" size="sm">
                    {tr("rm_done")}
                  </Badge>
                )}
              </div>

              <h4 className="text-[1rem] font-bold leading-snug mb-1">
                {level.title}
              </h4>
              <p className="text-[0.83rem] text-ink-soft mb-3">{level.subtitle}</p>

              <span className="inline-flex items-center gap-1.5 text-[0.8rem] font-bold text-brand">
                {level.done ? tr("lab_replay") : tr("lab_enter")}
                <Icon name="arrowRight" size={15} />
              </span>
            </button>
          </li>
        ))}
      </ol>

      <p className="text-center text-[0.82rem] text-ink-faint mt-2">
        {tr("lab_badge_note")}
      </p>
    </div>
  );
}
