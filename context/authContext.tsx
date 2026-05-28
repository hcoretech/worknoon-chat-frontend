
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export type UserRole = 'customer' | 'designer' | 'merchant' | 'agent'|'admin';

interface AuthUserData {
  _id?:string;
  fullName?:string
  id: string;
  name: string;
  email: string;''
  role: UserRole;
  token: string;
}

interface AuthContextType {
  user: AuthUserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginSession: (userData: AuthUserData) => void;
  logoutSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkActiveSession = () => {
      const savedSession = Cookies.get('token');
      if (savedSession) {
        try {
          setUser(JSON.parse(savedSession));
        } catch (err) {
          Cookies.remove('token');
        }
      }
      setIsLoading(false);
    };
    checkActiveSession();
  }, []);

  const loginSession = (userData: AuthUserData) => {
    Cookies.set('token', JSON.stringify(userData), { 
      expires: 7, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict' 
    });
    setUser(userData);
    router.push('/dashboard');
  };

  const logoutSession = () => {
    Cookies.remove('token');
    setUser(null);
    router.push('/auth');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, loginSession, logoutSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth execution requires layout encapsulation inside an AuthProvider element.');
  return context;
};
