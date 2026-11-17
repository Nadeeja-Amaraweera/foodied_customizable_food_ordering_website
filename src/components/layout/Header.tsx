import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag } from 'lucide-react';
import { User } from '../../types';

export interface HeaderProps {
  searchQuery?: string;
  isSearchOpen?: boolean;
  cartTotalCount?: number;
  currentUser?: User | null;
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
    <header className="relative z-20 max-w-7xl mx-auto px-4 sm:px-8 pt-6 pb-4">
      <div className="flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          className="text-2xl sm:text-[26px] font-black tracking-tight text-[#1A1A1A] flex items-center gap-1.5 hover:opacity-90 transition"
        >
          FOODIED
        </Link>

        {/* Primary Desktop Navigation Bar: Home | Menu | Contact Us */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
          <Link
            to="/"
            className={`transition pb-1 ${
              isHome
                ? 'text-[#8BC34A] lg:text-[#7CB342] font-black border-b-2 border-[#8BC34A]'
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
                : 'text-[#1A1A1A] hover:text-[#558B2F]'
            }`}
          >
            Menu
          </Link>

          <button
            type="button"
            onClick={handleContactClick}
            className="text-[#1A1A1A] hover:text-[#558B2F] transition pb-1 font-semibold cursor-pointer"
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
            className={`w-9 h-9 rounded-full shadow-sm flex items-center justify-center relative hover:scale-105 transition cursor-pointer ${
              isCart ? 'bg-[#8BC34A] text-white' : 'bg-white text-[#1A1A1A]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            {cartTotalCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#1A1A1A] text-white text-[10px] font-bold flex items-center justify-center shadow">
                {cartTotalCount}
              </span>
            )}
          </button>

          {/* User Profile / Account or Sign In */}
          {currentUser ? (
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-white shadow-sm border transition text-xs font-semibold text-gray-800 ${
                isAccount
                  ? 'border-[#8BC34A] ring-2 ring-[#8BC34A]/25'
                  : 'border-gray-200/80 hover:border-gray-300'
              }`}
            >
              <Link
                to="/account"
                title="View My Account & Orders"
                className="flex items-center gap-1.5 hover:text-[#558B2F] transition cursor-pointer"
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
                  className="text-gray-400 hover:text-red-500 text-[11px] font-normal underline ml-1 cursor-pointer"
                >
                  Logout
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={onAuthNavigate || (() => navigate('/login'))}
                className="px-3.5 py-2 rounded-full text-[#1A1A1A] font-semibold text-xs sm:text-sm hover:text-[#558B2F] transition cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={onAuthNavigate || (() => navigate('/register'))}
                className="px-5 py-2 rounded-full bg-white text-[#1A1A1A] font-semibold text-xs sm:text-sm shadow-sm hover:shadow-md hover:scale-105 transition cursor-pointer"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Responsive Navigation Bar: Home | Menu | Contact Us */}
      <div className="flex md:hidden items-center justify-center gap-2.5 mt-3 pt-2 border-t border-gray-100/80">
        <Link
          to="/"
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
            isHome
              ? 'bg-[#8BC34A] text-white shadow-sm'
              : 'bg-white text-gray-700 border border-gray-200'
          }`}
        >
          Home
        </Link>
        <Link
          to="/menu"
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
            isMenu
              ? 'bg-[#8BC34A] text-white shadow-sm'
              : 'bg-white text-gray-700 border border-gray-200'
          }`}
        >
          Menu
        </Link>
        <button
          type="button"
          onClick={handleContactClick}
          className="px-4 py-1.5 rounded-full text-xs font-bold transition bg-white text-gray-700 border border-gray-200 hover:border-gray-300 cursor-pointer"
        >
          Contact Us
        </button>
        {currentUser && (
          <Link
            to="/account"
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
              isAccount
                ? 'bg-[#8BC34A] text-white shadow-sm'
                : 'bg-white text-gray-700 border border-gray-200'
            }`}
          >
            Account
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
