import React, { useState } from "react";
import { addBook } from "../services/api";

const AddBookForm = ({ onBookAdded }) => {
  const [book, setBook] = useState({
    title: "",
    author: "",
    year: "",
    genre: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!book.title || !book.author) {
      setError("Title and author are required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await addBook(book);

      // Clear form
      setBook({
        title: "",
        author: "",
        year: "",
        genre: "",
      });

      // Notify parent component
      if (onBookAdded) onBookAdded();
    } catch (err) {
      setError("Failed to add book");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-form">
      <h2>Add New Book</h2>
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title*</label>
          <input
            type="text"
            id="title"
            name="title"
            value={book.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="author">Author*</label>
          <input
            type="text"
            id="author"
            name="author"
            value={book.author}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="year">Year</label>
          <input
            type="number"
            id="year"
            name="year"
            value={book.year}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="genre">Genre</label>
          <input
            type="text"
            id="genre"
            name="genre"
            value={book.genre}
            onChange={handleChange}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Book"}
        </button>
      </form>
    </div>
  );
};

export default AddBookForm;
