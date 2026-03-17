import dayjs from 'dayjs';
import type { NhanVien, DichVu, LichHen, DanhGia } from '@/models/datlichhen';
const getInitialNhanViens = (): NhanVien[] => {
  const stored = localStorage.getItem('nhanViens');
  if (stored) {
    return JSON.parse(stored);
  }
  return [
    {
      id: '1',
      ten: 'Nguyễn Văn A',
      gioiHanKhachNgay: 8,
      lichLamViec: {
        monday: { batDau: '09:00', ketThuc: '17:00' },
        tuesday: { batDau: '09:00', ketThuc: '17:00' },
        wednesday: { batDau: '09:00', ketThuc: '17:00' },
        thursday: { batDau: '09:00', ketThuc: '17:00' },
        friday: { batDau: '09:00', ketThuc: '17:00' },
        saturday: { batDau: '09:00', ketThuc: '12:00' },
      },
    },
  ];
};

export const getNhanViens = (): NhanVien[] => {
  return getInitialNhanViens();
};

const getInitialDichVus = (): DichVu[] => {
  const stored = localStorage.getItem('dichVus');
  if (stored) {
    return JSON.parse(stored);
  }
  return [
    {
      id: '1',
      ten: 'Cắt tóc nam',
      gia: 50000,
      thoiGianThucHien: 30,
    },
    {
      id: '2',
      ten: 'Cắt tóc nữ',
      gia: 60000,
      thoiGianThucHien: 40,
    },
    {
      id: '3',
      ten: 'Nhuộm tóc',
      gia: 150000,
      thoiGianThucHien: 90,
    },
  ];
};

const getInitialLichHens = (): LichHen[] => {
  const stored = localStorage.getItem('lichHens');
  if (stored) {
    return JSON.parse(stored);
  }
  return [];
};

const getInitialDanhGias = (): DanhGia[] => {
  const stored = localStorage.getItem('danhGias');
  if (stored) {
    return JSON.parse(stored);
  }
  return [];
};

export const getLichHens = (): LichHen[] => {
  return getInitialLichHens();
};

export const getNhanVienById = (id: string): NhanVien | undefined => {
  return getNhanViens().find((nv) => nv.id === id);
};

export const addNhanVien = (data: Omit<NhanVien, 'id'>) => {
  const nhanViens = getNhanViens();
  const newNhanVien: NhanVien = {
    ...data,
    id: Date.now().toString(),
  };
  nhanViens.push(newNhanVien);
  localStorage.setItem('nhanViens', JSON.stringify(nhanViens));
  return newNhanVien;
};

export const updateNhanVien = (id: string, data: Partial<NhanVien>) => {
  const nhanViens = getNhanViens();
  const index = nhanViens.findIndex((nv) => nv.id === id);
  if (index !== -1) {
    nhanViens[index] = { ...nhanViens[index], ...data };
    localStorage.setItem('nhanViens', JSON.stringify(nhanViens));
    return nhanViens[index];
  }
  return null;
};

export const deleteNhanVien = (id: string) => {
  const nhanViens = getNhanViens().filter((nv) => nv.id !== id);
  localStorage.setItem('nhanViens', JSON.stringify(nhanViens));
  return true;
};
export const getDichVus = (): DichVu[] => {
  return getInitialDichVus();
};

export const getDichVuById = (id: string): DichVu | undefined => {
  return getDichVus().find((dv) => dv.id === id);
};

export const addDichVu = (data: Omit<DichVu, 'id'>) => {
  const dichVus = getDichVus();
  const newDichVu: DichVu = {
    ...data,
    id: Date.now().toString(),
  };
  dichVus.push(newDichVu);
  localStorage.setItem('dichVus', JSON.stringify(dichVus));
  return newDichVu;
};

export const updateDichVu = (id: string, data: Partial<DichVu>) => {
  const dichVus = getDichVus();
  const index = dichVus.findIndex((dv) => dv.id === id);
  if (index !== -1) {
    dichVus[index] = { ...dichVus[index], ...data };
    localStorage.setItem('dichVus', JSON.stringify(dichVus));
    return dichVus[index];
  }
  return null;
};

export const deleteDichVu = (id: string) => {
  const dichVus = getDichVus().filter((dv) => dv.id !== id);
  localStorage.setItem('dichVus', JSON.stringify(dichVus));
  return true;
};
export const getLichHenById = (id: string): LichHen | undefined => {
  return getLichHens().find((lh) => lh.id === id);
};

