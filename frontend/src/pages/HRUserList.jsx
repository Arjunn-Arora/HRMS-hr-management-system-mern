// src/pages/HRUserList.jsx
import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaSearch, FaTimes } from "react-icons/fa";
import axios from "../utils/axiosInstance";
import { toast } from "react-toastify";

const roleColors = {
  "admin": "bg-purple-700 text-white",
  "employee": "bg-gray-200 text-gray-800",
  "hr": "bg-lime-300 text-black",
  "team_lead": "bg-yellow-500 text-white",
  "super_admin": "bg-pink-500 text-white"
};

const HRUserList = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [viewUser, setViewUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  
  const [editForm, setEditForm] = useState({
    name: "", email: "", department: "", designation: "", employmentType: "", employeeStatus: "",
    dateOfJoining: "", dob: "", gender: "", maritalStatus: "", pan: "", aadhar: "",
    presentAddress: "", permanentAddress: "", dateOfExit: ""
  });

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/hr/employees", { withCredentials: true });
      setUsers(res.data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // prevent row click
    const confirmed = window.confirm("Are you sure you want to delete this user from the entire system? This action cannot be undone.");
    if (confirmed) {
      try {
        await axios.delete(`/hr/employee/${id}`, { withCredentials: true });
        toast.success("User deleted successfully.");
        setUsers(users.filter(u => u._id !== id));
      } catch (err) {
        toast.error("Failed to delete user.");
      }
    }
  };

  const handleEditClick = (e, user) => {
    e.stopPropagation(); // prevent row click
    setEditUser(user);
    
    const formatDate = (d) => d ? new Date(d).toISOString().split('T')[0] : "";
    
    setEditForm({
      name: user.name || "",
      email: user.email || "",
      department: user.department || "",
      designation: user.designation || "",
      employmentType: user.employmentType || "",
      employeeStatus: user.employeeStatus || "",
      dateOfJoining: formatDate(user.dateOfJoining),
      dob: formatDate(user.dob),
      gender: user.gender || "",
      maritalStatus: user.maritalStatus || "",
      pan: user.pan || "",
      aadhar: user.aadhar || "",
      presentAddress: user.presentAddress || "",
      permanentAddress: user.permanentAddress || "",
      dateOfExit: formatDate(user.dateOfExit)
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/hr/employee/${editUser._id}`, editForm, { withCredentials: true });
      toast.success("User updated successfully");
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      toast.error("Failed to update user.");
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">User List</h1>

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-sm">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search something..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="bg-white shadow rounded-xl overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase text-left">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Created Date</th>
              <th className="p-4">Role</th>
              <th className="p-4">Department</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td className="p-4 text-center text-gray-500" colSpan="5">
                  No records found.
                </td>
              </tr>
            ) : (
              filtered.map((user, i) => (
                <tr key={i} onClick={() => setViewUser(user)} className="border-t hover:bg-gray-50 cursor-pointer">
                  <td className="flex items-center gap-4 p-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-gray-500 text-sm">{user.email}</div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-700">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span className={`text-xs px-3 py-1 rounded-full capitalize font-medium ${roleColors[user.role] || "bg-gray-300"}`}>
                      {user.role.replace("_", " ")}
                    </span>
                  </td>
                  <td className="p-4 text-gray-700">{user.department || "—"}</td>
                  <td className="p-4 flex items-center gap-3">
                    <button onClick={(e) => handleEditClick(e, user)} className="text-indigo-600 hover:text-indigo-800 p-2 border rounded shadow-sm hover:bg-gray-100 bg-white">
                      <FaEdit />
                    </button>
                    <button onClick={(e) => handleDelete(e, user._id)} className="text-red-500 hover:text-red-700 p-2 border rounded shadow-sm hover:bg-gray-100 bg-white">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* VIEW MODAL */}
      {viewUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 m-4">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">Employee Details</h2>
              <button onClick={() => setViewUser(null)} className="text-gray-500 hover:text-gray-800">
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="font-semibold text-gray-600">Name:</span> {viewUser.name}</div>
              <div><span className="font-semibold text-gray-600">Email:</span> {viewUser.email}</div>
              <div><span className="font-semibold text-gray-600">Role:</span> <span className="capitalize">{viewUser.role.replace("_", " ")}</span></div>
              <div><span className="font-semibold text-gray-600">Department:</span> {viewUser.department || "N/A"}</div>
              <div><span className="font-semibold text-gray-600">Designation:</span> {viewUser.designation || "N/A"}</div>
              <div><span className="font-semibold text-gray-600">Employment Type:</span> {viewUser.employmentType || "N/A"}</div>
              <div><span className="font-semibold text-gray-600">Status:</span> {viewUser.employeeStatus || "N/A"}</div>
              <div><span className="font-semibold text-gray-600">Gender:</span> {viewUser.gender || "N/A"}</div>
              <div><span className="font-semibold text-gray-600">Date of Joining:</span> {viewUser.dateOfJoining ? new Date(viewUser.dateOfJoining).toLocaleDateString() : "N/A"}</div>
              <div><span className="font-semibold text-gray-600">Date of Birth:</span> {viewUser.dob ? new Date(viewUser.dob).toLocaleDateString() : "N/A"}</div>
              <div><span className="font-semibold text-gray-600">Phone:</span> {viewUser.phone || "N/A"}</div>
              <div><span className="font-semibold text-gray-600">Marital Status:</span> {viewUser.maritalStatus || "N/A"}</div>
              <div><span className="font-semibold text-gray-600">PAN:</span> {viewUser.pan || "N/A"}</div>
              <div><span className="font-semibold text-gray-600">Aadhar:</span> {viewUser.aadhar || "N/A"}</div>
              <div className="col-span-2"><span className="font-semibold text-gray-600">Reporting Manager:</span> {viewUser.teamLeadId ? "Assigned (ID: "+viewUser.teamLeadId+")" : "N/A"}</div>
              <div className="col-span-2"><span className="font-semibold text-gray-600">Present Address:</span> {viewUser.presentAddress || "N/A"}</div>
              <div className="col-span-2"><span className="font-semibold text-gray-600">Permanent Address:</span> {viewUser.permanentAddress || "N/A"}</div>
              {viewUser.dateOfExit && <div className="col-span-2 text-red-600"><span className="font-semibold">Date of Exit:</span> {new Date(viewUser.dateOfExit).toLocaleDateString()}</div>}
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 m-4 relative">
            <div className="flex justify-between items-center border-b pb-3 mb-4 sticky top-0 bg-white">
              <h2 className="text-2xl font-semibold text-gray-800">Edit Employee</h2>
              <button onClick={() => setEditUser(null)} className="text-gray-500 hover:text-gray-800">
                <FaTimes size={20} />
              </button>
            </div>
            
            <form onSubmit={submitEdit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="name" value={editForm.name} onChange={handleEditChange} placeholder="Name" className="p-2 border rounded" required />
                <input type="email" name="email" value={editForm.email} onChange={handleEditChange} placeholder="Email" className="p-2 border rounded" required />
                <input type="text" name="department" value={editForm.department} onChange={handleEditChange} placeholder="Department" className="p-2 border rounded" />
                <input type="text" name="designation" value={editForm.designation} onChange={handleEditChange} placeholder="Designation" className="p-2 border rounded" />
                
                <select name="employmentType" value={editForm.employmentType} onChange={handleEditChange} className="p-2 border rounded">
                  <option value="">-- Employment Type --</option>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>

                <select name="employeeStatus" value={editForm.employeeStatus} onChange={handleEditChange} className="p-2 border rounded">
                  <option value="">-- Employee Status --</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Terminated">Terminated</option>
                  <option value="Resigned">Resigned</option>
                  <option value="Deceased">Deceased</option>
                </select>

                <div className="flex flex-col"><label className="text-xs text-gray-500">Date of Joining</label><input type="date" name="dateOfJoining" value={editForm.dateOfJoining} onChange={handleEditChange} className="p-2 border rounded" /></div>
                <div className="flex flex-col"><label className="text-xs text-gray-500">Date of Birth</label><input type="date" name="dob" value={editForm.dob} onChange={handleEditChange} className="p-2 border rounded" /></div>
                
                <select name="gender" value={editForm.gender} onChange={handleEditChange} className="p-2 border rounded">
                  <option value="">-- Gender --</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>

                <select name="maritalStatus" value={editForm.maritalStatus} onChange={handleEditChange} className="p-2 border rounded">
                  <option value="">-- Marital Status --</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>

                <input type="text" name="pan" value={editForm.pan} onChange={handleEditChange} placeholder="PAN" className="p-2 border rounded" />
                <input type="text" name="aadhar" value={editForm.aadhar} onChange={handleEditChange} placeholder="Aadhar" className="p-2 border rounded" />
                
                <textarea name="presentAddress" value={editForm.presentAddress} onChange={handleEditChange} placeholder="Present Address" className="p-2 border rounded col-span-1 md:col-span-2" rows="2" />
                <textarea name="permanentAddress" value={editForm.permanentAddress} onChange={handleEditChange} placeholder="Permanent Address" className="p-2 border rounded col-span-1 md:col-span-2" rows="2" />
                
                <div className="flex flex-col col-span-1 md:col-span-2"><label className="text-xs text-gray-500">Date of Exit</label><input type="date" name="dateOfExit" value={editForm.dateOfExit} onChange={handleEditChange} className="p-2 border rounded" /></div>
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-4 border-t sticky bottom-0 bg-white">
                <button type="button" onClick={() => setEditUser(null)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HRUserList;
