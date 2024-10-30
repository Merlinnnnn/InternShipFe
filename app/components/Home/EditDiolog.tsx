// EditDialog.tsx
import React, { useEffect, useState } from 'react';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, IconButton,
  Select, MenuItem, FormControl, InputLabel, Box,
  SelectChangeEvent,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import useLocate from '@/app/hooks/useLocate';
import apiService from '@/app/untils/api';
import { useAppContext } from '@/app/hooks/AppContext'; // Import useAppContext

interface Location {
  id: string;
  name: string;
}

interface EditDialogProps {
  open: boolean;
  handleClose: () => void;
  initialData: {
    id: number;
    province: Location;
    district: Location;
    ward: Location;
    name: string;
  };
}

const EditDialog: React.FC<EditDialogProps> = ({ open, handleClose, initialData }) => {
  const { cities, districts, wards, fetchDistrict, fetchWard } = useLocate();
  const { province: contextProvince } = useAppContext(); // Get province from context

  const [localProvince, setLocalProvince] = useState<Location>(initialData.province);
  const [localDistrict, setLocalDistrict] = useState<Location>(initialData.district);
  const [localWard, setLocalWard] = useState<Location>(initialData.ward);
  const [localName, setLocalName] = useState(initialData.name);

  useEffect(() => {
    if (open) {
      setLocalName(initialData.name);
      setLocalProvince(contextProvince);


      if (contextProvince.id) {
        fetchDistrict(contextProvince.id);
      }
      if (initialData.district.id) {
        fetchWard(initialData.district.id);
      }
    }
  }, [open]);

  const handleSave = async () => {
    const updatedDepartment = {
      departmentName: localName,
      province: localProvince,
      district: localDistrict,
      ward: localWard,
    };

    try {
      const response = await apiService.put(`/department/update/${initialData.id}`, updatedDepartment);
      console.log(response);
      handleClose();
    } catch (error) {
      console.error('Error editing department:', error);
    }
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
        Edit Department
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

export default EditDialog;
