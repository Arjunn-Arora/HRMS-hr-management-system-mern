import React, { useState } from "react";
import { FaSave, FaTimes } from "react-icons/fa";

const SalaryStructureModal = ({ onClose, onSave, defaultValues = {} }) => {
  const [form, setForm] = useState({
    employee: defaultValues.employee || "",
    basic: defaultValues.basic || "",
    hra: defaultValues.hra || "",
    allowances: defaultValues.allowances || "",
    deductions: defaultValues.deductions || ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Add/Edit Salary Structure</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="employee" placeholder="Employee Name or ID"
            value={form.employee} onChange={handleChange}
            className="w-full p-2 border rounded" required
          />
          <input type="number" name="basic" placeholder="Basic Salary"
            value={form.basic} onChange={handleChange}
            className="w-full p-2 border rounded" required
          />
          <input type="number" name="hra" placeholder="HRA"
            value={form.hra} onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input type="number" name="allowances" placeholder="Other Allowances"
            value={form.allowances} onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input type="number" name="deductions" placeholder="Deductions"
            value={form.deductions} onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <div className="flex justify-end gap-4 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center gap-2">
              <FaTimes /> Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center gap-2">
              <FaSave /> Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SalaryStructureModal;
