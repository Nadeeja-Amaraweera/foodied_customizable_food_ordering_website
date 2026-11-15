import React from 'react';
import { Edit2, Trash2, Clock, Star, Flame, Layers, PlusCircle, Check } from 'lucide-react';
import { AdminProduct } from '../../data/adminMockData';
import { Badge } from './Badge';

interface ProductCardProps {
  product: AdminProduct;
  onEdit: (product: AdminProduct) => void;
  onDelete: (product: AdminProduct) => void;
  onToggleAvailability: (product: AdminProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
  onToggleAvailability,
}) => {
  return (
    <div
      className={`group relative bg-white rounded-2xl border transition-all duration-300 shadow-soft hover:shadow-soft-lg flex flex-col justify-between overflow-hidden ${
        product.isAvailable ? 'border-gray-200/90' : 'border-gray-200/60 opacity-80 bg-gray-50/50'
      }`}
    >
      {/* Product Image & Badges */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Category Pill */}
        <div className="absolute top-3 left-3">
          <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md text-gray-800 shadow-soft-sm">
            {product.category}
          </span>
        </div>

        {/* In-Stock / Availability Pill Toggle */}
        <button
          onClick={() => onToggleAvailability(product)}
          className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-lg backdrop-blur-md transition-all shadow-soft-sm flex items-center gap-1 ${
            product.isAvailable
              ? 'bg-emerald-500/90 text-white hover:bg-emerald-600'
              : 'bg-rose-500/90 text-white hover:bg-rose-600'
          }`}
          title="Toggle In Stock / Out of Stock"
        >
          <span className={`w-1.5 h-1.5 rounded-full ${product.isAvailable ? 'bg-white animate-pulse' : 'bg-gray-200'}`} />
          {product.isAvailable ? 'In Stock' : 'Unavailable'}
        </button>

        {/* Price Tag Floating bottom right */}
        <div className="absolute bottom-3 right-3">
          <span className="text-base font-black px-3 py-1 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white shadow-soft">
            ${product.price.toFixed(2)}
          </span>
        </div>

        {/* Rating & Prep Time floating bottom left */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs text-white/90 font-medium">
          <span className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            {product.rating}
          </span>
          <span className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md">
            <Clock className="w-3 h-3 text-white/80" />
            {product.preparationTime}
          </span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h5 className="font-bold text-gray-900 text-base leading-snug font-display line-clamp-1">
            {product.name}
          </h5>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Customization Capabilities summary */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-1.5 text-[11px] text-gray-600">
          {product.customization.sizes?.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-50 text-orange-800 font-medium border border-orange-100">
              <Layers className="w-3 h-3 text-orange-500" />
              {product.customization.sizes.length} Sizes
            </span>
          )}

          {product.customization.spiceLevels?.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 font-medium border border-rose-100">
              <Flame className="w-3 h-3 text-rose-500" />
              {product.customization.spiceLevels.length} Heat Levels
            </span>
          )}

          {product.customization.extras?.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 font-medium border border-teal-100">
              <PlusCircle className="w-3 h-3 text-teal-600" />
              {product.customization.extras.length} Extras
            </span>
          )}
        </div>
      </div>

      {/* Footer Controls: Edit & Delete */}
      <div className="px-4 py-3 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between">
        <span className="text-[11px] font-medium text-gray-400">
          ID: {product.id}
        </span>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onEdit(product)}
            className="p-1.5 text-gray-600 hover:text-primary hover:bg-orange-50 rounded-lg transition-colors border border-transparent hover:border-orange-200"
            title="Edit Product"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDelete(product)}
            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
            title="Delete Product"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

