// 📁 File: src/components/chat/standardWorkspaceLayout.tsx
'use client';

import React from 'react';
import Inbox from "./inbox"
import ChatPanel from './chatPanel';

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
  typingUsers
}: StandardWorkspaceLayoutProps) {
  const isDark = theme === 'dark';

  return (
    <div className="flex flex-1 w-full overflow-hidden relative animate-fadeIn">
      
      {/* LEFT COLUMN: STREAM LIST */}
      <div className={`w-80 h-full shrink-0 border-r flex flex-col ${
        isDark ? 'bg-[#1a252e] border-zinc-800' : 'bg-white border-gray-100'
      } ${isMobileChatActiveView ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-100 dark:border-zinc-800/60 bg-gray-50/50 dark:bg-zinc-900/30 flex items-center justify-between shrink-0 select-none">
          <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-zinc-500">Inbox</span>
          <span className="bg-emerald-500/10 text-emerald-500 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md">Live</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          <Inbox 
            channelDataset={channels} 
            activeId={activeChannelId} 
            onSelect={(id) => { 
              setActiveChannelId(id); 
              setIsMobileChatActiveView(true); 
            }} 
          />
        </div>
      </div>

      {/* RIGHT COLUMN: ACTIVE TIMELINE TIMELINE FEED */}
      <div className={`fixed md:relative inset-y-0 right-0 h-full w-full md:w-auto md:flex-1 overflow-hidden z-40 md:z-auto transition-transform duration-300 ${
        isDark ? 'bg-[#1a252e]' : 'bg-white'
      } ${isMobileChatActiveView ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
        <ChatPanel 
          key={`${activeChannelId}-${(activeChannel?.messages || []).length}`} 
          partnerProfile={partnerProfile} 
          activeChannel={activeChannel} 
          messagesList={activeChannel?.messages || []} 
          currentUserIdStr={currentUserIdStr} 
          typedText={typedText} 
          onInputChange={handleInputChangeAndEmitTypingStatus} 
          onSendMessage={handleSendMessage} 
          onCloseChat={() => setIsMobileChatActiveView(false)} 
          activePartnerRealName={partnerProfile?.name || 'Workspace Session'} 
          messageEndRef={messageEndRef} 
          isDark={isDark} 
          typingUsers={typingUsers} 
          isAdmin={false} 
        />
      </div>

    </div>
  );
}
