// LoginPage.tsx
"use client"
import React from 'react';
import HomePage from '../../components/ReportConfig/ConfigPage';
import { AppProvider } from '../../hooks/AppContext';
import { AuthProvider } from '@/app/hooks/AuthContext';

const ReportConfig: React.FC = () => {
    return (
        <AuthProvider>
            <AppProvider>
                <HomePage />
            </AppProvider>
        </AuthProvider>
    );
};

export default ReportConfig;
