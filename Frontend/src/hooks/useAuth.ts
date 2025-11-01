import { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import type { User } from '../types/auth.types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    const authenticated = authService.isAuthenticated();
    
    setUser(currentUser);
    setIsAuthenticated(authenticated);
    setIsLoading(false);
  }, []);

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    logout,
  };
};
