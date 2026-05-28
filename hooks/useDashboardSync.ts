// 📁 File: src/hooks/useDashboardSync.ts
'use client';

import { useEffect, useState, useRef } from 'react';
import api from '../lib/axios';

interface UseDashboardSyncProps {
  user: any;
  socket: any;
  isSocketConnected: boolean;
  activeChannelId: string | null;
  setActiveChannelId: (id: string | null) => void;
  currentUserIdStr: string;
  isBrowserOnline: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function useDashboardSync({
  user,
  socket,
  isSocketConnected,
  activeChannelId,
  setActiveChannelId,
  currentUserIdStr,
  isBrowserOnline,
  setIsLoading
}: UseDashboardSyncProps) {
  const [directory, setDirectory] = useState<any[]>([]);
  const [channels, setChannels] = useState<any[]>([]);
  const [typingUsers, setTypingUsers] = useState<Record<string, { isTyping: boolean; name: string }>>({});
  const [adminAudits, setAdminAudits] = useState<any[]>([]);
  
  const channelsFetchedRef = useRef<boolean>(false);
  const typingTimeoutRef = useRef<Record<string, NodeJS.Timeout>>({});

  // 1. Initial Data-Hydration Lifecycle (Directory & Active Channels)
  useEffect(() => {
    const hydrate = async () => {
      if (channelsFetchedRef.current || !isBrowserOnline) return;
      try {
        setIsLoading(true);
        const [dirRes, chanRes] = await Promise.all([
          api.get('/api/chat/directory'), 
          api.get('/api/chat/channels')
        ]);
        setDirectory(Array.isArray(dirRes.data) ? dirRes.data : []);
        setChannels(Array.isArray(chanRes.data) ? chanRes.data : []);
        channelsFetchedRef.current = true;
      } catch (err) {
        console.error("Dashboard core directory sync error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    if (user) hydrate();
  }, [user, isBrowserOnline, setIsLoading]);

  // 2. Real-Time Room Synchronizer and Message Fetcher
  useEffect(() => {
    if (!socket || !isSocketConnected || !activeChannelId || !isBrowserOnline) return;
    
    socket.emit('join_channel', { channelId: activeChannelId.toString() });
    socket.emit('read_messages', { channelId: activeChannelId.toString(), userId: currentUserIdStr });

    const syncHistory = async () => {
      try {
        const response = await api.get(`/api/chat/conversations/${activeChannelId}/messages`);
        const historical = response.data?.messages || [];
        const normalized = historical.map((m: any) => ({
          ...m,
          _id: (m._id || m.id || `hist-${Date.now()}`).toString(),
          senderId: (m.senderId || '').toString(),
          text: m.text || m.messageBody || ''
        }));
        setChannels((prev) => 
          prev.map((ch) => ch._id === activeChannelId ? { ...ch, messages: normalized, unreadCount: 0 } : ch)
        );
      } catch (err) {
        console.error("Failed executing message sync:", err);
      }
    };
    syncHistory();
  }, [activeChannelId, socket, isSocketConnected, isBrowserOnline, currentUserIdStr]);

  // 3. 🛡️ EXCLUSIVE TOP-LEVEL ADMIN SECURITY AUDIT LOG LISTENER
  useEffect(() => {
    if (!socket || !isSocketConnected || !isBrowserOnline) return;

    const handleAdminAudit = (payload: any) => {
      // Keep a rolling log of the last 15 security events to prevent memory leaks
      setAdminAudits((prev) => [payload, ...prev].slice(0, 15));
    };

    // Only bind the socket listener event if the user profile matches an admin context
    if (user?.role?.toLowerCase() === 'admin') {
      socket.on('admin_audit_broadcast', handleAdminAudit);
    }

    return () => {
      socket.off('admin_audit_broadcast', handleAdminAudit);
    };
  }, [socket, isSocketConnected, isBrowserOnline, user]);

  // 4. Global Socket Live Event Chat Messaging Subscriptions
  useEffect(() => {
    if (!socket || !isSocketConnected || !isBrowserOnline) return;

    const handleIncoming = (payload: any) => {
      const incomingRoom = (payload.channelId || payload.conversationId || '').toString();
      
      setChannels((prev) => prev.map((ch) => {
        const currentId = (ch._id || ch.id || '').toString();
        const isTarget = currentId === incomingRoom || (ch.conversationId && ch.conversationId.toString() === incomingRoom);
        
        if (isTarget) {
          const existing = Array.isArray(ch.messages) ? ch.messages : [];
          if (existing.some((m: any) => (m._id || '').toString() === (payload._id || '').toString())) return ch;
          
          const isActive = activeChannelId?.toString() === incomingRoom;
          if (isActive && payload.senderId.toString() !== currentUserIdStr) {
            socket.emit('read_messages', { channelId: incomingRoom, userId: currentUserIdStr });
          }
          return {
            ...ch,
            lastMessageText: payload.text || payload.messageBody,
            unreadCount: (!isActive && payload.senderId.toString() !== currentUserIdStr) ? (ch.unreadCount || 0) + 1 : 0,
            messages: [...existing, payload]
          };
        }
        return ch;
      }));
    };

    const handleRead = (payload: any) => {
      if (payload.userId.toString() === currentUserIdStr) return;
      setChannels((prev) => 
        prev.map((ch) => ch._id?.toString() === payload.channelId.toString() ? { ...ch, messages: (ch.messages || []).map((m: any) => ({ ...m, isRead: true })) } : ch)
      );
    };

    const handleTyping = (payload: any) => {
      if (payload.channelId.toString() !== activeChannelId?.toString() || payload.userId.toString() === currentUserIdStr) return;
      const key = payload.userId.toString();
      
      if (payload.isTyping) {
        setTypingUsers((prev) => ({ ...prev, [key]: { isTyping: true, name: payload.userName } }));
        if (typingTimeoutRef.current[key]) clearTimeout(typingTimeoutRef.current[key]);
        typingTimeoutRef.current[key] = setTimeout(() => { 
          setTypingUsers((prev) => { const c = { ...prev }; delete c[key]; return c; }); 
        }, 3000);
      } else {
        if (typingTimeoutRef.current[key]) clearTimeout(typingTimeoutRef.current[key]);
        setTypingUsers((prev) => { const c = { ...prev }; delete c[key]; return c; });
      }
    };

    socket.on('receive_message', handleIncoming);
    socket.on('messages_read_broadcast', handleRead);
    socket.on('user_typing_broadcast', handleTyping);
    
    return () => { 
      socket.off('receive_message', handleIncoming); 
      socket.off('messages_read_broadcast', handleRead); 
      socket.off('user_typing_broadcast', handleTyping); 
    };
  }, [socket, isSocketConnected, isBrowserOnline, activeChannelId, currentUserIdStr]);

  return {
    directory,
    setDirectory,
    channels,
    setChannels,
    typingUsers,
    channelsFetchedRef,
    adminAudits,       
    setAdminAudits
  };
}
