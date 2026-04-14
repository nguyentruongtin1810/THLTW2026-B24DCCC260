import { Button, Form, Input, InputNumber, Select, message } from 'antd';
import { useEffect } from 'react';

interface Course {
    id: number;
    name: string;
    instructor: string;
    studentCount: number;
    status: 'Đang mở' | 'Đã kết thúc' | 'Tạm dừng';
    description: string;
}

interface FormCourseProps {
    editingCourse: Course | undefined;
    addCourse: (course: Omit<Course, 'id'>) => void;
    updateCourse: (course: Course) => void;
    setModalVisible: (visible: boolean) => void;
    checkCourseNameDuplicate: (name: string, excludeId?: number) => boolean;
}

const FormCourse = (props: FormCourseProps) => {
    const { 
        editingCourse, 
        addCourse, 
        updateCourse, 
        setModalVisible,
        checkCourseNameDuplicate
    } = props;
    const [form] = Form.useForm();

    useEffect(() => {
        if (editingCourse) {
            form.setFieldsValue({
                name: editingCourse.name,
                instructor: editingCourse.instructor,
                studentCount: editingCourse.studentCount,
                status: editingCourse.status,
                description: editingCourse.description,
            });
        } else {
            form.resetFields();
        }
    }, [editingCourse, form]);

    const handleSubmit = (values: any) => {
        try {
            if (editingCourse) {
                const isDuplicate = checkCourseNameDuplicate(values.name, editingCourse.id);
                if (isDuplicate) {
                    message.error('Tên khóa học đã tồn tại!');
                    return;
                }
                updateCourse({
                    id: editingCourse.id,
                    name: values.name,
                    instructor: values.instructor,
                    studentCount: values.studentCount,
                    status: values.status,
                    description: values.description,
                });
                message.success('Cập nhật khóa học thành công!');
            } else {
                const isDuplicate = checkCourseNameDuplicate(values.name);
                if (isDuplicate) {
                    message.error('Tên khóa học đã tồn tại!');
                    return;
                }
                addCourse({
                    name: values.name,
                    instructor: values.instructor,
                    studentCount: values.studentCount,
                    status: values.status,
                    description: values.description,
                });
                message.success('Thêm khóa học thành công!');
            }
        } catch (error) {
            message.error('Có lỗi xảy ra!');
        }
    };

    return (
        <Form
            form={form}
            labelCol={{ span: 24 }}
            onFinish={handleSubmit}
        >
            <Form.Item
                label='Tên khóa học'
                name='name'
                rules={[
                    { required: true, message: 'Vui lòng nhập tên khóa học!' },
                    { max: 100, message: 'Tên khóa học tối đa 100 ký tự!' },
                    { min: 3, message: 'Tên khóa học phải có ít nhất 3 ký tự!' },
                ]}
            >
                <Input placeholder='Nhập tên khóa học' />
            </Form.Item>

            <Form.Item
                label='Giảng viên'
                name='instructor'
                rules={[
                    { required: true, message: 'Vui lòng chọn giảng viên!' },
                ]}
            >
                <Select
                    placeholder='Chọn giảng viên'
                    options={['Thầy A', 'Thầy B', 'Thầy C', 'Thầy D', 'Thầy E'].map(i => ({ 
                        label: i, 
                        value: i 
                    }))}
                />
            </Form.Item>

            <Form.Item
                label='Số lượng học viên'
                name='studentCount'
                rules={[
                    { required: true, message: 'Vui lòng nhập số lượng học viên!' },
                    {
                        validator: (_, value) => {
                            if (value && Number.isInteger(value) && value >= 0) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('Số lượng học viên phải là số nguyên không âm!'));
                        },
                    },
                ]}
            >
                <InputNumber
                    placeholder='Nhập số lượng học viên'
                    min={0}
                    step={1}
                    style={{ width: '100%' }}
                />
            </Form.Item>

            <Form.Item
                label='Trạng thái khóa học'
                name='status'
                rules={[
                    { required: true, message: 'Vui lòng chọn trạng thái!' },
                ]}
            >
                <Select
                    placeholder='Chọn trạng thái'
                    options={[
                        { label: 'Đang mở', value: 'Đang mở' },
                        { label: 'Đã kết thúc', value: 'Đã kết thúc' },
                        { label: 'Tạm dừng', value: 'Tạm dừng' },
                    ]}
                />
            </Form.Item>

            <Form.Item
                label='Mô tả khóa học'
                name='description'
                rules={[
                    { required: true, message: 'Vui lòng nhập mô tả khóa học!' },
                ]}
            >
                <Input.TextArea 
                    placeholder='Nhập mô tả khóa học (HTML)' 
                    rows={4}
                />
            </Form.Item>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <Button htmlType='submit' type='primary'>
                    {editingCourse ? 'Cập nhật' : 'Thêm mới'}
                </Button>
                <Button onClick={() => setModalVisible(false)}>Hủy</Button>
            </div>
        </Form>
    );
};

export default FormCourse;
