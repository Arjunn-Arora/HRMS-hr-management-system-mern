import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { FaFileInvoiceDollar, FaPlus, FaDownload, FaMoneyCheckAlt, FaHistory, FaChartPie } from "react-icons/fa";
import { toast } from "react-toastify";

const PayrollDashboard = () => {
  const [summary, setSummary] = useState({ totalPaid: 0, employeeCount: 0 });
  const [payrolls, setPayrolls] = useState([]);

  useEffect(() => {
    fetchPayrollData();
  }, []);

  const fetchPayrollData = async () => {
    try {
      const res = await axios.get("/payroll/summary", { withCredentials: true });
      const history = await axios.get("/payroll/history", { withCredentials: true });
      setSummary(res.data);
      setPayrolls(history.data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Payroll Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <SummaryCard icon={<FaMoneyCheckAlt />} title="Total Paid" value={`₹${summary.totalPaid}`} />
        <SummaryCard icon={<FaChartPie />} title="Employees Paid" value={summary.employeeCount} />
        <SummaryCard icon={<FaFileInvoiceDollar />} title="This Month" value={`₹${summary.monthlyTotal || 0}`} />
        <SummaryCard icon={<FaHistory />} title="Last Run" value={summary.lastPayrollDate || "N/A"} />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4 mb-6">
        <button className="bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-700 flex items-center gap-2">
          <FaPlus /> Add Salary Structure
        </button>
        <button className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 flex items-center gap-2">
          <FaDownload /> Export Payroll
        </button>
      </div>

      {/* Payroll Table */}
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Employee</th>
              <th className="p-3 text-left">Month</th>
              <th className="p-3 text-left">Net Salary</th>
              <th className="p-3 text-left">Deductions</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Payslip</th>
            </tr>
          </thead>
          <tbody>
            {payrolls.length === 0 ? (
              <tr><td colSpan="6" className="p-5 text-center text-gray-500">No payroll records available</td></tr>
            ) : (
              payrolls.map((entry) => (
                <tr key={entry._id} className="hover:bg-gray-50">
                  <td className="p-3">{entry.employeeName}</td>
                  <td className="p-3">{entry.month}</td>
                  <td className="p-3">₹{entry.netSalary}</td>
                  <td className="p-3">₹{entry.deductions || 0}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-white text-xs ${
                      entry.status === "Paid" ? "bg-green-500" : "bg-yellow-500"
                    }`}>
                      {entry.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <a
                      href={entry.payslipUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Payslip
                    </a>
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

const SummaryCard = ({ icon, title, value }) => (
  <div className="bg-white shadow rounded-lg p-5 flex items-center gap-4">
    <div className="text-indigo-600 text-3xl">{icon}</div>
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  </div>
);

export default PayrollDashboard;
