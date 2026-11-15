import React, { useState, useEffect } from 'react';
import {
  UploadCloud,
  X,
  Plus,
  Trash2,
  Flame,
  Layers,
  Image as ImageIcon,
  Check,
  AlertCircle
} from 'lucide-react';
import { AdminProduct, CustomizationOption } from '../../data/adminMockData';
import { Modal } from './Modal';
import { Button } from './Button';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Omit<AdminProduct, 'id' | 'createdAt' | 'rating'>, editId?: string) => void;
  initialProduct?: AdminProduct | null;
}

const CATEGORIES: AdminProduct['category'][] = [
  'Burger',
  'Pizza',
  'Bowls & Salads',
  'Pasta',
  'Desserts',
  'Beverages',
];

const PRESET_FOOD_IMAGES = [
  { label: 'Gourmet Burger', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80' },
  { label: 'Artisan Pizza', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80' },
  { label: 'Fresh Poké Bowl', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80' },
  { label: 'Italian Pasta', url: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281051?auto=format&fit=crop&w=600&q=80' },
  { label: 'Chocolate Dessert', url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80' },
  { label: 'Craft Beverage', url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80' },
];

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProduct,
}) => {
  const isEditing = !!initialProduct;

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<AdminProduct['category']>('Burger');
  const [price, setPrice] = useState<number | ''>(12.90);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [preparationTime, setPreparationTime] = useState('15-20 min');
  const [isAvailable, setIsAvailable] = useState(true);

  // Customization Options
  const [sizes, setSizes] = useState<CustomizationOption[]>([]);
  const [extras, setExtras] = useState<CustomizationOption[]>([]);
  const [spiceLevels, setSpiceLevels] = useState<string[]>([]);

  // New item inputs
  const [newSizeName, setNewSizeName] = useState('');
  const [newSizePrice, setNewSizePrice] = useState<number | ''>(0);
  const [newExtraName, setNewExtraName] = useState('');
  const [newExtraPrice, setNewExtraPrice] = useState<number | ''>(1.50);
  const [newSpiceLevel, setNewSpiceLevel] = useState('');

  // Drag & drop state
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (initialProduct) {
      setName(initialProduct.name);
      setCategory(initialProduct.category);
      setPrice(initialProduct.price);
      setDescription(initialProduct.description);
      setImage(initialProduct.image);
      setPreparationTime(initialProduct.preparationTime);
      setIsAvailable(initialProduct.isAvailable);
      setSizes(initialProduct.customization.sizes || []);
      setExtras(initialProduct.customization.extras || []);
      setSpiceLevels(initialProduct.customization.spiceLevels || []);
    } else {
      // Defaults for new product
      setName('');
      setCategory('Burger');
      setPrice(13.50);
      setDescription('');
      setImage(PRESET_FOOD_IMAGES[0].url);
      setPreparationTime('15-20 min');
      setIsAvailable(true);
      setSizes([
        { name: 'Standard / Regular', priceModifier: 0 },
        { name: 'Large Upgrade', priceModifier: 3.50 },
      ]);
      setExtras([
        { name: 'Extra Cheddar Cheese', priceModifier: 1.50 },
        { name: 'Crispy Smoked Bacon', priceModifier: 2.00 },
      ]);
      setSpiceLevels(['No Spice', 'Medium 🌶️', 'Hot Flame 🔥']);
    }
  }, [initialProduct, isOpen]);

  const handleAddSize = () => {
    if (!newSizeName.trim()) return;
    setSizes((prev) => [...prev, { name: newSizeName.trim(), priceModifier: Number(newSizePrice) || 0 }]);
    setNewSizeName('');
    setNewSizePrice(0);
  };

  const handleRemoveSize = (index: number) => {
    setSizes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddExtra = () => {
    if (!newExtraName.trim()) return;
    setExtras((prev) => [...prev, { name: newExtraName.trim(), priceModifier: Number(newExtraPrice) || 0 }]);
    setNewExtraName('');
    setNewExtraPrice(1.50);
  };

  const handleRemoveExtra = (index: number) => {
    setExtras((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddSpice = () => {
    if (!newSpiceLevel.trim()) return;
    setSpiceLevels((prev) => [...prev, newSpiceLevel.trim()]);
    setNewSpiceLevel('');
  };

  const handleRemoveSpice = (index: number) => {
    setSpiceLevels((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Simulation: assign one of high-res presets or read data URL if file
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setImage(uploadEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave(
      {
        name: name.trim(),
        category,
        price: Number(price) || 0,
        description: description.trim(),
        image: image || PRESET_FOOD_IMAGES[0].url,
        preparationTime,
        isAvailable,
        customization: {
          sizes,
          extras,
          spiceLevels,
        },
      },
      initialProduct?.id
    );

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="3xl"
      title={isEditing ? 'Edit Customizable Product' : 'Add New Customizable Product'}
      subtitle={
        isEditing
          ? `Update details and customization options for ${initialProduct?.name}`
          : 'Define product details, category, pricing, and customer customization options'
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Product Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Signature Truffle Angus Burger"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as AdminProduct['category'])}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Base Price ($ USD) *
            </label>
            <input
              type="number"
              step="0.01"
              required
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
              placeholder="0.00"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Est. Preparation Time
            </label>
            <input
              type="text"
              value={preparationTime}
              onChange={(e) => setPreparationTime(e.target.value)}
              placeholder="e.g. 15-20 min"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
            Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write an appetizing description of the dish and ingredients..."
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
          />
        </div>

        {/* Image Upload Area with Drag & Drop and Preview */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
            Product Image (Upload or Pick Preset)
          </label>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Drag & Drop Box */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleFileDrop}
              className={`md:col-span-2 border-2 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center text-center transition-all ${
                isDragging
                  ? 'border-primary bg-orange-50/60 scale-[1.01]'
                  : 'border-gray-300 hover:border-primary/60 bg-gray-50/50'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-primary mb-2 shadow-xs">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-gray-800">
                Drag and drop your food photo here
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Supports JPG, PNG, WEBP up to 5MB (Simulated upload)
              </p>

              <label className="mt-3 cursor-pointer inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 shadow-xs">
                Browse Files
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const reader = new FileReader();
                      reader.onload = (ev) => setImage(ev.target?.result as string);
                      reader.readAsDataURL(e.target.files[0]);
                    }
                  }}
                />
              </label>
            </div>

            {/* Live Preview & Presets */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-gray-500">Live Preview:</span>
              <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-200 bg-gray-100 shadow-xs">
                {image ? (
                  <img src={image} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}
              </div>

              {/* Quick Preset Selector */}
              <div className="mt-1">
                <span className="text-[11px] font-medium text-gray-400 block mb-1">
                  Or pick a demo image:
                </span>
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {PRESET_FOOD_IMAGES.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setImage(p.url)}
                      className={`relative w-8 h-8 rounded-lg overflow-hidden border shrink-0 ${
                        image === p.url ? 'ring-2 ring-primary border-transparent' : 'border-gray-200'
                      }`}
                      title={p.label}
                    >
                      <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customization Options Section */}
        <div className="pt-4 border-t border-gray-100 space-y-5">
          <h5 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            Customer Customization Matrix
          </h5>

          {/* 1. Sizes & Portions */}
          <div className="p-4 rounded-xl bg-gray-50/70 border border-gray-100 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
              1. Sizes & Price Modifiers
            </span>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-800 shadow-xs"
                >
                  <span>{s.name}</span>
                  <span className="text-primary font-bold">
                    {s.priceModifier > 0 ? `+$${s.priceModifier.toFixed(2)}` : 'Base ($0)'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSize(idx)}
                    className="text-gray-400 hover:text-rose-500"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="Size name (e.g. Large 14 inch)"
                value={newSizeName}
                onChange={(e) => setNewSizeName(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs outline-none focus:border-primary"
              />
              <input
                type="number"
                step="0.5"
                placeholder="+$ Price"
                value={newSizePrice}
                onChange={(e) => setNewSizePrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
                className="w-24 px-3 py-1.5 rounded-lg border border-gray-200 text-xs outline-none focus:border-primary"
              />
              <Button type="button" variant="outline" size="sm" onClick={handleAddSize} leftIcon={<Plus className="w-3 h-3" />}>
                Add
              </Button>
            </div>
          </div>

          {/* 2. Extras & Add-ons */}
          <div className="p-4 rounded-xl bg-gray-50/70 border border-gray-100 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
              2. Extra Add-ons & Toppings
            </span>
            <div className="flex flex-wrap gap-2">
              {extras.map((ex, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-800 shadow-xs"
                >
                  <span>{ex.name}</span>
                  <span className="text-teal-600 font-bold">+${ex.priceModifier.toFixed(2)}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveExtra(idx)}
                    className="text-gray-400 hover:text-rose-500"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="Extra name (e.g. Truffle Aioli)"
                value={newExtraName}
                onChange={(e) => setNewExtraName(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs outline-none focus:border-primary"
              />
              <input
                type="number"
                step="0.5"
                placeholder="+$ Price"
                value={newExtraPrice}
                onChange={(e) => setNewExtraPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
                className="w-24 px-3 py-1.5 rounded-lg border border-gray-200 text-xs outline-none focus:border-primary"
              />
              <Button type="button" variant="outline" size="sm" onClick={handleAddExtra} leftIcon={<Plus className="w-3 h-3" />}>
                Add
              </Button>
            </div>
          </div>

          {/* 3. Heat & Spice Levels */}
          <div className="p-4 rounded-xl bg-gray-50/70 border border-gray-100 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-700 block flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-rose-500" />
              3. Spice / Heat Options
            </span>
            <div className="flex flex-wrap gap-2">
              {spiceLevels.map((sp, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 shadow-xs"
                >
                  <span>{sp}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSpice(idx)}
                    className="text-rose-400 hover:text-rose-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="Spice level name (e.g. Extra Fiery 🌶️🔥)"
                value={newSpiceLevel}
                onChange={(e) => setNewSpiceLevel(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs outline-none focus:border-primary"
              />
              <Button type="button" variant="outline" size="sm" onClick={handleAddSpice} leftIcon={<Plus className="w-3 h-3" />}>
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* In-Stock Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-orange-50/40 border border-orange-100">
          <div>
            <h6 className="text-sm font-bold text-gray-900">In-Stock Availability</h6>
            <p className="text-xs text-gray-500">
              When disabled, customers will see this product as Sold Out.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>

        {/* Modal Action Buttons */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="gradient" className="font-bold px-6">
            {isEditing ? 'Save Changes' : 'Create Product'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

