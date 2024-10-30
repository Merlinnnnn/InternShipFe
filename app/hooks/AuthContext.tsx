import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const router = useRouter();
    const pathname = usePathname(); // Lấy URL hiện tại

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('access_token');
            if (token) {
                setIsAuthenticated(true);
                console.log('Đăng nhập thành công'); // Ghi log chỉ khi token tồn tại
                console.log(token)
            } else {
                setIsAuthenticated(false);
            }

            if (!token ) {
                router.replace('/login'); // Chuyển hướng về trang login nếu không có token và URL hiện tại không phải là /login
            }
        }
    }, [pathname, router]);



    const login = (token: string) => {
        localStorage.setItem('access_token', token);
        setIsAuthenticated(true);
        router.replace('/department');
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        setIsAuthenticated(false);
        router.replace('/login');
    };

    if (isAuthenticated === null) {
        return null; 
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
