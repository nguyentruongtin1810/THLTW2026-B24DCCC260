import React, { useEffect, useState } from 'react';
import {
  Card,
  Button,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Popconfirm,
  Space,
  Tag,
  message,
  Row,
  Col,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getExercises, saveExercise, deleteExercise } from '../../services/fitness';
import { Exercise } from '../../models/fitness';

const { Option } = Select;
const { Meta } = Card;
const { TextArea } = Input;

const ExerciseLibrary: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [muscleFilter, setMuscleFilter] = useState<string>('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('');

  useEffect(() => {
    loadExercises();
  }, []);

  useEffect(() => {
    filterExercises();
  }, [exercises, searchText, muscleFilter, difficultyFilter]);

  const loadExercises = () => {
    const data = getExercises();
    setExercises(data);
  };

  const filterExercises = () => {
    let filtered = exercises;

    if (searchText) {
      filtered = filtered.filter(e =>
        e.name.toLowerCase().includes(searchText.toLowerCase()) ||
        e.description.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (muscleFilter) {
      filtered = filtered.filter(e => e.muscleGroup === muscleFilter);
    }

    if (difficultyFilter) {
      filtered = filtered.filter(e => e.difficulty === difficultyFilter);
    }

    setFilteredExercises(filtered);
  };

  const handleAdd = () => {
    setEditingExercise(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (exercise: Exercise) => {
    setEditingExercise(exercise);
    form.setFieldsValue(exercise);
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    deleteExercise(id);
    loadExercises();
    message.success('Exercise deleted successfully');
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      const exercise: Exercise = {
        id: editingExercise?.id || Date.now().toString(),
        ...values,
      };
      saveExercise(exercise);
      loadExercises();
      setIsModalVisible(false);
      message.success(editingExercise ? 'Exercise updated successfully' : 'Exercise added successfully');
    });
  };

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'Easy': return 'green';
      case 'Medium': return 'orange';
      case 'Hard': return 'red';
      default: return 'default';
    }
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search exercises"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ width: 200 }}
        />
        <Select
          placeholder="Filter by muscle group"
          value={muscleFilter}
          onChange={setMuscleFilter}
          style={{ width: 150 }}
          allowClear
        >
          <Option value="Chest">Chest</Option>
          <Option value="Back">Back</Option>
          <Option value="Legs">Legs</Option>
          <Option value="Shoulders">Shoulders</Option>
          <Option value="Arms">Arms</Option>
          <Option value="Core">Core</Option>
          <Option value="Full Body">Full Body</Option>
        </Select>
        <Select
          placeholder="Filter by difficulty"
          value={difficultyFilter}
          onChange={setDifficultyFilter}
          style={{ width: 150 }}
          allowClear
        >
          <Option value="Easy">Easy</Option>
          <Option value="Medium">Medium</Option>
          <Option value="Hard">Hard</Option>
        </Select>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add Exercise
        </Button>
      </Space>

      <Row gutter={16}>
        {filteredExercises.map(exercise => (
          <Col key={exercise.id} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              actions={[
                <Button icon={<EditOutlined />} onClick={() => handleEdit(exercise)} />,
                <Popconfirm
                  title="Are you sure to delete this exercise?"
                  onConfirm={() => handleDelete(exercise.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button icon={<DeleteOutlined />} danger />
                </Popconfirm>,
              ]}
              onClick={() => {
                Modal.info({
                  title: exercise.name,
                  content: (
                    <div>
                      <p><strong>Description:</strong> {exercise.description}</p>
                      <p><strong>Instructions:</strong></p>
                      <p>{exercise.instructions}</p>
                    </div>
                  ),
                  width: 600,
                });
              }}
            >
              <Meta
                title={exercise.name}
                description={
                  <div>
                    <p>Muscle: <Tag>{exercise.muscleGroup}</Tag></p>
                    <p>Difficulty: <Tag color={getDifficultyColor(exercise.difficulty)}>{exercise.difficulty}</Tag></p>
                    <p>Avg Calories/Hour: {exercise.avgCaloriesPerHour}</p>
                    <p>{exercise.description}</p>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title={editingExercise ? 'Edit Exercise' : 'Add Exercise'}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Exercise Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="muscleGroup" label="Muscle Group" rules={[{ required: true }]}>
            <Select>
              <Option value="Chest">Chest</Option>
              <Option value="Back">Back</Option>
              <Option value="Legs">Legs</Option>
              <Option value="Shoulders">Shoulders</Option>
              <Option value="Arms">Arms</Option>
              <Option value="Core">Core</Option>
              <Option value="Full Body">Full Body</Option>
            </Select>
          </Form.Item>
          <Form.Item name="difficulty" label="Difficulty" rules={[{ required: true }]}>
            <Select>
              <Option value="Easy">Easy</Option>
              <Option value="Medium">Medium</Option>
              <Option value="Hard">Hard</Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <TextArea rows={2} />
          </Form.Item>
          <Form.Item name="avgCaloriesPerHour" label="Avg Calories per Hour" rules={[{ required: true }]}>
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item name="instructions" label="Instructions" rules={[{ required: true }]}>
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ExerciseLibrary;