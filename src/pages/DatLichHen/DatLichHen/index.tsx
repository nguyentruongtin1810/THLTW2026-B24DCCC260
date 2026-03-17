import React, { useState, useEffect } from 'react';
import {
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Card,
  Row,
  Col,
  Alert,
  Divider,
  Empty,
} from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { NhanVien, DichVu, LichHen } from '@/models/datlichhen';
import {
  getNhanViens,
  getDichVus,
  addLichHen,
  getAvailableTimeSlots,
  checkScheduleConflict,
  hasCapacityOnDay,
} from '@/services/datlichhen';

const DatLichHen: React.FC = () => {
  const [form] = Form.useForm();
  const [nhanViens, setNhanViens] = useState<NhanVien[]>([]);
  const [dichVus, setDichVus] = useState<DichVu[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [selectedNhanVienId, setSelectedNhanVienId] = useState<string>('');
  const [selectedDichVuId, setSelectedDichVuId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const selectedDichVu = dichVus.find((dv) => dv.id === selectedDichVuId);

  useEffect(() => {
    setNhanViens(getNhanViens());
    setDichVus(getDichVus());
  }, []);

  const handleNhanVienChange = (value: string) => {
    setSelectedNhanVienId(value);
    setTimeSlots([]);
    form.setFieldsValue({ thoiGian: undefined });
    setHasError(false);
  };

  const handleDichVuChange = (value: string) => {
    setSelectedDichVuId(value);
    setTimeSlots([]);
    form.setFieldsValue({ thoiGian: undefined });
    setHasError(false);
  };

  const handleDateChange = (date: any) => {
    if (date) {
      const dateStr = date.format('YYYY-MM-DD');
      const dayOfWeek = date.toDate().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      
      setSelectedDate(dateStr);
      setHasError(false);

      if (!selectedNhanVienId || !selectedDichVuId) {
        setTimeSlots([]);
        return;
      }

      const nhanVien = nhanViens.find((nv) => nv.id === selectedNhanVienId);
      if (!nhanVien || !nhanVien.lichLamViec[dayOfWeek]) {
        setTimeSlots([]);
        setHasError(true);
        setErrorMessage('Nhân viên không làm việc vào ngày này');
        return;
      }


      if (!hasCapacityOnDay(dateStr, selectedNhanVienId)) {
        setTimeSlots([]);
        setHasError(true);
        setErrorMessage('Nhân viên đã hết chỗ trống trong ngày này');
        return;
      }

      const serviceDuration = selectedDichVu?.thoiGianThucHien || 30;
      const slots = getAvailableTimeSlots(dateStr, selectedNhanVienId, serviceDuration);
      setTimeSlots(slots);

      if (slots.length === 0) {
        setHasError(true);
        setErrorMessage('Không có khung giờ trống trong ngày này');
      } else {
        setHasError(false);
      }

      form.setFieldsValue({ thoiGian: undefined });
    } else {
      setSelectedDate('');
      setTimeSlots([]);
      setHasError(false);
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      if (!selectedDate || !values.thoiGian) {
        message.error('Vui lòng chọn ngày và khung giờ');
        setLoading(false);
        return;
      }

      const [gioVao, gioRa] = values.thoiGian.split('-').map((t: string) => t.trim());

     
      const conflicts = checkScheduleConflict(selectedDate, gioVao, gioRa, selectedNhanVienId);
      if (conflicts.length > 0) {
        message.error('Khung giờ này đã có lịch hẹn khác. Vui lòng chọn khung giờ khác');
        setLoading(false);
        return;
      }

      
      const newLichHen: Omit<LichHen, 'id'> = {
        khachHang: values.khachHang,
        ngay: selectedDate,
        gio: values.thoiGian,
        nhanVienId: selectedNhanVienId,
        dichVuId: selectedDichVuId,
        trangThai: 'choDuyet',
        ghiChu: values.ghiChu || '',
      };

      addLichHen(newLichHen);
      message.success('Đặt lịch hẹn thành công! Vui lòng chờ xác nhận từ nhân viên');
      form.resetFields();
      setTimeSlots([]);
      setSelectedNhanVienId('');
      setSelectedDichVuId('');
      setSelectedDate('');
      setHasError(false);
    } catch (error) {
      message.error('Có lỗi xảy ra. Vui lòng thử lại');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const disabledDate = (current: any) => {
    
    return current && current < dayjs().startOf('day');
  };

  return (
    <div style={{ padding: '20px' }}>
      <Card title="Đặt lịch hẹn cắt tóc" bordered={false}>
        <Row gutter={[32, 24]}>
          <Col xs={24} lg={14}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              autoComplete="off"
            >
              <Form.Item
                name="khachHang"
                label="Tên khách hàng"
                rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
              >
                <Input placeholder="VD: Nguyễn Văn A" />
              </Form.Item>

              <Form.Item
                name="nhanVienId"
                label="Chọn nhân viên"
                rules={[{ required: true, message: 'Vui lòng chọn nhân viên' }]}
              >
                <Select
                  placeholder="Chọn nhân viên phục vụ"
                  onChange={handleNhanVienChange}
                  optionLabelProp="label"
                >
                  {nhanViens.map((nv) => (
                    <Select.Option key={nv.id} value={nv.id} label={nv.ten}>
                      {nv.ten}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="dichVuId"
                label="Chọn dịch vụ"
                rules={[{ required: true, message: 'Vui lòng chọn dịch vụ' }]}
              >
                <Select
                  placeholder="Chọn dịch vụ"
                  onChange={handleDichVuChange}
                  optionLabelProp="label"
                >
                  {dichVus.map((dv) => (
                    <Select.Option key={dv.id} value={dv.id} label={dv.ten}>
                      <div>
                        <div>{dv.ten}</div>
                        <div style={{ fontSize: '12px', color: '#888' }}>
                          {dv.gia.toLocaleString('vi-VN')}₫ • {dv.thoiGianThucHien} phút
                        </div>
                      </div>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="ngay"
                label="Chọn ngày"
                rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
              >
                <DatePicker
                  format="DD/MM/YYYY"
                  disabledDate={disabledDate}
                  onChange={handleDateChange}
                  placeholder="Chọn ngày"
                  style={{ width: '100%' }}
                />
              </Form.Item>

              {hasError && errorMessage && (
                <Alert
                  message={errorMessage}
                  type="error"
                  showIcon
                  style={{ marginBottom: '16px' }}
                />
              )}

              {timeSlots.length > 0 && !hasError && (
                <Form.Item
                  name="thoiGian"
                  label="Chọn khung giờ"
                  rules={[{ required: true, message: 'Vui lòng chọn khung giờ' }]}
                >
                  <Select placeholder="Chọn khung giờ">
                    {timeSlots.map((slot) => (
                      <Select.Option key={slot} value={slot}>
                        {slot}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              )}

              <Form.Item
                name="ghiChu"
                label="Ghi chú (tùy chọn)"
              >
                <Input.TextArea
                  placeholder="VD: Xin cắt ngắn hơn, nhuộm màu đen..."
                  rows={3}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  size="large"
                  block
                  disabled={!selectedNhanVienId || !selectedDichVuId || !selectedDate || timeSlots.length === 0}
                >
                  Đặt lịch hẹn
                </Button>
              </Form.Item>
            </Form>
          </Col>

          <Col xs={24} lg={10}>
            <Card type="inner" title="Thông tin dịch vụ" style={{ marginBottom: '16px' }}>
              {selectedDichVu ? (
                <div>
                  <div style={{ marginBottom: '12px' }}>
                    <strong>Dịch vụ:</strong> {selectedDichVu.ten}
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <strong>Giá:</strong>{' '}
                    <span style={{ fontSize: '18px', color: '#1890ff' }}>
                      {selectedDichVu.gia.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                  <div>
                    <strong>Thời gian:</strong> {selectedDichVu.thoiGianThucHien} phút
                  </div>
                </div>
              ) : (
                <Empty description="Chọn dịch vụ để xem thông tin" />
              )}
            </Card>

            {selectedNhanVienId && (
              <Card type="inner" title="Nhân viên phục vụ">
                {nhanViens.map((nv) => {
                  if (nv.id !== selectedNhanVienId) return null;
                  return (
                    <div key={nv.id}>
                      <div style={{ marginBottom: '12px' }}>
                        <strong>{nv.ten}</strong>
                      </div>
                      <div style={{ marginBottom: '12px' }}>
                        <strong>Giới hạn khách/ngày:</strong> {nv.gioiHanKhachNgay}
                      </div>
                      <Divider style={{ margin: '12px 0' }} />
                      <div style={{ fontSize: '13px' }}>
                        <strong>Lịch làm việc:</strong>
                        {Object.entries(nv.lichLamViec).map(([day, time]) => (
                          <div key={day} style={{ marginTop: '4px' }}>
                            {day === 'monday' && 'T2'}
                            {day === 'tuesday' && 'T3'}
                            {day === 'wednesday' && 'T4'}
                            {day === 'thursday' && 'T5'}
                            {day === 'friday' && 'T6'}
                            {day === 'saturday' && 'T7'}: {time.batDau}
                            <ArrowRightOutlined style={{ margin: '0 4px' }} />
                            {time.ketThuc}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </Card>
            )}
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default DatLichHen;
