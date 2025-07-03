import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

const ViewAttendance = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await axios.get("/attendance/my", { withCredentials: true });
        setRecords(res.data);
      } catch (err) {
        toast.error("Failed to fetch attendance");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <ClipLoader size={40} color="#3B82F6" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">My Attendance</h2>
      {records.length === 0 ? (
        <p className="text-gray-600">No attendance records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
  <thead className="bg-gray-100">
    <tr>
      <th className="border px-4 py-2 text-left">Date</th>
      <th className="border px-4 py-2 text-left">Project</th>
      <th className="border px-4 py-2 text-left">Marked By</th>
      <th className="border px-4 py-2 text-left">Time</th>
      <th className="border px-4 py-2 text-left">Status</th> 
    </tr>
  </thead>
  <tbody>
    {records.map((r, index) => (
      <tr key={index}>
        <td className="border px-4 py-2">
          {new Date(r.markedAt).toLocaleDateString()}
        </td>
       <td className="border px-4 py-2">{r.projectName || "N/A"}</td>
        <td className="border px-4 py-2">{r.markedByName}</td>
        <td className="border px-4 py-2">
          {new Date(r.markedAt).toLocaleTimeString()}
        </td>
        <td className="border px-4 py-2">
          <span className={`px-2 py-1 rounded text-white text-sm ${
            r.isPresent ? 'bg-green-500' : 'bg-red-500'
          }`}>
            {r.isPresent ? 'Present' : 'Absent'}
          </span>
        </td>
      </tr>
    ))}
  </tbody>
</table>

        </div>
      )}
    </div>
  );
};

export default ViewAttendance;
