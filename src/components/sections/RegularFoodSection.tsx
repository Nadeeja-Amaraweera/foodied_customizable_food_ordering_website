import React from 'react';
import { UtensilsCrossed } from 'lucide-react';
import { MenuItem } from '../../types';
import { DishCard } from '../cards/DishCard';

export interface RegularFoodSectionProps {
  regularItems: MenuItem[];
  categories?: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  selectedCardId: string | null;
  onCustomizeDish: (dish: MenuItem, e?: React.MouseEvent<HTMLElement>) => void;
  onFloatCardToHero?: (item: MenuItem, e: React.MouseEvent<HTMLElement>) => void;
  isLoading?: boolean;
}

const DEFAULT_CATEGORIES = [
  'All',
  'Burger',
  'Pizza',
  'Bowls & Salads',
  'Pasta',
  'Desserts',
  'Beverages',
];

export const RegularFoodSection: React.FC<RegularFoodSectionProps> = ({
  regularItems,
  categories = DEFAULT_CATEGORIES,
  activeCategory,
  onCategoryChange,
  selectedCardId,
  onCustomizeDish,
  onFloatCardToHero,
  isLoading = false,
}) => {
  return (
    <section id="regular-food" className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#1A1A1A] uppercase">
          OUR REGULAR FOOD
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto mt-3 leading-relaxed">
          Here is our regular food menu. All the items are very fresh and delicious. You can pick any category!
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap justify-center items-center gap-2.5 sm:gap-3 mb-24">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`px-5 py-2 rounded-full text-xs font-bold transition shadow-xs cursor-pointer ${
              activeCategory === cat
                ? 'bg-[#8BC34A] text-white shadow-md shadow-[#8BC34A]/30'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading Skeletons */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 gap-y-24">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-white rounded-[26px] p-6 pt-28 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100/80 flex flex-col items-center text-center relative animate-pulse"
            >
              {/* Protruding circular placeholder */}
              <div className="w-44 h-44 rounded-full p-2.5 bg-gray-200 absolute -top-20 left-1/2 -translate-x-1/2 shadow-md" />
              
              <div className="h-5 bg-gray-200 rounded-full w-3/4 mt-2" />
              <div className="h-3 bg-gray-100 rounded-full w-1/3 mt-2" />
              <div className="h-3 bg-gray-100 rounded-full w-full mt-3" />
              <div className="h-3 bg-gray-100 rounded-full w-4/5 mt-1.5 mb-6" />

              <div className="mt-auto w-full flex items-center justify-between gap-3 px-2">
                <div className="h-7 bg-gray-200 rounded-full w-16" />
                <div className="h-8 bg-gray-200 rounded-full w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : regularItems.length === 0 ? (
        /* Friendly Empty State */
        <div className="bg-white rounded-[26px] p-10 max-w-lg mx-auto text-center border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#F4F9EE] text-[#8BC34A] flex items-center justify-center mx-auto shadow-xs">
            <UtensilsCrossed className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-[#1A1A1A]">
              No Available Dishes Found
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 mt-1.5 leading-relaxed">
              {activeCategory !== 'All'
                ? `No dishes currently available in the "${activeCategory}" category. Try selecting another category or check back soon!`
                : 'Our chefs are currently preparing fresh delicious dishes. Please check back shortly!'}
            </p>
          </div>
          {activeCategory !== 'All' && (
            <button
              onClick={() => onCategoryChange('All')}
              className="px-6 py-2 rounded-full bg-[#8BC34A] hover:bg-[#7CB342] text-white text-xs font-bold transition shadow-sm cursor-pointer"
            >
              View All Dishes
            </button>
          )}
        </div>
      ) : (
        /* Regular Food Grid of Protruding Circular Cards */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 gap-y-24">
          {regularItems.map((item) => (
            <DishCard
              key={item.id}
              item={item}
              variant="regular"
              isSelected={selectedCardId === item.id}
              onCustomize={onCustomizeDish}
              onFloatToHero={onFloatCardToHero}
            />
          ))}
        </div>
      )}
    </section>
  );
};
