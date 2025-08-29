import React from 'react';

/**
 * StatusPanel renders a vertical list of API calls with their current status.
 * Each entry is colour‑coded to communicate progress at a glance. Place this
 * component somewhere visible (e.g. in a sidebar) so users can see which
 * calls have completed or failed in real time and after the fact.
 */
function StatusPanel({ statuses }) {
  const entries = Object.entries(statuses || {});
  if (entries.length === 0) {
    return null;
  }
  return (
    <div className="bg-white rounded-xl shadow p-4 border border-gray-100 w-full lg:w-64">
      <h3 className="text-lg font-semibold text-blue-700 mb-2">API status</h3>
      <ul className="space-y-1">
        {entries.map(([name, status]) => {
          let colour = 'text-yellow-600';
          if (status === 'success') colour = 'text-green-600';
          if (status === 'error') colour = 'text-red-600';
          return (
            <li key={name} className="flex justify-between text-sm">
              <span className="font-medium text-gray-700">{name}</span>
              <span className={`${colour} font-semibold capitalize`}>{status}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default StatusPanel;