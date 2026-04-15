import React, { useState, useEffect, useRef } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";

const LANG_KEY = "medhahub-lang-chosen";

const LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन্দী" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
];

function getCurrentLang(): string {
  return localStorage.getItem(LANG_KEY) || "en";
}

function setGoogleTranslateLang(code: string) {
  if (code === "en") {
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=." +
      window.location.hostname;
  } else {
    const val = `/en/${code}`;
    document.cookie = `googtrans=${val}; path=/;`;
    document.cookie = `googtrans=${val}; path=/; domain=.${window.location.hostname}`;
  }
  localStorage.setItem(LANG_KEY, code);
  window.location.reload();
}

export default function LanguageToggle() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(getCurrentLang);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const activeLang = LANGUAGES.find((l) => l.code === current) || LANGUAGES[0];

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold
          bg-gradient-to-r from-indigo-500 to-purple-500 text-white
          hover:from-indigo-600 hover:to-purple-600
          shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30
          transition-all duration-200 active:scale-95"
      >
        <Globe className="h-3.5 w-3.5" />
        <span>{activeLang.native}</span>
        <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-white/10
            bg-white dark:bg-zinc-900 shadow-xl shadow-black/20
            overflow-hidden z-50"
          style={{ animation: "langDropIn 0.2s ease-out" }}
        >
          {LANGUAGES.map((lang) => {
            const isActive = lang.code === current;
            return (
              <button
                key={lang.code}
                onClick={() => {
                  if (lang.code !== current) {
                    setCurrent(lang.code);
                    setOpen(false);
                    setGoogleTranslateLang(lang.code);
                  } else {
                    setOpen(false);
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors duration-150
                  ${isActive
                    ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold"
                    : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"}
                `}
              >
                <span className="flex-1">
                  {lang.native}
                  <span className="ml-1.5 text-[10px] text-zinc-400 font-normal">
                    {lang.label !== lang.native ? lang.label : ""}
                  </span>
                </span>
                {isActive && <Check className="h-4 w-4 text-indigo-500" />}
              </button>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes langDropIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
