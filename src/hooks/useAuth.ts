import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initiateAuth, getAccessToken, isAuthenticated, logout } from '@/services/spotifyApi';

// Create a custom event for auth state changes
const AUTH_STATE_CHANGE_EVENT = 'auth-state-change';

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

    // Listen for auth state changes from other components
    const handleAuthChange = (event: CustomEvent) => {
      setAuthenticated(event.detail.authenticated);
    };

    window.addEventListener(AUTH_STATE_CHANGE_EVENT, handleAuthChange as EventListener);

    return () => {
      window.removeEventListener(AUTH_STATE_CHANGE_EVENT, handleAuthChange as EventListener);
    };
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

    // Dispatch custom event to notify other components
    window.dispatchEvent(
      new CustomEvent(AUTH_STATE_CHANGE_EVENT, {
        detail: { authenticated: false },
      })
    );

    navigate('/');
  };

  const handleCallback = async (code: string) => {
    setLoading(true);
    try {
      await getAccessToken(code);
      setAuthenticated(true);

      // Dispatch custom event to notify other components
      window.dispatchEvent(
        new CustomEvent(AUTH_STATE_CHANGE_EVENT, {
          detail: { authenticated: true },
        })
      );

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
