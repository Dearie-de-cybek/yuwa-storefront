// ============================================================
// CHECKOUT PAGE — Step orchestrator
// Uses the existing useStore (not a separate cart store)
// ============================================================

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../store/useStore';
import useCheckout from './useCheckout';
import { checkoutSchema } from './checkoutSchema';
import StepInfo from './steps/StepInfo';
import StepDelivery from './steps/StepDelivery';
import StepPayment from './steps/StepPayment';
import OrderSummary from './OrderSummary';
import OrderConfirmation from './OrderConfirmation';

export default function Checkout() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const cart = useStore((s) => s.cart);
  const { placeOrder, loading: orderLoading, order } = useCheckout();

  const [step, setStep] = useState(1);
  const [shippingMethod, setShippingMethod] = useState('Standard');
  const [isGiftWrapped, setIsGiftWrapped] = useState(false);
  const [promoCode, setPromoCode] = useState('');

  // ── Form ──
  const form = useForm({
    resolver: zodResolver(checkoutSchema),
    mode: 'onBlur',
    defaultValues: {
      email: user?.email || '',
      phone: '',
      firstName: '',
      lastName: '',
      street: '',
      city: '',
      state: '',
      country: 'NG',
      zip: '',
    },
  });

  // ── Auth guard ──
  useEffect(() => {
    if (!token) {
      toast.error('Please log in to checkout');
      navigate('/login');
    }
  }, [token]);

  // ── Derived values from local cart ──
  const subtotal = cart.reduce((acc, item) => {
    const price = item.variant?.price || item.price || 0;
    return acc + price * (item.quantity || 1);
  }, 0);

  const shippingCost = subtotal >= 50000 ? 0
    : shippingMethod === 'Express' ? 5500
    : shippingMethod === 'Same Day' ? 8000
    : 3000;

  const giftWrapCost = isGiftWrapped ? 5000 : 0;
  const total = subtotal + shippingCost + giftWrapCost;

  // ── Navigation ──
  const nextStep = async () => {
    if (step === 1) {
      const valid = await form.trigger();
      if (!valid) return;
    }
    setStep((s) => Math.min(s + 1, 3));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  // ── Place order ──
  // ── Place order ──
  const handlePlaceOrder = async () => {
    const values = form.getValues();

    const result = await placeOrder({
      items: cart, 
      shippingAddress: {
        firstName: values.firstName,
        lastName: values.lastName,
        street: values.street,
        city: values.city,
        state: values.state,
        zip: values.zip,
        country: values.country,
        phone: values.phone,
      },
      shippingMethod,
      customerPhone: values.phone,
      promotionCode: promoCode || null,
    });

    if (result.success) {
      toast.success('Order placed! Check your email for confirmation.');
      setStep(4);
    } else {
      toast.error(result.error);
    }
  };

  // ── Empty cart ──
  if (cart.length === 0 && step < 4) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-secondary font-sans">
        <p className="text-xl font-serif mb-4">Your bag is empty.</p>
        <Link to="/shop" className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-gray-600">
          Return to Shop
        </Link>
      </div>
    );
  }

  // ── Order confirmation ──
  if (step === 4 && order) {
    return <OrderConfirmation order={order} />;
  }

  // ── Map local cart items to OrderSummary shape ──
  const summaryItems = cart.map((item) => ({
    id: `${item.id}-${item.variant.id}`,
    quantity: item.quantity || 1,
    unitPrice: item.variant?.price || item.price || 0,
    lineTotal: (item.variant?.price || item.price || 0) * (item.quantity || 1),
    product: {
      id: item.id,
      name: item.name,
      image: item.variant?.image || item.images?.[0] || item.image || item.media?.[0]?.url || null,
    },
    variant: {
      id: item.variant.id,
      color: item.variant.color || item.variant.colorName || 'Default',
      size: item.variant.size || 'OS',
    },
  }));

  return (
    <div className="min-h-screen bg-white font-sans text-primary">
      {/* Header */}
      <div className="border-b border-border py-6 flex justify-center sticky top-0 bg-white/95 backdrop-blur z-20">
        <Link to="/" className="font-serif text-2xl tracking-tight">YUWA</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 max-w-[1200px] mx-auto min-h-screen">
        {/* Left: Steps */}
        <div className="p-6 lg:p-12 lg:border-r border-border order-2 lg:order-1">
          <Breadcrumbs step={step} />

          <form onSubmit={(e) => e.preventDefault()} className="max-w-lg">
            <motion.div key={step} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
              {step === 1 && <StepInfo form={form} />}
              {step === 2 && (
                <StepDelivery
                  shippingMethod={shippingMethod}
                  setShippingMethod={setShippingMethod}
                  isGiftWrapped={isGiftWrapped}
                  setIsGiftWrapped={setIsGiftWrapped}
                  subtotal={subtotal}
                />
              )}
              {step === 3 && (
                <StepPayment promoCode={promoCode} setPromoCode={setPromoCode} />
              )}
            </motion.div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-6 mt-8 border-t border-gray-200">
              {step > 1 ? (
                <button type="button" onClick={prevStep} className="text-sm text-gray-500 hover:text-black flex items-center gap-2">
                  <ArrowLeft size={16} /> Return
                </button>
              ) : (
                <Link to="/cart" className="text-sm text-gray-500 hover:text-black">Return to Bag</Link>
              )}

              {step < 3 ? (
                <button type="button" onClick={nextStep}
                  className="bg-black text-white px-8 py-4 uppercase tracking-widest text-xs hover:bg-gray-800 transition-colors">
                  Continue
                </button>
              ) : (
                <button type="button" onClick={handlePlaceOrder} disabled={orderLoading}
                  className="bg-black text-white px-8 py-4 uppercase tracking-widest text-xs hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2">
                  {orderLoading && <Loader2 size={14} className="animate-spin" />}
                  Pay ₦{total.toLocaleString()}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right: Summary */}
        <OrderSummary
          items={summaryItems}
          subtotal={subtotal}
          shippingCost={shippingCost}
          giftWrapCost={giftWrapCost}
          isGiftWrapped={isGiftWrapped}
          total={total}
          currency="NGN"
        />
      </div>
    </div>
  );
}

function Breadcrumbs({ step }) {
  const steps = ['Info', 'Delivery', 'Payment'];
  return (
    <div className="flex items-center text-xs text-muted mb-8 uppercase tracking-widest">
      {steps.map((label, i) => (
        <span key={label} className="flex items-center">
          {i > 0 && <span className="mx-2 text-gray-300">›</span>}
          <span className={step >= i + 1 ? 'text-black font-bold' : ''}>{label}</span>
        </span>
      ))}
    </div>
  );
}