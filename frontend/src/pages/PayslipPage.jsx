import React from "react";
import { FaArrowLeft, FaDownload } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import html2pdf from "html2pdf.js";
import PayslipTemplate from "./PayslipTemplate";

const PayslipPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation(); // Get data passed from dashboard
  const data = state?.data;

  if (!data) {
    return (
      <div className="p-8 text-center text-gray-600">
        <p>No payslip data found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  const handleDownload = () => {
    const element = document.getElementById("payslip-template");
    html2pdf().set({
      margin: 0.5,
      filename: `${data.employeeName}_Payslip_${data.month}_${data.year}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    }).from(element).save();
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
          >
            <FaArrowLeft /> Back
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm"
          >
            <FaDownload /> Download
          </button>
        </div>

        {/* Payslip Display */}
        <PayslipTemplate data={data} />
      </div>
    </div>
  );
};

export default PayslipPage;
