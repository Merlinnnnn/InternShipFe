import React, { useEffect, useState } from 'react';
import { Box, CssBaseline, Grid, Typography, Toolbar, AppBar, Button, TextField, ThemeProvider, createTheme, MenuItem } from '@mui/material';
import Menu from '../Home/Menu';
import styles from './PermissionPage.module.css';

import useLocate from '../../hooks/useLocate';
import { useAppContext } from '../../hooks/AppContext';
import apiService from '../../untils/api';
import Permissiontable from './PermissionTable';
import Layout from '../layout';


interface Department {
    id: number;
    departmentName: string;
    province: string;
    district: string;
    ward: string;
    level: number;
    name: string; // thêm thuộc tính này
}

interface ApiResponse {
    data: {
        items: Department[];
        currentPage: number;
        nextPage: number | null;
        prevPage: number | null;
        total: number;
    };
    code: number;
    message: string;
    success: boolean;
}

const PermissionPage: React.FC = () => {
    const [refreshTable, setRefreshTable] = useState(false);
    return (
        <Layout>
            <Box sx={{ display: 'flex', height: '100%' }}>
                <CssBaseline />
                <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
                    <AppBar position="static" className={styles.topBar}>
                        <Toolbar>
                            <Typography className={styles.topBarTxt}>
                                Permission Management
                            </Typography>
                        </Toolbar>
                    </AppBar>

                    <Grid container spacing={3} sx={{ height: '90%', marginTop: '20px' }}>
                        <Grid item xs={12}>
                            <Permissiontable refresh={refreshTable} />
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Layout>
    );
}

export default PermissionPage;
