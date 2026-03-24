import { useState, useEffect } from 'react';

type FieldType = 'string' | 'number' | 'date';

export interface SoVanBang {
    id: number;
    year: number;
    name: string;
}

export interface QuyDinh {
    id: number;
    soQD: string;
    ngayBanHanh: string;
    trichYeu: string;
    soVanBangId: number;
    luotTraCuu: number;
}

export interface FieldConfig {
    id: number;
    name: string;
    type: FieldType;
}

export interface BangInfo {
    id: number;
    soVanBangId: number;
    quyetDinhId: number;
    soVaoSo: number;
    soHieu: string;
    maSinhVien: string;
    hoTen: string;
    ngaySinh: string;
    extra: Record<number, string | number>;
}

const STORAGE_KEYS = {
    soVanBang: 'app_so_van_bang',
    quyDinh: 'app_quyet_dinh',
    fieldConfig: 'app_field_config',
    bangInfo: 'app_bang_info',
};

const parseStorage = <T>(key: string, fallback: T): T => {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return fallback;
        return JSON.parse(raw) as T;
    } catch {
        return fallback;
    }
};

export default () => {
    const [soVanBangList, setSoVanBangList] = useState<SoVanBang[]>(() => parseStorage(STORAGE_KEYS.soVanBang, []));
    const [quyDinhList, setQuyDinhList] = useState<QuyDinh[]>(() => parseStorage(STORAGE_KEYS.quyDinh, []));
    const [fieldConfigs, setFieldConfigs] = useState<FieldConfig[]>(() => parseStorage(STORAGE_KEYS.fieldConfig, []));
    const [bangInfoList, setBangInfoList] = useState<BangInfo[]>(() => parseStorage(STORAGE_KEYS.bangInfo, []));

    useEffect(() => { localStorage.setItem(STORAGE_KEYS.soVanBang, JSON.stringify(soVanBangList)); }, [soVanBangList]);
    useEffect(() => { localStorage.setItem(STORAGE_KEYS.quyDinh, JSON.stringify(quyDinhList)); }, [quyDinhList]);
    useEffect(() => { localStorage.setItem(STORAGE_KEYS.fieldConfig, JSON.stringify(fieldConfigs)); }, [fieldConfigs]);
    useEffect(() => { localStorage.setItem(STORAGE_KEYS.bangInfo, JSON.stringify(bangInfoList)); }, [bangInfoList]);

    // So van bang
    const addSoVanBang = (entry: Omit<SoVanBang, 'id'>) => {
        const nextId = soVanBangList.length ? Math.max(...soVanBangList.map((e) => e.id)) + 1 : 1;
        setSoVanBangList([...soVanBangList, { ...entry, id: nextId }]);
    };
    const updateSoVanBang = (entry: SoVanBang) => {
        setSoVanBangList(soVanBangList.map((s) => (s.id === entry.id ? entry : s)));
    };
    const deleteSoVanBang = (id: number) => {
        setSoVanBangList(soVanBangList.filter((s) => s.id !== id));
        setQuyDinhList(quyDinhList.filter((q) => q.soVanBangId !== id));
        setBangInfoList(bangInfoList.filter((b) => b.soVanBangId !== id));
    };

    // Quy dinh
    const addQuyDinh = (entry: Omit<QuyDinh, 'id' | 'luotTraCuu'>) => {
        const nextId = quyDinhList.length ? Math.max(...quyDinhList.map((e) => e.id)) + 1 : 1;
        setQuyDinhList([...quyDinhList, { ...entry, id: nextId, luotTraCuu: 0 }]);
    };
    const updateQuyDinh = (entry: QuyDinh) => {
        setQuyDinhList(quyDinhList.map((q) => (q.id === entry.id ? entry : q)));
    };
    const deleteQuyDinh = (id: number) => {
        setQuyDinhList(quyDinhList.filter((q) => q.id !== id));
        setBangInfoList(bangInfoList.filter((b) => b.quyetDinhId !== id));
    };

    const getSoVanBangById = (id: number) => soVanBangList.find((s) => s.id === id);
    const getQuyDinhById = (id: number) => quyDinhList.find((q) => q.id === id);

    const incrementLuotTraCuu = (quyetDinhId: number) => {
        setQuyDinhList((prev) =>
            prev.map((q) => (q.id === quyetDinhId ? { ...q, luotTraCuu: q.luotTraCuu + 1 } : q)),
        );
    };

    // Field config
    const addFieldConfig = (entry: Omit<FieldConfig, 'id'>) => {
        const nextId = fieldConfigs.length ? Math.max(...fieldConfigs.map((f) => f.id)) + 1 : 1;
        setFieldConfigs([...fieldConfigs, { ...entry, id: nextId }]);
    };
    const updateFieldConfig = (entry: FieldConfig) => {
        setFieldConfigs(fieldConfigs.map((f) => (f.id === entry.id ? entry : f)));
    };
    const deleteFieldConfig = (id: number) => {
        setFieldConfigs(fieldConfigs.filter((f) => f.id !== id));
        setBangInfoList(bangInfoList.map((b) => {
            const extra = { ...b.extra };
            delete extra[id];
            return { ...b, extra };
        }));
    };

    // Bang info
    const getNextSoVaoSo = (soVanBangId: number) => {
        const list = bangInfoList.filter((b) => b.soVanBangId === soVanBangId);
        if (!list.length) return 1;
        return Math.max(...list.map((b) => b.soVaoSo)) + 1;
    };

    const getSoHieuFromContext = (soVanBangId: number, soVaoSo: number) => {
        const soVanBang = getSoVanBangById(soVanBangId);
        const year = soVanBang?.year || 'N/A';
        return `VB-${year}-${String(soVaoSo).padStart(4, '0')}`;
    };

    const addBangInfo = (entry: Omit<BangInfo, 'id' | 'soVaoSo' | 'soHieu'>) => {
        const soVaoSo = getNextSoVaoSo(entry.soVanBangId);
        const soHieu = getSoHieuFromContext(entry.soVanBangId, soVaoSo);
        const nextId = bangInfoList.length ? Math.max(...bangInfoList.map((e) => e.id)) + 1 : 1;
        setBangInfoList([...bangInfoList, { ...entry, id: nextId, soVaoSo, soHieu }]);
    };
    const updateBangInfo = (entry: BangInfo) => {
        setBangInfoList(bangInfoList.map((b) => (b.id === entry.id ? entry : b)));
    };
    const deleteBangInfo = (id: number) => {
        setBangInfoList(bangInfoList.filter((b) => b.id !== id));
    };

    const searchBang = (criteria: {
        soHieu?: string;
        soVaoSo?: number;
        maSinhVien?: string;
        hoTen?: string;
        ngaySinh?: string;
    }) => {
        const filled = Object.entries(criteria).filter(([_, value]) => value !== undefined && value !== null && `${value}`.trim() !== '');
        if (filled.length < 2) {
            return { error: 'Vui lòng nhập ít nhất 2 tham số tìm kiếm', result: [] as BangInfo[] };
        }
        const result = bangInfoList.filter((item) => {
            let match = true;
            if (criteria.soHieu) {
                match = match && item.soHieu.toLowerCase().includes(String(criteria.soHieu).toLowerCase());
            }
            if (criteria.soVaoSo) {
                match = match && item.soVaoSo === Number(criteria.soVaoSo);
            }
            if (criteria.maSinhVien) {
                match = match && item.maSinhVien.toLowerCase().includes(String(criteria.maSinhVien).toLowerCase());
            }
            if (criteria.hoTen) {
                match = match && item.hoTen.toLowerCase().includes(String(criteria.hoTen).toLowerCase());
            }
            if (criteria.ngaySinh) {
                match = match && item.ngaySinh === criteria.ngaySinh;
            }
            return match;
        });
        return { error: '', result };
    };

    return {
        soVanBangList,
        quyDinhList,
        fieldConfigs,
        bangInfoList,
        addSoVanBang,
        updateSoVanBang,
        deleteSoVanBang,
        addQuyDinh,
        updateQuyDinh,
        deleteQuyDinh,
        incrementLuotTraCuu,
        addFieldConfig,
        updateFieldConfig,
        deleteFieldConfig,
        addBangInfo,
        updateBangInfo,
        deleteBangInfo,
        getNextSoVaoSo,
        getSoHieuFromContext,
        getSoVanBangById,
        getQuyDinhById,
        searchBang,
    };
};
