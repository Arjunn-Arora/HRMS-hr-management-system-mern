// ✅ src/pages/AllocatedProjects.jsx
import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import { toast } from 'react-toastify';

const AllocatedProjects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('/teamlead/projects', { withCredentials: true });
        setProjects(res.data);
      } catch (err) {
        toast.error("Failed to fetch projects");
        console.error(err);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Allocated Projects</h2>
      <table className="w-full border rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Project Name</th>
            <th className="p-2 border">Start Date</th>
            <th className="p-2 border">Deadline</th>
            <th className="p-2 border">Team Size</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((proj) => (
            <tr key={proj._id}>
              <td className="p-2 border">{proj.name}</td>
              <td className="p-2 border">{new Date(proj.startDate).toLocaleDateString()}</td>
              <td className="p-2 border">{new Date(proj.deadline).toLocaleDateString()}</td>
              <td className="p-2 border">{proj.employees.length}</td>
              <td className="p-2 border">
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  onClick={() => window.location.href = `/teamlead/assign/${proj._id}`}
                >
                  Assign Employees
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllocatedProjects;
