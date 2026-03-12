import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await authAPI.getMe();
        setUser(response.data.data.user);
      } catch (err) {
        localStorage.removeItem('token');
        setUser(null);
      }
    }
    setLoading(false);
  };

  const register = async (userData) => {
    setError(null);
    try {
      const response = await authAPI.register(userData);
      const { accessToken, user: userInfo } = response.data.data;
      localStorage.setItem('token', accessToken);
      setUser(userInfo);
      return { success: true };
    } catch (err) {
      // Handle validation errors with specific field messages
      if (err.response?.data?.errors) {
        const validationErrors = err.response.data.errors;
        const errorMessages = validationErrors.map(e => `${e.field}: ${e.message}`).join(', ');
        setError(errorMessages);
        return { success: false, message: errorMessages, errors: validationErrors };
      }
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      return { success: false, message };
    }
  };

  const login = async (credentials) => {
    setError(null);
    try {
      console.log("API URL: ",authAPI);
      const response = await authAPI.login(credentials);
      const { accessToken, user: userInfo } = response.data.data;
      localStorage.setItem('token', accessToken);
      setUser(userInfo);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      // Ignore logout errors
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  const updateUser = (userData) => {
    setUser((prev) => ({ ...prev, ...userData }));
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isShopOwner: user?.role === 'shop_owner',
    isUser: user?.role === 'user'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

