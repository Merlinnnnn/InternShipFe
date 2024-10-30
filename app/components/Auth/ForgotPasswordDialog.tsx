import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, TextField, Box } from '@mui/material';
import { useLoginForm } from '../../hooks/useLoginForm';
import styles from './Login.module.css';
import EmailDialog from './EmailDiolog';
import SnackBarAlert from './SnackBarAlert';
import OtpDiolog from './OtpDiolog';

interface ForgotPasswordDialogProps {
    open: boolean;
    onClose: () => void;
}

const ForgotPasswordDialog: React.FC<ForgotPasswordDialogProps> = ({ open, onClose }) => {
    const {
        handleForgotPasswordPhoneNum,
    } = useLoginForm();
    const [emailDiolog, setEmailDiolog] = useState(false);
    const [phoneDiolog, setPhoneDiolog] = useState(false);
    const handleOpenEmail = () => {
        open = false;
        setEmailDiolog(true);
    }
    const handleCloseEmail = () => {
        onClose();
        setEmailDiolog(false);
    }
    const handleOpenPhone = () => {
        open = false;
        setPhoneDiolog(true);
    }
    const handleClosePhone = () => {
        onClose();
        setPhoneDiolog(false);
    }
    return (
        <div>
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
                        height: ' 240px',
                        width: ' 540px',
                    },
                }}
            >
                <DialogTitle className={styles.diologTitle}>Vui lòng chọn phương thức</DialogTitle>
                <DialogContent>
                    <div className={styles.diologForm}>
                        <Box marginBottom={2}>
                            <Button variant="contained" color="primary" fullWidth onClick={handleOpenPhone} className={styles.noneCaseBtn}>
                                Gửi mã xác thực qua Zalo
                            </Button>
                        </Box>
                        <Box marginBottom={2}>
                            <Button variant="outlined" color="primary" fullWidth onClick={handleOpenEmail} className={styles.noneCaseBtn}>
                                Gửi mã xác thực qua Email
                            </Button>
                        </Box>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Typography>Bạn đã có tài khoản?</Typography>
                    <Button onClick={onClose} color="primary" className={styles.noneCaseBtn}>
                        Đăng nhập
                    </Button>
                </DialogActions>
            </Dialog>
            <EmailDialog open={emailDiolog} onClose={handleCloseEmail} />
            <OtpDiolog open={phoneDiolog} onClose={handleClosePhone} />
        </div>
    );
};

export default ForgotPasswordDialog;
