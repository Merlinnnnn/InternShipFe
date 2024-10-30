import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, TextField, Box } from '@mui/material';
import { useLoginForm } from '../../hooks/useLoginForm';
import styles from './Login.module.css';
import SnackBarAlert from './SnackBarAlert';
import { useLoginHandlers } from '@/app/hooks/useLoginHandlers';

interface ForgotPasswordDialogProps {
    open: boolean;
    onClose: () => void;
}

const EmailDialog: React.FC<ForgotPasswordDialogProps> = ({ open, onClose }) => {
    const {
        open: openAlert,
        error,
        type,
        countdown,
        email,
        handleClose,
        handleSendEmailRequest,
        setEmail,
        setCountdown
    } = useLoginHandlers();

    // Reset email and countdown when the dialog is opened
    useEffect(() => {
        if (open) {
            setEmail('');
            setCountdown(0);
        }
    }, [open, setEmail, setCountdown]);

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    style: {
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '310px',
                        width: '630px',
                    },
                }}
            >
                <div className={styles.titleComponent}>
                    <DialogTitle className={styles.dialogTitle}>Quên mật khẩu</DialogTitle>
                    <Typography gutterBottom>Vui lòng nhập email đã đăng ký tài khoản</Typography>
                    <TextField
                        fullWidth
                        required
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        margin="normal"
                        variant="outlined"
                        disabled={countdown > 0}
                    />
                </div>
                <DialogContent>
                    <div className={styles.diologForm}>
                        <Button variant="contained" color="primary" fullWidth onClick={handleSendEmailRequest} className={styles.noneCaseBtn} disabled={countdown > 0}>
                            Gửi yêu cầu
                        </Button>
                        {countdown > 0 && type!='error' && (
                            <Typography variant="body2" color="textSecondary" style={{marginTop: '5px'}}>
                                Gửi yêu cầu lần tiếp theo: {countdown}s
                            </Typography>
                        )}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Typography>Bạn đã có tài khoản?</Typography>
                    <Button onClick={onClose} color="primary" className={styles.noneCaseBtn}>
                        Đăng nhập
                    </Button>
                </DialogActions>
            </Dialog>
            <SnackBarAlert open={openAlert} handleClose={handleClose} error={error} type={type} />
        </>
    );
};

export default EmailDialog;
