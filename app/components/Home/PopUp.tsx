import React, { useEffect, useState } from 'react';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, IconButton,
  Select, MenuItem, FormControl, InputLabel, Box,
  SelectChangeEvent,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import useLocate from '@/app/hooks/useLocate';
import { useAppContext } from '@/app/hooks/AppContext';
import apiService from '@/app/untils/api';

interface Location {
  id: string;
  name: string;
}

interface DialogComponentProps {
  type: 'Edit' | 'Add New';
  open: boolean;
  handleClose: () => void;
}

const DialogComponent: React.FC<DialogComponentProps> = ({ type, open, handleClose }) => {
  const { cities, districts, wards, fetchDistrict, fetchWard } = useLocate();
  const { province, setProvince, level, setLevel, name, setName, district, setDistrict, ward, setWard, dpmLv1, dpmLv2, dpmLv3, dpmLv4 } = useAppContext();

  const [localProvince, setLocalProvince] = useState<Location>({ id: '', name: '' });
  const [localDistrict, setLocalDistrict] = useState<Location>({ id: '', name: '' });
  const [localWard, setLocalWard] = useState<Location>({ id: '', name: '' });
  const [localName, setLocalName] = useState('');
  const [localParentId, setLocalParentId] = useState<number | null>(null);

  useEffect(() => {
    if (open) {
      setLocalProvince({ id: province.id, name: province.name });
      fetchDistrict(province.id);
      setLocalDistrict({ id: '', name: '' });
      setLocalWard({ id: '', name: '' });
      setLocalName('');
      setLocalParentId(null);
      console.log('a')
    }
  }, [open, province]);



  const determineLevelAndParentId = () => {
    if (dpmLv1.id === '' && dpmLv1.name === '') {
      return { level: 1, parentId: null };
    }
    if (dpmLv2.id === '' && dpmLv2.name === '') {
      return { level: 2, parentId: parseInt(dpmLv1.id, 10) };
    }
    if (dpmLv3.id === '' && dpmLv3.name === '') {
      return { level: 3, parentId: parseInt(dpmLv2.id, 10) };
    }
    if (dpmLv4.id === '' && dpmLv4.name === '') {
      return { level: 4, parentId: parseInt(dpmLv3.id, 10) };
    }
    return { level: 5, parentId: parseInt(dpmLv4.id, 10) };
  };

  const handleSave = async () => {
    const { level, parentId } = determineLevelAndParentId();
    
    if (level !== 5) {
      const newDepartment = {
        departmentName: localName,
        province: localProvince,
        level: level,
        district: localDistrict,
        ward: localWard,
        parentId: parentId
      };

      if (type === 'Add New') {
        try {
          const response = await apiService.post('/department/create', newDepartment);
          console.log(response);
        } catch (error) {
          console.error('Error adding department:', error);
        }
      }
    }

    handleClose();
  };

  const handleProvinceChange = async (event: SelectChangeEvent<string>) => {
    const selectedProvinceName = event.target.value;
    const selectedProvince = cities.find(city => city.name === selectedProvinceName);
    if (selectedProvince) {
      setLocalProvince({ id: selectedProvince.id, name: selectedProvinceName });
      setLocalDistrict({ id: '', name: '' });
      setLocalWard({ id: '', name: '' });
      await fetchDistrict(selectedProvince.id);
    }
  };

  const handleDistrictChange = async (event: SelectChangeEvent<string>) => {
    const selectedDistrictName = event.target.value;
    const selectedDistrict = districts.find(district => district.name === selectedDistrictName);
    if (selectedDistrict) {
      setLocalDistrict({ id: selectedDistrict.id, name: selectedDistrictName });
      setLocalWard({ id: '', name: '' });
      await fetchWard(selectedDistrict.id);
    }
  };

  const handleWardChange = (event: SelectChangeEvent<string>) => {
    const selectedWardName = event.target.value;
    const selectedWard = wards.find(ward => ward.name === selectedWardName);
    if (selectedWard) {
      setLocalWard({ id: selectedWard.id, name: selectedWardName });
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold' }}>
        {type}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <form>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
            <TextField
              autoFocus
              margin="dense"
              size='small'
              label="Department Name (*)"
              type="text"
              fullWidth
              variant="outlined"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
            />
            <FormControl fullWidth margin="dense" size='small'>
              <InputLabel>Province/City</InputLabel>
              <Select
                value={localProvince.name}
                onChange={handleProvinceChange}
                size='small'
                label="Province/City"
                variant="outlined"
              >
                {cities.slice().reverse().map((city) => (
                  <MenuItem key={city.id} value={city.name}>
                    {city.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', marginTop: '20px' }}>
            <FormControl fullWidth margin="dense" size='small'>
              <InputLabel>District</InputLabel>
              <Select
                value={localDistrict.name}
                onChange={handleDistrictChange}
                label="District"
                variant="outlined"
              >
                {districts.map((district) => (
                  <MenuItem key={district.id} value={district.name}>
                    {district.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense" size='small'>
              <InputLabel>Ward</InputLabel>
              <Select
                value={localWard.name}
                onChange={handleWardChange}
                label="Ward"
                variant="outlined"
              >
                {wards.map((ward) => (
                  <MenuItem key={ward.id} value={ward.name}>
                    {ward.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </form>
      </DialogContent>
      <DialogActions>
        <Box display="flex" justifyContent="flex-end" width="100%">
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            sx={{ marginRight: '15px', height: '37px', width: '97px', textTransform: 'none' }}
          >
            Save
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default DialogComponent;
