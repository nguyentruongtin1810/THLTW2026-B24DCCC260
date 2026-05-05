import { Button, Col, Input, Modal, Row, Select, Space, Tabs } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useModel } from 'umi';
import DashboardPanel from './DashboardPanel';
import FormTodoList from './Form';
import KanbanBoard from './KanbanBoard';
import TaskTable from './TaskTable';

const { Search } = Input;

const statusOptions = [
	{ value: 'todo', label: 'Cần làm' },
	{ value: 'inprogress', label: 'Đang làm' },
	{ value: 'done', label: 'Hoàn thành' },
];

const TodoList: React.FC = () => {
	const {
		data,
		getDataTodo,
		saveTasks,
		deleteTask,
		todoItem,
		setTodoItem,
		isEdit,
		setIsEdit,
		visible,
		setVisible,
	} = useModel('todolist');

	const [activeKey, setActiveKey] = useState<string>('dashboard');
	const [searchText, setSearchText] = useState<string>('');
	const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

	useEffect(() => {
		getDataTodo();
	}, []);

	const totalTasks = data.length;
	const completedTasks = data.filter((task) => task.status === 'done').length;
	const overdueTasks = data.filter((task) => task.status !== 'done' && new Date(task.deadline) < new Date()).length;

	const filteredTasks = useMemo(() => {
		return data
			.filter((task) => task.name.toLowerCase().includes(searchText.trim().toLowerCase()))
			.filter((task) => (statusFilter ? task.status === statusFilter : true));
	}, [data, searchText, statusFilter]);

	const openNewTaskModal = () => {
		setIsEdit(false);
		setTodoItem(undefined);
		setVisible(true);
	};

	const handleEditTask = (task: TodoList.TodoItem) => {
		setTodoItem(task);
		setIsEdit(true);
		setVisible(true);
	};

	const handleStatusChange = (task: TodoList.TodoItem, status: TodoList.TaskStatus) => {
		saveTasks(data.map((item) => (item.id === task.id ? { ...item, status } : item)));
	};

	const handleDeleteTask = (task: TodoList.TodoItem) => {
		deleteTask(task.id);
	};

	return (
		<div>
			<Row align='middle' justify='space-between' style={{ marginBottom: 24 }}>
				<Col>
					<h1>Quản lý công việc</h1>
				</Col>
				<Col>
					<Space>
						<Select
							value={statusFilter}
							style={{ width: 180 }}
							placeholder='Lọc theo trạng thái'
							allowClear
							onChange={(value) => setStatusFilter(value)}
							options={statusOptions}
						/>
						<Search
							placeholder='Tìm theo tên task'
							allowClear
							onSearch={(value) => setSearchText(value)}
							style={{ width: 260 }}
						/>
						<Button type='primary' onClick={openNewTaskModal}>
							Thêm task
						</Button>
					</Space>
				</Col>
			</Row>

			<Tabs activeKey={activeKey} onChange={(key) => setActiveKey(key)}>
				<Tabs.TabPane key='dashboard' tab='Dashboard'>
					<DashboardPanel total={totalTasks} completed={completedTasks} overdue={overdueTasks} />
				</Tabs.TabPane>
				<Tabs.TabPane key='kanban' tab='Kanban'>
					<KanbanBoard tasks={filteredTasks} onStatusChange={handleStatusChange} onEdit={handleEditTask} onDelete={handleDeleteTask} />
				</Tabs.TabPane>
				<Tabs.TabPane key='list' tab='Danh sách task'>
					<TaskTable tasks={filteredTasks} onEdit={handleEditTask} onDelete={handleDeleteTask} />
				</Tabs.TabPane>
			</Tabs>

			<Modal destroyOnClose visible={visible} footer={null} onCancel={() => setVisible(false)} width={600}>
				<FormTodoList />
			</Modal>
		</div>
	);
};

export default TodoList;
