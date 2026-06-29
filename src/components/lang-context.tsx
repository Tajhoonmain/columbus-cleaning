"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { dict, type Lang } from "@/lib/i18n";

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (key: string) => string };
const LangContext = createContext<Ctx | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  // Initialize from localStorage / browser on mount (client only).
  useEffect(() => {
    let initial: Lang = "en";
    try {
      const saved = localStorage.getItem("lang") as Lang | null;
      if (saved === "en" || saved === "es") initial = saved;
      else if ((navigator.language || "").toLowerCase().startsWith("es")) initial = "es";
    } catch {}
    setLangState(initial);
  }, []);

  // Sync <html lang>, document.title and meta description whenever lang changes.
  useEffect(() => {
    const d = dict[lang];
    document.documentElement.lang = lang;
    if (d["meta.title"]) document.title = d["meta.title"];
    const md = document.querySelector('meta[name="description"]');
    if (md && d["meta.desc"]) md.setAttribute("content", d["meta.desc"]);
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("lang", l); } catch {}
  }, []);

  const t = useCallback((key: string) => dict[lang][key] ?? dict.en[key] ?? key, [lang]);

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export function useT() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useT must be used within LangProvider");
  return ctx;
}
