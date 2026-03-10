import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Input, InputNumber, message, Popconfirm, Space, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getListMonHoc, createMonHoc, updateMonHoc, deleteMonHoc } from '@/services/MonHoc';
import type { MonHoc } from '@/models/MonHoc';

const MonHocPage: React.FC = () => {
  const [data, setData] = useState<MonHoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getListMonHoc();
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
  const handleOpenModal = (record?: MonHoc) => {
    if (record) {
      setEditingId(record.id);
      form.setFieldsValue({
        maMon: record.maMon,
        tenMon: record.tenMon,
        soTinChi: record.soTinChi,
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
        await updateMonHoc(editingId, values);
        message.success('Cập nhật thành công');
      } else {
        await createMonHoc({ ...values, id: `mh_${Date.now()}` });
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
      await deleteMonHoc(id);
      message.success('Xóa thành công');
      fetchData();
    } catch (error) {
      message.error('Lỗi khi xóa dữ liệu');
    }
  };

  const columns = [
    {
      title: 'Mã Môn',
      dataIndex: 'maMon',
      key: 'maMon',
    },
    {
      title: 'Tên Môn',
      dataIndex: 'tenMon',
      key: 'tenMon',
    },
    {
      title: 'Số Tín Chỉ',
      dataIndex: 'soTinChi',
      key: 'soTinChi',
    },
    {
      title: 'Thao Tác',
      key: 'action',
      width: 150,
      render: (_: any, record: MonHoc) => (
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
    <Card title="Quản Lý Môn Học" extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>Thêm Mới</Button>}>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingId ? 'Cập Nhật Môn Học' : 'Thêm Mới Môn Học'}
        visible={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            label="Mã Môn"
            name="maMon"
            rules={[{ required: true, message: 'Vui lòng nhập mã môn' }]}
          >
            <Input placeholder="Ví dụ: IT001, MATH101..." />
          </Form.Item>
          <Form.Item
            label="Tên Môn"
            name="tenMon"
            rules={[{ required: true, message: 'Vui lòng nhập tên môn' }]}
          >
            <Input placeholder="Ví dụ: Tin học đại cương..." />
          </Form.Item>
          <Form.Item
            label="Số Tín Chỉ"
            name="soTinChi"
            rules={[{ required: true, message: 'Vui lòng nhập số tín chỉ' }]}
          >
            <InputNumber min={1} max={10} placeholder="Ví dụ: 3" style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default MonHocPage;