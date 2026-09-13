/* eslint-disable react-refresh/only-export-components --
   shared constants/helpers deliberately live beside their component */
import { useEffect, useState } from "react";

import LevelSelector from "./LevelSelector";
import CSSLab from "./CSSLab";
import JavaScriptLab from "./JavaScriptLab";
import ProjectLab from "./ProjectLab";

import Card, { CardHeader } from "../common/Card";
import Button from "../common/Button";
import Badge from "../common/Badge";
import Icon from "../common/Icon";
import { ProgressBar } from "../common/Progress";
import { useLang } from "../../context/LanguageContext";
import { LAB_PROGRESS } from "../../context/ProfileContext";

export const LABS = [
  {
    id: "html",
    name: "HTML",
    skill: "HTML",
    tagline: "lab_html_tag",
    description: "lab_html_desc",
    icon: "code",
    tone: "peach",
    levels: 3,
    xpMax: 1750,
  },
  {
    id: "css",
    name: "CSS",
    skill: "CSS",
    tagline: "lab_css_tag",
    description: "lab_css_desc",
    icon: "sparkle",
    tone: "sky",
    levels: 3,
    xpMax: 2500,
  },
  {
    id: "js",
    name: "JavaScript",
    skill: "JavaScript",
    tagline: "lab_js_tag",
    description: "lab_js_desc",
    icon: "zap",
    tone: "amber",
    levels: 3,
    xpMax: 4000,
  },
  {
    id: "project",
    name: "Projects",
    skill: "Portfolio",
    tagline: "lab_project_tag",
    description: "lab_project_desc",
    icon: "briefcase",
    tone: "lilac",
    levels: 2,
    xpMax: 6000,
  },
];

/**
 * LabFrame — a lab takes over the whole screen so there is nothing between
 * the student and the editor. Wide desktop layouts still scroll sideways on
 * narrow screens rather than being clipped.
 */
export function LabFrame({ header, children }) {
  // the page behind must not scroll while a lab is open
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-canvas">
      {header}
      <div className="flex-1 overflow-auto">
        <div className="min-w-[880px] lg:min-w-0 min-h-full flex flex-col [&>*]:flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}

/** LabShell — consistent frame around every lab experience. */
export function LabShell({ title, subtitle, onBack, children }) {
  const { tr } = useLang();

  return (
    <LabFrame
      header={
        <div className="shrink-0 flex items-center gap-3 justify-between px-4 sm:px-6 h-16 border-b border-line bg-canvas">
          <div className="flex items-center gap-3 min-w-0">
            <Button variant="secondary" size="sm" icon="arrowLeft" onClick={onBack}>
              {tr("lab_exit")}
            </Button>
            <div className="min-w-0">
              <h2 className="text-[1rem] font-semibold truncate">{title}</h2>
              {subtitle && (
                <p className="text-[0.78rem] text-ink-faint truncate">{subtitle}</p>
              )}
            </div>
          </div>

          <Badge tone="sage" dot className="shrink-0">
            {tr("lab_live")}
          </Badge>
        </div>
      }
    >
      {children}
    </LabFrame>
  );
}

export default function WarZone({ onBack, focusSkill }) {
  const { tr } = useLang();
  const [selected, setSelected] = useState(null);

  if (selected) {
    const shell = {
      title: tr("lab_title", { name: selected.name }),
      subtitle: tr(selected.description),
      onBack: () => setSelected(null),
    };

    if (selected.id === "html") {
      return <LevelSelector skill={selected} onBack={() => setSelected(null)} />;
    }
    if (selected.id === "css") {
      return (
        <LabShell {...shell}>
          <CSSLab />
        </LabShell>
      );
    }
    if (selected.id === "js") {
      return (
        <LabShell {...shell}>
          <JavaScriptLab />
        </LabShell>
      );
    }
    if (selected.id === "project") {
      return (
        <LabShell {...shell}>
          <ProjectLab />
        </LabShell>
      );
    }
  }

  const totalXp = LABS.reduce(
    (sum, l) => sum + Math.round(((LAB_PROGRESS[l.id] || 0) / 100) * l.xpMax),
    0
  );

  return (
    <div className="space-y-5">
      {/* XP STRIP */}
      <Card className="flex flex-wrap items-center gap-5 justify-between">
        <div className="flex items-center gap-3.5">
          <span className="grid place-items-center w-11 h-11 rounded-[16px] bg-amber-soft text-amber">
            <Icon name="award" size={21} />
          </span>
          <div>
            <div className="sm-eyebrow">{tr("lab_xp")}</div>
            <p className="text-[1.3rem] font-bold leading-none mt-1">
              {totalXp.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div>
            <div className="sm-eyebrow">{tr("lab_labs")}</div>
            <p className="text-[1.3rem] font-bold leading-none mt-1">
              {LABS.length}
            </p>
          </div>
          <div>
            <div className="sm-eyebrow">{tr("lab_completed")}</div>
            <p className="text-[1.3rem] font-bold leading-none mt-1">
              {LABS.filter((l) => LAB_PROGRESS[l.id] === 100).length}
            </p>
          </div>
        </div>

        {onBack && (
          <Button variant="ghost" size="sm" icon="arrowLeft" onClick={onBack}>
            {tr("back")}
          </Button>
        )}
      </Card>

      {/* LAB GRID */}
      <div className="grid sm:grid-cols-2 gap-5">
        {LABS.map((lab) => {
          const progress = LAB_PROGRESS[lab.id] ?? 0;
          const recommended = focusSkill && lab.skill === focusSkill;
          const done = progress === 100;

          return (
            <Card key={lab.id} hover className="flex flex-col">
              <CardHeader
                icon={lab.icon}
                tone={lab.tone}
                title={lab.name}
                subtitle={tr(lab.tagline)}
                action={
                  recommended ? (
                    <Badge tone="brand" icon="sparkle">
                      {tr("lab_recommended")}
                    </Badge>
                  ) : done ? (
                    <Badge tone="sage" icon="check">
                      {tr("lab_done")}
                    </Badge>
                  ) : progress > 0 ? (
                    <Badge tone="amber">{tr("lab_in_progress")}</Badge>
                  ) : (
                    <Badge tone="neutral">{tr("lab_not_started")}</Badge>
                  )
                }
              />

              <p className="text-[0.85rem] text-ink-soft leading-relaxed mt-4 mb-4 flex-1">
                {tr(lab.description)}
              </p>

              <div className="flex items-center gap-5 mb-4 text-[0.75rem] font-bold text-ink-faint">
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="layers" size={14} />
                  {lab.levels} {tr("lab_levels")}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="star" size={13} />
                  {lab.xpMax.toLocaleString()} XP
                </span>
              </div>

              <ProgressBar
                value={progress}
                tone={lab.tone}
                size="sm"
                label={tr("lab_progress")}
                trailing={`${progress}%`}
                className="mb-4"
              />

              <Button
                full
                size="sm"
                variant={recommended ? "primary" : "secondary"}
                icon="play"
                onClick={() => setSelected(lab)}
              >
                {progress > 0 && !done ? tr("lab_continue") : tr("lab_enter")}
              </Button>
            </Card>
          );
        })}
      </div>

      <Card className="flex items-center gap-3.5">
        <span className="grid place-items-center w-11 h-11 rounded-[16px] bg-sage-soft text-sage shrink-0">
          <Icon name="book" size={21} />
        </span>
        <div className="min-w-0">
          <p className="font-bold text-[0.95rem]">{tr("lab_tip_title")}</p>
          <p className="text-[0.83rem] text-ink-soft">{tr("lab_tip_body")}</p>
        </div>
      </Card>
    </div>
  );
}
