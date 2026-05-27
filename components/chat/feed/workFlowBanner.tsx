// 📁 File: src/components/chat/feed/WorkflowBanner.tsx
'use client';

import React from 'react';
import { CheckCircle2, Truck, LifeBuoy } from 'lucide-react';

interface WorkflowBannerProps {
  activeChannel: any;
  isOnline: boolean;
  role: string;
  onToggleState: () => void;
}

export default function WorkflowBanner({ activeChannel, isOnline, role, onToggleState }: WorkflowBannerProps) {
  return (
    <div className="flex items-center justify-between bg-gray-50 dark:bg-zinc-800/30 border border-gray-100 dark:border-zinc-800/50 rounded-xl px-4 py-2.5 mb-4">
      <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 dark:text-zinc-500">
        <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-white animate-pulse"></span>
        <span>Current Status State: <strong className="text-neutral-950 dark:text-white font-black">{activeChannel?.currentStatusState || 'In Progress'}</strong></span>
      </div>
      
      <button 
        type="button"
        disabled={!isOnline}
        onClick={onToggleState} 
        className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 border border-gray-100 dark:border-zinc-800 px-3 py-1.5 rounded-xl shadow-xs transition-colors hover:bg-gray-50 disabled:opacity-40"
      >
        {role === 'designer' && <CheckCircle2 size={12} className="text-purple-500" />}
        {role === 'merchant' && <Truck size={12} className="text-emerald-500" />}
        {role === 'agent' && <LifeBuoy size={12} className="text-amber-500" />}
        <span>{activeChannel?.actionButtonLabel || 'Process Status Update'}</span>
      </button>
    </div>
  );
}
