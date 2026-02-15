import AdminLayout from '../admin/AdminLayout';
import { Search, Eye, Filter } from 'lucide-react';

export default function OrdersPage() {
  const orders = [
    { id: "#ORD-7821", customer: "Amaka Obi", date: "Oct 24, 2025", total: 180000, status: "Processing" },
    { id: "#ORD-7820", customer: "Chioma Jesus", date: "Oct 23, 2025", total: 45000, status: "Delivered" },
    { id: "#ORD-7819", customer: "Funke Akindele", date: "Oct 22, 2025", total: 120000, status: "Cancelled" },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return 'bg-green-100 text-green-700';
      case 'Processing': return 'bg-blue-100 text-blue-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-3xl">Orders</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search orders..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black" />
          </div>
        </div>

        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 font-bold text-gray-900">{order.id}</td>
                <td className="px-6 py-4">{order.customer}</td>
                <td className="px-6 py-4 text-gray-500">{order.date}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium">₦{order.total.toLocaleString()}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-primary hover:underline text-xs uppercase tracking-widest font-bold flex items-center justify-end gap-1">
                    <Eye size={14} /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}