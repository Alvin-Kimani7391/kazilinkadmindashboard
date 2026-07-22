import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Jobs from './pages/Jobs';
import Payments from './pages/Payments';
import Reviews from './pages/Ratings';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import Layout from './components/Layout';  // <-- IMPORT THE LAYOUT

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#FFB84D] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* ===== ALL PAGES WRAPPED WITH LAYOUT ===== */}
        <Route
          path="/"
          element={isAuthenticated ? <Layout><Dashboard /></Layout> : <Navigate to="/login" />}
        />
        <Route
          path="/users"
          element={isAuthenticated ? <Layout><Users /></Layout> : <Navigate to="/login" />}
        />
        <Route
          path="/jobs"
          element={isAuthenticated ? <Layout><Jobs /></Layout> : <Navigate to="/login" />}
        />
        <Route
          path="/payments"
          element={isAuthenticated ? <Layout><Payments /></Layout> : <Navigate to="/login" />}
        />
        <Route
          path="/reviews"
          element={isAuthenticated ? <Layout><Reviews /></Layout> : <Navigate to="/login" />}
        />
        <Route
          path="/settings"
          element={isAuthenticated ? <Layout><Settings /></Layout> : <Navigate to="/login" />}
        />
        <Route
          path="/notifications"
          element={isAuthenticated ? <Layout><Notifications /></Layout> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;