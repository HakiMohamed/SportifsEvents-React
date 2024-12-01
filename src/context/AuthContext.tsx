// src/context/AuthContext.tsx
import React, { 
  createContext, 
  useState, 
  useContext, 
  ReactNode, 
  useMemo
} from 'react';
import { toast } from 'react-toastify';
import { AuthService } from '../services/authService';
import { HttpClient } from '../services/httpClient';  

interface User {
  id: string;
  username: string;
  email: string;
  roles?: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const httpClient = useMemo(() => new HttpClient(), []);
  const authService = useMemo(() => AuthService.getInstance(httpClient), [httpClient]);
  
  const [user, setUser] = useState<User | null>(() => {
    const currentUser = authService.getCurrentUser();
    return currentUser;
  });

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.signin({ email, password });
      setUser(response.user);
      toast.success('Login successful!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      setUser(null);
      toast.error(error instanceof Error ? error.message : 'Login failed', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      throw error;
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    try {
      await authService.signup({ username, email, password });
      toast.success('Account created successfully! Please log in.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Signup failed', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    toast.info('Logged out successfully', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const contextValue = useMemo(() => ({
    user,
    login,
    signup,
    logout,
    isAuthenticated: !!user
  }), [user]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};