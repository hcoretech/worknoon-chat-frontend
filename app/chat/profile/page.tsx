'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Shield, Mail, Key, LogOut, ShieldAlert, Award, Calendar } from 'lucide-react';


export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const cached = localStorage.getItem('user');
    if (cached) {
      setUser(JSON.parse(cached));
    } else {
      router.push('/auth');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/auth');
  };

  if (!user) return null;

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 dark:bg-zinc-950 p-4 lg:p-8 flex items-center justify-center transition-colors duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl shadow-xl overflow-hidden">
        
       
        <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600 relative">
          <div className="absolute -bottom-12 left-8">
            <div className="w-24 h-24 bg-white dark:bg-zinc-900 border-4 border-white dark:border-zinc-900 shadow-md rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-3xl">
              {user.name?.slice(0, 2).toUpperCase() || 'US'}
            </div>
          </div>
        </div>

        {/* Content Profile Data Matrix */}
        <div className="pt-16 p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 dark:border-zinc-800 pb-6">
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{user.name || 'Anonymous User'}</h1>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-0.5">Ecosystem Member Account</p>
            </div>
           
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Box Node 1 */}
            <div className="p-4 bg-gray-50 dark:bg-zinc-800/40 rounded-2xl border border-gray-100/50 dark:border-zinc-800/60 flex items-center space-x-3">
              <div className="p-2.5 bg-white dark:bg-zinc-900 text-gray-400 dark:text-zinc-500 rounded-xl shadow-sm">
                <Mail size={16} />
              </div>
              <div className="truncate">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Email Route</p>
                <p className="text-sm font-semibold text-gray-800 dark:text-zinc-200 truncate">{user.email || 'N/A'}</p>
              </div>
            </div>

            {/* Box Node 2 */}
            <div className="p-4 bg-gray-50 dark:bg-zinc-800/40 rounded-2xl border border-gray-100/50 dark:border-zinc-800/60 flex items-center space-x-3">
              <div className="p-2.5 bg-white dark:bg-zinc-900 text-gray-400 dark:text-zinc-500 rounded-xl shadow-sm">
                <Key size={16} />
              </div>
              <div className="truncate">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Platform UUID</p>
                <code className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">{user.id || 'usr_unknown'}</code>
              </div>
            </div>

            {/* Box Node 3 */}
            <div className="p-4 bg-gray-50 dark:bg-zinc-800/40 rounded-2xl border border-gray-100/50 dark:border-zinc-800/60 flex items-center space-x-3">
              <div className="p-2.5 bg-white dark:bg-zinc-900 text-gray-400 dark:text-zinc-500 rounded-xl shadow-sm">
                <Award size={16} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Access Scope Privileges</p>
                <p className="text-sm font-semibold text-gray-800 dark:text-zinc-200 capitalize">{user.role || 'customer'} Access</p>
              </div>
            </div>

            {/* Box Node 4 */}
            <div className="p-4 bg-gray-50 dark:bg-zinc-800/40 rounded-2xl border border-gray-100/50 dark:border-zinc-800/60 flex items-center space-x-3">
              <div className="p-2.5 bg-white dark:bg-zinc-900 text-gray-400 dark:text-zinc-500 rounded-xl shadow-sm">
                <Calendar size={16} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Session Pipeline Status</p>
                <span className="text-xs bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 px-2 py-0.5 font-bold rounded-md border border-emerald-100 dark:border-emerald-900/30">Active Verified</span>
              </div>
            </div>
          </div>

          {/* Action Trigger Group Block */}
          <div className="pt-4 flex justify-end">
            <button
              onClick={handleLogout}
              className="px-5 py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 dark:text-rose-400 rounded-xl text-xs font-bold border border-rose-100 dark:border-rose-900/30 shadow-sm flex items-center space-x-2 transition"
            >
              <LogOut size={14} />
              <span>Terminate Session Log Out</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
