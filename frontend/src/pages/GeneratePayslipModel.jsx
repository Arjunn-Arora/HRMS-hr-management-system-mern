import React, { useState } from "react";
import { FaPrint } from "react-icons/fa";

const GeneratePayslipModal = ({ employeeData, onClose }) => {
  const [month, setMonth] = useState("");

  const handlePrint = () => {
    // You can use jsPDF or html2pdf here for PDF download
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Generate Payslip</h2>
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-full mb-4 border p-2 rounded"
        >
          <option value="">Select Month</option>
          {["January", "February", "March", "April", "May", "June"].map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>

        {month && (
          <div className="text-sm text-gray-700 space-y-1">
            <p><strong>Employee:</strong> {employeeData.name}</p>
            <p><strong>Month:</strong> {month}</p>
            <p><strong>Basic:</strong> ₹{employeeData.basic}</p>
            <p><strong>HRA:</strong> ₹{employeeData.hra}</p>
            <p><strong>Allowances:</strong> ₹{employeeData.allowances}</p>
            <p><strong>Deductions:</strong> ₹{employeeData.deductions}</p>
            <p className="mt-2 font-semibold text-lg">
              Net Salary: ₹{employeeData.basic + employeeData.hra + employeeData.allowances - employeeData.deductions}
            </p>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded">Close</button>
          <button onClick={handlePrint} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center gap-2">
            <FaPrint /> Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneratePayslipModal;
