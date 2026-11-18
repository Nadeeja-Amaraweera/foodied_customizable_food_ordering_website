import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Utensils, Sliders, Clock, Plus, Check } from 'lucide-react';
import { AdminProduct } from '../../services/adminApi';
import { MenuItem } from '../../types';
import { useCart } from '../../context/CartContext';

export interface FeaturedSectionProps {
  products?: AdminProduct[];
  featuredItems?: MenuItem[];
  onCustomizeDish?: (dish: MenuItem, e?: React.MouseEvent<HTMLElement>) => void;
  onToast?: (message: string) => void;
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({
  products = [],
  featuredItems = [],
  onCustomizeDish,
  onToast
}) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [addedIds, setAddedIds] = React.useState<Record<string, boolean>>({});

  // Prioritize real backend products, fallback to mapped menuItems
  const displayItems = React.useMemo(() => {
    if (products.length > 0) {
      return products.slice(0, 4);
    }
    return featuredItems.slice(0, 4);
  }, [products, featuredItems]);

  const handleQuickAdd = (product: AdminProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    const pid = product._id || product.id || '';
    const standardSize = product.customization?.sizes?.[0]?.name || 'Standard Portion';
    const standardSpice = product.customization?.spiceLevels?.[0] || 'Standard';

    addToCart({
      cartId: `${pid}-${Date.now()}`,
      id: pid,
      productId: pid,
      name: product.name,
      basePrice: Number(product.price),
      unitPrice: Number(product.price),
      quantity: 1,
      image: product.image,
      portion: standardSize,
      spice: standardSpice,
      addons: [],
      dietary: [],
      notes: '',
      customization: {
        size: standardSize,
        spiceLevel: standardSpice,
        extras: [],
        dietary: [],
        specialInstructions: ''
      }
    });

    setAddedIds((prev) => ({ ...prev, [pid]: true }));
    if (onToast) {
      onToast(`Added "${product.name}" to cart!`);
    }
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [pid]: false }));
    }, 2000);
  };

  const handleCustomize = (product: AdminProduct | MenuItem, e?: React.MouseEvent) => {
    const pid = '_id' in product ? product._id || product.id : product.id;
    if (onCustomizeDish) {
      const menuItem: MenuItem = {
        id: pid || '',
        name: product.name,
        price: Number(product.price),
        image: product.image,
        description: product.description,
        isDessert: 'category' in product ? product.category === 'Desserts' : false,
        category: product.category,
        customization: 'customization' in product ? product.customization : undefined
      };
      onCustomizeDish(menuItem, e as any);
    } else {
      navigate(`/customize/${pid}`);
    }
  };

  return (
    <section id="special" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-20 bg-gradient-to-b from-transparent via-[#F7FAF3]/60 to-transparent">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#689F38] bg-[#EBF5E0] px-3.5 py-1.5 rounded-full inline-block mb-3">
            Handcrafted Signature Menu
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#1A1A1A] font-display">
            Featured Favorites
          </h2>
          <p className="text-sm sm:text-base text-gray-500 max-w-lg mt-2 leading-relaxed">
            Prepared fresh to order by our kitchen team. Select any dish to customize portion sizes, toppings, and spice levels.
          </p>
        </div>

        <button
          onClick={() => navigate('/menu')}
          className="self-start md:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-300 hover:border-gray-900 text-gray-800 hover:text-black font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs"
        >
          <span>View Full Menu</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
        {displayItems.map((item) => {
          const id = ('_id' in item ? item._id || item.id : item.id) || '';
          const isAdded = addedIds[id];
          const hasSizes = 'customization' in item && item.customization?.sizes && item.customization.sizes.length > 1;
          const prepTime = 'preparationTime' in item ? item.preparationTime : '15-20 min';

          return (
            <div
              key={id}
              className="bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(104,159,56,0.12)] border border-gray-100/90 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                {/* Image Container with Badges */}
                <div
                  onClick={() => handleCustomize(item)}
                  className="relative w-full h-52 rounded-2xl overflow-hidden bg-gray-50 cursor-pointer"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-gray-800 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                    {item.category || 'Special'}
                  </span>

                  {/* Preparation Time Pill */}
                  <span className="absolute bottom-3 left-3 bg-black/65 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
                    <Clock className="w-3 h-3 text-[#A4D670]" />
                    {prepTime}
                  </span>
                </div>

                {/* Dish Info */}
                <div className="pt-4 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      onClick={() => handleCustomize(item)}
                      className="font-black text-lg text-gray-900 line-clamp-1 group-hover:text-[#689F38] transition-colors cursor-pointer"
                    >
                      {item.name}
                    </h3>
                  </div>

                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Customization Hints */}
                  <div className="pt-1 flex items-center gap-2 text-[11px] text-[#558B2F] font-semibold">
                    <Sliders className="w-3 h-3" />
                    <span>
                      {hasSizes ? 'Multiple Sizes' : 'Custom Options'} Available
                    </span>
                  </div>
                </div>
              </div>

              {/* Price & Actions */}
              <div className="pt-5 mt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block leading-tight">Price</span>
                  <span className="text-xl font-black text-gray-900">
                    ${Number(item.price).toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Quick Add Button */}
                  {'_id' in item && (
                    <button
                      type="button"
                      onClick={(e) => handleQuickAdd(item as AdminProduct, e)}
                      title="Quick Add to Cart"
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                        isAdded
                          ? 'bg-[#7CB342] text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {isAdded ? <Check className="w-4 h-4 stroke-[3]" /> : <Plus className="w-4 h-4 stroke-[2.5]" />}
                    </button>
                  )}

                  {/* Primary Customize / Buy Now Button */}
                  <button
                    type="button"
                    onClick={(e) => handleCustomize(item, e)}
                    className="px-4 py-2 rounded-full bg-[#7CB342] hover:bg-[#689F38] text-white text-xs font-bold transition shadow-sm hover:shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Buy Now</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturedSection;
