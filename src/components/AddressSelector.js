import React from 'react';

/**
 * AddressSelector renders a drop‑down list of address options for a given
 * postcode. Users can pick the exact property address from the results
 * returned by the getAddress API. When the user selects an address the
 * onSelect callback will be triggered with the chosen value.
 */
function AddressSelector({ addresses, selected, onSelect }) {
  return (
    <div className="space-y-2">
      <label className="block text-gray-600 font-medium">Select address</label>
      <select
        value={selected}
        onChange={(e) => onSelect(e.target.value)}
        className="w-full px-4 py-3 rounded-lg text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 focus:outline-none"
      >
        <option value="">Please choose...</option>
        {addresses.map((addr, idx) => (
          <option key={idx} value={addr}>{addr}</option>
        ))}
      </select>
    </div>
  );
}

export default AddressSelector;