// 📁 File: src/components/chat/workspaceColumnsLayout.tsx
'use client';

import React from 'react';
import DirectoryTable from './directoryTable';
import ChatPanel from './chatPanel';

interface WorkspaceColumnsLayoutProps {
  theme: string;
  isMobileChatActiveView: boolean;
  isBrowserOnline: boolean;
  isLoading: boolean;
  filteredUsers: any[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  handleStartDirectoryChat: (id: string, role: string) => void;
  channels: any[];
  user: any;
  handleAdminDeleteUser: (id: string) => void;
  activeChannelId: string | null;
  partnerProfile: any;
  activeChannel: any;
  currentUserIdStr: string;
  typedText: string;
  handleInputChangeAndEmitTypingStatus: (text: string) => void;
  handleSendMessage: (e: React.FormEvent) => void;
  setIsMobileChatActiveView: (active: boolean) => void;
  messageEndRef: React.RefObject<HTMLDivElement | null>;
  typingUsers: any;
  handleAdminDeleteChannel: (id: string) => void;
}

export default function WorkspaceColumnsLayout({
  theme,
  isMobileChatActiveView,
  isBrowserOnline,
  isLoading,
  filteredUsers,
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
  handleStartDirectoryChat,
  channels,
  user,
  handleAdminDeleteUser,
  activeChannelId,
  partnerProfile,
  activeChannel,
  currentUserIdStr,
  typedText,
  handleInputChangeAndEmitTypingStatus,
  handleSendMessage,
  setIsMobileChatActiveView,
  messageEndRef,
  typingUsers,
  handleAdminDeleteChannel
}: WorkspaceColumnsLayoutProps) {
  const isDark = theme === 'dark';

  return (
    <div className="flex flex-1 w-full overflow-hidden relative">
      {/* LEFT COLUMN DATA GRID */}
      <div className={`h-full flex-1 overflow-hidden transition-colors ${
        isDark ? 'md:bg-[#1a252e]' : 'md:bg-white'
      } ${isMobileChatActiveView ? 'hidden md:flex' : 'flex'}`}>
        <DirectoryTable 
          isOnline={isBrowserOnline} 
          isLoading={isLoading} 
          filteredUsers={filteredUsers} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          activeFilter={activeFilter} 
          setActiveFilter={setActiveFilter} 
          onStartChat={handleStartDirectoryChat} 
          channels={channels} 
          isAdmin={user?.role === 'admin'} 
          onAdminDeleteUser={handleAdminDeleteUser} 
        />
      </div>

      {/* RIGHT COLUMN FIXED CHET DRAW */}
      <div className={`fixed md:relative inset-y-0 right-0 h-full w-full md:w-85 overflow-hidden z-40 transition-transform duration-300 ${
        isDark ? 'bg-[#1a252e] md:border-l md:border-zinc-800/80' : 'bg-white md:border-l md:border-gray-100'
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
          isAdmin={user?.role === 'admin'} 
          onAdminPurgeChannel={handleAdminDeleteChannel} 
        />
      </div>
    </div>
  );
}
