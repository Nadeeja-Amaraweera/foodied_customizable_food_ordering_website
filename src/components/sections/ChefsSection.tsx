import React from 'react';
import { Chef } from '../../types';

export interface ChefsSectionProps {
  chefs: Chef[];
}

export const ChefsSection: React.FC<ChefsSectionProps> = ({ chefs }) => {
  return (
    <section id="chefs" className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 py-16">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#1A1A1A] uppercase">
          SPECIAL CHEF&apos;S
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto mt-3 leading-relaxed">
          Our head chefs have years of culinary craft, working with organic farms to curate balanced, healthy menus.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {chefs.map((chef) => (
          <div
            key={chef.id}
            className={`rounded-[26px] bg-[#E5F0DA] overflow-hidden shadow-sm hover:shadow-md transition group ${
              chef.offset ? 'md:mt-10' : ''
            }`}
          >
            <div className="h-80 sm:h-96 w-full overflow-hidden relative">
              <img
                src={chef.image}
                alt={chef.name}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent p-5 text-white">
                <h3 className="font-bold text-lg">{chef.name}</h3>
                <p className="text-xs text-[#C5E1A5] font-medium">{chef.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

