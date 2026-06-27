import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { FaCalendarAlt, FaListUl, FaClock } from "react-icons/fa";

const ViewAttendance = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("week"); // 'week' or 'calendar'
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await axios.get("/attendance/my", { withCredentials: true });
        setRecords(res.data);
      } catch (err) {
        toast.error("Failed to fetch attendance");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <ClipLoader size={40} color="#4f46e5" />
      </div>
    );
  }

  // Helpers for date processing
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  // Find record for a specific date string (YYYY-MM-DD)
  const getRecordForDate = (dateStr) => records.find(r => r.date === dateStr);

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Empty slots before 1st of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2 border border-gray-100 bg-gray-50/50"></div>);
    }

    // Days of month
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const record = getRecordForDate(dateStr);
      const isToday = new Date().toDateString() === new Date(year, month, d).toDateString();

      days.push(
        <div key={d} className={`p-3 border border-gray-100 h-28 flex flex-col ${isToday ? 'bg-indigo-50 border-indigo-200' : 'bg-white hover:bg-gray-50'}`}>
          <div className="flex justify-between items-start mb-2">
            <span className={`font-medium ${isToday ? 'text-indigo-600 font-bold' : 'text-gray-600'}`}>{d}</span>
            {record && record.totalHours > 0 && (
              <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-full">
                {record.totalHours.toFixed(1)}h
              </span>
            )}
          </div>
          <div className="flex-1 overflow-y-auto space-y-1">
            {record?.sessions?.map((s, i) => (
              <div key={i} className="text-[10px] text-gray-500 bg-gray-100 rounded px-1 py-0.5 truncate">
                {new Date(s.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                {s.checkOut ? new Date(s.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Active'}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
          <button 
            onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition"
          >
            &larr; Prev
          </button>
          <h3 className="text-lg font-bold text-gray-800">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h3>
          <button 
            onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition"
          >
            Next &rarr;
          </button>
        </div>
        <div className="grid grid-cols-7 border-b border-gray-100">
          {weekdays.map(day => (
            <div key={day} className="py-2 text-center text-sm font-bold text-gray-500 bg-gray-50">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 bg-gray-200 gap-px">
          {days}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    // Get current week (Monday to Sunday)
    const curr = new Date();
    const day = curr.getDay();
    const diff = curr.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(curr.getFullYear(), curr.getMonth(), diff + i);
      weekDays.push(d);
    }

    return (
      <div className="space-y-4">
        {weekDays.map((date, idx) => {
          const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
          const record = getRecordForDate(dateStr);
          const isToday = date.toDateString() === new Date().toDateString();

          return (
            <div key={idx} className={`bg-white rounded-xl shadow-sm border p-5 flex flex-col md:flex-row gap-6 items-start md:items-center transition-all ${isToday ? 'border-indigo-300 ring-1 ring-indigo-100' : 'border-gray-100 hover:border-gray-300'}`}>
              
              <div className="w-40 flex-shrink-0">
                <div className={`text-xl font-bold ${isToday ? 'text-indigo-600' : 'text-gray-800'}`}>
                  {date.toLocaleDateString('default', { weekday: 'long' })}
                </div>
                <div className="text-sm text-gray-500">{date.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
              </div>

              <div className="flex-1 w-full border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                {!record || !record.sessions || record.sessions.length === 0 ? (
                  <div className="text-gray-400 italic py-2 flex items-center gap-2">
                    <FaClock /> No check-ins for this day
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      Total Hours: <span className="text-indigo-600 text-base">{record.totalHours.toFixed(2)}h</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      {record.sessions.map((s, i) => (
                        <div key={i} className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm flex items-center gap-3">
                          <div>
                            <span className="block text-xs text-gray-400 uppercase tracking-wide">In</span>
                            <span className="font-medium">{new Date(s.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <div className="w-8 h-px bg-gray-300"></div>
                          <div>
                            <span className="block text-xs text-gray-400 uppercase tracking-wide">Out</span>
                            <span className="font-medium text-gray-700">
                              {s.checkOut ? new Date(s.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : <span className="text-green-500 animate-pulse">Active</span>}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Attendance Dashboard</h1>
          <p className="text-gray-500 mt-1">Track your daily check-ins and working hours.</p>
        </div>
        
        <div className="bg-white p-1 rounded-lg border border-gray-200 shadow-sm inline-flex">
          <button
            onClick={() => setViewMode("week")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-md font-medium transition-all ${
              viewMode === "week" ? "bg-indigo-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <FaListUl /> Week
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-md font-medium transition-all ${
              viewMode === "calendar" ? "bg-indigo-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <FaCalendarAlt /> Calendar
          </button>
        </div>
      </div>

      <div className="mt-6">
        {viewMode === "week" ? renderWeekView() : renderCalendar()}
      </div>
    </div>
  );
};

export default ViewAttendance;
