import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Input, Select, message, Popconfirm, Space, Card, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { getListCauHoi, createCauHoi, updateCauHoi, deleteCauHoi } from '@/services/CauHoi';
import { getListMonHoc } from '@/services/MonHoc';
import { getListKhoiKienThuc } from '@/services/KhoiKienThuc';
import type { CauHoi } from '@/models/CauHoi';
import type { MonHoc } from '@/models/MonHoc';
import type { KhoiKienThuc } from '@/models/KhoiKienThuc';

const { Option } = Select;
const { TextArea } = Input;

const CauHoiPage: React.FC = () => {
  const [data, setData] = useState<CauHoi[]>([]);
  const [monHocList, setMonHocList] = useState<MonHoc[]>([]);
  const [khoiKienThucList, setKhoiKienThucList] = useState<KhoiKienThuc[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();

  // Fetch data
  const fetchData = async (searchParams?: any) => {
    setLoading(true);
    try {
      const response = await getListCauHoi(searchParams);
      setData(response.data.data || []);
    } catch (error) {
      message.error('Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const fetchMonHoc = async () => {
    try {
      const response = await getListMonHoc();
      setMonHocList(response.data.data || []);
    } catch (error) {
      console.error('Lỗi khi tải môn học');
    }
  };

  const fetchKhoiKienThuc = async () => {
    try {
      const response = await getListKhoiKienThuc();
      setKhoiKienThucList(response.data.data || []);
    } catch (error) {
      console.error('Lỗi khi tải khối kiến thức');
    }
  };

  useEffect(() => {
    fetchData();
    fetchMonHoc();
    fetchKhoiKienThuc();
  }, []);

  // Handle search
  const handleSearch = (values: any) => {
    fetchData(values);
  };

  // Handle reset search
  const handleResetSearch = () => {
    searchForm.resetFields();
    fetchData();
  };

  // Handle open modal
  const handleOpenModal = (record?: CauHoi) => {
    if (record) {
      setEditingId(record.id);
      form.setFieldsValue({
        maCauHoi: record.maCauHoi,
        monHoc: record.monHoc,
        noiDung: record.noiDung,
        mucDoKho: record.mucDoKho,
        khoiKienThuc: record.khoiKienThuc,
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
        await updateCauHoi(editingId, values);
        message.success('Cập nhật thành công');
      } else {
        await createCauHoi({ ...values, id: `ch_${Date.now()}` });
        message.success('Thêm mới thành công');
      }
      setIsModalVisible(false);
      form.resetFields();
      fetchData(searchForm.getFieldsValue());
    } catch (error) {
      message.error('Lỗi khi lưu dữ liệu');
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      await deleteCauHoi(id);
      message.success('Xóa thành công');
      fetchData(searchForm.getFieldsValue());
    } catch (error) {
      message.error('Lỗi khi xóa dữ liệu');
    }
  };

  const columns = [
    {
      title: 'Mã Câu Hỏi',
      dataIndex: 'maCauHoi',
      key: 'maCauHoi',
    },
    {
      title: 'Môn Học',
      dataIndex: 'monHoc',
      key: 'monHoc',
      render: (monHocId: string) => {
        const monHoc = monHocList.find(m => m.id === monHocId);
        return monHoc ? monHoc.tenMon : monHocId;
      },
    },
    {
      title: 'Nội Dung',
      dataIndex: 'noiDung',
      key: 'noiDung',
      ellipsis: true,
    },
    {
      title: 'Mức Độ Khó',
      dataIndex: 'mucDoKho',
      key: 'mucDoKho',
    },
    {
      title: 'Khối Kiến Thức',
      dataIndex: 'khoiKienThuc',
      key: 'khoiKienThuc',
      render: (khoiKienThucId: string) => {
        const khoiKienThuc = khoiKienThucList.find(k => k.id === khoiKienThucId);
        return khoiKienThuc ? khoiKienThuc.ten : khoiKienThucId;
      },
    },
    {
      title: 'Thao Tác',
      key: 'action',
      width: 150,
      render: (_: any, record: CauHoi) => (
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
    <div>
      <Card title="Tìm Kiếm Câu Hỏi" style={{ marginBottom: 16 }}>
        <Form form={searchForm} onFinish={handleSearch} layout="vertical">
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item label="Môn Học" name="monHoc">
                <Select placeholder="Chọn môn học" allowClear>
                  {monHocList.map(monHoc => (
                    <Option key={monHoc.id} value={monHoc.id}>
                      {monHoc.tenMon}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Mức Độ Khó" name="mucDoKho">
                <Select placeholder="Chọn mức độ khó" allowClear>
                  <Option value="Dễ">Dễ</Option>
                  <Option value="Trung bình">Trung bình</Option>
                  <Option value="Khó">Khó</Option>
                  <Option value="Rất khó">Rất khó</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Khối Kiến Thức" name="khoiKienThuc">
                <Select placeholder="Chọn khối kiến thức" allowClear>
                  {khoiKienThucList.map(khoiKienThuc => (
                    <Option key={khoiKienThuc.id} value={khoiKienThuc.id}>
                      {khoiKienThuc.ten}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label=" ">
                <Space>
                  <Button type="primary" icon={<SearchOutlined />} htmlType="submit">
                    Tìm Kiếm
                  </Button>
                  <Button onClick={handleResetSearch}>
                    Đặt Lại
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card title="Quản Lý Câu Hỏi" extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>Thêm Mới</Button>}>
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />

        <Modal
          title={editingId ? 'Cập Nhật Câu Hỏi' : 'Thêm Mới Câu Hỏi'}
          visible={isModalVisible}
          onOk={() => form.submit()}
          onCancel={() => {
            setIsModalVisible(false);
            form.resetFields();
          }}
          width={800}
        >
          <Form form={form} onFinish={handleSubmit} layout="vertical">
            <Form.Item
              label="Mã Câu Hỏi"
              name="maCauHoi"
              rules={[{ required: true, message: 'Vui lòng nhập mã câu hỏi' }]}
            >
              <Input placeholder="Ví dụ: CH001, Q001..." />
            </Form.Item>
            <Form.Item
              label="Môn Học"
              name="monHoc"
              rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}
            >
              <Select placeholder="Chọn môn học">
                {monHocList.map(monHoc => (
                  <Option key={monHoc.id} value={monHoc.id}>
                    {monHoc.tenMon} ({monHoc.maMon})
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Nội Dung Câu Hỏi"
              name="noiDung"
              rules={[{ required: true, message: 'Vui lòng nhập nội dung câu hỏi' }]}
            >
              <TextArea placeholder="Nhập nội dung câu hỏi" rows={6} />
            </Form.Item>
            <Form.Item
              label="Mức Độ Khó"
              name="mucDoKho"
              rules={[{ required: true, message: 'Vui lòng chọn mức độ khó' }]}
            >
              <Select placeholder="Chọn mức độ khó">
                <Option value="Dễ">Dễ</Option>
                <Option value="Trung bình">Trung bình</Option>
                <Option value="Khó">Khó</Option>
                <Option value="Rất khó">Rất khó</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Khối Kiến Thức"
              name="khoiKienThuc"
              rules={[{ required: true, message: 'Vui lòng chọn khối kiến thức' }]}
            >
              <Select placeholder="Chọn khối kiến thức">
                {khoiKienThucList.map(khoiKienThuc => (
                  <Option key={khoiKienThuc.id} value={khoiKienThuc.id}>
                    {khoiKienThuc.ten}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default CauHoiPage;