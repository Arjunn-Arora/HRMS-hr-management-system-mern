import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaFileDownload, FaMoneyBillWave } from "react-icons/fa";

const EmployeePayslips = () => {
  const [payslips, setPayslips] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [meRes, psRes] = await Promise.all([
        axios.get("/auth/me", { withCredentials: true }),
        axios.get("/payroll/my", { withCredentials: true })
      ]);
      setUser(meRes.data.user);
      setPayslips(psRes.data);
    } catch (err) {
      toast.error("Failed to fetch payslips");
    }
  };

  const handleDownload = (payslip) => {
    const doc = new jsPDF();

    // Company Header
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 100);
    doc.text("Company Name", 105, 20, { align: "center" });

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("Payslip", 105, 30, { align: "center" });

    doc.setFontSize(12);
    doc.text(`For the month of ${payslip.month} ${payslip.year}`, 105, 38, { align: "center" });

    doc.setLineWidth(0.5);
    doc.line(14, 42, 196, 42);

    // Employee Details
    doc.setFontSize(11);
    doc.text(`Employee Name: ${user.name}`, 14, 52);
    doc.text(`Department: ${user.department || "N/A"}`, 14, 60);
    doc.text(`Designation: ${user.designation || "N/A"}`, 14, 68);
    
    doc.text(`Date of Joining: ${new Date(user.createdAt).toLocaleDateString()}`, 120, 52);
    doc.text(`Email: ${user.email}`, 120, 60);
    doc.text(`Status: ${payslip.status}`, 120, 68);

    doc.line(14, 72, 196, 72);

    // Salary Details Table
    const tableData = [
      ["Base Salary", `$${(payslip.baseSalary || 0).toFixed(2)}`],
      ["HRA", `$${(payslip.hra || 0).toFixed(2)}`],
      ["Allowances", `$${(payslip.allowances || 0).toFixed(2)}`],
      ["Gross Earnings", `$${(payslip.gross || 0).toFixed(2)}`],
      ["Deductions", `$${(payslip.deductions || 0).toFixed(2)}`],
    ];

    autoTable(doc, {
      startY: 78,
      head: [["Earnings & Deductions", "Amount"]],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [63, 81, 181] },
      styles: { fontSize: 11, cellPadding: 5 }
    });

    const finalY = doc.lastAutoTable?.finalY || 78;

    // Net Pay
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 128, 0);
    doc.text(`Net Pay: $${(payslip.netPay || 0).toFixed(2)}`, 14, finalY + 15);

    // Footer
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("This is a computer-generated document. No signature is required.", 105, 280, { align: "center" });

    doc.save(`Payslip_${payslip.month}_${payslip.year}.pdf`);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-screen">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
          <FaMoneyBillWave size={24} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-800">My Payslips</h2>
          <p className="text-gray-500">View and download your salary slips</p>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left p-4 font-semibold text-gray-600">Month / Year</th>
              <th className="text-left p-4 font-semibold text-gray-600">Gross Pay</th>
              <th className="text-left p-4 font-semibold text-gray-600">Deductions</th>
              <th className="text-left p-4 font-semibold text-gray-600">Net Pay</th>
              <th className="text-left p-4 font-semibold text-gray-600">Status</th>
              <th className="text-right p-4 font-semibold text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {payslips.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500">
                  No payslips generated yet.
                </td>
              </tr>
            ) : (
              payslips.map(ps => (
                <tr key={ps._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-800">{ps.month} {ps.year}</td>
                  <td className="p-4 text-gray-600">${(ps.gross || 0).toFixed(2)}</td>
                  <td className="p-4 text-red-500">-${(ps.deductions || 0).toFixed(2)}</td>
                  <td className="p-4 font-bold text-green-600">${(ps.netPay || 0).toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      ps.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {ps.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDownload(ps)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 font-medium transition"
                    >
                      <FaFileDownload /> Download PDF
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

export default EmployeePayslips;
