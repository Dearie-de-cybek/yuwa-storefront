import { useState } from 'react';
import AdminLayout from '../admin/AdminLayout';
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2 } from 'lucide-react';

export default function ProductsPage() {
  // Dummy Data
  const products = [
    { id: 1, name: "The Zaria Silk Bubu", price: 180000, stock: 45, category: "Luxury Bubu", image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=100" },
    { id: 2, name: "Lagos City Midi", price: 120000, stock: 12, category: "Ready-to-Wear", image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=100" },
    { id: 3, name: "Othello Maxi", price: 210000, stock: 0, category: "Luxury Bubu", image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=100" },
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="font-serif text-3xl">Inventory</h1>
        <button className="flex items-center gap-2 bg-black text-white px-6 py-3 text-sm tracking-widest uppercase hover:bg-gray-800 rounded-lg transition-all">
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-gray-100 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search products..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black" />
          </div>
          <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600"><Filter size={18} /></button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-4">
                    <img src={product.image} alt="" className="w-12 h-12 object-cover rounded-md bg-gray-100" />
                    <span className="font-medium text-gray-900">{product.name}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{product.category}</td>
                  <td className="px-6 py-4 font-medium">₦{product.price.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    {product.stock > 0 ? (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">{product.stock} in stock</span>
                    ) : (
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Out of Stock</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-md"><Edit size={16} /></button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}