import axios from '@/utils/axios';
import type { CauHoi, CauHoiSearchParams } from '@/models/CauHoi';

export async function getListCauHoi(params?: CauHoiSearchParams) {
  return axios.get('/api/cau-hoi', { params });
}

export async function createCauHoi(data: Omit<CauHoi, 'id' | 'createdAt' | 'updatedAt'>) {
  return axios.post('/api/cau-hoi', data);
}

export async function updateCauHoi(id: string, data: Partial<Omit<CauHoi, 'id' | 'createdAt' | 'updatedAt'>>) {
  return axios.put(`/api/cau-hoi/${id}`, data);
}

export async function deleteCauHoi(id: string) {
  return axios.delete(`/api/cau-hoi/${id}`);
}

export async function getCauHoiById(id: string) {
  return axios.get(`/api/cau-hoi/${id}`);
}

export async function searchCauHoi(params: CauHoiSearchParams) {
  return axios.get('/api/cau-hoi/search', { params });
}