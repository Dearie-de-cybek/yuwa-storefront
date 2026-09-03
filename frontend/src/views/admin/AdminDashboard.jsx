import AdminLayout from '../admin/AdminLayout';
import { TrendingUp, Users, ShoppingBag, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
  // Mock Data (We will fetch real data later)
  const stats = [
    { title: 'Total Revenue', value: '₦2.4M', change: '+12%', icon: DollarSign, color: 'bg-green-100 text-green-700' },
    { title: 'Active Orders', value: '18', change: '+4', icon: ShoppingBag, color: 'bg-blue-100 text-blue-700' },
    { title: 'Customers', value: '1,204', change: '+18%', icon: Users, color: 'bg-purple-100 text-purple-700' },
    { title: 'Sales Volume', value: '42', change: '-2%', icon: TrendingUp, color: 'bg-orange-100 text-orange-700' },
  ];

  return (
    <AdminLayout>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.title}</p>
                <h3 className="text-2xl font-serif mt-2 text-gray-900">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon size={20} />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              <span className={stat.change.startsWith('+') ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                {stat.change}
              </span> from last month
            </p>
          </div>
        ))}
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Orders (Takes up 2 columns) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-serif text-lg mb-4">Recent Activity</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 uppercase bg-gray-50/50">
                <tr>
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/* Placeholder Row */}
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">#ORD-001</td>
                  <td className="px-4 py-3">Amaka Obi</td>
                  <td className="px-4 py-3"><span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">Pending</span></td>
                  <td className="px-4 py-3 text-right">₦45,000</td>
                </tr>
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">#ORD-002</td>
                  <td className="px-4 py-3">Funke Akindele</td>
                  <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Shipped</span></td>
                  <td className="px-4 py-3 text-right">₦120,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions (Promotions & Updates) */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-serif text-lg mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full py-3 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors rounded-lg">
              + Post New Product
            </button>
            <button className="w-full py-3 border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors rounded-lg">
              Create Promotion
            </button>
          </div>
          
          <div className="mt-8">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">System Health</h4>
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-100">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Server Operational
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}