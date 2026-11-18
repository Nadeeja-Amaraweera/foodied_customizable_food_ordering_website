import React, { useState } from 'react';
import {
  Menu,
  Bell,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

interface TopbarProps {
  onToggleMobileSidebar: () => void;
  title?: string;
  subtitle?: string;
  newOrdersCount?: number;
}

export const Topbar: React.FC<TopbarProps> = ({
  onToggleMobileSidebar,
  title = 'Kitchen Operations',
  subtitle,
  newOrdersCount = 0,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isStoreOpen, setIsStoreOpen] = useState(true);

  const adminName = user?.name || user?.username || (user?.email ? user.email.split('@')[0] : 'Admin');
  const avatarInitial = (adminName.charAt(0) || 'A').toUpperCase();

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-soft-sm">
      <div className="px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Left Side: Hamburger & Breadcrumbs/Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 font-display tracking-tight flex items-center gap-2">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-gray-400 font-medium hidden sm:block">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Store Status, Notification Bell, User Avatar */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Store Live / Closed Toggle */}
          <button
            onClick={() => setIsStoreOpen(!isStoreOpen)}
            className={`hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              isStoreOpen
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isStoreOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
              }`}
            />
            <span>{isStoreOpen ? 'Kitchen Accepting Orders' : 'Store Paused'}</span>
          </button>

          {/* Customer Facing Link Button */}
          <button
            onClick={() => navigate('/')}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors shadow-xs"
          >
            <ExternalLink className="w-3.5 h-3.5 text-primary" />
            <span>Customer View</span>
          </button>

          {/* Notification Bell with Red Dot Indicator (without click showing box) */}
          <div className="relative">
            <div
              className="relative p-2.5 rounded-xl text-gray-600 border border-gray-100 shadow-xs cursor-default select-none"
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
            </div>
          </div>

          {/* Admin Avatar & Profile Button */}
          <div
            onClick={() => navigate('/admin/settings')}
            className="flex items-center gap-2.5 pl-2 border-l border-gray-100 cursor-pointer group"
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF6B35] to-[#F7931E] flex items-center justify-center text-white font-bold text-sm ring-2 ring-primary/20 group-hover:ring-primary transition-all shadow-xs">
                {avatarInitial}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>

            <div className="hidden xl:block text-left">
              <p className="text-xs font-bold text-gray-900 leading-tight group-hover:text-primary transition-colors">
                {adminName}
              </p>
              <p className="text-[10px] text-gray-400 truncate max-w-[130px]">
                {user?.email || 'Head of Operations'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
