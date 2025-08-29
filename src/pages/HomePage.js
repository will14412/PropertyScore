import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const [postcode, setPostcode] = useState('');
  const navigate = useNavigate();

  const handleProceed = () => {
    if (!postcode.trim()) return;
    const formatted = postcode.trim().toUpperCase();
    navigate(`/property/${encodeURIComponent(formatted)}`);
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 leading-tight">
            Discover the potential of your investment
          </h1>
          <p className="text-lg text-gray-700">
            Our platform aggregates data from dozens of official sources to
            evaluate UK properties for buy‑to‑let. Simply enter a postcode and
            we'll do the rest.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Start your search</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              placeholder="e.g. SK9 5AE"
              className="flex-grow px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={handleProceed}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Go
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;