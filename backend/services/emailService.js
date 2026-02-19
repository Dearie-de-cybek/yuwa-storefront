// ============================================================
// EMAIL SERVICE — Resend integration
// ============================================================
// Handles all transactional emails for YUWA.
// Install: npm install resend
// Env: RESEND_API_KEY, RESEND_FROM_EMAIL
// ============================================================

const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL || 'YUWA <orders@yuwa.com>';

// ============================================================
// INTERNAL: Email templates
// ============================================================

const _orderItemsHtml = (items) => {
  return items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #eee;">
          <div style="display:flex;align-items:center;gap:12px;">
            ${item.imageUrl ? `<img src="${item.imageUrl}" width="60" height="60" style="border-radius:8px;object-fit:cover;" />` : ''}
            <div>
              <strong>${item.productName}</strong><br/>
              <span style="color:#666;font-size:13px;">${item.variantColor} / ${item.variantSize}</span>
            </div>
          </div>
        </td>
        <td style="padding:12px 0;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
        <td style="padding:12px 0;border-bottom:1px solid #eee;text-align:right;">₦${parseFloat(item.price).toLocaleString()}</td>
      </tr>`
    )
    .join('');
};

const _baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f5f5f5;">
  <div style="max-width:600px;margin:0 auto;background:#fff;">
    <!-- Header -->
    <div style="background:#000;padding:24px 32px;text-align:center;">
      <h1 style="color:#fff;font-size:24px;margin:0;letter-spacing:4px;font-weight:300;">YUWA</h1>
    </div>
    <!-- Content -->
    <div style="padding:32px;">
      ${content}
    </div>
    <!-- Footer -->
    <div style="background:#fafafa;padding:24px 32px;text-align:center;border-top:1px solid #eee;">
      <p style="color:#999;font-size:12px;margin:0;">
        YUWA Luxury African Fashion<br/>
        Lagos, Nigeria
      </p>
    </div>
  </div>
</body>
</html>`;

// ============================================================
// PUBLIC: Email sending functions
// ============================================================

/**
 * Send order confirmation email after successful payment.
 */
const sendOrderConfirmation = async (order) => {
  const address = order.shippingAddress;

  const content = `
    <h2 style="font-size:20px;font-weight:600;margin:0 0 8px;">Order Confirmed</h2>
    <p style="color:#666;margin:0 0 24px;">Thank you for your order. We're preparing your pieces with care.</p>
    
    <div style="background:#f9f9f9;border-radius:8px;padding:16px;margin-bottom:24px;">
      <p style="margin:0;font-size:14px;">
        <strong>Order Number:</strong> ${order.orderNumber}<br/>
        <strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-NG', { dateStyle: 'long' })}
      </p>
    </div>

    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <thead>
        <tr style="border-bottom:2px solid #000;">
          <th style="text-align:left;padding:8px 0;text-transform:uppercase;font-size:11px;letter-spacing:1px;">Item</th>
          <th style="text-align:center;padding:8px 0;text-transform:uppercase;font-size:11px;letter-spacing:1px;">Qty</th>
          <th style="text-align:right;padding:8px 0;text-transform:uppercase;font-size:11px;letter-spacing:1px;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${_orderItemsHtml(order.items)}
      </tbody>
    </table>

    <div style="margin-top:20px;padding-top:16px;border-top:2px solid #000;font-size:14px;">
      <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
        <span>Subtotal</span><span>₦${parseFloat(order.subtotal).toLocaleString()}</span>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
        <span>Shipping</span><span>₦${parseFloat(order.shippingCost).toLocaleString()}</span>
      </div>
      ${parseFloat(order.discount) > 0 ? `<div style="display:flex;justify-content:space-between;margin-bottom:4px;color:#16a34a;">
        <span>Discount</span><span>-₦${parseFloat(order.discount).toLocaleString()}</span>
      </div>` : ''}
      <div style="display:flex;justify-content:space-between;font-size:18px;font-weight:700;margin-top:8px;padding-top:8px;border-top:1px solid #eee;">
        <span>Total</span><span>₦${parseFloat(order.totalAmount).toLocaleString()}</span>
      </div>
    </div>

    ${address ? `
    <div style="margin-top:24px;padding:16px;background:#f9f9f9;border-radius:8px;">
      <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#999;font-weight:700;">Shipping To</p>
      <p style="margin:0;font-size:14px;">
        ${address.firstName} ${address.lastName}<br/>
        ${address.street}<br/>
        ${address.city}, ${address.state} ${address.zip}<br/>
        ${address.country}
      </p>
    </div>` : ''}

    <p style="color:#666;font-size:13px;margin-top:24px;">
      You'll receive another email when your order ships.
    </p>
  `;

  return _send(order.customerEmail, `Order Confirmed — ${order.orderNumber}`, content);
};

/**
 * Send order status update email.
 */
const sendStatusUpdate = async (order, newStatus, extras = {}) => {
  const statusMessages = {
    CONFIRMED:  { title: 'Order Confirmed', body: 'Your order has been confirmed and is being prepared.' },
    PROCESSING: { title: 'Order Being Prepared', body: 'Our artisans are carefully preparing your pieces.' },
    SHIPPED:    { title: 'Order Shipped!', body: 'Your order is on its way to you.' },
    DELIVERED:  { title: 'Order Delivered', body: 'Your order has been delivered. We hope you love it.' },
    CANCELLED:  { title: 'Order Cancelled', body: 'Your order has been cancelled. If you have questions, please contact us.' },
    REFUNDED:   { title: 'Refund Processed', body: 'Your refund has been processed. Please allow 5-10 business days.' },
  };

  const msg = statusMessages[newStatus] || { title: 'Order Updated', body: 'Your order status has been updated.' };

  const content = `
    <h2 style="font-size:20px;font-weight:600;margin:0 0 8px;">${msg.title}</h2>
    <p style="color:#666;margin:0 0 24px;">${msg.body}</p>
    
    <div style="background:#f9f9f9;border-radius:8px;padding:16px;margin-bottom:24px;">
      <p style="margin:0;font-size:14px;">
        <strong>Order Number:</strong> ${order.orderNumber}<br/>
        <strong>Status:</strong> ${newStatus}
        ${extras.trackingNumber ? `<br/><strong>Tracking Number:</strong> ${extras.trackingNumber}` : ''}
        ${extras.shippingMethod ? `<br/><strong>Shipping Method:</strong> ${extras.shippingMethod}` : ''}
      </p>
    </div>

    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <thead>
        <tr style="border-bottom:2px solid #000;">
          <th style="text-align:left;padding:8px 0;text-transform:uppercase;font-size:11px;letter-spacing:1px;">Item</th>
          <th style="text-align:center;padding:8px 0;text-transform:uppercase;font-size:11px;letter-spacing:1px;">Qty</th>
          <th style="text-align:right;padding:8px 0;text-transform:uppercase;font-size:11px;letter-spacing:1px;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${_orderItemsHtml(order.items)}
      </tbody>
    </table>

    <div style="margin-top:16px;padding-top:12px;border-top:2px solid #000;font-size:16px;font-weight:700;text-align:right;">
      Total: ₦${parseFloat(order.totalAmount).toLocaleString()}
    </div>
  `;

  return _send(order.customerEmail, `${msg.title} — ${order.orderNumber}`, content);
};

// ============================================================
// INTERNAL: Send via Resend
// ============================================================

const _send = async (to, subject, htmlContent) => {
  try {
    const result = await resend.emails.send({
      from: FROM,
      to,
      subject,
      html: _baseTemplate(htmlContent),
    });
    console.log(`📧 Email sent to ${to}: ${subject}`);
    return result;
  } catch (error) {
    // Don't throw — email failure should not break order flow
    console.error(`❌ Email failed to ${to}:`, error.message);
    return null;
  }
};

module.exports = {
  sendOrderConfirmation,
  sendStatusUpdate,
};