import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
      setUser({ name: 'Admin User', email: 'admin@kazilink.com' });
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Mock login - in real app, this would call an API
    localStorage.setItem('adminToken', 'mock-token');
    setIsAuthenticated(true);
    setUser({ name: 'Admin User', email: email });
    // Navigate will be handled in the component
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setUser(null);
    // Navigate will be handled in the component
  };

  return { isAuthenticated, user, loading, login, logout };
};