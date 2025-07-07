import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";

const LeaveDashboard = () => {
  const [leaves, setLeaves] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [stats, setStats] = useState({ approved: 0, pending: 0, rejected: 0 });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const leaveRes = await axios.get("/leave/all", { withCredentials: true });
      setLeaves(leaveRes.data);

      const policyRes = await axios.get("/leave/policies", { withCredentials: true });
      setPolicies(policyRes.data);

      const statCount = { approved: 0, pending: 0, rejected: 0 };
      leaveRes.data.forEach((l) => statCount[l.status]++);
      setStats(statCount);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const chartData = {
    labels: ["Approved", "Pending", "Rejected"],
    datasets: [
      {
        data: [stats.approved, stats.pending, stats.rejected],
        backgroundColor: ["#22c55e", "#facc15", "#ef4444"]
      }
    ]
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">HR Leave Dashboard</h1>

      {/* Charts */}
      <div className="mb-6 w-full max-w-md mx-auto">
        <Pie data={chartData} />
      </div>

      {/* Policies */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Leave Policies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {policies.map((p) => (
            <div key={p._id} className="border p-4 rounded shadow bg-white">
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <p>{p.description}</p>
              <p className="text-sm text-gray-500">Max Days: {p.maxDays}</p>
            </div>
          ))}
        </div>
      </div>

      {/* All Applications */}
      <div>
        <h2 className="text-xl font-semibold mb-2">All Leave Applications</h2>
        <table className="w-full border shadow text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2">Employee</th>
              <th className="border px-3 py-2">Policy</th>
              <th className="border px-3 py-2">From</th>
              <th className="border px-3 py-2">To</th>
              <th className="border px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave) => (
              <tr key={leave._id} className="text-center">
                <td className="border px-3 py-2">{leave.employeeName}</td>
                <td className="border px-3 py-2">{leave.policyName}</td>
                <td className="border px-3 py-2">{new Date(leave.startDate).toLocaleDateString()}</td>
                <td className="border px-3 py-2">{new Date(leave.endDate).toLocaleDateString()}</td>
                <td className="border px-3 py-2">
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      leave.status === "approved"
                        ? "bg-green-500"
                        : leave.status === "pending"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  >
                    {leave.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveDashboard;