export const addLichHen = (data: Omit<LichHen, 'id'>) => {
  const lichHens = getLichHens();
  const newLichHen: LichHen = {
    ...data,
    id: Date.now().toString(),
  };
  lichHens.push(newLichHen);
  localStorage.setItem('lichHens', JSON.stringify(lichHens));
  return newLichHen;
};

export const updateLichHen = (id: string, data: Partial<LichHen>) => {
  const lichHens = getLichHens();
  const index = lichHens.findIndex((lh) => lh.id === id);
  if (index !== -1) {
    lichHens[index] = { ...lichHens[index], ...data };
    localStorage.setItem('lichHens', JSON.stringify(lichHens));
    return lichHens[index];
  }
  return null;
};

export const deleteLichHen = (id: string) => {
  const lichHens = getLichHens().filter((lh) => lh.id !== id);
  localStorage.setItem('lichHens', JSON.stringify(lichHens));
  return true;
};

export const getDanhGias = (): DanhGia[] => {
  return getInitialDanhGias();
};

export const getDanhGiaById = (id: string): DanhGia | undefined => {
  return getDanhGias().find((dg) => dg.id === id);
};

export const addDanhGia = (data: Omit<DanhGia, 'id' | 'ngay'>) => {
  const danhGias = getDanhGias();
  const newDanhGia: DanhGia = {
    ...data,
    id: Date.now().toString(),
    ngay: dayjs().format('YYYY-MM-DD'),
  };
  danhGias.push(newDanhGia);
  localStorage.setItem('danhGias', JSON.stringify(danhGias));

  // Link rating to appointment
  updateLichHen(data.lichHenId, { danhGiaId: newDanhGia.id });

  return newDanhGia;
};

export const updateDanhGia = (id: string, data: Partial<DanhGia>) => {
  const danhGias = getDanhGias();
  const index = danhGias.findIndex((dg) => dg.id === id);
  if (index !== -1) {
    danhGias[index] = { ...danhGias[index], ...data };
    localStorage.setItem('danhGias', JSON.stringify(danhGias));
    return danhGias[index];
  }
  return null;
};

export const deleteDanhGia = (id: string) => {
  const danhGias = getDanhGias().filter((dg) => dg.id !== id);
  localStorage.setItem('danhGias', JSON.stringify(danhGias));
  return true;
};

export const getDanhGiasByNhanVien = (nhanVienId: string): DanhGia[] => {
  return getDanhGias().filter((dg) => dg.nhanVienId === nhanVienId);
};

export const getAverageRatingForNhanVien = (nhanVienId: string): number => {
  const ratings = getDanhGiasByNhanVien(nhanVienId);
  if (!ratings.length) return 0;
  const sum = ratings.reduce((acc, rg) => acc + rg.soSao, 0);
  return parseFloat((sum / ratings.length).toFixed(1));
};

export const getRatingsByLichHenId = (lichHenId: string): DanhGia | undefined => {
  const lichHen = getLichHenById(lichHenId);
  if (!lichHen?.danhGiaId) return undefined;
  return getDanhGiaById(lichHen.danhGiaId);
};

