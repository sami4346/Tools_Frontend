import { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase-config';
import ThemeContext from './ThemeContext';
import Register from './Register';
import Login from './Login';
import Contact from './Contact';
import ViewContact from './ViewContact';
import HireNow from './HireNow';

function App() {
  const [user, setUser] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useContext(ThemeContext);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoggingOut(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    setIsLoggingOut(true);
    signOut(auth)
      .then(() => {
        alert("Logged out successfully");
        navigate('/login');
      })
      .catch((err) => {
        alert(err.message);
        setIsLoggingOut(false);
      });
  };

  const showLogout = user && location.pathname === "/";

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      <nav className="flex flex-wrap justify-center gap-4 p-4 shadow bg-white dark:bg-gray-800">
        <Link className="inline-block px-3 py-1 hover:underline" to="/">Home</Link>
        {!user && (
          <>
            <Link className="inline-block px-3 py-1 hover:underline" to="/register">Register</Link>
            <Link className="inline-block px-3 py-1 hover:underline" to="/login">Login</Link>
          </>
        )}
        <Link className="inline-block px-3 py-1 hover:underline" to="/contact">Contact</Link>
        <Link className="inline-block px-3 py-1 hover:underline" to="/viewContact">View Contact</Link>
        <Link className="inline-block px-3 py-1 hover:underline" to="/hireNow">Hire Now</Link>
      </nav>

      <main className="p-6 flex-grow max-w-xl mx-auto w-full">
        <Routes>
          <Route
            path="/"
            element={
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Firebase Authentication And MonogoDB Connection</h1>
                {user ? (
                  <>
                    <p className="mb-4">Welcome, <span className="font-semibold">{user.email}</span></p>
                  </>
                ) : (
                  <p>Please register or login.</p>
                )}
              </div>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/viewContact" element={<ViewContact />} />
          <Route path="/hireNow" element={<HireNow />} />
        </Routes>
      </main>

      {/* Logout button shown only on Home Page */}
      {showLogout && (
        <div className="p-6 max-w-xl mx-16 w-full mb-16">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            style={{
              backgroundColor: '#dc2626', // Tailwind red-600
              color: '#ffffff',           // White text
              cursor: isLoggingOut ? 'not-allowed' : 'pointer',
            }}
            className="w-full px-4 py-2 rounded-lg shadow-lg font-semibold transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 hover:bg-red-700 flex items-center justify-center gap-2"
          >
            {isLoggingOut ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Logging out...
              </>
            ) : (
              'Logout'
            )}
          </button>

        </div>
      )}
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
