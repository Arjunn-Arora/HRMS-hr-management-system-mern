import React, { useState, useEffect } from "react";
import axios from "../utils/axiosInstance";
import { toast } from "react-toastify";

const CreateEmployee = () => {
  const [form, setForm] = useState({
    name: "", email: "", role: "employee", department: "", teamLeadId: "",
    designation: "", employmentType: "Full-Time", employeeStatus: "Active",
    dateOfJoining: "", dob: "", gender: "", maritalStatus: "", pan: "", aadhar: "",
    presentAddress: "", permanentAddress: "", dateOfExit: ""
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
      setForm({
        name: "", email: "", role: "employee", department: "", teamLeadId: "",
        designation: "", employmentType: "Full-Time", employeeStatus: "Active",
        dateOfJoining: "", dob: "", gender: "", maritalStatus: "", pan: "", aadhar: "",
        presentAddress: "", permanentAddress: "", dateOfExit: ""
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-6 shadow rounded">
      <h2 className="text-2xl font-semibold mb-6">Create New User</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Full Name" className="w-full p-2 border rounded" />
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded" />
          
          <select name="role" value={form.role} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="employee">Employee</option>
            <option value="team_lead">Team Lead</option>
          </select>

          <input type="text" name="department" value={form.department} onChange={handleChange} placeholder="Department" className="w-full p-2 border rounded" />
          
          {form.role === "employee" && (
            <select name="teamLeadId" value={form.teamLeadId} onChange={handleChange} className="w-full p-2 border rounded">
              <option value="">-- Select Team Lead --</option>
              {teamLeads.map((lead) => (
                <option key={lead._id} value={lead._id}>{lead.name} ({lead.department})</option>
              ))}
            </select>
          )}

          <input type="text" name="designation" value={form.designation} onChange={handleChange} placeholder="Designation" className="w-full p-2 border rounded" />
          
          <select name="employmentType" value={form.employmentType} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>

          <select name="employeeStatus" value={form.employeeStatus} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Terminated">Terminated</option>
            <option value="Resigned">Resigned</option>
            <option value="Deceased">Deceased</option>
          </select>

          <input type="date" name="dateOfJoining" value={form.dateOfJoining} onChange={handleChange} className="w-full p-2 border rounded" title="Date of Joining" />
          <input type="date" name="dob" value={form.dob} onChange={handleChange} className="w-full p-2 border rounded" title="Date of Birth" />
          
          <select name="gender" value={form.gender} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="">-- Select Gender --</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <select name="maritalStatus" value={form.maritalStatus} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="">-- Select Marital Status --</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
          </select>

          <input type="text" name="pan" value={form.pan} onChange={handleChange} placeholder="PAN Number" className="w-full p-2 border rounded" />
          <input type="text" name="aadhar" value={form.aadhar} onChange={handleChange} placeholder="Aadhar Number" className="w-full p-2 border rounded" />
          
          <textarea name="presentAddress" value={form.presentAddress} onChange={handleChange} placeholder="Present Address" className="w-full p-2 border rounded" rows="2" />
          <textarea name="permanentAddress" value={form.permanentAddress} onChange={handleChange} placeholder="Permanent Address" className="w-full p-2 border rounded" rows="2" />
          
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Date of Exit (Optional)</label>
            <input type="date" name="dateOfExit" value={form.dateOfExit} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white p-3 rounded hover:bg-indigo-700 font-semibold">
          {loading ? "Creating..." : "Create Employee"}
        </button>
      </form>
    </div>
  );
};

export default CreateEmployee;
