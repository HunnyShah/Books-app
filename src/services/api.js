import { Auth } from "aws-amplify";
import { API } from "aws-amplify";

export const getAllBooks = async () => {
  const token = (await Auth.currentSession()).getIdToken().getJwtToken();

  try {
    const response = await API.get("booksApi", "/books", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
};

export const addBook = async (bookData) => {
  const token = (await Auth.currentSession()).getIdToken().getJwtToken();

  try {
    const response = await API.post("booksApi", "/books", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: bookData,
    });
    return response;
  } catch (error) {
    console.error("Error adding book:", error);
    throw error;
  }
};

export const updateBook = async (bookId, bookData) => {
  const token = (await Auth.currentSession()).getIdToken().getJwtToken();

  try {
    const response = await API.put("booksApi", `/books/${bookId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: bookData,
    });
    return response;
  } catch (error) {
    console.error("Error updating book:", error);
    throw error;
  }
};

export const deleteBook = async (bookId) => {
  const token = (await Auth.currentSession()).getIdToken().getJwtToken();

  try {
    const response = await API.del("booksApi", `/books/${bookId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error deleting book:", error);
    throw error;
  }
};
