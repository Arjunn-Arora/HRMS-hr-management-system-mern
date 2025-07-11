import React from 'react';
import { Link } from 'react-router-dom';

const Error400 = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="text-center">
        <h1 className="text-7xl font-bold text-yellow-500 mb-4">400</h1>
        <h2 className="text-2xl font-semibold mb-2">Bad Request</h2>
        <p className="text-gray-600 mb-6">Oops! Your request could not be understood by the server.</p>
        <Link to="/" className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600 transition">
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default Error400;
