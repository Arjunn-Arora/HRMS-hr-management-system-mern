import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance.js';
import { toast } from 'react-toastify';
import { FaBullhorn } from 'react-icons/fa';

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get("/announcement/all", {
          withCredentials: true
        });
        setAnnouncements(res.data);
      } catch (err) {
        toast.error("Failed to load announcements");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen">
      <h1 className="text-3xl font-bold flex items-center gap-2 mb-6 text-indigo-700">
        <FaBullhorn /> Company Announcements
      </h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : announcements.length === 0 ? (
        <p className="text-gray-500">No announcements to show.</p>
      ) : (
        <ul className="space-y-4">
          {announcements.map((ann, i) => (
            <li key={i} className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
              <p className="text-gray-800">{ann.message}</p>
              <div className="text-sm text-gray-500 mt-2">
                — {ann.createdBy?.name || "Unknown"} | {ann.createdBy?.role || "N/A"} <br />
                <span className="text-xs">{new Date(ann.createdAt).toLocaleString()}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AnnouncementsPage;
