"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Theme = "light" | "dark";

type ThemeProviderProps = {
  children: React.ReactNode;
  attribute?: "class";
  defaultTheme?: Theme;
};

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: Theme;
  setTheme: (theme: Theme | ((theme: Theme) => Theme)) => void;
};

const STORAGE_KEY = "theme";
const THEMES: Theme[] = ["light", "dark"];
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function isTheme(value: string | null): value is Theme {
  return value === "light" || value === "dark";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;

  root.classList.remove(...THEMES);
  root.classList.add(theme);
  root.style.colorScheme = theme;
}

export function ThemeProvider({
  children,
  defaultTheme = "light",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(STORAGE_KEY);
    const nextTheme = isTheme(storedTheme) ? storedTheme : defaultTheme;

    setThemeState(nextTheme);
    applyTheme(nextTheme);
  }, [defaultTheme]);

  const setTheme = useCallback<ThemeContextValue["setTheme"]>((value) => {
    setThemeState((currentTheme) => {
      const nextTheme = typeof value === "function" ? value(currentTheme) : value;

      window.localStorage.setItem(STORAGE_KEY, nextTheme);
      applyTheme(nextTheme);

      return nextTheme;
    });
  }, []);

  const contextValue = useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme: theme,
      setTheme,
    }),
    [setTheme, theme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
