import React, { createContext, useContext, useState } from 'react';

interface Location {
  id: string;
  name: string;
}
interface Role {
  id: string;
  type: string;
  code: string;
  name: string;
  parentId?: string;
  children?: Role[];
}

interface AppState {
  province: Location;
  setProvince: React.Dispatch<React.SetStateAction<Location>>;
  choosed: Location;
  setChoosed: React.Dispatch<React.SetStateAction<Location>>;
  district: Location;
  setDistrict: React.Dispatch<React.SetStateAction<Location>>;
  ward: Location;
  setWard: React.Dispatch<React.SetStateAction<Location>>;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  level: number;
  setLevel: React.Dispatch<React.SetStateAction<number>>;
  dpmLv1: Location;
  setDpmLv1: React.Dispatch<React.SetStateAction<Location>>;
  dpmLv2: Location;
  setDpmLv2: React.Dispatch<React.SetStateAction<Location>>;
  dpmLv3: Location;
  setDpmLv3: React.Dispatch<React.SetStateAction<Location>>;
  dpmLv4: Location;
  setDpmLv4: React.Dispatch<React.SetStateAction<Location>>;
  roles: Role[];
  setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
  reportId: string;
  setReportId: React.Dispatch<React.SetStateAction<string>>;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [province, setProvince] = useState<Location>({ id: '', name: '' });
  const [district, setDistrict] = useState<Location>({ id: '', name: '' });
  const [choosed, setChoosed] = useState<Location>({ id: '', name: '' });
  const [ward, setWard] = useState<Location>({ id: '', name: '' });
  const [name, setName] = useState<string>('');
  const [level, setLevel] = useState<number>(0);
  const [dpmLv1, setDpmLv1] = useState<Location>({ id: '', name: '' });
  const [dpmLv2, setDpmLv2] = useState<Location>({ id: '', name: '' });
  const [dpmLv3, setDpmLv3] = useState<Location>({ id: '', name: '' });
  const [dpmLv4, setDpmLv4] = useState<Location>({ id: '', name: '' });
  const [roles, setRoles] = useState<Role[]>([])
  const [reportId, setReportId] = useState('');

  return (
    <AppContext.Provider value={{ province, setProvince, district, setDistrict, choosed, setChoosed, ward, setWard, name, setName, level, setLevel, dpmLv1, setDpmLv1, dpmLv2, setDpmLv2, dpmLv3, setDpmLv3, dpmLv4, setDpmLv4,roles, setRoles, reportId, setReportId }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
