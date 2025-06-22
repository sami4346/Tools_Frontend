import React, { useState, useEffect, useRef, useContext } from 'react';
import ThemeContext from './ThemeContext';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    address: ''
  });

  const inputRef = useRef(null);
  const theme = useContext(ThemeContext);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    console.log('Form Data Updated:', formData);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Server Response:', result);
      alert('Form submitted successfully!');

      setFormData({
        name: '',
        email: '',
        message: '',
        address: ''
      });
    } catch (error) {
      console.error('Submission Error:', error);
      alert('Failed to submit form. Please try again.');
    }
  };

  return (
    <div className={`p-4 max-w-lg mx-auto mt-8 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'} shadow rounded`}>
      <h1 className="text-2xl font-bold mb-4 text-center">Contact Page</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="block mb-1">Name:</label>
          <input
            type="text"
            name="name"
            ref={inputRef}
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="block mb-1">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="message" className="block mb-1">Message:</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="address" className="block mb-1">Address:</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-success">Submit</button>
      </form>
    </div>
  );
}

export default Contact;
