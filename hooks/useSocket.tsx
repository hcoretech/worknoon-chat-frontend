'use client';

import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export function useSocket(token: string | null) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) {
      setIsSocketConnected(false);
      return;
    }

    const socketInstance = io(process.env.NEXT_PUBLIC_CHAT_URL || 'http://localhost:9000', {
      auth: { token },
      transports: ['websocket','polling'],
      autoConnect: true,
      reconnectionAttempts: Infinity, // 🟢 Keep retrying indefinitely while offline
      reconnectionDelay: 2000,
    });

    socketRef.current = socketInstance;
    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      setIsSocketConnected(true);
      console.log('Real-time connection pipeline active.');
    });

    socketInstance.on('disconnect', () => {
      setIsSocketConnected(false);
    });

    socketInstance.on('connect_error', () => {
      setIsSocketConnected(false);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [token]);

  return { socket, isSocketConnected };
}
