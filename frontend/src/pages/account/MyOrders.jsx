// ============================================================
// MY ORDERS — Customer order history
// ============================================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, Loader2, ShoppingBag } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

const STATUS_STYLES = {
  PENDING:    { bg: 'bg-yellow-50', text: 'text-yellow-700', dot: 'bg-yellow-500' },
  CONFIRMED:  { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  PROCESSING: { bg: 'bg-indigo-50', text: 'text-indigo-700', dot: 'bg-indigo-500' },
  SHIPPED:    { bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-500' },
  DELIVERED:  { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
  CANCELLED:  { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  REFUNDED:   { bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-500' },
};

export default function MyOrders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/api/orders/my-orders`, {
        params: { page, limit: 10 },
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(data.orders || []);
      setPagination(data.pagination || null);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-serif text-3xl mb-8">My Orders</h1>
        <div className="text-center py-20 border border-dashed border-gray-200 rounded-lg">
          <ShoppingBag size={40} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
          <Link
            to="/shop/ready-to-wear"
            className="inline-block bg-black text-white px-8 py-3 uppercase tracking-widest text-xs hover:bg-gray-800 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-serif text-3xl mb-8">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-10 h-10 text-sm transition-colors ${
                p === page
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function OrderCard({ order }) {
  const style = STATUS_STYLES[order.status] || STATUS_STYLES.PENDING;
  const itemCount = order.items?.length || 0;
  const firstItem = order.items?.[0];

  return (
    <Link
      to={`/account/orders/${order.id}`}
      className="block border border-gray-200 hover:border-gray-400 transition-colors p-5 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="font-mono text-sm font-bold">{order.orderNumber}</p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(order.createdAt).toLocaleDateString('en-NG', { dateStyle: 'long' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
            {order.status}
          </span>
          <ChevronRight size={16} className="text-gray-300 group-hover:text-black transition-colors" />
        </div>
      </div>

      {/* Item preview */}
      <div className="flex items-center gap-3">
        <div className="flex -space-x-2">
          {order.items?.slice(0, 3).map((item, i) => (
            <div
              key={i}
              className="w-12 h-14 bg-gray-100 border border-white rounded-sm overflow-hidden"
            >
              {item.imageUrl ? (
                <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package size={14} className="text-gray-300" />
                </div>
              )}
            </div>
          ))}
          {itemCount > 3 && (
            <div className="w-12 h-14 bg-gray-100 border border-white rounded-sm flex items-center justify-center">
              <span className="text-xs text-gray-500">+{itemCount - 3}</span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm truncate">
            {firstItem?.productName}
            {itemCount > 1 && <span className="text-gray-400"> + {itemCount - 1} more</span>}
          </p>
        </div>

        <p className="font-serif text-lg font-medium flex-shrink-0">
          ₦{parseFloat(order.totalAmount).toLocaleString()}
        </p>
      </div>

      {/* Tracking number if shipped */}
      {order.trackingNumber && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Tracking: <span className="font-mono font-medium text-black">{order.trackingNumber}</span>
          </p>
        </div>
      )}
    </Link>
  );
}