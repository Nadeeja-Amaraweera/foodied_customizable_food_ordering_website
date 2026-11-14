import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuItem, HeroDish, CartItem, Chef, FloatingClone, User } from '../types';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { FloatingLeaf } from '../components/common/FloatingLeaf';
import { FloatingDishClone, StoreToast } from '../components/StoreOverlays';
import { HeroSection } from '../components/sections/HeroSection';
import { FeaturedSection } from '../components/sections/FeaturedSection';
import { WhyChooseUsSection } from '../components/sections/WhyChooseUsSection';
import { SpecialMenuSection } from '../components/sections/SpecialMenuSection';
import { RegularFoodSection } from '../components/sections/RegularFoodSection';
import { ChefsSection } from '../components/sections/ChefsSection';
import { MealCustomizerModal } from '../components/modals/MealCustomizerModal';
import { CartDrawer } from '../components/cart/CartDrawer';
import useAuth from '../hooks/useAuth';

export interface HomeScreenProps {
  initialMenuItems?: MenuItem[];
  initialHeroDishes?: HeroDish[];
  initialChefs?: Chef[];
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  initialMenuItems = [],
  initialHeroDishes = [],
  initialChefs = []
}) => {
  const navigate = useNavigate();
  const auth = useAuth();

  // Application Data States (Ready for Backend API Integration)
  const [menuItems] = useState<MenuItem[]>(initialMenuItems);
  const [heroDishes] = useState<HeroDish[]>(initialHeroDishes);
  const [activeHeroDish, setActiveHeroDish] = useState<HeroDish | null>(null);
  const [chefs] = useState<Chef[]>(initialChefs);

  // Floating-In Animation States & Controls
  const [heroAnimKey, setHeroAnimKey] = useState(1);
  const [floatStartVector, setFloatStartVector] = useState({ x: 160, y: 120, rot: -22 });
  const [isAutoFloating, setIsAutoFloating] = useState(false);
  const [floatingClone, setFloatingClone] = useState<FloatingClone | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  // Customer Order Customizer Modal State
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [portionSize, setPortionSize] = useState('Regular');
  const [spiceLevel, setSpiceLevel] = useState('Medium');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [dietaryTags, setDietaryTags] = useState<string[]>([]);
  const [specialNotes, setSpecialNotes] = useState('');
  const [itemQty, setItemQty] = useState(1);

  // Shopping Cart State (Ready for Backend Cart API)
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderPlacedSuccess, setOrderPlacedSuccess] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [specialPageDot, setSpecialPageDot] = useState(0);
  const [regularCategoryFilter, setRegularCategoryFilter] = useState('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Current user derived from AuthContext
  const currentUser: User | null = useMemo(() => {
    if (!auth?.user) return null;
    return {
      username: auth.user.name || auth.user.username || auth.user.email || 'User',
      email: auth.user.email
    };
  }, [auth?.user]);

  // Trigger directional Float-In animation into the main Hero Bowl
  const triggerHeroDishFloat = (
    dish: MenuItem | HeroDish,
    originX = 150,
    originY = 130,
    originRot = -22
  ) => {
    setFloatStartVector({ x: originX, y: originY, rot: originRot });
    setActiveHeroDish({
      id: dish.id,
      name: dish.name,
      price: Number(dish.price),
      calories: 'calories' in dish ? dish.calories : '390 kcal',
      image: dish.image,
      desc: 'desc' in dish ? dish.desc : dish.description || ''
    });
    setHeroAnimKey((prev) => prev + 1);
  };

  // Auto-Orbit Float Showcase Timer
  useEffect(() => {
    if (!isAutoFloating || heroDishes.length === 0) return;
    const angles = [172, 134, 92, 50, 12, -35];
    const timer = setInterval(() => {
      setActiveHeroDish((current) => {
        if (!current || heroDishes.length === 0) return null;
        const currentIndex = heroDishes.findIndex((d) => d.id === current.id);
        const nextIndex = (currentIndex + 1) % heroDishes.length;
        const nextDish = heroDishes[nextIndex];
        const angleRad = ((angles[nextIndex] || 90) * Math.PI) / 180;
        const startX = Math.cos(angleRad) * 215;
        const startY = Math.sin(angleRad) * 215;
        setFloatStartVector({
          x: Math.round(startX),
          y: Math.round(startY),
          rot: nextIndex % 2 === 0 ? -24 : 24
        });
        setHeroAnimKey((k) => k + 1);
        return nextDish;
      });
    }, 3400);
    return () => clearInterval(timer);
  }, [isAutoFloating, heroDishes]);

  // Trigger a temporary notification toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Open the Customer Meal Customizer Modal
  const openCustomerCustomizer = (item: MenuItem, e?: React.MouseEvent<HTMLElement>) => {
    if (e && e.currentTarget) {
      setSelectedCardId(item.id);
      setTimeout(() => setSelectedCardId(null), 700);
    }
    setCustomizingItem(item);
    setPortionSize('Regular');
    setSpiceLevel(item.isDessert ? 'Regular Sweet' : 'Medium');
    setSelectedAddons([]);
    setDietaryTags([]);
    setSpecialNotes('');
    setItemQty(1);
  };

  // Base price representation
  const calculatedUnitPrice = useMemo(() => {
    if (!customizingItem) return 0;
    return Number(customizingItem.price) || 0;
  }, [customizingItem]);

  // Add customized item to Cart
  const handleAddToCart = () => {
    if (!customizingItem) return;
    const newItem: CartItem = {
      cartId: `${customizingItem.id}-${Date.now()}`,
      id: customizingItem.id,
      name: customizingItem.name,
      basePrice: customizingItem.price,
      unitPrice: calculatedUnitPrice,
      quantity: itemQty,
      image: customizingItem.image,
      portion: portionSize,
      spice: spiceLevel,
      addons: [...selectedAddons],
      dietary: [...dietaryTags],
      notes: specialNotes
    };
    setCart((prev) => [...prev, newItem]);
    setCustomizingItem(null);
    showToast(`Added ${customizingItem.name} to your food bag!`);
  };

  const handleLogout = () => {
    localStorage.removeItem('ACCESS_TOKEN');
    if (auth?.setUser) {
      auth.setUser(null);
    }
    showToast('You have been logged out.');
  };

  // Filtered sections
  const featuredItems = useMemo(
    () =>
      menuItems
        .filter((i) => i.section === 'featured')
        .filter((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [menuItems, searchQuery]
  );

  const specialItems = useMemo(
    () =>
      menuItems
        .filter((i) => i.section === 'special')
        .filter((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [menuItems, searchQuery]
  );

  const regularItems = useMemo(
    () =>
      menuItems
        .filter((i) => i.section === 'regular')
        .filter((i) =>
          regularCategoryFilter === 'All' ? true : i.category === regularCategoryFilter
        )
        .filter((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [menuItems, regularCategoryFilter, searchQuery]
  );

  const cartTotalCount = cart.reduce((acc, item) => acc + (item.quantity || 0), 0);
  const cartSubtotal = cart.reduce(
    (acc, item) => acc + (item.unitPrice || 0) * (item.quantity || 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#FAFDF7] text-[#1A1A1A] font-sans relative overflow-x-hidden selection:bg-[#8BC34A] selection:text-white">
      <FloatingDishClone clone={floatingClone} />

      {/* Top Organic Green Blob Shape */}
      <div
        className="hidden lg:block absolute top-0 right-0 w-[56%] h-[650px] bg-[#8BC34A] pointer-events-none z-0 transition-all duration-500"
        style={{
          borderBottomLeftRadius: '55% 82%',
          borderBottomRightRadius: '18% 25%',
          boxShadow: 'inset 0 -20px 50px rgba(0,0,0,0.04)'
        }}
      />

      {/* Decorative Floating Leaves on the Page Edges */}
      <FloatingLeaf className="hidden md:block w-28 h-28 absolute top-[1180px] -right-6 z-10 opacity-95 rotate-12" />
      <FloatingLeaf
        className="hidden md:block w-32 h-32 absolute top-[1560px] -left-8 z-10 opacity-95 -rotate-12"
        flip
      />
      <FloatingLeaf className="hidden md:block w-28 h-28 absolute bottom-[720px] -right-6 z-10 opacity-90 rotate-45" />

      <StoreToast message={toastMessage} />

      <Header
        searchQuery={searchQuery}
        isSearchOpen={isSearchOpen}
        cartTotalCount={cartTotalCount}
        currentUser={currentUser}
        onSearchToggle={() => setIsSearchOpen((open) => !open)}
        onSearchChange={setSearchQuery}
        onCartOpen={() => setIsCartOpen(true)}
        onLogout={handleLogout}
        onAuthNavigate={() => navigate('/login')}
      />

      <HeroSection
        activeHeroDish={activeHeroDish}
        heroDishes={heroDishes}
        heroAnimKey={heroAnimKey}
        floatStartVector={floatStartVector}
        isAutoFloating={isAutoFloating}
        onToggleAutoFloat={() => setIsAutoFloating(!isAutoFloating)}
        onReplayFloat={() => activeHeroDish && triggerHeroDishFloat(activeHeroDish, 165, 135, -24)}
        onSelectHeroDish={(dish, x, y, rot) => triggerHeroDishFloat(dish, x, y, rot)}
        onCustomizeDish={openCustomerCustomizer}
      />

      <FeaturedSection
        featuredItems={featuredItems}
        selectedCardId={selectedCardId}
        onCustomizeDish={openCustomerCustomizer}
      />

      <WhyChooseUsSection />

      <SpecialMenuSection
        specialItems={specialItems}
        specialPageDot={specialPageDot}
        onDotChange={setSpecialPageDot}
        selectedCardId={selectedCardId}
        onCustomizeDish={openCustomerCustomizer}
      />

      <RegularFoodSection
        regularItems={regularItems}
        activeCategory={regularCategoryFilter}
        onCategoryChange={setRegularCategoryFilter}
        selectedCardId={selectedCardId}
        onCustomizeDish={openCustomerCustomizer}
      />

      <ChefsSection chefs={chefs} />

      <Footer
        onToast={showToast}
        onNewsletterSubscribe={() => showToast('Thank you for subscribing to our newsletter!')}
      />

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

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        subtotal={cartSubtotal}
        orderPlacedSuccess={orderPlacedSuccess}
        onResetOrderSuccess={() => setOrderPlacedSuccess(false)}
        onRemoveItem={(cartId) => setCart((prev) => prev.filter((c) => c.cartId !== cartId))}
        onUpdateQuantity={(cartId, qty) =>
          setCart((prev) =>
            prev.map((c) => (c.cartId === cartId ? { ...c, quantity: qty } : c))
          )
        }
        onCheckout={() => {
          setOrderPlacedSuccess(true);
          setCart([]);
        }}
      />
    </div>
  );
};

export default HomeScreen;
