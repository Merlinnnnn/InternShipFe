import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Box, TextField, Button, Typography, DialogActions } from '@mui/material';
import styles from './Login.module.css';
import { useLoginHandlers } from '@/app/hooks/useLoginHandlers';
import SnackBarAlert from './SnackBarAlert';

interface OtpDialogProps {
    open: boolean;
    onClose: () => void;
}

const OtpDialog: React.FC<OtpDialogProps> = ({ open, onClose }) => {
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

    const [otp, setOtp] = useState(['', '', '', '']);
    const [openOtp, setOpenOtp] = useState(false);
    const [openNewPassword, setOpenNewPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleChangeOtp = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setOtp(otp.map((o, i) => (i === index ? value : o)));
    };

    const handleCloseOtp = () => {
        setOpenOtp(false);
    };

    const handleOpenOtp = () => {
        onClose();
        setOpenOtp(true);
    };

    const handleOpenNewPassword = () => {
        setOpenOtp(false);
        setOpenNewPassword(true);
    };

    const handleNewPasswordSubmit = () => {
        // Logic để xử lý thay đổi mật khẩu
        console.log('New Password Submitted');
    };

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
                    <Typography gutterBottom>Vui lòng nhập Số điện thoại để tiếp tục</Typography>
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
                        <Button variant="contained" color="primary" fullWidth onClick={handleOpenOtp} className={styles.noneCaseBtn} disabled={countdown > 0}>
                            Gửi yêu cầu
                        </Button>
                        {countdown > 0 && type != 'error' && (
                            <Typography variant="body2" color="textSecondary" style={{ marginTop: '5px' }}>
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
            <Dialog open={openOtp} onClose={handleCloseOtp} fullWidth maxWidth="sm">
                <DialogTitle className={styles.diologTitle}>Nhập mã xác thực</DialogTitle>
                <DialogContent>
                    <Typography gutterBottom>Mã xác thực OTP đã được gửi qua SDT Zalo: 0978999000</Typography>
                    <Box display="flex" justifyContent="space-between" width="100%">
                        {otp.map((value, index) => (
                            <TextField
                                style={{ backgroundColor: '#ebebeb', margin: '20px' }}
                                key={index}
                                value={value}
                                variant="outlined"
                                fullWidth
                                required
                                onChange={handleChangeOtp(index)}
                                margin="normal"
                                inputProps={{ maxLength: 1, style: { textAlign: 'center' } }}
                            />
                        ))}
                    </Box>
                    <Button variant="contained" color="primary" fullWidth onClick={handleOpenNewPassword}>
                        Xác nhận
                    </Button>
                    <Typography variant="body2" color="textSecondary" align="center">
                        Gửi yêu cầu lần tiếp theo: 60s
                    </Typography>
                </DialogContent>
            </Dialog>
            <Dialog open={openNewPassword} onClose={() => setOpenNewPassword(false)} fullWidth maxWidth="sm">
                <DialogTitle className={styles.dialogTitle}>Tạo mật khẩu mới</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        required
                        label="Mật khẩu mới"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        margin="normal"
                        variant="outlined"
                    />
                    <TextField
                        fullWidth
                        required
                        label="Nhập lại mật khẩu mới"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        margin="normal"
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="primary" fullWidth onClick={handleNewPasswordSubmit}>
                        Hoàn thành
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default OtpDialog;
