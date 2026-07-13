import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { FaGraduationCap, FaPlus, FaTrash } from "react-icons/fa";

const MySkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newSkill, setNewSkill] = useState({ name: '', proficiencyLevel: 'Beginner', yearsExperience: 0 });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await axios.get("/performance/skills/my", { withCredentials: true });
      setSkills(res.data.skills || []);
    } catch (err) {
      toast.error("Failed to load skills");
    } finally {
      setLoading(false);
    }
  };

  const saveSkills = async (updatedSkills) => {
    try {
      await axios.put("/performance/skills/my", { skills: updatedSkills }, { withCredentials: true });
      toast.success("Skills updated successfully");
      setSkills(updatedSkills);
      setNewSkill({ name: '', proficiencyLevel: 'Beginner', yearsExperience: 0 });
    } catch (err) {
      toast.error("Failed to update skills");
    }
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.name) return toast.error("Skill name is required");
    const updated = [...skills, newSkill];
    saveSkills(updated);
  };

  const handleRemoveSkill = (index) => {
    const updated = skills.filter((_, i) => i !== index);
    saveSkills(updated);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-screen bg-gray-50">
      <div className="flex items-center gap-3 mb-8">
        <FaGraduationCap className="text-4xl text-teal-600" />
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800">My Skill Set</h1>
          <p className="text-gray-500">Highlight your expertise and proficiencies</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Add Skill Form */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaPlus className="text-teal-500" /> Add New Skill
            </h2>
            <form onSubmit={handleAddSkill} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Skill Name</label>
                <input required placeholder="e.g. React.js, Project Management" value={newSkill.name} onChange={e => setNewSkill({...newSkill, name: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 transition" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Proficiency</label>
                <select value={newSkill.proficiencyLevel} onChange={e => setNewSkill({...newSkill, proficiencyLevel: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 transition">
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Expert</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Years of Experience</label>
                <input type="number" min="0" step="0.5" required value={newSkill.yearsExperience} onChange={e => setNewSkill({...newSkill, yearsExperience: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 transition" />
              </div>
              <button type="submit" className="w-full bg-teal-600 text-white font-semibold py-2.5 rounded-lg hover:bg-teal-700 transition">
                Save Skill
              </button>
            </form>
          </div>
        </div>

        {/* Skills List */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-600">Skill</th>
                  <th className="text-left p-4 font-semibold text-gray-600">Proficiency</th>
                  <th className="text-left p-4 font-semibold text-gray-600">Experience</th>
                  <th className="text-right p-4 font-semibold text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {skills.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-500">No skills added yet. Add your first skill!</td>
                  </tr>
                )}
                {skills.map((skill, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-bold text-gray-800">{skill.name}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        skill.proficiencyLevel === 'Expert' ? 'bg-purple-100 text-purple-700' :
                        skill.proficiencyLevel === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {skill.proficiencyLevel}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600 font-medium">{skill.yearsExperience} yrs</td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleRemoveSkill(index)} className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-lg transition">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MySkills;
