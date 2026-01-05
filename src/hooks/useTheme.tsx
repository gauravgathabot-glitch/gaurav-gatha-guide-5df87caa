import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "military" | "ocean" | "forest" | "sunset" | "midnight";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themes: { id: Theme; name: string; colors: string }[];
}

const themes: { id: Theme; name: string; colors: string }[] = [
  { id: "military", name: "Military (Default)", colors: "Gold & Olive" },
  { id: "ocean", name: "Ocean Blue", colors: "Blue & Cyan" },
  { id: "forest", name: "Forest Green", colors: "Green & Emerald" },
  { id: "sunset", name: "Sunset Orange", colors: "Orange & Amber" },
  { id: "midnight", name: "Midnight Purple", colors: "Purple & Indigo" },
];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem("app-theme") as Theme;
    return saved || "military";
  });

  useEffect(() => {
    localStorage.setItem("app-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
