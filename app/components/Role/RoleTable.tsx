import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import EditIcon from '@mui/icons-material/Edit';
import TablePagination from '@mui/material/TablePagination';
import { Box, Grid, Snackbar, Alert } from '@mui/material';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

import CustomDeleteDialog from '../Home/DeleteDioglog';
import { useAppContext } from '@/app/hooks/AppContext';
import apiService from '@/app/untils/api';
import EditPopup from './Edit';

interface Row {
    id: number;
    code: string;
    name: string;
}

interface ApiResponse {
    data: {
        items: Row[];
        total: number;
    };
}

interface RoleTableProps {
    refresh: boolean;
}

export default function RoleTable({ refresh }: RoleTableProps) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [rows, setRows] = useState<Row[]>([]);
    const [totalRows, setTotalRows] = useState(0);
    const [selected, setSelected] = useState<number[]>([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const { province, dpmLv1, dpmLv2, dpmLv3, dpmLv4, choosed } = useAppContext();

    const [openEdit, setOpenEdit] = useState(false);
    const [id, setId] = useState('');
    const [code, setCode] = useState('');
    const [name, setName] = useState('');

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

    useEffect(() => {
        fetchRows();
    }, [page, rowsPerPage, province?.id, dpmLv1?.id, dpmLv2?.id, dpmLv3?.id, dpmLv4?.id, choosed, refresh, name, code]);

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

            if (code) searchParams.append('code', code);
            if (name) searchParams.append('name', name);

            const endpoint = `role/${choosed.id}/department`;
            const response = await apiService.get<ApiResponse>(`${endpoint}?${searchParams.toString()}`);
            const data = response.data;

            console.log('Fetched data:', data);

            if (data.data.items) {
                setRows(data.data.items);
                setTotalRows(data.data.total);
            }
        } catch (error) {
            setRows([]);
            setTotalRows(0);
        }
    };

    const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCode(event.target.value);
    };

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (rows.length > 0) {
            if (event.target.checked && rows.length > 0) {
                const newSelected = rows.map((row) => row.id);
                setSelected(newSelected);
                if (hasPermission('role', 'delete')) {
                    handleOpenDelete();
                }
                return;
            }
            setSelected([]);
        } else {
            event.target.checked;
        }
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
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
        if (newSelected.length > 0 && hasPermission('role' , 'delete')) {
            handleOpenDelete();
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

    const handleOpenEdit = (id: number) => {
        setId(String(id));
        setOpenEdit(true);
    };

    const handleCloseEdit = () => {
        setOpenEdit(false);
        fetchRows();
    };

    const [openDelete, setOpenDelete] = useState(false);
    const handleCloseOpenDelete = () => {
        setOpenDelete(false);
    };

    useEffect(() => {
        if (selected.length === 0)
            handleCloseOpenDelete();
    }, [selected]);

    const handleOpenDelete = () => {
        setOpenDelete(true);
    };

    const handleDelete = async () => {
        try {
            const ids = { ids: selected };
            console.log({ data: ids })
            const response = await apiService.delete(`/role/delete`, { data: ids });
            console.log(response);

            if (response) {
                if (response.status === 200) {
                    setSnackbarSeverity('success');
                    setSnackbarMessage('Delete success!');
                }
            } else {
                setSnackbarSeverity('error');
                setSnackbarMessage('Error!');
            }

            setOpenSnackbar(true);
            setSelected([]);
            fetchRows();
        } catch (error) {
            console.error('Failed to delete rows:', error);
            setSnackbarSeverity('error');
            setSnackbarMessage('Xóa không thành công!');
            setOpenSnackbar(true);
        }
    };

    const handleExport = async () => {
        try {
            const response = await apiService.get(`role/${choosed.id}/export`, { responseType: 'blob' });

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

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Paper sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
            <TableContainer sx={{ flexGrow: 1 }}>
                <Table sx={{ width: '100%' }} aria-label="simple table">
                    <TableHead sx={{ background: '#f4f6f8' }}>
                        <TableRow>
                            <TableCell sx={{ borderBottom: 'none' }}>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px', fontWeight: 'bold', width: '120px' }}>
                                    <Checkbox
                                        indeterminate={selected.length > 0 && rows.length > 0 && selected.length < rows.length}
                                        checked={rows.length > 0 && selected.length === rows.length}
                                        onChange={handleSelectAllClick}
                                        disabled={!hasPermission('role', 'delete')}
                                    />
                                </div>
                            </TableCell>
                            <TableCell sx={{ borderBottom: 'none' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', fontWeight: 'bold', width: '700px' }}>
                                    <span>Role Code</span>
                                    <TextField size="small" sx={{ background: 'white' }} value={code} onChange={handleCodeChange} />
                                </div>
                            </TableCell>
                            <TableCell sx={{ borderBottom: 'none' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', fontWeight: 'bold', width: '600px' }}>
                                    <span>Role Name</span>
                                    <TextField size="small" sx={{ background: 'white' }} value={name} onChange={handleNameChange} />
                                </div>
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
                                    <TableCell component="th" scope="row" style={{ display: 'flex', alignItems: 'center' }} sx={{ padding: '4px 8px', paddingLeft: '16px', borderBottom: 'none' }}>
                                        <Checkbox
                                            checked={isItemSelected}
                                            onChange={(event) => handleCheckboxClick(event, row.id)}
                                            disabled={!hasPermission('role' , 'delete')}
                                        />
                                        { (
                                            <IconButton onClick={(event) => { event.stopPropagation(); handleOpenEdit(row.id); }}
                                            disabled = {!hasPermission('role', 'update')}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        )}
                                    </TableCell>
                                    <TableCell sx={{ padding: '4px 8px', paddingLeft: '16px', borderBottom: 'none' }}>
                                        {row.code}
                                    </TableCell>
                                    <TableCell sx={{ padding: '4px 8px', paddingLeft: '16px', borderBottom: 'none' }}>
                                        {row.name}
                                    </TableCell>
                                </TableRow>
                            );
                        }) : (
                            <TableRow>
                                <TableCell colSpan={3} sx={{ textAlign: 'center', borderBottom: 'none' }}>
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
                                disabled = {!hasPermission('role', 'export')}
                            >
                                <FileDownloadOutlinedIcon />
                                Export Data
                            </IconButton>
                        )}
                    </Grid>
                    <Grid item>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 50]}
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
            <CustomDeleteDialog open={openDelete} handleClose={handleCloseOpenDelete} quantity={selected.length} onDelete={handleDelete} />
            <EditPopup open={openEdit} onClose={handleCloseEdit} roleId={id || ''} />
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Paper>
    );
}
