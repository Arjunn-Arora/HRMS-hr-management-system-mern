import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import {
  FaFileInvoiceDollar,
  FaPlus,
  FaDownload,
  FaMoneyCheckAlt,
  FaHistory,
  FaChartPie,
  FaBuilding,
} from "react-icons/fa";

import { toast } from "react-toastify";
import SalaryStructureModal from "./SalaryStructureModel";
import SalaryStructureTable from "./SalaryStructureTable";
import GeneratePayrollModal from "./GeneratePayrollModel";

const PayrollDashboard = () => {
  const [summary, setSummary] = useState({ totalPaid: 0, employeeCount: 0, monthlyDeductions:0 });
  const [payrolls, setPayrolls] = useState([]);
  const [activeTab, setActiveTab] = useState("payroll"); // "payroll" or "structure"
  const [monthFilter, setMonthFilter] = useState(() => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`; // "2025-07"
});
  const [searchTerm, setSearchTerm] = useState("");
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [editStructure, setEditStructure] = useState(null);

  useEffect(() => {
  fetchPayrollData();
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [monthFilter]);

  const fetchPayrollData = async () => {
  try {
    let month = "", year = "";
    if (monthFilter) {
      // eslint-disable-next-line no-unused-vars
      const [y, m] = monthFilter.split("-");
      const date = new Date(monthFilter);
      month = date.toLocaleString("default", { month: "long" }); // "May"
      year = y;
    }

    const res = await axios.get(`/payroll/summary?month=${month}&year=${year}`, { withCredentials: true });
    const history = await axios.get("/payroll/history", { withCredentials: true });
    setSummary(res.data);
    setPayrolls(history.data);
  } catch (err) {
    toast.error(err.message);
  }
};



  const handleSaveStructure = async (data) => {
    try {
      await axios.post("/payroll/structure", data, { withCredentials: true });
      toast.success("Salary structure saved");
      setShowSalaryModal(false);
      setEditStructure(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleMarkAsPaid = async (id) => {
  try {
    await axios.put(`/payroll/pay/${id}`, {}, { withCredentials: true });
    toast.success("Employee marked as paid");
    fetchPayrollData(); // Refresh table and summary
  } catch (err) {
    toast.error(err.message);
  }
};

  const filteredPayrolls = payrolls.filter((entry) => {
  if (!entry.month || !entry.year) return false;

  const [selectedYear, selectedMonthNum] = monthFilter.split("-");
  const selectedMonthName = new Date(`${selectedYear}-${selectedMonthNum}-01`).toLocaleString("default", { month: "long" });

  const matchesMonth = entry.month.toLowerCase() === selectedMonthName.toLowerCase() &&
                       String(entry.year) === selectedYear;

  const matchesSearch = entry.employeeName?.toLowerCase().includes(searchTerm.toLowerCase());

  return matchesMonth && matchesSearch;
});


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Payroll Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <SummaryCard icon={<FaMoneyCheckAlt />} title="Total Paid" value={`₹${summary.totalPaid?.toLocaleString()}`} />
        <SummaryCard icon={<FaChartPie />} title="Employees Paid" value={summary.employeeCount} />
        <SummaryCard icon={<FaFileInvoiceDollar />} title="Deductions" value={`₹${summary.monthlyDeductions?.toLocaleString() || 0}`} />
        <SummaryCard icon={<FaHistory />} title="Last Run" value={summary.lastPayrollDate ? new Date(summary.lastPayrollDate).toLocaleDateString() : "N/A"} />
      </div>
      
      {/* Tabs */}
      <div className="mb-4 border-b border-gray-200">
        <nav className="-mb-px flex space-x-4 text-sm font-medium">
          <button
            className={`px-4 py-2 ${activeTab === "payroll" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-500 hover:text-indigo-600"}`}
            onClick={() => setActiveTab("payroll")}
          >
            Payroll History
          </button>
          <button
            className={`px-4 py-2 ${activeTab === "structure" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-500 hover:text-indigo-600"}`}
            onClick={() => setActiveTab("structure")}
          >
            Salary Structures
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "payroll" ? (
        <>
          {/* Filters & Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
            <div className="flex gap-3 flex-wrap">
              <input
                type="month"
                value={monthFilter}
                onChange={(e) => setMonthFilter(e.target.value)}
                className="border p-2 rounded text-sm shadow-sm"
              />
              <input
                type="text"
                placeholder="Search Employee"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border p-2 rounded text-sm shadow-sm"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowGenerateModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
              >
                <FaDownload /> Generate Payroll
              </button>
            </div>
          </div>

          {/* Payroll Table */}
          <div className="bg-white rounded-lg shadow overflow-x-auto">
  <table className="min-w-full text-sm text-left">
    <thead className="bg-gray-100 text-gray-700">
      <tr>
        <th className="p-3">Employee</th>
        <th className="p-3">Month</th>
        <th className="p-3">Net Salary</th>
        <th className="p-3">Deductions</th>
        <th className="p-3">Status</th>
        <th className="p-3">Payslip</th>
        <th className="p-3">Actions</th>
      </tr>
    </thead>
    <tbody>
      {filteredPayrolls.length === 0 ? (
        <tr>
          <td colSpan="7" className="text-center py-6 text-gray-500">No records found</td>
        </tr>
      ) : (
        filteredPayrolls.map((entry) => (
          <tr key={entry._id} className="border-t hover:bg-gray-50">
            <td className="p-3">{entry.employeeName}</td>
            <td className="p-3">{entry.month}</td>
            <td className="p-3 font-medium text-green-700">₹{entry.netSalary?.toLocaleString()}</td>
            <td className="p-3 text-red-500">₹{entry.deductions || 0}</td>
            <td className="p-3">
              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                entry.status === "Paid" ? "bg-green-500 text-white" : "bg-yellow-400 text-black"
              }`}>
                {entry.status}
              </span>
            </td>
            <td className="p-3">
              {entry.payslipUrl ? (
                <a href={entry.payslipUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">
                  View PDF
                </a>
              ) : (
                <span className="text-gray-400">N/A</span>
              )}
            </td>
            <td className="p-3">
              {entry.status === "Generated" && (
                <button
                  onClick={() => handleMarkAsPaid(entry._id)}
                  className="bg-indigo-600 text-white px-3 py-1 rounded text-xs hover:bg-indigo-700"
                >
                  Pay Employee
                </button>
              )}
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>
        </>
      ) : (
        <>
          {/* Add Structure Button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => {
                setEditStructure(null);
                setShowSalaryModal(true);
              }}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 flex items-center gap-2"
            >
              <FaPlus /> Add New Structure
            </button>
          </div>

          {/* Salary Structure Table */}
          <SalaryStructureTable
            onEdit={(structure) => {
              setEditStructure(structure);
              setShowSalaryModal(true);
            }}
            onDeleteSuccess={fetchPayrollData}
          />
        </>
      )}

      {/* Modals */}
      {showSalaryModal && (
        <SalaryStructureModal
          defaultValues={editStructure || {}}
          onSave={handleSaveStructure}
          onClose={() => {
            setShowSalaryModal(false);
            setEditStructure(null);
          }}
        />
      )}

      {showGenerateModal && (
        <GeneratePayrollModal
          onClose={() => setShowGenerateModal(false)}
          onSuccess={() => {
            setShowGenerateModal(false);
            fetchPayrollData();
          }}
        />
      )}
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
