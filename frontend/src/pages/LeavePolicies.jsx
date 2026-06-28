import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { FaTrash, FaEdit, FaPlusCircle, FaCog } from "react-icons/fa";

const LeavePolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [form, setForm] = useState({
    name: "",
    totalDays: "",
    type: "Paid",
    settings: {
      includePublicHolidays: false,
      sandwichPolicy: false,
      documentRequired: false,
      priorNoticeDays: 0
    }
  });
  const [editingId, setEditingId] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const res = await axios.get("/leaves/policy", { withCredentials: true });
      setPolicies(res.data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSettingsChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({
      ...form,
      settings: { ...form.settings, [e.target.name]: value }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.totalDays) return toast.error("All fields required");

    try {
      if (editingId) {
        await axios.put(`/leaves/policies/${editingId}`, form, { withCredentials: true });
        toast.success("Policy updated");
      } else {
        await axios.post("/leaves/policy", form, { withCredentials: true });
        toast.success("Policy added");
      }
      resetForm();
      fetchPolicies();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const resetForm = () => {
    setForm({
      name: "", totalDays: "", type: "Paid",
      settings: {
        includePublicHolidays: false,
        sandwichPolicy: false,
        documentRequired: false,
        priorNoticeDays: 0
      }
    });
    setEditingId(null);
    setShowAdvanced(false);
  };

  const handleEdit = (policy) => {
    setForm({
      name: policy.name,
      totalDays: policy.totalDays,
      type: policy.type,
      settings: policy.settings || {
        includePublicHolidays: false,
        sandwichPolicy: false,
        documentRequired: false,
        priorNoticeDays: 0
      }
    });
    setEditingId(policy._id);
    setShowAdvanced(true);
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
    <div className="p-8 max-w-5xl mx-auto min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Leave Policies</h2>

      <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">{editingId ? "Edit Policy" : "Create New Policy"}</h3>
          {editingId && (
            <button onClick={resetForm} className="text-sm text-gray-500 hover:text-gray-800 underline">Cancel Edit</button>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Policy Name</label>
              <input type="text" name="name" placeholder="e.g. Casual Leave" value={form.name} onChange={handleChange} className="w-full p-2.5 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
              <select name="type" value={form.type} onChange={handleChange} className="w-full p-2.5 border rounded-md">
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Sick">Sick</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Days</label>
              <input type="number" name="totalDays" placeholder="Days per year" value={form.totalDays} onChange={handleChange} className="w-full p-2.5 border rounded-md" />
            </div>
          </div>

          <div className="border-t pt-4">
            <button type="button" onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-800">
              <FaCog /> {showAdvanced ? "Hide Advanced Settings" : "Show Advanced Settings"}
            </button>
          </div>

          {showAdvanced && (
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input type="checkbox" name="includePublicHolidays" checked={form.settings.includePublicHolidays} onChange={handleSettingsChange} className="w-4 h-4 text-indigo-600" />
                  <span className="text-gray-700">Include Public Holidays (If a holiday falls between leave dates, count it as leave)</span>
                </label>
                
                <label className="flex items-center gap-3">
                  <input type="checkbox" name="sandwichPolicy" checked={form.settings.sandwichPolicy} onChange={handleSettingsChange} className="w-4 h-4 text-indigo-600" />
                  <span className="text-gray-700">Sandwich Policy (Weekends adjoining leave are counted as leaves)</span>
                </label>
                
                <label className="flex items-center gap-3">
                  <input type="checkbox" name="documentRequired" checked={form.settings.documentRequired} onChange={handleSettingsChange} className="w-4 h-4 text-indigo-600" />
                  <span className="text-gray-700">Document Required (e.g. Medical certificate for sick leave)</span>
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prior Notice (Days)</label>
                <input type="number" name="priorNoticeDays" value={form.settings.priorNoticeDays} onChange={handleSettingsChange} className="w-full p-2.5 border rounded-md" min="0" />
                <p className="text-xs text-gray-500 mt-1">Minimum days in advance the employee must apply for this leave.</p>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button type="submit" className="bg-indigo-600 text-white px-8 py-2.5 rounded-md font-semibold hover:bg-indigo-700 flex items-center gap-2">
              <FaPlusCircle /> {editingId ? "Update Policy" : "Save Policy"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left p-4 font-semibold text-gray-600">Policy Name</th>
              <th className="text-left p-4 font-semibold text-gray-600">Type</th>
              <th className="text-left p-4 font-semibold text-gray-600">Total Days</th>
              <th className="text-left p-4 font-semibold text-gray-600">Settings</th>
              <th className="text-right p-4 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {policies.length === 0 ? (
              <tr><td colSpan="5" className="p-6 text-center text-gray-500">No leave policies found.</td></tr>
            ) : (
              policies.map((policy) => (
                <tr key={policy._id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-800">{policy.name}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-semibold">{policy.type}</span>
                  </td>
                  <td className="p-4 text-gray-600">{policy.totalDays} Days</td>
                  <td className="p-4 text-sm text-gray-500">
                    {policy.settings?.priorNoticeDays > 0 && <div className="text-xs">Notice: {policy.settings.priorNoticeDays}d</div>}
                    {policy.settings?.documentRequired && <div className="text-xs">Doc Required</div>}
                    {policy.settings?.sandwichPolicy && <div className="text-xs">Sandwich</div>}
                  </td>
                  <td className="p-4 text-right flex items-center justify-end gap-3">
                    <button onClick={() => handleEdit(policy)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(policy._id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
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
