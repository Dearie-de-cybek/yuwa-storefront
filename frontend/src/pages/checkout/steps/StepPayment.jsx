// ============================================================
// STEP 3: Payment (simulated) + Promo Code
// ============================================================

import { useState } from 'react';
import { CreditCard, CheckCircle, Tag, Loader2 } from 'lucide-react';

export default function StepPayment({ promoCode, setPromoCode }) {
  const [paymentMethod, setPaymentMethod] = useState('test_card');
  const [promoInput, setPromoInput] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (code) {
      setPromoCode(code);
      setPromoApplied(true);
    }
  };

  const removePromo = () => {
    setPromoCode('');
    setPromoInput('');
    setPromoApplied(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl mb-6">Payment</h2>

      {/* Test notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-sm p-4">
        <p className="text-xs text-yellow-800">
          <strong>Test Mode:</strong> No real payment will be processed. 
          Your order will be confirmed automatically and a confirmation email will be sent.
        </p>
      </div>

      {/* Payment methods */}
      <div className="border border-gray-200 rounded-sm overflow-hidden">
        <PaymentOption
          id="test_card"
          label="Test Card (Simulated)"
          icon={<CreditCard size={18} />}
          selected={paymentMethod === 'test_card'}
          onClick={() => setPaymentMethod('test_card')}
        />
        <PaymentOption
          id="paystack"
          label="Paystack (Coming Soon)"
          icon={<span className="font-serif font-bold text-sm tracking-tight">Paystack</span>}
          selected={paymentMethod === 'paystack'}
          onClick={() => setPaymentMethod('paystack')}
          disabled
        />
      </div>

      {/* Promo code */}
      <div className="pt-6 border-t border-gray-200">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
          <Tag size={12} className="inline mr-1" /> Promotion Code
        </p>

        {promoApplied ? (
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-sm">
            <span className="text-sm font-medium text-green-800">{promoCode} applied</span>
            <button
              type="button"
              onClick={removePromo}
              className="text-xs text-red-500 hover:text-red-700 uppercase tracking-wider font-bold"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
              placeholder="Enter code"
              className="flex-1 p-3 border border-gray-200 rounded-sm outline-none focus:border-black text-sm uppercase"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), applyPromo())}
            />
            <button
              type="button"
              onClick={applyPromo}
              disabled={!promoInput.trim()}
              className="px-6 py-3 bg-gray-100 text-xs uppercase tracking-widest font-bold hover:bg-gray-200 disabled:opacity-40 transition-colors"
            >
              Apply
            </button>
          </div>
        )}
        <p className="text-xs text-gray-400 mt-2">
          The code will be validated when you place your order.
        </p>
      </div>
    </div>
  );
}

function PaymentOption({ id, label, icon, selected, onClick, disabled }) {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`p-4 border-b last:border-b-0 border-gray-200 flex items-center justify-between transition-colors ${
        disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
      } ${selected ? 'bg-gray-50' : 'bg-white'}`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      {selected && <CheckCircle size={18} className="text-black" />}
    </div>
  );
}