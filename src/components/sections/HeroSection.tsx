import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Utensils, Sliders, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { HeroDish, MenuItem } from '../../types';
import { adminProductApi, AdminProduct } from '../../services/adminApi';

export interface HeroSectionProps {
  activeHeroDish?: HeroDish | null;
  heroDishes?: HeroDish[];
  heroAnimKey?: number;
  floatStartVector?: { x: number; y: number; rot: number };
  isAutoFloating?: boolean;
  onToggleAutoFloat?: () => void;
  onReplayFloat?: () => void;
  onSelectHeroDish?: (dish: HeroDish, x: number, y: number, rot: number) => void;
  onCustomizeDish?: (dish: MenuItem, e?: React.MouseEvent<HTMLElement>) => void;
  backendProducts?: AdminProduct[];
}

// Global in-memory cache to prevent duplicate network downloads
const imageMemoryCache = new Set<string>();

/**
 * Preload a single image resource into browser cache
 */
const preloadImage = (url: string): Promise<boolean> => {
  if (!url || typeof url !== 'string') return Promise.resolve(false);
  if (imageMemoryCache.has(url)) return Promise.resolve(true);

  return new Promise((resolve) => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      imageMemoryCache.add(url);
      resolve(true);
    };
    img.onerror = () => {
      resolve(false);
    };
  });
};

