import React, { useState, useEffect, useContext } from 'react';
import ThemeContext from './ThemeContext';

function ViewContact() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingContactId, setEditingContactId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    message: '',
    address: '',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const theme = useContext(ThemeContext);

  // ✅ useEffect was broken — now fixed
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
  }, [page]); // ✅ trigger re-fetch on page change

  const handleEditClick = (contact) => {
    setEditingContactId(contact._id);
    setEditFormData({
      name: contact.name,
      email: contact.email,
      message: contact.message,
      address: contact.address,
    });
  };

  const handleCancelClick = () => {
    setEditingContactId(null);
    setEditFormData({
      name: '',
      email: '',
      message: '',
      address: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveClick = async (contactId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/contacts/${contactId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      });
      if (!response.ok) throw new Error('Failed to update contact');
      const updatedContact = await response.json();

      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact._id === contactId ? updatedContact : contact
        )
      );
      setEditingContactId(null);
      setEditFormData({
        name: '',
        email: '',
        message: '',
        address: '',
      });
    } catch (error) {
      alert('Update failed!');
    }
  };

  return (
    <div className={`p-4 max-w-lg mx-auto mt-8 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'} shadow rounded`}>
      <h1 className="text-2xl font-bold mb-4 text-center">Contact Page</h1>

      {/* Data Table */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Contact List</h2>
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
                  <td colSpan="5" className="text-center py-2">Loading Contact...</td>
                </tr>
              ) : contacts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-2">No contacts found.</td>
                </tr>
              ) : (
                contacts.map((contact, idx) => (
                  <tr key={contact._id || idx}>
                    {editingContactId === contact._id ? (
                      <>
                        <td className="border px-2 py-1">
                          <input
                            type="text"
                            name="name"
                            value={editFormData.name}
                            onChange={handleInputChange}
                            className="w-full border rounded px-1 py-0.5"
                          />
                        </td>
                        <td className="border px-2 py-1">
                          <input
                            type="email"
                            name="email"
                            value={editFormData.email}
                            onChange={handleInputChange}
                            className="w-full border rounded px-1 py-0.5"
                          />
                        </td>
                        <td className="border px-2 py-1">
                          <input
                            type="text"
                            name="message"
                            value={editFormData.message}
                            onChange={handleInputChange}
                            className="w-full border rounded px-1 py-0.5"
                          />
                        </td>
                        <td className="border px-2 py-1">
                          <input
                            type="text"
                            name="address"
                            value={editFormData.address}
                            onChange={handleInputChange}
                            className="w-full border rounded px-1 py-0.5"
                          />
                        </td>
                        <td className="border px-2 py-1">
                          <button
                            className="bg-green-500 hover:bg-green-600 text-black px-2 py-1 rounded mr-2"
                            onClick={() => handleSaveClick(contact._id)}
                          >
                            Save
                          </button>
                          <button
                            className="bg-gray-400 hover:bg-gray-500 text-black px-2 py-1 rounded"
                            onClick={handleCancelClick}
                          >
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="border px-2 py-1">{contact.name}</td>
                        <td className="border px-2 py-1">{contact.email}</td>
                        <td className="border px-2 py-1">{contact.message}</td>
                        <td className="border px-2 py-1">{contact.address}</td>
                        <td className="border px-2 py-1">
                          <div className="flex gap-2">
                            <button
                              className="w-20 bg-blue-500 hover:bg-blue-600 text-black px-2 py-1 rounded"
                              onClick={() => handleEditClick(contact)}
                            >
                              Edit
                            </button>
                            <button
                              className="w-20 bg-red-500 hover:bg-red-600 text-black px-2 py-1 rounded"
                              onClick={async () => {
                                if (window.confirm('Are you sure you want to delete this contact?')) {
                                  try {
                                    const response = await fetch(
                                      `${import.meta.env.VITE_API_URL}/contacts/${contact._id}`,
                                      { method: 'DELETE' }
                                    );
                                    if (!response.ok) throw new Error('Failed to delete contact');
                                    setContacts(contacts.filter(c => c._id !== contact._id));
                                  } catch (err) {
                                    alert('Delete failed!');
                                  }
                                }
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-4 gap-2 flex-wrap items-center">
          {/* Prev Button */}
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

          {/* Page Numbers */}
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

          {/* Next Button */}
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
export default ViewContact;