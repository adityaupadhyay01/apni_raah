/* eslint-disable react-refresh/only-export-components --
   the provider and its useLang() hook intentionally live together */
import { createContext, useContext, useEffect, useState } from "react";
import {
  DEFAULT_LANG,
  LANGUAGES,
  t,
  tLevel,
  tPriority,
  tRole,
  tSkill,
  tSkillDesc,
} from "../utils/i18n";

const LanguageContext = createContext(null);

const STORAGE_KEY = "skillmap_lang";

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved && LANGUAGES[saved] ? saved : DEFAULT_LANG;
    } catch {
      return DEFAULT_LANG;
    }
  });

  // persist + keep <html lang> honest for screen readers
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* storage blocked — language still works for this session */
    }
    document.documentElement.lang = lang;
  }, [lang]);

  const value = {
    lang,
    setLang,
    // bound helpers so components just call tr("key")
    tr: (key, vars) => t(lang, key, vars),
    trRole: (role) => tRole(lang, role),
    trSkill: (skill) => tSkill(lang, skill),
    trSkillDesc: (skill) => tSkillDesc(lang, skill),
    trLevel: (level) => tLevel(lang, level),
    trPriority: (priority) => tPriority(lang, priority),
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);

  // Safe fallback so a component rendered outside the provider never crashes
  if (!ctx) {
    return {
      lang: DEFAULT_LANG,
      setLang: () => {},
      tr: (key, vars) => t(DEFAULT_LANG, key, vars),
      trRole: (role) => tRole(DEFAULT_LANG, role),
      trSkill: (skill) => tSkill(DEFAULT_LANG, skill),
      trSkillDesc: (skill) => tSkillDesc(DEFAULT_LANG, skill),
      trLevel: (level) => tLevel(DEFAULT_LANG, level),
      trPriority: (priority) => tPriority(DEFAULT_LANG, priority),
    };
  }

  return ctx;
}

export default LanguageContext;
