'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Radio, Layers, Zap, Flame, RefreshCw, Users, Server, MessageSquare } from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const cached = localStorage.getItem('user');
    if (cached) {
      const parsedUser = JSON.parse(cached);
      // Guard Check: Auto-eject non-agents or non-admin mock roles from view access
      if (parsedUser.role !== 'agent') {
        router.push('/chat');
      }
    } else {
      router.push('/auth');
    }
  }, [router]);

  const runTelemetryRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const metrics = [
    { title: 'Active Live Socket Channels', val: '4,281', change: '+12.4%', status: 'emerald', desc: 'Active connections on nodes', icon: Radio },
    { title: 'Redis Pub/Sub Memory Depth', val: '12 msgs', change: 'Stable', status: 'indigo', desc: 'Asynchronous buffer state', icon: Layers },
    { title: 'DB Worker Write Pipeline Delay', val: '4ms', change: 'Optimal', status: 'emerald', desc: 'Bulk Write Execution Window', icon: Zap },
    { title: 'Failed Chat Packet Drop Ratio', val: '0.012%', change: '-0.04%', status: 'rose', desc: 'Network transaction failures', icon: Flame }
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 dark:bg-zinc-950 p-4 lg:p-8 space-y-6 transition-colors duration-200">
      
      {/* Action Admin Heading Dashboard Bar Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center space-x-2">
            <Shield className="text-indigo-600" size={20} />
            <span>Chat Telemetry Dashboard</span>
          </h1>
          <p className="text-xs text-gray-400 font-semibold tracking-wide mt-0.5">Real-time infrastructure performance log stream monitor</p>
        </div>
        
        <button
          onClick={runTelemetryRefresh}
          disabled={isRefreshing}
          className="self-start sm:self-center px-4 py-2.5 bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 text-xs font-bold rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 flex items-center space-x-2 transition disabled:opacity-50"
        >
          <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
          <span>{isRefreshing ? 'Querying Adapter...' : 'Refresh Metrics Logs'}</span>
        </button>
      </div>

      {/* Grid Dashboard Metric Cells */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((card, i) => {
          const Icon = card.icon;
          const statusColors = card.status === 'emerald' ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' :
                               card.status === 'rose' ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/30' : 
                               'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30';
          return (
            <div key={i} className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <h4 className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider max-w-[80%]">{card.title}</h4>
                <div className={`p-2 rounded-xl ${statusColors}`}>
                  <Icon size={16} />
                </div>
              </div>
              <div>
                <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{card.val}</p>
                <div className="flex items-center space-x-1.5 mt-1">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                    card.status === 'rose' ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                  }`}>{card.change}</span>
                  <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-medium truncate">{card.desc}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sub Node Information: Server Instances Allocation Matrix & Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Live Server Worker Nodes */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center space-x-2">
            <Server size={16} className="text-gray-400" />
            <span>Horizontal Cluster Node Allocation</span>
          </h3>
          <div className="divide-y divide-gray-50 dark:divide-zinc-800/60 text-sm font-semibold text-gray-700 dark:text-zinc-300">
            {['chat-node-us-east-1', 'chat-node-us-east-2', 'chat-node-eu-west-1'].map((node, index) => (
              <div key={index} className="py-3 flex items-center justify-between">
                <span className="font-mono text-xs">{node}</span>
                <div className="flex items-center space-x-4">
                  <span className="text-xs text-gray-400">Memory Load: {(32 + index * 12)}%</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                </div>
              </div>
            ))}
          </div>
        </div>

      
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center space-x-2">
            <MessageSquare size={16} className="text-gray-400" />
            <span>Active Channel Events Log</span>
          </h3>
          <div className="space-y-3 font-mono text-[10px] leading-relaxed text-gray-400 dark:text-zinc-500">
            <p><span className="text-indigo-500">[WS_ADAPTER]</span> Broadcasted 'typing_broadcast' payload down room_id conv_0291</p>
            <p><span className="text-emerald-500">[DB_WORKER]</span> Bulk execution written: 42 text models persisted successfully.</p>
            <p><span className="text-amber-500">[REDIS_SYNC]</span> Node state synchronization complete for client reference.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
