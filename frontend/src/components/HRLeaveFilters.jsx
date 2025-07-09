import React from "react";

const HRLeaveFilters = ({ filters, onChange }) => {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <select name="status" value={filters.status} onChange={onChange} className="p-2 border rounded">
        <option value="">All Statuses</option>
        <option value="Pending">Pending</option>
        <option value="Approved">Approved</option>
        <option value="Rejected">Rejected</option>
      </select>

      <select name="policy" value={filters.policy} onChange={onChange} className="p-2 border rounded">
        <option value="">All Policies</option>
        <option value="Casual Leave">Casual Leave</option>
        <option value="Sick Leave">Sick Leave</option>
        <option value="Paid Leave">Paid Leave</option>
      </select>

      <input
        type="text"
        name="employee"
        value={filters.employee}
        onChange={onChange}
        placeholder="Search by name or email"
        className="p-2 border rounded"
      />
    </div>
  );
};

export default HRLeaveFilters;
