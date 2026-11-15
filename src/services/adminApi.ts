import {
  AdminOrder,
  AdminProduct,
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
  OrderStatus,
  STATS_DATA,
  STORE_SETTINGS_DATA,
  ADMIN_PROFILE_DATA,
  HOURLY_SALES_DATA,
  CATEGORY_DISTRIBUTION_DATA
} from '../data/adminMockData';

// Storage keys for persisting local demo updates
const STORAGE_KEYS = {
  ORDERS: 'foodied_admin_orders_v1',
  PRODUCTS: 'foodied_admin_products_v1',
  SETTINGS: 'foodied_admin_settings_v1',
};

// Helper to get or seed data
function getPersistedData<T>(key: string, defaultData: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
  } catch (e) {
    console.warn(`[adminApi] Failed to read ${key} from storage, using defaults`, e);
  }
  return defaultData;
}

function setPersistedData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`[adminApi] Failed to write ${key} to storage`, e);
  }
}

/**
 * Admin API Service
 * Clean service layer that can be swapped with real axios / fetch calls.
 */
export const adminApi = {
  // Stats
  async getDashboardMetrics() {
    // Simulated API call latency
    await new Promise((res) => setTimeout(res, 120));
    const orders = await this.getOrders();
    const products = await this.getProducts();

    const pendingCount = orders.filter((o) => o.status === 'new' || o.status === 'preparing').length;
    const totalRevenue = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    return {
      stats: [
        {
          ...STATS_DATA[0],
          value: orders.length.toString(),
        },
        {
          ...STATS_DATA[1],
          value: pendingCount.toString(),
          change: `${pendingCount} orders in kitchen queue`,
          isPositive: pendingCount < 5,
        },
        {
          ...STATS_DATA[2],
          value: products.length.toString(),
          subtitle: `${products.filter((p) => p.isAvailable).length} active & in stock`,
        },
        {
          ...STATS_DATA[3],
          value: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        },
      ],
      hourlySales: HOURLY_SALES_DATA,
      categoryDistribution: CATEGORY_DISTRIBUTION_DATA,
      recentActivity: orders.slice(0, 5),
    };
  },

  // Orders
  async getOrders(): Promise<AdminOrder[]> {
    return getPersistedData<AdminOrder[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  },

  async getOrderById(id: string): Promise<AdminOrder | null> {
    const orders = await this.getOrders();
    return orders.find((o) => o.id === id || o.orderNumber === id) || null;
  },

  async updateOrderStatus(id: string, newStatus: OrderStatus): Promise<AdminOrder> {
    const orders = await this.getOrders();
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) throw new Error(`Order ${id} not found`);

    const updated = {
      ...orders[index],
      status: newStatus,
      timeAgo: 'Just now',
    };
    orders[index] = updated;
    setPersistedData(STORAGE_KEYS.ORDERS, orders);
    return updated;
  },

  // Products
  async getProducts(): Promise<AdminProduct[]> {
    return getPersistedData<AdminProduct[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  },

  async createProduct(productData: Omit<AdminProduct, 'id' | 'createdAt' | 'rating'>): Promise<AdminProduct> {
    const products = await this.getProducts();
    const newProduct: AdminProduct = {
      ...productData,
      id: `prod-${Date.now()}`,
      rating: 5.0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updatedList = [newProduct, ...products];
    setPersistedData(STORAGE_KEYS.PRODUCTS, updatedList);
    return newProduct;
  },

  async updateProduct(id: string, updates: Partial<AdminProduct>): Promise<AdminProduct> {
    const products = await this.getProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error(`Product ${id} not found`);

    const updated = { ...products[index], ...updates };
    products[index] = updated;
    setPersistedData(STORAGE_KEYS.PRODUCTS, products);
    return updated;
  },

  async deleteProduct(id: string): Promise<void> {
    const products = await this.getProducts();
    const filtered = products.filter((p) => p.id !== id);
    setPersistedData(STORAGE_KEYS.PRODUCTS, filtered);
  },

  // Settings
  async getStoreSettings() {
    return getPersistedData(STORAGE_KEYS.SETTINGS, STORE_SETTINGS_DATA);
  },

  async updateStoreSettings(newSettings: Partial<typeof STORE_SETTINGS_DATA>) {
    const current = await this.getStoreSettings();
    const updated = { ...current, ...newSettings };
    setPersistedData(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  },

  // Admin Profile
  async getAdminProfile() {
    return ADMIN_PROFILE_DATA;
  },

  // Reset to initial mock data (handy for testing)
  resetDemoData() {
    setPersistedData(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    setPersistedData(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    setPersistedData(STORAGE_KEYS.SETTINGS, STORE_SETTINGS_DATA);
  }
};

