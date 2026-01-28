import React, { useState } from 'react';
import { Tabs, Layout } from 'antd';
import {
    DashboardOutlined,
    ShoppingOutlined,
    ShoppingCartOutlined,
} from '@ant-design/icons';
import Dashboard from '@/components/Dashboard';
import QuanLySanPham from '@/pages/QuanLySanPham';
import QuanLyDonHang from '@/pages/QuanLyDonHang';

const { Header, Content, Footer } = Layout;

const TrangChu: React.FC = () => {
    const [activeTab, setActiveTab] = useState('dashboard');

    const items = [
        {
            key: 'dashboard',
            label: (
                <span>
                    <DashboardOutlined />
                    Dashboard
                </span>
            ),
            children: <Dashboard />,
        },
        {
            key: 'products',
            label: (
                <span>
                    <ShoppingOutlined />
                    Quản lý Sản phẩm
                </span>
            ),
            children: <QuanLySanPham />,
        },
        {
            key: 'orders',
            label: (
                <span>
                    <ShoppingCartOutlined />
                    Quản lý Đơn hàng
                </span>
            ),
            children: <QuanLyDonHang />,
        },
    ];

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
                    items={items}
                    type="card"
                    style={{
                        background: 'white',
                        borderRadius: '4px',
                    }}
                />
            </Content>

            <Footer style={{ textAlign: 'center', backgroundColor: '#f0f2f5' }}>
                Hệ thống Quản lý Đơn hàng & Sản phẩm © 2026. Tất cả quyền được bảo lưu.
            </Footer>
        </Layout>
    );
};

export default TrangChu;
