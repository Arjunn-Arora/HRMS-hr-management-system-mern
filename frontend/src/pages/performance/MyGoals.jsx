import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { FaBullseye, FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const MyGoals = () => {
  const [goals, setGoals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', priority: 'Medium', progress: 0, status: 'Not Started' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const res = await axios.get("/performance/goals/my", { withCredentials: true });
      setGoals(res.data);
    } catch (err) {
      toast.error("Failed to load goals");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/performance/goals/${editingId}`, formData, { withCredentials: true });
        toast.success("Goal updated!");
      } else {
        await axios.post("/performance/goals", formData, { withCredentials: true });
        toast.success("Goal created!");
      }
      setShowModal(false);
      fetchGoals();
    } catch (err) {
      toast.error("Failed to save goal");
    }
  };

  const handleEdit = (goal) => {
    setEditingId(goal._id);
    setFormData({
      title: goal.title,
      description: goal.description,
      priority: goal.priority,
      progress: goal.progress,
      status: goal.status
    });
    setShowModal(true);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <FaBullseye className="text-4xl text-indigo-600" />
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">My Goals</h1>
            <p className="text-gray-500">Track your objectives and results</p>
          </div>
        </div>
        <button
          onClick={() => { setEditingId(null); setFormData({ title: '', description: '', priority: 'Medium', progress: 0, status: 'Not Started' }); setShowModal(true); }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition shadow-sm"
        >
          <FaPlus /> Add Goal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map(goal => (
          <div key={goal._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-lg text-gray-800">{goal.title}</h3>
              <button onClick={() => handleEdit(goal)} className="text-gray-400 hover:text-indigo-600 transition">
                <FaEdit size={18} />
              </button>
            </div>
            <p className="text-gray-600 text-sm mb-6 line-clamp-3">{goal.description}</p>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-gray-700">Progress</span>
                  <span className="font-bold text-indigo-600">{goal.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${goal.progress}%` }}></div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  goal.priority === 'High' ? 'bg-red-100 text-red-700' :
                  goal.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {goal.priority} Priority
                </span>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {goal.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">{editingId ? "Edit Goal" : "Create New Goal"}</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Priority</label>
                  <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
                    <option>Not Started</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                    <option>Deferred</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Progress ({formData.progress}%)</label>
                <input type="range" min="0" max="100" value={formData.progress} onChange={e => setFormData({...formData, progress: e.target.value})} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition shadow-sm">Save Goal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyGoals;
