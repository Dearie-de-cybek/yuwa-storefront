import { useState, useEffect } from 'react';
import AdminLayout from '../admin/AdminLayout';
import { Plus, Search, Edit, Trash2, Loader2, Eye, EyeOff, Star } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const STATUS_BADGE = {
  DRAFT:    'bg-yellow-100 text-yellow-800',
  ACTIVE:   'bg-green-100 text-green-800',
  ARCHIVED: 'bg-gray-100 text-gray-500',
};

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const { token } = useAuth();
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: API_URL,
    headers: { Authorization: `Bearer ${token}` },
  });

  // ── Fetch products ──
  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (search.trim()) params.search = search.trim();

      const { data } = await api.get('/api/products', { params });

      // Handle both old format (flat array) and new format (paginated object)
      if (Array.isArray(data)) {
        setProducts(data);
        setPagination({ page: 1, pages: 1, total: data.length });
      } else {
        setProducts(data.products || []);
        setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
      }
    } catch (error) {
      toast.error('Failed to load products');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ── Search handler ──
  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(1);
  };

  // ── Create draft ──
  const createProductHandler = async () => {
    try {
      const { data } = await api.post('/api/products');
      navigate(`/admin/product/${data.id}/edit`);
    } catch (error) {
      toast.error('Could not create draft');
    }
  };

  // ── Delete handler ──
  const handleDelete = async (id) => {
    if (!window.confirm('Move this product to trash?')) return;
    try {
      await api.delete(`/api/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success('Product moved to trash');
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  // ── Resolve image URL from either API format ──
  const getImage = (product) => {
    // New format: product.image (string)
    if (product.image) return product.image;
    // Old format: product.images (array)
    if (product.images && product.images[0]) return product.images[0];
    return 'https://via.placeholder.com/100';
  };

  // ── Resolve category name from either format ──
  const getCategory = (product) => {
    if (typeof product.category === 'object' && product.category?.name) return product.category.name;
    if (typeof product.category === 'string') return product.category;
    return '—';
  };

  // ── Resolve variant count ──
  const getVariantCount = (product) => {
    if (product.variantCount !== undefined) return product.variantCount;
    if (product.variants) return product.variants.length;
    return 0;
  };

  // ── Resolve stock ──
  const getStock = (product) => {
    if (product.totalStock !== undefined) return product.totalStock;
    if (product.variants) return product.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
    return 0;
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="font-serif text-3xl">Inventory</h1>
          {!loading && (
            <p className="text-sm text-gray-400 mt-1">{pagination.total} product{pagination.total !== 1 ? 's' : ''}</p>
          )}
        </div>
        <button
          className="flex items-center gap-2 bg-black text-white px-6 py-3 text-sm tracking-widest uppercase hover:bg-gray-800 rounded-lg transition-all"
          onClick={createProductHandler}
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b border-gray-100">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black transition-colors"
              />
            </div>
            <button type="submit" className="px-4 py-2.5 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
              Search
            </button>
          </form>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-10 flex justify-center">
              <Loader2 className="animate-spin text-gray-400" size={24} />
            </div>
          ) : products.length === 0 ? (
            <div className="p-10 text-center text-gray-400">
              <p className="text-lg mb-2">No products found</p>
              <p className="text-sm">Create your first product to get started.</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Variants</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Product name + image */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={getImage(product)}
                          alt=""
                          className="w-12 h-12 object-cover rounded-md bg-gray-100"
                        />
                        <div>
                          <span className="font-medium text-gray-900 block">{product.name}</span>
                          {product.featured && (
                            <Star size={12} className="inline text-yellow-500 mt-0.5" />
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Status badge */}
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_BADGE[product.status] || STATUS_BADGE.DRAFT}`}>
                        {product.status || 'DRAFT'}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4 text-gray-500">{getCategory(product)}</td>

                    {/* Price */}
                    <td className="px-6 py-4 font-medium">
                      ₦{(product.price || 0).toLocaleString()}
                    </td>

                    {/* Stock */}
                    <td className="px-6 py-4">
                      {(() => {
                        const stock = getStock(product);
                        return (
                          <span className={`text-sm ${stock === 0 ? 'text-red-500 font-medium' : 'text-gray-600'}`}>
                            {stock}
                          </span>
                        );
                      })()}
                    </td>

                    {/* Variants */}
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                        {getVariantCount(product)} Options
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <Link
                          to={`/admin/product/${product.id}/edit`}
                          className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-md transition-colors"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <span className="text-sm text-gray-500">
              Page {pagination.page} of {pagination.pages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => fetchProducts(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-30 hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => fetchProducts(pagination.page + 1)}
                disabled={pagination.page >= pagination.pages}
                className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-30 hover:bg-gray-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}