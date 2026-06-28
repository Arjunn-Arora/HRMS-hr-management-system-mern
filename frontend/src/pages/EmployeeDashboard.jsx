import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance.js';
import { toast } from 'react-toastify';
import {
  FaUserCircle, FaSignOutAlt, FaEdit, FaFileAlt,
  FaBell, FaCalendarCheck, FaChartBar, FaMoneyCheckAlt,
  FaUsers, FaClipboardList, FaTasks, FaHome
} from 'react-icons/fa';
import GlobalSidebar from '../components/GlobalSidebar';

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
    localStorage.removeItem("token");
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

  const navLinks = [
    { to: "/employee", icon: <FaHome />, label: "Dashboard" },
    { to: "/edit-profile", icon: <FaEdit />, label: "Edit Profile" },
    { to: "/documents", icon: <FaFileAlt />, label: "Documents" },
    { to: "/announcements", icon: <FaBell />, label: "Announcements" },
    { to: "/attendance", icon: <FaCalendarCheck />, label: "View Attendance" },
    { to: "/employee/leaves", icon: <FaChartBar />, label: "View Leaves" },
    { to: "/employee/payslips", icon: <FaMoneyCheckAlt />, label: "Payslips" },
  ];

  if (isTeamLead) {
    // Add Team Lead links
    navLinks.push(
      { to: "/teamlead/team-members", icon: <FaUsers />, label: "Team Members" },
      { to: "/teamlead/projects", icon: <FaTasks />, label: "Allocated Projects" }
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <GlobalSidebar user={user} navLinks={navLinks} onLogout={handleLogout} />
      
      <main className="flex-1 p-8 overflow-auto">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800">Employee Dashboard</h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Standard Employee Features */}
        <DashboardCard icon={<FaEdit />} title="Edit Profile" desc="Update your personal information" color="blue" onClick={() => handleRedirect('/edit-profile')} />
        <DashboardCard icon={<FaFileAlt />} title="Resume & Documents" desc="Upload or download your files" color="green" onClick={() => handleRedirect('/documents')} />
        <DashboardCard icon={<FaBell />} title="Announcements" desc="Stay up to date with HR updates" color="yellow" onClick={() => handleRedirect('/announcements')} />
        <DashboardCard icon={<FaCalendarCheck />} title="View Attendance" desc="Track your daily presence" color="purple" onClick={() => handleRedirect('/attendance')} />
        <DashboardCard icon={<FaChartBar />} title="View Leaves" desc="View your leave stats" color="indigo" onClick={() => handleRedirect('/employee/leaves')} />
        <DashboardCard icon={<FaMoneyCheckAlt />} title="Payslip History" desc="Check your previous salary records" color="pink" onClick={() => handleRedirect('/employee/payslips')} />

        {/* Additional Team Lead Features */}
        {isTeamLead && (
          <>
            <DashboardCard icon={<FaUsers />} title="Team Members" desc="See your assigned team members" color="orange" onClick={() => handleRedirect('/teamlead/team-members')} />
            <DashboardCard icon={<FaTasks />} title="Allocated Projects" desc="View your project assignments" color="teal" onClick={() => handleRedirect('/teamlead/projects')} />
          </>
        )}
      </div>
      </main>
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
