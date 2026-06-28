import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosInstance';
import { toast } from 'react-toastify';
import { FaPlus, FaTrash, FaUsers, FaClock } from 'react-icons/fa';

const ManageShifts = () => {
  const [shifts, setShifts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [newShift, setNewShift] = useState({ name: '', startTime: '', endTime: '' });
  const [assignData, setAssignData] = useState({ shiftId: '', userIds: [] });

  useEffect(() => {
    fetchShifts();
    fetchEmployees();
  }, []);

  const fetchShifts = async () => {
    try {
      const res = await axios.get('/hr/shifts', { withCredentials: true });
      setShifts(res.data);
    } catch (err) {
      toast.error("Failed to load shifts");
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('/hr/users', { withCredentials: true });
      // Assuming hr/users returns the array of users directly or in res.data.users
      setEmployees(res.data.users || res.data || []);
    } catch (err) {
      toast.error("Failed to load employees");
    }
  };

  const handleCreateShift = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/hr/shifts', newShift, { withCredentials: true });
      toast.success("Shift created successfully");
      fetchShifts();
      setNewShift({ name: '', startTime: '', endTime: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create shift");
    }
  };

  const handleDeleteShift = async (id) => {
    try {
      await axios.delete(`/hr/shifts/${id}`, { withCredentials: true });
      toast.success("Shift deleted");
      fetchShifts();
    } catch (err) {
      toast.error("Failed to delete shift");
    }
  };

  const handleAssignShift = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/hr/shifts/assign', assignData, { withCredentials: true });
      toast.success("Shift assigned to selected employees");
      fetchEmployees(); // Refresh to see updated mapped shifts
    } catch (err) {
      toast.error("Failed to assign shift");
    }
  };

  const handleUserSelect = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) selected.push(options[i].value);
    }
    setAssignData({ ...assignData, userIds: selected });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Manage Shifts</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Create Shift Form */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaPlus className="text-indigo-500" /> Create New Shift
          </h2>
          <form onSubmit={handleCreateShift} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Shift Name</label>
              <input type="text" required value={newShift.name} onChange={e => setNewShift({...newShift, name: e.target.value})} placeholder="e.g. Regular Day Shift" className="mt-1 w-full p-2 border rounded" />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Start Time</label>
                <input type="time" required value={newShift.startTime} onChange={e => setNewShift({...newShift, startTime: e.target.value})} className="mt-1 w-full p-2 border rounded" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">End Time</label>
                <input type="time" required value={newShift.endTime} onChange={e => setNewShift({...newShift, endTime: e.target.value})} className="mt-1 w-full p-2 border rounded" />
              </div>
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded font-semibold hover:bg-indigo-700">Save Shift</button>
          </form>
        </div>

        {/* Existing Shifts List */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaClock className="text-purple-500" /> Active Shifts
          </h2>
          {shifts.length === 0 ? <p className="text-gray-500 italic">No shifts created yet.</p> : (
            <ul className="space-y-3">
              {shifts.map(shift => (
                <li key={shift._id} className="flex justify-between items-center p-3 bg-gray-50 rounded border">
                  <div>
                    <div className="font-semibold text-gray-800">{shift.name}</div>
                    <div className="text-sm text-gray-500">{shift.startTime} - {shift.endTime}</div>
                  </div>
                  <button onClick={() => handleDeleteShift(shift._id)} className="text-red-500 hover:text-red-700 p-2">
                    <FaTrash />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Assign Employees to Shift */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaUsers className="text-blue-500" /> Assign Employees to Shift
        </h2>
        <form onSubmit={handleAssignShift} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Shift</label>
              <select required value={assignData.shiftId} onChange={e => setAssignData({...assignData, shiftId: e.target.value})} className="w-full p-2 border rounded">
                <option value="">-- Choose Shift --</option>
                {shifts.map(shift => (
                  <option key={shift._id} value={shift._id}>{shift.name} ({shift.startTime} - {shift.endTime})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Employees (Hold Ctrl/Cmd to multi-select)</label>
              <select multiple required onChange={handleUserSelect} className="w-full p-2 border rounded h-32">
                {Array.isArray(employees) && employees.map(emp => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name} ({emp.email}) {emp.shiftId ? `- Current: ${shifts.find(s => s._id === emp.shiftId)?.name || 'Mapped'}` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700">Assign Shift</button>
        </form>
      </div>
    </div>
  );
};

export default ManageShifts;
