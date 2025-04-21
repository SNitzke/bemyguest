
import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "es";

type TranslationMap = {
  [key: string]: {
    en: string;
    es: string;
  }
};

const translations: TranslationMap = {
  accountSettings: {
    en: "Account Settings",
    es: "Configuración de la Cuenta"
  },
  managePreferences: {
    en: "Manage your account preferences and property settings",
    es: "Administra tus preferencias de cuenta y la configuración de propiedades"
  },
  // Expand this with more keys as you internationalize
};

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: keyof typeof translations): string => {
    return translations[key]?.[language] || String(key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
};
