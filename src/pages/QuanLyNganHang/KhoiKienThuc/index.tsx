import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Input, message, Popconfirm, Space, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getListKhoiKienThuc, createKhoiKienThuc, updateKhoiKienThuc, deleteKhoiKienThuc } from '@/services/KhoiKienThuc';
import type { KhoiKienThuc } from '@/models/KhoiKienThuc';

const KhoiKienThucPage: React.FC = () => {
  const [data, setData] = useState<KhoiKienThuc[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getListKhoiKienThuc();
      setData(response.data.data || []);
    } catch (error) {
      message.error('Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();   
  }, []);

  // Handle open modal
  const handleOpenModal = (record?: KhoiKienThuc) => {
    if (record) {
      setEditingId(record.id);
      form.setFieldsValue({
        ten: record.ten,
        mota: record.mota,
      });
    } else {
      setEditingId(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  // Handle submit form
  const handleSubmit = async (values: any) => {
    try {
      if (editingId) {
        await updateKhoiKienThuc(editingId, values);
        message.success('Cập nhật thành công');
      } else {
        await createKhoiKienThuc({ ...values, id: `kkT_${Date.now()}` });
        message.success('Thêm mới thành công');
      }
      setIsModalVisible(false);
      form.resetFields();
      fetchData();
    } catch (error) {
      message.error('Lỗi khi lưu dữ liệu');
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      await deleteKhoiKienThuc(id);
      message.success('Xóa thành công');
      fetchData();
    } catch (error) {
      message.error('Lỗi khi xóa dữ liệu');
    }
  };

  const columns = [
    {
      title: 'Tên Khối Kiến Thức',
      dataIndex: 'ten',
      key: 'ten',
    },
    {
      title: 'Mô Tả',
      dataIndex: 'mota',
      key: 'mota',
    },
    {
      title: 'Thao Tác',
      key: 'action',
      width: 150,
      render: (_: any, record: KhoiKienThuc) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleOpenModal(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="primary" danger size="small" icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Quản Lý Khối Kiến Thức" extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>Thêm Mới</Button>}>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingId ? 'Cập Nhật Khối Kiến Thức' : 'Thêm Mới Khối Kiến Thức'}
        visible={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            label="Tên Khối Kiến Thức"
            name="ten"
            rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
          >
            <Input placeholder="Ví dụ: Tổng quan, Chuyên sâu..." />
          </Form.Item>
          <Form.Item label="Mô Tả" name="mota">
            <Input.TextArea placeholder="Nhập mô tả" rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default KhoiKienThucPage;