export const timeOverlap = (
  start1: string,
  end1: string,
  start2: string,
  end2: string,
): boolean => {
  const toMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const s1 = toMinutes(start1);
  const e1 = toMinutes(end1);
  const s2 = toMinutes(start2);
  const e2 = toMinutes(end2);

  return s1 < e2 && s2 < e1;
};
export const checkScheduleConflict = (
  ngay: string,
  gioVao: string,
  gioRa: string,
  nhanVienId: string,
  excludeLichHenId?: string,
): LichHen[] => {
  const lichHens = getLichHens();
  const nhanVien = getNhanVienById(nhanVienId);

  if (!nhanVien) return [];

  
  const dayOfWeek = new Date(ngay).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const workSchedule = nhanVien.lichLamViec[dayOfWeek];

  if (!workSchedule) {
    return []; 
  }

  const conflicts = lichHens.filter((lh) => {
   
    if (excludeLichHenId && lh.id === excludeLichHenId) return false;
    if (lh.ngay !== ngay) return false;
    if (lh.nhanVienId !== nhanVienId) return false;
    if (lh.trangThai === 'huy') return false;
    const [existingGioVao, existingGioRa] = lh.gio.split('-').map((t) => t.trim());
    return timeOverlap(gioVao, gioRa, existingGioVao, existingGioRa);
  });

  return conflicts;
};
export const getLichHenByDateAndStaff = (ngay: string, nhanVienId: string): LichHen[] => {
  return getLichHens().filter(
    (lh) =>
      lh.ngay === ngay && lh.nhanVienId === nhanVienId && lh.trangThai !== 'huy',
  );
};
export const getAvailableTimeSlots = (
  ngay: string,
  nhanVienId: string,
  serviceDurationMinutes: number,
): string[] => {
  const nhanVien = getNhanVienById(nhanVienId);
  if (!nhanVien) return [];

  const dayOfWeek = new Date(ngay).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const workSchedule = nhanVien.lichLamViec[dayOfWeek];

  if (!workSchedule) {
    return []; 
  }

  const slots: string[] = [];
  const [workStart, workEnd] = [workSchedule.batDau, workSchedule.ketThuc];
  const toMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const fromMinutes = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  };

  const startMinutes = toMinutes(workStart);
  const endMinutes = toMinutes(workEnd);
  for (let current = startMinutes; current + serviceDurationMinutes <= endMinutes; current += 30) {
    const slotStart = fromMinutes(current);
    const slotEnd = fromMinutes(current + serviceDurationMinutes);
    const hasConflict = checkScheduleConflict(ngay, slotStart, slotEnd, nhanVienId).length > 0;

    if (!hasConflict) {
      slots.push(`${slotStart}-${slotEnd}`);
    }
  }

  return slots;
};
export const countAppointmentsForStaffOnDay = (ngay: string, nhanVienId: string): number => {
  return getLichHens().filter(
    (lh) =>
      lh.ngay === ngay && lh.nhanVienId === nhanVienId && lh.trangThai !== 'huy',
  ).length;
};
export const hasCapacityOnDay = (ngay: string, nhanVienId: string): boolean => {
  const nhanVien = getNhanVienById(nhanVienId);
  if (!nhanVien) return false;

  const count = countAppointmentsForStaffOnDay(ngay, nhanVienId);
  return count < nhanVien.gioiHanKhachNgay;
};

export const getAppointmentsCountByDay = (month: string) => {
  // month format: YYYY-MM
  const counts: Record<string, number> = {};
  getLichHens()
    .filter((lh) => lh.trangThai !== 'huy' && lh.ngay.startsWith(month))
    .forEach((lh) => {
      counts[lh.ngay] = (counts[lh.ngay] || 0) + 1;
    });
  return Object.entries(counts)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

export const getRevenueByService = (month: string) => {
  const revenueMap: Record<string, { ten: string; revenue: number; count: number }> = {};
  const services = getDichVus();
  getLichHens()
    .filter((lh) => lh.trangThai === 'hoanThanh' && lh.ngay.startsWith(month))
    .forEach((lh) => {
      const dv = services.find((d) => d.id === lh.dichVuId);
      if (!dv) return;
      if (!revenueMap[dv.id]) {
        revenueMap[dv.id] = { ten: dv.ten, revenue: 0, count: 0 };
      }
      revenueMap[dv.id].revenue += dv.gia;
      revenueMap[dv.id].count += 1;
    });
  return Object.entries(revenueMap).map(([id, value]) => ({ id, ...value }));
};

export const getRevenueByNhanVien = (month: string) => {
  const revenueMap: Record<string, { ten: string; revenue: number; count: number }> = {};
  const staffs = getNhanViens();
  getLichHens()
    .filter((lh) => lh.trangThai === 'hoanThanh' && lh.ngay.startsWith(month))
    .forEach((lh) => {
      const nv = staffs.find((n) => n.id === lh.nhanVienId);
      const dv = getDichVuById(lh.dichVuId);
      if (!nv || !dv) return;
      if (!revenueMap[nv.id]) {
        revenueMap[nv.id] = { ten: nv.ten, revenue: 0, count: 0 };
      }
      revenueMap[nv.id].revenue += dv.gia;
      revenueMap[nv.id].count += 1;
    });
  return Object.entries(revenueMap).map(([id, value]) => ({ id, ...value }));
};
