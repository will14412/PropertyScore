import React from 'react';

/**
 * LoadingOverlay displays the status of multiple asynchronous API calls.
 * Each status is shown with a colour: yellow for "loading", green for
 * "success", and red for "error". Pass an object mapping friendly names
 * (keys) to their status values.
 */
function LoadingOverlay({ statuses }) {
  const tasks = Object.keys(statuses);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Loading property data</h2>
        <ul className="divide-y divide-gray-200">
          {tasks.map((task) => {
            const status = statuses[task];
            let colour = 'text-yellow-500';
            if (status === 'success') colour = 'text-green-500';
            if (status === 'error') colour = 'text-red-500';
            return (
              <li key={task} className="py-2 flex justify-between items-center">
                <span className="font-medium text-gray-700">{task}</span>
                <span className={`${colour} capitalize font-semibold`}>{status}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default LoadingOverlay;