import React, { useState, useEffect } from "react";
import { Amplify, Auth, Hub } from "aws-amplify";
import BookList from "./components/BookList";
import AddBookForm from "./components/AddBookForm";
import EditBookForm from "./components/EditBookForm";
import Login from "./components/Auth/Login";
import SignUp from "./components/Auth/SignUp";
import { awsConfig } from "./config";
import "./App.css";

// Configure Amplify
Amplify.configure({
  Auth: {
    region: awsConfig.cognito.REGION,
    userPoolId: awsConfig.cognito.USER_POOL_ID,
    userPoolWebClientId: awsConfig.cognito.APP_CLIENT_ID,
    identityPoolId: awsConfig.cognito.IDENTITY_POOL_ID,
  },
  API: {
    endpoints: [
      {
        name: "booksApi",
        endpoint: awsConfig.apiGateway.URL,
        region: awsConfig.apiGateway.REGION,
      },
    ],
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authView, setAuthView] = useState("login"); // 'login' or 'signup'
  const [bookToEdit, setBookToEdit] = useState(null);
  const [refreshData, setRefreshData] = useState(false);

  // Check authentication status
  useEffect(() => {
    checkAuthStatus();

    // Set up listener for authentication events
    Hub.listen("auth", ({ payload: { event, data } }) => {
      switch (event) {
        case "signIn":
          setIsAuthenticated(true);
          setUser(data);
          break;
        case "signOut":
          setIsAuthenticated(false);
          setUser(null);
          break;
        default:
          break;
      }
    });
  }, []);

  const checkAuthStatus = async () => {
    try {
      const userData = await Auth.currentAuthenticatedUser();
      setIsAuthenticated(true);
      setUser(userData);
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await Auth.signOut();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleBookAdded = () => {
    setRefreshData((prev) => !prev);
  };

  const handleBookUpdated = () => {
    setBookToEdit(null);
    setRefreshData((prev) => !prev);
  };

  const handleEditBook = (book) => {
    setBookToEdit(book);
  };

  const handleCancelEdit = () => {
    setBookToEdit(null);
  };

  if (loading) {
    return <div className="loading">Loading application...</div>;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Books Collection</h1>
        {isAuthenticated && (
          <div className="user-info">
            <span>Welcome, {user.username}</span>
            <button onClick={handleSignOut} className="sign-out-btn">
              Sign Out
            </button>
          </div>
        )}
      </header>

      <main>
        {isAuthenticated ? (
          <div className="app-content">
            {bookToEdit ? (
              <EditBookForm
                book={bookToEdit}
                onCancel={handleCancelEdit}
                onBookUpdated={handleBookUpdated}
              />
            ) : (
              <AddBookForm onBookAdded={handleBookAdded} />
            )}

            <BookList
              onEdit={handleEditBook}
              key={refreshData ? "refreshed" : "initial"}
            />
          </div>
        ) : (
          <div className="auth-container">
            {authView === "login" ? (
              <Login
                onSignUp={() => setAuthView("signup")}
                onSuccess={() => setIsAuthenticated(true)}
              />
            ) : (
              <SignUp
                onLogin={() => setAuthView("login")}
                onSuccess={() => setAuthView("login")}
              />
            )}
          </div>
        )}
      </main>

      <footer>
        <p>&copy; {new Date().getFullYear()} Books Collection App</p>
      </footer>
    </div>
  );
}

export default App;
