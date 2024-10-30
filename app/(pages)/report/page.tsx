"use client"
import React from 'react';
import Report from '../../components/Report/ReportPage';
import { AppProvider } from '../../hooks/AppContext';
import { AuthProvider } from '@/app/hooks/AuthContext';

const ReportPage: React.FC = () => {
    return (
        <AuthProvider>
            <AppProvider>
                <Report />
            </AppProvider>
        </AuthProvider>
    );
};

export default ReportPage;