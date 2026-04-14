import {
    Table,
    Button,
    Modal,
    Popconfirm,
    Space,
    Input,
    Select,
    message,
} from 'antd';
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import FormCourse from './Form';
import { useState, useEffect } from 'react';

interface Course {
    id: number;
    name: string;
    instructor: string;
    studentCount: number;
    status: 'Đang mở' | 'Đã kết thúc' | 'Tạm dừng';
    description: string;
}

const INSTRUCTORS = ['Thầy A', 'Thầy B', 'Thầy C', 'Thầy D', 'Thầy E'];

const INITIAL_COURSES: Course[] = [
    { 
        id: 1, 
        name: 'Lập trình Web cơ bản', 
        instructor: 'Thầy A', 
        studentCount: 25, 
        status: 'Đang mở',
        description: '<p>Khóa học về lập trình web cơ bản</p>'
    },
    { 
        id: 2, 
        name: 'JavaScript nâng cao', 
        instructor: 'Thầy B', 
        studentCount: 15, 
        status: 'Đang mở',
        description: '<p>Khóa học JavaScript nâng cao</p>'
    },
    { 
        id: 3, 
        name: 'React từ không', 
        instructor: 'Thầy C', 
        studentCount: 0, 
        status: 'Tạm dừng',
        description: '<p>Khóa học React beginner</p>'
    },
    { 
        id: 4, 
        name: 'Node.js và Backend', 
        instructor: 'Thầy D', 
        studentCount: 30, 
        status: 'Đã kết thúc',
        description: '<p>Khóa học Backend với Node.js</p>'
    },
];

const QuanLyKhoaHoc: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>(() => {
        const saved = localStorage.getItem('courses');
        return saved ? JSON.parse(saved) : INITIAL_COURSES;
    });
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [editingCourse, setEditingCourse] = useState<Course | undefined>();
    const [searchText, setSearchText] = useState<string>('');
    const [filterInstructor, setFilterInstructor] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<string>('');
    const [sortType, setSortType] = useState<string>('');

    useEffect(() => {
        localStorage.setItem('courses', JSON.stringify(courses));
    }, [courses]);

    const addCourse = (course: Omit<Course, 'id'>) => {
        const newId = Math.max(...courses.map(c => c.id), 0) + 1;
        setCourses([...courses, { ...course, id: newId }]);
        setModalVisible(false);
        setEditingCourse(undefined);
    };

    const updateCourse = (course: Course) => {
        setCourses(courses.map(c => c.id === course.id ? course : c));
        setModalVisible(false);
        setEditingCourse(undefined);
    };

    const deleteCourse = (id: number) => {
        setCourses(courses.filter(c => c.id !== id));
    };

    const getFilteredCourses = () => {
        let result = courses;

        if (searchText) {
            result = result.filter(course =>
                course.name.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        if (filterInstructor) {
            result = result.filter(course => course.instructor === filterInstructor);
        }

        if (filterStatus) {
            result = result.filter(course => course.status === filterStatus);
        }

        if (sortType === 'asc') {
            result = [...result].sort((a, b) => a.studentCount - b.studentCount);
        } else if (sortType === 'desc') {
            result = [...result].sort((a, b) => b.studentCount - a.studentCount);
        }

        return result;
    };

    const getUniqueInstructors = () => {
        const instructors = new Set(courses.map(c => c.instructor));
        return Array.from(instructors).sort();
    };

    const getUniqueStatuses = () => {
        const statuses = new Set(courses.map(c => c.status));
        return Array.from(statuses);
    };

    const checkCourseNameDuplicate = (name: string, excludeId?: number): boolean => {
        return courses.some(c => 
            c.name.toLowerCase() === name.toLowerCase() && 
            c.id !== excludeId
        );
    };

    const handleDelete = (id: number) => {
        const course = courses.find(c => c.id === id);
        if (course && course.studentCount > 0) {
            message.error('Không thể xóa khóa học đã có học viên!');
            return;
        }
        deleteCourse(id);
        message.success('Xóa khóa học thành công!');
    };

    const columns = [
        {
            title: 'STT',
            key: 'stt',
            width: 60,
            render: (_: any, __: any, index: number) => index + 1,
        },
        {
            title: 'Tên khóa học',
            key: 'name',
            dataIndex: 'name',
            width: 200,
        },
        {
            title: 'Giảng viên',
            key: 'instructor',
            dataIndex: 'instructor',
            width: 120,
        },
        {
            title: 'Số lượng học viên',
            key: 'studentCount',
            dataIndex: 'studentCount',
            width: 150,
            sorter: (a: Course, b: Course) => a.studentCount - b.studentCount,
        },
        {
            title: 'Trạng thái',
            key: 'status',
            dataIndex: 'status',
            width: 120,
            render: (status: string) => {
                let color = '';
                if (status === 'Đang mở') color = 'green';
                if (status === 'Đã kết thúc') color = 'red';
                if (status === 'Tạm dừng') color = 'orange';
                return <span style={{ color }}>{status}</span>;
            },
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 150,
            render: (_: any, record: Course) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => {
                            setEditingCourse(record);
                            setModalVisible(true);
                        }}
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa khóa học này?"
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button 
                            type="primary" 
                            danger 
                            icon={<DeleteOutlined />}
                            disabled={record.studentCount > 0}
                        >
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        }
    ];

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '20px' }}>
                <h1>Quản lý Khóa học</h1>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <Input.Search
                    placeholder='Tìm kiếm theo tên khóa học...'
                    prefix={<SearchOutlined />}
                    style={{ width: 300 }}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    allowClear
                />

                <Select
                    placeholder='Lọc theo giảng viên'
                    style={{ width: 200 }}
                    allowClear
                    value={filterInstructor || undefined}
                    onChange={(value) => setFilterInstructor(value || '')}
                    options={getUniqueInstructors().map(i => ({ label: i, value: i }))}
                />

                <Select
                    placeholder='Lọc theo trạng thái'
                    style={{ width: 200 }}
                    allowClear
                    value={filterStatus || undefined}
                    onChange={(value) => setFilterStatus(value || '')}
                    options={getUniqueStatuses().map(s => ({ label: s, value: s }))}
                />

                <Select
                    placeholder='Sắp xếp theo số lượng'
                    style={{ width: 200 }}
                    allowClear
                    value={sortType || undefined}
                    onChange={(value) => setSortType(value || '')}
                    options={[
                        { label: 'Tăng dần', value: 'asc' },
                        { label: 'Giảm dần', value: 'desc' },
                    ]}
                />

                <Button
                    type='primary'
                    onClick={() => {
                        setEditingCourse(undefined);
                        setModalVisible(true);
                    }}
                >
                    + Thêm khóa học
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={getFilteredCourses()}
                rowKey='id'
                pagination={{
                    pageSize: 10,
                    showTotal: (total) => `Tổng cộng ${total} khóa học`,
                }}
                scroll={{ x: 1200 }}
            />

            <Modal
                title={editingCourse ? 'Cập nhật khóa học' : 'Thêm khóa học mới'}
                visible={modalVisible}
                footer={null}
                onCancel={() => {
                    setModalVisible(false);
                    setEditingCourse(undefined);
                }}
                destroyOnClose
            >
                <FormCourse 
                    editingCourse={editingCourse}
                    addCourse={addCourse}
                    updateCourse={updateCourse}
                    setModalVisible={setModalVisible}
                    checkCourseNameDuplicate={checkCourseNameDuplicate}
                />
            </Modal>
        </div>
    );
};

export default QuanLyKhoaHoc;
