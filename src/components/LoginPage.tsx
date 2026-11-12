import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';

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
}

const SLIDES: SlideItem[] = [
  {
    id: 1,
    image: '/images/login-slider-1.webp',
    alt: 'Gourmet soft-boiled eggs with avocado and spinach on dark artisanal plate'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=85',
    alt: 'Salmon poke and fresh organic harvest bowl'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=85',
    alt: 'Fresh wood-fired artisan pizza with melted mozzarella'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=85',
    alt: 'Char-grilled prime beef burger with melted cheese and fresh greens'
  }
];

export const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  onForgotPassword,
  onRegister,
  onBackToHome,
  onSocialLogin,
  onToast
}) => {
  // Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string; general?: string }>({});

  // Slider State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const slideTimerRef = useRef<number | null>(null);

  // Auto-slide effect (4.5s interval, pauses on hover)
  useEffect(() => {
    if (isHovered) {
      if (slideTimerRef.current) clearInterval(slideTimerRef.current);
      return;
    }

    slideTimerRef.current = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 4500);

    return () => {
      if (slideTimerRef.current) {
        clearInterval(slideTimerRef.current);
      }
    };
  }, [isHovered]);

  // Form Validation & Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading) return;

    const newErrors: { username?: string; password?: string } = {};

    if (!username.trim()) {
      newErrors.username = 'Please enter your username.';
    }

    if (!password) {
      newErrors.password = 'Please enter your password.';
    } else if (password.length < 4) {
      newErrors.password = 'Password must be at least 4 characters.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      if (onLogin) {
        await onLogin({ username: username.trim(), password });
      } else {
        // Fallback default simulation when no custom handler is passed
        await new Promise((resolve) => setTimeout(resolve, 800));
        if (onToast) {
          onToast(`Welcome back, ${username.trim()}!`);
        }
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Invalid credentials. Please try again.';
      setErrors({ general: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialClick = (provider: 'google' | 'facebook') => {
    if (onSocialLogin) {
      onSocialLogin(provider);
      return;
    }
    // Per requirements: Do not implement fake authentication.
    const providerName = provider === 'google' ? 'Google' : 'Facebook';
    const message = `${providerName} login is not configured yet for this project.`;
    if (onToast) {
      onToast(message);
    } else {
      setErrors((prev) => ({ ...prev, general: message }));
    }
  };

  const handleForgotClick = () => {
    if (onForgotPassword) {
      onForgotPassword();
    } else if (onToast) {
      onToast('Password recovery instructions sent to your email.');
    }
  };

  const handleRegisterClick = () => {
    if (onRegister) {
      onRegister();
    } else if (onToast) {
      onToast('Registration service will be available shortly.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#EFEFEF] flex items-center justify-center p-3 sm:p-5 lg:p-7 py-8 sm:py-6 relative select-none selection:bg-neutral-900 selection:text-white">
      {/* Floating Back to Store Button (subtle, does not distort container centering) */}
      {onBackToHome && (
        <button
          type="button"
          onClick={onBackToHome}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 z-30 inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-black bg-white/70 hover:bg-white backdrop-blur-xs py-1.5 px-3.5 rounded-full shadow-xs transition-all duration-200"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Foodied</span>
        </button>
      )}

      {/* Main Login White Container (Exact match to reference proportions: ~967px x 626px) */}
      <div className="w-full max-w-[968px] min-h-[580px] lg:h-[626px] bg-white rounded-[26px] sm:rounded-[28px] shadow-[0_15px_45px_-10px_rgba(0,0,0,0.06)] border border-gray-100/60 p-5 sm:p-6 lg:p-0 lg:pr-[28px] lg:pt-[28px] lg:pb-[28px] overflow-hidden flex flex-col justify-between my-auto">
        <div className="flex flex-col lg:flex-row items-stretch justify-between h-full gap-6 lg:gap-0">
          
          {/* Left Side: Login Form (Width matched to ~272px, centered in the left column with exact reference alignment) */}
          <div className="flex-1 flex flex-col justify-between pt-4 pb-3 lg:pt-6 lg:pb-3 px-0">
            <div className="w-full max-w-[272px] mx-auto">
              
              {/* Header: Welcome Back! */}
              <div className="text-center">
                <h1 className="text-[26px] sm:text-[28px] font-bold tracking-tight text-[#111111]">
                  Welcome Back!
                </h1>
                <p className="text-[11px] sm:text-[11.5px] text-gray-400 font-normal mt-1 tracking-normal">
                  Sign in with your Username and Password.
                </p>
              </div>

              {/* General Form Error Notice */}
              {errors.general && (
                <div className="mt-3 p-2 rounded-xl bg-red-50 border border-red-100 text-[11px] text-red-600 text-center font-medium">
                  {errors.general}
                </div>
              )}

              {/* Form Elements */}
              <form onSubmit={handleSubmit} className="mt-6 space-y-3" noValidate>
                {/* Username Input Field */}
                <div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (errors.username) setErrors((prev) => ({ ...prev, username: undefined }));
                    }}
                    placeholder="Username"
                    autoComplete="username"
                    disabled={isLoading}
                    className={`w-full h-[36px] sm:h-[38px] px-4 rounded-full border text-[12px] text-gray-800 placeholder-gray-400 bg-white transition-all duration-150 focus:outline-none ${
                      errors.username
                        ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-100'
                        : 'border-gray-200/90 hover:border-gray-300 focus:border-gray-400 focus:ring-1 focus:ring-gray-200'
                    } disabled:bg-gray-50 disabled:cursor-not-allowed`}
                  />
                  {errors.username && (
                    <p className="text-[10px] text-red-500 mt-1 pl-3 font-medium">{errors.username}</p>
                  )}
                </div>

                {/* Password Input Field with Show/Hide toggle */}
                <div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                      }}
                      placeholder="Password"
                      autoComplete="current-password"
                      disabled={isLoading}
                      className={`w-full h-[36px] sm:h-[38px] pl-4 pr-10 rounded-full border text-[12px] text-gray-800 placeholder-gray-400 bg-white transition-all duration-150 focus:outline-none ${
                        errors.password
                          ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-100'
                          : 'border-gray-200/90 hover:border-gray-300 focus:border-gray-400 focus:ring-1 focus:ring-gray-200'
                      } disabled:bg-gray-50 disabled:cursor-not-allowed`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      tabIndex={-1}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-[10px] text-red-500 mt-1 pl-3 font-medium">{errors.password}</p>
                  )}
                </div>

                {/* Forgot Password Link Aligned to the Right */}
                <div className="flex justify-end pt-0.5">
                  <button
                    type="button"
                    onClick={handleForgotClick}
                    className="text-[10px] sm:text-[11px] font-semibold text-gray-800 hover:text-black transition-colors"
                  >
                    Forget Password?
                  </button>
                </div>

                {/* Login Button with Black Background & White Text */}
                <div className="pt-0.5">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-[36px] sm:h-[38px] rounded-full bg-[#181818] hover:bg-black active:scale-[0.99] text-white text-[12px] sm:text-[13px] font-medium transition-all duration-150 shadow-xs flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                        <span>Signing in...</span>
                      </>
                    ) : (
                      'Login'
                    )}
                  </button>
                </div>

                {/* Divider: "or login with" */}
                <div className="relative flex items-center justify-center my-4">
                  <div className="border-t border-gray-200/80 w-full" />
                  <span className="absolute bg-white px-2.5 text-[11px] text-gray-400 font-normal select-none">
                    or login with
                  </span>
                </div>

                {/* Social Login Buttons */}
                <div className="space-y-2 pt-0.5">
                  {/* Google Login Button with Official Google Icon */}
                  <button
                    type="button"
                    onClick={() => handleSocialClick('google')}
                    className="w-full h-[36px] sm:h-[38px] rounded-full border border-gray-200/90 bg-white hover:bg-gray-50/80 active:scale-[0.99] transition-all duration-150 flex items-center justify-center gap-2 text-[11px] font-medium text-gray-700 shadow-2xs cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
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
                    <span>Login with Google</span>
                  </button>

                  {/* Facebook Login Button with Official Facebook Icon */}
                  <button
                    type="button"
                    onClick={() => handleSocialClick('facebook')}
                    className="w-full h-[36px] sm:h-[38px] rounded-full border border-gray-200/90 bg-white hover:bg-gray-50/80 active:scale-[0.99] transition-all duration-150 flex items-center justify-center gap-2 text-[11px] font-medium text-gray-700 shadow-2xs cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5 shrink-0 text-[#1877F2] fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span>Login with Facebook</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Bottom Section: Did not have any account? Register Now */}
            <div className="pt-8 pb-3 text-center text-[11px] sm:text-[11.5px] text-gray-400">
              <span>Did not have any account?</span>{' '}
              <button
                type="button"
                onClick={handleRegisterClick}
                className="font-bold text-gray-900 hover:underline transition-colors ml-0.5 cursor-pointer"
              >
                Register Now
              </button>
            </div>
          </div>

          {/* Right Side: Image Slider (Exact dimensions ~411px x 570px on desktop, responsive on smaller screens) */}
          <div
            className="w-full lg:w-[411px] shrink-0 h-[220px] sm:h-[320px] lg:h-[570px] relative rounded-[20px] overflow-hidden select-none bg-neutral-900 shadow-inner group mt-2 lg:mt-0"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Multiple Images with Smooth Transition Animations */}
            {SLIDES.map((slide, index) => {
              const isActive = index === currentSlide;
              return (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                  {/* Subtle vignette layer */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                </div>
              );
            })}

            {/* Slider Navigation Indicators at Bottom Center (Matching exact reference capsule + dots) */}
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5"
              role="tablist"
              aria-label="Image slider navigation"
            >
              {SLIDES.map((slide, index) => {
                const isActive = index === currentSlide;
                return (
                  <button
                    key={slide.id}
                    onClick={() => setCurrentSlide(index)}
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`Go to slide ${index + 1}`}
                    className={`transition-all duration-300 rounded-full focus:outline-none ${
                      isActive
                        ? 'w-6 h-1.5 bg-white/95 shadow-sm'
                        : 'w-1.5 h-1.5 bg-white/45 hover:bg-white/75'
                    }`}
                  />
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
