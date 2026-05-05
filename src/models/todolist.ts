import { useState } from 'react';

const STORAGE_KEY = 'todolist';

const getRandomInt = (min: number, max: number) => {
	const minTemp = Math.ceil(min);
	const maxTemp = Math.floor(max);
	return Math.floor(Math.random() * (maxTemp - minTemp + 1)) + minTemp;
};

const defaultColors = ['#7498d8', '#f1d9a4', '#67c759', '#f29092'];

const normalizeTasks = (items: any[]): TodoList.TodoItem[] =>
	items.map((item) => ({
		id: item.id || `task-${item.content || item.name || Date.now()}`,
		name: item.name || item.content || 'Task mới',
		description: item.description || '',
		deadline: item.deadline || new Date().toISOString().slice(0, 10),
		priority: item.priority || 'Medium',
		tags: item.tags || [],
		status: item.status || 'todo',
		color: item.color || defaultColors[getRandomInt(0, defaultColors.length - 1)],
	}));

export default () => {
	const [data, setData] = useState<TodoList.TodoItem[]>([]);
	const [todoItem, setTodoItem] = useState<TodoList.TodoItem>();
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [visible, setVisible] = useState<boolean>(false);

	const saveTasks = (items: TodoList.TodoItem[]) => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
		setData(items);
	};

	const getDataTodo = async () => {
		const raw = localStorage.getItem(STORAGE_KEY) || '[]';
		const parsed = JSON.parse(raw) as any[];
		const normalized = normalizeTasks(parsed);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
		setData(normalized);
	};

	const deleteTask = (id: string) => {
		saveTasks(data.filter((item) => item.id !== id));
	};

	return {
		data,
		setData,
		saveTasks,
		getDataTodo,
		deleteTask,
		todoItem,
		setTodoItem,
		isEdit,
		setIsEdit,
		visible,
		setVisible,
	};
};
