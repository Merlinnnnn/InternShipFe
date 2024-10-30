import React, { useState, useEffect } from 'react';
import { Dialog, AppBar, Toolbar, IconButton, Typography, Box, Container, Button, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import apiService from '@/app/untils/api';
import { useRouter } from 'next/navigation';

interface ApiResponseData {
    url: string;
}

const FullScreenDialog: React.FC<{ value?: string, open: boolean, onClose: () => void, isEdit?: boolean, url?: string }> = ({ value, open, onClose, isEdit, url }) => {
    const [localUrl, setLocalUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            if (url) {
                setLocalUrl(url);
            }
            else {
                setIsLoading(true);
                try {
                    const res = await apiService.get<ApiResponseData>(`/report/review/${value}`);
                    const url = res.data.url;
                    sessionStorage.setItem('url', url);
                    setLocalUrl(url);
                } catch (error) {
                    console.error("Failed to fetch report URL:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchData();
    }, [open]);

    const handleUncheck = async () => {
        setIsLoading(true);
        let value = sessionStorage.getItem('key');
        if (value) {
            try {
                const res = await apiService.put(`/report/approve-report?reportIds=${value}&statusId=5`);
                console.log(res);
                onClose();
            } catch (error) {
                console.error("Failed to reset status:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleCheck = async () => {
        setIsLoading(true);
        let value = sessionStorage.getItem('key');
        if (value) {
            try {
                const res = await apiService.put(`/report/approve-report?reportIds=${value}&statusId=4`);
                console.log(res);
                onClose();
            } catch (error) {
                console.error("Failed to reset status:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <Dialog maxWidth='lg' fullWidth open={open} onClose={onClose}>
            <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Report Viewer
                    </Typography>
                    <Box sx={{ gap: '20px' }}>
                        {
                            isEdit && (
                                <>
                                    <Button variant="contained" color="primary" onClick={handleCheck} sx={{ background: 'green', width: '100px', marginTop: '10px', marginBottom: '10px' }}>
                                        Accept
                                    </Button>
                                    <Button variant="contained" onClick={handleUncheck} sx={{ background: 'red', width: '100px', marginTop: '10px', marginBottom: '10px', marginLeft: '20px' }}>
                                        Refuse
                                    </Button>
                                </>
                            )
                        }
                    </Box>
                </Toolbar>
            </AppBar>
            <Box sx={{ height: 'calc(100vh - 57px)', overflow: 'auto' }}>
                <Container maxWidth="xl">
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '850px' }}>
                        {isLoading ? (
                            <CircularProgress />
                        ) : (
                            localUrl ? (
                                <iframe
                                    src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(localUrl)}`}
                                    width="100%"
                                    height="100%"
                                    title="Word Document Viewer"
                                    style={{ border: 'none' }}
                                ></iframe>
                            ) : (
                                <Typography variant="h6" gutterBottom>
                                    No report available
                                </Typography>
                            )
                        )}
                    </Box>
                </Container>
            </Box>
        </Dialog>
    );
};

export default FullScreenDialog;
