import { Button, Form, Input, InputNumber, Select, message } from 'antd';
import { useModel } from 'umi';
import { useEffect, useState } from 'react';
import { getCategories } from '@/services/QuanLySanPham';

const FormProduct = () => {
    const { editingProduct, addProduct, updateProduct, setModalVisible } = useModel('sanpham');
    const [form] = Form.useForm();
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        getCategories().then(setCategories);
    }, []);

    useEffect(() => {
        if (editingProduct) {
            form.setFieldsValue({
                name: editingProduct.name,
                category: editingProduct.category,
                price: editingProduct.price,
                quantity: editingProduct.quantity,
            });
        } else {
            form.resetFields();
        }
    }, [editingProduct, form]);  
    const handleSubmit = (values: any) => {
        try {
            if (editingProduct) {
                updateProduct({
                    id: editingProduct.id,
                    name: values.name,
                    category: values.category,
                    price: values.price,
                    quantity: values.quantity,
                });
                message.success('Chỉnh sửa sản phẩm thành công!');
            } else {
                addProduct({
                    name: values.name,
                    category: values.category,
                    price: values.price,
                    quantity: values.quantity,
                });
                message.success('Thêm sản phẩm thành công!');
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
                label='Tên sản phẩm'
                name='name'
                rules={[
                    { required: true, message: 'Vui lòng nhập tên sản phẩm!' },
                    { min: 3, message: 'Tên sản phẩm phải có ít nhất 3 ký tự!' },
                ]}
            >
                <Input placeholder='Nhập tên sản phẩm' />
            </Form.Item>

            <Form.Item
                label='Danh mục'
                name='category'
                rules={[
                    { required: true, message: 'Vui lòng chọn danh mục!' },
                ]}
            >
                <Select
                    placeholder='Chọn danh mục'
                    options={categories.map(cat => ({ label: cat, value: cat }))}
                />
            </Form.Item>

            <Form.Item
                label='Giá'
                name='price'
                rules={[
                    { required: true, message: 'Vui lòng nhập giá!' },
                    {
                        validator: (_, value) => {
                            if (value && value > 0) {
                                return Promise.resolve();  
                            }
                            return Promise.reject(new Error('Giá phải là số dương!'));
                        },
                    },
                ]}
            >
                <InputNumber
                    placeholder='Nhập giá'
                    min={0}
                    style={{ width: '100%' }}
                />
            </Form.Item>

            <Form.Item
                label='Số lượng'
                name='quantity'
                rules={[
                    { required: true, message: 'Vui lòng nhập số lượng!' },
                    {
                        validator: (_, value) => {
                            if (value && Number.isInteger(value) && value > 0) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('Số lượng phải là số nguyên dương!'));
                        },
                    },
                ]}
            >
                <InputNumber
                    placeholder='Nhập số lượng'
                    min={0}
                    step={1}
                    style={{ width: '100%' }}
                />
            </Form.Item>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <Button htmlType='submit' type='primary'>
                    {editingProduct ? 'Cập nhật' : 'Thêm mới'}
                </Button>
                <Button onClick={() => setModalVisible(false)}>Hủy</Button>
            </div>
        </Form>
    );
};
export default FormProduct;