// LoginPage.tsx
"use client"
import React from 'react';
import HomePage from '../../components/ReportEdit/ReportEditPage';
import { AppProvider } from '../../hooks/AppContext';
import { AuthProvider } from '@/app/hooks/AuthContext';

const ReportEdit: React.FC = () => {
    return (
        <AuthProvider>
            <AppProvider>
                <HomePage />
            </AppProvider>
        </AuthProvider>
    );
};

export default ReportEdit;
