import React from 'react';

/**
 * StatCard is a reusable container for displaying a group of statistics.
 * Provide a title and children content. The card will apply consistent
 * styling that matches the rest of the application.
 */
function StatCard({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 border border-gray-100">
      <h3 className="text-lg font-semibold text-blue-700 mb-2">{title}</h3>
      {children}
    </div>
  );
}

export default StatCard;