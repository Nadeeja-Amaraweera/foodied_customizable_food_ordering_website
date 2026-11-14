import React from 'react';
import { MenuItem } from '../../types';
import { DishCard } from '../cards/DishCard';

export interface FeaturedSectionProps {
  featuredItems: MenuItem[];
  selectedCardId: string | null;
  onCustomizeDish: (dish: MenuItem, e?: React.MouseEvent<HTMLElement>) => void;
  onFloatCardToHero?: (item: MenuItem, e: React.MouseEvent<HTMLElement>) => void;
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({
  featuredItems,
  selectedCardId,
  onCustomizeDish,
  onFloatCardToHero
}) => {
  return (
    <section id="special" className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {featuredItems.map((item) => (
          <DishCard
            key={item.id}
            item={item}
            variant="featured"
            isSelected={selectedCardId === item.id}
            onCustomize={onCustomizeDish}
            onFloatToHero={onFloatCardToHero}
          />
        ))}
      </div>
    </section>
  );
};

