import axios from '@/utils/axios';
import type { KhoiKienThuc } from '@/models/KhoiKienThuc';

const API_PREFIX = '/api/khoi-kien-thuc';

export async function getListKhoiKienThuc(params?: any) {
  return axios.get<{ data: KhoiKienThuc[] }>(`${API_PREFIX}`, { params });
}

export async function getKhoiKienThucById(id: string) {
  return axios.get<KhoiKienThuc>(`${API_PREFIX}/${id}`);
}

export async function createKhoiKienThuc(data: Omit<KhoiKienThuc, 'id' | 'createdAt' | 'updatedAt'>) {
  return axios.post<KhoiKienThuc>(`${API_PREFIX}`, data);
}

export async function updateKhoiKienThuc(id: string, data: Partial<KhoiKienThuc>) {
  return axios.put<KhoiKienThuc>(`${API_PREFIX}/${id}`, data);
}

export async function deleteKhoiKienThuc(id: string) {
  return axios.delete<void>(`${API_PREFIX}/${id}`);
}
