import React, { useEffect, useState } from 'react';
import { Box, CssBaseline, Grid, Typography, Toolbar, AppBar, Button, TextField, MenuItem } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import styles from './RolePage.module.css';
import RoleTable from './RoleTable';
import useLocate from '../../hooks/useLocate';
import { useAppContext } from '../../hooks/AppContext';
import apiService from '../../untils/api';
import Layout from '../layout';
import AddNewPopup from './PopUp';

interface Department {
    id: number;
    departmentName: string;
    province: string;
    district: string;
    ward: string;
    level: number;
    name: string; 
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

const RolePage: React.FC = () => {
    const [open, setOpen] = useState(true);
    const [openAdd, setOpenAdd] = useState(false);
    const [refreshTable, setRefreshTable] = useState(false);
    const {roles} = useAppContext();
    const [refreshOptions, setRefreshOptions] = useState(false);
    const [departmentsLv1, setDepartmentsLv1] = useState<Department[]>([]);
    const [departmentsLv2, setDepartmentsLv2] = useState<Department[]>([]);
    const [departmentsLv3, setDepartmentsLv3] = useState<Department[]>([]);
    const [departmentsLv4, setDepartmentsLv4] = useState<Department[]>([]);
    console.log('roles: ' + roles);

    const {
        province, setProvince,
        dpmLv1, setDpmLv1,
        dpmLv2, setDpmLv2,
        dpmLv3, setDpmLv3,
        dpmLv4, setDpmLv4,
        choosed, setChoosed
    } = useAppContext();

    const { cities } = useLocate();

    // Fetch user permissions from localStorage
    const [permissions, setPermissions] = useState<any[]>([]);
    useEffect(() => {
        const storedPermissions = localStorage.getItem('permission');
        if (storedPermissions) {
            setPermissions(JSON.parse(storedPermissions));
        }
    }, []);

    const hasPermission = (subject: string, action: string) => {
        if (permissions.some(permission => 
            permission.subject === 'role' && permission.action === null 
        )) {
            return true;
        }
        return permissions.some(permission => 
            permission.subject === subject && permission.action === action 
        );
    };

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    const handleCloseOpenAdd = () => {
        setOpenAdd(false);
        setRefreshTable(prev => !prev);
        setRefreshOptions(prev => !prev); 
    };

    const handleOpenAdd = () => {
        setOpenAdd(true);
    };

    const fetchDepartments = async (url: string, setter: Function) => {
        try {
            const response = await apiService.get<ApiResponse>(url);
            const data: ApiResponse = response.data;
            setter(data.data.items);
        } catch (error) {
            console.error('Failed to fetch departments:', error);
            setter([]);
        }
    };

    const handleProvinceChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedProvinceName = event.target.value;
        const selectedProvince = cities.find(city => city.name === selectedProvinceName);
        if (selectedProvince) {
            setProvince({ id: selectedProvince.id, name: selectedProvince.name });
            await fetchDepartments(`/department/${selectedProvince.id}`, setDepartmentsLv1);
            setDpmLv1({ id: '', name: '' });
            setDpmLv2({ id: '', name: '' });
            setDpmLv3({ id: '', name: '' });
            setDpmLv4({ id: '', name: '' });
            setChoosed({ id: '', name: '' });
            setDepartmentsLv2([]);
            setDepartmentsLv3([]);
            setDepartmentsLv4([]);
        }
    };

