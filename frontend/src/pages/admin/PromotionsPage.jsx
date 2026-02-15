import AdminLayout from '../admin/AdminLayout';

export default function PromotionsPage() {
  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-serif text-3xl">Active Promotions</h1>
        <button className="bg-black text-white px-6 py-3 text-sm tracking-widest uppercase hover:bg-gray-800">
          + New Campaign
        </button>
      </div>
      
      {/* Empty State */}
      <div className="bg-white p-12 text-center border border-dashed border-gray-300 rounded-xl">
        <p className="text-gray-400 mb-4">No active sales or promo codes.</p>
        <p className="text-sm text-gray-500">Create a discount code like "DETTYDECEMBER" to boost sales.</p>
      </div>
    </AdminLayout>
  );
}