'use client';

import React, { useState, useEffect, useRef } from 'react';

import { Send, Paperclip, AlertCircle, ShoppingBag, WifiOff, FileText, CheckCheck } from 'lucide-react';


export default function ChatPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isOnline, setIsOnline] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;


  useEffect(() => {
    const cached = localStorage.getItem('user');
    if (cached) setCurrentUser(JSON.parse(cached));


    const updateOfflineState = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', updateOfflineState);
    window.addEventListener('offline', updateOfflineState);
    
    const loadInbox = async () => {
     
    };
    
    loadInbox();
    return () => {
      window.removeEventListener('online', updateOfflineState);
      window.removeEventListener('offline', updateOfflineState);
    };
  }, []);


  useEffect(() => {
    if (!activeChat) return;

    const loadLogs = async () => {
     
    };

    loadLogs();

  
  
  }, [activeChat,  currentUser]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, typingUser]);

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);

  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
 
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
   
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-zinc-950 p-4 lg:p-6 transition-colors duration-200">
      
      {/* ⚠️ Dynamic Offline Network Status Banner Trigger Fallback */}
      {(!isOnline ) && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-amber-500 text-white px-4 py-2.5 rounded-full text-xs font-bold shadow-lg flex items-center space-x-2 border border-amber-400 animate-bounce">
          <WifiOff size={14} />
          <span>Offline Fallback Active: Real-time connections are down. Messaging will synchronize when connection recovers.</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 w-full h-full gap-6">
        
        {/* Left Column Stack: Inbox & Users Channel Registry */}
        <div className="md:col-span-1 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl shadow-sm flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
            <div>
              <h2 className="text-base font-black text-gray-900 dark:text-white tracking-tight">Inbox Workspace</h2>
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mt-0.5">{currentUser?.name} ({currentUser?.role})</p>
            </div>
            {/* <ThemeToggle /> */}
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-1 bg-gray-50/50 dark:bg-zinc-900/30">
            {conversations.map((chat) => (
              <button key={chat._id} onClick={() => setActiveChat(chat)} className={`w-full text-left px-4 py-3.5 rounded-2xl flex items-center justify-between group transition-all duration-200 ${
                activeChat?._id === chat._id ? 'bg-neutral-900 dark:bg-white text-white dark:text-black shadow-md' : 'hover:bg-gray-100/70 dark:hover:bg-zinc-800 text-gray-600 dark:text-zinc-400'
              }`}>
                <div className="truncate pr-2">
                  <p className={`text-sm font-bold truncate ${activeChat?._id === chat._id ? 'text-white dark:text-black' : 'text-gray-900 dark:text-zinc-100'}`}>Room Channel Code</p>
                  <p className="text-[11px] font-semibold opacity-60 truncate mt-0.5 capitalize">{chat.contextType.replace(/-/g, ' ')}</p>
                </div>
             {/* <RoleBadge role={chat.contextType.split('-')[2] || 'agent'} /> */}
              </button>
            ))}
          </div>
        </div>

     
        <div className="md:col-span-2 flex flex-col h-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl shadow-sm overflow-hidden">
          {activeChat ? (
            <>
              <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <h3 className="font-bold text-sm text-gray-900 dark:text-white capitalize">{activeChat.contextType.replace(/-/g, ' ')} Thread</h3>
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-0.5">Socket Sync Room Connected</p>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-gray-50/30 dark:bg-zinc-950/20">
                {messages.map((msg: any, idx) => {
                  const isMe = msg.senderId === currentUser?.id;
                  return (
                    <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-sm leading-relaxed ${
                        isMe ? 'bg-neutral-900 dark:bg-white text-white dark:text-black rounded-tr-none' : 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 rounded-tl-none border border-gray-100/70 dark:border-zinc-700/50'
                      }`}>
                        {!isMe && <p className="text-[9px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-0.5">{msg.senderName}</p>}
                        <p>{msg.text}</p>
                        
                        {msg.fileAttachment && (
                          <a href={`http://localhost:9000${msg.fileAttachment.url}`} download target="_blank" rel="noreferrer" className="flex items-center space-x-2 mt-2 p-2 bg-black/5 dark:bg-white/10 rounded-xl text-xs border border-black/5 dark:border-white/5">
                            <FileText size={14} />
                            <span className="underline font-bold truncate max-w-[180px]">{msg.fileAttachment.filename}</span>
                          </a>
                        )}

                        <div className="flex items-center justify-end space-x-1 mt-1.5 opacity-60 text-[9px] font-bold">
                          <span>{new Date(msg.timestamp || msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          {/* {isMe && <CheckCheck size={11} />} */}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {typingUser && (
                  <div className="flex justify-start animate-pulse">
                    <div className="bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 rounded-2xl rounded-bl-none px-4 py-2 text-xs font-medium">
                      {typingUser} is typing...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Despatcher Form Input Bar Layout */}
              <form onSubmit={handleSend} className="p-4 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 flex items-center space-x-3">
                <input 
                  type="file" 
                //   ref={fileInputRef} 
                  onChange={handleUpload} 
                  className="hidden" 
                  id="chat-file-upload" 
                  accept="image/*,application/pdf,.doc,.docx"
                />
                
                <button 
                  type="button" 
                //   disabled={isUploading} 
                //   onClick={() => fileInputRef.current?.click()} 
                  className="p-3 bg-gray-50 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-700 transition rounded-xl disabled:opacity-50"
                  title="Upload attachment"
                >
                  {/* {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Paperclip size={18} />} */}
                </button>

                <input 
                  type="text" 
                  value={input} 
                  onChange={handleTyping} 
                  placeholder="Type your message here..." 
                  className="flex-1 bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />

                <button 
                  type="submit" 
                //   disabled={!input.trim() || isUploading} 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl transition shadow-md shadow-indigo-600/20 disabled:opacity-40 disabled:hover:bg-indigo-600"
                >
                  <Send size={18} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50/10 dark:bg-zinc-950/10">
              <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-gray-400 mb-3">
                <Send size={24} />
              </div>
              <h3 className="font-bold text-sm text-gray-900 dark:text-white">Workspace Session Empty</h3>
              <p className="text-xs text-gray-400 max-w-xs mt-1">
                Select a conversational interface target channel room from your left inbox folder matrix to initiate communication streaming syncs.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
