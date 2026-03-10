export interface YeuCauCauHoi {
  mucDoKho: 'Dễ' | 'Trung bình' | 'Khó' | 'Rất khó';
  khoiKienThuc: string; // ID của khối kiến thức
  soLuong: number;
}

export interface CauTrucDeThi {
  id: string;
  tenCauTruc: string;
  monHoc: string; // ID của môn học
  yeuCauCauHoi: YeuCauCauHoi[];
  tongSoCau: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CauHoiTrongDe {
  id: string;
  cauHoi: string; // ID của câu hỏi
  thuTu: number;
}

export interface DeThi {
  id: string;
  tenDeThi: string;
  cauTrucDeThi: string; // ID của cấu trúc đề thi
  cauHoiTrongDe: CauHoiTrongDe[];
  tongSoCau: number;
  ngayTao: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TaoDeThiParams {
  cauTrucId: string;
  tenDeThi: string;
}