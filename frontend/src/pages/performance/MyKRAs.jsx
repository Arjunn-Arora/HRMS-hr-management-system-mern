import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { FaChartLine, FaPlus, FaEdit } from "react-icons/fa";

const MyKRAs = () => {
  const [kras, setKras] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', weightage: 0, achievedScore: 0, period: '', status: 'Active' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchKRAs();
  }, []);

  const fetchKRAs = async () => {
    try {
      const res = await axios.get("/performance/kras/my", { withCredentials: true });
      setKras(res.data);
    } catch (err) {
      toast.error("Failed to load KRAs");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/performance/kras/${editingId}`, formData, { withCredentials: true });
        toast.success("KRA updated!");
      } else {
        await axios.post("/performance/kras", formData, { withCredentials: true });
        toast.success("KRA created!");
      }
      setShowModal(false);
      fetchKRAs();
    } catch (err) {
      toast.error("Failed to save KRA");
    }
  };

  const handleEdit = (kra) => {
    setEditingId(kra._id);
    setFormData({
      title: kra.title,
      description: kra.description,
      weightage: kra.weightage,
      achievedScore: kra.achievedScore,
      period: kra.period,
      status: kra.status
    });
    setShowModal(true);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <FaChartLine className="text-4xl text-purple-600" />
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">My KRAs & KPIs</h1>
            <p className="text-gray-500">Key Result Areas and Performance Indicators</p>
          </div>
        </div>
        <button
          onClick={() => { setEditingId(null); setFormData({ title: '', description: '', weightage: 0, achievedScore: 0, period: '', status: 'Active' }); setShowModal(true); }}
          className="flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-purple-700 transition shadow-sm"
        >
          <FaPlus /> Add KRA
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left p-4 font-semibold text-gray-600">KRA Title</th>
              <th className="text-left p-4 font-semibold text-gray-600">Period</th>
              <th className="text-left p-4 font-semibold text-gray-600">Weightage</th>
              <th className="text-left p-4 font-semibold text-gray-600">Achieved Score</th>
              <th className="text-left p-4 font-semibold text-gray-600">Status</th>
              <th className="text-right p-4 font-semibold text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {kras.length === 0 && (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500">No KRAs found.</td>
              </tr>
            )}
            {kras.map(kra => (
              <tr key={kra._id} className="hover:bg-gray-50 transition">
                <td className="p-4">
                  <div className="font-bold text-gray-800">{kra.title}</div>
                  <div className="text-xs text-gray-500 max-w-xs truncate">{kra.description}</div>
                </td>
                <td className="p-4 text-gray-600 font-medium">{kra.period}</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md font-semibold text-sm">{kra.weightage}%</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${kra.achievedScore}%` }}></div>
                    </div>
                    <span className="text-xs font-bold text-gray-700">{kra.achievedScore}%</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${kra.status === 'Active' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                    {kra.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => handleEdit(kra)} className="text-indigo-600 hover:text-indigo-800 bg-indigo-50 p-2 rounded-lg transition">
                    <FaEdit />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">{editingId ? "Edit KRA" : "Add KRA"}</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea rows="2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Period (e.g. Q1-2026)</label>
                  <input required value={formData.period} onChange={e => setFormData({...formData, period: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition">
                    <option>Active</option>
                    <option>Completed</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Weightage (%)</label>
                  <input type="number" min="0" max="100" required value={formData.weightage} onChange={e => setFormData({...formData, weightage: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Achieved Score (%)</label>
                  <input type="number" min="0" max="100" required value={formData.achievedScore} onChange={e => setFormData({...formData, achievedScore: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition" />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition shadow-sm">Save KRA</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyKRAs;
