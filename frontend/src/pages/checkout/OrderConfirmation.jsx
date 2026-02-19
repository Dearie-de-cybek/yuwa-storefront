// ============================================================
// ORDER CONFIRMATION — Shown after successful checkout
// ============================================================

import { CheckCircle, Mail, Package, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function OrderConfirmation({ order }) {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <div className="border-b border-border py-6 flex justify-center">
        <Link to="/" className="font-serif text-2xl tracking-tight">YUWA</Link>
      </div>

      <div className="max-w-lg mx-auto px-6 py-16 text-center">
        {/* Success icon */}
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={32} className="text-green-600" />
        </div>

        <h1 className="font-serif text-3xl mb-3">Thank You</h1>
        <p className="text-gray-500 mb-8">
          Your order has been placed and is being processed.
        </p>

        {/* Order details */}
        <div className="bg-gray-50 rounded-lg p-6 text-left space-y-4 mb-8">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Order Number</span>
            <span className="font-mono font-bold">{order.orderNumber}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Status</span>
            <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs font-medium">
              Processing
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Total</span>
            <span className="font-bold">₦{parseFloat(order.totalAmount).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Items</span>
            <span>{order.items?.length || 0} piece{(order.items?.length || 0) !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Email notice */}
        <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-lg text-left mb-8">
          <Mail size={20} className="text-blue-500 flex-shrink-0" />
          <p className="text-sm text-blue-800">
            A confirmation email has been sent to <strong>{order.customerEmail}</strong>. 
            You'll receive updates as your order is prepared and shipped.
          </p>
        </div>

        {/* Items summary */}
        <div className="text-left mb-8">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Your Pieces</h3>
          <div className="space-y-3">
            {order.items?.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                {item.imageUrl && (
                  <img src={item.imageUrl} alt="" className="w-12 h-14 object-cover rounded bg-gray-100" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.productName}</p>
                  <p className="text-xs text-gray-500">{item.variantColor} / {item.variantSize} × {item.quantity}</p>
                </div>
                <p className="text-sm font-medium">₦{parseFloat(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            to="/account/orders"
            className="flex items-center justify-center gap-2 bg-black text-white py-4 uppercase tracking-widest text-xs hover:bg-gray-800 transition-colors"
          >
            <Package size={14} /> View My Orders
          </Link>
          <Link
            to="/shop"
            className="flex items-center justify-center gap-2 py-4 text-xs uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
          >
            Continue Shopping <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}