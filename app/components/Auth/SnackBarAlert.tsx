import React from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

interface SnackBarAlertProps {
    open: boolean;
    handleClose: (event: any, reason: any) => void;
    error: string;
    type: AlertColor;
}

const SnackBarAlert: React.FC<SnackBarAlertProps> = ({ open, handleClose, error, type}) => {
    return (
        <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <Alert severity={type} sx={{ width: '600px' }}>
                {error}
            </Alert>
        </Snackbar>
    );
};

export default SnackBarAlert;
