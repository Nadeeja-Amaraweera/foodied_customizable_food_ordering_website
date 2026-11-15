export type MenuItem = {
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

export type HeroDish = {
  id: string;
  name: string;
  price: number;
  calories: string;
  image: string;
  desc: string;
};

export type CartItem = {
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

export type Chef = {
  id: number | string;
  name: string;
  role: string;
  specialty: string;
  image: string;
  offset?: boolean;
};

export type FloatingClone = {
  image: string;
  name: string;
  startX: number;
  startY: number;
};

export type User = {
    _id: string;
  email: string;
  roles: string[];
  username?: string;
};

