import React, { useEffect, useState } from 'react';
import { Box, CssBaseline, Grid, Typography, Toolbar, AppBar, Button, TextField, MenuItem } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import useLocate from '../../hooks/useLocate';
import { useAppContext } from '../../hooks/AppContext';
import apiService from '../../untils/api';
import Layout from '../layout';
import ReportEditTable from './ReportEditTable';
import FullScreenDialog from './ViewDiolog';
// import AddNewPopup from './Add';
// import ImportDialog from './Import';


interface Department {
    id: number;
    departmentName: string;
    province: {
        id: string;
        name: string
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

interface ApiResponseData {
    url: string;
}

const HomePage: React.FC = () => {
    const [year, setYear] = useState('');
    const [years, setYears] = useState<string[]>([]);
    const [openDialog, setOpenDiolog] = useState(false);
    const [url, setUrl] = useState('');
    const [departmentsLv1, setDepartmentsLv1] = useState<Department[]>([]);
    const [departmentsLv2, setDepartmentsLv2] = useState<Department[]>([]);
    const [departmentsLv3, setDepartmentsLv3] = useState<Department[]>([]);
    const [departmentsLv4, setDepartmentsLv4] = useState<Department[]>([]);
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
        const maxYear = Math.max(...years.map(year => parseInt(year, 10)));
        setYear(maxYear.toString());
    }, [years]);
    useEffect(() => {
        const storedPermissions = localStorage.getItem('permission');
        const dept = localStorage.getItem('dept');
        fetchYears();
        if (dept) {
            const temp = JSON.parse(dept);
            setChoosed({ id: temp.id.toString(), name: temp.departmentName });
        }
        if (dept) {
            setDept(JSON.parse(dept));
        }
    }, []);
    const fetchYears = async () => {
        try {
            const response = await apiService.get('/report-config/report-years');
            const years = response.data as string[];
            //years.unshift("All");
            setYears(years);
            console.log(years);
        } catch (error) {
            console.error("Failed to fetch years:", error);
        }
    };


    useEffect(() => {
        const fetchParentDepartments = async () => {
            if (dept) {
                try {
                    const response = await apiService.get<Department[]>(`department/${dept.id}/get-parents`);
                    const parents: Department[] = response.data;

                    const departmentsLv1: Department[] = [];
                    const departmentsLv2: Department[] = [];
                    const departmentsLv3: Department[] = [];
                    const departmentsLv4: Department[] = [];
                    parents.forEach((parentDept: Department) => {
                        const departmentInfo: Department = {
                            id: parentDept.id,
                            departmentName: parentDept.departmentName,
                            province: parentDept.province || { id: '' },
                            district: parentDept.district || '',
                            ward: parentDept.ward || '',
                            level: parentDept.level,
                            name: parentDept.name || '',
                            parentId: parentDept.parentId || null
                        };
                        switch (parentDept.level) {
                            case 1:

                                setDpmLv1({ id: departmentInfo.id.toString(), name: departmentInfo.departmentName });
                                fetchDepartmentDetails(departmentInfo.id.toString());
                                break;
                            case 2:
                                setDpmLv2({ id: departmentInfo.id.toString(), name: departmentInfo.departmentName });
                                break;
                            case 3:
                                setDpmLv3({ id: departmentInfo.id.toString(), name: departmentInfo.departmentName });
                                break;
                            case 4:
                                setDpmLv4({ id: departmentInfo.id.toString(), name: departmentInfo.departmentName });
                                break;
                            default:
                                break;
                        }
                    });
                    setDepartmentsLv1(departmentsLv1);
                    setDepartmentsLv2(departmentsLv2);
                    setDepartmentsLv3(departmentsLv3);
                    setDepartmentsLv4(departmentsLv4);
                    setChoosed({ id: dept.id.toString(), name: dept.departmentName });
                    const disableLevels = parents.map(parentDept => `DeptLv${parentDept.level}`);
                    setDisable(['Province', ...disableLevels]);
                } catch (error) {
                    console.error('Error fetching parent departments:', error);
                }
            }
        };

        fetchParentDepartments();
    }, [dept]);

    const fetchDepartmentDetails = async (departmentId: string) => {
        try {
            const res = await apiService.get<Department>(`/department/${departmentId}/detail`);
            const departmentDetail = res.data;
            if (departmentDetail && departmentDetail.province) {
                setProvince({
                    id: departmentDetail.province.id,
                    name: departmentDetail.province.name
                });
            }
        } catch (error) {
            console.error('Failed to fetch department details:', error);
        }
    };

    useEffect(() => {
        fetchDepartments(`/department/${province.id}`, setDepartmentsLv1, 1);
        if (dpmLv1?.id) {
            fetchDepartments(`/department/${dpmLv1.id}/level`, setDepartmentsLv2, 2);
        }
        if (dpmLv2?.id) {
            fetchDepartments(`/department/${dpmLv2.id}/level`, setDepartmentsLv3, 3);
        }
        if (dpmLv3?.id) {
            fetchDepartments(`/department/${dpmLv3.id}/level`, setDepartmentsLv4, 4);
        }
    }, [dpmLv1?.id, dpmLv2?.id, dpmLv3?.id, province.id]);

    const addAllOption = (departments: Department[]) => {
        return [{ id: 0, departmentName: 'All', province: { id: '' }, district: '', ward: '', level: 0, name: '', parentId: null }, ...departments];
    };

    const isDisabled = (item: any) => {
        return disable.includes(item);
    };

    const handleCloseDialog = () => {
        setOpenDiolog(false);
    };

    const handleOpenDiolog = async () => {
        const res = await apiService.get<ApiResponseData>(`report/synthesis/${year}`);
        setUrl(res.data.url);
        console.log(res.data.url)
        setOpenDiolog(true);
    }

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

    const handleDepartmentChange = (setter: Function, levelSetter: Function, nextLevelSetter: Function, urlTemplate: string, departments: Department[]) => async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDepartmentName = event.target.value;
        if (selectedDepartmentName === 'All') {
            setter({ id: '', name: '' });
            if (setter === setDpmLv2) {
                setChoosed({ id: dpmLv1.id, name: dpmLv1.name });
            }
            if (setter === setDpmLv3) {
                setChoosed({ id: dpmLv2.id, name: dpmLv2.name });
            }
            if (setter === setDpmLv4) {
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
                                Report Manager
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', marginBottom: '10px' }}>
                                <TextField
                                    size="small"
                                    sx={{ background: 'white', marginTop: '10px', marginBottom: '10px', width: '150px' }}
                                    select
                                    label="Years"
                                    onChange={(e) => setYear(e.target.value)}
                                    value={year}
                                >
                                    {years.map((year, index) => (
                                        <MenuItem key={index} value={year}>
                                            {year}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <Button style={{
                                    color: "#1A73E8",
                                    border: "1px solid #c7d6ff",
                                    borderRadius: "8px",
                                    padding: "8px 16px",
                                    fontWeight: "bold",
                                    fontSize: "14px",
                                    textTransform: "none"
                                }}
                                onClick={handleOpenDiolog}
                                >
                                    Synthesis Report
                                </Button>

                            </Box>
                        </Toolbar>
                    </AppBar>
                    <Grid container spacing={3} sx={{ mt: 2 }}>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', marginBottom: 2 }}>
                                <Box sx={{ display: 'flex', flex: 1, justifyContent: 'space-between' }}>
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
                                <ReportEditTable year={year} />
                        </Grid>
                    </Grid>
                </Box>
                <FullScreenDialog open={openDialog} onClose={handleCloseDialog} url={url}/>
            </Box>
        </Layout>
    );
}

export default HomePage;
