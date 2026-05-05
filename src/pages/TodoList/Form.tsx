import { Button, DatePicker, Form, Input, Select } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';

const FormTodoList = () => {
	const { data, todoItem, isEdit, setVisible, getDataTodo } = useModel('todolist');
	const colors = ['#7498d8', '#f1d9a4', '#67c759', '#f29092'];

	const getRandomInt = (min: number, max: number) => {
		const minTemp = Math.ceil(min);
		const maxTemp = Math.floor(max);
		return Math.floor(Math.random() * (maxTemp - minTemp + 1)) + minTemp;
	};

	return (
		<Form
			labelCol={{ span: 24 }}
			layout='vertical'
			onFinish={(values) => {
				const payload: TodoList.TodoItem = {
					id: todoItem?.id || `task-${Date.now()}`,
					name: values.name,
					description: values.description || '',
					deadline: values.deadline.format('YYYY-MM-DD'),
					priority: values.priority,
					tags: values.tags || [],
					status: todoItem?.status || 'todo',
					color: todoItem?.color || colors[getRandomInt(0, colors.length - 1)],
				};
				const index = data.findIndex((item) => item.id === todoItem?.id);
				const dataTemp = [...data];
				if (isEdit && index >= 0) {
					dataTemp.splice(index, 1, payload);
				}
				const dataLocal = isEdit ? dataTemp : [payload, ...data];
				localStorage.setItem('todolist', JSON.stringify(dataLocal));
				setVisible(false);
				getDataTodo();
			}}
		>
			<Form.Item
				initialValue={todoItem?.name}
				label='Tên task'
				name='name'
				rules={[{ required: true, message: 'Vui lòng nhập tên task!' }]}
			>
				<Input />
			</Form.Item>
			<Form.Item
				initialValue={todoItem?.description}
				label='Mô tả'
				name='description'
			>
				<Input.TextArea rows={4} />
			</Form.Item>
			<Form.Item
				initialValue={todoItem?.deadline ? moment(todoItem.deadline) : undefined}
				label='Deadline'
				name='deadline'
				rules={[{ required: true, message: 'Vui lòng chọn deadline!' }]}
			>
				<DatePicker style={{ width: '100%' }} />
			</Form.Item>
			<Form.Item
				initialValue={todoItem?.priority || 'Medium'}
				label='Mức độ ưu tiên'
				name='priority'
				rules={[{ required: true, message: 'Vui lòng chọn mức độ ưu tiên!' }]}
			>
				<Select
					options={[
						{ value: 'High', label: 'Cao' },
						{ value: 'Medium', label: 'Trung bình' },
						{ value: 'Low', label: 'Thấp' },
					]}
				/>
			</Form.Item>
			<Form.Item
				initialValue={todoItem?.tags}
				label='Tag'
				name='tags'
			>
				<Select mode='tags' placeholder='Nhập tag và nhấn Enter' />
			</Form.Item>
			<div className='form-footer' style={{ display: 'flex', gap: 12 }}>
				<Button htmlType='submit' type='primary'>
					{isEdit ? 'Chỉnh sửa' : 'Thêm mới'}
				</Button>
				<Button onClick={() => setVisible(false)}>Hủy</Button>
			</div>
		</Form>
	);
};

export default FormTodoList;
