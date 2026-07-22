import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Sparkles, Shield, Zap } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

const handleSubmit = (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  if (!email || !password) {
    setError('Please enter both email and password');
    setLoading(false);
    return;
  }

  setTimeout(() => {
    localStorage.setItem('adminToken', 'mock-token');
    setLoading(false);
    // Use window.location to force a full page reload
    window.location.href = '/';
    // OR use navigate with a state update
    // navigate('/', { replace: true });
    // window.location.reload();
  }, 800);
};

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 via-[#FFB84D]/5 to-[#E69A30]/10 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#FFB84D]/20 to-[#E69A30]/10 rounded-full blur-3xl -mr-48 -mt-48 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl -ml-48 -mb-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="glass rounded-3xl p-8 shadow-2xl border border-white/20">
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-gradient-to-br from-[#FFB84D] to-[#E69A30] rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-[#FFB84D]/25 group-hover:scale-110 transition-transform duration-500">
                <span className="text-5xl">🔧</span>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                <Shield size={14} className="text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold gradient-text">KaziLink</h1>
            <p className="text-gray-500 mt-2 flex items-center justify-center gap-1">
              <Sparkles size={14} className="text-[#FFB84D]" />
              Admin Dashboard Login
              <Sparkles size={14} className="text-[#FFB84D]" />
            </p>
          </div>

          {error && (
            <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 text-red-600 p-3 rounded-xl mb-4 text-sm flex items-center gap-2 border border-red-500/20">
              <span>⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FFB84D]/20 to-[#E69A30]/20 rounded-xl blur transition-all duration-300 group-hover:blur-md"></div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFB84D]/50 transition-all duration-300 text-sm sm:text-base"
                    placeholder="admin@kazilink.com"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FFB84D]/20 to-[#E69A30]/20 rounded-xl blur transition-all duration-300 group-hover:blur-md"></div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFB84D]/50 transition-all duration-300 text-sm sm:text-base"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="relative w-full group overflow-hidden rounded-xl bg-gradient-to-r from-[#FFB84D] to-[#E69A30] text-[#1A253F] font-semibold py-3.5 transition-all duration-300 hover:shadow-2xl hover:shadow-[#FFB84D]/25 disabled:opacity-50"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-[#1A253F]/30 border-t-[#1A253F] rounded-full animate-spin"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    <Zap size={18} />
                    Sign In
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#E69A30] to-[#D4881A] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
              <Shield size={12} />
              Demo: Use any credentials to login
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;