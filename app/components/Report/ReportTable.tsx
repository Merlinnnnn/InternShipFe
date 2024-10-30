import React, { useEffect, useReducer, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import TablePagination from '@mui/material/TablePagination';
import { Box, Grid, Snackbar, Alert, CircularProgress, MenuItem } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { useAppContext } from '@/app/hooks/AppContext';
import apiService from '@/app/untils/api';
import { useRouter } from 'next/navigation';
import FullScreenDialog from '../ReportEdit/ViewDiolog';

interface Row {
    reportId: number;
    statusName: string;
    departmentName: string;
    level: number;
    startTime: string;
    endTime: string;
    reportPeriod: string;
    reportUser: string;
    updated: string;
    reportYear: string;
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
interface Status {
    name: string;
    createdBy: any;
    id: number;
}

interface ConfigTableProps {
    refresh: boolean;
}
interface ApiResponseData {
    url: string;
}

export default function ReportTable() {
    const [openDialog, setOpenDiolog] = useState(false);
    const [id, setId] = useState('0');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [rows, setRows] = useState<Row[]>([]);
    const [totalRows, setTotalRows] = useState(0);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const [isLoading, setIsLoading] = useState(false);
    const [accLv, setAccLv] = useState<string>('');
    const { choosed, setReportId } = useAppContext();
    const [status, setStatus] = useState<string[]>([]);
    const router = useRouter();
    //filter
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [departmentNameFilter, setDepartmentNameFilter] = useState<string>('');
    const [levelFilter, setLevelFilter] = useState<string>('');
    const [startTimeFilter, setStartTimeFilter] = useState<string>('');
    const [endTimeFilter, setEndTimeFilter] = useState<string>('');
    const [reportPeriodFilter, setReportPeriodFilter] = useState<string>('');
    const [yearFilter, setYearFilter] = useState<string>('');
    const [createAtFilter, setCreateAtFilter] = useState<string>('');
    const [createNameFilter, setCreateNameFilter] = useState<string>('');

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

    const handleOpenEdit = async (id: number) => {
        sessionStorage.setItem('key', id.toString());
        sessionStorage.removeItem('url');
        router.push('/reportdeclare');
    };

    const handleOpenView = async (id: number) => {
        setId(id.toString());
        setOpenDiolog(true);
        console.log(id)
    };

    const handleUncheck = async (id: number) => {
        setIsLoading(true);
        const status = {
            id: id,
            statusId: 4,
        };
        try {
            const res = await apiService.put(`/report/update-report`, status);
            console.log(res);
        } catch (error) {
            console.error("Failed to reset status:", error);
        } finally {
            fetchRowLv1();
        }
    };

    const handleCheck = async (id: number) => {
        setIsLoading(true);
        const status = {
            id: id,
            statusId: 3,
        };
        try {
            const res = await apiService.put(`/report/update-report`, status);
            console.log(res);
        } catch (error) {
            console.error("Failed to reset status:", error);
        } finally {
            fetchRowLv1();
        }
    };

    const fetchRow = async () => {
        try {
            const queryParams = new URLSearchParams({
                page: (page + 1).toString(),
                limit: rowsPerPage.toString(),
            });
            if (statusFilter) queryParams.append('status', statusFilter);
            if (departmentNameFilter) queryParams.append('departmentName', departmentNameFilter);
            if (levelFilter) queryParams.append('level', levelFilter);
            if (startTimeFilter) queryParams.append('startTime', convertDateFormat(startTimeFilter));
            if (endTimeFilter) queryParams.append('endTime', convertDateFormat(endTimeFilter));
            if (reportPeriodFilter && reportPeriodFilter != 'All') queryParams.append('reportPeriod', reportPeriodFilter);
            if (createAtFilter) queryParams.append('createAt', createAtFilter);
            if (createNameFilter) queryParams.append('createName', createNameFilter);
            if (yearFilter) queryParams.append('year', yearFilter);
            const accLv = localStorage.getItem('accLv') || '0';
            const dept = localStorage.getItem('dept')
            setAccLv(accLv);
            if (dept) {
                const dept_id = JSON.parse(dept)?.id;
                const res = await apiService.get<ApiResponse>(`/report/department-edit/${choosed.id}?${queryParams.toString()}`);
                console.log(res);
                const data = res.data.data.items;

                const filteredRows = data.filter(row => row.level >= parseInt(accLv));
                setRows(filteredRows);
                setTotalRows(res.data.data.total);
            }


        } catch (error) {
            console.error("Failed to fetch rows:", error);
        }
    };

    const convertDateToApi = (date: string): string => {
        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year}`;
    }

    function convertDateFormat(inputDate: string): string {
        const [day, month, year] = inputDate.split('/');
        return `${year}-${month}-${day}`;
    }

    const fetchRowLv1 = async () => {
        try {
            const queryParams = new URLSearchParams({
                page: (page + 1).toString(),
                limit: rowsPerPage.toString(),
            });
            if (statusFilter) queryParams.append('status', statusFilter);
            if (departmentNameFilter) queryParams.append('departmentName', departmentNameFilter);
            if (levelFilter) queryParams.append('level', levelFilter);
            if (startTimeFilter) queryParams.append('startTime', convertDateFormat(startTimeFilter));
            if (endTimeFilter) queryParams.append('endTime', convertDateFormat(endTimeFilter));
            if (reportPeriodFilter && reportPeriodFilter != 'All') queryParams.append('reportPeriod', reportPeriodFilter);
            if (createAtFilter) queryParams.append('createAt', createAtFilter);
            if (createNameFilter) queryParams.append('createName', createNameFilter);
            if (yearFilter) queryParams.append('year', yearFilter);

            const accLv = localStorage.getItem('accLv') || '0';
            const dept = localStorage.getItem('dept');
            setAccLv(accLv);

            if (dept) {
                const dept_id = JSON.parse(dept)?.id;
                const res = await apiService.get<ApiResponse>(`/report/department-approve/${choosed.id}?${queryParams.toString()}`);
                console.log(res);
                const data = res.data.data.items;

                const filteredRows = data.filter(row => row.level >= parseInt(accLv));
                sessionStorage.setItem('pendingApproval', filteredRows.length.toString());
                setRows(filteredRows);
                setTotalRows(res.data.data.total);
            }
        } catch (error) {
            console.error("Failed to fetch rows:", error);
        }
    };
    const fetchStatus = async () => {
        try {
            const res = await apiService.get<Status[]>('/report/status');
            const data = res.data.map((item: Status) => item.name);
            setStatus(data);
            console.log('data', data);
        } catch (error) {
            console.error('Error fetching status:', error);
        }
    }

    useEffect(() => {
        const accLv = localStorage.getItem('accLv') || '0';
        if (accLv == '1') {
            fetchRowLv1();
            fetchStatus();
        }
        else {
            fetchRow();
            fetchStatus();
        }
    }, [choosed, statusFilter, departmentNameFilter, levelFilter, startTimeFilter, endTimeFilter, reportPeriodFilter, createAtFilter, createNameFilter, yearFilter])
    const handleCloseDialog = () => {
        if (accLv == '1') {
            fetchRowLv1();
        }
        setOpenDiolog(false);
    }

    return (
        <Paper sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer sx={{ flexGrow: 1 }}>
                    <Table sx={{ width: '100%' }} aria-label="simple table">
                        <TableHead sx={{ background: '#f4f6f8' }}>
                            <TableRow>
                                <TableCell sx={{ borderBottom: 'none', padding: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', marginLeft: '20px', marginBottom: '50px', fontWeight: 'bold', width: '140px' }}>
                                        Thao Tác
                                    </div>
                                </TableCell>
                                <TableCell sx={{ borderBottom: 'none', padding: '8px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', fontWeight: 'bold', width: accLv === '1' ? '100px' : '180px' }}>
                                        <span>Status</span>
                                        <TextField
                                            size="small"
                                            sx={{ background: 'white', marginTop: '10px' }}
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            select
                                        >
                                            {
                                                status.map((statusName, index) => (
                                                    <MenuItem key={index} value={statusName}>
                                                        {statusName}
                                                    </MenuItem>
                                                ))
                                            }
                                        </TextField>
                                    </div>
                                </TableCell>
                                <TableCell sx={{ borderBottom: 'none', padding: '8px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', fontWeight: 'bold', width: accLv === '1' ? '240px' : '400px' }}>
                                        <span>Department Name</span>
                                        <TextField
                                            size="small"
                                            sx={{ background: 'white', marginTop: '10px' }}
                                            value={departmentNameFilter}
                                            onChange={(e) => setDepartmentNameFilter(e.target.value)}
                                        >
                                            <MenuItem value="Báo cáo ATVSLĐ">Báo cáo ATVSLĐ</MenuItem>
                                        </TextField>
                                    </div>
                                </TableCell>
                                <TableCell sx={{ borderBottom: 'none', padding: '8px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', fontWeight: 'bold', width: accLv === '1' ? '60px' : '100px' }}>
                                        <span>Level</span>
                                        <TextField
                                            size="small"
                                            sx={{ background: 'white', marginTop: '10px' }}
                                            value={levelFilter}
                                            onChange={(e) => setLevelFilter(e.target.value)}
                                        />
                                    </div>
                                </TableCell>
                                <TableCell sx={{ borderBottom: 'none', padding: '8px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', fontWeight: 'bold', width: accLv === '1' ? '120px' : '150px' }}>
                                        <span>Start day</span>
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
                                    <div style={{ display: 'flex', flexDirection: 'column', fontWeight: 'bold', width: accLv === '1' ? '120px' : '150px' }}>
                                        <span>Finish day</span>
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
                                    <div style={{ display: 'flex', flexDirection: 'column', fontWeight: 'bold', width: '100px' }}>
                                        <span>Year</span>
                                        <TextField
                                            size="small"
                                            sx={{ background: 'white', marginTop: '10px' }}
                                            value={yearFilter}
                                            onChange={(e) => setYearFilter(e.target.value)}
                                        />
                                    </div>
                                </TableCell>
                                <TableCell sx={{ borderBottom: 'none', padding: '8px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', fontWeight: 'bold', width: '130px' }}>
                                        <span>Reporting period</span>
                                        <TextField
                                            size="small"
                                            sx={{ background: 'white', marginTop: '10px' }}
                                            value={reportPeriodFilter}
                                            onChange={(e) => setReportPeriodFilter(e.target.value)}
                                            select
                                        >

                                            <MenuItem value='6 tháng'>6 tháng</MenuItem>
                                            <MenuItem value='Cả năm'>Cả năm</MenuItem>
                                            <MenuItem value='All'>All</MenuItem>
                                        </TextField>
                                    </div>
                                </TableCell>
                                {accLv == '1' && (
                                    <>
                                        <TableCell sx={{ borderBottom: 'none', padding: '8px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', fontWeight: 'bold', width: '160px' }}>
                                                <span>Create at</span>
                                                <TextField
                                                    size="small"
                                                    sx={{ background: 'white', marginTop: '10px' }}
                                                    value={createAtFilter}
                                                    onChange={(e) => setCreateAtFilter(e.target.value)}
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell sx={{ borderBottom: 'none', padding: '8px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', fontWeight: 'bold', width: '160px' }}>
                                                <span>Create by</span>
                                                <TextField
                                                    size="small"
                                                    sx={{ background: 'white', marginTop: '10px' }}
                                                    value={createNameFilter}
                                                    onChange={(e) => setCreateNameFilter(e.target.value)}
                                                />
                                            </div>
                                        </TableCell></>)}

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.length > 0 ? rows.map((row) => (
                                <TableRow
                                    key={row.reportId}
                                    sx={{ height: '45px', marginLeft: '15px', cursor: 'pointer', '&:hover': { backgroundColor: '#f1f1f1' }, borderBottom: '1px solid #e0e0e0' }}
                                >
                                    <TableCell component="th" scope="row" style={{ display: 'flex', alignItems: 'center' }} sx={{ padding: '4px 8px', paddingLeft: '16px', borderBottom: 'none' }}>
                                        {accLv == '1' && (
                                            <IconButton onClick={() => handleCheck(row.reportId)}>
                                                <CheckIcon sx={{ color: 'green' }} />
                                            </IconButton>
                                        )}
                                        {accLv !== '1' && (
                                            <IconButton onClick={() => handleOpenEdit(row.reportId)}>
                                                <EditIcon />
                                            </IconButton>
                                        )}
                                        {accLv == '1' && (
                                            <IconButton onClick={() => handleOpenView(row.reportId)}>
                                                <VisibilityOutlinedIcon />
                                            </IconButton>
                                        )}
                                        {accLv == '1' && (
                                            <IconButton onClick={() => handleUncheck(row.reportId)}>
                                                <ClearIcon sx={{ color: 'red' }} />
                                            </IconButton>
                                        )}
                                    </TableCell>
                                    <TableCell sx={{ padding: '4px 8px', paddingLeft: '16px', borderBottom: 'none' }}>
                                        {row.statusName}
                                    </TableCell>
                                    <TableCell sx={{ padding: '4px 8px', paddingLeft: '16px', borderBottom: 'none' }}>
                                        {row.departmentName}
                                    </TableCell>
                                    <TableCell sx={{ padding: '4px 8px', paddingLeft: '16px', borderBottom: 'none' }}>
                                        {row.level}
                                    </TableCell>
                                    <TableCell sx={{ padding: '4px 8px', paddingLeft: '16px', borderBottom: 'none' }}>
                                        {convertDateToApi(row.startTime)}
                                    </TableCell>
                                    <TableCell sx={{ padding: '4px 8px', paddingLeft: '16px', borderBottom: 'none' }}>
                                        {convertDateToApi(row.endTime)}
                                    </TableCell>
                                    <TableCell sx={{ padding: '4px 8px', paddingLeft: '16px', borderBottom: 'none' }}>
                                        {row.reportYear}
                                    </TableCell>
                                    <TableCell sx={{ padding: '4px 8px', paddingLeft: '16px', borderBottom: 'none' }}>
                                        {row.reportPeriod}
                                    </TableCell>
                                    {accLv == '1' && (
                                        <>
                                            <TableCell sx={{ padding: '4px 8px', paddingLeft: '16px', borderBottom: 'none' }}>
                                                {row.updated ? row.updated : '-'}
                                            </TableCell>
                                            <TableCell sx={{ padding: '4px 8px', paddingLeft: '16px', borderBottom: 'none' }}>
                                                {row.reportUser ? row.reportUser : '-'}
                                            </TableCell>
                                        </>)}

                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={9} sx={{ textAlign: 'center', borderBottom: 'none' }}>
                                        No data available
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
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
            <FullScreenDialog value={id} open={openDialog} onClose={handleCloseDialog} isEdit={true} />
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
