
'use client';

import React, { useState } from 'react';
import Inbox from './inbox';
import ChatPanel from './chatPanel';
import { Users, MessageSquare, Search } from 'lucide-react';

interface StandardWorkspaceLayoutProps {
  theme: string;
  isMobileChatActiveView: boolean;
  channels: any[];
  activeChannelId: string | null;
  setActiveChannelId: (id: string | null) => void;
  setIsMobileChatActiveView: (active: boolean) => void;
  partnerProfile: any;
  activeChannel: any;
  currentUserIdStr: string;
  typedText: string;
  handleInputChangeAndEmitTypingStatus: (text: string) => void;
  handleSendMessage: (e: React.FormEvent) => void;
  messageEndRef: React.RefObject<HTMLDivElement | null>;
  typingUsers: any;

  // Directory parameter hooks values pass
  isBrowserOnline: boolean;
  isLoading: boolean;
  filteredUsers: any[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  handleStartDirectoryChat: (id: string, role: string) => void;
}

export default function StandardWorkspaceLayout({
  theme,
  isMobileChatActiveView,
  channels,
  activeChannelId,
  setActiveChannelId,
  setIsMobileChatActiveView,
  partnerProfile,
  activeChannel,
  currentUserIdStr,
  typedText,
  handleInputChangeAndEmitTypingStatus,
  handleSendMessage,
  messageEndRef,
  typingUsers,
  filteredUsers,
  searchQuery,
  setSearchQuery,
  handleStartDirectoryChat
}: StandardWorkspaceLayoutProps) {
  const isDark = theme === 'dark';
  
  // Toggles the standard dashboard tracking sidebar view block
  const [currentPaneSection, setCurrentPaneSection] = useState<'streams' | 'directory'>('directory');

  return (
    <div className="flex flex-1 w-full h-full overflow-hidden relative animate-fadeIn">
      
      {/* 📱 MOBILE RESPONSIVE COLUMN: Adapts from full-width on mobile (w-full) to fixed width on desktop (md:w-80) */}
      <div className={`w-full md:w-88 h-full shrink-0 md:border-r flex flex-col overflow-hidden transition-all duration-300 ${
        isDark ? 'bg-[#1a252e] border-zinc-800' : 'bg-white border-gray-100'
      } ${isMobileChatActiveView ? 'hidden md:flex' : 'flex'}`}>
        
        {/* Toggle Headbar Control Row Header */}
        <div className="p-4 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/30 flex items-center justify-between shrink-0 select-none">
          <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-zinc-500">
            {currentPaneSection === 'directory' ? 'Worknoon Members' : 'Active Streams'}
          </span>
          
          <button
            type="button"
            onClick={() => setCurrentPaneSection(currentPaneSection === 'directory' ? 'streams' : 'directory')}
            className="flex items-center gap-1.5 text-[9px] font-black px-2.5 py-1.5 bg-neutral-900 text-white dark:bg-white dark:text-black rounded-xl shadow-2xs hover:opacity-90 transition-all outline-none"
          >
            {currentPaneSection === 'directory' ? (
              <>
                <MessageSquare size={10} /> <span>Inbox Feeds</span>
              </>
            ) : (
              <>
                <Users size={10} /> <span>Find Members</span>
              </>
            )}
          </button>
        </div>

        {/* Dynamic Inner Component Workspace Sheet Area View */}
        <div className="flex-1 overflow-y-auto min-h-0 w-full">
          {currentPaneSection === 'directory' ? (
            /* 🚀 DRIBBBLE REFACTOR MINI PROFILE VIEW CARDS DECK: Resolves layout stretching completely */
            <div className="p-4 space-y-2.5 flex flex-col w-full">
              
              {/* Inline Small Search input row bar container */}
              <div className="relative mb-1 shrink-0">
                <Search size={12} className="absolute left-3.5 top-3 text-gray-400" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter name query..."
                  className="w-full text-[11px] font-semibold pl-9 pr-3 py-2 rounded-xl border border-gray-100 dark:border-zinc-800 focus:outline-none bg-gray-50/50 dark:bg-black/10 text-gray-900 dark:text-white"
                />
              </div>

              {filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-[10px] font-medium leading-relaxed select-none">
                  No matches inside database.
                </div>
              ) : (
                filteredUsers.map((member) => (
                  <div 
                    key={member.id}
                    onClick={() => {
                      handleStartDirectoryChat(member.id, member.role);
                      setCurrentPaneSection('streams'); // Automatically flip to chat panel feed view on initiation
                    }}
                    className="p-3 bg-white dark:bg-zinc-900/40 border border-gray-100/70 dark:border-zinc-800/80 hover:border-gray-300 dark:hover:border-zinc-700 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition shadow-3xs group animate-fadeIn w-full hover:scale-[1.01]"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="h-8 w-8 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black font-black flex items-center justify-center text-[10px] uppercase shrink-0 select-none">
                        {member.name?.charAt(0) || 'U'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-black text-[11px] text-gray-900 dark:text-zinc-100 truncate group-hover:text-blue-500 transition-colors">{member.name}</p>
                        <p className="text-[9px] font-bold text-gray-400 dark:text-zinc-500 truncate mt-0.5">{member.email}</p>
                      </div>
                    </div>
                    
                    <span className={`shrink-0 px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-wider border select-none ${
                      member.role === 'merchant' ? 'bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-400'
                        : member.role === 'agent' ? 'bg-amber-50 border-amber-100 text-amber-600 dark:bg-amber-950/20 dark:border-amber-900/30 dark:text-amber-400'
                        : member.role === 'designer' ? 'bg-purple-50 border-purple-100 text-purple-600 dark:bg-purple-950/20 dark:border-purple-900/30 dark:text-purple-400'
                        : 'bg-blue-50 border-blue-100 text-blue-600 dark:bg-blue-950/20 dark:border-blue-900/30 dark:text-blue-400'
                    }`}>
                      {member.role || 'user'}
                    </span>
                  </div>
                ))
              )}
            </div>
          ) : (
            /* 💬 View 2: Live Inbound Streams List */
            <Inbox 
              channelDataset={channels} activeId={activeChannelId} 
              onSelect={(id) => { setActiveChannelId(id); setIsMobileChatActiveView(true); }} 
            />
          )}
        </div>
      </div>

      {/* 📱 MOBILE RESPONSIVE PANEL FEED CANVAS: Swaps between sliding-drawer view on mobile to inline layout on desktop */}
      <div className={`fixed md:relative inset-y-0 right-0 h-full w-full md:w-auto md:flex-1 overflow-hidden z-40 transition-transform duration-300 ease-in-out ${
        isDark ? 'bg-[#1a252e]' : 'bg-white'
      } ${isMobileChatActiveView ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
        <ChatPanel 
          key={`${activeChannelId}-${(activeChannel?.messages || []).length}`} partnerProfile={partnerProfile} 
          activeChannel={activeChannel} messagesList={activeChannel?.messages || []} currentUserIdStr={currentUserIdStr} 
          typedText={typedText} onInputChange={handleInputChangeAndEmitTypingStatus} onSendMessage={handleSendMessage} 
          onCloseChat={() => setIsMobileChatActiveView(false)} activePartnerRealName={partnerProfile?.name || 'Workspace Session'} 
          messageEndRef={messageEndRef} isDark={isDark} typingUsers={typingUsers} isAdmin={false} 
        />
      </div>

    </div>
  );
}
