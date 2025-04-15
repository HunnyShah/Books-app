import React, { useState, useEffect } from "react";
import { Amplify } from "aws-amplify";
import { signOut, getCurrentUser, fetchAuthSession } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
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
    REST: {
      books: {
        endpoint: awsConfig.apiGateway.URL,
        region: awsConfig.apiGateway.REGION,
      },
    },
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

  async function checkAuthStatus() {
    try {
      // Get authenticated user
      const currentUser = await getCurrentUser();
      // Get session info
      const session = await fetchAuthSession();
      setIsAuthenticated(true);
      setUser(currentUser);
    } catch (err) {
      setIsAuthenticated(false);
      setUser(null);
    }
    setLoading(false);
  }

  async function handleSignOut() {
    try {
      await signOut();
      setIsAuthenticated(false);
      setUser(null);
    } catch (err) {
      console.error("Error signing out:", err);
    }
  }

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
