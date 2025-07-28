import React, { useState, useEffect } from "react";
import axios from "../utils/axiosInstance";
import { FaUpload } from "react-icons/fa";
import { toast } from "react-toastify";

const DocumentUploadForm = ({ onUpload }) => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get("/hr/employees", { withCredentials: true });
        setEmployees(res.data);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to fetch employees");
      }
    };
    fetchEmployees();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedEmployee || !file) {
      toast.error("Please select employee and document");
      return;
    }

    const formData = new FormData();
    formData.append("employee", selectedEmployee);
    formData.append("document", file);

    try {
      await axios.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      toast.success("Document uploaded successfully");
      onUpload(); // trigger list refresh
      setSelectedEmployee("");
      setFile(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    }
  };

  return (
    <form
      onSubmit={handleUpload}
      className="bg-white p-6 rounded shadow flex flex-col gap-4"
    >
      <h2 className="text-xl font-semibold text-gray-700">Upload Document</h2>
      <select
        value={selectedEmployee}
        onChange={(e) => setSelectedEmployee(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">Select Employee</option>
        {employees.map((emp) => (
          <option key={emp._id} value={emp._id}>
            {emp.name}
          </option>
        ))}
      </select>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="border p-2 rounded"
      />
      <button
        type="submit"
        className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-indigo-700"
      >
        <FaUpload /> Upload
      </button>
    </form>
  );
};

export default DocumentUploadForm;
