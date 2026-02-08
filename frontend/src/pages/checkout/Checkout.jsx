import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod'; 
import { motion } from 'framer-motion';
import { ChevronRight, CreditCard, Lock, ArrowLeft, CheckCircle, Gift, Truck, Plane } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';

// --- 1. VALIDATION SCHEMA ---
const checkoutSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").regex(/^\+?[0-9]+$/, "Phone number must only contain digits"),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  address: z.string().min(5, "Please enter a full address"),
  city: z.string().min(2, "City is required"),
  country: z.string().min(1, "Country is required"),
  zip: z.string().min(4, "Valid Postcode required"),
});

export default function Checkout() {
  const { cart } = useStore();
  const [step, setStep] = useState(1);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isGiftWrapped, setIsGiftWrapped] = useState(false);
  // Setup Form with Zod Validation
  const { register, handleSubmit, formState: { errors }, trigger } = useForm({
    resolver: zodResolver(checkoutSchema),
    mode: "onBlur" // Validate when user leaves the field
  });

  // Calculate Totals
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shippingCost = shippingMethod === 'express' ? 25 : 0;
  const giftWrapCost = isGiftWrapped ? 15 : 0;
  const total = subtotal + shippingCost + giftWrapCost;

  // Handle Step Transition
  const nextStep = async () => {
    // If on Step 1, validate form fields before moving
    if (step === 1) {
      const isValid = await trigger(); // Manually trigger validation
      if (!isValid) return; // Stop if errors exist
    }
    setStep(step + 1);
  };

  const onSubmit = (data) => {
    console.log("Final Order Data:", { ...data, shippingMethod, paymentMethod, isGiftWrapped, total });
    alert("Order Validated! Sending to Payment Gateway...");
  };

  if (cart.length === 0) return <div className="min-h-screen flex items-center justify-center">Your bag is empty</div>;

  return (
    <div className="min-h-screen bg-white font-sans text-primary">
      
      {/* HEADER */}
      <div className="border-b border-border py-6 flex justify-center sticky top-0 bg-white/95 backdrop-blur z-20">
        <Link to="/" className="font-serif text-2xl tracking-tight">YUWA</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 max-w-[1200px] mx-auto min-h-screen">
        
        {/* LEFT: FORMS */}
        <div className="p-6 lg:p-12 lg:border-r border-border order-2 lg:order-1">
          
          {/* Breadcrumbs */}
          <div className="flex items-center text-xs text-muted mb-8 uppercase tracking-widest">
            <span className={step >= 1 ? "text-primary font-bold" : ""}>Info</span>
            <ChevronRight size={14} className="mx-2" />
            <span className={step >= 2 ? "text-primary font-bold" : ""}>Delivery</span>
            <ChevronRight size={14} className="mx-2" />
            <span className={step >= 3 ? "text-primary font-bold" : ""}>Payment</span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-lg">
            
            {/* STEP 1: CONTACT & ADDRESS */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <h2 className="font-serif text-2xl mb-4">Contact Information</h2>
                
                <div className="space-y-1">
                  <input 
                    {...register("email")}
                    placeholder="Email address"
                    className={`w-full p-4 border rounded-sm outline-none transition-colors ${errors.email ? 'border-red-500 bg-red-50' : 'border-border focus:border-accent'}`}
                  />
                  {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                </div>

                <div className="space-y-1">
                   <input 
                    {...register("phone")}
                    placeholder="Phone number"
                    className={`w-full p-4 border rounded-sm outline-none transition-colors ${errors.phone ? 'border-red-500 bg-red-50' : 'border-border focus:border-accent'}`}
                  />
                  {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
                </div>
                
                <h2 className="font-serif text-2xl pt-4 mb-4">Shipping Address</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <input {...register("firstName")} placeholder="First name" className={`w-full p-4 border rounded-sm outline-none ${errors.firstName ? 'border-red-500' : 'border-border'}`} />
                    {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <input {...register("lastName")} placeholder="Last name" className={`w-full p-4 border rounded-sm outline-none ${errors.lastName ? 'border-red-500' : 'border-border'}`} />
                    {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName.message}</p>}
                  </div>
                </div>

                <div className="space-y-1">
                   <input {...register("address")} placeholder="Address" className={`w-full p-4 border rounded-sm outline-none ${errors.address ? 'border-red-500' : 'border-border'}`} />
                   {errors.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <select {...register("country")} className="w-full p-4 border border-border rounded-sm outline-none bg-white">
                    <option value="AU">Australia</option>
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="NG">Nigeria</option>
                  </select>
                  <div className="space-y-1">
                    <input {...register("zip")} placeholder="Postcode" className={`w-full p-4 border rounded-sm outline-none ${errors.zip ? 'border-red-500' : 'border-border'}`} />
                    {errors.zip && <p className="text-red-500 text-xs">{errors.zip.message}</p>}
                  </div>
                </div>
                <input {...register("city")} placeholder="City" className={`w-full p-4 border rounded-sm outline-none ${errors.city ? 'border-red-500' : 'border-border'}`} />
              </motion.div>
            )}

            {/* STEP 2: SHIPPING METHOD (Visual) */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                 <h2 className="font-serif text-2xl mb-6">Delivery Method</h2>
                 
                 {/* Standard */}
                 <div 
                   onClick={() => setShippingMethod('standard')}
                   className={`border p-5 flex items-center gap-4 cursor-pointer transition-all hover:bg-secondary/20
                     ${shippingMethod === 'standard' ? 'border-accent ring-1 ring-accent bg-secondary/10' : 'border-border'}`}
                 >
                   <div className="w-12 h-12 bg-white border border-border flex items-center justify-center text-muted">
                     <Truck size={20} strokeWidth={1.5} />
                   </div>
                   <div className="flex-1">
                     <p className="font-medium text-sm">Standard Delivery</p>
                     <p className="text-xs text-muted">Estimated 5–8 business days</p>
                   </div>
                   <span className="font-medium text-sm">Free</span>
                 </div>

                 {/* Express */}
                 <div 
                   onClick={() => setShippingMethod('express')}
                   className={`border p-5 flex items-center gap-4 cursor-pointer transition-all hover:bg-secondary/20
                     ${shippingMethod === 'express' ? 'border-accent ring-1 ring-accent bg-secondary/10' : 'border-border'}`}
                 >
                   <div className="w-12 h-12 bg-white border border-border flex items-center justify-center text-muted">
                     <Plane size={20} strokeWidth={1.5} />
                   </div>
                   <div className="flex-1">
                     <p className="font-medium text-sm">Express Courier</p>
                     <p className="text-xs text-muted">Fastest: 2–4 business days</p>
                   </div>
                   <span className="font-medium text-sm">$25.00</span>
                 </div>

                 {/* GIFT WRAP TOGGLE */}
                 <div className="mt-8 pt-8 border-t border-border">
                    <label className={`flex items-start gap-4 p-4 border cursor-pointer transition-all ${isGiftWrapped ? 'border-accent bg-accent/5' : 'border-border'}`}>
                      <input 
                        type="checkbox" 
                        checked={isGiftWrapped}
                        onChange={() => setIsGiftWrapped(!isGiftWrapped)}
                        className="mt-1 w-4 h-4 accent-accent"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Gift size={16} className="text-accent" />
                          <span className="font-medium text-sm">Add Luxury Gift Wrapping</span>
                        </div>
                        <p className="text-xs text-muted leading-relaxed">
                          Your order will be wrapped in our signature YUWA tissue paper and placed in a premium magnetic box with a ribbon.
                        </p>
                      </div>
                      <span className="text-sm font-medium">+$15.00</span>
                    </label>
                 </div>
              </motion.div>
            )}

            {/* STEP 3: PAYMENT */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <h2 className="font-serif text-2xl mb-6">Payment</h2>
                {/* ... existing payment UI ... */}
                <div className="border border-border rounded-sm overflow-hidden">
                  <div 
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 border-b border-border cursor-pointer flex items-center justify-between ${paymentMethod === 'card' ? 'bg-secondary/50' : 'bg-white'}`}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard size={18} />
                      <span className="text-sm font-medium">Credit / Debit Card</span>
                    </div>
                    {paymentMethod === 'card' && <CheckCircle size={18} className="text-accent" />}
                  </div>
                   {/* Paystack Option */}
                   <div 
                    onClick={() => setPaymentMethod('paystack')}
                    className={`p-4 cursor-pointer flex items-center justify-between ${paymentMethod === 'paystack' ? 'bg-secondary/50' : 'bg-white'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-serif font-bold text-lg tracking-tight">Paystack</span>
                    </div>
                    {paymentMethod === 'paystack' && <CheckCircle size={18} className="text-accent" />}
                  </div>
                </div>
              </motion.div>
            )}

            {/* FOOTER BUTTONS */}
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-border">
              {step > 1 ? (
                <button 
                  type="button" 
                  onClick={() => setStep(step - 1)} 
                  className="text-sm text-muted hover:text-primary flex items-center gap-2"
                >
                  <ArrowLeft size={16} /> Return
                </button>
              ) : (
                <Link to="/cart" className="text-sm text-muted hover:text-primary">Return to Cart</Link>
              )}
              
              <button 
                type="button" // Use button type="button" for Next Step to handle manual validation
                onClick={step === 3 ? handleSubmit(onSubmit) : nextStep}
                className="bg-primary text-white px-8 py-4 uppercase tracking-widest text-xs hover:bg-accent transition-colors duration-300"
              >
                {step === 3 ? `Pay $${total.toFixed(2)}` : 'Continue'}
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT: ORDER SUMMARY */}
        <div className="bg-secondary/30 p-6 lg:p-12 order-1 lg:order-2 h-fit lg:min-h-screen border-l border-border">
          <div className="sticky top-24">
            <h3 className="font-serif text-xl mb-6 text-muted">Order Summary</h3>
            
            <div className="space-y-4 mb-8">
              {cart.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-center">
                  <div className="relative w-16 h-20 bg-white border border-border rounded-sm">
                    <img src={item.variant.image} className="w-full h-full object-cover" />
                    <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted">{item.variant.colorName} / {item.variant.size}</p>
                  </div>
                  <p className="font-medium text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Shipping</span>
                <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              
              {/* GIFT WRAP LINE ITEM */}
              {isGiftWrapped && (
                <div className="flex justify-between text-sm text-accent animate-pulse">
                  <span className="flex items-center gap-2"><Gift size={14} /> Gift Wrapping</span>
                  <span>${giftWrapCost.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-lg font-serif pt-4 border-t border-border mt-4">
                <span>Total</span>
                <span className="flex items-center gap-1">
                  <span className="text-xs text-muted font-sans mr-2">AUD</span>
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}