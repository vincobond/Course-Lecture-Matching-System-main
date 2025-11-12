import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginDev from '../pages/LoginDev';
import AdminDashboardDev from '../pages/AdminDashboardDev';
import LoadingSpinner from '../components/LoadingSpinner';

// Development version without Convex Auth
function AppRoutesDev() {
  // For development, we'll use a simple state-based auth
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock authentication state
  const isAuthenticated = !!user;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginDev onLogin={setUser} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardRouter user={user} />} />
      <Route path="/login" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

// Component to route users to their appropriate dashboard based on role
function DashboardRouter({ user }) {
  if (!user) {
    return <LoadingSpinner />;
  }

  switch (user.role) {
    case 'admin':
      return <AdminDashboardDev />;
    case 'lecturer':
      return <AdminDashboardDev />; // Using admin dashboard for demo
    case 'student':
      return <AdminDashboardDev />; // Using admin dashboard for demo
    default:
      return <Navigate to="/login" replace />;
  }
}

export default AppRoutesDev;
