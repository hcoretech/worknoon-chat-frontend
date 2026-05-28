
'use client';

import React from 'react';
import { MessageSquare, Shield, User, Store, Landmark } from 'lucide-react';

interface ChannelData {
  _id: string;
  type: string;
  currentStatusState: string;
  unreadCount: number;
  lastMessageText: string;
  updatedAt: string;
  initiator: { id: string; name: string };
  recipient: { id: string; name: string };
}

interface InboxProps {
  channelDataset: ChannelData[];
  activeId: string | null;
  onSelect: (channelId: string) => void;
}

export default function Inbox({ channelDataset, activeId, onSelect }: InboxProps) {
  
  const formatTimeToken = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const getRoleIconBadge = (roleType: string) => {
    switch (roleType?.toLowerCase()) {
      case 'admin':
        return <Shield size={12} className="text-rose-500" />;
      case 'agent':
        return <Landmark size={12} className="text-amber-500" />;
      case 'merchant':
        return <Store size={12} className="text-emerald-500" />;
      default:
        return <User size={12} className="text-indigo-500" />;
    }
  };

  if (!channelDataset || channelDataset.length === 0) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center h-48 select-none text-gray-400 dark:text-zinc-600 animate-fadeIn bg-white dark:bg-zinc-900">
        <MessageSquare size={20} className="opacity-30 mb-2" />
        <p className="text-[11px] font-bold tracking-tight">No Transmissions Active</p>
        <p className="text-[9px] font-medium mt-0.5 max-w-[160px] leading-relaxed">
          Select an active profile card layout from your navigation filter lists to begin.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100/50 dark:divide-zinc-800/40 w-full animate-fadeIn select-none bg-white dark:bg-zinc-900">
      {channelDataset.map((channel) => {
        const isCurrentActiveRow = activeId === channel._id;
        const channelPartnerName = channel.recipient?.name || 'Workspace Operative';
        const channelPartnerRole = channel.type || 'customer';
        const dynamicUnreadCount = channel.unreadCount || 0;

        return (
          <div
            key={channel._id}
            onClick={() => onSelect(channel._id)}
            className={`p-4 flex items-start gap-3 cursor-pointer transition-all duration-150 relative border-l-2 ${
              isCurrentActiveRow
                ? 'bg-neutral-900/5 dark:bg-black/25 border-neutral-900 dark:border-white shadow-xs'
                : 'bg-white hover:bg-gray-50/60 dark:bg-zinc-900 dark:hover:bg-zinc-800/30 border-transparent'
            }`}
          >
            {/* LEFT SIDE: VISUAL AVATAR RADIX FRAME */}
            <div className="relative shrink-0 mt-0.5">
              <div className="h-8 w-8 rounded-xl bg-[#ffed90] dark:bg-zinc-800 border border-amber-200 dark:border-zinc-700/60 text-neutral-900 dark:text-white font-black text-xs flex items-center justify-center uppercase shadow-2xs">
                {channelPartnerName.charAt(0)}
              </div>
              
              <div className="absolute -bottom-1 -right-1 bg-white dark:bg-zinc-900 p-0.5 rounded-md border border-gray-100 dark:border-zinc-800 shadow-3xs">
                {getRoleIconBadge(channelPartnerRole)}
              </div>
            </div>

            {/* CENTER/RIGHT SIDE: DATA META TEXTS MATRIX */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className={`text-xs font-black truncate leading-none transition-colors ${
                  isCurrentActiveRow ? 'text-neutral-950 dark:text-white' : 'text-gray-900 dark:text-zinc-200'
                }`}>
                  {channelPartnerName}
                </h4>
                <span className="text-[9px] font-bold text-gray-400 dark:text-zinc-500 shrink-0 uppercase tracking-tight">
                  {formatTimeToken(channel.updatedAt)}
                </span>
              </div>

              <p className={`text-[11px] truncate mt-1.5 font-medium transition-colors ${
                dynamicUnreadCount > 0 
                  ? 'text-gray-900 dark:text-white font-black' 
                  : 'text-gray-400 dark:text-zinc-400'
              }`}>
                {channel.lastMessageText || 'Stream channel initialized.'}
              </p>

              {/* FLOATING REAL-TIME COUNTER BADGE INJECTION ELEMENT */}
              {dynamicUnreadCount > 0 && (
                <div className="absolute right-4 bottom-4 h-4 min-w-[16px] bg-neutral-900 dark:bg-white text-white dark:text-black font-black text-[9px] rounded-md flex items-center justify-center px-0.5 shadow-2xs border border-white dark:border-zinc-950 animate-pulse">
                  {dynamicUnreadCount}
                </div>
              )}
            </div>

          </div>
        );
      })}
    </div>
  );
}
