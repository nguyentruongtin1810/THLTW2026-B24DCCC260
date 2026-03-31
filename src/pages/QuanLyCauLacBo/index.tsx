import React, { useState } from 'react';
import {
  Tabs,
  Space,
  Button,
  Modal,
  Popconfirm,
  Table,
  Form,
  Input,
  Select,
  DatePicker,
  Switch,
  message,
  Tag,
  Checkbox,
  Empty,
  Timeline,
  Statistic,
  Row,
  Col,
  Card,
} from 'antd';
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  HistoryOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import './index.less';

type StatusType = 'Pending' | 'Approved' | 'Rejected';
type GenderType = 'Nam' | 'Nữ' | 'Khác';

interface CauLacBo {
  id: string;
  tenCLB: string;
  ngayThanhLap: string;
  moTa?: string;
  chuNhiemCLB: string;
  hoatDong: boolean;
}

interface DangKy {
  id: string;
  hoTen: string;
  email: string;
  soDienThoai: string;
  gioiTinh: GenderType;
  diaChi: string;
  soTruong: string;
  idCauLacBo: string;
  tenCauLacBo?: string;
  lyDoDangKy: string;
  trangThai: StatusType;
  ghiChu?: string;
  history?: HistoryAction[];
  createdAt: string;
}

interface HistoryAction {
  action: 'Approved' | 'Rejected';
  timestamp: string;
  reason?: string;
}

const MOCK_CLUBS: CauLacBo[] = [
  {
    id: '1',
    tenCLB: 'CLB Tiếng Anh',
    chuNhiemCLB: 'Thầy Nguyễn Văn A',
    ngayThanhLap: '2023-01-15',
    moTa: 'Phát triển tiếng Anh',
    hoatDong: true,
  },
  {
    id: '2',
    tenCLB: 'CLB Lập trình',
    chuNhiemCLB: 'Cô Trần Thị B',
    ngayThanhLap: '2022-06-20',
    moTa: 'Học Web & Mobile',
    hoatDong: true,
  },
];

const MOCK_REGISTRATIONS: DangKy[] = [
  {
    id: '1',
    hoTen: 'Nguyễn Minh Anh',
    email: 'anh@test.com',
    soDienThoai: '0912345678',
    gioiTinh: 'Nữ',
    diaChi: 'Hà Nội',
    soTruong: 'Tiếng Anh',
    idCauLacBo: '1',
    tenCauLacBo: 'CLB Tiếng Anh',
    lyDoDangKy: 'Phát triển tiếng Anh',
    trangThai: 'Approved',
    createdAt: '2024-01-10',
    history: [{ action: 'Approved', timestamp: '2024-01-11 14:30' }],
  },
  {
    id: '2',
    hoTen: 'Trần Văn B',
    email: 'vanb@test.com',
    soDienThoai: '0987654321',
    gioiTinh: 'Nam',
    diaChi: 'TP HCM',
    soTruong: 'Lập trình',
    idCauLacBo: '2',
    tenCauLacBo: 'CLB Lập trình',
    lyDoDangKy: 'Yêu thích lập trình',
    trangThai: 'Pending',
    createdAt: '2024-01-15',
  },
];

