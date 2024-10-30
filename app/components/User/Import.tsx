import React, { useEffect, useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Typography,
    TablePagination,
    Checkbox,
    Switch,
    Box,
    Collapse,
    List,
    ListItem,
    ListItemText
} from '@mui/material';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import GetAppOutlinedIcon from '@mui/icons-material/GetAppOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { useAppContext } from '@/app/hooks/AppContext';
import apiService from '@/app/untils/api';

interface ImportDialogProps {
    open: boolean;
    handleClose: () => void;
}

interface User {
    full_name: string;
    username: string;
    email: string;
    phone: string;
    jobTitle: string;
    roleName: string;
    active: boolean;
    add: boolean;
    isValid: number;
    errors: any[];
}

interface UserResponse {
    user: {
        full_name: string;
        username: string;
        email: string;
        phone: string;
        jobTitle: string;
        roleName: string;
    };
    isValid: number;
    errors: any[];
}

const ImportDialog: React.FC<ImportDialogProps> = ({ open, handleClose }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const { choosed } = useAppContext();
    const [tableData, setTableData] = useState<User[]>([]);
    const [tableSave, setTableSave] = useState<User[]>([]);
    const [expandedRows, setExpandedRows] = useState<number[]>([]);

    useEffect(() => {
        setTableData([]);
        setTableSave([]);
    }, [open]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleDownExam = async () => {
        try {
            const res = await apiService.get(`/users/${choosed.id}/download/example`, {
                responseType: 'arraybuffer',
            });

            const blob = new Blob([res.data as Blob], { type: 'application/octet-stream' });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'data.xlsx');
            document.body.appendChild(link);
            link.click();
            if (link.parentNode) link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    const handleUploadData = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('id', choosed.id);

        try {
            const res = await apiService.post('/users/upload/data', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const jsonDataWithActive: User[] = (res.data as UserResponse[]).map((item) => ({
                full_name: item.user.full_name,
                username: item.user.username,
                email: item.user.email,
                phone: item.user.phone,
                jobTitle: item.user.jobTitle,
                roleName: item.user.roleName,
                active: true,
                add: item.isValid > 0 ? false : true,
                isValid: item.isValid,
                errors: item.errors,
            }));

            setTableData(jsonDataWithActive);
            setTableSave(jsonDataWithActive.filter((item: User) => item.add));

        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const handleSave = async () => {
        const filteredTableSave = tableSave.map(({ active, add, isValid, errors, ...rest }) => rest);
        console.log(filteredTableSave);
        console.log(tableData);
        try {
            const res = await apiService.post(`users/${choosed.id}/import/data`, filteredTableSave);
            console.log(res);
            handleClose();
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    const handleChangeActive = (index: number) => {
        const newTableData = [...tableData];
        newTableData[index].active = !newTableData[index].active;
        setTableData(newTableData);
    };

    const handleCheckboxChange = (index: number) => {
        const newTableData = [...tableData];
        newTableData[index].add = !newTableData[index].add;
        
        if (newTableData[index].isValid > 0 && !newTableData[index].add) {
            newTableData[index].add = false;
        }

        setTableData(newTableData);
        const checkedItems = newTableData.filter(item => item.add);
        setTableSave(checkedItems);
    };

    const isError = (index: number, field: string) => {
        return tableData[index].errors.some((error: any) => error.property === field);
    };

    const getCellStyle = (index: number, field: string) => ({
        border: isError(index, field) ? '2px solid #DD0000' : 'none',
        borderTop: isError(index, field) ? '2px solid #DD0000' : '1px solid #e0e0e0',
        borderBottom: isError(index, field) ? '2px solid #DD0000' : '1px solid #e0e0e0',
        //background: isError(index, field) ? ' rgba(255, 0, 0, 0.8)' : 'none',
        
    });

    const handleEditChange = async (index: number, field: string, value: string) => {
        const newTableData = [...tableData];
        (newTableData[index] as any)[field] = value;

        // try {
        //     const res = await apiService.post(`users/${choosed.id}/validate-data`, newTableData);

        //     const updatedData: User[] = (res.data as UserResponse[]).map((item) => ({
        //         full_name: item.user.full_name,
        //         username: item.user.username,
        //         email: item.user.email,
        //         phone: item.user.phone,
        //         jobTitle: item.user.jobTitle,
        //         roleName: item.user.roleName,
        //         active: true,
        //         add: item.isValid > 0 ? false : true,
        //         isValid: item.isValid,
        //         errors: item.errors,
        //     }));

        //     setTableData(updatedData);
        //     setTableSave(updatedData);
        //     console.log('API response:', res.data);
        //     console.log('Updated table data:', updatedData);
        // } catch (error) {
        //     console.error('Error validating data:', error);
        // }
    };

    const toggleRowExpansion = (index: number) => {
        if (expandedRows.includes(index)) {
            setExpandedRows(expandedRows.filter(row => row !== index));
        } else {
            setExpandedRows([...expandedRows, index]);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="lg" fullScreen>
            <DialogTitle sx={{ marginBottom: '20px' }}>
                <Typography sx={{ fontWeight: 'bold' }}>Import Users</Typography>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{ position: 'absolute', right: 8, top: 8, color: 'grey[500]' }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead sx={{ background: '#f4f6f8', height: '100px' }}>
                            <TableRow>
                                <TableCell sx={{ padding: '4px 8px', width: '150px' }} />
                                <TableCell sx={{ fontWeight: 'bold', padding: '4px 8px', width: '350px' }}>Full Name</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', padding: '4px 8px', width: '300px' }}>Account</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', padding: '4px 8px', width: '400px' }}>Email</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', padding: '4px 8px', width: '140px' }}>Phone</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', padding: '4px 8px', width: '140px' }}>Role</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', padding: '4px 8px', width: '140px' }}>Job title</TableCell>
                                {/* <TableCell sx={{ fontWeight: 'bold', padding: '4px 8px', borderBottom: 'none' }}>Active</TableCell> */}
                                <TableCell sx={{ fontWeight: 'bold', padding: '4px 8px', borderBottom: 'none' }}>Add</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableData.map((row, index) => (
                                <React.Fragment key={index}>
                                    <TableRow sx={{ height: '30px', cursor: 'pointer' }} onClick={() => toggleRowExpansion(index)}>
                                        <TableCell sx={{ height: '30px', padding: '4px 8px', lineHeight: '1', width: '150px', borderTop: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0' }}>{index + 1}</TableCell>
                                        <TableCell
                                            sx={{ height: '30px', padding: '4px 8px', lineHeight: '1', width: '350px', ...getCellStyle(index, 'full_name')  }}
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => handleEditChange(index, 'full_name', e.currentTarget.textContent || '')}
                                        >
                                            {row.full_name}
                                        </TableCell>
                                        <TableCell
                                            sx={{ height: '30px', padding: '4px 8px', lineHeight: '1', width: '190px', ...getCellStyle(index, 'username')  }}
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => handleEditChange(index, 'username', e.currentTarget.textContent || '')}
                                        >
                                            {row.username}
                                        </TableCell>
                                        <TableCell
                                            sx={{ height: '30px', padding: '4px 8px', lineHeight: '1', width: '240px', ...getCellStyle(index, 'email') }}
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => handleEditChange(index, 'email', e.currentTarget.textContent || '')}
                                        >
                                            {row.email}
                                        </TableCell>
                                        <TableCell
                                            sx={{ height: '30px', padding: '4px 8px', lineHeight: '1', width: '140px', ...getCellStyle(index, 'phone')}}
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => handleEditChange(index, 'phone', e.currentTarget.textContent || '')}
                                        >
                                            {row.phone}
                                        </TableCell>
                                        <TableCell
                                            sx={{ height: '30px', padding: '4px 8px', lineHeight: '1', width: '140px', ...getCellStyle(index, 'roleName') }}
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => handleEditChange(index, 'roleName', e.currentTarget.textContent || '')}
                                        >
                                            {row.roleName}
                                        </TableCell>
                                        <TableCell
                                            sx={{ height: '30px', padding: '4px 8px', lineHeight: '1', width: '140px', ...getCellStyle(index, 'jobTitle')  }}
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => handleEditChange(index, 'jobTitle', e.currentTarget.textContent || '')}
                                        >
                                            {row.jobTitle}
                                        </TableCell>
                                        {/* <TableCell sx={{ padding: '4px 8px', lineHeight: '1', borderBottom: 'none', borderTop: '1px solid #e0e0e0' }}>
                                            <Switch
                                                checked={row.active}
                                                onChange={() => handleChangeActive(index)}
                                            />
                                        </TableCell> */}
                                        <TableCell sx={{ height: '30px', padding: '4px 8px', lineHeight: '1', borderTop: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0' }}>
                                            <Checkbox
                                                checked={row.add}
                                                disabled={tableData[index].isValid > 0}
                                                onChange={() => handleCheckboxChange(index)}
                                            />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
                                            <Collapse in={expandedRows.includes(index)} timeout="auto" unmountOnExit>
                                                <Box margin={1}>
                                                    <Typography variant="h6" gutterBottom component="div">
                                                        Errors
                                                    </Typography>
                                                    <List>
                                                        {row.errors.map((error, i) => (
                                                            <ListItem key={i}>
                                                                <ListItemText primary={error.message} />
                                                            </ListItem>
                                                        ))}
                                                    </List>
                                                </Box>
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>

            <DialogActions sx={{ flexDirection: 'column', alignItems: 'stretch' }}>
                <Box sx={{ marginBottom: '20px' }}>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 50]}
                        component="div"
                        count={tableData.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <Box>
                        <Button
                            variant="outlined"
                            startIcon={<FileUploadOutlinedIcon />}
                            sx={{ textTransform: 'none', marginRight: '10px' }}
                            component="label"
                        >
                            Upload
                            <input type="file" hidden accept=".xlsx" onChange={handleUploadData} />
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<GetAppOutlinedIcon />}
                            sx={{ textTransform: 'none' }}
                            onClick={handleDownExam}
                        >
                            Tải mẫu
                        </Button>
                    </Box>
                    <Button variant="contained" color="primary" onClick={handleSave} sx={{marginRight: '20px'}}>
                        Xác nhận
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default ImportDialog;
