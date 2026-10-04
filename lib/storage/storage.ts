const NS = "mammath:";

/** Thin typed wrapper over localStorage. Single seam for future cloud sync. */
export function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(NS + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function save<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(NS + key, JSON.stringify(value));
  } catch {
    // ignore quota / serialization errors
  }
}

export const STORAGE_KEYS = {
  settings: "settings",
  history: "history",
  personalBests: "personalBests",
  streak: "streak",
  theme: "theme",
} as const;
