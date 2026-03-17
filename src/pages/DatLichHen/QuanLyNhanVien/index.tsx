import React, { useState } from 'react';
import { Button, Modal, Form, Input, InputNumber, message, Table, Row, Col, Space, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { NhanVien } from '@/models/datlichhen';
import { addNhanVien, updateNhanVien, deleteNhanVien, getNhanViens } from '@/services/datlichhen';

const QuanLyNhanVien: React.FC = () => {
  const [nhanViens, setNhanViens] = useState<NhanVien[]>(getNhanViens());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingNhanVien, setEditingNhanVien] = useState<NhanVien | null>(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditingNhanVien(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: NhanVien) => {
    setEditingNhanVien(record);
    const formData = {
      ten: record.ten,
      gioiHanKhachNgay: record.gioiHanKhachNgay,
      monday_batDau: record.lichLamViec.monday.batDau,
      monday_ketThuc: record.lichLamViec.monday.ketThuc,
      tuesday_batDau: record.lichLamViec.tuesday.batDau,
      tuesday_ketThuc: record.lichLamViec.tuesday.ketThuc,
      wednesday_batDau: record.lichLamViec.wednesday.batDau,
      wednesday_ketThuc: record.lichLamViec.wednesday.ketThuc,
      thursday_batDau: record.lichLamViec.thursday.batDau,
      thursday_ketThuc: record.lichLamViec.thursday.ketThuc,
      friday_batDau: record.lichLamViec.friday.batDau,
      friday_ketThuc: record.lichLamViec.friday.ketThuc,
      saturday_batDau: record.lichLamViec.saturday.batDau,
      saturday_ketThuc: record.lichLamViec.saturday.ketThuc,
    };
    form.setFieldsValue(formData);
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    deleteNhanVien(id);
    setNhanViens(getNhanViens());
    message.success('Xóa nhân viên thành công');
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      const transformedValues = {
        ten: values.ten,
        gioiHanKhachNgay: values.gioiHanKhachNgay,
        lichLamViec: {
          monday: { batDau: values.monday_batDau, ketThuc: values.monday_ketThuc },
          tuesday: { batDau: values.tuesday_batDau, ketThuc: values.tuesday_ketThuc },
          wednesday: { batDau: values.wednesday_batDau, ketThuc: values.wednesday_ketThuc },
          thursday: { batDau: values.thursday_batDau, ketThuc: values.thursday_ketThuc },
          friday: { batDau: values.friday_batDau, ketThuc: values.friday_ketThuc },
          saturday: { batDau: values.saturday_batDau, ketThuc: values.saturday_ketThuc },
        },
      };

      if (editingNhanVien) {
        updateNhanVien(editingNhanVien.id, transformedValues);
        message.success('Cập nhật nhân viên thành công');
      } else {
        addNhanVien(transformedValues);
        message.success('Thêm nhân viên thành công');
      }
      setNhanViens(getNhanViens());
      setIsModalVisible(false);
    });
  };

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'ten',
      key: 'ten',
    },
    {
      title: 'Giới hạn khách/ngày',
      dataIndex: 'gioiHanKhachNgay',
      key: 'gioiHanKhachNgay',
      align: 'center' as const,
    },
    {
      title: 'Lịch làm việc',
      key: 'lichLamViec',
      width: 280,
      render: (_: any, record: NhanVien) => (
        <div style={{ fontSize: '12px' }}>
          {Object.entries(record.lichLamViec).map(([day, time]) => (
            <div key={day}>
              {day === 'monday' && 'T2'}
              {day === 'tuesday' && 'T3'}
              {day === 'wednesday' && 'T4'}
              {day === 'thursday' && 'T5'}
              {day === 'friday' && 'T6'}
              {day === 'saturday' && 'T7'}: {time.batDau} - {time.ketThuc}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'center' as const,
      width: 120,
      render: (_: any, record: NhanVien) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Xóa nhân viên"
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
      <div style={{ marginBottom: '16px' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm nhân viên
        </Button>
      </div>
      <Table columns={columns} dataSource={nhanViens} rowKey="id" scroll={{ x: 1000 }} />
      <Modal
        title={editingNhanVien ? 'Sửa nhân viên' : 'Thêm nhân viên'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        width={700}
      >
        <Form form={form} layout="vertical" autoComplete="off">
          <Form.Item
            name="ten"
            label="Tên nhân viên"
            rules={[{ required: true, message: 'Vui lòng nhập tên nhân viên' }]}
          >
            <Input placeholder="Nhập tên nhân viên" />
          </Form.Item>
          <Form.Item
            name="gioiHanKhachNgay"
            label="Giới hạn khách hàng/ngày"
            rules={[{ required: true, message: 'Vui lòng nhập giới hạn' }]}
          >
            <InputNumber min={1} placeholder="VD: 8" />
          </Form.Item>

          
          <div style={{ border: '1px solid #d9d9d9', padding: '12px', borderRadius: '4px' }}>
            <h4>Lịch làm việc (HH:mm)</h4>
            {[
              { key: 'monday', name: 'Thứ 2' },
              { key: 'tuesday', name: 'Thứ 3' },
              { key: 'wednesday', name: 'Thứ 4' },
              { key: 'thursday', name: 'Thứ 5' },
              { key: 'friday', name: 'Thứ 6' },
              { key: 'saturday', name: 'Thứ 7' },
            ].map((day) => (
              <Row key={day.key} gutter={16} style={{ marginBottom: 12 }} align="middle">
                <Col span={4}>
                  <label style={{ fontWeight: 'bold' }}>{day.name}</label>
                </Col>
                <Col span={10}>
                  <Form.Item
                    name={`${day.key}_batDau`}
                    noStyle
                    rules={[{ required: true, message: 'Bắt buộc' }]}
                  >
                    <Input placeholder="08:00" />
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item
                    name={`${day.key}_ketThuc`}
                    noStyle
                    rules={[{ required: true, message: 'Bắt buộc' }]}
                  >
                    <Input placeholder="17:00" />
                  </Form.Item>
                </Col>
              </Row>
            ))}
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default QuanLyNhanVien;
