import React, { useEffect, useState } from 'react';
import { Card, DatePicker, Table, Tabs, Row, Col, Statistic } from 'antd';
import moment from 'moment';
import type { Moment } from 'moment';
import {
  getAppointmentsCountByDay,
  getRevenueByService,
  getRevenueByNhanVien,
} from '@/services/datlichhen';

const { MonthPicker } = DatePicker;

const ThongKe: React.FC = () => {
  const [month, setMonth] = useState<Moment>(moment());
  const [appointmentsByDay, setAppointmentsByDay] = useState<{ date: string; count: number }[]>([]);
  const [revenueByService, setRevenueByService] = useState<{ id: string; ten: string; revenue: number; count: number }[]>([]);
  const [revenueByStaff, setRevenueByStaff] = useState<{ id: string; ten: string; revenue: number; count: number }[]>([]);

  useEffect(() => {
    const monthKey = month.format('YYYY-MM');
    setAppointmentsByDay(getAppointmentsCountByDay(monthKey));
    setRevenueByService(getRevenueByService(monthKey));
    setRevenueByStaff(getRevenueByNhanVien(monthKey));
  }, [month]);

  const totalAppointments = appointmentsByDay.reduce((acc, item) => acc + item.count, 0);
  const totalRevenue = revenueByService.reduce((acc, item) => acc + item.revenue, 0);

  const appointmentsColumns = [
    { title: 'Ngày', dataIndex: 'date', key: 'date', render: (date: string) => moment(date).format('DD/MM/YYYY') },
    { title: 'Số lượng lịch hẹn', dataIndex: 'count', key: 'count' },
  ];

  const revenueColumns = [
    { title: 'Tên', dataIndex: 'ten', key: 'ten' },
    { title: 'Số lượng', dataIndex: 'count', key: 'count' },
    {
      title: 'Doanh thu (VNĐ)',
      dataIndex: 'revenue',
      key: 'revenue',
      align: 'right' as const,
      render: (value: number) => value.toLocaleString('vi-VN'),
    },
  ];

  return (
    <Card title="Thống kê & báo cáo" bordered={false}>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={8}>
          <Statistic title="Tháng" value={month.format('MM/YYYY')} />
        </Col>
        <Col xs={24} lg={8}>
          <Statistic title="Tổng số lịch hẹn" value={totalAppointments} />
        </Col>
        <Col xs={24} lg={8}>
          <Statistic title="Doanh thu" value={totalRevenue} suffix="₫" />
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col>
          <MonthPicker
            value={month}
            onChange={(value) => {
              if (value) setMonth(value as Moment);
            }}
            format="MM/YYYY"
            placeholder="Chọn tháng"
          />
        </Col>
      </Row>

      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Số lượng lịch hẹn" key="1">
          <Table columns={appointmentsColumns} dataSource={appointmentsByDay} rowKey="date" pagination={false} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Doanh thu theo dịch vụ" key="2">
          <Table columns={revenueColumns} dataSource={revenueByService} rowKey="id" pagination={false} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Doanh thu theo nhân viên" key="3">
          <Table columns={revenueColumns} dataSource={revenueByStaff} rowKey="id" pagination={false} />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
};

export default ThongKe;
