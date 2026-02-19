// ============================================================
// ORDER SUMMARY — Right sidebar showing cart + totals
// ============================================================

import { Gift } from 'lucide-react';

export default function OrderSummary({ items, subtotal, shippingCost, giftWrapCost, isGiftWrapped, total, currency = 'NGN' }) {
  const fmt = (n) => `₦${n.toLocaleString()}`;

  return (
    <div className="bg-gray-50 p-6 lg:p-12 order-1 lg:order-2 h-fit lg:min-h-screen border-l border-gray-200">
      <div className="sticky top-24">
        <h3 className="font-serif text-xl mb-6 text-gray-500">Order Summary</h3>

        {/* Items */}
        <div className="space-y-4 mb-8">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 items-center">
              <div className="relative w-16 h-20 bg-white border border-gray-200 rounded-sm shrink-0">
                <img
                  src={item.product?.image || 'https://via.placeholder.com/100'}
                  className="w-full h-full object-cover"
                  alt={item.product?.name || 'Product'}
                />
                <span className="absolute -top-2 -right-2 bg-gray-800 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                  {item.quantity}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{item.product?.name || 'Product'}</p>
                <p className="text-xs text-gray-500">
                  {item.variant?.color || 'Default'} / {item.variant?.size || 'OS'}
                </p>
              </div>
              <p className="font-medium text-sm flex-shrink-0">
                {fmt(item.lineTotal || item.unitPrice * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t border-gray-200 pt-6 space-y-3">
          <Row label="Subtotal" value={fmt(subtotal)} />
          <Row
            label="Shipping"
            value={shippingCost === 0 ? <span className="text-green-600">Free</span> : fmt(shippingCost)}
          />

          {isGiftWrapped && (
            <div className="flex justify-between text-sm text-black">
              <span className="flex items-center gap-2">
                <Gift size={14} /> Gift Wrapping
              </span>
              <span>{fmt(giftWrapCost)}</span>
            </div>
          )}

          <div className="flex justify-between text-lg font-serif pt-4 border-t border-gray-200 mt-4">
            <span>Total</span>
            <span className="flex items-center gap-1">
              <span className="text-xs text-gray-500 font-sans mr-2">{currency}</span>
              {fmt(total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span>{value}</span>
    </div>
  );
}