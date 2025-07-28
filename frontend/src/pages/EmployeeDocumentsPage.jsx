import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { FaFilePdf, FaFileWord, FaFileImage, FaFileAlt, FaDownload } from "react-icons/fa";
import { toast } from "react-toastify";

const EmployeeDocumentsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await axios.get("/documents/employee/me", { withCredentials: true });
        setDocuments(res.data);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to fetch documents");
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  const getIcon = (type) => {
    if (!type) return <FaFileAlt className="text-gray-500 text-3xl" />;
    if (type.includes("pdf")) return <FaFilePdf className="text-red-500 text-3xl" />;
    if (type.includes("word")) return <FaFileWord className="text-blue-600 text-3xl" />;
    if (type.includes("image")) return <FaFileImage className="text-green-500 text-3xl" />;
    return <FaFileAlt className="text-gray-500 text-3xl" />;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Documents</h1>

      {loading ? (
        <div className="text-center text-gray-500">Loading documents...</div>
      ) : documents.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
          No documents uploaded yet.
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-6 overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3 text-left">File</th>
                <th className="p-3 text-left">Uploaded On</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 flex items-center gap-3">
                    {getIcon(doc.contentType)}
                    <span className="font-medium text-gray-800">{doc.filename}</span>
                  </td>
                  <td className="p-3 text-gray-600">
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-right">
                    <a
                      href={`https://localhost:3000/documents/download/${doc._id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow transition"
                    >
                      <FaDownload /> Download
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmployeeDocumentsPage;
