export type Theme = "dark" | "light";

const KEY = "mammath:theme";

export function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const t = window.localStorage.getItem(KEY);
  return t === "light" ? "light" : "dark";
}

export function applyTheme(theme: Theme): void {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
  try {
    window.localStorage.setItem(KEY, theme);
  } catch {
    // ignore
  }
}

/** Inline script (runs before paint) to set the theme attribute and avoid flash. */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('${KEY}');document.documentElement.setAttribute('data-theme',t==='light'?'light':'dark');}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;
