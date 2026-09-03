// ============================================================
// STEP 2: Delivery Method + Gift Wrapping
// ============================================================

import { Truck, Plane, Zap, Gift } from 'lucide-react';

const SHIPPING_OPTIONS = [
  {
    id: 'Standard',
    icon: Truck,
    label: 'Standard Delivery',
    description: 'Estimated 5–8 business days',
    price: 3000,
    freeAbove: 50000,
  },
  {
    id: 'Express',
    icon: Plane,
    label: 'Express Courier',
    description: 'Fastest: 2–4 business days',
    price: 5500,
    freeAbove: null,
  },
  {
    id: 'Same Day',
    icon: Zap,
    label: 'Same Day (Lagos only)',
    description: 'Delivered today before 8pm',
    price: 8000,
    freeAbove: null,
  },
];

export default function StepDelivery({ shippingMethod, setShippingMethod, isGiftWrapped, setIsGiftWrapped, subtotal }) {
  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl mb-6">Delivery Method</h2>

      {SHIPPING_OPTIONS.map((opt) => {
        const isFree = opt.freeAbove && subtotal >= opt.freeAbove;
        const Icon = opt.icon;
        const isSelected = shippingMethod === opt.id;

        return (
          <div
            key={opt.id}
            onClick={() => setShippingMethod(opt.id)}
            className={`border p-5 flex items-center gap-4 cursor-pointer transition-all hover:bg-gray-50 ${
              isSelected ? 'border-black ring-1 ring-black bg-gray-50' : 'border-gray-200'
            }`}
          >
            <div className="w-12 h-12 bg-white border border-gray-200 flex items-center justify-center text-gray-400">
              <Icon size={20} strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">{opt.label}</p>
              <p className="text-xs text-gray-500">{opt.description}</p>
            </div>
            <span className="font-medium text-sm">
              {isFree ? (
                <span className="text-green-600">Free</span>
              ) : (
                `₦${opt.price.toLocaleString()}`
              )}
            </span>
          </div>
        );
      })}

      {/* Gift wrapping */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <label
          className={`flex items-start gap-4 p-4 border cursor-pointer transition-all ${
            isGiftWrapped ? 'border-black bg-gray-50' : 'border-gray-200'
          }`}
        >
          <input
            type="checkbox"
            checked={isGiftWrapped}
            onChange={() => setIsGiftWrapped(!isGiftWrapped)}
            className="mt-1 w-4 h-4 accent-black"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Gift size={16} className="text-black" />
              <span className="font-medium text-sm">Add Luxury Gift Wrapping</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Your order will be wrapped in our signature YUWA tissue paper and placed in a premium magnetic box with a ribbon.
            </p>
          </div>
          <span className="text-sm font-medium">+₦5,000</span>
        </label>
      </div>
    </div>
  );
}