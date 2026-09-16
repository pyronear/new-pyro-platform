import { Navigate, Outlet } from 'react-router';

import { useAuth } from '@/context/useAuth.ts';

const ProtectedRoute = () => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
