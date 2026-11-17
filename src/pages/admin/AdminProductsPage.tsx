import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Plus,
  Search,
  Filter,
  UtensilsCrossed,
  Sparkles,
  Layers,
  Flame,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  RefreshCw,
  Inbox
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { ProductCard } from '../../components/admin/ProductCard';
import { ProductModal } from '../../components/admin/ProductModal';
import { Modal } from '../../components/admin/Modal';
import { Button } from '../../components/admin/Button';
import { adminProductApi } from '../../services/adminApi';
import { AdminProduct } from '../../data/adminMockData';
import { useToast } from '../../context/ToastContext';

const CATEGORIES = [
  'All',
  'Burger',
  'Pizza',
  'Bowls & Salads',
  'Pasta',
  'Desserts',
  'Beverages',
] as const;

export const AdminProductsPage: React.FC = () => {
  const { showToast } = useToast();

  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modals
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<AdminProduct | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingAvailabilityId, setUpdatingAvailabilityId] = useState<string | null>(null);

  const fetchProducts = useCallback(async (showFullLoader = false) => {
    if (showFullLoader) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }

    try {
      const data = await adminProductApi.getProducts();
      setProducts(data);
    } catch (err: any) {
      console.error('[AdminProductsPage] Fetch error:', err);
      const msg = err.response?.data?.message || 'Failed to load menu products from backend';
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchProducts(true);
  }, [fetchProducts]);

  // Client-side filtering across the fetched products for instant response
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
        return true;
      })
      .filter((p) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
      });
  }, [products, selectedCategory, searchQuery]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: products.length };
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsAddEditModalOpen(true);
  };

  const handleOpenEditModal = (product: AdminProduct) => {
    setEditingProduct(product);
    setIsAddEditModalOpen(true);
  };

  const handleSaveProduct = async (formData: FormData, editId?: string) => {
    try {
      if (editId) {
        const updated = await adminProductApi.updateProduct(editId, formData);
        setProducts((prev) =>
          prev.map((p) => ((p._id || p.id) === editId ? updated : p))
        );
        showToast(`"${updated.name}" updated successfully!`, 'success', 'Product Updated');
      } else {
        const created = await adminProductApi.createProduct(formData);
        setProducts((prev) => [created, ...prev]);
        showToast(`"${created.name}" created and added to menu!`, 'success', 'Product Created');
      }
    } catch (err: any) {
      // Re-throw so modal can catch and display inline error
      throw err;
    }
  };

  const handleToggleAvailability = async (product: AdminProduct) => {
    const productId = product._id || product.id;
    if (!productId) return;

    setUpdatingAvailabilityId(productId);
    const targetStatus = !product.isAvailable;

    // Optimistic UI update
    setProducts((prev) =>
      prev.map((p) =>
        (p._id || p.id) === productId ? { ...p, isAvailable: targetStatus } : p
      )
    );

    try {
      const updated = await adminProductApi.updateProductAvailability(productId, targetStatus);
      setProducts((prev) =>
        prev.map((p) => ((p._id || p.id) === productId ? updated : p))
      );
      showToast(
        `"${product.name}" is now ${updated.isAvailable ? 'In Stock' : 'Marked Sold Out'}`,
        updated.isAvailable ? 'success' : 'info'
      );
    } catch (err: any) {
      // Revert optimistic update
      setProducts((prev) =>
        prev.map((p) =>
          (p._id || p.id) === productId ? { ...p, isAvailable: product.isAvailable } : p
        )
      );
      const msg = err.response?.data?.message || 'Failed to update availability';
      showToast(msg, 'error');
    } finally {
      setUpdatingAvailabilityId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    const productId = deletingProduct._id || deletingProduct.id;
    if (!productId) return;

    setIsDeleting(true);
    try {
      await adminProductApi.deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => (p._id || p.id) !== productId));
      showToast(
        `"${deletingProduct.name}" removed from menu.`,
        'warning',
        'Product Deleted'
      );
      setDeletingProduct(null);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to delete product';
      showToast(msg, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminLayout
      title="Menu & Product Management"
      subtitle="Create, configure, and manage customizable food dishes, toppings, and pricing"
    >
      <div className="space-y-6">
        {/* Top Header Card: Title & "＋ Add Product" Button */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-extrabold text-gray-900 font-display flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-primary" />
              Kitchen Menu Catalog
              {!isLoading && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-100 text-primary">
                  {products.length} {products.length === 1 ? 'item' : 'items'}
                </span>
              )}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              All menu items and customization options are synchronized directly with MongoDB and Supabase.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <button
              onClick={() => fetchProducts(false)}
              disabled={isRefreshing || isLoading}
              className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors shadow-xs"
              title="Refresh Products"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-primary' : ''}`}
              />
            </button>

            <Button
              variant="gradient"
              size="md"
              onClick={handleOpenAddModal}
              leftIcon={<Plus className="w-4 h-4 stroke-[3]" />}
              className="font-bold shadow-soft hover:shadow-glow-primary"
            >
              ＋ Add Product
            </Button>
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-soft space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {CATEGORIES.map((cat) => {
                const count = categoryCounts[cat] || 0;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all whitespace-nowrap select-none flex items-center gap-1.5 ${
                      selectedCategory === cat
                        ? 'bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white shadow-soft-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200/80 hover:text-gray-900'
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                        selectedCategory === cat
                          ? 'bg-white/30 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full lg:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-8 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Loading Skeletons */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden animate-pulse flex flex-col justify-between"
              >
                <div className="aspect-[16/10] bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded-md w-3/4" />
                  <div className="h-3 bg-gray-100 rounded-md w-full" />
                  <div className="h-3 bg-gray-100 rounded-md w-2/3" />
                  <div className="pt-2 flex gap-1.5">
                    <div className="h-5 bg-gray-100 rounded-md w-16" />
                    <div className="h-5 bg-gray-100 rounded-md w-20" />
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50/70 border-t border-gray-100 flex justify-between items-center">
                  <div className="h-3 bg-gray-200 rounded w-16" />
                  <div className="flex gap-2">
                    <div className="w-7 h-7 bg-gray-200 rounded-lg" />
                    <div className="w-7 h-7 bg-gray-200 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-soft text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-orange-50 text-primary flex items-center justify-center mx-auto shadow-xs">
              <Inbox className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900 font-display">
                No products found
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                {searchQuery
                  ? `No dishes match "${searchQuery}". Try adjusting your keywords or category filter.`
                  : selectedCategory !== 'All'
                  ? `No dishes in "${selectedCategory}" yet. Create the first one now!`
                  : 'Your kitchen catalog is currently empty. Click below to add your first customizable dish!'}
              </p>
            </div>
            {searchQuery ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery('')}
              >
                Clear Search
              </Button>
            ) : (
              <Button
                variant="gradient"
                size="sm"
                onClick={handleOpenAddModal}
                leftIcon={<Plus className="w-4 h-4 stroke-[3]" />}
              >
                Add First Product
              </Button>
            )}
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
                onEdit={handleOpenEditModal}
                onDelete={(p) => setDeletingProduct(p)}
                onToggleAvailability={handleToggleAvailability}
                isUpdatingAvailability={
                  updatingAvailabilityId === (product._id || product.id)
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      <ProductModal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        onSave={handleSaveProduct}
        initialProduct={editingProduct}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingProduct}
        onClose={() => {
          if (!isDeleting) setDeletingProduct(null);
        }}
        title="Delete Product"
        subtitle={`Permanently remove "${deletingProduct?.name}"?`}
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <div>
              <p className="font-bold">Are you sure?</p>
              <p className="mt-0.5 leading-relaxed">
                This will delete the dish and its customization options from MongoDB and remove its image from Supabase Storage.
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isDeleting}
              onClick={() => setDeletingProduct(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              disabled={isDeleting}
              isLoading={isDeleting}
              onClick={handleConfirmDelete}
              className="font-bold"
            >
              Delete Product
            </Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
};
