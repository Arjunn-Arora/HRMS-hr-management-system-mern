import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { toast } from "react-toastify";
import "chart.js/auto";
import { FaClipboardCheck } from "react-icons/fa";
import LeaveChart from "../components/LeaveChart";

const LeaveDashboard = () => {
  const [leaves, setLeaves] = useState([]);
  const [policies, setPolicies] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [stats, setStats] = useState({ approved: 0, pending: 0, rejected: 0 });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const leaveRes = await axios.get("/leaves/requests", { withCredentials: true });
      setLeaves(leaveRes.data);

      const policyRes = await axios.get("/leaves/policy", { withCredentials: true });
      setPolicies(policyRes.data);

      const statsRes = await axios.get("/leaves/stats", { withCredentials: true });
    setChartData(statsRes.data);

      const statCount = { approved: 0, pending: 0, rejected: 0 };
    leaveRes.data.forEach((l) => statCount[l.status]++);
    setStats(statCount);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">HR Leave Dashboard</h1>

      {/* Charts */}
      <div className="mb-6 w-full max-w-md mx-auto">
        <div className="mb-6 w-full max-w-md mx-auto">
  <LeaveChart data={chartData} />
</div>
      </div>

      {/* Policies */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Leave Policies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {policies.map((p) => (
            <div key={p._id} className="border p-4 rounded shadow bg-white">
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <p>{p.description}</p>
              <p className="text-sm text-gray-500">Max Days: {p.totalDays}</p>
            </div>
          ))}
        </div>
      </div>

      <Card icon={<FaClipboardCheck />} label="Approve Leaves" link="/hr/leave-approvals" />


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
    <td className="border px-3 py-2">{leave.employeeId?.name || "N/A"}</td>
    <td className="border px-3 py-2">{leave.leavePolicy?.name || "N/A"}</td>
    <td className="border px-3 py-2">{new Date(leave.startDate).toLocaleDateString()}</td>
    <td className="border px-3 py-2">{new Date(leave.endDate).toLocaleDateString()}</td>
    <td className="border px-3 py-2">
      <span
        className={`px-2 py-1 rounded text-white text-sm ${
          leave.status === "Approved"
            ? "bg-green-500"
            : leave.status === "Pending"
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

const Card = ({ icon, label, value, link }) => {
  const content = (
    <div className="bg-white shadow-md rounded-2xl p-5 flex items-center space-x-4 hover:shadow-lg transition cursor-pointer">
      <div className="text-3xl text-indigo-600">{icon}</div>
      <div>
        <p className="text-gray-600">{label}</p>
        <h2 className="text-xl font-semibold">{value}</h2>
      </div>
    </div>
  );

  return link ? <a href={link}>{content}</a> : content;
};

export default LeaveDashboard;
