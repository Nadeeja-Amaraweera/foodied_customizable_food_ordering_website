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
    return [
      {
        id: 'fallback-1',
        name: 'Rainbow Teriyaki Salmon Poké Bowl',
        price: 15.20,
        calories: '15-20 min',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
        desc: 'Fresh sushi-grade salmon, avocado roses, edamame, and sesame shoyu bowl.'
      }
    ];
  }, [products, externalHeroDishes]);

  // The active featured dish
  const activeDish = externalActiveDish || internalSelectedDish || displayDishes[0];

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
      {/* Decorative Fresh Leaves on Far Left Edge (matching reference) */}
      <div className="absolute top-2 -left-4 sm:-left-2 md:-left-4 w-14 sm:w-20 md:w-24 pointer-events-none z-10 opacity-95 select-none">
        <svg viewBox="0 0 100 180" fill="none" className="w-full h-auto drop-shadow-sm">
          <path
            d="M-5 25 C25 25, 75 55, 68 95 C40 100, 15 75, -5 70 Z"
            fill="#7CB342"
          />
          <path
            d="M-5 25 C28 40, 58 70, 68 95"
            stroke="#9CCC65"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M-5 85 C30 85, 80 115, 75 155 C45 160, 20 135, -5 125 Z"
            fill="#689F38"
          />
          <path
            d="M-5 85 C32 100, 65 130, 75 155"
            stroke="#8BC34A"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M-5 145 C20 148, 50 162, 45 185 C25 185, 5 170, -5 165 Z"
            fill="#558B2F"
          />
        </svg>
      </div>

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
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => navigate('/menu')}
              className="px-8 py-3.5 rounded-full bg-[#7CB342] hover:bg-[#689F38] text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2"
            >
              Order Now
            </button>

            <button
              onClick={() => navigate('/menu')}
              className="px-7 py-3.5 rounded-full border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white font-bold text-sm sm:text-base transition-all duration-200 flex items-center gap-2 cursor-pointer"
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
        {/* RIGHT COLUMN: Large Center Bowl + Progressive Thumbnails   */}
        {/* ========================================================= */}
        <div
          onMouseEnter={handleRequestNextBatch}
          onTouchStart={handleRequestNextBatch}
          className="lg:col-span-6 flex justify-center items-center relative min-h-[440px] sm:min-h-[500px] lg:min-h-[560px]"
        >
          {/* Floating Veggie / Garnish Cutouts (animated matching reference) */}
          <div className="absolute inset-0 pointer-events-none z-15 flex items-center justify-center overflow-visible">
            <div className="absolute -translate-x-28 -translate-y-48 animate-zero-gravity" style={{ animationDelay: '0.4s' }}>
              <DicedTomatoBits />
            </div>

            <div className="absolute -translate-x-12 -translate-y-44 animate-zero-gravity" style={{ animationDelay: '1.2s' }}>
              <BitterGourdSlice size={44} rotation={-15} />
            </div>

            <div className="absolute translate-x-28 -translate-y-48 animate-zero-gravity" style={{ animationDelay: '0.8s' }}>
              <TomatoWedge size={42} rotation={22} />
            </div>

            <div className="absolute translate-x-48 -translate-y-36 animate-zero-gravity" style={{ animationDelay: '1.8s' }}>
              <BitterGourdSlice size={48} rotation={38} />
            </div>
          </div>

          {/* Orbit Guideline Arc (Subtle) */}
          <div className="absolute w-[380px] h-[380px] sm:w-[450px] sm:h-[450px] rounded-full border-2 border-dashed border-white/50 pointer-events-none" />

          {/* MAIN LARGE CENTRAL CIRCULAR FOOD IMAGE */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              key={`main-hero-dish-${animKey}-${activeDish?.id}`}
              className="animate-dish-float-in relative w-64 h-64 sm:w-80 sm:h-80 md:w-[350px] md:h-[350px] lg:w-[400px] lg:h-[400px] rounded-full p-4 sm:p-5 bg-[#A4D670] shadow-2xl flex items-center justify-center transition-all duration-500 group"
            >
              {displayedMainImage && !imageErrorMap[activeDish?.id || ''] ? (
                <div className="relative w-full h-full rounded-full overflow-hidden">
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
                    className={`w-full h-full object-cover rounded-full shadow-inner select-none cursor-pointer transition-transform duration-500 group-hover:scale-105 ${
                      isMainImagePreloading ? 'opacity-70 filter blur-xs' : 'opacity-100'
                    }`}
                  />

                  {/* Preloading spinner overlay if switching to an uncached image */}
                  {isMainImagePreloading && (
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-2xs rounded-full flex items-center justify-center">
                      <Loader2 className="w-8 h-8 animate-spin text-[#558B2F]" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-full rounded-full bg-white/70 flex flex-col items-center justify-center text-gray-500 p-4 text-center">
                  <Utensils className="w-16 h-16 text-[#558B2F]/60 mb-2" />
                  <span className="text-xs font-bold text-gray-700">{activeDish?.name || 'Fresh Food Bowl'}</span>
                </div>
              )}

              {/* Floating Quick Info Pill on Top-Left of Bowl */}
              <div className="absolute -top-3 -left-3 sm:-left-5 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl shadow-lg border border-[#8BC34A]/40 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#7CB342] animate-ping" />
                <div className="text-left">
                  <p className="text-[11px] font-black text-[#1A1A1A] leading-tight line-clamp-1 max-w-[140px]">
                    {activeDish?.name || 'Gourmet Dish'}
                  </p>
                  <p className="text-[10px] font-bold text-[#558B2F]">
                    ${Number(activeDish?.price || 0).toFixed(2)} • {activeDish?.calories || 'Ready in 15m'}
                  </p>
                </div>
              </div>

              {/* Interactive Quick Customize Button on Bottom of Bowl */}
              {onCustomizeDish && activeDish && (
                <button
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
                  className="absolute bottom-4 bg-white/95 backdrop-blur-xs text-[#1A1A1A] px-4 py-1.5 rounded-full shadow-lg text-xs font-bold flex items-center gap-1.5 hover:bg-[#7CB342] hover:text-white transition-all cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5" /> Customize (${Number(activeDish.price).toFixed(2)})
                </button>
              )}
            </div>
          </div>

          {/* ========================================================= */}
          {/* ORBITING CIRCULAR THUMBNAILS (Progressive Batch Arc)       */}
          {/* ========================================================= */}
          <div className="hidden lg:block">
            {visibleThumbnails.map((dish, idx) => {
              const angleDeg = ARC_ANGLES[idx] ?? 90;
              const angleRad = (angleDeg * Math.PI) / 180;
              const x = Math.round(Math.cos(angleRad) * ORBIT_RADIUS);
              const y = Math.round(Math.sin(angleRad) * ORBIT_RADIUS);

              const isCurrent = activeDish?.id === dish.id;
              const isLoaded = loadedImagesMap[dish.id] || imageMemoryCache.has(dish.image);

              return (
                <button
                  key={`thumb-${dish.id}-${idx}`}
                  type="button"
                  onClick={() => handleSelectDish(dish, x, y, angleDeg > 90 ? -22 : 22)}
                  onMouseEnter={handleRequestNextBatch}
                  style={{
                    transform: `translate3d(${x}px, ${y}px, 0)`
                  }}
                  title={`View "${dish.name}" ($${dish.price.toFixed(2)})`}
                  className={`absolute z-20 w-16 h-16 xl:w-[72px] xl:h-[72px] rounded-full p-1 bg-white shadow-xl transition-all duration-300 hover:scale-120 hover:z-30 cursor-pointer ${
                    isCurrent
                      ? 'ring-4 ring-[#7CB342] ring-offset-2 scale-110 shadow-2xl'
                      : 'border-2 border-white/90 hover:border-[#7CB342]'
                  }`}
                >
                  {/* Progressive Loading Shimmer Placeholder */}
                  {!isLoaded && !imageErrorMap[dish.id] ? (
                    <div className="w-full h-full rounded-full bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse flex items-center justify-center">
                      <Utensils className="w-4 h-4 text-gray-300" />
                    </div>
                  ) : dish.image && !imageErrorMap[dish.id] ? (
                    <img
                      src={dish.image}
                      alt={dish.name}
                      loading="lazy"
                      onError={() => handleImageError(dish.id)}
                      className="w-full h-full object-cover rounded-full select-none transition-opacity duration-300"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600">
                      {dish.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}

                  {/* Active Indicator Checkmark */}
                  {isCurrent && (
                    <span className="absolute -bottom-1 -right-1 bg-[#7CB342] text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ========================================================= */}
          {/* MOBILE / TABLET THUMBNAILS (Progressive Row)               */}
          {/* ========================================================= */}
          <div className="lg:hidden flex flex-wrap justify-center gap-3 mt-8 w-full z-20">
            {visibleThumbnails.map((dish) => {
              const isCurrent = activeDish?.id === dish.id;
              const isLoaded = loadedImagesMap[dish.id] || imageMemoryCache.has(dish.image);

              return (
                <button
                  key={`mobile-thumb-${dish.id}`}
                  onClick={() => handleSelectDish(dish, 0, 80, 0)}
                  onTouchStart={handleRequestNextBatch}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full p-1 bg-white shadow-md transition-all ${
                    isCurrent ? 'ring-3 ring-[#7CB342] scale-110' : 'border border-gray-200'
                  }`}
                >
                  {!isLoaded && !imageErrorMap[dish.id] ? (
                    <div className="w-full h-full rounded-full bg-gray-100 animate-pulse flex items-center justify-center">
                      <Utensils className="w-3.5 h-3.5 text-gray-300" />
                    </div>
                  ) : dish.image && !imageErrorMap[dish.id] ? (
                    <img
                      src={dish.image}
                      alt={dish.name}
                      loading="lazy"
                      onError={() => handleImageError(dish.id)}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600">
                      {dish.name.slice(0, 2).toUpperCase()}
                    </div>
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
