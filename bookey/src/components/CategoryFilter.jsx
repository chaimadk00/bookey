function CategoryFilter({ categories, active, onSelect }) {
  const renderCategoryIcon = (cat) => {
    switch (cat) {
      case "All":
        return (
          <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
            <polygon points="12 2 15 9 22 12 15 15 12 22 9 15 2 12 9 9" />
          </svg>
        );
      case "Novel":
        return (
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        );
      case "History":
        return (
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="21" x2="21" y2="21" />
            <line x1="4" y1="10" x2="20" y2="10" />
            <polyline points="12 3 2 10 22 10" />
            <line x1="6" y1="10" x2="6" y2="21" />
            <line x1="10" y1="10" x2="10" y2="21" />
            <line x1="14" y1="10" x2="14" y2="21" />
            <line x1="18" y1="10" x2="18" y2="21" />
          </svg>
        );
      case "Essay":
        return (
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 19l7-7 3 3-7 7-3-3z" />
            <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
            <path d="M2 2l7.586 7.586" />
            <circle cx="11" cy="11" r="2" />
          </svg>
        );
      default:
        return <span>•</span>;
    }
  };

  return (
    <div className="vintage-filter" role="group" aria-label="Filter by category">
      <span className="filter-hint">Shelf:</span>
      <div className="filter-pills">
        {categories.map((category) => {
          const isActive = category === active;
          return (
            <button
              key={category}
              className={`filter-pill ${isActive ? "filter-pill--active" : ""}`}
              aria-pressed={isActive}
              onClick={() => onSelect(category)}
            >
              <span className="filter-pill__icon" aria-hidden="true">
                {renderCategoryIcon(category)}
              </span>
              <span className="filter-pill__text">{category}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CategoryFilter;
