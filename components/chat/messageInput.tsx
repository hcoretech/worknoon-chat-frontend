// 📁 File: src/components/chat/feed/MessageInput.tsx
'use client';

import React, { useRef } from 'react';
import { Loader2, Paperclip, Send } from 'lucide-react';

interface MessageInputProps {
  typedText: string;
  setTypedText: (text: string) => void;
  isFileUploading: boolean;
  isOnline: boolean;
  onSendMessage: (e: React.FormEvent) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function MessageInput({
  typedText,
  setTypedText,
  isFileUploading,
  isOnline,
  onSendMessage,
  onFileChange,
}: MessageInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <form onSubmit={onSendMessage} className="flex items-center gap-3">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={onFileChange} 
        className="hidden" 
        accept="image/*,application/pdf,.zip,.rar" 
      />
      
      <button 
        type="button" 
        disabled={isFileUploading || !isOnline}
        onClick={() => fileInputRef.current?.click()} 
        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition-colors disabled:opacity-40 shrink-0"
      >
        {isFileUploading ? <Loader2 size={16} className="animate-spin text-indigo-500" /> : <Paperclip size={16} />}
      </button>

      <input 
        type="text" 
        value={typedText}
        disabled={isFileUploading}
        onChange={(e) => setTypedText(e.target.value)}
        placeholder={
          isFileUploading 
            ? "Processing background attachment..." 
            : isOnline 
            ? "Type your message details..." 
            : "Working offline... messages will queue to sync"
        } 
        className="flex-1 text-xs font-medium py-2.5 focus:outline-none bg-transparent disabled:opacity-50 text-gray-900 dark:text-white"
      />
      
      <button 
        type="submit" 
        disabled={isFileUploading || !typedText.trim()} 
        className="h-9 w-9 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-black flex items-center justify-center rounded-xl transition-all shadow-sm shrink-0 disabled:opacity-40"
      >
        <Send size={14} />
      </button>
    </form>
  );
}
