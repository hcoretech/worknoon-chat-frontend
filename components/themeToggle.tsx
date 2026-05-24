'use client';

import React from 'react';
import  { useTheme } from '../context/themeContext';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="p-2.5 bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 hover:bg-gray-200/70 dark:hover:bg-zinc-700/70 transition rounded-xl"
      aria-label="Toggle structural visual light dark color scheme theme profile configurations"
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
