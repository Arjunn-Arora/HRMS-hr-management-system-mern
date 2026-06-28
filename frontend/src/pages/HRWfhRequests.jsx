import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { FaHome, FaCheck, FaTimes } from "react-icons/fa";

const HRWfhRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get("/wfh/all", { withCredentials: true });
      setRequests(res.data);
    } catch (err) {
      toast.error("Failed to load WFH requests");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/wfh/${id}`, { status }, { withCredentials: true });
      toast.success(`Request ${status}`);
      fetchRequests();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen bg-gray-50">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-indigo-100 text-indigo-600 rounded-lg">
          <FaHome size={28} />
        </div>
        <div>
          <h2 className="text-3xl font-extrabold text-gray-800">WFH Requests</h2>
          <p className="text-gray-500">Manage Work From Home requests</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left p-4 font-semibold text-gray-600">Employee</th>
              <th className="text-left p-4 font-semibold text-gray-600">Date</th>
              <th className="text-left p-4 font-semibold text-gray-600">Reason</th>
              <th className="text-left p-4 font-semibold text-gray-600">Status</th>
              <th className="text-right p-4 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {requests.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">No WFH requests found.</td>
              </tr>
            ) : (
              requests.map(req => (
                <tr key={req._id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-semibold text-gray-800">{req.employeeId?.name || "Unknown"}</div>
                    <div className="text-xs text-gray-500">{req.employeeId?.email}</div>
                  </td>
                  <td className="p-4 text-gray-700">{req.date}</td>
                  <td className="p-4 text-gray-600 max-w-xs truncate" title={req.reason}>
                    {req.reason}
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      req.status === 'Approved' ? 'bg-green-100 text-green-700' :
                      req.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {req.status === 'Pending' ? (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => updateStatus(req._id, 'Approved')}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                          title="Approve"
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={() => updateStatus(req._id, 'Rejected')}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                          title="Reject"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">Processed</span>
                    )}
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

export default HRWfhRequests;
