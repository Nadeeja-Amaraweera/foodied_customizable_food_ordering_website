import api from './api';
import { AdminOrder } from '../data/adminMockData';

export interface OrderCustomizationPayload {
  size?: string;
  spiceLevel?: string;
  extras?: string[];
  dietary?: string[];
  specialInstructions?: string;
}

export interface OrderItemPayload {
  productId: string;
  name?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  image?: string;
  customization?: OrderCustomizationPayload;
}

export interface CustomerPayload {
  name: string;
  phone?: string;
  email?: string;
  deliveryAddress?: string;
  customerType?: 'New' | 'Returning' | 'VIP';
}

export interface CreateOrderPayload {
  items: OrderItemPayload[];
  customer?: CustomerPayload;
  subtotal: number;
  deliveryFee?: number;
  tax?: number;
  totalAmount: number;
  paymentMethod?: string;
  notes?: string;
}

export interface ValidatePricePayload {
  productId: string;
  quantity?: number;
  customization?: OrderCustomizationPayload;
  unitPrice?: number;
  totalPrice?: number;
}

export const orderApi = {
  /**
   * Validate customized product price against backend MongoDB database
   */
  async validatePrice(payload: ValidatePricePayload) {
    const res = await api.post('/orders/validate-price', payload);
    return res.data;
  },

  /**
   * Submit an order with backend price validation
   */
  async createOrder(payload: CreateOrderPayload) {
    const res = await api.post('/orders', payload);
    return res.data;
  },

  /**
   * Fetch all orders (for Admin Dashboard)
   */
  async getOrders(params?: { status?: string }): Promise<AdminOrder[]> {
    const res = await api.get('/orders', { params });
    return res.data.data || [];
  },

  /**
   * Fetch a single order by ID
   */
  async getOrderById(id: string): Promise<AdminOrder> {
    const res = await api.get(`/orders/${id}`);
    return res.data.data;
  },

  /**
   * Update order status (for Admin Dashboard)
   */
  async updateOrderStatus(id: string, status: string): Promise<AdminOrder> {
    const res = await api.patch(`/orders/${id}/status`, { status });
    return res.data.data;
  },
};

export default orderApi;

