import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  Mail,
  Lock,
  Check,
  Star,
  Sparkles,
  ChefHat,
  ShieldCheck,
  X,
  Send
} from 'lucide-react';
import { googleLogin, login } from '../services/auth';
import useAuth from '../hooks/useAuth';
import { useGoogleLogin } from '@react-oauth/google';
import { useToast } from '../context/ToastContext';

export interface LoginPageProps {
  onLogin?: (credentials: { username: string; password: string }) => Promise<void> | void;
  onForgotPassword?: () => void;
  onRegister?: () => void;
  onBackToHome?: () => void;
  onSocialLogin?: (provider: 'google' | 'facebook') => void;
  onToast?: (message: string) => void;
}

interface SlideItem {
  id: number;
  image: string;
  alt: string;
  tag: string;
  title: string;
  subtitle: string;
}

const SLIDES: SlideItem[] = [
  {
    id: 1,
    image: '/images/chef-kitchen-action.jpg',
    alt: 'Master chef searing and plating gourmet dishes in fine-dining kitchen',
    tag: 'Artisanal Craft',
    title: 'Good food starts here.',
    subtitle: 'Sign in and discover something delicious.'
  },
  {
    id: 2,
    image: '/images/gourmet-truffle-burger.jpg',
    alt: 'Handcrafted gourmet prime burger with fresh organic ingredients',
    tag: 'Chef Specials',
    title: 'Good food starts here.',
    subtitle: 'Sign in and discover something delicious.'
  },
  {
    id: 3,
    image: '/images/artisan-woodfired-pizza.jpg',
    alt: 'Wood-fired artisan pizza with buffalo mozzarella and fresh basil',
    tag: 'Slow-Fermented Crust',
    title: 'Good food starts here.',
    subtitle: 'Sign in and discover something delicious.'
  },
  {
    id: 4,
    image: '/images/restaurant-dining-ambiance.jpg',
    alt: 'Warm and inviting fine restaurant dining atmosphere',
    tag: 'Elevated Dining',
    title: 'Good food starts here.',
    subtitle: 'Sign in and discover something delicious.'
  }
];

