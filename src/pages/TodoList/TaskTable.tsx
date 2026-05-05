import { Button, Space, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

interface TaskTableProps {
  tasks: TodoList.TodoItem[];
  onEdit: (task: TodoList.TodoItem) => void;
  onDelete: (task: TodoList.TodoItem) => void;
}

const priorityColors: Record<TodoList.TaskPriority, string> = {
  High: '#f5222d',
  Medium: '#fa8c16',
  Low: '#52c41a',
};

const statusLabels: Record<TodoList.TaskStatus, string> = {
  todo: 'Cần làm',
  inprogress: 'Đang làm',
  done: 'Hoàn thành',
};

const TaskTable: React.FC<TaskTableProps> = ({ tasks, onEdit, onDelete }) => {
  const columns: ColumnsType<TodoList.TodoItem> = [
    {
      title: 'Tên task',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: (value) => <span>{value || '-'}</span>,
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
      sorter: (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
    },
    {
      title: 'Ưu tiên',
      dataIndex: 'priority',
      key: 'priority',
      render: (value: TodoList.TaskPriority) => <Tag color={priorityColors[value]}>{value}</Tag>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (value: TodoList.TaskStatus) => <Tag>{statusLabels[value]}</Tag>,
    },
    {
      title: 'Tag',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string[]) => (
        <Space wrap>
          {tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} type='link' onClick={() => onEdit(record)}>
            Sửa
          </Button>
          <Button icon={<DeleteOutlined />} type='link' danger onClick={() => onDelete(record)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return <Table rowKey='id' columns={columns} dataSource={tasks} pagination={{ pageSize: 8 }} />;
};

export default TaskTable;
