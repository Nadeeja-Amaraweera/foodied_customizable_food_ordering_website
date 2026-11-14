import React from 'react';
import { Sparkles } from 'lucide-react';
import { MenuItem } from '../../types';
import { StarRating } from '../common/StarRating';

export interface DishCardProps {
  item: MenuItem;
  variant?: 'featured' | 'special' | 'regular';
  isSelected?: boolean;
  onCustomize: (item: MenuItem, e?: React.MouseEvent<HTMLElement>) => void;
  onFloatToHero?: (item: MenuItem, e: React.MouseEvent<HTMLElement>) => void;
}

export const DishCard: React.FC<DishCardProps> = ({
  item,
  variant = 'regular',
  isSelected = false,
  onCustomize,
  onFloatToHero
}) => {
  if (variant === 'featured') {
    return (
      <div className="bg-white rounded-[26px] p-5 pt-24 shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(139,195,74,0.18)] transition-all duration-300 flex flex-col items-center text-center relative border border-gray-100/80 group">
        {/* Protruding Circular Dish Photo with Green Ring & Floating Elevation */}
        <div
          onClick={(e) => onCustomize(item, e)}
          className={`w-36 h-36 rounded-full p-2 bg-[#8BC34A] shadow-lg absolute -top-16 left-1/2 -translate-x-1/2 cursor-pointer transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-105 group-hover:shadow-[0_20px_35px_rgba(139,195,74,0.4)] ${
            isSelected ? 'scale-110 -translate-y-4 ring-4 ring-[#1A1A1A]' : ''
          }`}
        >
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover rounded-full bg-white transition-transform duration-500 group-hover:rotate-6"
          />
          <button
            type="button"
            onClick={(e) => onFloatToHero?.(item, e)}
            title="Float this dish into the Hero Bowl"
            className="opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#1A1A1A] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 hover:bg-[#8BC34A]"
          >
            <Sparkles className="w-3 h-3" /> Float
          </button>
        </div>

        <h3 className="text-lg font-extrabold text-[#1A1A1A] mt-2">{item.name}</h3>

        <StarRating reviews={item.reviews} />

        <p className="text-xs text-gray-400 leading-relaxed mt-2.5 mb-5 px-1">
          {item.description}
        </p>

        {/* Price Pill + Buy Now / Customize Pill Button */}
        <div className="mt-auto w-full flex items-center justify-between gap-2 pt-2 border-t border-gray-100">
          <span className="px-3 py-1 rounded-full border border-gray-300 text-xs font-bold text-[#1A1A1A]">
            ${Number(item.price).toFixed(2)}
          </span>

          <button
            onClick={() => onCustomize(item)}
            className="px-4 py-1.5 rounded-full bg-[#8BC34A] hover:bg-[#7CB342] text-white text-xs font-semibold transition shadow-sm"
          >
            Buy Now
          </button>
        </div>
      </div>
    );
  }

  if (variant === 'special') {
    return (
      <div className="bg-white rounded-[26px] p-6 pt-28 shadow-[0_10px_35px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_40px_rgba(139,195,74,0.16)] transition relative border border-gray-100/80 group">
        {/* Offset Top-Right Circular Dish Image with Dark Leaf-Green Ring & Float Lift */}
        <div
          onClick={(e) => onCustomize(item, e)}
          className={`w-40 h-40 rounded-full p-2.5 bg-[#558B2F] shadow-xl absolute -top-14 right-5 cursor-pointer transition-all duration-500 group-hover:-translate-y-3 group-hover:scale-105 group-hover:shadow-[0_22px_38px_rgba(85,139,47,0.4)] ${
            isSelected ? 'scale-110 -translate-y-4 ring-4 ring-[#1A1A1A]' : ''
          }`}
        >
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover rounded-full bg-white transition-transform duration-500 group-hover:rotate-6"
          />
          <button
            type="button"
            onClick={(e) => onFloatToHero?.(item, e)}
            title="Float this dish into the Hero Bowl"
            className="opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#1A1A1A] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 hover:bg-[#8BC34A]"
          >
            <Sparkles className="w-3 h-3" /> Float to Hero
          </button>
        </div>

        <h3 className="text-xl font-extrabold text-[#1A1A1A] mt-2">{item.name}</h3>

        <StarRating reviews={item.reviews} className="flex items-center gap-1 mt-2" textSize="text-xs" />

        <p className="text-xs text-gray-400 leading-relaxed mt-3 mb-6">
          {item.description}
        </p>

        {/* Price Pill + Buy Now / Customize Pill Button */}
        <div className="mt-auto w-full flex items-center justify-between gap-3 pt-3 border-t border-gray-100">
          <span className="px-4 py-1.5 rounded-full border border-gray-400 text-xs font-bold text-[#1A1A1A]">
            ${Number(item.price).toFixed(2)}
          </span>

          <button
            onClick={() => onCustomize(item)}
            className="px-5 py-2 rounded-full bg-[#8BC34A] hover:bg-[#7CB342] text-white text-xs font-semibold transition shadow-sm"
          >
            Buy Now
          </button>
        </div>
      </div>
    );
  }

  // Regular Variant (Default)
  return (
    <div className="bg-white rounded-[26px] p-6 pt-28 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(139,195,74,0.18)] transition-all duration-300 flex flex-col items-center text-center relative border border-gray-100/80 group">
      {/* Protruding Circular Dish Photo with Green Ring & Floating Elevation */}
      <div
        onClick={(e) => onCustomize(item, e)}
        className={`w-44 h-44 rounded-full p-2.5 bg-[#8BC34A] shadow-xl absolute -top-20 left-1/2 -translate-x-1/2 cursor-pointer transition-all duration-500 group-hover:-translate-y-3 group-hover:scale-105 group-hover:shadow-[0_22px_38px_rgba(85,139,47,0.4)] ${
          isSelected ? 'scale-110 -translate-y-4 ring-4 ring-[#1A1A1A]' : ''
        }`}
      >
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover rounded-full bg-white transition-transform duration-500 group-hover:rotate-6"
        />
        <button
          type="button"
          onClick={(e) => onFloatToHero?.(item, e)}
          title="Float this dish into the Hero Bowl"
          className="opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#1A1A1A] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 hover:bg-[#8BC34A]"
        >
          <Sparkles className="w-3 h-3" /> Float to Hero
        </button>
      </div>

      <h3 className="text-xl font-extrabold text-[#1A1A1A] mt-2">{item.name}</h3>

      <StarRating
        reviews={item.reviews}
        className="flex items-center justify-center gap-1 mt-2"
        textSize="text-xs"
      />

      <p className="text-xs text-gray-400 leading-relaxed mt-3 mb-6 px-2">
        {item.description}
      </p>

      {/* Price Pill + Buy Now / Customize Pill Button */}
      <div className="mt-auto w-full flex items-center justify-between gap-3 px-2">
        <span className="px-5 py-1.5 rounded-full border border-gray-500 text-xs font-bold text-[#1A1A1A]">
          ${Number(item.price).toFixed(2)}
        </span>

        <button
          onClick={() => onCustomize(item)}
          className="px-6 py-2 rounded-full bg-[#8BC34A] hover:bg-[#7CB342] text-white text-xs font-bold transition shadow-sm"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

