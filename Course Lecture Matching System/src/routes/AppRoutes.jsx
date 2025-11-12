import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from '../pages/Login';
import AdminDashboard from '../pages/AdminDashboard';
import LecturerDashboard from '../pages/LecturerDashboard';
import StudentDashboard from '../pages/StudentDashboard';
import LoadingSpinner from '../components/LoadingSpinner';

function AppRoutes() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardRouter user={user} onLogout={handleLogout} />} />
      <Route path="/login" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

// Component to route users to their appropriate dashboard based on role
function DashboardRouter({ user, onLogout }) {
  switch (user.role) {
    case 'admin':
      return <AdminDashboard user={user} onLogout={onLogout} />;
    case 'lecturer':
      return <LecturerDashboard user={user} onLogout={onLogout} />;
    case 'student':
      return <StudentDashboard user={user} onLogout={onLogout} />;
    default:
      return <Navigate to="/login" replace />;
  }
}

export default AppRoutes;
