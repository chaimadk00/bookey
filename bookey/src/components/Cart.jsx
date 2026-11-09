import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../redux/actions";
import CartItem from "./CartItem";

const DELIVERY_FEE = 400; // Flat fee for 58 wilayas in DZD
const FREE_DELIVERY_THRESHOLD = 4000;

function Cart({ isOpen, onClose, onCheckout }) {
  const items = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalBooks = items.reduce((sum, item) => sum + item.quantity, 0);
  const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;
  const delivery = items.length === 0 ? 0 : (isFreeDelivery ? 0 : DELIVERY_FEE);
  const grandTotal = subtotal + delivery;

  const format = (n) => n.toLocaleString("en-US") + " DZD";

  const handleStartCheckout = () => {
    if (onCheckout) {
      onCheckout({
        items,
        subtotal,
        deliveryFee: delivery,
        grandTotal
      });
    }
  };

  const cartContent = (
    <aside id="cart" className="vintage-ledger" aria-label="Shopping Cart">
      {/* Drawer close button when rendered in slide-over mode */}
      {onClose && (
        <button className="cart-drawer-close" onClick={onClose} aria-label="Close cart">
          ✕
        </button>
      )}

      {/* Decorative vintage ribbon topper */}
      <div className="ledger__bookmark-ribbon" aria-hidden="true" />

      <div className="ledger__header">
        <div className="ledger__stamp">
          <span className="ledger__stamp-circle">★ BOOKEY ★</span>
          <span className="ledger__stamp-sub">Algiers Archive & Dispatch</span>
        </div>
        <h2 className="ledger__title">Reading Basket</h2>
        <span className="ledger__subtitle">
          {totalBooks} {totalBooks === 1 ? "edition selected" : "editions selected"}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="ledger__empty">
          <div className="ledger__empty-art" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
          <p className="ledger__empty-title">Your basket is currently empty</p>
          <p className="ledger__empty-text">
            Choose a novel, history, or essay from our catalog to begin your reading collection.
          </p>
          {onClose && (
            <button className="btn-pill btn-pill--olive btn-pill--sm" onClick={onClose}>
              Browse Books
            </button>
          )}
        </div>
      ) : (
        <>
          <ul className="ledger__list">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </ul>

          <div className="ledger__breakdown">
            {/* Free Delivery Tracker */}
            <div className="ledger__perk-banner">
              {isFreeDelivery ? (
                <span className="perk-text perk-text--achieved">
                  Free shipping unlocked for all 58 Wilayas!
                </span>
              ) : (
                <span className="perk-text">
                  Add {format(FREE_DELIVERY_THRESHOLD - subtotal)} more for Free Shipping
                </span>
              )}
            </div>

            <dl className="ledger__totals">
              <div className="totals-row">
                <dt>Subtotal</dt>
                <dd>{format(subtotal)}</dd>
              </div>
              <div className="totals-row">
                <dt>
                  Wilaya Delivery (58 Provinces)
                  {isFreeDelivery && <span className="discount-tag">FREE</span>}
                </dt>
                <dd>{isFreeDelivery ? "0 DZD" : format(delivery)}</dd>
              </div>
              <div className="totals-row totals-row--grand">
                <dt>Total to Pay</dt>
                <dd className="grand-total-amount">{format(grandTotal)}</dd>
              </div>
            </dl>

            <button
              className="btn-pill btn-pill--terracotta btn-pill--block"
              onClick={handleStartCheckout}
            >
              <span>Proceed to Checkout</span>
              <span className="arrow-icon">→</span>
            </button>

            <button
              className="ledger__clear-btn"
              onClick={() => dispatch(clearCart())}
            >
              Clear Basket
            </button>
          </div>
        </>
      )}

      <div className="ledger__perforated-edge" aria-hidden="true" />
    </aside>
  );

  // If in drawer mode and triggered by navbar
  if (isOpen !== undefined) {
    if (!isOpen) return null;
    return (
      <div className="cart-drawer-backdrop" onClick={onClose} role="dialog" aria-modal="true">
        <div className="cart-drawer-panel" onClick={(e) => e.stopPropagation()}>
          {cartContent}
        </div>
      </div>
    );
  }

  // Standard inline version for desktop layout
  return cartContent;
}

export default Cart;
