import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Checkbox, IconButton, TextField, TablePagination, Snackbar, Alert,
    Switch, MenuItem,
    Grid, Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import KeyIcon from '@mui/icons-material/Key';
import { useAppContext } from '@/app/hooks/AppContext';
import apiService from '@/app/untils/api';
import CustomDeleteDialog from '../Home/DeleteDioglog';
import AddNewPopup from './Add';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

interface Role {
    id: string;
    name: string;
}

interface Row {
    id: number;
    full_name: string;
    username: string;
    email: string;
    phone: string;
    role: { name: string };
    jobTitle: string;
    active: boolean;
}

interface ApiResponse {
    data: {
        items: Row[];
        total: number;
    };
}
interface RoleApiResponse {
    data: {
        items: Role[];
    };
}
interface DepartmentTableProps {
    refresh: boolean;
}

type Filters = {
    full_name: string;
    username: string;
    email: string;
    phone: string;
    role: string;
    jobTitle: string;
    active: string;
};

export default function UserTable({ refresh }: DepartmentTableProps) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [rows, setRows] = useState<Row[]>([]);
    const [totalRows, setTotalRows] = useState(0);
    const [selected, setSelected] = useState<number[]>([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openAdd, setOpenAdd] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const { province, dpmLv1, dpmLv2, dpmLv3, dpmLv4, choosed } = useAppContext();
    const [permissions, setPermissions] = useState<any[]>([]);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openEditAtId, setOpenEditAtId] = useState('');

    const [roles, setRoles] = useState<Role[]>([]);
    const [forbidden, setForbidden] = useState(false);

    const [filters, setFilters] = useState<Filters>({
        full_name: '',
        username: '',
        email: '',
        phone: '',
        role: 'All', // default value for role filter
        jobTitle: '',
        active: 'All' // default value for active filter
    });

    useEffect(() => {
        const storedPermissions = localStorage.getItem('permission');
        if (storedPermissions) {
            setPermissions(JSON.parse(storedPermissions));
        }
    }, []);

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

    useEffect(() => {
        fetchRows();
    }, [page, refresh, rowsPerPage, province?.id, dpmLv1?.id, dpmLv2?.id, dpmLv3?.id, dpmLv4?.id, filters]);

    useEffect(() => {
        if (selected.length === 0) handleCloseDelete();
    }, [selected]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const res = await apiService.get<RoleApiResponse>(`role/${choosed.id}/department`);
                setRoles([{ id: 'all', name: 'All' }, ...res.data.data.items]);
            } catch (error) {
                setRoles([{ id: 'all', name: 'All' }]);
            }
        };
        fetchRoles();
    }, [choosed.id]);

    const handleExport = async () => {
        try {
            const response = await apiService.get(`users/${choosed.id}/export`, { responseType: 'blob' });

            if (response) {
                const url = window.URL.createObjectURL(new Blob([response.data as Blob]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'data.xlsx');
                document.body.appendChild(link);
                link.click();
                link.remove();
            }
        } catch (error) {
            console.error('Export failed:', error);
        }
    };

    const fetchRows = async () => {
        if (!province?.id && !dpmLv1?.id && !dpmLv2?.id && !dpmLv3?.id && !dpmLv4?.id) {
            setRows([]);
            return;
        }

        try {
            const searchParams = new URLSearchParams({
                page: (page + 1).toString(),
                limit: rowsPerPage.toString(),
            });

            // Add filters to searchParams
            for (const key in filters) {
                if (filters[key as keyof Filters] !== '' && filters[key as keyof Filters] !== 'All') {
                    searchParams.append(key, filters[key as keyof Filters]);
                }
            }

            const endpoint = `users/${choosed.id}`;
            const response = await apiService.get<ApiResponse>(`${endpoint}?${searchParams.toString()}`);

            const data = response.data;
            console.log('Fetched data:', data.data.items);
            if (data.data.items) {
                setRows(data.data.items);
                setTotalRows(data.data.total);
                setForbidden(false);
            }
        } catch (error: any) {
            if (error.response && error.response.status === 403) {
                setForbidden(true);
            } else {
                setRows([]);
                setTotalRows(0);
            }
        }
    };

    const handleChangeActive = async (id: number) => {
        const updatedRows = rows.map(item =>
            item.id === id ? { ...item, active: !item.active } : item
        );
        const itemToUpdate = updatedRows.find(item => item.id === id);
        const activeStatus = itemToUpdate ? itemToUpdate.active : true;
        console.log(id);
        const res = await apiService.put(`users/${id}/active?active=${activeStatus}`);
        setRows(updatedRows);
    };

    const handleCheckboxClick = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
        event.stopPropagation();
        const selectedIndex = selected.indexOf(id);
        let newSelected: number[] = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }
        setSelected(newSelected);
        if (newSelected.length > 0) {
            handleOpenDelete();
        } else {
            handleCloseDelete();
        }
    };

    const isSelected = (id: number) => selected.indexOf(id) !== -1;

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleDeleteSelected = async () => {
        console.log(selected)
        try {
            const params = new URLSearchParams();
            selected.forEach(id => params.append('ids', id.toString()));

            const response = await apiService.delete(`/users/multiple?${params.toString()}`);

            if (response.status === 200) {
                setSnackbarMessage('Users deleted successfully');
                setSnackbarSeverity('success');
                setSelected([]);
                fetchRows();
            } else {
                setSnackbarMessage('Failed to delete users');
                setSnackbarSeverity('error');
            }
        } catch (error) {
            setSnackbarMessage('Failed to delete users');
            setSnackbarSeverity('error');
        } finally {
            setOpenSnackbar(true);
            setOpenDelete(false);
        }
    };

    const handleOpenDelete = () => {
        setOpenDelete(true);
    };

    const handleCloseDelete = () => {
        setOpenDelete(false);
    };

    const handleOpenAdd = (id: any) => {
        console.log(id);
        setOpenEditAtId(id);
        setOpenAdd(true);
    };

    const handleResetPass = async (id: any) => {
        const res = await apiService.put(`users/${id}/restore-password`);
        console.log(res.status);
        if (res.status === 200)
            alert('Reset thành công');
    };

    const handleCloseOpenAdd = () => {
        setOpenAdd(false);
        fetchRows();
    };

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };

    return (
        <Paper sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
            {forbidden ? (
                <Typography sx={{ padding: '16px', textAlign: 'center', color: 'black' }}>You do not have permission to access</Typography>
            ) : (
                <>
                    <TableContainer sx={{ flexGrow: 1, maxHeight: '70vh', overflow: 'auto' }}>
                        <Table sx={{ width: '100%' }} aria-label="simple table">
                            <TableHead sx={{ background: '#f4f6f8' }}>
                                <TableRow>
                                    <TableCell sx={{ padding: '4px 8px', width: '150px', borderBottom: 'none' }} />
                                    <TableCell sx={{ fontWeight: 'bold', padding: '4px 8px', width: '350px', borderBottom: 'none' }}>Full Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', padding: '4px 8px', width: '190px', borderBottom: 'none' }}>Account</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', padding: '4px 8px', width: '240px', borderBottom: 'none' }}>Email</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', padding: '4px 8px', width: '140px', borderBottom: 'none' }}>Phone</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', padding: '4px 8px', width: '140px', borderBottom: 'none' }}>Role</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', padding: '4px 8px', width: '140px', borderBottom: 'none' }}>Job title</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', padding: '4px 8px', borderBottom: 'none' }}>Active</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ padding: '4px 8px', width: '150px', borderBottom: 'none' }} />
                                    <TableCell sx={{ padding: '4px 8px', width: '350px', borderBottom: 'none' }}>
                                        <TextField size="small" sx={{ background: 'white' }} fullWidth name="full_name" value={filters.full_name} onChange={handleFilterChange} />
                                    </TableCell>
                                    <TableCell sx={{ padding: '4px 8px', width: '190px', borderBottom: 'none' }}>
                                        <TextField size="small" sx={{ background: 'white' }} fullWidth name="username" value={filters.username} onChange={handleFilterChange} />
                                    </TableCell>
                                    <TableCell sx={{ padding: '4px 8px', width: '240px', borderBottom: 'none' }}>
                                        <TextField size="small" sx={{ background: 'white' }} fullWidth name="email" value={filters.email} onChange={handleFilterChange} />
                                    </TableCell>
                                    <TableCell sx={{ padding: '4px 8px', width: '140px', borderBottom: 'none' }}>
                                        <TextField size="small" sx={{ background: 'white' }} fullWidth name="phone" value={filters.phone} onChange={handleFilterChange} />
                                    </TableCell>
                                    <TableCell sx={{ padding: '4px 8px', width: '140px', borderBottom: 'none' }}>
                                        <TextField size="small" select sx={{ background: 'white' }} fullWidth name="role" value={filters.role} onChange={handleFilterChange}>
                                            {roles.map((role) => (
                                                <MenuItem key={role.id} value={role.name}>
                                                    {role.name}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </TableCell>
                                    <TableCell sx={{ padding: '4px 8px', width: '140px', borderBottom: 'none' }}>
                                        <TextField size="small" sx={{ background: 'white' }} fullWidth name="jobTitle" value={filters.jobTitle} onChange={handleFilterChange} />
                                    </TableCell>
                                    <TableCell sx={{ padding: '4px 8px', borderBottom: 'none' }}>
                                        <TextField size="small" select sx={{ background: 'white' }} fullWidth name="active" value={filters.active} onChange={handleFilterChange}>
                                            <MenuItem value={'All'}>All</MenuItem>
                                            <MenuItem value={'true'}>On</MenuItem>
                                            <MenuItem value={'false'}>Off</MenuItem>
                                        </TextField>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.length > 0 ? rows.map((row) => {
                                    const isItemSelected = isSelected(row.id);
                                    return (
                                        <TableRow
                                            key={row.id}
                                            sx={{ height: '45px', marginLeft: '15px', cursor: 'pointer', '&:hover': { backgroundColor: '#f1f1f1' }, borderBottom: '1px solid #e0e0e0' }}
                                            selected={isItemSelected}
                                        >
                                            <TableCell component="th" style={{ display: 'flex', alignItems: 'center' }} sx={{ padding: '4px 8px', paddingLeft: '16px', borderBottom: 'none' }}>
                                                <Checkbox
                                                    checked={isItemSelected}
                                                    onChange={(event) => handleCheckboxClick(event, row.id)}
                                                    disabled={!hasPermission('user', 'delete')}
                                                />
                                                {(
                                                    <IconButton onClick={() => handleOpenAdd(row.id)}
                                                        disabled={!hasPermission('user', 'update')}>
                                                        <EditIcon />
                                                    </IconButton>
                                                )}
                                                {hasPermission('user', 'update') && (
                                                    <IconButton onClick={() => handleResetPass(row.id)}
                                                        disabled={!hasPermission('user', 'update')}>
                                                        <KeyIcon />
                                                    </IconButton>
                                                )}
                                            </TableCell>
                                            <TableCell sx={{ padding: '4px 8px', width: '350px', borderBottom: 'none' }}>{row.full_name}</TableCell>
                                            <TableCell sx={{ padding: '4px 8px', width: '190px', borderBottom: 'none' }}>{row.username}</TableCell>
                                            <TableCell sx={{ padding: '4px 8px', width: '240px', borderBottom: 'none' }}>{row.email}</TableCell>
                                            <TableCell sx={{ padding: '4px 8px', width: '140px', borderBottom: 'none' }}>{row.phone}</TableCell>
                                            <TableCell sx={{ padding: '4px 8px', width: '140px', borderBottom: 'none' }}>{row.role.name}</TableCell>
                                            <TableCell sx={{ padding: '4px 8px', width: '140px', borderBottom: 'none' }}>{row.jobTitle}</TableCell>
                                            <TableCell sx={{ padding: '4px 8px', borderBottom: 'none' }}>
                                                <Switch
                                                    checked={row.active}
                                                    onChange={() => handleChangeActive(row.id)}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    );
                                }) : (
                                    <TableRow>
                                        <TableCell colSpan={8} sx={{ textAlign: 'center', borderBottom: 'none' }}>
                                            No data available
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <div>
                        <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item>
                                { (
                                    <IconButton
                                        sx={{ color: '#919eab', marginLeft: '10px', gap: '10px', fontSize: '14px' }}
                                        onClick={handleExport}
                                        disabled = {!hasPermission('user', 'export')}
                                    >
                                        <FileDownloadOutlinedIcon />
                                        Export Data
                                    </IconButton>
                                )}
                            </Grid>
                            <Grid item>
                                <TablePagination
                                    rowsPerPageOptions={[10 , 25, 50]}
                                    component="div"
                                    count={totalRows}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </Grid>
                        </Grid>
                    </div>
                </>
            )}
            <AddNewPopup open={openAdd} onClose={handleCloseOpenAdd} type='edit' id={openEditAtId} />
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
                <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            <CustomDeleteDialog open={openDelete} handleClose={handleCloseDelete} quantity={selected.length} onDelete={handleDeleteSelected} />
        </Paper>
    );
}
