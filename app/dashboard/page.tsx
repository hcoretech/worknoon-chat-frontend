// 📁 File: src/app/dashboard/page.tsx
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../context/authContext';
import { useSocket } from '../../hooks/useSocket'; 
import { useTheme } from '../../context/themeContext';
import api from '../../lib/axios';

// Sub-Component View Import Tree (Retaining Code 2 Features)
import Sidebar from '../../components/sideBar';
import DirectoryTable from '../../components/chat/directoryTable';
import ChatPanel from '../../components/chat/chatPanel';
import { ThemeToggle } from '../../components/themeToggle';
import ProfileModal from '../../components/profileModel';
import { Menu, ArrowLeft, WifiOff } from 'lucide-react';

export default function DashboardPage() {
  const { user, logoutSession } = useAuth();
  const { theme } = useTheme();
  
  // State Context Handlers (Code 2 Core UI States + Telemetry Fields)
  const [directory, setDirectory] = useState<any[]>([]);
  const [channels, setChannels] = useState<any[]>([]);
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [typedText, setTypedText] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Responsive UI Drawer Overlays
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobileChatActiveView, setIsMobileChatActiveView] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [profileDetails, setProfileDetails] = useState<any>(null);

  // 🚀 TYPING INDICATORS STATE MAP
  const [typingUsers, setTypingUsers] = useState<Record<string, { isTyping: boolean; name: string }>>({});
  const typingTimeoutRef = useRef<Record<string, NodeJS.Timeout>>({});

  const { socket, isSocketConnected } = useSocket(user?.token || null);
  const channelsFetchedRef = useRef<boolean>(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const currentUserIdStr = (user?.id || user?._id || '').toString();

  const [isBrowserOnline, setIsBrowserOnline] = useState<boolean>(
    typeof window !== 'undefined' ? navigator.onLine : true
  );

  // Monitor network status changes on the window layer
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleNetworkGoingLive = () => setIsBrowserOnline(true);
    const handleNetworkGoingDead = () => {
      setIsBrowserOnline(false);
      setIsLoading(false); 
    };
    window.addEventListener('online', handleNetworkGoingLive);
    window.addEventListener('offline', handleNetworkGoingDead);
    return () => {
      window.removeEventListener('online', handleNetworkGoingLive);
      window.removeEventListener('offline', handleNetworkGoingDead);
    };
  }, []);

  // Fetch profile metadata when modal is summoned
  useEffect(() => {
    if (!isProfileOpen || !user) return;
    const fetchCurrentProfileDetails = async () => {
      try {
        const response = await api.get('/api/chat/profile/me');
        if (response.data?.success) setProfileDetails(response.data.user);
      } catch (err) {
        console.error("Failed fetching account profile details:", err);
      }
    };
    fetchCurrentProfileDetails();
  }, [isProfileOpen, user]);

  // 1. Fetch Users Directory and Active Conversations Globally
  useEffect(() => {
    const hydrateDashboardData = async () => {
      if (channelsFetchedRef.current || !isBrowserOnline) return;
      try {
        setIsLoading(true);
        const [directoryRes, channelsRes] = await Promise.all([
          api.get('/api/chat/directory'),
          api.get('/api/chat/channels')
        ]);
        setDirectory(Array.isArray(directoryRes.data) ? directoryRes.data : []);
        setChannels(Array.isArray(channelsRes.data) ? channelsRes.data : []);
        channelsFetchedRef.current = true;
      } catch (error) {
        console.error("Dashboard hydration sync failure:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (user) hydrateDashboardData();
  }, [user, isBrowserOnline]);

  // 2. Real-Time Room Synchronizer and Historical Message Fetcher
  useEffect(() => {
    if (!socket || !isSocketConnected || !activeChannelId || !isBrowserOnline) return;
    
    // Join conversation room
    socket.emit('join_channel', { channelId: activeChannelId.toString() });
    
    // 🚀 READ MARKERS DISPATCH: Signal server that active user has opened this chat room thread
    socket.emit('read_messages', { channelId: activeChannelId.toString(), userId: currentUserIdStr });

    const syncChannelHistory = async () => {
      try {
        const response = await api.get(`/api/chat/conversations/${activeChannelId}/messages`);
        const historicalMessages = response.data?.messages || [];
        
        const normalizedLogs = historicalMessages.map((m: any) => ({
          ...m,
          _id: (m._id || m.id || `hist-${Date.now()}`).toString(),
          senderId: (m.senderId || '').toString(),
          text: m.text || m.messageBody || '',
          createdAt: m.createdAt || new Date().toISOString(),
          isRead: m.isRead || false
        }));

        setChannels((prev) => 
          prev.map((ch) => ch._id === activeChannelId ? { ...ch, messages: normalizedLogs, unreadCount: 0 } : ch)
        );
      } catch (err) {
        console.error("Failed message logs sync:", err);
      }
    };
    syncChannelHistory();
  }, [activeChannelId, socket, isSocketConnected, isBrowserOnline, currentUserIdStr]);

  // 3. Global Socket Live Message & Status Observers
  useEffect(() => {
    if (!socket || !isSocketConnected || !isBrowserOnline) return;

    // Handle Incoming Live Chat Bubbles
    const handleIncomingMessage = (payload: any) => {
      const incomingRoomIdStr = (payload.channelId || payload.conversationId || '').toString();

      setChannels((prevChannels) => {
        return prevChannels.map((ch) => {
          const currentChannelIdStr = (ch._id || ch.id || '').toString();
          const isTargetChannel = currentChannelIdStr === incomingRoomIdStr || (ch.conversationId && ch.conversationId.toString() === incomingRoomIdStr);

          if (isTargetChannel) {
            const existingMessages = Array.isArray(ch.messages) ? ch.messages : [];
            const isDuplicate = existingMessages.some((m: any) => (m._id || '').toString() === (payload._id || '').toString());
            
            if (isDuplicate) return ch;

            const isCurrentlyActiveRoom = activeChannelId?.toString() === incomingRoomIdStr;

            // 🚀 REAL-TIME READ HOOKBACK: If recipient is already actively looking at the room, instantly acknowledge it
            if (isCurrentlyActiveRoom && payload.senderId.toString() !== currentUserIdStr) {
              socket.emit('read_messages', { channelId: incomingRoomIdStr, userId: currentUserIdStr });
            }

            const sanitizedIncomingMsg = {
              ...payload,
              _id: (payload._id || `msg-${Date.now()}`).toString(),
              senderId: (payload.senderId || '').toString(),
              text: payload.text || payload.messageBody || '',
              messageBody: payload.text || payload.messageBody || '',
              createdAt: payload.createdAt || new Date().toISOString(),
              isRead: isCurrentlyActiveRoom
            };

            return {
              ...ch,
              lastMessageText: sanitizedIncomingMsg.text,
              updatedAt: new Date().toISOString(),
              // Increment unread tally badge values if user is on directory view panel or another room link
              unreadCount: (!isCurrentlyActiveRoom && payload.senderId.toString() !== currentUserIdStr) ? (ch.unreadCount || 0) + 1 : 0,
              messages: [...existingMessages, sanitizedIncomingMsg]
            };
          }
          return ch;
        });
      });
    };

    // 🚀 READ STATS AGGREGATOR LISTENER
    const handleMessagesMarkedRead = (payload: { channelId: string; userId: string }) => {
      if (payload.userId.toString() === currentUserIdStr) return; // Ignore own read feedbacks
      
      setChannels((prevChannels) =>
        prevChannels.map((ch) => {
          if (ch._id?.toString() === payload.channelId.toString()) {
            return {
              ...ch,
              messages: (ch.messages || []).map((m: any) => ({ ...m, isRead: true }))
            };
          }
          return ch;
        })
      );
    };

    // 🚀 LIVE TYPING DISPATCH TELEMETRY CAPTURE HANDLERS
    const handleUserTypingEvent = (payload: { channelId: string; userId: string; userName: string; isTyping: boolean }) => {
      if (payload.channelId.toString() !== activeChannelId?.toString() || payload.userId.toString() === currentUserIdStr) return;

      const userUniqueKey = payload.userId.toString();

      if (payload.isTyping) {
        setTypingUsers((prev) => ({ ...prev, [userUniqueKey]: { isTyping: true, name: payload.userName } }));
        
        // Safety Clear: Clear aging static indicator layouts automatically after 3 seconds if timeout anomalies occur
        if (typingTimeoutRef.current[userUniqueKey]) clearTimeout(typingTimeoutRef.current[userUniqueKey]);
        typingTimeoutRef.current[userUniqueKey] = setTimeout(() => {
          setTypingUsers((prev) => {
            const copy = { ...prev };
            delete copy[userUniqueKey];
            return copy;
          });
        }, 3000);
      } else {
        if (typingTimeoutRef.current[userUniqueKey]) clearTimeout(typingTimeoutRef.current[userUniqueKey]);
        setTypingUsers((prev) => {
          const copy = { ...prev };
          delete copy[userUniqueKey];
          return copy;
        });
      }
    };

        // ... continuous socket listeners array boundary
    socket.on('receive_message', handleIncomingMessage);
    socket.on('messages_read_broadcast', handleMessagesMarkedRead);
    socket.on('user_typing_broadcast', handleUserTypingEvent);

    return () => { 
      socket.off('receive_message', handleIncomingMessage); 
      socket.off('messages_read_broadcast', handleMessagesMarkedRead);
      socket.off('user_typing_broadcast', handleUserTypingEvent);
    };
  }, [socket, isSocketConnected, isBrowserOnline, activeChannelId, currentUserIdStr]);

  // Auto Scroll focus control tracker
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [channels, activeChannelId, typingUsers]);

  // 🚀 INTERACTIVE TYPING TRIGGER EVENT DISPATCH
  const handleInputChangeAndEmitTypingStatus = (textValue: string) => {
    setTypedText(textValue);
    if (!socket || !isSocketConnected || !activeChannelId) return;

    socket.emit('user_typing', {
      channelId: activeChannelId.toString(),
      userId: currentUserIdStr,
      userName: user?.name || user?.fullName || 'Operative',
      isTyping: textValue.trim().length > 0
    });
  };

  const handleStartDirectoryChat = async (targetId: string, targetRole: string) => {
    if (!isBrowserOnline) return;
    try {
      setIsLoading(true);
      const myRole = (user?.role || 'customer').toLowerCase();
      const theirRole = targetRole.toLowerCase();

      // Sort keys alphabetically to avoid inverse pair duplicate records
      const rolePairKey = [myRole, theirRole].sort().join('_to_');
      const deducedType = `workspace_${rolePairKey}`;

      const response = await api.post('/api/chat/conversations', { targetRecipientId: targetId, contextType: deducedType });
      const convId = response.data?.conversation?._id || response.data?.conversation?.id;
      if (!convId) return;

      channelsFetchedRef.current = false;
      const channelsRefresh = await api.get('/api/chat/channels');
      setChannels(Array.isArray(channelsRefresh.data) ? channelsRefresh.data : []);
      setActiveChannelId(convId.toString());
      setIsMobileChatActiveView(true); 
    } catch (err) {
      console.error("Failed opening conversation container session:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedText.trim() || !activeChannelId || !socket || !isSocketConnected) return;

    const transmissionMessagePayload = {
      channelId: activeChannelId.toString(),
      conversationId: activeChannelId.toString(),
      senderId: currentUserIdStr,
      senderName: user?.name || user?.fullName || 'User',
      senderRole: user?.role || 'customer',
      text: typedText.trim(),
      messageBody: typedText.trim(),
      createdAt: new Date().toISOString()
    };

    // Emit live down WebSocket pipe - relying on the clean server roundtrip mechanism
    socket.emit('send_message', transmissionMessagePayload);
    
    // Stop typing indicator on message submission
    socket.emit('user_typing', { channelId: activeChannelId.toString(), userId: currentUserIdStr, isTyping: false });
    setTypedText('');
  };

  const activeChannel = channels.find(ch => ch._id === activeChannelId);
  const draftPartnerProfile = activeChannel && user ? (activeChannel.initiator?.id === currentUserIdStr ? activeChannel.recipient : activeChannel.initiator) : null;
  const partnerProfile = draftPartnerProfile ? (directory.find(u => u.id === draftPartnerProfile.id) || draftPartnerProfile) : null;
  const activePartnerRealName = partnerProfile?.name || 'Workspace Session';
  const messagesList = activeChannel?.messages || [];
  
  const isOnline = isBrowserOnline && isSocketConnected;
  const isDark = theme === 'dark';

  const filteredUsers = directory.filter(u => {
    const matchesRole = activeFilter === 'all' || u.role?.toLowerCase() === activeFilter.toLowerCase();
    const matchesSearch = searchQuery.trim() === '' || u.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="h-screen w-screen bg-[#11191f] text-gray-900 font-sans overflow-hidden flex relative select-none">
      {isMobileSidebarOpen && (
        <div onClick={() => setIsMobileSidebarOpen(false)} className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 md:hidden" />
      )}

      <div className={`fixed md:relative inset-y-0 left-0 w-60 h-full z-50 md:z-auto transition-transform duration-300 md:translate-x-0 shrink-0 ${
        isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar 
          activeFilter={activeFilter} 
          setActiveFilter={setActiveFilter}
          isOnline={isOnline} 
          onLogout={logoutSession}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          isDark={isDark}
          user={user}
        />
      </div>

      <div className="flex-1 h-full flex flex-col overflow-hidden relative bg-[#11191f] md:p-6 md:pl-0">
        <header className="w-full h-14 bg-[#11191f] border-b md:border-none border-zinc-800/80 px-4 flex items-center justify-between shrink-0 z-30">
          <div className="flex items-center gap-2">
            <button onClick={() => setIsMobileSidebarOpen(true)} className="md:hidden p-1.5 hover:bg-zinc-800 rounded-lg text-gray-400 hover:text-white mr-1">
              <Menu size={18} />
            </button>
            {isMobileChatActiveView && (
              <button onClick={() => setIsMobileChatActiveView(false)} className="md:hidden p-1.5 hover:bg-zinc-800 rounded-lg text-gray-400 hover:text-white mr-1">
                <ArrowLeft size={16} />
              </button>
            )}
            <span className="text-sm font-black tracking-tight text-white">Admin Dashboard</span>
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

        <main className={`flex-1 rounded-none md:rounded-[24px] flex overflow-hidden shadow-2xl relative transition-colors duration-300 ${
          isDark ? 'bg-[#1e2b35] text-gray-100 border border-zinc-800/60' : 'bg-[#f4f3ec] text-gray-900'
        }`}>
          {!isBrowserOnline && (
            <div className="absolute top-0 left-0 w-full bg-red-600 dark:bg-red-700 text-white text-[10px] font-black py-1.5 px-4 flex items-center justify-center gap-1.5 z-50 tracking-wider">
              <WifiOff size={12} className="animate-pulse" /> 
              <span>WORKSPACE STATION DISCONNECTED • HARDWARE INTERFACES LOCKED</span>
            </div>
          )}

          <div className={`h-full flex-1 overflow-hidden transition-colors ${
            isDark ? 'md:bg-[#1a252e]' : 'md:bg-white'
          } ${isMobileChatActiveView ? 'hidden md:flex' : 'flex'}`}>
            <DirectoryTable 
              isOnline={isBrowserOnline}
              isLoading={isLoading} filteredUsers={filteredUsers} searchQuery={searchQuery}
              setSearchQuery={setSearchQuery} activeFilter={activeFilter} setActiveFilter={setActiveFilter}
              onStartChat={handleStartDirectoryChat}
              channels={channels}
            />
          </div>

          <div className={`fixed md:relative inset-y-0 right-0 h-full w-full md:w-85 overflow-hidden z-40 transition-transform duration-300 ${
            isDark ? 'bg-[#1a252e] md:border-l md:border-zinc-800/80' : 'bg-white md:border-l md:border-gray-100'
          } ${isMobileChatActiveView ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
            <ChatPanel 
              key={`${activeChannelId}-${messagesList.length}`}
              partnerProfile={partnerProfile} activeChannel={activeChannel} messagesList={messagesList}
              currentUserIdStr={currentUserIdStr} typedText={typedText} 
              onInputChange={handleInputChangeAndEmitTypingStatus}
              onSendMessage={handleSendMessage} onCloseChat={() => setIsMobileChatActiveView(false)}
              activePartnerRealName={activePartnerRealName} messageEndRef={messageEndRef}
              isDark={isDark}
              typingUsers={typingUsers}
            />
          </div>
        </main>
      </div>

      <ProfileModal 
        isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)}
        user={profileDetails || user} isDark={isDark} onLogout={logoutSession}
      />
    </div>
  );
}
