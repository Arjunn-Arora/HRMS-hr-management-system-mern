// src/pages/HRDashboard.jsx
import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from '../utils/axiosInstance';
import { toast } from 'react-toastify';
import {
  FaUsers, FaCalendarAlt, FaBell, FaUserPlus, FaCogs,
  FaFileUpload, FaChartBar, FaMoneyBillWave, FaDownload,
  FaClipboardList, FaSignOutAlt, FaHome,
} from 'react-icons/fa';

const HRDashboard = () => {
  const [user, setUser] = useState(null);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const me = await axios.get('/auth/me', { withCredentials: true });
        const emps = await axios.get('/hr/employees', { withCredentials: true });
        const anns = await axios.get('/announcement/all', { withCredentials: true });
        setUser(me.data.user);
        setEmployeeCount(emps.data.length);
        setAnnouncements(anns.data);
      } catch {
        toast.error("Error loading dashboard");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const postAnnouncement = async () => {
    if (!newAnnouncement.trim()) return toast.error("Enter a message");
    try {
      const res = await axios.post(
        '/announcement/create',
        { title: 'HR Update', message: newAnnouncement },
        { withCredentials: true }
      );
      setAnnouncements(prev => [res.data, ...prev]);
      setNewAnnouncement('');
      toast.success("Posted!");
    } catch {
      toast.error("Failed to post");
    }
  };

  const logout = async () => {
    await axios.post('/auth/logout', {}, { withCredentials: true });
    navigate('/');
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center text-xl">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-1/5 bg-white shadow-lg px-6 pt-8 flex flex-col">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold">{user.name}</h2>
          <p className="mt-1 text-gray-500">HR Manager</p>
        </div>
        <nav className="flex-1 space-y-1">
          <SidebarLink to="/hr" icon={<FaHome />} label="Dashboard" />
          <SidebarLink to="/hr/add-employee" icon={<FaUserPlus />} label="Add Employee" />
          <SidebarLink to="/hr/manage-roles" icon={<FaCogs />} label="Roles & Dept." />
          <SidebarLink to="/hr/assign-projects" icon={<FaClipboardList />} label="Projects" />
          <SidebarLink to="/hr/leaves" icon={<FaChartBar />} label="Leave Dashboard" />
          <SidebarLink to="/hr/leave-policies" icon={<FaChartBar />} label="Leave Policies" />
          <SidebarLink to="/hr/payroll" icon={<FaMoneyBillWave />} label="Payroll" />
          <SidebarLink to="/hr/reports" icon={<FaDownload />} label="Reports & Logs" />
          <SidebarLink to="/hr/uploads" icon={<FaFileUpload />} label="Docs Upload" />
        </nav>
        <button
          onClick={logout}
          className="flex items-center justify-center gap-2 mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800">Welcome, {user.name}</h1>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <MetricCard icon={<FaUsers />} label="Employees" value={employeeCount} />
          <MetricCard
            icon={<FaCalendarAlt />}
            label="Attendance"
            value={<button onClick={() => navigate('/attendance')} className="text-indigo-600 underline">View</button>}
          />
          <MetricCard icon={<FaBell />} label="Announcements" value={announcements.length} />
        </div>

        <section className="mb-10">
          <div className="flex justify-between mb-4">
            <h2 className="text-2xl font-semibold">Latest Announcements</h2>
            <div className="flex gap-2">
              <textarea
                rows={2}
                className="flex-grow p-3 border rounded-lg"
                placeholder="Add announcement..."
                value={newAnnouncement}
                onChange={e => setNewAnnouncement(e.target.value)}
              />
              <button
                onClick={postAnnouncement}
                className="px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Post
              </button>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow divide-y">
            {announcements.map((a, idx) => (
              <div key={idx} className="p-4 flex justify-between items-center hover:bg-gray-50 transition">
                <span className="text-gray-800">{a.message}</span>
                <small className="text-gray-500">{new Date(a.createdAt).toLocaleDateString()}</small>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <ActionCard icon={<FaUserPlus />} label="Add Employee" to="/hr/add-employee" />
            <ActionCard icon={<FaCogs />} label="Manage Roles" to="/hr/manage-roles" />
            <ActionCard icon={<FaClipboardList />} label="Projects" to="/hr/assign-projects" />
            <ActionCard icon={<FaChartBar />} label="Leave Dashboard" to="/hr/leaves" />
            <ActionCard icon={<FaChartBar />} label="Policies" to="/hr/leave-policies" />
            <ActionCard icon={<FaMoneyBillWave />} label="Payroll" to="/hr/payroll" />
            <ActionCard icon={<FaDownload />} label="Reports" to="/hr/reports" />
            <ActionCard icon={<FaFileUpload />} label="Uploads" to="/hr/uploads" />
          </div>
        </section>
      </main>
    </div>
  );
};

// Reusable Components
const SidebarLink = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2 rounded-lg ${
        isActive ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'
      } transition`
    }
  >
    <span className="text-xl">{icon}</span>
    {label}
  </NavLink>
);

const MetricCard = ({ icon, label, value }) => (
  <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
    <div className="text-indigo-600 text-3xl">{icon}</div>
    <div>
      <div className="text-gray-500">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  </div>
);

const ActionCard = ({ icon, label, to }) => (
  <div
    onClick={() => window.location.href = to}
    className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center text-center hover:shadow-lg transition cursor-pointer"
  >
    <div className="text-indigo-600 text-4xl">{icon}</div>
    <div className="mt-3 font-medium text-gray-800">{label}</div>
  </div>
);

export default HRDashboard;
