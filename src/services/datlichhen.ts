import type { NhanVien, DichVu, LichHen } from '@/models/datlichhen';
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
export const getNhanViens = (): NhanVien[] => {
  return getInitialNhanViens();
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
export const getLichHens = (): LichHen[] => {
  return getInitialLichHens();
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
