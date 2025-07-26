import React from "react";

const PayslipTemplate = ({ data }) => {
  const {
    employeeName,
    employeeId,
    department,
    email,
    month,
    year,
    basic,
    hra,
    allowances,
    deductions,
    gross,
    netSalary,
  } = data;

  return (
    <div
      id="payslip-template"
      className="max-w-4xl mx-auto bg-white shadow-lg border border-gray-300 p-10 rounded-lg font-sans text-sm text-gray-800"
    >
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-6 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-indigo-700">Pay Slip</h1>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Month:</span> {month} {year}
          </p>
        </div>
        <img
          src="https://yourcompany.com/logo.png"
          alt="Company Logo"
          className="h-12 object-contain"
        />
      </div>

      {/* Employee Details */}
      <div className="mb-6">
        <h2 className="text-base font-semibold text-indigo-600 border-b pb-2 mb-4">
          Employee Information
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <p><strong>Name:</strong> {employeeName}</p>
          <p><strong>Employee ID:</strong> {employeeId}</p>
          <p><strong>Department:</strong> {department}</p>
          <p><strong>Email:</strong> {email}</p>
        </div>
      </div>

      {/* Earnings Table */}
      <div className="mb-6">
        <h2 className="text-base font-semibold text-indigo-600 border-b pb-2 mb-4">
          Earnings
        </h2>
        <table className="w-full text-left border border-gray-200">
          <thead className="bg-indigo-50">
            <tr>
              <th className="px-4 py-2 border-r border-gray-200">Component</th>
              <th className="px-4 py-2">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="px-4 py-2">Basic</td>
              <td className="px-4 py-2">{basic}</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-2">HRA</td>
              <td className="px-4 py-2">{hra}</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-2">Allowances</td>
              <td className="px-4 py-2">{allowances}</td>
            </tr>
            <tr className="bg-indigo-50 font-semibold">
              <td className="px-4 py-2">Gross Salary</td>
              <td className="px-4 py-2">{gross}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Deductions Table */}
      <div className="mb-6">
        <h2 className="text-base font-semibold text-indigo-600 border-b pb-2 mb-4">
          Deductions
        </h2>
        <table className="w-full text-left border border-gray-200">
          <thead className="bg-indigo-50">
            <tr>
              <th className="px-4 py-2 border-r border-gray-200">Component</th>
              <th className="px-4 py-2">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="px-4 py-2">Total Deductions</td>
              <td className="px-4 py-2">{deductions}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Net Pay Summary */}
      <div className="text-right text-xl font-bold text-green-700 mb-8">
        Net Pay: ₹{netSalary}
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-500 border-t pt-4">
        This is a system-generated payslip and does not require a signature.
      </div>
    </div>
  );
};

export default PayslipTemplate;
