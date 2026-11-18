import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X, User as UserIcon, LogOut, ArrowRight, Utensils, Sparkles } from 'lucide-react';
import { User } from '../../types';

export interface HeaderProps {
  searchQuery?: string;
  isSearchOpen?: boolean;
  cartTotalCount?: number;
  currentUser?: User | null;
  transparent?: boolean;
  onSearchToggle?: () => void;
  onSearchChange?: (value: string) => void;
  onCartOpen?: () => void;
  onLogout?: () => void;
  onAuthNavigate?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery = '',
  isSearchOpen = false,
  cartTotalCount = 0,
  currentUser = null,
  transparent,
  onSearchToggle,
  onSearchChange,
  onCartOpen,
  onLogout,
  onAuthNavigate,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isHome = pathname === '/';
  const isMenu = pathname === '/menu';
  const isCart = pathname === '/cart';
  const isAccount = pathname === '/account' || pathname === '/my-account';
  const isExperience = pathname === '/experience';
  const isTransparent = transparent ?? isExperience;

  // Auto-close mobile menu on route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  const handleCartClick = () => {
    setIsMobileMenuOpen(false);
    if (onCartOpen) {
      onCartOpen();
    } else {
      navigate('/cart');
    }
  };

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const contactElem = document.getElementById('contact-us') || document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#contact-us');
    }
  };

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`${
        isTransparent
          ? 'fixed top-0 left-0 right-0 z-50 w-full bg-gradient-to-b from-black/85 via-black/45 to-transparent backdrop-blur-[2px] transition-all duration-300'
          : 'relative z-20 w-full'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-4 sm:pt-6 pb-3 sm:pb-4">
        <div className="flex items-center justify-between gap-3">
          {/* Brand Logo */}
          <Link
            to="/"
            onClick={handleNavClick}
            className={`text-2xl sm:text-[26px] font-black tracking-tight flex items-center gap-1.5 transition shrink-0 ${
              isTransparent
                ? 'text-white hover:text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]'
                : 'text-[#1A1A1A] hover:opacity-90'
            }`}
          >
            FOODIED
          </Link>

          {/* Desktop Navigation Bar (Preserved layout for tablet/desktop) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
            <Link
              to="/"
              className={`transition pb-1 ${
                isHome
                  ? 'text-[#8BC34A] lg:text-[#7CB342] font-black border-b-2 border-[#8BC34A]'
                  : isTransparent
                  ? 'text-white/90 hover:text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]'
                  : 'text-[#1A1A1A] hover:text-[#558B2F]'
              }`}
            >
              Home
            </Link>

            <Link
              to="/menu"
              className={`transition pb-1 ${
                isMenu
                  ? 'text-[#8BC34A] lg:text-[#7CB342] font-black border-b-2 border-[#8BC34A]'
                  : isTransparent
                  ? 'text-white/90 hover:text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]'
                  : 'text-[#1A1A1A] hover:text-[#558B2F]'
              }`}
            >
              Menu
            </Link>

            <Link
              to="/experience"
              className={`transition pb-1 ${
                isExperience
                  ? 'text-[#8BC34A] font-black border-b-2 border-[#8BC34A] drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]'
                  : isTransparent
                  ? 'text-white/90 hover:text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]'
                  : 'text-[#1A1A1A] hover:text-[#558B2F]'
              }`}
            >
              Experience
            </Link>

            <button
              type="button"
              onClick={handleContactClick}
              className={`transition pb-1 font-semibold cursor-pointer ${
                isTransparent
                  ? 'text-white/90 hover:text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]'
                  : 'text-[#1A1A1A] hover:text-[#558B2F]'
              }`}
            >
              Contact Us
            </button>
          </nav>

          {/* Action Controls & User Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Toggle (Desktop / Tablet) */}
            {onSearchToggle && onSearchChange && (
              <div className="relative flex items-center">
                {isSearchOpen && (
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="Search dishes..."
                    className="w-28 sm:w-48 px-3 py-1.5 mr-2 rounded-full bg-white text-xs text-gray-800 shadow-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#8BC34A]"
                  />
                )}
                <button
                  onClick={onSearchToggle}
                  aria-label="Search Menu"
                  className={`w-9 h-9 rounded-full shadow-sm flex items-center justify-center hover:scale-105 transition cursor-pointer ${
                    isTransparent
                      ? 'bg-white/20 text-white backdrop-blur-md border border-white/25 hover:bg-white/30'
                      : 'bg-white text-[#1A1A1A]'
                  }`}
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Cart Icon (with real-time item-count badge) */}
            <button
              onClick={handleCartClick}
              aria-label="Shopping Bag Cart"
              title="View Cart"
              className={`w-9 h-9 rounded-full shadow-sm flex items-center justify-center relative hover:scale-105 transition cursor-pointer shrink-0 ${
                isCart
                  ? 'bg-[#8BC34A] text-white'
                  : isTransparent
                  ? 'bg-white/20 text-white backdrop-blur-md border border-white/25 hover:bg-white/30'
                  : 'bg-white text-[#1A1A1A]'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              {cartTotalCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#8BC34A] text-white text-[10px] font-bold flex items-center justify-center shadow">
                  {cartTotalCount}
                </span>
              )}
            </button>

            {/* Desktop User Profile / Account or Sign In */}
            <div className="hidden md:flex items-center">
              {currentUser ? (
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full shadow-sm border transition text-xs font-semibold ${
                    isTransparent
                      ? 'bg-black/35 backdrop-blur-md border-white/25 text-white'
                      : isAccount
                      ? 'bg-white text-gray-800 border-[#8BC34A] ring-2 ring-[#8BC34A]/25'
                      : 'bg-white text-gray-800 border-gray-200/80 hover:border-gray-300'
                  }`}
                >
                  <Link
                    to="/account"
                    title="View My Account & Orders"
                    className={`flex items-center gap-1.5 transition cursor-pointer ${
                      isTransparent ? 'text-white hover:text-[#8BC34A]' : 'hover:text-[#558B2F]'
                    }`}
                  >
                    <span className="w-6 h-6 rounded-full bg-[#8BC34A] text-white flex items-center justify-center text-[10px] font-black uppercase shadow-xs">
                      {currentUser.email?.[0]?.toUpperCase() || 'U'}
                    </span>
                    <span className="max-w-[110px] truncate">
                      {currentUser.username || currentUser.email?.split('@')[0] || 'My Account'}
                    </span>
                  </Link>
                  {onLogout && (
                    <button
                      onClick={onLogout}
                      title="Sign out"
                      className={`text-[11px] font-normal underline ml-1 cursor-pointer ${
                        isTransparent ? 'text-white/70 hover:text-red-400' : 'text-gray-400 hover:text-red-500'
                      }`}
                    >
                      Logout
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={onAuthNavigate || (() => navigate('/login'))}
                    className={`px-3.5 py-2 rounded-full font-semibold text-xs sm:text-sm transition cursor-pointer ${
                      isTransparent ? 'text-white/90 hover:text-white drop-shadow-sm' : 'text-[#1A1A1A] hover:text-[#558B2F]'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={onAuthNavigate || (() => navigate('/register'))}
                    className={`px-5 py-2 rounded-full font-semibold text-xs sm:text-sm shadow-sm hover:shadow-md hover:scale-105 transition cursor-pointer ${
                      isTransparent
                        ? 'bg-[#8BC34A] text-white hover:bg-[#7CB342] shadow-[0_4px_14px_rgba(139,195,74,0.4)]'
                        : 'bg-white text-[#1A1A1A]'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={isMobileMenuOpen}
              className={`md:hidden w-9 h-9 rounded-full flex items-center justify-center shadow-sm transition-all duration-200 cursor-pointer ${
                isTransparent
                  ? 'bg-white/20 text-white backdrop-blur-md border border-white/25 hover:bg-white/30'
                  : 'bg-white text-gray-800 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 transition-transform duration-200" />
              ) : (
                <Menu className="w-5 h-5 transition-transform duration-200" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Hamburger Drawer Overlay ── */}
      {isMobileMenuOpen && (
        <div
          className={`md:hidden fixed inset-x-0 top-[65px] sm:top-[74px] bottom-0 z-50 flex flex-col justify-between overflow-y-auto px-6 py-6 transition-all duration-300 animate-fadeIn ${
            isTransparent
              ? 'bg-[#0c0a09]/95 text-white backdrop-blur-xl border-t border-white/10'
              : 'bg-white/95 text-gray-800 backdrop-blur-xl border-t border-gray-100 shadow-2xl'
          }`}
        >
          {/* Main Navigation Links List with Large Touch Targets */}
          <div className="space-y-2">
            <p className="text-[10px] uppercase font-black tracking-widest text-[#8BC34A] px-3 mb-2">
              Navigation
            </p>

            <Link
              to="/"
              onClick={handleNavClick}
              className={`flex items-center justify-between px-4 py-3.5 rounded-2xl text-base font-extrabold transition ${
                isHome
                  ? 'bg-[#8BC34A] text-white shadow-md shadow-[#8BC34A]/25'
                  : isTransparent
                  ? 'text-white hover:bg-white/10'
                  : 'text-gray-800 hover:bg-gray-100'
              }`}
            >
              <span>Home</span>
              <ArrowRight className="w-4 h-4 opacity-70" />
            </Link>

            <Link
              to="/menu"
              onClick={handleNavClick}
              className={`flex items-center justify-between px-4 py-3.5 rounded-2xl text-base font-extrabold transition ${
                isMenu
                  ? 'bg-[#8BC34A] text-white shadow-md shadow-[#8BC34A]/25'
                  : isTransparent
                  ? 'text-white hover:bg-white/10'
                  : 'text-gray-800 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Utensils className="w-4 h-4" />
                <span>Our Food Menu</span>
              </div>
              <ArrowRight className="w-4 h-4 opacity-70" />
            </Link>

            <Link
              to="/experience"
              onClick={handleNavClick}
              className={`flex items-center justify-between px-4 py-3.5 rounded-2xl text-base font-extrabold transition ${
                isExperience
                  ? 'bg-[#8BC34A] text-white shadow-md shadow-[#8BC34A]/25'
                  : isTransparent
                  ? 'text-white hover:bg-white/10'
                  : 'text-gray-800 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4" />
                <span>Food Experience</span>
              </div>
              <ArrowRight className="w-4 h-4 opacity-70" />
            </Link>

            <button
              type="button"
              onClick={handleContactClick}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-base font-extrabold text-left transition ${
                isTransparent
                  ? 'text-white hover:bg-white/10'
                  : 'text-gray-800 hover:bg-gray-100'
              }`}
            >
              <span>Contact Us</span>
              <ArrowRight className="w-4 h-4 opacity-70" />
            </button>
          </div>

          {/* User Account / Sign In Section at bottom of Drawer */}
          <div
            className={`pt-6 mt-6 border-t ${
              isTransparent ? 'border-white/10' : 'border-gray-100'
            }`}
          >
            {currentUser ? (
              <div className="space-y-3">
                <Link
                  to="/account"
                  onClick={handleNavClick}
                  className={`flex items-center gap-3 p-3 rounded-2xl transition ${
                    isTransparent ? 'bg-white/10 text-white' : 'bg-gray-50 text-gray-800'
                  }`}
                >
                  <span className="w-10 h-10 rounded-full bg-[#8BC34A] text-white flex items-center justify-center font-black text-sm uppercase shadow-xs shrink-0">
                    {currentUser.email?.[0]?.toUpperCase() || 'U'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-black truncate">
                      {currentUser.username || currentUser.email?.split('@')[0]}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{currentUser.email}</p>
                  </div>
                  <span className="text-xs font-bold text-[#8BC34A]">View Orders</span>
                </Link>

                {onLogout && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full py-3 px-4 rounded-2xl text-xs font-bold text-red-500 hover:bg-red-50 flex items-center justify-center gap-2 transition border border-red-200/50"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onAuthNavigate ? onAuthNavigate() : navigate('/login');
                  }}
                  className={`py-3.5 px-4 rounded-2xl text-sm font-extrabold text-center transition ${
                    isTransparent
                      ? 'bg-white/10 text-white hover:bg-white/20'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onAuthNavigate ? onAuthNavigate() : navigate('/register');
                  }}
                  className="py-3.5 px-4 rounded-2xl text-sm font-extrabold bg-[#8BC34A] text-white hover:bg-[#7CB342] shadow-md shadow-[#8BC34A]/30 text-center transition"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
