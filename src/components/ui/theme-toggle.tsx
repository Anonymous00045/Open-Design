"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark" | "system";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }

    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  if (!mounted) {
    return null;
  }

  const themes: { value: Theme; icon: React.ReactNode; label: string }[] = [
    { value: "light", icon: <Sun className="w-4 h-4" />, label: "Light" },
    { value: "dark", icon: <Moon className="w-4 h-4" />, label: "Dark" },
    { value: "system", icon: <Monitor className="w-4 h-4" />, label: "System" },
  ];

  return (
    <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
      {themes.map((themeOption) => (
        <button
          key={themeOption.value}
          onClick={() => setTheme(themeOption.value)}
          className={cn(
            "relative flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
            theme === themeOption.value
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {theme === themeOption.value && (
            <motion.div
              layoutId="theme-indicator"
              className="absolute inset-0 bg-background rounded-md shadow-sm"
              initial={false}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
              }}
            />
          )}
          <span className="relative z-10 flex items-center space-x-2">
            {themeOption.icon}
            <span className="hidden sm:inline">{themeOption.label}</span>
          </span>
        </button>
      ))}
    </div>
  );
}