import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";

const MyLeaveHistory = () => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const fetchLeaves = async () => {
      const res = await axios.get("/leave/my", { withCredentials: true });
      setLeaves(res.data);
    };
    fetchLeaves();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Leave History</h2>
      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Policy</th>
            <th className="border p-2">From</th>
            <th className="border p-2">To</th>
            <th className="border p-2">Reason</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((l) => (
            <tr key={l._id}>
              <td className="border p-2">{l.policyName}</td>
              <td className="border p-2">{new Date(l.startDate).toLocaleDateString()}</td>
              <td className="border p-2">{new Date(l.endDate).toLocaleDateString()}</td>
              <td className="border p-2">{l.reason}</td>
              <td className="border p-2">
                <span className={`px-2 py-1 rounded text-white text-sm ${
                  l.status === "approved"
                    ? "bg-green-500"
                    : l.status === "pending"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}>
                  {l.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyLeaveHistory;
