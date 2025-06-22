import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddAnnouncement = ({ onNewAnnouncement }) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/api/announcements/create', {
        title,
        message
      }, { withCredentials: true });

      toast.success("Announcement posted!");
      setTitle('');
      setMessage('');
      onNewAnnouncement(res.data.announcement);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded p-4 mb-4">
      <h2 className="text-lg font-bold mb-2">Post New Announcement</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full border px-3 py-2 mb-2 rounded"
        required
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Message"
        className="w-full border px-3 py-2 mb-2 rounded"
        rows={3}
        required
      ></textarea>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Post Announcement
      </button>
    </form>
  );
};

export default AddAnnouncement;
