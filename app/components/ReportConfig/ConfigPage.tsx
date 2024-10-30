import React, { useEffect, useState } from 'react';
import { Box, CssBaseline, Grid, Typography, Toolbar, AppBar, Button, TextField, MenuItem } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import useLocate from '../../hooks/useLocate';
import { useAppContext } from '../../hooks/AppContext';
import apiService from '../../untils/api';
import Layout from '../layout';
import ConfigTable from './ConfigTable';
import PopUpDiolog from './PopUpDiolog';
// import ImportDialog from './Import';

interface Department {
    id: number;
    departmentName: string;
    province: {
        id: string;
    };
    district: string;
    ward: string;
    level: number;
    name: string;
    parentId: string | null;
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

const HomePage: React.FC = () => {
    const [openImport, setOpenImport] = useState(false);
    const [openAdd, setOpenAdd] = useState(false);
    const [refreshTable, setRefreshTable] = useState(false);
    const [permissions, setPermissions] = useState<any[]>([]);

    const hasPermission = (subject: string, action: string) => {
        if (permissions.some(permission =>
            permission.subject === 'user' && permission.action === null
        )) {
            return true;
        }
        return permissions.some(permission =>
            permission.subject === subject && permission.action === action
        );
    };

    const handleCloseOpenAdd = () => {
        setOpenAdd(false);
        setRefreshTable(prev => !prev);
    };

    const handleOpenAdd = () => {
        setOpenAdd(true);
    };

    return (
        <Layout>
            <CssBaseline />
            <Box sx={{ display: 'flex', height: '100%' }}>
                <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
                    <AppBar position="static"
                        sx={{
                            borderRadius: '8px',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            backgroundColor: 'white',
                            height: '57px',
                            marginBottom: '40px'
                        }}>
                        <Toolbar>
                            <Typography
                                sx={{
                                    fontSize: '18px',
                                    fontWeight: '700',
                                    color: 'black',
                                    flexGrow: 1
                                }}>
                                Report Configuration Management
                            </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<AddIcon />}
                                    onClick={handleOpenAdd}
                                    sx={{ textTransform: 'none', width: '125px' }}
                                >
                                    Add New
                                </Button>
                        </Toolbar>
                    </AppBar>
                    <Grid container spacing={3} sx={{ height: '90%' }}>
                        <Grid item xs={12} sx={{ flexGrow: 1 }}>
                            <ConfigTable refresh={refreshTable} />
                        </Grid>
                    </Grid>
                </Box>
                <PopUpDiolog open={openAdd} onClose={handleCloseOpenAdd} type='add'/>
            </Box>
        </Layout>
    );
}

export default HomePage;