const QuanLyCauLacBo: React.FC = () => {
  const [clubs, setClubs] = useState<CauLacBo[]>(MOCK_CLUBS);
  const [registrations, setRegistrations] = useState<DangKy[]>(MOCK_REGISTRATIONS);

  const ClubTabContent = () => {
    const [clubForm] = Form.useForm();
    const [clubVisible, setClubVisible] = useState(false);
    const [isEditClub, setIsEditClub] = useState(false);
    const [editingClub, setEditingClub] = useState<CauLacBo | null>(null);
    const [viewMemberVisible, setViewMemberVisible] = useState(false);
    const [selectedClub, setSelectedClub] = useState<CauLacBo | null>(null);

    const handleAddClub = () => {
      setIsEditClub(false);
      clubForm.resetFields();
      setClubVisible(true);
    };

    const handleEditClub = (club: CauLacBo) => {
      setIsEditClub(true);
      setEditingClub(club);
      clubForm.setFieldsValue({
        tenCLB: club.tenCLB,
        chuNhiemCLB: club.chuNhiemCLB,
        ngayThanhLap: moment(club.ngayThanhLap),
        moTa: club.moTa,
        hoatDong: club.hoatDong,
      });
      setClubVisible(true);
    };

    const handleDeleteClub = (id: string) => {
      setClubs(clubs.filter((c) => c.id !== id));
      message.success('Xóa thành công');
    };

    const handleSubmitClub = (values: any) => {
      if (isEditClub && editingClub) {
        setClubs(
          clubs.map((c) =>
            c.id === editingClub.id
              ? {
                  ...c,
                  tenCLB: values.tenCLB,
                  chuNhiemCLB: values.chuNhiemCLB,
                  ngayThanhLap: values.ngayThanhLap.format('YYYY-MM-DD'),
                  moTa: values.moTa,
                  hoatDong: values.hoatDong,
                }
              : c,
          ),
        );
        message.success('Cập nhật thành công');
      } else {
        setClubs([
          ...clubs,
          {
            id: Date.now().toString(),
            tenCLB: values.tenCLB,
            chuNhiemCLB: values.chuNhiemCLB,
            ngayThanhLap: values.ngayThanhLap.format('YYYY-MM-DD'),
            moTa: values.moTa,
            hoatDong: values.hoatDong,
          },
        ]);
        message.success('Thêm thành công');
      }
      setClubVisible(false);
    };

    const getMembersOfClub = (clubId: string) => {
      return registrations.filter((r) => r.idCauLacBo === clubId && r.trangThai === 'Approved');
    };

    return (
      <>
        <Space style={{ marginBottom: 16 }}>
          <Button type="primary" icon={<PlusCircleOutlined />} onClick={handleAddClub}>
            Thêm mới
          </Button>
        </Space>

        <Table
          columns={[
            { title: 'Tên CLB', dataIndex: 'tenCLB', key: 'tenCLB', width: 150 },
            {
              title: 'Ngày thành lập',
              dataIndex: 'ngayThanhLap',
              key: 'ngayThanhLap',
              width: 120,
              render: (val) => moment(val).format('DD/MM/YYYY'),
            },
            { title: 'Mô tả', dataIndex: 'moTa', key: 'moTa', width: 200 },
            { title: 'Chủ nhiệm', dataIndex: 'chuNhiemCLB', key: 'chuNhiemCLB', width: 150 },
            {
              title: 'Hoạt động',
              dataIndex: 'hoatDong',
              key: 'hoatDong',
              width: 100,
              render: (hoatDong) => (hoatDong ? 'Có' : 'Không'),
            },
            {
              title: 'Thao tác',
              key: 'action',
              width: 120,
              render: (_, record: CauLacBo) => (
                <Space size="small">
                  <Button
                    type="link"
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() => {
                      setSelectedClub(record);
                      setViewMemberVisible(true);
                    }}
                  />
                  <Button
                    type="link"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => handleEditClub(record)}
                  />
                  <Popconfirm title="Xóa?" onConfirm={() => handleDeleteClub(record.id)}>
                    <Button type="link" size="small" danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </Space>
              ),
            },
          ]}
          dataSource={clubs}
          rowKey="id"
          pagination={false}
        />

        <Modal
          title={isEditClub ? 'Chỉnh sửa CLB' : 'Thêm CLB'}
          visible={clubVisible}
          onCancel={() => setClubVisible(false)}
          onOk={() => clubForm.submit()}
        >
          <Form form={clubForm} layout="vertical" onFinish={handleSubmitClub}>
            <Form.Item label="Tên CLB" name="tenCLB" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Chủ nhiệm" name="chuNhiemCLB" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Ngày thành lập" name="ngayThanhLap" rules={[{ required: true }]}>
              <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="Mô tả" name="moTa">
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item label="Hoạt động" name="hoatDong" valuePropName="checked" initialValue={true}>
              <Switch />
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title={`Thành viên - ${selectedClub?.tenCLB}`}
          visible={viewMemberVisible}
          onCancel={() => setViewMemberVisible(false)}
          width={700}
        >
          <Table
            columns={[
              { title: 'Họ tên', dataIndex: 'hoTen', key: 'hoTen' },
              { title: 'Email', dataIndex: 'email', key: 'email' },
              { title: 'SĐT', dataIndex: 'soDienThoai', key: 'soDienThoai' },
              { title: 'Giới tính', dataIndex: 'gioiTinh', key: 'gioiTinh' },
            ]}
            dataSource={selectedClub ? getMembersOfClub(selectedClub.id) : []}
            rowKey="id"
            pagination={false}
          />
        </Modal>
      </>
    );
  };

  const RegistrationTabContent = () => {
    const [regDetailVisible, setRegDetailVisible] = useState(false);
    const [selectedReg, setSelectedReg] = useState<DangKy | null>(null);
    const [historyVisible, setHistoryVisible] = useState(false);
    const [approveRejectVisible, setApproveRejectVisible] = useState(false);
    const [approveRejectForm] = Form.useForm();
    const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
    const [approveRejectType, setApproveRejectType] = useState<'approve' | 'reject'>('approve');
    const [singleReg, setSingleReg] = useState<DangKy | null>(null);

    const handleApprove = (reg: DangKy) => {
      setSingleReg(reg);
      setApproveRejectType('approve');
      setApproveRejectVisible(true);
    };

    const handleReject = (reg: DangKy) => {
      setSingleReg(reg);
      setApproveRejectType('reject');
      approveRejectForm.resetFields();
      setApproveRejectVisible(true);
    };

    const handleBulkApprove = () => {
      if (selectedRowIds.length === 0) {
        message.error('Chọn ít nhất 1 đơn');
        return;
      }
      setSingleReg(null);
      setApproveRejectType('approve');
      setApproveRejectVisible(true);
    };

    const handleBulkReject = () => {
      if (selectedRowIds.length === 0) {
        message.error('Chọn ít nhất 1 đơn');
        return;
      }
      setSingleReg(null);
      setApproveRejectType('reject');
      approveRejectForm.resetFields();
      setApproveRejectVisible(true);
    };

    const handleApproveRejectSubmit = async () => {
      try {
        const idsToProcess = singleReg ? [singleReg.id] : selectedRowIds;

        if (approveRejectType === 'approve') {
          setRegistrations(
            registrations.map((r) =>
              idsToProcess.includes(r.id)
                ? {
                    ...r,
                    trangThai: 'Approved' as StatusType,
                    history: [
                      ...(r.history || []),
                      { action: 'Approved' as const, timestamp: moment().format('YYYY-MM-DD HH:mm') },
                    ],
                  }
                : r,
            ),
          );
          message.success(`Duyệt ${idsToProcess.length} đơn`);
        } else {
          const values = await approveRejectForm.validateFields();
          setRegistrations(
            registrations.map((r) =>
              idsToProcess.includes(r.id)
                ? {
                    ...r,
                    trangThai: 'Rejected' as StatusType,
                    ghiChu: values.reason,
                    history: [
                      ...(r.history || []),
                      {
                        action: 'Rejected' as const,
                        timestamp: moment().format('YYYY-MM-DD HH:mm'),
                        reason: values.reason,
                      },
                    ],
                  }
                : r,
            ),
          );
          message.success(`Từ chối ${idsToProcess.length} đơn`);
        }
        setApproveRejectVisible(false);
        setSelectedRowIds([]);
        setSingleReg(null);
      } catch {}
    };

    const handleDeleteReg = (id: string) => {
      setRegistrations(registrations.filter((r) => r.id !== id));
      message.success('Xóa thành công');
    };

    const getStatusColor = (status: StatusType) => {
      if (status === 'Pending') return 'warning';
      if (status === 'Approved') return 'success';
      return 'error';
    };

    const getStatusText = (status: StatusType) => {
      if (status === 'Pending') return 'Chờ';
      if (status === 'Approved') return 'Duyệt';
      return 'Từ chối';
    };

    return (
      <>
        <Space style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={handleBulkApprove}>
            Duyệt {selectedRowIds.length > 0 && `(${selectedRowIds.length})`} đơn
          </Button>
          <Button danger onClick={handleBulkReject}>
            Từ chối {selectedRowIds.length > 0 && `(${selectedRowIds.length})`} đơn
          </Button>
        </Space>

        <Table
          columns={[
            {
              title: (
                <Checkbox
                  onChange={(e) => {
                    if (e.target.checked) setSelectedRowIds(registrations.map((r) => r.id));
                    else setSelectedRowIds([]);
                  }}
                />
              ),
              width: 50,
              render: (_, record: DangKy) => (
                <Checkbox
                  checked={selectedRowIds.includes(record.id)}
                  onChange={(e) =>
                    setSelectedRowIds(
                      e.target.checked
                        ? [...selectedRowIds, record.id]
                        : selectedRowIds.filter((id) => id !== record.id),
                    )
                  }
                />
              ),
            },
            { title: 'Họ tên', dataIndex: 'hoTen', key: 'hoTen' },
            { title: 'Email', dataIndex: 'email', key: 'email', width: 150 },
            { title: 'SĐT', dataIndex: 'soDienThoai', key: 'soDienThoai', width: 100 },
            { title: 'CLB', dataIndex: 'tenCauLacBo', key: 'tenCauLacBo' },
            {
              title: 'Trạng thái',
              dataIndex: 'trangThai',
              key: 'trangThai',
              render: (status: StatusType) => <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>,
            },
            {
              title: 'Thao tác',
              key: 'action',
              width: 150,
              render: (_, record: DangKy) => (
                <Space size="small">
                  <Button
                    type="link"
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() => {
                      setSelectedReg(record);
                      setRegDetailVisible(true);
                    }}
                  />
                  {record.trangThai === 'Pending' && (
                    <>
                      <Button
                        type="link"
                        size="small"
                        style={{ color: 'green' }}
                        icon={<CheckCircleOutlined />}
                        onClick={() => handleApprove(record)}
                      />
                      <Button
                        type="link"
                        size="small"
                        danger
                        icon={<CloseCircleOutlined />}
                        onClick={() => handleReject(record)}
                      />
                    </>
                  )}
                  <Button
                    type="link"
                    size="small"
                    icon={<HistoryOutlined />}
                    onClick={() => {
                      setSelectedReg(record);
                      setHistoryVisible(true);
                    }}
                  />
                  <Popconfirm title="Xóa?" onConfirm={() => handleDeleteReg(record.id)}>
                    <Button type="link" size="small" danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </Space>
              ),
            },
          ]}
          dataSource={registrations}
          rowKey="id"
          pagination={false}
          scroll={{ x: 1200 }}
        />

        <Modal title="Chi tiết" visible={regDetailVisible} onCancel={() => setRegDetailVisible(false)}>
          {selectedReg && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <strong>Họ tên:</strong> {selectedReg.hoTen}
              </div>
              <div>
                <strong>Email:</strong> {selectedReg.email}
              </div>
              <div>
                <strong>SĐT:</strong> {selectedReg.soDienThoai}
              </div>
              <div>
                <strong>CLB:</strong> {selectedReg.tenCauLacBo}
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <strong>Lý do:</strong> {selectedReg.lyDoDangKy}
              </div>
              {selectedReg.ghiChu && (
                <div style={{ gridColumn: '1/-1' }}>
                  <strong>Lý do từ chối:</strong> {selectedReg.ghiChu}
                </div>
              )}
            </div>
          )}
        </Modal>

        <Modal title="Lịch sử" visible={historyVisible} onCancel={() => setHistoryVisible(false)}>
          {selectedReg?.history && selectedReg.history.length > 0 ? (
            <Timeline>
              {selectedReg.history.map((h) => (
                <Timeline.Item label={h.timestamp} key={h.timestamp}>
                  <div>
                    <strong>{h.action === 'Approved' ? '✓ Duyệt' : '✗ Từ chối'}</strong>{' '}
                    {h.reason && <p>Lý do: {h.reason}</p>}
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          ) : (
            <Empty description="Không có lịch sử" />
          )}
        </Modal>

        <Modal
          title={approveRejectType === 'approve' ? 'Duyệt' : 'Từ chối'}
          visible={approveRejectVisible}
          onCancel={() => setApproveRejectVisible(false)}
          onOk={handleApproveRejectSubmit}
        >
          <Form form={approveRejectForm} layout="vertical">
            {approveRejectType === 'reject' && (
              <Form.Item label="Lý do" name="reason" rules={[{ required: true }]}>
                <Input.TextArea rows={3} />
              </Form.Item>
            )}
            {singleReg ? <p>Xử lý: {singleReg.hoTen}</p> : <p>Xử lý {selectedRowIds.length} đơn</p>}
          </Form>
        </Modal>
      </>
    );
  };

  const MemberTabContent = () => {
    const [selectedClubId, setSelectedClubId] = useState(clubs[0]?.id);
    const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
    const [transferVisible, setTransferVisible] = useState(false);
    const [transferForm] = Form.useForm();

    const currentMembers = registrations.filter(
      (r) => r.idCauLacBo === selectedClubId && r.trangThai === 'Approved',
    );

    const handleTransfer = () => {
      if (selectedMemberIds.length === 0) {
        message.error('Chọn ít nhất 1 thành viên');
        return;
      }
      setTransferVisible(true);
    };

    const handleTransferSubmit = async () => {
      try {
        const values = await transferForm.validateFields();
        setRegistrations(
          registrations.map((r) =>
            selectedMemberIds.includes(r.id)
              ? {
                  ...r,
                  idCauLacBo: values.newClubId,
                  tenCauLacBo: clubs.find((c) => c.id === values.newClubId)?.tenCLB,
                }
              : r,
          ),
        );
        message.success(`Chuyển ${selectedMemberIds.length} thành viên`);
        setSelectedMemberIds([]);
        setTransferVisible(false);
      } catch {}
    };

    return (
      <>
        <Space style={{ marginBottom: 16 }}>
          <span>CLB:</span>
          <Select
            style={{ width: 200 }}
            value={selectedClubId}
            onChange={setSelectedClubId}
            options={clubs.map((c) => ({ label: c.tenCLB, value: c.id }))}
          />
          <Button
            type="primary"
            onClick={handleTransfer}
            disabled={selectedMemberIds.length === 0}
          >
            Chuyển CLB ({selectedMemberIds.length})
          </Button>
        </Space>

        <Table
          columns={[
            {
              title: (
                <Checkbox
                  onChange={(e) => {
                    if (e.target.checked) setSelectedMemberIds(currentMembers.map((m) => m.id));
                    else setSelectedMemberIds([]);
                  }}
                />
              ),
              width: 50,
              render: (_, record: DangKy) => (
                <Checkbox
                  checked={selectedMemberIds.includes(record.id)}
                  onChange={(e) =>
                    setSelectedMemberIds(
                      e.target.checked
                        ? [...selectedMemberIds, record.id]
                        : selectedMemberIds.filter((id) => id !== record.id),
                    )
                  }
                />
              ),
            },
            { title: 'Họ tên', dataIndex: 'hoTen', key: 'hoTen' },
            { title: 'Email', dataIndex: 'email', key: 'email' },
            { title: 'SĐT', dataIndex: 'soDienThoai', key: 'soDienThoai' },
            { title: 'Địa chỉ', dataIndex: 'diaChi', key: 'diaChi' },
          ]}
          dataSource={currentMembers}
          rowKey="id"
          pagination={false}
        />

        <Modal
          title="Chuyển CLB"
          visible={transferVisible}
          onCancel={() => setTransferVisible(false)}
          onOk={handleTransferSubmit}
        >
          <p>
            Chuyển {selectedMemberIds.length} người từ{' '}
            <strong>{clubs.find((c) => c.id === selectedClubId)?.tenCLB}</strong>
          </p>
          <Form form={transferForm} layout="vertical">
            <Form.Item label="CLB đích" name="newClubId" rules={[{ required: true }]}>
              <Select
                options={clubs
                  .filter((c) => c.id !== selectedClubId)
                  .map((c) => ({ label: c.tenCLB, value: c.id }))}
              />
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  };

  const ReportTabContent = () => {
    const pendingCount = registrations.filter((r) => r.trangThai === 'Pending').length;
    const approvedCount = registrations.filter((r) => r.trangThai === 'Approved').length;
    const rejectedCount = registrations.filter((r) => r.trangThai === 'Rejected').length;

    return (
      <>
        <Space style={{ marginBottom: 16 }}>
          <Button icon={<DownloadOutlined />}>Xuất PDF</Button>
          <Button icon={<DownloadOutlined />}>Xuất Excel</Button>
        </Space>

        <Card title="Thống kê" style={{ marginBottom: 24 }}>
          <Row gutter={16}>
            <Col span={6}>
              <Statistic title="Tổng CLB" value={clubs.length} />
            </Col>
            <Col span={6}>
              <Statistic title="Chờ duyệt" value={pendingCount} valueStyle={{ color: '#faad14' }} />
            </Col>
            <Col span={6}>
              <Statistic title="Đã duyệt" value={approvedCount} valueStyle={{ color: '#52c41a' }} />
            </Col>
            <Col span={6}>
              <Statistic title="Từ chối" value={rejectedCount} valueStyle={{ color: '#ff4d4f' }} />
            </Col>
          </Row>
        </Card>

        <Card title="Chi tiết theo CLB">
          <Table
            columns={[
              { title: 'CLB', dataIndex: 'tenCLB', key: 'tenCLB' },
              {
                title: 'Chờ',
                key: 'pending',
                render: (_, record: CauLacBo) =>
                  registrations.filter((r) => r.idCauLacBo === record.id && r.trangThai === 'Pending')
                    .length,
              },
              {
                title: 'Duyệt',
                key: 'approved',
                render: (_, record: CauLacBo) =>
                  registrations.filter((r) => r.idCauLacBo === record.id && r.trangThai === 'Approved')
                    .length,
              },
              {
                title: 'Từ chối',
                key: 'rejected',
                render: (_, record: CauLacBo) =>
                  registrations.filter((r) => r.idCauLacBo === record.id && r.trangThai === 'Rejected')
                    .length,
              },
            ]}
            dataSource={clubs}
            rowKey="id"
            pagination={false}
          />
        </Card>
      </>
    );
  };

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 24 }}>Quản lý Câu lạc bộ</h1>
      <Tabs>
        <Tabs.TabPane tab="📋 Danh sách CLB" key="1">
          <ClubTabContent />
        </Tabs.TabPane>
        <Tabs.TabPane tab="📝 Đơn đăng ký" key="2">
          <RegistrationTabContent />
        </Tabs.TabPane>
        <Tabs.TabPane tab="👥 Thành viên" key="3">
          <MemberTabContent />
        </Tabs.TabPane>
        <Tabs.TabPane tab="📊 Báo cáo" key="4">
          <ReportTabContent />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default QuanLyCauLacBo;
