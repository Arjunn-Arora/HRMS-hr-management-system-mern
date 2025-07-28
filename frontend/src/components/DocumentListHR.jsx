import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { FaDownload } from "react-icons/fa";
import { toast } from "react-toastify";

const DocumentListHR = () => {
  const [documents, setDocuments] = useState([]);

  const fetchDocuments = async () => {
    try {
      const res = await axios.get("/documents", { withCredentials: true });
      setDocuments(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch documents");
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <div className="mt-8 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">All Uploaded Documents</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-3">Employee</th>
              <th className="p-3">Filename</th>
              <th className="p-3">Uploaded At</th>
              <th className="p-3">Download</th>
            </tr>
          </thead>
          <tbody>
            {documents.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No documents found.
                </td>
              </tr>
            ) : (
              documents.map((doc) => (
                <tr key={doc._id} className="border-t">
                  <td className="p-3">{doc.employee?.name || "N/A"}</td>
                  <td className="p-3">{doc.filename}</td>
                  <td className="p-3">{new Date(doc.createdAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    <a
                      href={doc.fileUrl}
                      className="text-indigo-600 hover:underline flex items-center gap-1"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FaDownload /> Download
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

export default DocumentListHR;
