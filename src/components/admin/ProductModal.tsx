import React, { useState, useEffect, useRef } from 'react';
import {
  UploadCloud,
  X,
  Plus,
  Trash2,
  Flame,
  Layers,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Loader2,
  Clock,
  Sparkles
} from 'lucide-react';
import { AdminProduct, CustomizationOption } from '../../data/adminMockData';
import { Modal } from './Modal';
import { Button } from './Button';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: FormData, editId?: string) => Promise<void>;
  initialProduct?: AdminProduct | null;
}

const CATEGORIES = [
  'Burger',
  'Pizza',
  'Bowls & Salads',
  'Pasta',
  'Desserts',
  'Beverages',
] as const;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg'];

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProduct,
}) => {
  const isEditing = !!initialProduct;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<string>('Burger');
  const [price, setPrice] = useState<number | ''>(12.90);
  const [description, setDescription] = useState('');
  const [preparationTime, setPreparationTime] = useState('15-20 min');
  const [isAvailable, setIsAvailable] = useState(true);

  // Image State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  // Customization Options
  const [sizes, setSizes] = useState<CustomizationOption[]>([]);
  const [extras, setExtras] = useState<CustomizationOption[]>([]);
  const [spiceLevels, setSpiceLevels] = useState<string[]>([]);

  // Sub-item temporary inputs
  const [newSizeName, setNewSizeName] = useState('');
  const [newSizePrice, setNewSizePrice] = useState<number | ''>(0);
  const [newExtraName, setNewExtraName] = useState('');
  const [newExtraPrice, setNewExtraPrice] = useState<number | ''>(1.50);
  const [newSpiceLevel, setNewSpiceLevel] = useState('');

  // UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate or reset form whenever modal opens or initialProduct changes
  useEffect(() => {
    if (initialProduct) {
      setName(initialProduct.name || '');
      setCategory(initialProduct.category || 'Burger');
      setPrice(initialProduct.price ?? 12.90);
      setDescription(initialProduct.description || '');
      setPreparationTime(initialProduct.preparationTime || '15-20 min');
      setIsAvailable(initialProduct.isAvailable ?? true);
      setPreviewUrl(initialProduct.image || '');
      setImageFile(null);
      setSizes(initialProduct.customization?.sizes || []);
      setExtras(initialProduct.customization?.extras || []);
      setSpiceLevels(initialProduct.customization?.spiceLevels || []);
    } else {
      // New product defaults
      setName('');
      setCategory('Burger');
      setPrice(13.50);
      setDescription('');
      setPreparationTime('15-20 min');
      setIsAvailable(true);
      setPreviewUrl('');
      setImageFile(null);
      setSizes([
        { name: 'Regular / Single', priceModifier: 0 },
        { name: 'Large Upgrade', priceModifier: 3.50 },
      ]);
      setExtras([
        { name: 'Extra Cheddar Cheese', priceModifier: 1.50 },
        { name: 'Smoked Crispy Bacon', priceModifier: 2.00 },
      ]);
      setSpiceLevels(['No Spice', 'Medium 🌶️', 'Hot Flame 🔥']);
    }
    setErrors({});
    setIsSubmitting(false);
  }, [initialProduct, isOpen]);

  // Clean up blob preview URL
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Invalid file format. Please upload JPG, PNG, WEBP, or GIF.';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size exceeds 5MB limit. Please choose a smaller image.';
    }
    return null;
  };

  const handleFileSelect = (file: File) => {
    const errorMsg = validateFile(file);
    if (errorMsg) {
      setErrors((prev) => ({ ...prev, image: errorMsg }));
      return;
    }

    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.image;
      return copy;
    });

    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setImageFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddSize = () => {
    if (!newSizeName.trim()) return;
    setSizes((prev) => [
      ...prev,
      {
        name: newSizeName.trim(),
        priceModifier: Math.max(0, Number(newSizePrice) || 0),
      },
    ]);
    setNewSizeName('');
    setNewSizePrice(0);
  };

  const handleRemoveSize = (index: number) => {
    setSizes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddExtra = () => {
    if (!newExtraName.trim()) return;
    setExtras((prev) => [
      ...prev,
      {
        name: newExtraName.trim(),
        priceModifier: Math.max(0, Number(newExtraPrice) || 0),
      },
    ]);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Field Validations
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (price === '' || isNaN(Number(price)) || Number(price) < 0) {
      newErrors.price = 'Please enter a valid non-negative price';
    }

    if (!description.trim()) {
      newErrors.description = 'Product description is required';
    }

    if (!preparationTime.trim()) {
      newErrors.preparationTime = 'Preparation time is required';
    }

    if (!isEditing && !imageFile) {
      newErrors.image = 'Product image is required';
    } else if (isEditing && !imageFile && !previewUrl) {
      newErrors.image = 'Product image is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('category', category);
      formData.append('price', String(price));
      formData.append('description', description.trim());
      formData.append('preparationTime', preparationTime.trim());
      formData.append('isAvailable', String(isAvailable));

      formData.append(
        'customization',
        JSON.stringify({
          sizes,
          extras,
          spiceLevels,
        })
      );

      if (imageFile) {
        formData.append('image', imageFile);
      }

      const editId = initialProduct?._id || initialProduct?.id;
      await onSave(formData, editId);
      // Only close on successful response
      onClose();
    } catch (err: any) {
      // Keep modal open so the user can fix the issue
      console.error('[ProductModal] Save failed:', err);
      const serverMsg = err.response?.data?.message || err.message || 'Failed to save product';
      setErrors((prev) => ({ ...prev, form: serverMsg }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!isSubmitting) onClose();
      }}
      maxWidth="3xl"
      title={isEditing ? 'Edit Customizable Product' : 'Add New Customizable Product'}
      subtitle={
        isEditing
          ? `Update details, pricing, and customization matrix for "${initialProduct?.name}"`
          : 'Create a new dish with portion sizes, add-ons, spice levels, and appetizing photo'
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Top Server Error Banner if any */}
        {errors.form && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <div>
              <p className="font-bold">Error saving product:</p>
              <p>{errors.form}</p>
            </div>
          </div>
        )}

        {/* Section 1: Basic Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-1 border-b border-gray-100">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
              1. Basic Information
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Product Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                }}
                placeholder="e.g. Signature Truffle Wagyu Burger"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                  errors.name
                    ? 'border-rose-300 ring-2 ring-rose-100 bg-rose-50/20'
                    : 'border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20'
                }`}
              />
              {errors.name && (
                <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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
                min="0"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value === '' ? '' : parseFloat(e.target.value));
                  if (errors.price) setErrors((prev) => ({ ...prev, price: '' }));
                }}
                placeholder="0.00"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                  errors.price
                    ? 'border-rose-300 ring-2 ring-rose-100 bg-rose-50/20'
                    : 'border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20'
                }`}
              />
              {errors.price && (
                <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.price}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                Est. Preparation Time *
              </label>
              <input
                type="text"
                value={preparationTime}
                onChange={(e) => {
                  setPreparationTime(e.target.value);
                  if (errors.preparationTime) setErrors((prev) => ({ ...prev, preparationTime: '' }));
                }}
                placeholder="e.g. 15-20 min"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                  errors.preparationTime
                    ? 'border-rose-300 ring-2 ring-rose-100 bg-rose-50/20'
                    : 'border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20'
                }`}
              />
              {errors.preparationTime && (
                <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.preparationTime}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Description *
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
              }}
              placeholder="Appetizing description highlighting artisanal ingredients, flavors, and allergens..."
              className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all resize-none ${
                errors.description
                  ? 'border-rose-300 ring-2 ring-rose-100 bg-rose-50/20'
                  : 'border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20'
              }`}
            />
            {errors.description && (
              <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.description}
              </p>
            )}
          </div>
        </div>

        {/* Section 2: Product Image Upload */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between pb-1 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                2. Product Image *
              </h4>
            </div>
            <span className="text-[11px] text-gray-400">JPG, PNG, WEBP, GIF (Max 5MB)</span>
          </div>

          {previewUrl ? (
            <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 p-3 flex flex-col sm:flex-row items-center gap-4">
              <div className="w-36 h-28 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200 shadow-xs">
                <img
                  src={previewUrl}
                  alt="Product preview"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0 text-center sm:text-left space-y-1">
                <p className="text-xs font-bold text-gray-900 truncate">
                  {imageFile ? imageFile.name : 'Current Image Saved'}
                </p>
                {imageFile && (
                  <p className="text-[11px] text-gray-400">
                    {(imageFile.size / 1024 / 1024).toFixed(2)} MB • Ready for Supabase upload
                  </p>
                )}
                <p className="text-[11px] text-emerald-600 font-semibold flex items-center justify-center sm:justify-start gap-1">
                  <Check className="w-3.5 h-3.5" /> Image ready for submission
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-xs"
                >
                  Replace Image
                </button>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
                  title="Remove Image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleFileSelect(e.dataTransfer.files[0]);
                }
              }}
              className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all ${
                isDragging
                  ? 'border-primary bg-orange-50/70 scale-[1.01]'
                  : errors.image
                  ? 'border-rose-300 bg-rose-50/30'
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
                Accepted formats: JPG, PNG, WEBP, GIF up to 5MB
              </p>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 shadow-xs transition-colors"
              >
                Browse Image File
              </button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept={ALLOWED_TYPES.join(',')}
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileSelect(e.target.files[0]);
              }
            }}
          />

          {errors.image && (
            <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.image}
            </p>
          )}
        </div>

        {/* Section 3: Customization Matrix */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 pb-1 border-b border-gray-100">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
              3. Customer Customization Matrix
            </h4>
          </div>

          {/* 1. Sizes & Price Modifiers */}
          <div className="p-4 rounded-xl bg-gray-50/80 border border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-primary" /> Portion / Sizes
              </span>
              <span className="text-[11px] text-gray-400">{sizes.length} configured</span>
            </div>

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
                min="0"
                placeholder="+$ Price"
                value={newSizePrice}
                onChange={(e) =>
                  setNewSizePrice(e.target.value === '' ? '' : parseFloat(e.target.value))
                }
                className="w-24 px-3 py-1.5 rounded-lg border border-gray-200 text-xs outline-none focus:border-primary"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddSize}
                leftIcon={<Plus className="w-3 h-3" />}
              >
                Add Size
              </Button>
            </div>
          </div>

          {/* 2. Extras & Add-ons */}
          <div className="p-4 rounded-xl bg-gray-50/80 border border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" /> Extras & Toppings
              </span>
              <span className="text-[11px] text-gray-400">{extras.length} configured</span>
            </div>

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
                placeholder="Extra name (e.g. Shaved Black Truffle)"
                value={newExtraName}
                onChange={(e) => setNewExtraName(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs outline-none focus:border-primary"
              />
              <input
                type="number"
                step="0.5"
                min="0"
                placeholder="+$ Price"
                value={newExtraPrice}
                onChange={(e) =>
                  setNewExtraPrice(e.target.value === '' ? '' : parseFloat(e.target.value))
                }
                className="w-24 px-3 py-1.5 rounded-lg border border-gray-200 text-xs outline-none focus:border-primary"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddExtra}
                leftIcon={<Plus className="w-3 h-3" />}
              >
                Add Extra
              </Button>
            </div>
          </div>

          {/* 3. Heat & Spice Levels */}
          <div className="p-4 rounded-xl bg-gray-50/80 border border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-rose-500" /> Heat & Spice Levels
              </span>
              <span className="text-[11px] text-gray-400">{spiceLevels.length} configured</span>
            </div>

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
                placeholder="Spice level (e.g. Mild, Hot Honey 🍯, Fiery Ghost Pepper 🔥)"
                value={newSpiceLevel}
                onChange={(e) => setNewSpiceLevel(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs outline-none focus:border-primary"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddSpice}
                leftIcon={<Plus className="w-3 h-3" />}
              >
                Add Spice Level
              </Button>
            </div>
          </div>
        </div>

        {/* Section 4: Availability */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-orange-50/40 border border-orange-100">
          <div>
            <h5 className="text-sm font-bold text-gray-900">In-Stock Availability</h5>
            <p className="text-xs text-gray-500">
              When disabled, customers will see this item marked as Sold Out.
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
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="gradient"
            disabled={isSubmitting}
            isLoading={isSubmitting}
            className="font-bold px-6 shadow-soft hover:shadow-glow-primary"
          >
            {isSubmitting
              ? 'Saving Product...'
              : isEditing
              ? 'Save Changes'
              : 'Create Product'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
