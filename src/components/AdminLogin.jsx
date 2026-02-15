import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Lock, Mail, ChevronLeft } from 'lucide-react';

export default function AdminLogin({ onLoginSuccess, onBack, isDarkMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      onLoginSuccess(data.user);
    }
  };

  const bgMain = isDarkMode ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const inputBg = isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-black';

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 ${bgMain}`}>
      <div className={`w-full max-w-md p-8 rounded-[40px] shadow-2xl ${cardBg}`}>
        <button onClick={onBack} className="mb-6 p-2 rounded-full bg-gray-500/10 hover:bg-gray-500/20 transition-colors">
          <ChevronLeft className={isDarkMode ? 'text-white' : 'text-black'} />
        </button>
        
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-glow-primary rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg rotate-12">
            <Lock className="w-10 h-10 text-black -rotate-12" />
          </div>
          <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Boss Login</h2>
          <p className="text-gray-500 text-sm mt-2">Authorized Access Only</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 ml-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              <input 
                required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className={`w-full p-4 pl-12 rounded-2xl outline-none border-none ${inputBg}`}
                placeholder="boss@glowempire.com"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 ml-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              <input 
                required type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className={`w-full p-4 pl-12 rounded-2xl outline-none border-none ${inputBg}`}
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-xs font-bold text-center mt-2">{error}</p>}

          <button 
            disabled={loading} type="submit"
            className="w-full py-4 bg-glow-primary text-black font-extrabold rounded-2xl shadow-lg hover:scale-[1.02] transition-transform mt-4 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Enter Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}