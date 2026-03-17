import axios from '@/utils/axios';
import type { CauTrucDeThi, TaoDeThiParams } from '@/models/QuanLyDeThi';

// Quản lý cấu trúc đề thi
export async function getListCauTrucDeThi() {
  return axios.get('/api/cau-truc-de-thi');
}

export async function createCauTrucDeThi(data: Omit<CauTrucDeThi, 'id' | 'createdAt' | 'updatedAt'>) {
  return axios.post('/api/cau-truc-de-thi', data);
}

export async function updateCauTrucDeThi(id: string, data: Partial<Omit<CauTrucDeThi, 'id' | 'createdAt' | 'updatedAt'>>) {
  return axios.put(`/api/cau-truc-de-thi/${id}`, data);
}

export async function deleteCauTrucDeThi(id: string) {
  return axios.delete(`/api/cau-truc-de-thi/${id}`);
}

export async function getCauTrucDeThiById(id: string) {
  return axios.get(`/api/cau-truc-de-thi/${id}`);
}

// Quản lý đề thi
export async function getListDeThi() {
  return axios.get('/api/de-thi');
}

export async function createDeThi(data: TaoDeThiParams) {
  return axios.post('/api/de-thi/generate', data);
}

export async function deleteDeThi(id: string) {
  return axios.delete(`/api/de-thi/${id}`);
}

export async function getDeThiById(id: string) {
  return axios.get(`/api/de-thi/${id}`);
}

// Tạo đề thi từ cấu trúc
export async function generateDeThiFromCauTruc(cauTrucId: string, tenDeThi: string) {
  return axios.post('/api/de-thi/generate-from-structure', {
    cauTrucId,
    tenDeThi,
  });
}