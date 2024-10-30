import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import TablePagination from '@mui/material/TablePagination';
import IconButton from '@mui/material/IconButton';
import { Grid } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import apiService from '@/app/untils/api';
import { useAppContext } from '@/app/hooks/AppContext';

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

interface DepartmentTableProps {
    refresh: boolean;
}

export default function DepartmentTable({ refresh }: DepartmentTableProps) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRows, setTotalRows] = useState(0);
    const { roles, setRoles } = useAppContext();
    const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
    const [permissionCodeFilter, setPermissionCodeFilter] = useState('');
    const [permissionNameFilter, setPermissionNameFilter] = useState('');

    useEffect(() => {
        fetchRows();
    }, [page, rowsPerPage, refresh, permissionCodeFilter, permissionNameFilter]);

    const fetchRows = async () => {
        try {
            const params = new URLSearchParams();
            if (permissionCodeFilter) params.append('code', permissionCodeFilter);
            if (permissionNameFilter) params.append('name', permissionNameFilter);

            const response = await apiService.get<ApiResponse>(`/permission?${params.toString()}`);
            const data = response.data.data.items;
            setRoles(data);
            updateTotalRows(data, expandedGroups);
        } catch (error: any) {
            console.error('Error fetching data: ', error);
            console.error('stats', error.response.data)
        }
    };

    const updateTotalRows = (data: Row[], expandedGroups: string[]) => {
        const calculateTotalRows = (rows: Row[]): number => {
            let count = rows.length;
            rows.forEach(row => {
                if (row.children && expandedGroups.includes(row.id)) {
                    count += calculateTotalRows(row.children);
                }
            });
            return count;
        };
        const total = calculateTotalRows(data);
        setTotalRows(total);
    };

    const handlePermissionCodeFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPermissionCodeFilter(event.target.value);
    };

    const handlePermissionNameFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPermissionNameFilter(event.target.value);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        updateTotalRows(roles, expandedGroups); 
    };

    const toggleGroup = (id: string) => {
        setExpandedGroups(prev => {
            const isExpanded = prev.includes(id);
            const newExpandedGroups = isExpanded ? prev.filter(groupId => groupId !== id) : [...prev, id];
            updateTotalRows(roles, newExpandedGroups);
            return newExpandedGroups;
        });
    };

    const toRoman = (num: number): string => {
        const romanNumerals: { [key: number]: string } = {
            1: 'I', 4: 'IV', 5: 'V', 9: 'IX', 10: 'X',
            40: 'XL', 50: 'L', 90: 'XC', 100: 'C',
            400: 'CD', 500: 'D', 900: 'CM', 1000: 'M'
        };

        let result = '';
        let value = num;

        const keys = Object.keys(romanNumerals).map(Number).sort((a, b) => b - a);

        for (const key of keys) {
            while (value >= key) {
                result += romanNumerals[key];
                value -= key;
            }
        }

        return result;
    };

    const flattenRows = (rows: Row[]): { row: Row, id: string }[] => {
        const result: { row: Row, id: string }[] = [];
        const flatten = (rows: Row[], parentId: string | null = null, level: number = 0) => {
            rows.forEach((row, index) => {
                const id = parentId ? `${index + 1}` : toRoman(index + 1);
                result.push({ row, id });
                if (row.children && expandedGroups.includes(row.id)) {
                    flatten(row.children, id, level + 1);
                }
            });
        };
        flatten(rows);
        return result;
    };

    const renderRows = (rows: Row[], page: number, rowsPerPage: number): JSX.Element[] => {
        const flattenedRows = flattenRows(rows);
        const paginatedRows = flattenedRows.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

        return paginatedRows.map(({ row, id }, index) => (
            <React.Fragment key={row.id}>
                <TableRow sx={{ height: '45px', cursor: 'pointer' }}>
                    <TableCell sx={{ padding: '4px 8px 4px 16px' }}>
                        {row.type === 'Group' && (
                            <IconButton onClick={() => toggleGroup(row.id)} sx={{ color: 'black' }}>
                                {expandedGroups.includes(row.id) ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                            </IconButton>
                        )}
                    </TableCell>
                    <TableCell sx={{ padding: '4px 8px 4px 16px' }}>{id}</TableCell>
                    <TableCell sx={{ padding: '4px 8px 4px 16px' }}>{row.type}</TableCell>
                    <TableCell sx={{ padding: row.type === 'Component' ? '4px 8px 4px 36px' : '4px 8px 4px 16px' }}>{row.code}</TableCell>
                    <TableCell sx={{ padding: '4px 8px 4px 16px' }}>{row.name}</TableCell>
                </TableRow>
            </React.Fragment>
        ));
    };

    return (
        <Paper sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
            <TableContainer sx={{ flexGrow: 1, maxHeight: '80vh', overflow: 'auto' }}>
                <Table  sx={{ width: '100%' }} aria-label="simple table">
                    <TableHead sx={{ background: '#f4f6f8' }}>
                        <TableRow>
                            <TableCell sx={{ padding: '4px 8px 4px 16px', borderBottom: 'none' }} />
                            <TableCell sx={{ fontWeight: 'bold', padding: '4px 8px 4px 16px', borderBottom: 'none' }}>No</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', padding: '4px 8px 4px 16px', width: '200px', borderBottom: 'none' }}>Type</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', padding: '4px 8px 4px 16px', width: '550px', borderBottom: 'none' }}>Permission Code</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', padding: '4px 8px 4px 16px', borderBottom: 'none' }}>Permission Name</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ padding: '4px 8px 4px 16px', borderBottom: 'none' }} />
                            <TableCell sx={{ padding: '4px 8px 4px 16px', borderBottom: 'none' }} />
                            <TableCell sx={{ padding: '4px 8px 4px 16px', width: '200px', borderBottom: 'none' }} />
                            <TableCell sx={{ padding: '4px 8px 4px 16px', width: '550px', borderBottom: 'none' }}>
                                <TextField size="small" sx={{ background: 'white' }} fullWidth value={permissionCodeFilter} onChange={handlePermissionCodeFilterChange} />
                            </TableCell>
                            <TableCell sx={{ padding: '4px 8px 4px 16px', borderBottom: 'none' }}>
                                <TextField size="small" sx={{ background: 'white' }} fullWidth value={permissionNameFilter} onChange={handlePermissionNameFilterChange} />
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {roles.length > 0 ? renderRows(roles, page, rowsPerPage) : (
                            <TableRow>
                                <TableCell colSpan={5} sx={{ textAlign: 'center', padding: '4px 8px 4px 16px' }}>
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
        </Paper>
    );
}
