// 📁 File: src/components/profileModel.tsx
'use client';

import React from 'react';
import { X, Mail, Shield, LogOut } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  isDark: boolean;
  onLogout: () => void;
}

export default function ProfileModal({ isOpen, onClose, user, isDark, onLogout }: ProfileModalProps) {
  if (!isOpen || !user) return null;

  // 🚀 FIXED FALLBACK: Safely resolve both 'name' and 'fullName' object properties from server records
  const displayProfileName = user.name || user.fullName || 'Workspace Profile';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dimmed Backdrop Mask */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
      />

      {/* Main Profile Canvas Box */}
      <div className={`w-full max-w-sm rounded-[24px] border p-6 shadow-2xl relative transform transition-all duration-300 animate-fadeIn ${
        isDark 
          ? 'bg-[#1a252e] border-zinc-800 text-gray-100' 
          : 'bg-white border-gray-100 text-gray-900'
      }`}>
        
        {/* Close Toggle Target */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors focus:outline-none"
        >
          <X size={16} />
        </button>

        {/* Big Initial Identity Avatar Header */}
        <div className="text-center pb-5 border-b border-gray-100 dark:border-zinc-800/60 select-none">
          <div className="h-16 w-16 rounded-2xl bg-neutral-900 text-white dark:bg-white dark:text-black mx-auto flex items-center justify-center font-black text-xl uppercase shadow-md mb-3">
            {displayProfileName.charAt(0)}
          </div>
          <h2 className="text-sm font-black tracking-tight">{displayProfileName}</h2>
          
          {/* Role Badges Layer Matrix */}
          <span className={`mt-1.5 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border inline-block ${
            user.role === 'admin' ? 'bg-red-50 border-red-100 text-red-600 dark:bg-red-950/20 dark:border-red-900/30'
              : user.role === 'merchant' ? 'bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900/30'
              : user.role === 'agent' ? 'bg-amber-50 border-amber-100 text-amber-600 dark:bg-amber-950/20 dark:border-amber-900/30'
              : user.role === 'designer' ? 'bg-purple-50 border-purple-100 text-purple-600 dark:bg-purple-950/20 dark:border-purple-900/30'
              : 'bg-blue-50 border-blue-100 text-blue-600 dark:bg-blue-950/20 dark:border-blue-900/30'
          }`}>
            {user.role || 'user'}
          </span>
        </div>

        {/* Account Details Metadata Roster */}
        <div className="py-5 space-y-3.5">
          <div className="flex items-center gap-3 text-xs font-semibold">
            <Mail size={14} className="text-gray-400 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] text-gray-400 font-medium leading-none">Electronic Mail</p>
              <p className="truncate mt-1 text-gray-700 dark:text-zinc-200">{user.email || 'N/A'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold">
            <Shield size={14} className="text-gray-400 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] text-gray-400 font-medium leading-none">Account Context ID</p>
              <p className="truncate font-mono mt-1 text-gray-600 dark:text-zinc-400 text-[11px]">#{user.id || user._id || 'unknown'}</p>
            </div>
          </div>
        </div>

        {/* Bottom Auxiliary Exit Station Trigger Button */}
        <button
          onClick={() => { onLogout(); onClose(); }}
          type="button"
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white transition-all text-xs font-bold shadow-2xs focus:outline-none group mt-2"
        >
          <LogOut size={14} className="transition-transform group-hover:translate-x-0.5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
