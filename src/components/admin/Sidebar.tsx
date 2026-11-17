import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BellRing,
  History,
  UtensilsCrossed,
  Settings,
  Users,
  LogOut,
  Flame,
  Store,
  ChevronRight,
  X
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';

interface SidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  newOrdersCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpenMobile,
  onCloseMobile,
  newOrdersCount = 2,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const adminName = user?.name || user?.username || (user?.email ? user.email.split('@')[0] : 'Admin');
  const avatarInitial = (adminName.charAt(0) || 'A').toUpperCase();

  const navLinks = [
    {
      name: 'Dashboard',
      path: '/admin/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: 'Incoming Orders',
      path: '/admin/orders/incoming',
      icon: <BellRing className="w-5 h-5" />,
      badge: newOrdersCount > 0 ? `${newOrdersCount} NEW` : undefined,
      pulse: newOrdersCount > 0,
    },
    {
      name: 'Recent Orders',
      path: '/admin/orders/recent',
      icon: <History className="w-5 h-5" />,
    },
    {
      name: 'Products & Menu',
      path: '/admin/products',
      icon: <UtensilsCrossed className="w-5 h-5" />,
    },
    {
      name: 'Customers & Users',
      path: '/admin/customers',
      icon: <Users className="w-5 h-5" />,
    },
    {
      name: 'Settings',
      path: '/admin/settings',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#1A1A2E] text-white border-r border-[#262A45] select-none">
      {/* Brand Header */}
      <div className="p-6 pb-5 flex items-center justify-between border-b border-[#252843]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6B35] to-[#F7931E] flex items-center justify-center shadow-glow-primary text-white">
            <Flame className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight font-display bg-gradient-to-r from-white via-orange-100 to-[#F7931E] bg-clip-text text-transparent">
              Foodied Admin
            </h1>
            <p className="text-[11px] text-gray-400 font-medium">
              Kitchen & Operations Suite
            </p>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-3 mb-2">
          Management
        </div>

        {navLinks.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onCloseMobile}
            className={({ isActive }) =>
              `group relative flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white shadow-glow-primary font-semibold'
                  : 'text-gray-300 hover:text-white hover:bg-white/[0.07]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <span
                    className={`transition-colors duration-200 ${
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-amber-400'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      isActive
                        ? 'bg-white text-primary'
                        : 'bg-rose-500 text-white'
                    }`}
                  >
                    {item.pulse && (
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
                    )}
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}

        {/* Store Customer Facing Link */}
        <div className="pt-6">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-3 mb-2">
            Storefront
          </div>
          <NavLink
            to="/"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-teal-300 bg-teal-950/40 border border-teal-800/40 hover:bg-teal-900/50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Store className="w-4 h-4 text-teal-400" />
              <span>Go to Customer Store</span>
            </div>
            <ChevronRight className="w-4 h-4 text-teal-400" />
          </NavLink>
        </div>
      </div>

      {/* Admin Profile Footer */}
      <div className="p-4 border-t border-[#252843] bg-[#161628]">
        <div className="flex items-center justify-between gap-3 p-2 rounded-xl bg-white/[0.04]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF6B35] to-[#F7931E] flex items-center justify-center text-white font-bold text-sm border border-white/20 shadow-xs">
                {avatarInitial}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#161628]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate leading-tight">
                {adminName}
              </p>
              <p className="text-[11px] text-gray-400 truncate">
                {user?.email || 'Super Admin'}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-rose-400 hover:bg-white/10 rounded-lg transition-colors shrink-0"
            title="Log out of Admin"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] h-full z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
