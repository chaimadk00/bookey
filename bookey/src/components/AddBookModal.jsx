import { useState } from "react";

function AddBookModal({ isOpen, onClose, onBookAdded }) {
  const [formData, setFormData] = useState({
    name: "",
    author: "",
    category: "Novel",
    price: "",
    year: new Date().getFullYear(),
    description: "",
    stock: 20,
    color: "#0b5d3b"
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "price" || name === "year" || name === "stock" ? Number(value) : value
    });
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const token = localStorage.getItem("bookey_token");
    if (!token) {
      setErrorMessage("You must be logged in with a valid JWT token to add a book.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create product in database.");
      }

      setSuccessMessage("Book successfully saved to MongoDB Atlas!");
      if (onBookAdded) {
        onBookAdded(data.product);
      }
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      setErrorMessage(err.message || "Could not connect to the backend server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="auth-modal add-book-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        <div className="auth-modal__header">
          <span className="auth-seal">★</span>
          <h2 className="auth-title">Add Book to Catalog</h2>
          <p className="auth-subtitle">
            Authenticated action: Creates a new product document in MongoDB Atlas using your JWT token.
          </p>
        </div>

        {errorMessage && <div className="auth-alert auth-alert--error">{errorMessage}</div>}
        {successMessage && <div className="auth-alert auth-alert--success">{successMessage}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="book-name" className="form-label">
              Book Title *
            </label>
            <input
              id="book-name"
              type="text"
              name="name"
              className="form-input"
              placeholder="e.g. Nedjma"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="book-author" className="form-label">
                Author *
              </label>
              <input
                id="book-author"
                type="text"
                name="author"
                className="form-input"
                placeholder="e.g. Kateb Yacine"
                value={formData.author}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="book-category" className="form-label">
                Category *
              </label>
              <select
                id="book-category"
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="Novel">Novel</option>
                <option value="History">History</option>
                <option value="Essay">Essay</option>
              </select>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="book-price" className="form-label">
                Price (DZD) *
              </label>
              <input
                id="book-price"
                type="number"
                name="price"
                min="0"
                className="form-input"
                placeholder="1200"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="book-year" className="form-label">
                Publication Year
              </label>
              <input
                id="book-year"
                type="number"
                name="year"
                className="form-input"
                value={formData.year}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="book-desc" className="form-label">
              Description / Synopsis *
            </label>
            <textarea
              id="book-desc"
              name="description"
              rows="3"
              className="form-input"
              placeholder="Synopsis of the literary work..."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="book-color" className="form-label">
              Cover Cloth Color
            </label>
            <input
              id="book-color"
              type="color"
              name="color"
              className="form-input color-picker-input"
              value={formData.color}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn-auth-submit" disabled={loading}>
            {loading ? "Saving to Database..." : "Publish Book (JWT Protected) →"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddBookModal;
