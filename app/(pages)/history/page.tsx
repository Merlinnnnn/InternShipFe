"use client"
import React from 'react';
import ViewHistory from '../../components/History/ViewHistory';
import { AppProvider } from '../../hooks/AppContext'; 
import { AuthProvider } from '@/app/hooks/AuthContext';

const HistoryPage: React.FC = () => {
    return (
        <AuthProvider>
            <AppProvider>
                <ViewHistory />
            </AppProvider>
        </AuthProvider>
    );
};

export default HistoryPage;
