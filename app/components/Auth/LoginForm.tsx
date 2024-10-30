import React, { useEffect, useState } from 'react';
import styles from './Login.module.css';
import { Grid, TextField, Button, FormControl, InputLabel, Checkbox, Box, Typography, InputAdornment, IconButton, OutlinedInput, Autocomplete } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Image from 'next/image';
import ForgotPasswordDialog from './ForgotPasswordDialog';
import OtpDialog from './OtpDiolog';
import SnackBarAlert from './SnackBarAlert';
import EmailDialog from './EmailDiolog';
import { useLoginHandlers } from '@/app/hooks/useLoginHandlers';
import { useLoginState } from '@/app/hooks/useLoginState';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import { useAuth } from '@/app/hooks/AuthContext';
import router, { useRouter } from 'next/navigation';
import apiService from '@/app/untils/api';

interface Dept {
    id: number,
    departmentName: string
}

const LoginForm: React.FC = () => {
    const loginState = useLoginState();
    const loginHandlers = useLoginHandlers();
    const [depts, setDepts] = useState<Dept[]>([]);
    const [valueSelect, setValueSelect] = useState<Dept | null>(null);
    const [inputValue, setInputValue] = useState('');

    const {
        username,
        setUsername,
        password,
        setPassword,
        showPassword,
        error,
        open,
        type,
        handleClickShowPassword,
        handleMouseDownPassword,
        handleClose,
        handleLoginEmail,
        handleCheckLogEmail,
        handleLoginFacebook,
        handleForgotPasswordEmail,
        handleForgotPasswordPhoneNum,
        refreshEmailState,
        handleSendEmailRequest,
        handleSendZaloRequest,
        handleLogin
    } = loginHandlers;
    const { isAuthenticated, logout } = useAuth();
    const router = useRouter();
    useEffect(() => {
        if (isAuthenticated) {
            router.replace('/department');
        }
    }, [isAuthenticated, router]);
    useEffect(() => {
        fetchSelect();
        localStorage.removeItem('access_token');
        logout();
    }, []);
    const [forgotPass, setForgotPass] = useState(false);
    const [otpInsert, setOtpInsert] = useState(false);

    const handleForgotPassword = () => {
        setForgotPass(true);
    };
    const fetchSelect = async () => {
        const res = await apiService.get<Dept[]>('/department'); // Thêm kiểu dữ liệu trả về cho res
        console.log(res.data);
        if (res && res.data) {
            setDepts(res.data);
        }
    };

    const handleCloseForgotPassword = () => {
        setForgotPass(false);
    };
    useEffect(() => {
        handleCheckLogEmail();
    }, []);

    const handleLoginWithDept = () => {
        if (valueSelect) {
            handleLogin(valueSelect.id); 
        } else {
            console.log('chưa chọn dpt');
        }
    };

    return (
        <div className={styles.container}>
            <Grid container spacing={0} style={{ height: '100%' }}>
                <Grid item xs={7} className={styles.backgroundContainer}>
                    <div className={styles.background}>
                        <Image src="/bg.png" alt="Background" layout="fill" objectFit="contain" />
                    </div>
                </Grid>
                <Grid item xs={4} className={styles.lgForm}>
                    <div className={styles.loginForm}>
                        <Grid container className={styles.logoComponent}>
                            <div className={styles.logo}>
                                <Image src="/logo.png" alt="Logo" width={146} height={148} />
                            </div>
                            <Typography variant="h6" className={styles.title}>
                                DTI Digital Conversion System
                            </Typography>
                        </Grid>
                        <Grid container className={styles.infoComponent}>
                            <Grid className={styles.gridItem}>
                                <Typography className={styles.loginText}>
                                    ĐĂNG NHẬP
                                </Typography>
                                <Grid className={styles.gridItem}>
                                    <Autocomplete
                                        options={depts}
                                        getOptionLabel={(option: Dept) => option.departmentName}
                                        value={valueSelect}
                                        onChange={(event, newValue) => setValueSelect(newValue)}
                                        inputValue={inputValue}
                                        onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
                                        renderOption={(props, option) => (
                                            <li {...props} key={option.id}>
                                                {option.departmentName}
                                            </li>
                                        )}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Đơn vị"
                                                variant="outlined"
                                                size="small"
                                                required
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid className={styles.gridItem}>
                                    <TextField
                                        id="userName"
                                        label="Tên đăng nhập"
                                        variant="outlined"
                                        fullWidth
                                        required
                                        margin="normal"
                                        size="small"
                                        value={username}
                                        onChange={(e: any) => setUsername(e.target.value)}
                                    />
                                </Grid>
                                <Grid className={styles.gridItem}>
                                    <FormControl fullWidth margin='normal' variant="outlined">
                                        <InputLabel htmlFor="outlined-adornment-password" required size='small'>Mật khẩu</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-password"
                                            size='small'
                                            type={showPassword ? 'text' : 'password'}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password"
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            label="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Box className={styles.flexSpace}>
                                <Box className={styles.flexItem}>
                                    <Checkbox />
                                    <Typography className={styles.rememberTxt}>Nhớ đăng nhập</Typography>
                                </Box>
                                <Button className={styles.link} onClick={handleForgotPassword}>Quên mật khẩu</Button>
                            </Box>
                            <div className={styles.btnComponent}>
                                <Button variant="contained" color="primary" fullWidth onClick={handleLoginWithDept} disabled={username === "" || password === ""}>Đăng nhập</Button>
                                <Button variant="contained" fullWidth onClick={handleLoginEmail} startIcon={<GoogleIcon />} style={{ backgroundColor: '#FFF', color: '#000' }}>Đăng nhập Với Google</Button>
                                <Button variant="contained" color="primary" fullWidth onClick={handleLoginFacebook} startIcon={<FacebookIcon />}>Đăng nhập với FaceBook</Button>
                            </div>
                        </Grid>
                    </div>
                </Grid>
            </Grid>
            <ForgotPasswordDialog open={forgotPass} onClose={handleCloseForgotPassword} />
            <OtpDialog open={otpInsert} onClose={() => setOtpInsert(false)} />
            <SnackBarAlert open={open} handleClose={handleClose} error={error} type={type} />
        </div>
    );
};

export default LoginForm;
