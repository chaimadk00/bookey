import BookCard from "./BookCard";

function BookList({ books, onQuickView }) {
  if (books.length === 0) {
    return (
      <div className="book-grid-empty">
        <span className="empty-leaf" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        </span>
        <h3 className="empty-title">No books found in this shelf</h3>
        <p className="empty-desc">
          We couldn't find any volume matching your criteria. Try adjusting your search term or selecting another category.
        </p>
      </div>
    );
  }

  return (
    <div className="book-grid">
      {books.map((book) => (
        <BookCard
          key={book.id || book._id}
          book={book}
          onQuickView={onQuickView}
        />
      ))}
    </div>
  );
}

export default BookList;