export const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  onForgotPassword,
  onRegister,
  onBackToHome,
  onSocialLogin: _onSocialLogin,
  onToast: _onToast
}) => {
  const navigate = useNavigate();
  const auth = useAuth();
  const { showToast } = useToast();

  // Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string; general?: string }>({});

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isForgotSending, setIsForgotSending] = useState(false);
  const [forgotSentSuccess, setForgotSentSuccess] = useState(false);

  // Slider State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const slideTimerRef = useRef<number | null>(null);

  // Load remembered username/email on mount
  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem('FOODIED_REMEMBERED_EMAIL');
      if (savedEmail) {
        setUsername(savedEmail);
        setRememberMe(true);
      }
    } catch {
      // Ignore localStorage read errors
    }
  }, []);

  // Auto-slide effect (5s interval, pauses on hover)
  useEffect(() => {
    if (isHovered) {
      if (slideTimerRef.current) clearInterval(slideTimerRef.current);
      return;
    }

    slideTimerRef.current = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);

    return () => {
      if (slideTimerRef.current) {
        clearInterval(slideTimerRef.current);
      }
    };
  }, [isHovered]);

  const handleForgotClick = () => {
    if (onForgotPassword) {
      onForgotPassword();
    } else {
      setForgotEmail(username.trim());
      setForgotSentSuccess(false);
      setShowForgotModal(true);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setIsForgotSending(true);
    setTimeout(() => {
      setIsForgotSending(false);
      setForgotSentSuccess(true);
      showToast('Password reset link sent to your email!', 'success');
    }, 800);
  };

  const handleRegisterClick = () => {
    if (onRegister) {
      onRegister();
    } else {
      navigate('/register');
    }
  };

  const handleBackHome = () => {
    if (onBackToHome) {
      onBackToHome();
    } else {
      navigate('/');
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const trimmedUsername = username.trim();
    if (!trimmedUsername || !password) {
      setErrors({
        username: !trimmedUsername ? 'Email or Username is required' : undefined,
        password: !password ? 'Password is required' : undefined
      });
      return;
    }

    if (onLogin) {
      await onLogin({ username: trimmedUsername, password });
      return;
    }

    try {
      setIsLoading(true);
      setErrors({});

      // Remember me handling
      try {
        if (rememberMe) {
          localStorage.setItem('FOODIED_REMEMBERED_EMAIL', trimmedUsername);
        } else {
          localStorage.removeItem('FOODIED_REMEMBERED_EMAIL');
        }
      } catch {
        // Ignore storage errors
      }

      const res = await login(trimmedUsername, password);

      const token = res.access_token;
      const refreshToken = res.refresh_token;
      if (token) {
        localStorage.setItem('ACCESS_TOKEN', token);
      }
      if (refreshToken) {
        localStorage.setItem('REFRESH_TOKEN', refreshToken);
      }

      if (auth?.setUser) {
        auth.setUser({
          _id: res.id,
          name: res.name,
          email: res.email,
          roles: res.roles,
        });
      }

      showToast('Welcome back! Login successful.', 'success');

      // Navigate based on user roles (Admin -> Admin Dashboard, User -> Home)
      if (res.roles?.includes('ADMIN')) {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      console.error('Login Error:', err);
      const errorMessage =
        err?.response?.data?.message || 'Invalid email or password. Please check your credentials.';
      setErrors((prev) => ({
        ...prev,
        general: errorMessage
      }));
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (tokenResponse: any) => {
    try {
      setIsLoading(true);
      const res = await googleLogin(tokenResponse.access_token);

      if (res.access_token) {
        localStorage.setItem('ACCESS_TOKEN', res.access_token);
      }
      if (res.refresh_token) {
        localStorage.setItem('REFRESH_TOKEN', res.refresh_token);
      }

      if (auth?.setUser) {
        auth.setUser({
          _id: res.id,
          name: res.name,
          email: res.email,
          roles: res.roles,
        });
      }

      showToast('Google Sign-in successful!', 'success');
      navigate('/');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Google login failed. Please try again.';
      showToast(msg, 'error');
      setErrors((prev) => ({ ...prev, general: msg }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialClick = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => showToast('Google Login Failed', 'error'),
  });

  return (
    <div className="min-h-screen w-full bg-[#141519] flex flex-col lg:flex-row items-stretch select-none selection:bg-[#F66C01] selection:text-white">
      {/* ── Left Side: Brand Visual & Food Photography Experience ── */}
      <div
        className="relative w-full lg:w-[50%] xl:w-[52%] min-h-[340px] sm:min-h-[420px] lg:min-h-screen bg-[#111215] flex flex-col justify-between p-6 sm:p-10 lg:p-14 overflow-hidden select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background Imagery Slideshow with cinematic transitions */}
        {SLIDES.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-0' : 'opacity-0 -z-10 pointer-events-none'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.alt}
                className="w-full h-full object-cover transform scale-100 transition-transform duration-[6000ms] ease-out will-change-transform"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
              {/* Deep charcoal cinematic vignette gradients for perfect typography legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#141519] via-[#141519]/70 to-[#141519]/40 pointer-events-none" />
              <div className="absolute inset-0 bg-radial-[circle_at_center,_transparent_0%,_rgba(20,21,25,0.6)_100%] pointer-events-none" />
            </div>
          );
        })}

        {/* Top Floating Header on Visual Panel: Brand Mark & Quick Return */}
        <div className="relative z-10 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleBackHome}
            className="group inline-flex items-center gap-2 text-xs font-semibold text-white/80 hover:text-white bg-black/40 hover:bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5 text-[#F66C01]" />
            <span>Back to Foodied</span>
          </button>

          {/* Micro Brand Pill */}
          <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-medium text-white/90">
            <span className="w-2 h-2 rounded-full bg-[#F66C01] animate-pulse" />
            <span>Artisan Kitchen Online</span>
          </div>
        </div>

        {/* Center / Lower Third: Compelling Food Brand Headline & Copy */}
        <div className="relative z-10 max-w-xl my-auto pt-10 pb-6 lg:py-0">
          {/* Tag Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F66C01]/20 border border-[#F66C01]/30 backdrop-blur-md mb-4 text-[#F66C01] text-xs font-bold tracking-wide uppercase">
            <ChefHat className="w-3.5 h-3.5" />
            <span>{SLIDES[currentSlide].tag}</span>
          </div>

          {/* Primary Headline Requested */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15] drop-shadow-md">
            Good food starts here.
          </h1>

          {/* Subtitle Requested */}
          <p className="mt-3 text-base sm:text-lg text-white/85 font-medium leading-relaxed max-w-lg">
            Sign in and discover something delicious.
          </p>

          {/* Description Highlight Requested */}
          <p className="mt-2 text-xs sm:text-sm text-white/60 leading-relaxed max-w-md">
            Continue your flavour journey with Foodied.
          </p>

          {/* Key Value Proposition Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 mt-6 border-t border-white/15">
            <div className="flex items-center gap-2 text-white/90 text-xs font-semibold">
              <span className="w-6 h-6 rounded-full bg-[#F66C01]/20 flex items-center justify-center text-[#F66C01] shrink-0">
                <Star className="w-3.5 h-3.5 fill-[#F66C01]" />
              </span>
              <span>4.9★ Top Rated</span>
            </div>
            <div className="flex items-center gap-2 text-white/90 text-xs font-semibold">
              <span className="w-6 h-6 rounded-full bg-[#F66C01]/20 flex items-center justify-center text-[#F66C01] shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
              <span>100% Fresh Daily</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-white/90 text-xs font-semibold">
              <span className="w-6 h-6 rounded-full bg-[#F66C01]/20 flex items-center justify-center text-[#F66C01] shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
              <span>Secure Ordering</span>
            </div>
          </div>
        </div>

        {/* Bottom Slide Pagination Dots (Capsules) */}
        <div className="relative z-10 flex items-center gap-2 pt-4">
          {SLIDES.map((slide, index) => {
            const isActive = index === currentSlide;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer focus:outline-none ${
                  isActive
                    ? 'w-8 h-2 bg-[#F66C01] shadow-sm shadow-[#F66C01]/50'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* ── Right Side: Premium Warm White Login Form Canvas ── */}
      <div className="w-full lg:w-[50%] xl:w-[48%] bg-[#FAF9F6] flex flex-col justify-between p-6 sm:p-10 lg:p-16 min-h-full">
        {/* Top Brand Indicator for Desktop & Mobile */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8 sm:mb-10">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tight text-[#141519] flex items-center">
              FOODIED
              <span className="inline-block w-2 h-2 rounded-full bg-[#F66C01] ml-1 mb-0.5" />
            </span>
          </div>

          <div className="text-xs text-gray-500 font-medium">
            <span>New to Foodied?</span>{' '}
            <button
              type="button"
              onClick={handleRegisterClick}
              className="text-[#F66C01] font-bold hover:text-[#E05D00] transition-colors ml-1 cursor-pointer hover:underline"
            >
              Create an account
            </button>
          </div>
        </div>

        {/* Central Form Container */}
        <div className="w-full max-w-[420px] mx-auto my-auto">
          {/* Header Texts Required */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F66C01]/10 text-[#F66C01] text-xs font-bold tracking-wide mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Welcome back!</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#141519] tracking-tight">
              Good food starts here.
            </h2>
            <p className="text-sm text-gray-500 font-normal mt-1.5 leading-relaxed">
              Continue your flavour journey with Foodied. Sign in and discover something delicious.
            </p>
          </div>

          {/* General Form Error Alert Banner */}
          {errors.general && (
            <div
              role="alert"
              className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs sm:text-[13px] text-red-700 flex items-start gap-2.5 animate-in fade-in duration-200"
            >
              <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5 text-red-600 font-bold text-xs">
                !
              </div>
              <div className="flex-1 font-medium">{errors.general}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email / Username Field */}
            <div>
              <label
                htmlFor="username-input"
                className="block text-xs font-semibold text-gray-700 mb-1.5"
              >
                Email or Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="username-input"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errors.username) setErrors((prev) => ({ ...prev, username: undefined }));
                  }}
                  placeholder="name@example.com or username"
                  autoComplete="username"
                  disabled={isLoading}
                  className={`w-full h-11 pl-10 pr-4 rounded-xl border text-sm text-gray-900 placeholder-gray-400 bg-white transition-all duration-150 focus:outline-none ${
                    errors.username
                      ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                      : 'border-gray-200 hover:border-gray-300 focus:border-[#F66C01] focus:ring-3 focus:ring-[#F66C01]/15'
                  } disabled:bg-gray-100 disabled:cursor-not-allowed shadow-2xs`}
                />
              </div>
              {errors.username && (
                <p className="text-xs text-red-500 mt-1 pl-1 font-medium">{errors.username}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password-input"
                  className="block text-xs font-semibold text-gray-700"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotClick}
                  className="text-xs font-semibold text-[#F66C01] hover:text-[#E05D00] transition-colors cursor-pointer hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={isLoading}
                  className={`w-full h-11 pl-10 pr-11 rounded-xl border text-sm text-gray-900 placeholder-gray-400 bg-white transition-all duration-150 focus:outline-none ${
                    errors.password
                      ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                      : 'border-gray-200 hover:border-gray-300 focus:border-[#F66C01] focus:ring-3 focus:ring-[#F66C01]/15'
                  } disabled:bg-gray-100 disabled:cursor-not-allowed shadow-2xs`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1 pl-1 font-medium">{errors.password}</p>
              )}
            </div>

            {/* Remember Me Option */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#F66C01] focus:ring-[#F66C01]/30 cursor-pointer accent-[#F66C01]"
                />
                <span className="text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  Remember me on this device
                </span>
              </label>
            </div>

            {/* Primary Login Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-xl bg-[#F66C01] hover:bg-[#E05D00] active:scale-[0.99] text-white text-sm font-bold tracking-wide transition-all duration-200 shadow-md shadow-[#F66C01]/25 hover:shadow-lg hover:shadow-[#F66C01]/35 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Signing in to Foodied...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </>
                )}
              </button>
            </div>

            {/* Divider: "or continue with" */}
            <div className="relative flex items-center justify-center my-6">
              <div className="border-t border-gray-200 w-full" />
              <span className="absolute bg-[#FAF9F6] px-3 text-xs text-gray-400 font-medium select-none">
                or continue with
              </span>
            </div>

            {/* Google Authentication Button */}
            <div>
              <button
                type="button"
                onClick={() => handleSocialClick()}
                disabled={isLoading}
                className="w-full h-11 rounded-xl border border-gray-200 bg-white hover:bg-gray-50/90 active:scale-[0.99] transition-all duration-150 flex items-center justify-center gap-2.5 text-xs font-semibold text-gray-700 shadow-2xs hover:border-gray-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.28-2.1 3.66-5.2 3.66-9.12z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.13C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.26C.46 8.18 0 9.99 0 12s.46 3.82 1.26 5.42l4.02-3.13z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.26 6.58l4.02 3.13c.95-2.83 3.6-4.96 6.72-4.96z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>
          </form>
        </div>

        {/* Bottom Trust & Legal Footer */}
        <div className="pt-8 text-center text-xs text-gray-400">
          <p>
            By signing in, you agree to Foodied's Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>

      {/* ── Forgot Password Modal ── */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 sm:p-7 shadow-2xl border border-gray-100 relative">
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-10 h-10 rounded-full bg-[#F66C01]/10 text-[#F66C01] flex items-center justify-center mb-4">
              <Mail className="w-5 h-5" />
            </div>

            <h3 className="text-xl font-bold text-gray-900">Reset your password</h3>
            <p className="text-xs text-gray-500 mt-1 mb-5 leading-relaxed">
              Enter your registered email address and we'll send you instructions to reset your password.
            </p>

            {forgotSentSuccess ? (
              <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-xs text-green-800 space-y-3">
                <div className="flex items-center gap-2 font-bold text-green-900">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Reset link dispatched</span>
                </div>
                <p>
                  We have sent instructions to <strong>{forgotEmail}</strong>. Please check your inbox and spam folder.
                </p>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="w-full py-2 bg-white rounded-lg border border-green-300 text-green-900 font-semibold hover:bg-green-100/50 transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Email address
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full h-11 px-3.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#F66C01] focus:ring-2 focus:ring-[#F66C01]/20 transition-all"
                  />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 h-10 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isForgotSending}
                    className="flex-1 h-10 rounded-xl bg-[#F66C01] hover:bg-[#E05D00] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-[#F66C01]/20 cursor-pointer disabled:opacity-60"
                  >
                    {isForgotSending ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Link</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
