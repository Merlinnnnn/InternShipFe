import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    MenuItem,
    Button,
    IconButton,
    Box,
    Typography,
    Switch,
    Snackbar,
    Alert
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import apiService from '@/app/untils/api';
import { useAppContext } from '@/app/hooks/AppContext';
import useLocate from '@/app/hooks/useLocate';

interface Location {
    id: string;
    name: string;
}

interface AddPopupProps {
    open: boolean;
    onClose: () => void;
    type: 'add' | 'edit';
    id?: string;
}

interface Role {
    id: string;
    name: string;
    code: string;
}

interface ApiResponse {
    data: {
        items: Role[];
    };
}

interface ApiEditResponse {
    active: boolean;
    address: string;
    avatar: string | null;
    birthday: string | null;
    district: string | null;
    email: string;
    full_name: string;
    gender: string | null;
    id: string;
    jobTitle: string;
    password: string;
    phone: string | null;
    province: string | null;
    username: string;
    ward: string | null;
    role: object | null;
}

const AddNewPopup: React.FC<AddPopupProps> = ({ open, onClose, type, id }) => {
    const { cities, districts, wards, fetchDistrict, fetchWard } = useLocate();
    const { province, choosed } = useAppContext();

    const [showPassword, setShowPassword] = useState(false);
    const [localProvince, setLocalProvince] = useState<Location | null>({ id: '', name: '' });
    const [localDistrict, setLocalDistrict] = useState<Location | null>({ id: '', name: '' });
    const [localWard, setLocalWard] = useState<Location | null>({ id: '', name: '' });
    const [localRoles, setLocalRoles] = useState<Role[]>([]);
    const [localRole, setLocalRole] = useState<Role>({ id: '', name: '', code: '' });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [avatar, setAvatar] = useState<string | null>(null);
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [account, setAccount] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNum, setPhoneNum] = useState('');
    const [address, setAddress] = useState('');
    const [gender, setGender] = useState<string | null>(null);
    const [birthday, setBirthday] = useState('');
    const [active, setActive] = useState(false);

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    useEffect(() => {
        if (open) {
            if (type === 'add') {
                resetData();
            }
            if (type === 'edit') {
                resetData();
                fetchRoles();
                fetchData();
            }
        }
    }, [open, province]);

    useEffect(() => {
        if (localProvince) {
            fetchDistrict(localProvince.id);
        }
        if (localDistrict) {
            fetchWard(localDistrict.id);
        }
    }, [localProvince, localDistrict, fetchDistrict, fetchWard]);

    const resetData = () => {
        setActive(true);
        fetchRoles();
        setAvatar('');
        setAccount('');
        setAddress('');
        setPassword('');
        setFullName('');
        setJobTitle('');
        setEmail('');
        setLocalRole({ id: '', name: '', code: '' });
        setBirthday('');
        setGender('');
        setLocalProvince({ id: '', name: '' });
        setLocalDistrict({ id: '', name: '' });
        setLocalWard({ id: '', name: '' });
    };

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (event: any) => {
        event.preventDefault();
    };

    const handleSave = async () => {
        if (!account || !password || !jobTitle || !email || !fullName || !localRole.id ) {
            setSnackbarSeverity('error');
            setSnackbarMessage('Required fields cannot be empty');
            setOpenSnackbar(true);
        } else {
            const formData = new FormData();

            formData.append('username', account);
            formData.append('password', password);
            formData.append('jobTitle', jobTitle);
            formData.append('email', email);
            formData.append('full_name', fullName);
            formData.append('roleId', localRole.id);
            setSnackbarSeverity('error');
                        setSnackbarMessage('Department lv1 that has child departments cannot be deleted');
    
            if (selectedFile) {
                formData.append('file', selectedFile);
            }
            if (gender) {
                formData.append('gender', gender);
            }
            if (birthday) {
                formData.append('birthday', convertBirthday(birthday));
            }
            if (phoneNum) {
                formData.append('phone', phoneNum);
            }
            if (typeof active !== 'undefined') {
                formData.append('active', active.toString());
            }
            if (choosed && choosed.id) {
                formData.append('departmentId', choosed.id);
            }
            if (localProvince) {
                formData.append('province', JSON.stringify(localProvince));
            }
            if (localDistrict) {
                formData.append('district', JSON.stringify(localDistrict));
            }
            if (localWard) {
                formData.append('ward', JSON.stringify(localWard));
            }
            if (address) {
                formData.append('address', address);
            }
            // for (let pair of formData.entries()) {
            //     console.log(pair[0] + ': ' + pair[1]);
            // }
            try {
                let response;
                if (type === 'add') {
                    response = await apiService.post('/users', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    console.log('User saved successfully:', response.data);
                    onClose();
                } else if (type === 'edit') {
                    response = await apiService.put(`/users/${id}`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    console.log('User edit successfully:', response.data);
                    onClose();
                }
            } catch (error: any) {
                console.error('Error saving user:', error.response.data);
                
            }
        }
        
       
    };

    const fetchRoles = async () => {
        try {
            const res = await apiService.get<ApiResponse>(`role/${choosed.id}/department`);
            setLocalRoles(res.data.data.items);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    const fetchData = async () => {
        try {
            const res = await apiService.get<ApiEditResponse>(`users/detail/${id}`);
            if (res.data.avatar !== null) setAvatar(res.data.avatar);
            if (res.data.username !== null) setAccount(res.data.username);
            if (res.data.password !== null) setPassword(res.data.password);
            if (res.data.active !== null) setActive(res.data.active);
            if (res.data.role !== null) setLocalRole(res.data.role as Role);
            if (res.data.gender !== null) setGender(res.data.gender);
            if (res.data.full_name !== null) setFullName(res.data.full_name);
            if (res.data.jobTitle !== null) setJobTitle(res.data.jobTitle);
            if (res.data.birthday !== null) {
                const convertedBirthday = convertDateFormat(res.data.birthday);
                setBirthday(convertedBirthday);
            }
            if (res.data.email !== null) setEmail(res.data.email);
            if (res.data.phone !== null) setPhoneNum(res.data.phone as string);
            if (res.data.address !== null) setAddress(res.data.address);
            if (res.data.province !== null) setLocalProvince(JSON.parse(res.data.province));
            if (res.data.district !== null) setLocalDistrict(JSON.parse(res.data.district));
            if (res.data.ward !== null) setLocalWard(JSON.parse(res.data.ward));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleProvinceChange = async (event: React.ChangeEvent<{ value: unknown }>) => {
        const selectedProvinceName = event.target.value as string;
        const selectedProvince = cities.find(city => city.name === selectedProvinceName);
        if (selectedProvince) {
            setLocalProvince({ id: selectedProvince.id, name: selectedProvinceName });
            await fetchDistrict(selectedProvince.id);
        }
    };

    const handleDistrictChange = async (event: React.ChangeEvent<{ value: unknown }>) => {
        const selectedDistrictName = event.target.value as string;
        const selectedDistrict = districts.find(district => district.name === selectedDistrictName);
        if (selectedDistrict) {
            setLocalDistrict({ id: selectedDistrict.id, name: selectedDistrictName });
            await fetchWard(selectedDistrict.id);
        }
    };

    const handleWardChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const selectedWardName = event.target.value as string;
        const selectedWard = wards.find(ward => ward.name === selectedWardName);
        if (selectedWard) {
            setLocalWard({ id: selectedWard.id, name: selectedWardName });
        }
    };

    const handleRoleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const selectedRoleName = event.target.value as string;
        const selectedRole = localRoles.find(role => role.name === selectedRoleName);
        if (selectedRole)
            setLocalRole({ id: selectedRole.id, name: selectedRoleName, code: selectedRole.code });
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);

            const maxSize = 100 * 1024;
            if (file.size > maxSize) {
                alert('File quá lớn. Vui lòng chọn file dưới 100 KB.');
                return;
            }

            setSelectedFile(file);
        }
    };

    const handleChangeFullName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFullName(event.target.value);
    };

    const handleChangePass = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleChangeAcc = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAccount(event.target.value);
    };

    const handleChangeJobTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setJobTitle(event.target.value);
    };

    const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };
    const handleChangePhoneNum = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPhoneNum(event.target.value);
    };

    const handleChangeAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAddress(event.target.value);
    };

    const handleChangeGender = (event: React.ChangeEvent<{ value: unknown }>) => {
        setGender(event.target.value as string);
    };

    const handleChangeBirthday = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBirthday(event.target.value);
    };

    const convertBirthday = (birthday: string) => {
        const [year, month, day] = birthday.split('-');
        console.log(`-${year}${day}-${month}`)
        return `${year}-${day}-${month}`;
    };

    const convertDateFormat = (dateString: string) => {
        const [year, month, day] = dateString.split('-');
        return `${year}-${month}-${day}`;
    };

    const handleChangeActive = (event: React.ChangeEvent<HTMLInputElement>) => {
        setActive(event.target.checked);
    };
    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="lg"
            PaperProps={{
                style: {
                    width: '1100px',
                    position: 'absolute',
                },
            }}>
            <DialogTitle>{type === 'add' ? 'Add New' : 'Edit'}</DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="row" justifyContent="space-between" gap="10px">
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        width="25%"
                        height="340px"
                        border="1px solid #eaeaea"
                        borderRadius="10px"
                    >
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            border="1px dashed grey"
                            borderRadius="100%"
                            width={180}
                            height={180}
                            marginTop="20px"
                        >
                            <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                                bgcolor="#f4f6f8"
                                borderRadius="100%"
                                padding="10px"
                                width={160}
                                height={160}
                            >
                                {avatar ? (
                                    <img src={avatar} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                                ) : (
                                    <>
                                        <input
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            id="upload-avatar"
                                            type="file"
                                            onChange={handleFileChange}
                                        />
                                        <label htmlFor="upload-avatar">
                                            <IconButton component="span">
                                                <AddAPhotoIcon sx={{ fontSize: 25 }} />
                                            </IconButton>
                                        </label>
                                        <Typography align="center" sx={{ fontSize: '14px', color: '#72808d' }}>
                                            Upload Avatar
                                        </Typography>
                                    </>
                                )}
                            </Box>
                        </Box>
                        <Typography align="center" sx={{ marginTop: '20px', fontSize: '14px', color: '#72808d' }}>
                            *.jpeg, *.jpg, *.png.
                            <br />
                            Maximum 100 KB
                        </Typography>
                        <Box sx={{ marginTop: '20px', width: '100%', display: 'flex', alignItems: 'center' }}>
                            <Typography sx={{ fontSize: '16px', color: 'black', marginRight: '8px', marginLeft: '10px' }}>
                                Active
                            </Typography>
                            <Switch sx={{ marginLeft: '40px' }} checked={active} onChange={handleChangeActive} />
                        </Box>
                    </Box>
                    <Box display="flex" flexDirection="column" width="75%" border="1px solid #eaeaea" borderRadius="10px" padding="8px">
                        <Box display="flex" flexDirection="row" justifyContent="space-between" gap="50px" marginBottom="16px" marginTop="16px" padding="8px">
                            <TextField
                                margin="dense"
                                label="Account"
                                fullWidth
                                variant="outlined"
                                size="small"
                                required
                                value={account}
                                onChange={handleChangeAcc}
                                disabled={type === 'edit'}
                                InputLabelProps={{
                                    shrink: !!account || undefined,
                                }}
                            />
                            <TextField
                                margin="dense"
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                fullWidth
                                variant="outlined"
                                size="small"
                                required
                                value={password}
                                disabled={type === 'edit'}
                                InputProps={{
                                    endAdornment: (
                                        <IconButton
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    ),
                                }}
                                onChange={handleChangePass}
                                InputLabelProps={{
                                    shrink: !!password || undefined,
                                }}
                            />
                        </Box>
                        <Box display="flex" flexDirection="row" justifyContent="space-between" gap="50px" marginBottom="16px" padding="8px">
                            <TextField
                                margin="dense"
                                label="Full Name"
                                fullWidth
                                variant="outlined"
                                size="small"
                                required
                                value={fullName}
                                onChange={handleChangeFullName}
                            />
                            <TextField
                                margin="dense"
                                label="Job Title"
                                fullWidth
                                variant="outlined"
                                size="small"
                                required
                                value={jobTitle}
                                onChange={handleChangeJobTitle}
                            />
                        </Box>
                        <Box display="flex" flexDirection="row" justifyContent="space-between" gap="50px" marginBottom="16px" padding="8px">
                            <TextField
                                select
                                margin="dense"
                                label="Gender"
                                fullWidth
                                variant="outlined"
                                size="small"
                                value={gender}
                                onChange={handleChangeGender}
                            >
                                <MenuItem value="male">Male</MenuItem>
                                <MenuItem value="female">Female</MenuItem>
                            </TextField>
                            <TextField
                                margin="dense"
                                label="Birthday"
                                type="date"
                                fullWidth
                                variant="outlined"
                                size="small"
                                value={birthday}
                                onChange={handleChangeBirthday}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Box>
                        <Box display="flex" flexDirection="row" justifyContent="space-between" gap="50px" marginBottom="16px" padding="8px">
                            <TextField
                                select
                                margin="dense"
                                label="Role"
                                fullWidth
                                required
                                variant="outlined"
                                size="small"
                                value={localRole.name}
                                onChange={handleRoleChange}
                            >
                                {localRoles.map((role: Role) => (
                                    <MenuItem key={role.id} value={role.name}>
                                        {role.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                margin="dense"
                                label="Email"
                                type="email"
                                fullWidth
                                required
                                variant="outlined"
                                size="small"
                                value={email}
                                onChange={handleChangeEmail}
                            />
                        </Box>
                        <Box display="flex" flexDirection="row" justifyContent="space-between" gap="50px" marginBottom="16px" padding="8px">
                            <TextField
                                select
                                margin="dense"
                                label="Province/City"
                                fullWidth
                                variant="outlined"
                                size="small"
                                value={localProvince?.name || ""}
                                onChange={handleProvinceChange}
                            >
                                {cities.slice().reverse().map((city) => (
                                    <MenuItem key={city.id} value={city.name}>
                                        {city.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                select
                                margin="dense"
                                label="District"
                                fullWidth
                                variant="outlined"
                                size="small"
                                value={localDistrict?.name || ""}
                                onChange={handleDistrictChange}
                            >
                                {districts.map((district) => (
                                    <MenuItem key={district.id} value={district.name}>
                                        {district.name}
                                    </MenuItem>
                                ))}
                            </TextField>

                        </Box>
                        <Box display="flex" flexDirection="row" justifyContent="space-between" gap="50px" marginBottom="16px" padding="8px">
                            <TextField
                                select
                                margin="dense"
                                label="Ward"
                                fullWidth
                                variant="outlined"
                                size="small"
                                value={localWard?.name || ""}
                                onChange={handleWardChange}
                            >
                                {wards.map((ward) => (
                                    <MenuItem key={ward.id} value={ward.name}>
                                        {ward.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                margin="dense"
                                label="Address"
                                fullWidth
                                variant="outlined"
                                size="small"
                                value={address}
                                onChange={handleChangeAddress}
                            />
                        </Box>
                        <Box display="flex" flexDirection="row" justifyContent="space-between" gap="50px" marginBottom="16px" padding="8px">

                            <TextField
                                margin="dense"
                                label="Phone Number"
                                fullWidth
                                variant="outlined"
                                size="small"
                                value={phoneNum}
                                onChange={handleChangePhoneNum}
                            />
                        </Box>
                    </Box>
                </Box>
                <Box display="flex" justifyContent="flex-end" padding="10px">
                    <Button onClick={handleSave} color="primary" variant="contained" sx={{ width: '100px' }}>
                        Save
                    </Button>
                </Box>
            </DialogContent>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Dialog>
    );
};

export default AddNewPopup;
