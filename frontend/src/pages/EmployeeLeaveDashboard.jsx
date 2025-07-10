import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { FaPlusCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const EmployeeLeaveDashboard = () => {
  const [balance, setBalance] = useState([]);
  const [history, setHistory] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetchBalance();
    fetchHistory();
  }, []);

  const fetchBalance = async () => {
    try {
      const res = await axios.get("/leaves/my-balance", { withCredentials: true });
      setBalance(res.data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get("/leaves/my-history", { withCredentials: true });
      setHistory(res.data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filteredHistory = statusFilter === "All"
    ? history
    : history.filter((l) => l.status === statusFilter);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800">My Leave Dashboard</h2>
        <Link
          to="/apply-leave"
          className="bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-700 flex items-center gap-2"
        >
          <FaPlusCircle /> Apply Leave
        </Link>
      </div>

      {/* Leave Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {balance.map((b, idx) => (
          <div key={idx} className="bg-white border rounded shadow p-4">
            <h3 className="font-semibold text-lg text-gray-700 mb-2">{b.policyName}</h3>
            <p className="text-sm text-gray-500">Allowed: {b.allowed}</p>
            <p className="text-sm text-yellow-600">Used: {b.used}</p>
            <p className="text-sm text-green-600 font-semibold">Remaining: {b.remaining}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-semibold text-gray-700">Leave History</h3>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Leave History Table */}
      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2 border">Policy</th>
              <th className="text-left px-4 py-2 border">From</th>
              <th className="text-left px-4 py-2 border">To</th>
              <th className="text-left px-4 py-2 border">Reason</th>
              <th className="text-left px-4 py-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No leave records found.
                </td>
              </tr>
            ) : (
              filteredHistory.map((l) => (
                <tr key={l._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{l.leavePolicy?.name || "N/A"}</td>
                  <td className="px-4 py-2 border">{new Date(l.startDate).toLocaleDateString()}</td>
                  <td className="px-4 py-2 border">{new Date(l.endDate).toLocaleDateString()}</td>
                  <td className="px-4 py-2 border">{l.reason || "-"}</td>
                  <td className="px-4 py-2 border">
                    <span className={`px-2 py-1 text-white rounded text-xs ${
                      l.status === "Approved" ? "bg-green-500" :
                      l.status === "Rejected" ? "bg-red-500" : "bg-yellow-500"
                    }`}>
                      {l.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeLeaveDashboard;
