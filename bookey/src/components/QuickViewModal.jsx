import { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/actions";

function QuickViewModal({ book, onClose, onOpenCart }) {
  const dispatch = useDispatch();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!book) return null;

  const handleAddToCart = () => {
    // Add multiple items if qty > 1
    for (let i = 0; i < qty; i++) {
      dispatch(addToCart(book));
    }
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
      if (onOpenCart) onOpenCart();
    }, 800);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="quickview-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        <div className="quickview-grid">
          {/* Left: Big Book Cover */}
          <div className="quickview-cover-col">
            <div
              className="quickview-cover"
              style={{ "--cover-tint": book.color }}
            >
              <div className="book-cover__spine" />
              <div className="book-cover__ornate-frame">
                <span className="book-cover__seal-mark">★</span>
                <h3 className="book-cover__title">{book.title}</h3>
                <div className="book-cover__divider">
                  <span className="book-cover__gem">♦</span>
                </div>
                <p className="book-cover__author">{book.author}</p>
                <span className="book-cover__year">{book.year}</span>
              </div>
            </div>
          </div>

          {/* Right: Book Details & Purchase Controls */}
          <div className="quickview-info-col">
            <div className="quickview-meta-tags">
              <span className="book-tag">{book.category}</span>
              <span className="book-tag book-tag--year">First Published {book.year}</span>
              <span className="book-tag book-tag--stock">● Ready to Dispatch</span>
            </div>

            <h2 className="quickview-title">{book.title}</h2>
            <p className="quickview-author">By <strong>{book.author}</strong></p>

            <div className="quickview-price-badge">
              <span className="price-main">{book.price.toLocaleString("en-US")} DZD</span>
              <span className="price-note">Tax included · Pay on delivery</span>
            </div>

            <div className="quickview-desc-box">
              <h4 className="desc-heading">Synopsis</h4>
              <p className="desc-content">{book.description}</p>
            </div>

            <div className="quickview-highlights">
              <div className="highlight-item">
                <span className="highlight-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="3" width="15" height="13" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                </span>
                <span>Delivery in 24–48h to all 58 Wilayas</span>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                </span>
                <span>Authentic Algerian edition with satin ribbon</span>
              </div>
            </div>

            <div className="quickview-actions">
              <div className="qty-picker">
                <button
                  type="button"
                  className="qty-picker__btn"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="qty-picker__value">{qty}</span>
                <button
                  type="button"
                  className="qty-picker__btn"
                  onClick={() => setQty(qty + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                className={`btn-modal-add ${added ? "btn-modal-add--added" : ""}`}
                onClick={handleAddToCart}
              >
                {added ? "Added to Cart! ✓" : `Add to Cart • ${(book.price * qty).toLocaleString("en-US")} DZD`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuickViewModal;
