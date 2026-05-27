'use client';

import React from 'react';
import { useTheme } from '../context/themeContext';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="p-2.5 bg-gray-50 border border-gray-100 dark:bg-zinc-800 dark:border-zinc-700/60 rounded-xl text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors inline-flex items-center justify-center focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white"
      aria-label="Toggle workspace theme look profile"
    >
      {theme === 'light' ? (
        <Moon size={16} className="transition-transform duration-200 rotate-0" />
      ) : (
        <Sun size={16} className="transition-transform duration-200 rotate-0 text-amber-400" />
      )}
    </button>
  );
}
