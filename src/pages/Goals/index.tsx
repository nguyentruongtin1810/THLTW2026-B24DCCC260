import React, { useEffect, useState } from 'react';
import {
  Card,
  Button,
  Drawer,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Popconfirm,
  Space,
  Progress,
  Tag,
  message,
  Segmented,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import { getGoals, saveGoal, deleteGoal } from '../../services/fitness';
import { Goal } from '../../models/fitness';

const { Option } = Select;
const { Meta } = Card;

const Goals: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [filteredGoals, setFilteredGoals] = useState<Goal[]>([]);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [form] = Form.useForm();
  const [statusFilter, setStatusFilter] = useState<string>('All');

  useEffect(() => {
    loadGoals();
  }, []);

  useEffect(() => {
    filterGoals();
  }, [goals, statusFilter]);

  const loadGoals = () => {
    const data = getGoals();
    setGoals(data);
  };

  const filterGoals = () => {
    if (statusFilter === 'All') {
      setFilteredGoals(goals);
    } else {
      setFilteredGoals(goals.filter(g => g.status === statusFilter));
    }
  };

  const handleAdd = () => {
    setEditingGoal(null);
    form.resetFields();
    setIsDrawerVisible(true);
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    form.setFieldsValue({
      ...goal,
      deadline: moment(goal.deadline),
    });
    setIsDrawerVisible(true);
  };

  const handleDelete = (id: string) => {
    deleteGoal(id);
    loadGoals();
    message.success('Goal deleted successfully');
  };

  const handleUpdateCurrentValue = (id: string, value: number) => {
    const goal = goals.find(g => g.id === id);
    if (goal) {
      const updatedGoal = { ...goal, currentValue: value };
      saveGoal(updatedGoal);
      loadGoals();
    }
  };

  const handleDrawerOk = () => {
    form.validateFields().then(values => {
      const goal: Goal = {
        id: editingGoal?.id || Date.now().toString(),
        ...values,
        deadline: values.deadline.format('YYYY-MM-DD'),
      };
      saveGoal(goal);
      loadGoals();
      setIsDrawerVisible(false);
      message.success(editingGoal ? 'Goal updated successfully' : 'Goal added successfully');
    });
  };

  const getProgressPercent = (goal: Goal): number => {
    if (goal.type === 'Weight Loss') {
      return Math.max(0, Math.min(100, ((goal.targetValue - goal.currentValue) / (goal.targetValue - (goal.currentValue + 5))) * 100));
    }
    return Math.min(100, (goal.currentValue / goal.targetValue) * 100);
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Achieved': return 'green';
      case 'In Progress': return 'blue';
      case 'Cancelled': return 'red';
      default: return 'default';
    }
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Segmented
          options={['All', 'In Progress', 'Achieved', 'Cancelled']}
          value={statusFilter}
          onChange={(value) => setStatusFilter(value as string)}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add Goal
        </Button>
      </Space>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {filteredGoals.map(goal => (
          <Card
            key={goal.id}
            actions={[
              <Button icon={<EditOutlined />} onClick={() => handleEdit(goal)} />,
              <Popconfirm
                title="Are you sure to delete this goal?"
                onConfirm={() => handleDelete(goal.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button icon={<DeleteOutlined />} danger />
              </Popconfirm>,
            ]}
          >
            <Meta
              title={goal.name}
              description={
                <div>
                  <p>Type: <Tag>{goal.type}</Tag></p>
                  <p>Target: {goal.targetValue} | Current: 
                    <InputNumber
                      size="small"
                      value={goal.currentValue}
                      onChange={(value) => handleUpdateCurrentValue(goal.id, value || 0)}
                      style={{ width: 80, marginLeft: 8 }}
                    />
                  </p>
                  <Progress percent={getProgressPercent(goal)} />
                  <p>Deadline: {moment(goal.deadline).format('MMM DD, YYYY')}</p>
                  <p>Status: <Tag color={getStatusColor(goal.status)}>{goal.status}</Tag></p>
                </div>
              }
            />
          </Card>
        ))}
      </div>

      <Drawer
        title={editingGoal ? 'Edit Goal' : 'Add Goal'}
        width={400}
        visible={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
        footer={
          <Space>
            <Button onClick={() => setIsDrawerVisible(false)}>Cancel</Button>
            <Button type="primary" onClick={handleDrawerOk}>
              {editingGoal ? 'Update' : 'Add'}
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Goal Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="type" label="Type" rules={[{ required: true }]}>
            <Select>
              <Option value="Weight Loss">Weight Loss</Option>
              <Option value="Muscle Gain">Muscle Gain</Option>
              <Option value="Endurance">Endurance</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item name="targetValue" label="Target Value" rules={[{ required: true }]}>
            <InputNumber />
          </Form.Item>
          <Form.Item name="currentValue" label="Current Value" rules={[{ required: true }]}>
            <InputNumber />
          </Form.Item>
          <Form.Item name="deadline" label="Deadline" rules={[{ required: true }]}>
            <DatePicker />
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select>
              <Option value="In Progress">In Progress</Option>
              <Option value="Achieved">Achieved</Option>
              <Option value="Cancelled">Cancelled</Option>
            </Select>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default Goals;