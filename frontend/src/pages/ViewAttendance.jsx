import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { FaCalendarAlt, FaListUl, FaClock } from "react-icons/fa";

const ViewAttendance = () => {
  const [records, setRecords] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [shift, setShift] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("week"); // 'week' or 'calendar'
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [meRes, attRes, holRes, shiftRes] = await Promise.all([
          axios.get('/auth/me', { withCredentials: true }),
          axios.get("/attendance/my", { withCredentials: true }),
          axios.get("/hr/holidays", { withCredentials: true }),
          axios.get("/hr/shifts", { withCredentials: true })
        ]);

        const currentUser = meRes.data.user;
        setUser(currentUser);
        setRecords(attRes.data);
        setHolidays(holRes.data);

        if (currentUser.shiftId && currentUser.shiftId._id) {
          setShift(currentUser.shiftId);
        } else if (currentUser.shiftId) {
          // If shiftId is just a string, find it in shifts
          const userShift = shiftRes.data.find(s => s._id === currentUser.shiftId);
          setShift(userShift || null);
        }

      } catch (err) {
        toast.error("Failed to load attendance data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <ClipLoader size={40} color="#4f46e5" />
      </div>
    );
  }

  // Helpers
  const getRecordForDate = (dateStr) => records.find(r => r.date === dateStr);
  const isHoliday = (dateStr) => holidays.find(h => h.date === dateStr);
  const isWeekend = (date) => date.getDay() === 0 || date.getDay() === 6;

  const renderWeekView = () => {
    // Get current week (Monday to Sunday)
    const curr = new Date();
    const day = curr.getDay();
    const diff = curr.getDate() - day + (day === 0 ? -6 : 1);
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(curr.getFullYear(), curr.getMonth(), diff + i);
      weekDays.push(d);
    }

    let stats = { present: 0, absent: 0, weekend: 0, holiday: 0 };

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-8 pb-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            {shift ? `${shift.name} [ ${shift.startTime} - ${shift.endTime} ]` : "No Shift Assigned"}
          </h2>
        </div>

        <div className="space-y-6">
          {weekDays.map((date, idx) => {
            const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            const record = getRecordForDate(dateStr);
            const holiday = isHoliday(dateStr);
            const weekend = isWeekend(date);
            const todayStr = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;
            const isFuture = dateStr > todayStr;

            let status = 'Absent';
            let lineColor = 'border-red-300';
            let bgColor = 'bg-red-50';
            let textColor = 'text-red-500';

            if (record && record.sessions?.length > 0) {
              status = 'Present';
              lineColor = 'border-green-300';
              bgColor = 'bg-green-50';
              textColor = 'text-green-600';
              stats.present++;
            } else if (holiday) {
              status = holiday.name;
              lineColor = 'border-yellow-300';
              bgColor = 'bg-yellow-50';
              textColor = 'text-yellow-600';
              stats.holiday++;
            } else if (weekend) {
              status = 'Weekend';
              lineColor = 'border-yellow-300';
              bgColor = 'bg-yellow-50';
              textColor = 'text-yellow-600';
              stats.weekend++;
            } else if (isFuture) {
              status = 'Future';
              lineColor = 'border-gray-200';
              bgColor = 'bg-gray-50';
              textColor = 'text-gray-400';
            } else {
              stats.absent++;
            }

            const firstCheckIn = record?.sessions?.[0]?.checkIn;
            const lastCheckOut = record?.sessions?.[record.sessions.length - 1]?.checkOut;

            return (
              <div key={idx} className="flex items-center group">
                {/* Date Left */}
                <div className="w-24 text-right pr-6 border-r border-gray-100 shrink-0">
                  <div className="font-bold text-gray-800">{date.toLocaleDateString('default', { weekday: 'short' })}</div>
                  <div className="text-xl font-light text-gray-500">{date.getDate()}</div>
                </div>

                {/* Timeline Middle */}
                <div className="flex-1 flex items-center px-4">
                  {status === 'Present' ? (
                    <div className="w-full flex items-center">
                      <div className="w-20 text-sm font-semibold text-gray-600">
                        {new Date(firstCheckIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className={`flex-1 h-0.5 relative mx-4 border-t-2 ${lineColor}`}>
                        <div className="absolute -left-1 -top-1 w-2 h-2 rounded-full bg-green-400 border border-white"></div>
                        <div className="absolute -right-1 -top-1 w-2 h-2 rounded-full bg-green-400 border border-white"></div>
                      </div>
                      <div className="w-20 text-right text-sm font-semibold text-gray-600">
                        {lastCheckOut ? new Date(lastCheckOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Active"}
                      </div>
                    </div>
                  ) : (
                    <div className={`w-full flex items-center justify-center h-0.5 border-t-2 ${lineColor} relative`}>
                      <span className={`px-3 py-1 rounded text-xs font-semibold ${bgColor} ${textColor} border ${lineColor} -translate-y-1/2`}>
                        {status}
                      </span>
                    </div>
                  )}
                </div>

                {/* Hours Right */}
                <div className="w-32 pl-6 border-l border-gray-100 shrink-0">
                  <div className="font-bold text-gray-800">
                    {record ? record.totalHours.toFixed(2) : "00:00"}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Hrs worked</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-wrap gap-8 text-sm">
          <div className="flex flex-col">
            <span className="text-gray-500 font-medium">Days</span>
            <span className="font-bold text-gray-800 text-base">Hours</span>
          </div>
          <div className="w-px bg-gray-200"></div>
          
          <div className="border-l-4 border-blue-500 pl-3">
            <div className="text-gray-500">Payable Days</div>
            <div className="font-semibold text-gray-800">{stats.present + stats.holiday + stats.weekend} Days</div>
          </div>
          <div className="border-l-4 border-green-500 pl-3">
            <div className="text-gray-500">Present</div>
            <div className="font-semibold text-gray-800">{stats.present} Day</div>
          </div>
          <div className="border-l-4 border-yellow-500 pl-3">
            <div className="text-gray-500">Holidays</div>
            <div className="font-semibold text-gray-800">{stats.holiday} Day</div>
          </div>
          <div className="border-l-4 border-yellow-300 pl-3">
            <div className="text-gray-500">Weekend</div>
            <div className="font-semibold text-gray-800">{stats.weekend} Days</div>
          </div>
          <div className="border-l-4 border-red-400 pl-3">
            <div className="text-gray-500">Absent</div>
            <div className="font-semibold text-gray-800">{stats.absent} Day</div>
          </div>
        </div>
      </div>
    );
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    
    const days = [];
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2 border border-gray-100 bg-gray-50/50"></div>);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const record = getRecordForDate(dateStr);
      const holiday = isHoliday(dateStr);
      const isToday = new Date().toDateString() === date.toDateString();

      days.push(
        <div key={d} className={`p-3 border border-gray-100 h-28 flex flex-col ${isToday ? 'bg-indigo-50 border-indigo-200' : 'bg-white'} ${holiday ? 'bg-yellow-50' : ''}`}>
          <div className="flex justify-between items-start mb-2">
            <span className={`font-medium ${isToday ? 'text-indigo-600 font-bold' : 'text-gray-600'}`}>{d}</span>
            {record && record.totalHours > 0 && (
              <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-full">
                {record.totalHours.toFixed(1)}h
              </span>
            )}
            {holiday && !record && (
              <span className="text-[10px] font-semibold px-2 py-1 bg-yellow-200 text-yellow-800 rounded">
                Holiday
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
          <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="px-4 py-2 font-medium text-gray-600 hover:bg-gray-200 rounded-lg">
            &larr; Prev
          </button>
          <h3 className="text-lg font-bold text-gray-800">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h3>
          <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="px-4 py-2 font-medium text-gray-600 hover:bg-gray-200 rounded-lg">
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
