import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initiateAuth, getAccessToken, isAuthenticated, logout } from '@/services/spotifyApi';

export const useAuth = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const auth = isAuthenticated();
      setAuthenticated(auth);
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await initiateAuth();
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    navigate('/');
  };

  const handleCallback = async (code: string) => {
    setLoading(true);
    try {
      await getAccessToken(code);
      setAuthenticated(true);
      navigate('/dashboard');
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    authenticated,
    login: handleLogin,
    logout: handleLogout,
    handleCallback,
  };
};
