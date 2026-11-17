import React, { useState, useEffect, useMemo } from 'react';
import {
  History,
  Search,
  Filter,
  Calendar,
  Eye,
  Download,
  ChevronLeft,
  ChevronRight,
  Printer,
  Sparkles,
  CreditCard,
  CheckCircle2,
  XCircle,
  FileSpreadsheet
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Badge } from '../../components/admin/Badge';
import { Button } from '../../components/admin/Button';
import { OrderDetailsModal } from '../../components/admin/OrderDetailsModal';
import { orderApi } from '../../services/orderApi';
import { AdminOrder, OrderStatus } from '../../data/adminMockData';
import { useToast } from '../../context/ToastContext';

export const AdminRecentOrdersPage: React.FC = () => {
  const { showToast } = useToast();

  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [dateRangeFilter, setDateRangeFilter] = useState<'all' | 'today' | 'yesterday' | 'week'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Selected order for details view
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const fetchOrders = async () => {
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
      showToast('Failed to load past orders', 'error');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) => {
        if (statusFilter !== 'all' && order.status !== statusFilter) return false;
        return true;
      })
      .filter((order) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          order.orderNumber.toLowerCase().includes(q) ||
          order.customer.name.toLowerCase().includes(q) ||
          order.customer.phone.includes(q) ||
          order.items.some((i) => i.name.toLowerCase().includes(q))
        );
      });
  }, [orders, statusFilter, searchQuery]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage]);

  const handleExportCSV = () => {
    showToast('Orders export generated as CSV', 'info', 'Report Ready');
  };

  return (
    <AdminLayout
      title="Recent Orders & Audit Log"
      subtitle="Complete ledger of processed, delivered, and cancelled food orders"
      newOrdersCount={orders.filter((o) => o.status === 'new').length}
    >
      <div className="space-y-6">
        
        {/* Top Control Bar: Search, Status Filter, Date Range & Export */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-soft space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by order ID, customer name, phone, or dish..."
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

            {/* Filter Controls Row */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Status Filter */}
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs sm:text-sm outline-none focus:border-primary"
                >
                  <option value="all">All Statuses ({orders.length})</option>
                  <option value="delivered">Delivered</option>
                  <option value="confirmed">Confirmed / Driver</option>
                  <option value="preparing">Preparing</option>
                  <option value="new">New Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Date Range Picker (UI only) */}
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                <Calendar className="w-4 h-4 text-gray-400" />
                <select
                  value={dateRangeFilter}
                  onChange={(e) => setDateRangeFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs sm:text-sm outline-none focus:border-primary"
                >
                  <option value="all">All Dates</option>
                  <option value="today">Today (Sun, Nov 15)</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="week">Past 7 Days</option>
                </select>
              </div>

              {/* Export CSV Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                leftIcon={<FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />}
                className="text-xs"
              >
                Export CSV
              </Button>
            </div>
          </div>
        </div>

        {/* Orders Table (Desktop) & Cards (Mobile) */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  <th className="py-3.5 px-4 sm:px-6">Order ID</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Items & Customizations</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Placed Time</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
                {paginatedOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-gray-400">
                      No past orders match your selected filters.
                    </td>
                  </tr>
                ) : (
                  paginatedOrders.map((order) => {
                    const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);

                    return (
                      <tr
                        key={order.id}
                        className="hover:bg-orange-50/30 transition-colors group"
                      >
                        {/* Order ID */}
                        <td className="py-4 px-4 sm:px-6 font-mono font-bold text-gray-900 whitespace-nowrap">
                          {order.orderNumber}
                        </td>

                        {/* Customer */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                            <span>{order.customer.name}</span>
                            {order.customer.customerType === 'VIP' && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                                VIP
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-400 block font-normal">
                            {order.customer.phone}
                          </span>
                        </td>

                        {/* Items */}
                        <td className="py-4 px-4 max-w-xs">
                          <div className="font-medium text-gray-800 truncate">
                            {order.items.map((i) => `${i.quantity}× ${i.name}`).join(', ')}
                          </div>
                          <div className="text-[11px] text-gray-400 mt-0.5">
                            {itemCount} total item{itemCount > 1 ? 's' : ''} • Custom options
                          </div>
                        </td>

                        {/* Total */}
                        <td className="py-4 px-4 font-black text-gray-900 whitespace-nowrap font-display">
                          ${order.totalAmount.toFixed(2)}
                        </td>

                        {/* Payment */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="text-xs font-semibold text-gray-700 block">
                            {order.paymentMethod}
                          </span>
                          <span className={`text-[10px] font-bold ${
                            order.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-600'
                          }`}>
                            {order.paymentStatus}
                          </span>
                        </td>

                        {/* Status Badge */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <Badge status={order.status} size="sm" />
                        </td>

                        {/* Date / Time */}
                        <td className="py-4 px-4 whitespace-nowrap text-xs text-gray-500 font-medium">
                          <div>{order.timeAgo}</div>
                          <span className="text-[11px] text-gray-400">
                            {new Date(order.placedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </td>

                        {/* Action Buttons */}
                        <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedOrder(order);
                              setIsDetailsOpen(true);
                            }}
                            leftIcon={<Eye className="w-3.5 h-3.5 text-gray-500" />}
                            className="text-xs"
                          >
                            Details
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls Footer */}
          <div className="px-6 py-4 bg-gray-50/80 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
            <div>
              Showing{' '}
              <strong className="text-gray-900">
                {filteredOrders.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
              </strong>{' '}
              to{' '}
              <strong className="text-gray-900">
                {Math.min(currentPage * itemsPerPage, filteredOrders.length)}
              </strong>{' '}
              of <strong className="text-gray-900">{filteredOrders.length}</strong> orders
            </div>

            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                    currentPage === page
                      ? 'bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white shadow-soft-sm'
                      : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
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
    </AdminLayout>
  );
};

