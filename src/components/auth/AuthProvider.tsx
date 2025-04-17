import { createContext, useContext, useState, useEffect } from 'react';
import { trpc } from '@/server/trpc/client';

interface User {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isPremium: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const verifyToken = trpc.auth.verifyToken.useQuery(
    { token: localStorage.getItem('token') || '' },
    { enabled: !!localStorage.getItem('token') }
  );
  
  const loginMutation = trpc.auth.login.useMutation();
  const registerMutation = trpc.auth.register.useMutation();
  
  useEffect(() => {
    if (verifyToken.data?.valid && verifyToken.data.user) {
      setUser(verifyToken.data.user);
    }
    setIsLoading(false);
  }, [verifyToken.data]);
  
  const login = async (email: string, password: string) => {
    try {
      const result = await loginMutation.mutateAsync({ email, password });
      if (result.success) {
        localStorage.setItem('token', result.token);
        setUser(result.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };
  
  const register = async (name: string, email: string, password: string) => {
    try {
      const result = await registerMutation.mutateAsync({ name, email, password });
      if (result.success) {
        // Auto login after registration
        return await login(email, password);
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isPremium: user?.isPremium || false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}