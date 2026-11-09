function Footer({ onSelectCategory }) {
  const handleCategory = (cat) => {
    if (onSelectCategory) onSelectCategory(cat);
    const catalogElement = document.getElementById("catalog");
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="storybook-footer" id="shipping-policy">
      <div className="footer__wave" aria-hidden="true">
        <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none">
          <path
            d="M0 30 C 360 60, 720 0, 1080 40 C 1260 60, 1380 20, 1440 30 L 1440 60 L 0 60 Z"
            fill="var(--sage-wash-dark)"
          />
        </svg>
      </div>

      <div className="footer__main">
        <div className="footer__columns">
          {/* Col 1: Brand & Mission */}
          <div className="footer__col footer__col--brand">
            <h3 className="footer__brand-title">Bookey</h3>
            <p className="footer__brand-arabic" lang="ar" dir="rtl">
              مكتبة بوكي · Algiers Bookstore
            </p>
            <p className="footer__bio">
              Independent online bookstore dedicated to preserving and championing Algerian literature,
              historical chronicles, and essays. Hand-packed and delivered with care across all 58 Wilayas.
            </p>
          </div>

          {/* Col 2: Catalog Quick Links */}
          <div className="footer__col">
            <h4 className="footer__heading">Literary Shelves</h4>
            <ul className="footer__list">
              <li>
                <button className="footer__link-btn" onClick={() => handleCategory("All")}>
                  All Books
                </button>
              </li>
              <li>
                <button className="footer__link-btn" onClick={() => handleCategory("Novel")}>
                  Novels & Fiction
                </button>
              </li>
              <li>
                <button className="footer__link-btn" onClick={() => handleCategory("History")}>
                  History & Revolution
                </button>
              </li>
              <li>
                <button className="footer__link-btn" onClick={() => handleCategory("Essay")}>
                  Essays & Philosophy
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Shipping & Customer Care */}
          <div className="footer__col">
            <h4 className="footer__heading">Customer Care</h4>
            <ul className="footer__list">
              <li><span>Delivery to 58 Wilayas</span></li>
              <li><span>Cash on Delivery (COD)</span></li>
              <li><span>24–48h Fast Dispatch</span></li>
              <li><span>Archival Book Packaging</span></li>
            </ul>
          </div>

          {/* Col 4: Dispatch Office */}
          <div className="footer__col">
            <h4 className="footer__heading">Dispatch Office</h4>
            <p className="footer__contact-text">
              Casbah & Didouche Mourad<br />
              Algiers, 16000, Algeria
            </p>
            <p className="footer__contact-text">
              Email: <strong>contact@bookey.dz</strong><br />
              WhatsApp / Tel: <strong>+213 (0) 550 12 34 56</strong>
            </p>
          </div>
        </div>

        {/* Bottom Bar with payment methods & copyright */}
        <div className="footer__bottom">
          <div className="footer__payment-badges">
            <span className="pay-badge">Cash on Delivery</span>
            <span className="pay-badge">BaridiMob</span>
            <span className="pay-badge">58 Wilayas</span>
          </div>

          <p className="footer__copy">
            © {new Date().getFullYear()} Bookey Bookstore. Preserving Algerian stories for readers worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
