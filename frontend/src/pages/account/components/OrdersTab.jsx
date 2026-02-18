import { Package, ChevronRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function OrdersTab({ orders }) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-20 border border-dashed border-gray-300 rounded-xl bg-gray-50/50">
        <Package size={48} className="mx-auto text-gray-300 mb-4" />
        <h3 className="font-serif text-xl text-gray-900">No orders yet</h3>
        <p className="text-gray-500 mb-6 text-sm">Once you place an order, it will appear here.</p>
        <Link to="/shop/ready-to-wear" className="inline-block bg-black text-white px-8 py-3 text-xs uppercase tracking-widest rounded hover:bg-gray-800 transition-colors">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="font-serif text-2xl">Order History</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white border border-gray-200 p-6 rounded-xl hover:shadow-md transition-shadow group">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              
              {/* Order Info */}
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 group-hover:bg-black group-hover:text-white transition-colors">
                  <Package size={20} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">{order.orderNumber || order.id}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()} • {order.items?.length || 0} Items
                  </p>
                </div>
              </div>

              {/* Status & Action */}
              <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                <p className="font-serif text-lg">₦{parseFloat(order.totalAmount).toLocaleString()}</p>
                
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                  order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                  order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {order.status}
                </span>
                
                <Link to={`/account/orders/${order.id}`} className="p-2 text-gray-400 hover:text-black">
                  <ChevronRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}