import React from 'react';
import { ShoppingBag, X, CheckCircle2, Trash2 } from 'lucide-react';
import { CartItem } from '../../types';

export interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  subtotal: number;
  orderPlacedSuccess: boolean;
  onResetOrderSuccess: () => void;
  onRemoveItem?: (cartId: string) => void;
  onUpdateQuantity?: (cartId: string, quantity: number) => void;
  onCheckout?: () => void;
  isSubmitting?: boolean;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  subtotal,
  orderPlacedSuccess,
  onResetOrderSuccess,
  onRemoveItem,
  onUpdateQuantity,
  onCheckout,
  isSubmitting = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#8BC34A]" />
              <h3 className="text-lg font-black text-[#1A1A1A]">Your Customized Order</h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {orderPlacedSuccess ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#E8F3DC] text-[#558B2F] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-black text-[#1A1A1A]">Order Confirmed!</h4>
              <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                Our special chefs have received your customized food instructions and are preparing your fresh meal now.
              </p>
              <button
                onClick={() => {
                  onResetOrderSuccess();
                  onClose();
                }}
                className="px-6 py-2.5 rounded-full bg-[#8BC34A] text-white text-xs font-bold cursor-pointer"
              >
                Back to Menu
              </button>
            </div>
          ) : cart.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto" />
              <p className="text-sm font-bold text-gray-600">Your food bag is empty</p>
              <p className="text-xs text-gray-400">
                Click &ldquo;Buy Now&rdquo; on any dish to customize portions, spice levels, and toppings!
              </p>
            </div>
          ) : (
            <div className="space-y-4 mt-5">
              {cart.map((item) => (
                <div
                  key={item.cartId}
                  className="p-3.5 rounded-2xl bg-[#FAFDF7] border border-[#E5F0DA] flex gap-3.5 items-start"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-[#8BC34A] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h4 className="font-extrabold text-sm text-[#1A1A1A]">{item.name}</h4>
                      <button
                        type="button"
                        onClick={() => onRemoveItem?.(item.cartId)}
                        className="text-gray-400 hover:text-red-500 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-[#558B2F] font-semibold mt-0.5">
                      {item.portion} • {item.spice}
                    </p>

                    {item.addons.length > 0 && (
                      <p className="text-[11px] text-gray-500 mt-1">
                        <span className="font-semibold text-gray-700">+ Add-ons:</span> {item.addons.join(', ')}
                      </p>
                    )}

                    {item.dietary.length > 0 && (
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        Prefs: {item.dietary.join(', ')}
                      </p>
                    )}

                    {item.notes && (
                      <p className="text-[10px] italic text-amber-700 bg-amber-50 px-2 py-0.5 rounded mt-1">
                        Note: &ldquo;{item.notes}&rdquo;
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-gray-200/60">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity?.(item.cartId, Math.max(1, item.quantity - 1))}
                          className="w-5 h-5 rounded-full bg-white border border-gray-300 flex items-center justify-center text-xs cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity?.(item.cartId, item.quantity + 1)}
                          className="w-5 h-5 rounded-full bg-[#8BC34A] text-white flex items-center justify-center text-xs cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm font-extrabold text-[#1A1A1A]">
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && !orderPlacedSuccess && (
          <div className="pt-4 border-t border-gray-100 space-y-3">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Subtotal</span>
              <span className="font-bold text-gray-800">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Express Delivery</span>
              <span className="font-bold text-[#7CB342]">FREE</span>
            </div>
            <div className="flex justify-between text-base font-black text-[#1A1A1A] pt-2 border-t">
              <span>Total</span>
              <span className="text-[#7CB342]">${subtotal.toFixed(2)}</span>
            </div>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={onCheckout}
              className={`w-full py-3.5 rounded-full bg-[#8BC34A] hover:bg-[#7CB342] text-white font-bold text-sm shadow-lg transition cursor-pointer flex items-center justify-center gap-2 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Validating Price & Placing Order...' : `Confirm & Place Order ($${subtotal.toFixed(2)})`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