    const handleDepartmentChange = (setter: Function, levelSetter: Function, nextLevelSetter: Function, urlTemplate: string, departments: Department[]) => async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDepartmentName = event.target.value;
        const selectedDepartment = departments.find(dept => dept.departmentName === selectedDepartmentName);
        if (selectedDepartment) {
            setter({ id: selectedDepartment.id, name: selectedDepartment.departmentName });
            setChoosed({ id: String(selectedDepartment.id), name: selectedDepartment.departmentName });
            const url = urlTemplate.replace('{id}', String(selectedDepartment.id));
            await fetchDepartments(url, levelSetter);
            nextLevelSetter([]);
            if (setter === setDpmLv1) {
                setDpmLv2({ id: '', name: '' });
                setDpmLv3({ id: '', name: '' });
                setDpmLv4({ id: '', name: '' });
                setDepartmentsLv3([]);
                setDepartmentsLv4([]);
            } else if (setter === setDpmLv2) {
                setDpmLv3({ id: '', name: '' });
                setDpmLv4({ id: '', name: '' });
                setDepartmentsLv4([]);
            } else if (setter === setDpmLv3) {
                setDpmLv4({ id: '', name: '' });
            }
        }
    };

    useEffect(() => {
        const fetchAllData = async () => {
            if (province.id) {
                await fetchDepartments(`/department/${province.id}`, setDepartmentsLv1);
            }
            if (dpmLv1.id) {
                await fetchDepartments(`/department/${dpmLv1.id}/level`, setDepartmentsLv2);
            }
            if (dpmLv2.id) {
                await fetchDepartments(`/department/${dpmLv2.id}/level`, setDepartmentsLv3);
            }
            if (dpmLv3.id) {
                await fetchDepartments(`/department/${dpmLv3.id}/level`, setDepartmentsLv4);
            }
        };
        fetchAllData();
        console.log('roles: '+ roles);
    }, [refreshOptions]);

    return (
        <Layout>
            <CssBaseline />
            <Box sx={{ display: 'flex', height: '100%' }}>
                <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
                    <AppBar position="static" className={styles.topBar}>
                        <Toolbar>
                            <Typography className={styles.topBarTxt}>
                                Role Management
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                className={styles.noneCaseBtn}
                                startIcon={<AddIcon />}
                                onClick={handleOpenAdd}
                                disabled={!hasPermission('role', 'create')}
                            >
                                Add New
                            </Button>
                        </Toolbar>
                    </AppBar>
                    <Grid container spacing={3} sx={{ mt: 2 }}>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', marginBottom: 2 }}>
                                <Box sx={{ display: 'flex', flex: 1, justifyContent: 'space-between' }}>
                                    <TextField
                                        select
                                        size='small'
                                        label="City/Province"
                                        value={province.name}
                                        onChange={handleProvinceChange}
                                        sx={{ flex: 1, marginRight: 2 }}
                                    >
                                        {cities.slice().reverse().map((city) => (
                                            <MenuItem key={city.id} value={city.name}>
                                                {city.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                    <TextField
                                        select
                                        size='small'
                                        label="Department level 1"
                                        value={dpmLv1.name}
                                        onChange={handleDepartmentChange(setDpmLv1, setDepartmentsLv2, setDepartmentsLv3, `/department/{id}/level`, departmentsLv1)}
                                        sx={{ flex: 1, marginRight: 2 }}
                                    >
                                        {departmentsLv1.filter(dept => dept.level === 1).map((dept) => (
                                            <MenuItem key={dept.id} value={dept.departmentName}>
                                                {dept.departmentName}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                    <TextField
                                        select
                                        size='small'
                                        label="Department level 2"
                                        value={dpmLv2.name}
                                        onChange={handleDepartmentChange(setDpmLv2, setDepartmentsLv3, setDepartmentsLv4, `/department/{id}/level`, departmentsLv2)}
                                        sx={{ flex: 1, marginRight: 2 }}
                                    >
                                        {departmentsLv2.filter(dept => dept.level === 2).map((dept) => (
                                            <MenuItem key={dept.id} value={dept.departmentName}>
                                                {dept.departmentName}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                    <TextField
                                        select
                                        size='small'
                                        label="Department level 3"
                                        value={dpmLv3.name}
                                        onChange={handleDepartmentChange(setDpmLv3, setDepartmentsLv4, () => { }, `/department/{id}/level`, departmentsLv3)}
                                        sx={{ flex: 1, marginRight: 2 }}
                                    >
                                        {departmentsLv3.filter(dept => dept.level === 3).map((dept) => (
                                            <MenuItem key={dept.id} value={dept.departmentName}>
                                                {dept.departmentName}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                    <TextField
                                        select
                                        size='small'
                                        label="Department level 4"
                                        value={dpmLv4.name}
                                        onChange={handleDepartmentChange(setDpmLv4, () => { }, () => { }, `/department/{id}/level`, departmentsLv4)}
                                        sx={{ flex: 1 }}
                                    >
                                        {departmentsLv4.filter(dept => dept.level === 4).map((dept) => (
                                            <MenuItem key={dept.id} value={dept.departmentName}>
                                                {dept.departmentName}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid container spacing={3} sx={{ height: '85%' }}>
                        <Grid item xs={12}>
                            {hasPermission('role', 'view') ? (
                                <RoleTable refresh={refreshTable} />
                            ) : (
                                <Typography>You do not have permission to access</Typography>
                            )}
                        </Grid>
                    </Grid>
                </Box>
                <AddNewPopup open={openAdd} onClose={handleCloseOpenAdd}/>
            </Box>
        </Layout>
    );
}

export default RolePage;
