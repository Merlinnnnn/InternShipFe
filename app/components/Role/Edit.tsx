import React, { useEffect, useState, useRef } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, IconButton,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Checkbox, Grid, TablePagination,
    Alert,
    Snackbar,
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { useAppContext } from '@/app/hooks/AppContext';
import apiService from '@/app/untils/api';
import CloseIcon from '@mui/icons-material/Close';

interface Row {
    id: string;
    type: string;
    code: string;
    name: string;
    parentId?: string;
    children?: Row[];
}

interface ApiResponse {
    code: number;
    data: {
        currentPage: number;
        items: Row[];
        nextPage: number | null;
        prevPage: number | null;
    };
    message: string;
    success: boolean;
}

interface RoleDetails {
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    id: string;
    name: string;
    code: string;
    permissions: Row[];
}

interface EditPopupProps {
    open: boolean;
    onClose: () => void;
    roleId: string;
}

const flattenRows = (rows: Row[], expandedGroups: string[]): Row[] => {
    const result: Row[] = [];
    const flatten = (rows: Row[]) => {
        rows.forEach(row => {
            result.push(row);
            if (row.children && expandedGroups.includes(row.id)) {
                flatten(row.children);
            }
        });
    };
    flatten(rows);
    return result;
};

const renderRows = (
    rows: Row[],
    expandedGroups: string[],
    toggleGroup: (id: string) => void,
    handleSelect: (row: Row, checked: boolean) => void,
    selectedRowsUI: string[],
    onExpand: () => void
): JSX.Element[] => {
    return rows.map((row) => (
        <React.Fragment key={row.id}>
            <TableRow sx={{ height: '45px', cursor: 'pointer', border: 'none' }}>
                <TableCell sx={{ padding: '4px 8px 4px 16px', width: '60px' }}>
                    {row.type === 'Group' && (
                        <IconButton onClick={() => { toggleGroup(row.id); onExpand(); }} sx={{ color: 'black' }}>
                            {expandedGroups.includes(row.id) ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </IconButton>
                    )}
                </TableCell>
                <TableCell sx={{ padding: '4px 8px 4px 16px', width: '80px' }}>
                    <Checkbox
                        checked={selectedRowsUI.includes(row.id)}
                        onChange={(e) => handleSelect(row, e.target.checked)}
                    />
                </TableCell>
                <TableCell sx={{ padding: '4px 8px 4px 16px' }}>{row.code}</TableCell>
                <TableCell sx={{ padding: '4px 8px 4px 16px' }}>{row.name}</TableCell>
            </TableRow>
        </React.Fragment>
    ));
};

const EditPopup: React.FC<EditPopupProps> = ({ open, onClose, roleId }) => {
    const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
    const [selectedRowsUI, setSelectedRowsUI] = useState<string[]>([]);
    const [selectedRowsAPI, setSelectedRowsAPI] = useState<string[]>([]);
    const [permissionCodeFilter, setPermissionCodeFilter] = useState('');
    const [permissionNameFilter, setPermissionNameFilter] = useState('');
    
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalRows, setTotalRows] = useState(0);
    const [roleCode, setRoleCode] = useState('');
    const [roleName, setRoleName] = useState('');
    const { roles, setRoles, choosed } = useAppContext();
    const tableContainerRef = useRef<HTMLDivElement>(null);

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const fetchRows = async () => {
        try {
            const params = new URLSearchParams();
            if (permissionCodeFilter) params.append('code', permissionCodeFilter);
            if (permissionNameFilter) params.append('name', permissionNameFilter);

            const response = await apiService.get<ApiResponse>(`/permission?${params.toString()}`);
            const data = response.data.data.items;
            setRoles(data);
            updateTotalRows(data, expandedGroups);
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    };

    const updateTotalRows = (rows: Row[], expandedGroups: string[]) => {
        const flattenedRows = flattenRows(rows, expandedGroups);
        setTotalRows(flattenedRows.length);
    };

    const collectIds = (permission: Row): string[] => {
        let ids = [permission.id];
        if (permission.children) {
            permission.children.forEach(child => {
                ids = ids.concat(collectIds(child));
            });
        }
        return ids;
    };

    const fetchRoleDetails = async () => {
        try {
            const response = await apiService.get<RoleDetails>(`/role/${String(roleId)}/detail`);
            const data = response.data;
            
            if (!data.permissions || !Array.isArray(data.permissions)) {
                throw new Error('Invalid permissions data');
            }

            setRoleName(data.name);
            setRoleCode(data.code);

            const newSelectedRowsUI = data.permissions.flatMap(permission => collectIds(permission));
            const newSelectedRowsAPI = data.permissions.map(permission => permission.id);

            setSelectedRowsUI(newSelectedRowsUI);
            setSelectedRowsAPI(newSelectedRowsAPI);
        } catch (error) {
            console.error('Error fetching role details: ', error);
        }
    };

    const toggleGroup = (id: string) => {
        setExpandedGroups(prev => {
            const isExpanded = prev.includes(id);
            const newExpandedGroups = isExpanded ? prev.filter(groupId => groupId !== id) : [...prev, id];
            updateTotalRows(roles, newExpandedGroups);
            return newExpandedGroups;
        });
    };

    const handleExpand = () => {
        if (tableContainerRef.current) {
            const tableHeight = tableContainerRef.current.scrollHeight;
            const containerHeight = tableContainerRef.current.clientHeight;
            if (tableHeight > containerHeight) {
                const totalPages = Math.ceil(tableHeight / containerHeight);
                setPage(prevPage => Math.min(prevPage + 1, totalPages - 1));
            }
        }
    };

    const handleSelect = (row: Row, checked: boolean) => {
        if (checked) {
            if (row.type === 'Group') {
                const { updatedUI, updatedAPI } = selectAllChildren(row, selectedRowsUI, selectedRowsAPI);
                setSelectedRowsUI(updatedUI);
                setSelectedRowsAPI(updatedAPI);
            } else {
                let updatedUI = [...selectedRowsUI, row.id];
                let updatedAPI = [...selectedRowsAPI, row.id];
                roles.forEach(parentRow => {
                    if (parentRow.children && parentRow.children.every(child => updatedUI.includes(child.id))) {
                        updatedUI = [...updatedUI, parentRow.id];
                        updatedAPI = [...updatedAPI, parentRow.id];
                    }
                });
                setSelectedRowsUI(updatedUI);
                setSelectedRowsAPI(checkParent(row.parentId, updatedUI, updatedAPI));
            }
        } else {
            if (row.type === 'Group') {
                const { updatedUI, updatedAPI } = deselectAllChildren(row, selectedRowsUI, selectedRowsAPI);
                setSelectedRowsUI(updatedUI);
                setSelectedRowsAPI(updatedAPI);
            } else {
                let updatedUI = selectedRowsUI.filter(id => id !== row.id);
                let updatedAPI = selectedRowsAPI.filter(id => id !== row.id);
                roles.forEach(parentRow => {
                    if (parentRow.children && parentRow.children.some(child => child.id === row.id)) {
                        updatedUI = updatedUI.filter(id => id !== parentRow.id);
                        updatedAPI = updatedUI.filter(id => id !== parentRow.id);
                    }
                });
                setSelectedRowsUI(updatedUI);
                setSelectedRowsAPI(uncheckParent(row.parentId, updatedUI, updatedAPI));
            }
        }
    };

    const selectAllChildren = (row: Row, selectedUI: string[], selectedAPI: string[]): { updatedUI: string[], updatedAPI: string[] } => {
        let updatedUI = [...selectedUI, row.id];
        let updatedAPI = [...selectedAPI];
        
        if (row.type === 'Group') {
            updatedAPI = [...updatedAPI, row.id];
        } else {
            updatedAPI = updatedAPI.filter(id => id !== row.id);
        }

        if (row.children) {
            row.children.forEach(child => {
                updatedUI = [...updatedUI, child.id];
                if (child.type === 'Group') {
                    updatedAPI = [...updatedAPI, child.id];
                } else {
                    updatedAPI = updatedAPI.filter(id => id !== child.id);
                }
                const result = selectAllChildren(child, updatedUI, updatedAPI);
                updatedUI = result.updatedUI;
                updatedAPI = result.updatedAPI;
            });
        }
        return { updatedUI, updatedAPI };
    };

    const deselectAllChildren = (row: Row, selectedUI: string[], selectedAPI: string[]): { updatedUI: string[], updatedAPI: string[] } => {
        let updatedUI = selectedUI.filter(id => id !== row.id);
        let updatedAPI = selectedAPI.filter(id => id !== row.id);
        
        if (row.children) {
            row.children.forEach(child => {
                updatedUI = updatedUI.filter(id => id !== child.id);
                updatedAPI = updatedAPI.filter(id => id !== child.id);
                const result = deselectAllChildren(child, updatedUI, updatedAPI);
                updatedUI = result.updatedUI;
                updatedAPI = result.updatedAPI;
            });
        }
        return { updatedUI, updatedAPI };
    };

    const checkParent = (parentId: string | undefined, selectedUI: string[], selectedAPI: string[]): string[] => {
        if (!parentId) return selectedAPI;
        const parentRow = findRowById(parentId, roles);
        if (parentRow && parentRow.children) {
            const allChildrenSelected = parentRow.children.every(child => selectedAPI.includes(child.id));
            if (allChildrenSelected) {
                selectedUI = [...selectedUI, parentRow.id];
                selectedAPI = [...selectedAPI, parentRow.id];
                parentRow.children.forEach(child => selectedAPI = selectedAPI.filter(id => id !== child.id));
            }
        }
        return selectedAPI;
    };

    const uncheckParent = (parentId: string | undefined, selectedUI: string[], selectedAPI: string[]): string[] => {
        if (!parentId) return selectedAPI;
        const parentRow = findRowById(parentId, roles);
        if (parentRow) {
            selectedUI = selectedUI.filter(id => id !== parentRow.id);
            selectedAPI = selectedAPI.filter(id => id !== parentRow.id);
            parentRow.children?.forEach(child => {
                selectedUI = selectedUI.filter(id => id !== child.id);
                selectedAPI = selectedAPI.filter(id => id !== child.id);
            });
        }
        return selectedAPI;
    };

    const findRowById = (id: string, rows: Row[]): Row | undefined => {
        for (const row of rows) {
            if (row.id === id) return row;
            if (row.children) {
                const found = findRowById(id, row.children);
                if (found) return found;
            }
        }
        return undefined;
    };
    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    useEffect(() => {
        if (open) {
            fetchRows();
            fetchRoleDetails();
            setPage(0);
        }
    }, [open, permissionCodeFilter, permissionNameFilter]);

    const handleSave = async () => {
        if(roleName == ''){
            setSnackbarSeverity('error');
            setSnackbarMessage('Name can not be empty.');
            setOpenSnackbar(true);
        }
        if(selectedRowsUI.length == 0){
            setSnackbarSeverity('error');
            setSnackbarMessage('No permissions have been selected.');
            setOpenSnackbar(true);
        }
        else{
            try {
                const payload = {
                    name: roleName,
                    code: roleCode,
                    permissionIds: selectedRowsAPI.map(id => Number(id)),
                    departmentId: Number(choosed.id)
                };
                const response = await apiService.put(`/role/${roleId}`, payload);
    
                if (response.status === 200) {
                    setOpenSnackbar(false);
                    onClose();
                } 
            } catch (error) {
                setSnackbarSeverity('error');
                setSnackbarMessage('Error');
                setOpenSnackbar(true);
            }
        }
        
    };

    const paginatedRows = flattenRows(roles, expandedGroups).slice(page * rowsPerPage, (page + 1) * rowsPerPage);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" sx={{ position: 'absolute' }}>
            <Box>
                <DialogTitle sx={{ fontWeight: 'bold' }}>
                    Edit Role
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
            </Box>
            <DialogContent>
                <div style={{ display: 'flex', marginBottom: '16px' }}>
                    <TextField
                        label="Role Code"
                        value={roleCode}
                        onChange={(e) => setRoleCode(e.target.value)}
                        required
                        size="small"
                        fullWidth
                        style={{ marginRight: '40px' }}
                        disabled
                    />
                    <TextField
                        label="Role Name"
                        required
                        value={roleName}
                        onChange={(e) => setRoleName(e.target.value)}
                        size="small"
                        fullWidth
                    />
                </div>
                <TableContainer ref={tableContainerRef} sx={{ height: '600px', border: 'none' }}>
                    <Table aria-label="permissions table">
                        <TableHead sx={{ background: '#f4f6f8' }}>
                            <TableRow>
                                <TableCell sx={{ borderBottom: 'none', width: '80px' }} />
                                <TableCell sx={{ borderBottom: 'none', width: '80px' }} />
                                <TableCell sx={{ borderBottom: 'none', fontWeight: 'bold' }}>Permission Code</TableCell>
                                <TableCell sx={{ borderBottom: 'none', fontWeight: 'bold' }}>Permission Name</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell />
                                <TableCell />
                                <TableCell>
                                    <TextField
                                        value={permissionCodeFilter}
                                        onChange={(e) => setPermissionCodeFilter(e.target.value)}
                                        size="small"
                                        fullWidth
                                        sx={{ background: '#fff' }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        value={permissionNameFilter}
                                        onChange={(e) => setPermissionNameFilter(e.target.value)}
                                        size="small"
                                        fullWidth
                                        sx={{ background: '#fff' }}
                                    />
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody sx={{ border: 'none' }}>
                            {roles.length > 0 ? renderRows(paginatedRows, expandedGroups, toggleGroup, handleSelect, selectedRowsUI, handleExpand) : (
                                <TableRow>
                                    <TableCell colSpan={4} sx={{ textAlign: 'center' }}>
                                        No data available
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Grid container justifyContent="flex-end">
                    <Grid item>
                        <TablePagination
                            rowsPerPageOptions={[ 10, 25, 50]}
                            component="div"
                            count={totalRows}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="primary" onClick={handleSave}>Save</Button>
            </DialogActions>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={1000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Dialog>
    );
};

export default EditPopup;
