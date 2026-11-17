import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MenuItem, User } from '../types';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { RegularFoodSection } from '../components/sections/RegularFoodSection';
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

  // Navigate to Dedicated Product Customization Page on "Buy Now"
  const openCustomerCustomizer = (item: MenuItem, e?: React.MouseEvent<HTMLElement>) => {
    if (e && e.currentTarget) {
      setSelectedCardId(item.id);
      setTimeout(() => setSelectedCardId(null), 700);
    }
    // Navigate to dedicated customization page, passing item in state for instant display
    navigate(`/customize/${item.id}`, { state: { product: item } });
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
    </div>
  );
};

export default MenuPage;

