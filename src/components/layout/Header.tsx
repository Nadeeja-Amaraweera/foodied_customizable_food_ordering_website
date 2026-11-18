import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag } from 'lucide-react';
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

  const isHome = pathname === '/';
  const isMenu = pathname === '/menu';
  const isCart = pathname === '/cart';
  const isAccount = pathname === '/account' || pathname === '/my-account';
  const isExperience = pathname === '/experience';
  const isTransparent = transparent ?? isExperience;

  const handleCartClick = () => {
    if (onCartOpen) {
      onCartOpen();
    } else {
      navigate('/cart');
    }
  };

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const contactElem = document.getElementById('contact-us') || document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If Contact section is not present on current page, navigate to Home first and scroll
      navigate('/#contact-us');
    }
  };

  return (
    <header
      className={`${isTransparent
          ? 'fixed top-0 left-0 right-0 z-50 w-full bg-gradient-to-b from-black/85 via-black/45 to-transparent backdrop-blur-[2px] transition-all duration-300'
          : 'relative z-20 w-full'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-5 sm:pt-6 pb-4">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            to="/"
            className={`text-2xl sm:text-[26px] font-black tracking-tight flex items-center gap-1.5 transition ${isTransparent
                ? 'text-white hover:text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]'
                : 'text-[#1A1A1A] hover:opacity-90'
              }`}
          >
            FOODIED
          </Link>

          {/* Primary Desktop Navigation Bar: Home | Menu | Experience | Contact Us */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
            <Link
              to="/"
              className={`transition pb-1 ${isHome
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
              className={`transition pb-1 ${isMenu
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
              className={`transition pb-1 ${isExperience
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
              className={`transition pb-1 font-semibold cursor-pointer ${isTransparent
                  ? 'text-white/90 hover:text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]'
                  : 'text-[#1A1A1A] hover:text-[#558B2F]'
                }`}
            >
              Contact Us
            </button>
          </nav>

          {/* Action Controls & User Auth */}
          <div className="flex items-center gap-3">
            {/* Search Toggle */}
            {onSearchToggle && onSearchChange && (
              <div className="relative flex items-center">
                {isSearchOpen && (
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="Search dishes..."
                    className="w-36 sm:w-48 px-3 py-1.5 mr-2 rounded-full bg-white text-xs text-gray-800 shadow-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#8BC34A]"
                  />
                )}
                <button
                  onClick={onSearchToggle}
                  aria-label="Search Menu"
                  className="w-9 h-9 rounded-full bg-white text-[#1A1A1A] shadow-sm flex items-center justify-center hover:scale-105 transition cursor-pointer"
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
              className={`w-9 h-9 rounded-full shadow-sm flex items-center justify-center relative hover:scale-105 transition cursor-pointer ${isCart
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

            {/* User Profile / Account or Sign In */}
            {currentUser ? (
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full shadow-sm border transition text-xs font-semibold ${isTransparent
                    ? 'bg-black/35 backdrop-blur-md border-white/25 text-white'
                    : isAccount
                      ? 'bg-white text-gray-800 border-[#8BC34A] ring-2 ring-[#8BC34A]/25'
                      : 'bg-white text-gray-800 border-gray-200/80 hover:border-gray-300'
                  }`}
              >
                <Link
                  to="/account"
                  title="View My Account & Orders"
                  className={`flex items-center gap-1.5 transition cursor-pointer ${isTransparent ? 'text-white hover:text-[#8BC34A]' : 'hover:text-[#558B2F]'
                    }`}
                >
                  <span className="w-6 h-6 rounded-full bg-[#8BC34A] text-white flex items-center justify-center text-[10px] font-black uppercase shadow-xs">
                    {currentUser.email?.[0]?.toUpperCase() || 'U'}
                  </span>
                  <span className="max-w-[110px] truncate hidden sm:inline">
                    {currentUser.username || currentUser.email?.split('@')[0] || 'My Account'}
                  </span>
                </Link>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    title="Sign out"
                    className={`text-[11px] font-normal underline ml-1 cursor-pointer ${isTransparent ? 'text-white/70 hover:text-red-400' : 'text-gray-400 hover:text-red-500'
                      }`}
                  >
                    Logout
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={onAuthNavigate || (() => navigate('/login'))}
                  className={`px-3.5 py-2 rounded-full font-semibold text-xs sm:text-sm transition cursor-pointer ${isTransparent ? 'text-white/90 hover:text-white drop-shadow-sm' : 'text-[#1A1A1A] hover:text-[#558B2F]'
                    }`}
                >
                  Sign In
                </button>
                <button
                  onClick={onAuthNavigate || (() => navigate('/register'))}
                  className={`px-5 py-2 rounded-full font-semibold text-xs sm:text-sm shadow-sm hover:shadow-md hover:scale-105 transition cursor-pointer ${isTransparent
                      ? 'bg-[#8BC34A] text-white hover:bg-[#7CB342] shadow-[0_4px_14px_rgba(139,195,74,0.4)]'
                      : 'bg-white text-[#1A1A1A]'
                    }`}
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Responsive Navigation Bar: Home | Menu | Experience | Contact Us */}
        <div
          className={`flex md:hidden items-center justify-center gap-2.5 mt-3 pt-2 border-t ${isTransparent ? 'border-white/15' : 'border-gray-100/80'
            }`}
        >
          <Link
            to="/"
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${isHome
                ? 'bg-[#8BC34A] text-white shadow-sm'
                : isTransparent
                  ? 'bg-black/40 text-white/90 border border-white/20 backdrop-blur-md'
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
          >
            Home
          </Link>
          <Link
            to="/menu"
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${isMenu
                ? 'bg-[#8BC34A] text-white shadow-sm'
                : isTransparent
                  ? 'bg-black/40 text-white/90 border border-white/20 backdrop-blur-md'
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
          >
            Menu
          </Link>
          <Link
            to="/experience"
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${isExperience
                ? 'bg-[#8BC34A] text-white shadow-sm'
                : isTransparent
                  ? 'bg-black/40 text-white/90 border border-white/20 backdrop-blur-md'
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
          >
            Experience
          </Link>
          <button
            type="button"
            onClick={handleContactClick}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${isTransparent
                ? 'bg-black/40 text-white/90 border border-white/20 backdrop-blur-md hover:bg-white/20'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
              }`}
          >
            Contact Us
          </button>
          {currentUser && (
            <Link
              to="/account"
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${isAccount
                  ? 'bg-[#8BC34A] text-white shadow-sm'
                  : isTransparent
                    ? 'bg-black/40 text-white/90 border border-white/20 backdrop-blur-md'
                    : 'bg-white text-gray-700 border border-gray-200'
                }`}
            >
              Account
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
