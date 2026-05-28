
'use client';

import React from 'react';
import Sidebar from '../sideBar';
import SidebarNotificationDeck from "./sideNotificationDeck"

interface LeftSidebarWrapperProps {
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  isBrowserOnline: boolean;
  isSocketConnected: boolean;
  logoutSession: () => void;
  theme: string;
  user: any;
  channels: any[];
  activeChannelId: string | null;
  setActiveChannelId: (id: string | null) => void;
  setIsMobileChatActiveView: (active: boolean) => void;
  adminAudits: any[]; // 🚀 FIXED: Added the required security metrics property to interface
}

export default function LeftSidebarWrapper({
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  activeFilter,
  setActiveFilter,
  isBrowserOnline,
  isSocketConnected,
  logoutSession,
  theme,
  user,
  channels,
  activeChannelId,
  setActiveChannelId,
  setIsMobileChatActiveView,
  adminAudits // 🚀 FIXED: Destructured parameter correctly
}: LeftSidebarWrapperProps) {
  return (
    <>
      {/* BLUR OVERLAY PANEL FOR MOBILE PHONE SIDEBARS */}
      {isMobileSidebarOpen && (
        <div 
          onClick={() => setIsMobileSidebarOpen(false)} 
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 md:hidden" 
        />
      )}

      {/* RESPONSIVE DESKTOP PINNED SIDEBAR CONTAINER */}
      <div className="fixed md:relative inset-y-0 left-0 w-60 h-full z-50 md:z-auto transition-transform duration-300 md:translate-x-0 shrink-0 flex flex-col bg-[#11191f] border-r border-zinc-800/40">
        
        {/* Main Pinned Navigation Links Content Wrapper */}
        <div className="flex-1 overflow-y-auto">
          <Sidebar 
            activeFilter={activeFilter} 
            setActiveFilter={setActiveFilter}
            isOnline={isBrowserOnline && isSocketConnected} 
            onLogout={logoutSession}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
            isDark={theme === 'dark'}
            user={user}
          />
        </div>

        {/* 🚀 FIXED PROPERTY ATTACHMENT TRAY */}
        {/* Pass user and adminAudits cleanly as standalone layout hooks fields */}
        <SidebarNotificationDeck 
          channels={channels}
          activeChannelId={activeChannelId}
          user={user}
          adminAudits={adminAudits}
          onSelectChannel={(id) => {
            setActiveChannelId(id);
            setIsMobileChatActiveView(true);
            setIsMobileSidebarOpen(false); 
          }}
        />
      </div>
    </>
  );
}
