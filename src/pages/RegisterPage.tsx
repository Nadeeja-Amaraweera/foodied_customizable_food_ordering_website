import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  ArrowRight,
  User,
  Mail,
  Lock,
  Check,
  Star,
  Sparkles,
  ChefHat,
  ShieldCheck,
  Utensils
} from 'lucide-react';
import { googleLogin, register } from '../services/auth';
import useAuth from '../hooks/useAuth';
import { useGoogleLogin } from '@react-oauth/google';
import { useToast } from '../context/ToastContext';

export interface RegisterPageProps {
  onRegister?: (details: { name: string; email: string; password: string }) => Promise<void> | void;
  onLogin?: () => void;
  onBackToHome?: () => void;
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
    image: '/images/chef-crafting-dish.jpg',
    alt: 'Master chef meticulously garnishing an artisanal plate',
    tag: 'Culinary Mastery',
    title: 'Your next favourite meal starts here.',
    subtitle: 'Create your account and make every bite memorable.'
  },
  {
    id: 2,
    image: '/images/artisan-woodfired-pizza.jpg',
    alt: 'Wood-fired artisan pizza with buffalo mozzarella and fresh basil',
    tag: 'Slow-Fermented Crust',
    title: 'Your next favourite meal starts here.',
    subtitle: 'Create your account and make every bite memorable.'
  },
  {
    id: 3,
    image: '/images/gourmet-truffle-burger.jpg',
    alt: 'Handcrafted gourmet prime burger with fresh organic ingredients',
    tag: 'Prime Selection',
    title: 'Your next favourite meal starts here.',
    subtitle: 'Create your account and make every bite memorable.'
  },
  {
    id: 4,
    image: '/images/fresh-organic-ingredients.jpg',
    alt: 'Fresh organic farm-harvested herbs, vegetables and produce',
    tag: 'Farm-to-Table',
    title: 'Your next favourite meal starts here.',
    subtitle: 'Create your account and make every bite memorable.'
  }
];

