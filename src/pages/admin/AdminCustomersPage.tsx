import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Users,
  Search,
  Filter,
  ShoppingBag,
  DollarSign,
  ShieldCheck,
  Calendar,
  Sparkles,
  RefreshCw,
  Mail,
  UserCheck,
  ArrowUpDown
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { StatCard } from '../../components/admin/StatCard';
import { Button } from '../../components/admin/Button';
import { adminUserApi, AdminUser } from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';

export const AdminCustomersPage: React.FC = () => {
  const { showToast } = useToast();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'USER' | 'ADMIN'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'orders' | 'spent'>('newest');

  const fetchUsers = useCallback(async (isInitial = false) => {
    if (isInitial) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const data = await adminUserApi.getUsers();
      setUsers(data);
    } catch (err: any) {
      console.error('[AdminCustomersPage] Fetch error:', err);
      showToast('Failed to load registered customers from backend', 'error');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchUsers(true);
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    return users
      .filter((u) => {
        if (roleFilter === 'all') return true;
        if (roleFilter === 'ADMIN') return u.roles?.includes('ADMIN');
        return !u.roles?.includes('ADMIN');
      })
      .filter((u) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'orders') {
          return (b.totalOrders || 0) - (a.totalOrders || 0);
        }
        if (sortBy === 'spent') {
          return (b.totalSpent || 0) - (a.totalSpent || 0);
        }
        return 0;
      });
  }, [users, roleFilter, searchQuery, sortBy]);

  const totalUsers = users.length;
  const totalCustomers = users.filter((u) => !u.roles?.includes('ADMIN')).length;
  const activeCustomers = users.filter((u) => (u.totalOrders || 0) > 0).length;
  const totalLifetimeRevenue = users.reduce((sum, u) => sum + (u.totalSpent || 0), 0);

  return (
    <AdminLayout
      title="Registered Customers & Users"
      subtitle="View, search, and inspect customer profiles, ordering frequency, and accounts"
    >
      <div className="space-y-6">
        {/* Metric Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <StatCard
            stat={{
              title: 'Total Accounts',
              value: totalUsers,
              change: 'Registered in MongoDB',
              isPositive: true,
              subtitle: 'Active system users',
              iconName: 'shopping-bag',
            }}
          />
          <StatCard
            stat={{
              title: 'Ordering Customers',
              value: activeCustomers,
              change: `${Math.round((activeCustomers / Math.max(totalUsers, 1)) * 100)}% conversion`,
              isPositive: true,
              subtitle: 'Placed at least 1 order',
              iconName: 'utensils',
            }}
          />
          <StatCard
            stat={{
              title: 'Customer Lifetime Spend',
              value: `$${totalLifetimeRevenue.toFixed(2)}`,
              change: 'All time',
              isPositive: true,
              subtitle: 'Total settled volume',
              iconName: 'dollar-sign',
            }}
          />
          <StatCard
            stat={{
              title: 'Customer Accounts',
              value: totalCustomers,
              change: `${users.filter(u => u.roles?.includes('ADMIN')).length} Admins`,
              isPositive: true,
              subtitle: 'Standard user role',
              iconName: 'clock',
            }}
          />
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-soft space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search customers by name or email..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Role Filter & Sort Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs sm:text-sm outline-none focus:border-primary"
                >
                  <option value="all">All Roles ({users.length})</option>
                  <option value="USER">Customers Only</option>
                  <option value="ADMIN">Admins Only</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                <ArrowUpDown className="w-4 h-4 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs sm:text-sm outline-none focus:border-primary"
                >
                  <option value="newest">Newest Registration</option>
                  <option value="orders">Most Orders</option>
                  <option value="spent">Highest Spend</option>
                </select>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchUsers(false)}
                disabled={isRefreshing}
                leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-primary' : 'text-gray-500'}`} />}
                className="text-xs"
              >
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  <th className="py-3.5 px-4 sm:px-6">User / Customer</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Total Orders</th>
                  <th className="py-3.5 px-4">Total Spend</th>
                  <th className="py-3.5 px-4">Registered Date</th>
                  <th className="py-3.5 px-4 sm:px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <RefreshCw className="w-6 h-6 animate-spin text-primary" />
                        <span className="text-xs font-semibold">Loading customers...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-400">
                      No users match your selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const isAdmin = user.roles?.includes('ADMIN');
                    const initial = (user.name.charAt(0) || 'U').toUpperCase();

                    return (
                      <tr
                        key={user.id || user._id}
                        className="hover:bg-orange-50/30 transition-colors group"
                      >
                        {/* User Identity */}
                        <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                              isAdmin
                                ? 'bg-gradient-to-tr from-[#FF6B35] to-[#F7931E] text-white shadow-soft-sm'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {initial}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900 flex items-center gap-1.5">
                                <span>{user.name}</span>
                                {user.googleId && (
                                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-50 text-blue-600 border border-blue-100">
                                    Google
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-gray-500 font-normal flex items-center gap-1 mt-0.5">
                                <Mail className="w-3 h-3 text-gray-400" />
                                {user.email}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Role Badge */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          {isAdmin ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-gradient-to-r from-orange-500/10 to-amber-500/10 text-orange-700 border border-orange-200">
                              <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                              <UserCheck className="w-3.5 h-3.5 text-gray-500" /> Customer
                            </span>
                          )}
                        </td>

                        {/* Total Orders */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 font-bold px-2.5 py-0.5 rounded-lg text-xs ${
                            user.totalOrders > 0
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-display'
                              : 'text-gray-400 font-normal'
                          }`}>
                            <ShoppingBag className="w-3 h-3" />
                            {user.totalOrders || 0} order{user.totalOrders === 1 ? '' : 's'}
                          </span>
                        </td>

                        {/* Total Spend */}
                        <td className="py-4 px-4 whitespace-nowrap font-bold text-gray-900 font-display">
                          ${(user.totalSpent || 0).toFixed(2)}
                        </td>

                        {/* Registered Date */}
                        <td className="py-4 px-4 whitespace-nowrap text-xs text-gray-500 font-medium">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            {user.createdAt
                              ? new Date(user.createdAt).toLocaleDateString([], {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })
                              : 'N/A'}
                          </div>
                        </td>

                        {/* Account Status */}
                        <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-6 py-4 bg-gray-50/80 border-t border-gray-100 text-xs text-gray-500 flex items-center justify-between">
            <span>
              Showing <strong className="text-gray-900">{filteredUsers.length}</strong> of{' '}
              <strong className="text-gray-900">{users.length}</strong> registered accounts
            </span>
            <span className="font-semibold text-gray-400">Secured with Admin Authorization</span>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCustomersPage;

