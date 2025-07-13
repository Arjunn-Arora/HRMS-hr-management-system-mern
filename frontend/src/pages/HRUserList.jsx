// src/pages/HRUserList.jsx
import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
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

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">User List</h1>

      {/* Search */}
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

      {/* Table */}
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
                <tr key={i} className="border-t hover:bg-gray-50">
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
                    <button className="text-indigo-600 hover:text-indigo-800">
                      <FaEdit />
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HRUserList;
