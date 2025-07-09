import React from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";

const LeaveChart = ({ data }) => {
  const colors = [
    "#3b82f6", "#10b981", "#f59e0b", "#ef4444",
    "#6366f1", "#14b8a6", "#f97316", "#a855f7"
  ];

  const chartData = {
    labels: data.map((d) => d.type),
    datasets: [
      {
        label: "Leave Distribution",
        data: data.map((d) => d.count),
        backgroundColor: colors.slice(0, data.length)
      }
    ]
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-3">Leave Stats by Type</h3>
      <Pie data={chartData} />
    </div>
  );
};

export default LeaveChart;
