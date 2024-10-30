"use client"
import React from 'react';
import ReportDeclare from '../../components/ReportEdit/ReportDeclaration';
import { AppProvider } from '../../hooks/AppContext';
import { AuthProvider } from '@/app/hooks/AuthContext';

const ReportConfig: React.FC = () => {
    return (
        <AuthProvider>
            <AppProvider>
                <ReportDeclare />
            </AppProvider>
        </AuthProvider>
    );
};

export default ReportConfig;