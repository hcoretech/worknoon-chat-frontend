// 📁 File: src/components/chat/feed/sideBar.tsx
'use client';

import React from 'react';
import { Layers, Shield, Store, Palette, LogOut, X } from 'lucide-react';

interface SidebarProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  isOnline: boolean;
  onLogout: () => void;
  onCloseMobile?: () => void; // 🚀 FIX: Made explicitly optional to support multi-device grids safely
  isDark: boolean;
  user: any; 
}

export default function Sidebar({
  activeFilter,
  setActiveFilter,
  isOnline,
  onLogout,
  onCloseMobile, // 🚀 Destructured natively
  isDark,
  user 
}: SidebarProps) {
  return (
    <aside className={`w-full h-full p-6 flex flex-col justify-between select-none border-r transition-colors duration-300 ${
      isDark 
        ? 'bg-[#1a252e] border-zinc-800/60 text-zinc-400' 
        : 'bg-white border-gray-100 text-gray-500'
    }`}>
      <div className="space-y-8">
        {/* Brand Vector Identity Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`h-9 w-9 rounded-xl flex items-center justify-center font-black text-lg shadow-xs transition-colors ${
              isDark ? 'bg-white text-black' : 'bg-neutral-950 text-white'
            }`}>
              W
            </div>
            <span className={`text-base font-black tracking-tight transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Worknoon
            </span>
          </div>
          <button 
            onClick={() => onCloseMobile?.()} // 🚀 FIX: Defensive chaining protection
            className={`md:hidden p-1 rounded-lg transition-colors ${isDark ? 'hover:bg-zinc-800 text-zinc-500 hover:text-white' : 'hover:bg-gray-100 text-gray-400 hover:text-gray-900'}`}
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Filter Context Slots */}
        <div>
          <nav className="space-y-1">
            <FilterNavButton 
              label="All Streams" 
              icon={<Layers size={15} />} 
              active={activeFilter === 'all'} 
              onClick={() => { setActiveFilter('all'); onCloseMobile?.(); }} // 🚀 FIX: Chains optionally
              isDark={isDark}
            />
            <FilterNavButton 
              label="Agent Queues" 
              icon={<Shield size={15} />} 
              active={activeFilter === 'agent'} 
              onClick={() => { setActiveFilter('agent'); onCloseMobile?.(); }} // 🚀 FIX: Chains optionally
              colorClass="text-amber-500 dark:text-amber-400" 
              isDark={isDark}
            />
            <FilterNavButton 
              label="Merchant Desks" 
              icon={<Store size={15} />} 
              active={activeFilter === 'merchant'} 
              onClick={() => { setActiveFilter('merchant'); onCloseMobile?.(); }} // 🚀 FIX: Chains optionally
              colorClass="text-emerald-500 dark:text-emerald-400" 
              isDark={isDark}
            />
            <FilterNavButton 
              label="Designer Pods" 
              icon={<Palette size={15} />} 
              active={activeFilter === 'designer'} 
              onClick={() => { setActiveFilter('designer'); onCloseMobile?.(); }} // 🚀 FIX: Chains optionally
              colorClass="text-purple-500 dark:text-purple-400" 
              isDark={isDark}
            />
          </nav>
        </div>
      </div>

      {/* Foot Diagnostic Action Cluster */}
      <div className={`space-y-4 pt-4 border-t ${isDark ? 'border-zinc-800/60' : 'border-gray-100'}`}>
        {user ? (
          <div className={`flex items-center gap-3 p-2.5 rounded-xl border transition-colors ${
            isDark ? 'bg-zinc-800/20 border-zinc-800/40' : 'bg-gray-50/50 border-gray-100/60'
          }`}>
            <div className={`h-8 w-8 rounded-lg font-black text-xs flex items-center justify-center uppercase shrink-0 transition-colors ${
              isDark ? 'bg-zinc-800 border border-zinc-700 text-white' : 'bg-neutral-900 text-white'
            }`}>
              {(user.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className={`text-xs font-bold truncate transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {user.name || 'Workspace User'}
              </p>
              <p className={`text-[10px] truncate font-black uppercase tracking-wider ${
                user.role === 'admin' ? 'text-red-500'
                  : user.role === 'merchant' ? 'text-emerald-500'
                  : user.role === 'agent' ? 'text-amber-500'
                  : user.role === 'designer' ? 'text-purple-500'
                  : 'text-blue-500'
              }`}>
                {user.role || 'Participant'}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-2 text-center text-[10px] text-gray-400 animate-pulse">
            Syncing workspace token credentials...
          </div>
        )}

        {/* WebSocket Status Pill */}
        <div className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-semibold transition-all ${
          isOnline 
            ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
            : 'bg-amber-500/5 border-amber-500/10 text-amber-600 dark:text-amber-400 animate-pulse'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
          <span>{isOnline ? 'active' : 'offline'}</span>
        </div>

        <button 
          onClick={onLogout}
          type="button"
          className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-zinc-500 hover:text-red-500 dark:hover:text-red-400 rounded-xl transition-colors group focus:outline-none"
        >
          <LogOut size={15} className="text-zinc-400 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

interface NavBtnProps { 
  label: string; 
  icon: React.ReactNode; 
  active: boolean; 
  onClick: () => void; 
  colorClass?: string; 
  isDark: boolean; 
}

function FilterNavButton({ label, icon, active, onClick, colorClass = "text-zinc-500", isDark }: NavBtnProps) {
  return (
    <button 
      onClick={onClick} 
      type="button"
      className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded-xl transition-all border ${
        active 
          ? isDark
            ? 'bg-white text-black border-white shadow-xs' 
            : 'bg-neutral-900 text-white border-neutral-950 shadow-xs'
          : isDark
            ? 'bg-transparent border-transparent text-zinc-400 hover:bg-zinc-800/40'
            : 'bg-transparent border-transparent text-gray-500 hover:bg-gray-100/60'
      }`}
    >
      <span className={active ? 'text-inherit' : colorClass}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}
