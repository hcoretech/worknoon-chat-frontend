// 📁 File: src/components/chat/chatFeed.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/authContext';
import api from '../../lib/axios';

import ChatHeader from "./feed/header"
import MessageBubble from './feed/messageBubble'
import WorkflowBanner from './feed/workFlowBanner';
import MessageInput from './feed/messageInput';

interface ChatFeedProps {
  partnerProfile: any;
  activeChannel: any;
  socket: any;
  isOnline: boolean;
  formatTime: (isoString?: string) => string; // 🚀 Prop interface added for dashboard normalization
}

export default function ChatFeed({ 
  partnerProfile, 
  activeChannel, 
  socket, 
  isOnline,
  formatTime // 🚀 Destructured natively
}: ChatFeedProps) {
  const { user } = useAuth();
  const [typedText, setTypedText] = useState('');
  const [offlineQueue, setOfflineQueue] = useState<any[]>([]); 
  const [isFileUploading, setIsFileUploading] = useState(false);
  
  const messageEndRef = useRef<HTMLDivElement>(null);
  const messagesList = activeChannel?.messages || [];
  const role = partnerProfile?.role || 'user';
  const apiBaseURL = api.defaults.baseURL || 'http://localhost:9000';
  
  useEffect(() => {
    if (isOnline && offlineQueue.length > 0 && socket && activeChannel) {
      offlineQueue.forEach((msg) => {
        socket.emit('send_message', {
          channelId: activeChannel._id,
          text: msg.text,
          senderId: user?.id
        });
      });
      setOfflineQueue([]);
    }
  }, [isOnline, offlineQueue, socket, activeChannel, user]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesList]);

  const dispatchMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedText.trim() || !activeChannel) return;

    if (isOnline && socket) {
      socket.emit('send_message', {
        channelId: activeChannel._id,
        text: typedText.trim(),
        senderId: user?.id
      });
    } else {
      const newMsgPayload = {
        _id: `offline-${Date.now()}`,
        channelId: activeChannel._id,
        senderId: user?.id,
        text: typedText.trim(),
        createdAt: new Date().toISOString(),
        isOfflinePending: true 
      };
      setOfflineQueue((prev) => [...prev, newMsgPayload]);
      if (activeChannel.messages) activeChannel.messages.push(newMsgPayload);
    }
    setTypedText('');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!isOnline || !file || !socket || !activeChannel) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsFileUploading(true);
      const response = await api.post(`/api/chat/conversations/${activeChannel._id}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const attachmentData = response.data?.data?.fileAttachment || response.data?.fileAttachment;
      if (attachmentData && socket) {
        socket.emit('send_message', {
          channelId: activeChannel._id,
          text: `Shared an attachment file: ${attachmentData.filename || 'file'}`
        });
      }
    } catch (error) {
      console.error("File upload failed:", error);
    } finally {
      setIsFileUploading(false);
    }
  };

  const handleWorkflowStateToggle = () => {
    if (!socket || !activeChannel || !isOnline) return;
    let nextState = 'Processing State';
    let actionTriggered = 'Update System';

    if (role === 'designer') {
      nextState = 'Design Proof Approved';
      actionTriggered = 'Production Queue Locked';
    } else if (role === 'merchant') {
      nextState = 'Cargo Handed to Carrier';
      actionTriggered = 'Tracking Dispatched';
    } else if (role === 'agent') {
      nextState = 'Resolved Escalation';
      actionTriggered = 'Archive Support Ticket';
    }

    socket.emit('update_workflow_state', { channelId: activeChannel._id, nextState, actionTriggered });
  };

  return (
    <div className="flex-1 flex flex-col justify-between overflow-hidden h-full">
      <ChatHeader partnerProfile={partnerProfile} role={role} />

      <div className="flex-1 overflow-y-auto p-8 space-y-5 bg-gray-50/30 dark:bg-zinc-950/20">
        {messagesList.map((msg: any, idx: number) => (
          <MessageBubble 
            key={msg._id || idx} 
            msg={msg} 
            user={user} 
            baseURL={apiBaseURL} 
            formatTime={formatTime} 
             activeChannel={activeChannel} 
          />
        ))}
        <div ref={messageEndRef} />
      </div>

      <div className="p-6 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800/60 shrink-0">
        <WorkflowBanner activeChannel={activeChannel} isOnline={isOnline} role={role} onToggleState={handleWorkflowStateToggle} />
        <MessageInput 
          typedText={typedText} 
          setTypedText={setTypedText} 
          isFileUploading={isFileUploading} 
          isOnline={isOnline} 
          onSendMessage={dispatchMessage} 
          onFileChange={handleFileChange} 
        />
      </div>
    </div>
  );
}
