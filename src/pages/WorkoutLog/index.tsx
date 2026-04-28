import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Popconfirm,
  Space,
  Tag,
  message,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import { getWorkouts, saveWorkout, deleteWorkout } from '../../services/fitness';
import { Workout } from '../../models/fitness';

const { Option } = Select;
const { RangePicker } = DatePicker;

const WorkoutLog: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState<Workout[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [dateRange, setDateRange] = useState<any>(null);

  useEffect(() => {
    loadWorkouts();
  }, []);

  useEffect(() => {
    filterWorkouts();
  }, [workouts, searchText, typeFilter, dateRange]);

  const loadWorkouts = () => {
    const data = getWorkouts();
    setWorkouts(data);
  };

  const filterWorkouts = () => {
    let filtered = workouts;

    if (searchText) {
      filtered = filtered.filter(w =>
        w.type.toLowerCase().includes(searchText.toLowerCase()) ||
        w.notes.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (typeFilter) {
      filtered = filtered.filter(w => w.type === typeFilter);
    }

    if (dateRange) {
      const [start, end] = dateRange;
      filtered = filtered.filter(w =>
        moment(w.date).isBetween(start, end, 'day', '[]')
      );
    }

    setFilteredWorkouts(filtered);
  };

  const handleAdd = () => {
    setEditingWorkout(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (workout: Workout) => {
    setEditingWorkout(workout);
    form.setFieldsValue({
      ...workout,
      date: moment(workout.date),
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    deleteWorkout(id);
    loadWorkouts();
    message.success('Workout deleted successfully');
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      const workout: Workout = {
        id: editingWorkout?.id || Date.now().toString(),
        ...values,
        date: values.date.format('YYYY-MM-DD'),
      };
      saveWorkout(workout);
      loadWorkouts();
      setIsModalVisible(false);
      message.success(editingWorkout ? 'Workout updated successfully' : 'Workout added successfully');
    });
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => moment(date).format('MMM DD, YYYY'),
      sorter: (a: Workout, b: Workout) => moment(a.date).diff(moment(b.date)),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: 'Duration (min)',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Calories',
      dataIndex: 'calories',
      key: 'calories',
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Completed' ? 'green' : 'red'}>{status}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Workout) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Are you sure to delete this workout?"
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
        <Input
          placeholder="Search by type or notes"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ width: 200 }}
        />
        <Select
          placeholder="Filter by type"
          value={typeFilter}
          onChange={setTypeFilter}
          style={{ width: 150 }}
          allowClear
        >
          <Option value="Cardio">Cardio</Option>
          <Option value="Strength">Strength</Option>
          <Option value="Yoga">Yoga</Option>
          <Option value="HIIT">HIIT</Option>
          <Option value="Other">Other</Option>
        </Select>
        <RangePicker
          value={dateRange}
          onChange={setDateRange}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add Workout
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={filteredWorkouts}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingWorkout ? 'Edit Workout' : 'Add Workout'}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="date" label="Date" rules={[{ required: true }]}>
            <DatePicker />
          </Form.Item>
          <Form.Item name="type" label="Type" rules={[{ required: true }]}>
            <Select>
              <Option value="Cardio">Cardio</Option>
              <Option value="Strength">Strength</Option>
              <Option value="Yoga">Yoga</Option>
              <Option value="HIIT">HIIT</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item name="duration" label="Duration (minutes)" rules={[{ required: true }]}>
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item name="calories" label="Calories" rules={[{ required: true }]}>
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item name="notes" label="Notes">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select>
              <Option value="Completed">Completed</Option>
              <Option value="Missed">Missed</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default WorkoutLog;