'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSession = useCallback(async () => {
    try {
      const { data } = await api.get('/api/auth/session');
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const login = async (email, password) => {
    try {
      // Step 1: Use Better Auth's built-in sign-in (handles cookie automatically)
      await api.post('/api/auth/sign-in/email', { email, password, rememberMe: true });

      // Step 2: Fetch session to get our MongoDB user data
      const { data } = await api.get('/api/auth/session');
      setUser(data.user);
      toast.success('Login successful!');
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data?.error || 'Login failed';
      toast.error(msg);
      throw error;
    }
  };

  const register = async (name, email, password, photoURL) => {
    try {
      // Step 1: Use Better Auth's built-in sign-up (handles cookie automatically)
      await api.post('/api/auth/sign-up/email', {
        name,
        email,
        password,
        image: photoURL || undefined,
        rememberMe: true,
      });

      // Step 2: Ensure user exists in our MongoDB (creates document, sets role)
      const { data } = await api.post('/api/auth/ensure-user', {
        name,
        email,
        photoURL,
      });

      setUser(data.user);
      toast.success('Registration successful!');
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data?.error || 'Registration failed';
      toast.error(msg);
      throw error;
    }
  };

  const googleLogin = async () => {
    try {
      const { signIn } = await import('@/lib/auth-client');
      const { data, error } = await signIn.social({
        provider: 'google',
        callbackURL: `${window.location.origin}/dashboard`, // Redirect URL after successful login
      });
      
      if (error) {
        console.error('Google Login Error from Better Auth:', error);
        toast.error(error.message || 'Google login failed');
      }
    } catch (err) {
      console.error('Google Login Exception:', err);
      toast.error('Google login failed');
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/sign-out', {});
      setUser(null);
      toast.success('Logged out successfully');
    } catch {
      toast.error('Logout failed');
    }
  };

  const refreshUser = async () => {
    await fetchSession();
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, googleLogin, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
