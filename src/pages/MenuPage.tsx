import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MenuItem, CartItem, User } from '../types';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { RegularFoodSection } from '../components/sections/RegularFoodSection';
import { MealCustomizerModal } from '../components/modals/MealCustomizerModal';
import { StoreToast } from '../components/StoreOverlays';
import { FloatingLeaf } from '../components/common/FloatingLeaf';
import { adminProductApi } from '../services/adminApi';
import { AdminProduct } from '../data/adminMockData';
import { useCart } from '../context/CartContext';
import useAuth from '../hooks/useAuth';

export const MenuPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const { addToCart, cartTotalCount } = useCart();

  useEffect(() => {
    if (location.hash === '#contact-us' || location.hash === '#contact') {
      setTimeout(() => {
        const target = document.getElementById('contact-us') || document.getElementById('contact');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    }
  }, [location.hash, location.pathname]);

  const [backendProducts, setBackendProducts] = useState<AdminProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Customizer modal state
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [portionSize, setPortionSize] = useState('Regular');
  const [spiceLevel, setSpiceLevel] = useState('Medium');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [dietaryTags, setDietaryTags] = useState<string[]>([]);
  const [specialNotes, setSpecialNotes] = useState('');
  const [itemQty, setItemQty] = useState(1);

  // Current user derived from AuthContext
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
    }, 3200);
  };

  const handleLogout = () => {
    localStorage.removeItem('ACCESS_TOKEN');
    if (auth?.setUser) {
      auth.setUser(null);
    }
    showToast('You have been logged out.');
  };

  // Fetch available products from MongoDB backend
  useEffect(() => {
    let isMounted = true;
    const fetchMenu = async () => {
      try {
        setIsLoading(true);
        const data = await adminProductApi.getProducts();
        if (isMounted) {
          const available = (data || []).filter((p) => p.isAvailable === true);
          setBackendProducts(available);
        }
      } catch (err) {
        console.error('Failed to load menu products:', err);
        showToast('Failed to load menu products from server.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    fetchMenu();
    return () => {
      isMounted = false;
    };
  }, []);

  // Categories derived from available products
  const categories = useMemo(() => {
    const base = ['All', 'Burger', 'Pizza', 'Bowls & Salads', 'Pasta', 'Desserts', 'Beverages'];
    const present = new Set<string>();
    backendProducts.forEach((p) => {
      if (p.category) present.add(p.category);
    });
    present.forEach((c) => {
      if (!base.includes(c)) base.push(c);
    });
    return base;
  }, [backendProducts]);

  // Map products to MenuItem schema for display
  const menuItems = useMemo(() => {
    return backendProducts
      .map((p) => {
        const id = p._id || p.id || '';
        const defaultAddons =
          p.customization?.extras && p.customization.extras.length > 0
            ? p.customization.extras.map((e) =>
                e.priceModifier > 0
                  ? `${e.name} (+$${Number(e.priceModifier).toFixed(2)})`
                  : e.name
              )
            : ['Extra Cheese (+$1.50)', 'Crispy Bacon (+$2.00)', 'Garlic Aioli (+$0.80)'];

        const item: MenuItem = {
          id,
          section: 'regular',
          name: p.name,
          price: Number(p.price) || 0,
          rating: p.rating || 4.9,
          reviews: 24,
          category: p.category,
          isDessert: p.category === 'Desserts',
          image: p.image,
          description: p.description,
          defaultAddons,
          addonsText: defaultAddons.slice(0, 3).join(', '),
          isAvailable: p.isAvailable,
          customization: p.customization,
        };
        return item;
      })
      .filter((i) => {
        if (selectedCategory === 'All') return true;
        const filterNorm = selectedCategory.toLowerCase().replace(/s$/, '');
        const itemCatNorm = (i.category || '').toLowerCase().replace(/s$/, '');
        return (
          i.category === selectedCategory ||
          itemCatNorm === filterNorm ||
          itemCatNorm.includes(filterNorm)
        );
      })
      .filter((i) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          i.name.toLowerCase().includes(q) ||
          (i.description || '').toLowerCase().includes(q)
        );
      });
  }, [backendProducts, selectedCategory, searchQuery]);

  // Open the Customer Meal Customizer Modal
  const openCustomerCustomizer = (item: MenuItem, e?: React.MouseEvent<HTMLElement>) => {
    if (e && e.currentTarget) {
      setSelectedCardId(item.id);
      setTimeout(() => setSelectedCardId(null), 700);
    }
    setCustomizingItem(item);

    const initialSize = item.customization?.sizes?.[0]?.name || 'Regular';
    setPortionSize(initialSize);

    const initialSpice =
      item.customization?.spiceLevels?.[0] ||
      (item.isDessert ? 'Regular Sweet' : 'Medium');
    setSpiceLevel(initialSpice);

    setSelectedAddons([]);
    setDietaryTags([]);
    setSpecialNotes('');
    setItemQty(1);
  };

  // Dynamic Selected Size Modifier
  const currentSizeModifier = useMemo(() => {
    if (!customizingItem) return 0;
    const sizes = customizingItem.customization?.sizes;
    if (sizes && sizes.length > 0) {
      const match = sizes.find(
        (s) => s.name.trim().toLowerCase() === portionSize.trim().toLowerCase()
      );
      return match ? Number(match.priceModifier) || 0 : 0;
    }
    if (portionSize.toLowerCase() === 'large') return 3.0;
    if (portionSize.toLowerCase() === 'family') return 6.0;
    return 0;
  }, [customizingItem, portionSize]);

  // Dynamic Selected Extras Modifier
  const currentExtrasModifier = useMemo(() => {
    if (!customizingItem) return 0;
    const extras = customizingItem.customization?.extras;
    if (extras && extras.length > 0) {
      return selectedAddons.reduce((sum, addonName) => {
        const cleanName = addonName.replace(/\s*\(\+\$[\d.]+\)$/i, '').trim().toLowerCase();
        const match = extras.find(
          (e) =>
            e.name.trim().toLowerCase() === cleanName ||
            e.name.trim().toLowerCase() === addonName.trim().toLowerCase()
        );
        return sum + (match ? Number(match.priceModifier) || 0 : 0);
      }, 0);
    }
    return selectedAddons.reduce((sum, addonName) => {
      const match = addonName.match(/\+\$([\d.]+)/);
      if (match) return sum + parseFloat(match[1]);
      return sum;
    }, 0);
  }, [customizingItem, selectedAddons]);

  // Dynamic Real-Time Calculated Unit Price
  const calculatedUnitPrice = useMemo(() => {
    if (!customizingItem) return 0;
    const base = Number(customizingItem.price) || 0;
    return Number((base + currentSizeModifier + currentExtrasModifier).toFixed(2));
  }, [customizingItem, currentSizeModifier, currentExtrasModifier]);

  // Add customized item to Cart
  const handleAddToCart = () => {
    if (!customizingItem) return;
    const newItem: CartItem = {
      cartId: `${customizingItem.id}-${Date.now()}`,
      id: customizingItem.id,
      productId: customizingItem.id,
      name: customizingItem.name,
      basePrice: customizingItem.price,
      unitPrice: calculatedUnitPrice,
      quantity: itemQty,
      image: customizingItem.image,
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
    setCustomizingItem(null);
    showToast(`Added ${customizingItem.name} ($${calculatedUnitPrice.toFixed(2)}) to your food bag!`);
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

      <FloatingLeaf className="hidden md:block w-28 h-28 absolute top-[420px] -right-6 z-10 opacity-90 rotate-12" />
      <FloatingLeaf
        className="hidden md:block w-32 h-32 absolute top-[900px] -left-8 z-10 opacity-90 -rotate-12"
        flip
      />

      <StoreToast message={toastMessage} />

      <Header
        searchQuery={searchQuery}
        isSearchOpen={isSearchOpen}
        cartTotalCount={cartTotalCount}
        currentUser={currentUser}
        onSearchToggle={() => setIsSearchOpen((open) => !open)}
        onSearchChange={setSearchQuery}
        onCartOpen={() => navigate('/cart')}
        onLogout={handleLogout}
        onAuthNavigate={() => navigate('/login')}
      />

      {/* Main Dedicated Menu View */}
      <main className="relative z-10 pt-6 pb-20">
        <RegularFoodSection
          regularItems={menuItems}
          categories={categories}
          activeCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedCardId={selectedCardId}
          onCustomizeDish={openCustomerCustomizer}
          isLoading={isLoading}
        />
      </main>

      <Footer
        onToast={showToast}
        onNewsletterSubscribe={() => showToast('Thank you for subscribing to our newsletter!')}
      />

      {/* Meal Customizer Modal with Live Dynamic Pricing */}
      <MealCustomizerModal
        item={customizingItem}
        portionSize={portionSize}
        onPortionSizeChange={setPortionSize}
        spiceLevel={spiceLevel}
        onSpiceLevelChange={setSpiceLevel}
        selectedAddons={selectedAddons}
        onToggleAddon={(addon) =>
          setSelectedAddons((prev) =>
            prev.includes(addon) ? prev.filter((a) => a !== addon) : [...prev, addon]
          )
        }
        dietaryTags={dietaryTags}
        onToggleDietaryTag={(tag) =>
          setDietaryTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
          )
        }
        specialNotes={specialNotes}
        onSpecialNotesChange={setSpecialNotes}
        quantity={itemQty}
        onQuantityChange={setItemQty}
        unitPrice={calculatedUnitPrice}
        onAddToCart={handleAddToCart}
        onClose={() => setCustomizingItem(null)}
      />
    </div>
  );
};

export default MenuPage;

