import { Navigate } from 'react-router-dom';

import { DEFAULT_ROUTE } from '../App';
import LoginForm from '../components/Login/LoginForm';
import { useAuth } from '../context/useAuth';

export const LoginPage = () => {
  const { token } = useAuth();

  if (token !== null) {
    return <Navigate to={DEFAULT_ROUTE} replace />;
  }

  return <LoginForm />;
};
