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

  const [wfhRequests, setWfhRequests] = useState([]);
  const [showWfhModal, setShowWfhModal] = useState(false);
  const [wfhForm, setWfhForm] = useState({ date: "", reason: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [meRes, attRes, holRes, shiftRes, wfhRes] = await Promise.all([
          axios.get('/auth/me', { withCredentials: true }),
          axios.get("/attendance/my", { withCredentials: true }),
          axios.get("/holidays", { withCredentials: true }),
          axios.get("/shifts", { withCredentials: true }),
          axios.get("/wfh/my", { withCredentials: true }).catch(() => ({ data: [] }))
        ]);

        const currentUser = meRes.data.user;
        setUser(currentUser);
        setRecords(attRes.data);
        setHolidays(holRes.data);
        setWfhRequests(wfhRes.data);

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
  const isWFH = (dateStr) => wfhRequests.find(w => w.date === dateStr && w.status === 'Approved');

  const formatTime12Hour = (time24) => {
    if (!time24) return '';
    const [h, m] = time24.split(':');
    let hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour.toString().padStart(2, '0')}:${m} ${ampm}`;
  };

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

    let stats = { present: 0, absent: 0, weekend: 0, holiday: 0, remote: 0 };

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-8 pb-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            {shift ? `${shift.name} [ ${formatTime12Hour(shift.startTime)} - ${formatTime12Hour(shift.endTime)} ]` : "No Shift Assigned"}
          </h2>
        </div>

        <div className="space-y-6">
          {weekDays.map((date, idx) => {
            const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            const record = getRecordForDate(dateStr);
            const holiday = isHoliday(dateStr);
            const weekend = isWeekend(date);
            const wfh = isWFH(dateStr);
            const todayStr = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;
            const isFuture = dateStr > todayStr;

            let status = 'Absent';
            let lineColor = 'border-red-300';
            let bgColor = 'bg-red-50';
            let textColor = 'text-red-500';

            if (record && record.sessions?.length > 0) {
              if (wfh) {
                status = 'Remote';
                lineColor = 'border-blue-300';
                bgColor = 'bg-blue-50';
                textColor = 'text-blue-600';
                stats.remote++;
              } else {
                status = 'Present';
                lineColor = 'border-green-300';
                bgColor = 'bg-green-50';
                textColor = 'text-green-600';
                stats.present++;
              }
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

            let isLate = false;
            let isEarly = false;

            if (shift && status === 'Present' && firstCheckIn) {
              const checkInDate = new Date(firstCheckIn);
              const checkInTime = `${String(checkInDate.getHours()).padStart(2, '0')}:${String(checkInDate.getMinutes()).padStart(2, '0')}`;
              if (checkInTime > shift.startTime) isLate = true;

              if (lastCheckOut) {
                const checkOutDate = new Date(lastCheckOut);
                const checkOutTime = `${String(checkOutDate.getHours()).padStart(2, '0')}:${String(checkOutDate.getMinutes()).padStart(2, '0')}`;
                if (checkOutTime < shift.endTime) isEarly = true;
              }
            }

            return (
              <div key={idx} className="flex items-center group">
                {/* Date Left */}
                <div className="w-24 text-right pr-6 border-r border-gray-100 shrink-0">
                  <div className="font-bold text-gray-800">{date.toLocaleDateString('default', { weekday: 'short' })}</div>
                  <div className="text-xl font-light text-gray-500">{date.getDate()}</div>
                </div>

                {/* Timeline Middle */}
                <div className="flex-1 flex flex-col justify-center px-4">
                  {(status === 'Present' || status === 'Remote') ? (
                    <>
                      <div className="w-full flex items-center">
                        <div className="w-20 text-sm font-semibold text-gray-600">
                          {new Date(firstCheckIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className={`flex-1 h-0.5 relative mx-4 border-t-2 ${lineColor}`}>
                          <div className={`absolute -left-1 -top-1 w-2 h-2 rounded-full border border-white ${status === 'Remote' ? 'bg-blue-400' : 'bg-green-400'}`}></div>
                          <div className={`absolute -right-1 -top-1 w-2 h-2 rounded-full border border-white ${status === 'Remote' ? 'bg-blue-400' : 'bg-green-400'}`}></div>
                        </div>
                        <div className="w-20 text-right text-sm font-semibold text-gray-600">
                          {lastCheckOut ? new Date(lastCheckOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Active"}
                        </div>
                        {status === 'Remote' && (
                          <span className={`absolute ml-[30%] px-2 py-0.5 rounded text-xs font-semibold ${bgColor} ${textColor} border ${lineColor} -translate-y-1/2`}>Remote</span>
                        )}
                      </div>
                      <div className="w-full flex justify-between px-20 mt-1">
                        <span className="text-[10px] font-bold text-red-500">{isLate ? "Late Check-in" : ""}</span>
                        <span className="text-[10px] font-bold text-orange-500">{isEarly ? "Early Check-out" : ""}</span>
                      </div>
                    </>
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
      const weekend = isWeekend(date);
      const wfh = isWFH(dateStr);
      const isToday = new Date().toDateString() === date.toDateString();
      const todayStr = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;
      const isFuture = dateStr > todayStr;

      let statusStr = 'Absent';
      let statusColor = 'text-red-500 bg-red-100';
      if (record && record.sessions?.length > 0) {
        if (wfh) {
          statusStr = 'Remote';
          statusColor = 'text-blue-700 bg-blue-100';
        } else {
          statusStr = 'Present';
          statusColor = 'text-green-700 bg-green-100';
        }
      } else if (holiday) {
        statusStr = 'Holiday';
        statusColor = 'text-yellow-800 bg-yellow-200';
      } else if (weekend) {
        statusStr = 'Weekend';
        statusColor = 'text-yellow-600 bg-yellow-100';
      } else if (isFuture) {
        statusStr = '';
      }

      days.push(
        <div key={d} className={`p-3 border border-gray-100 h-28 flex flex-col ${isToday ? 'bg-indigo-50 border-indigo-200' : 'bg-white'} ${holiday ? 'bg-yellow-50' : ''}`}>
          <div className="flex justify-between items-start mb-2">
            <span className={`font-medium ${isToday ? 'text-indigo-600 font-bold' : 'text-gray-600'}`}>{d}</span>
            <div className="flex flex-col items-end gap-1">
              {statusStr && (
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${statusColor}`}>
                  {statusStr}
                </span>
              )}
              {record && record.totalHours > 0 && (
                <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                  {record.totalHours.toFixed(1)}h
                </span>
              )}
            </div>
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


  const handleApplyWfh = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/wfh/apply", wfhForm, { withCredentials: true });
      toast.success("WFH request submitted successfully!");
      setShowWfhModal(false);
      setWfhForm({ date: "", reason: "" });
      // Refetch
      const res = await axios.get("/wfh/my", { withCredentials: true }).catch(() => ({ data: [] }));
      setWfhRequests(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit WFH request");
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Attendance Dashboard</h1>
          <p className="text-gray-500 mt-1">Track your daily check-ins and working hours.</p>
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={() => setShowWfhModal(true)}
            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 transition"
          >
            Apply WFH
          </button>
          
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
      </div>

      <div className="mt-6">
        {viewMode === "week" ? renderWeekView() : renderCalendar()}
      </div>

      {showWfhModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Apply for Work From Home</h2>
            <form onSubmit={handleApplyWfh} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={wfhForm.date}
                  onChange={e => setWfhForm({...wfhForm, date: e.target.value})}
                  className="w-full p-2.5 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <textarea
                  required
                  rows="3"
                  value={wfhForm.reason}
                  onChange={e => setWfhForm({...wfhForm, reason: e.target.value})}
                  className="w-full p-2.5 border rounded-md"
                  placeholder="Reason for working from home..."
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowWfhModal(false)}
                  className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAttendance;
