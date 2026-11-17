import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MenuItem, HeroDish, Chef, FloatingClone, User } from '../types';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { FloatingLeaf } from '../components/common/FloatingLeaf';
import { FloatingDishClone, StoreToast } from '../components/StoreOverlays';
import { HeroSection } from '../components/sections/HeroSection';
import { FeaturedSection } from '../components/sections/FeaturedSection';
import { WhyChooseUsSection } from '../components/sections/WhyChooseUsSection';
import { ChefsSection } from '../components/sections/ChefsSection';
import { adminProductApi, AdminProduct } from '../services/adminApi';
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
  const [backendProducts, setBackendProducts] = useState<AdminProduct[]>([]);
  const [heroDishes, setHeroDishes] = useState<HeroDish[]>(initialHeroDishes);
  const [activeHeroDish, setActiveHeroDish] = useState<HeroDish | null>(null);
  const [chefs] = useState<Chef[]>(initialChefs);

  // Fetch available products from backend MongoDB API
  useEffect(() => {
    let isMounted = true;
    const loadProducts = async () => {
      try {
        const data = await adminProductApi.getProducts();
        if (isMounted) {
          const available = data.filter((p) => p.isAvailable !== false);
          setBackendProducts(available);
          const mappedDishes: HeroDish[] = available.map((p) => ({
            id: p._id || p.id || '',
            name: p.name,
            price: Number(p.price),
            calories: p.preparationTime || '15-20 min',
            image: p.image,
            desc: p.description,
          }));
          setHeroDishes(mappedDishes);
          if (mappedDishes.length > 0 && !activeHeroDish) {
            setActiveHeroDish(mappedDishes[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load products for HomeScreen:', err);
      }
    };
    loadProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  // Floating-In Animation States & Controls
  const [heroAnimKey, setHeroAnimKey] = useState(1);
  const [floatStartVector, setFloatStartVector] = useState({ x: 160, y: 120, rot: -22 });
  const [isAutoFloating, setIsAutoFloating] = useState(false);
  const [floatingClone, setFloatingClone] = useState<FloatingClone | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

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

  // Navigate to Dedicated Product Customization Page on "Buy Now"
  const openCustomerCustomizer = (item: MenuItem, e?: React.MouseEvent<HTMLElement>) => {
    if (e && e.currentTarget) {
      setSelectedCardId(item.id);
      setTimeout(() => setSelectedCardId(null), 700);
    }
    // Navigate directly to dedicated customization page
    navigate(`/customize/${item.id}`, { state: { product: item } });
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

      {/* Top Organic Green Background Curve matching reference */}
      <svg
        className="hidden md:block absolute top-0 right-0 w-full sm:w-[90%] md:w-[75%] lg:w-[62%] xl:w-[58%] h-[620px] sm:h-[680px] lg:h-[760px] pointer-events-none z-0 overflow-visible transition-all duration-500"
        viewBox="0 0 850 760"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M 120 0 C 140 180, 240 250, 190 430 C 130 580, 300 700, 850 640 L 850 0 Z"
          fill="#7CB342"
        />
      </svg>

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
        backendProducts={backendProducts}
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
    </div>
  );
};

export default HomeScreen;
