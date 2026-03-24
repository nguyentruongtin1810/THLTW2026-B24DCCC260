import React, { useMemo, useState } from 'react';
import { useModel } from 'umi';
import {
    Button,
    DatePicker,
    Form,
    Input,
    Modal,
    Select,
    Space,
    Table,
    Tabs,
    Typography,
    message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';

const { TabPane } = Tabs;
const { Text } = Typography;

const QuanLyVanBang: React.FC = () => {
    const {
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
        addFieldConfig,
        updateFieldConfig,
        deleteFieldConfig,
        addBangInfo,
        updateBangInfo,
        deleteBangInfo,
        incrementLuotTraCuu,
        getSoVanBangById,
        getQuyDinhById,
        getNextSoVaoSo,
        getSoHieuFromContext,
        searchBang,
    } = useModel('vanbang');

    // Modal state
    const [svbModalVisible, setSvbModalVisible] = useState(false);
    const [editingSvb, setEditingSvb] = useState<any>(null);
    const [qdModalVisible, setQdModalVisible] = useState(false);
    const [editingQd, setEditingQd] = useState<any>(null);
    const [fieldModalVisible, setFieldModalVisible] = useState(false);
    const [editingField, setEditingField] = useState<any>(null);
    const [bangModalVisible, setBangModalVisible] = useState(false);
    const [editingBang, setEditingBang] = useState<any>(null);

    const [searched, setSearched] = useState(false);
    const [searchResult, setSearchResult] = useState<any[]>([]);
    const [searchMsg, setSearchMsg] = useState('');
    const [searchFilter, setSearchFilter] = useState({
        soHieu: '',
        soVaoSo: '',
        maSinhVien: '',
        hoTen: '',
        ngaySinh: '',
    });
    const [detailRecord, setDetailRecord] = useState<any>(null);

    // Columns
    const soVanBangColumns: ColumnsType<any> = [
        { title: 'STT', render: (_: any, __: any, index: number) => index + 1, width: 60 },
        { title: 'Năm', dataIndex: 'year', key: 'year' },
        { title: 'Tên sổ', dataIndex: 'name', key: 'name' },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: any, record: any) => (
                <Space>
                    <Button
                        type='link'
                        onClick={() => {
                            setEditingSvb(record);
                            setSvbModalVisible(true);
                        }}
                    >
                        Sửa
                    </Button>
                    <Button
                        type='link'
                        danger
                        onClick={() => deleteSoVanBang(record.id)}
                    >
                        Xóa
                    </Button>
                </Space>
            ),
        },
    ];

    const quyDinhColumns: ColumnsType<any> = [
        { title: 'STT', render: (_: any, __: any, index: number) => index + 1, width: 60 },
        { title: 'Số QĐ', dataIndex: 'soQD', key: 'soQD' },
        { title: 'Ngày', dataIndex: 'ngayBanHanh', key: 'ngayBanHanh' },
        { title: 'Trích yếu', dataIndex: 'trichYeu', key: 'trichYeu' },
        {
            title: 'Sổ văn bằng',
            dataIndex: 'soVanBangId',
            key: 'soVanBangId',
            render: (id) => getSoVanBangById(id)?.name || 'N/A',
        },
        { title: 'Lượt tra cứu', dataIndex: 'luotTraCuu', key: 'luotTraCuu' },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: any, record: any) => (
                <Space>
                    <Button
                        type='link'
                        onClick={() => {
                            setEditingQd(record);
                            setQdModalVisible(true);
                        }}
                    >
                        Sửa
                    </Button>
                    <Button
                        type='link'
                        danger
                        onClick={() => deleteQuyDinh(record.id)}
                    >
                        Xóa
                    </Button>
                </Space>
            ),
        },
    ];

    const fieldConfigColumns: ColumnsType<any> = [
        { title: 'STT', render: (_: any, __: any, index: number) => index + 1, width: 60 },
        { title: 'Tên trường', dataIndex: 'name', key: 'name' },
        { title: 'Kiểu dữ liệu', dataIndex: 'type', key: 'type' },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: any, record: any) => (
                <Space>
                    <Button
                        type='link'
                        onClick={() => {
                            setEditingField(record);
                            setFieldModalVisible(true);
                        }}
                    >
                        Sửa
                    </Button>
                    <Button
                        type='link'
                        danger
                        onClick={() => deleteFieldConfig(record.id)}
                    >
                        Xóa
                    </Button>
                </Space>
            ),
        },
    ];

    const recordColumns: ColumnsType<any> = useMemo(() => {
        const staticCols = [
            { title: 'STT', render: (_: any, __: any, index: number) => index + 1, width: 60 },
            { title: 'Sổ VB', dataIndex: 'soVanBangId', key: 'soVanBangId', render: (id: number ) => getSoVanBangById(id)?.name || 'N/A',},
            { title: 'Số vào sổ', dataIndex: 'soVaoSo', key: 'soVaoSo' },
            { title: 'Số hiệu', dataIndex: 'soHieu', key: 'soHieu' },
            { title: 'Mã SV', dataIndex: 'maSinhVien', key: 'maSinhVien' },
            { title: 'Họ tên', dataIndex: 'hoTen', key: 'hoTen' },
            { title: 'Ngày sinh', dataIndex: 'ngaySinh', key: 'ngaySinh' },
            {
                title: 'Quyết định',
                dataIndex: 'quyetDinhId',
                key: 'quyetDinhId',
                render: (id: number ) => getQuyDinhById(id)?.soQD || 'N/A',
            },
        ];
        const dynamicCols = fieldConfigs.map((field) => ({
            title: field.name,
            dataIndex: ['extra', field.id.toString()],
            key: `field_${field.id}`,
            render: (_: any, record: any) => record.extra?.[field.id] ?? '',
        }));
        return [...staticCols, ...dynamicCols, {
            title: 'Hành động',
            key: 'action',
            render: (_: any, record: any) => (
                <Space>
                    <Button
                        type='link'
                        onClick={() => {
                            setEditingBang(record);
                            setBangModalVisible(true);
                        }}
                    >
                        Sửa
                    </Button>
                    <Button type='link' danger onClick={() => deleteBangInfo(record.id)}>
                        Xóa
                    </Button>
                </Space>
            ),
        }];
    }, [fieldConfigs, bangInfoList]);

    const luotTraCuuByQuyetDinh = useMemo(() => {
        return quyDinhList.map((qd) => ({
            ...qd,
            soVanBang: getSoVanBangById(qd.soVanBangId)?.name || 'N/A',
        }));
    }, [quyDinhList, soVanBangList]);

    // Form handlers
    const handleSaveSoVanBang = (values: any) => {
        const payload = { year: values.year, name: values.name };
        if (editingSvb) {
            updateSoVanBang({ ...editingSvb, ...payload });
            message.success('Cập nhật sổ văn bằng thành công');
        } else {
            addSoVanBang(payload);
            message.success('Thêm sổ văn bằng thành công');
        }
        setSvbModalVisible(false);
        setEditingSvb(null);
    };

    const handleSaveQuyDinh = (values: any) => {
        const ngayBanHanhValue = values.ngayBanHanh && values.ngayBanHanh.format ? values.ngayBanHanh.format('YYYY-MM-DD') : values.ngayBanHanh;
        const payload = {
            soQD: values.soQD,
            ngayBanHanh: ngayBanHanhValue,
            trichYeu: values.trichYeu,
            soVanBangId: values.soVanBangId,
        };
        if (editingQd) {
            updateQuyDinh({ ...editingQd, ...payload });
            message.success('Cập nhật quyết định thành công');
        } else {
            addQuyDinh(payload);
            message.success('Thêm quyết định thành công');
        }
        setQdModalVisible(false);
        setEditingQd(null);
    };

    const handleSaveField = (values: any) => {
        const payload = { name: values.name, type: values.type };
        if (editingField) {
            updateFieldConfig({ ...editingField, ...payload });
            message.success('Cập nhật trường dữ liệu thành công');
        } else {
            addFieldConfig(payload);
            message.success('Thêm trường dữ liệu thành công');
        }
        setFieldModalVisible(false);
        setEditingField(null);
    };

    const handleSaveBangInfo = (values: any) => {
        const convertedNgaySinh = values.ngaySinh && values.ngaySinh.format ? values.ngaySinh.format('YYYY-MM-DD') : values.ngaySinh;
        const entryExtra: Record<number, string | number> = {};
        fieldConfigs.forEach((fld) => {
            const value = values[`field_${fld.id}`];
            if (value !== undefined) {
                if (fld.type === 'date') {
                    entryExtra[fld.id] = value && value.format ? value.format('YYYY-MM-DD') : value;
                } else {
                    entryExtra[fld.id] = value;
                }
            }
        });

        if (editingBang) {
            const newBang = {
                ...editingBang,
                soVanBangId: values.soVanBangId,
                quyetDinhId: values.quyetDinhId,
                maSinhVien: values.maSinhVien,
                hoTen: values.hoTen,
                ngaySinh: convertedNgaySinh,
                extra: entryExtra,
            };
            updateBangInfo(newBang);
            message.success('Cập nhật thông tin văn bằng thành công');
        } else {
            addBangInfo({
                soVanBangId: values.soVanBangId,
                quyetDinhId: values.quyetDinhId,
                maSinhVien: values.maSinhVien,
                hoTen: values.hoTen,
                ngaySinh: convertedNgaySinh,
                extra: entryExtra,
            });
            message.success('Thêm thông tin văn bằng thành công');
        }

        setBangModalVisible(false);
        setEditingBang(null);
    };

    const onSearch = () => {
        const criteria = {
            soHieu: searchFilter.soHieu.trim(),
            soVaoSo: searchFilter.soVaoSo ? Number(searchFilter.soVaoSo) : undefined,
            maSinhVien: searchFilter.maSinhVien.trim(),
            hoTen: searchFilter.hoTen.trim(),
            ngaySinh: searchFilter.ngaySinh.trim(),
        };
        const { error, result } = searchBang(criteria);
        if (error) {
            setSearchMsg(error);
            setSearchResult([]);
            setSearched(false);
            return;
        }
        setSearchMsg('');
        setSearchResult(result);
        setSearched(true);
    };

    const onViewDetail = (item: any) => {
        setDetailRecord(item);
        incrementLuotTraCuu(item.quyetDinhId);
        message.info('Đã ghi nhận lượt tra cứu theo quyết định.');
    };

    const bangInitialValues = useMemo(() => {
        if (!editingBang) {
            return {
                soVanBangId: undefined,
                quyetDinhId: undefined,
                maSinhVien: '',
                hoTen: '',
                ngaySinh: null,
            };
        }
        const extraValues = fieldConfigs.reduce((acc: Record<string, any>, f) => {
            const rawVal = editingBang.extra?.[f.id];
            acc[`field_${f.id}`] =
                f.type === 'date' && rawVal
                    ? moment(rawVal)
                    : rawVal;
            return acc;
        }, {});

        return {
            soVanBangId: editingBang.soVanBangId,
            quyetDinhId: editingBang.quyetDinhId,
            maSinhVien: editingBang.maSinhVien,
            hoTen: editingBang.hoTen,
            ngaySinh: editingBang.ngaySinh ? moment(editingBang.ngaySinh) : null,
            ...extraValues,
        };
    }, [editingBang, fieldConfigs]);

    return (
        <div style={{ padding: 20 }}>
            <h1>Quản lý Văn bằng tốt nghiệp</h1>
            <Tabs defaultActiveKey='1'>
                <TabPane tab='1. Sổ văn bằng' key='1'>
                    <Space style={{ marginBottom: 10 }}>
                        <Button
                            type='primary'
                            onClick={() => {
                                setEditingSvb(null);
                                setSvbModalVisible(true);
                            }}
                        >
                            + Thêm sổ
                        </Button>
                    </Space>
                    <Table columns={soVanBangColumns} dataSource={soVanBangList} rowKey='id' pagination={{ pageSize: 8 }} />
                </TabPane>

                <TabPane tab='2. Quyết định tốt nghiệp' key='2'>
                    <Space style={{ marginBottom: 10 }}>
                        <Button
                            type='primary'
                            onClick={() => {
                                setEditingQd(null);
                                setQdModalVisible(true);
                            }}
                        >
                            + Thêm quyết định
                        </Button>
                    </Space>
                    <Table columns={quyDinhColumns} dataSource={quyDinhList} rowKey='id' pagination={{ pageSize: 8 }} />
                </TabPane>

                <TabPane tab='3. Cấu hình biểu mẫu' key='3'>
                    <Space style={{ marginBottom: 10 }}>
                        <Button
                            type='primary'
                            onClick={() => {
                                setEditingField(null);
                                setFieldModalVisible(true);
                            }}
                        >
                            + Thêm trường
                        </Button>
                    </Space>
                    <Table columns={fieldConfigColumns} dataSource={fieldConfigs} rowKey='id' pagination={{ pageSize: 8 }} />
                </TabPane>

                <TabPane tab='4. Thông tin văn bằng' key='4'>
                    <Space style={{ marginBottom: 10 }}>
                        <Button
                            type='primary'
                            onClick={() => {
                                setEditingBang(null);
                                setBangModalVisible(true);
                            }}
                        >
                            + Thêm văn bằng
                        </Button>
                    </Space>
                    <Table columns={recordColumns} dataSource={bangInfoList} rowKey='id' pagination={{ pageSize: 8 }} />
                </TabPane>

                <TabPane tab='5. Tra cứu văn bằng' key='5'>
                    <Form layout='inline' style={{ marginBottom: 12 }}>
                        <Form.Item label='Số hiệu' >
                            <Input
                                value={searchFilter.soHieu}
                                onChange={(e) => setSearchFilter({ ...searchFilter, soHieu: e.target.value })}
                                placeholder='VD: VB-2026-0001'
                            />
                        </Form.Item>
                        <Form.Item label='Số vào sổ' >
                            <Input
                                type='number'
                                value={searchFilter.soVaoSo}
                                onChange={(e) => setSearchFilter({ ...searchFilter, soVaoSo: e.target.value })}
                            />
                        </Form.Item>
                        <Form.Item label='MSV' >
                            <Input
                                value={searchFilter.maSinhVien}
                                onChange={(e) => setSearchFilter({ ...searchFilter, maSinhVien: e.target.value })}
                            />
                        </Form.Item>
                        <Form.Item label='Họ tên' >
                            <Input
                                value={searchFilter.hoTen}
                                onChange={(e) => setSearchFilter({ ...searchFilter, hoTen: e.target.value })}
                            />
                        </Form.Item>
                        <Form.Item label='Ngày sinh' >
                            <DatePicker
                                format='YYYY-MM-DD'
                                value={searchFilter.ngaySinh ? moment(searchFilter.ngaySinh) : null}
                                onChange={(d) => setSearchFilter({ ...searchFilter, ngaySinh: d ? d.format('YYYY-MM-DD') : '' })}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type='primary' onClick={onSearch}>Tra cứu</Button>
                        </Form.Item>
                    </Form>

                    {searchMsg && <Text type='danger'>{searchMsg}</Text>}

                    {searched && <Table
                        columns={[
                            { title: 'Số hiệu', dataIndex: 'soHieu', key: 'soHieu' },
                            { title: 'Số vào sổ', dataIndex: 'soVaoSo', key: 'soVaoSo' },
                            { title: 'MSV', dataIndex: 'maSinhVien', key: 'maSinhVien' },
                            { title: 'Họ tên', dataIndex: 'hoTen', key: 'hoTen' },
                            { title: 'Ngày sinh', dataIndex: 'ngaySinh', key: 'ngaySinh' },
                            { title: 'Quyết định', dataIndex: 'quyetDinhId', key: 'quyetDinhId', render: (id) => getQuyDinhById(id)?.soQD || 'N/A' },
                            {
                                title: 'Chi tiết',
                                key: 'action',
                                render: (_: any, record: any) => (
                                    <Button size='small' onClick={() => onViewDetail(record)}>
                                        Xem
                                    </Button>
                                ),
                            },
                        ]}
                        dataSource={searchResult}
                        rowKey='id'
                        pagination={{ pageSize: 6 }}
                    />}

                    {detailRecord && (
                        <div style={{ marginTop: 10, border: '1px solid #e8e8e8', padding: 12 }}>
                            <Text strong>Chi tiết văn bằng:</Text>
                            <div>Số vào sổ: {detailRecord.soVaoSo}</div>
                            <div>Số hiệu: {detailRecord.soHieu}</div>
                            <div>MSV: {detailRecord.maSinhVien}</div>
                            <div>Họ tên: {detailRecord.hoTen}</div>
                            <div>Ngày sinh: {detailRecord.ngaySinh}</div>
                            <div>Sổ: {getSoVanBangById(detailRecord.soVanBangId)?.name}</div>
                            <div>Quyết định: {getQuyDinhById(detailRecord.quyetDinhId)?.soQD}</div>
                            {fieldConfigs.map((f) => (
                                <div key={f.id}>{f.name}: {detailRecord.extra?.[f.id] ?? ''}</div>
                            ))}
                        </div>
                    )}

                    <div style={{ marginTop: 20 }}>
                        <Text strong>Thống kê lượt tra cứu theo quyết định:</Text>
                        <Table
                            columns={[
                                { title: 'Số QĐ', dataIndex: 'soQD', key: 'soQD' },
                                { title: 'Sổ VB', dataIndex: 'soVanBang', key: 'soVanBang' },
                                { title: 'Lượt tra cứu', dataIndex: 'luotTraCuu', key: 'luotTraCuu' },
                            ]}
                            dataSource={luotTraCuuByQuyetDinh}
                            rowKey='id'
                            pagination={false}
                        />
                    </div>
                </TabPane>
            </Tabs>

            <Modal
                title={editingSvb ? 'Sửa sổ văn bằng' : 'Thêm sổ văn bằng'}
                visible={svbModalVisible}
                onCancel={() => {
                    setSvbModalVisible(false);
                    setEditingSvb(null);
                }}
                footer={null}
                destroyOnClose
            >
                <Form initialValues={editingSvb || { year: undefined, name: '' }} layout='vertical' onFinish={handleSaveSoVanBang}>
                    <Form.Item name='year' label='Năm' rules={[{ required: true, message: 'Nhập năm' }]}> 
                        <Input type='number' />
                    </Form.Item>
                    <Form.Item name='name' label='Tên sổ' rules={[{ required: true, message: 'Nhập tên sổ' }]}> 
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button htmlType='submit' type='primary'>Lưu</Button>
                            <Button onClick={() => setSvbModalVisible(false)}>Hủy</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title={editingQd ? 'Sửa quyết định' : 'Thêm quyết định'}
                visible={qdModalVisible}
                onCancel={() => {
                    setQdModalVisible(false);
                    setEditingQd(null);
                }}
                footer={null}
                destroyOnClose
            >
                <Form
                    initialValues={
                        editingQd
                            ? {
                                  ...editingQd,
                                  ngayBanHanh: editingQd.ngayBanHanh ? moment(editingQd.ngayBanHanh) : null,
                              }
                            : {
                                  soQD: '',
                                  ngayBanHanh: null,
                                  trichYeu: '',
                                  soVanBangId: undefined,
                              }
                    }
                    layout='vertical'
                    onFinish={handleSaveQuyDinh}
                >
                    <Form.Item name='soQD' label='Số QĐ' rules={[{ required: true, message: 'Nhập số QĐ' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name='ngayBanHanh' label='Ngày ban hành' rules={[{ required: true, message: 'Chọn ngày' }]}>
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name='trichYeu' label='Trích yếu' rules={[{ required: true, message: 'Nhập trích yếu' }]}>
                        <Input.TextArea rows={3} />
                    </Form.Item>
                    <Form.Item name='soVanBangId' label='Sổ văn bằng' rules={[{ required: true, message: 'Chọn sổ văn bằng' }]}>
                        <Select placeholder='Chọn sổ văn bằng'>
                            {soVanBangList.map((s) => (
                                <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button htmlType='submit' type='primary'>Lưu</Button>
                            <Button onClick={() => setQdModalVisible(false)}>Hủy</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title={editingField ? 'Sửa trường thông tin' : 'Thêm trường thông tin'}
                visible={fieldModalVisible}
                onCancel={() => {
                    setFieldModalVisible(false);
                    setEditingField(null);
                }}
                footer={null}
                destroyOnClose
            >
                <Form
                    initialValues={editingField || { name: '', type: 'string' }}
                    layout='vertical'
                    onFinish={handleSaveField}
                >
                    <Form.Item name='name' label='Tên trường' rules={[{ required: true, message: 'Nhập tên trường' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name='type' label='Kiểu dữ liệu' rules={[{ required: true, message: 'Chọn kiểu dữ liệu' }]}>
                        <Select>
                            <Select.Option value='string'>String</Select.Option>
                            <Select.Option value='number'>Number</Select.Option>
                            <Select.Option value='date'>Date</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button htmlType='submit' type='primary'>Lưu</Button>
                            <Button onClick={() => setFieldModalVisible(false)}>Hủy</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title={editingBang ? 'Sửa thông tin văn bằng' : 'Thêm thông tin văn bằng'}
                visible={bangModalVisible}
                onCancel={() => {
                    setBangModalVisible(false);
                    setEditingBang(null);
                }}
                footer={null}
                width={800}
                destroyOnClose
            >
                <Form
                    initialValues={bangInitialValues}
                    layout='vertical'
                    onFinish={handleSaveBangInfo}
                >
                    <Form.Item name='soVanBangId' label='Sổ văn bằng' rules={[{ required: true, message: 'Chọn sổ văn bằng' }]}> 
                        <Select placeholder='Chọn sổ...'>
                            {soVanBangList.map((s) => <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item name='quyetDinhId' label='Quyết định' rules={[{ required: true, message: 'Chọn quyết định' }]}> 
                        <Select placeholder='Chọn quyết định...'>
                            {quyDinhList.map((q) => <Select.Option key={q.id} value={q.id}>{q.soQD} ({getSoVanBangById(q.soVanBangId)?.name || 'N/A'})</Select.Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item label='Số vào sổ'>
                        <Input value={editingBang ? editingBang.soVaoSo : 'Tự động khi lưu'} disabled />
                    </Form.Item>
                    <Form.Item label='Số hiệu văn bằng'>
                        <Input value={editingBang ? editingBang.soHieu : 'Tự động khi lưu'} disabled />
                    </Form.Item>
                    <Form.Item name='maSinhVien' label='Mã sinh viên' rules={[{ required: true, message: 'Nhập mã sinh viên' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name='hoTen' label='Họ tên' rules={[{ required: true, message: 'Nhập họ tên' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name='ngaySinh' label='Ngày sinh' rules={[{ required: true, message: 'Chọn ngày sinh' }]}>
                        <DatePicker style={{ width: '100%' }} format='YYYY-MM-DD' />
                    </Form.Item>

                    {fieldConfigs.map((f) => (
                        <Form.Item
                            key={f.id}
                            name={`field_${f.id}`}
                            label={f.name}
                            rules={[{ required: true, message: `Nhập ${f.name}` }]}
                        >
                            {f.type === 'string' && <Input />}
                            {f.type === 'number' && <Input type='number' />}
                            {f.type === 'date' && <DatePicker style={{ width: '100%' }} format='YYYY-MM-DD' />}
                        </Form.Item>
                    ))}

                    <Form.Item>
                        <Space>
                            <Button type='primary' htmlType='submit'>Lưu</Button>
                            <Button onClick={() => setBangModalVisible(false)}>Hủy</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default QuanLyVanBang;
