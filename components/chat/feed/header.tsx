// 📁 File: src/components/chat/feed/ChatHeader.tsx
'use client';

import React from 'react';

interface ChatHeaderProps {
  partnerProfile: any;
  role: string;
}

export default function ChatHeader({ partnerProfile, role }: ChatHeaderProps) {
  return (
    <div className="h-20 bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800/60 px-8 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-gray-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-xs capitalize text-neutral-900 dark:text-white">
          {role.charAt(0)}
        </div>
        <div>
          <h3 className="text-xs font-black text-gray-900 dark:text-white tracking-tight">
            {partnerProfile?.profile?.displayName || partnerProfile?.name || 'Workspace Session'}
          </h3>
          <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-medium">
            Account Access Profile: <span className="capitalize font-bold text-gray-600 dark:text-zinc-400">{role}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
