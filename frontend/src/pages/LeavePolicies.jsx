import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { FaTrash, FaEdit, FaPlusCircle } from "react-icons/fa";

const LeavePolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [form, setForm] = useState({ name: "", totalDays: "" });
  const [editingId, setEditingId] = useState(null);

  // Fetch policies on mount
  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const res = await axios.get("/leaves/policies", { withCredentials: true });
      setPolicies(res.data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.totalDays) return toast.error("All fields required");

    try {
      if (editingId) {
        await axios.put(`/leaves/policies/${editingId}`, form, { withCredentials: true });
        toast.success("Policy updated");
      } else {
        await axios.post("/leaves/policies", form, { withCredentials: true });
        toast.success("Policy added");
      }
      setForm({ name: "", totalDays: "" });
      setEditingId(null);
      fetchPolicies();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEdit = (policy) => {
    setForm({ name: policy.name, totalDays: policy.totalDays });
    setEditingId(policy._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this policy?")) return;
    try {
      await axios.delete(`/leaves/policies/${id}`, { withCredentials: true });
      toast.success("Policy deleted");
      fetchPolicies();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Leave Policies</h2>

      {/* Add / Edit Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow rounded p-4 mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            name="name"
            placeholder="Policy Name (e.g. Casual Leave)"
            value={form.name}
            onChange={handleChange}
            className="flex-1 p-2 border rounded"
          />
          <input
            type="number"
            name="totalDays"
            placeholder="Total Days"
            value={form.totalDays}
            onChange={handleChange}
            className="w-40 p-2 border rounded"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 flex items-center gap-2"
          >
            <FaPlusCircle /> {editingId ? "Update" : "Add"}
          </button>
        </div>
      </form>

      {/* Policies Table */}
      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3 border-b">Policy Name</th>
              <th className="text-left p-3 border-b">Total Days</th>
              <th className="text-left p-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {policies.length === 0 ? (
              <tr>
                <td className="p-4 text-gray-600" colSpan="3">
                  No leave policies found.
                </td>
              </tr>
            ) : (
              policies.map((policy) => (
                <tr key={policy._id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{policy.name}</td>
                  <td className="p-3 border-b">{policy.totalDays} days</td>
                  <td className="p-3 border-b flex items-center gap-4">
                    <button
                      onClick={() => handleEdit(policy)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(policy._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
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

export default LeavePolicies;
