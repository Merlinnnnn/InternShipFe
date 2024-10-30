// useLoginHandlers.ts
import { SelectChangeEvent } from '@mui/material';
import apiService from '../untils/api';
import { useLoginState } from './useLoginState';
import { useAuth } from '@/app/hooks/AuthContext';
import axios from 'axios';
interface RoleChildren {
    id: number;
    name: string;
    code: string;
    type: string;
}

interface ApiResponse {
    0: { children: RoleChildren[] };
    1: { children: RoleChildren[] };
    2: { children: RoleChildren[] };
    avatar: string;
    full_name: string;
    department: any; // Bạn có thể thay đổi kiểu này cho phù hợp với cấu trúc dữ liệu của department
    access_token: string;
    [key: string]: any; // Để hỗ trợ các thuộc tính khác mà bạn không muốn khai báo rõ ràng
}

export const useLoginHandlers = () => {
    const {
        valueSelect,
        setValueSelect,
        showPassword,
        setShowPassword,
        username,
        setUsername,
        password,
        setPassword,
        error,
        setError,
        open,
        setOpen,
        type,
        setType,
        forgotPassEmail,
        setForgotPassEmail,
        forgotPassPhoneNum,
        setForgotPassPhoneNum,
        countdown,
        setCountdown,
        email,
        setEmail,
        phoneNum,
        setPhoneNum,
        units,
    } = useLoginState();

    const { login } = useAuth(); // Use the login function from AuthContext

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
    };

    const validatePassword = (password: string): boolean => {
        if (password.length < 8 || /\s/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password) || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
            return false;
        }
        return true;
    };

    const handleSendEmailRequest = async () => {
        if (email === "") {
            setError("Email không được để trống");
            setType('error');
            setOpen(true);
            return;
        }

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
            console.log(res)

            if (res.status === 201) {
                setCountdown(60);
                setError("Gửi mail thành công");
                setType('success');
                setOpen(true);
            }
        } catch (error: any) {
            if (error.response?.status === 404 && error.response?.data?.message === "User not found") {
                setError("Email chưa đăng ký trong hệ thống, xin vui lòng thử lại sau");
            } else {
                setError('Đã xảy ra lỗi. Vui lòng thử lại.');
            }
            setType('error');
            setOpen(true);
        }
    };

    const handleSendZaloRequest = () => {
        setCountdown(60);
    };

    const handleLoginEmail = async () => {
        window.location.href = 'http://localhost:3005/auth/google';
    };

    const handleCheckLogEmail = () => {
        console.log('Đăng nhập thành công');
        const urlParams = new URLSearchParams(window.location.search);
        console.log(urlParams);
        const token = urlParams.get('code');

        if (token) {
            console.log('Đăng nhập thành công');
            login(token); // Save token and update authenticated state
            window.location.href = '/';
        } else {
            const error = urlParams.get('error');
            if (error) {
                console.log('Đăng nhập thất bại');
            }
        }
    };

    const handleLoginFacebook = async () => {
        window.location.href = 'http://localhost:3005/auth/facebook';
    };

    const handleLogin = async (id: number) => {
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
            departmentId: id,
            username,
            password,
        };

        try {
            const res = await apiService.post<ApiResponse>('/auth/login', payload);
            const data = res.data;
            console.log(data)

            if (res.status === 201) {
                setType('success');
                setError("Đăng nhập thành công");
                setOpen(true);
                console.log(data);
                localStorage.setItem('access_token', data.payload.access_token);
                localStorage.setItem('permission', JSON.stringify(data.user.permissions));
                localStorage.setItem('avatar', data.user.avatar);
                localStorage.setItem('fullName', data.user.full_name);
                localStorage.setItem('dept', JSON.stringify(data.user.department));
                const dept = localStorage.getItem('dept');
                if (dept) {
                    const deptObj = JSON.parse(dept);
                    const accLv = deptObj.level;
                    localStorage.setItem('accLv', accLv);
                }
                console.log(localStorage.getItem('permission'))
                console.log(localStorage.getItem('access_token'))
                console.log(localStorage.getItem('accLv'))


                login(data.payload.access_token);
            }
        } catch (error: any) {
            console.log(error);
            setError('Wrong username, password or department.');
            setType('error');
            setOpen(true);
        }
    };



    return {
        valueSelect,
        setValueSelect,
        showPassword,
        setShowPassword,
        username,
        setUsername,
        password,
        setPassword,
        error,
        setError,
        open,
        setOpen,
        type,
        setType,
        forgotPassEmail,
        setForgotPassEmail,
        forgotPassPhoneNum,
        setForgotPassPhoneNum,
        countdown,
        setCountdown,
        email,
        setEmail,
        phoneNum,
        setPhoneNum,
        units,
        handleLoginFacebook,
        handleCheckLogEmail,
        handleLoginEmail,
        handleClickShowPassword,
        handleMouseDownPassword,
        handleChange,
        handleClose,
        handleForgotPasswordEmail,
        handleForgotPasswordPhoneNum,
        refreshEmailState,
        validatePassword,
        handleSendEmailRequest,
        handleSendZaloRequest,
        handleLogin
    };
};
