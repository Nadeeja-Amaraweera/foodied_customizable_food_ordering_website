import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MenuItem, HeroDish, CartItem, Chef, FloatingClone, User } from '../types';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { FloatingLeaf } from '../components/common/FloatingLeaf';
import { FloatingDishClone, StoreToast } from '../components/StoreOverlays';
import { HeroSection } from '../components/sections/HeroSection';
import { FeaturedSection } from '../components/sections/FeaturedSection';
import { WhyChooseUsSection } from '../components/sections/WhyChooseUsSection';
import { ChefsSection } from '../components/sections/ChefsSection';
import { MealCustomizerModal } from '../components/modals/MealCustomizerModal';
import useAuth from '../hooks/useAuth';
import { useCart } from '../context/CartContext';

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
  const location = useLocation();
  const auth = useAuth();
  const { addToCart, cartTotalCount } = useCart();

  // Smooth scroll to Contact section if landing with hash
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

  // Application Data States
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

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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

  // 1. Dynamic Selected Size Modifier
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

  // 2. Dynamic Total Selected Extras Modifier
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

  // 3. Dynamic Real-Time Calculated Unit Price
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

  const handleLogout = () => {
    localStorage.removeItem('ACCESS_TOKEN');
    if (auth?.setUser) {
      auth.setUser(null);
    }
    showToast('You have been logged out.');
  };

  // Filtered featured items
  const featuredItems = useMemo(
    () =>
      menuItems
        .filter((i) => i.section === 'featured')
        .filter((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [menuItems, searchQuery]
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
    </div>
  );
};

export default HomeScreen;
