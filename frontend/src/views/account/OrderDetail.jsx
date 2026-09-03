// ============================================================
// ORDER DETAIL — Single order view for customer
// ============================================================

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, XCircle, Loader2, MapPin, Mail } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

const STATUS_STEPS = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

const STATUS_META = {
  PENDING:    { icon: Clock, color: 'text-yellow-500', label: 'Pending' },
  CONFIRMED:  { icon: CheckCircle, color: 'text-blue-500', label: 'Confirmed' },
  PROCESSING: { icon: Package, color: 'text-indigo-500', label: 'Preparing' },
  SHIPPED:    { icon: Truck, color: 'text-purple-500', label: 'Shipped' },
  DELIVERED:  { icon: CheckCircle, color: 'text-green-500', label: 'Delivered' },
  CANCELLED:  { icon: XCircle, color: 'text-red-500', label: 'Cancelled' },
  REFUNDED:   { icon: XCircle, color: 'text-gray-500', label: 'Refunded' },
};

export default function OrderDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/api/orders/my-orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrder(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Order not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <p className="text-gray-500 mb-4">{error || 'Order not found'}</p>
        <Link to="/account/orders" className="text-sm text-black underline">Back to orders</Link>
      </div>
    );
  }

  const isCancelled = order.status === 'CANCELLED' || order.status === 'REFUNDED';
  const address = order.shippingAddress;

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      {/* Back link */}
      <Link to="/account/orders" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-8">
        <ArrowLeft size={16} /> All Orders
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl">{order.orderNumber}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Placed {new Date(order.createdAt).toLocaleDateString('en-NG', { dateStyle: 'long' })}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Status tracker */}
      {!isCancelled && <StatusTracker currentStatus={order.status} />}

      {/* Items */}
      <section className="mt-10">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Items</h2>
        <div className="border border-gray-200 divide-y divide-gray-100">
          {order.items?.map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-4">
              <div className="w-16 h-20 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package size={16} className="text-gray-300" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{item.productName}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {item.variantColor} / {item.variantSize}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">SKU: {item.variantSku}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-medium">₦{parseFloat(item.price * item.quantity).toLocaleString()}</p>
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Summary + Shipping side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Price breakdown */}
        <section className="border border-gray-200 p-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Summary</h2>
          <div className="space-y-2 text-sm">
            <Row label="Subtotal" value={`₦${parseFloat(order.subtotal).toLocaleString()}`} />
            <Row
              label="Shipping"
              value={parseFloat(order.shippingCost) === 0 ? 'Free' : `₦${parseFloat(order.shippingCost).toLocaleString()}`}
            />
            {parseFloat(order.discount) > 0 && (
              <Row label="Discount" value={`-₦${parseFloat(order.discount).toLocaleString()}`} className="text-green-600" />
            )}
            {order.promotionCode && (
              <Row label="Promo" value={order.promotionCode} className="text-gray-400 text-xs" />
            )}
            <div className="pt-3 mt-3 border-t border-gray-200 flex justify-between font-serif text-lg font-medium">
              <span>Total</span>
              <span>₦{parseFloat(order.totalAmount).toLocaleString()}</span>
            </div>
          </div>
        </section>

        {/* Shipping address */}
        {address && (
          <section className="border border-gray-200 p-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
              <MapPin size={12} /> Shipping Address
            </h2>
            <div className="text-sm leading-relaxed">
              <p className="font-medium">{address.firstName} {address.lastName}</p>
              <p className="text-gray-600">{address.street}</p>
              <p className="text-gray-600">{address.city}, {address.state} {address.zip}</p>
              <p className="text-gray-600">{address.country}</p>
              {address.phone && <p className="text-gray-400 mt-2">{address.phone}</p>}
            </div>
          </section>
        )}
      </div>

      {/* Tracking + payment info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {order.trackingNumber && (
          <section className="border border-gray-200 p-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
              <Truck size={12} /> Tracking
            </h2>
            <p className="font-mono text-sm font-bold">{order.trackingNumber}</p>
            {order.shippingMethod && (
              <p className="text-xs text-gray-500 mt-1">{order.shippingMethod}</p>
            )}
          </section>
        )}

        <section className="border border-gray-200 p-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Payment</h2>
          <div className="text-sm">
            <Row label="Status" value={order.paymentStatus} />
            {order.paymentMethod && <Row label="Method" value={order.paymentMethod} />}
            {order.paymentReference && <Row label="Reference" value={order.paymentReference} />}
          </div>
        </section>
      </div>

      {/* Help */}
      <div className="mt-10 p-5 bg-gray-50 border border-gray-100 rounded-lg flex items-start gap-3">
        <Mail size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium">Need help with this order?</p>
          <p className="text-xs text-gray-500 mt-1">
            Contact us at <a href="mailto:support@yuwa.com" className="underline">support@yuwa.com</a> with your order number.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Status badge ──
function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.PENDING;
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-50 ${meta.color}`}>
      <Icon size={14} /> {meta.label}
    </span>
  );
}

// ── Status tracker (progress bar) ──
function StatusTracker({ currentStatus }) {
  const currentIndex = STATUS_STEPS.indexOf(currentStatus);

  return (
    <div className="flex items-center gap-0 mt-6">
      {STATUS_STEPS.map((step, i) => {
        const isComplete = i <= currentIndex;
        const isCurrent = i === currentIndex;
        const meta = STATUS_META[step];
        const Icon = meta.icon;

        return (
          <div key={step} className="flex items-center flex-1 last:flex-initial">
            {/* Dot */}
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  isComplete ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'
                } ${isCurrent ? 'ring-2 ring-black ring-offset-2' : ''}`}
              >
                <Icon size={14} />
              </div>
              <span className={`text-[10px] mt-1.5 uppercase tracking-wider ${isComplete ? 'text-black font-bold' : 'text-gray-400'}`}>
                {meta.label}
              </span>
            </div>

            {/* Connector line */}
            {i < STATUS_STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 ${i < currentIndex ? 'bg-black' : 'bg-gray-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Row helper ──
function Row({ label, value, className = '' }) {
  return (
    <div className={`flex justify-between ${className}`}>
      <span className="text-gray-500">{label}</span>
      <span>{value}</span>
    </div>
  );
}