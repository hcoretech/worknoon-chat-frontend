'use client';

import React from 'react';
import { useAuth } from '../../context/authContext';
import { Shield, Store, UserSquare, MessageSquare } from 'lucide-react';

interface InboxProps {
  channelDataset: any[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

export default function Inbox({ channelDataset, activeId, onSelect }: InboxProps) {
  const { user } = useAuth();

  if (channelDataset.length === 0) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center gap-2 h-40">
        <MessageSquare size={20} className="text-gray-300 dark:text-zinc-700" />
        <p className="text-xs text-gray-400 dark:text-zinc-500 font-medium">No operational streams available.</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-1">
      {channelDataset.map((channel) => {
        // Safe check to determine who the workspace conversation partner is
        const isInitiator = user ? channel.initiator.id === user.id : true;
        const partner = isInitiator ? channel.recipient : channel.initiator;
        const role = partner.role;
        const isActive = activeId === channel._id;
        
        // Read unread counter flag properties directly from your schema
        const unreadCount = channel.unreadCount || 0;

        return (
          <button
            key={channel._id}
            onClick={() => onSelect(channel._id)}
            className={`w-full text-left p-3.5 rounded-2xl transition-all border flex gap-3 relative group/item ${
              isActive
                ? 'bg-neutral-900 border-neutral-950 text-white dark:bg-white dark:border-white dark:text-black shadow-sm shadow-neutral-950/10'
                : 'bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800/40 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800/20'
            }`}
          >
            {/* Minimalist Profile Avatar Initial */}
            <div className={`h-9 w-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 border ${
              isActive 
                ? 'bg-white/10 border-white/10 text-white dark:bg-black/5 dark:border-black/5 dark:text-black' 
                : 'bg-gray-50 dark:bg-zinc-800 border-gray-100 dark:border-zinc-700/60 text-gray-800 dark:text-zinc-200'
            }`}>
              {(partner.profile?.displayName || partner.name || 'W').charAt(0).toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5 gap-2">
                <h4 className={`text-xs font-bold truncate ${isActive ? 'text-white dark:text-black' : 'text-gray-900 dark:text-white'}`}>
                  {partner.profile?.displayName || partner.name || 'Anonymous User'}
                </h4>
                
                {/* 🟢 DYNAMIC UNREAD MESSAGE NOTIFICATION COUNTER */}
                {!isActive && unreadCount > 0 && (
                  <span className="h-5 min-w-[20px] px-1 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white dark:text-white text-[10px] font-black tracking-tight inline-flex items-center justify-center shrink-0 shadow-xs animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </div>
              
              <p className={`text-[11px] truncate mb-2 ${isActive ? 'text-gray-300 dark:text-zinc-500' : 'text-gray-400 dark:text-zinc-500'}`}>
                {channel.lastMessageText || 'Communication link secured.'}
              </p>

              {/* Dynamic Role Badging Grid */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className={`text-[9px] font-extrabold tracking-wide uppercase px-2 py-0.5 rounded border inline-flex items-center gap-1 ${
                    isActive
                      ? 'bg-white/10 border-white/5 text-white dark:bg-black/5 dark:border-black/5 dark:text-black'
                      : role === 'merchant'
                      ? 'bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-400'
                      : role === 'agent'
                      ? 'bg-amber-50 border-amber-100 text-amber-600 dark:bg-amber-950/20 dark:border-amber-900/30 dark:text-amber-400'
                      : 'bg-purple-50 border-purple-100 text-purple-600 dark:bg-purple-950/20 dark:border-purple-900/30 dark:text-purple-400'
                  }`}>
                    {role === 'merchant' && <Store size={10} />}
                    {role === 'agent' && <Shield size={10} />}
                    {role === 'customer' && <UserSquare size={10} />}
                    <span>{role}</span>
                  </span>
                  
                  {channel.associatedOrderId && (
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                      isActive ? 'border-white/10 text-white/70' : 'border-gray-100 dark:border-zinc-800 text-gray-400'
                    }`}>
                      {channel.associatedOrderId}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
