import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// A minimal login/register form. In a real app you'd handle authentication
// against your back‑end here. For this demo we simply call the onLogin
// callback and redirect.
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  // If the user was redirected from HomePage with a postcode, preserve it so we
  // can forward the user back after logging in.
  const postcode = location.state?.postcode;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform your login logic here. We'll assume success and notify parent.
    onLogin();
    // Redirect back to the property page if postcode is provided; otherwise to home
    if (postcode) {
      navigate(`/property/${encodeURIComponent(postcode)}`);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">Login or Register</h1>
        <p className="text-gray-600 mb-4">
          Sign in to continue. If you don't have an account yet, we'll create
          one for you automatically.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            className="w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;