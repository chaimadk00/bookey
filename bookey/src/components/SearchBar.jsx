function SearchBar({ value, onChange }) {
  return (
    <div className="vintage-search">
      <label htmlFor="search" className="vintage-search__label">
        <span className="search-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <span className="label-text">Archive Search</span>
      </label>
      <div className="vintage-search__input-wrapper">
        <input
          id="search"
          className="vintage-search__input"
          type="search"
          placeholder="Search by title or author (e.g. Nedjma, Fanon, Camus)..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {value && (
          <button
            type="button"
            className="vintage-search__clear-btn"
            onClick={() => onChange("")}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
