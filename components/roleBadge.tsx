'use client';

import React from 'react';


export type UserRole = 'agent' | 'designer' | 'merchant' | 'customer';

interface RoleBadgeProps {

  role: UserRole | string | string[];
}

export function RoleBadge({ role }: RoleBadgeProps) {

  let normalizedRole: string = 'customer';

  if (Array.isArray(role)) {
 
    normalizedRole = role[role.length - 1] || 'customer';
  } else if (typeof role === 'string') {
    normalizedRole = role.toLowerCase().trim();
  }


  const colorSchemes: Record<string, string> = {
    agent: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/40',
    designer: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border-purple-200/50 dark:border-purple-800/40',
    merchant: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/40',
    customer: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 border-indigo-200/50 dark:border-indigo-800/40',
  };

  const currentStyle = colorSchemes[normalizedRole] || colorSchemes.customer;

  return (
    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border transition-colors duration-150 shrink-0 ${currentStyle}`}>
      {normalizedRole}
    </span>
  );
}
