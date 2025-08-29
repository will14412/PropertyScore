import React from 'react';
import { Link } from 'react-router-dom';

/**
 * A simple site header that appears on every page. The header anchors
 * navigation back to the home screen and sets the tone of the UI with a
 * gradient and bold typography. You could extend this component with
 * navigation links or branding imagery as needed.
 */
function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
        <Link to="/" className="text-2xl font-bold tracking-tight">
          LandlordScore
        </Link>
        {/* Placeholder for future navigation items */}
        <nav className="hidden md:flex items-center space-x-4">
          {/* Additional links could be added here */}
        </nav>
      </div>
    </header>
  );
}

export default Header;