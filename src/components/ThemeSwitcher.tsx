// src/components/ThemeSwitcher.tsx

"use client";

import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { name: 'light', icon: Sun, label: 'Light Mode' },
    { name: 'dark', icon: Moon, label: 'Dark Mode' },
    { name: 'system', icon: Monitor, label: 'System Default' },
  ];

  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-full border dark:border-gray-700">
      {themes.map((t) => {
        const Icon = t.icon;
        return (
          <Button
            key={t.name}
            variant="ghost"
            size="icon"
            className={cn(
              "rounded-full h-9 w-9 transition-all",
              theme === t.name 
                ? "bg-white text-blue-600 shadow-sm dark:bg-gray-700 dark:text-white" 
                : "text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700/50"
            )}
            onClick={() => setTheme(t.name)}
            aria-label={`Switch to ${t.name} theme`}
          >
            <Icon className="h-5 w-5" />
          </Button>
        );
      })}
    </div>
  );
};
