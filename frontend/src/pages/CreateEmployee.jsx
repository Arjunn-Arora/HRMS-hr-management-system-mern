import React, { useState, useEffect } from "react";
import axios from "../utils/axiosInstance";
import { toast } from "react-toastify";

const CreateEmployee = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "employee",
    department: "",
    teamLeadId: ""
  });

  const [loading, setLoading] = useState(false);
  const [teamLeads, setTeamLeads] = useState([]);

  useEffect(() => {
    const fetchTeamLeads = async () => {
      try {
        const res = await axios.get("/hr/team-leads", { withCredentials: true });
        setTeamLeads(res.data); // Assume backend sends an array of team lead users
      } catch (err) {
        toast.error(err.message);
      }
    };

    fetchTeamLeads();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, role, department, teamLeadId } = form;
    if (!name || !email || !role || !department) return toast.error("All fields are required");

    if (role === "employee" && !teamLeadId) {
      return toast.error("Please assign a team lead for this employee.");
    }

    try {
      setLoading(true);
      await axios.post("/hr/create-employee", form, { withCredentials: true });
      toast.success("User created and email sent!");
      setForm({ name: "", email: "", role: "employee", department: "", teamLeadId: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 shadow rounded">
      <h2 className="text-2xl font-semibold mb-4">Create New User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-2 border rounded"
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="employee">Employee</option>
          <option value="team_lead">Team Lead</option>
        </select>

        <input
          type="text"
          name="department"
          value={form.department}
          onChange={handleChange}
          placeholder="Department (optional)"
          className="w-full p-2 border rounded"
        />

        {form.role === "employee" && (
          <select
            name="teamLeadId"
            value={form.teamLeadId}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">-- Select Team Lead --</option>
            {teamLeads.map((lead) => (
              <option key={lead._id} value={lead._id}>
                {lead.name} ({lead.department})
              </option>
            ))}
          </select>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700"
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
};

export default CreateEmployee;
