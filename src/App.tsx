import React, { useState, useMemo, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import {
  Search,
  ShoppingBag,
  Star,
  Plus,
  Minus,
  X,
  Check,
  Edit3,
  Sliders,
  Trash2,
  Sparkles,
  Truck,
  Award,
  HeartHandshake,
  ArrowRight,
  Utensils,
  Flame,
  PlusCircle,
  RotateCcw,
  CheckCircle2,
  Eye,
  Play,
  Pause
} from 'lucide-react';

type MenuItem = {
  id: string;
  section?: string;
  name: string;
  price: number;
  rating?: number;
  reviews?: number;
  category?: string;
  isDessert: boolean;
  image: string;
  description: string;
  defaultAddons?: string[];
  addonsText?: string;
};

type HeroDish = {
  id: string;
  name: string;
  price: number;
  calories: string;
  image: string;
  desc: string;
};

type CartItem = {
  cartId: string;
  id: string;
  name: string;
  basePrice: number;
  unitPrice: number;
  quantity: number;
  image: string;
  portion: string;
  spice: string;
  addons: string[];
  dietary: string[];
  notes: string;
};

type FloatingClone = {
  image: string;
  name: string;
  startX: number;
  startY: number;
};

type EditingMenuCard = MenuItem & { addonsText: string };

// ==========================================
// INITIAL MENU PRESETS & DEFAULT DATA
// ==========================================

const HERO_ORBIT_DISHES = [
  {
    id: 'hero-1',
    name: 'Salmon Poke & Harvest Bowl',
    price: 5.50,
    calories: '420 kcal',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=85',
    desc: 'Fresh Atlantic salmon cubes, organic boiled eggs, sweet corn, crisp red cabbage, and garden greens.'
  },
  {
    id: 'hero-2',
    name: 'Mediterranean Herb Salad',
    price: 4.20,
    calories: '310 kcal',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
    desc: 'Crisp cucumbers, kalamata olives, feta cheese cubes, and cold-pressed olive oil dressing.'
  },
  {
    id: 'hero-3',
    name: 'Spicy Prawn Noodle Bowl',
    price: 4.80,
    calories: '490 kcal',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
    desc: 'Artisanal ramen noodles tossed in chili garlic oil with grilled tiger prawns and scallions.'
  },
  {
    id: 'hero-4',
    name: 'Sesame Crusted Tuna Tataki',
    price: 5.90,
    calories: '380 kcal',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80',
    desc: 'Seared Ahi tuna with toasted black & white sesame seeds and citrus ponzu glaze.'
  },
  {
    id: 'hero-5',
    name: 'Golden Berry Pancake Stack',
    price: 3.80,
    calories: '450 kcal',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=600&q=80',
    desc: 'Fluffy buttermilk pancakes topped with organic maple syrup and seasonal berries.'
  },
  {
    id: 'hero-6',
    name: 'Grilled Chicken Club Wrap',
    price: 4.10,
    calories: '410 kcal',
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=600&q=80',
    desc: 'Char-grilled herb chicken breast wrapped in warm flatbread with avocado crema.'
  }
];

const DEFAULT_ITEMS = [
  // 1. TOP FEATURED 4 CARDS (Protruding Circle Arch Cards)
  {
    id: 'top-1',
    section: 'featured',
    name: 'Chicken Burger',
    price: 3.50,
    rating: 4.9,
    reviews: 142,
    category: 'Burgers',
    isDessert: false,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    description: 'This is an excellent chicken burger that is very healthy',
    defaultAddons: ['Extra Cheese', 'Crispy Bacon', 'Avocado Slices', 'Garlic Herb Sauce']
  },
  {
    id: 'top-2',
    section: 'featured',
    name: 'Chicken Pizza',
    price: 3.60,
    rating: 4.8,
    reviews: 198,
    category: 'Pizza',
    isDessert: false,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
    description: 'This is an excellent chicken pizza that is very healthy',
    defaultAddons: ['Extra Mozzarella', 'Black Olives', 'Jalapeños', 'Stuffed Crust']
  },
  {
    id: 'top-3',
    section: 'featured',
    name: 'Chicken Rice',
    price: 4.50,
    rating: 4.9,
    reviews: 215,
    category: 'Rice Bowls',
    isDessert: false,
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80',
    description: 'This is an excellent chicken rice that is very healthy',
    defaultAddons: ['Fried Egg', 'Extra Grilled Chicken', 'Steamed Broccoli', 'Chili Garlic Oil']
  },
  {
    id: 'top-4',
    section: 'featured',
    name: 'Special Dessert',
    price: 2.50,
    rating: 5.0,
    reviews: 176,
    category: 'Desserts',
    isDessert: true,
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80',
    description: 'This is an excellent raspberry chocolate dessert that is very healthy',
    defaultAddons: ['Vanilla Bean Ice Cream', 'Fresh Raspberries', 'Dark Chocolate Drizzle', 'Whipped Cream']
  },

  // 2. SPECIAL MENU (3 Asymmetric Offset Cards)
  {
    id: 'spec-1',
    section: 'special',
    name: 'Salads',
    price: 2.50,
    rating: 5.0,
    reviews: 169,
    category: 'Salads',
    isDessert: false,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    description: 'Crisp Mediterranean garden greens with feta cheese, olives, and cherry tomatoes.',
    defaultAddons: ['Feta Cheese Cubes', 'Avocado Slices', 'Grilled Chicken Breast', 'Toasted Walnuts']
  },
  {
    id: 'spec-2',
    section: 'special',
    name: 'Egg Masala',
    price: 3.40,
    rating: 4.9,
    reviews: 160,
    category: 'Mains',
    isDessert: false,
    image: 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?auto=format&fit=crop&w=600&q=80',
    description: 'Organic soft-boiled eggs simmered in aromatic roasted spices and fresh herbs.',
    defaultAddons: ['Extra Boiled Egg', 'Garlic Naan Bread', 'Caramelized Onions', 'Fresh Coriander']
  },
  {
    id: 'spec-3',
    section: 'special',
    name: 'Fried Fish',
    price: 4.00,
    rating: 5.0,
    reviews: 180,
    category: 'Seafood',
    isDessert: false,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80',
    description: 'Pan-seared crispy whole fish marinated with lemon zest, turmeric, and cracked pepper.',
    defaultAddons: ['Tartar Sauce', 'Lemon Butter Glaze', 'Steamed Jasmine Rice', 'Grilled Asparagus']
  },

  // 3. OUR REGULAR FOOD (6 Protruding Circle Grid Cards)
  {
    id: 'reg-1',
    section: 'regular',
    name: 'Salads',
    price: 3.50,
    rating: 5.0,
    reviews: 169,
    category: 'Salads',
    isDessert: false,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
    description: 'This is a great green salad that is very healthy. You can eat it with any meal.',
    defaultAddons: ['Avocado Slices', 'Extra Feta Cheese', 'Grilled Halloumi', 'Chia & Pumpkin Seeds']
  },
  {
    id: 'reg-2',
    section: 'regular',
    name: 'Chicken Masala',
    price: 4.00,
    rating: 4.9,
    reviews: 120,
    category: 'Curry',
    isDessert: false,
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80',
    description: 'This is a great chicken masala that is very healthy. You can eat it with any meal.',
    defaultAddons: ['Butter Naan', 'Basmati Rice', 'Extra Chicken Pieces', 'Mint Yogurt Raita']
  },
  {
    id: 'reg-3',
    section: 'regular',
    name: 'Mutton Kheema',
    price: 4.60,
    rating: 4.8,
    reviews: 112,
    category: 'Curry',
    isDessert: false,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80',
    description: 'This is a great mutton kheema that is very healthy. You can eat it with any meal.',
    defaultAddons: ['Paratha Flatbread', 'Fried Egg on Top', 'Green Peas', 'Ghee Drizzle']
  },
  {
    id: 'reg-4',
    section: 'regular',
    name: 'Beef Pasta',
    price: 3.00,
    rating: 4.9,
    reviews: 106,
    category: 'Pasta',
    isDessert: false,
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80',
    description: 'This is a great green salad that is very healthy. You can eat it with any meal.',
    defaultAddons: ['Aged Parmesan', 'Garlic Breadstick', 'Extra Minced Beef', 'Truffle Oil Drizzle']
  },
  {
    id: 'reg-5',
    section: 'regular',
    name: 'Chicken Fry',
    price: 4.00,
    rating: 5.0,
    reviews: 120,
    category: 'Chicken',
    isDessert: false,
    image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=600&q=80',
    description: 'This is a great chicken masala that is very healthy. You can eat it with any meal.',
    defaultAddons: ['Spicy Mayo Dip', 'Sweet Potato Fries', 'Coleslaw Cup', 'Extra Crispy Tenders']
  },
  {
    id: 'reg-6',
    section: 'regular',
    name: 'Special Dessert',
    price: 2.50,
    rating: 4.9,
    reviews: 169,
    category: 'Desserts',
    isDessert: true,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80',
    description: 'This is a great mutton kheema that is very healthy. You can eat it with any meal.',
    defaultAddons: ['Whipped Cream', 'Fresh Berries', 'Caramel Swirl', 'Crushed Pistachios']
  }
];

const SRI_LANKAN_PRESET = [
  {
    id: 'top-1',
    section: 'featured',
    name: 'Crispy Prawn Burger',
    price: 4.20,
    rating: 4.9,
    reviews: 184,
    category: 'Burgers',
    isDessert: false,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80',
    description: 'Negombo lagoon crispy spiced prawns with Kochchi chili mayo & brioche bun',
    defaultAddons: ['Kochchi Cheese Slice', 'Avocado Slices', 'Caramelized Onions', 'Fried Egg']
  },
  {
    id: 'top-2',
    section: 'featured',
    name: 'Tandoori Roast Pizza',
    price: 4.50,
    rating: 4.9,
    reviews: 210,
    category: 'Pizza',
    isDessert: false,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    description: 'Wood-fired crust topped with devilled chicken, bell peppers & mozzarella',
    defaultAddons: ['Extra Mozzarella', 'Nai Miris Flakes', 'Cashew Nuts', 'Stuffed Cheese Crust']
  },
  {
    id: 'top-3',
    section: 'featured',
    name: 'Lamprais Rice Bowl',
    price: 4.90,
    rating: 5.0,
    reviews: 312,
    category: 'Rice Bowls',
    isDessert: false,
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80',
    description: 'Dutch-Burgher style fragrant ghee rice baked in banana leaf with frikkadels',
    defaultAddons: ['Extra Cutlet', 'Ash Plantain Fry', 'Seeni Sambol', 'Boiled & Fried Egg']
  },
  {
    id: 'top-4',
    section: 'featured',
    name: 'Kithul Watalappan',
    price: 2.80,
    rating: 5.0,
    reviews: 195,
    category: 'Desserts',
    isDessert: true,
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80',
    description: 'Rich coconut custard steamed with pure Kithul jaggery, cardamom & roasted cashews',
    defaultAddons: ['Extra Roasted Cashews', 'Vanilla Ice Cream', 'Kithul Treacle Drizzle', 'Plump Raisins']
  },
  ...DEFAULT_ITEMS.slice(4)
];

const ADDON_PRICES: Record<string, number> = {
  'Extra Cheese': 0.80,
  'Crispy Bacon': 1.20,
  'Avocado Slices': 1.20,
  'Garlic Herb Sauce': 0.50,
  'Extra Mozzarella': 1.00,
  'Black Olives': 0.60,
  'Jalapeños': 0.50,
  'Stuffed Crust': 1.50,
  'Fried Egg': 1.00,
  'Extra Grilled Chicken': 2.00,
  'Steamed Broccoli': 0.80,
  'Chili Garlic Oil': 0.40,
  'Vanilla Bean Ice Cream': 1.20,
  'Fresh Raspberries': 0.90,
  'Dark Chocolate Drizzle': 0.50,
  'Whipped Cream': 0.50,
  'Feta Cheese Cubes': 0.90,
  'Grilled Chicken Breast': 2.00,
  'Toasted Walnuts': 0.80,
  'Extra Boiled Egg': 0.90,
  'Garlic Naan Bread': 1.50,
  'Caramelized Onions': 0.50,
  'Fresh Coriander': 0.30,
  'Tartar Sauce': 0.50,
  'Lemon Butter Glaze': 0.70,
  'Steamed Jasmine Rice': 1.50,
  'Grilled Asparagus': 1.20,
  'Extra Feta Cheese': 0.90,
  'Grilled Halloumi': 1.60,
  'Chia & Pumpkin Seeds': 0.60,
  'Butter Naan': 1.40,
  'Basmati Rice': 1.50,
  'Extra Chicken Pieces': 1.80,
  'Mint Yogurt Raita': 0.60,
  'Paratha Flatbread': 1.30,
  'Fried Egg on Top': 1.00,
  'Green Peas': 0.50,
  'Ghee Drizzle': 0.60,
  'Aged Parmesan': 0.90,
  'Garlic Breadstick': 1.20,
  'Extra Minced Beef': 1.80,
  'Truffle Oil Drizzle': 1.10,
  'Spicy Mayo Dip': 0.50,
  'Sweet Potato Fries': 1.60,
  'Coleslaw Cup': 0.80,
  'Extra Crispy Tenders': 2.00,
  'Fresh Berries': 1.00,
  'Caramel Swirl': 0.50,
  'Crushed Pistachios': 0.80
};

const PRESET_FOOD_IMAGES = [
  { label: 'Gourmet Burger', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80' },
  { label: 'Artisan Pizza', url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80' },
  { label: 'Harvest Bowl', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80' },
  { label: 'Greek Salad', url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80' },
  { label: 'Chicken Masala', url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80' },
  { label: 'Grilled Fish', url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80' },
  { label: 'Berry Dessert', url: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80' },
  { label: 'Creamy Pasta', url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80' }
];

const CHEFS = [
  {
    id: 1,
    name: 'Chef Marco Rossi',
    role: 'Executive Culinary Director',
    specialty: 'Organic Mediterranean & Grill',
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=600&q=80',
    offset: false
  },
  {
    id: 2,
    name: 'Chef Elena Rostova',
    role: 'Head Pastry & Salad Artisan',
    specialty: 'Plant-Forward & Artisan Desserts',
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=600&q=80',
    offset: true
  },
  {
    id: 3,
    name: 'Chef Arthur Pendelton',
    role: 'Master Spice & Curry Chef',
    specialty: 'Signature Masala & Slow Roasts',
    image: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?auto=format&fit=crop&w=600&q=80',
    offset: false
  }
];

// Decorative Floating Leaf SVG Component matching the reference template
const FloatingLeaf = ({ className = '', flip = false }) => (
  <svg
    viewBox="0 0 120 120"
    className={`pointer-events-none select-none ${className}`}
    style={{ transform: flip ? 'scaleX(-1)' : undefined }}
    fill="none"
  >
    <path
      d="M15 105C15 105 22 42 75 18C105 4 112 15 105 45C92 98 15 105 15 105Z"
      fill="url(#leafGrad)"
      stroke="#558B2F"
      strokeWidth="2"
    />
    <path
      d="M15 105C42 78 72 48 102 20"
      stroke="#DCEDC8"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path d="M45 76L35 55" stroke="#DCEDC8" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M65 56L52 36" stroke="#DCEDC8" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M55 66L78 62" stroke="#DCEDC8" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M75 46L95 43" stroke="#DCEDC8" strokeWidth="1.8" strokeLinecap="round" />
    <defs>
      <linearGradient id="leafGrad" x1="15" y1="18" x2="105" y2="105" gradientUnits="userSpaceOnUse">
        <stop stopColor="#8BC34A" />
        <stop offset="1" stopColor="#558B2F" />
      </linearGradient>
    </defs>
  </svg>
);

export default function App() {
  // Menu items state (editable by user!)
  const [menuItems, setMenuItems] = useState<MenuItem[]>(DEFAULT_ITEMS);
  const [activeHeroDish, setActiveHeroDish] = useState<HeroDish>(HERO_ORBIT_DISHES[0]);
  const [isEditMenuMode, setIsEditMenuMode] = useState(false);

  // ==========================================
  // FLOATING-IN ANIMATION STATES & CONTROLS
  // ==========================================
  const [heroAnimKey, setHeroAnimKey] = useState(1);
  const [floatStartVector, setFloatStartVector] = useState({ x: 160, y: 120, rot: -22 });
  const [isAutoFloating, setIsAutoFloating] = useState(false);
  const [floatingClone, setFloatingClone] = useState<FloatingClone | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  // Trigger directional Float-In animation into the main Hero Bowl
  const triggerHeroDishFloat = (
    dish: MenuItem | HeroDish,
    originX = 150,
    originY = 130,
    originRot = -22
  ) => {
    setFloatStartVector({ x: originX, y: originY, rot: originRot });
    setActiveHeroDish({
      id: dish.id,
      name: dish.name,
      price: Number(dish.price),
      calories: 'calories' in dish ? dish.calories : '390 kcal',
      image: dish.image,
      desc: 'desc' in dish ? dish.desc : dish.description || 'Freshly prepared with organic ingredients.'
    });
    setHeroAnimKey((prev) => prev + 1);
  };

  // Auto-Orbit Float Showcase Timer
  useEffect(() => {
    if (!isAutoFloating) return;
    const angles = [172, 134, 92, 50, 12, -35];
    const timer = setInterval(() => {
      setActiveHeroDish((current) => {
        const currentIndex = HERO_ORBIT_DISHES.findIndex((d) => d.id === current.id);
        const nextIndex = (currentIndex + 1) % HERO_ORBIT_DISHES.length;
        const nextDish = HERO_ORBIT_DISHES[nextIndex];
        const angleRad = ((angles[nextIndex] || 90) * Math.PI) / 180;
        const startX = Math.cos(angleRad) * 215;
        const startY = Math.sin(angleRad) * 215;
        setFloatStartVector({
          x: Math.round(startX),
          y: Math.round(startY),
          rot: nextIndex % 2 === 0 ? -24 : 24
        });
        setHeroAnimKey((k) => k + 1);
        return nextDish;
      });
    }, 3400);
    return () => clearInterval(timer);
  }, [isAutoFloating]);

  // Float a card dish from anywhere on the page up into the Hero Showcase
  const handleFloatCardToHero = (item: MenuItem, e?: React.MouseEvent<HTMLElement>) => {
    if (e) e.stopPropagation();
    setSelectedCardId(item.id);
    setTimeout(() => setSelectedCardId(null), 900);

    // Create a floating visual clone if click coordinates are available
    if (e && e.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect();
      setFloatingClone({
        image: item.image,
        name: item.name,
        startX: rect.left + rect.width / 2,
        startY: rect.top + rect.height / 2
      });
      setTimeout(() => setFloatingClone(null), 850);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      triggerHeroDishFloat(item, -140, 220, -25);
      showToast(`"${item.name}" floated into the Hero Showcase!`);
    }, 320);
  };

  // Customer Order Customizer Modal State
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [portionSize, setPortionSize] = useState('Regular');
  const [spiceLevel, setSpiceLevel] = useState('Medium');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [dietaryTags, setDietaryTags] = useState<string[]>([]);
  const [specialNotes, setSpecialNotes] = useState('');
  const [itemQty, setItemQty] = useState(1);

  // Menu Item Studio Modal (Edit / Add Dish to Website)
  const [editingMenuCard, setEditingMenuCard] = useState<EditingMenuCard | null>(null);
  const [isAddingNewDish, setIsAddingNewDish] = useState(false);

  // Shopping Cart State
  const [cart, setCart] = useState<CartItem[]>([
    {
      cartId: 'sample-1',
      id: 'top-1',
      name: 'Chicken Burger',
      basePrice: 3.50,
      unitPrice: 4.30,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
      portion: 'Regular',
      spice: 'Medium',
      addons: ['Extra Cheese'],
      dietary: ['Dressing on Side'],
      notes: ''
    }
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderPlacedSuccess, setOrderPlacedSuccess] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [specialPageDot, setSpecialPageDot] = useState(0);
  const [regularCategoryFilter, setRegularCategoryFilter] = useState('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  // Authentication & View State (supports '#login' and seamless switching)
  const [currentView, setCurrentView] = useState<'store' | 'login'>(() => {
    return typeof window !== 'undefined' && window.location.hash === '#login' ? 'login' : 'store';
  });
  const [currentUser, setCurrentUser] = useState<{ username: string } | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#login') {
        setCurrentView('login');
      } else if (window.location.hash === '' || window.location.hash === '#home' || window.location.hash === '#menu') {
        setCurrentView('store');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Trigger a temporary notification toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Open the Customer Meal Customizer Modal
  const openCustomerCustomizer = (item: MenuItem, e?: React.MouseEvent<HTMLElement>) => {
    if (e && e.currentTarget) {
      setSelectedCardId(item.id);
      setTimeout(() => setSelectedCardId(null), 700);
    }
    setCustomizingItem(item);
    setPortionSize('Regular');
    setSpiceLevel(item.isDessert ? 'Regular Sweet' : 'Medium');
    setSelectedAddons([]);
    setDietaryTags([]);
    setSpecialNotes('');
    setItemQty(1);
  };

  // Calculate live price inside Customer Customizer Modal
  const calculatedUnitPrice = useMemo(() => {
    if (!customizingItem) return 0;
    let total = Number(customizingItem.price);
    if (portionSize === 'Large') total += 1.50;
    if (portionSize === 'Family') total += 3.00;
    selectedAddons.forEach((addon) => {
      total += ADDON_PRICES[addon] || 0.75;
    });
    return total;
  }, [customizingItem, portionSize, selectedAddons]);

  // Add customized item to Cart
  const handleAddToCart = () => {
    if (!customizingItem) return;
    const newCartItem = {
      cartId: `cart-${Date.now()}`,
      id: customizingItem.id,
      name: customizingItem.name,
      basePrice: customizingItem.price,
      unitPrice: calculatedUnitPrice,
      quantity: itemQty,
      image: customizingItem.image,
      portion: portionSize,
      spice: spiceLevel,
      addons: [...selectedAddons],
      dietary: [...dietaryTags],
      notes: specialNotes.trim()
    };
    setCart((prev) => [...prev, newCartItem]);
    setCustomizingItem(null);
    showToast(`Added customized "${customizingItem.name}" to your order!`);
  };

  // Open the Website Menu Editor Modal (for editing or creating a dish)
  const openMenuCardEditor = (item: MenuItem | null = null, defaultSection = 'regular') => {
    if (item) {
      setIsAddingNewDish(false);
      setEditingMenuCard({
        ...item,
        addonsText: (item.defaultAddons || []).join(', ')
      });
    } else {
      setIsAddingNewDish(true);
      setEditingMenuCard({
        id: `custom-${Date.now()}`,
        section: defaultSection,
        name: 'Avocado Grill Bowl',
        price: 4.20,
        rating: 5.0,
        reviews: 95,
        category: 'Bowls',
        isDessert: false,
        image: PRESET_FOOD_IMAGES[2].url,
        description: 'This is a custom healthy dish freshly prepared with organic ingredients.',
        addonsText: 'Avocado Slices, Extra Grilled Chicken, Feta Cheese Cubes, Garlic Herb Sauce'
      });
    }
  };

  // Save edited or newly created dish to the website menu
  const handleSaveMenuCard = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingMenuCard) return;

    const parsedAddons = editingMenuCard.addonsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const updatedItem = {
      ...editingMenuCard,
      price: Number(editingMenuCard.price) || 3.50,
      defaultAddons: parsedAddons.length > 0 ? parsedAddons : ['Extra Cheese', 'Avocado Slices']
    };

    if (isAddingNewDish) {
      setMenuItems((prev) => [...prev, updatedItem]);
      showToast(`Added "${updatedItem.name}" to the website menu!`);
    } else {
      setMenuItems((prev) => prev.map((it) => (it.id === updatedItem.id ? updatedItem : it)));
      showToast(`Updated "${updatedItem.name}" on the menu!`);
    }
    setEditingMenuCard(null);
  };

  const handleDeleteMenuCard = (id: string, name: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
    setEditingMenuCard(null);
    showToast(`Removed "${name}" from the menu.`);
  };

  // Filtered sections
  const featuredItems = useMemo(
    () =>
      menuItems
        .filter((i) => i.section === 'featured')
        .filter((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [menuItems, searchQuery]
  );

  const specialItems = useMemo(
    () =>
      menuItems
        .filter((i) => i.section === 'special')
        .filter((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [menuItems, searchQuery]
  );

  const regularItems = useMemo(
    () =>
      menuItems
        .filter((i) => i.section === 'regular')
        .filter((i) =>
          regularCategoryFilter === 'All' ? true : i.category === regularCategoryFilter
        )
        .filter((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [menuItems, regularCategoryFilter, searchQuery]
  );

  const cartTotalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  if (currentView === 'login') {
    return (
      <>
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#1A1A1A] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce border border-[#8BC34A]">
            <div className="w-7 h-7 rounded-full bg-[#8BC34A] flex items-center justify-center text-white shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">{toastMessage}</span>
          </div>
        )}
        <LoginPage
          onLogin={async ({ username }) => {
            await new Promise((resolve) => setTimeout(resolve, 800));
            setCurrentUser({ username });
            showToast(`Welcome back, ${username}!`);
            window.location.hash = '';
            setCurrentView('store');
          }}
          onForgotPassword={() => {
            showToast('Password recovery instructions sent to your email.');
          }}
          onRegister={() => {
            showToast('Registration service will be available shortly.');
          }}
          onBackToHome={() => {
            window.location.hash = '';
            setCurrentView('store');
          }}
          onSocialLogin={(provider) => {
            showToast(`${provider === 'google' ? 'Google' : 'Facebook'} authentication is not configured yet for this project.`);
          }}
          onToast={showToast}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFDF7] text-[#1A1A1A] font-sans relative overflow-x-hidden selection:bg-[#8BC34A] selection:text-white">
      {/* =========================================================
          CUSTOM KEYFRAME ANIMATIONS FOR FLOATING DISHES & GARNISHES
         ========================================================= */}
      <style>{`
        @keyframes dishFloatInSpring {
          0% {
            opacity: 0;
            transform: translate3d(var(--float-start-x, 140px), var(--float-start-y, 120px), 0) scale(0.38) rotate(var(--float-start-rot, -22deg));
            filter: blur(6px) drop-shadow(0 35px 35px rgba(0,0,0,0.28));
          }
          55% {
            opacity: 1;
            transform: translate3d(calc(var(--float-start-x, 140px) * -0.07), calc(var(--float-start-y, 120px) * -0.07 - 12px), 0) scale(1.06) rotate(4deg);
            filter: blur(0px) drop-shadow(0 28px 30px rgba(85,139,47,0.32));
          }
          78% {
            transform: translate3d(0px, 5px, 0) scale(0.98) rotate(-1.5deg);
          }
          100% {
            opacity: 1;
            transform: translate3d(0px, 0px, 0) scale(1) rotate(0deg);
            filter: blur(0px) drop-shadow(0 20px 25px rgba(0,0,0,0.16));
          }
        }

        @keyframes zeroGravityBob {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-11px) rotate(1.6deg);
          }
        }

        @keyframes garnishBurst {
          0% {
            opacity: 0;
            transform: translate3d(0, 0, 0) scale(0.2) rotate(0deg);
          }
          40% {
            opacity: 1;
            transform: translate3d(var(--tx, 30px), var(--ty, -30px), 0) scale(1.15) rotate(18deg);
          }
          100% {
            opacity: 0.92;
            transform: translate3d(var(--tx, 30px), calc(var(--ty, -30px) - 8px), 0) scale(1) rotate(32deg);
          }
        }

        @keyframes modalDishFloatIn {
          0% {
            opacity: 0;
            transform: translateY(55px) scale(0.45) rotate(-16deg);
          }
          65% {
            opacity: 1;
            transform: translateY(-10px) scale(1.07) rotate(3deg);
          }
          100% {
            opacity: 1;
            transform: translateY(0px) scale(1) rotate(0deg);
          }
        }

        @keyframes flyToHeroArc {
          0% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1) rotate(0deg);
          }
          50% {
            opacity: 0.95;
            transform: translate3d(60px, -220px, 0) scale(1.18) rotate(-15deg);
          }
          100% {
            opacity: 0;
            transform: translate3d(180px, -460px, 0) scale(0.45) rotate(-30deg);
          }
        }

        .animate-dish-float-in {
          animation: dishFloatInSpring 0.88s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .animate-zero-gravity {
          animation: zeroGravityBob 4.2s ease-in-out infinite;
        }

        .animate-garnish-particle {
          animation: garnishBurst 0.95s cubic-bezier(0.16, 1, 0.3, 1) forwards, zeroGravityBob 3.6s ease-in-out 0.95s infinite;
        }

        .animate-modal-dish-float {
          animation: modalDishFloatIn 0.72s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .animate-fly-to-hero {
          animation: flyToHeroArc 0.82s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>

      {/* Floating Dish Clone When Sending a Card Circle up to the Hero Showcase */}
      {floatingClone && (
        <div
          style={{
            left: floatingClone.startX - 56,
            top: floatingClone.startY - 56
          }}
          className="fixed z-50 pointer-events-none w-28 h-28 rounded-full p-1.5 bg-[#8BC34A] shadow-2xl animate-fly-to-hero"
        >
          <img
            src={floatingClone.image}
            alt={floatingClone.name}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      )}

      {/* =========================================================
          TOP ORGANIC GREEN BLOB SHAPE (Exact match to template)
         ========================================================= */}
      <div
        className="hidden lg:block absolute top-0 right-0 w-[56%] h-[650px] bg-[#8BC34A] pointer-events-none z-0 transition-all duration-500"
        style={{
          borderBottomLeftRadius: '55% 82%',
          borderBottomRightRadius: '18% 25%',
          boxShadow: 'inset 0 -20px 50px rgba(0,0,0,0.04)'
        }}
      />

      {/* Decorative Floating Leaves on the Page Edges */}
      <FloatingLeaf className="hidden md:block w-28 h-28 absolute top-[1180px] -right-6 z-10 opacity-95 rotate-12" />
      <FloatingLeaf
        className="hidden md:block w-32 h-32 absolute top-[1560px] -left-8 z-10 opacity-95 -rotate-12"
        flip
      />
      <FloatingLeaf className="hidden md:block w-28 h-28 absolute bottom-[720px] -right-6 z-10 opacity-90 rotate-45" />

      {/* =========================================================
          TOAST NOTIFICATION BANNER
         ========================================================= */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1A1A] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce border border-[#8BC34A]">
          <div className="w-7 h-7 rounded-full bg-[#8BC34A] flex items-center justify-center text-white shrink-0">
            <Check className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* =========================================================
          CUSTOMIZER MODE FLOATING CONTROL BAR
         ========================================================= */}
      <div className="bg-[#1A2611] text-white py-2.5 px-4 sm:px-8 relative z-30 border-b border-[#8BC34A]/30">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#8BC34A] text-[#1A2611] font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5" /> Interactive Customizer
            </span>
            <span className="text-gray-200 hidden sm:inline">
              Click any dish&apos;s <strong>Buy Now / Customize</strong> button to tailor ingredients, or toggle <strong>Edit Website Menu</strong> to customize the food lineup!
            </span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Quick Menu Preset Switcher */}
            <button
              onClick={() => {
                setMenuItems(DEFAULT_ITEMS);
                showToast('Switched to Original FOODIED Template Menu');
              }}
              className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-gray-200 text-xs transition"
            >
              Original Menu
            </button>
            <button
              onClick={() => {
                setMenuItems(SRI_LANKAN_PRESET);
                showToast('Loaded Artisan Fusion Custom Menu Preset!');
              }}
              className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-gray-200 text-xs transition"
            >
              Fusion Preset
            </button>

            <button
              onClick={() => setIsEditMenuMode(!isEditMenuMode)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full font-semibold text-xs transition shadow-sm ${
                isEditMenuMode
                  ? 'bg-amber-400 text-gray-950 ring-2 ring-amber-200'
                  : 'bg-[#8BC34A] text-white hover:bg-[#7CB342]'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              {isEditMenuMode ? 'Editing Menu ON (Click Cards)' : 'Edit Website Menu'}
            </button>

            {isEditMenuMode && (
              <button
                onClick={() => openMenuCardEditor(null, 'regular')}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white text-[#1A2611] font-bold text-xs hover:bg-gray-100 transition"
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#7CB342]" /> + Add Dish
              </button>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================
          NAVIGATION BAR (Matching FOODIED UI Header)
         ========================================================= */}
      <header className="relative z-20 max-w-7xl mx-auto px-4 sm:px-8 pt-6 pb-4 flex items-center justify-between">
        {/* Left Brand Logo */}
        <a
          href="#top"
          className="text-2xl sm:text-[26px] font-black tracking-tight text-[#1A1A1A] flex items-center gap-1.5"
        >
          FOODIED
        </a>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a
            href="#home"
            className="text-[#8BC34A] lg:text-[#7CB342] font-semibold border-b-2 border-[#8BC34A] pb-0.5"
          >
            Home
          </a>
          <a
            href="#special-menu"
            className="text-[#1A1A1A] hover:text-[#558B2F] transition"
          >
            Menu
          </a>
          <a
            href="#why-choose"
            className="text-[#1A1A1A] hover:text-[#558B2F] transition"
          >
            About Us
          </a>
          <a
            href="#chefs"
            className="text-[#1A1A1A] hover:text-[#558B2F] transition"
          >
            Contact
          </a>
        </nav>

        {/* Right Action Icons (Search, Shopping Bag, Sign Up Pill) */}
        <div className="flex items-center gap-3">
          {/* Search Toggle */}
          <div className="relative flex items-center">
            {isSearchOpen && (
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dishes..."
                className="w-36 sm:w-48 px-3 py-1.5 mr-2 rounded-full bg-white text-xs text-gray-800 shadow-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#8BC34A]"
              />
            )}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Search Menu"
              className="w-9 h-9 rounded-full bg-white text-[#1A1A1A] shadow-sm flex items-center justify-center hover:scale-105 transition"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Cart Button with Live Badge */}
          <button
            onClick={() => setIsCartOpen(true)}
            aria-label="Shopping Bag"
            className="w-9 h-9 rounded-full bg-white text-[#1A1A1A] shadow-sm flex items-center justify-center relative hover:scale-105 transition"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartTotalCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#1A1A1A] text-white text-[10px] font-bold flex items-center justify-center shadow">
                {cartTotalCount}
              </span>
            )}
          </button>

          {/* Sign In / Sign Up or Logged in User */}
          {currentUser ? (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white shadow-sm border border-gray-200/80 text-xs font-semibold text-gray-800">
              <span className="w-5 h-5 rounded-full bg-[#8BC34A] text-white flex items-center justify-center text-[10px] font-black uppercase">
                {currentUser.username[0]}
              </span>
              <span className="max-w-[100px] truncate">{currentUser.username}</span>
              <button
                onClick={() => {
                  setCurrentUser(null);
                  showToast('You have been logged out.');
                }}
                className="text-gray-400 hover:text-red-500 text-[11px] font-normal underline ml-1 cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => {
                  window.location.hash = 'login';
                  setCurrentView('login');
                }}
                className="px-3.5 py-2 rounded-full text-[#1A1A1A] font-semibold text-xs sm:text-sm hover:text-[#558B2F] transition cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  window.location.hash = 'login';
                  setCurrentView('login');
                }}
                className="px-5 py-2 rounded-full bg-white text-[#1A1A1A] font-semibold text-xs sm:text-sm shadow-sm hover:shadow-md hover:scale-105 transition cursor-pointer"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </header>

      {/* =========================================================
          HERO SECTION (JUST COME TO FOODIED & ORDER + Orbiting Bowl)
         ========================================================= */}
      <section id="home" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pt-6 pb-20 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Hungry Badge, Headline, Subtext & CTAs */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-block">
              <span className="px-4 py-1 rounded-full border border-gray-400 text-xs font-medium text-gray-700 bg-white/80">
                Hungry?
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl xl:text-[54px] font-black tracking-tight leading-[1.12] text-[#1A1A1A]">
              JUST COME TO <br />
              FOODIED &amp; ORDER
            </h1>

            <p className="text-gray-500 text-xs sm:text-sm max-w-md leading-relaxed">
              Here You Will Find All The Best Quality And Pure Food. Order Now To Satisfy Your Hunger Pangs. Click any circle to float dishes in!
            </p>

            {/* Dual CTA Buttons matching Template */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={(e) =>
                  openCustomerCustomizer(
                    {
                      id: activeHeroDish.id,
                      name: activeHeroDish.name,
                      price: activeHeroDish.price,
                      image: activeHeroDish.image,
                      description: activeHeroDish.desc,
                      isDessert: false,
                      defaultAddons: ['Avocado Slices', 'Extra Grilled Salmon', 'Soft Boiled Egg', 'Sesame Ginger Dressing']
                    },
                    e
                  )
                }
                className="px-7 py-3.5 rounded-full bg-[#8BC34A] hover:bg-[#7CB342] text-white font-semibold text-sm shadow-lg shadow-[#8BC34A]/30 transition flex items-center gap-2 cursor-pointer"
              >
                Order Now
              </button>

              <a
                href="#regular-food"
                className="px-7 py-3.5 rounded-full border border-gray-800 text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white font-semibold text-sm transition flex items-center gap-2"
              >
                Explore More <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Active Hero Bowl Quick Info Bar + Float Animation Controls */}
            <div className="pt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
              <span className="inline-flex items-center gap-1.5 font-medium text-[#558B2F] bg-[#E8F3DC] px-3 py-1.5 rounded-full shadow-2xs">
                <Utensils className="w-3.5 h-3.5" /> Active Bowl: <strong>{activeHeroDish.name}</strong> (${Number(activeHeroDish.price).toFixed(2)})
              </span>

              <button
                onClick={() => triggerHeroDishFloat(activeHeroDish, 165, 135, -24)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border border-[#8BC34A]/50 text-[#558B2F] font-semibold hover:bg-[#F4F9EE] transition shadow-2xs"
                title="Replay the floating-in entrance animation"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Replay Float-In
              </button>

              <button
                onClick={() => setIsAutoFloating(!isAutoFloating)}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full font-semibold transition shadow-2xs ${
                  isAutoFloating
                    ? 'bg-[#1A1A1A] text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-[#8BC34A]'
                }`}
              >
                {isAutoFloating ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-[#8BC34A]" /> Auto-Float ON
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-[#558B2F]" /> Auto-Orbit Float
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Large Circular Bowl + 5 Orbiting Dish Thumbnails */}
          <div className="lg:col-span-6 flex justify-center items-center relative min-h-[410px] sm:min-h-[470px]">
            {/* Animated Bursting Garnish & Herb Particles (Re-triggered on every circle selection) */}
            <div key={`garnishes-${heroAnimKey}`} className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
              {/* Floating Basil Leaf Top-Left */}
              <div
                style={{ '--tx': '-165px', '--ty': '-135px' } as React.CSSProperties}
                className="absolute animate-garnish-particle"
              >
                <span className="inline-block px-2.5 py-1 rounded-full bg-[#7CB342] text-white text-[10px] font-bold shadow-md rotate-[-18deg]">
                  🌿 Fresh Basil
                </span>
              </div>

              {/* Floating Chili / Spice Ring Top-Right */}
              <div
                style={{ '--tx': '155px', '--ty': '-140px' } as React.CSSProperties}
                className="absolute animate-garnish-particle"
              >
                <span className="w-5 h-5 rounded-full border-4 border-red-400/90 inline-block shadow-sm" />
              </div>

              {/* Floating Cherry Tomato / Berry Accent Left */}
              <div
                style={{ '--tx': '-195px', '--ty': '15px' } as React.CSSProperties}
                className="absolute animate-garnish-particle"
              >
                <span className="w-4 h-4 rounded-full bg-red-500 inline-block shadow-md" />
              </div>

              {/* Floating Lime Zest / Herb Accent Right */}
              <div
                style={{ '--tx': '185px', '--ty': '-20px' } as React.CSSProperties}
                className="absolute animate-garnish-particle"
              >
                <span className="w-3.5 h-3.5 rounded-full bg-[#DCE775] inline-block shadow" />
              </div>
            </div>

            {/* Levitation Ground Shadow beneath the Main Bowl (pulses with float) */}
            <div className="absolute bottom-6 w-52 h-7 bg-black/15 rounded-full blur-xl pointer-events-none transition-all duration-500" />

            {/* Continuous Zero-Gravity Wrapper */}
            <div className="animate-zero-gravity relative z-10 flex items-center justify-center">
              {/* Directional Float-In Spring Wrapper (Re-mounts on heroAnimKey change) */}
              <div
                key={`hero-bowl-${heroAnimKey}`}
                style={{
                  '--float-start-x': `${floatStartVector.x}px`,
                  '--float-start-y': `${floatStartVector.y}px`,
                  '--float-start-rot': `${floatStartVector.rot}deg`
                } as React.CSSProperties}
                className="animate-dish-float-in relative w-64 h-64 sm:w-80 sm:h-80 md:w-[350px] md:h-[350px] rounded-full p-3 bg-[#A5D666]/90 shadow-2xl flex items-center justify-center group"
              >
                <img
                  src={activeHeroDish.image}
                  alt={activeHeroDish.name}
                  onClick={(e) =>
                    openCustomerCustomizer(
                      {
                        id: activeHeroDish.id,
                        name: activeHeroDish.name,
                        price: activeHeroDish.price,
                        image: activeHeroDish.image,
                        description: activeHeroDish.desc,
                        isDessert: false,
                        defaultAddons: ['Avocado Slices', 'Extra Cheese', 'Fried Egg', 'Garlic Herb Sauce']
                      },
                      e
                    )
                  }
                  className="w-full h-full object-cover rounded-full shadow-inner cursor-pointer transition-transform duration-500 group-hover:scale-105"
                />

                {/* Floating Glassmorphic Info Pill on Top-Left of Bowl */}
                <div className="absolute -top-3 -left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl shadow-lg border border-[#8BC34A]/30 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8BC34A] animate-ping" />
                  <div className="text-left">
                    <p className="text-[11px] font-extrabold text-[#1A1A1A] leading-tight">
                      {activeHeroDish.name}
                    </p>
                    <p className="text-[10px] font-semibold text-[#558B2F]">
                      {activeHeroDish.calories || '410 kcal'} • ${Number(activeHeroDish.price).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Interactive Customize Badge on Bottom of Bowl */}
                <button
                  onClick={(e) =>
                    openCustomerCustomizer(
                      {
                        id: activeHeroDish.id,
                        name: activeHeroDish.name,
                        price: activeHeroDish.price,
                        image: activeHeroDish.image,
                        description: activeHeroDish.desc,
                        isDessert: false,
                        defaultAddons: ['Avocado Slices', 'Extra Cheese', 'Fried Egg', 'Garlic Herb Sauce']
                      },
                      e
                    )
                  }
                  className="absolute bottom-4 bg-white/95 backdrop-blur-xs text-[#1A1A1A] px-4 py-1.5 rounded-full shadow-lg text-xs font-bold flex items-center gap-1.5 hover:bg-[#8BC34A] hover:text-white transition"
                >
                  <Sliders className="w-3.5 h-3.5" /> Customize (${Number(activeHeroDish.price).toFixed(2)})
                </button>
              </div>
            </div>

            {/* 5 Orbiting Smaller Circular Thumbnails Along the Bottom Arc */}
            {HERO_ORBIT_DISHES.slice(1).map((dish, idx) => {
              // Angles arranged in a semi-circular arc from left (172 deg) to right (12 deg)
              const angles = [172, 134, 92, 50, 12];
              const angleRad = (angles[idx] * Math.PI) / 180;
              const radius = 215; // px on desktop
              const xOffset = Math.cos(angleRad) * radius;
              const yOffset = Math.sin(angleRad) * radius;

              const isSelected = activeHeroDish.id === dish.id;

              return (
                <button
                  key={dish.id}
                  onClick={() =>
                    triggerHeroDishFloat(
                      dish,
                      Math.round(xOffset),
                      Math.round(yOffset),
                      idx < 2 ? -25 : 25
                    )
                  }
                  title={`Float in ${dish.name}`}
                  style={{
                    transform: `translate(${xOffset}px, ${yOffset}px)`
                  }}
                  className={`hidden sm:flex absolute z-20 w-14 h-14 md:w-16 md:h-16 rounded-full p-1 bg-white shadow-lg hover:scale-125 hover:-translate-y-1 transition-all duration-300 items-center justify-center group ${
                    isSelected
                      ? 'ring-4 ring-[#1A1A1A] scale-115 shadow-xl'
                      : 'ring-2 ring-[#8BC34A]/70 hover:ring-[#1A1A1A]'
                  }`}
                >
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                  {isSelected && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#8BC34A] text-white flex items-center justify-center text-[9px] font-bold shadow">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}

            {/* Mobile-friendly row of the 6 orbit thumbnails */}
            <div className="flex sm:hidden items-center justify-center gap-2.5 mt-4 absolute -bottom-12">
              {HERO_ORBIT_DISHES.map((dish, idx) => (
                <button
                  key={dish.id}
                  onClick={() => triggerHeroDishFloat(dish, (idx - 2) * 45, 110, -18)}
                  className={`w-11 h-11 rounded-full p-0.5 bg-white shadow transition-transform ${
                    activeHeroDish.id === dish.id ? 'ring-2 ring-[#1A1A1A] scale-110 -translate-y-1' : ''
                  }`}
                >
                  <img src={dish.image} alt={dish.name} className="w-full h-full object-cover rounded-full" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          TOP 4 FEATURED ARCH CARDS (Protruding Circular Images)
         ========================================================= */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 pt-14 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-7 gap-y-24">
          {featuredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-[28px] pt-24 pb-6 px-5 shadow-[0_10px_35px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_40px_rgba(139,195,74,0.18)] transition-all duration-300 relative flex flex-col items-center text-center group border border-gray-100/80"
            >
              {/* Protruding Top Circular Dish Image with Floating Hover & Click Animation */}
              <div
                onClick={(e) =>
                  isEditMenuMode ? openMenuCardEditor(item) : openCustomerCustomizer(item, e)
                }
                className={`w-40 h-40 rounded-full p-2 bg-[#8BC34A] shadow-lg absolute -top-20 left-1/2 -translate-x-1/2 cursor-pointer transition-all duration-500 group-hover:-translate-y-3 group-hover:scale-105 group-hover:shadow-[0_20px_35px_rgba(139,195,74,0.4)] ${
                  selectedCardId === item.id ? 'scale-110 -translate-y-4 ring-4 ring-[#1A1A1A]' : ''
                }`}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-full bg-white transition-transform duration-500 group-hover:rotate-6"
                />
                {isEditMenuMode ? (
                  <span className="absolute inset-0 rounded-full bg-black/50 text-white flex items-center justify-center text-xs font-bold gap-1">
                    <Edit3 className="w-4 h-4" /> Edit Dish
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => handleFloatCardToHero(item, e)}
                    title="Float this dish into the Hero Bowl"
                    className="opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#1A1A1A] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 hover:bg-[#8BC34A]"
                  >
                    <Sparkles className="w-3 h-3" /> Float to Hero
                  </button>
                )}
              </div>

              {/* Card Title & Description */}
              <h3 className="text-lg font-extrabold text-[#1A1A1A] mt-2">{item.name}</h3>
              <p className="text-xs text-gray-400 leading-relaxed mt-2 mb-5 px-2 line-clamp-2">
                {item.description}
              </p>

              {/* Bottom Price Pill & Buy Now / Customize Button */}
              <div className="mt-auto w-full flex items-center justify-between gap-2 pt-2">
                <span className="px-4 py-1.5 rounded-full border border-gray-400 text-xs font-bold text-[#1A1A1A]">
                  ${Number(item.price).toFixed(2)}
                </span>

                {isEditMenuMode ? (
                  <button
                    onClick={() => openMenuCardEditor(item)}
                    className="px-4 py-1.5 rounded-full bg-amber-400 hover:bg-amber-500 text-gray-950 text-xs font-bold transition shadow-sm flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" /> Edit Item
                  </button>
                ) : (
                  <button
                    onClick={() => openCustomerCustomizer(item)}
                    className="px-4 py-1.5 rounded-full bg-[#8BC34A] hover:bg-[#7CB342] text-white text-xs font-semibold transition shadow-sm"
                  >
                    Buy Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          WHY CHOOSE US? SECTION (3 Clean Icon Cards)
         ========================================================= */}
      <section id="why-choose" className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 py-16 text-center">
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#1A1A1A] uppercase">
          WHY CHOOSE US?
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto mt-3 leading-relaxed">
          You will choose us because you get the best quality food from us and we deliver fast.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 mt-12">
          {/* Card 1: Serve Healthy Food */}
          <div className="bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100/80 flex flex-col items-center text-center hover:-translate-y-1 transition">
            <div className="w-14 h-14 rounded-2xl bg-[#F4F9EE] text-[#8BC34A] flex items-center justify-center mb-5">
              <Utensils className="w-7 h-7 stroke-[1.75]" />
            </div>
            <h3 className="text-lg font-extrabold text-[#1A1A1A]">Serve Healthy Food</h3>
            <p className="text-xs text-gray-400 mt-2.5 leading-relaxed max-w-xs">
              We serve all healthy food here. You can choose any food you like and customize every ingredient.
            </p>
          </div>

          {/* Card 2: Best Quality */}
          <div className="bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100/80 flex flex-col items-center text-center hover:-translate-y-1 transition">
            <div className="w-14 h-14 rounded-2xl bg-[#F4F9EE] text-[#8BC34A] flex items-center justify-center mb-5">
              <Award className="w-7 h-7 stroke-[1.75]" />
            </div>
            <h3 className="text-lg font-extrabold text-[#1A1A1A]">Best Quality</h3>
            <p className="text-xs text-gray-400 mt-2.5 leading-relaxed max-w-xs">
              Our food quality is excellent. You will get exactly what you want here prepared fresh to order.
            </p>
          </div>

          {/* Card 3: Fast Delivery */}
          <div className="bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100/80 flex flex-col items-center text-center hover:-translate-y-1 transition">
            <div className="w-14 h-14 rounded-2xl bg-[#F4F9EE] text-[#8BC34A] flex items-center justify-center mb-5">
              <Truck className="w-7 h-7 stroke-[1.75]" />
            </div>
            <h3 className="text-lg font-extrabold text-[#1A1A1A]">Fast Delivery</h3>
            <p className="text-xs text-gray-400 mt-2.5 leading-relaxed max-w-xs">
              You can say the main goal of our delivery man is to deliver orders quickly. You will receive it shortly after ordering.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          SPECIAL MENU SECTION (3 Asymmetric Top-Right Image Cards)
         ========================================================= */}
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
            <div
              key={item.id}
              className="bg-white rounded-[26px] p-6 pt-28 shadow-[0_10px_35px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_40px_rgba(139,195,74,0.16)] transition relative border border-gray-100/80 group"
            >
              {/* Offset Top-Right Circular Dish Image with Dark Leaf-Green Ring & Float Lift */}
              <div
                onClick={(e) =>
                  isEditMenuMode ? openMenuCardEditor(item) : openCustomerCustomizer(item, e)
                }
                className={`w-40 h-40 rounded-full p-2.5 bg-[#558B2F] shadow-xl absolute -top-14 right-5 cursor-pointer transition-all duration-500 group-hover:-translate-y-3 group-hover:scale-105 group-hover:shadow-[0_22px_38px_rgba(85,139,47,0.4)] ${
                  selectedCardId === item.id ? 'scale-110 -translate-y-4 ring-4 ring-[#1A1A1A]' : ''
                }`}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-full bg-white transition-transform duration-500 group-hover:rotate-6"
                />
                {isEditMenuMode ? (
                  <span className="absolute inset-0 rounded-full bg-black/50 text-white flex items-center justify-center text-xs font-bold gap-1">
                    <Edit3 className="w-4 h-4" /> Edit
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => handleFloatCardToHero(item, e)}
                    title="Float this dish into the Hero Bowl"
                    className="opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#1A1A1A] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 hover:bg-[#8BC34A]"
                  >
                    <Sparkles className="w-3 h-3" /> Float to Hero
                  </button>
                )}
              </div>

              {/* Left Aligned Dish Info */}
              <div className="flex items-end justify-between mt-4">
                <div>
                  <h3 className="text-xl font-extrabold text-[#1A1A1A]">{item.name}</h3>

                  {/* 5 Star Rating + Review Count */}
                  <div className="flex items-center gap-1 mt-1.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 fill-[#FBBF24] text-[#FBBF24]"
                      />
                    ))}
                    <span className="text-[11px] text-gray-400 ml-1">({item.reviews})</span>
                  </div>

                  {/* Bold Green Price */}
                  <div className="text-2xl font-extrabold text-[#8BC34A] mt-3">
                    ${Number(item.price).toFixed(2)}
                  </div>
                </div>

                {/* Tall Rounded Green Square Shopping Bag + Button (Bottom Right) */}
                <button
                  onClick={() => (isEditMenuMode ? openMenuCardEditor(item) : openCustomerCustomizer(item))}
                  title={isEditMenuMode ? 'Edit Special Item' : 'Customize & Add to Order'}
                  className={`w-14 h-16 rounded-2xl flex items-center justify-center shadow-md transition ${
                    isEditMenuMode
                      ? 'bg-amber-400 text-gray-950 hover:bg-amber-500'
                      : 'bg-[#8BC34A] hover:bg-[#7CB342] text-white'
                  }`}
                >
                  {isEditMenuMode ? (
                    <Edit3 className="w-5 h-5" />
                  ) : (
                    <div className="relative flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
                      <Plus className="w-3 h-3 absolute -bottom-1 -right-1 bg-white text-[#8BC34A] rounded-full stroke-[3]" />
                    </div>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Dots matching UI reference */}
        <div className="flex items-center justify-center gap-2.5 mt-10">
          {[0, 1, 2, 3].map((dot) => (
            <button
              key={dot}
              onClick={() => setSpecialPageDot(dot)}
              aria-label={`Slide ${dot + 1}`}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                specialPageDot === dot ? 'bg-[#8BC34A] scale-125' : 'bg-[#C5E1A5]'
              }`}
            />
          ))}
        </div>
      </section>

      {/* =========================================================
          OUR REGULAR FOOD SECTION (6 Protruding Circle Cards Grid)
         ========================================================= */}
      <section id="regular-food" className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#1A1A1A] uppercase">
            OUR REGULAR FOOD
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto mt-3 leading-relaxed">
            This is our daily food list. Here you will find all kinds of food. Choose your favorite food and order.
          </p>

          {/* Optional Quick Category Filter Pills + Add Custom Dish Button */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {['All', 'Salads', 'Curry', 'Pasta', 'Chicken', 'Desserts'].map((cat) => (
              <button
                key={cat}
                onClick={() => setRegularCategoryFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                  regularCategoryFilter === cat
                    ? 'bg-[#8BC34A] text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-[#8BC34A]'
                }`}
              >
                {cat}
              </button>
            ))}
            <button
              onClick={() => openMenuCardEditor(null, 'regular')}
              className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#E8F3DC] text-[#558B2F] hover:bg-[#8BC34A] hover:text-white transition flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Custom Dish
            </button>
          </div>
        </div>

        {/* 3x2 Grid with Protruding Circular Top Images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-24 pt-16">
          {regularItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-[28px] pt-28 pb-7 px-6 shadow-[0_10px_35px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_40px_rgba(139,195,74,0.18)] transition-all duration-300 relative flex flex-col items-center text-center group border border-gray-100/80"
            >
              {/* Protruding Circular Dish Photo with Green Ring & Floating Elevation */}
              <div
                onClick={(e) =>
                  isEditMenuMode ? openMenuCardEditor(item) : openCustomerCustomizer(item, e)
                }
                className={`w-44 h-44 rounded-full p-2.5 bg-[#8BC34A] shadow-xl absolute -top-20 left-1/2 -translate-x-1/2 cursor-pointer transition-all duration-500 group-hover:-translate-y-3 group-hover:scale-105 group-hover:shadow-[0_22px_38px_rgba(139,195,74,0.4)] ${
                  selectedCardId === item.id ? 'scale-110 -translate-y-4 ring-4 ring-[#1A1A1A]' : ''
                }`}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-full bg-white transition-transform duration-500 group-hover:rotate-6"
                />
                {isEditMenuMode ? (
                  <span className="absolute inset-0 rounded-full bg-black/50 text-white flex items-center justify-center text-xs font-bold gap-1">
                    <Edit3 className="w-4 h-4" /> Edit Dish
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => handleFloatCardToHero(item, e)}
                    title="Float this dish into the Hero Bowl"
                    className="opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#1A1A1A] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 hover:bg-[#8BC34A]"
                  >
                    <Sparkles className="w-3 h-3" /> Float to Hero
                  </button>
                )}
              </div>

              <h3 className="text-xl font-extrabold text-[#1A1A1A] mt-2">{item.name}</h3>

              {/* 5 Star Rating + Review Count */}
              <div className="flex items-center justify-center gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#FBBF24] text-[#FBBF24]" />
                ))}
                <span className="text-xs text-gray-400 ml-1">({item.reviews})</span>
              </div>

              <p className="text-xs text-gray-400 leading-relaxed mt-3 mb-6 px-2">
                {item.description}
              </p>

              {/* Price Pill + Buy Now / Customize Pill Button */}
              <div className="mt-auto w-full flex items-center justify-between gap-3 px-2">
                <span className="px-5 py-1.5 rounded-full border border-gray-500 text-xs font-bold text-[#1A1A1A]">
                  ${Number(item.price).toFixed(2)}
                </span>

                {isEditMenuMode ? (
                  <button
                    onClick={() => openMenuCardEditor(item)}
                    className="px-5 py-2 rounded-full bg-amber-400 hover:bg-amber-500 text-gray-950 text-xs font-bold transition shadow-sm flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Customize Card
                  </button>
                ) : (
                  <button
                    onClick={() => openCustomerCustomizer(item)}
                    className="px-6 py-2 rounded-full bg-[#8BC34A] hover:bg-[#7CB342] text-white text-xs font-semibold transition shadow-sm"
                  >
                    Buy Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="flex items-center justify-center gap-2.5 mt-12">
          <span className="w-2.5 h-2.5 rounded-full bg-[#8BC34A]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#C5E1A5]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#C5E1A5]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#C5E1A5]" />
        </div>
      </section>

      {/* =========================================================
          OUR SPECIAL CHEF'S SECTION (3 Soft Green Portrait Cards)
         ========================================================= */}
      <section id="chefs" className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 py-16">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#1A1A1A]">
            OUR SPECIAL CHEF&apos;s
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto mt-3 leading-relaxed">
            Featured below are some of our special chefs who work to prepare your meals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {CHEFS.map((chef) => (
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

      {/* =========================================================
          FOOTER SECTION (Soft Sage Green #E5F0DA 4-Column Layout)
         ========================================================= */}
      <footer className="bg-[#E5F0DA] mt-16 py-16 px-4 sm:px-8 text-[#1A1A1A]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Menu */}
          <div>
            <h4 className="text-lg font-extrabold mb-4">Menu</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-gray-600">
              <li>
                <a href="#home" className="hover:text-[#558B2F] transition">
                  Home
                </a>
              </li>
              <li>
                <a href="#why-choose" className="hover:text-[#558B2F] transition">
                  Why Choose
                </a>
              </li>
              <li>
                <a href="#special-menu" className="hover:text-[#558B2F] transition">
                  Special Menu
                </a>
              </li>
              <li>
                <a href="#regular-food" className="hover:text-[#558B2F] transition">
                  Regular Food
                </a>
              </li>
              <li>
                <a href="#chefs" className="hover:text-[#558B2F] transition">
                  Special Chef&apos;s
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Help */}
          <div>
            <h4 className="text-lg font-extrabold mb-4">Help</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-gray-600">
              <li>
                <a href="#privacy" onClick={(e) => { e.preventDefault(); showToast('Privacy Policy opened'); }} className="hover:text-[#558B2F] transition">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#terms" onClick={(e) => { e.preventDefault(); showToast('Terms & Conditions opened'); }} className="hover:text-[#558B2F] transition">
                  Terms &amp; Condition
                </a>
              </li>
              <li>
                <a href="#policy" onClick={(e) => { e.preventDefault(); showToast('Food Safety & Refund Policy opened'); }} className="hover:text-[#558B2F] transition">
                  Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h4 className="text-lg font-extrabold mb-4">Contact</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-gray-600">
              <li>+123 456 789</li>
              <li>Info@Foodied.Com</li>
              <li>1245, New York, USA</li>
            </ul>
          </div>

          {/* Column 4: Subscribe Our Newsletter */}
          <div>
            <h4 className="text-lg font-extrabold mb-4 leading-snug">
              Subscribe Our <br /> Newsletter
            </h4>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (newsletterEmail) {
                  showToast(`Subscribed ${newsletterEmail} to FOODIED offers!`);
                  setNewsletterEmail('');
                }
              }}
              className="flex items-center bg-white rounded-lg overflow-hidden shadow-sm border border-[#C5E1A5] mt-2"
            >
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter Your Email"
                className="w-full px-3.5 py-2.5 text-xs text-gray-700 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-[#8BC34A] hover:bg-[#7CB342] text-white font-semibold text-xs px-4 py-2.5 shrink-0 transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </footer>

      {/* =========================================================
          MODAL 1: CUSTOMER MEAL CUSTOMIZER MODAL (Order Customizer)
         ========================================================= */}
      {customizingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Top Dish Banner with Floating-In & Zero-Gravity Dish Animation */}
            <div className="relative h-48 bg-[#E8F3DC] flex items-center justify-center p-6 overflow-hidden">
              <div className="animate-zero-gravity">
                <img
                  key={customizingItem.id}
                  src={customizingItem.image}
                  alt={customizingItem.name}
                  className="w-36 h-36 rounded-full object-cover ring-4 ring-[#8BC34A] shadow-2xl animate-modal-dish-float"
                />
              </div>
              <button
                onClick={() => setCustomizingItem(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-800 flex items-center justify-center shadow"
              >
                <X className="w-5 h-5" />
              </button>
              <span className="absolute bottom-3 left-5 bg-[#8BC34A] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow">
                Customize Your Meal
              </span>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-black text-[#1A1A1A]">{customizingItem.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{customizingItem.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs text-gray-400 block">Base Price</span>
                  <span className="text-xl font-black text-[#7CB342]">
                    ${Number(customizingItem.price).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* 1. Portion Size Selector */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-2">
                  1. Select Portion Size
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { label: 'Regular', extra: 0 },
                    { label: 'Large', extra: 1.50 },
                    { label: 'Family', extra: 3.00 }
                  ].map((size) => (
                    <button
                      key={size.label}
                      type="button"
                      onClick={() => setPortionSize(size.label)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition flex flex-col items-center ${
                        portionSize === size.label
                          ? 'border-[#8BC34A] bg-[#F4F9EE] text-[#558B2F] ring-2 ring-[#8BC34A]/30'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <span>{size.label}</span>
                      <span className="text-[10px] font-normal text-gray-400 mt-0.5">
                        {size.extra === 0 ? 'Standard' : `+$${size.extra.toFixed(2)}`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Spice / Sweetness Level */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-2 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-orange-500" />
                  2. {customizingItem.isDessert ? 'Sweetness Level' : 'Spice & Seasoning Level'}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(customizingItem.isDessert
                    ? ['Light Sweet', 'Regular Sweet', 'Extra Rich', 'Sugar-Free']
                    : ['Mild', 'Medium', 'Spicy', 'Extra Hot']
                  ).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setSpiceLevel(level)}
                      className={`py-2 px-2 rounded-xl border text-xs font-semibold transition ${
                        spiceLevel === level
                          ? 'bg-[#8BC34A] text-white border-[#8BC34A]'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Custom Add-On Toppings & Extras */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-2">
                  3. Customize Add-On Toppings &amp; Extras
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(customizingItem.defaultAddons || [
                    'Extra Cheese',
                    'Avocado Slices',
                    'Fried Egg',
                    'Garlic Herb Sauce'
                  ]).map((addon) => {
                    const addonPrice = ADDON_PRICES[addon] || 0.75;
                    const isChecked = selectedAddons.includes(addon);
                    return (
                      <button
                        key={addon}
                        type="button"
                        onClick={() =>
                          setSelectedAddons((prev) =>
                            prev.includes(addon) ? prev.filter((a) => a !== addon) : [...prev, addon]
                          )
                        }
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-left text-xs transition ${
                          isChecked
                            ? 'border-[#8BC34A] bg-[#F4F9EE] font-semibold text-[#1A1A1A]'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded flex items-center justify-center ${
                              isChecked ? 'bg-[#8BC34A] text-white' : 'border border-gray-300'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3" />}
                          </div>
                          <span>{addon}</span>
                        </div>
                        <span className="text-[#558B2F] font-bold">+${addonPrice.toFixed(2)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Dietary & Ingredient Preferences */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-2">
                  4. Ingredient Tweaks (Free)
                </label>
                <div className="flex flex-wrap gap-2">
                  {['No Onions', 'Low Sodium', 'Sauce on Side', 'Gluten-Free Prep', 'Extra Fresh Herbs'].map(
                    (tag) => {
                      const active = dietaryTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() =>
                            setDietaryTags((prev) =>
                              prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
                            )
                          }
                          className={`px-3 py-1 rounded-full text-xs border transition ${
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
                  onChange={(e) => setSpecialNotes(e.target.value)}
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
                  onClick={() => setItemQty(Math.max(1, itemQty - 1))}
                  className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-bold w-4 text-center">{itemQty}</span>
                <button
                  type="button"
                  onClick={() => setItemQty(itemQty + 1)}
                  className="w-6 h-6 rounded-full bg-[#8BC34A] text-white flex items-center justify-center"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add Customized Item Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 py-3 px-6 rounded-full bg-[#8BC34A] hover:bg-[#7CB342] text-white font-bold text-sm shadow-lg transition flex items-center justify-between"
              >
                <span>Add Customized Meal</span>
                <span className="bg-white/20 px-3 py-0.5 rounded-full">
                  ${(calculatedUnitPrice * itemQty).toFixed(2)}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 2: WEBSITE MENU ITEM STUDIO (Edit or Add Food Items)
         ========================================================= */}
      {editingMenuCard && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <form
            onSubmit={handleSaveMenuCard}
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 my-8"
          >
            <div className="bg-[#1A2611] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#8BC34A]" />
                <h3 className="font-bold text-base">
                  {isAddingNewDish ? 'Add Custom Dish to Website' : `Customize Menu Card: ${editingMenuCard.name}`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingMenuCard(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              {/* Preview Circle */}
              <div className="flex items-center gap-4 bg-[#F4F9EE] p-3.5 rounded-2xl border border-[#C5E1A5]">
                <img
                  src={editingMenuCard.image}
                  alt={editingMenuCard.name}
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-[#8BC34A] bg-white shrink-0"
                />
                <div>
                  <span className="text-[11px] font-bold uppercase text-[#558B2F]">Live Card Preview</span>
                  <h4 className="text-base font-extrabold text-[#1A1A1A]">{editingMenuCard.name || 'Dish Name'}</h4>
                  <p className="text-xs font-bold text-[#7CB342]">
                    ${Number(editingMenuCard.price || 0).toFixed(2)} • {(editingMenuCard.section || 'regular').toUpperCase()} SECTION
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Dish Name</label>
                  <input
                    type="text"
                    required
                    value={editingMenuCard.name}
                    onChange={(e) => setEditingMenuCard({ ...editingMenuCard, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#8BC34A]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Base Price ($)</label>
                  <input
                    type="number"
                    step="0.10"
                    required
                    value={String(editingMenuCard.price)}
                    onChange={(e) =>
                      setEditingMenuCard({ ...editingMenuCard, price: Number(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#8BC34A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Website Section</label>
                  <select
                    value={editingMenuCard.section}
                    onChange={(e) => setEditingMenuCard({ ...editingMenuCard, section: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#8BC34A]"
                  >
                    <option value="featured">Top 4 Featured Arch Cards</option>
                    <option value="special">Special Menu (Asymmetric Cards)</option>
                    <option value="regular">Our Regular Food Grid</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category Filter Tag</label>
                  <input
                    type="text"
                    value={editingMenuCard.category}
                    onChange={(e) => setEditingMenuCard({ ...editingMenuCard, category: e.target.value })}
                    placeholder="Salads, Curry, Pasta, Desserts..."
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#8BC34A]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Description Text</label>
                <textarea
                  rows={2}
                  value={editingMenuCard.description}
                  onChange={(e) => setEditingMenuCard({ ...editingMenuCard, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#8BC34A]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Dish Image URL (Or pick a preset photo below)
                </label>
                <input
                  type="url"
                  required
                  value={editingMenuCard.image}
                  onChange={(e) => setEditingMenuCard({ ...editingMenuCard, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#8BC34A] mb-2"
                />
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_FOOD_IMAGES.map((img) => (
                    <button
                      key={img.label}
                      type="button"
                      onClick={() => setEditingMenuCard({ ...editingMenuCard, image: img.url })}
                      className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-[#E8F3DC] text-gray-700 text-[11px] font-medium transition"
                    >
                      {img.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Customizable Add-On Options (Comma separated)
                </label>
                <input
                  type="text"
                  value={editingMenuCard.addonsText}
                  onChange={(e) => setEditingMenuCard({ ...editingMenuCard, addonsText: e.target.value })}
                  placeholder="Extra Cheese, Avocado Slices, Fried Egg"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#8BC34A]"
                />
              </div>
            </div>

            <div className="p-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3">
              {!isAddingNewDish && (
                <button
                  type="button"
                  onClick={() => handleDeleteMenuCard(editingMenuCard.id, editingMenuCard.name)}
                  className="px-4 py-2.5 rounded-full bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Dish
                </button>
              )}
              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={() => setEditingMenuCard(null)}
                  className="px-5 py-2.5 rounded-full border border-gray-300 text-gray-600 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#8BC34A] hover:bg-[#7CB342] text-white font-bold text-xs shadow-md"
                >
                  Save to Website Menu
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* =========================================================
          SLIDE-OVER SHOPPING CART DRAWER
         ========================================================= */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#8BC34A]" />
                  <h3 className="text-lg font-black text-[#1A1A1A]">Your Customized Order</h3>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {orderPlacedSuccess ? (
                <div className="py-16 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#E8F3DC] text-[#558B2F] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="text-xl font-black text-[#1A1A1A]">Order Confirmed!</h4>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                    Our special chefs have received your customized food instructions and are preparing your fresh meal now.
                  </p>
                  <button
                    onClick={() => {
                      setOrderPlacedSuccess(false);
                      setIsCartOpen(false);
                    }}
                    className="px-6 py-2.5 rounded-full bg-[#8BC34A] text-white text-xs font-bold"
                  >
                    Back to Menu
                  </button>
                </div>
              ) : cart.length === 0 ? (
                <div className="py-20 text-center space-y-3">
                  <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto" />
                  <p className="text-sm font-bold text-gray-600">Your food bag is empty</p>
                  <p className="text-xs text-gray-400">
                    Click &ldquo;Buy Now&rdquo; on any dish to customize portions, spice levels, and toppings!
                  </p>
                </div>
              ) : (
                <div className="space-y-4 mt-5">
                  {cart.map((item) => (
                    <div
                      key={item.cartId}
                      className="p-3.5 rounded-2xl bg-[#FAFDF7] border border-[#E5F0DA] flex gap-3.5 items-start"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-full object-cover ring-2 ring-[#8BC34A] shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h4 className="font-extrabold text-sm text-[#1A1A1A]">{item.name}</h4>
                          <button
                            onClick={() => setCart((prev) => prev.filter((c) => c.cartId !== item.cartId))}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="text-[11px] text-[#558B2F] font-semibold mt-0.5">
                          {item.portion} • {item.spice}
                        </p>

                        {item.addons.length > 0 && (
                          <p className="text-[11px] text-gray-500 mt-1">
                            <span className="font-semibold text-gray-700">+ Add-ons:</span> {item.addons.join(', ')}
                          </p>
                        )}

                        {item.dietary.length > 0 && (
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            Prefs: {item.dietary.join(', ')}
                          </p>
                        )}

                        {item.notes && (
                          <p className="text-[10px] italic text-amber-700 bg-amber-50 px-2 py-0.5 rounded mt-1">
                            Note: &ldquo;{item.notes}&rdquo;
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-gray-200/60">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                setCart((prev) =>
                                  prev.map((c) =>
                                    c.cartId === item.cartId
                                      ? { ...c, quantity: Math.max(1, c.quantity - 1) }
                                      : c
                                  )
                                )
                              }
                              className="w-5 h-5 rounded-full bg-white border border-gray-300 flex items-center justify-center text-xs"
                            >
                              -
                            </button>
                            <span className="text-xs font-bold">{item.quantity}</span>
                            <button
                              onClick={() =>
                                setCart((prev) =>
                                  prev.map((c) =>
                                    c.cartId === item.cartId ? { ...c, quantity: c.quantity + 1 } : c
                                  )
                                )
                              }
                              className="w-5 h-5 rounded-full bg-[#8BC34A] text-white flex items-center justify-center text-xs"
                            >
                              +
                            </button>
                          </div>
                          <span className="text-sm font-extrabold text-[#1A1A1A]">
                            ${(item.unitPrice * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && !orderPlacedSuccess && (
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-800">${cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Express Delivery</span>
                  <span className="font-bold text-[#7CB342]">FREE</span>
                </div>
                <div className="flex justify-between text-base font-black text-[#1A1A1A] pt-2 border-t">
                  <span>Total</span>
                  <span className="text-[#7CB342]">${cartSubtotal.toFixed(2)}</span>
                </div>

                <button
                  onClick={() => {
                    setOrderPlacedSuccess(true);
                    setCart([]);
                  }}
                  className="w-full py-3.5 rounded-full bg-[#8BC34A] hover:bg-[#7CB342] text-white font-bold text-sm shadow-lg transition"
                >
                  Confirm &amp; Place Order (${cartSubtotal.toFixed(2)})
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}