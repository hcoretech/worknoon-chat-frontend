// 📁 File: src/components/layout/Navbar.tsx
'use client';

import React from 'react';
import { Sun, Moon, Bell, Settings } from 'lucide-react';

interface NavbarProps {
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
  user: any;
}

export default function Navbar({ isDark, setIsDark, user }: NavbarProps) {
  return (
    <header className="w-full h-14 bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 px-6 flex items-center justify-between select-none shrink-0 z-40 transition-colors duration-200">
      
      {/* LEFT SECTION: BRANDING LOGO */}
      <div className="flex items-center gap-2.5">
        <div className="h-8 w-8 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-lg flex items-center justify-center font-black text-sm shadow-xs">
          W
        </div>
        <span className="text-sm font-black tracking-tight text-gray-900 dark:text-white">
          Worknoon
        </span>
      </div>

      {/* RIGHT SECTION: UTILITY UTILITIES & SIDE-BY-SIDE ACCOUNT PROFILE GROUP */}
      <div className="flex items-center gap-4">
        
        {/* Baseline Utility System Tools */}
        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg text-gray-400 hover:text-gray-700 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors">
            <Bell size={15} />
          </button>
          <button className="p-2 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg text-gray-400 hover:text-gray-700 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors">
            <Settings size={15} />
          </button>
        </div>

        {/* Separator Accent Line */}
        <div className="w-px h-4 bg-gray-200 dark:bg-zinc-700" />

        {/* 🚀 CLOSELY GROUPED ACCOUNT COMBINATION CONTAINER */}
        <div className="flex items-center gap-2.5 bg-gray-50/80 dark:bg-zinc-800/40 p-1 pr-2.5 rounded-full border border-gray-100 dark:border-zinc-800/80 shadow-2xs">
          
          {/* Quick User Identity Avatar */}
          {user ? (
            <div className="h-7 w-7 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-black text-[10px] flex items-center justify-center uppercase shadow-sm shrink-0 select-none">
              {(user.name || 'U').charAt(0)}
            </div>
          ) : (
            <div className="h-7 w-7 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse shrink-0" />
          )}

          {/* 🌓 BACKGROUND MODE TOGGLE LINK BUTTON */}
          <button
            type="button"
            onClick={() => setIsDark(!isDark)}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-bold text-gray-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-800 hover:shadow-xs transition-all"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? (
              <>
                <Sun size={12} className="text-amber-500" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon size={12} className="text-indigo-500 dark:text-indigo-400" />
                <span>Dark</span>
              </>
            )}
          </button>
        </div>

      </div>
    </header>
  );
}
