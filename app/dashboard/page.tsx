// 📁 File: src/app/dashboard/page.tsx
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../context/authContext';
import { useSocket } from '../../hooks/useSocket'; 
import api from '../../lib/axios';
import Sidebar from '../../components/sideBar';
import Inbox from '../../components/chat/inbox';
import ChatFeed from '../../components/chat/chatFeed';
import { MessageSquare, RefreshCw, WifiOff, Search } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [channels, setChannels] = useState<any[]>([]);
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
  const [isLoadingChannels, setIsLoadingChannels] = useState(true);
  
  // 'all' | 'agent' | 'merchant' | 'designer'
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [currentMenuSection, setCurrentMenuSection] = useState<'streams' | 'directory'>('directory');
  
  // Mock directory user state matching mockup canvas columns exactly
  const [directoryUsers, setDirectoryUsers] = useState<any[]>([
    { id: 'henry_id_123', email: 'gel2henry14@gmail.com', role: 'AGENT' }
  ]);

  const { socket, isSocketConnected } = useSocket(user?.token || null);
  const channelsFetchedRef = useRef<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(true);

  // Helper utility helper to format raw ISO database timestamps to clean user string (e.g., "05:13 PM")
  const formatMessageTimestamp = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };
    // 5. Directory Session Action Trigger with Structural Initial Message Stamping
  const handleInitializeChatWithTimestamp = async (targetUser: any) => {
    try {
      // 1. Fire baseline sequence to open/create document record on database level
      await handleInitiateNewChatSession(targetUser.id, targetUser.role.toLowerCase());
      
      // 2. Generate standard system tracking timestamp block for real-time validation tracking
      const localStampingEventTime = new Date().toISOString();
      console.log(`[Workspace Engine] Communication stream successfully mounted for recipient: ${targetUser.email} at client timestamp: ${formatMessageTimestamp(localStampingEventTime)}`);
      
      // 3. Optional: Automatically toggle viewport stream view focus to track real-time chat feeds immediately
      setCurrentMenuSection('streams');
      
    } catch (error) {
      console.error("🔴 Dashboard failed executing contextualized table session link step:", error);
    }
  };


  // 1. Initial Channels Fetch Lifecycle
  useEffect(() => {
    const loadPlatformChannels = async () => {
      if (channelsFetchedRef.current) return;
      try {
        setIsLoadingChannels(true);
        const response = await api.get('/api/chat/channels');
        const channelList = Array.isArray(response.data) ? response.data : [];
        setChannels(channelList);
        channelsFetchedRef.current = true;
        
        if (channelList.length > 0 && !activeChannelId) {
          setActiveChannelId(channelList[0]._id);
        }
      } catch (error: any) {
        console.error("Axios channels query failure:", error);
      } finally {
        setIsLoadingChannels(false);
      }
    };

    if (user) loadPlatformChannels();
  }, [user, activeChannelId]);

  // 2. Real-Time Room Aggregation Stream Handler (Injects timestamp context on historical data queries)
  useEffect(() => {
    if (!socket || !isSocketConnected || !activeChannelId) return;

    socket.emit('join_channel', { channelId: activeChannelId });

    const syncActiveChannelMessages = async () => {
      try {
        const response = await api.get(`/api/chat/conversations/${activeChannelId}/messages`);
        const historicalMessages = response.data?.messages || [];
        
        setChannels((prevChannels) =>
          prevChannels.map((ch) => 
            ch._id === activeChannelId 
              ? { 
                  ...ch, 
                  messages: historicalMessages,
                  lastMessageTime: historicalMessages.length > 0 
                    ? historicalMessages[historicalMessages.length - 1].createdAt 
                    : ch.updatedAt 
                } 
              : ch
          )
        );
      } catch (err) {
        console.error("Failed executing message stream hydration sync:", err);
      }
    };

    syncActiveChannelMessages();
  }, [activeChannelId, socket, isSocketConnected]);

  // 3. Global Inbound Message Listener Subscription (Stamps new inbound streams dynamically)
  useEffect(() => {
    if (!socket || !isSocketConnected) return;

    const handleIncomingMessage = (payload: any) => {
      setChannels((prevChannels) =>
        prevChannels.map((ch) => {
          if (ch._id === payload.channelId || ch._id === payload.conversationId) {
            const existingMessages = ch.messages || [];
            const isDuplicate = existingMessages.some((m: any) => m._id === payload._id);
            const explicitTimestamp = payload.createdAt || new Date().toISOString();
            
            return {
              ...ch,
              lastMessageText: payload.messageBody || payload.text,
              lastMessageTime: explicitTimestamp, // Track timestamp dynamically for Inbox row previews
              messages: isDuplicate ? existingMessages : [...existingMessages, {
                ...payload,
                _id: payload._id || Date.now().toString(),
                createdAt: explicitTimestamp
              }]
            };
          }
          return ch;
        })
      );
    };

    socket.on('receive_message', handleIncomingMessage);
    return () => { socket.off('receive_message', handleIncomingMessage); };
  }, [socket, isSocketConnected]);

  // 4. Create or Open Chat Session Engine
  const handleInitiateNewChatSession = async (targetRecipientId: string, deducedContextType: string) => {
    try {
      setIsLoadingChannels(true);
      const payload = { targetRecipientId, contextType: deducedContextType, contextRefId: null };
      const response = await api.post('/api/chat/conversations', payload);
      const conversationData = response.data?.conversation;
      const TargetRoomId = conversationData?._id || conversationData?.id;

      if (!TargetRoomId) throw new Error("Backend validation failed.");

      channelsFetchedRef.current = false;
      const channelsRefreshResponse = await api.get('/api/chat/channels');
      setChannels(Array.isArray(channelsRefreshResponse.data) ? channelsRefreshResponse.data : []);
      setActiveChannelId(TargetRoomId.toString());
    } catch (err) {
      console.error("Dashboard failed initializing chat sequence:", err);
    } finally {
      setIsLoadingChannels(false);
    }
  };

  const activeChannel = channels.find(ch => ch._id === activeChannelId);
  const partnerProfile = activeChannel && user 
    ? (activeChannel.initiator?.id === user.id ? activeChannel.recipient : activeChannel.initiator)
    : null;

  // Filter channels mapping down onto selection layout filters matching Sidebar keys
  const filteredChannels = channels.filter(ch => {
    if (activeFilter === 'all') return true;
    return ch.type === activeFilter;
  });

  return (
    <div className="flex h-screen w-screen bg-[#FDFBF7] text-gray-900 overflow-hidden">
      
      {/* COLUMN 1: LEFT WORKSPACE NAVIGATION SIDEBAR PANEL */}
      <div className="w-64 h-full shrink-0 hidden md:block">
        <Sidebar 
          activeFilter={activeFilter}
          setActiveFilter={(filter) => {
            setActiveFilter(filter);
            setCurrentMenuSection('streams');
          }}
          isOnline={isSocketConnected}
          onLogout={() => console.log('Logging out...')}
          isDark={isDark}
          user={user}
        />
      </div>

      {/* REMAINDER VIEWPORT STRUCTURAL WRAPPER */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {!isSocketConnected && (
          <div className="absolute top-0 left-0 w-full bg-amber-500 text-white text-xs font-bold py-2 px-6 flex items-center justify-center gap-2 z-50">
            <WifiOff size={14} />
            <span>Working offline. Reconnecting real-time telemetry...</span>
          </div>
        )}

        {/* INNER GRID VIEWPORTS CONTAINER */}
        <div className="flex flex-1 w-full overflow-hidden">
          
          {/* COLUMN 2: CENTER VIEWPORT (MEMBERS TABLE / ACTIVE STREAMS INBOX ROW GRID) */}
          <main className="flex-1 flex flex-col min-w-0 bg-[#FDFBF7] p-8 overflow-y-auto">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200/60">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold tracking-tight text-gray-900">Members</h1>
                <button 
                  onClick={() => setCurrentMenuSection(currentMenuSection === 'directory' ? 'streams' : 'directory')}
                  className="text-xs bg-zinc-900 text-white px-3 py-1.5 rounded-md font-medium shadow-xs hover:bg-zinc-800 transition-colors"
                >
                  {currentMenuSection === 'directory' ? 'View Active Streams' : 'Open User Directory'}
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Filter name or email..." 
                    className="pl-9 pr-4 py-1.5 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none w-52 shadow-xs"
                  />
                </div>
                <select className="bg-white border border-gray-200 rounded-lg text-xs px-3 py-1.5 text-gray-600 focus:outline-none font-medium shadow-xs">
                  <option>All Profiles</option>
                </select>
              </div>
            </div>

            {currentMenuSection === 'directory' ? (
              <div className="mt-6 bg-white border border-gray-100 rounded-xl shadow-xs overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50/50">
                      <th className="py-4 px-6">Mail Address</th>
                      <th className="py-4 px-6">Role Profile</th>
                      <th className="py-4 px-6 text-right">Connect</th>
                    </tr>
                  </thead>
                                    <tbody className="divide-y divide-gray-50 text-xs text-gray-700">
                    {directoryUsers.map((dirUser) => (
                      <tr key={dirUser.id} className="hover:bg-gray-50/40 transition-colors">
                        <td className="py-4 px-6 font-medium text-gray-600">{dirUser.email}</td>
                        <td className="py-4 px-6">
                          <span className="text-[10px] font-black tracking-wide text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                            {dirUser.role}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleInitializeChatWithTimestamp(dirUser)}
                            className="bg-black hover:bg-zinc-900 text-white font-bold text-[11px] px-4 py-2 rounded-lg inline-flex items-center gap-2 shadow-xs transition-colors"
                          >
                            <MessageSquare size={12} />
                            <span>Open Chat Session</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mt-6 flex-1 overflow-y-auto">
                {isLoadingChannels ? (
                  <div className="p-8 text-center flex flex-col items-center justify-center gap-2 h-40">
                    <RefreshCw size={16} className="animate-spin text-gray-400" />
                    <p className="text-xs text-gray-400">Hydrating layouts...</p>
                  </div>
                ) : filteredChannels.length === 0 ? (
                  <div className="p-8 text-center h-40 flex flex-col items-center justify-center gap-1">
                    <p className="text-xs font-medium text-gray-500">No active transmissions matching filter</p>
                  </div>
                ) : (
                  <Inbox 
                    channelDataset={filteredChannels} 
                    activeId={activeChannelId} 
                    onSelect={(id) => setActiveChannelId(id)} 
                  />
                )}
              </div>
            )}
          </main>

          {/* COLUMN 3: RIGHT CHAT DRAWER PANEL (STAYS LOCKED AND OPEN) */}
          <aside className="w-[420px] bg-white border-l border-gray-100 flex flex-col shrink-0 h-full">
            <ChatFeed 
              partnerProfile={partnerProfile || { name: 'henry', role: 'AGENT' }} 
              activeChannel={activeChannel || { _id: '346bb6', messages: [] }} 
              socket={socket} 
              isOnline={isSocketConnected}
              formatTime={formatMessageTimestamp}
            />
          </aside>

        </div>
      </div>
    </div>
  );
}

