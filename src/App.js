import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PropertyPage from './pages/PropertyPage';
import Header from './components/Header';

/**
 * The top‑level application component defines the routing structure. The app
 * exposes only two pages: a home screen where a user can enter a
 * postcode, and a property screen that displays the detailed analysis for
 * that postcode. There is no login flow; as soon as the user enters
 * a postcode they are taken directly to the property page. A persistent
 * header is rendered above all routes to give the app a cohesive feel.
 */
function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/property/:postcode" element={<PropertyPage />} />
        {/* Unknown routes redirect home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;