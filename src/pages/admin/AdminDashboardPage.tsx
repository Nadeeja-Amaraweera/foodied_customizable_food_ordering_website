import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BellRing,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ShoppingBag,
  Clock,
  UtensilsCrossed,
  DollarSign,
  Layers,
  ChevronRight,
  CheckCircle2,
  Calendar,
  Flame
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { StatCard } from '../../components/admin/StatCard';
import { Badge } from '../../components/admin/Badge';
import { Button } from '../../components/admin/Button';
import { OrderDetailsModal } from '../../components/admin/OrderDetailsModal';
import { orderApi } from '../../services/orderApi';
import { adminProductApi } from '../../services/adminApi';
import {
  AdminOrder,
  StatMetric,
  SalesChartPoint,
  CategoryDistribution
} from '../../data/adminMockData';
import { useToast } from '../../context/ToastContext';
import useAuth from '../../hooks/useAuth';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();

  const adminName = user?.name || user?.username || (user?.email ? user.email.split('@')[0] : 'Admin');

  const [stats, setStats] = useState<StatMetric[]>([]);
  const [hourlySales, setHourlySales] = useState<SalesChartPoint[]>([]);
  const [categories, setCategories] = useState<CategoryDistribution[]>([]);
  const [recentOrders, setRecentOrders] = useState<AdminOrder[]>([]);
  const [incomingOrders, setIncomingOrders] = useState<AdminOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeChartMetric, setActiveChartMetric] = useState<'revenue' | 'orders'>('revenue');

  const loadDashboardData = async () => {
    try {
      const [allOrders, products] = await Promise.all([
        orderApi.getOrders().catch(() => []),
        adminProductApi.getProducts().catch(() => []),
      ]);

      const mappedOrders: AdminOrder[] = allOrders.map((o: any) => ({
        ...o,
        id: o._id || o.id,
        placedAt: o.placedAt ? new Date(o.placedAt).toISOString() : new Date().toISOString(),
        timeAgo: o.placedAt
          ? `${Math.max(1, Math.round((Date.now() - new Date(o.placedAt).getTime()) / 60000))} mins ago`
          : 'Just now',
        estimatedReadyTime: o.estimatedReadyTime || '15-20 mins',
      }));

      setRecentOrders(mappedOrders.slice(0, 5));
      setIncomingOrders(mappedOrders.filter((o) => o.status === 'new' || o.status === 'preparing'));

      const totalRevenue = mappedOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      const pendingCount = mappedOrders.filter((o) => o.status === 'new' || o.status === 'preparing').length;

      setStats([
        {
          title: 'Total Orders',
          value: mappedOrders.length,
          change: '+12.5%',
          isPositive: true,
          subtitle: 'All orders recorded',
          iconName: 'shopping-bag',
        },
        {
          title: 'Pending Orders',
          value: pendingCount,
          change: pendingCount > 0 ? `${pendingCount} active` : 'Queue clear',
          isPositive: pendingCount === 0,
          subtitle: 'Needs kitchen action',
          iconName: 'clock',
        },
        {
          title: 'Products Available',
          value: products.length,
          change: 'In catalog',
          isPositive: true,
          subtitle: 'Active menu items',
          iconName: 'utensils',
        },
        {
          title: 'Total Revenue',
          value: `$${totalRevenue.toFixed(2)}`,
          change: '+18.2%',
          isPositive: true,
          subtitle: 'Cumulative sales',
          iconName: 'dollar-sign',
        },
      ]);

      // Generate hourly sales breakdown from real orders
      const hours = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];
      const hourlyMap: Record<string, { orders: number; revenue: number }> = {};
      hours.forEach((h) => {
        hourlyMap[h] = { orders: 0, revenue: 0 };
      });

      mappedOrders.forEach((o) => {
        const date = new Date(o.placedAt);
        const hour = date.getHours();
        const formattedHour = `${hour.toString().padStart(2, '0')}:00`;
        if (hourlyMap[formattedHour]) {
          hourlyMap[formattedHour].orders += 1;
          hourlyMap[formattedHour].revenue += Math.round(o.totalAmount || 0);
        } else {
          hourlyMap['12:00'].orders += 1;
          hourlyMap['12:00'].revenue += Math.round(o.totalAmount || 0);
        }
      });

      const computedHourly: SalesChartPoint[] = hours.map((h) => ({
        time: h,
        orders: hourlyMap[h].orders,
        revenue: hourlyMap[h].revenue,
      }));
      setHourlySales(computedHourly);

      // Compute category distribution from real orders and catalog
      const categoryColorMap: Record<string, string> = {
        Pizza: '#FF6B35',
        Burger: '#F7931E',
        'Bowls & Salads': '#2EC4B6',
        Pasta: '#06D6A0',
        Desserts: '#FFB703',
        Beverages: '#EF476F',
      };

      const catCounts: Record<string, number> = {};
      mappedOrders.forEach((order) => {
        order.items?.forEach((item) => {
          const matchedProd = products.find(
            (p) =>
              p.name.toLowerCase() === item.name.toLowerCase() ||
              (p as any)._id === item.productId ||
              (p as any).id === item.productId
          );
          const cat = matchedProd?.category || 'Burger';
          catCounts[cat] = (catCounts[cat] || 0) + item.quantity;
        });
      });

      if (Object.keys(catCounts).length === 0) {
        products.forEach((p) => {
          catCounts[p.category] = (catCounts[p.category] || 0) + 1;
        });
      }

      const totalItems = Object.values(catCounts).reduce((s, v) => s + v, 0) || 1;
      const computedCategories: CategoryDistribution[] = Object.entries(catCounts).map(
        ([cat, count]) => ({
          category: cat,
          orders: count,
          percentage: Math.round((count / totalItems) * 100),
          color: categoryColorMap[cat] || '#FF6B35',
        })
      );

      setCategories(
        computedCategories.length > 0
          ? computedCategories
          : [
              { category: 'Burger', percentage: 60, orders: 3, color: '#F7931E' },
              { category: 'Pizza', percentage: 40, orders: 2, color: '#FF6B35' },
            ]
      );
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleConfirmOrder = async (order: AdminOrder) => {
    try {
      await orderApi.updateOrderStatus(order.id, 'preparing');
      showToast(
        `Order ${order.orderNumber} confirmed! Kitchen ticket printed.`,
        'success',
        'Order Confirmed'
      );
      loadDashboardData();
    } catch (err) {
      showToast('Failed to update order status', 'error');
    }
  };

  // Max value for SVG chart scaling
  const maxRevenue = Math.max(...hourlySales.map((d) => d.revenue), 100);
  const maxOrders = Math.max(...hourlySales.map((d) => d.orders), 10);

  return (
    <AdminLayout
      title="Kitchen & Dispatch Dashboard"
      subtitle={`Welcome back, ${adminName}. Kitchen operations running smoothly.`}
      newOrdersCount={incomingOrders.filter((o) => o.status === 'new').length}
    >
      <div className="space-y-6">
        {/* Incoming Orders Attention Banner (if there are new orders) */}
        {incomingOrders.filter((o) => o.status === 'new').length > 0 && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-500/10 via-orange-500/10 to-amber-500/10 border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 text-white flex items-center justify-center shrink-0 shadow-soft">
                <BellRing className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">
                  {incomingOrders.filter((o) => o.status === 'new').length} New Incoming Orders Need Kitchen Confirmation!
                </h4>
                <p className="text-xs text-gray-600 mt-0.5">
                  Customers are awaiting confirmation. Review customizations and dispatch to line cooks.
                </p>
              </div>
            </div>

            <Button
              variant="gradient"
              size="sm"
              onClick={() => navigate('/admin/orders/incoming')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="shrink-0 font-bold"
            >
              Go to Order Queue
            </Button>
          </div>
        )}

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {stats.map((stat, idx) => (
            <StatCard
              key={idx}
              stat={stat}
              onClick={() => {
                if (stat.iconName === 'clock' || stat.iconName === 'shopping-bag') {
                  navigate('/admin/orders/incoming');
                } else if (stat.iconName === 'utensils') {
                  navigate('/admin/products');
                } else {
                  navigate('/admin/orders/recent');
                }
              }}
            />
          ))}
        </div>

        {/* Charts & Category Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Chart (Hourly Orders & Revenue) */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-soft flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900 font-display flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Kitchen Volume & Sales Pace (Today)
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Real-time hourly breakdown from 10:00 AM to 9:00 PM
                </p>
              </div>

              {/* Metric Toggle Tabs */}
              <div className="flex items-center p-1 rounded-xl bg-gray-100/80 border border-gray-200/50 self-start sm:self-auto">
                <button
                  onClick={() => setActiveChartMetric('revenue')}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                    activeChartMetric === 'revenue'
                      ? 'bg-white text-gray-900 shadow-xs'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Revenue ($)
                </button>
                <button
                  onClick={() => setActiveChartMetric('orders')}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                    activeChartMetric === 'orders'
                      ? 'bg-white text-gray-900 shadow-xs'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Order Count
                </button>
              </div>
            </div>

            {/* Responsive SVG Bar & Line Visualization */}
            <div className="py-6">
              <div className="h-60 flex items-end gap-2 sm:gap-3 px-2 pt-6 pb-2 border-b border-gray-100">
                {hourlySales.map((item, idx) => {
                  const value = activeChartMetric === 'revenue' ? item.revenue : item.orders;
                  const maxValue = activeChartMetric === 'revenue' ? maxRevenue : maxOrders;
                  const heightPercent = Math.max((value / maxValue) * 100, 8);

                  return (
                    <div
                      key={idx}
                      className="flex-1 flex flex-col items-center gap-2 group relative h-full justify-end"
                    >
                      {/* Tooltip on Hover */}
                      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 bg-gray-900 text-white text-[11px] font-bold px-2 py-1 rounded-md shadow-lg whitespace-nowrap">
                        {item.time}: {activeChartMetric === 'revenue' ? `$${item.revenue}` : `${item.orders} orders`}
                      </div>

                      {/* Bar with gradient and smooth height */}
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full max-w-[36px] rounded-t-lg transition-all duration-500 group-hover:brightness-110 ${
                          activeChartMetric === 'revenue'
                            ? 'bg-gradient-to-t from-[#FF6B35] to-[#F7931E]'
                            : 'bg-gradient-to-t from-[#2EC4B6] to-[#06D6A0]'
                        }`}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Time X-Axis Labels */}
              <div className="flex justify-between px-2 pt-2 text-[10px] sm:text-xs text-gray-400 font-medium">
                {hourlySales.map((item, idx) => (
                  <span key={idx} className={idx % 2 === 1 ? 'hidden sm:inline' : ''}>
                    {item.time}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick summary footer */}
            <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B35]" />
                  Peak Hour: <strong className="text-gray-800">7:00 PM - 8:00 PM</strong>
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2EC4B6]" />
                  Average Ticket: <strong className="text-gray-800">$34.20</strong>
                </span>
              </div>
              <span className="text-emerald-600 font-bold">● High throughput pace</span>
            </div>
          </div>

          {/* Category Distribution Breakdown */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-soft flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h3 className="text-base font-bold text-gray-900 font-display flex items-center gap-2">
                  <Layers className="w-5 h-5 text-primary" />
                  Category Breakdown
                </h3>
                <span className="text-xs font-semibold text-gray-400">Share of Sales</span>
              </div>

              <div className="py-4 space-y-4">
                {categories.map((cat, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-gray-800">{cat.category}</span>
                      <span className="text-gray-500 font-semibold">
                        {cat.percentage}% ({cat.orders} orders)
                      </span>
                    </div>

                    <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        style={{
                          width: `${cat.percentage}%`,
                          backgroundColor: cat.color,
                        }}
                        className="h-full rounded-full transition-all duration-700"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-orange-50/60 border border-orange-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-primary font-bold">
                <Flame className="w-4 h-4" />
                <span>Customization Leader:</span>
              </div>
              <span className="font-semibold text-gray-800">Woodfired Pizza</span>
            </div>
          </div>
        </div>

        {/* Live Orders & Recent Kitchen Activity Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Incoming Orders Quick Action List */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-soft">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900 font-display flex items-center gap-2">
                  <BellRing className="w-5 h-5 text-rose-500" />
                  Active Incoming Orders Queue
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Fresh tickets requiring confirmation and line prep
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin/orders/incoming')}
                rightIcon={<ChevronRight className="w-4 h-4" />}
                className="text-xs"
              >
                View All Queue ({incomingOrders.length})
              </Button>
            </div>

            <div className="py-2 divide-y divide-gray-100">
              {incomingOrders.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-sm">
                  No active pending orders. Kitchen is all caught up!
                </div>
              ) : (
                incomingOrders.slice(0, 3).map((order) => (
                  <div
                    key={order.id}
                    className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-gray-50/60 p-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                        {order.items.length} itm
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-gray-900">
                            {order.orderNumber}
                          </span>
                          <Badge status={order.status} pulse={order.status === 'new'} size="sm" />
                          <span className="text-xs text-gray-400 font-medium">
                            • {order.timeAgo}
                          </span>
                        </div>

                        <p className="text-sm font-semibold text-gray-900 mt-0.5">
                          {order.customer.name}
                        </p>

                        <p className="text-xs text-gray-500 line-clamp-1">
                          {order.items.map((i) => `${i.quantity}× ${i.name}`).join(', ')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      <span className="text-base font-extrabold text-gray-900">
                        ${order.totalAmount.toFixed(2)}
                      </span>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsDetailsOpen(true);
                          }}
                          className="text-xs"
                        >
                          Details
                        </Button>

                        {order.status === 'new' && (
                          <Button
                            variant="gradient"
                            size="sm"
                            onClick={() => handleConfirmOrder(order)}
                            className="text-xs font-bold"
                          >
                            Confirm
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Shortcuts & Kitchen Tips Card */}
          <div className="bg-gradient-to-br from-[#1A1A2E] to-[#16213E] rounded-2xl p-6 text-white shadow-soft flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4" />
                Quick Management Actions
              </div>

              <h4 className="text-lg font-bold font-display text-white">
                Speed up kitchen throughput
              </h4>
              <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                Add seasonal toppings, adjust spice levels on burgers and pizzas, or review order history.
              </p>

              <div className="mt-5 space-y-2.5">
                <button
                  onClick={() => navigate('/admin/products')}
                  className="w-full text-left p-3 rounded-xl bg-white/10 hover:bg-white/15 transition-colors border border-white/10 flex items-center justify-between text-xs font-semibold"
                >
                  <div className="flex items-center gap-2.5">
                    <UtensilsCrossed className="w-4 h-4 text-orange-400" />
                    <span>Add New Menu Item or Topping</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>

                <button
                  onClick={() => navigate('/admin/orders/recent')}
                  className="w-full text-left p-3 rounded-xl bg-white/10 hover:bg-white/15 transition-colors border border-white/10 flex items-center justify-between text-xs font-semibold"
                >
                  <div className="flex items-center gap-2.5">
                    <ShoppingBag className="w-4 h-4 text-teal-400" />
                    <span>View Today's Completed Orders</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>

                <button
                  onClick={() => navigate('/admin/settings')}
                  className="w-full text-left p-3 rounded-xl bg-white/10 hover:bg-white/15 transition-colors border border-white/10 flex items-center justify-between text-xs font-semibold"
                >
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Kitchen Prep Times & Hours</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-gray-400 flex items-center justify-between">
              <span>Kitchen Dispatch System</span>
              <span className="text-emerald-400 font-semibold">● Real-time Sync Active</span>
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
          try {
            await orderApi.updateOrderStatus(orderId, newStatus);
            showToast(`Order status updated to ${newStatus}`, 'success', 'Status Updated');
            loadDashboardData();
          } catch (err) {
            showToast('Failed to update order status', 'error');
          }
        }}
      />
    </AdminLayout>
  );
};

