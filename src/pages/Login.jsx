// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Sparkles, Shield, Zap } from 'lucide-react';
import { login } from '../services/authService';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const friendlyError = (code) => {
    switch (code) {
      case 'auth/invalid-email':
        return 'That email address format is invalid.';
      case 'auth/user-not-found':
      case 'auth/invalid-credential':
        return 'Invalid credentials. Please check your email and password.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/too-many-requests':
        return 'Access blocked due to many failed attempts. Try again later.';
      case 'auth/network-request-failed':
        return 'Network connection error. Please check your internet.';
      default:
        return 'Unable to sign in. Please verify your details and try again.';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const { profile } = await login(email.trim(), password);

      if (profile) {
        localStorage.setItem('adminUser', JSON.stringify(profile));
      }

      navigate('/', { replace: true });
    } catch (err) {
      console.error('Login submit error:', err);
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 via-[#FFB84D]/5 to-[#E69A30]/10 relative overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#FFB84D]/20 to-[#E69A30]/10 rounded-full blur-3xl -mr-48 -mt-48 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl -ml-48 -mb-48 animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="w-full max-w-md relative z-10">
        <div className="glass rounded-3xl p-8 shadow-2xl border border-white/20 bg-white/70 backdrop-blur-md">
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-gradient-to-br from-[#FFB84D] to-[#E69A30] rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-[#FFB84D]/25">
                <span className="text-5xl">🔧</span>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                <Shield size={14} className="text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-[#1A253F]">KaziLink</h1>
            <p className="text-gray-500 mt-2 flex items-center justify-center gap-1 text-sm font-medium">
              <Sparkles size={14} className="text-[#FFB84D]" />
              Admin Dashboard Login
              <Sparkles size={14} className="text-[#FFB84D]" />
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm flex items-center gap-2 border border-red-200">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFB84D]/50 text-sm sm:text-base text-gray-800"
                  placeholder="admin@kazilink.com"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFB84D]/50 text-sm sm:text-base text-gray-800"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-[#FFB84D] to-[#E69A30] text-[#1A253F] font-semibold py-3.5 transition-all duration-300 hover:shadow-lg hover:shadow-[#FFB84D]/30 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#1A253F]/30 border-t-[#1A253F] rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <Zap size={18} />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
              <Shield size={12} />
              Protected by Firebase Authentication
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;