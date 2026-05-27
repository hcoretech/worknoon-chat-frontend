'use client';

import { useState } from 'react';
import { useAuth } from "../../../context/authContext";
import Cookies from 'js-cookie';
import { Mail, Lock, User, Shield, ArrowRight, Layers } from 'lucide-react';
import axios from "axios"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'customer' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  

  const { loginSession } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Dynamic endpoint target mapping matching your Express server logic
    const endpoint = `http://localhost:9000/api/auth/${isLogin ? 'login' : 'signup'}`;

    
    try {

      const res = await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log(res)
      const token = res.data.token;
      const userData = res.data.user;

      // Secure cross-route session cookies mapping lifecycle logic
      Cookies.set('token', token, { expires: 7, secure: true, sameSite: 'strict' });
      
      loginSession({
        id: userData.id || userData._id,
        name: userData.fullName || userData.name,
        email: userData.email,
        role: userData.role,
        token: token
      });
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'The authorization workstation handshake timed out.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-6 font-sans antialiased text-[#1A1C1E]">
      
      {/* CENTRAL AUTHENTICATION CONTAINER WINDOW */}
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-[32px] p-10 shadow-sm transition-all relative">
        
        {/* DESIGN MATRIX BRAND HEADER */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="h-12 w-12 bg-neutral-900 text-white rounded-2xl flex items-center justify-center font-bold text-xl mb-4 shadow-sm">
            <Layers size={20} />
          </div>
          <h1 className="text-xl font-black tracking-tight text-[#0F1115]">
            {isLogin ? 'Welcome back' : 'Create profile'}
          </h1>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Access the decentralized ecommerce operation deck
          </p>
        </div>

        {/* ERROR BOUNDARY ELEMENT */}
        {error && (
          <div className="mb-5 p-4 text-xs font-semibold text-rose-600 bg-rose-50/50 rounded-xl border border-rose-100/70 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
            <span>{error}</span>
          </div>
        )}

        {/* DYNAMIC FORMS MATRIX ROUTER */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* REGISTER ACCOUNT NAME INTERFACE ROW */}
          {!isLogin && (
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  required 
                  placeholder="John Carter"
                  className="w-full text-xs font-medium rounded-xl pl-11 pr-4 py-3.5 bg-[#F3F4F6] border-0 focus:ring-1 focus:ring-neutral-900 text-[#0F1115] placeholder-gray-400" 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                />
              </div>
            </div>
          )}

          {/* SYSTEM EMAIL VERIFICATION INTERFACE ROW */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="email" 
                required 
                placeholder="john@ouraplatform.com"
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
                type="password" 
                required 
                placeholder="••••••••"
                className="w-full text-xs font-medium rounded-xl pl-11 pr-4 py-3.5 bg-[#F3F4F6] border-0 focus:ring-1 focus:ring-neutral-900 text-[#0F1115] placeholder-gray-400" 
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
              />
            </div>
          </div>

          {/* OMNICHANNEL SELECTION MATRIX PROFILE LAYOUT */}
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
                  {['customer', 'designer', 'merchant', 'agent'].map(r => (
                    <option key={r} value={r} className="font-semibold text-xs">{r}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* PROCESS EXECUTION INTERACTION ELEMENT */}
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-4 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl transition shadow-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Verifying...' : isLogin ? 'Open Desktop Environment' : 'Initialize Workstation'}</span>
            {!isSubmitting && <ArrowRight size={14} />}
          </button>
        </form>

        {/* VIEW ROUTING SEPARATION CONTROL TOGGLE */}
        <p className="text-center text-xs font-semibold text-gray-400 pt-2">
          {isLogin ? "Don't have an account profile?" : 'Already registered within workspace?'}
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }} 
            className="text-[#0F1115] font-black underline ml-1.5 hover:text-neutral-700 transition"
          >
            {isLogin ? 'Register one here' : 'Sign in directly'}
          </button>
        </p>

      </div>
    </div>
  );
}
