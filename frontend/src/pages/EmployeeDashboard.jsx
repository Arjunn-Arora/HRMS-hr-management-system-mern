import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance.js';
import { toast } from 'react-toastify';
import {
  FaUserCircle, FaSignOutAlt, FaEdit, FaFileAlt,
  FaBell, FaCalendarCheck, FaChartBar, FaMoneyCheckAlt,
  FaUsers, FaClipboardList, FaTasks
} from 'react-icons/fa';

const EmployeeDashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const res = await axios.get("/auth/me", {
          withCredentials: true
        });
        setUser(res.data.user);
      } catch (err) {
        toast.error("Failed to fetch user info");
        console.log(err);
      }
    };

    fetchLoggedInUser();
  }, []);

  const handleLogout = async () => {
  try {
    await axios.post("/auth/logout", {}, { withCredentials: true });
    toast.success("Logged out successfully");

    // Force reload to clear browser cache
    window.location.href = "/";
  } catch (err) {
    toast.error(err.message);
  }
};


  if (!user) return <div className="text-center mt-10">Loading...</div>;

  const isTeamLead = user.role === "team_lead";

  const handleRedirect = (path) => {
    window.location.href = path;
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <FaUserCircle className="text-4xl text-gray-600" />
          <div>
            <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
            <p className="text-sm text-gray-500">{user.email} | {user.department || "No Department"}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Standard Employee Features */}
        <DashboardCard icon={<FaEdit />} title="Edit Profile" desc="Update your personal information" color="blue" onClick={() => handleRedirect('/edit-profile')} />
        <DashboardCard icon={<FaFileAlt />} title="Resume & Documents" desc="Upload or download your files" color="green" onClick={() => handleRedirect('/documents')} />
        <DashboardCard icon={<FaBell />} title="Announcements" desc="Stay up to date with HR updates" color="yellow" onClick={() => handleRedirect('/announcements')} />
        <DashboardCard icon={<FaCalendarCheck />} title="View Attendance" desc="Track your daily presence" color="purple" onClick={() => handleRedirect('/attendance')} />
        <DashboardCard icon={<FaChartBar />} title="Apply For Leave" desc="View your leave stats" color="indigo" onClick={() => handleRedirect('/apply-leave')} />
        <DashboardCard icon={<FaMoneyCheckAlt />} title="Payslip History" desc="Check your previous salary records" color="pink" onClick={() => handleRedirect('/payslips')} />

        {/* Additional Team Lead Features */}
        {isTeamLead && (
          <>
            <DashboardCard icon={<FaClipboardList />} title="Mark Attendance" desc="Mark presence for your team" color="purple" onClick={() => handleRedirect('/teamlead/attendance')} />
            <DashboardCard icon={<FaUsers />} title="Team Members" desc="See your assigned team members" color="orange" onClick={() => handleRedirect('/teamlead/team-members')} />
            <DashboardCard icon={<FaTasks />} title="Allocated Projects" desc="View your project assignments" color="teal" onClick={() => handleRedirect('/teamlead/projects')} />
          </>
        )}
      </div>
    </div>
  );
};

// Reusable Dashboard Card Component
const DashboardCard = ({ icon, title, desc, color, onClick }) => (
  <div
    className="bg-white p-4 shadow rounded-lg flex items-center justify-between hover:bg-gray-50 transition cursor-pointer"
    onClick={onClick}
  >
    <div className="flex items-center gap-4">
      <div className={`text-3xl text-${color}-500`}>{icon}</div>
      <div>
        <h2 className="font-semibold text-lg">{title}</h2>
        <p className="text-gray-500 text-sm">{desc}</p>
      </div>
    </div>
    <span className={`text-${color}-600 hover:underline`}>Open</span>
  </div>
);

export default EmployeeDashboard;
