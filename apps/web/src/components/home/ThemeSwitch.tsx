"use client";

import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

import { useTheme } from "@/components/theme/ThemeProvider";

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <Button
        isIconOnly         className="group relative flex items-center justify-center bg-surface-secondary/70 dark:bg-surface/70 backdrop-blur-md rounded-full w-11 h-11 border border-surface-tertiary/50 shadow-[0_4px_14px_rgba(0,0,0,0.06)] dark:shadow-[0_6px_20px_rgba(0,0,0,0.25)] transition-all duration-200 hover:border-accent/30 hover:shadow-[0_6px_18px_rgba(0,0,0,0.10)] dark:hover:shadow-[0_8px_26px_rgba(0,0,0,0.32)]"
        onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {/* subtle inner ring for cohesion */}
        <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/5 dark:ring-white/10" />
        <Icon
          className="w-5 h-5 text-muted transition-transform duration-200 group-hover:rotate-180 group-hover:text-accent"
          icon={theme === "dark" ? "solar:sun-bold" : "solar:moon-bold"}
        />
        {/* soft drop highlight for depth on light bg */}
        <span className="pointer-events-none absolute -z-10 inset-0 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-none" />
      </Button>
    </div>
  );
}
