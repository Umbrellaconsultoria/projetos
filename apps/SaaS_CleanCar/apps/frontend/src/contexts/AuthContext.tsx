"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";
import { useRouter, usePathname } from "next/navigation";

interface User {
    id: string;
    nome: string;
    email: string;
    logo_url?: string;
    id_tenant?: string;
    is_saas_provider?: boolean;
    papeis?: { papel: { nome: string } }[];
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (token: string, userData: User) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Padrão que não requer autenticação
const PUBLIC_ROUTES = ['/login', '/register'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (!loading) {
            const isPublic = PUBLIC_ROUTES.some(route => pathname?.startsWith(route));
            if (!user && !isPublic) {
                router.push('/login');
            } else if (user && isPublic) {
                router.push('/dashboard');
            }
        }
    }, [user, loading, pathname, router]);

    const login = (token: string, userData: User) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        router.push('/dashboard');
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
