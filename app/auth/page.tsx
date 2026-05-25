'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from "../../components/themeToggle";
import axios from 'axios';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'customer' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const URL = `http://localhost:9000/api/auth/${isLogin ? 'login' : 'signup'}`;
    
    try {
      const res = await axios.post(URL, formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      router.push('/chat');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication configuration dropped out.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-center justify-center p-4 transition-colors">
      <div className="absolute top-6 right-6"><ThemeToggle /></div>
      
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          <p className="text-xs text-gray-400 dark:text-zinc-500 font-medium mt-1">Access the worknoon messaging workspace terminal</p>
        </div>

        {error && <div className="p-3.5 text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-100 dark:border-red-900/30">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Full Name</label>
              <input type="text" required className="w-full text-sm rounded-xl px-4 py-3 bg-gray-50 dark:bg-zinc-800 border-0 focus:ring-1 focus:ring-black dark:focus:ring-white text-gray-900 dark:text-white" onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
          )}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Email Address</label>
            <input type="email" required className="w-full text-sm rounded-xl px-4 py-3 bg-gray-50 dark:bg-zinc-800 border-0 focus:ring-1 focus:ring-black dark:focus:ring-white text-gray-900 dark:text-white" onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Password</label>
            <input type="password" required className="w-full text-sm rounded-xl px-4 py-3 bg-gray-50 dark:bg-zinc-800 border-0 focus:ring-1 focus:ring-black dark:focus:ring-white text-gray-900 dark:text-white" onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Account Role Profile</label>
              <select className="w-full text-sm rounded-xl px-4 py-3 bg-gray-50 dark:bg-zinc-800 border-0 focus:ring-1 focus:ring-black dark:focus:ring-white text-gray-900 dark:text-white capitalize" onChange={(e) => setFormData({...formData, role: e.target.value})}>
                {['customer', 'designer', 'merchant', 'agent'].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          )}

          <button type="submit" className="w-full py-3.5 bg-neutral-900 dark:bg-white text-white dark:text-black text-sm font-bold rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-100 transition shadow-sm">
            {isLogin ? 'Sign In' : 'Register Account'}
          </button>
        </form>

        <p className="text-center text-xs font-medium text-gray-400 dark:text-zinc-500">
          {isLogin ? "Don't have an account?" : 'Already registered?'} {' '}
          <button onClick={() => setIsLogin(!isLogin)} className="text-gray-900 dark:text-white font-bold underline ml-1">
            {isLogin ? 'Create one here' : 'Sign in instead'}
          </button>
        </p>
      </div>
    </div>
  );
}
