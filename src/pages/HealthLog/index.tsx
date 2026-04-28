import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  InputNumber,
  DatePicker,
  Popconfirm,
  Space,
  Tag,
  message,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import { getHealthMetrics, saveHealthMetric, deleteHealthMetric } from '../../services/fitness';
import { HealthMetric } from '../../models/fitness';

const HealthLog: React.FC = () => {
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMetric, setEditingMetric] = useState<HealthMetric | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = () => {
    const data = getHealthMetrics();
    setMetrics(data);
  };

  const calculateBMI = (weight: number, height: number): number => {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  };

  const getBMICategory = (bmi: number): { label: string; color: string } => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'blue' };
    if (bmi < 25) return { label: 'Normal', color: 'green' };
    if (bmi < 30) return { label: 'Overweight', color: 'yellow' };
    return { label: 'Obese', color: 'red' };
  };

  const handleAdd = () => {
    setEditingMetric(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (metric: HealthMetric) => {
    setEditingMetric(metric);
    form.setFieldsValue({
      ...metric,
      date: moment(metric.date),
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    deleteHealthMetric(id);
    loadMetrics();
    message.success('Health metric deleted successfully');
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      const metric: HealthMetric = {
        id: editingMetric?.id || Date.now().toString(),
        ...values,
        date: values.date.format('YYYY-MM-DD'),
      };
      saveHealthMetric(metric);
      loadMetrics();
      setIsModalVisible(false);
      message.success(editingMetric ? 'Health metric updated successfully' : 'Health metric added successfully');
    });
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => moment(date).format('MMM DD, YYYY'),
      sorter: (a: HealthMetric, b: HealthMetric) => moment(a.date).diff(moment(b.date)),
    },
    {
      title: 'Weight (kg)',
      dataIndex: 'weight',
      key: 'weight',
    },
    {
      title: 'Height (cm)',
      dataIndex: 'height',
      key: 'height',
    },
    {
      title: 'BMI',
      key: 'bmi',
      render: (_: any, record: HealthMetric) => {
        const bmi = calculateBMI(record.weight, record.height);
        const category = getBMICategory(bmi);
        return (
          <div>
            <span>{bmi.toFixed(1)}</span>
            <br />
            <Tag color={category.color}>{category.label}</Tag>
          </div>
        );
      },
    },
    {
      title: 'Resting Heart Rate (bpm)',
      dataIndex: 'restingHeartRate',
      key: 'restingHeartRate',
    },
    {
      title: 'Sleep Hours',
      dataIndex: 'sleepHours',
      key: 'sleepHours',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: HealthMetric) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Are you sure to delete this health metric?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add Health Metric
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={metrics}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingMetric ? 'Edit Health Metric' : 'Add Health Metric'}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="date" label="Date" rules={[{ required: true }]}>
            <DatePicker />
          </Form.Item>
          <Form.Item name="weight" label="Weight (kg)" rules={[{ required: true }]}>
            <InputNumber min={1} step={0.1} />
          </Form.Item>
          <Form.Item name="height" label="Height (cm)" rules={[{ required: true }]}>
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item name="restingHeartRate" label="Resting Heart Rate (bpm)" rules={[{ required: true }]}>
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item name="sleepHours" label="Sleep Hours" rules={[{ required: true }]}>
            <InputNumber min={0} max={24} step={0.5} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default HealthLog;