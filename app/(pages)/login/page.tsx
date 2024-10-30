"use client"
import React from 'react';
import LoginForm from '../../components/Auth/LoginForm';
import { AuthProvider } from '@/app/hooks/AuthContext';

const LoginPage: React.FC = () => {
    return (
        <AuthProvider><LoginForm /></AuthProvider>
    
);
};

export default LoginPage;
