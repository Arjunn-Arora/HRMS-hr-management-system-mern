import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { toast } from "react-toastify";

const AssignProjects = () => {
  const [teamLeads, setTeamLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState("");
  const [projectName, setProjectName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await axios.get("/hr/team-leads", { withCredentials: true });
        setTeamLeads(res.data);
      } catch (err) {
        toast.error(err.message);
      }
    };
    fetchLeads();
  }, []);

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedLead || !projectName) return toast.error("All fields required");

    try {
      await axios.post(
        "/hr/assign-project",
        { teamLeadId: selectedLead, projectName },
        { withCredentials: true }
      );
      toast.success("Project assigned successfully");
      setProjectName("");
      setSelectedLead("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Assignment failed");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow p-6 rounded">
      <h2 className="text-xl font-semibold mb-4">Assign Project to Team Lead</h2>
      <form onSubmit={handleAssign} className="space-y-4">
        <select
          value={selectedLead}
          onChange={(e) => setSelectedLead(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Team Lead</option>
          {teamLeads.map((lead) => (
            <option key={lead._id} value={lead._id}>
              {lead.name}
            </option>
          ))}
        </select>

        <label htmlFor="start-date">Start Date: </label>
        <input type="date" name="start-date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /> <br />
        <label htmlFor="end-date">End Date: </label>
        <input type="date" name="end-date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />


        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Project Name"
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          Assign Project
        </button>
      </form>
    </div>
  );
};

export default AssignProjects;
