import { useEffect } from 'react';
import apiService from '../../untils/api';
import useHomePageState from './useHomePageStage';

interface ApiResponse {
    data: {
        items: Department[];
        currentPage: number;
        nextPage: number | null;
        prevPage: number | null;
        total: number;
    };
    code: number;
    message: string;
    success: boolean;
}

interface Department {
    id: number;
    departmentName: string;
    province: string;
    district: string;
    ward: string;
    level: number;
    name: string;
}

const useHomePageHandlers = () => {
    const {
        setOpenAdd, setRefreshTable, setRefreshOptions, setDepartmentsLv1,
        setDepartmentsLv2, setDepartmentsLv3, setDepartmentsLv4,
        setProvince, setDpmLv1, setDpmLv2, setDpmLv3, setDpmLv4,
        province, dpmLv1, dpmLv2, dpmLv3, dpmLv4, cities, refreshOptions
    } = useHomePageState();

    const handleCloseOpenAdd = () => {
        setOpenAdd(false);
        setRefreshTable((prev: boolean) => !prev);
        setRefreshOptions((prev: boolean) => !prev); 
    };

    const handleOpenAdd = () => {
        setOpenAdd(true);
    };

    const fetchDepartments = async (url: string, setter: Function) => {
        try {
            const response = await apiService.get<ApiResponse>(url);
            const data: ApiResponse = response.data;
            setter(data.data.items);
            console.log("abcd" + data.data.items);
        } catch (error) {
            console.error('Failed to fetch departments:', error);
            setter([]);
        }
    };

    const handleProvinceChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedProvinceName = event.target.value;
        const selectedProvince = cities.find(city => city.name === selectedProvinceName);
        if (selectedProvince) {
            setProvince({ id: selectedProvince.id, name: selectedProvince.name });
            await fetchDepartments(`/department/${selectedProvince.id}`, setDepartmentsLv1);
            setDpmLv1({ id: '', name: '' });
            setDpmLv2({ id: '', name: '' });
            setDpmLv3({ id: '', name: '' });
            setDpmLv4({ id: '', name: '' });
            setDepartmentsLv2([]);
            setDepartmentsLv3([]);
            setDepartmentsLv4([]);
        }
    };

    const handleDepartmentChange = (setter: Function, levelSetter: Function, nextLevelSetter: Function, urlTemplate: string, departments: Department[]) => async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDepartmentName = event.target.value;
        const selectedDepartment = departments.find(dept => dept.departmentName === selectedDepartmentName);
        if (selectedDepartment) {
            setter({ id: selectedDepartment.id, name: selectedDepartment.departmentName });
            const url = urlTemplate.replace('{id}', String(selectedDepartment.id));
            await fetchDepartments(url, levelSetter);
            nextLevelSetter([]);
            if (setter === setDpmLv1) {
                setDpmLv2({ id: '', name: '' });
                setDpmLv3({ id: '', name: '' });
                setDpmLv4({ id: '', name: '' });
                setDepartmentsLv3([]);
                setDepartmentsLv4([]);
            } else if (setter === setDpmLv2) {
                setDpmLv3({ id: '', name: '' });
                setDpmLv4({ id: '', name: '' });
                setDepartmentsLv4([]);
            } else if (setter === setDpmLv3) {
                setDpmLv4({ id: '', name: '' });
            }
        }
    };

    useEffect(() => {
        const fetchAllData = async () => {
            if (province.id) {
                await fetchDepartments(`/department/${province.id}`, setDepartmentsLv1);
            }
            if (dpmLv1.id) {
                await fetchDepartments(`/department/${dpmLv1.id}/level`, setDepartmentsLv2);
            }
            if (dpmLv2.id) {
                await fetchDepartments(`/department/${dpmLv2.id}/level`, setDepartmentsLv3);
            }
            if (dpmLv3.id) {
                await fetchDepartments(`/department/${dpmLv3.id}/level`, setDepartmentsLv4);
            }
        };
        fetchAllData();
    }, [refreshOptions]);

    return {
        handleCloseOpenAdd, handleOpenAdd, handleProvinceChange, handleDepartmentChange
    };
};

export default useHomePageHandlers;
