import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, getTranslation, Translations } from "@/lib/i18n";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: keyof Translations) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}

interface LanguageProviderProps {
  children: React.ReactNode;
  defaultLanguage?: Language;
  storageKey?: string;
}

export function LanguageProvider({
  children,
  defaultLanguage = "en",
  storageKey = "interview-ai-language",
}: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(storageKey) as Language | null;
      return stored || defaultLanguage;
    }
    return defaultLanguage;
  });

  // Persist to localStorage and update HTML lang attribute
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, newLanguage);
      document.documentElement.lang = newLanguage;
      document.documentElement.dir = newLanguage === "bn" ? "ltr" : "ltr"; // Both LTR for now
    }
  };

  // Set initial lang attribute
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.lang = language;
    }
  }, []);

  // Translation helper function
  const t = (key: keyof Translations): string => {
    return getTranslation(language, key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
