'use client';

import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export function useSocket(token: string | null) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Prevent execution if no auth token context exists yet
    if (!token) {
      setIsSocketConnected(false);
      return;
    }

    // Initialize Socket Instance with stateless JWT injection parameters
    const socketInstance = io(process.env.NEXT_PUBLIC_CHAT_URL || 'http://localhost:9000', {
      auth: { token },
      transports: ['websocket'], // Enforce high-performance web sockets directly
      autoConnect: true,
      reconnectionAttempts: 10,  // Bound retry thresholds
      reconnectionDelay: 2000,   // Delay reconnection intervals
    });

    socketRef.current = socketInstance;
    setSocket(socketInstance);

    // Event Bindings
    socketInstance.on('connect', () => {
      setIsSocketConnected(true);
      console.log('Real-time connection pipeline established successfully.');
    });

    socketInstance.on('disconnect', (reason) => {
      setIsSocketConnected(false);
      console.warn(`Socket disconnected. Context reason: ${reason}`);
    });

    socketInstance.on('connect_error', (error) => {
      setIsSocketConnected(false);
      console.error('Socket authentication/handshake layer exception:', error.message);
    });

    // Cleanup Lifecycle on Component Disconnection
    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, [token]);

  return { socket, isSocketConnected };
}
