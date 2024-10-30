import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import TablePagination from '@mui/material/TablePagination';
import { Box, Grid, Snackbar, Alert, CircularProgress, MenuItem, Checkbox } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditIcon from '@mui/icons-material/Edit';
import { useAppContext } from '@/app/hooks/AppContext';
import apiService from '@/app/untils/api';
import FullScreenDialog from './ViewDiolog';
import { useRouter } from 'next/navigation';
import HistoryDiolog from './HistoryDiolog';
import HistoryIcon from '@mui/icons-material/History';
import CustomDeleteDialog from './DeleteDioglog';

interface Row {
    reportId: number;
    statusName: string;
    departmentName: string;
    level: number;
    startTime: string;
    endTime: string;
    reportPeriod: string;
    updated: string;
    reportUser: string;
    action: boolean;
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
    year: string;
}

export default function ReportEditTable({ year }: ConfigTableProps) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [rows, setRows] = useState<Row[]>([]);
    const [totalRows, setTotalRows] = useState(0);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openDialog, setOpenDiolog] = useState(false);
    const [openHistoryDialog, setOpenHistoryDiolog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDiolog] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const [isLoading, setIsLoading] = useState(false);
    const [accLv, setAccLv] = useState<string>('0');
    const { choosed } = useAppContext();
    const [id, setId] = useState('0');
    const router = useRouter();
    const [status, setStatus] = useState<string[]>([]);
    const [selected, setSelected] = useState<number[]>([]);
    const [edit, setEdit] = useState(false);

    const [statusFilter, setStatusFilter] = useState<string>('');
    const [departmentNameFilter, setDepartmentNameFilter] = useState<string>('');
    const [levelFilter, setLevelFilter] = useState<string>('');
    const [startTimeFilter, setStartTimeFilter] = useState<string>('');
    const [endTimeFilter, setEndTimeFilter] = useState<string>('');
    const [reportPeriodFilter, setReportPeriodFilter] = useState<string>('');
    const [createAtFilter, setCreateAtFilter] = useState<string>('');
    const [createNameFilter, setCreateNameFilter] = useState<string>('');

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const isSelected = (id: number) => selected.indexOf(id) !== -1;
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpenView = async (id: number, status: string) => {
        sessionStorage.setItem('key', id.toString());
        console.log(sessionStorage.getItem('key'))
        if (status === 'Awaiting Approval' && accLv ==='1') {
            setEdit(true);
        }
        else {
            setEdit(false);
        }
        setId(id.toString());
        setOpenDiolog(true);
    };
    const handleOpenDeleteDiolog = () => {
        setOpenDeleteDiolog(true);
    };
    const handleAccept = async () => {
        const ids = selected.join(',');
        const response = await apiService.put(`/report/approve-report?reportIds=${ids}&statusId=4`);
        if (response) {
            if (response.status === 200) {
                console.log(response);
                fetchRow();
                handleCloseOpenDelete();
                // setSnackbarSeverity('success');
                // setSnackbarMessage('Delete success!');
            } else if (response.status === 500) {
                // setSnackbarSeverity('error');
                // setSnackbarMessage('Department lv1 that has child departments cannot be deleted');
            }
        } else {
            // setSnackbarSeverity('error');
            // setSnackbarMessage('Error!');
            console.log('lỗi');
        }
    }
    const handleRefuse = async () => {
        const ids = selected.join(',');
        const response = await apiService.put(`/report/approve-report?reportIds=${ids}&statusId=5`);
        if (response) {
            if (response.status === 200) {
                console.log(response);
                fetchRow();
                handleCloseOpenDelete();
                // setSnackbarSeverity('success');
                // setSnackbarMessage('Delete success!');
            } else if (response.status === 500) {
                // setSnackbarSeverity('error');
                // setSnackbarMessage('Department lv1 that has child departments cannot be deleted');
            }
        } else {
            // setSnackbarSeverity('error');
            // setSnackbarMessage('Error!');
            console.log('lỗi');
        }

    }
    const handleCloseDialog = () => {
        fetchRow();
        setOpenDiolog(false);
    }
    const handleHistoryCloseDialog = () => {
        setOpenHistoryDiolog(false);
    }
    const handleCloseOpenDelete = () => {
        setOpenDeleteDiolog(false);
    }
    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleOpenDeleteDiolog();
        if (event.target.checked) {
            const newSelected = rows
                .filter((row) => row.statusName === 'Awaiting Approval')
                .map((row) => row.reportId);
            setSelected(newSelected);
        } else {
            setSelected([]);
        }
    };



    const handleOpenEdit = async (id: number) => {
        sessionStorage.setItem('key', id.toString());
        sessionStorage.removeItem('url');
        router.push('/reportdeclare');
    };
    useEffect(() => {
        if (selected.length === 0)
            handleCloseOpenDelete();
    }, [selected]);

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
            if (year) queryParams.append('reportYear', year);
            const accLv = localStorage.getItem('accLv') || '0';
            setAccLv(accLv);
            const res = await apiService.get<ApiResponse>(`/report/department/${choosed.id}?${queryParams.toString()}`);
            const data = res.data.data.items;
            console.log(res)
            const filteredRows = data.filter(row => row.level >= parseInt(accLv));
            setRows(filteredRows);
            setTotalRows(res.data.data.total);
        } catch (error) {
            console.error("Failed to fetch rows:", error);
        }
    };
    const handleCheckboxClick = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
        handleOpenDeleteDiolog();
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
    };
    const convertDateToApi = (date: string): string => {
        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year}`;
    }
    function convertDateFormat(inputDate: string): string {
        const [day, month, year] = inputDate.split('/');
        return `${year}-${month}-${day}`;
    }
    const handleOpenHistory = (id: number) => {
        setOpenHistoryDiolog(true);
        setId(id.toString())
    }
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
        fetchStatus();
        fetchRow();
    }, [year, choosed, page, rowsPerPage, statusFilter, departmentNameFilter, levelFilter, startTimeFilter, endTimeFilter, reportPeriodFilter, createAtFilter, createNameFilter]);

    return (
        <Paper sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer sx={{ flexGrow: 1, maxHeight: '70vh', overflow: 'auto' }}>
                    <Table sx={{ width: '100%' }} aria-label="simple table">
                        <TableHead sx={{ background: '#f4f6f8' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', padding: '4px 8px', width: '150px', borderBottom: 'none' }}>
                                    <span style={{ marginLeft: '10px' }}>Action</span>
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold', padding: '4px 8px', width: '200px', borderBottom: 'none' }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', padding: '4px 8px', width: '280px', borderBottom: 'none' }}>Department Name</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', padding: '4px 8px', width: '100px', borderBottom: 'none' }}>Level</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', padding: '4px 8px', width: '150px', borderBottom: 'none' }}>Start day</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', padding: '4px 8px', width: '150px', borderBottom: 'none' }}>Finish day</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', padding: '4px 8px', width: '130px', borderBottom: 'none' }}>Reporting period</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', padding: '4px 8px', width: '160px', borderBottom: 'none' }}>Create at</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', padding: '4px 8px', width: '160px', borderBottom: 'none' }}>Create by</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ padding: '4px 8px', width: '150px', borderBottom: 'none' }} >
                                    {
                                        accLv == '1' && (<Checkbox
                                            indeterminate={
                                                selected.length > 0 &&
                                                rows.filter((row) => row.statusName === 'Awaiting Approval').length > 0 &&
                                                selected.length < rows.filter((row) => row.statusName === 'Awaiting Approval').length
                                            }
                                            checked={
                                                rows.filter((row) => row.statusName === 'Awaiting Approval').length > 0 &&
                                                selected.length === rows.filter((row) => row.statusName === 'Awaiting Approval').length
                                            }
                                            onChange={handleSelectAllClick}
                                            sx={{ marginLeft: '8px' }}
                                        />)
                                    }
                                </TableCell>
                                <TableCell sx={{ padding: '4px 8px', width: '200px', borderBottom: 'none' }}>
                                    <TextField size="small" sx={{ background: 'white' }} fullWidth select name="status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} >
                                        {
                                            status.map((statusName, index) => (
                                                <MenuItem key={index} value={statusName}>
                                                    {statusName}
                                                </MenuItem>
                                            ))
                                        }
                                    </TextField>
                                </TableCell>
                                <TableCell sx={{ padding: '4px 8px', width: '280px', borderBottom: 'none' }}>
                                    <TextField size="small" sx={{ background: 'white' }} fullWidth name="departmentName" value={departmentNameFilter} onChange={(e) => setDepartmentNameFilter(e.target.value)} />
                                </TableCell>
                                <TableCell sx={{ padding: '4px 8px', width: '100px', borderBottom: 'none' }}>
                                    <TextField size="small" sx={{ background: 'white' }} fullWidth name="level" value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)} />
                                </TableCell>
                                <TableCell sx={{ padding: '4px 8px', width: '150px', borderBottom: 'none' }}>
                                    <TextField size="small" sx={{ background: 'white' }} fullWidth name="startTime" value={startTimeFilter} onChange={(e) => setStartTimeFilter(e.target.value)} placeholder='dd/MM/yyyy' />
                                </TableCell>
                                <TableCell sx={{ padding: '4px 8px', width: '150px', borderBottom: 'none' }}>
                                    <TextField size="small" sx={{ background: 'white' }} fullWidth name="endTime" value={endTimeFilter} onChange={(e) => setEndTimeFilter(e.target.value)} placeholder='dd/MM/yyyy' />
                                </TableCell>
                                <TableCell sx={{ padding: '4px 8px', width: '130px', borderBottom: 'none' }}>
                                    <TextField size="small" select sx={{ background: 'white' }} fullWidth name="reportPeriod" value={reportPeriodFilter} onChange={(e) => setReportPeriodFilter(e.target.value)}>
                                        <MenuItem value="All">All</MenuItem>
                                        <MenuItem value="6 tháng">6 tháng</MenuItem>
                                        <MenuItem value="Cả năm">Cả năm</MenuItem>
                                    </TextField>
                                </TableCell>
                                <TableCell sx={{ padding: '4px 8px', width: '160px', borderBottom: 'none' }}>
                                    <TextField size="small" sx={{ background: 'white' }} fullWidth name="createAt" value={createAtFilter} onChange={(e) => setCreateAtFilter(e.target.value)} />
                                </TableCell>
                                <TableCell sx={{ padding: '4px 8px', width: '160px', borderBottom: 'none' }}>
                                    <TextField size="small" sx={{ background: 'white' }} fullWidth name="createName" value={createNameFilter} onChange={(e) => setCreateNameFilter(e.target.value)} />
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {rows.length > 0 ? (
                                rows.map((row) => {
                                    const isItemSelected = isSelected(row.reportId);
                                    return (
                                        <TableRow
                                            key={row.reportId}
                                            sx={{ height: '45px', marginLeft: '15px', cursor: 'pointer', '&:hover': { backgroundColor: '#f1f1f1' }, borderBottom: '1px solid #e0e0e0' }}
                                        >
                                            <TableCell component="th" scope="row" style={{ display: 'flex', alignItems: 'center' }} sx={{ padding: '4px 8px', paddingLeft: '16px', borderBottom: 'none' }}>
                                                {
                                                    row.statusName == 'Awaiting Approval' && accLv == '1' &&
                                                    (
                                                        <Checkbox
                                                            checked={isItemSelected}
                                                            onChange={(event) => handleCheckboxClick(event, row.reportId)}
                                                        />
                                                    )
                                                }
                                                <IconButton onClick={() => handleOpenView(row.reportId, row.statusName)} sx={{ marginLeft: row.statusName != 'Awaiting Approval' && accLv == '1' ? '42px' : '0px' }}>
                                                    <VisibilityOutlinedIcon />
                                                </IconButton>
                                                {
                                                    accLv != '1' && (

                                                        <>
                                                            <IconButton
                                                                onClick={() => handleOpenHistory(row.reportId)}
                                                            >
                                                                <HistoryIcon />
                                                            </IconButton>
                                                            {row.action &&
                                                                <IconButton onClick={() => handleOpenEdit(row.reportId)}>
                                                                    <EditIcon />
                                                                </IconButton>}
                                                        </>
                                                    )
                                                }

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
                                                {row.reportPeriod}
                                            </TableCell>
                                            <TableCell sx={{ padding: '4px 8px', paddingLeft: '16px', borderBottom: 'none' }}>
                                                {row.updated ? row.updated : '-'}
                                            </TableCell>
                                            <TableCell sx={{ padding: '4px 8px', paddingLeft: '16px', borderBottom: 'none' }}>
                                                {row.reportUser ? row.reportUser : '-'}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
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

            <FullScreenDialog value={id} open={openDialog} onClose={handleCloseDialog} isEdit={edit} />
            <HistoryDiolog open={openHistoryDialog} onClose={handleHistoryCloseDialog} id={parseInt(id)} />
            <CustomDeleteDialog open={openDeleteDialog} handleClose={handleCloseOpenDelete} quantity={selected.length} onAccept={handleAccept} onRefuse={handleRefuse} />

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
