import React, { useState, useMemo } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  ArrowLeft,
  Flame
} from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { StoreToast } from '../components/StoreOverlays';
import { FloatingLeaf } from '../components/common/FloatingLeaf';
import { useCart } from '../context/CartContext';
import { orderApi } from '../services/orderApi';
import useAuth from '../hooks/useAuth';
import { User } from '../types';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotalCount,
    cartSubtotal,
    orderPlacedSuccess,
    setOrderPlacedSuccess,
  } = useCart();

  React.useEffect(() => {
    if (location.hash === '#contact-us' || location.hash === '#contact') {
      setTimeout(() => {
        const target = document.getElementById('contact-us') || document.getElementById('contact');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    }
  }, [location.hash, location.pathname]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [confirmedOrderNumber, setConfirmedOrderNumber] = useState<string | null>(null);

  // Delivery details form state
  const [deliveryAddress, setDeliveryAddress] = useState('Standard Express Delivery');
  const [contactPhone, setContactPhone] = useState('+1 (555) 000-1234');
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Credit Card' | 'Cash on Delivery'>('Credit Card');

  const currentUser: User | null = useMemo(() => {
    if (!auth?.user) return null;
    return {
      username: auth.user.name || auth.user.username || auth.user.email || 'User',
      email: auth.user.email,
    };
  }, [auth?.user]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleLogout = () => {
    localStorage.removeItem('ACCESS_TOKEN');
    if (auth?.setUser) {
      auth.setUser(null);
    }
    showToast('You have been logged out.');
  };

  // Checkout submission with backend price validation
  const handleCheckout = async () => {
    if (cart.length === 0) return;

    try {
      setIsSubmitting(true);

      const payload = {
        items: cart.map((item) => ({
          productId: item.productId || item.id,
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: Number((item.unitPrice * item.quantity).toFixed(2)),
          image: item.image,
          customization: {
            size: item.portion,
            spiceLevel: item.spice,
            extras: item.addons,
            dietary: item.dietary,
            specialInstructions: item.notes,
          },
        })),
        customer: {
          name: currentUser?.username || 'Customer',
          email: currentUser?.email || 'customer@foodied.com',
          phone: contactPhone || '+1 (555) 000-1234',
          deliveryAddress: deliveryAddress || 'Standard Express Delivery',
          customerType: 'New' as const,
        },
        subtotal: cartSubtotal,
        deliveryFee: 0,
        tax: 0,
        totalAmount: cartSubtotal,
        paymentMethod,
        notes: orderNotes,
      };

      const res = await orderApi.createOrder(payload);

      setConfirmedOrderNumber(res.data?.orderNumber || 'ORD-KITCHEN');
      setOrderPlacedSuccess(true);
      clearCart();
      showToast(res.message || 'Order placed and validated successfully!');
    } catch (err: any) {
      console.error('Order checkout validation error:', err);
      const errMsg =
        err?.response?.data?.message ||
        err?.response?.data?.details ||
        err?.message ||
        'Order price validation failed. Please check your selections.';
      showToast(`Validation Failed: ${errMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFDF7] text-[#1A1A1A] font-sans relative overflow-x-hidden selection:bg-[#8BC34A] selection:text-white">
      {/* Decorative Organic Green Blob */}
      <div
        className="hidden lg:block absolute top-0 right-0 w-[45%] h-[420px] bg-[#8BC34A]/20 pointer-events-none z-0"
        style={{
          borderBottomLeftRadius: '60% 80%',
        }}
      />

      <FloatingLeaf className="hidden md:block w-28 h-28 absolute top-[360px] -right-6 z-10 opacity-90 rotate-12" />
      <FloatingLeaf
        className="hidden md:block w-32 h-32 absolute top-[750px] -left-8 z-10 opacity-90 -rotate-12"
        flip
      />

      <StoreToast message={toastMessage} />

      <Header
        cartTotalCount={cartTotalCount}
        currentUser={currentUser}
        onCartOpen={() => {}}
        onLogout={handleLogout}
        onAuthNavigate={() => navigate('/login')}
      />

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 py-10">
        {/* Page Title & Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-200/60">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#1A1A1A] tracking-tight">
              YOUR FOOD BAG
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Review your customized dishes and proceed to checkout
            </p>
          </div>

          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#558B2F] hover:text-[#33691E] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Browsing Menu</span>
          </Link>
        </div>

        {/* 1. Order Success Screen */}
        {orderPlacedSuccess ? (
          <div className="bg-white rounded-3xl p-8 sm:p-14 text-center max-w-xl mx-auto shadow-xl border border-gray-100 my-8 space-y-6">
            <div className="w-20 h-20 rounded-full bg-[#E8F3DC] text-[#558B2F] flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#558B2F] bg-[#F4F9EE] px-3.5 py-1 rounded-full">
                Ticket Sent to Kitchen
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1A1A1A] mt-3">
                Order Confirmed!
              </h2>
              {confirmedOrderNumber && (
                <p className="text-sm font-bold text-gray-700 mt-1">
                  Order ID: <span className="text-[#558B2F]">{confirmedOrderNumber}</span>
                </p>
              )}
              <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mt-3 leading-relaxed">
                Our kitchen chefs have received your verified customized food instructions and are preparing your fresh meal now.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setOrderPlacedSuccess(false);
                  navigate('/menu');
                }}
                className="px-8 py-3.5 rounded-full bg-[#8BC34A] hover:bg-[#7CB342] text-white text-xs font-bold shadow-lg transition cursor-pointer"
              >
                Back to Food Menu
              </button>
            </div>
          </div>
        ) : cart.length === 0 ? (
          /* 2. Empty Cart Screen */
          <div className="bg-white rounded-3xl p-12 sm:p-20 text-center max-w-lg mx-auto shadow-md border border-gray-100 my-8 space-y-5">
            <div className="w-20 h-20 rounded-full bg-gray-50 text-gray-300 flex items-center justify-center mx-auto border border-gray-100">
              <ShoppingBag className="w-10 h-10" />
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#1A1A1A]">
                Your Food Bag is Empty
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 max-w-sm mx-auto mt-2 leading-relaxed">
                You haven&apos;t added any customized meals to your bag yet. Click &ldquo;Buy Now&rdquo; on any dish to customize portions and toppings!
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/menu')}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#8BC34A] hover:bg-[#7CB342] text-white text-xs font-bold shadow-md transition cursor-pointer"
            >
              <span>Explore Our Menu</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* 3. Active Cart Items & Checkout View */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Cart Items List */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                  Customized Items ({cartTotalCount})
                </span>
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer"
                >
                  Clear Bag
                </button>
              </div>

              {cart.map((item) => (
                <div
                  key={item.cartId}
                  className="bg-white rounded-2xl p-3.5 sm:p-5 border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between transition hover:shadow-md"
                >
                  {/* Dish Thumbnail + Information */}
                  <div className="flex gap-3 sm:gap-4 items-start min-w-0 flex-1 w-full">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-[#8BC34A] shrink-0"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-black text-base text-[#1A1A1A] leading-tight">
                          {item.name}
                        </h3>
                      </div>

                      {/* Portion & Spice Badges */}
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#F4F9EE] text-[#558B2F] text-[11px] font-bold border border-[#E5F0DA]">
                          {item.portion}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 text-[11px] font-semibold border border-orange-200/60 flex items-center gap-1">
                          <Flame className="w-3 h-3 text-orange-500" />
                          {item.spice}
                        </span>
                      </div>

                      {/* Add-on Extras Breakdown */}
                      {item.addons && item.addons.length > 0 && (
                        <p className="text-[11px] text-gray-600 mt-2">
                          <span className="font-bold text-gray-800">+ Extras:</span>{' '}
                          {item.addons.join(', ')}
                        </p>
                      )}

                      {/* Dietary Preferences */}
                      {item.dietary && item.dietary.length > 0 && (
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          Prefs: {item.dietary.join(', ')}
                        </p>
                      )}

                      {/* Kitchen Note */}
                      {item.notes && (
                        <p className="text-[11px] italic text-amber-700 bg-amber-50/80 px-2.5 py-1 rounded-lg mt-2 inline-block border border-amber-200/50">
                          Note: &ldquo;{item.notes}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Quantity Counter + Price + Remove Action */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100 gap-3">
                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 block sm:hidden">Item Total</span>
                      <span className="text-base font-black text-[#558B2F]">
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </span>
                      <span className="text-[11px] text-gray-400 block">
                        (${item.unitPrice.toFixed(2)} each)
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-2.5 py-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.cartId, Math.max(1, item.quantity - 1))}
                          className="w-5 h-5 rounded-full bg-white hover:bg-gray-200 text-gray-700 flex items-center justify-center text-xs font-bold cursor-pointer transition"
                        >
                          -
                        </button>
                        <span className="text-xs font-extrabold w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                          className="w-5 h-5 rounded-full bg-[#8BC34A] hover:bg-[#7CB342] text-white flex items-center justify-center text-xs font-bold cursor-pointer transition"
                        >
                          +
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.cartId)}
                        className="w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition cursor-pointer"
                        title="Remove dish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Order Summary & Checkout Card */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-4 sm:p-7 border border-gray-100 shadow-xl space-y-5 sm:space-y-6 lg:sticky lg:top-24">
              <div>
                <h3 className="text-lg font-black text-[#1A1A1A]">Order Summary</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Verified server pricing with kitchen dispatch
                </p>
              </div>

              {/* Delivery & Contact inputs */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-gray-600 mb-1">
                    Delivery Address
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter delivery address..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#8BC34A]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-gray-600 mb-1">
                    Contact Phone Number
                  </label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#8BC34A]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-gray-600 mb-1">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Credit Card', 'Cash on Delivery'] as const).map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                          paymentMethod === method
                            ? 'border-[#8BC34A] bg-[#F4F9EE] text-[#558B2F] ring-2 ring-[#8BC34A]/30'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-gray-600 mb-1">
                    Order Note for Kitchen (Optional)
                  </label>
                  <input
                    type="text"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="e.g. Ring the doorbell, gate code #44..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#8BC34A]"
                  />
                </div>
              </div>

              {/* Price Calculation Breakdown */}
              <div className="pt-4 border-t border-gray-100 space-y-2.5">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Subtotal ({cartTotalCount} items)</span>
                  <span className="font-bold text-gray-900">${cartSubtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-xs text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#558B2F]" />
                    Express Kitchen Delivery
                  </span>
                  <span className="font-bold text-[#558B2F]">FREE</span>
                </div>

                <div className="flex justify-between text-xs text-gray-600">
                  <span>Estimated Tax</span>
                  <span className="font-semibold text-gray-500">$0.00</span>
                </div>

                <div className="flex justify-between text-lg font-black text-[#1A1A1A] pt-3 border-t border-gray-100">
                  <span>Total Amount</span>
                  <span className="text-[#558B2F]">${cartSubtotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Server Security Assurance */}
              <div className="bg-[#FAFDF7] rounded-xl p-3 border border-[#E5F0DA] flex items-center gap-2.5 text-xs text-[#558B2F]">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span className="text-[11px] font-medium leading-tight">
                  Backend price validation active. Prices calculated directly from database records.
                </span>
              </div>

              {/* Primary Checkout CTA */}
              <button
                type="button"
                disabled={isSubmitting || cart.length === 0}
                onClick={handleCheckout}
                className={`w-full py-4 rounded-full bg-[#8BC34A] hover:bg-[#7CB342] text-white font-extrabold text-sm shadow-xl transition flex items-center justify-center gap-2 cursor-pointer ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {isSubmitting
                    ? 'Validating & Placing Order...'
                    : `Confirm & Place Order ($${cartSubtotal.toFixed(2)})`}
                </span>
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

export default CartPage;

