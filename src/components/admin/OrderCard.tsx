import React from 'react';
import {
  Clock,
  User,
  MapPin,
  Check,
  X,
  Eye,
  Flame,
  Layers,
  Sparkles,
  AlertCircle,
  Phone
} from 'lucide-react';
import { AdminOrder } from '../../data/adminMockData';
import { Badge } from './Badge';
import { Button } from './Button';

interface OrderCardProps {
  order: AdminOrder;
  onConfirm?: (order: AdminOrder) => void;
  onReject?: (order: AdminOrder) => void;
  onViewDetails: (order: AdminOrder) => void;
  isProcessing?: boolean;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onConfirm,
  onReject,
  onViewDetails,
  isProcessing = false,
}) => {
  const isNew = order.status === 'new';
  const totalItemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div
      className={`group relative bg-white rounded-2xl border transition-all duration-300 shadow-soft hover:shadow-soft-lg flex flex-col justify-between overflow-hidden ${
        isNew
          ? 'border-rose-300/80 ring-2 ring-rose-500/10'
          : 'border-gray-200/90'
      }`}
    >
      {/* Top Header Strip */}
      <div
        className={`px-5 py-3.5 border-b flex items-center justify-between gap-3 ${
          isNew
            ? 'bg-gradient-to-r from-rose-50/70 via-orange-50/40 to-white border-rose-100'
            : 'bg-gray-50/60 border-gray-100'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-sm font-bold text-gray-900 tracking-wider">
            {order.orderNumber}
          </span>
          <Badge status={order.status} pulse={isNew} size="sm" />
          {order.customer.customerType === 'VIP' && (
            <Badge variant="vip" size="sm">
              <Sparkles className="w-3 h-3" /> VIP
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
          <Clock className="w-3.5 h-3.5 text-gray-400" />
          <span>{order.timeAgo}</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col gap-4">
        {/* Customer Information */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-primary" />
              <h5 className="font-bold text-gray-900 text-sm">
                {order.customer.name}
              </h5>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
              <Phone className="w-3 h-3 text-gray-400" />
              <span>{order.customer.phone}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider block">
              Total Amount
            </span>
            <span className="text-lg font-black text-gray-900 font-display">
              ${order.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Order Items & Customizations */}
        <div className="space-y-3 flex-1">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <span>Items & Customizations ({totalItemCount})</span>
            <span className="text-gray-400">{order.paymentMethod}</span>
          </div>

          <div className="space-y-2.5">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-orange-50/30 border border-orange-100/50 flex flex-col gap-2 transition-colors hover:bg-orange-50/60"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover border border-gray-200 shrink-0"
                    />
                    <div>
                      <h6 className="text-sm font-semibold text-gray-900 leading-tight">
                        <span className="text-primary font-bold mr-1.5">
                          {item.quantity}×
                        </span>
                        {item.name}
                      </h6>
                      <span className="text-xs text-gray-500">
                        ${item.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Customization Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.customization.size && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-white border border-gray-200 text-gray-700 shadow-xs">
                      <Layers className="w-3 h-3 text-gray-400" />
                      {item.customization.size}
                    </span>
                  )}

                  {item.customization.spiceLevel && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200 text-rose-700 shadow-xs">
                      <Flame className="w-3 h-3 text-rose-500" />
                      {item.customization.spiceLevel}
                    </span>
                  )}

                  {item.customization.extras &&
                    item.customization.extras.map((extra, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 shadow-xs"
                      >
                        + {extra}
                      </span>
                    ))}
                </div>

                {/* Special Instructions */}
                {item.customization.specialInstructions && (
                  <div className="text-[11px] text-amber-900 bg-amber-100/50 rounded-lg px-2 py-1 flex items-start gap-1.5 mt-0.5 border border-amber-200/50">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600 mt-0.5" />
                    <span className="font-medium italic">
                      "{item.customization.specialInstructions}"
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Address Preview */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 pt-2 border-t border-gray-100 truncate">
          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span className="truncate">{order.customer.deliveryAddress}</span>
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="px-5 py-3.5 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(order)}
          leftIcon={<Eye className="w-3.5 h-3.5" />}
          className="text-xs"
        >
          View Details
        </Button>

        <div className="flex items-center gap-2">
          {onReject && (order.status === 'new' || order.status === 'preparing') && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => onReject(order)}
              disabled={isProcessing}
              leftIcon={<X className="w-3.5 h-3.5" />}
              className="text-xs"
            >
              Reject
            </Button>
          )}

          {onConfirm && order.status === 'new' && (
            <Button
              variant="gradient"
              size="sm"
              onClick={() => onConfirm(order)}
              disabled={isProcessing}
              leftIcon={<Check className="w-3.5 h-3.5 stroke-[2.5]" />}
              className="text-xs font-bold"
            >
              Confirm Order
            </Button>
          )}

          {order.status === 'preparing' && onConfirm && (
            <Button
              variant="accent"
              size="sm"
              onClick={() => onConfirm(order)}
              disabled={isProcessing}
              leftIcon={<Check className="w-3.5 h-3.5" />}
              className="text-xs"
            >
              Mark Ready
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

