import React from "react";

const PayrollFilterBar = ({ filter, setFilter }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row gap-4 mb-4 items-center">
      <select
        value={filter.month}
        onChange={(e) => setFilter((prev) => ({ ...prev, month: e.target.value }))}
        className="border p-2 rounded w-full md:w-1/4"
      >
        <option value="">All Months</option>
        {["January", "February", "March", "April", "May"].map((m) => (
          <option key={m}>{m}</option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Search by employee"
        value={filter.query}
        onChange={(e) => setFilter((prev) => ({ ...prev, query: e.target.value }))}
        className="border p-2 rounded w-full md:w-1/2"
      />
    </div>
  );
};

export default PayrollFilterBar;
