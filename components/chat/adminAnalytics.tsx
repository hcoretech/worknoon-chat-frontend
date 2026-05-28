
'use client';

import React from 'react';

interface AdminAnalyticsProps {
  directoryLength: number;
  channelsLength: number;
}

export default function AdminAnalytics({ directoryLength, channelsLength }: AdminAnalyticsProps) {
  return (
    <div className="grid grid-cols-3 gap-4 p-6 pb-2 shrink-0 select-none animate-slideDown">
      {/* Telemetry Hub */}
      <div className="p-3.5 bg-white/5 dark:bg-black/20 border border-black/5 dark:border-white/5 rounded-2xl flex flex-col">
        <span className="text-[9px] font-black tracking-wider uppercase text-gray-400 dark:text-zinc-500">System Telemetry</span>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-base font-black">Online</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
      </div>

      {/* Directory Count */}
      <div className="p-3.5 bg-white/5 dark:bg-black/20 border border-black/5 dark:border-white/5 rounded-2xl flex flex-col">
        <span className="text-[9px] font-black tracking-wider uppercase text-gray-400 dark:text-zinc-500">Total Directory Users</span>
        <span className="text-base font-black mt-1">
          {directoryLength} <span className="text-[9px] font-bold text-gray-400">profiles</span>
        </span>
      </div>

      {/* Channel Monitored Count */}
      <div className="p-3.5 bg-white/5 dark:bg-black/20 border border-black/5 dark:border-white/5 rounded-2xl flex flex-col">
        <span className="text-[9px] font-black tracking-wider uppercase text-gray-400 dark:text-zinc-500">Monitored Channels</span>
        <span className="text-base font-black mt-1">
          {channelsLength} <span className="text-[9px] font-bold text-gray-400">active</span>
        </span>
      </div>
    </div>
  );
}
