import { Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import axios from '../utils/axios';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  const location = useLocation();

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          await axios.get('/auth/verify');
        } catch (error) {
          localStorage.removeItem('token');
          window.location.href = `/login?redirect=${location.pathname}`;
        }
      }
    };
    verifyToken();
  }, [token, location]);

  if (!token) {
    return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  }

  return children;
}

export default PrivateRoute; 