// 📁 File: src/components/chat/feed/MessageBubble.tsx
'use client';

import React from 'react';
import { Download, FileText, Clock, Check } from 'lucide-react';

interface MessageBubbleProps {
  msg: any;
  user: any;
  baseURL: string;
  formatTime: (isoString?: string) => string;
  activeChannel?: any; // 🚀 Added to inspect the channel's user context rosters
}

export default function MessageBubble({ msg, user, baseURL, formatTime, activeChannel }: MessageBubbleProps) {
  const isMe = user ? (msg.senderId === user.id || msg.senderId === user._id) : false;
  const fileAttachment = msg.fileAttachment || msg.attachments?.[0];
  const nativeIsoTimestamp = msg.createdAt || msg.timestamp;

  // 🚀 DYNAMIC SENDER IDENTITY RESOLUTION
  // Extract details directly from the message payload object, falling back to activeChannel structures
  const senderName = isMe 
    ? (user?.name || 'You') 
    : (msg.senderName || msg.sender?.name || activeChannel?.recipient?.name || activeChannel?.initiator?.name || 'Workspace User');

  const senderRole = isMe 
    ? (user?.role || 'CUSTOMER') 
    : (msg.senderRole || msg.sender?.role || activeChannel?.recipient?.role || activeChannel?.initiator?.role || 'PARTICIPANT');

  return (
    <div className={`flex flex-col w-full ${isMe ? 'items-end' : 'items-start'}`}>
      
      {/* 🚀 NEW: HEADER INFO ROW (Displays specific message sender profile name and role badge above the bubble) */}
      <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] select-none font-bold tracking-tight">
        <span className="text-gray-700 dark:text-zinc-300 capitalize">{senderName}</span>
       
      </div>

      <div className={`p-4 rounded-2xl text-xs font-medium border leading-relaxed shadow-xs space-y-2 relative max-w-md ${
        isMe
          ? 'bg-neutral-900 border-neutral-950 text-white dark:bg-white dark:border-white dark:text-black rounded-tr-none'
          : 'bg-white border-gray-100 text-gray-800 dark:bg-zinc-900 dark:border-zinc-800/60 dark:text-zinc-200 rounded-tl-none'
      }`}>
        
        <p className="whitespace-pre-wrap">{msg.text || msg.messageBody}</p>

        {fileAttachment && (
          (() => {
            const isImage = fileAttachment.mimetype?.startsWith('image/') || fileAttachment.type?.startsWith('image/');
            const downloadUrl = `${baseURL}${fileAttachment.url}`;
            const fileName = fileAttachment.filename || fileAttachment.name;

            if (isImage) {
              return (
                <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 max-w-xs mt-2 animate-fadeIn">
                  <img src={downloadUrl} alt={fileName} className="w-full h-auto object-cover max-h-60" />
                  <div className="p-2 flex items-center justify-between bg-white/5 backdrop-blur-xs text-[10px]">
                    <span className="truncate font-mono max-w-[150px]">{fileName}</span>
                    <a href={downloadUrl} download target="_blank" rel="noreferrer" className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg text-inherit">
                      <Download size={12} />
                    </a>
                  </div>
                </div>
              );
            }

            return (
              <div className="flex items-center gap-3 p-3 bg-gray-50/50 dark:bg-zinc-950/40 border border-gray-100 dark:border-zinc-800 rounded-xl min-w-[240px] mt-2 animate-fadeIn">
                <div className="h-9 w-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <FileText size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate text-gray-900 dark:text-white">{fileName}</p>
                  <p className="text-[10px] text-gray-400">
                    {fileAttachment.size ? `${(fileAttachment.size / 1024).toFixed(1)} KB` : 'Secure Document'}
                  </p>
                </div>
                <a href={downloadUrl} download target="_blank" rel="noreferrer" className="p-2 bg-white dark:bg-zinc-900 hover:bg-gray-100 border dark:border-zinc-700/60 rounded-xl text-gray-500 shrink-0">
                  <Download size={12} />
                </a>
              </div>
            );
          })()
        )}
      
        {isMe && (
          <div className="absolute -bottom-4 right-1 flex items-center text-[9px] font-bold text-gray-400 dark:text-zinc-500 gap-1 select-none">
            {msg.isOfflinePending ? (
              <>
                <Clock size={10} className="text-amber-500 animate-spin" />
                <span className="text-amber-500">Offline Pending</span>
              </>
            ) : (
              <>
                <Check size={10} className="text-emerald-500" />
                <span>Sent</span>
              </>
            )}
          </div>
        )}

        {nativeIsoTimestamp && (
          <div className={`flex items-center justify-end gap-1 text-[9px] mt-1 select-none font-medium tracking-tight transition-colors ${
            isMe ? 'text-zinc-400 dark:text-gray-500' : 'text-gray-400 dark:text-zinc-500'
          }`}>
            <span>{formatTime(nativeIsoTimestamp)}</span>
          </div>
        )}

      </div>
    </div>
  );
}
