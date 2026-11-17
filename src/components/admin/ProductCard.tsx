import React, { useState } from 'react';
import { Edit2, Trash2, Clock, Star, Flame, Layers, PlusCircle } from 'lucide-react';
import { AdminProduct } from '../../data/adminMockData';

interface ProductCardProps {
  product: AdminProduct;
  onEdit: (product: AdminProduct) => void;
  onDelete: (product: AdminProduct) => void;
  onToggleAvailability: (product: AdminProduct) => void;
  isUpdatingAvailability?: boolean;
}

const FALLBACK_FOOD_IMAGE =
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
  onToggleAvailability,
  isUpdatingAvailability = false,
}) => {
  const [imgSrc, setImgSrc] = useState(product.image || FALLBACK_FOOD_IMAGE);

  const productId = product._id || product.id || '';
  const isAvailable = product.isAvailable;

  const sizesCount = product.customization?.sizes?.length || 0;
  const extrasCount = product.customization?.extras?.length || 0;
  const spiceCount = product.customization?.spiceLevels?.length || 0;

  return (
    <div
      className={`group relative bg-white rounded-2xl border transition-all duration-300 shadow-soft hover:shadow-soft-lg flex flex-col justify-between overflow-hidden ${
        isAvailable
          ? 'border-gray-200/90'
          : 'border-gray-200/70 bg-gray-50/70'
      }`}
    >
      {/* Top Image Banner */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <img
          src={imgSrc}
          alt={product.name}
          onError={() => setImgSrc(FALLBACK_FOOD_IMAGE)}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            !isAvailable ? 'grayscale-[35%] opacity-80' : ''
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Category Badge top-left */}
        <div className="absolute top-3 left-3">
          <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md text-gray-800 shadow-soft-sm">
            {product.category}
          </span>
        </div>

        {/* In-Stock / Availability Toggle Button top-right */}
        <button
          onClick={() => onToggleAvailability(product)}
          disabled={isUpdatingAvailability}
          className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-lg backdrop-blur-md transition-all shadow-soft-sm flex items-center gap-1.5 select-none active:scale-95 disabled:opacity-50 ${
            isAvailable
              ? 'bg-emerald-500/90 text-white hover:bg-emerald-600'
              : 'bg-rose-500/90 text-white hover:bg-rose-600'
          }`}
          title="Click to toggle availability"
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isAvailable ? 'bg-white animate-pulse' : 'bg-white/80'
            }`}
          />
          <span>{isAvailable ? 'In Stock' : 'Sold Out'}</span>
        </button>

        {/* Price Tag Floating bottom-right */}
        <div className="absolute bottom-3 right-3">
          <span className="text-base font-black px-3 py-1 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white shadow-soft">
            ${Number(product.price).toFixed(2)}
          </span>
        </div>

        {/* Rating & Prep Time floating bottom-left */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs text-white/95 font-medium">
          {product.rating !== undefined && product.rating > 0 && (
            <span className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              {product.rating.toFixed(1)}
            </span>
          )}
          {product.preparationTime && (
            <span className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md">
              <Clock className="w-3 h-3 text-white/80" />
              {product.preparationTime}
            </span>
          )}
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="font-bold text-gray-900 text-base leading-snug font-display line-clamp-1">
            {product.name}
          </h4>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Customization Badges */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-1.5 text-[11px] text-gray-600">
          {sizesCount > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-50 text-orange-800 font-medium border border-orange-100">
              <Layers className="w-3 h-3 text-orange-500" />
              {sizesCount} {sizesCount === 1 ? 'Size' : 'Sizes'}
            </span>
          )}

          {spiceCount > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 font-medium border border-rose-100">
              <Flame className="w-3 h-3 text-rose-500" />
              {spiceCount} {spiceCount === 1 ? 'Heat Level' : 'Heat Levels'}
            </span>
          )}

          {extrasCount > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 font-medium border border-teal-100">
              <PlusCircle className="w-3 h-3 text-teal-600" />
              {extrasCount} {extrasCount === 1 ? 'Extra' : 'Extras'}
            </span>
          )}

          {sizesCount === 0 && spiceCount === 0 && extrasCount === 0 && (
            <span className="text-[11px] text-gray-400 italic">
              Standard portion (no extras)
            </span>
          )}
        </div>
      </div>

      {/* Footer Controls: Edit & Delete */}
      <div className="px-4 py-3 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between">
        <span className="text-[11px] font-mono text-gray-400 truncate max-w-[140px]" title={productId}>
          #{productId.slice(-6)}
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