/* --- Decorative Garnish SVGs matching the reference --- */
const BitterGourdSlice: React.FC<{ className?: string; size?: number; rotation?: number }> = ({
  className = '',
  size = 52,
  rotation = 0
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    style={{ transform: `rotate(${rotation}deg)` }}
    className={`select-none pointer-events-none drop-shadow-md ${className}`}
  >
    <path
      d="M50 7 C55 7, 58 11, 63 11 C68 11, 71 8, 76 9 C81 10, 83 15, 87 18 C91 21, 95 21, 97 26 C99 31, 96 35, 97 40 C98 45, 101 48, 100 53 C99 58, 95 61, 95 66 C95 71, 98 75, 96 80 C94 85, 89 87, 86 91 C83 95, 81 99, 76 100 C71 101, 68 97, 63 97 C58 97, 55 101, 50 100 C45 99, 42 95, 37 95 C32 95, 29 98, 24 96 C19 94, 17 89, 13 86 C9 83, 5 81, 4 76 C3 71, 7 68, 7 63 C7 58, 3 55, 4 50 C5 45, 9 42, 9 37 C9 32, 6 29, 8 24 C10 19, 15 17, 18 13 C21 9, 21 5, 26 4 C31 3, 35 7, 40 7 Z"
      fill="#8EC641"
      stroke="#689F38"
      strokeWidth="2.5"
    />
    <circle cx="50" cy="50" r="32" fill="#D4EAA6" stroke="#9CCC65" strokeWidth="2" />
    <circle cx="50" cy="50" r="18" fill="#FAFDF7" stroke="#8BC34A" strokeWidth="2" />
    <circle cx="45" cy="45" r="2.8" fill="#7CB342" />
    <circle cx="55" cy="45" r="2.8" fill="#7CB342" />
    <circle cx="50" cy="56" r="2.8" fill="#7CB342" />
  </svg>
);

const TomatoWedge: React.FC<{ className?: string; size?: number; rotation?: number }> = ({
  className = '',
  size = 46,
  rotation = 0
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 80 60"
    fill="none"
    style={{ transform: `rotate(${rotation}deg)` }}
    className={`select-none pointer-events-none drop-shadow-md ${className}`}
  >
    <path
      d="M10 50 C20 18, 52 8, 75 22 C64 48, 34 58, 10 50 Z"
      fill="#E53935"
      stroke="#C62828"
      strokeWidth="2"
    />
    <path
      d="M24 44 C32 24, 52 16, 68 26 C58 44, 38 48, 24 44 Z"
      fill="#EF5350"
    />
    <circle cx="44" cy="30" r="2.5" fill="#FFF59D" />
    <circle cx="34" cy="35" r="2.2" fill="#FFF59D" />
  </svg>
);

const DicedTomatoBits: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex gap-1.5 pointer-events-none select-none items-center ${className}`}>
    <span className="w-3.5 h-3.5 rounded-xs bg-[#E53935] shadow-xs rotate-12 inline-block border border-red-700/20" />
    <span className="w-4 h-3.5 rounded-xs bg-[#EF5350] shadow-xs -rotate-12 inline-block border border-red-700/20" />
    <span className="w-2.5 h-2.5 rounded-xs bg-[#D32F2F] shadow-xs rotate-45 inline-block border border-red-700/20" />
  </div>
);

const BATCH_SIZE = 3;

// Default mini dishes matching the reference image layout
const DEFAULT_MINI_DISHES: HeroDish[] = [
  {
    id: 'mini-1',
    name: 'Superfood Salad Bowl',
    price: 14.5,
    calories: '15 min',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80',
    desc: 'Fresh garden greens with toasted seeds and citrus vinaigrette',
  },
  {
    id: 'mini-2',
    name: 'Avocado Egg Brunch Bowl',
    price: 16.0,
    calories: '12 min',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80',
    desc: 'Soft boiled farm eggs with ripe avocado and seasonal grains',
  },
  {
    id: 'mini-3',
    name: 'Audit Test Gourmet Pasta',
    price: 19.5,
    calories: '15-20 min',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    desc: 'Fresh artisan pasta tossed with aromatic herbs and premium olive oil',
  },
  {
    id: 'mini-4',
    name: 'Crispy Golden Stacked Pancakes',
    price: 9.8,
    calories: '10 min',
    image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=400&q=80',
    desc: 'Fluffy buttermilk pancake stack with Canadian maple syrup and berries',
  },
  {
    id: 'mini-5',
    name: 'Artisan Gourmet Burger',
    price: 18.5,
    calories: '18 min',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
    desc: 'Prime Angus beef patty with caramelized onions and melted cheddar',
  },
];

// Exact 5 floating positions around the dashed circle matching the reference image:
// 1. Middle-Left (approx 170° / 9 o'clock)
// 2. Bottom-Left (approx 135° / 7:30 o'clock)
// 3. Bottom-Center (approx 90° / 6 o'clock)
// 4. Bottom-Right (approx 45° / 4:30 o'clock)
// 5. Middle-Right (approx 10° / 3 o'clock)
const MINI_CIRCLE_POSITIONS = [
  { left: '0%', top: '56%', animClass: 'animate-float-mini-1' },
  { left: '16%', top: '84%', animClass: 'animate-float-mini-2' },
  { left: '50%', top: '99%', animClass: 'animate-float-mini-3' },
  { left: '84%', top: '84%', animClass: 'animate-float-mini-4' },
  { left: '100%', top: '60%', animClass: 'animate-float-mini-5' },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  activeHeroDish: externalActiveDish,
  heroDishes: externalHeroDishes,
  onSelectHeroDish: externalOnSelect,
  onCustomizeDish,
  backendProducts: initialProducts
}) => {
  const navigate = useNavigate();

  // 1. Product Data Cache (Avoid redundant network requests)
  const [products, setProducts] = useState<AdminProduct[]>(initialProducts || []);
  const [internalSelectedDish, setInternalSelectedDish] = useState<HeroDish | null>(null);
  const [animKey, setAnimKey] = useState(1);
  const [imageErrorMap, setImageErrorMap] = useState<Record<string, boolean>>({});

  // 2. Progressive Image Loading State (Batches of 3)
  const [loadedImageCount, setLoadedImageCount] = useState<number>(BATCH_SIZE);
  const [isLoadingBatch, setIsLoadingBatch] = useState<boolean>(false);
  const [loadedImagesMap, setLoadedImagesMap] = useState<Record<string, boolean>>({});

  // 3. Smooth Main Image Switcher State (Preserve previous image until new image loads)
  const [displayedMainImage, setDisplayedMainImage] = useState<string>('');
  const [isMainImagePreloading, setIsMainImagePreloading] = useState<boolean>(false);

  // Fetch available products from MongoDB if list is empty
  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      setProducts(initialProducts);
      return;
    }

    let isMounted = true;
    const fetchCatalog = async () => {
      try {
        const data = await adminProductApi.getProducts();
        if (isMounted) {
          const available = data.filter((p) => p.isAvailable !== false);
          setProducts(available);
          if (available.length > 0 && !internalSelectedDish && !externalActiveDish) {
            const first = available[0];
            const mappedFirst: HeroDish = {
              id: first._id || first.id || '',
              name: first.name,
              price: Number(first.price),
              calories: first.preparationTime || '15-20 min',
              image: first.image,
              desc: first.description,
            };
            setInternalSelectedDish(mappedFirst);
            setDisplayedMainImage(first.image);
          }
        }
      } catch (err) {
        console.error('[HeroSection] Failed to load menu products:', err);
      }
    };

    fetchCatalog();
    return () => {
      isMounted = false;
    };
  }, [initialProducts]);

  // Derived list of displayable hero dishes from backend products
  const displayDishes: HeroDish[] = useMemo(() => {
    if (products.length > 0) {
      return products.map((p) => ({
        id: p._id || p.id || '',
        name: p.name,
        price: Number(p.price),
        calories: p.preparationTime || '15-20 min',
        image: p.image,
        desc: p.description,
      }));
    }
    if (externalHeroDishes && externalHeroDishes.length > 0) {
      return externalHeroDishes;
    }
    return DEFAULT_MINI_DISHES;
  }, [products, externalHeroDishes]);

  // Ensure 5 mini dishes are always populated for the 5 positions around the circle
  const miniDishes: HeroDish[] = useMemo(() => {
    const list: HeroDish[] = [];
    for (let i = 0; i < 5; i++) {
      if (displayDishes[i]) {
        list.push(displayDishes[i]);
      } else {
        list.push(DEFAULT_MINI_DISHES[i]);
      }
    }
    return list;
  }, [displayDishes]);

  // The active featured dish
  const activeDish = externalActiveDish || internalSelectedDish || displayDishes[0] || DEFAULT_MINI_DISHES[2];

  // Initialize displayed main image when active dish is ready
  useEffect(() => {
    if (activeDish?.image && !displayedMainImage) {
      setDisplayedMainImage(activeDish.image);
    }
  }, [activeDish, displayedMainImage]);

  // PROGRESSIVE BATCH LOADER: Load exactly 3 images per batch
  const loadBatch = useCallback(
    async (startIndex: number, count: number = BATCH_SIZE) => {
      if (startIndex >= displayDishes.length) return;
      setIsLoadingBatch(true);

      const targetBatch = displayDishes.slice(startIndex, startIndex + count);
      const results = await Promise.all(
        targetBatch.map(async (dish) => {
          if (!dish.image) return { id: dish.id, success: false };
          const success = await preloadImage(dish.image);
          return { id: dish.id, success };
        })
      );

      setLoadedImagesMap((prev) => {
        const next = { ...prev };
        results.forEach((r) => {
          if (r.success) next[r.id] = true;
        });
        return next;
      });

      setLoadedImageCount((prev) => Math.min(prev + count, displayDishes.length));
      setIsLoadingBatch(false);
    },
    [displayDishes]
  );

  // Load the initial batch of 3 images on mount / dishes ready
  const initialBatchLoadedRef = useRef(false);
  useEffect(() => {
    if (displayDishes.length > 0 && !initialBatchLoadedRef.current) {
      initialBatchLoadedRef.current = true;
      loadBatch(0, BATCH_SIZE);
    }
  }, [displayDishes, loadBatch]);

  // Request next batch when user hovers or interacts with the thumbnail area
  const handleRequestNextBatch = useCallback(() => {
    if (loadedImageCount < displayDishes.length && !isLoadingBatch) {
      loadBatch(loadedImageCount, BATCH_SIZE);
    }
  }, [loadedImageCount, displayDishes.length, isLoadingBatch, loadBatch]);

  // Progressive background chaining: automatically load next batch during browser idle time
  useEffect(() => {
    if (loadedImageCount >= displayDishes.length || isLoadingBatch) return;

    const timer = setTimeout(() => {
      loadBatch(loadedImageCount, BATCH_SIZE);
    }, 1800);

    return () => clearTimeout(timer);
  }, [loadedImageCount, displayDishes.length, isLoadingBatch, loadBatch]);

  // Smooth Selection Handler: Preload if not loaded yet; keep previous main image until ready
  const handleSelectDish = async (dish: HeroDish, originX = 140, originY = 120, rot = -22) => {
    if (dish.image && !imageMemoryCache.has(dish.image)) {
      setIsMainImagePreloading(true);
      await preloadImage(dish.image);
      setIsMainImagePreloading(false);
    }

    setDisplayedMainImage(dish.image);
    setInternalSelectedDish(dish);
    setAnimKey((prev) => prev + 1);

    if (externalOnSelect) {
      externalOnSelect(dish, originX, originY, rot);
    }

    // Trigger next batch preload upon interaction
    handleRequestNextBatch();
  };

  const handleImageError = (id: string) => {
    setImageErrorMap((prev) => ({ ...prev, [id]: true }));
  };

  // Thumbnail arc configuration: up to 6 positions on desktop arc
  const visibleThumbnails = displayDishes.slice(0, Math.min(loadedImageCount, 6));

  // Radial angles in degrees matching the reference image layout:
  // [165°, 128°, 90°, 52°, 18°, -16°]
  const ARC_ANGLES = [165, 128, 90, 52, 18, -16];
  const ORBIT_RADIUS = 230; // Radius on desktop

  return (
    <section id="home" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pt-4 pb-16 lg:pt-8 lg:pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        {/* ========================================================= */}
        {/* LEFT COLUMN: Badge, Big Headline, Description & 2 Buttons */}
        {/* ========================================================= */}
        <div className="lg:col-span-6 space-y-6 lg:space-y-7 z-10">
          {/* Small rounded badge: "Hungry?" */}
          <div className="inline-block">
            <span className="px-5 py-1.5 rounded-full border border-gray-400 text-xs sm:text-sm font-semibold text-gray-800 bg-white shadow-2xs tracking-wide">
              Hungry?
            </span>
          </div>

          {/* Large Bold Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[64px] font-black tracking-tight leading-[1.08] text-[#111111] font-display">
            JUST COME TO <br />
            FOODIED &amp; ORDER
          </h1>

          {/* Short Description */}
          <p className="text-gray-500 text-xs sm:text-sm md:text-base max-w-md leading-relaxed font-normal">
            Here You Will Find All The Best Quality And Pure Food. Order Now To Satisfy Your Hunger Pangs
          </p>

          {/* Two Buttons: Order Now & Explore More */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
            <button
              onClick={() => navigate('/menu')}
              className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-[#7CB342] hover:bg-[#689F38] text-white font-bold text-xs sm:text-base shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2"
            >
              Order Now
            </button>

            <button
              onClick={() => navigate('/menu')}
              className="px-5 sm:px-7 py-3 sm:py-3.5 rounded-full border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white font-bold text-xs sm:text-base transition-all duration-200 flex items-center gap-2 cursor-pointer"
            >
              Explore More <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Active Dish Quick Indicator & Progressive Status */}
          {activeDish && (
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
              <span className="inline-flex items-center gap-1.5 font-semibold text-[#558B2F] bg-[#E8F3DC] px-3.5 py-1.5 rounded-full shadow-2xs">
                <Utensils className="w-3.5 h-3.5 text-[#689F38]" />
                Featured: <strong className="text-gray-900 font-bold">{activeDish.name}</strong> • ${Number(activeDish.price).toFixed(2)}
              </span>

              {/* Subtle badge indicating progressive batch count */}
              {displayDishes.length > BATCH_SIZE && (
                <span className="inline-flex items-center gap-1 text-[11px] text-gray-400 font-medium bg-white/80 px-2.5 py-1 rounded-full border border-gray-200/60">
                  {Math.min(loadedImageCount, displayDishes.length)} of {displayDishes.length} meals ready
                  {isLoadingBatch && <Loader2 className="w-3 h-3 animate-spin text-[#7CB342] ml-0.5" />}
                </span>
              )}
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: Large Center Circle + Dashed Radar Border + 5 Floating Mini Circles */}
        {/* ========================================================= */}
        <div
          onMouseEnter={handleRequestNextBatch}
          onTouchStart={handleRequestNextBatch}
          className="lg:col-span-6 flex justify-center items-center relative min-h-[380px] sm:min-h-[500px] lg:min-h-[580px] py-4 select-none overflow-hidden sm:overflow-visible"
        >
          {/* Main Orbit Arena Container: Scales responsively across mobile, tablet, and desktop */}
          <div className="relative flex items-center justify-center w-[280px] h-[280px] min-[360px]:w-[320px] min-[360px]:h-[320px] sm:w-[410px] sm:h-[410px] md:w-[450px] md:h-[450px] lg:w-[490px] lg:h-[490px] xl:w-[520px] xl:h-[520px]">
            
            {/* 1. THIN DASHED WHITE BORDER (Radar / Orbit Circle) */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-white/70 pointer-events-none shadow-xs" />

            {/* 2. FLOATING VEGGIE / GARNISH CUTOUTS (Gentle Bobbing) */}
            <div className="absolute inset-0 pointer-events-none z-15 flex items-center justify-center overflow-visible">
              <div
                className="absolute -translate-x-20 -translate-y-32 sm:-translate-x-28 sm:-translate-y-48 animate-zero-gravity"
                style={{ animationDelay: '0.4s' }}
              >
                <DicedTomatoBits />
              </div>

              <div
                className="absolute -translate-x-8 -translate-y-28 sm:-translate-x-12 sm:-translate-y-44 animate-zero-gravity"
                style={{ animationDelay: '1.2s' }}
              >
                <BitterGourdSlice size={36} rotation={-15} className="sm:w-[52px] sm:h-[52px]" />
              </div>

              <div
                className="absolute translate-x-20 -translate-y-32 sm:translate-x-28 sm:-translate-y-48 animate-zero-gravity"
                style={{ animationDelay: '0.8s' }}
              >
                <TomatoWedge size={36} rotation={22} className="sm:w-[48px] sm:h-[48px]" />
              </div>

              <div
                className="absolute translate-x-32 -translate-y-24 sm:translate-x-46 sm:-translate-y-36 animate-zero-gravity"
                style={{ animationDelay: '1.8s' }}
              >
                <BitterGourdSlice size={38} rotation={38} className="sm:w-[52px] sm:h-[52px]" />
              </div>
            </div>

            {/* 3. LARGE MAIN CIRCLE: Center circular food item with soft shadow and green ring */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                key={`main-hero-dish-${animKey}-${activeDish?.id}`}
                className="relative w-[190px] h-[190px] min-[360px]:w-[220px] min-[360px]:h-[220px] sm:w-[290px] sm:h-[290px] md:w-[320px] md:h-[320px] lg:w-[350px] lg:h-[350px] xl:w-[380px] xl:h-[380px] rounded-full p-2.5 sm:p-5 lg:p-6 bg-[#A4D670] shadow-[0_20px_50px_rgba(0,0,0,0.18)] flex items-center justify-center transition-all duration-500 group animate-dish-float-in"
              >
                {displayedMainImage && !imageErrorMap[activeDish?.id || ''] ? (
                  <div className="relative w-full h-full rounded-full overflow-hidden bg-white shadow-inner">
                    <img
                      src={displayedMainImage}
                      alt={activeDish?.name || 'Featured Meal'}
                      onError={() => activeDish && handleImageError(activeDish.id)}
                      loading="eager"
                      onClick={(e) => {
                        if (onCustomizeDish && activeDish) {
                          onCustomizeDish(
                            {
                              id: activeDish.id,
                              name: activeDish.name,
                              price: activeDish.price,
                              image: displayedMainImage,
                              description: activeDish.desc,
                              isDessert: false,
                            },
                            e
                          );
                        } else {
                          navigate('/menu');
                        }
                      }}
                      className={`w-full h-full object-cover rounded-full select-none cursor-pointer transition-transform duration-500 group-hover:scale-105 ${
                        isMainImagePreloading ? 'opacity-70 filter blur-xs' : 'opacity-100'
                      }`}
                    />

                    {/* Preloading spinner overlay */}
                    {isMainImagePreloading && (
                      <div className="absolute inset-0 bg-white/40 backdrop-blur-2xs rounded-full flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-[#558B2F]" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full rounded-full bg-white/80 flex flex-col items-center justify-center text-gray-500 p-4 text-center">
                    <Utensils className="w-14 h-14 text-[#558B2F]/60 mb-2" />
                    <span className="text-xs font-bold text-gray-700">
                      {activeDish?.name || 'Gourmet Dish'}
                    </span>
                  </div>
                )}

                {/* 4. FLOATING UI TAG - TOP LEFT */}
                <div className="absolute -top-3 -left-3 sm:-top-5 sm:-left-6 z-25 bg-white/95 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl shadow-xl border border-gray-100/90 flex items-center gap-2 sm:gap-2.5 animate-float-tag-top">
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7CB342] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#7CB342]" />
                  </span>
                  <div className="text-left">
                    <p className="text-[11px] sm:text-xs font-black text-[#1A1A1A] leading-tight line-clamp-1 max-w-[130px] sm:max-w-[170px]">
                      {activeDish?.name || 'Audit Test Gourmet Pasta'}
                    </p>
                    <p className="text-[10px] sm:text-[11px] font-bold text-[#558B2F]">
                      ${Number(activeDish?.price || 19.50).toFixed(2)} • {activeDish?.calories || '15-20 min'}
                    </p>
                  </div>
                </div>

                {/* 5. FLOATING UI TAG - BOTTOM BUTTON: Customize ($19.50) */}
                {onCustomizeDish && activeDish && (
                  <button
                    type="button"
                    onClick={(e) =>
                      onCustomizeDish(
                        {
                          id: activeDish.id,
                          name: activeDish.name,
                          price: activeDish.price,
                          image: displayedMainImage || activeDish.image,
                          description: activeDish.desc,
                          isDessert: false,
                        },
                        e
                      )
                    }
                    className="absolute -bottom-3 sm:-bottom-4 left-1/2 -translate-x-1/2 z-25 bg-white text-[#1A1A1A] px-4 sm:px-5 py-1.5 sm:py-2 rounded-full shadow-xl border border-gray-100 text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 hover:bg-[#7CB342] hover:text-white transition-all cursor-pointer animate-float-tag-bottom whitespace-nowrap"
                  >
                    <Sliders className="w-3.5 h-3.5 text-[#558B2F] group-hover:text-white" />
                    <span>Customize (${Number(activeDish.price).toFixed(2)})</span>
                  </button>
                )}
              </div>
            </div>

            {/* 6. FLOATING MINI CIRCLES AROUND THE LARGE CIRCLE (5-6 positions matching reference image) */}
            {miniDishes.map((mini, idx) => {
              const pos = MINI_CIRCLE_POSITIONS[idx];
              if (!pos) return null;
              const isCurrent = activeDish?.id === mini.id;

              return (
                <button
                  key={`mini-circle-${mini.id}-${idx}`}
                  type="button"
                  onClick={() => handleSelectDish(mini)}
                  style={{
                    left: pos.left,
                    top: pos.top,
                  }}
                  title={`Select "${mini.name}" ($${Number(mini.price).toFixed(2)})`}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 w-10 h-10 min-[360px]:w-12 min-[360px]:h-12 sm:w-15 sm:h-15 lg:w-[68px] lg:h-[68px] rounded-full p-0.5 sm:p-1.5 bg-white shadow-[0_8px_20px_rgba(0,0,0,0.14)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.22)] border border-gray-100 hover:scale-115 active:scale-95 transition-all duration-300 cursor-pointer ${pos.animClass} ${
                    isCurrent ? 'ring-2 sm:ring-4 ring-[#7CB342] ring-offset-2 scale-110 shadow-2xl' : ''
                  }`}
                >
                  <img
                    src={mini.image}
                    alt={mini.name}
                    loading="lazy"
                    onError={() => handleImageError(mini.id)}
                    className="w-full h-full object-cover rounded-full select-none"
                  />

                  {/* Active indicator checkmark */}
                  {isCurrent && (
                    <span className="absolute -bottom-1 -right-1 bg-[#7CB342] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
