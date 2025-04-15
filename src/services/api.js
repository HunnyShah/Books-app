// src/api.js
import { get, post, put, del } from "aws-amplify/api";

const apiName = "booksApi";

// export const fetchBooks = async () => {
//   const response = await API.get(apiName, "/books");
//   return response;
// };

export const fetchBooks = async () => {
  try {
    const response = await get({
      apiName: "books",
      path: "/books",
    });
    return response.body;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
};

// export const addBook = async (book) => {
//   const response = await API.post(apiName, "/books", {
//     body: book,
//   });
//   return response;
// };

export const addBook = async (book) => {
  try {
    const response = await post({
      apiName: "books",
      path: "/books",
      body: book,
    });
    return response.body;
  } catch (error) {
    console.error("Error adding books:", error);
    throw error;
  }
};

// export const deleteBook = async (bookId) => {
//   const response = await API.del(apiName, `/books/${bookId}`);
//   return response;
// };

export const deleteBook = async (bookId) => {
  try {
    const response = await del({
      apiName: "books",
      path: `/books/${bookId}`,
    });
    return response.body;
  } catch (error) {
    console.error("Error deleting books:", error);
    throw error;
  }
};

// export const updateBook = async (bookId, updatedBook) => {
//   const response = await API.put(apiName, `/books/${bookId}`, {
//     body: updatedBook,
//   });
//   return response;
// };

export const updateBook = async (bookId, updatedBook) => {
  try {
    const response = await put({
      apiName: "books",
      path: `/books/${bookId}`,
      body: updatedBook,
    });
    return response.body;
  } catch (error) {
    console.error("Error updating books:", error);
    throw error;
  }
};
