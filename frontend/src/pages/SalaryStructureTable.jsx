// src/components/SalaryStructureTable.jsx
import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

const SalaryStructureTable = ({ onEdit }) => {
  const [structures, setStructures] = useState([]);

  useEffect(() => {
    fetchStructures();
  }, []);

  const fetchStructures = async () => {
    try {
      const res = await axios.get("/payroll/structures", { withCredentials: true });
      setStructures(res.data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this structure?")) return;
    try {
      await axios.delete(`/payroll/structure/${id}`, { withCredentials: true });
      toast.success("Structure deleted");
      fetchStructures();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow rounded">
        <thead className="bg-gray-100 text-sm">
          <tr>
            <th className="p-3 text-left">Employee</th>
            <th className="p-3 text-left">Basic</th>
            <th className="p-3 text-left">HRA</th>
            <th className="p-3 text-left">Allowances</th>
            <th className="p-3 text-left">Deductions</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {structures.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-6 text-gray-500">No structures found</td>
            </tr>
          ) : (
            structures.map((s) => (
              <tr key={s._id} className="hover:bg-gray-50 border-t">
                <td className="p-3">{s.employeeId?.name}</td>
                <td className="p-3">₹{s.baseSalary}</td>
                <td className="p-3">₹{s.hra}</td>
                <td className="p-3">₹{s.allowances}</td>
                <td className="p-3 text-red-600">₹{s.deductions}</td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => onEdit(s)} className="text-indigo-600 hover:text-indigo-800"><FaEdit /></button>
                  <button onClick={() => handleDelete(s._id)} className="text-red-500 hover:text-red-700"><FaTrash /></button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SalaryStructureTable;
