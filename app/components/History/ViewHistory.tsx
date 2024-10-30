import React, { useEffect, useState } from 'react';
import { Box, Container, TextField, Typography, Toolbar, AppBar, Grid, IconButton } from '@mui/material';
import Layout from '../layout';
import { useSearchParams } from 'next/navigation';
import apiService from '@/app/untils/api';
import { HistoryState, initialState } from './historyState';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/navigation';

interface ApiResponse {
    updatedAt: string;
    entityBefore: HistoryState;
    entityAfter: HistoryState;
}

const ViewHistory: React.FC = () => {
    const [beforeState, setBeforeState] = useState<HistoryState>(initialState);
    const [afterState, setAfterState] = useState<HistoryState>(initialState);
    const [updateAtTime, setUpdateAtTime] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    useEffect(() => {
        const fetchHistoryData = async (id: string) => {
            try {
                const res = await apiService.get(`/audit-log/detail/${id}`);
                if (res.status === 200 && res.data) {
                    console.log(res.data)
                    const { updatedAt,entityBefore, entityAfter } = res.data as ApiResponse;
                    setBeforeState(entityBefore);
                    setAfterState(entityAfter);
                    setUpdateAtTime(updatedAt);
                }
            } catch (error) {
                console.error('Error fetching history data:', error);
            }
        };
        if (id) {
            fetchHistoryData(id);
        }
    }, [id]);
    const handleClose = () => {
        router.push('/reportedit')
    }
    const hasError = (beforeValue: any, afterValue: any) => {
        return beforeValue !== afterValue;
    };

    return (
        <Layout>
            <AppBar position="static"
                sx={{
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    backgroundColor: 'white',
                    height: '57px',
                    width: '100%'
                }}>
                <Toolbar sx={{ justifyContent: 'space-between', width: '100%' }}>
                    <Typography
                        sx={{
                            fontSize: '18px',
                            fontWeight: '700',
                            color: 'black',
                            whiteSpace: 'nowrap'
                        }}>
                        View History
                    </Typography>
                    <IconButton
                        size="small"
                        color="default"
                        onClick={handleClose}
                        sx={{ marginRight: '8px' }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Box sx={{ height: '93vh', overflow: 'auto' }}>
                <Container maxWidth="xl">
                    <TextField
                        label="Thời gian update"
                        variant="outlined"
                        value={updateAtTime}
                        fullWidth
                        size="small"
                        disabled
                        sx={{mt: 2}}
                    />
                    <Grid container spacing={2} sx={{ mt: 3, justifyContent: 'space-between', gap: '10px' }}>
                        <Grid item xs={5.9} sx={{ border: 'solid 1px black', borderRadius: '10px', marginLeft: '10px', padding: '10px' }}>
                            <Typography variant="h5" gutterBottom>
                                Before Change
                            </Typography>
                            <Typography variant="h6" gutterBottom sx={{ mt: '10px' }}>
                                1.Thông tin lao động
                            </Typography>
                            <Grid container spacing={2}>
                                {/* Group 1: Thông tin lao động */}

                                <Grid item xs={6}>
                                    <TextField
                                        label="Tổng số lao động"
                                        variant="outlined"
                                        value={beforeState.totalEmployees}
                                        error={hasError(beforeState.totalEmployees, afterState.totalEmployees)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Người làm công tác y tế"
                                        variant="outlined"
                                        value={beforeState.healthcareWorkers}
                                        error={hasError(beforeState.healthcareWorkers, afterState.healthcareWorkers)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Lao động nữ"
                                        variant="outlined"
                                        value={beforeState.femaleEmployees}
                                        error={hasError(beforeState.femaleEmployees, afterState.femaleEmployees)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Lao động dưới 15 tuổi"
                                        variant="outlined"
                                        value={beforeState.employeesUnder15}
                                        error={hasError(beforeState.employeesUnder15, afterState.employeesUnder15)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Lao động khuyết tật"
                                        variant="outlined"
                                        value={beforeState.disabledEmployees}
                                        error={hasError(beforeState.disabledEmployees, afterState.disabledEmployees)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Người làm công tác ATVSLĐ"
                                        variant="outlined"
                                        value={beforeState.hazardousWorkers}
                                        error={hasError(beforeState.hazardousWorkers, afterState.hazardousWorkers)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Lao động làm việc trong điều kiện độc hại"
                                        variant="outlined"
                                        value={beforeState.hazardousEmployees}
                                        error={hasError(beforeState.hazardousEmployees, afterState.hazardousEmployees)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Lao động cao tuổi"
                                        variant="outlined"
                                        value={beforeState.elderlyEmployees}
                                        error={hasError(beforeState.elderlyEmployees, afterState.elderlyEmployees)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Lao động là người chưa thành niên"
                                        variant="outlined"
                                        value={beforeState.underageEmployees}
                                        error={hasError(beforeState.underageEmployees, afterState.underageEmployees)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Typography variant="h6" gutterBottom sx={{ mt: '10px' }}>
                                2.Thông tin tai nạn lao động
                            </Typography>
                            <Grid container spacing={2}>
                                {/* Group 2: Chi phí và hậu quả TNLĐ */}
                                <Grid item xs={6}>
                                    <TextField
                                        label="Tổng số vụ TNLĐ"
                                        variant="outlined"
                                        value={beforeState.totalAccidents}
                                        error={hasError(beforeState.totalAccidents, afterState.totalAccidents)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Tổng chi phí cho TNLĐ"
                                        variant="outlined"
                                        value={beforeState.totalAccidentCosts}
                                        error={hasError(beforeState.totalAccidentCosts, afterState.totalAccidentCosts)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <TextField
                                        label="Số vụ có người chết"
                                        variant="outlined"
                                        value={beforeState.fatalAccidents}
                                        error={hasError(beforeState.fatalAccidents, afterState.fatalAccidents)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Số người chết vì TNLĐ"
                                        variant="outlined"
                                        value={beforeState.fatalities}
                                        error={hasError(beforeState.fatalities, afterState.fatalities)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                {/* <Grid item xs={6}>
                                    <TextField
                                        label="Số người chết vì TNLĐ"
                                        variant="outlined"
                                        value={beforeState.totalAccidents}
                                        error={hasError(beforeState.totalAccidents, afterState.totalAccidents)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid> */}
                                <Grid item xs={6}>
                                    <TextField
                                        label="Số người bị TNLĐ"
                                        variant="outlined"
                                        value={beforeState.injuredEmployees}
                                        error={hasError(beforeState.injuredEmployees, afterState.injuredEmployees)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Số ngày công bị TNLĐ"
                                        variant="outlined"
                                        value={beforeState.lostWorkDays}
                                        error={hasError(beforeState.lostWorkDays, afterState.lostWorkDays)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>

                            </Grid>
                            <Typography variant="h6" gutterBottom sx={{ mt: '10px' }}>
                                3.Bệnh nghề nghiệp
                            </Typography>
                            <Grid container spacing={2}>
                                {/* Group 3: Bệnh nghề nghiệp */}
                                <Grid item xs={6}>
                                    <TextField
                                        label="Tổng số người mắc BNN tới thời điểm BC"
                                        variant="outlined"
                                        value={beforeState.affectedEmployees}
                                        error={hasError(beforeState.affectedEmployees, afterState.affectedEmployees)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Số người phải nghỉ trước tuổi hưu vì BNN"
                                        variant="outlined"
                                        value={beforeState.earlyRetirements}
                                        error={hasError(beforeState.earlyRetirements, afterState.earlyRetirements)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Số người mắc mới BNN"
                                        variant="outlined"
                                        value={beforeState.newCases}
                                        error={hasError(beforeState.newCases, afterState.newCases)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Tổng chi phí BNN phát sinh trong năm"
                                        variant="outlined"
                                        value={beforeState.totalCosts}
                                        error={hasError(beforeState.totalCosts, afterState.totalCosts)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Số ngày công nghỉ phép vì BNN"
                                        variant="outlined"
                                        value={beforeState.sickLeaveDays}
                                        error={hasError(beforeState.sickLeaveDays, afterState.sickLeaveDays)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Typography variant="h6" gutterBottom sx={{ mt: '10px' }}>
                                4.Kết quả phân loại sức khỏe của người lao động
                            </Typography>
                            <Grid container spacing={2}>
                                {/* Group 4: Kết quả phân loại sức khoẻ của người lao động */}
                                <Grid item xs={6}>
                                    <TextField
                                        label="Kết quả phân loại sức khỏe loại I"
                                        variant="outlined"
                                        value={beforeState.healthCategory1}
                                        error={hasError(beforeState.healthCategory1, afterState.healthCategory1)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Kết quả phân loại sức khỏe loại II"
                                        variant="outlined"
                                        value={beforeState.healthCategory2}
                                        error={hasError(beforeState.healthCategory2, afterState.healthCategory2)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Kết quả phân loại sức khỏe loại III"
                                        variant="outlined"
                                        value={beforeState.healthCategory3}
                                        error={hasError(beforeState.healthCategory3, afterState.healthCategory3)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Kết quả phân loại sức khỏe loại IV"
                                        variant="outlined"
                                        value={beforeState.healthCategory4}
                                        error={hasError(beforeState.healthCategory4, afterState.healthCategory4)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Kết quả phân loại sức khỏe loại V"
                                        variant="outlined"
                                        value={beforeState.healthCategory5}
                                        error={hasError(beforeState.healthCategory5, afterState.healthCategory5)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Typography variant="h6" gutterBottom sx={{ mt: '10px' }}>
                                5.Huấn luyện về vệ sinh an toàn lao động
                            </Typography>
                            <Grid container spacing={2}>
                                {/* Group 5: Huấn luyện về vệ sinh an toàn lao động */}
                                <Grid item xs={6}>
                                    <TextField
                                        label="Nhóm 1: SL huấn luyện/SL hiện có (người/người)"
                                        variant="outlined"
                                        value={beforeState.group1TrainingCount}
                                        error={hasError(beforeState.group1TrainingCount, afterState.group1TrainingCount)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Tự huấn luyện"
                                        variant="outlined"
                                        value={beforeState.selfTraining}
                                        error={hasError(beforeState.selfTraining, afterState.selfTraining)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Nhóm 2: SL huấn luyện/SL hiện có (người/người)"
                                        variant="outlined"
                                        value={beforeState.group2TrainingCount}
                                        error={hasError(beforeState.group2TrainingCount, afterState.group2TrainingCount)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Thuê tổ chức cung cấp dịch vụ huấn luyện"
                                        variant="outlined"
                                        value={beforeState.outsourcedTraining}
                                        error={hasError(beforeState.outsourcedTraining, afterState.outsourcedTraining)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Nhóm 3: SL huấn luyện/SL hiện có (người/người)"
                                        variant="outlined"
                                        value={beforeState.group3TrainingCount}
                                        error={hasError(beforeState.group3TrainingCount, afterState.group3TrainingCount)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Nhóm 4: SL huấn luyện/SL hiện có (người/người)"
                                        variant="outlined"
                                        value={beforeState.group4TrainingCount}
                                        error={hasError(beforeState.group4TrainingCount, afterState.group4TrainingCount)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Nhóm 5: SL huấn luyện/SL hiện có (người/người)"
                                        variant="outlined"
                                        value={beforeState.group5TrainingCount}
                                        error={hasError(beforeState.group5TrainingCount, afterState.group5TrainingCount)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Nhóm 6: SL huấn luyện/SL hiện có (người/người)"
                                        variant="outlined"
                                        value={beforeState.group6TrainingCount}
                                        error={hasError(beforeState.group6TrainingCount, afterState.group6TrainingCount)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Typography variant="h6" gutterBottom sx={{ mt: '10px' }}>
                                6.Máy, thiết bị, vật tư có yêu cầu nghiêm ngặt về ATVSLĐ
                            </Typography>
                            <Grid container spacing={2}>
                                {/* Group 6: Máy, thiết bị, vật tư có yêu cầu nghiêm ngặt về ATVSLĐ */}
                                <Grid item xs={6}>
                                    <TextField
                                        label="Tổng số"
                                        variant="outlined"
                                        value={beforeState.totalEquipment}
                                        error={hasError(beforeState.totalEquipment, afterState.totalEquipment)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Số chưa được kiểm định"
                                        variant="outlined"
                                        value={beforeState.uninspectedEquipment}
                                        error={hasError(beforeState.uninspectedEquipment, afterState.uninspectedEquipment)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Máy có yêu cầu nghiêm ngặt ATVSLĐ đang sử dụng"
                                        variant="outlined"
                                        value={beforeState.strictEquipment}
                                        error={hasError(beforeState.strictEquipment, afterState.strictEquipment)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Số đã được khai báo"
                                        variant="outlined"
                                        value={beforeState.reportedEquipment}
                                        error={hasError(beforeState.reportedEquipment, afterState.reportedEquipment)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Số chưa được khai báo"
                                        variant="outlined"
                                        value={beforeState.unreportedEquipment}
                                        error={hasError(beforeState.unreportedEquipment, afterState.unreportedEquipment)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Số đã được kiểm định"
                                        variant="outlined"
                                        value={beforeState.inspectedEquipment}
                                        error={hasError(beforeState.inspectedEquipment, afterState.inspectedEquipment)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Typography variant="h6" gutterBottom sx={{ mt: '10px' }}>
                                7.Thời gian làm việc, thời gian nghỉ ngơi
                            </Typography>
                            <Grid container spacing={2}>
                                {/* Group 7: Thời gian làm việc, thời gian nghỉ ngơi */}
                                <Grid item xs={6}>
                                    <TextField
                                        label="Tổng số người làm thêm trong năm (người)"
                                        variant="outlined"
                                        value={beforeState.totalOvertimeEmployees}
                                        error={hasError(beforeState.totalOvertimeEmployees, afterState.totalOvertimeEmployees)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Tổng số giờ làm thêm trong năm (người)"
                                        variant="outlined"
                                        value={beforeState.totalOvertimeHours}
                                        error={hasError(beforeState.totalOvertimeHours, afterState.totalOvertimeHours)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Số giờ làm thêm cao nhất trong 1 tháng (người)"
                                        variant="outlined"
                                        value={beforeState.maxOvertimeHoursPerMonth}
                                        error={hasError(beforeState.maxOvertimeHoursPerMonth, afterState.maxOvertimeHoursPerMonth)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Typography variant="h6" gutterBottom sx={{ mt: '10px' }}>
                                8.Bồi dưỡng chống độc hại bằng hiện vật
                            </Typography>
                            <Grid container spacing={2}>
                                {/* Group 8: Bồi dưỡng chống độc hại bằng hiện vật */}
                                <Grid item xs={6}>
                                    <TextField
                                        label="Tổng số người"
                                        variant="outlined"
                                        value={beforeState.totalBeneficiaries}
                                        error={hasError(beforeState.totalBeneficiaries, afterState.totalBeneficiaries)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Tổng chi phí quy định tại điểm 10"
                                        variant="outlined"
                                        value={beforeState.totalAllowanceCosts}
                                        error={hasError(beforeState.totalAllowanceCosts, afterState.totalAllowanceCosts)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Typography variant="h6" gutterBottom sx={{ mt: '10px' }}>
                                9.Tình hình quan trắc môi trường
                            </Typography>
                            <Grid container spacing={2}>
                                {/* Group 9: Tình hình quan trắc môi trường */}
                                <Grid item xs={6}>
                                    <TextField
                                        label="Số mẫu quan trắc môi trường lao động (Mẫu)"
                                        variant="outlined"
                                        value={beforeState.totalMonitoringSamples}
                                        error={hasError(beforeState.totalMonitoringSamples, afterState.totalMonitoringSamples)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Số mẫu không đạt tiêu chuẩn (Mẫu)"
                                        variant="outlined"
                                        value={beforeState.nonCompliantSamples}
                                        error={hasError(beforeState.nonCompliantSamples, afterState.nonCompliantSamples)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Mẫu nhiệt độ không đạt (Mẫu/Mẫu)"
                                        variant="outlined"
                                        value={beforeState.nonCompliantTemperatureSamples}
                                        error={hasError(beforeState.nonCompliantTemperatureSamples, afterState.nonCompliantTemperatureSamples)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Mẫu độ ẩm không đạt (Mẫu/Mẫu)"
                                        variant="outlined"
                                        value={beforeState.nonCompliantHumiditySamples}
                                        error={hasError(beforeState.nonCompliantHumiditySamples, afterState.nonCompliantHumiditySamples)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Mẫu tốc độ gió không đạt (Mẫu/Mẫu)"
                                        variant="outlined"
                                        value={beforeState.nonCompliantWindSpeedSamples}
                                        error={hasError(beforeState.nonCompliantWindSpeedSamples, afterState.nonCompliantWindSpeedSamples)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Mẫu bụi không đạt (Mẫu/Mẫu)"
                                        variant="outlined"
                                        value={beforeState.nonCompliantDustSamples}
                                        error={hasError(beforeState.nonCompliantDustSamples, afterState.nonCompliantDustSamples)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Mẫu tiếng ồn không đạt (Mẫu/Mẫu)"
                                        variant="outlined"
                                        value={beforeState.nonCompliantNoiseSamples}
                                        error={hasError(beforeState.nonCompliantNoiseSamples, afterState.nonCompliantNoiseSamples)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Mẫu rung động không đạt (Mẫu/Mẫu)"
                                        variant="outlined"
                                        value={beforeState.nonCompliantVibrationSamples}
                                        error={hasError(beforeState.nonCompliantVibrationSamples, afterState.nonCompliantVibrationSamples)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Mẫu hơi khí độc không đạt (Mẫu/Mẫu)"
                                        variant="outlined"
                                        value={beforeState.nonCompliantToxicGasSamples}
                                        error={hasError(beforeState.nonCompliantToxicGasSamples, afterState.nonCompliantToxicGasSamples)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Mẫu điện từ trường không đạt (Mẫu/Mẫu)"
                                        variant="outlined"
                                        value={beforeState.nonCompliantEMFSamples}
                                        error={hasError(beforeState.nonCompliantEMFSamples, afterState.nonCompliantEMFSamples)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Mẫu ánh sáng không đạt (Mẫu/Mẫu)"
                                        variant="outlined"
                                        value={beforeState.nonCompliantLightSamples}
                                        error={hasError(beforeState.nonCompliantLightSamples, afterState.nonCompliantLightSamples)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Mẫu phóng xạ không đạt (Mẫu/Mẫu)"
                                        variant="outlined"
                                        value={beforeState.nonCompliantRadiationSamples}
                                        error={hasError(beforeState.nonCompliantRadiationSamples, afterState.nonCompliantRadiationSamples)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Mẫu khác không đạt (Mẫu/Mẫu)"
                                        variant="outlined"
                                        value={beforeState.nonCompliantOtherSamples}
                                        error={hasError(beforeState.nonCompliantOtherSamples, afterState.nonCompliantOtherSamples)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Typography variant="h6" gutterBottom sx={{ mt: '10px' }}>
                                10.Chi phí thực hiện kế hoạch ATVSLĐ
                            </Typography>
                            <Grid container spacing={2}>
                                {/* Group 10: Chi phí thực hiện kế hoạch ATVSLĐ */}
                                <Grid item xs={6}>
                                    <TextField
                                        label="Các biện pháp kỹ thuật an toàn"
                                        variant="outlined"
                                        value={beforeState.safetyMeasuresCosts}
                                        error={hasError(beforeState.safetyMeasuresCosts, afterState.safetyMeasuresCosts)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Các biện pháp kỹ thuật vệ sinh"
                                        variant="outlined"
                                        value={beforeState.hygieneMeasuresCosts}
                                        error={hasError(beforeState.hygieneMeasuresCosts, afterState.hygieneMeasuresCosts)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Trang bị phương tiện bảo vệ cá nhân"
                                        variant="outlined"
                                        value={beforeState.ppeCosts}
                                        error={hasError(beforeState.ppeCosts, afterState.ppeCosts)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Đánh giá nguy cơ rủi ro về ATVSLĐ"
                                        variant="outlined"
                                        value={beforeState.riskAssessmentCosts}
                                        error={hasError(beforeState.riskAssessmentCosts, afterState.riskAssessmentCosts)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Chăm sóc sức khỏe người lao động"
                                        variant="outlined"
                                        value={beforeState.employeeHealthcareCosts}
                                        error={hasError(beforeState.employeeHealthcareCosts, afterState.employeeHealthcareCosts)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Tuyên truyền huấn luyện"
                                        variant="outlined"
                                        value={beforeState.trainingCosts}
                                        error={hasError(beforeState.trainingCosts, afterState.trainingCosts)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Chi khác"
                                        variant="outlined"
                                        value={beforeState.otherCosts}
                                        error={hasError(beforeState.otherCosts, afterState.otherCosts)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Typography variant="h6" gutterBottom sx={{ mt: '10px' }}>
                                11.Tổ chức cung cấp dịch vụ
                            </Typography>
                            <Grid container spacing={2}>
                                {/* Group 11: Tổ chức cung cấp dịch vụ */}
                                <Grid item xs={12}>
                                    <TextField
                                        label="Tên tổ chức dịch vụ ATVSLĐ được thuê"
                                        variant="outlined"
                                        value={beforeState.safetyServiceProvider}
                                        error={hasError(beforeState.safetyServiceProvider, afterState.safetyServiceProvider)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Tên tổ chức dịch vụ y tế được thuê"
                                        variant="outlined"
                                        value={beforeState.healthServiceProvider}
                                        error={hasError(beforeState.healthServiceProvider, afterState.healthServiceProvider)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Typography variant="h6" gutterBottom sx={{ mt: '10px' }}>
                                12.Thời điểm tổ chức tiến hành đánh giá nguy cơ rủi ro về ATVSLĐ
                            </Typography>
                            <Grid container spacing={2}>
                                {/* Group 12: Thời điểm tổ chức tiến hành đánh giá nguy cơ rủi ro về ATVSLĐ */}
                                <Grid item xs={12}>
                                    <TextField
                                        label="Tháng/ Năm"
                                        variant="outlined"
                                        value={beforeState.evaluationDate}
                                        error={hasError(beforeState.evaluationDate, afterState.evaluationDate)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={5.9} sx={{ border: 'solid 1px black', borderRadius: '10px', padding: '10px' }}>
                            <Typography variant="h5" gutterBottom>
                                After Change
                            </Typography>
                            <Typography variant="h6" gutterBottom sx={{ mt: '10px' }}>
                                1.Thông tin lao động
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Tổng số lao động"
                                        variant="outlined"
                                        value={afterState.totalEmployees}
                                        error={hasError(beforeState.totalEmployees, afterState.totalEmployees)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Người làm công tác y tế"
                                        variant="outlined"
                                        value={afterState.healthcareWorkers}
                                        error={hasError(beforeState.healthcareWorkers, afterState.healthcareWorkers)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Lao động nữ"
                                        variant="outlined"
                                        value={afterState.femaleEmployees}
                                        error={hasError(beforeState.femaleEmployees, afterState.femaleEmployees)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Lao động dưới 15 tuổi"
                                        variant="outlined"
                                        value={afterState.employeesUnder15}
                                        error={hasError(beforeState.employeesUnder15, afterState.employeesUnder15)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Lao động khuyết tật"
                                        variant="outlined"
                                        value={afterState.disabledEmployees}
                                        error={hasError(beforeState.disabledEmployees, afterState.disabledEmployees)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Người làm công tác ATVSLĐ"
                                        variant="outlined"
                                        value={afterState.hazardousWorkers}
                                        error={hasError(beforeState.hazardousWorkers, afterState.hazardousWorkers)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Lao động làm việc trong điều kiện độc hại"
                                        variant="outlined"
                                        value={afterState.hazardousEmployees}
                                        error={hasError(beforeState.hazardousEmployees, afterState.hazardousEmployees)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Lao động cao tuổi"
                                        variant="outlined"
                                        value={afterState.elderlyEmployees}
                                        error={hasError(beforeState.elderlyEmployees, afterState.elderlyEmployees)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Lao động là người chưa thành niên"
                                        variant="outlined"
                                        value={afterState.underageEmployees}
                                        error={hasError(beforeState.underageEmployees, afterState.underageEmployees)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Typography variant="h6" gutterBottom sx={{ mt: '10px' }}>
                                2.Thông tin tai nạn lao động
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Tổng số vụ TNLĐ"
                                        variant="outlined"
                                        value={afterState.totalAccidents}
                                        error={hasError(beforeState.totalAccidents, afterState.totalAccidents)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Tổng chi phí cho TNLĐ"
                                        variant="outlined"
                                        value={afterState.totalAccidentCosts}
                                        error={hasError(beforeState.totalAccidentCosts, afterState.totalAccidentCosts)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Số vụ có người chết"
                                        variant="outlined"
                                        value={afterState.fatalAccidents}
                                        error={hasError(beforeState.fatalAccidents, afterState.fatalAccidents)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Số người chết vì TNLĐ"
                                        variant="outlined"
                                        value={afterState.fatalities}
                                        error={hasError(beforeState.fatalities, afterState.fatalities)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Số người bị TNLĐ"
                                        variant="outlined"
                                        value={afterState.injuredEmployees}
                                        error={hasError(beforeState.injuredEmployees, afterState.injuredEmployees)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Số ngày công bị TNLĐ"
                                        variant="outlined"
                                        value={afterState.lostWorkDays}
                                        error={hasError(beforeState.lostWorkDays, afterState.lostWorkDays)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Typography variant="h6" gutterBottom sx={{ mt: '10px' }}>
                                3.Bệnh nghề nghiệp
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Tổng số người mắc BNN tới thời điểm BC"
                                        variant="outlined"
                                        value={afterState.affectedEmployees}
                                        error={hasError(beforeState.affectedEmployees, afterState.affectedEmployees)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Số người phải nghỉ trước tuổi hưu vì BNN"
                                        variant="outlined"
                                        value={afterState.earlyRetirements}
                                        error={hasError(beforeState.earlyRetirements, afterState.earlyRetirements)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Số người mắc mới BNN"
                                        variant="outlined"
                                        value={afterState.newCases}
                                        error={hasError(beforeState.newCases, afterState.newCases)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Tổng chi phí BNN phát sinh trong năm"
                                        variant="outlined"
                                        value={afterState.totalCosts}
                                        error={hasError(beforeState.totalCosts, afterState.totalCosts)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Số ngày công nghỉ phép vì BNN"
                                        variant="outlined"
                                        value={afterState.sickLeaveDays}
                                        error={hasError(beforeState.sickLeaveDays, afterState.sickLeaveDays)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Typography variant="h6" gutterBottom sx={{ mt: '10px' }}>
                                4.Kết quả phân loại sức khỏe của người lao động
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Kết quả phân loại sức khỏe loại I"
                                        variant="outlined"
                                        value={afterState.healthCategory1}
                                        error={hasError(beforeState.healthCategory1, afterState.healthCategory1)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Kết quả phân loại sức khỏe loại II"
                                        variant="outlined"
                                        value={afterState.healthCategory2}
                                        error={hasError(beforeState.healthCategory2, afterState.healthCategory2)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Kết quả phân loại sức khỏe loại III"
                                        variant="outlined"
                                        value={afterState.healthCategory3}
                                        error={hasError(beforeState.healthCategory3, afterState.healthCategory3)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Kết quả phân loại sức khỏe loại IV"
                                        variant="outlined"
                                        value={afterState.healthCategory4}
                                        error={hasError(beforeState.healthCategory4, afterState.healthCategory4)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Kết quả phân loại sức khỏe loại V"
                                        variant="outlined"
                                        value={afterState.healthCategory5}
                                        error={hasError(beforeState.healthCategory5, afterState.healthCategory5)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Typography variant="h6" gutterBottom sx={{ mt: '10px' }}>
                                5.Huấn luyện về vệ sinh an toàn lao động
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Nhóm 1: SL huấn luyện/SL hiện có (người/người)"
                                        variant="outlined"
                                        value={afterState.group1TrainingCount}
                                        error={hasError(beforeState.group1TrainingCount, afterState.group1TrainingCount)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Tự huấn luyện"
                                        variant="outlined"
                                        value={afterState.selfTraining}
                                        error={hasError(beforeState.selfTraining, afterState.selfTraining)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Nhóm 2: SL huấn luyện/SL hiện có (người/người)"
                                        variant="outlined"
                                        value={afterState.group2TrainingCount}
                                        error={hasError(beforeState.group2TrainingCount, afterState.group2TrainingCount)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Thuê tổ chức cung cấp dịch vụ huấn luyện"
                                        variant="outlined"
                                        value={afterState.outsourcedTraining}
                                        error={hasError(beforeState.outsourcedTraining, afterState.outsourcedTraining)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Nhóm 3: SL huấn luyện/SL hiện có (người/người)"
                                        variant="outlined"
                                        value={afterState.group3TrainingCount}
                                        error={hasError(beforeState.group3TrainingCount, afterState.group3TrainingCount)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Nhóm 4: SL huấn luyện/SL hiện có (người/người)"
                                        variant="outlined"
                                        value={afterState.group4TrainingCount}
                                        error={hasError(beforeState.group4TrainingCount, afterState.group4TrainingCount)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Nhóm 5: SL huấn luyện/SL hiện có (người/người)"
                                        variant="outlined"
                                        value={afterState.group5TrainingCount}
                                        error={hasError(beforeState.group5TrainingCount, afterState.group5TrainingCount)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Nhóm 6: SL huấn luyện/SL hiện có (người/người)"
                                        variant="outlined"
                                        value={afterState.group6TrainingCount}
                                        error={hasError(beforeState.group6TrainingCount, afterState.group6TrainingCount)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Typography variant="h6" gutterBottom sx={{ mt: '10px' }}>
                                6.Máy, thiết bị, vật tư có yêu cầu nghiêm ngặt về ATVSLĐ
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Tổng số"
                                        variant="outlined"
                                        value={afterState.totalEquipment}
                                        error={hasError(beforeState.totalEquipment, afterState.totalEquipment)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Số chưa được kiểm định"
                                        variant="outlined"
                                        value={afterState.uninspectedEquipment}
                                        error={hasError(beforeState.uninspectedEquipment, afterState.uninspectedEquipment)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Máy có yêu cầu nghiêm ngặt ATVSLĐ đang sử dụng"
                                        variant="outlined"
                                        value={afterState.strictEquipment}
                                        error={hasError(beforeState.strictEquipment, afterState.strictEquipment)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Số đã được khai báo"
                                        variant="outlined"
                                        value={afterState.reportedEquipment}
                                        error={hasError(beforeState.reportedEquipment, afterState.reportedEquipment)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Số chưa được khai báo"
                                        variant="outlined"
                                        value={afterState.unreportedEquipment}
                                        error={hasError(beforeState.unreportedEquipment, afterState.unreportedEquipment)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Số đã được kiểm định"
                                        variant="outlined"
                                        value={afterState.inspectedEquipment}
                                        error={hasError(beforeState.inspectedEquipment, afterState.inspectedEquipment)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Typography variant="h6" gutterBottom sx={{ mt: '10px' }}>
                                7.Thời gian làm việc, thời gian nghỉ ngơi
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Tổng số người làm thêm trong năm (người)"
                                        variant="outlined"
                                        value={afterState.totalOvertimeEmployees}
                                        error={hasError(beforeState.totalOvertimeEmployees, afterState.totalOvertimeEmployees)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Tổng số giờ làm thêm trong năm (người)"
                                        variant="outlined"
                                        value={afterState.totalOvertimeHours}
                                        error={hasError(beforeState.totalOvertimeHours, afterState.totalOvertimeHours)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Số giờ làm thêm cao nhất trong 1 tháng (người)"
                                        variant="outlined"
                                        value={afterState.maxOvertimeHoursPerMonth}
                                        error={hasError(beforeState.maxOvertimeHoursPerMonth, afterState.maxOvertimeHoursPerMonth)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Typography variant="h6" gutterBottom sx={{ mt: '10px' }}>
                                8.Bồi dưỡng chống độc hại bằng hiện vật
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Tổng số người"
                                        variant="outlined"
                                        value={afterState.totalBeneficiaries}
                                        error={hasError(beforeState.totalBeneficiaries, afterState.totalBeneficiaries)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Tổng chi phí quy định tại điểm 10"
                                        variant="outlined"
                                        value={afterState.totalAllowanceCosts}
                                        error={hasError(beforeState.totalAllowanceCosts, afterState.totalAllowanceCosts)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Typography variant="h6" gutterBottom sx={{ mt: '10px' }}>
                                9.Tình hình quan trắc môi trường
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Số mẫu quan trắc môi trường lao động (Mẫu)"
                                        variant="outlined"
                                        value={afterState.totalMonitoringSamples}
                                        error={hasError(beforeState.totalMonitoringSamples, afterState.totalMonitoringSamples)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Số mẫu không đạt tiêu chuẩn (Mẫu)"
                                        variant="outlined"
                                        value={afterState.nonCompliantSamples}
                                        error={hasError(beforeState.nonCompliantSamples, afterState.nonCompliantSamples)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Mẫu nhiệt độ không đạt (Mẫu/Mẫu)"
                                        variant="outlined"
                                        value={afterState.nonCompliantTemperatureSamples}
                                        error={hasError(beforeState.nonCompliantTemperatureSamples, afterState.nonCompliantTemperatureSamples)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Mẫu độ ẩm không đạt (Mẫu/Mẫu)"
                                        variant="outlined"
                                        value={afterState.nonCompliantHumiditySamples}
                                        error={hasError(beforeState.nonCompliantHumiditySamples, afterState.nonCompliantHumiditySamples)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Mẫu tốc độ gió không đạt (Mẫu/Mẫu)"
                                        variant="outlined"
                                        value={afterState.nonCompliantWindSpeedSamples}
                                        error={hasError(beforeState.nonCompliantWindSpeedSamples, afterState.nonCompliantWindSpeedSamples)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Mẫu bụi không đạt (Mẫu/Mẫu)"
                                        variant="outlined"
                                        value={afterState.nonCompliantDustSamples}
                                        error={hasError(beforeState.nonCompliantDustSamples, afterState.nonCompliantDustSamples)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Mẫu tiếng ồn không đạt (Mẫu/Mẫu)"
                                        variant="outlined"
                                        value={afterState.nonCompliantNoiseSamples}
                                        error={hasError(beforeState.nonCompliantNoiseSamples, afterState.nonCompliantNoiseSamples)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Mẫu rung động không đạt (Mẫu/Mẫu)"
                                        variant="outlined"
                                        value={afterState.nonCompliantVibrationSamples}
                                        error={hasError(beforeState.nonCompliantVibrationSamples, afterState.nonCompliantVibrationSamples)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Mẫu hơi khí độc không đạt (Mẫu/Mẫu)"
                                        variant="outlined"
                                        value={afterState.nonCompliantToxicGasSamples}
                                        error={hasError(beforeState.nonCompliantToxicGasSamples, afterState.nonCompliantToxicGasSamples)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Mẫu điện từ trường không đạt (Mẫu/Mẫu)"
                                        variant="outlined"
                                        value={afterState.nonCompliantEMFSamples}
                                        error={hasError(beforeState.nonCompliantEMFSamples, afterState.nonCompliantEMFSamples)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Mẫu ánh sáng không đạt (Mẫu/Mẫu)"
                                        variant="outlined"
                                        value={afterState.nonCompliantLightSamples}
                                        error={hasError(beforeState.nonCompliantLightSamples, afterState.nonCompliantLightSamples)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Mẫu phóng xạ không đạt (Mẫu/Mẫu)"
                                        variant="outlined"
                                        value={afterState.nonCompliantRadiationSamples}
                                        error={hasError(beforeState.nonCompliantRadiationSamples, afterState.nonCompliantRadiationSamples)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Mẫu khác không đạt (Mẫu/Mẫu)"
                                        variant="outlined"
                                        value={afterState.nonCompliantOtherSamples}
                                        error={hasError(beforeState.nonCompliantOtherSamples, afterState.nonCompliantOtherSamples)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Typography variant="h6" gutterBottom sx={{ mt: '10px' }}>
                                10.Chi phí thực hiện kế hoạch ATVSLĐ
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Các biện pháp kỹ thuật an toàn"
                                        variant="outlined"
                                        value={afterState.safetyMeasuresCosts}
                                        error={hasError(beforeState.safetyMeasuresCosts, afterState.safetyMeasuresCosts)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Các biện pháp kỹ thuật vệ sinh"
                                        variant="outlined"
                                        value={afterState.hygieneMeasuresCosts}
                                        error={hasError(beforeState.hygieneMeasuresCosts, afterState.hygieneMeasuresCosts)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Trang bị phương tiện bảo vệ cá nhân"
                                        variant="outlined"
                                        value={afterState.ppeCosts}
                                        error={hasError(beforeState.ppeCosts, afterState.ppeCosts)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Đánh giá nguy cơ rủi ro về ATVSLĐ"
                                        variant="outlined"
                                        value={afterState.riskAssessmentCosts}
                                        error={hasError(beforeState.riskAssessmentCosts, afterState.riskAssessmentCosts)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Chăm sóc sức khỏe người lao động"
                                        variant="outlined"
                                        value={afterState.employeeHealthcareCosts}
                                        error={hasError(beforeState.employeeHealthcareCosts, afterState.employeeHealthcareCosts)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Tuyên truyền huấn luyện"
                                        variant="outlined"
                                        value={afterState.trainingCosts}
                                        error={hasError(beforeState.trainingCosts, afterState.trainingCosts)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Chi khác"
                                        variant="outlined"
                                        value={afterState.otherCosts}
                                        error={hasError(beforeState.otherCosts, afterState.otherCosts)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Typography variant="h6" gutterBottom sx={{ mt: '10px' }}>
                                11.Tổ chức cung cấp dịch vụ
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Tên tổ chức dịch vụ ATVSLĐ được thuê"
                                        variant="outlined"
                                        value={afterState.safetyServiceProvider}
                                        error={hasError(beforeState.safetyServiceProvider, afterState.safetyServiceProvider)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Tên tổ chức dịch vụ y tế được thuê"
                                        variant="outlined"
                                        value={afterState.healthServiceProvider}
                                        error={hasError(beforeState.healthServiceProvider, afterState.healthServiceProvider)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Typography variant="h6" gutterBottom sx={{ mt: '10px' }}>
                                12.Thời điểm tổ chức tiến hành đánh giá nguy cơ rủi ro về ATVSLĐ
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Tháng/ Năm"
                                        variant="outlined"
                                        value={afterState.evaluationDate}
                                        error={hasError(beforeState.evaluationDate, afterState.evaluationDate)}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'red',
                                            },
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Layout>
    );
};

export default ViewHistory;
