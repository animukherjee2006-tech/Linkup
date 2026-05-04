import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

function ProtectedRoute() {
  
  const token = localStorage.getItem('token');
  const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true' && token;
  
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login, but save the current location so we can jump back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;