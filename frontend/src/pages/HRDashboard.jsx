import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance.js';
import { toast } from 'react-toastify';
import {
  FaUsers,
  FaCalendarAlt,
  FaBell,
  FaFileUpload,
  FaUserPlus,
  FaChartBar,
  FaMoneyBillWave,
  FaDownload,
  FaCogs,
  FaPlus,
  FaSignOutAlt,
  FaClipboardList
} from 'react-icons/fa';

const HRDashboard = () => {
  const [user, setUser] = useState(null);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const userRes = await axios.get("/auth/me", { withCredentials: true });
        setUser(userRes.data.user);

        const countRes = await axios.get("/hr/employees", { withCredentials: true });
        setEmployeeCount(countRes.data.length);

        const announceRes = await axios.get("/announcement/all", { withCredentials: true });
        setAnnouncements(announceRes.data);
      } catch (err) {
        toast.error("Failed to load HR dashboard data");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleAddAnnouncement = async () => {
    if (!newAnnouncement.trim()) return toast.error("Please enter a message");
    try {
      const res = await axios.post(
        "/announcement/create",
        { title: "New Announcement", message: newAnnouncement },
        { withCredentials: true }
      );
      toast.success("Announcement added!");
      setAnnouncements([res.data, ...announcements]);
      setNewAnnouncement("");
      setShowModal(false);
    } catch (err) {
      toast.error("Failed to post announcement");
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout", {}, { withCredentials: true });
      toast.success("Logged out successfully");
      window.location.href = "/"; // Redirect to login
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading || !user) return <div className="text-center mt-10">Loading Dashboard...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Top Bar with Logout */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">HR Dashboard</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card icon={<FaUsers />} label="Total Employees" value={employeeCount} />
        <Card icon={<FaCalendarAlt />} label="Attendance Reports" value={<button className="text-sm text-blue-600 hover:underline">View</button>} />
        <Card icon={<FaBell />} label="New Announcements" value={announcements.length} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card icon={<FaUserPlus />} label="Add Employee" link="/hr/add-employee" />
        <Card icon={<FaCogs />} label="Manage Roles & Dept." link="/hr/manage-roles" />
        <Card icon={<FaFileUpload />} label="Upload Docs" link="/hr/uploads" />
        <Card icon={<FaChartBar />} label="Leave Dashboard" link="/hr/leaves" />
        <Card icon={<FaChartBar />} label="Create/Edit Leave Policies" link="/hr/leave-policies" />
        <Card icon={<FaMoneyBillWave />} label="Payroll" link="/hr/payroll" />
        <Card icon={<FaDownload />} label="Export Reports" link="/hr/reports" />
        <Card icon={<FaClipboardList />} label="Assign Projects" link="/hr/assign-projects" />
      </div>

      {/* Add Announcement Button */}
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-700">Latest Announcements</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          <FaPlus className="mr-2" /> Add Announcement
        </button>
      </div>

      {/* Announcement List */}
      <ul className="bg-white rounded-xl shadow p-4 divide-y divide-gray-200">
        {announcements.map((ann, i) => (
          <li key={i} className="py-3">
            <p className="text-gray-800">{ann.message}</p>
            <p className="text-sm text-gray-500">— {ann.createdBy?.name || "Unknown"} | {ann.createdBy?.role || "N/A"}</p>
          </li>
        ))}
      </ul>

      {/* Modal for Adding Announcement */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Announcement</h2>
            <textarea
              rows="4"
              className="w-full border rounded-md p-2 mb-4"
              placeholder="Write announcement..."
              value={newAnnouncement}
              onChange={(e) => setNewAnnouncement(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-md">Cancel</button>
              <button onClick={handleAddAnnouncement} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Post</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Reusable Card Component
const Card = ({ icon, label, value, link }) => {
  const content = (
    <div className="bg-white shadow-md rounded-2xl p-5 flex items-center space-x-4 hover:shadow-lg transition cursor-pointer">
      <div className="text-3xl text-indigo-600">{icon}</div>
      <div>
        <p className="text-gray-600">{label}</p>
        <h2 className="text-xl font-semibold">{value}</h2>
      </div>
    </div>
  );

  return link ? <a href={link}>{content}</a> : content;
};

export default HRDashboard;
