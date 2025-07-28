import React, { useState } from "react";
import DocumentUploadForm from "./DocumentUploadForm";
import DocumentListHR from "./DocumentListHR";

const HRDocumentsPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">HR Document Management</h1>
      <DocumentUploadForm onUpload={() => setRefreshKey((k) => k + 1)} />
      <DocumentListHR key={refreshKey} />
    </div>
  );
};

export default HRDocumentsPage;
