import { useState } from 'react';
import { useAppContext } from '../../hooks/AppContext';
import useLocate from '../../hooks/useLocate';

interface Department {
    id: number;
    departmentName: string;
    province: string;
    district: string;
    ward: string;
    level: number;
    name: string;
}

const useHomePageState = () => {
    const [open, setOpen] = useState(true);
    const [openAdd, setOpenAdd] = useState(false);
    const [refreshTable, setRefreshTable] = useState(false);
    const [refreshOptions, setRefreshOptions] = useState(false);
    const [departmentsLv1, setDepartmentsLv1] = useState<Department[]>([]);
    const [departmentsLv2, setDepartmentsLv2] = useState<Department[]>([]);
    const [departmentsLv3, setDepartmentsLv3] = useState<Department[]>([]);
    const [departmentsLv4, setDepartmentsLv4] = useState<Department[]>([]);
    const { province, setProvince, dpmLv1, setDpmLv1, dpmLv2, setDpmLv2, dpmLv3, setDpmLv3, dpmLv4, setDpmLv4 } = useAppContext();
    const { cities } = useLocate();

    return {
        open, setOpen, openAdd, setOpenAdd, refreshTable, setRefreshTable,
        refreshOptions, setRefreshOptions, departmentsLv1, setDepartmentsLv1,
        departmentsLv2, setDepartmentsLv2, departmentsLv3, setDepartmentsLv3,
        departmentsLv4, setDepartmentsLv4, province, setProvince, dpmLv1, setDpmLv1,
        dpmLv2, setDpmLv2, dpmLv3, setDpmLv3, dpmLv4, setDpmLv4, cities
    };
};

export default useHomePageState;
