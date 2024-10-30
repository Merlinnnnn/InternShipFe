import React, { useEffect, useState } from 'react';
import { Box, CssBaseline, Grid, Typography, Toolbar, AppBar, Button, TextField, MenuItem } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import useLocate from '../../hooks/useLocate';
import { useAppContext } from '../../hooks/AppContext';
import apiService from '../../untils/api';
import Layout from '../layout';
import UserTable from './UserTable';
import AddNewPopup from './Add';
import ImportDialog from './Import';

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
    const { roles } = useAppContext();
    const [departmentsLv1, setDepartmentsLv1] = useState<Department[]>([]);
    const [departmentsLv2, setDepartmentsLv2] = useState<Department[]>([]);
    const [departmentsLv3, setDepartmentsLv3] = useState<Department[]>([]);
    const [departmentsLv4, setDepartmentsLv4] = useState<Department[]>([]);
    const [permissions, setPermissions] = useState<any[]>([]);
    const [dept, setDept] = useState<Department>();
    const [disable, setDisable] = useState<String[]>([]);
    const {
        province, setProvince,
        dpmLv1, setDpmLv1,
        dpmLv2, setDpmLv2,
        dpmLv3, setDpmLv3,
        dpmLv4, setDpmLv4,
        choosed, setChoosed
    } = useAppContext();

    useEffect(() => {
        const storedPermissions = localStorage.getItem('permission');
        const dept = localStorage.getItem('dept');
        if (storedPermissions) {
            setPermissions(JSON.parse(storedPermissions));
        }
        if (dept) {
            setDept(JSON.parse(dept));
        }
    }, []);

    useEffect(() => {
        if (dept) {
            if (dept.level === 1) {
                fetchDepartments(`/department/${dept.id}`, setDepartmentsLv1, 1);
                setDpmLv1({ id: dept.id.toString(), name: dept.departmentName });
                setChoosed({ id: dept.id.toString(), name: dept.departmentName });
                setDisable(['Province', 'DeptLv1']);
            }
            if (dept.level === 2 ) {
                fetchDepartments(`/department/${dept.parentId}/level`, setDepartmentsLv2, 2);
                setDpmLv2({ id: dept.id.toString(), name: dept.departmentName });
                setChoosed({ id: dept.id.toString(), name: dept.departmentName });
                setDisable(['Province', 'DeptLv1', 'DeptLv2']);
            }
            if (dept.level === 3 ) {
                fetchDepartments(`/department/${dept.parentId}/level`, setDepartmentsLv3, 3);
                setDpmLv3({ id: dept.id.toString(), name: dept.departmentName });
                setChoosed({ id: dept.id.toString(), name: dept.departmentName });
                setDisable(['Province', 'DeptLv1', 'DeptLv2', 'DeptLv3']);
            }
            if (dept.level === 4 ) {
                fetchDepartments(`/department/${dept.parentId}/level`, setDepartmentsLv4, 4);
                setDpmLv4({ id: dept.id.toString(), name: dept.departmentName });
                setChoosed({ id: dept.id.toString(), name: dept.departmentName });
                setDisable(['Province', 'DeptLv1', 'DeptLv2', 'DeptLv3', 'DeptLv4']);
            }
        }
    }, [dept]);

    useEffect(() => {
        if (dpmLv1?.id) {
            fetchDepartments(`/department/${dpmLv1.id}/level`, setDepartmentsLv2, 2);
        }
        if (dpmLv2?.id) {
            fetchDepartments(`/department/${dpmLv2.id}/level`, setDepartmentsLv3, 3);
        }
        if (dpmLv3?.id) {
            fetchDepartments(`/department/${dpmLv3.id}/level`, setDepartmentsLv4, 4);
        }
    }, [dpmLv1?.id, dpmLv2?.id, dpmLv3?.id]);

    const addAllOption = (departments: Department[]) => {
        return [{ id: 0, departmentName: 'All', province: { id: '' }, district: '', ward: '', level: 0, name: '', parentId: null }, ...departments];
    };

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


    const { cities } = useLocate();
    const isDisabled = (item: any) => {
        return disable.includes(item);
    };

    const handleCloseOpenAdd = () => {
        setOpenAdd(false);
        setRefreshTable(prev => !prev);
    };

    const handleOpenAdd = () => {
        setOpenAdd(true);
        console.log(dept?.province.id);
    };

    const handleCloseImport = () => {
        setOpenImport(false);
        setRefreshTable(prev => !prev);
    };

    const handleOpenImport = () => {
        setOpenImport(true);
    };

    const fetchDepartments = async (url: string, setter: Function, level: number) => {
        try {
            const response = await apiService.get<ApiResponse>(url);
            const data: ApiResponse = response.data;
            const filteredDepartments = data.data.items.filter(dept => dept.level === level);
            setter(addAllOption(filteredDepartments));
        } catch (error) {
            console.error('Failed to fetch departments:', error);
            setter(addAllOption([]));
        }
    };

    const handleProvinceChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedProvinceName = event.target.value;
        const selectedProvince = cities.find(city => city.name === selectedProvinceName);
        if (selectedProvince) {
            setProvince({ id: selectedProvince.id, name: selectedProvince.name });
            await fetchDepartments(`/department/${selectedProvince.id}`, setDepartmentsLv1, 1);
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
        if (selectedDepartmentName === 'All') {
            setter({ id: '', name: '' });
            if(setter === setDpmLv2){
                setChoosed({ id: dpmLv1.id, name: dpmLv1.name });
            }
            if(setter === setDpmLv3){
                setChoosed({ id: dpmLv2.id, name: dpmLv2.name });
            }
            if(setter === setDpmLv4){
                setChoosed({ id: dpmLv3.id, name: dpmLv3.name });
            }
            levelSetter([]);
            nextLevelSetter([]);
        } else {
            const selectedDepartment = departments.find(dept => dept.departmentName === selectedDepartmentName);
            if (selectedDepartment) {
                setter({ id: selectedDepartment.id, name: selectedDepartment.departmentName });
                setChoosed({ id: String(selectedDepartment.id), name: selectedDepartment.departmentName });
                const url = urlTemplate.replace('{id}', String(selectedDepartment.id));
                await fetchDepartments(url, levelSetter, selectedDepartment.level + 1);
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
        }
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
                            height: '57px'
                        }}>
                        <Toolbar>
                            <Typography
                                sx={{
                                    fontSize: '18px',
                                    fontWeight: '700',
                                    color: 'black',
                                    flexGrow: 1
                                }}>
                                User Management
                            </Typography>
                            {(
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    startIcon={<FileUploadOutlinedIcon />}
                                    onClick={handleOpenImport}
                                    disabled={!hasPermission('user', 'create') || choosed.id == ''}
                                    sx={{
                                        textTransform: 'none',
                                        width: '125px',
                                        marginRight: '25px',
                                        border: '2px solid rgba(41, 121, 255, 0.5)',
                                    }}
                                >
                                    Import
                                </Button>
                            )}
                            {(
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<AddIcon />}
                                    onClick={handleOpenAdd}
                                    sx={{ textTransform: 'none', width: '125px' }}
                                    disabled={!hasPermission('user', 'create')}
                                >
                                    Add New
                                </Button>
                            )}
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
                                        disabled={isDisabled('Province')}
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
                                        disabled={isDisabled('DeptLv1')}
                                    >
                                        {departmentsLv1.map((dept) => (
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
                                        disabled={isDisabled('DeptLv2')}
                                    >
                                        {departmentsLv2.map((dept) => (
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
                                        disabled={isDisabled('DeptLv3')}
                                    >
                                        {departmentsLv3.map((dept) => (
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
                                        disabled={isDisabled('DeptLv4')}
                                    >
                                        {departmentsLv4.map((dept) => (
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
                        <Grid item xs={12} sx={{ flexGrow: 1 }}>
                            {hasPermission('user', 'view') ? (
                                <UserTable refresh={refreshTable} />
                            ) : (
                                <Typography>You do not have permission to access</Typography>
                            )}
                        </Grid>
                    </Grid>
                </Box>
                <AddNewPopup open={openAdd} onClose={handleCloseOpenAdd} type='add' />
                <ImportDialog open={openImport} handleClose={handleCloseImport} />
            </Box>
        </Layout>
    );
}

export default HomePage;
