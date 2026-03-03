import React, { useState, useEffect, useMemo } from 'react';
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    InputNumber,
    Select,
    DatePicker,
    Tag,
    Space,
    Card,
    Row,
    Col,
    message,
    Popconfirm,
    Drawer,
    Divider,
    List,
} from 'antd';
import { DeleteOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import type { Order, OrderItem } from '@/models/dontry';
import type { Product } from '@/models/sanpham';
import {
    getAllOrders,
    createOrder,
    updateOrderStatus,
    deleteOrder,
    validateOrder,
} from '@/services/QuanLyDonHang';
import { getAllProducts } from '@/services/QuanLySanPham';
import dayjs from 'dayjs';

const QuanLyDonHang: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | undefined>();
    const [createForm] = Form.useForm();

    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState<Order['status'] | undefined>();
    const [dateRange, setDateRange] = useState<[string, string] | undefined>();

    const [sortBy, setSortBy] = useState<'createdDate' | 'totalAmount'>('createdDate');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const [selectedProducts, setSelectedProducts] = useState<Record<number, number>>({});

    const loadOrders = async () => {
        setLoading(true);
        const data = await getAllOrders();
        setOrders(data);
        setLoading(false);
    };

    const loadProducts = async () => {
        const data = await getAllProducts();
        setProducts(data);
    };

    useEffect(() => {
        loadOrders();
        loadProducts();
    }, []);

    const getStatusColor = (status: Order['status']) => {
        const colors: Record<Order['status'], string> = {
            'Chờ xử lý': 'orange',
            'Đang giao': 'blue',
            'Hoàn thành': 'green',
            'Đã hủy': 'red',
        };
        return colors[status];
    };

    const getStatusLabel = (status: Order['status']) => {
        const labels: Record<Order['status'], string> = {
            'Chờ xử lý': 'Chờ xử lý',
            'Đang giao': 'Đang giao',
            'Hoàn thành': 'Hoàn thành',
            'Đã hủy': 'Đã hủy',
        };
        return labels[status];
    };

    const filteredOrders = useMemo(() => {
        let result = [...orders];

        if (searchText) {
            result = result.filter(o =>
                o.id.toLowerCase().includes(searchText.toLowerCase()) ||
                o.customerName.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        if (statusFilter) {
            result = result.filter(o => o.status === statusFilter);
        }

        if (dateRange && dateRange[0] && dateRange[1]) {
            result = result.filter(o =>
                o.createdDate >= dateRange[0] && o.createdDate <= dateRange[1]
            );
        }

        return result;
    }, [orders, searchText, statusFilter, dateRange]);

    const sortedOrders = useMemo(() => {
        const result = [...filteredOrders];

        if (sortBy === 'createdDate') {
            result.sort((a, b) => {
                const dateA = new Date(a.createdDate).getTime();
                const dateB = new Date(b.createdDate).getTime();
                return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
            });
        } else if (sortBy === 'totalAmount') {
            result.sort((a, b) =>
                sortOrder === 'asc' ? a.totalAmount - b.totalAmount : b.totalAmount - a.totalAmount
            );
        }

        return result;
    }, [filteredOrders, sortBy, sortOrder]);

    const getTotalAmount = () => {
        let total = 0;
        Object.entries(selectedProducts).forEach(([productId, quantity]) => {
            const product = products.find(p => p.id === parseInt(productId));
            if (product) {
                total += product.price * quantity;
            }
        });
        return total;
    };

    const handleCreateOrder = async (values: any) => {
        if (Object.keys(selectedProducts).length === 0) {
            message.error('Vui lòng chọn ít nhất một sản phẩm');
            return;
        }

        const orderProducts: OrderItem[] = Object.entries(selectedProducts)
            .filter(([_, qty]) => qty > 0)
            .map(([productId, quantity]) => {
                const product = products.find(p => p.id === parseInt(productId))!;
                return {
                    productId: product.id,
                    productName: product.name,
                    quantity,
                    price: product.price,
                };
            });

        const newOrder: Omit<Order, 'id' | 'createdDate'> = {
            customerName: values.customerName,
            phone: values.phone,
            address: values.address,
            products: orderProducts,
            totalAmount: getTotalAmount(),
            status: 'Chờ xử lý',
        };

        const validation = await validateOrder(newOrder);
        if (!validation.valid) {
            validation.errors.forEach(err => message.error(err));
            return;
        }

        try {
            await createOrder(newOrder);
            message.success('Tạo đơn hàng thành công');
            setCreateModalVisible(false);
            setSelectedProducts({});
            createForm.resetFields();
            loadOrders();
        } catch (error) {
            message.error('Lỗi khi tạo đơn hàng');
        }
    };

    const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            message.success('Cập nhật trạng thái thành công');
            loadOrders();
            loadProducts();
        } catch (error) {
            message.error('Lỗi khi cập nhật trạng thái');
        }
    };

    const handleDelete = async (orderId: string) => {
        try {
            await deleteOrder(orderId);
            message.success('Xóa đơn hàng thành công');
            loadOrders();
        } catch (error) {
            message.error('Lỗi khi xóa đơn hàng');
        }
    };

    const handleViewDetail = (order: Order) => {
        setSelectedOrder(order);
        setDetailDrawerVisible(true);
    };

    const columns = [
        {
            title: 'Mã đơn hàng',
            dataIndex: 'id',
            key: 'id',
            width: 100,
        },
        {
            title: 'Tên khách hàng',
            dataIndex: 'customerName',
            key: 'customerName',
        },
        {
            title: 'Số sản phẩm',
            dataIndex: 'products',
            key: 'productCount',
            render: (items: OrderItem[]) => items.length,
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (amount: number) => `${amount.toLocaleString('vi-VN')} ₫`,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: Order['status'], record: Order) => (
                <Select
                    value={status}
                    onChange={(newStatus) => handleStatusChange(record.id, newStatus)}
                    style={{ width: 120 }}
                    options={[
                        { label: 'Chờ xử lý', value: 'Chờ xử lý' },
                        { label: 'Đang giao', value: 'Đang giao' },
                        { label: 'Hoàn thành', value: 'Hoàn thành' },
                        { label: 'Đã hủy', value: 'Đã hủy' },
                    ]}
                />
            ),
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdDate',
            key: 'createdDate',
            render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 150,
            render: (_: any, record: Order) => (
                <Space size="small">
                    <Button
                        type="primary"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDetail(record)}
                    />
                    <Popconfirm
                        title="Xóa đơn hàng"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button type="primary" danger size="small" icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <Card
                title="Quản lý Đơn hàng"
                extra={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setCreateModalVisible(true)}
                    >
                        Tạo đơn hàng
                    </Button>
                }
            >
                <Row gutter={16} style={{ marginBottom: 20 }}>
                    <Col xs={24} sm={12} md={6}>
                        <Input
                            placeholder="Tìm kiếm mã hoặc khách hàng"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Select
                            placeholder="Lọc theo trạng thái"
                            allowClear
                            value={statusFilter}
                            onChange={setStatusFilter}
                            options={[
                                { label: 'Chờ xử lý', value: 'Chờ xử lý' },
                                { label: 'Đang giao', value: 'Đang giao' },
                                { label: 'Hoàn thành', value: 'Hoàn thành' },
                                { label: 'Đã hủy', value: 'Đã hủy' },
                            ]}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Select
                            placeholder="Sắp xếp"
                            value={sortBy}
                            onChange={setSortBy}
                            options={[
                                { label: 'Ngày tạo', value: 'createdDate' },
                                { label: 'Tổng tiền', value: 'totalAmount' },
                            ]}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Select
                            placeholder="Thứ tự"
                            value={sortOrder}
                            onChange={setSortOrder}
                            options={[
                                { label: 'Mới nhất', value: 'desc' },
                                { label: 'Cũ nhất', value: 'asc' },
                            ]}
                        />
                    </Col>
                </Row>

                <Card style={{ marginBottom: 20 }}>
                    <label>Lọc theo ngày:</label>
                    <DatePicker.RangePicker
                        style={{ width: '100%' }}
                        onChange={(dates) => {
                            if (dates && dates[0] && dates[1]) {
                                setDateRange([
                                    dates[0].format('YYYY-MM-DD'),
                                    dates[1].format('YYYY-MM-DD'),
                                ]);
                            } else {
                                setDateRange(undefined);
                            }
                        }}
                    />
                </Card>

                <Table
                    columns={columns}
                    dataSource={sortedOrders}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 5 }}
                    scroll={{ x: true }}
                />
            </Card>

            <Modal
                title="Tạo đơn hàng mới"
                visible={createModalVisible}
                onCancel={() => {
                    setCreateModalVisible(false);
                    setSelectedProducts({});
                    createForm.resetFields();
                }}
                footer={null}
                width={800}
            >
                <Form form={createForm} layout="vertical" onFinish={handleCreateOrder}>
                    <Form.Item label="Chọn sản phẩm">
                        <Card>
                            {products.map(product => (
                                <div key={product.id} style={{ marginBottom: 16, padding: 12, border: '1px solid #ddd', borderRadius: 4 }}>
                                    <Row gutter={16} align="middle">
                                        <Col span={12}>
                                            <div>
                                                <strong>{product.name}</strong>
                                                <div>{product.category}</div>
                                                <div>Giá: {product.price.toLocaleString('vi-VN')} ₫</div>
                                                <div>Tồn kho: {product.quantity}</div>
                                            </div>
                                        </Col>
                                        <Col span={12}>
                                            <InputNumber
                                                min={0}
                                                max={product.quantity}
                                                value={selectedProducts[product.id] || 0}
                                                onChange={(value) => {
                                                    setSelectedProducts({
                                                        ...selectedProducts,
                                                        [product.id]: value || 0,
                                                    });
                                                }}
                                                placeholder="Số lượng"
                                            />
                                            <div style={{ marginTop: 8 }}>
                                                Thành tiền: {((selectedProducts[product.id] || 0) * product.price).toLocaleString('vi-VN')} ₫
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            ))}
                        </Card>
                    </Form.Item>

                    <Divider />

                    <Form.Item
                        name="customerName"
                        label="Tên khách hàng"
                        rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        label="Số điện thoại"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số điện thoại' },
                            {
                                pattern: /^(\d{10}|\d{11})$/,
                                message: 'Số điện thoại phải từ 10-11 số',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="address"
                        label="Địa chỉ"
                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                    >
                        <Input.TextArea rows={3} />
                    </Form.Item>

                    <Card>
                        <Row>
                            <Col span={12}>
                                <strong>Tổng tiền:</strong>
                            </Col>
                            <Col span={12} style={{ textAlign: 'right' }}>
                                <strong>{getTotalAmount().toLocaleString('vi-VN')} ₫</strong>
                            </Col>
                        </Row>
                    </Card>

                    <Form.Item style={{ marginTop: 20 }}>
                        <Button type="primary" htmlType="submit" block>
                            Tạo đơn hàng
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Drawer
                title="Chi tiết đơn hàng"
                placement="right"
                onClose={() => setDetailDrawerVisible(false)}
                visible={detailDrawerVisible}
                width={600}
            >
                {selectedOrder && (
                    <>
                        <Card title="Thông tin khách hàng" style={{ marginBottom: 20 }}>
                            <p><strong>Mã đơn hàng:</strong> {selectedOrder.id}</p>
                            <p><strong>Tên khách hàng:</strong> {selectedOrder.customerName}</p>
                            <p><strong>Số điện thoại:</strong> {selectedOrder.phone}</p>
                            <p><strong>Địa chỉ:</strong> {selectedOrder.address}</p>
                            <p><strong>Ngày tạo:</strong> {dayjs(selectedOrder.createdDate).format('DD/MM/YYYY')}</p>
                            <p>
                                <strong>Trạng thái:</strong>{' '}
                                <Tag color={getStatusColor(selectedOrder.status)}>
                                    {getStatusLabel(selectedOrder.status)}
                                </Tag>
                            </p>
                        </Card>

                        <Card title="Chi tiết sản phẩm">
                            <List
                                dataSource={selectedOrder.products}
                                renderItem={(item) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            title={item.productName}
                                            description={`Số lượng: ${item.quantity} | Giá: ${item.price.toLocaleString('vi-VN')} ₫`}
                                        />
                                        <div>{(item.quantity * item.price).toLocaleString('vi-VN')} ₫</div>
                                    </List.Item>
                                )}
                            />
                        </Card>

                        <Card style={{ marginTop: 20 }}>
                            <Row>
                                <Col span={12}>
                                    <strong>Tổng tiền:</strong>
                                </Col>
                                <Col span={12} style={{ textAlign: 'right' }}>
                                    <strong>{selectedOrder.totalAmount.toLocaleString('vi-VN')} ₫</strong>
                                </Col>
                            </Row>
                        </Card>
                    </>
                )}
            </Drawer>
        </div>
    );
};

export default QuanLyDonHang;
