import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Input, Select, message, Popconfirm, Space, Card, Tabs, Row, Col, InputNumber, List, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, PlayCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import {
  getListCauTrucDeThi,
  createCauTrucDeThi,
  updateCauTrucDeThi,
  deleteCauTrucDeThi,
  getListDeThi,
  deleteDeThi,
  generateDeThiFromCauTruc
} from '@/services/QuanLyDeThi';
import { getListMonHoc } from '@/services/MonHoc';
import { getListKhoiKienThuc } from '@/services/KhoiKienThuc';
import type { CauTrucDeThi, DeThi, YeuCauCauHoi } from '@/models/QuanLyDeThi';
import type { MonHoc } from '@/models/MonHoc';
import type { KhoiKienThuc } from '@/models/KhoiKienThuc';

const { Option } = Select;
const { TabPane } = Tabs;
const { Text } = Typography;

const QuanLyDeThiPage: React.FC = () => {
  // State for exam structures
  const [cauTrucData, setCauTrucData] = useState<CauTrucDeThi[]>([]);
  const [deThiData, setDeThiData] = useState<DeThi[]>([]);
  const [monHocList, setMonHocList] = useState<MonHoc[]>([]);
  const [khoiKienThucList, setKhoiKienThucList] = useState<KhoiKienThuc[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCauTrucModalVisible, setIsCauTrucModalVisible] = useState(false);
  const [isDeThiModalVisible, setIsDeThiModalVisible] = useState(false);
  const [editingCauTrucId, setEditingCauTrucId] = useState<string | null>(null);
  const [selectedCauTruc, setSelectedCauTruc] = useState<CauTrucDeThi | null>(null);
  const [cauTrucForm] = Form.useForm();
  const [deThiForm] = Form.useForm();
  const [yeuCauList, setYeuCauList] = useState<YeuCauCauHoi[]>([]);

  // Fetch data
  const fetchCauTrucData = async () => {
    setLoading(true);
    try {
      const response = await getListCauTrucDeThi();
      setCauTrucData(response.data.data || []);
    } catch (error) {
      message.error('Lỗi khi tải cấu trúc đề thi');
    } finally {
      setLoading(false);
    }
  };

  const fetchDeThiData = async () => {
    setLoading(true);
    try {
      const response = await getListDeThi();
      setDeThiData(response.data.data || []);
    } catch (error) {
      message.error('Lỗi khi tải đề thi');
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
    fetchCauTrucData();
    fetchDeThiData();
    fetchMonHoc();
    fetchKhoiKienThuc();
  }, []);

  // Handle exam structure operations
  const handleOpenCauTrucModal = (record?: CauTrucDeThi) => {
    if (record) {
      setEditingCauTrucId(record.id);
      cauTrucForm.setFieldsValue({
        tenCauTruc: record.tenCauTruc,
        monHoc: record.monHoc,
      });
      setYeuCauList([...record.yeuCauCauHoi]);
    } else {
      setEditingCauTrucId(null);
      cauTrucForm.resetFields();
      setYeuCauList([]);
    }
    setIsCauTrucModalVisible(true);
  };

  const handleSubmitCauTruc = async (values: any) => {
    try {
      const data = {
        ...values,
        yeuCauCauHoi: yeuCauList,
        tongSoCau: yeuCauList.reduce((sum, item) => sum + item.soLuong, 0),
      };

      if (editingCauTrucId) {
        await updateCauTrucDeThi(editingCauTrucId, data);
        message.success('Cập nhật cấu trúc đề thi thành công');
      } else {
        await createCauTrucDeThi({ ...data, id: `ct_${Date.now()}` });
        message.success('Thêm mới cấu trúc đề thi thành công');
      }
      setIsCauTrucModalVisible(false);
      cauTrucForm.resetFields();
      setYeuCauList([]);
      fetchCauTrucData();
    } catch (error) {
      message.error('Lỗi khi lưu cấu trúc đề thi');
    }
  };

  const handleDeleteCauTruc = async (id: string) => {
    try {
      await deleteCauTrucDeThi(id);
      message.success('Xóa cấu trúc đề thi thành công');
      fetchCauTrucData();
    } catch (error) {
      message.error('Lỗi khi xóa cấu trúc đề thi');
    }
  };

  // Handle exam generation
  const handleGenerateDeThi = async (cauTruc: CauTrucDeThi) => {
    setSelectedCauTruc(cauTruc);
    setIsDeThiModalVisible(true);
  };

  const handleSubmitDeThi = async (values: any) => {
    try {
      await generateDeThiFromCauTruc(selectedCauTruc!.id, values.tenDeThi);
      message.success('Tạo đề thi thành công');
      setIsDeThiModalVisible(false);
      deThiForm.resetFields();
      setSelectedCauTruc(null);
      fetchDeThiData();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Lỗi khi tạo đề thi');
    }
  };

  const handleDeleteDeThi = async (id: string) => {
    try {
      await deleteDeThi(id);
      message.success('Xóa đề thi thành công');
      fetchDeThiData();
    } catch (error) {
      message.error('Lỗi khi xóa đề thi');
    }
  };

  // Handle requirements list
  const addYeuCau = () => {
    setYeuCauList([...yeuCauList, { mucDoKho: 'Dễ', khoiKienThuc: '', soLuong: 1 }]);
  };

  const updateYeuCau = (index: number, field: string, value: any) => {
    const newList = [...yeuCauList];
    newList[index] = { ...newList[index], [field]: value };
    setYeuCauList(newList);
  };

  const removeYeuCau = (index: number) => {
    setYeuCauList(yeuCauList.filter((_, i) => i !== index));
  };

  const cauTrucColumns = [
    {
      title: 'Tên Cấu Trúc',
      dataIndex: 'tenCauTruc',
      key: 'tenCauTruc',
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
      title: 'Tổng Số Câu',
      dataIndex: 'tongSoCau',
      key: 'tongSoCau',
    },
    {
      title: 'Thao Tác',
      key: 'action',
      width: 200,
      render: (_: any, record: CauTrucDeThi) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleOpenCauTrucModal(record)}
          >
            Sửa
          </Button>
          <Button
            type="default"
            size="small"
            icon={<PlayCircleOutlined />}
            onClick={() => handleGenerateDeThi(record)}
          >
            Tạo Đề
          </Button>
          <Popconfirm
            title="Xác nhận xóa"
            onConfirm={() => handleDeleteCauTruc(record.id)}
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

  const deThiColumns = [
    {
      title: 'Tên Đề Thi',
      dataIndex: 'tenDeThi',
      key: 'tenDeThi',
    },
    {
      title: 'Cấu Trúc',
      dataIndex: 'cauTrucDeThi',
      key: 'cauTrucDeThi',
      render: (cauTrucId: string) => {
        const cauTruc = cauTrucData.find(c => c.id === cauTrucId);
        return cauTruc ? cauTruc.tenCauTruc : cauTrucId;
      },
    },
    {
      title: 'Tổng Số Câu',
      dataIndex: 'tongSoCau',
      key: 'tongSoCau',
    },
    {
      title: 'Ngày Tạo',
      dataIndex: 'ngayTao',
      key: 'ngayTao',
    },
    {
      title: 'Thao Tác',
      key: 'action',
      width: 150,
      render: (_: any, record: DeThi) => (
        <Space>
          <Button
            type="default"
            size="small"
            icon={<FileTextOutlined />}
            onClick={() => message.info('Chức năng xem chi tiết đề thi sẽ được triển khai')}
          >
            Xem
          </Button>
          <Popconfirm
            title="Xác nhận xóa"
            onConfirm={() => handleDeleteDeThi(record.id)}
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
      <Tabs defaultActiveKey="1">
        <TabPane tab="Cấu Trúc Đề Thi" key="1">
          <Card title="Quản Lý Cấu Trúc Đề Thi" extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenCauTrucModal()}>Thêm Mới</Button>}>
            <Table
              columns={cauTrucColumns}
              dataSource={cauTrucData}
              loading={loading}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>

        <TabPane tab="Đề Thi Đã Tạo" key="2">
          <Card title="Quản Lý Đề Thi">
            <Table
              columns={deThiColumns}
              dataSource={deThiData}
              loading={loading}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* Modal for exam structure */}
      <Modal
        title={editingCauTrucId ? 'Cập Nhật Cấu Trúc Đề Thi' : 'Thêm Mới Cấu Trúc Đề Thi'}
        visible={isCauTrucModalVisible}
        onOk={() => cauTrucForm.submit()}
        onCancel={() => {
          setIsCauTrucModalVisible(false);
          cauTrucForm.resetFields();
          setYeuCauList([]);
        }}
        width={800}
      >
        <Form form={cauTrucForm} onFinish={handleSubmitCauTruc} layout="vertical">
          <Form.Item
            label="Tên Cấu Trúc"
            name="tenCauTruc"
            rules={[{ required: true, message: 'Vui lòng nhập tên cấu trúc' }]}
          >
            <Input placeholder="Ví dụ: Đề thi giữa kỳ, Đề thi cuối kỳ..." />
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

          <div style={{ marginBottom: 16 }}>
            <Text strong>Yêu cầu câu hỏi:</Text>
            <Button type="dashed" onClick={addYeuCau} style={{ marginLeft: 16 }}>
              Thêm yêu cầu
            </Button>
          </div>

          <List
            dataSource={yeuCauList}
            renderItem={(item, index) => (
              <List.Item
                key={index}
                actions={[
                  <Button type="link" danger onClick={() => removeYeuCau(index)}>
                    Xóa
                  </Button>
                ]}
              >
                <Row gutter={16} style={{ width: '100%' }}>
                  <Col span={8}>
                    <Select
                      value={item.mucDoKho}
                      onChange={(value) => updateYeuCau(index, 'mucDoKho', value)}
                      style={{ width: '100%' }}
                    >
                      <Option value="Dễ">Dễ</Option>
                      <Option value="Trung bình">Trung bình</Option>
                      <Option value="Khó">Khó</Option>
                      <Option value="Rất khó">Rất khó</Option>
                    </Select>
                  </Col>
                  <Col span={10}>
                    <Select
                      value={item.khoiKienThuc}
                      onChange={(value) => updateYeuCau(index, 'khoiKienThuc', value)}
                      style={{ width: '100%' }}
                      placeholder="Chọn khối kiến thức"
                    >
                      {khoiKienThucList.map(khoiKienThuc => (
                        <Option key={khoiKienThuc.id} value={khoiKienThuc.id}>
                          {khoiKienThuc.ten}
                        </Option>
                      ))}
                    </Select>
                  </Col>
                  <Col span={6}>
                    <InputNumber
                      value={item.soLuong}
                      onChange={(value) => updateYeuCau(index, 'soLuong', value)}
                      min={1}
                      placeholder="Số lượng"
                      style={{ width: '100%' }}
                    />
                  </Col>
                </Row>
              </List.Item>
            )}
          />
        </Form>
      </Modal>

      {/* Modal for generating exam */}
      <Modal
        title="Tạo Đề Thi"
        visible={isDeThiModalVisible}
        onOk={() => deThiForm.submit()}
        onCancel={() => {
          setIsDeThiModalVisible(false);
          deThiForm.resetFields();
          setSelectedCauTruc(null);
        }}
      >
        <Form form={deThiForm} onFinish={handleSubmitDeThi} layout="vertical">
          {selectedCauTruc && (
            <div style={{ marginBottom: 16 }}>
              <Text strong>Cấu trúc: {selectedCauTruc.tenCauTruc}</Text>
              <br />
              <Text>Môn học: {monHocList.find(m => m.id === selectedCauTruc.monHoc)?.tenMon}</Text>
              <br />
              <Text>Tổng số câu: {selectedCauTruc.tongSoCau}</Text>
            </div>
          )}
          <Form.Item
            label="Tên Đề Thi"
            name="tenDeThi"
            rules={[{ required: true, message: 'Vui lòng nhập tên đề thi' }]}
          >
            <Input placeholder="Ví dụ: Đề thi số 1, Đề thi giữa kỳ..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuanLyDeThiPage;