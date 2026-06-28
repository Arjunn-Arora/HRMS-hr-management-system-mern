import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import axios from '../utils/axiosInstance';
import { toast } from 'react-toastify';
import { FaSignOutAlt, FaClock, FaCheckCircle, FaHome } from 'react-icons/fa';

const GlobalSidebar = ({ user, navLinks, onLogout }) => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [activeCheckInTime, setActiveCheckInTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState('00:00:00');
  const [todayTotalHours, setTodayTotalHours] = useState(0);

  useEffect(() => {
    fetchAttendanceStatus();
  }, []);

  const fetchAttendanceStatus = async () => {
    try {
      const res = await axios.get('/attendance/status', { withCredentials: true });
      setIsCheckedIn(res.data.isCheckedIn);
      setActiveCheckInTime(res.data.activeCheckInTime ? new Date(res.data.activeCheckInTime) : null);
      setTodayTotalHours(res.data.todayTotalHours || 0);
    } catch (err) {
      console.error("Failed to fetch attendance status", err);
    }
  };

  useEffect(() => {
    let timer;
    
    const formatTime = (ms) => {
      const hours = Math.floor(ms / (1000 * 60 * 60));
      const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((ms % (1000 * 60)) / 1000);
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const previousMs = (todayTotalHours || 0) * 60 * 60 * 1000;

    if (isCheckedIn && activeCheckInTime) {
      timer = setInterval(() => {
        const now = new Date();
        if (now.getDate() !== activeCheckInTime.getDate()) {
           // Day has changed, refetch status from backend to reset
           fetchAttendanceStatus();
        } else {
          const activeDiff = now - activeCheckInTime;
          setElapsedTime(formatTime(previousMs + activeDiff));
        }
      }, 1000);
    } else {
      setElapsedTime(formatTime(previousMs));
    }

    return () => clearInterval(timer);
  }, [isCheckedIn, activeCheckInTime, todayTotalHours]);

  const handleCheckInOut = async () => {
    try {
      if (isCheckedIn) {
        // Check Out
        await axios.post('/attendance/check-out', {}, { withCredentials: true });
        toast.success("Checked out successfully!");
      } else {
        // Check In
        await axios.post('/attendance/check-in', {}, { withCredentials: true });
        toast.success("Checked in successfully!");
      }
      fetchAttendanceStatus();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to process attendance");
    }
  };

  if (!user) return null;

  return (
    <aside className="w-1/4 max-w-[280px] min-h-screen bg-white shadow-xl flex flex-col justify-between overflow-y-auto">
      <div>
        {/* User Profile Section */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-center text-white">
          <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center text-3xl text-indigo-600 font-bold mb-3 shadow-md">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-sm opacity-90">{user.department || user.role}</p>
        </div>

        {/* Attendance Widget */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 font-medium">Timer</span>
            <span className="text-2xl font-mono font-bold text-gray-800 flex items-center gap-2">
              <FaClock className={isCheckedIn ? "text-green-500 animate-pulse" : "text-gray-400"} />
              {elapsedTime}
            </span>
          </div>

          <button
            onClick={handleCheckInOut}
            className={`w-full py-3 rounded-lg font-bold text-white shadow-md transition-all duration-300 flex items-center justify-center gap-2 ${
              isCheckedIn 
                ? "bg-red-500 hover:bg-red-600 hover:shadow-lg" 
                : "bg-green-500 hover:bg-green-600 hover:shadow-lg"
            }`}
          >
            <FaCheckCircle />
            {isCheckedIn ? "Check Out" : "Check In"}
          </button>
          
          {todayTotalHours > 0 && (
            <div className="mt-4 text-center text-sm text-gray-500 font-medium">
              Today's Hours: <span className="text-indigo-600">{todayTotalHours.toFixed(2)}h</span>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-2">
          {navLinks && navLinks.map((link, idx) => (
            <NavLink
              key={idx}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <span className="text-xl">{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout Section */}
      <div className="p-6 mt-auto">
        <button
          onClick={onLogout}
          className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-semibold flex items-center justify-center gap-2 py-3 rounded-xl transition-colors duration-200"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </aside>
  );
};

export default GlobalSidebar;
