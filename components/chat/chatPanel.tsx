// 📁 File: src/components/chat/chatPanel.tsx
'use client';

import React from 'react';
import { Mail, Phone, MessageSquare, X, ArrowLeft } from 'lucide-react';

// 🚀 IMPORT YOUR EXPORTED SUB-COMPONENT
import MessageInput from "./feed/messageInput" 

interface ChatPanelProps {
  partnerProfile: any;
  activeChannel: any;
  messagesList: any[];
  currentUserIdStr: string;
  typedText: string;
  // 🚀 FIXED CHANGE: Replaced setTypedText with parent onInputChange listener to catch dynamic keystrokes
  onInputChange: (text: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  onCloseChat: () => void;
  activePartnerRealName: string;
  messageEndRef: React.RefObject<HTMLDivElement | null>;
  isDark: boolean;
  isFileUploading?: boolean;
  onFileChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isOnline?: boolean;
  // 🚀 NEW PROP: Injected reactive mapping arrays from parent socket state machine
  typingUsers?: Record<string, { isTyping: boolean; name: string }>; 
}

export default function ChatPanel({
  partnerProfile,
  activeChannel,
  messagesList,
  currentUserIdStr,
  typedText,
  onInputChange,
  onSendMessage,
  onCloseChat,
  activePartnerRealName,
  messageEndRef,
  isDark,
  isFileUploading = false,
  onFileChange = () => {},
  isOnline = true,
  typingUsers = {} // Default allocation helper boundary fallback
}: ChatPanelProps) {
  
  if (!partnerProfile || !activeChannel) {
    return (
      <div className={`h-full w-full flex flex-col items-center justify-center p-8 text-center text-gray-400 text-xs font-medium transition-colors ${
        isDark ? 'bg-[#1a252e]' : 'bg-white'
      }`}>
        <MessageSquare size={18} className="mb-1.5 opacity-40" />
        <span>Select a profile row from the directory to start a chat.</span>
      </div>
    );
  }

  return (
    <div className={`h-full w-full flex flex-col justify-between overflow-hidden transition-colors ${
      isDark ? 'bg-[#1a252e]' : 'bg-white'
    }`}>
      {/* Thread Sub-Header */}
      <div className={`p-4 border-b flex items-center justify-between shrink-0 ${
        isDark ? 'border-zinc-800' : 'border-gray-100'
      }`}>
        <div className="flex items-center gap-2">
          <button onClick={onCloseChat} className={`md:hidden p-1 rounded-lg ${isDark ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-gray-100 text-gray-500'}`}>
            <ArrowLeft size={16} />
          </button>
          <div>
            <h3 className={`text-xs font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Chat</h3>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">ID Ref: #{activeChannel._id?.substring(18)}</p>
          </div>
        </div>
        <button onClick={onCloseChat} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          <X size={14} />
        </button>
      </div>

      {/* Member Target Profile Card */}
      <div className={`p-4 text-center border-b shrink-0 ${
        isDark ? 'bg-zinc-800/20 border-zinc-800' : 'bg-gray-50/50 border-gray-50'
      }`}>
        <div className="h-10 w-10 rounded-full bg-[#ffed90] mx-auto flex items-center justify-center font-black text-xs text-neutral-900 border border-amber-200 shadow-2xs mb-1 uppercase">
          {activePartnerRealName.charAt(0) || 'U'}
        </div>
        <h4 className={`text-xs font-black truncate px-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{activePartnerRealName}</h4>
        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{partnerProfile.role || 'user'}</p>
      </div>

      {/* Message Feed Canvas */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-3.5 flex flex-col ${
        isDark ? 'bg-zinc-950/20' : 'bg-gray-50/20'
      }`}>
        {messagesList.length === 0 ? (
          <div className="my-auto text-center p-6 text-gray-400 text-[10px] font-medium leading-relaxed">
            Link authorized. Type a message below to begin.
          </div>
        ) : (
          messagesList.map((msg: any, idx: number) => {
            const messageSenderIdStr = (msg.senderId || msg.sender?._id || msg.sender?.id || '').toString();
            const normalizedCurrentUserId = (currentUserIdStr || '').toString();
            const isMe = messageSenderIdStr === normalizedCurrentUserId;
            const messageBodyText = msg.text || msg.messageBody || msg.message || '';
            
            // 🚀 REAL-TIME TIMESTAMP COMPILING LOGIC
            const messageCreatedAtString = msg.createdAt || msg.timestamp;
            const formattedTimeLabel = messageCreatedAtString 
              ? new Date(messageCreatedAtString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
              : '';

            return (
              <div key={msg._id || idx} className={`flex flex-col w-full ${isMe ? 'items-end' : 'items-start'}`}>
                <div className={`p-3 rounded-2xl text-[11px] font-medium leading-relaxed max-w-[85%] border shadow-2xs ${
                  isMe 
                    ? isDark 
                      ? 'bg-zinc-100 border-zinc-200 text-black rounded-tr-none font-bold'
                      : 'bg-neutral-900 border-neutral-950 text-white rounded-tr-none' 
                    : isDark
                      ? 'bg-zinc-800 border-zinc-700/60 text-white rounded-tl-none'
                      : 'bg-white border-gray-100 text-gray-800 rounded-tl-none'
                }`}>
                  <p className="whitespace-pre-wrap">{messageBodyText}</p>
                </div>
                
                {/* 🚀 TELEMETRY STAMPS BOTTOM SUB-BAR CONTAINER: Displays timestamps & read updates */}
                <div className="flex items-center gap-1.5 mt-1 text-[8px] font-bold text-gray-400 dark:text-zinc-500 select-none px-1">
                  <span>{formattedTimeLabel}</span>
                  {isMe && (
                    <span className={`font-black transition-colors ${msg.isRead ? 'text-blue-500 dark:text-blue-400' : 'text-gray-300 dark:text-zinc-600'}`}>
                      {msg.isRead ? "✓✓ Read" : "✓ Sent"}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messageEndRef} />
      </div>

    
      {Object.keys(typingUsers).length > 0 && (
        <div className={`px-4 py-2 text-[9px] font-black italic tracking-wide animate-pulse border-t shrink-0 ${
          isDark ? 'bg-zinc-900/60 border-zinc-800 text-zinc-400' : 'bg-gray-50 border-gray-100 text-gray-400'
        }`}>
          {Object.values(typingUsers).map(u => u.name).join(', ')} is typing...
        </div>
      )}

      {/* FOOT CONTAINER PANEL WITH INTEGRATED MESSAGEINPUT SUB-COMPONENT */}
      <div className={`p-3 border-t shrink-0 ${
        isDark ? 'bg-[#1a252e] border-zinc-800' : 'bg-white border-gray-100'
      }`}>
        <MessageInput 
          typedText={typedText}
          // 🚀 FIXED ACTION HANDLER: Pipe textValue shifts back into parent telemetry observers
          setTypedText={onInputChange} 
          isFileUploading={isFileUploading}
          isOnline={isOnline}
          onSendMessage={onSendMessage}
          onFileChange={onFileChange}
        />
      </div>
    </div>
  );
}
