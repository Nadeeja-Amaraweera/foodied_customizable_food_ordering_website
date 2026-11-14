import React from 'react';
import { MenuItem } from '../../types';
import { DishCard } from '../cards/DishCard';

export interface SpecialMenuSectionProps {
  specialItems: MenuItem[];
  specialPageDot: number;
  onDotChange: (dot: number) => void;
  selectedCardId: string | null;
  onCustomizeDish: (dish: MenuItem, e?: React.MouseEvent<HTMLElement>) => void;
  onFloatCardToHero?: (item: MenuItem, e: React.MouseEvent<HTMLElement>) => void;
}

export const SpecialMenuSection: React.FC<SpecialMenuSectionProps> = ({
  specialItems,
  specialPageDot,
  onDotChange,
  selectedCardId,
  onCustomizeDish,
  onFloatCardToHero
}) => {
  return (
    <section id="special-menu" className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 py-16">
      <div className="text-center mb-20">
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#1A1A1A] uppercase">
          SPECIAL MENU
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto mt-3 leading-relaxed">
          Some of our special food menu is given here. These are what people order more. If you want you can order from here.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-20">
        {specialItems.map((item) => (
          <DishCard
            key={item.id}
            item={item}
            variant="special"
            isSelected={selectedCardId === item.id}
            onCustomize={onCustomizeDish}
            onFloatToHero={onFloatCardToHero}
          />
        ))}
      </div>

      {/* 3 Pagination Indicator Dots */}
      <div className="flex justify-center items-center gap-2 mt-12">
        {[0, 1, 2].map((dot) => (
          <button
            key={dot}
            onClick={() => onDotChange(dot)}
            aria-label={`Page ${dot + 1}`}
            className={`rounded-full transition-all duration-300 cursor-pointer ${
              specialPageDot === dot
                ? 'w-7 h-2.5 bg-[#8BC34A]'
                : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

