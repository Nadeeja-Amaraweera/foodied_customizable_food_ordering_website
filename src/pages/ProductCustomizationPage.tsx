import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Flame,
  Check,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { MenuItem, CartItem } from '../types';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { StoreToast } from '../components/StoreOverlays';
import { FloatingLeaf } from '../components/common/FloatingLeaf';
import { adminProductApi } from '../services/adminApi';
import { useCart } from '../context/CartContext';
import useAuth from '../hooks/useAuth';

export const ProductCustomizationPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const { addToCart, cartTotalCount } = useCart();

  // Initial product from router state if navigated from Menu/Home
  const stateProduct = (location.state as { product?: MenuItem })?.product;

  const [product, setProduct] = useState<MenuItem | null>(stateProduct || null);
  const [loading, setLoading] = useState<boolean>(!stateProduct);
  const [error, setError] = useState<string | null>(null);

  // Customization state
  const [portionSize, setPortionSize] = useState<string>('');
  const [spiceLevel, setSpiceLevel] = useState<string>('');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [dietaryTags, setDietaryTags] = useState<string[]>([]);
  const [specialNotes, setSpecialNotes] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAddedSuccess, setIsAddedSuccess] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch product by ID if not in state or to refresh
  useEffect(() => {
    let isMounted = true;

    if (!productId) {
      setError('No product selected for customization.');
      setLoading(false);
      return;
    }

    const loadProduct = async () => {
      if (!product || product.id !== productId) {
        setLoading(true);
      }
      try {
        const data = await adminProductApi.getProductById(productId);
        if (!isMounted) return;

        if (data) {
          const defaultAddons =
            data.customization?.extras && data.customization.extras.length > 0
              ? data.customization.extras.map((e) =>
                  e.priceModifier > 0
                    ? `${e.name} (+$${Number(e.priceModifier).toFixed(2)})`
                    : e.name
                )
              : [
                  'Extra Cheddar Cheese (+$1.50)',
                  'Crispy Bacon (+$2.00)',
                  'Garlic Aioli (+$0.80)',
                ];

          const mapped: MenuItem = {
            id: data._id || data.id || productId,
            name: data.name,
            price: Number(data.price) || 0,
            rating: data.rating || 4.9,
            reviews: 24,
            category: data.category,
            isDessert: data.category === 'Desserts',
            image: data.image,
            description: data.description,
            defaultAddons,
            addonsText: defaultAddons.slice(0, 3).join(', '),
            isAvailable: data.isAvailable,
            customization: data.customization,
          };

          setProduct(mapped);
          setError(null);
        } else if (!product) {
          setError('Product not found or currently unavailable.');
        }
      } catch (err: any) {
        if (!isMounted) return;
        console.error('Failed to load product details:', err);
        if (!product) {
          setError(
            err?.response?.data?.message ||
              'Could not load product customization details. Please try again.'
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [productId]);

  // Initialize default options once product is loaded
  useEffect(() => {
    if (product) {
      if (!portionSize) {
        const initialSize =
          product.customization?.sizes?.[0]?.name || 'Regular';
        setPortionSize(initialSize);
      }
      if (!spiceLevel) {
        const initialSpice =
          product.customization?.spiceLevels?.[0] ||
          (product.isDessert ? 'Standard Sweetness' : 'Medium');
        setSpiceLevel(initialSpice);
      }
    }
  }, [product, portionSize, spiceLevel]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Available portion sizes from DB or fallbacks
  const sizesList = useMemo(() => {
    if (product?.customization?.sizes && product.customization.sizes.length > 0) {
      return product.customization.sizes;
    }
    return [
      { name: 'Regular', priceModifier: 0 },
      { name: 'Large', priceModifier: 3.0 },
      { name: 'Family', priceModifier: 6.0 },
    ];
  }, [product?.customization?.sizes]);

  // Available extras / add-on toppings from DB or fallbacks
  const extrasList = useMemo(() => {
    if (product?.customization?.extras && product.customization.extras.length > 0) {
      return product.customization.extras;
    }
    if (product?.defaultAddons && product.defaultAddons.length > 0) {
      return product.defaultAddons.map((addon) => {
        const match = addon.match(/^(.+?)\s*\(\+\$([\d.]+)\)$/);
        if (match) {
          return { name: match[1].trim(), priceModifier: parseFloat(match[2]) };
        }
        return { name: addon, priceModifier: 0 };
      });
    }
    return [
      { name: 'Extra Cheddar Cheese', priceModifier: 1.5 },
      { name: 'Crispy Bacon', priceModifier: 2.0 },
      { name: 'Garlic Aioli', priceModifier: 0.8 },
    ];
  }, [product?.customization?.extras, product?.defaultAddons]);

  // Available spice/sweetness levels
  const spiceList = useMemo(() => {
    if (
      product?.customization?.spiceLevels &&
      product.customization.spiceLevels.length > 0
    ) {
      return product.customization.spiceLevels;
    }
    return product?.isDessert
      ? ['Standard Sweetness', 'Extra Maple', 'Light Sweet', 'Sugar-Free']
      : ['Mild', 'Medium', 'Spicy', 'Extra Hot'];
  }, [product?.customization?.spiceLevels, product?.isDessert]);

  // Dynamic Selected Size Modifier
  const currentSizeModifier = useMemo(() => {
    if (!product) return 0;
    const match = sizesList.find(
      (s) => s.name.trim().toLowerCase() === portionSize.trim().toLowerCase()
    );
    return match ? Number(match.priceModifier) || 0 : 0;
  }, [product, sizesList, portionSize]);

  // Dynamic Selected Extras Modifier
  const currentExtrasModifier = useMemo(() => {
    if (!product) return 0;
    return selectedAddons.reduce((sum, addonName) => {
      const match = extrasList.find(
        (e) => e.name.trim().toLowerCase() === addonName.trim().toLowerCase()
      );
      return sum + (match ? Number(match.priceModifier) || 0 : 0);
    }, 0);
  }, [product, extrasList, selectedAddons]);

  // Dynamic Real-Time Calculated Unit Price
  const calculatedUnitPrice = useMemo(() => {
    if (!product) return 0;
    const base = Number(product.price) || 0;
    return Number(
      (base + currentSizeModifier + currentExtrasModifier).toFixed(2)
    );
  }, [product, currentSizeModifier, currentExtrasModifier]);

  // Total Price for current quantity
  const totalPrice = useMemo(() => {
    return Number((calculatedUnitPrice * quantity).toFixed(2));
  }, [calculatedUnitPrice, quantity]);

  // Toggle Add-on Extra
  const toggleAddon = (addonName: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonName)
        ? prev.filter((a) => a !== addonName)
        : [...prev, addonName]
    );
  };

  // Toggle Dietary Tag
  const toggleDietaryTag = (tag: string) => {
    setDietaryTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Add customized meal to Cart
  const handleAddToCart = () => {
    if (!product) return;

    const newItem: CartItem = {
      cartId: `${product.id}-${Date.now()}`,
      id: product.id,
      productId: product.id,
      name: product.name,
      basePrice: product.price,
      unitPrice: calculatedUnitPrice,
      quantity: quantity,
      image: product.image,
      portion: portionSize,
      spice: spiceLevel,
      addons: [...selectedAddons],
      dietary: [...dietaryTags],
      notes: specialNotes,
      customization: {
        size: portionSize,
        spiceLevel: spiceLevel,
        extras: [...selectedAddons],
        dietary: [...dietaryTags],
        specialInstructions: specialNotes,
      },
    };

    addToCart(newItem);
    setIsAddedSuccess(true);
    showToast(
      `Added ${quantity}x ${product.name} ($${totalPrice.toFixed(
        2
      )}) to your food bag!`
    );

    // Provide user feedback and smoothly navigate back to Menu after a short moment
    setTimeout(() => {
      navigate('/menu');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#FAFDF7] text-[#1A1A1A] font-sans relative overflow-x-hidden selection:bg-[#8BC34A] selection:text-white">
      {/* Decorative Organic Green Blob in Top Right */}
      <div
        className="hidden lg:block absolute top-0 right-0 w-[45%] h-[480px] bg-[#8BC34A]/20 pointer-events-none z-0"
        style={{
          borderBottomLeftRadius: '60% 80%',
          boxShadow: 'inset 0 -20px 40px rgba(0,0,0,0.02)',
        }}
      />

      <FloatingLeaf className="hidden md:block w-28 h-28 absolute top-[380px] -right-6 z-10 opacity-80 rotate-12" />
      <FloatingLeaf
        className="hidden md:block w-32 h-32 absolute top-[750px] -left-8 z-10 opacity-80 -rotate-12"
        flip
      />

      <StoreToast message={toastMessage} />

      {/* Global Header */}
      <Header
        cartTotalCount={cartTotalCount}
        currentUser={auth.user}
        onCartOpen={() => navigate('/cart')}
        onLogout={() => {
          auth.logout();
          navigate('/login');
        }}
        onAuthNavigate={() => navigate('/login')}
      />

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-4 pb-24">
        {/* Navigation Breadcrumb / Back Action */}
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/menu')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-gray-700 hover:text-[#558B2F] hover:bg-[#F4F9EE] border border-gray-200 shadow-xs font-semibold text-xs sm:text-sm transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#7CB342]" />
            <span>Back to Menu</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/cart')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#8BC34A]/10 text-[#558B2F] font-bold text-xs hover:bg-[#8BC34A]/20 transition"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Bag: {cartTotalCount}</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && !product && (
          <div className="bg-white rounded-3xl p-16 shadow-xl border border-gray-100 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-12 h-12 text-[#8BC34A] animate-spin mb-4" />
            <h3 className="text-lg font-bold text-gray-800">
              Loading Product Details...
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Preparing customization options and ingredients
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !product && (
          <div className="bg-white rounded-3xl p-12 shadow-xl border border-red-100 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">
              Product Not Found
            </h3>
            <p className="text-sm text-gray-500 max-w-md mb-6">{error}</p>
            <button
              onClick={() => navigate('/menu')}
              className="px-6 py-2.5 rounded-full bg-[#8BC34A] hover:bg-[#7CB342] text-white font-bold text-sm shadow transition"
            >
              Return to Menu
            </button>
          </div>
        )}

        {/* Dedicated Product Customization Card Layout */}
        {product && (
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 animate-in fade-in duration-300">
            {/* Top Soft Green Banner with Centered Circular Dish Image */}
            <div className="relative h-56 sm:h-64 bg-[#E8F3DC] flex flex-col items-center justify-center p-6 overflow-hidden">
              {/* Decorative Background Glows */}
              <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-[#8BC34A]/20 blur-2xl pointer-events-none" />
              <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-[#7CB342]/20 blur-2xl pointer-events-none" />

              {/* Centered Circular Food Image with Green Ring & Float Shadow */}
              <div className="relative z-10 transform transition-transform duration-500 hover:scale-105">
                <img
                  src={
                    product.image ||
                    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'
                  }
                  alt={product.name}
                  className="w-40 h-40 sm:w-48 sm:h-48 rounded-full object-cover ring-4 ring-[#8BC34A] shadow-2xl bg-white"
                />
              </div>

              {/* Bottom-left Badge: Customize Your Meal */}
              <span className="absolute bottom-4 left-6 bg-[#8BC34A] text-white text-xs font-black tracking-wide px-3.5 py-1 rounded-full shadow-md">
                Customize Your Meal
              </span>

              {/* Top-right Category Badge */}
              {product.category && (
                <span className="absolute top-4 right-6 bg-white/90 backdrop-blur-xs text-[#558B2F] text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                  {product.category}
                </span>
              )}
            </div>

            {/* Customization Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Product Title + Description + Live Unit Price */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-gray-100">
                <div className="max-w-xl">
                  <h1 className="text-2xl sm:text-3xl font-black text-[#1A1A1A] tracking-tight">
                    {product.name}
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mt-1.5">
                    {product.description}
                  </p>
                </div>

                <div className="text-left sm:text-right shrink-0 bg-[#F4F9EE] sm:bg-transparent p-3 sm:p-0 rounded-2xl">
                  <span className="text-[10px] sm:text-[11px] uppercase font-black text-gray-400 block tracking-wider">
                    Current Unit Price
                  </span>
                  <span className="text-3xl font-black text-[#7CB342]">
                    ${calculatedUnitPrice.toFixed(2)}
                  </span>
                  <span className="text-[11px] text-gray-400 block mt-0.5">
                    (Base: ${Number(product.price).toFixed(2)})
                  </span>
                </div>
              </div>

              {/* 1. SELECT PORTION SIZE */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-800">
                    1. Select Portion Size
                  </label>
                  <span className="text-[11px] font-semibold text-gray-400">
                    Updates price dynamically
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {sizesList.map((sizeObj) => {
                    const isSelected =
                      portionSize.toLowerCase() === sizeObj.name.toLowerCase();
                    return (
                      <button
                        key={sizeObj.name}
                        type="button"
                        onClick={() => setPortionSize(sizeObj.name)}
                        className={`py-3 px-3 rounded-2xl border text-xs font-bold transition flex flex-col items-center justify-center cursor-pointer ${
                          isSelected
                            ? 'border-[#8BC34A] bg-[#F4F9EE] text-[#558B2F] ring-2 ring-[#8BC34A]/40 shadow-xs'
                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-sm font-black">{sizeObj.name}</span>
                        <span
                          className={`text-[11px] mt-0.5 font-bold ${
                            sizeObj.priceModifier > 0
                              ? 'text-[#558B2F]'
                              : 'text-gray-400 font-normal'
                          }`}
                        >
                          {sizeObj.priceModifier > 0
                            ? `+$${Number(sizeObj.priceModifier).toFixed(2)}`
                            : 'Standard (+0.00)'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. SWEETNESS / SPICE LEVEL */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-800 mb-2.5 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-500" />
                  2.{' '}
                  {product.isDessert
                    ? 'Sweetness Level'
                    : 'Spice & Seasoning Level'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {spiceList.map((level) => {
                    const isSelected =
                      spiceLevel.toLowerCase() === level.toLowerCase();
                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setSpiceLevel(level)}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition cursor-pointer text-center ${
                          isSelected
                            ? 'bg-[#8BC34A] text-white border-[#8BC34A] shadow-xs'
                            : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {level}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. CUSTOMIZE ADD-ON TOPPINGS & EXTRAS */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-800">
                    3. Customize Add-On Toppings &amp; Extras
                  </label>
                  <span className="text-[11px] text-gray-400 font-semibold">
                    Priced per item
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {extrasList.map((extraObj) => {
                    const isChecked = selectedAddons.some(
                      (a) => a.toLowerCase() === extraObj.name.toLowerCase()
                    );
                    return (
                      <button
                        key={extraObj.name}
                        type="button"
                        onClick={() => toggleAddon(extraObj.name)}
                        className={`flex items-center justify-between p-3 rounded-2xl border text-left text-xs transition cursor-pointer ${
                          isChecked
                            ? 'border-[#8BC34A] bg-[#F4F9EE] font-bold text-[#1A1A1A] shadow-xs ring-1 ring-[#8BC34A]/30'
                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-4 h-4 rounded-md flex items-center justify-center transition ${
                              isChecked
                                ? 'bg-[#8BC34A] text-white'
                                : 'border border-gray-300 bg-white'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="text-xs font-semibold">
                            {extraObj.name}
                          </span>
                        </div>
                        <span className="text-xs font-black text-[#558B2F] shrink-0 ml-2">
                          {extraObj.priceModifier > 0
                            ? `+$${Number(extraObj.priceModifier).toFixed(2)}`
                            : 'Free'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. INGREDIENT TWEAKS */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-800 mb-2.5">
                  4. Ingredient Tweaks
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'No Onions',
                    'Low Sodium',
                    'Sauce on Side',
                    'Gluten-Free Prep',
                    'Extra Fresh Herbs',
                  ].map((tag) => {
                    const active = dietaryTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleDietaryTag(tag)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
                          active
                            ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-xs'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {active ? `✓ ${tag}` : tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5. SPECIAL KITCHEN INSTRUCTIONS */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-800 mb-2">
                  Special Kitchen Instructions
                </label>
                <input
                  type="text"
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="e.g., Extra crispy, pack cutlery, allergy note..."
                  className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent bg-white transition"
                />
              </div>
            </div>

            {/* Bottom Sticky Action Bar: Quantity + Add Customized Meal CTA */}
            <div className="sticky bottom-0 z-20 p-4 sm:p-6 bg-white/95 backdrop-blur-md border-t border-gray-100 flex items-center justify-between gap-4 shadow-[0_-10px_25px_rgba(0,0,0,0.03)]">
              {/* Quantity Counter */}
              <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-full px-3.5 py-2">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 rounded-full bg-white hover:bg-gray-200 text-gray-800 flex items-center justify-center transition cursor-pointer shadow-xs"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-black w-5 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 rounded-full bg-[#8BC34A] hover:bg-[#7CB342] text-white flex items-center justify-center transition cursor-pointer shadow-xs"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add Customized Item CTA with Dynamic Live Total Price */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isAddedSuccess}
                className="flex-1 py-3.5 px-6 rounded-full bg-[#8BC34A] hover:bg-[#7CB342] active:scale-[0.99] text-white font-extrabold text-sm sm:text-base shadow-lg shadow-[#8BC34A]/30 transition flex items-center justify-between cursor-pointer disabled:opacity-80"
              >
                <span>
                  {isAddedSuccess ? '✓ Added to Food Bag' : 'Add Customized Meal'}
                </span>
                <span className="bg-white/20 backdrop-blur-xs px-3.5 py-1 rounded-full font-black text-sm sm:text-base ml-2">
                  ${totalPrice.toFixed(2)}
                </span>
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer
        onToast={showToast}
        onNewsletterSubscribe={() =>
          showToast('Thank you for subscribing to our newsletter!')
        }
      />
    </div>
  );
};

export default ProductCustomizationPage;

