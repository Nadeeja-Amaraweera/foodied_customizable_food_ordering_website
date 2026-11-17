import React, { useMemo } from 'react';
import { X, Flame, Check, Minus, Plus } from 'lucide-react';
import { MenuItem } from '../../types';

export interface MealCustomizerModalProps {
  item: MenuItem | null;
  portionSize: string;
  onPortionSizeChange: (size: string) => void;
  spiceLevel: string;
  onSpiceLevelChange: (level: string) => void;
  selectedAddons: string[];
  onToggleAddon: (addon: string) => void;
  dietaryTags: string[];
  onToggleDietaryTag: (tag: string) => void;
  specialNotes: string;
  onSpecialNotesChange: (notes: string) => void;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  unitPrice: number;
  onAddToCart: () => void;
  onClose: () => void;
}

export const MealCustomizerModal: React.FC<MealCustomizerModalProps> = ({
  item,
  portionSize,
  onPortionSizeChange,
  spiceLevel,
  onSpiceLevelChange,
  selectedAddons,
  onToggleAddon,
  dietaryTags,
  onToggleDietaryTag,
  specialNotes,
  onSpecialNotesChange,
  quantity,
  onQuantityChange,
  unitPrice,
  onAddToCart,
  onClose,
}) => {
  if (!item) return null;

  // Available portion sizes from DB or standard fallbacks
  const sizesList = useMemo(() => {
    if (item.customization?.sizes && item.customization.sizes.length > 0) {
      return item.customization.sizes;
    }
    return [
      { name: 'Regular', priceModifier: 0 },
      { name: 'Large', priceModifier: 3.0 },
      { name: 'Family', priceModifier: 6.0 },
    ];
  }, [item.customization?.sizes]);

  // Available extras / add-on toppings from DB
  const extrasList = useMemo(() => {
    if (item.customization?.extras && item.customization.extras.length > 0) {
      return item.customization.extras;
    }
    if (item.defaultAddons && item.defaultAddons.length > 0) {
      return item.defaultAddons.map((addon) => {
        const match = addon.match(/^(.+?)\s*\(\+\$([\d.]+)\)$/);
        if (match) {
          return { name: match[1].trim(), priceModifier: parseFloat(match[2]) };
        }
        return { name: addon, priceModifier: 0 };
      });
    }
    return [
      { name: 'Extra Cheddar Cheese', priceModifier: 1.5 },
      { name: 'Crispy Bacon', priceModifier: 2.0 },
      { name: 'Garlic Aioli', priceModifier: 0.8 },
    ];
  }, [item.customization?.extras, item.defaultAddons]);

  // Available spice levels
  const spiceList = useMemo(() => {
    if (item.customization?.spiceLevels && item.customization.spiceLevels.length > 0) {
      return item.customization.spiceLevels;
    }
    return item.isDessert
      ? ['Light Sweet', 'Regular Sweet', 'Extra Rich', 'Sugar-Free']
      : ['Mild', 'Medium', 'Spicy', 'Extra Hot'];
  }, [item.customization?.spiceLevels, item.isDessert]);

  const totalPrice = Number((unitPrice * quantity).toFixed(2));

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Dish Banner with Zero-Gravity Dish Animation */}
        <div className="relative h-48 bg-[#E8F3DC] flex items-center justify-center p-6 overflow-hidden">
          <div className="animate-zero-gravity">
            <img
              key={item.id}
              src={item.image}
              alt={item.name}
              className="w-36 h-36 rounded-full object-cover ring-4 ring-[#8BC34A] shadow-2xl animate-modal-dish-float"
            />
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-800 flex items-center justify-center shadow cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="absolute bottom-3 left-5 bg-[#8BC34A] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow">
            Customize Your Meal
          </span>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-5">
          {/* Header Title + Dynamic Total Unit Price */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl font-black text-[#1A1A1A]">{item.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{item.description}</p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                Current Unit Price
              </span>
              <span className="text-2xl font-black text-[#7CB342]">
                ${unitPrice.toFixed(2)}
              </span>
              <span className="text-[11px] text-gray-400 block mt-0.5">
                (Base: ${Number(item.price).toFixed(2)})
              </span>
            </div>
          </div>

          {/* 1. Portion Size Selector with Dynamic Additional Prices */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700">
                1. Select Portion Size
              </label>
              <span className="text-[10px] font-medium text-gray-400">
                Updates price dynamically
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {sizesList.map((sizeObj) => {
                const isSelected = portionSize.toLowerCase() === sizeObj.name.toLowerCase();
                return (
                  <button
                    key={sizeObj.name}
                    type="button"
                    onClick={() => onPortionSizeChange(sizeObj.name)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition flex flex-col items-center cursor-pointer ${
                      isSelected
                        ? 'border-[#8BC34A] bg-[#F4F9EE] text-[#558B2F] ring-2 ring-[#8BC34A]/30 shadow-xs'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <span>{sizeObj.name}</span>
                    <span
                      className={`text-[11px] mt-0.5 font-bold ${
                        sizeObj.priceModifier > 0 ? 'text-[#558B2F]' : 'text-gray-400 font-normal'
                      }`}
                    >
                      {sizeObj.priceModifier > 0
                        ? `+$${Number(sizeObj.priceModifier).toFixed(2)}`
                        : 'Standard (+0.00)'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Spice / Sweetness Level */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-2 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              2. {item.isDessert ? 'Sweetness Level' : 'Spice & Seasoning Level'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {spiceList.map((level) => {
                const isSelected = spiceLevel.toLowerCase() === level.toLowerCase();
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => onSpiceLevelChange(level)}
                    className={`py-2 px-2 rounded-xl border text-xs font-semibold transition cursor-pointer text-center ${
                      isSelected
                        ? 'bg-[#8BC34A] text-white border-[#8BC34A] shadow-xs'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Custom Add-On Toppings & Extras with Real-Time Price Additions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700">
                3. Customize Add-On Toppings &amp; Extras
              </label>
              <span className="text-[10px] text-gray-400 font-medium">
                Priced per item
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {extrasList.map((extraObj) => {
                const isChecked = selectedAddons.some(
                  (a) => a.toLowerCase() === extraObj.name.toLowerCase()
                );
                return (
                  <button
                    key={extraObj.name}
                    type="button"
                    onClick={() => onToggleAddon(extraObj.name)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-left text-xs transition cursor-pointer ${
                      isChecked
                        ? 'border-[#8BC34A] bg-[#F4F9EE] font-semibold text-[#1A1A1A] shadow-xs'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center transition ${
                          isChecked ? 'bg-[#8BC34A] text-white' : 'border border-gray-300'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>
                      <span>{extraObj.name}</span>
                    </div>
                    <span className="text-[11px] font-bold text-[#558B2F] shrink-0 ml-2">
                      {extraObj.priceModifier > 0
                        ? `+$${Number(extraObj.priceModifier).toFixed(2)}`
                        : 'Free'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Dietary & Ingredient Preferences */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-2">
              4. Ingredient Tweaks
            </label>
            <div className="flex flex-wrap gap-2">
              {['No Onions', 'Low Sodium', 'Sauce on Side', 'Gluten-Free Prep', 'Extra Fresh Herbs'].map(
                (tag) => {
                  const active = dietaryTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => onToggleDietaryTag(tag)}
                      className={`px-3 py-1 rounded-full text-xs border transition cursor-pointer ${
                        active
                          ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {active ? `✓ ${tag}` : tag}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* 5. Special Kitchen Note */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-1.5">
              Special Kitchen Instructions
            </label>
            <input
              type="text"
              value={specialNotes}
              onChange={(e) => onSpecialNotesChange(e.target.value)}
              placeholder="e.g., Extra crispy, pack cutlery, allergy note..."
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#8BC34A]"
            />
          </div>
        </div>

        {/* Bottom Sticky Bar: Quantity + Add to Order CTA */}
        <div className="p-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-4">
          {/* Quantity Counter */}
          <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-full px-3 py-1.5">
            <button
              type="button"
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-sm font-bold w-4 text-center">{quantity}</span>
            <button
              type="button"
              onClick={() => onQuantityChange(quantity + 1)}
              className="w-6 h-6 rounded-full bg-[#8BC34A] text-white flex items-center justify-center cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add Customized Item Button with Dynamic Live Price */}
          <button
            type="button"
            onClick={onAddToCart}
            className="flex-1 py-3 px-6 rounded-full bg-[#8BC34A] hover:bg-[#7CB342] text-white font-bold text-sm shadow-lg transition flex items-center justify-between cursor-pointer"
          >
            <span>Add Customized Meal</span>
            <span className="bg-white/20 px-3 py-0.5 rounded-full font-black">
              ${totalPrice.toFixed(2)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MealCustomizerModal;
