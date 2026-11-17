import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Flame,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Store
} from 'lucide-react';
import { Button } from '../../components/admin/Button';
import { adminLogin } from '../../services/auth';
import useAuth from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('nadeeja@gmail.com');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const { showToast } = useToast();

  // Admin login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await adminLogin(email, password);

      localStorage.setItem('ACCESS_TOKEN', res.access_token);
      localStorage.setItem('REFRESH_TOKEN', res.refresh_token);

      auth.setUser({
        _id: res.id,
        id: res.id,
        name: res.name,
        email: res.email,
        roles: res.roles,
      });

      showToast(`Welcome back, ${res.name || 'Admin'}!`, 'success');
      navigate('/admin/dashboard');

    } catch (error: any) {
      const msg = error.response?.data?.message || 'Admin login failed. Please check credentials.';
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setEmail('nadeeja@gmail.com');
    setPassword('123456');
    setIsLoading(true);

    try {
      const res = await adminLogin('nadeeja@gmail.com', '123456');

      localStorage.setItem('ACCESS_TOKEN', res.access_token);
      localStorage.setItem('REFRESH_TOKEN', res.refresh_token);

      auth.setUser({
        _id: res.id,
        id: res.id,
        name: res.name,
        email: res.email,
        roles: res.roles,
      });

      showToast(`Welcome back, ${res.name || 'Admin'}!`, 'success');
      navigate('/admin/dashboard');

    } catch (error: any) {
      const msg = error.response?.data?.message || 'Login failed. Please verify admin credentials or ensure the server is running.';
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1A2E] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative overflow-hidden select-none">
      {/* Background Decorative Gradient Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#FF6B35]/25 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[550px] h-[550px] rounded-full bg-gradient-to-tl from-[#F7931E]/20 to-[#2EC4B6]/15 blur-[140px] pointer-events-none" />

      {/* Main Login Card Container */}
      <div className="w-full max-w-4xl bg-[#16213E]/90 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 relative z-10">
        
        {/* Left Side: Brand & Food Theme Graphic Banner */}
        <div className="p-8 sm:p-10 flex flex-col justify-between bg-gradient-to-br from-[#FF6B35] via-[#E85924] to-[#1A1A2E] text-white relative overflow-hidden">
          {/* Subtle background food illustration pattern overlay */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          <div>
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-white mb-6 border border-white/20 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>Artisanal Kitchen Suite</span>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white text-[#FF6B35] flex items-center justify-center shadow-lg font-black">
                <Flame className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-black font-display tracking-tight text-white">
                  Foodied
                </h1>
                <p className="text-xs text-orange-100 font-medium tracking-wide">
                  ADMIN DASHBOARD
                </p>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight font-display mt-6">
              Welcome back to kitchen dispatch.
            </h2>
            <p className="text-sm text-orange-100/90 mt-3 leading-relaxed">
              Monitor incoming customizable food orders in real-time, configure toppings and spice levels, and track daily kitchen revenue.
            </p>
          </div>

          {/* Feature Highlights on Graphic Side */}
          <div className="mt-8 pt-6 border-t border-white/15 space-y-2.5 text-xs text-orange-50">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-300" />
              <span>Real-time custom order tickets & alert sounds</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-300" />
              <span>Dynamic ingredient & portion modifiers</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-300" />
              <span>Fast one-click order confirmation queue</span>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-8 sm:p-10 flex flex-col justify-between bg-white text-[#2D2D2D]">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold font-display text-gray-900">
                Admin Sign In
              </h3>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-orange-100 text-[#FF6B35]">
                AUTHENTICATED
              </span>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Admin Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@foodiedkitchen.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">
                    Password
                  </label>
                  <span className="text-xs text-[#FF6B35] hover:underline cursor-pointer">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded text-[#FF6B35] focus:ring-[#FF6B35]"
                  />
                  <span>Keep me signed in</span>
                </label>
              </div>

              {/* Login Button with gradient */}
              <Button
                type="submit"
                variant="gradient"
                size="lg"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full mt-4 font-bold shadow-soft hover:shadow-glow-primary"
              >
                Sign In to Admin
              </Button>
            </form>

            {/* Quick Demo Access Button */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={handleQuickDemoLogin}
                className="w-full text-xs font-semibold hover:border-primary text-gray-700"
              >
                ⚡ 1-Click Admin Login (nadeeja@gmail.com)
              </Button>
            </div>
          </div>

          {/* Footer Customer Switch */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-primary hover:underline font-semibold"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Back to Customer Store</span>
            </Link>
            <span className="flex items-center gap-1 text-gray-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Admin Portal Secured
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
