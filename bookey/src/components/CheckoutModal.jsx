import { useState } from "react";
import { useDispatch } from "react-redux";
import { clearCart } from "../redux/actions";
import { wilayas } from "../data/wilayas";

function CheckoutModal({ items, subtotal, deliveryFee, grandTotal, onClose }) {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    wilaya: "16 - Alger",
    commune: "",
    notes: "",
    paymentMethod: "cod" // Cash on delivery
  });

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.commune) {
      alert("Please fill in your name, phone number, and delivery address.");
      return;
    }

    const randomId = "BK-" + Math.floor(100000 + Math.random() * 900000);
    setOrderId(randomId);
    setOrderPlaced(true);
    dispatch(clearCart());
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close checkout">
          ✕
        </button>

        {!orderPlaced ? (
          <div className="checkout-content">
            <div className="checkout-header">
              <span className="checkout-seal">★</span>
              <h2 className="checkout-title">Complete Your Order</h2>
              <p className="checkout-subtitle">
                Cash on delivery across all 58 Wilayas of Algeria. Pay in cash when your parcel arrives.
              </p>
            </div>

            <form className="checkout-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                {/* Full Name */}
                <div className="form-group">
                  <label htmlFor="fullName" className="form-label">
                    Full Name / Nom & Prénom *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    className="form-input"
                    placeholder="e.g. Yacine Rahmani"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Phone Number */}
                <div className="form-group">
                  <label htmlFor="phone" className="form-label">
                    Phone Number / Numéro de téléphone *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="form-input"
                    placeholder="05 / 06 / 07 XX XX XX XX"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Wilaya Selection */}
                <div className="form-group">
                  <label htmlFor="wilaya" className="form-label">
                    Wilaya (58 Provinces) *
                  </label>
                  <select
                    id="wilaya"
                    name="wilaya"
                    className="form-select"
                    value={formData.wilaya}
                    onChange={handleChange}
                    required
                  >
                    {wilayas.map((w) => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </div>

                {/* Commune / Address */}
                <div className="form-group">
                  <label htmlFor="commune" className="form-label">
                    Commune & Street Address *
                  </label>
                  <input
                    type="text"
                    id="commune"
                    name="commune"
                    className="form-input"
                    placeholder="e.g. Didouche Mourad, Alger Centre"
                    value={formData.commune}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Delivery Notes */}
              <div className="form-group form-group--full">
                <label htmlFor="notes" className="form-label">
                  Delivery Notes / Remarques (Optional)
                </label>
                <input
                  type="text"
                  id="notes"
                  name="notes"
                  className="form-input"
                  placeholder="e.g. Call before delivery, deliver after 2 PM..."
                  value={formData.notes}
                  onChange={handleChange}
                />
              </div>

              {/* Payment Method Badge */}
              <div className="payment-method-box">
                <label className="payment-radio-label">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === "cod"}
                    onChange={handleChange}
                  />
                  <div className="payment-info">
                    <strong>Cash on Delivery (Paiement à la livraison)</strong>
                    <span>Pay in Algerian Dinars (DZD) directly to courier upon parcel reception</span>
                  </div>
                </label>
              </div>

              {/* Order Summary Recap */}
              <div className="checkout-summary-box">
                <h4 className="summary-title">Order Recap ({items.reduce((s, i) => s + i.quantity, 0)} books)</h4>
                <div className="summary-items-list">
                  {items.map((item) => (
                    <div key={item.id} className="summary-row">
                      <span>{item.quantity}× {item.title}</span>
                      <strong>{(item.price * item.quantity).toLocaleString("en-US")} DZD</strong>
                    </div>
                  ))}
                </div>
                <div className="summary-calc">
                  <div className="calc-row">
                    <span>Subtotal:</span>
                    <span>{subtotal.toLocaleString("en-US")} DZD</span>
                  </div>
                  <div className="calc-row">
                    <span>Delivery ({formData.wilaya.split(" - ")[1]}):</span>
                    <span>{deliveryFee === 0 ? "FREE" : `${deliveryFee.toLocaleString("en-US")} DZD`}</span>
                  </div>
                  <div className="calc-row calc-row--total">
                    <strong>Total to Pay:</strong>
                    <strong className="total-highlight">{grandTotal.toLocaleString("en-US")} DZD</strong>
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-confirm-order">
                Confirm & Place Order (Pay on Delivery) →
              </button>
            </form>
          </div>
        ) : (
          /* Order Success Receipt */
          <div className="order-success-card">
            <div className="success-icon" aria-hidden="true">✓</div>
            <span className="success-tag">Order Confirmed</span>
            <h2 className="success-title">Saha / Thank you for your order!</h2>
            <p className="success-text">
              Your parcel has been logged with our Algiers dispatch office. We will call you on <strong>{formData.phone}</strong> prior to delivery.
            </p>

            <div className="success-receipt">
              <div className="receipt-row">
                <span>Order Reference:</span>
                <strong>{orderId}</strong>
              </div>
              <div className="receipt-row">
                <span>Recipient:</span>
                <strong>{formData.fullName}</strong>
              </div>
              <div className="receipt-row">
                <span>Destination:</span>
                <strong>{formData.commune}, {formData.wilaya}</strong>
              </div>
              <div className="receipt-row">
                <span>Payment:</span>
                <strong>{grandTotal.toLocaleString("en-US")} DZD (Cash on Delivery)</strong>
              </div>
              <div className="receipt-row">
                <span>Estimated Arrival:</span>
                <strong>24 to 48 Hours</strong>
              </div>
            </div>

            <button className="btn-continue-shopping" onClick={onClose}>
              Continue Browsing Bookstore
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckoutModal;
