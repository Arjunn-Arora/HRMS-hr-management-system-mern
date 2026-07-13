import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { FaCogs, FaPlus, FaUsers, FaCheck } from "react-icons/fa";

const HRManageAppraisals = () => {
  const [cycles, setCycles] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showCycleModal, setShowCycleModal] = useState(false);
  const [newCycle, setNewCycle] = useState({ name: '', description: '', startDate: '', endDate: '' });

  const [selectedCycleId, setSelectedCycleId] = useState('');
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    fetchCycles();
    fetchEmployees();
  }, []);

  const fetchCycles = async () => {
    try {
      const res = await axios.get("/performance/cycles", { withCredentials: true });
      setCycles(res.data);
    } catch (err) {
      toast.error("Failed to load appraisal cycles");
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("/hr/employees", { withCredentials: true });
      setEmployees(res.data.users || res.data || []);
    } catch (err) {
      toast.error("Failed to load employees");
    }
  };

  const handleCreateCycle = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/performance/cycles", { ...newCycle, status: 'Active' }, { withCredentials: true });
      toast.success("Appraisal Cycle Created!");
      setShowCycleModal(false);
      setNewCycle({ name: '', description: '', startDate: '', endDate: '' });
      fetchCycles();
    } catch (err) {
      toast.error("Failed to create cycle");
    }
  };

  const handleAssignRowChange = (index, field, value) => {
    const updated = [...assignments];
    updated[index][field] = value;
    setAssignments(updated);
  };

  const addAssignmentRow = () => {
    setAssignments([...assignments, { employeeId: '', peerReviewerId: '', managerId: '' }]);
  };

  const submitAssignments = async () => {
    if (!selectedCycleId) return toast.error("Select a cycle first");
    const validAssignments = assignments.filter(a => a.employeeId);
    if (validAssignments.length === 0) return toast.error("Add at least one employee assignment");
    
    try {
      await axios.post("/performance/assign", { cycleId: selectedCycleId, assignments: validAssignments }, { withCredentials: true });
      toast.success("Appraisals assigned successfully!");
      setAssignments([]);
    } catch (err) {
      toast.error("Failed to assign appraisals");
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <FaCogs className="text-4xl text-indigo-600" />
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">Appraisal Cycles</h1>
            <p className="text-gray-500">Manage performance review cycles and assignments</p>
          </div>
        </div>
        <button
          onClick={() => setShowCycleModal(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition shadow-sm"
        >
          <FaPlus /> New Cycle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Active Cycles</h2>
          {cycles.length === 0 ? (
            <div className="bg-white p-6 rounded-xl border border-gray-100 text-center text-gray-500 shadow-sm">No cycles found</div>
          ) : (
            cycles.map(cycle => (
              <div 
                key={cycle._id} 
                onClick={() => setSelectedCycleId(cycle._id)}
                className={`p-5 rounded-xl border cursor-pointer transition ${selectedCycleId === cycle._id ? 'bg-indigo-50 border-indigo-300 shadow-md' : 'bg-white border-gray-100 shadow-sm hover:border-indigo-200'}`}
              >
                <div className="font-bold text-gray-800 text-lg">{cycle.name}</div>
                <div className="text-xs text-gray-500 mb-2">{cycle.description}</div>
                <div className="text-sm font-medium text-indigo-600 flex justify-between">
                  <span>{new Date(cycle.startDate).toLocaleDateString()}</span>
                  <span>to {new Date(cycle.endDate).toLocaleDateString()}</span>
                </div>
                <div className="mt-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${cycle.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                    {cycle.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="md:col-span-2">
          {selectedCycleId ? (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FaUsers className="text-indigo-500" /> Assign Appraisers
              </h2>
              
              <div className="space-y-4">
                {assignments.map((assign, idx) => (
                  <div key={idx} className="flex gap-4 items-end bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Employee (Self Review)</label>
                      <select value={assign.employeeId} onChange={e => handleAssignRowChange(idx, 'employeeId', e.target.value)} className="w-full p-2 border rounded bg-white">
                        <option value="">Select Employee</option>
                        {employees.map(emp => <option key={emp._id} value={emp._id}>{emp.name}</option>)}
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Peer Reviewer (Optional)</label>
                      <select value={assign.peerReviewerId} onChange={e => handleAssignRowChange(idx, 'peerReviewerId', e.target.value)} className="w-full p-2 border rounded bg-white">
                        <option value="">Select Peer</option>
                        {employees.map(emp => <option key={emp._id} value={emp._id}>{emp.name}</option>)}
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Manager (Optional)</label>
                      <select value={assign.managerId} onChange={e => handleAssignRowChange(idx, 'managerId', e.target.value)} className="w-full p-2 border rounded bg-white">
                        <option value="">Select Manager</option>
                        {employees.map(emp => <option key={emp._id} value={emp._id}>{emp.name}</option>)}
                      </select>
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                  <button onClick={addAssignmentRow} className="text-indigo-600 font-semibold text-sm hover:underline flex items-center gap-1">
                    <FaPlus /> Add Row
                  </button>
                  <button onClick={submitAssignments} className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 shadow-sm flex items-center gap-2">
                    <FaCheck /> Confirm Assignments
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-100 rounded-xl h-full flex items-center justify-center text-gray-400 font-medium">
              Select a cycle from the left to assign appraisers
            </div>
          )}
        </div>
      </div>

      {showCycleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">New Appraisal Cycle</h2>
            <form onSubmit={handleCreateCycle} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Cycle Name</label>
                <input required placeholder="e.g. Annual Review 2026" value={newCycle.name} onChange={e => setNewCycle({...newCycle, name: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 transition" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea rows="2" value={newCycle.description} onChange={e => setNewCycle({...newCycle, description: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 transition" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Start Date</label>
                  <input type="date" required value={newCycle.startDate} onChange={e => setNewCycle({...newCycle, startDate: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 transition" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">End Date</label>
                  <input type="date" required value={newCycle.endDate} onChange={e => setNewCycle({...newCycle, endDate: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 transition" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowCycleModal(false)} className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition shadow-sm">Save Cycle</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HRManageAppraisals;
