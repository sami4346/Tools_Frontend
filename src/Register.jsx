// src/Register.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase-config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import ThemeContext from "./ThemeContext";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const theme = useContext(ThemeContext);
  const navigate = useNavigate(); // ✅ Hook for navigation

  const register = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Registered successfully");
      navigate("/"); // ✅ Redirect to homepage
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div
      className={`p-4 max-w-md mx-auto mt-8 shadow rounded ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
      }`}
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
      <form onSubmit={register}>
        <div className="mb-3">
          <input
            id="email"
            type="email"
            placeholder="Email"
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-3">
          <input
            id="password"
            type="password"
            placeholder="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button type="submit" className="btn btn-success w-full">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
