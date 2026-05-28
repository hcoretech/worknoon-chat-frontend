'use client';

import React, { useState } from 'react';
import { useAuth } from "../../../context/authContext";
import Cookies from 'js-cookie';
import { Mail, Lock, User, Shield, ArrowRight, Layers, Key, Badge } from 'lucide-react';
import axios from "axios";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    role: 'customer',
    employeeId: '',       
    securityPasscode: ''   
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { loginSession } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const chosenRole = formData.role.toLowerCase();
    if (!isLogin && (chosenRole === 'admin')) {
      if (!formData.employeeId.trim()) {
        setError('Verification Blocked: Employee ID is strictly required for administrative accounts.');
        return;
      }
      
 
      if (formData.securityPasscode !== '1234') {
        setError('Verification Failure: Security Passcode Key is invalid or has expired.');
        return;
      }



    }

    setIsSubmitting(true);
    const endpoint = `http://localhost:9000/api/auth/${isLogin ? 'login' : 'signup'}`;

    try {
      const res = await axios.post(endpoint, formData, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      const token = res.data.token;
      const userData = res.data.user;

      Cookies.set('token', token, { expires: 7, secure: true, sameSite: 'strict' });
      
      loginSession({
        id: userData.id || userData._id,
        name: userData.fullName || userData.name,
        email: userData.email,
        role: userData.role,
        token: token,
        '': undefined
      });
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'The authorization workstation handshake timed out.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine if the currently highlighted role requires special details
  const requiresElevatedPrivileges = !isLogin && (formData.role === 'admin' );

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-6 font-sans antialiased text-[#1A1C1E]">
      
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-[32px] p-10 shadow-sm transition-all relative">
        

        <div className="flex flex-col items-center mb-8 text-center">
          <div className="h-12 w-12 bg-neutral-900 text-white rounded-2xl flex items-center justify-center font-bold text-xl mb-4 shadow-sm">
            <Layers size={20} />
          </div>
          <h1 className="text-xl font-black tracking-tight text-[#0F1115]">
            {isLogin ? 'Welcome back' : 'Create profile'}
          </h1>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Worknoon
          </p>
        </div>

  
        {error && (
          <div className="mb-5 p-4 text-xs font-semibold text-rose-600 bg-rose-50/50 rounded-xl border border-rose-100/70 flex items-center gap-2 animate-fadeIn">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          

          {!isLogin && (
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" required placeholder="henry anthony"
                  className="w-full text-xs font-medium rounded-xl pl-11 pr-4 py-3.5 bg-[#F3F4F6] border-0 focus:ring-1 focus:ring-neutral-900 text-[#0F1115] placeholder-gray-400" 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                />
              </div>
            </div>
          )}

          {/* EMAIL ADDRESS INPUT ROW */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="email" required placeholder="worknoon@gmail.com"
                className="w-full text-xs font-medium rounded-xl pl-11 pr-4 py-3.5 bg-[#F3F4F6] border-0 focus:ring-1 focus:ring-neutral-900 text-[#0F1115] placeholder-gray-400" 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
              />
            </div>
          </div>

          {/* PASSWORD ENTRY BLOCK */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Password Key</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="password" required placeholder="••••••••"
                className="w-full text-xs font-medium rounded-xl pl-11 pr-4 py-3.5 bg-[#F3F4F6] border-0 focus:ring-1 focus:ring-neutral-900 text-[#0F1115] placeholder-gray-400" 
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
              />
            </div>
          </div>

          {/* ACCOUNT ROLE CONTEXT DROPDOWN SELECTOR */}
          {!isLogin && (
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Account Role Context</label>
              <div className="relative">
                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <select 
                  className="w-full text-xs font-bold rounded-xl pl-11 pr-8 py-3.5 bg-[#F3F4F6] border-0 focus:ring-1 focus:ring-neutral-900 text-[#0F1115] capitalize appearance-none cursor-pointer"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  {['customer', 'designer', 'merchant', 'agent', 'admin'].map(r => (
                    <option key={r} value={r} className="font-semibold text-xs">{r}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

   
          {requiresElevatedPrivileges && (
            <div className="space-y-4 pt-2 border-t border-gray-100 p-4 bg-amber-50/40 rounded-2xl border border-amber-100/60 animate-slideDown">
              <p className="text-[10px] font-bold text-amber-800 tracking-wide uppercase">⚠️ Security Authorization Required</p>
              

              <div>
                <label className="block text-[9px] font-bold text-amber-700/80 uppercase tracking-wider mb-1">Official Employee ID</label>
                <div className="relative">
                  <Badge className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-600/70" size={14} />
                  <input 
                    type="text" required placeholder="WORKNOON_ID_USERNAME"
                    className="w-full text-xs font-semibold rounded-xl pl-9 pr-4 py-2.5 bg-white border border-amber-200 focus:ring-1 focus:ring-amber-500 text-gray-900 placeholder-amber-700/30"
                    value={formData.employeeId}
                    onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                  />
                </div>
              </div>


              <div>
                <label className="block text-[9px] font-bold text-amber-700/80 uppercase tracking-wider mb-1">System Security Passcode</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-600/70" size={14} />
                  <input 
                    type="password" required placeholder="WORKNOON_ID_PASSWORD"
                    className="w-full text-xs font-semibold rounded-xl pl-9 pr-4 py-2.5 bg-white border border-amber-200 focus:ring-1 focus:ring-amber-500 text-gray-900 placeholder-amber-700/30"
                    value={formData.securityPasscode}
                    onChange={(e) => setFormData({...formData, securityPasscode: e.target.value})}
                  />
                </div>
              </div>
            </div>
          )}


          <button 
            type="submit" disabled={isSubmitting}
            className="w-full py-4 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl transition shadow-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Verifying...' : isLogin ? 'login' : 'signup'}</span>
            {!isSubmitting && <ArrowRight size={14} />}
          </button>
        </form> 


        <p className="text-center text-xs font-semibold text-gray-400 pt-4">
          {isLogin ? "Don't have an account profile?" : 'Already registered within worknoon?'}
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); }} 
            className="text-[#0F1115] font-black underline ml-1.5 hover:text-neutral-700 transition"
          >
            {isLogin ? 'Register ' : 'Sign in '}
          </button>
        </p>

      </div>
    </div>
  );
}
