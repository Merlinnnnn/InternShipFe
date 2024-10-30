import { useState, useEffect } from 'react';
import apiService from '../untils/api';

interface City {
  id: string;
  name: string;
}
interface District {
  id: string;
  name: string;
}
interface Ward {
  id: string;
  name: string;
}

const useLocate = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCities = async () => {
    try {
      const response = await apiService.get<{ data: City[] }>('/province');
      setCities(response.data.data);
      console.log('data city: ' + response.data.data);
    } catch (err) {
      setError('Error fetching cities');
    } finally {
      setLoading(false);
    }
  };

  const fetchDistrict = async (provinceId: string) => {
    try {
      const response = await apiService.get<{ data: District[] }>(`/province/${provinceId}/district`);
      setDistricts(response.data.data);
    } catch (err) {
      setError('Error fetching districts');
    }
  };

  const fetchWard = async (districtId: string) => {
    try {
      const response = await apiService.get<{ data: Ward[] }>(`/province/${districtId}/ward`);
      setWards(response.data.data);
    } catch (err) {
      setError('Error fetching wards');
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  return { cities, districts, loading, error, wards, fetchDistrict, fetchWard };
};

export default useLocate;
