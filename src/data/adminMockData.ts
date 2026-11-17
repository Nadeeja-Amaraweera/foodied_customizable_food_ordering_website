export interface CustomizationOption {
  name: string;
  priceModifier: number;
}

export interface ProductCustomizationConfig {
  sizes: CustomizationOption[];
  extras: CustomizationOption[];
  spiceLevels: string[];
}

export interface AdminProduct {
  _id?: string;
  id?: string;
  name: string;
  category: 'Pizza' | 'Burger' | 'Bowls & Salads' | 'Pasta' | 'Desserts' | 'Beverages';
  price: number;
  description: string;
  image: string;
  isAvailable: boolean;
  preparationTime: string; // e.g. "15-20 min"
  rating?: number;
  customization: ProductCustomizationConfig;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItemCustomization {
  size?: string;
  spiceLevel?: string;
  extras?: string[];
  specialInstructions?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  image: string;
  customization: OrderItemCustomization;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  deliveryAddress: string;
  customerType: 'New' | 'Returning' | 'VIP';
}

export type OrderStatus = 'new' | 'preparing' | 'confirmed' | 'delivered' | 'cancelled';

export interface AdminOrder {
  id: string;
  orderNumber: string; // e.g. "ORD-9421"
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: 'Credit Card' | 'Apple Pay' | 'Google Pay' | 'Cash on Delivery';
  paymentStatus: 'Paid' | 'Pending';
  placedAt: string; // e.g. "2026-11-15T19:20:00Z"
  timeAgo: string;  // e.g. "4 mins ago"
  estimatedReadyTime: string; // e.g. "15-20 mins"
  notes?: string;
}

export interface StatMetric {
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  subtitle: string;
  iconName: 'shopping-bag' | 'clock' | 'utensils' | 'dollar-sign';
}

export interface SalesChartPoint {
  time: string;
  orders: number;
  revenue: number;
}

export interface CategoryDistribution {
  category: string;
  percentage: number;
  orders: number;
  color: string;
}

export const INITIAL_PRODUCTS: AdminProduct[] = [
  {
    id: 'prod-1',
    name: 'Artisan Truffle Beef Burger',
    category: 'Burger',
    price: 14.50,
    description: 'Juicy Angus patty, black truffle mayo, caramelized onion jam, melted aged cheddar, and wild arugula on a toasted brioche bun.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    preparationTime: '15-20 min',
    rating: 4.9,
    customization: {
      sizes: [
        { name: 'Single Patty (180g)', priceModifier: 0 },
        { name: 'Double Patty (360g)', priceModifier: 4.50 },
        { name: 'Triple Monster (540g)', priceModifier: 8.00 },
      ],
      spiceLevels: ['Zero Spice', 'Mild Jalapeño', 'Medium Chipotle', 'Carolina Heat 🔥'],
      extras: [
        { name: 'Smoked Crispy Bacon', priceModifier: 2.20 },
        { name: 'Extra Aged Cheddar', priceModifier: 1.50 },
        { name: 'Truffle Glazed Mushrooms', priceModifier: 2.00 },
        { name: 'Fried Farm Egg', priceModifier: 1.75 },
      ]
    },
    createdAt: '2026-11-01'
  },
  {
    id: 'prod-2',
    name: 'Custom Woodfired Neapolitan Pizza',
    category: 'Pizza',
    price: 16.90,
    description: '24-hour cold fermented sourdough crust, San Marzano tomato sauce, fresh buffalo mozzarella, and aromatic fresh basil.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    preparationTime: '18-22 min',
    rating: 4.8,
    customization: {
      sizes: [
        { name: 'Personal (10")', priceModifier: 0 },
        { name: 'Medium (12")', priceModifier: 3.50 },
        { name: 'Family (16")', priceModifier: 6.50 },
      ],
      spiceLevels: ['No Spice', 'Chili Flakes', 'Calabrian Chili Oil 🌶️', 'Hot Honey Inferno 🔥'],
      extras: [
        { name: 'Spicy Pepperoni Cups', priceModifier: 2.50 },
        { name: 'Creamy Burrata Ball', priceModifier: 3.50 },
        { name: 'Garlic Stuffed Crust', priceModifier: 2.00 },
        { name: 'Kalamata Olives & Basil', priceModifier: 1.50 },
      ]
    },
    createdAt: '2026-11-03'
  },
  {
    id: 'prod-3',
    name: 'Rainbow Teriyaki Salmon Poké Bowl',
    category: 'Bowls & Salads',
    price: 15.20,
    description: 'Sashimi-grade salmon glazed in house teriyaki sauce over fluffy sushi rice, avocado roses, edamame, seaweed salad, and pickled ginger.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    preparationTime: '10-15 min',
    rating: 4.9,
    customization: {
      sizes: [
        { name: 'Regular Bowl', priceModifier: 0 },
        { name: 'Large Protein Boost', priceModifier: 4.00 },
      ],
      spiceLevels: ['Original Shoyu', 'Mild Wasabi Cream', 'Spicy Sriracha Mayo 🌶️', 'Dynamite Volcano 🔥'],
      extras: [
        { name: 'Extra Salmon Scoop', priceModifier: 3.80 },
        { name: 'Fresh Hass Avocado Half', priceModifier: 1.90 },
        { name: 'Crispy Fried Onions & Furikake', priceModifier: 1.00 },
        { name: 'Mango Cubes', priceModifier: 1.50 },
      ]
    },
    createdAt: '2026-11-05'
  },
  {
    id: 'prod-4',
    name: 'Creamy Garlic Prawn Linguine',
    category: 'Pasta',
    price: 17.50,
    description: 'Wild tiger prawns pan-seared with confit garlic, heirloom cherry tomatoes, white wine reduction, and finished with parmigiano reggiano.',
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281051?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    preparationTime: '15-20 min',
    rating: 4.7,
    customization: {
      sizes: [
        { name: 'Standard Portion', priceModifier: 0 },
        { name: 'Grande Chef Feast', priceModifier: 4.20 },
      ],
      spiceLevels: ['Mellow & Creamy', 'Pinch of Chili', 'Spicy Fra Diavolo 🌶️'],
      extras: [
        { name: 'Extra 4 Tiger Prawns', priceModifier: 4.50 },
        { name: 'Toasted Garlic Herb Focaccia', priceModifier: 2.20 },
        { name: 'Gluten-Free Penne Swap', priceModifier: 1.50 },
        { name: 'Shaved Black Truffle', priceModifier: 4.00 },
      ]
    },
    createdAt: '2026-11-06'
  },
  {
    id: 'prod-5',
    name: 'Smoky BBQ Smash Burger',
    category: 'Burger',
    price: 13.90,
    description: 'Crispy lace-edge double smash beef patties, Texas hickory BBQ sauce, beer-battered onion rings, and smoked provolone.',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    preparationTime: '12-16 min',
    rating: 4.8,
    customization: {
      sizes: [
        { name: 'Double Smash (2 patties)', priceModifier: 0 },
        { name: 'Triple Smash (3 patties)', priceModifier: 3.50 },
      ],
      spiceLevels: ['Sweet BBQ', 'Tangy Spicy BBQ 🌶️', 'Ghost Pepper Smoky BBQ 🔥'],
      extras: [
        { name: 'Crispy Onion Strings', priceModifier: 1.20 },
        { name: 'Applewood Bacon Rashers', priceModifier: 2.00 },
        { name: 'Pickled Jalapeños', priceModifier: 0.90 },
      ]
    },
    createdAt: '2026-11-08'
  },
  {
    id: 'prod-6',
    name: 'Molten Belgian Chocolate Lava Cake',
    category: 'Desserts',
    price: 8.50,
    description: 'Warm dark chocolate sponge cake with an oozing Belgian cocoa center, served with Madagascan vanilla bean gelato.',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    preparationTime: '10-12 min',
    rating: 4.9,
    customization: {
      sizes: [
        { name: 'Single Serving', priceModifier: 0 },
        { name: 'Double Lava Sharing', priceModifier: 6.00 },
      ],
      spiceLevels: ['Classic Sweet'],
      extras: [
        { name: 'Extra Vanilla Gelato Scoop', priceModifier: 2.20 },
        { name: 'Salted Caramel Drizzle', priceModifier: 1.00 },
        { name: 'Crushed Hazelnut Topping', priceModifier: 1.20 },
      ]
    },
    createdAt: '2026-11-09'
  },
  {
    id: 'prod-7',
    name: 'Sparkling Dragonfruit Yuzu Iced Cooler',
    category: 'Beverages',
    price: 5.80,
    description: 'Hand-crushed pink dragonfruit, Japanese yuzu citrus extract, sparkling mineral water, fresh mint leaves, and chia seeds.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    preparationTime: '5-7 min',
    rating: 4.6,
    customization: {
      sizes: [
        { name: 'Medium (16 oz)', priceModifier: 0 },
        { name: 'Large (24 oz)', priceModifier: 1.50 },
      ],
      spiceLevels: ['No Ice', 'Normal Ice', 'Extra Chilled'],
      extras: [
        { name: 'Popping Mango Boba', priceModifier: 1.20 },
        { name: 'Aloe Vera Jelly Bites', priceModifier: 1.00 },
        { name: 'Organic Honey Sweetener', priceModifier: 0.80 },
      ]
    },
    createdAt: '2026-11-10'
  },
  {
    id: 'prod-8',
    name: 'Four-Cheese Truffle White Pizza',
    category: 'Pizza',
    price: 18.20,
    description: 'Garlic cream base, Fior di Latte mozzarella, gorgonzola dolce, fontina, shaved pecorino, and wild white truffle oil drizzle.',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80',
    isAvailable: false,
    preparationTime: '18-22 min',
    rating: 4.7,
    customization: {
      sizes: [
        { name: 'Personal (10")', priceModifier: 0 },
        { name: 'Medium (12")', priceModifier: 3.50 },
        { name: 'Family (16")', priceModifier: 6.50 },
      ],
      spiceLevels: ['Mild Creamy', 'Hot Honey Drizzle 🍯🌶️'],
      extras: [
        { name: 'Prosciutto di Parma', priceModifier: 3.50 },
        { name: 'Caramelized Fig Slices', priceModifier: 2.00 },
        { name: 'Arugula & Balsamic Glaze', priceModifier: 1.80 },
      ]
    },
    createdAt: '2026-11-11'
  }
];

export const INITIAL_ORDERS: AdminOrder[] = [
  {
    id: 'ord-101',
    orderNumber: 'ORD-9482',
    customer: {
      name: 'Sophia Martinez',
      phone: '+1 (555) 234-8910',
      email: 'sophia.m@example.com',
      deliveryAddress: '742 Evergreen Terrace, Suite 4B, Springfield',
      customerType: 'VIP'
    },
    items: [
      {
        id: 'item-1',
        productId: 'prod-1',
        name: 'Artisan Truffle Beef Burger',
        quantity: 2,
        unitPrice: 18.20,
        totalPrice: 36.40,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=200&q=80',
        customization: {
          size: 'Double Patty (360g) (+$4.50)',
          spiceLevel: 'Medium Chipotle 🌶️',
          extras: ['Smoked Crispy Bacon (+$2.20)', 'Extra Aged Cheddar (+$1.50)'],
          specialInstructions: 'Please toast the buns extra crispy and pack sauce on the side.'
        }
      },
      {
        id: 'item-2',
        productId: 'prod-7',
        name: 'Sparkling Dragonfruit Yuzu Cooler',
        quantity: 2,
        unitPrice: 7.00,
        totalPrice: 14.00,
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=200&q=80',
        customization: {
          size: 'Large (24 oz) (+$1.50)',
          spiceLevel: 'Normal Ice',
          extras: ['Popping Mango Boba (+$1.20)'],
          specialInstructions: 'Eco paper straws please.'
        }
      }
    ],
    subtotal: 50.40,
    deliveryFee: 3.50,
    tax: 4.28,
    totalAmount: 58.18,
    status: 'new',
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid',
    placedAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    timeAgo: '3 mins ago',
    estimatedReadyTime: '15-20 mins',
    notes: 'Gate code #4491. Leave on doorstep table.'
  },
  {
    id: 'ord-102',
    orderNumber: 'ORD-9481',
    customer: {
      name: 'Alexander Chen',
      phone: '+1 (555) 789-3214',
      email: 'a.chen@techfirm.org',
      deliveryAddress: '120 Silicon Boulevard, Floor 8, San Jose',
      customerType: 'Returning'
    },
    items: [
      {
        id: 'item-3',
        productId: 'prod-2',
        name: 'Custom Woodfired Neapolitan Pizza',
        quantity: 1,
        unitPrice: 24.90,
        totalPrice: 24.90,
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=200&q=80',
        customization: {
          size: 'Family (16") (+$6.50)',
          spiceLevel: 'Hot Honey Inferno 🔥 (+$1.50)',
          extras: ['Spicy Pepperoni Cups (+$2.50)', 'Creamy Burrata Ball (+$3.50)', 'Garlic Stuffed Crust (+$2.00)'],
          specialInstructions: 'Square party cuts please!'
        }
      },
      {
        id: 'item-4',
        productId: 'prod-6',
        name: 'Molten Belgian Chocolate Lava Cake',
        quantity: 2,
        unitPrice: 10.70,
        totalPrice: 21.40,
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=200&q=80',
        customization: {
          size: 'Single Serving',
          extras: ['Extra Vanilla Gelato Scoop (+$2.20)', 'Salted Caramel Drizzle (+$1.00)']
        }
      }
    ],
    subtotal: 46.30,
    deliveryFee: 4.00,
    tax: 3.94,
    totalAmount: 54.24,
    status: 'new',
    paymentMethod: 'Apple Pay',
    paymentStatus: 'Paid',
    placedAt: new Date(Date.now() - 7 * 60 * 1000).toISOString(),
    timeAgo: '7 mins ago',
    estimatedReadyTime: '20-25 mins',
    notes: 'Office reception will receive the package.'
  },
  {
    id: 'ord-103',
    orderNumber: 'ORD-9480',
    customer: {
      name: 'Emma Watson-Blake',
      phone: '+1 (555) 456-1122',
      email: 'emma.blake@icloud.com',
      deliveryAddress: '315 Magnolia Lane, Apt 2C, Riverdale',
      customerType: 'New'
    },
    items: [
      {
        id: 'item-5',
        productId: 'prod-3',
        name: 'Rainbow Teriyaki Salmon Poké Bowl',
        quantity: 1,
        unitPrice: 19.20,
        totalPrice: 19.20,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80',
        customization: {
          size: 'Large Protein Boost (+$4.00)',
          spiceLevel: 'Spicy Sriracha Mayo 🌶️',
          extras: ['Fresh Hass Avocado Half (+$1.90)', 'Crispy Fried Onions & Furikake (+$1.00)'],
          specialInstructions: 'No sesame oil due to allergy.'
        }
      }
    ],
    subtotal: 19.20,
    deliveryFee: 2.99,
    tax: 1.63,
    totalAmount: 23.82,
    status: 'preparing',
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid',
    placedAt: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
    timeAgo: '14 mins ago',
    estimatedReadyTime: '10-15 mins'
  },
  {
    id: 'ord-104',
    orderNumber: 'ORD-9479',
    customer: {
      name: 'Marcus Brody',
      phone: '+1 (555) 987-6543',
      email: 'm.brody@gmail.com',
      deliveryAddress: '88 Harbor Street, Penthouse 11, Bayview',
      customerType: 'VIP'
    },
    items: [
      {
        id: 'item-6',
        productId: 'prod-4',
        name: 'Creamy Garlic Prawn Linguine',
        quantity: 2,
        unitPrice: 22.00,
        totalPrice: 44.00,
        image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281051?auto=format&fit=crop&w=200&q=80',
        customization: {
          size: 'Grande Chef Feast (+$4.20)',
          spiceLevel: 'Spicy Fra Diavolo 🌶️',
          extras: ['Extra 4 Tiger Prawns (+$4.50)', 'Toasted Garlic Herb Focaccia (+$2.20)'],
          specialInstructions: 'Heavy on fresh parmesan.'
        }
      },
      {
        id: 'item-7',
        productId: 'prod-7',
        name: 'Sparkling Dragonfruit Yuzu Cooler',
        quantity: 2,
        unitPrice: 5.80,
        totalPrice: 11.60,
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=200&q=80',
        customization: {
          size: 'Medium (16 oz)',
          spiceLevel: 'Extra Chilled',
          extras: ['Aloe Vera Jelly Bites (+$1.00)']
        }
      }
    ],
    subtotal: 55.60,
    deliveryFee: 4.50,
    tax: 4.73,
    totalAmount: 64.83,
    status: 'preparing',
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid',
    placedAt: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
    timeAgo: '22 mins ago',
    estimatedReadyTime: '8-10 mins'
  },
  {
    id: 'ord-105',
    orderNumber: 'ORD-9478',
    customer: {
      name: 'Jessica Vance',
      phone: '+1 (555) 678-9012',
      email: 'jess.vance@outlook.com',
      deliveryAddress: '420 Oak Ridge Court, Apartment 3A, Denver',
      customerType: 'Returning'
    },
    items: [
      {
        id: 'item-8',
        productId: 'prod-5',
        name: 'Smoky BBQ Smash Burger',
        quantity: 1,
        unitPrice: 15.90,
        totalPrice: 15.90,
        image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=200&q=80',
        customization: {
          size: 'Double Smash (2 patties)',
          spiceLevel: 'Tangy Spicy BBQ 🌶️',
          extras: ['Applewood Bacon Rashers (+$2.00)', 'Pickled Jalapeños (+$0.90)'],
          specialInstructions: 'Extra napkins please.'
        }
      }
    ],
    subtotal: 15.90,
    deliveryFee: 3.50,
    tax: 1.35,
    totalAmount: 20.75,
    status: 'confirmed',
    paymentMethod: 'Google Pay',
    paymentStatus: 'Paid',
    placedAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    timeAgo: '35 mins ago',
    estimatedReadyTime: 'Completed'
  },
  {
    id: 'ord-106',
    orderNumber: 'ORD-9477',
    customer: {
      name: 'David Reynolds',
      phone: '+1 (555) 345-6789',
      email: 'dreynolds@fastmail.com',
      deliveryAddress: '55 Pine Needle Way, Bellevue',
      customerType: 'Returning'
    },
    items: [
      {
        id: 'item-9',
        productId: 'prod-2',
        name: 'Custom Woodfired Neapolitan Pizza',
        quantity: 2,
        unitPrice: 20.40,
        totalPrice: 40.80,
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=200&q=80',
        customization: {
          size: 'Medium (12") (+$3.50)',
          spiceLevel: 'Chili Flakes',
          extras: ['Spicy Pepperoni Cups (+$2.50)'],
        }
      }
    ],
    subtotal: 40.80,
    deliveryFee: 3.00,
    tax: 3.47,
    totalAmount: 47.27,
    status: 'delivered',
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid',
    placedAt: new Date(Date.now() - 65 * 60 * 1000).toISOString(),
    timeAgo: '1 hour ago',
    estimatedReadyTime: 'Delivered'
  },
  {
    id: 'ord-107',
    orderNumber: 'ORD-9476',
    customer: {
      name: 'Chloe Lancaster',
      phone: '+1 (555) 890-1234',
      email: 'chloe.l@designer.co',
      deliveryAddress: '19 Kensington Crescent, Loft 4, Chicago',
      customerType: 'VIP'
    },
    items: [
      {
        id: 'item-10',
        productId: 'prod-3',
        name: 'Rainbow Teriyaki Salmon Poké Bowl',
        quantity: 1,
        unitPrice: 16.70,
        totalPrice: 16.70,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80',
        customization: {
          size: 'Regular Bowl',
          spiceLevel: 'Mild Wasabi Cream',
          extras: ['Fresh Hass Avocado Half (+$1.90)', 'Mango Cubes (+$1.50)']
        }
      },
      {
        id: 'item-11',
        productId: 'prod-7',
        name: 'Sparkling Dragonfruit Yuzu Cooler',
        quantity: 1,
        unitPrice: 6.80,
        totalPrice: 6.80,
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=200&q=80',
        customization: {
          size: 'Medium (16 oz)',
          spiceLevel: 'Normal Ice',
          extras: ['Popping Mango Boba (+$1.20)']
        }
      }
    ],
    subtotal: 23.50,
    deliveryFee: 3.50,
    tax: 2.00,
    totalAmount: 29.00,
    status: 'delivered',
    paymentMethod: 'Apple Pay',
    paymentStatus: 'Paid',
    placedAt: new Date(Date.now() - 95 * 60 * 1000).toISOString(),
    timeAgo: '1.5 hours ago',
    estimatedReadyTime: 'Delivered'
  },
  {
    id: 'ord-108',
    orderNumber: 'ORD-9475',
    customer: {
      name: 'Ryan Gallagher',
      phone: '+1 (555) 231-9988',
      email: 'ryan.g@techhub.net',
      deliveryAddress: '800 Maple Avenue, Austin, TX',
      customerType: 'New'
    },
    items: [
      {
        id: 'item-12',
        productId: 'prod-1',
        name: 'Artisan Truffle Beef Burger',
        quantity: 1,
        unitPrice: 16.50,
        totalPrice: 16.50,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=200&q=80',
        customization: {
          size: 'Single Patty (180g)',
          spiceLevel: 'Zero Spice',
          extras: ['Fried Farm Egg (+$1.75)']
        }
      }
    ],
    subtotal: 16.50,
    deliveryFee: 3.00,
    tax: 1.40,
    totalAmount: 20.90,
    status: 'cancelled',
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Pending',
    placedAt: new Date(Date.now() - 130 * 60 * 1000).toISOString(),
    timeAgo: '2 hours ago',
    estimatedReadyTime: 'Cancelled by customer',
    notes: 'Customer cancelled prior to preparation.'
  }
];

export const STATS_DATA: StatMetric[] = [
  {
    title: 'Total Orders',
    value: '148',
    change: '+14.2% vs yesterday',
    isPositive: true,
    subtitle: '12 orders currently active',
    iconName: 'shopping-bag'
  },
  {
    title: 'Pending Orders',
    value: '6',
    change: '4 need immediate action',
    isPositive: false,
    subtitle: 'Avg wait time: 4.2 min',
    iconName: 'clock'
  },
  {
    title: 'Menu Products',
    value: '38',
    change: '+2 added this week',
    isPositive: true,
    subtitle: '34 active & in stock',
    iconName: 'utensils'
  },
  {
    title: "Today's Revenue",
    value: '$2,845.60',
    change: '+18.6% vs last Sunday',
    isPositive: true,
    subtitle: 'Net margin approx 68%',
    iconName: 'dollar-sign'
  }
];

export const HOURLY_SALES_DATA: SalesChartPoint[] = [
  { time: '10:00', orders: 4, revenue: 85 },
  { time: '11:00', orders: 9, revenue: 195 },
  { time: '12:00', orders: 24, revenue: 540 },
  { time: '13:00', orders: 32, revenue: 710 },
  { time: '14:00', orders: 16, revenue: 340 },
  { time: '15:00', orders: 8, revenue: 160 },
  { time: '16:00', orders: 12, revenue: 260 },
  { time: '17:00', orders: 19, revenue: 420 },
  { time: '18:00', orders: 28, revenue: 645 },
  { time: '19:00', orders: 35, revenue: 810 },
  { time: '20:00', orders: 26, revenue: 590 },
  { time: '21:00', orders: 14, revenue: 310 },
];

export const CATEGORY_DISTRIBUTION_DATA: CategoryDistribution[] = [
  { category: 'Pizza', percentage: 38, orders: 56, color: '#FF6B35' },
  { category: 'Burger', percentage: 28, orders: 42, color: '#F7931E' },
  { category: 'Bowls & Salads', percentage: 16, orders: 24, color: '#2EC4B6' },
  { category: 'Pasta', percentage: 10, orders: 15, color: '#06D6A0' },
  { category: 'Desserts & Drinks', percentage: 8, orders: 11, color: '#FFB703' }
];

export const STORE_SETTINGS_DATA = {
  storeName: 'Foodied Artisanal Kitchen',
  storeTagline: 'Handcrafted, 100% Customizable Gourmet Foods',
  contactEmail: 'admin@foodiedkitchen.com',
  contactPhone: '+1 (555) 839-2041',
  currency: 'USD ($)',
  taxRatePercent: 8.5,
  defaultDeliveryFee: 3.50,
  freeDeliveryThreshold: 45.00,
  orderEstimatedPrepMinutes: 20,
  autoConfirmOrders: false,
  soundAlertsEnabled: true,
  emailNotifications: true,
  smsNotifications: false,
  openingHours: '10:30 AM',
  closingHours: '10:30 PM',
  isStoreOpen: true,
  deliveryRadiusKm: 15
};

export const ADMIN_PROFILE_DATA = {
  name: 'Chef Marcus Sterling',
  role: 'Head of Operations & Kitchen Manager',
  email: 'marcus.sterling@foodiedkitchen.com',
  avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=250&q=80',
  badge: 'Super Admin',
  joinedDate: 'Jan 2025'
};

