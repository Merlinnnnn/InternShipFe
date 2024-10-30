import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Checkbox, IconButton, TextField, TablePagination, Grid, Snackbar, Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import CustomDeleteDialog from './DeleteDioglog';
import EditDialog from './EditDiolog';
import { useAppContext } from '@/app/hooks/AppContext';
import apiService from '@/app/untils/api';

interface Row {
    id: number;
    departmentName: string;
    level: string;
    district: string;
    ward: string;
}

interface ApiResponse {
    data: {
        items: Row[];
        total: number;
    };
}

interface DepartmentTableProps {
    refresh: boolean;
}

export default function DepartmentTable({ refresh }: DepartmentTableProps) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [rows, setRows] = useState<Row[]>([]);
    const [totalRows, setTotalRows] = useState(0);
    const [selected, setSelected] = useState<number[]>([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const { province, dpmLv1, dpmLv2, dpmLv3, dpmLv4 } = useAppContext();

    const [openEdit, setOpenEdit] = useState(false);
    const [selectedRow, setSelectedRow] = useState<Row | null>(null);
    const [departmentName, setDepartmentName] = useState('');
    const [level, setLevel] = useState('');
    const [district, setDistrictName] = useState('');
    const [ward, setWardName] = useState('');

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
            permission.subject === 'department' && permission.action === null 
        )) {
            return true;
        }
        return permissions.some(permission => 
            permission.subject === subject && permission.action === action 
        );
    };

    useEffect(() => {
        fetchRows();
    }, [page, rowsPerPage, province?.id, dpmLv1?.id, dpmLv2?.id, dpmLv3?.id, dpmLv4?.id, departmentName, level, district, ward]);

    // Cập nhật hàm fetchRows để sử dụng apiService
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

            if (departmentName) searchParams.append('departmentName', departmentName);
            if (level) searchParams.append('level', level);
            if (district) searchParams.append('district', district);
            if (ward) searchParams.append('ward', ward);

            let endpoint = '';

            if (dpmLv4?.id) {
                endpoint = `/department/${dpmLv4.id}/level`;
            } else if (dpmLv3?.id) {
                endpoint = `/department/${dpmLv3.id}/level`;
            } else if (dpmLv2?.id) {
                endpoint = `/department/${dpmLv2.id}/level`;
            } else if (dpmLv1?.id) {
                endpoint = `/department/${dpmLv1.id}/level`;
            } else {
                endpoint = `/department/${province.id}`;
            }

            const response = await apiService.get<ApiResponse>(`${endpoint}?${searchParams}`);

            if (response.status !== 200) {
                throw new Error('Network response was not ok');
            }

            const data = response.data;
            console.log('Fetched data:', data);

            if (data && data.data && data.data.items) {
                setRows(data.data.items);
                setTotalRows(data.data.total);
            } else {
                setRows([]);
                setTotalRows(0);
            }
        } catch (error) {
            console.error('Error fetching data: ', error);
            setRows([]);
            setTotalRows(0);
        }
    };

    const handleDepartmentNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDepartmentName(event.target.value);
    };

    const handleLevelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLevel(event.target.value);
    };

    const handleDistrictChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDistrictName(event.target.value);
    };

    const handleWardChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setWardName(event.target.value);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (rows.length > 0) {
            if (event.target.checked) {
                const newSelected = rows.map((row) => row.id);
                setSelected(newSelected);
                if (hasPermission('department', 'delete')) {
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
        if (newSelected.length > 0 && hasPermission('department', 'delete')) {
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

    const handleOpenEdit = (row: Row) => {
        setSelectedRow(row);
        setOpenEdit(true);
    };

    const handleCloseEdit = () => {
        setOpenEdit(false);
        setSelectedRow(null);
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
            let response;
            if (selected.length === 1) {

                const id = selected[0];
                response = await apiService.delete(`/department/${id}`);
            } else if (selected.length > 1) {
                const ids = selected.join(',');
                response = await apiService.delete(`/department/multiple`, { params: { ids } });
            }

            if (response) {
                if (response.status === 200) {
                    setSnackbarSeverity('success');
                    setSnackbarMessage('Delete success!');
                } else if (response.status === 500) {
                    setSnackbarSeverity('error');
                    setSnackbarMessage('Department lv1 that has child departments cannot be deleted');
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
            setSnackbarMessage('Can not delete!');
            setOpenSnackbar(true);
        }
    };

    const handleExport = async () => {
        if (!province?.id && !dpmLv1?.id && !dpmLv2?.id && !dpmLv3?.id && !dpmLv4?.id) {
            console.error('No data to export');
            return;
        }
        try {
            let response;
            if (dpmLv4?.id) {
                response = await apiService.get<Blob>(`/department/level4/${dpmLv4.id}/download`, { responseType: 'blob' });
            } else if (dpmLv3?.id) {
                response = await apiService.get<Blob>(`/department/level3/${dpmLv3.id}/download`, { responseType: 'blob' });
            } else if (dpmLv2?.id) {
                response = await apiService.get<Blob>(`/department/level2/${dpmLv2.id}/download`, { responseType: 'blob' });
            } else if (dpmLv1?.id) {
                response = await apiService.get<Blob>(`/department/level1/${dpmLv1.id}/download`, { responseType: 'blob' });
            } else {
                response = await apiService.get<Blob>(`/department/province/${province.id}/download`, { responseType: 'blob' });
            }

            if (response.status === 200) {
                const blob = response.data;
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'data.xlsx';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } else {
                console.error('Export failed');
            }
        } catch (error) {
            console.error('Export error:', error);
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
                            <TableCell>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px', fontWeight: 'bold' }}>
                                    <Checkbox
                                        indeterminate={selected.length > 0 && rows.length > 0 && selected.length < rows.length}
                                        checked={rows.length > 0 && selected.length === rows.length}
                                        onChange={handleSelectAllClick}
                                        disabled={!hasPermission('department', 'delete')}
                                    />
                                    <span>Action</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div style={{ display: 'flex', flexDirection: 'column', fontWeight: 'bold', width: '800px' }}>
                                    <span>Department Name</span>
                                    <TextField size="small" fullWidth sx={{ background: 'white' }} value={departmentName} onChange={handleDepartmentNameChange} />
                                </div>
                            </TableCell>
                            <TableCell>
                                <div style={{ display: 'flex', flexDirection: 'column', fontWeight: 'bold', width: '160px' }}>
                                    <span>Level</span>
                                    <TextField size="small" sx={{ background: 'white' }} value={level} onChange={handleLevelChange} />
                                </div>
                            </TableCell>
                            <TableCell>
                                <div style={{ display: 'flex', flexDirection: 'column', fontWeight: 'bold', width: '160px' }}>
                                    <span>District</span>
                                    <TextField size="small" sx={{ background: 'white' }} value={district} onChange={handleDistrictChange} />
                                </div>
                            </TableCell>
                            <TableCell>
                                <div style={{ display: 'flex', flexDirection: 'column', fontWeight: 'bold', width: '160px' }}>
                                    <span>Ward</span>
                                    <TextField size="small" sx={{ background: 'white' }} value={ward} onChange={handleWardChange} />
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
                                            disabled={!hasPermission('department' , 'delete')}
                                        />
                                        {(
                                            <IconButton onClick={(event) => { event.stopPropagation(); handleOpenEdit(row); }}
                                            disabled= {!hasPermission('department', 'update')}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        )}
                                    </TableCell>
                                    <TableCell sx={{ padding: '4px 8px', paddingLeft: '16px', borderBottom: 'none' }}>
                                        {row.departmentName}
                                    </TableCell>
                                    <TableCell sx={{ padding: '4px 8px', paddingLeft: '16px', borderBottom: 'none' }}>
                                        {row.level}
                                    </TableCell>
                                    <TableCell sx={{ padding: '4px 8px', paddingLeft: '16px', borderBottom: 'none' }}>
                                        {row.district}
                                    </TableCell>
                                    <TableCell sx={{ padding: '4px 8px', paddingLeft: '16px', borderBottom: 'none' }}>
                                        {row.ward}
                                    </TableCell>
                                </TableRow>
                            );
                        }) : (
                            <TableRow>
                                <TableCell colSpan={5} sx={{ textAlign: 'center', borderBottom: 'none' }}>
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
                                disabled = {!hasPermission('department', 'export')}
                            >
                                <FileDownloadOutlinedIcon />
                                Export Data
                            </IconButton>
                        )}
                    </Grid>
                    <Grid item>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 50 ]}
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
            <EditDialog
                open={openEdit}
                handleClose={handleCloseEdit}
                initialData={selectedRow ? {
                    id: selectedRow.id,
                    province: province,
                    district: { id: '', name: selectedRow.district },
                    ward: { id: '', name: selectedRow.ward },
                    name: selectedRow.departmentName
                } : {
                    id: 0,
                    province: { id: '', name: '' },
                    district: { id: '', name: '' },
                    ward: { id: '', name: '' },
                    name: ''
                }}
            />
            <CustomDeleteDialog open={openDelete} handleClose={handleCloseOpenDelete} quantity={selected.length} onDelete={handleDelete} />
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
