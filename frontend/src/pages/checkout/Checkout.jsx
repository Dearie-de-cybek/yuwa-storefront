import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod'; 
import { motion } from 'framer-motion';
import { ChevronRight, CreditCard, ArrowLeft, CheckCircle, Gift, Truck, Plane } from 'lucide-react';
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
    mode: "onBlur"
  });

  // Safe Calculations (Fallback to 0 if price is missing)
  const subtotal = cart.reduce((acc, item) => acc + ((item?.price || 0) * (item?.quantity || 1)), 0);
  const shippingCost = shippingMethod === 'express' ? 25 : 0;
  const giftWrapCost = isGiftWrapped ? 15 : 0;
  const total = subtotal + shippingCost + giftWrapCost;

  // Handle Step Transition
  const nextStep = async () => {
    if (step === 1) {
      const isValid = await trigger(); 
      if (!isValid) return; 
    }
    setStep(step + 1);
  };

  const onSubmit = (data) => {
    console.log("Final Order Data:", { ...data, shippingMethod, paymentMethod, isGiftWrapped, total });
    alert("Order Validated! Sending to Payment Gateway...");
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-secondary font-sans">
        <p className="text-xl font-serif mb-4">Your bag is empty.</p>
        <Link to="/shop/ready-to-wear" className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-gray-600">
          Return to Shop
        </Link>
      </div>
    );
  }

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
            <span className={step >= 1 ? "text-black font-bold" : ""}>Info</span>
            <ChevronRight size={14} className="mx-2" />
            <span className={step >= 2 ? "text-black font-bold" : ""}>Delivery</span>
            <ChevronRight size={14} className="mx-2" />
            <span className={step >= 3 ? "text-black font-bold" : ""}>Payment</span>
          </div>

          {/* FORM WRAPPER */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-lg">
            
            {/* STEP 1: CONTACT & ADDRESS */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <h2 className="font-serif text-2xl mb-4">Contact Information</h2>
                
                <div className="space-y-1">
                  <input 
                    {...register("email")}
                    placeholder="Email address"
                    className={`w-full p-4 border rounded-sm outline-none transition-colors ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-black'}`}
                  />
                  {errors.email && <p className="text-red-500 text-xs font-medium">{errors.email.message}</p>}
                </div>

                <div className="space-y-1">
                   <input 
                    {...register("phone")}
                    placeholder="Phone number"
                    className={`w-full p-4 border rounded-sm outline-none transition-colors ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-black'}`}
                  />
                  {errors.phone && <p className="text-red-500 text-xs font-medium">{errors.phone.message}</p>}
                </div>
                
                <h2 className="font-serif text-2xl pt-4 mb-4">Shipping Address</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <input {...register("firstName")} placeholder="First name" className={`w-full p-4 border rounded-sm outline-none ${errors.firstName ? 'border-red-500' : 'border-gray-200 focus:border-black'}`} />
                    {errors.firstName && <p className="text-red-500 text-xs font-medium">{errors.firstName.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <input {...register("lastName")} placeholder="Last name" className={`w-full p-4 border rounded-sm outline-none ${errors.lastName ? 'border-red-500' : 'border-gray-200 focus:border-black'}`} />
                    {errors.lastName && <p className="text-red-500 text-xs font-medium">{errors.lastName.message}</p>}
                  </div>
                </div>

                <div className="space-y-1">
                   <input {...register("address")} placeholder="Address" className={`w-full p-4 border rounded-sm outline-none ${errors.address ? 'border-red-500' : 'border-gray-200 focus:border-black'}`} />
                   {errors.address && <p className="text-red-500 text-xs font-medium">{errors.address.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <select {...register("country")} className="w-full p-4 border border-gray-200 rounded-sm outline-none bg-white focus:border-black">
                    <option value="NG">Nigeria</option>
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="AU">Australia</option>
                  </select>
                  <div className="space-y-1">
                    <input {...register("zip")} placeholder="Postcode / Zip" className={`w-full p-4 border rounded-sm outline-none ${errors.zip ? 'border-red-500' : 'border-gray-200 focus:border-black'}`} />
                    {errors.zip && <p className="text-red-500 text-xs font-medium">{errors.zip.message}</p>}
                  </div>
                </div>
                <div className="space-y-1">
                  <input {...register("city")} placeholder="City" className={`w-full p-4 border rounded-sm outline-none ${errors.city ? 'border-red-500' : 'border-gray-200 focus:border-black'}`} />
                  {errors.city && <p className="text-red-500 text-xs font-medium">{errors.city.message}</p>}
                </div>
              </motion.div>
            )}

            {/* STEP 2: SHIPPING METHOD */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                 <h2 className="font-serif text-2xl mb-6">Delivery Method</h2>
                 
                 <div 
                   onClick={() => setShippingMethod('standard')}
                   className={`border p-5 flex items-center gap-4 cursor-pointer transition-all hover:bg-gray-50
                     ${shippingMethod === 'standard' ? 'border-black ring-1 ring-black bg-gray-50' : 'border-gray-200'}`}
                 >
                   <div className="w-12 h-12 bg-white border border-gray-200 flex items-center justify-center text-gray-400">
                     <Truck size={20} strokeWidth={1.5} />
                   </div>
                   <div className="flex-1">
                     <p className="font-medium text-sm">Standard Delivery</p>
                     <p className="text-xs text-gray-500">Estimated 5–8 business days</p>
                   </div>
                   <span className="font-medium text-sm">Free</span>
                 </div>

                 <div 
                   onClick={() => setShippingMethod('express')}
                   className={`border p-5 flex items-center gap-4 cursor-pointer transition-all hover:bg-gray-50
                     ${shippingMethod === 'express' ? 'border-black ring-1 ring-black bg-gray-50' : 'border-gray-200'}`}
                 >
                   <div className="w-12 h-12 bg-white border border-gray-200 flex items-center justify-center text-gray-400">
                     <Plane size={20} strokeWidth={1.5} />
                   </div>
                   <div className="flex-1">
                     <p className="font-medium text-sm">Express Courier</p>
                     <p className="text-xs text-gray-500">Fastest: 2–4 business days</p>
                   </div>
                   <span className="font-medium text-sm">$25.00</span>
                 </div>

                 <div className="mt-8 pt-8 border-t border-gray-200">
                    <label className={`flex items-start gap-4 p-4 border cursor-pointer transition-all ${isGiftWrapped ? 'border-black bg-gray-50' : 'border-gray-200'}`}>
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
                      <span className="text-sm font-medium">+$15.00</span>
                    </label>
                 </div>
              </motion.div>
            )}

            {/* STEP 3: PAYMENT */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <h2 className="font-serif text-2xl mb-6">Payment</h2>
                <div className="border border-gray-200 rounded-sm overflow-hidden">
                  <div 
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 border-b border-gray-200 cursor-pointer flex items-center justify-between ${paymentMethod === 'card' ? 'bg-gray-50' : 'bg-white'}`}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard size={18} />
                      <span className="text-sm font-medium">Credit / Debit Card</span>
                    </div>
                    {paymentMethod === 'card' && <CheckCircle size={18} className="text-black" />}
                  </div>
                  <div 
                    onClick={() => setPaymentMethod('paystack')}
                    className={`p-4 cursor-pointer flex items-center justify-between ${paymentMethod === 'paystack' ? 'bg-gray-50' : 'bg-white'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-serif font-bold text-lg tracking-tight">Paystack</span>
                    </div>
                    {paymentMethod === 'paystack' && <CheckCircle size={18} className="text-black" />}
                  </div>
                </div>
              </motion.div>
            )}

            {/* FOOTER BUTTONS */}
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-200">
              {step > 1 ? (
                <button 
                  type="button" 
                  onClick={() => setStep(step - 1)} 
                  className="text-sm text-gray-500 hover:text-black flex items-center gap-2"
                >
                  <ArrowLeft size={16} /> Return
                </button>
              ) : (
                <Link to="/cart" className="text-sm text-gray-500 hover:text-black">Return to Cart</Link>
              )}
              
              {/* SMART SUBMIT LOGIC */}
              {step < 3 ? (
                <button 
                  type="button" 
                  onClick={nextStep}
                  className="bg-black text-white px-8 py-4 uppercase tracking-widest text-xs hover:bg-gray-800 transition-colors duration-300"
                >
                  Continue
                </button>
              ) : (
                <button 
                  type="submit" 
                  className="bg-black text-white px-8 py-4 uppercase tracking-widest text-xs hover:bg-gray-800 transition-colors duration-300"
                >
                  Pay ${total.toFixed(2)}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* RIGHT: BULLETPROOF ORDER SUMMARY */}
        <div className="bg-gray-50 p-6 lg:p-12 order-1 lg:order-2 h-fit lg:min-h-screen border-l border-gray-200">
          <div className="sticky top-24">
            <h3 className="font-serif text-xl mb-6 text-gray-500">Order Summary</h3>
            
            <div className="space-y-4 mb-8">
              {cart.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-center">
                  <div className="relative w-16 h-20 bg-white border border-gray-200 rounded-sm">
                    {/* SAFE IMAGE ACCESS */}
                    <img 
                      src={item?.variant?.image || item?.image || 'https://via.placeholder.com/100'} 
                      className="w-full h-full object-cover" 
                      alt="Product"
                    />
                    <span className="absolute -top-2 -right-2 bg-gray-800 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                      {item?.quantity || 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item?.name || 'Product'}</p>
                    {/* SAFE VARIANT ACCESS */}
                    <p className="text-xs text-gray-500">
                      {item?.variant?.color || item?.variant?.colorName || 'Default'} / {item?.variant?.size || 'OS'}
                    </p>
                  </div>
                  <p className="font-medium text-sm">
                    ${((item?.price || 0) * (item?.quantity || 1)).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              
              {isGiftWrapped && (
                <div className="flex justify-between text-sm text-black">
                  <span className="flex items-center gap-2"><Gift size={14} /> Gift Wrapping</span>
                  <span>${giftWrapCost.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-lg font-serif pt-4 border-t border-gray-200 mt-4">
                <span>Total</span>
                <span className="flex items-center gap-1">
                  <span className="text-xs text-gray-500 font-sans mr-2">USD</span>
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