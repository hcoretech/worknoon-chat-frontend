
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../context/authContext';
import { useSocket } from '../../hooks/useSocket'; 
import { useTheme } from '../../context/themeContext';
import { useDashboardSync } from '../../hooks/useDashboardSync';
import api from '../../lib/axios';

// Extracted Sub-Components Tree
import TopHeader from '../../components/chat/topHeader';
import AdminAnalytics from '../../components/chat/adminAnalytics';
import NetworkBanner from '../../components/chat/networkBanner';
import LeftSidebarWrapper from '../../components/chat/leftSideBarWrapper';
import WorkspaceColumnsLayout from '../../components/chat/workspaceColumsLayout';
import StandardWorkspaceLayout from '../../components/chat/standardWorkspaceLayout';
import ProfileModal from '../../components/profileModel';

export default function DashboardPage() {
  const { user, logoutSession } = useAuth();
  const { theme } = useTheme();
  
  // Base State Parameters
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [typedText, setTypedText] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Responsive display views flags
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobileChatActiveView, setIsMobileChatActiveView] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [profileDetails, setProfileDetails] = useState<any>(null);

  const { socket, isSocketConnected } = useSocket(user?.token || null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const currentUserIdStr = (user?.id || user?._id || '').toString();
  const [isBrowserOnline, setIsBrowserOnline] = useState<boolean>(typeof window !== 'undefined' ? navigator.onLine : true);

  // Monitor browser network visibility status changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const live = () => setIsBrowserOnline(true);
    const dead = () => { setIsBrowserOnline(false); setIsLoading(false); };
    window.addEventListener('online', live); 
    window.addEventListener('offline', dead);
    return () => { window.removeEventListener('online', live); window.removeEventListener('offline', dead); };
  }, []);

  // Profile Drawer Data Hydration
  useEffect(() => {
    if (!isProfileOpen || !user) return;
    const fetchProfile = async () => {
      try {
        const response = await api.get('/api/chat/profile/me');
        if (response.data?.success) setProfileDetails(response.data.user);
      } catch (err) { 
        console.warn("⚠️ [Meta Sync] Profile endpoint mismatch (404). Applying direct context session memory properties.");
        setProfileDetails({
          id: user.id || user._id || 'unknown',
          name: user.name || user.fullName || 'Workspace Operative',
          email: user.email || 'N/A',
          role: user.role || 'customer'
        });
      }
    };
    fetchProfile();
  }, [isProfileOpen, user]);


  const { 
    directory, 
    setDirectory, 
    channels, 
    setChannels, 
    typingUsers, 
    channelsFetchedRef,
     adminAudits 
  } = useDashboardSync({
    user, 
    socket, 
    isSocketConnected, 
    activeChannelId, 
    setActiveChannelId, 
    currentUserIdStr, 
    isBrowserOnline, 
    setIsLoading
  });

  // Scroll viewport down tracking dynamic text feed changes
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [channels, activeChannelId, typingUsers]);

  const handleInputChangeAndEmitTypingStatus = (textValue: string) => {
    setTypedText(textValue);
    if (socket && isSocketConnected && activeChannelId) {
      socket.emit('user_typing', { 
        channelId: activeChannelId.toString(), 
        userId: currentUserIdStr, 
        userName: user?.name || user?.fullName || 'Operative', 
        isTyping: textValue.trim().length > 0 
      });
    }
  };

  const handleStartDirectoryChat = async (targetId: string, targetRole: string) => {
    if (!isBrowserOnline) return;
    try {
      setIsLoading(true);
      const rolePairKey = [(user?.role || 'customer').toLowerCase(), targetRole.toLowerCase()].sort().join('_to_');
      const response = await api.post('/api/chat/conversations', { targetRecipientId: targetId, contextType: `workspace_${rolePairKey}` });
      const convId = response.data?.conversation?._id || response.data?.conversation?.id;
      if (!convId) return;
      
      channelsFetchedRef.current = false;
      const refresh = await api.get('/api/chat/channels');
      setChannels(Array.isArray(refresh.data) ? refresh.data : []);
      setActiveChannelId(convId.toString());
      setIsMobileChatActiveView(true); 
    } catch (err) { 
      console.error(err); 
    } finally { 
      setIsLoading(false); 
    }
  };

  const handleAdminDeleteUser = async (targetUserId: string) => {
    if (!window.confirm("🛡️ Purge User Record From Directory Database?")) return;
    try {
      await api.delete(`/api/chat/meta/users/${targetUserId}`);
      setDirectory(prev => prev.filter(u => u.id !== targetUserId));
    } catch (err) { 
      console.error(err); 
    }
  };

  const handleAdminDeleteChannel = async (targetChannelId: string) => {
    if (!window.confirm("🛡️ Terminate Conversation Room History?")) return;
    try {
      await api.delete(`/api/chat/conversations/${targetChannelId}`);
      setChannels(prev => prev.filter(ch => ch._id !== targetChannelId));
      if (activeChannelId === targetChannelId) setActiveChannelId(null);
    } catch (err) { 
      console.error(err); 
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedText.trim() || !activeChannelId || !socket || !isSocketConnected) return;
    const payload = { channelId: activeChannelId.toString(), conversationId: activeChannelId.toString(), senderId: currentUserIdStr, senderName: user?.name || user?.fullName || 'User', senderRole: user?.role || 'customer', text: typedText.trim(), messageBody: typedText.trim(), createdAt: new Date().toISOString() };
    socket.emit('send_message', payload);
    socket.emit('user_typing', { channelId: activeChannelId.toString(), userId: currentUserIdStr, isTyping: false });
    setTypedText('');
  };

  const activeChannel = channels.find(ch => ch._id === activeChannelId);
  const draftPartnerProfile = activeChannel && user ? (activeChannel.initiator?.id === currentUserIdStr ? activeChannel.recipient : activeChannel.initiator) : null;
  const partnerProfile = draftPartnerProfile ? (directory.find(u => u.id === draftPartnerProfile.id) || draftPartnerProfile) : null;
  
  // 🚀 ACTIVE CHANNELS MULTI-ROLE SIDEBAR NAVIGATION FILTRATION MATRIX
  const filteredChannels = channels.filter(ch => {
    const partnerIdStr = (ch.recipient?.id || ch.initiator?.id || '').toString();
    if (partnerIdStr === currentUserIdStr) return false; // Purge self completely out of standard inbox timeline streams

    if (activeFilter === 'all') return true;
    return ch.type?.toLowerCase() === activeFilter.toLowerCase();
  });

  const filteredUsers = directory.filter(u => (activeFilter === 'all' || u.role?.toLowerCase() === activeFilter.toLowerCase()) && (searchQuery.trim() === '' || u.name?.toLowerCase().includes(searchQuery.toLowerCase())));
  const isUserAnAdmin = user?.role?.toLowerCase() === 'admin';

  return (
    <div className="h-screen w-screen bg-[#11191f] text-gray-900 font-sans overflow-hidden flex relative select-none">
      <NetworkBanner isBrowserOnline={isBrowserOnline} />
      <LeftSidebarWrapper isMobileSidebarOpen={isMobileSidebarOpen} 
      setIsMobileSidebarOpen={setIsMobileSidebarOpen}
      activeFilter={activeFilter} 
      setActiveFilter={setActiveFilter} 
      isBrowserOnline={isBrowserOnline} 
      isSocketConnected={isSocketConnected} 
      logoutSession={logoutSession} 
      theme={theme} 
      user={user}
      channels={channels}
      activeChannelId={activeChannelId}
      setActiveChannelId={setActiveChannelId}
      setIsMobileChatActiveView={setIsMobileChatActiveView}
       adminAudits={adminAudits}  
      />

      <div className="flex-1 h-full flex flex-col overflow-hidden relative bg-[#11191f] md:p-6 md:pl-0">
        <TopHeader user={user} isMobileChatActiveView={isMobileChatActiveView} setIsMobileSidebarOpen={setIsMobileSidebarOpen} setIsMobileChatActiveView={setIsMobileChatActiveView} setIsProfileOpen={setIsProfileOpen} />

        <main className={`flex-1 rounded-none md:rounded-[24px] flex flex-col overflow-hidden shadow-2xl relative transition-colors duration-300 ${theme === 'dark' ? 'bg-[#1e2b35] text-gray-100 border border-zinc-800/60' : 'bg-[#f4f3ec] text-gray-900'}`}>
          {isUserAnAdmin && <AdminAnalytics directoryLength={directory.length} channelsLength={channels.length} />}
           {isUserAnAdmin ? (
               <WorkspaceColumnsLayout 
               theme={theme} 
               isMobileChatActiveView={isMobileChatActiveView} 
               isBrowserOnline={isBrowserOnline} 
               isLoading={isLoading} 
               filteredUsers={filteredUsers} 
               searchQuery={searchQuery} 
               setSearchQuery={setSearchQuery} 
               activeFilter={activeFilter} 
               setActiveFilter={setActiveFilter} 
               handleStartDirectoryChat={handleStartDirectoryChat} 
               channels={channels} user={user} 
               handleAdminDeleteUser={handleAdminDeleteUser} 
               activeChannelId={activeChannelId} 
               partnerProfile={partnerProfile} 
               activeChannel={activeChannel} 
               currentUserIdStr={currentUserIdStr} 
               typedText={typedText} 
               handleInputChangeAndEmitTypingStatus={handleInputChangeAndEmitTypingStatus}
                handleSendMessage={handleSendMessage}
                 setIsMobileChatActiveView={setIsMobileChatActiveView}
                  messageEndRef={messageEndRef} typingUsers={typingUsers}
                   handleAdminDeleteChannel={handleAdminDeleteChannel} />
            ) : (

  <StandardWorkspaceLayout 
    theme={theme} 
    isMobileChatActiveView={isMobileChatActiveView} 
    channels={filteredChannels} 
    activeChannelId={activeChannelId} 
    setActiveChannelId={setActiveChannelId} 
    setIsMobileChatActiveView={setIsMobileChatActiveView} 
    partnerProfile={partnerProfile} 
    activeChannel={activeChannel} 
    currentUserIdStr={currentUserIdStr} 
    typedText={typedText} 
    handleInputChangeAndEmitTypingStatus={handleInputChangeAndEmitTypingStatus} 
    handleSendMessage={handleSendMessage} 
    messageEndRef={messageEndRef} 
    typingUsers={typingUsers} 
    
    // 🟢 NEWLY INJECTED PROPS PIPELINES
    isBrowserOnline={isBrowserOnline}
    isLoading={isLoading}
    filteredUsers={filteredUsers}
    searchQuery={searchQuery}
    setSearchQuery={setSearchQuery}
    activeFilter={activeFilter}
    setActiveFilter={setActiveFilter}
    handleStartDirectoryChat={handleStartDirectoryChat}
  />
)}

        </main>
      </div>

      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} user={profileDetails || user} isDark={theme === 'dark'} onLogout={logoutSession} />
    </div>
  );
}
