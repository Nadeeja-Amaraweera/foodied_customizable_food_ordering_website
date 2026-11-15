import React, { useState, useEffect, useMemo } from 'react';
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
  RotateCcw
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { ProductCard } from '../../components/admin/ProductCard';
import { ProductModal } from '../../components/admin/ProductModal';
import { Modal } from '../../components/admin/Modal';
import { Button } from '../../components/admin/Button';
import { adminApi } from '../../services/adminApi';
import { AdminProduct } from '../../data/adminMockData';
import { useToast } from '../../context/ToastContext';

export const AdminProductsPage: React.FC = () => {
  const { showToast } = useToast();

  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Modals
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<AdminProduct | null>(null);

  const categories = ['All', 'Burger', 'Pizza', 'Bowls & Salads', 'Pasta', 'Desserts', 'Beverages'];

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.getProducts();
      setProducts(data);
    } catch (err) {
      showToast('Failed to load menu products', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsAddEditModalOpen(true);
  };

  const handleOpenEditModal = (product: AdminProduct) => {
    setEditingProduct(product);
    setIsAddEditModalOpen(true);
  };

  const handleSaveProduct = async (
    productData: Omit<AdminProduct, 'id' | 'createdAt' | 'rating'>,
    editId?: string
  ) => {
    try {
      if (editId) {
        await adminApi.updateProduct(editId, productData);
        showToast(`Product "${productData.name}" updated successfully!`, 'success', 'Product Saved');
      } else {
        await adminApi.createProduct(productData);
        showToast(`Product "${productData.name}" added to menu!`, 'success', 'Product Created');
      }
      fetchProducts();
    } catch (err) {
      showToast('Failed to save product', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    try {
      await adminApi.deleteProduct(deletingProduct.id);
      showToast(
        `"${deletingProduct.name}" removed from menu.`,
        'warning',
        'Product Deleted'
      );
      setDeletingProduct(null);
      fetchProducts();
    } catch (err) {
      showToast('Failed to delete product', 'error');
    }
  };

  const handleToggleAvailability = async (product: AdminProduct) => {
    try {
      const updated = await adminApi.updateProduct(product.id, {
        isAvailable: !product.isAvailable,
      });
      showToast(
        `"${product.name}" is now ${updated.isAvailable ? 'In Stock' : 'Marked Unavailable'}.`,
        updated.isAvailable ? 'success' : 'info'
      );
      fetchProducts();
    } catch (err) {
      showToast('Failed to update availability', 'error');
    }
  };

  const handleResetDemoProducts = () => {
    adminApi.resetDemoData();
    fetchProducts();
    showToast('Menu reset to initial demo products', 'info');
  };

  return (
    <AdminLayout
      title="Menu & Product Management"
      subtitle="Configure dishes, portion sizes, ingredients, and custom spice levels"
    >
      <div className="space-y-6">
        
        {/* Top Header Card: Title, "＋ Add Product" Button & Reset Demo */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-extrabold text-gray-900 font-display flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-primary" />
              Kitchen Menu Catalog ({products.length})
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Active items are instantly available on customer-facing ordering pages.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <Button
              variant="outline"
              size="md"
              onClick={handleResetDemoProducts}
              leftIcon={<RotateCcw className="w-4 h-4 text-gray-500" />}
              className="text-xs"
              title="Reset initial demo products"
            >
              Reset Defaults
            </Button>

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
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all whitespace-nowrap select-none ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white shadow-soft-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200/80 hover:text-gray-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full lg:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
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

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-soft text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-orange-50 text-primary flex items-center justify-center mx-auto shadow-xs">
              <UtensilsCrossed className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900 font-display">
                No products found
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                {searchQuery
                  ? `No dishes matching "${searchQuery}".`
                  : 'No items in this category yet. Click "Add Product" to create one.'}
              </p>
            </div>
            <Button variant="gradient" size="sm" onClick={handleOpenAddModal}>
              Create New Item
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={handleOpenEditModal}
                onDelete={(p) => setDeletingProduct(p)}
                onToggleAvailability={handleToggleAvailability}
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
        onClose={() => setDeletingProduct(null)}
        title="Delete Product"
        subtitle={`Are you sure you want to remove ${deletingProduct?.name}?`}
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <span>
              This will permanently delete this dish and its associated customizations from the menu catalog.
            </span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeletingProduct(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleConfirmDelete}
              className="font-bold"
            >
              Delete Item
            </Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
};