type FormErrors = {
  name?: string;
  email?: string;
  password?: string;
  general?: string;
};

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onRegister,
  onLogin,
  onBackToHome,
  onToast: _onToast
}) => {
  const navigate = useNavigate();
  const auth = useAuth();
  const { showToast } = useToast();

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Slideshow State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const slideTimerRef = useRef<number | null>(null);

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

  const clearError = (field: keyof FormErrors) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleLoginClick = () => {
    if (onLogin) {
      onLogin();
    } else {
      navigate('/login');
    }
  };

  const handleBackHome = () => {
    if (onBackToHome) {
      onBackToHome();
    } else {
      navigate('/');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isLoading) return;

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    const newErrors: FormErrors = {};
    if (!trimmedName) {
      newErrors.name = 'Please enter your full name.';
    }
    if (!trimmedEmail) {
      newErrors.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!password) {
      newErrors.password = 'Please create a password.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      if (onRegister) {
        await onRegister({ name: trimmedName, email: trimmedEmail, password });
      } else {
        await register(trimmedName, trimmedEmail, password);
      }

      showToast('Account created successfully! Please sign in to continue.', 'success');
      navigate('/login');
    } catch (error: any) {
      console.error('Registration Error:', error);
      const errorMessage =
        error?.response?.data?.message ||
        (error instanceof Error ? error.message : 'Registration failed. Please check your details and try again.');
      setErrors({
        general: errorMessage
      });
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Google Social Sign Up
  const handleGoogleSuccess = async (tokenResponse: any) => {
    try {
      setIsLoading(true);
      const res = await googleLogin(tokenResponse.access_token);

      if (res?.access_token) {
        localStorage.setItem('ACCESS_TOKEN', res.access_token);
      }
      if (res?.refresh_token) {
        localStorage.setItem('REFRESH_TOKEN', res.refresh_token);
      }

      if (auth?.setUser) {
        auth.setUser({
          _id: res.id,
          name: res.name || 'Food Lover',
          email: res.email,
          roles: res.roles || ['USER']
        });
      }

      showToast('Welcome to Foodied! Registration successful.', 'success');

      if (res.roles?.includes('ADMIN')) {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      console.error('Google sign-up error:', err);
      const errorMessage =
        err?.response?.data?.message || 'Google registration was unsuccessful. Please try again.';
      setErrors({ general: errorMessage });
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => {
      showToast('Google sign-up was canceled or failed.', 'error');
    }
  });

  return (
    <div className="min-h-screen w-full bg-[#141519] flex flex-col lg:flex-row antialiased selection:bg-[#F66C01] selection:text-white">
      {/* ── Left Side: Visual Brand Canvas (Desktop Split Screen) ── */}
      <div
        className="relative w-full lg:w-[50%] xl:w-[52%] min-h-[360px] sm:min-h-[440px] lg:min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-14 overflow-hidden bg-[#141519] select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Slides with Crossfade Animation */}
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

        {/* Top Floating Header on Visual Panel: Back to Foodied & Brand Label */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={handleBackHome}
            className="group inline-flex items-center gap-2 text-xs font-semibold text-white/80 hover:text-white bg-black/40 hover:bg-black/60 backdrop-blur-md px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/10 transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5 text-[#F66C01]" />
            <span>Back to Foodied</span>
          </button>

          {/* Exact Brand Label: FOODIED · JOIN THE EXPERIENCE */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[10px] sm:text-[11px] font-medium text-white/90">
            <span className="w-2 h-2 rounded-full bg-[#F66C01] animate-pulse shrink-0" />
            <span>FOODIED · JOIN THE EXPERIENCE</span>
          </div>
        </div>

        {/* Center / Lower Third: Main Headline & Subtitle */}
        <div className="relative z-10 max-w-xl my-auto pt-10 pb-6 lg:py-0">
          {/* Tag Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F66C01]/20 border border-[#F66C01]/30 backdrop-blur-md mb-4 text-[#F66C01] text-xs font-bold tracking-wide uppercase">
            <ChefHat className="w-3.5 h-3.5" />
            <span>{SLIDES[currentSlide].tag}</span>
          </div>

          {/* Main Headline Requested */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15] drop-shadow-md">
            Your next favourite meal starts here.
          </h1>

          {/* Subtitle Requested */}
          <p className="mt-3 text-base sm:text-lg text-white/85 font-medium leading-relaxed max-w-lg">
            Create your account and make every bite memorable.
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

      {/* ── Right Side: Premium Warm White Registration Form Canvas ── */}
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
            <span>Already have an account?</span>{' '}
            <button
              type="button"
              onClick={handleLoginClick}
              className="text-[#F66C01] font-bold hover:text-[#E05D00] transition-colors ml-1 cursor-pointer hover:underline"
            >
              Sign in
            </button>
          </div>
        </div>

        {/* Central Form Container */}
        <div className="w-full max-w-[420px] mx-auto my-auto">
          {/* Form Heading & Description Requested */}
          <div className="mb-7">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F66C01]/10 text-[#F66C01] text-xs font-bold tracking-wide mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Join the Foodied Family</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#141519] tracking-tight">
              Create your account
            </h2>
            <p className="text-sm text-gray-500 font-normal mt-1.5 leading-relaxed">
              Join Foodied and discover a world of flavour.
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

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Full Name Field */}
            <div>
              <label
                htmlFor="name-input"
                className="block text-xs font-semibold text-gray-700 mb-1.5"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="name-input"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    clearError('name');
                  }}
                  placeholder="e.g. Nadeeja Amaraweera"
                  autoComplete="name"
                  disabled={isLoading}
                  className={`w-full h-11 pl-10 pr-4 rounded-xl border text-sm text-gray-900 placeholder-gray-400 bg-white transition-all duration-150 focus:outline-none ${
                    errors.name
                      ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-red-50/20'
                      : 'border-gray-200 hover:border-gray-300 focus:border-[#F66C01] focus:ring-2 focus:ring-[#F66C01]/15'
                  } disabled:bg-gray-100 disabled:cursor-not-allowed`}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-red-500 mt-1 font-medium pl-1">{errors.name}</p>
              )}
            </div>

            {/* Email Address Field */}
            <div>
              <label
                htmlFor="email-input"
                className="block text-xs font-semibold text-gray-700 mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email-input"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearError('email');
                  }}
                  placeholder="name@example.com"
                  autoComplete="email"
                  disabled={isLoading}
                  className={`w-full h-11 pl-10 pr-4 rounded-xl border text-sm text-gray-900 placeholder-gray-400 bg-white transition-all duration-150 focus:outline-none ${
                    errors.email
                      ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-red-50/20'
                      : 'border-gray-200 hover:border-gray-300 focus:border-[#F66C01] focus:ring-2 focus:ring-[#F66C01]/15'
                  } disabled:bg-gray-100 disabled:cursor-not-allowed`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1 font-medium pl-1">{errors.email}</p>
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
                <span className="text-[11px] text-gray-400">Min. 6 characters</span>
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
                    clearError('password');
                  }}
                  placeholder="Create a secure password"
                  autoComplete="new-password"
                  disabled={isLoading}
                  className={`w-full h-11 pl-10 pr-11 rounded-xl border text-sm text-gray-900 placeholder-gray-400 bg-white transition-all duration-150 focus:outline-none ${
                    errors.password
                      ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-red-50/20'
                      : 'border-gray-200 hover:border-gray-300 focus:border-[#F66C01] focus:ring-2 focus:ring-[#F66C01]/15'
                  } disabled:bg-gray-100 disabled:cursor-not-allowed`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Password dynamic validation feedback */}
              {password.length > 0 && (
                <div className="mt-1.5 flex items-center gap-1.5 text-[11px]">
                  {password.length >= 6 ? (
                    <span className="text-emerald-600 flex items-center gap-1 font-medium">
                      <Check className="w-3 h-3 text-emerald-500" />
                      Password meets minimum length
                    </span>
                  ) : (
                    <span className="text-amber-600 font-medium">
                      {6 - password.length} more characters needed
                    </span>
                  )}
                </div>
              )}

              {errors.password && (
                <p className="text-xs text-red-500 mt-1 font-medium pl-1">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-xl bg-[#F66C01] hover:bg-[#E05D00] active:scale-[0.99] text-white text-sm font-bold transition-all duration-150 shadow-md shadow-[#F66C01]/25 hover:shadow-lg hover:shadow-[#F66C01]/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Social Sign Up Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-[#FAF9F6] text-gray-400 font-medium">
                or sign up with
              </span>
            </div>
          </div>

          {/* Google Sign Up Button */}
          <button
            type="button"
            onClick={() => handleGoogleSignup()}
            disabled={isLoading}
            className="w-full h-11 rounded-xl border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 active:scale-[0.99] text-gray-700 text-xs sm:text-sm font-semibold transition-all duration-150 shadow-xs flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Already have an account? Sign in */}
          <div className="pt-6 text-center text-xs text-gray-500 font-medium">
            <span>Already have an account?</span>{' '}
            <button
              type="button"
              onClick={handleLoginClick}
              className="text-[#F66C01] font-bold hover:text-[#E05D00] transition-colors ml-1 cursor-pointer hover:underline"
            >
              Sign in
            </button>
          </div>
        </div>

        {/* Footer Terms & Privacy Policy */}
        <div className="pt-8 text-center">
          <p className="text-[11px] text-gray-400">
            By signing up, you agree to Foodied's{' '}
            <span className="text-gray-600 hover:underline cursor-pointer">Terms of Service</span> and{' '}
            <span className="text-gray-600 hover:underline cursor-pointer">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
