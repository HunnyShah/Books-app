import React, { useState } from "react";
import { Auth } from "aws-amplify";

const SignUp = ({ onLogin, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    confirmPassword: "",
  });
  const [confirmCode, setConfirmCode] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      await Auth.signUp({
        username: formData.username,
        password: formData.password,
        attributes: {
          email: formData.email,
        },
      });
      setShowConfirmation(true);
      setError(null);
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message || "Failed to sign up");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmCode = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await Auth.confirmSignUp(formData.username, confirmCode);
      onSuccess();
    } catch (err) {
      console.error("Confirmation error:", err);
      setError(err.message || "Failed to confirm registration");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmCodeChange = (e) => {
    setConfirmCode(e.target.value);
  };

  return (
    <div className="auth-form">
      {!showConfirmation ? (
        <>
          <h2>Sign Up</h2>
          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="8"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength="8"
              />
            </div>

            <button type="submit" disabled={isLoading}>
              {isLoading ? "Signing up..." : "Sign Up"}
            </button>
          </form>
        </>
      ) : (
        <>
          <h2>Confirm Registration</h2>
          {error && <div className="error">{error}</div>}
          <p>
            We've sent a confirmation code to your email. Please enter it below
            to complete your registration.
          </p>

          <form onSubmit={handleConfirmCode}>
            <div className="form-group">
              <label htmlFor="confirmCode">Confirmation Code</label>
              <input
                type="text"
                id="confirmCode"
                value={confirmCode}
                onChange={handleConfirmCodeChange}
                required
              />
            </div>

            <button type="submit" disabled={isLoading}>
              {isLoading ? "Confirming..." : "Confirm"}
            </button>
          </form>
        </>
      )}

      <p className="auth-switch">
        Already have an account?{" "}
        <button type="button" onClick={onLogin} className="link-button">
          Log In
        </button>
      </p>
    </div>
  );
};

export default SignUp;
