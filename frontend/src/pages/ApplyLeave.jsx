import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { toast } from "react-toastify";

const ApplyLeave = () => {
  const [policies, setPolicies] = useState([]);
  const [form, setForm] = useState({ policyId: "", startDate: "", endDate: "", reason: "" });

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const res = await axios.get("/leaves/policy", { withCredentials: true });
        setPolicies(res.data);
      } catch (err) {
        toast.error(err.message);
      }
    };
    fetchPolicies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/leaves/apply", form, { withCredentials: true });
      toast.success("Leave application submitted");
      setForm({ policyId: "", startDate: "", endDate: "", reason: "" });
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow p-6 mt-10 rounded">
      <h2 className="text-2xl font-semibold mb-4">Apply for Leave</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={form.policyId}
          onChange={(e) => setForm({ ...form, policyId: e.target.value })}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Leave Policy</option>
          {policies.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={form.startDate}
          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
          className="w-full p-2 border rounded"
        />

        <input
          type="date"
          value={form.endDate}
          onChange={(e) => setForm({ ...form, endDate: e.target.value })}
          className="w-full p-2 border rounded"
        />

        <textarea
          placeholder="Reason"
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          Submit Leave Request
        </button>
      </form>
    </div>
  );
};

export default ApplyLeave;
