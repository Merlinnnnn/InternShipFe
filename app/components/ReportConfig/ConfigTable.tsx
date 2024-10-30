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
import { Box, Grid, Snackbar, Alert, Switch, MenuItem } from '@mui/material';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

import CustomDeleteDialog from '../Home/DeleteDioglog';
import { useAppContext } from '@/app/hooks/AppContext';
import apiService from '@/app/untils/api';
import EditPopup from './PopUpDiolog';

interface Row {
    id: number,
    reportName: string,
    reportYear: number,
    reportPeriod: string,
    startTime: string,
    endTime: string,
    status: boolean
}

interface ApiResponse {
    code: number;
    data: {
        currentPage: number;
        items: Row[];
        nextPage: number | null;
        prevPage: number | null;
        total: number;
    };
    message: string;
}


interface ConfigTableProps {
    refresh: boolean;
}

export default function ConfigTable({ refresh }: ConfigTableProps) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [rows, setRows] = useState<Row[]>([]);
    const [totalRows, setTotalRows] = useState(0);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const [idEdit, setIdEdit] = useState<number | null>(null);


    const [openEdit, setOpenEdit] = useState(false);
    const [name, setName] = useState('');


    const [reportYearFilter, setReportYearFilter] = useState<string>('');
    const [reportNameFilter, setReportNameFilter] = useState<string>('');
    const [reportPeriodFilter, setReportPeriodFilter] = useState<string>('');
    const [startTimeFilter, setStartTimeFilter] = useState<string>('');
    const [endTimeFilter, setEndTimeFilter] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('');


    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const handleOpenEdit = (id: number) => {
        console.log(id);
        setIdEdit(id);
        setOpenEdit(true);
    };
    const handleCloseEdit = () => {
        setOpenEdit(false);
        fetchRow();
    };
    const handleChangeActive = async (id: number) => {
        const updatedRows = rows.map(item =>
            item.id === id ? { ...item, status: !item.status } : item
        );
        const itemToUpdate = updatedRows.find(item => item.id === id);
        const activeStatus = itemToUpdate ? itemToUpdate.status : true;

        const res = await apiService.put(`report-config/set-status/${id}?status=${activeStatus}`);
        setRows(updatedRows);
        console.log(res);
    }
    function convertDateFormat(inputDate: string): string {
        const [day, month, year] = inputDate.split('/');
        return `${year}-${month}-${day}`;
    }
    const fetchRow = async () => {
        try {
            const queryParams = new URLSearchParams();

            if (reportYearFilter) queryParams.append('reportYear', reportYearFilter);
            if (reportNameFilter) queryParams.append('reportName', reportNameFilter);
            if (reportPeriodFilter) queryParams.append('reportPeriod', reportPeriodFilter);
            if (startTimeFilter) queryParams.append('startTime', convertDateFormat(startTimeFilter));
            if (endTimeFilter) queryParams.append('endTime', convertDateFormat(endTimeFilter));
            if (statusFilter) queryParams.append('status', statusFilter);

            const res = await apiService.get<ApiResponse>(`/report-config?${queryParams.toString()}`);
            console.log(res);
            setRows(res.data.data.items);
            setTotalRows(res.data.data.total);
        } catch (error) {
            console.error("Failed to fetch rows:", error);
        }
    };
    const convertDateToApi = (date: string): string => {
        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year}`;
    }


    useEffect(() => {
        fetchRow();
    }, [refresh, reportYearFilter, reportNameFilter, reportPeriodFilter, startTimeFilter, endTimeFilter, statusFilter]);
    
    return (
        <Paper sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
            <TableContainer sx={{ flexGrow: 1, maxHeight: '80vh', autoflow: 'auto' }}>
                <Table sx={{ width: '100%' }} aria-label="simple table">
                    <TableHead sx={{ background: '#f4f6f8' }}>
                        <TableRow>
                            <TableCell sx={{ borderBottom: 'none', padding: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '50px', fontWeight: 'bold', width: '100px' }}>
                                    Thao Tác
                                </div>
                            </TableCell>
                            <TableCell sx={{ borderBottom: 'none', padding: '8px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', fontWeight: 'bold', width: '100px' }}>
                                    <span>Năm báo cáo</span>
                                    <TextField
                                        size="small"
                                        sx={{ background: 'white', marginTop: '10px' }}
                                        value={reportYearFilter}
                                        onChange={(e) => setReportYearFilter(e.target.value)}
                                    />
                                </div>
                            </TableCell>
                            <TableCell sx={{ borderBottom: 'none', padding: '8px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', fontWeight: 'bold', width: '400px' }}>
                                    <span>Tên báo cáo</span>
                                    <TextField
                                        size="small"
                                        sx={{ background: 'white', marginTop: '10px' }}
                                        value={reportNameFilter}
                                        onChange={(e) => setReportNameFilter(e.target.value)}
                                        select
                                    >
                                        <MenuItem value="Báo cáo ATVSLĐ">Báo cáo ATVSLĐ</MenuItem>
                                    </TextField>
                                </div>
                            </TableCell>
                            <TableCell sx={{ borderBottom: 'none', padding: '8px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', fontWeight: 'bold', width: '200px' }}>
                                    <span>Kỳ báo cáo</span>
                                    <TextField
                                        size="small"
                                        sx={{ background: 'white', marginTop: '10px' }}
                                        value={reportPeriodFilter}
                                        onChange={(e) => setReportPeriodFilter(e.target.value)}
                                        select
                                    >
                                        <MenuItem value="6 tháng">6 tháng</MenuItem>
                                        <MenuItem value="Cả năm">Cả năm</MenuItem>
                                    </TextField>
                                </div>
                            </TableCell>
                            <TableCell sx={{ borderBottom: 'none', padding: '8px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', fontWeight: 'bold', width: '200px' }}>
                                    <span>Thời gian bắt đầu</span>
                                    <TextField
                                        size="small"
                                        sx={{ background: 'white', marginTop: '10px' }}
                                        value={startTimeFilter}
                                        onChange={(e) => setStartTimeFilter(e.target.value)}
                                        placeholder='dd/MM/yyyy'
                                    />
                                </div>
                            </TableCell>
                            <TableCell sx={{ borderBottom: 'none', padding: '8px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', fontWeight: 'bold', width: '200px' }}>
                                    <span>Thời gian kết thúc</span>
                                    <TextField
                                        size="small"
                                        sx={{ background: 'white', marginTop: '10px' }}
                                        value={endTimeFilter}
                                        onChange={(e) => setEndTimeFilter(e.target.value)}
                                        placeholder='dd/MM/yyyy'
                                    />
                                </div>
                            </TableCell>
                            <TableCell sx={{ borderBottom: 'none', padding: '8px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', fontWeight: 'bold', width: '150px' }}>
                                    <span>Trạng thái</span>
                                    <TextField
                                        size="small"
                                        sx={{ background: 'white', marginTop: '10px' }}
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        select
                                    >
                                        <MenuItem value="true">Active</MenuItem>
                                        <MenuItem value="false">Inactive</MenuItem>
                                    </TextField>
                                </div>
                            </TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.length > 0 ? rows.map((row) => {

                            return (
                                <TableRow
                                    key={row.id}
                                    sx={{ height: '45px', marginLeft: '15px', cursor: 'pointer', '&:hover': { backgroundColor: '#f1f1f1' }, borderBottom: '1px solid #e0e0e0' }}
                                >
                                    <TableCell component="th" scope="row" style={{ display: 'flex', alignItems: 'center' }} sx={{ padding: '4px 8px', paddingLeft: '16px', borderBottom: 'none' }}>
                                        {(
                                            <IconButton onClick={() => handleOpenEdit(row.id)}>
                                                <EditIcon />
                                            </IconButton>
                                        )}
                                    </TableCell>
                                    <TableCell sx={{ padding: '4px 8px', paddingLeft: '16px', borderBottom: 'none' }}>
                                        {row.reportYear}
                                    </TableCell>
                                    <TableCell sx={{ padding: '4px 8px', paddingLeft: '16px', borderBottom: 'none' }}>
                                        {row.reportName}
                                    </TableCell>
                                    <TableCell sx={{ padding: '4px 8px', paddingLeft: '16px', borderBottom: 'none' }}>
                                        {row.reportPeriod}
                                    </TableCell>
                                    <TableCell sx={{ padding: '4px 8px', paddingLeft: '16px', borderBottom: 'none' }}>
                                        {convertDateToApi(row.startTime)}
                                    </TableCell>
                                    <TableCell sx={{ padding: '4px 8px', paddingLeft: '16px', borderBottom: 'none' }}>
                                        {convertDateToApi(row.endTime)}
                                    </TableCell>
                                    <TableCell sx={{ padding: '4px 8px', paddingLeft: '16px', borderBottom: 'none' }}>
                                        <Switch
                                            checked={row.status}
                                            onChange={() => handleChangeActive(row.id)}
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        }) : (
                            <TableRow>
                                <TableCell colSpan={7} sx={{ textAlign: 'center', borderBottom: 'none' }}>
                                    No data available
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <div>
                <Grid container alignItems="center" justifyContent="flex-end">
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
            <EditPopup
                open={openEdit}
                onClose={handleCloseEdit}
                type='edit'
                id={idEdit !== null ? idEdit : undefined}
            />

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
