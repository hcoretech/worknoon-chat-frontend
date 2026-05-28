// 📁 File: src/components/chat/DirectoryTable.tsx
'use client';

import React from 'react';
import { Search, RefreshCw, Users, MessageSquare, WifiOff, UserMinus } from 'lucide-react';

interface DirectoryTableProps {
  isOnline: boolean; 
  isLoading: boolean;
  filteredUsers: any[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  onStartChat: (id: string, role: string) => void;
  channels: any[];
  isAdmin: boolean; // 🚀 NEW: Extracted administrative role tracking flag
  onAdminDeleteUser: (id: string) => void; // 🚀 NEW: User deletion execution callback
}

export default function DirectoryTable({
  isOnline,
  isLoading,
  filteredUsers,
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
  onStartChat,
  channels,
  isAdmin,
  onAdminDeleteUser
}: DirectoryTableProps) {

  if (!isOnline) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center p-6 text-center select-none animate-fadeIn bg-transparent">
        <div className="p-4 rounded-full bg-red-500/10 text-red-500 dark:text-red-400 animate-pulse mb-3">
          <WifiOff size={24} />
        </div>
        <h3 className="text-sm font-black text-gray-900 dark:text-white tracking-tight">Connection Link Severed</h3>
        <p className="text-[11px] text-gray-400 dark:text-zinc-500 max-w-[240px] mt-1 font-medium leading-relaxed">
          The local interface is decoupled from system servers. Reconnect your network architecture to fetch company records.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 overflow-hidden h-full w-full bg-transparent">
      {/* Search Input Bar & Dropdown Select Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3 shrink-0">
        <h1 className="text-base md:text-lg font-black tracking-tight text-neutral-900 dark:text-white">Worknoon Members</h1>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-48 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-2.5 py-1.5 flex items-center shadow-2xs">
            <Search size={13} className="text-gray-400 dark:text-zinc-500 mr-2" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter name..."
              className="w-full text-xs font-semibold focus:outline-none bg-transparent text-gray-800 dark:text-zinc-100 placeholder-gray-400"
            />
          </div>

          <select 
            value={activeFilter} 
            onChange={(e) => setActiveFilter(e.target.value)}
            className="bg-white border border-gray-200 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 rounded-xl px-2.5 py-1.5 text-xs font-bold text-gray-700 cursor-pointer shadow-2xs outline-none"
          >
            <option value="all">All Profiles</option>
            <option value="agent">Agents</option>
            <option value="merchant">Merchants</option>
            <option value="designer">Designers</option>
            <option value="customer">Customers</option>
          </select>
        </div>
      </div>

      {/* Responsive Member Table */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-2xs overflow-x-auto">
        
        {isLoading ? (
          <div className="h-full w-full flex flex-col items-center justify-center gap-2 text-gray-400 dark:text-zinc-500">
            <RefreshCw size={16} className="animate-spin text-neutral-950 dark:text-white" />
            <span className="text-xs font-medium">Hydrating Members...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="h-full w-full flex flex-col items-center justify-center text-gray-400 dark:text-zinc-500 text-xs p-6 text-center">
            <Users size={18} className="opacity-40 mb-1" />
            <span>No directory entries recorded matching criteria.</span>
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse min-w-[500px] md:min-w-0">
            <thead>
              <tr className="border-b border-gray-100 dark:border-zinc-800 text-gray-400 dark:text-zinc-500 font-bold bg-gray-50/50 dark:bg-zinc-800/30 select-none">
                <th className="p-3.5 font-semibold">Member</th>
                <th className="p-3.5 font-semibold hidden sm:table-cell">Mail Info</th>
                <th className="p-3.5 font-semibold">Role Profile</th>
                <th className="p-3.5 font-semibold text-right">Interface</th>
              </tr>
            </thead>

<tbody>
  {filteredUsers.map((member) => {
    const matchingChannel = channels.find(ch => {
      const partnerIdStr = (ch.recipient?.id || ch.initiator?.id || '').toString();
      return partnerIdStr === member.id.toString();
    });

    const unreadTallyCount = matchingChannel?.unreadCount || 0;

    return (
      <tr key={member.id} className="border-b border-gray-50 dark:border-zinc-800/40 hover:bg-gray-50/30 dark:hover:bg-zinc-800/20 transition-colors group">
        {/* User Identity Column Grid (Visible to BOTH Admin and Agent) */}
        <td className="p-3.5 flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-neutral-900 text-white dark:bg-zinc-100 dark:text-black font-black flex items-center justify-center text-[10px] uppercase shrink-0 select-none relative">
            {member.name?.charAt(0) || 'U'}
            {unreadTallyCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] bg-red-500 text-white font-black text-[8px] rounded-full flex items-center justify-center px-0.5 animate-bounce border border-white dark:border-zinc-900">
                {unreadTallyCount}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-gray-900 dark:text-zinc-100 truncate">{member.name}</p>
            <p className="text-[10px] text-gray-400 dark:text-zinc-500 sm:hidden truncate">{member.email}</p>
          </div>
        </td>
        
        <td className="p-3.5 text-gray-500 dark:text-zinc-400 font-medium hidden sm:table-cell truncate max-w-[160px]">{member.email}</td>
        
        <td className="p-3.5">
          <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border bg-blue-50 border-blue-100 text-blue-600 dark:bg-blue-950/20 dark:border-blue-900/30 dark:text-blue-400">
            {member.role || 'user'}
          </span>
        </td>

        {/* Action Interaction Buttons Cell */}
        <td className="p-3.5 text-right">
          <div className="flex items-center justify-end gap-2">
            
            {/* 🛡️ CORRECT ADMINISTRATIVE CONTROL SECURITY LAYER POSITIONING */}
            {/* The trash minus button displays ONLY for admin, but the Open Chat button is open to all! */}
            {isAdmin && (
              <button 
                type="button"
                onClick={(e) => { e.stopPropagation(); onAdminDeleteUser(member.id); }}
                className="p-1.5 text-red-500 hover:bg-red-500/10 dark:hover:bg-red-500/20 rounded-xl transition border border-transparent hover:border-red-500/20"
                title="Admin Action: Delete User"
              >
                <UserMinus size={12} />
              </button>
            )}

            <button 
              type="button"
              onClick={() => onStartChat(member.id, member.role)}
              className="px-2.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-950 hover:bg-neutral-800 dark:bg-white dark:border-white dark:text-black dark:hover:bg-zinc-100 text-white text-[10px] font-black transition-all shadow-2xs"
            >
              <MessageSquare size={10} /> 
              <span className="hidden xs:inline">Open Chat</span>
            </button>
            </div>
             </td>
              </tr>
                 );
              })}
           </tbody>

          </table>
        )}
      </div>
    </div>
  );
}
