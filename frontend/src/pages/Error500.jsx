import React from 'react';
import { Link } from 'react-router-dom';

const Error500 = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="text-center">
        <h1 className="text-7xl font-bold text-red-600 mb-4">500</h1>
        <h2 className="text-2xl font-semibold mb-2">Internal Server Error</h2>
        <p className="text-gray-600 mb-6">Something went wrong on our end. Please try again later.</p>
        <Link to="/" className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition">
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default Error500;
