import React from 'react';
import { Search, ShoppingBag } from 'lucide-react';

interface StoreHeaderProps {
  searchQuery: string;
  isSearchOpen: boolean;
  cartTotalCount: number;
  currentUser: { username: string } | null;
  onSearchToggle: () => void;
  onSearchChange: (value: string) => void;
  onCartOpen: () => void;
  onLogout: () => void;
  onAuthNavigate: () => void;
}

export const StoreHeader: React.FC<StoreHeaderProps> = ({
  searchQuery,
  isSearchOpen,
  cartTotalCount,
  currentUser,
  onSearchToggle,
  onSearchChange,
  onCartOpen,
  onLogout,
  onAuthNavigate
}) => (
  <header className="relative z-20 max-w-7xl mx-auto px-4 sm:px-8 pt-6 pb-4 flex items-center justify-between">
    <a
      href="#top"
      className="text-2xl sm:text-[26px] font-black tracking-tight text-[#1A1A1A] flex items-center gap-1.5"
    >
      FOODIED
    </a>

    <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
      <a href="#home" className="text-[#8BC34A] lg:text-[#7CB342] font-semibold border-b-2 border-[#8BC34A] pb-0.5">
        Home
      </a>
      <a href="#special-menu" className="text-[#1A1A1A] hover:text-[#558B2F] transition">
        Menu
      </a>
      <a href="#why-choose" className="text-[#1A1A1A] hover:text-[#558B2F] transition">
        About Us
      </a>
      <a href="#chefs" className="text-[#1A1A1A] hover:text-[#558B2F] transition">
        Contact
      </a>
    </nav>

    <div className="flex items-center gap-3">
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
          className="w-9 h-9 rounded-full bg-white text-[#1A1A1A] shadow-sm flex items-center justify-center hover:scale-105 transition"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

      <button
        onClick={onCartOpen}
        aria-label="Shopping Bag"
        className="w-9 h-9 rounded-full bg-white text-[#1A1A1A] shadow-sm flex items-center justify-center relative hover:scale-105 transition"
      >
        <ShoppingBag className="w-4 h-4" />
        {cartTotalCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#1A1A1A] text-white text-[10px] font-bold flex items-center justify-center shadow">
            {cartTotalCount}
          </span>
        )}
      </button>

      {currentUser ? (
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white shadow-sm border border-gray-200/80 text-xs font-semibold text-gray-800">
          <span className="w-5 h-5 rounded-full bg-[#8BC34A] text-white flex items-center justify-center text-[10px] font-black uppercase">
            {currentUser.username[0]}
          </span>
          <span className="max-w-[100px] truncate">{currentUser.username}</span>
          <button
            onClick={onLogout}
            className="text-gray-400 hover:text-red-500 text-[11px] font-normal underline ml-1 cursor-pointer"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onAuthNavigate}
            className="px-3.5 py-2 rounded-full text-[#1A1A1A] font-semibold text-xs sm:text-sm hover:text-[#558B2F] transition cursor-pointer"
          >
            Sign In
          </button>
          <button
            onClick={onAuthNavigate}
            className="px-5 py-2 rounded-full bg-white text-[#1A1A1A] font-semibold text-xs sm:text-sm shadow-sm hover:shadow-md hover:scale-105 transition cursor-pointer"
          >
            Sign Up
          </button>
        </div>
      )}
    </div>
  </header>
);
