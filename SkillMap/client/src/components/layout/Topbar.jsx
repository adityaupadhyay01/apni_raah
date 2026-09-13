import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Icon from "../common/Icon";
import { IconButton } from "../common/Button";
import { useLang } from "../../context/LanguageContext";
import { useProfile } from "../../context/ProfileContext";
import { ALL_LANGUAGES } from "../../utils/i18n";
import { clearSession } from "../../services/authService";
import { BrandLockup } from "../common/Logo";

/**
 * LanguageSwitch — globe button + dropdown listing the major Indian languages.
 * English and Hindi are live; the rest are shown as "coming soon".
 */
export function LanguageSwitch({ compact = false, align = "right" }) {
  const { lang, setLang, tr } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onEsc = (e) => e.key === "Escape" && setOpen(false);

    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  const current =
    ALL_LANGUAGES.find((l) => l.code === lang) || ALL_LANGUAGES[0];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={tr("nav_language")}
        className={`inline-flex items-center gap-2 rounded-[14px] border bg-surface
          text-[0.8rem] font-bold transition-all duration-150
          ${compact ? "px-2.5 py-1.5" : "px-3 py-2"}
          ${
            open
              ? "border-brand/40 text-brand"
              : "border-line text-ink-soft hover:text-ink hover:border-ink-faint/45"
          }`}
      >
        <Icon name="globe" size={16} />
        <span className={compact ? "" : "hidden sm:inline"}>{current.native}</span>
        {!compact && <span className="sm:hidden">{current.short}</span>}
        <Icon name="chevronDown" size={14} className="text-ink-faint" />
      </button>

      {open && (
        <div
          role="listbox"
          className={`absolute z-50 mt-2 w-64 sm-card p-1.5 max-h-80 overflow-y-auto
            ${align === "left" ? "left-0" : "right-0"}`}
        >
          <p className="sm-eyebrow px-3 pt-2 pb-2">{tr("lang_choose")}</p>

          {ALL_LANGUAGES.map((l) => {
            const active = l.code === lang;

            return (
              <button
                key={l.code}
                role="option"
                aria-selected={active}
                disabled={!l.supported}
                onClick={() => {
                  if (!l.supported) return;
                  setLang(l.code);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors
                  ${
                    active
                      ? "bg-brand-soft text-brand"
                      : l.supported
                      ? "text-ink-soft hover:text-ink hover:bg-canvas-deep"
                      : "text-ink-faint cursor-not-allowed"
                  }`}
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.85rem] font-bold truncate">
                    {l.native}
                  </span>
                  <span className="block text-[0.7rem] text-ink-faint truncate">
                    {l.english}
                  </span>
                </span>

                {active ? (
                  <Icon name="check" size={15} strokeWidth={3} />
                ) : !l.supported ? (
                  <span className="shrink-0 px-2 py-0.5 rounded-full bg-canvas-deep border border-line text-[0.6rem] font-bold uppercase tracking-wide text-ink-faint">
                    {tr("lang_soon")}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Topbar({ onOpenNav }) {
  const navigate = useNavigate();
  const { tr } = useLang();
  const { profile } = useProfile();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const initial = (profile.name || "S").trim().charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 bg-canvas/85 backdrop-blur-xl border-b border-line">
      <div className="flex items-center gap-3 px-4 sm:px-7 h-16">
        {/* nav trigger — the sidebar lives behind this at every size */}
        <IconButton icon="menu" label={tr("nav_open")} onClick={onOpenNav} />

        <BrandLockup
          size={36}
          onClick={() => navigate("/dashboard")}
          className="hidden sm:flex mr-1"
        />

        {/* search — too cramped to be usable on phones, so it starts at sm */}
        <div className="relative hidden sm:block flex-1 max-w-md">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint pointer-events-none">
            <Icon name="search" size={17} />
          </span>
          <input
            type="search"
            placeholder={tr("top_search")}
            className="w-full pl-10 pr-4 py-2.5 rounded-[14px] bg-surface border border-line
              text-[0.85rem] placeholder:text-ink-faint outline-none transition-all duration-150
              focus:border-brand/40 focus:ring-4 focus:ring-brand/8"
          />
        </div>

        <div className="flex-1" />

        <span className="hidden sm:block">
          <LanguageSwitch />
        </span>
        <span className="sm:hidden">
          <LanguageSwitch compact />
        </span>

        <IconButton icon="bell" label={tr("top_notifications")} className="relative">
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose" />
        </IconButton>

        {/* profile */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2.5 pl-1.5 pr-2.5 py-1.5 rounded-[14px] border border-line bg-surface
              hover:border-ink-faint/45 transition-colors"
          >
            <span className="grid place-items-center w-7 h-7 rounded-[10px] bg-brand text-white text-[0.8rem] font-bold">
              {initial}
            </span>
            <span className="hidden md:block text-[0.82rem] font-bold max-w-28 truncate">
              {profile.name}
            </span>
            <Icon name="chevronDown" size={15} className="text-ink-faint" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 sm-card p-1.5 z-40">
              <div className="px-3 py-2.5 mb-1 rounded-xl bg-surface-muted">
                <p className="text-[0.85rem] font-bold truncate">{profile.name}</p>
                <p className="text-[0.72rem] text-ink-faint truncate">
                  {profile.careerGoalLabel}
                </p>
              </div>

              {[
                { icon: "user", label: tr("nav_profile"), to: "/profile" },
                { icon: "trending", label: tr("nav_progress"), to: "/progress" },
                { icon: "file", label: tr("nav_resume"), to: "/resume" },
              ].map((item) => (
                <button
                  key={item.to}
                  onClick={() => {
                    setMenuOpen(false);
                    navigate(item.to);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[0.84rem] font-semibold
                    text-ink-soft hover:text-ink hover:bg-canvas-deep transition-colors"
                >
                  <Icon name={item.icon} size={17} />
                  {item.label}
                </button>
              ))}

              <div className="sm-hairline my-1.5" />

              <button
                onClick={() => {
                  clearSession();
                  setMenuOpen(false);
                  navigate("/login");
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[0.84rem] font-semibold
                  text-rose hover:bg-rose-soft transition-colors"
              >
                <Icon name="logout" size={17} />
                {tr("nav_logout")}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
