import React, { useState, useEffect } from 'react';
import {
  Button,
  Table,
  Modal,
  Form,
  Select,
  DatePicker,
  message,
  Tag,
  Space,
  Input,
  Row,
  Col,
  Card,
  Alert,
  Divider,
  Popconfirm,
  Rate,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { LichHen, NhanVien, DichVu, DanhGia } from '@/models/datlichhen';
import {
  getLichHens,
  updateLichHen,
  deleteLichHen,
  getNhanViens,
  getDichVus,
  getNhanVienById,
  getDichVuById,
  checkScheduleConflict,
  getRatingsByLichHenId,
  addDanhGia,
  updateDanhGia,
} from '@/services/datlichhen';

const QuanLyLichHen: React.FC = () => {
  const [lichHens, setLichHens] = useState<LichHen[]>([]);
  const [nhanViens, setNhanViens] = useState<NhanVien[]>([]);
  const [dichVus, setDichVus] = useState<DichVu[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingLichHen, setEditingLichHen] = useState<LichHen | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedLichHen, setSelectedLichHen] = useState<LichHen | null>(null);
  const [selectedRating, setSelectedRating] = useState<DanhGia | null>(null);
  const [ratingValue, setRatingValue] = useState<number>(0);
  const [ratingComment, setRatingComment] = useState<string>('');
  const [replyText, setReplyText] = useState<string>('');
  const [conflictWarning, setConflictWarning] = useState<LichHen[]>([]);
  const [form] = Form.useForm();
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterDate, setFilterDate] = useState<string>('');

  const loadData = () => {
    setLichHens(getLichHens());
    setNhanViens(getNhanViens());
    setDichVus(getDichVus());
  };

  const getStatusColor = (status: LichHen['trangThai']): string => {
    const colorMap = {
      choDuyet: 'orange',
      xacNhan: 'blue',
      hoanThanh: 'green',
      huy: 'red',
    };
    return colorMap[status];
  };

  const getStatusLabel = (status: LichHen['trangThai']): string => {
    const labelMap = {
      choDuyet: 'Chờ duyệt',
      xacNhan: 'Xác nhận',
      hoanThanh: 'Hoàn thành',
      huy: 'Hủy',
    };
    return labelMap[status];
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedLichHen) {
      const rating = getRatingsByLichHenId(selectedLichHen.id);
      setSelectedRating(rating || null);
      setRatingValue(rating?.soSao || 0);
      setRatingComment(rating?.binhLuan || '');
      setReplyText(rating?.phanHoi || '');
    } else {
      setSelectedRating(null);
      setRatingValue(0);
      setRatingComment('');
      setReplyText('');
    }
  }, [selectedLichHen]);

  const handleViewDetail = (record: LichHen) => {
    setSelectedLichHen(record);
    // Check for conflicts
    const [gioVao, gioRa] = record.gio.split('-').map((t) => t.trim());
    const conflicts = checkScheduleConflict(
      record.ngay,
      gioVao,
      gioRa,
      record.nhanVienId,
      record.id,
    );
    setConflictWarning(conflicts);
    setDetailModalVisible(true);
  };

  const handleEdit = (record: LichHen) => {
    setEditingLichHen(record);
    form.setFieldsValue({
      khachHang: record.khachHang,
      ngay: dayjs(record.ngay),
      gio: record.gio,
      nhanVienId: record.nhanVienId,
      dichVuId: record.dichVuId,
      trangThai: record.trangThai,
      ghiChu: record.ghiChu,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Xóa lịch hẹn',
      content: 'Bạn có chắc chắn muốn xóa lịch hẹn này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk() {
        deleteLichHen(id);
        setLichHens(getLichHens());
        message.success('Xóa lịch hẹn thành công');
      },
    });
  };

  const handleStatusChange = (id: string, newStatus: LichHen['trangThai']) => {
    const lichHen = lichHens.find((lh) => lh.id === id);
    if (lichHen) {
      if (newStatus === 'xacNhan') {
        const [gioVao, gioRa] = lichHen.gio.split('-').map((t) => t.trim());
        const conflicts = checkScheduleConflict(
          lichHen.ngay,
          gioVao,
          gioRa,
          lichHen.nhanVienId,
          lichHen.id,
        );

        if (conflicts.length > 0) {
          Modal.error({
            title: 'Phát hiện lịch trùng',
            content: (
              <div>
                <p>
                  <strong style={{ color: '#ff4d4f' }}> Cảnh báo: Khung giờ này đã có lịch hẹn khác!</strong>
                </p>
                <div style={{ marginTop: '12px' }}>
                  <strong>Các lịch hẹn trùng:</strong>
                  {conflicts.map((c) => (
                    <div key={c.id} style={{ marginTop: '8px', padding: '8px', backgroundColor: '#fff2f0', borderRadius: '4px' }}>
                      <div> Khách: {c.khachHang}</div>
                      <div> Thời gian: {c.gio}</div>
                      <div> Ngày: {c.ngay}</div>
                      <div> Trạng thái: {getStatusLabel(c.trangThai)}</div>
                    </div>
                  ))}
                </div>
                <p style={{ marginTop: '12px', color: '#ff4d4f' }}>
                  Vui lòng kiểm tra lại trước khi xác nhận
                </p>
              </div>
            ),
          });
          return;
        }
      }

      updateLichHen(id, { trangThai: newStatus });
      setLichHens(getLichHens());

      const statusName = {
        choDuyet: 'chờ duyệt',
        xacNhan: 'xác nhận',
        hoanThanh: 'hoàn thành',
        huy: 'hủy',
      };

      message.success(`Cập nhật trạng thái thành "${statusName[newStatus]}" thành công`);
    }
  };

  const handleSubmitRating = () => {
    if (!selectedLichHen) return;
    if (ratingValue < 1) {
      message.error('Vui lòng chọn số sao (tối thiểu 1 sao)');
      return;
    }

    const newRating = addDanhGia({
      lichHenId: selectedLichHen.id,
      nhanVienId: selectedLichHen.nhanVienId,
      soSao: ratingValue,
      binhLuan: ratingComment,
    });

    setSelectedRating(newRating);
    setLichHens(getLichHens());
    message.success('Cảm ơn bạn đã đánh giá!');
  };

  const handleSubmitReply = () => {
    if (!selectedRating || !selectedLichHen) return;
    if (!replyText.trim()) {
      message.error('Vui lòng nhập phản hồi');
      return;
    }

    updateDanhGia(selectedRating.id, {
      phanHoi: replyText,
      ngayPhanHoi: dayjs().format('YYYY-MM-DD'),
    });

    const updated = getRatingsByLichHenId(selectedLichHen.id);
    setSelectedRating(updated || null);
    message.success('Phản hồi đã được gửi');
  };


  const handleOk = () => {
    form.validateFields().then((values) => {
      if (editingLichHen) {
        updateLichHen(editingLichHen.id, {
          khachHang: values.khachHang,
          ngay: values.ngay.format('YYYY-MM-DD'),
          gio: values.gio,
          nhanVienId: values.nhanVienId,
          dichVuId: values.dichVuId,
          trangThai: values.trangThai,
          ghiChu: values.ghiChu,
        });
        message.success('Cập nhật lịch hẹn thành công');
      }
      setLichHens(getLichHens());
      setIsModalVisible(false);
    });
  };

  const filteredLichHens = lichHens.filter((lh) => {
    let match = true;
    if (filterStatus) {
      match = match && lh.trangThai === filterStatus;
    }
    if (filterDate) {
      match = match && lh.ngay === filterDate;
    }
    return match;
  });

  const columns = [
    {
      title: 'Khách hàng',
      dataIndex: 'khachHang',
      key: 'khachHang',
      width: 120,
    },
    {
      title: 'Ngày',
      dataIndex: 'ngay',
      key: 'ngay',
      width: 100,
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Giờ',
      dataIndex: 'gio',
      key: 'gio',
      width: 100,
    },
    {
      title: 'Nhân viên',
      dataIndex: 'nhanVienId',
      key: 'nhanVienId',
      width: 120,
      render: (nhanVienId: string) => {
        const nhanVien = nhanViens.find((nv) => nv.id === nhanVienId);
        return nhanVien?.ten || 'N/A';
      },
    },
    {
      title: 'Dịch vụ',
      dataIndex: 'dichVuId',
      key: 'dichVuId',
      render: (dichVuId: string) => {
        const dichVu = dichVus.find((dv) => dv.id === dichVuId);
        return dichVu?.ten || 'N/A';
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 110,
      render: (status: LichHen['trangThai']) => (
        <Tag
          color={getStatusColor(status)}
          icon={
            status === 'hoanThanh' ? (
              <CheckCircleOutlined />
            ) : status === 'huy' ? (
              <CloseCircleOutlined />
            ) : null
          }
        >
          {getStatusLabel(status)}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 180,
      fixed: 'right' as const,
      render: (_: any, record: LichHen) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            Chi tiết
          </Button>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Xóa lịch hẹn"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="primary" danger size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Card title="Quản lý lịch hẹn" bordered={false}>
        <Row gutter={16} style={{ marginBottom: '20px' }}>
          <Col xs={24} sm={12} lg={6}>
            <Select
              placeholder="Lọc theo trạng thái"
              allowClear
              style={{ width: '100%' }}
              onChange={(value) => setFilterStatus(value)}
            >
              <Select.Option value="choDuyet">Chờ duyệt</Select.Option>
              <Select.Option value="xacNhan">Xác nhận</Select.Option>
              <Select.Option value="hoanThanh">Hoàn thành</Select.Option>
              <Select.Option value="huy">Hủy</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <DatePicker
              placeholder="Lọc theo ngày"
              format="DD/MM/YYYY"
              onChange={(date) => {
                if (date) {
                  setFilterDate(date.format('YYYY-MM-DD'));
                } else {
                  setFilterDate('');
                }
              }}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} lg={12} style={{ textAlign: 'right' }}>
            <Button
              type="primary"
              danger
              onClick={() => {
                setFilterStatus('');
                setFilterDate('');
              }}
            >
              Xóa bộ lọc
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredLichHens}
          rowKey="id"
          scroll={{ x: 1200 }}
          pagination={{ pageSize: 10 }}
        />
      </Card>
      <Modal
        title="Chi tiết lịch hẹn"
        visible={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        width={600}
        footer={null}
      >
        {selectedLichHen && (
          <div>
            {conflictWarning.length > 0 && (
              <Alert
                message="⚠️ Cảnh báo: Có lịch hẹn trùng lịch"
                type="warning"
                showIcon
                style={{ marginBottom: '16px' }}
              />
            )}

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div>
                  <strong>Khách hàng:</strong>
                </div>
                <div>{selectedLichHen.khachHang}</div>
              </Col>
              <Col span={12}>
                <div>
                  <strong>Ngày:</strong>
                </div>
                <div>{dayjs(selectedLichHen.ngay).format('DD/MM/YYYY')}</div>
              </Col>
              <Col span={12}>
                <div>
                  <strong>Giờ:</strong>
                </div>
                <div>{selectedLichHen.gio}</div>
              </Col>
              <Col span={12}>
                <div>
                  <strong>Trạng thái:</strong>
                </div>
                <div>
                  <Tag color={getStatusColor(selectedLichHen.trangThai)}>
                    {getStatusLabel(selectedLichHen.trangThai)}
                  </Tag>
                </div>
              </Col>
              <Col span={12}>
                <div>
                  <strong>Nhân viên:</strong>
                </div>
                <div>{getNhanVienById(selectedLichHen.nhanVienId)?.ten || 'N/A'}</div>
              </Col>
              <Col span={12}>
                <div>
                  <strong>Dịch vụ:</strong>
                </div>
                <div>{getDichVuById(selectedLichHen.dichVuId)?.ten || 'N/A'}</div>
              </Col>
              <Col span={24}>
                <div>
                  <strong>Giá:</strong>
                </div>
                <div style={{ fontSize: '16px', color: '#1890ff', fontWeight: 'bold' }}>
                  {getDichVuById(selectedLichHen.dichVuId)?.gia.toLocaleString('vi-VN')}₫
                </div>
              </Col>
              {selectedLichHen.ghiChu && (
                <Col span={24}>
                  <div>
                    <strong>Ghi chú:</strong>
                  </div>
                  <div style={{ backgroundColor: '#fafafa', padding: '8px', borderRadius: '4px' }}>
                    {selectedLichHen.ghiChu}
                  </div>
                </Col>
              )}
            </Row>

            {conflictWarning.length > 0 && (
              <>
                <Divider />
                <div style={{ backgroundColor: '#fff2f0', padding: '12px', borderRadius: '4px' }}>
                  <strong style={{ color: '#ff4d4f' }}>🔴 Các lịch hẹn trùng:</strong>
                  {conflictWarning.map((c) => (
                    <div key={c.id} style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #ffccc7' }}>
                      <div>Khách: <strong>{c.khachHang}</strong></div>
                      <div>Thời gian: {c.gio}</div>
                      <div>Trạng thái: <Tag color={getStatusColor(c.trangThai)}>{getStatusLabel(c.trangThai)}</Tag></div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {selectedLichHen?.trangThai === 'hoanThanh' && (
              <>
                <Divider />
                <div style={{ marginTop: 16 }}>
                  <h3>Đánh giá</h3>
                  {selectedRating ? (
                    <div style={{ backgroundColor: '#fafafa', padding: 12, borderRadius: 4 }}>
                      <Rate disabled value={selectedRating.soSao} />
                      <div style={{ marginTop: 8 }}>{selectedRating.binhLuan || 'Không có bình luận'}</div>
                      <div style={{ marginTop: 8, fontSize: 12, color: '#888' }}>
                        Ngày đánh giá: {selectedRating.ngay}
                      </div>
                      {selectedRating.phanHoi ? (
                        <div style={{ marginTop: 12, padding: 8, backgroundColor: '#fff', borderRadius: 4 }}>
                          <strong>Phản hồi:</strong>
                          <div>{selectedRating.phanHoi}</div>
                          <div style={{ marginTop: 4, fontSize: 12, color: '#888' }}>
                            Ngày phản hồi: {selectedRating.ngayPhanHoi}
                          </div>
                        </div>
                      ) : (
                        <div style={{ marginTop: 12 }}>
                          <Input.TextArea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            rows={3}
                            placeholder="Nhập phản hồi của nhân viên..."
                          />
                          <Button type="primary" onClick={handleSubmitReply} style={{ marginTop: 8 }}>
                            Phản hồi
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ backgroundColor: '#fafafa', padding: 12, borderRadius: 4 }}>
                      <Rate value={ratingValue} onChange={setRatingValue} />
                      <Input.TextArea
                        value={ratingComment}
                        onChange={(e) => setRatingComment(e.target.value)}
                        rows={3}
                        placeholder="Viết đánh giá (tùy chọn)..."
                        style={{ marginTop: 12 }}
                      />
                      <Button type="primary" onClick={handleSubmitRating} style={{ marginTop: 12 }}>
                        Gửi đánh giá
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}

            <Divider />
            <div style={{ textAlign: 'center' }}>
              <Space>
                {selectedLichHen.trangThai === 'choDuyet' && (
                  <>
                    <Button
                      type="primary"
                      onClick={() => {
                        handleStatusChange(selectedLichHen.id, 'xacNhan');
                        setDetailModalVisible(false);
                      }}
                    >
                      Xác nhận
                    </Button>
                    <Button
                      danger
                      onClick={() => {
                        handleStatusChange(selectedLichHen.id, 'huy');
                        setDetailModalVisible(false);
                      }}
                    >
                      Hủy
                    </Button>
                  </>
                )}
                {selectedLichHen.trangThai === 'xacNhan' && (
                  <Button
                    type="primary"
                    onClick={() => {
                      handleStatusChange(selectedLichHen.id, 'hoanThanh');
                      setDetailModalVisible(false);
                    }}
                  >
                    Hoàn thành
                  </Button>
                )}
              </Space>
            </div>
          </div>
        )}
      </Modal>
      <Modal
        title="Cập nhật lịch hẹn"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical" autoComplete="off">
          <Form.Item
            name="khachHang"
            label="Khách hàng"
            rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="ngay"
            label="Ngày"
            rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
          >
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="gio"
            label="Giờ"
            rules={[{ required: true, message: 'Vui lòng nhập giờ' }]}
          >
            <Input placeholder="VD: 09:00-09:30" />
          </Form.Item>
          <Form.Item
            name="nhanVienId"
            label="Nhân viên"
            rules={[{ required: true, message: 'Vui lòng chọn' }]}
          >
            <Select>
              {nhanViens.map((nv) => (
                <Select.Option key={nv.id} value={nv.id}>
                  {nv.ten}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="dichVuId"
            label="Dịch vụ"
            rules={[{ required: true, message: 'Vui lòng chọn' }]}
          >
            <Select>
              {dichVus.map((dv) => (
                <Select.Option key={dv.id} value={dv.id}>
                  {dv.ten}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="trangThai"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn' }]}
          >
            <Select>
              <Select.Option value="choDuyet">Chờ duyệt</Select.Option>
              <Select.Option value="xacNhan">Xác nhận</Select.Option>
              <Select.Option value="hoanThanh">Hoàn thành</Select.Option>
              <Select.Option value="huy">Hủy</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="ghiChu"
            label="Ghi chú"
          >
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuanLyLichHen;
