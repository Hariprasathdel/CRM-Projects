import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Custom hook for authentication
 * Provides auth state and methods with additional utilities
 */
export const useAuth = () => {
  const auth = useContext(AuthContext);
  
  if (!auth) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const [isTokenExpired, setIsTokenExpired] = useState(false);

  // Check token expiration
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const expiry = payload.exp * 1000;
          setIsTokenExpired(Date.now() >= expiry);
        } catch {
          setIsTokenExpired(true);
        }
      }
    };

    checkToken();
    const interval = setInterval(checkToken, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  // Auto logout on token expiration
  useEffect(() => {
    if (isTokenExpired && auth.isAuthenticated) {
      auth.logout();
    }
  }, [isTokenExpired, auth]);

  return {
    ...auth,
    isTokenExpired,
    isAdmin: auth.user?.role === 'admin',
    isManager: auth.user?.role === 'manager',
    isEmployee: auth.user?.role === 'employee',
    hasPermission: (permission) => {
      return auth.user?.permissions?.includes(permission) || false;
    }
  };
};

export default useAuth;