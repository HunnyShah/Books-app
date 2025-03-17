import React, { useState, useEffect } from "react";
import { updateBook } from "../services/api";

const EditBookForm = ({ book, onCancel, onBookUpdated }) => {
  const [editedBook, setEditedBook] = useState({
    title: "",
    author: "",
    year: "",
    genre: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (book) {
      setEditedBook({
        title: book.title || "",
        author: book.author || "",
        year: book.year || "",
        genre: book.genre || "",
      });
    }
  }, [book]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedBook((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!editedBook.title || !editedBook.author) {
      setError("Title and author are required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await updateBook(book.id, editedBook);

      // Notify parent component
      if (onBookUpdated) onBookUpdated();
    } catch (err) {
      setError("Failed to update book");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-form">
      <h2>Edit Book</h2>
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="edit-title">Title*</label>
          <input
            type="text"
            id="edit-title"
            name="title"
            value={editedBook.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="edit-author">Author*</label>
          <input
            type="text"
            id="edit-author"
            name="author"
            value={editedBook.author}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="edit-year">Year</label>
          <input
            type="number"
            id="edit-year"
            name="year"
            value={editedBook.year}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="edit-genre">Genre</label>
          <input
            type="text"
            id="edit-genre"
            name="genre"
            value={editedBook.genre}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Book"}
          </button>
          <button type="button" onClick={onCancel} className="cancel-btn">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBookForm;
