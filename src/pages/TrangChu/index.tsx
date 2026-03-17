import React, { useState } from 'react';
import { Tabs, Layout } from 'antd';
import {
    DashboardOutlined,
    ShoppingOutlined,
    FileTextOutlined,
} from '@ant-design/icons';
import Dashboard from '@/components/Dashboard';
import QuanLySanPham from '@/pages/QuanLySanPham';
import QuanLyDonHang from '@/pages/QuanLyDonHang';

const { Header, Content, Footer } = Layout;

const TrangChu: React.FC = () => {
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header
                style={{
                    background: '#001529',
                    color: 'white',
                    padding: '0 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                    Hệ thống Quản lý Đơn hàng & Sản phẩm
                </div>
            </Header>

            <Content style={{ backgroundColor: '#f0f2f5', padding: '20px' }}>
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    type="card"
                    style={{
                        background: 'white',
                        borderRadius: '4px',
                    }}
                >
                    <Tabs.TabPane
                        tab={
                            <span>
                                <DashboardOutlined />
                                Dashboard
                            </span>
                        }
                        key="dashboard"
                    >
                        <Dashboard />
                    </Tabs.TabPane>
                    <Tabs.TabPane
                        tab={
                            <span>
                                <ShoppingOutlined />
                                Quản lý Sản phẩm
                            </span>
                        }
                        key="products"
                    >
                        <QuanLySanPham />
                    </Tabs.TabPane>
                    <Tabs.TabPane
                        tab={
                            <span>
                                <FileTextOutlined />
                                Quản lý Đơn hàng
                            </span>
                        }
                        key="orders"
                    >
                        <QuanLyDonHang />
                    </Tabs.TabPane>
                </Tabs>
            </Content>

            <Footer style={{ textAlign: 'center', backgroundColor: '#f0f2f5' }}>
                Hệ thống Quản lý Đơn hàng & Sản phẩm © 2026. Tất cả quyền được bảo lưu.
            </Footer>
        </Layout>
    );
};

export default TrangChu;
