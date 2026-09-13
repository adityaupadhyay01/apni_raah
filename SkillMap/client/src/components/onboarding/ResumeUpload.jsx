// src/components/onboarding/ResumeUpload.jsx

import Icon from "../common/Icon";
import { useLang } from "../../context/LanguageContext";

export default function ResumeUpload({ resumeActive, handleResume }) {
  const { tr } = useLang();

  return (
    <button
      onClick={handleResume}
      className={`w-full flex items-center gap-4 p-5 rounded-[18px] border-2 border-dashed text-left
        transition-all duration-200 ${
          resumeActive
            ? "border-sage/50 bg-sage-soft"
            : "border-line hover:border-brand/40 hover:bg-brand-soft/40"
        }`}
    >
      <span
        className={`grid place-items-center w-12 h-12 rounded-[16px] shrink-0 ${
          resumeActive ? "bg-sage text-white" : "bg-canvas-deep text-ink-soft"
        }`}
      >
        <Icon name={resumeActive ? "checkCircle" : "file"} size={22} />
      </span>

      <div className="min-w-0">
        <p className="text-[0.9rem] font-bold leading-snug">
          {resumeActive ? tr("ob_resume_done") : tr("ob_resume_idle")}
        </p>
        <p className="text-[0.78rem] text-ink-faint mt-0.5">{tr("ob_resume_note")}</p>
      </div>
    </button>
  );
}
