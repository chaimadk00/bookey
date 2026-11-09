import { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/actions";
import { books } from "../data/books";

function Hero({ onExploreClick }) {
  const dispatch = useDispatch();
  const [addedFeatured, setAddedFeatured] = useState(false);

  // Featured book of the month: "Nedjma" (id: 1) or first book
  const featuredBook = books[0];

  const handleAddFeatured = () => {
    dispatch(addToCart(featuredBook));
    setAddedFeatured(true);
    setTimeout(() => setAddedFeatured(false), 1500);
  };

  return (
    <section className="ecommerce-hero" id="top">
      <div className="ecommerce-hero__main">
        <div className="ecommerce-hero__container">
          {/* Left Column: Hero Value Proposition */}
          <div className="hero-content">
            <div className="hero-kicker">
              <span className="hero-kicker__dot">✦</span>
              <span>Algeria's Premier Independent Bookstore</span>
              <span className="hero-kicker__dot">✦</span>
            </div>

            <h1 className="hero-heading">
              Stories crafted with memory, courage & heritage.
            </h1>

            <p className="hero-lead">
              From Kateb Yacine's revolutionary poetics to Assia Djebar's timeless prose.
              We curate, preserve, and deliver Algeria’s greatest literary masterworks
              straight to your home in all 58 wilayas.
            </p>

            <div className="hero-cta-group">
              <button className="btn-hero-primary" onClick={onExploreClick}>
                <span>Explore Catalog</span>
                <span className="btn-arrow" aria-hidden="true">↓</span>
              </button>
              <a href="#featured-spotlight" className="btn-hero-secondary">
                Book of the Month
              </a>
            </div>

            {/* Quick Stats Strip */}
            <div className="hero-metrics">
              <div className="metric-item">
                <strong className="metric-number">58</strong>
                <span className="metric-label">Wilayas Delivered</span>
              </div>
              <div className="metric-divider" aria-hidden="true">|</div>
              <div className="metric-item">
                <strong className="metric-number">100%</strong>
                <span className="metric-label">Original Editions</span>
              </div>
              <div className="metric-divider" aria-hidden="true">|</div>
              <div className="metric-item">
                <strong className="metric-number">24-48h</strong>
                <span className="metric-label">Dispatch Time</span>
              </div>
            </div>
          </div>

          {/* Right Column: Featured Spotlight Book Card */}
          <div className="hero-spotlight" id="featured-spotlight">
            <div className="spotlight-card">
              <div className="spotlight-card__ribbon">Book of the Month</div>

              <div className="spotlight-card__body">
                {/* 3D Book Cover */}
                <div
                  className="spotlight-book-cover"
                  style={{ "--cover-bg": featuredBook.color }}
                  role="img"
                  aria-label={`Cover of ${featuredBook.title}`}
                >
                  <div className="spotlight-cover-spine" />
                  <div className="spotlight-cover-frame">
                    <span className="spotlight-cover-seal">★</span>
                    <h3 className="spotlight-cover-title">{featuredBook.title}</h3>
                    <p className="spotlight-cover-author">{featuredBook.author}</p>
                    <span className="spotlight-cover-year">{featuredBook.year}</span>
                  </div>
                </div>

                {/* Spotlight Info */}
                <div className="spotlight-info">
                  <span className="spotlight-genre-tag">{featuredBook.category} Classic</span>
                  <h4 className="spotlight-title">{featuredBook.title}</h4>
                  <p className="spotlight-author">By {featuredBook.author} ({featuredBook.year})</p>
                  <p className="spotlight-synopsis">
                    "{featuredBook.description}"
                  </p>

                  <div className="spotlight-price-row">
                    <div>
                      <span className="spotlight-price-label">Price</span>
                      <strong className="spotlight-price-value">
                        {featuredBook.price.toLocaleString("en-US")} DZD
                      </strong>
                    </div>

                    <button
                      className={`btn-spotlight-add ${addedFeatured ? "btn-spotlight-add--added" : ""}`}
                      onClick={handleAddFeatured}
                      aria-label={`Add ${featuredBook.title} to cart`}
                    >
                      {addedFeatured ? "Added to Cart! ✓" : "Quick Add +"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust & Guarantees Strip (Real E-commerce Standards) */}
      <div className="trust-strip">
        <div className="trust-strip__container">
          <div className="trust-item">
            <span className="trust-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </span>
            <div className="trust-text">
              <strong>All 58 Wilayas</strong>
              <span>Fast home & desk delivery</span>
            </div>
          </div>

          <div className="trust-item">
            <span className="trust-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="6" width="20" height="12" rx="2" />
                <circle cx="12" cy="12" r="2" />
                <path d="M6 12h.01M18 12h.01" />
              </svg>
            </span>
            <div className="trust-text">
              <strong>Cash on Delivery</strong>
              <span>Paiement à la livraison</span>
            </div>
          </div>

          <div className="trust-item">
            <span className="trust-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </span>
            <div className="trust-text">
              <strong>Original Press</strong>
              <span>Authentic Algerian literature</span>
            </div>
          </div>

          <div className="trust-item">
            <span className="trust-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </span>
            <div className="trust-text">
              <strong>Archival Packaging</strong>
              <span>Protected with custom bookmark</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
