export interface NhanVien {
  id: string;
  ten: string;
  gioiHanKhachNgay: number;
  lichLamViec: {
    [key: string]: { 
      batDau: string; 
      ketThuc: string; 
    };
  };
}

export interface DichVu {
  id: string;
  ten: string;
  gia: number;
  thoiGianThucHien: number; 
}

export interface LichHen {
  id: string;
  khachHang: string; 
  ngay: string; 
  gio: string;
  nhanVienId: string;
  dichVuId: string;
  trangThai: 'choDuyet' | 'xacNhan' | 'hoanThanh' | 'huy';
  ghiChu?: string;
}