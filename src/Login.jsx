// src/Login.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";
import ThemeContext from "./ThemeContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const theme = useContext(ThemeContext);
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Logged in successfully");
      navigate("/"); // Redirect to homepage (App.jsx)
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div
      className={`p-4 max-w-md mx-auto mt-8 ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
      } shadow rounded`}
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      <form onSubmit={login}>
        <div className="mb-3">
          <input
            type="email"
            id="email"
            placeholder="Email"
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            id="password"
            placeholder="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button type="submit" className="btn btn-success w-full mt-2">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
