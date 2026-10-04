"use client";

import { useEffect, useState } from "react";
import { applyTheme, getStoredTheme, Theme } from "@/lib/theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(getStoredTheme());
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  };

  return (
    <button
      onClick={toggle}
      className="text-sub hover:text-text transition-colors text-sm"
      title={`switch to ${theme === "dark" ? "light" : "dark"} mode`}
      aria-label="toggle theme"
    >
      {theme === "dark" ? "☀ light" : "☾ dark"}
    </button>
  );
}
