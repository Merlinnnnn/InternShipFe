import { useState, useEffect } from 'react';
import { SelectChangeEvent } from '@mui/material';
import axios from 'axios';
import { AlertColor } from '@mui/material/Alert';
import apiService from '../untils/api';

export const useLoginForm = () => {
    const [valueSelect, setValueSelect] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);
    const [type, setType] = useState<AlertColor>('error');
    const [forgotPassEmail, setForgotPassEmail] = useState(false);
    const [forgotPassPhoneNum, setForgotPassPhoneNum] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [email, setEmail] = useState('');
    const [phoneNum, setPhoneNum] = useState('');

    const units = [
        { value: 'unit1', label: 'Ủy ban nhân dân thành phố Hồ Chí Minh' },
        { value: 'unit2', label: 'Đơn vị khác' },
    ];

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleChange = (event: SelectChangeEvent<string>) => {
        setValueSelect(event.target.value as string);
    };

    const handleClose = (event: any, reason: any) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const handleForgotPasswordEmail = () => {
        setForgotPassEmail(true);
        setCountdown(60);
    };

    const handleForgotPasswordPhoneNum = () => {
        setForgotPassPhoneNum(true);
        setCountdown(60);
    };
    const refreshEmailState = () => {
        setEmail('');
        setCountdown(0);
    }
    const validatePassword = (password: string): boolean => {
        if (password.length < 8 || /\s/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password) || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
            return false;
        }
        return true;
    };

    const handleSendEmailRequest = async () => {
        // Kiểm tra xem email có rỗng không
        if (email === "") {
            setError("Email không được để trống");
            setType('error');
            setOpen(true);
            return;
        }
    
        // Kiểm tra định dạng email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Vui lòng nhập đúng định dạng email, định dạng đúng là: …..@......");
            setType('error');
            setOpen(true);
            return;
        }
    
        const payload = {
            email
        };
    
        try {
            const res = await apiService.post('/auth/request-reset-password', payload);
            const data = res.data as { message: string };
    
            if (res.status === 201) {
                console.log('Gửi yêu cầu thành công:', data);
                setCountdown(60);
                setError("Gửi mail thành công");
                setType('success');
                setOpen(true);
            }
        } catch (error: any) {
            console.error('Lỗi khi gửi yêu cầu:', error);
            if (error.response?.status === 404 && error.response?.data?.message === "User not found") {
                setError("Email chưa đăng ký trong hệ thống, xin vui lòng thử lại sau");
            } else {
                setError('Đã xảy ra lỗi. Vui lòng thử lại.');
                console.log("dsa: "+error.response?.data?.message);
            }
            setType('error');
            setOpen(true);
        }
    };

    const handleSendZaloRequest = () => {
        setCountdown(60);
    };

    const handleLogin = async () => {
        if (username === "" || password === "") {
            setError("Vui lòng điền đầy đủ thông tin");
            setType('error');
            setOpen(true);
            return;
        }
        if (!validatePassword(password)) {
            setError("Mật khẩu không hợp lệ. Vui lòng kiểm tra lại.");
            setType('error');
            setOpen(true);
            return;
        }
    
        const payload = {
            username,
            password,
        };
    
        try {
            const res = await apiService.post('/auth/login', payload);
            const data = res.data as { message: string; data: { token: string } };
    
            if (res.status === 201) {
                console.log('Đăng nhập thành công:', data);
                setType('success');
                setError("Đăng nhập thành công");
                setOpen(true);
                // chuyển sang trang khác
            } else {
                setError(data.message || 'Đăng nhập không thành công.');
                setType('error');
                setOpen(true);
            }
        } catch (error: any) {
            console.error('Lỗi đăng nhập:', error);
            setError(error.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.');
            setType('error');
            setOpen(true);
        }
    };

    useEffect(() => {
        if (units.length > 0) {
            setValueSelect(units[0].value);
        }
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout | undefined;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prevCountdown => {
                    if (prevCountdown === 1) {
                        return 0;
                    } else {
                        return prevCountdown - 1;
                    }
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [countdown]);

    return {
        username,
        setUsername,
        password,
        setPassword,
        showPassword,
        handleClickShowPassword,
        handleMouseDownPassword,
        valueSelect,
        handleChange,
        error,
        open,
        handleClose,
        handleLogin,
        units,
        forgotPassEmail,
        handleForgotPasswordEmail,
        handleForgotPasswordPhoneNum,
        handleSendEmailRequest,
        handleSendZaloRequest,
        email,
        setEmail,
        phoneNum,
        setPhoneNum,
        countdown,
        refreshEmailState,
        setCountdown,
        type // return type as well
    };
};
