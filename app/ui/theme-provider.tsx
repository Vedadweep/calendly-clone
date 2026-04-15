"use client";

type Theme = "dark";

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useTheme() {
  return {
    theme: "dark" as const,
    resolvedTheme: "dark" as const,
    setTheme: () => undefined,
    toggleTheme: () => undefined,
  } satisfies ThemeContextValue;
}
