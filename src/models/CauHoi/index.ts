export interface CauHoi {
  id: string;
  maCauHoi: string;
  monHoc: string; // ID của môn học
  noiDung: string;
  mucDoKho: 'Dễ' | 'Trung bình' | 'Khó' | 'Rất khó';
  khoiKienThuc: string; // ID của khối kiến thức
  createdAt?: string;
  updatedAt?: string;
}

export interface CauHoiSearchParams {
  monHoc?: string;
  mucDoKho?: string;
  khoiKienThuc?: string;
}