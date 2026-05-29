
'use client';

import React from 'react';
import { WifiOff } from 'lucide-react';

interface NetworkBannerProps {
  isBrowserOnline: boolean;
}

export default function NetworkBanner({ isBrowserOnline }: NetworkBannerProps) {
  if (isBrowserOnline) return null;

  return (
    <div className="absolute top-0 left-0 w-full bg-red-600 dark:bg-red-700 text-white text-[10px] font-black py-1.5 px-4 flex items-center justify-center gap-1.5 z-50 tracking-wider select-none shadow-md">
      <WifiOff size={12} className="animate-pulse" /> 
      <span>WORKNOON DISCONNECTED • CHECK NETWROK CONNECTION </span>
    </div>
  );
}
