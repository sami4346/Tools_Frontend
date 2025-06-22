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
  const theme = useContext(ThemeContext);

  // Fetch contacts from API
  useEffect(() => {
    async function fetchContacts() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/contacts`);
        if (!response.ok) throw new Error('Failed to fetch contacts');
        const data = await response.json();

        // Artificial delay of 1 seconds before setting the data
        setTimeout(() => {
          setContacts(data);
          setLoading(false);
        }, 1000); // 1000ms = 1 seconds
      } catch (error) {
        console.error('Fetch Contacts Error:', error);
        setLoading(false); // Ensure loading is cleared on error
      }
    }

    fetchContacts();
  }, []);

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
                <th className="border px-2 py-1">Message</th>
                <th className="border px-2 py-1">Address</th>
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
      </div>
    </div>
  );
}

export default ViewContact;

