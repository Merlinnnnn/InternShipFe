// LoginPage.tsx
"use client"
import React from 'react';
import HomePage from '../../components/Role/RolePage';
import { AppProvider } from '../../hooks/AppContext';
import { AuthProvider } from '@/app/hooks/AuthContext';

const LoginPage: React.FC = () => {
    return (
        <AuthProvider>
            <AppProvider>
                <HomePage />
            </AppProvider>
        </AuthProvider>
    );
};

export default LoginPage;
