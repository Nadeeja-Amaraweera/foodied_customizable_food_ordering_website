import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react';
import { register } from '../services/auth';

interface RegisterPageProps {
  onRegister?: (details: { name: string; email: string; password: string }) => Promise<void> | void;
  onLogin?: () => void;
  onBackToHome?: () => void;
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

type FormErrors = {
  name?: string;
  email?: string;
  password?: string;
  general?: string;
};

const inputClass = (hasError: boolean) =>
  `w-full h-[36px] sm:h-[38px] px-4 rounded-full border text-[12px] text-gray-800 placeholder-gray-400 bg-white transition-all duration-150 focus:outline-none ${
    hasError
      ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-100'
      : 'border-gray-200/90 hover:border-gray-300 focus:border-gray-400 focus:ring-1 focus:ring-gray-200'
  } disabled:bg-gray-50 disabled:cursor-not-allowed`;

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onRegister,
  onLogin,
  onBackToHome
}) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const slideTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isHovered) {
      if (slideTimerRef.current) clearInterval(slideTimerRef.current);
      return;
    }

    slideTimerRef.current = window.setInterval(() => {
      setCurrentSlide((previous) => (previous + 1) % SLIDES.length);
    }, 4500);

    return () => {
      if (slideTimerRef.current) clearInterval(slideTimerRef.current);
    };
  }, [isHovered]);

  const clearError = (field: keyof FormErrors) => {
    if (errors[field]) setErrors((previous) => ({ ...previous, [field]: undefined }));
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

    const newErrors: FormErrors = {};
    if (!name.trim()) newErrors.name = 'Please enter your name.';
    if (!email.trim()) {
      newErrors.email = 'Please enter your email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!password) {
      newErrors.password = 'Please enter a password.';
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
      if (onRegister) {
        await onRegister({ name: name.trim(), email: email.trim(), password });
      } else {
        await register(name.trim(), email.trim(), password);
        navigate('/login');
      }
    } catch (error: unknown) {
      setErrors({
        general: error instanceof Error ? error.message : 'Registration failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#EFEFEF] flex items-center justify-center p-3 sm:p-5 lg:p-7 py-8 sm:py-6 relative select-none selection:bg-neutral-900 selection:text-white">
      <button
        type="button"
        onClick={handleBackHome}
        className="absolute top-4 left-4 sm:top-6 sm:left-6 z-30 inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-black bg-white/70 hover:bg-white backdrop-blur-xs py-1.5 px-3.5 rounded-full shadow-xs transition-all duration-200 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Foodied</span>
      </button>

      <div className="w-full max-w-[968px] min-h-[580px] lg:h-[626px] bg-white rounded-[26px] sm:rounded-[28px] shadow-[0_15px_45px_-10px_rgba(0,0,0,0.06)] border border-gray-100/60 p-5 sm:p-6 lg:p-0 lg:pr-[28px] lg:pt-[28px] lg:pb-[28px] overflow-hidden flex flex-col justify-between my-auto">
        <div className="flex flex-col lg:flex-row items-stretch justify-between h-full gap-6 lg:gap-0">
          <div className="flex-1 flex flex-col justify-between pt-4 pb-3 lg:pt-6 lg:pb-3 px-0">
            <div className="w-full max-w-[272px] mx-auto">
              <div className="text-center">
                <h1 className="text-[26px] sm:text-[28px] font-bold tracking-tight text-[#111111]">
                  Create Account
                </h1>
                <p className="text-[11px] sm:text-[11.5px] text-gray-400 font-normal mt-1 tracking-normal">
                  Register with your name, email and password.
                </p>
              </div>

              {errors.general && (
                <div className="mt-3 p-2 rounded-xl bg-red-50 border border-red-100 text-[11px] text-red-600 text-center font-medium">
                  {errors.general}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-3" noValidate>
                <div>
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value);
                      clearError('name');
                    }}
                    placeholder="Name"
                    autoComplete="name"
                    disabled={isLoading}
                    className={inputClass(Boolean(errors.name))}
                  />
                  {errors.name && <p className="text-[10px] text-red-500 mt-1 pl-3 font-medium">{errors.name}</p>}
                </div>

                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      clearError('email');
                    }}
                    placeholder="Email"
                    autoComplete="email"
                    disabled={isLoading}
                    className={inputClass(Boolean(errors.email))}
                  />
                  {errors.email && <p className="text-[10px] text-red-500 mt-1 pl-3 font-medium">{errors.email}</p>}
                </div>

                <div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        clearError('password');
                      }}
                      placeholder="Password"
                      autoComplete="new-password"
                      disabled={isLoading}
                      className={`${inputClass(Boolean(errors.password))} pl-4 pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((previous) => !previous)}
                      tabIndex={-1}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-[10px] text-red-500 mt-1 pl-3 font-medium">{errors.password}</p>}
                </div>

                <div className="pt-0.5">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-[36px] sm:h-[38px] rounded-full bg-[#181818] hover:bg-black active:scale-[0.99] text-white text-[12px] sm:text-[13px] font-medium transition-all duration-150 shadow-xs flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                        <span>Creating account...</span>
                      </>
                    ) : (
                      'Register'
                    )}
                  </button>
                </div>
              </form>
            </div>

            <div className="pt-8 pb-3 text-center text-[11px] sm:text-[11.5px] text-gray-400">
              <span>Already have an account?</span>{' '}
              <button
                type="button"
                onClick={handleLoginClick}
                className="font-bold text-gray-900 hover:underline transition-colors ml-0.5 cursor-pointer"
              >
                Login
              </button>
            </div>
          </div>

          <div
            className="w-full lg:w-[411px] shrink-0 h-[220px] sm:h-[320px] lg:h-[570px] relative rounded-[20px] overflow-hidden select-none bg-neutral-900 shadow-inner group mt-2 lg:mt-0"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {SLIDES.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.alt}
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              </div>
            ))}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5" role="tablist" aria-label="Image slider navigation">
              {SLIDES.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setCurrentSlide(index)}
                  role="tab"
                  aria-selected={index === currentSlide}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`transition-all duration-300 rounded-full focus:outline-none ${
                    index === currentSlide
                      ? 'w-6 h-1.5 bg-white/95 shadow-sm'
                      : 'w-1.5 h-1.5 bg-white/45 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
