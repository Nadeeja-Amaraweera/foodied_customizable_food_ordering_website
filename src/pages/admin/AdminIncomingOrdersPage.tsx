import React, { useState, useEffect, useMemo } from 'react';
import {
  BellRing,
  Search,
  Filter,
  SlidersHorizontal,
  Flame,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Volume2,
  VolumeX,
  XCircle,
  Inbox
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { OrderCard } from '../../components/admin/OrderCard';
import { OrderDetailsModal } from '../../components/admin/OrderDetailsModal';
import { Modal } from '../../components/admin/Modal';
import { Button } from '../../components/admin/Button';
import { orderApi } from '../../services/orderApi';
import { AdminOrder, OrderStatus } from '../../data/adminMockData';
import { useToast } from '../../context/ToastContext';

export const AdminIncomingOrdersPage: React.FC = () => {
  const { showToast } = useToast();

  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'new' | 'preparing'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest_amount'>('newest');
  const [isSoundMuted, setIsSoundMuted] = useState(false);

  // Modals
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [rejectOrderTarget, setRejectOrderTarget] = useState<AdminOrder | null>(null);
  const [rejectReason, setRejectReason] = useState('Kitchen at maximum capacity / item sold out');

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = await orderApi.getOrders();
      const mapped: AdminOrder[] = data.map((o: any) => ({
        ...o,
        id: o._id || o.id,
        placedAt: o.placedAt ? new Date(o.placedAt).toISOString() : new Date().toISOString(),
        timeAgo: o.placedAt
          ? `${Math.max(1, Math.round((Date.now() - new Date(o.placedAt).getTime()) / 60000))} mins ago`
          : 'Just now',
        estimatedReadyTime: o.estimatedReadyTime || '15-20 mins',
      }));
      setOrders(mapped);
    } catch (err) {
      showToast('Failed to load incoming orders', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter & Search
  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) => {
        // Tab Filter: only active orders
        if (activeFilter === 'new') return order.status === 'new';
        if (activeFilter === 'preparing') return order.status === 'preparing';
        return order.status === 'new' || order.status === 'preparing';
      })
      .filter((order) => {
        // Search Filter
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        const matchesNumber = order.orderNumber.toLowerCase().includes(query);
        const matchesName = order.customer.name.toLowerCase().includes(query);
        const matchesPhone = order.customer.phone.toLowerCase().includes(query);
        const matchesItems = order.items.some((i) =>
          i.name.toLowerCase().includes(query) ||
          i.customization.extras?.some((e) => e.toLowerCase().includes(query))
        );
        return matchesNumber || matchesName || matchesPhone || matchesItems;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.placedAt).getTime() - new Date(b.placedAt).getTime();
        }
        if (sortBy === 'highest_amount') {
          return b.totalAmount - a.totalAmount;
        }
        return 0;
      });
  }, [orders, activeFilter, searchQuery, sortBy]);

  const newOrdersCount = orders.filter((o) => o.status === 'new').length;
  const preparingOrdersCount = orders.filter((o) => o.status === 'preparing').length;

  const handleConfirmOrder = async (order: AdminOrder) => {
    try {
      const nextStatus: OrderStatus = order.status === 'new' ? 'preparing' : 'confirmed';
      await orderApi.updateOrderStatus(order.id, nextStatus);
      showToast(
        `Order ${order.orderNumber} successfully confirmed! Moved to ${nextStatus}.`,
        'success',
        'Order Confirmed'
      );
      fetchOrders();
    } catch (err) {
      showToast('Failed to update order status', 'error');
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectOrderTarget) return;
    try {
      await orderApi.updateOrderStatus(rejectOrderTarget.id, 'cancelled');
      showToast(
        `Order ${rejectOrderTarget.orderNumber} has been rejected. Customer notified.`,
        'warning',
        'Order Cancelled'
      );
      setRejectOrderTarget(null);
      fetchOrders();
    } catch (err) {
      showToast('Failed to reject order', 'error');
    }
  };

  return (
    <AdminLayout
      title="Live Incoming Orders"
      subtitle="Real-time kitchen order dispatch & ticket confirmation queue"
      newOrdersCount={newOrdersCount}
    >
      <div className="space-y-6">
        
        {/* Top Control Bar: Filters, Tabs, Search & Sort */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-soft space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            
            {/* Filter Tabs */}
            <div className="flex items-center p-1 rounded-xl bg-gray-100/80 border border-gray-200/50 overflow-x-auto">
              <button
                onClick={() => setActiveFilter('all')}
                className={`flex items-center gap-2 text-xs font-bold px-3.5 py-2 rounded-lg transition-all ${
                  activeFilter === 'all'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <span>All Active Queue</span>
                <span className="text-[11px] font-bold px-1.5 py-0.2 rounded-full bg-gray-200 text-gray-700">
                  {newOrdersCount + preparingOrdersCount}
                </span>
              </button>

              <button
                onClick={() => setActiveFilter('new')}
                className={`flex items-center gap-2 text-xs font-bold px-3.5 py-2 rounded-lg transition-all ${
                  activeFilter === 'new'
                    ? 'bg-white text-rose-600 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <span>New Tickets</span>
                {newOrdersCount > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white animate-pulse">
                    {newOrdersCount} NEW
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveFilter('preparing')}
                className={`flex items-center gap-2 text-xs font-bold px-3.5 py-2 rounded-lg transition-all ${
                  activeFilter === 'preparing'
                    ? 'bg-white text-amber-700 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <span>Cooking & Prep</span>
                <span className="text-[11px] font-bold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800">
                  {preparingOrdersCount}
                </span>
              </button>
            </div>

            {/* Quick Actions (Sound Alert Toggle, Refresh) */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={() => setIsSoundMuted(!isSoundMuted)}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  isSoundMuted
                    ? 'bg-gray-100 border-gray-200 text-gray-500'
                    : 'bg-orange-50 border-orange-200 text-primary'
                }`}
                title={isSoundMuted ? 'Unmute Order Chime' : 'Mute Order Chime'}
              >
                {isSoundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span className="hidden md:inline">{isSoundMuted ? 'Muted' : 'Kitchen Chime On'}</span>
              </button>

              <button
                onClick={fetchOrders}
                disabled={isLoading}
                className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                title="Refresh Order Queue"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-primary' : ''}`} />
              </button>
            </div>
          </div>

          {/* Search & Sort Row */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-gray-100">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by order #, customer name, customized ingredients, or phone..."
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

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <SlidersHorizontal className="w-4 h-4 text-gray-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full sm:w-auto px-3 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm bg-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="newest">Newest Placed First</option>
                <option value="oldest">Oldest Tickets First</option>
                <option value="highest_amount">Highest Order Total</option>
              </select>
            </div>
          </div>
        </div>

        {/* Incoming Orders Grid */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-soft text-center max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-orange-50 text-primary flex items-center justify-center mx-auto shadow-xs">
              <Inbox className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900 font-display">
                No orders in this queue
              </h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                {searchQuery
                  ? `No orders matching "${searchQuery}". Try clearing the search filters.`
                  : 'All incoming customer orders have been confirmed and moved to the prep station!'}
              </p>
            </div>
            {searchQuery && (
              <Button variant="outline" size="sm" onClick={() => setSearchQuery('')}>
                Clear Search Filter
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onConfirm={handleConfirmOrder}
                onReject={(o) => setRejectOrderTarget(o)}
                onViewDetails={(o) => {
                  setSelectedOrder(o);
                  setIsDetailsOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onStatusChange={async (orderId, newStatus) => {
          // await adminApi.updateOrderStatus(orderId, newStatus);
          // showToast(`Order status updated to ${newStatus}`);
          // fetchOrders();
        }}
      />

      {/* Reject Confirmation Modal */}
      <Modal
        isOpen={!!rejectOrderTarget}
        onClose={() => setRejectOrderTarget(null)}
        title="Reject Order Confirmation"
        subtitle={`Order ${rejectOrderTarget?.orderNumber} for ${rejectOrderTarget?.customer.name}`}
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
            <XCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <span>
              Rejecting this order will cancel the order ticket and notify the customer immediately.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Reason for Cancellation
            </label>
            <select
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm bg-white outline-none focus:border-primary"
            >
              <option value="Kitchen at maximum capacity / busy rush">
                Kitchen at maximum capacity / busy rush
              </option>
              <option value="Custom ingredient out of stock">
                Custom ingredient out of stock
              </option>
              <option value="Delivery address outside operational radius">
                Delivery address outside operational radius
              </option>
              <option value="Store closing / end of shift">
                Store closing / end of shift
              </option>
            </select>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRejectOrderTarget(null)}
            >
              Back
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleConfirmReject}
              className="font-bold"
            >
              Confirm Rejection
            </Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
};

