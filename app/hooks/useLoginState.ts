import { useState, useEffect } from 'react';
import { AlertColor } from '@mui/material/Alert';

export const useLoginState = () => {
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
    };
};
