import React from 'react';
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
}

const DEFAULT_CATEGORIES = [
  'All',
  'Burgers',
  'Pizza',
  'Salads',
  'Rice Bowls',
  'Curry',
  'Pasta',
  'Chicken',
  'Desserts'
];

export const RegularFoodSection: React.FC<RegularFoodSectionProps> = ({
  regularItems,
  categories = DEFAULT_CATEGORIES,
  activeCategory,
  onCategoryChange,
  selectedCardId,
  onCustomizeDish,
  onFloatCardToHero
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

      {/* Category Filter Pills Matching Template */}
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

      {/* 6 Protruding Circle Dish Cards in 3-column / 4-column Grid */}
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
    </section>
  );
};

