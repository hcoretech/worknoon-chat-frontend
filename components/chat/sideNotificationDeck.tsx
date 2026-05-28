// 📁 File: src/components/chat/sidebarNotificationDeck.tsx
'use client';

import React from 'react';
import { Bell, ShieldAlert, UserPlus, Key, MessageSquare } from 'lucide-react';

interface SidebarNotificationDeckProps {
  channels: any[];
  activeChannelId: string | null;
  onSelectChannel: (id: string) => void;
  user: any;      // Current logged-in profile context data
  adminAudits: any[] 
}

export default function SidebarNotificationDeck({
  channels,
  activeChannelId,
  onSelectChannel,
  user,
  adminAudits,
}: SidebarNotificationDeckProps) {
  
  const isUserAnAdmin = user?.role?.toLowerCase() === 'admin';

  // 👑 TEMPLATE A: EXCLUSIVE ADMINISTRATIVE SYSTEM AUDIT TRACKER
  if (isUserAnAdmin) {
    if (adminAudits.length === 0) {
      return (
        <div className="p-3 bg-zinc-900/20 border border-zinc-800/40 text-center select-none mt-auto mx-2 mb-2 rounded-2xl">
          <p className="text-[9px] font-bold text-zinc-500 flex items-center justify-center gap-1.5">
            <span>🛡️</span> Operation Log Dormant
          </p>
        </div>
      );
    }

    return (
      <div className="mt-auto mx-2 mb-3 p-3 bg-zinc-900/40 border border-zinc-800/60 rounded-2xl flex flex-col gap-2 animate-slideUp max-h-40 overflow-y-auto">
        <div className="flex items-center justify-between border-b border-zinc-800/60 pb-1.5 select-none">
          <span className="text-[9px] font-black text-rose-400 tracking-wider uppercase flex items-center gap-1">
            <ShieldAlert size={11} className="text-rose-500 animate-pulse" /> Security Audit
          </span>
          <span className="bg-rose-950 text-rose-400 border border-rose-900 text-[8px] font-black h-3.5 px-1 rounded-sm flex items-center justify-center">
            {adminAudits.length}
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          {adminAudits.map((audit, idx) => {
            const isSignUp = audit.type === 'signup';
            
            return (
              <div 
                key={idx}
                className="p-2 bg-zinc-900/60 border border-zinc-800/40 rounded-xl flex items-start gap-2 select-none"
              >
                <div className={`p-1 rounded-md mt-0.5 ${isSignUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                  {isSignUp ? <UserPlus size={10} /> : <Key size={10} />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] font-black text-zinc-200 truncate">
                    {audit.userName}
                  </p>
                  <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-wide mt-0.5">
                    {isSignUp ? `Registered as ${audit.userRole}` : 'Opened Console Session'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 👥 TEMPLATE B: USER MODE INBOUND CHAT MESSAGES DISPATCH DECK
  const unreadAlertChannels = channels.filter(
    (ch) => (ch.unreadCount || 0) > 0 && ch._id !== activeChannelId
  );

  if (unreadAlertChannels.length === 0) {
    return (
      <div className="p-3 bg-zinc-900/20 dark:bg-black/10 rounded-2xl border border-zinc-800/40 text-center select-none mt-auto mx-2 mb-2">
        <p className="text-[9px] font-bold text-zinc-500 flex items-center justify-center gap-1">
          <span>🔔</span> No Unread Dispatches
        </p>
      </div>
    );
  }

  return (
    <div className="mt-auto mx-2 mb-3 p-3 bg-zinc-900/40 dark:bg-black/20 border border-zinc-800/60 rounded-2xl flex flex-col gap-2 animate-slideUp max-h-40 overflow-y-auto">
      <div className="flex items-center justify-between border-b border-zinc-800/60 pb-1.5 select-none">
        <span className="text-[9px] font-black text-amber-400 tracking-wider uppercase flex items-center gap-1">
          <Bell size={10} className="animate-bounce" /> Live Alerts
        </span>
        <span className="bg-red-500 text-white text-[8px] font-black h-3.5 px-1 rounded-sm flex items-center justify-center">
          {unreadAlertChannels.length}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        {unreadAlertChannels.map((ch) => {
          const senderLabel = ch.recipient?.name || 'Workspace User';
          return (
            <div
              key={ch._id}
              onClick={() => onSelectChannel(ch._id)}
              className="p-2 bg-zinc-900/60 dark:bg-zinc-800/20 hover:bg-zinc-800 border border-zinc-800/40 rounded-xl cursor-pointer transition flex items-center justify-between group"
            >
              <div className="min-w-0 flex-1 pr-2">
                <p className="text-[10px] font-black text-white truncate group-hover:underline">
                  {senderLabel}
                </p>
                <p className="text-[9px] text-zinc-500 truncate font-semibold mt-0.5">
                  {ch.lastMessageText || 'Sent a transmission'}
                </p>
              </div>
              <div className="h-4 w-4 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center shrink-0 shadow-sm">
                {ch.unreadCount}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
