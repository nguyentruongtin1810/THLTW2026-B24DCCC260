import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, Badge, Spin } from 'antd';
import { ShoppingCartOutlined, InboxOutlined } from '@ant-design/icons';
import { getAllProducts } from '@/services/QuanLySanPham';
import { getAllOrders, calculateRevenue } from '@/services/QuanLyDonHang';
import type { Product } from '@/models/sanpham';
import type { Order } from '@/models/dontry';

const Dashboard: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [revenue, setRevenue] = useState(0);

    const loadData = async () => {
        setLoading(true);
        const productsData = await getAllProducts();
        const ordersData = await getAllOrders();
        const revenueData = await calculateRevenue();

        setProducts(productsData);
        setOrders(ordersData);
        setRevenue(revenueData);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const getTotalInventoryValue = () => {
        return products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    };

    const pendingOrdersCount = orders.filter(o => o.status === 'Chờ xử lý').length;
    const shippingOrdersCount = orders.filter(o => o.status === 'Đang giao').length;
    const completedOrdersCount = orders.filter(o => o.status === 'Hoàn thành').length;
    const cancelledOrdersCount = orders.filter(o => o.status === 'Đã hủy').length;

    const totalOrdersProcessed = pendingOrdersCount + shippingOrdersCount + completedOrdersCount + cancelledOrdersCount;

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', backgroundColor: '#f0f2f5' }}>
            <Card title="Dashboard Thống kê" style={{ marginBottom: 20 }}>
                <Row gutter={16} style={{ marginBottom: 20 }}>
                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <Statistic
                                title="Tổng số sản phẩm"
                                value={products.length}
                                prefix={<InboxOutlined />}
                                valueStyle={{ color: '#1890ff' }}
                            />
                        </Card>
                    </Col>

                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <Statistic
                                title="Giá trị tồn kho"
                                value={getTotalInventoryValue()}
                                prefix="₫"
                                formatter={(value) => (value as number).toLocaleString('vi-VN')}
                                valueStyle={{ color: '#52c41a' }}
                            />
                        </Card>
                    </Col>

                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <Statistic
                                title="Tổng số đơn hàng"
                                value={orders.length}
                                prefix={<ShoppingCartOutlined />}
                                valueStyle={{ color: '#faad14' }}
                            />
                        </Card>
                    </Col>

                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <Statistic
                                title="Doanh thu"
                                value={revenue}
                                prefix="₫"
                                formatter={(value) => (value as number).toLocaleString('vi-VN')}
                                valueStyle={{ color: '#f5222d' }}
                            />
                        </Card>
                    </Col>
                </Row>

                <Card title="Tình trạng đơn hàng" style={{ marginBottom: 20 }}>
                    <Row gutter={16}>
                        <Col xs={24} sm={12} md={6}>
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                <div style={{ fontSize: '24px', color: '#faad14', marginBottom: '10px' }}>
                                    {pendingOrdersCount}
                                </div>
                                <div style={{ fontSize: '14px', color: '#666' }}>Chờ xử lý</div>
                                <Badge count={pendingOrdersCount} style={{ backgroundColor: '#faad14' }} />
                            </div>
                        </Col>

                        <Col xs={24} sm={12} md={6}>
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                <div style={{ fontSize: '24px', color: '#1890ff', marginBottom: '10px' }}>
                                    {shippingOrdersCount}
                                </div>
                                <div style={{ fontSize: '14px', color: '#666' }}>Đang giao</div>
                                <Badge count={shippingOrdersCount} style={{ backgroundColor: '#1890ff' }} />
                            </div>
                        </Col>

                        <Col xs={24} sm={12} md={6}>
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                <div style={{ fontSize: '24px', color: '#52c41a', marginBottom: '10px' }}>
                                    {completedOrdersCount}
                                </div>
                                <div style={{ fontSize: '14px', color: '#666' }}>Hoàn thành</div>
                                <Badge count={completedOrdersCount} style={{ backgroundColor: '#52c41a' }} />
                            </div>
                        </Col>

                        <Col xs={24} sm={12} md={6}>
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                <div style={{ fontSize: '24px', color: '#f5222d', marginBottom: '10px' }}>
                                    {cancelledOrdersCount}
                                </div>
                                <div style={{ fontSize: '14px', color: '#666' }}>Đã hủy</div>
                                <Badge count={cancelledOrdersCount} style={{ backgroundColor: '#f5222d' }} />
                            </div>
                        </Col>
                    </Row>
                </Card>

                {totalOrdersProcessed > 0 && (
                    <Card title="Phân bố trạng thái đơn hàng">
                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <div style={{ marginBottom: 20 }}>
                                    <div>Chờ xử lý</div>
                                    <Progress
                                        percent={Math.round((pendingOrdersCount / totalOrdersProcessed) * 100)}
                                        strokeColor="#faad14"
                                    />
                                </div>

                                <div style={{ marginBottom: 20 }}>
                                    <div>Đang giao</div>
                                    <Progress
                                        percent={Math.round((shippingOrdersCount / totalOrdersProcessed) * 100)}
                                        strokeColor="#1890ff"
                                    />
                                </div>
                            </Col>

                            <Col xs={24} md={12}>
                                <div style={{ marginBottom: 20 }}>
                                    <div>Hoàn thành</div>
                                    <Progress
                                        percent={Math.round((completedOrdersCount / totalOrdersProcessed) * 100)}
                                        strokeColor="#52c41a"
                                    />
                                </div>

                                <div style={{ marginBottom: 20 }}>
                                    <div>Đã hủy</div>
                                    <Progress
                                        percent={Math.round((cancelledOrdersCount / totalOrdersProcessed) * 100)}
                                        strokeColor="#f5222d"
                                    />
                                </div>
                            </Col>
                        </Row>
                    </Card>
                )}
            </Card>
        </div>
    );
};

export default Dashboard;
