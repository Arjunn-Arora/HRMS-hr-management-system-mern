import React, { useState, useEffect } from "react";
import axios from "../utils/axiosInstance";
import { FaCheckCircle, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

const GeneratePayrollModal = ({ onClose, onSuccess }) => {
  const [employees, setEmployees] = useState([]);
  const [structures, setStructures] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [structure, setStructure] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEmployeesAndStructures();
  }, []);

  const fetchEmployeesAndStructures = async () => {
    try {
      const [empRes, strRes] = await Promise.all([
        axios.get("/hr/employees", { withCredentials: true }),
        axios.get("/payroll/structures", { withCredentials: true }),
      ]);
      setEmployees(empRes.data);
      setStructures(strRes.data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
  const match = structures.find(s => {
    const id = typeof s.employeeId === "object" ? s.employeeId._id : s.employeeId;
    console.log(id);
    return id === selectedEmployee;
  });
  setStructure(match || null);
}, [selectedEmployee, structures]);

  const handleGenerate = async () => {
    if (!selectedEmployee || !month || !year || !structure) {
      return toast.error("Please select all fields and ensure structure exists.");
    }

    try {
      setLoading(true);
      await axios.post("/payroll/generate", {
        employee: selectedEmployee,
        month,
        year
      }, { withCredentials: true });

      toast.success("Payroll generated");
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const gross =
  (structure?.baseSalary || 0) +
  (structure?.hra || 0) +
  (structure?.allowances || 0);
const net = gross - (structure?.deductions || 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Generate Payroll</h2>

        {/* Select Employee */}
        <select
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
          className="w-full border p-2 mb-4 rounded"
        >
          <option value="">Select Employee</option>
          {employees.map((e) => (
            <option key={e._id} value={e._id}>{e.name}</option>
          ))}
        </select>

        {/* Month & Year */}
        <div className="flex gap-3 mb-4">
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="flex-1 border p-2 rounded"
          >
            <option value="">Month</option>
            {[
              "January", "February", "March", "April", "May", "June",
              "July", "August", "September", "October", "November", "December"
            ].map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-32 border p-2 rounded"
            placeholder="Year"
          />
        </div>

        {/* Salary Breakdown */}
        {structure ? (
          <div className="bg-gray-50 border rounded p-4 text-sm text-gray-800 mb-4 space-y-1">
            <p><strong>Basic:</strong> ₹{structure.baseSalary}</p>
            <p><strong>HRA:</strong> ₹{structure.hra}</p>
            <p><strong>Allowances:</strong> ₹{structure.allowances}</p>
            <p><strong>Deductions:</strong> ₹{structure.deductions}</p>
            <hr />
            <p><strong>Gross Salary:</strong> ₹{gross}</p>
            <p className="font-semibold text-lg text-green-700">Net Pay: ₹{net}</p>
          </div>
        ) : (
          selectedEmployee && <p className="text-red-600 text-sm mb-4">No structure found for this employee</p>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center gap-2"
          >
            <FaTimes /> Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center gap-2"
          >
            <FaCheckCircle /> {loading ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneratePayrollModal;
