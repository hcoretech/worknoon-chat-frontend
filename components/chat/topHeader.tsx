
'use client';

import React from 'react';
import { Menu, ArrowLeft } from 'lucide-react';
import { ThemeToggle } from '../themeToggle';

interface TopHeaderProps {
  user: any;
  isMobileChatActiveView: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  setIsMobileChatActiveView: (active: boolean) => void;
  setIsProfileOpen: (open: boolean) => void;
}

export default function TopHeader({
  user,
  isMobileChatActiveView,
  setIsMobileSidebarOpen,
  setIsMobileChatActiveView,
  setIsProfileOpen
}: TopHeaderProps) {
  const isUserAnAdmin = user?.role?.toLowerCase() === 'admin';

  return (
    <header className="w-full h-14 bg-[#11191f] border-b md:border-none border-zinc-800/80 px-4 flex items-center justify-between shrink-0 z-30 select-none">
      <div className="flex items-center gap-2">
        <button 
          type="button"
          onClick={() => setIsMobileSidebarOpen(true)} 
          className="md:hidden p-1.5 hover:bg-zinc-800 rounded-lg text-gray-400 hover:text-white mr-1"
        >
          <Menu size={18} />
        </button>
        {isMobileChatActiveView && (
          <button 
            type="button"
            onClick={() => setIsMobileChatActiveView(false)} 
            className="md:hidden p-1.5 hover:bg-zinc-800 rounded-lg text-gray-400 hover:text-white mr-1"
          >
            <ArrowLeft size={16} />
          </button>
        )}
        <span className="text-sm font-black tracking-tight text-white">
          {isUserAnAdmin ? '🛡️ Admin Dashboard' : 'dashboard'}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        {user && (
          <div 
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center gap-2 border border-zinc-800 rounded-xl px-2.5 py-1 bg-zinc-900/40 select-none cursor-pointer hover:border-zinc-700 transition-colors"
          >
            <div className="h-6 w-6 rounded-md bg-white text-black font-black text-[10px] flex items-center justify-center uppercase shrink-0">
              {(user.name || 'U').charAt(0)}
            </div>
            <div className="hidden xs:block text-left truncate min-w-0">
              <p className="text-[10px] font-black text-white leading-none truncate max-w-[80px]">{user.name || 'User'}</p>
              <p className="text-[8px] font-bold text-zinc-500 leading-none capitalize mt-0.5">{user.role || 'Member'}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
