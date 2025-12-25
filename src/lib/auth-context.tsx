import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from './api';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await authAPI.checkSession();
      setUser(response.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    await authAPI.register(email, password, fullName);
  };

  const signIn = async (email: string, password: string) => {
    const response = await authAPI.login(email, password);
    setUser(response.user);
  };

  const signOut = async () => {
    await authAPI.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const response = await authAPI.checkSession();
      setUser(response.user);
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
