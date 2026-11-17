import api from "./api";
import { AdminProduct } from "../data/adminMockData";

export interface GetProductsParams {
  category?: string;
  search?: string;
}

export const adminProductApi = {
  /**
   * Fetch all products from the backend with optional category and search filters
   */
  async getProducts(params?: GetProductsParams): Promise<AdminProduct[]> {
    const queryParams: Record<string, string> = {};
    if (params?.category && params.category !== "All") {
      queryParams.category = params.category;
    }
    if (params?.search && params.search.trim()) {
      queryParams.search = params.search.trim();
    }

    const res = await api.get("/products", { params: queryParams });
    return res.data.data || [];
  },

  /**
   * Retrieve a single product by ID
   */
  async getProductById(id: string): Promise<AdminProduct> {
    const res = await api.get(`/products/${id}`);
    return res.data.data;
  },

  /**
   * Create a new product with multipart/form-data (image + fields)
   */
  async createProduct(formData: FormData): Promise<AdminProduct> {
    // Let browser/axios set boundary automatically
    const res = await api.post("/products", formData);
    return res.data.data;
  },

  /**
   * Update an existing product with multipart/form-data
   */
  async updateProduct(id: string, formData: FormData): Promise<AdminProduct> {
    const res = await api.put(`/products/${id}`, formData);
    return res.data.data;
  },

  /**
   * Toggle or update product availability
   */
  async updateProductAvailability(id: string, isAvailable?: boolean): Promise<AdminProduct> {
    const payload = isAvailable !== undefined ? { isAvailable } : {};
    const res = await api.patch(`/products/${id}/availability`, payload);
    return res.data.data;
  },

  /**
   * Delete a product by ID
   */
  async deleteProduct(id: string): Promise<{ id: string }> {
    const res = await api.delete(`/products/${id}`);
    return res.data.data;
  },
};

export default adminProductApi;
