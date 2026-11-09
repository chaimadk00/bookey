import { useState } from "react";
import { useSelector } from "react-redux";

function VintageSeal() {
  return (
    <svg className="navbar__seal" viewBox="0 0 44 44" aria-hidden="true">
      <circle cx="22" cy="22" r="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
      <circle cx="22" cy="22" r="17.5" fill="none" stroke="currentColor" strokeWidth="1" />
      <path
        d="M23 11 A 11 11 0 1 0 23 33 A 8.5 8.5 0 1 1 23 11 Z"
        fill="currentColor"
      />
      <polygon
        fill="#DE8361"
        points="26,17 27.2,20.2 30.6,20.3 27.8,22.3 28.8,25.6 26,23.6 23.2,25.6 24.2,22.3 21.4,20.3 24.8,20.2"
      />
    </svg>
  );
}

function Navbar({ activeCategory, onSelectCategory, onOpenCart, currentUser, onOpenAuth, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Read items from Redux store
  const items = useSelector((state) => state.cart.items);
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleNavClick = (category) => {
    onSelectCategory(category);
    setMobileMenuOpen(false);
    const catalogElement = document.getElementById("catalog");
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="site-header">
      {/* 1. Top Announcement Bar (Crucial E-commerce feature for Algeria) */}
      <div className="announcement-bar">
        <div className="announcement-bar__inner">
          <span className="announcement-tag">Wilaya Express</span>
          <span className="announcement-message">
            Doorstep Delivery across all 58 Wilayas · Cash on Delivery Available · Free shipping on orders over 4,000 DZD
          </span>
          <a href="#shipping-policy" className="announcement-link" onClick={() => handleNavClick("All")}>
            Delivery Rates
          </a>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="navbar">
        <div className="navbar__container">
          {/* Brand Logo */}
          <a className="navbar__brand" href="#top" onClick={() => handleNavClick("All")}>
            <VintageSeal />
            <div className="navbar__brand-text">
              <span className="navbar__name">Bookey</span>
              <span className="navbar__tagline">مكتبة بوكي · Algiers Bookstore</span>
            </div>
          </a>

          {/* Working E-commerce Category Links */}
          <nav className={`navbar__nav ${mobileMenuOpen ? "navbar__nav--open" : ""}`} aria-label="Store Categories">
            <button
              className={`navbar__nav-btn ${activeCategory === "All" ? "navbar__nav-btn--active" : ""}`}
              onClick={() => handleNavClick("All")}
            >
              All Books
            </button>
            <button
              className={`navbar__nav-btn ${activeCategory === "Novel" ? "navbar__nav-btn--active" : ""}`}
              onClick={() => handleNavClick("Novel")}
            >
              Novels
            </button>
            <button
              className={`navbar__nav-btn ${activeCategory === "History" ? "navbar__nav-btn--active" : ""}`}
              onClick={() => handleNavClick("History")}
            >
              History
            </button>
            <button
              className={`navbar__nav-btn ${activeCategory === "Essay" ? "navbar__nav-btn--active" : ""}`}
              onClick={() => handleNavClick("Essay")}
            >
              Essays
            </button>
          </nav>

          {/* Right Header Actions: Auth, Cart Button & Mobile Menu Toggle */}
          <div className="navbar__actions">
            {currentUser ? (
              <div className="navbar__user-profile">
                <span className="navbar__user-name" title={currentUser.email}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span>{currentUser.name}</span>
                </span>
                <button
                  type="button"
                  className="navbar__logout-btn"
                  onClick={onLogout}
                  aria-label="Sign out"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="navbar__auth-btn"
                onClick={onOpenAuth}
                aria-label="Sign in or register"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>Sign In</span>
              </button>
            )}

            <button
              className="navbar__cart-btn"
              onClick={onOpenCart}
              aria-label={`Open shopping cart with ${totalCount} items`}
            >
              <span className="cart-icon-wrapper" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                {totalCount > 0 && <span className="cart-badge">{totalCount}</span>}
              </span>

              <div className="cart-text-details">
                <span className="cart-title">Cart</span>
                <span className="cart-amount">
                  {subtotal > 0 ? `${subtotal.toLocaleString("en-US")} DZD` : "0 DZD"}
                </span>
              </div>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              className="navbar__mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
            >
              <span className="hamburger-line" />
              <span className="hamburger-line" />
              <span className="hamburger-line" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
