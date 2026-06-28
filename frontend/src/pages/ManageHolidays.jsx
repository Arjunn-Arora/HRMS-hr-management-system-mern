import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosInstance';
import { toast } from 'react-toastify';
import { FaPlus, FaTrash, FaCalendarAlt } from 'react-icons/fa';

const ManageHolidays = () => {
  const [holidays, setHolidays] = useState([]);
  const [newHoliday, setNewHoliday] = useState({ name: '', date: '', type: 'Public Holiday' });

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    try {
      const res = await axios.get('/hr/holidays', { withCredentials: true });
      setHolidays(res.data);
    } catch (err) {
      toast.error("Failed to load holidays");
    }
  };

  const handleCreateHoliday = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/hr/holidays', newHoliday, { withCredentials: true });
      toast.success("Holiday created successfully");
      fetchHolidays();
      setNewHoliday({ name: '', date: '', type: 'Public Holiday' });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create holiday");
    }
  };

  const handleDeleteHoliday = async (id) => {
    try {
      await axios.delete(`/hr/holidays/${id}`, { withCredentials: true });
      toast.success("Holiday deleted");
      fetchHolidays();
    } catch (err) {
      toast.error("Failed to delete holiday");
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <FaCalendarAlt className="text-indigo-600" /> Manage Holidays
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Create Holiday Form */}
        <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md border border-gray-100 h-fit">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaPlus className="text-indigo-500" /> Add Holiday
          </h2>
          <form onSubmit={handleCreateHoliday} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Holiday Name</label>
              <input type="text" required value={newHoliday.name} onChange={e => setNewHoliday({...newHoliday, name: e.target.value})} placeholder="e.g. Christmas" className="mt-1 w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input type="date" required value={newHoliday.date} onChange={e => setNewHoliday({...newHoliday, date: e.target.value})} className="mt-1 w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select value={newHoliday.type} onChange={e => setNewHoliday({...newHoliday, type: e.target.value})} className="mt-1 w-full p-2 border rounded">
                <option value="Public Holiday">Public Holiday</option>
                <option value="Optional Holiday">Optional Holiday</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded font-semibold hover:bg-indigo-700">Save Holiday</button>
          </form>
        </div>

        {/* Existing Holidays List */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">Upcoming Holidays</h2>
          {holidays.length === 0 ? <p className="text-gray-500 italic">No holidays configured.</p> : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-3 font-medium text-gray-600">Date</th>
                    <th className="p-3 font-medium text-gray-600">Holiday Name</th>
                    <th className="p-3 font-medium text-gray-600">Type</th>
                    <th className="p-3 font-medium text-gray-600 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {holidays.map(holiday => (
                    <tr key={holiday._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3 font-semibold text-gray-800">{new Date(holiday.date).toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                      <td className="p-3">{holiday.name}</td>
                      <td className="p-3"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">{holiday.type}</span></td>
                      <td className="p-3 text-right">
                        <button onClick={() => handleDeleteHoliday(holiday._id)} className="text-red-500 hover:text-red-700 p-2">
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageHolidays;
