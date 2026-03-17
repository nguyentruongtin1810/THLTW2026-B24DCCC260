import React, { useState } from 'react';
import { Button, Modal, Form, Input, InputNumber, message, Table, Space, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { DichVu } from '@/models/datlichhen';
import { addDichVu, updateDichVu, deleteDichVu, getDichVus } from '@/services/datlichhen';

const QuanLyDichVu: React.FC = () => {
  const [dichVus, setDichVus] = useState<DichVu[]>(getDichVus());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDichVu, setEditingDichVu] = useState<DichVu | null>(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditingDichVu(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: DichVu) => {
    setEditingDichVu(record);
    form.setFieldsValue({
      ten: record.ten,
      gia: record.gia,
      thoiGianThucHien: record.thoiGianThucHien,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    deleteDichVu(id);
    setDichVus(getDichVus());
    message.success('Xóa dịch vụ thành công');
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (editingDichVu) {
        updateDichVu(editingDichVu.id, values);
        message.success('Cập nhật dịch vụ thành công');
      } else {
        addDichVu(values);
        message.success('Thêm dịch vụ thành công');
      }
      setDichVus(getDichVus());
      setIsModalVisible(false);
    });
  };

  const columns = [
    {
      title: 'Tên dịch vụ',
      dataIndex: 'ten',
      key: 'ten',
    },
    {
      title: 'Giá (VND)',
      dataIndex: 'gia',
      key: 'gia',
      align: 'right' as const,
      render: (value: number) => value.toLocaleString('vi-VN'),
    },
    {
      title: 'Thời gian (phút)',
      dataIndex: 'thoiGianThucHien',
      key: 'thoiGianThucHien',
      align: 'center' as const,
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'center' as const,
      width: 120,
      render: (_: any, record: DichVu) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Xóa dịch vụ"
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
          Thêm dịch vụ
        </Button>
      </div>
      <Table columns={columns} dataSource={dichVus} rowKey="id" />
      <Modal
        title={editingDichVu ? 'Sửa dịch vụ' : 'Thêm dịch vụ'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        width={500}
      >
        <Form form={form} layout="vertical" autoComplete="off">
          <Form.Item
            name="ten"
            label="Tên dịch vụ"
            rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ' }]}
          >
            <Input placeholder="VD: Cắt tóc nam" />
          </Form.Item>
          <Form.Item
            name="gia"
            label="Giá (VND)"
            rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
          >
            <InputNumber
              min={0}
              placeholder="VD: 50000"
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => parseInt(value?.replace(/\D/g, '') || '0', 10) as any}
            />
          </Form.Item>
          <Form.Item
            name="thoiGianThucHien"
            label="Thời gian thực hiện (phút)"
            rules={[{ required: true, message: 'Vui lòng nhập thời gian' }]}
          >
            <InputNumber min={5} placeholder="VD: 30" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuanLyDichVu;
