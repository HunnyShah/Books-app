// src/SignUp.js
import React, { useState } from "react";
import { signUp } from "@aws-amplify/auth";

const SignUp = () => {
  const [form, setForm] = useState({ username: "", password: "", email: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await signUp({
        username: form.username,
        password: form.password,
        options: {
          userAttributes: { email: form.email },
        },
      });
      console.log("Sign up success!");
    } catch (err) {
      console.error("Sign up error:", err);
    }
  };

  return (
    <form onSubmit={handleSignUp}>
      <h2>Sign Up</h2>
      <input name="username" placeholder="Username" onChange={handleChange} />
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
      />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignUp;
