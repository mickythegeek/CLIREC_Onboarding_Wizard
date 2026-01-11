import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '@/services/api';

interface User {
    id: number;
    email: string;
    fullName: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    isAdmin: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
    register: (email: string, password: string, fullName: string) => Promise<{ success: boolean; message: string }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await authApi.login({ email, password });
            const { token: newToken, user: newUser, success, message } = response.data;

            if (success && newToken && newUser) {
                setToken(newToken);
                setUser(newUser);
                localStorage.setItem('token', newToken);
                localStorage.setItem('user', JSON.stringify(newUser));
                return { success: true, message };
            }

            return { success: false, message: message || 'Login failed' };
        } catch (error: any) {
            const message = error.response?.data?.message || 'An error occurred during login';
            return { success: false, message };
        }
    };

    const register = async (email: string, password: string, fullName: string) => {
        try {
            const response = await authApi.register({ email, password, fullName });
            const { token: newToken, user: newUser, success, message } = response.data;

            if (success && newToken && newUser) {
                setToken(newToken);
                setUser(newUser);
                localStorage.setItem('token', newToken);
                localStorage.setItem('user', JSON.stringify(newUser));
                return { success: true, message };
            }

            return { success: false, message: message || 'Registration failed' };
        } catch (error: any) {
            const message = error.response?.data?.message || 'An error occurred during registration';
            return { success: false, message };
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoading,
                isAuthenticated: !!token && !!user,
                isAdmin: user?.role === 'Admin',
                login,
                register,
                logout,
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
