import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from './Loader';

/**
 * Route protection decorator
 * @param {Array} allowedRoles - Optional list of authorized roles (e.g. ['worker', 'admin'])
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { userInfo, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  // Only show loader when we don't have userInfo yet and are still loading
  // (e.g., initial auth check). If userInfo exists, let the page render even
  // if a background auth action (like getProfile) is in progress.
  if (loading && !userInfo) {
    return (
      <div class="min-h-screen flex items-center justify-center bg-slate-900">
        <Loader />
      </div>
    );
  }

  // 1. If not logged in, redirect to login page
  if (!userInfo) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. If roles are restricted, confirm user has the correct permission role
  if (allowedRoles && !allowedRoles.includes(userInfo.role)) {
    // Send back to dashboard matching their role
    if (userInfo.role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (userInfo.role === 'worker') {
      return <Navigate to="/worker-dashboard" replace />;
    } else {
      return <Navigate to="/customer-dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
