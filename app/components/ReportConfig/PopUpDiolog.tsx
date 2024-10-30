import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Button, Box, IconButton } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import apiService from '@/app/untils/api';

interface AddNewDialog {
    open: boolean;
    onClose: () => void;
    type: 'edit' | 'add';
    id?: number
}
interface Report {
    id: number,
    reportName: string,
    reportYear: string,
    reportPeriod: string,
    startTime: string,
    endTime: string,
    status: boolean,
    modifyAuth: boolean
}

const AddNewDialog: React.FC<AddNewDialog> = ({ open, onClose, type, id }) => {
    const [formData, setFormData] = useState({
        reportName: '',
        reportYear: '',
        reportPeriod: '',
        startTime: '',
        endTime: '',
        status: true,
        modifyAuth: true,
    });
    useEffect(() => {
        if (type == 'add') {
            refreshData();
        }
        if (type == 'edit') {
            fetchData();
        }
    }, [open])
    const refreshData = () => {
        const refresh = {
            reportName: '',
            reportYear: '',
            reportPeriod: '',
            startTime: '',
            endTime: '',
            status: true,
            modifyAuth: true
        }
        setFormData(refresh);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: name === "status" || name === "modifyAuth" ? value === "true" : value,
        }));
    };

    const handleSave = async () => {
        console.log('Form Data:', formData);
        const dataToApi = {
            reportName: formData.reportName,
            reportYear: formData.reportYear,
            reportPeriod: formData.reportPeriod,
            startTime: formData.startTime,
            endTime: formData.endTime,
            status: formData.status,
            modifyAuth: formData.modifyAuth
        }
        console.log(dataToApi)
        if (type == 'add') {
            try {
                const res = await apiService.post('/report-config', formData);
                console.log(res)
            } catch (error) {
                console.log(error);
            }

        }
        if (type == 'edit') {
            try {
                const res = apiService.put(`/report-config/${id}`, formData);
                console.log(res)
            } catch (error) {
                console.log(error)
            }
        }
        onClose();
    };
    const convertDateToApi = (date: string): string => {
        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year}`;
    }
    const fetchData = async () => {
        try {
            const res = await apiService.get(`report-config/dads/${id}`);
            console.log(res.data);
            setFormData(res.data as Report)
        } catch (error) {
            console.log('Lỗi')
        }

    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <Box>
                <DialogTitle sx={{ fontWeight: 'bold' }}>
                    {
                        type == 'add' ? 'Add New' : 'Edit'
                    }
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
                <TextField
                    label="Report Type"
                    name="reportName"
                    select
                    fullWidth
                    size='small'
                    margin="normal"
                    value={formData.reportName}
                    disabled={type == 'edit' ? true : false}
                    onChange={handleChange}
                    required
                >
                    <MenuItem value="Báo cáo ATVSLĐ">Báo cáo ATVSLĐ</MenuItem>
                </TextField>
                <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="center"
                    gap="20px"
                >
                    <TextField
                        label="Year"
                        name="reportYear"
                        fullWidth
                        size='small'
                        margin="normal"
                        value={formData.reportYear}
                        disabled={type == 'edit' ? true : false}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        label="Reporting Period"
                        name="reportPeriod"
                        select
                        fullWidth
                        size='small'
                        margin="normal"
                        value={formData.reportPeriod}
                        disabled={type == 'edit' ? true : false}
                        onChange={handleChange}
                        required
                    >

                        <MenuItem value="6 tháng">6 tháng</MenuItem>
                        <MenuItem value="Cả năm">Cả năm</MenuItem>
                    </TextField>
                </Box>
                <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="center"
                    gap="20px"
                >
                    <TextField
                        label="Start Date"
                        name="startTime"
                        type="date"
                        fullWidth
                        size='small'
                        margin="normal"
                        value={formData.startTime}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="Finish Date"
                        name="endTime"
                        type="date"
                        fullWidth
                        size='small'
                        margin="normal"
                        value={formData.endTime}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                    />
                </Box>
                <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="center"
                    gap="20px"
                >
                    <TextField
                        label="Status"
                        name="status"
                        select
                        fullWidth
                        size='small'
                        margin="normal"
                        value={formData.status}
                        onChange={handleChange}
                    >
                        <MenuItem value={true.toString()}>Active</MenuItem>
                        <MenuItem value={false.toString()}>Inactive</MenuItem>
                    </TextField>
                    <TextField
                        label="Can edit at low level"
                        name="modifyAuth"
                        select
                        fullWidth
                        size='small'
                        margin="normal"
                        value={formData.modifyAuth}
                        onChange={handleChange}
                    >
                        <MenuItem value={true.toString()}>Active</MenuItem>
                        <MenuItem value={false.toString()}>Inactive</MenuItem>
                    </TextField>

                </Box>
                {/* <TextField
                    label="Status"
                    name="status"
                    select
                    fullWidth
                    size='small'
                    margin="normal"
                    value={formData.status}
                    onChange={handleChange}
                >
                    <MenuItem value={true.toString()}>Active</MenuItem>
                    <MenuItem value={false.toString()}>Inactive</MenuItem>
                </TextField> */}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSave}
                    variant="contained"
                    color="primary"

                    startIcon={<SaveIcon />}
                    sx={{ marginRight: '16px', width: '100px' }}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddNewDialog;
