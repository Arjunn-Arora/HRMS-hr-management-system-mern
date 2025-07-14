import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import {
  FaFileInvoiceDollar,
  FaPlus,
  FaDownload,
  FaMoneyCheckAlt,
  FaHistory,
  FaChartPie
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const PayrollDashboard = () => {
  const [summary, setSummary] = useState({ totalPaid: 0, employeeCount: 0 });
  const [payrolls, setPayrolls] = useState([]);
  const [monthFilter, setMonthFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

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

  const filteredPayrolls = payrolls.filter(entry => {
    const matchesMonth = monthFilter ? entry.month.includes(monthFilter) : true;
    const matchesSearch = entry.employeeName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesMonth && matchesSearch;
  });

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Payroll Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <SummaryCard icon={<FaMoneyCheckAlt />} title="Total Paid" value={`₹${summary.totalPaid?.toLocaleString()}`} />
        <SummaryCard icon={<FaChartPie />} title="Employees Paid" value={summary.employeeCount} />
        <SummaryCard icon={<FaFileInvoiceDollar />} title="This Month" value={`₹${summary.monthlyTotal?.toLocaleString() || 0}`} />
        <SummaryCard icon={<FaHistory />} title="Last Run" value={summary.lastPayrollDate ? new Date(summary.lastPayrollDate).toLocaleDateString() : "N/A"} />
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex gap-4 flex-wrap">
          <input
            type="month"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="border p-2 rounded text-sm shadow-sm"
          />
          <input
            type="text"
            placeholder="Search Employee..."
            className="border p-2 rounded text-sm shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/hr/payroll/salary-structure")}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 flex items-center gap-2"
          >
            <FaPlus /> Add Salary Structure
          </button>
          <button
            onClick={() => navigate("/hr/payroll/generate-payslip")}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
          >
            <FaDownload /> Generate Payslip
          </button>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3">Employee</th>
              <th className="p-3">Month</th>
              <th className="p-3">Net Salary</th>
              <th className="p-3">Deductions</th>
              <th className="p-3">Status</th>
              <th className="p-3">Payslip</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayrolls.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">No payroll records found</td>
              </tr>
            ) : (
              filteredPayrolls.map((entry) => (
                <tr key={entry._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{entry.employeeName}</td>
                  <td className="p-3">{entry.month}</td>
                  <td className="p-3 font-medium text-green-700">₹{entry.netSalary?.toLocaleString()}</td>
                  <td className="p-3 text-red-600">₹{entry.deductions || 0}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${
                      entry.status === "Paid" ? "bg-green-500" : "bg-yellow-500"
                    }`}>
                      {entry.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {entry.payslipUrl ? (
                      <a
                        href={entry.payslipUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 hover:underline"
                      >
                        View PDF
                      </a>
                    ) : (
                      <span className="text-gray-400">Not Available</span>
                    )}
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
