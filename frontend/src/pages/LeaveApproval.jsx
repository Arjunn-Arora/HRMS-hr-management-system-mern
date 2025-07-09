import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const LeaveApproval = () => {
  const [requests, setRequests] = useState([]);

  const fetchLeaveRequests = async () => {
    try {
      const res = await axios.get("/leaves/requests", { withCredentials: true });
      setRequests(res.data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`/leaves/update-status/${id}`, { status }, { withCredentials: true });
      toast.success(`Leave ${status}`);
      fetchLeaveRequests();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Leave Approval Requests</h2>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border-b">Employee</th>
              <th className="p-3 border-b">Policy</th>
              <th className="p-3 border-b">Dates</th>
              <th className="p-3 border-b">Reason</th>
              <th className="p-3 border-b">Status</th>
              <th className="p-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No pending leave requests.
                </td>
              </tr>
            ) : (
              requests.map((req) => (
                <tr key={req._id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">
                    {req.employeeId.name} <br />
                    <span className="text-xs text-gray-500">{req.employeeId.email}</span>
                  </td>
                  <td className="p-3 border-b">{req.leavePolicy?.name}</td>
                  <td className="p-3 border-b">
                    {new Date(req.startDate).toLocaleDateString()} →{" "}
                    {new Date(req.endDate).toLocaleDateString()}
                  </td>
                  <td className="p-3 border-b">{req.reason || "—"}</td>
                  <td className="p-3 border-b font-medium">
                    <span
                      className={`px-2 py-1 rounded text-white text-xs ${
                        req.status === "Approved"
                          ? "bg-green-500"
                          : req.status === "Rejected"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="p-3 border-b flex gap-3">
                    <button
                      onClick={() => handleStatusChange(req._id, "Approved")}
                      disabled={req.status !== "Pending"}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                    >
                      <FaCheckCircle /> Approve
                    </button>
                    <button
                      onClick={() => handleStatusChange(req._id, "Rejected")}
                      disabled={req.status !== "Pending"}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                    >
                      <FaTimesCircle /> Reject
                    </button>
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

export default LeaveApproval;
