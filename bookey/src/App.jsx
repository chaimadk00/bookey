import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import SearchBar from "./components/SearchBar";
import CategoryFilter from "./components/CategoryFilter";
import BookList from "./components/BookList";
import Cart from "./components/Cart";
import QuickViewModal from "./components/QuickViewModal";
import CheckoutModal from "./components/CheckoutModal";
import AuthModal from "./components/AuthModal";
import AddBookModal from "./components/AddBookModal";
import Footer from "./components/Footer";
import { books as initialBooks, categories } from "./data/books";

function App() {
  const [catalog, setCatalog] = useState(initialBooks);
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");

  // Authentication state
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("bookey_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // E-commerce state
  const [selectedBook, setSelectedBook] = useState(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState(null);

  // Fetch live products from REST API (MongoDB Atlas)
  const fetchLiveProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      if (!res.ok) return;
      const data = await res.json();
      if (data.products && Array.isArray(data.products) && data.products.length > 0) {
        const normalized = data.products.map((p) => ({
          ...p,
          id: p._id || p.id,
          title: p.name || p.title,
          author: p.author || "Unknown",
          year: p.year || 1960,
          color: p.color || "#3A4E38"
        }));
        setCatalog(normalized);
        setIsLiveConnected(true);
      }
    } catch (err) {
      console.log("Backend offline, using local fallback archive.");
    }
  };

  useEffect(() => {
    fetchLiveProducts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("bookey_token");
    localStorage.removeItem("bookey_user");
    setCurrentUser(null);
  };

  const query = search.trim().toLowerCase();

  let visibleBooks = catalog.filter((book) => {
    const matchesCategory = category === "All" || book.category === category;
    const matchesSearch =
      (book.title && book.title.toLowerCase().includes(query)) ||
      (book.author && book.author.toLowerCase().includes(query)) ||
      (book.description && book.description.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  if (sort === "price-asc") {
    visibleBooks = [...visibleBooks].sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    visibleBooks = [...visibleBooks].sort((a, b) => b.price - a.price);
  } else if (sort === "title") {
    visibleBooks = [...visibleBooks].sort((a, b) => a.title.localeCompare(b.title));
  } else if (sort === "year-asc") {
    visibleBooks = [...visibleBooks].sort((a, b) => a.year - b.year);
  } else if (sort === "year-desc") {
    visibleBooks = [...visibleBooks].sort((a, b) => b.year - a.year);
  }

  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setSort("default");
  };

  const handleScrollToCatalog = () => {
    const catalogElement = document.getElementById("catalog");
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="storybook-app">
      {/* 1. Working E-commerce Navbar with Auth & Cart */}
      <Navbar
        activeCategory={category}
        onSelectCategory={(cat) => setCategory(cat)}
        onOpenCart={() => setIsCartDrawerOpen(true)}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      <main>
        {/* 2. Focused E-commerce Hero with Featured Book Spotlight & Trust Strip */}
        <Hero onExploreClick={handleScrollToCatalog} />

        {/* 3. Main Catalog & Sticky Cart Layout */}
        <div className="vintage-layout" id="catalog">
          <section className="catalog-section" aria-label="Book Catalog">
            <div className="catalog-header">
              <span className="catalog-header__tag">The Collection</span>
              <h2 className="catalog-header__title">
                {category === "All" ? "Algerian Literary Archive" : `${category}s & Masterworks`}
              </h2>
              <p className="catalog-header__desc">
                Browse our curated selection of Algerian novels, historical chronicles, and essays.
                All volumes are in stock and ready to ship to your wilaya.
              </p>
            </div>

            {/* Filter & Search Toolbar */}
            <div className="catalog-controls">
              <div className="catalog-toolbar-actions">
                <div className="db-status-pill">
                  <span className={`db-status-dot ${isLiveConnected ? "db-status-dot--live" : ""}`} />
                  <span>{isLiveConnected ? "MongoDB Atlas: Live Connected" : "Local Archive"}</span>
                </div>
                <button
                  type="button"
                  className="btn-add-catalog-book"
                  onClick={() => {
                    if (!currentUser) {
                      setIsAuthModalOpen(true);
                    } else {
                      setIsAddBookOpen(true);
                    }
                  }}
                >
                  + Add Book (JWT Protected)
                </button>
              </div>

              <div className="catalog-controls__top">
                <SearchBar value={search} onChange={setSearch} />

                <div className="vintage-sort">
                  <label htmlFor="sort-select" className="vintage-sort__label">
                    Arrange:
                  </label>
                  <div className="sort-select-wrapper">
                    <select
                      id="sort-select"
                      className="vintage-sort__select"
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                    >
                      <option value="default">Featured Classics</option>
                      <option value="year-asc">Chronological (Oldest First)</option>
                      <option value="year-desc">Chronological (Newest First)</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="title">Title: A to Z</option>
                    </select>
                  </div>
                </div>
              </div>

              <CategoryFilter
                categories={categories}
                active={category}
                onSelect={setCategory}
              />
            </div>

            {/* Result status bar */}
            <div className="catalog-status" aria-live="polite">
              <span className="status-text">
                Showing <strong>{visibleBooks.length}</strong> {visibleBooks.length === 1 ? "volume" : "volumes"}
                {category !== "All" && <span> in <em>{category}</em></span>}
                {search && <span> matching "<em>{search}</em>"</span>}
              </span>

              {(search || category !== "All" || sort !== "default") && (
                <button className="reset-filters-btn" onClick={resetFilters}>
                  ↺ Reset all filters
                </button>
              )}
            </div>

            {/* Book Grid */}
            <BookList
              books={visibleBooks}
              onQuickView={(book) => setSelectedBook(book)}
            />
          </section>

          {/* Inline Cart for Desktop Layout */}
          <div className="layout__cart-sidebar">
            <Cart onCheckout={(data) => setCheckoutData(data)} />
          </div>
        </div>
      </main>

      {/* Slide-over Cart Drawer (triggered from navbar on mobile/tablet or when requested) */}
      <Cart
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        onCheckout={(data) => {
          setIsCartDrawerOpen(false);
          setCheckoutData(data);
        }}
      />

      {/* Quick View Book Modal */}
      {selectedBook && (
        <QuickViewModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onOpenCart={() => setIsCartDrawerOpen(true)}
        />
      )}

      {/* Real Algerian E-commerce Checkout Modal */}
      {checkoutData && (
        <CheckoutModal
          items={checkoutData.items}
          subtotal={checkoutData.subtotal}
          deliveryFee={checkoutData.deliveryFee}
          grandTotal={checkoutData.grandTotal}
          onClose={() => setCheckoutData(null)}
        />
      )}

      {/* User Login & Registration Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          fetchLiveProducts();
        }}
      />

      {/* Add Book to Database Modal */}
      <AddBookModal
        isOpen={isAddBookOpen}
        onClose={() => setIsAddBookOpen(false)}
        onBookAdded={() => fetchLiveProducts()}
      />

      {/* 4. Purposeful E-commerce Footer */}
      <Footer onSelectCategory={(cat) => setCategory(cat)} />
    </div>
  );
}

export default App;
