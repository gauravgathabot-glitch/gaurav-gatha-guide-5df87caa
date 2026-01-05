import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "en" | "hi" | "ur";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  languages: { id: Language; name: string; native: string }[];
  t: (key: string) => string;
}

const languages: { id: Language; name: string; native: string }[] = [
  { id: "en", name: "English", native: "English" },
  { id: "hi", name: "Hindi", native: "हिंदी" },
  { id: "ur", name: "Urdu", native: "اردو" },
];

const translations: Record<Language, Record<string, string>> = {
  en: {
    welcome: "Welcome to Gaurav Gatha",
    helpMessage: "How can I help you today?",
    typePlaceholder: "Start typing... (Likhna shuru karein)",
    loginRequired: "Login Required",
    pleaseLogin: "Please login to use this feature",
    newChat: "New Chat",
    chatHistory: "Chat History",
    theme: "Theme",
    language: "Language",
    settings: "Settings",
    signIn: "Sign In",
    signUp: "Sign Up",
    signOut: "Sign Out",
    adminSettings: "Admin Settings",
    suggestions: "Suggestions",
  },
  hi: {
    welcome: "गौरव गाथा में आपका स्वागत है",
    helpMessage: "आज मैं आपकी कैसे मदद कर सकता हूं?",
    typePlaceholder: "लिखना शुरू करें...",
    loginRequired: "लॉगिन आवश्यक",
    pleaseLogin: "इस सुविधा का उपयोग करने के लिए कृपया लॉगिन करें",
    newChat: "नई चैट",
    chatHistory: "चैट इतिहास",
    theme: "थीम",
    language: "भाषा",
    settings: "सेटिंग्स",
    signIn: "साइन इन",
    signUp: "साइन अप",
    signOut: "साइन आउट",
    adminSettings: "एडमिन सेटिंग्स",
    suggestions: "सुझाव",
  },
  ur: {
    welcome: "گوراو گاتھا میں خوش آمدید",
    helpMessage: "آج میں آپ کی کیسے مدد کر سکتا ہوں؟",
    typePlaceholder: "لکھنا شروع کریں...",
    loginRequired: "لاگ ان ضروری ہے",
    pleaseLogin: "اس فیچر کو استعمال کرنے کے لیے لاگ ان کریں",
    newChat: "نئی چیٹ",
    chatHistory: "چیٹ ہسٹری",
    theme: "تھیم",
    language: "زبان",
    settings: "سیٹنگز",
    signIn: "سائن ان",
    signUp: "سائن اپ",
    signOut: "سائن آؤٹ",
    adminSettings: "ایڈمن سیٹنگز",
    suggestions: "تجاویز",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("app-language") as Language;
    return saved || "en";
  });

  useEffect(() => {
    localStorage.setItem("app-language", language);
    document.documentElement.setAttribute("data-lang", language);
  }, [language]);

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, languages, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};
