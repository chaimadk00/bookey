import { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/actions";

function BookCard({ book, onQuickView }) {
  const dispatch = useDispatch();
  const [addedAnim, setAddedAnim] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    dispatch(addToCart(book));
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1400);
  };

  return (
    <article className="vintage-book-card" onClick={() => onQuickView && onQuickView(book)}>
      {/* 3D Storybook Cover Object */}
      <div className="book-cover-wrap">
        <div className="book-card__ribbon" aria-hidden="true" />
        <div
          className="book-card__cover"
          style={{ "--cover-tint": book.color }}
          role="img"
          aria-label={`Cover of ${book.title} by ${book.author}`}
        >
          {/* Subtle gold-stamped ornate frame */}
          <div className="book-cover__ornate-frame">
            <span className="book-cover__corner corner-tl">❧</span>
            <span className="book-cover__corner corner-tr">☙</span>
            <span className="book-cover__corner corner-bl">❧</span>
            <span className="book-cover__corner corner-br">☙</span>

            <span className="book-cover__seal-mark" aria-hidden="true">★</span>
            <h3 className="book-cover__title">{book.title}</h3>
            <div className="book-cover__divider" aria-hidden="true">
              <span className="book-cover__gem">♦</span>
            </div>
            <p className="book-cover__author">{book.author}</p>
            <span className="book-cover__year">{book.year}</span>
          </div>

          <div className="book-cover__spine" aria-hidden="true" />
          <div className="book-cover__page-edge" aria-hidden="true" />

          {/* Quick View Hover Badge */}
          <div className="book-cover__quickview-hover">
            <span>Quick View</span>
          </div>
        </div>
      </div>

      {/* Book Metadata & Description */}
      <div className="book-card__details">
        <div className="book-card__tags">
          <span className="book-tag">{book.category}</span>
          <span className="book-tag book-tag--year">Ed. {book.year}</span>
          <span className="book-tag book-tag--stock">● In Stock</span>
        </div>

        <h4 className="book-card__heading">{book.title}</h4>
        <p className="book-card__author-sub">by {book.author}</p>

        <p className="book-card__desc" title={book.description}>
          {book.description}
        </p>

        <div className="book-card__purchase-row">
          <div className="book-card__price-box">
            <span className="price-label">Price</span>
            <strong className="price-amount">
              {book.price.toLocaleString("en-US")} <span className="price-currency">DZD</span>
            </strong>
          </div>

          <button
            className={`btn-add-book ${addedAnim ? "btn-add-book--added" : ""}`}
            onClick={handleAdd}
            aria-label={`Add ${book.title} to cart`}
          >
            {addedAnim ? (
              <>
                <span className="btn-icon">✓</span> Added!
              </>
            ) : (
              <>
                <span className="btn-icon">+</span> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

export default BookCard;
