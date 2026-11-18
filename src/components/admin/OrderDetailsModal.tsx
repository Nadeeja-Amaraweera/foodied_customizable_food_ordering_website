import React from 'react';
import {
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Check,
  X,
  CreditCard,
  Printer,
  Sparkles,
  Flame,
  Layers,
  FileText,
  Truck
} from 'lucide-react';
import { AdminOrder, OrderStatus } from '../../data/adminMockData';
import { Modal } from './Modal';
import { Badge } from './Badge';
import { Button } from './Button';

interface OrderDetailsModalProps {
  order: AdminOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (orderId: string, newStatus: OrderStatus) => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  isOpen,
  onClose,
  onStatusChange,
}) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="3xl"
      title={
        <div className="flex items-center gap-3">
          <span className="font-mono text-xl font-extrabold text-gray-900">
            {order.orderNumber}
          </span>
          <Badge status={order.status} pulse={order.status === 'new'} size="md" />
          {order.customer.customerType === 'VIP' && (
            <Badge variant="vip" size="sm">
              <Sparkles className="w-3 h-3" /> VIP Customer
            </Badge>
          )}
        </div>
      }
      subtitle={`Placed ${order.timeAgo} (${new Date(order.placedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`}
    >
      <div className="space-y-6">
        {/* Customer & Delivery Summary Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-orange-50/40 border border-orange-100">
          <div className="space-y-2">
            <h6 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <User className="w-4 h-4" /> Customer Details
            </h6>
            <div className="text-sm font-bold text-gray-900">{order.customer.name}</div>
            <div className="text-xs text-gray-600 flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-gray-400" />
              <span>{order.customer.phone}</span>
            </div>
            <div className="text-xs text-gray-600 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-gray-400" />
              <span>{order.customer.email}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h6 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <MapPin className="w-4 h-4" /> Delivery Address & Notes
            </h6>
            <p className="text-xs font-medium text-gray-800 leading-relaxed">
              {order.customer.deliveryAddress}
            </p>
            {order.notes && (
              <div className="text-xs text-amber-800 bg-amber-100/60 p-2 rounded-lg border border-amber-200">
                <span className="font-semibold">Note:</span> {order.notes}
              </div>
            )}
          </div>
        </div>

        {/* Customized Items Breakdown */}
        <div>
          <h5 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            Customized Items ({order.items.reduce((s, i) => s + i.quantity, 0)})
          </h5>

          <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-soft-sm">
            {order.items.map((item, idx) => (
              <div
                key={item.id || (item as any)._id || `${item.productId || item.name || 'item'}-${idx}`}
                className="p-4 flex flex-col sm:flex-row gap-4 hover:bg-gray-50/50 transition-colors"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover border border-gray-200 shrink-0 self-start"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h6 className="text-base font-bold text-gray-900">
                        {item.quantity}× {item.name}
                      </h6>
                      <p className="text-xs text-gray-500">
                        Base: ${(item.unitPrice).toFixed(2)} each
                      </p>
                    </div>
                    <span className="text-base font-extrabold text-gray-900">
                      ${item.totalPrice.toFixed(2)}
                    </span>
                  </div>

                  {/* Detailed Customizations */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.customization.size && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg bg-orange-50 border border-orange-200 text-orange-900">
                        <Layers className="w-3.5 h-3.5 text-orange-500" />
                        Size: {item.customization.size}
                      </span>
                    )}

                    {item.customization.spiceLevel && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-800">
                        <Flame className="w-3.5 h-3.5 text-rose-500" />
                        Spice: {item.customization.spiceLevel}
                      </span>
                    )}

                    {item.customization.extras &&
                      item.customization.extras.map((extra, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-800"
                        >
                          + {extra}
                        </span>
                      ))}
                  </div>

                  {item.customization.specialInstructions && (
                    <div className="mt-2.5 text-xs text-amber-900 bg-amber-50 p-2.5 rounded-xl border border-amber-200 flex items-start gap-2">
                      <span className="font-bold text-amber-700">Kitchen Note:</span>
                      <span className="italic">{item.customization.specialInstructions}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment & Total Calculation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                Payment Information
              </span>
              <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                <CreditCard className="w-4 h-4 text-primary" />
                {order.paymentMethod}
              </div>
              <div className="mt-1">
                <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded ${
                  order.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  Status: {order.paymentStatus}
                </span>
              </div>
            </div>

            <div className="mt-3 text-xs text-gray-500 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-gray-400" />
              <span>Estimated Prep: {order.estimatedReadyTime}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee</span>
              <span>${order.deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Estimated Tax</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-gray-200 flex justify-between items-baseline">
              <span className="font-bold text-gray-900 text-base">Grand Total</span>
              <span className="font-extrabold text-xl text-primary font-display">
                ${order.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            leftIcon={<Printer className="w-4 h-4" />}
          >
            Print Order Docket
          </Button>

          <div className="flex items-center gap-2">
            {order.status === 'new' && onStatusChange && (
              <>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    onStatusChange(order.id, 'cancelled');
                    onClose();
                  }}
                  leftIcon={<X className="w-4 h-4" />}
                >
                  Reject Order
                </Button>
                <Button
                  variant="gradient"
                  size="sm"
                  onClick={() => {
                    onStatusChange(order.id, 'preparing');
                    onClose();
                  }}
                  leftIcon={<Check className="w-4 h-4 stroke-[2.5]" />}
                  className="font-bold"
                >
                  Confirm & Send to Kitchen
                </Button>
              </>
            )}

            {order.status === 'preparing' && onStatusChange && (
              <Button
                variant="accent"
                size="sm"
                onClick={() => {
                  onStatusChange(order.id, 'confirmed');
                  onClose();
                }}
                leftIcon={<Check className="w-4 h-4" />}
              >
                Mark Ready for Driver
              </Button>
            )}

            {order.status === 'confirmed' && onStatusChange && (
              <Button
                variant="success"
                size="sm"
                onClick={() => {
                  onStatusChange(order.id, 'delivered');
                  onClose();
                }}
                leftIcon={<Truck className="w-4 h-4" />}
              >
                Mark as Delivered
              </Button>
            )}

            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

