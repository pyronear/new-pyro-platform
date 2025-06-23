import { Navigate } from 'react-router-dom';

import LoginForm from '../components/Login/LoginForm';
import { useAuth } from '../context/useAuth';

export const LoginPage = () => {
  const { token } = useAuth();

  if (token !== null) {
    return <Navigate to="/dashboard" replace />;
  }

  return <LoginForm />;
};
