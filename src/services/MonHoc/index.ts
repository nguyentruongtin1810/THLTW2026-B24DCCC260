import axios from '@/utils/axios';
import type { MonHoc } from '@/models/MonHoc';

export async function getListMonHoc() {
  return axios.get('/api/mon-hoc');
}

export async function createMonHoc(data: Omit<MonHoc, 'id' | 'createdAt' | 'updatedAt'>) {
  return axios.post('/api/mon-hoc', data);
}

export async function updateMonHoc(id: string, data: Partial<Omit<MonHoc, 'id' | 'createdAt' | 'updatedAt'>>) {
  return axios.put(`/api/mon-hoc/${id}`, data);
}

export async function deleteMonHoc(id: string) {
  return axios.delete(`/api/mon-hoc/${id}`);
}

export async function getMonHocById(id: string) {
  return axios.get(`/api/mon-hoc/${id}`);
}