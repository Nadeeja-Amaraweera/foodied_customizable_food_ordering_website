import React from 'react';
import { ArrowRight, Utensils, RotateCcw, Pause, Play, Sliders } from 'lucide-react';
import { HeroDish, MenuItem } from '../../types';

export interface HeroSectionProps {
  activeHeroDish: HeroDish | null;
  heroDishes: HeroDish[];
  heroAnimKey: number;
  floatStartVector: { x: number; y: number; rot: number };
  isAutoFloating: boolean;
  onToggleAutoFloat: () => void;
  onReplayFloat: () => void;
  onSelectHeroDish: (dish: HeroDish, x: number, y: number, rot: number) => void;
  onCustomizeDish: (dish: MenuItem, e?: React.MouseEvent<HTMLElement>) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  activeHeroDish,
  heroDishes,
  heroAnimKey,
  floatStartVector,
  isAutoFloating,
  onToggleAutoFloat,
  onReplayFloat,
  onSelectHeroDish,
  onCustomizeDish
}) => {
  return (
    <section id="home" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pt-6 pb-20 lg:py-14">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Hungry Badge, Headline, Subtext & CTAs */}
        <div className="lg:col-span-6 space-y-5">
          <div className="inline-block">
            <span className="px-4 py-1 rounded-full border border-gray-400 text-xs font-medium text-gray-700 bg-white/80">
              Hungry?
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl xl:text-[54px] font-black tracking-tight leading-[1.12] text-[#1A1A1A]">
            JUST COME TO <br />
            FOODIED &amp; ORDER
          </h1>

          <p className="text-gray-500 text-xs sm:text-sm max-w-md leading-relaxed">
            Here You Will Find All The Best Quality And Pure Food. Order Now To Satisfy Your Hunger Pangs. Click any circle to float dishes in!
          </p>

          {/* Dual CTA Buttons matching Template */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={(e) => {
                if (activeHeroDish) {
                  onCustomizeDish(
                    {
                      id: activeHeroDish.id,
                      name: activeHeroDish.name,
                      price: activeHeroDish.price,
                      image: activeHeroDish.image,
                      description: activeHeroDish.desc,
                      isDessert: false,
                      defaultAddons: ['Avocado Slices', 'Extra Grilled Salmon', 'Soft Boiled Egg', 'Sesame Ginger Dressing']
                    },
                    e
                  );
                }
              }}
              className="px-7 py-3.5 rounded-full bg-[#8BC34A] hover:bg-[#7CB342] text-white font-semibold text-sm shadow-lg shadow-[#8BC34A]/30 transition flex items-center gap-2 cursor-pointer"
            >
              Order Now
            </button>

            <a
              href="#regular-food"
              className="px-7 py-3.5 rounded-full border border-gray-800 text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white font-semibold text-sm transition flex items-center gap-2"
            >
              Explore More <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Active Hero Bowl Quick Info Bar + Float Animation Controls */}
          <div className="pt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1.5 font-medium text-[#558B2F] bg-[#E8F3DC] px-3 py-1.5 rounded-full shadow-2xs">
              <Utensils className="w-3.5 h-3.5" /> Active Bowl: <strong>{activeHeroDish?.name || 'Selected Dish'}</strong> {activeHeroDish ? `($${Number(activeHeroDish.price).toFixed(2)})` : ''}
            </span>

            <button
              onClick={onReplayFloat}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border border-[#8BC34A]/50 text-[#558B2F] font-semibold hover:bg-[#F4F9EE] transition shadow-2xs"
              title="Replay the floating-in entrance animation"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Replay Float-In
            </button>

            <button
              onClick={onToggleAutoFloat}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full font-semibold transition shadow-2xs ${
                isAutoFloating
                  ? 'bg-[#1A1A1A] text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:border-[#8BC34A]'
              }`}
            >
              {isAutoFloating ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-[#8BC34A]" /> Auto-Float ON
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-[#558B2F]" /> Auto-Orbit Float
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Large Circular Bowl + 5 Orbiting Dish Thumbnails */}
        <div className="lg:col-span-6 flex justify-center items-center relative min-h-[410px] sm:min-h-[470px]">
          {/* Animated Bursting Garnish & Herb Particles */}
          <div key={`garnishes-${heroAnimKey}`} className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
            <div
              style={{ '--tx': '-165px', '--ty': '-135px' } as React.CSSProperties}
              className="absolute animate-garnish-particle"
            >
              <span className="inline-block px-2.5 py-1 rounded-full bg-[#7CB342] text-white text-[10px] font-bold shadow-md rotate-[-18deg]">
                🌿 Fresh Basil
              </span>
            </div>

            <div
              style={{ '--tx': '155px', '--ty': '-140px' } as React.CSSProperties}
              className="absolute animate-garnish-particle"
            >
              <span className="w-5 h-5 rounded-full border-4 border-red-400/90 inline-block shadow-sm" />
            </div>
          </div>

          {/* Orbit Dotted Ring Arc */}
          <div className="absolute w-[360px] h-[360px] sm:w-[440px] sm:h-[440px] rounded-full border-2 border-dashed border-white/60 pointer-events-none" />

          {/* Main Interactive Center Dish Showcase Bowl */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              key={`hero-dish-${heroAnimKey}`}
              style={{
                '--float-start-x': `${floatStartVector.x}px`,
                '--float-start-y': `${floatStartVector.y}px`,
                '--float-start-rot': `${floatStartVector.rot}deg`
              } as React.CSSProperties}
              className="animate-dish-float-in relative w-64 h-64 sm:w-80 sm:h-80 md:w-[350px] md:h-[350px] rounded-full p-3 bg-[#A5D666]/90 shadow-2xl flex items-center justify-center group"
            >
              {activeHeroDish?.image ? (
                <img
                  src={activeHeroDish.image}
                  alt={activeHeroDish.name}
                  onClick={(e) =>
                    activeHeroDish &&
                    onCustomizeDish(
                      {
                        id: activeHeroDish.id,
                        name: activeHeroDish.name,
                        price: activeHeroDish.price,
                        image: activeHeroDish.image,
                        description: activeHeroDish.desc,
                        isDessert: false,
                        defaultAddons: ['Avocado Slices', 'Extra Cheese', 'Fried Egg', 'Garlic Herb Sauce']
                      },
                      e
                    )
                  }
                  className="w-full h-full object-cover rounded-full shadow-inner cursor-pointer transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-white/40 flex items-center justify-center text-gray-400">
                  <Utensils className="w-12 h-12 text-[#558B2F]/40" />
                </div>
              )}

              {/* Floating Glassmorphic Info Pill on Top-Left of Bowl */}
              <div className="absolute -top-3 -left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl shadow-lg border border-[#8BC34A]/30 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8BC34A] animate-ping" />
                <div className="text-left">
                  <p className="text-[11px] font-extrabold text-[#1A1A1A] leading-tight">
                    {activeHeroDish?.name || 'Gourmet Dish'}
                  </p>
                  <p className="text-[10px] font-semibold text-[#558B2F]">
                    {activeHeroDish?.calories || '410 kcal'} {activeHeroDish ? `• $${Number(activeHeroDish.price).toFixed(2)}` : ''}
                  </p>
                </div>
              </div>

              {/* Interactive Customize Badge on Bottom of Bowl */}
              <button
                onClick={(e) =>
                  activeHeroDish &&
                  onCustomizeDish(
                    {
                      id: activeHeroDish.id,
                      name: activeHeroDish.name,
                      price: activeHeroDish.price,
                      image: activeHeroDish.image,
                      description: activeHeroDish.desc,
                      isDessert: false,
                      defaultAddons: ['Avocado Slices', 'Extra Cheese', 'Fried Egg', 'Garlic Herb Sauce']
                    },
                    e
                  )
                }
                className="absolute bottom-4 bg-white/95 backdrop-blur-xs text-[#1A1A1A] px-4 py-1.5 rounded-full shadow-lg text-xs font-bold flex items-center gap-1.5 hover:bg-[#8BC34A] hover:text-white transition"
              >
                <Sliders className="w-3.5 h-3.5" /> Customize {activeHeroDish ? `($${Number(activeHeroDish.price).toFixed(2)})` : ''}
              </button>
            </div>
          </div>

          {/* Orbiting Smaller Circular Thumbnails Along the Bottom Arc */}
          {heroDishes.slice(1).map((dish, idx) => {
            const angles = [134, 92, 50, 12, -35];
            const angleDeg = angles[idx] || 45;
            const angleRad = (angleDeg * Math.PI) / 180;
            const radius = 210;
            const x = Math.cos(angleRad) * radius;
            const y = Math.sin(angleRad) * radius;

            const isCurrent = activeHeroDish?.id === dish.id;

            return (
              <button
                key={dish.id}
                onClick={() => onSelectHeroDish(dish, x, y, angleDeg > 90 ? -22 : 22)}
                style={{
                  transform: `translate3d(${x}px, ${y}px, 0)`
                }}
                title={`Float "${dish.name}" into center showcase`}
                className={`absolute z-20 w-14 h-14 sm:w-16 sm:h-16 rounded-full p-1 bg-white shadow-xl transition-all duration-300 hover:scale-125 hover:z-30 cursor-pointer ${
                  isCurrent ? 'ring-4 ring-[#1A1A1A] scale-115' : 'ring-2 ring-[#8BC34A]'
                }`}
              >
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover rounded-full"
                />
                <span className="absolute -bottom-1 -right-1 bg-[#8BC34A] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow">
                  {idx + 1}
                </span>
              </button>
            );
          })}

          {/* Mobile Thumbnails Row Fallback */}
          <div className="lg:hidden flex flex-wrap justify-center gap-2.5 mt-8 w-full">
            {heroDishes.map((dish) => (
              <button
                key={`mobile-thumb-${dish.id}`}
                onClick={() => onSelectHeroDish(dish, 0, 80, 0)}
                className={`w-12 h-12 rounded-full p-0.5 bg-white shadow ${
                  activeHeroDish?.id === dish.id ? 'ring-3 ring-[#1A1A1A]' : 'ring-2 ring-[#8BC34A]'
                }`}
              >
                <img src={dish.image} alt={dish.name} className="w-full h-full object-cover rounded-full" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

