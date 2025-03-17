import React, { useState, useEffect } from "react";
import { getAllBooks, deleteBook } from "../services/api";

const BookList = ({ onEdit }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await getAllBooks();
      setBooks(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch books");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDelete = async (bookId) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await deleteBook(bookId);
        setBooks(books.filter((book) => book.id !== bookId));
      } catch (err) {
        setError("Failed to delete book");
        console.error(err);
      }
    }
  };

  if (loading) return <div>Loading books...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="book-list">
      <h2>Books Collection</h2>
      {books.length === 0 ? (
        <p>No books found in the collection.</p>
      ) : (
        <div className="books-grid">
          {books.map((book) => (
            <div className="book-card" key={book.id}>
              <h3>{book.title}</h3>
              <p>
                <strong>Author:</strong> {book.author}
              </p>
              <p>
                <strong>Year:</strong> {book.year}
              </p>
              <p>
                <strong>Genre:</strong> {book.genre}
              </p>
              <div className="book-actions">
                <button onClick={() => onEdit(book)}>Edit</button>
                <button
                  onClick={() => handleDelete(book.id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookList;
