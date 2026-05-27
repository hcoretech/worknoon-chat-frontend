'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/authContext';
import api from '../../lib/axios';
import { 
  Users, Shield, Store, Palette, UserCircle, 
  Search, RefreshCw, Mail, ArrowLeft, LogOut 
} from 'lucide-react';

interface UserRecord {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'merchant' | 'designer' | 'agent';
}

export default function AdminDashboardPage() {
  const { user, logoutSession } = useAuth();
  const router = useRouter();
  
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Enforce strict client-side role validation
  useEffect(() => {
    if (user && user.role !== 'agent') {
      router.replace('/dashboard'); // Kick non-privileged users out immediately
    }
  }, [user, router]);

  // 2. Load Ecosystem Directory via Axios
  useEffect(() => {
    const fetchPlatformUsers = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/api/admin/users');
        setUsers(response.data);
      } catch (error) {
        console.error("Administrative directory sync failed:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user && user.role === 'agent') {
      fetchPlatformUsers();
    }
  }, [user]);

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user || user.role !== 'agent') return null;

  return (
    <div className="min-h-screen w-screen bg-[#F8F9FA] dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 font-sans antialiased p-8 overflow-y-auto transition-colors duration-200">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* TOP ADMINISTRATIVE TOP BAR CONTROL BAR */}
        <header className="flex justify-between items-center bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/60 p-6 rounded-3xl shadow-xs">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/dashboard')}
              className="p-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700/50 text-gray-500 dark:text-zinc-400 rounded-xl hover:bg-gray-100 transition-all"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <h1 className="text-base font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                <Users size={18} className="text-indigo-600 dark:text-indigo-400" />
                <span>System Administration Management Console</span>
              </h1>
              <p className="text-[11px] text-gray-400 dark:text-zinc-500 font-medium">Logged in as Administrator: {user.name}</p>
            </div>
          </div>
          <button onClick={logoutSession} className="p-2.5 text-gray-400 hover:text-red-500 rounded-xl transition-colors"><LogOut size={18} /></button>
        </header>

        {/* CONTROLS SEARCH SEGMENTATION CARD */}
        <div className="w-full max-w-sm relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input 
            type="text" 
            placeholder="Search account matrices..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-medium rounded-xl pl-11 pr-4 py-3.5 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/60 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white"
          />
        </div>

        {/* ALL USERS INLINE LIST LEDGER BLOCK */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/60 rounded-[32px] overflow-hidden shadow-xs">
          {isLoading ? (
            <div className="p-16 text-center flex flex-col items-center justify-center gap-3">
              <RefreshCw size={20} className="animate-spin text-gray-300" />
              <p className="text-xs text-gray-400 font-medium">Hydrating user indexes...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-16 text-center text-xs text-gray-400 dark:text-zinc-500 font-medium">No system metrics logs matching user profile tags.</div>
          ) : (
            <div className="divide-y divide-gray-50 dark:divide-zinc-800/40">
              {filteredUsers.map((account) => (
                <div key={account._id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-zinc-800/10 transition-colors">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="h-10 w-10 rounded-xl bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 border border-gray-100 dark:border-zinc-700/60 font-black text-xs flex items-center justify-center shrink-0 uppercase">
                      {account.name.charAt(0)}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      {/* 🟢 LINE 1: Complete User Metadata explicitly on the same line */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                        <h3 className="text-xs font-black text-gray-900 dark:text-white tracking-tight truncate">{account.name}</h3>
                        <div className="flex items-center gap-1.5 text-gray-400 dark:text-zinc-500 text-[11px] font-medium">
                          <Mail size={12} />
                          <span className="truncate">{account.email}</span>
                        </div>
                      </div>

                      {/* 🟢 LINE 2: Profile access roles placed inline directly on the next line down */}
                      <div className="pt-0.5">
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border inline-flex items-center gap-1.5 ${getAdminRoleStyleMatrix(account.role)}`}>
                          {getRoleIcon(account.role)}
                          <span>{account.role} Access Channel</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function getAdminRoleStyleMatrix(role: string) {
  switch (role) {
    case 'merchant': return 'bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-400';
    case 'agent': return 'bg-amber-50 border-amber-100 text-amber-600 dark:bg-amber-950/20 dark:border-amber-900/30 dark:text-amber-400';
    case 'designer': return 'bg-purple-50 border-purple-100 text-purple-600 dark:bg-purple-950/20 dark:border-purple-900/30 dark:text-purple-400';
    default: return 'bg-indigo-50 border-indigo-100 text-indigo-600 dark:bg-indigo-950/20 dark:border-indigo-900/30 dark:text-indigo-400';
  }
}

function getRoleIcon(role: string) {
  switch (role) {
    case 'merchant': return <Store size={10} />;
    case 'agent': return <Shield size={10} />;
    case 'designer': return <Palette size={10} />;
    default: return <UserCircle size={10} />;
  }
}
