import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance";
import { toast } from "react-toastify";

const ApplyLeave = () => {
  const navigate = useNavigate();
  const [policies, setPolicies] = useState([]);
  const [balances, setBalances] = useState([]);
  
  const [form, setForm] = useState({
    policyId: "",
    startDate: "",
    endDate: "",
    reason: "",
    teamEmail: ""
  });
  
  const [breakdown, setBreakdown] = useState([]);

  useEffect(() => {
    fetchPoliciesAndBalances();
  }, []);

  const fetchPoliciesAndBalances = async () => {
    try {
      const [polRes, balRes] = await Promise.all([
        axios.get("/leaves/policy", { withCredentials: true }),
        axios.get("/leaves/my-balance", { withCredentials: true })
      ]);
      setPolicies(polRes.data);
      setBalances(balRes.data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Generate breakdown rows when dates change
  useEffect(() => {
    if (form.startDate && form.endDate && form.startDate <= form.endDate) {
      const start = new Date(form.startDate);
      const end = new Date(form.endDate);
      const newBreakdown = [];
      let current = new Date(start);
      
      while (current <= end) {
        const dateStr = current.toISOString().split('T')[0];
        // Preserve existing selection if any
        const existing = breakdown.find(b => b.date === dateStr);
        newBreakdown.push({
          date: dateStr,
          type: existing ? existing.type : "Full Day",
          dateObj: new Date(current)
        });
        current.setDate(current.getDate() + 1);
      }
      setBreakdown(newBreakdown);
    } else {
      setBreakdown([]);
    }
  }, [form.startDate, form.endDate]);

  const handleBreakdownChange = (index, type) => {
    const updated = [...breakdown];
    updated[index].type = type;
    setBreakdown(updated);
  };

  const totalDays = breakdown.reduce((sum, day) => {
    if (day.type === "Full Day") return sum + 1;
    if (day.type === "First Half" || day.type === "Second Half") return sum + 0.5;
    return sum;
  }, 0);

  const selectedPolicy = policies.find(p => p._id === form.policyId);
  const selectedBalance = balances.find(b => b.policyName === selectedPolicy?.name);
  
  const availableBalance = selectedBalance ? selectedBalance.remaining : 0;
  const balanceAfter = availableBalance - totalDays;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.policyId) return toast.error("Select a leave policy");
    if (!form.startDate || !form.endDate) return toast.error("Select dates");
    if (totalDays <= 0) return toast.error("Total leave days must be greater than 0");
    if (balanceAfter < 0) return toast.error("Insufficient leave balance!");

    // Validate Prior Notice
    if (selectedPolicy?.settings?.priorNoticeDays > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const start = new Date(form.startDate);
      const diffTime = start.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < selectedPolicy.settings.priorNoticeDays) {
        return toast.error(`This policy requires at least ${selectedPolicy.settings.priorNoticeDays} days prior notice.`);
      }
    }

    try {
      await axios.post("/leaves/apply", {
        policyId: form.policyId,
        startDate: form.startDate,
        endDate: form.endDate,
        totalDays,
        breakdown: breakdown.map(b => ({ date: b.date, type: b.type })),
        reason: form.reason
      }, { withCredentials: true });
      
      toast.success("Leave application submitted");
      setForm({ policyId: "", startDate: "", endDate: "", reason: "", teamEmail: "" });
      setBreakdown([]);
      fetchPoliciesAndBalances(); // refresh balance
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen bg-gray-50">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Apply Leave</h2>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Form */}
        <div className="flex-1 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <label className="text-gray-700 font-medium md:col-span-1">Leave type <span className="text-red-500">*</span></label>
              <select
                value={form.policyId}
                onChange={(e) => setForm({ ...form, policyId: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-md bg-gray-50 md:col-span-3 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Leave Policy</option>
                {policies.map((p) => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
              <label className="text-gray-700 font-medium md:col-span-1 pt-3">Date <span className="text-red-500">*</span></label>
              <div className="md:col-span-3">
                <div className="flex gap-4 mb-4">
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                {breakdown.length > 0 && (
                  <div className="border border-gray-200 rounded-md divide-y divide-gray-100">
                    <div className="max-h-64 overflow-y-auto">
                      {breakdown.map((day, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 hover:bg-gray-50">
                          <span className="text-sm text-gray-700 w-1/2">
                            {day.dateObj.toLocaleDateString('default', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                          <select
                            value={day.type}
                            onChange={(e) => handleBreakdownChange(idx, e.target.value)}
                            className="p-1.5 text-sm border border-gray-300 rounded w-1/2 bg-white"
                          >
                            <option value="Full Day">Full Day</option>
                            <option value="First Half">First Half</option>
                            <option value="Second Half">Second Half</option>
                          </select>
                        </div>
                      ))}
                    </div>
                    <div className="bg-gray-100 p-3 flex justify-between font-semibold text-gray-800">
                      <span>Total</span>
                      <span>{totalDays} Day(s)</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <label className="text-gray-700 font-medium md:col-span-1">Team Email ID</label>
              <input
                type="text"
                placeholder="e.g. team@company.com"
                value={form.teamEmail}
                onChange={(e) => setForm({ ...form, teamEmail: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-md md:col-span-3 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
              <label className="text-gray-700 font-medium md:col-span-1 pt-2">Reason for leave</label>
              <textarea
                rows={3}
                placeholder="Reason"
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded-md md:col-span-3 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
              <button type="button" onClick={() => navigate('/employee/leaves')} className="px-6 py-2.5 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50">Cancel</button>
              <button
                type="submit"
                disabled={balanceAfter < 0}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 disabled:bg-indigo-400"
              >
                Submit
              </button>
            </div>
          </form>
        </div>

        {/* Right Sidebar (Balance Tracker) */}
        <div className="w-full lg:w-80 space-y-6">
          <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8.5 13.5v-7A1.5 1.5 0 0110 5a1.5 1.5 0 011.5 1.5v7a1.5 1.5 0 01-3 0z" /></svg>
            </div>
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-800 text-lg">Balance</h3>
                <span className="text-sm font-medium text-gray-500">Day(s)</span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Available balance</span>
                  <span className="font-bold text-green-600 text-lg">{availableBalance}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Current booking</span>
                  <span className="font-bold text-gray-800 text-lg">{totalDays}</span>
                </div>
                <div className="w-full h-px bg-blue-200"></div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-800 font-semibold">Balance after current booking</span>
                  <span className={`font-bold text-lg ${balanceAfter < 0 ? 'text-red-500' : 'text-blue-700'}`}>
                    {balanceAfter}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyLeave;
