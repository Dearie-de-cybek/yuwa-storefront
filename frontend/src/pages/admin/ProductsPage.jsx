import { useState, useEffect } from 'react';
import AdminLayout from '../admin/AdminLayout';
import { Plus, Search, Filter, Edit, Trash2, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth(); // Need token for delete

  // 1. Fetch Real Data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Remember to use your specific URL
        const { data } = await axios.get('http://127.0.0.1:5000/api/products');
        setProducts(data);
      } catch (error) {
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 2. Delete Handler
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://127.0.0.1:5000/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(products.filter(p => p.id !== id)); // Remove from UI
        toast.success('Product deleted');
      } catch (error) {
        toast.error('Delete failed');
      }
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="font-serif text-3xl">Inventory</h1>
        <button className="flex items-center gap-2 bg-black text-white px-6 py-3 text-sm tracking-widest uppercase hover:bg-gray-800 rounded-lg transition-all">
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {/* ... (Keep Filters Section same as before) ... */}

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-10 flex justify-center"><Loader2 className="animate-spin" /></div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Variants</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-4">
                      {/* Handle multiple images */}
                      <img 
                        src={product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/100'} 
                        alt="" 
                        className="w-12 h-12 object-cover rounded-md bg-gray-100" 
                      />
                      <span className="font-medium text-gray-900">{product.name}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{product.category}</td>
                    <td className="px-6 py-4 font-medium">₦{product.price.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      {/* Show variant count */}
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                        {product.variants ? product.variants.length : 0} Options
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-md"><Edit size={16} /></button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md"
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
      </div>
    </AdminLayout>
  );
}