import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/axiosInstance";
import { toast } from "react-toastify";

const AssignEmployeesToProject = () => {
  const { projectId } = useParams();
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  const [alreadyAssigned, setAlreadyAssigned] = useState([]);

useEffect(() => {
  const fetchAssignedEmployees = async () => {
    try {
      const res = await axios.get(`/teamlead/project/${projectId}`, {
        withCredentials: true
      });
      setAlreadyAssigned(res.data.assignedEmployeeIds);
    } catch (err) {
      toast.error(err.message);
    }
  };

  fetchAssignedEmployees();
}, [projectId]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await axios.get("/teamlead/members", { withCredentials: true });
        setTeamMembers(res.data);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const handleToggle = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    try {
      await axios.post(
        `/teamlead/assign/${projectId}`,
        { employeeIds: selectedIds },
        { withCredentials: true }
      );
      toast.success("Employees assigned to project!");
      setSelectedIds([]);
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Assign Employees to Project</h2>
      <table className="w-full border mb-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Department</th>
            <th className="border px-4 py-2">Select</th>
          </tr>
        </thead>
        <tbody>
          {teamMembers.map((member) => (
            <tr key={member._id}>
              <td className="border px-4 py-2">{member.name}</td>
              <td className="border px-4 py-2">{member.department}</td>
              <td className="border px-4 py-2 text-center">
  {alreadyAssigned.includes(member._id) ? (
    <span className="text-gray-500">Assigned</span>
  ) : (
    <input
      type="checkbox"
      checked={selectedIds.includes(member._id)}
      onChange={() => handleToggle(member._id)}
    />
  )}
</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
        onClick={handleSubmit}
        disabled={selectedIds.length === 0}
      >
        Assign Selected
      </button>
    </div>
  );
};

export default AssignEmployeesToProject;
