// src/Logout.js
import React, { useContext } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase-config";
import ThemeContext from "./ThemeContext";

function Logout() {
  const theme = useContext(ThemeContext);

  const logout = () => {
    signOut(auth)
      .then(() => alert("Logged out"))
      .catch((error) => alert(error.message));
  };

  return (
    <div
      className={`p-4 max-w-md mx-auto mt-8 ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
      } shadow rounded text-center`}
    >
      <h2 className="text-2xl font-bold mb-4">Logout</h2>
      <button
        onClick={logout}
        className="w-full mt-2 bg-red-600 text-white rounded py-2 hover:bg-red-700 transition-colors"
      >
        Logout
      </button>
    </div>
  );
}

export default Logout;
