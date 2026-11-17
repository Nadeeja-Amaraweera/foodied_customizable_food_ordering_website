import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import {
  User as UserIcon,
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  Flame,
  Truck,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  PackageCheck,
  Calendar,
  Sparkles,
  RefreshCw,
  Mail,
  Shield,
  UtensilsCrossed
} from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { StoreToast } from '../components/StoreOverlays';
import { FloatingLeaf } from '../components/common/FloatingLeaf';
import { orderApi, CustomerOrder, MyOrdersResponse } from '../services/orderApi';
import { useCart } from '../context/CartContext';
import useAuth from '../hooks/useAuth';
import { User } from '../types';

type OrderFilterTab = 'all' | 'preparing' | 'confirmed' | 'cancelled';
type MainAccountTab = 'orders' | 'delivered';

export const MyAccountPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const auth = useAuth();
  const { cartTotalCount } = useCart();

  // Active view tab (orders vs delivered)
  const activeMainTab: MainAccountTab =
    searchParams.get('tab') === 'delivered' ? 'delivered' : 'orders';

  // Status filter for the Order History tab
  const [statusFilter, setStatusFilter] = useState<OrderFilterTab>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 4;

  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalOrdersCount, setTotalOrdersCount] = useState<number>(0);
  const [statusCounts, setStatusCounts] = useState<{
    all: number;
    preparing: number;
    confirmed: number;
    cancelled: number;
    delivered: number;
    new: number;
  }>({
    all: 0,
    preparing: 0,
    confirmed: 0,
    cancelled: 0,
    delivered: 0,
    new: 0,
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Authenticated user representation
  const currentUser: User | null = useMemo(() => {
    if (!auth?.user) return null;
    return {
      username: auth.user.name || auth.user.username || auth.user.email || 'Customer',
      email: auth.user.email,
    };
  }, [auth?.user]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleLogout = () => {
    localStorage.removeItem('ACCESS_TOKEN');
    if (auth?.setUser) {
      auth.setUser(null);
    }
    navigate('/login');
  };

  // Fetch orders from backend API
  const fetchMyOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      // Determine backend status param
      let queryStatus = 'all';
      if (activeMainTab === 'delivered') {
        queryStatus = 'delivered';
      } else if (statusFilter !== 'all') {
        queryStatus = statusFilter;
      }

      const res: MyOrdersResponse = await orderApi.getMyOrders({
        status: queryStatus,
        page: currentPage,
        limit: itemsPerPage,
      });

      setOrders(res.data || []);
      setTotalPages(res.pagination?.totalPages || 1);
      setTotalOrdersCount(res.pagination?.total || 0);
      if (res.statusCounts) {
        setStatusCounts(res.statusCounts);
      }
    } catch (err: any) {
      console.error('Failed to load customer orders:', err);
      showToast(err?.response?.data?.message || 'Could not load your orders');
    } finally {
      setIsLoading(false);
    }
  }, [activeMainTab, statusFilter, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  // When changing filters or main tabs, reset to page 1
  const handleStatusFilterChange = (tab: OrderFilterTab) => {
    setStatusFilter(tab);
    setCurrentPage(1);
  };

  const handleMainTabChange = (tab: MainAccountTab) => {
    setSearchParams(tab === 'delivered' ? { tab: 'delivered' } : {});
    setCurrentPage(1);
  };

  const formatOrderDate = (dateString?: string) => {
    if (!dateString) return 'Just now';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Order Placed</span>
          </span>
        );
      case 'preparing':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Flame className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span>Preparing in Kitchen</span>
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
            <span>Kitchen Confirmed</span>
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E8F3DC] text-[#558B2F] border border-[#C5E1A5]">
            <PackageCheck className="w-3.5 h-3.5 text-[#558B2F]" />
            <span>Delivered</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFDF7] text-[#1A1A1A] font-sans relative overflow-x-hidden selection:bg-[#8BC34A] selection:text-white">
      {/* Decorative Organic Green Blob in Top Right */}
      <div
        className="hidden lg:block absolute top-0 right-0 w-[45%] h-[420px] bg-[#8BC34A]/20 pointer-events-none z-0"
        style={{ borderBottomLeftRadius: '60% 80%' }}
      />

      <FloatingLeaf className="hidden md:block w-28 h-28 absolute top-[400px] -right-6 z-10 opacity-90 rotate-12" />
      <FloatingLeaf
        className="hidden md:block w-32 h-32 absolute top-[850px] -left-8 z-10 opacity-90 -rotate-12"
        flip
      />

      <StoreToast message={toastMessage} />

      <Header
        cartTotalCount={cartTotalCount}
        currentUser={currentUser}
        onCartOpen={() => navigate('/cart')}
        onLogout={handleLogout}
        onAuthNavigate={() => navigate('/login')}
      />

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
        {/* Breadcrumb & Navigation Back */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#558B2F] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <Link
            to="/menu"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#558B2F] hover:text-[#33691E] transition"
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Order New Food</span>
          </Link>
        </div>

        {/* 1. Customer Account Profile Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-md mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#8BC34A] to-[#A5D6A7] text-white flex items-center justify-center font-black text-2xl sm:text-3xl uppercase shadow-md shadow-[#8BC34A]/25 ring-4 ring-[#FAFDF7]">
                {currentUser?.email?.[0] || 'C'}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-[#1A1A1A] tracking-tight">
                    {currentUser?.username || 'Customer Profile'}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#F4F9EE] text-[#558B2F] border border-[#E5F0DA]">
                    Active Customer
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <span>{currentUser?.email || 'customer@foodied.com'}</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                  <Shield className="w-3.5 h-3.5 text-[#8BC34A]" />
                  <span>Verified Customer Account</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="self-start sm:self-center px-4 py-2 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition cursor-pointer"
            >
              Sign Out
            </button>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
            <div className="bg-[#FAFDF7] p-4 rounded-2xl border border-[#E5F0DA]">
              <div className="flex items-center gap-2 text-[#558B2F] text-xs font-bold">
                <ShoppingBag className="w-4 h-4" />
                <span>Total Orders</span>
              </div>
              <p className="text-2xl font-black text-[#1A1A1A] mt-2">
                {statusCounts.all}
              </p>
            </div>

            <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200/50">
              <div className="flex items-center gap-2 text-amber-700 text-xs font-bold">
                <Flame className="w-4 h-4" />
                <span>In Kitchen</span>
              </div>
              <p className="text-2xl font-black text-amber-900 mt-2">
                {statusCounts.preparing + statusCounts.new}
              </p>
            </div>

            <div className="bg-teal-50/50 p-4 rounded-2xl border border-teal-200/50">
              <div className="flex items-center gap-2 text-teal-700 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirmed</span>
              </div>
              <p className="text-2xl font-black text-teal-900 mt-2">
                {statusCounts.confirmed}
              </p>
            </div>

            <div className="bg-[#E8F3DC]/40 p-4 rounded-2xl border border-[#C5E1A5]/50">
              <div className="flex items-center gap-2 text-[#558B2F] text-xs font-bold">
                <PackageCheck className="w-4 h-4" />
                <span>Delivered</span>
              </div>
              <p className="text-2xl font-black text-[#558B2F] mt-2">
                {statusCounts.delivered}
              </p>
            </div>
          </div>
        </div>

        {/* 2. Main View Tabs: My Orders vs. Recent Orders (Delivered) */}
        <div className="flex items-center gap-3 border-b border-gray-200/80 mb-6 pb-2">
          <button
            type="button"
            onClick={() => handleMainTabChange('orders')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition cursor-pointer ${
              activeMainTab === 'orders'
                ? 'bg-[#8BC34A] text-white shadow-md shadow-[#8BC34A]/25'
                : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>My Orders (History)</span>
            <span
              className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                activeMainTab === 'orders'
                  ? 'bg-white text-[#8BC34A]'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {statusCounts.all}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleMainTabChange('delivered')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition cursor-pointer ${
              activeMainTab === 'delivered'
                ? 'bg-[#8BC34A] text-white shadow-md shadow-[#8BC34A]/25'
                : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200'
            }`}
          >
            <PackageCheck className="w-4 h-4" />
            <span>Recent Orders (Delivered)</span>
            <span
              className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                activeMainTab === 'delivered'
                  ? 'bg-white text-[#8BC34A]'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {statusCounts.delivered}
            </span>
          </button>

          <button
            type="button"
            onClick={fetchMyOrders}
            title="Refresh order history"
            className="ml-auto w-9 h-9 rounded-full bg-white text-gray-500 hover:text-gray-900 border border-gray-200 flex items-center justify-center transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* 3. Status Filters (Visible on "My Orders" tab) */}
        {activeMainTab === 'orders' && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs font-bold text-gray-500 mr-1">Filter Status:</span>
            {[
              { id: 'all' as const, label: 'All Orders', count: statusCounts.all },
              { id: 'preparing' as const, label: 'Preparing', count: statusCounts.preparing },
              { id: 'confirmed' as const, label: 'Confirmed', count: statusCounts.confirmed },
              { id: 'cancelled' as const, label: 'Cancelled', count: statusCounts.cancelled },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleStatusFilterChange(tab.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-[#1A1A1A] text-white shadow-xs'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                    statusFilter === tab.id
                      ? 'bg-white/25 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* 4. Orders List Display */}
        {isLoading ? (
          /* Loading Skeletons */
          <div className="space-y-4">
            {[1, 2, 3].map((sk) => (
              <div
                key={sk}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm animate-pulse space-y-4"
              >
                <div className="flex justify-between items-center">
                  <div className="h-5 bg-gray-200 rounded-md w-36" />
                  <div className="h-6 bg-gray-200 rounded-full w-24" />
                </div>
                <div className="h-16 bg-gray-100 rounded-2xl w-full" />
                <div className="flex justify-between items-center pt-2">
                  <div className="h-4 bg-gray-200 rounded w-28" />
                  <div className="h-6 bg-gray-200 rounded w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl p-12 sm:p-16 text-center max-w-lg mx-auto border border-gray-100 shadow-sm my-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#FAFDF7] border border-[#E5F0DA] text-[#558B2F] flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-black text-[#1A1A1A]">
                {activeMainTab === 'delivered'
                  ? 'No Delivered Orders Yet'
                  : `No ${statusFilter === 'all' ? '' : statusFilter} orders found`}
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 max-w-sm mx-auto mt-2 leading-relaxed">
                {activeMainTab === 'delivered'
                  ? 'When your delicious customized food orders are delivered by our express couriers, they will appear right here!'
                  : 'You do not have any orders matching the active filter. Explore our menu to place an order!'}
              </p>
            </div>

            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#8BC34A] hover:bg-[#7CB342] text-white text-xs font-bold transition shadow-sm"
            >
              <span>Explore Food Menu</span>
              <UtensilsCrossed className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          /* Orders Cards */
          <div className="space-y-5">
            {orders.map((order) => (
              <div
                key={order._id || order.orderNumber}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm transition hover:shadow-md"
              >
                {/* Order Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-base font-black text-[#1A1A1A]">
                        {order.orderNumber}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Placed on {formatOrderDate(order.placedAt || order.createdAt)}</span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                      Total Order Amount
                    </span>
                    <span className="text-xl font-black text-[#558B2F]">
                      ${Number(order.totalAmount || 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Ordered Items List */}
                <div className="py-4 space-y-3.5">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-[#FAFDF7] border border-[#E5F0DA]/60"
                    >
                      <div className="flex items-start gap-3.5 min-w-0">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-14 h-14 rounded-xl object-cover ring-2 ring-[#8BC34A] shrink-0"
                          />
                        )}

                        <div className="min-w-0">
                          <h4 className="font-extrabold text-sm text-[#1A1A1A] leading-tight">
                            {item.quantity}x {item.name}
                          </h4>

                          {/* Portions & Customizations */}
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            {item.customization?.size && (
                              <span className="px-2 py-0.5 rounded-full bg-white text-[#558B2F] text-[10px] font-bold border border-[#E5F0DA]">
                                Size: {item.customization.size}
                              </span>
                            )}
                            {item.customization?.spiceLevel && (
                              <span className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 text-[10px] font-bold border border-orange-200">
                                {item.customization.spiceLevel}
                              </span>
                            )}
                          </div>

                          {/* Extras */}
                          {item.customization?.extras &&
                            item.customization.extras.length > 0 && (
                              <p className="text-[11px] text-gray-600 mt-1">
                                <span className="font-semibold text-gray-800">+ Extras:</span>{' '}
                                {item.customization.extras.join(', ')}
                              </p>
                            )}

                          {/* Notes */}
                          {item.customization?.specialInstructions && (
                            <p className="text-[10px] italic text-amber-700 mt-1 bg-amber-50/80 px-2 py-0.5 rounded inline-block">
                              Note: &ldquo;{item.customization.specialInstructions}&rdquo;
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-sm font-extrabold text-gray-900 block">
                          ${Number(item.totalPrice || item.unitPrice * item.quantity).toFixed(2)}
                        </span>
                        <span className="text-[11px] text-gray-400">
                          (${Number(item.unitPrice).toFixed(2)} each)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Card Footer: Delivery and Payment breakdown */}
                <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-500 gap-2">
                  <div className="flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-[#558B2F]" />
                    <span>
                      Delivery: <span className="font-semibold text-gray-800">{order.customer?.deliveryAddress || 'Standard Delivery'}</span>
                    </span>
                  </div>

                  <div>
                    Payment: <span className="font-bold text-gray-800">{order.paymentMethod || 'Credit Card'}</span> ({order.paymentStatus || 'Paid'})
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 5. Pagination Controls */}
        {!isLoading && totalPages > 1 && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200/80">
            <span className="text-xs text-gray-500 font-semibold">
              Showing page {currentPage} of {totalPages} ({totalOrdersCount} total orders)
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                  currentPage <= 1
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-100 bg-white'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {/* Page Number Buttons */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  type="button"
                  onClick={() => setCurrentPage(pg)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition cursor-pointer ${
                    currentPage === pg
                      ? 'bg-[#8BC34A] text-white shadow-xs'
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {pg}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                  currentPage >= totalPages
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-100 bg-white'
                }`}
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer
        onToast={showToast}
        onNewsletterSubscribe={() => showToast('Thank you for subscribing to our newsletter!')}
      />
    </div>
  );
};

export default MyAccountPage;

