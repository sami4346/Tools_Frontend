import React, { useState, useEffect, useContext } from 'react';
import { loadStripe } from '@stripe/stripe-js';

import ThemeContext from './ThemeContext';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function HireNow() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useContext(ThemeContext);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchContacts() {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/contacts?page=${page}&limit=10`);
        if (!response.ok) throw new Error('Failed to fetch contacts');
        const data = await response.json();

        // Artificial delay of 1 second
        setTimeout(() => {
          setContacts(data.contacts);
          setTotalPages(data.totalPages);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Fetch Contacts Error:', error);
        setLoading(false);
      }
    }

    fetchContacts();
  }, [page]);

  const handleHireNowClick = async (contact) => {
    try {
      const stripe = await stripePromise;

      const response = await fetch(`${import.meta.env.VITE_API_URL}/stripe/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contactId: contact._id,
          contactName: contact.name
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      alert('Payment initiation failed: ' + error.message);
    }
  };

  return (
    <div className={`p-4 max-w-lg mx-auto mt-8 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'} shadow rounded`}>
      <h1 className="text-2xl font-bold mb-4 text-center">Hire Now Page</h1>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Available Contacts to Hire</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr>
                <th className="border px-2 py-1">Name</th>
                <th className="border px-2 py-1">Email</th>
                <th className="border px-2 py-1">Profession</th>
                <th className="border px-2 py-1">Skills</th>
                <th className="border px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-2">Loading Contacts...</td>
                </tr>
              ) : contacts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-2">No contacts found.</td>
                </tr>
              ) : (
                contacts.map((contact, idx) => (
                  <tr key={contact._id || idx}>
                    <td className="border px-2 py-1">{contact.name}</td>
                    <td className="border px-2 py-1">{contact.email}</td>
                    <td className="border px-2 py-1">{contact.message}</td>
                    <td className="border px-2 py-1">{contact.address}</td>
                    <td className="border px-2 py-1">
                      <button
                        className="w-24 bg-green-600 hover:bg-green-700 text-black px-2 py-1 rounded"
                        onClick={() => handleHireNowClick(contact)}
                      >
                        Hire Now
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-4 gap-2 flex-wrap items-center">
          <button
            className={`px-3 py-1 rounded ${page === 1
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-300 hover:bg-gray-400 text-black'
              }`}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            Prev
          </button>

          {[...Array(totalPages).keys()].map((i) => {
            const pageNum = i + 1;
            if (
              pageNum === 1 ||
              pageNum === totalPages ||
              Math.abs(pageNum - page) <= 1
            ) {
              return (
                <button
                  key={pageNum}
                  onClick={() => {
                    if (page !== pageNum) setPage(pageNum);
                  }}
                  disabled={page === pageNum}
                  className={`px-3 py-1 rounded ${page === pageNum
                      ? 'bg-blue-500 text-white cursor-not-allowed'
                      : 'bg-gray-200 hover:bg-gray-300 text-black'
                    }`}
                >
                  {pageNum}
                </button>
              );
            } else if (
              (pageNum === 2 && page > 3) ||
              (pageNum === totalPages - 1 && page < totalPages - 2)
            ) {
              return <span key={`dots-${pageNum}`}>...</span>;
            }
            return null;
          })}

          <button
            className={`px-3 py-1 rounded ${page === totalPages
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-300 hover:bg-gray-400 text-black'
              }`}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default HireNow;
