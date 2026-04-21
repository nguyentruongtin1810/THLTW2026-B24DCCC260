import React, { useMemo, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Rate,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Tabs,
  Typography,
} from 'antd';
import {
  CompassOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import type { DropResult } from 'react-beautiful-dnd';
import ColumnChart from '@/components/Chart/ColumnChart';
import DonutChart from '@/components/Chart/DonutChart';
import { tienVietNam } from '@/utils/utils';
import moment from 'moment';
import './index.less';

const { Option } = Select;
const { Text, Paragraph, Title } = Typography;

type TravelType = 'Biển' | 'Núi' | 'Thành phố';
type Region = 'Bắc' | 'Trung' | 'Nam';

interface Destination {
  id: string;
  title: string;
  type: TravelType;
  region: Region;
  price: number;
  rating: number;
  image: string;
  description: string;
  visitHours: number;
  travelHours: number;
  budget: {
    food: number;
    stay: number;
    transport: number;
    misc: number;
  };
}

interface ItineraryItem {
  id: string;
  destinationId: string;
  date: string;
  order: number;
  notes?: string;
}

interface BudgetLimits {
  food: number;
  stay: number;
  transport: number;
  misc: number;
}

const DESTINATIONS: Destination[] = [
  {
    id: 'dn1',
    title: 'Đà Nẵng',
    type: 'Biển',
    region: 'Trung',
    price: 1800000,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    description: 'Bãi biển Mỹ Khê, núi Ngũ Hành Sơn và ẩm thực miền Trung đặc sắc.',
    visitHours: 8,
    travelHours: 1.5,
    budget: {
      food: 500000,
      stay: 1000000,
      transport: 300000,
      misc: 200000,
    },
  },
  {
    id: 'hn1',
    title: 'Hà Nội',
    type: 'Thành phố',
    region: 'Bắc',
    price: 1400000,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    description: 'Thăm phố cổ, hồ Hoàn Kiếm và ẩm thực đường phố truyền thống.',
    visitHours: 6,
    travelHours: 1,
    budget: {
      food: 350000,
      stay: 700000,
      transport: 200000,
      misc: 150000,
    },
  },
  {
    id: 'sa1',
    title: 'Sa Pa',
    type: 'Núi',
    region: 'Bắc',
    price: 1200000,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80',
    description: 'Tham quan ruộng bậc thang, trekking và trải nghiệm bản làng.',
    visitHours: 7,
    travelHours: 3,
    budget: {
      food: 300000,
      stay: 600000,
      transport: 250000,
      misc: 200000,
    },
  },
  {
    id: 'ph1',
    title: 'Phú Quốc',
    type: 'Biển',
    region: 'Nam',
    price: 2200000,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1200&q=80',
    description: 'Hòn đảo ngọc với bãi sao, lặn biển và resort cao cấp.',
    visitHours: 10,
    travelHours: 2.5,
    budget: {
      food: 600000,
      stay: 1100000,
      transport: 400000,
      misc: 250000,
    },
  },
  {
    id: 'nt1',
    title: 'Nha Trang',
    type: 'Biển',
    region: 'Nam',
    price: 1600000,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    description: 'Biển đẹp, đảo yên bình và spa nghỉ dưỡng.',
    visitHours: 9,
    travelHours: 1.2,
    budget: {
      food: 450000,
      stay: 900000,
      transport: 250000,
      misc: 200000,
    },
  },
];
// TH06


const DEFAULT_BUDGET: BudgetLimits = {
  food: 1100000,
  stay: 1500000,
  transport: 700000,
  misc: 400000,
};

const sortOptions = [
  { label: 'Rating cao', value: 'rating' },
  { label: 'Giá tăng', value: 'priceAsc' },
  { label: 'Giá giảm', value: 'priceDesc' },
];

const priceFilters = [
  { label: 'Tất cả', value: 'all' },
  { label: '< 1.5 triệu', value: 'low' },
  { label: '1.5 - 2 triệu', value: 'medium' },
  { label: '> 2 triệu', value: 'high' },
];

const KeHoachDuLich: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>(DESTINATIONS);
  const [tourType, setTourType] = useState<string>('All');
  const [region, setRegion] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('rating');
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  const [budgetLimits, setBudgetLimits] = useState<BudgetLimits>(DEFAULT_BUDGET);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null);
  const [destinationForm] = Form.useForm();
  const [planForm] = Form.useForm();

  const filteredDestinations = useMemo(() => {
    return destinations.filter((item) => {
      const typeMatch = tourType === 'All' || item.type === tourType;
      const regionMatch = region === 'All' || item.region === region;
      const priceMatch =
        priceRange === 'all' ||
        (priceRange === 'low' && item.price < 1500000) ||
        (priceRange === 'medium' && item.price >= 1500000 && item.price <= 2000000) ||
        (priceRange === 'high' && item.price > 2000000);
      const ratingMatch =
        ratingFilter === 'all' ||
        (ratingFilter === '4.5' && item.rating >= 4.5) ||
        (ratingFilter === '4.7' && item.rating >= 4.7);
      return typeMatch && regionMatch && priceMatch && ratingMatch;
    });
  }, [destinations, tourType, region, priceRange, ratingFilter]);

  const sortedDestinations = useMemo(() => {
    return [...filteredDestinations].sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'priceAsc') return a.price - b.price;
      return b.price - a.price;
    });
  }, [filteredDestinations, sortBy]);

  const itineraryCosts = useMemo(() => {
    return itinerary.reduce(
      (acc, item) => {
        const destination = destinations.find((d) => d.id === item.destinationId);
        if (!destination) return acc;
        return {
          food: acc.food + destination.budget.food,
          stay: acc.stay + destination.budget.stay,
          transport: acc.transport + destination.budget.transport,
          misc: acc.misc + destination.budget.misc,
        };
      },
      { food: 0, stay: 0, transport: 0, misc: 0 },
    );
  }, [itinerary, destinations]);

  const totalItineraryCost = useMemo(() => {
    return itineraryCosts.food + itineraryCosts.stay + itineraryCosts.transport + itineraryCosts.misc;
  }, [itineraryCosts]);

  const totalTravelHours = useMemo(() => {
    return itinerary.reduce((sum, item) => {
      const destination = destinations.find((d) => d.id === item.destinationId);
      return sum + (destination?.travelHours || 0);
    }, 0);
  }, [itinerary, destinations]);

  const overBudget = totalItineraryCost >
    (budgetLimits.food + budgetLimits.stay + budgetLimits.transport + budgetLimits.misc);

  const monthlySummary = useMemo(() => {
    const months = Array.from({ length: 6 }, (_, idx) => ({
      name: moment().month(idx).format('MMM'),
      count: 0,
      revenue: 0,
    }));
    itinerary.forEach((item) => {
      const destination = destinations.find((d) => d.id === item.destinationId);
      if (destination) {
        const monthIndex = moment(item.date).month();
        if (monthIndex < 6) {
          months[monthIndex].count += 1;
          months[monthIndex].revenue += destination.price;
        }
      }
    });
    return months;
  }, [itinerary, destinations]);

  const destinationPopularity = useMemo(() => {
    const counts: Record<string, number> = {};
    itinerary.forEach((item) => {
      counts[item.destinationId] = (counts[item.destinationId] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([destinationId, count]) => ({
        title: destinations.find((d) => d.id === destinationId)?.title || 'Không xác định',
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }, [itinerary, destinations]);

  const openPlanModal = (destination: Destination) => {
    setSelectedDestination(destination);
    planForm.setFieldsValue({ date: moment().add(1, 'day'), notes: '' });
    setPlanModalOpen(true);
  };

  const handlePlanFinish = (values: any) => {
    if (!selectedDestination) return;
    const newItem: ItineraryItem = {
      id: `${selectedDestination.id}-${values.date.format('YYYYMMDD')}-${Date.now()}`,
      destinationId: selectedDestination.id,
      date: values.date.format('YYYY-MM-DD'),
      order: itinerary.length + 1,
      notes: values.notes,
    };
    setItinerary((prev) => [...prev, newItem]);
    setPlanModalOpen(false);
  };

  const handleRemoveItineraryItem = (id: string) => {
    setItinerary((prev) => prev.filter((item) => item.id !== id).map((item, index) => ({ ...item, order: index + 1 })));
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(itinerary);
    const [removed] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, removed);
    setItinerary(items.map((item, index) => ({ ...item, order: index + 1 })));
  };

  const handleDeleteDestination = (id: string) => {
    setDestinations((prev) => prev.filter((item) => item.id !== id));
    setItinerary((prev) => prev.filter((item) => item.destinationId !== id));
  };

  const openAdminDestination = (destination?: Destination) => {
    if (destination) {
      setEditingDestination(destination);
      destinationForm.setFieldsValue({
        ...destination,
        price: destination.price,
        foodBudget: destination.budget.food,
        stayBudget: destination.budget.stay,
        transportBudget: destination.budget.transport,
        miscBudget: destination.budget.misc,
      });
    } else {
      setEditingDestination(null);
      destinationForm.resetFields();
    }
    setAdminModalOpen(true);
  };

  const handleAdminSubmit = (values: any) => {
    const newDestination: Destination = {
      id: editingDestination ? editingDestination.id : `dest-${Date.now()}`,
      title: values.title,
      type: values.type,
      region: values.region,
      price: values.price,
      rating: values.rating,
      image: values.image,
      description: values.description,
      visitHours: values.visitHours,
      travelHours: values.travelHours,
      budget: {
        food: values.foodBudget,
        stay: values.stayBudget,
        transport: values.transportBudget,
        misc: values.miscBudget,
      },
    };
    setDestinations((prev) =>
      editingDestination
        ? prev.map((item) => (item.id === newDestination.id ? newDestination : item))
        : [newDestination, ...prev],
    );
    setAdminModalOpen(false);
  };

  const handleBudgetChange = (key: keyof BudgetLimits, value: number | null) => {
    setBudgetLimits((prev) => ({ ...prev, [key]: value ?? 0 }));
  };

  const destinationCards = sortedDestinations.map((destination) => (
    <Col key={destination.id} xs={24} sm={12} lg={8}>
      <Card
        hoverable
        cover={
          <div
            className="destination-cover"
            style={{ backgroundImage: `url(${destination.image})` }}
          />
        }
        actions={[
          <Button key="add" type="text" onClick={() => openPlanModal(destination)}>
            Thêm vào lịch trình
          </Button>,
        ]}
      >
        <div className="destination-card-inner">
          <Title level={4}>{destination.title}</Title>
          <Space wrap>
            <Tag color="cyan">{destination.type}</Tag>
            <Tag>{destination.region}</Tag>
          </Space>
          <div className="destination-meta">
            <Rate disabled allowHalf value={destination.rating} />
            <Text strong>{tienVietNam(destination.price)}</Text>
          </div>
          <Paragraph ellipsis={{ rows: 2 }}>{destination.description}</Paragraph>
          <Space>
            <Text>Tham quan: {destination.visitHours}h</Text>
            <Text>Di chuyển: {destination.travelHours}h</Text>
          </Space>
        </div>
      </Card>
    </Col>
  ));

  return (
    <div className="travel-planner-page">
      <Row justify="space-between" align="middle" className="page-header">
        <Col>
          <Title level={3}>Ứng dụng lập kế hoạch du lịch</Title>
          <Text type="secondary">
            Thiết kế responsive cho tablet và mobile với khám phá điểm đến, lịch trình và quản lý ngân sách.
          </Text>
        </Col>
        <Col>
          <Button type="primary" icon={<CompassOutlined />}>Khám phá ngay</Button>
        </Col>
      </Row>

      <Tabs defaultActiveKey="explore">
        <Tabs.TabPane tab="Khám phá điểm đến" key="explore">
          <Card className="filter-panel">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Text strong>Loại hình</Text>
                <Select value={tourType} onChange={setTourType} style={{ width: '100%' }}>
                  <Option value="All">Tất cả</Option>
                  <Option value="Biển">Biển</Option>
                  <Option value="Núi">Núi</Option>
                  <Option value="Thành phố">Thành phố</Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Text strong>Vùng miền</Text>
                <Select value={region} onChange={setRegion} style={{ width: '100%' }}>
                  <Option value="All">Tất cả</Option>
                  <Option value="Bắc">Bắc</Option>
                  <Option value="Trung">Trung</Option>
                  <Option value="Nam">Nam</Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Text strong>Giá</Text>
                <Select value={priceRange} onChange={setPriceRange} style={{ width: '100%' }}>
                  {priceFilters.map((filter) => (
                    <Option key={filter.value} value={filter.value}>
                      {filter.label}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Text strong>Sắp xếp</Text>
                <Select value={sortBy} onChange={setSortBy} style={{ width: '100%' }}>
                  {sortOptions.map((option) => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Text strong>Đánh giá</Text>
                <Select value={ratingFilter} onChange={setRatingFilter} style={{ width: '100%' }}>
                  <Option value="all">Tất cả</Option>
                  <Option value="4.5">{'>= 4.5'}</Option>
                  <Option value="4.7">{'>= 4.7'}</Option>
                </Select>
              </Col>
            </Row>
          </Card>

          <Row gutter={[16, 16]} className="destination-grid">{destinationCards}</Row>

          <Modal
            title={selectedDestination ? `Thêm ${selectedDestination.title}` : 'Thêm vào lịch trình'}
            visible={planModalOpen}
            onCancel={() => setPlanModalOpen(false)}
            onOk={() => planForm.submit()}
          >
            <Form form={planForm} layout="vertical" onFinish={handlePlanFinish}>
              <Form.Item label="Ngày" name="date" rules={[{ required: true }]}> 
                <DatePicker style={{ width: '100%' }} disabledDate={(current) => current && current < moment().startOf('day')} />
              </Form.Item>
              <Form.Item label="Ghi chú" name="notes">
                <Input.TextArea rows={3} placeholder="Ghi chú thêm cho hành trình" />
              </Form.Item>
            </Form>
          </Modal>
        </Tabs.TabPane>

        <Tabs.TabPane tab="Tạo lịch trình du lịch" key="itinerary">
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={16}>
              <Card title="Danh sách hành trình">
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="itinerary-list">
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps}>
                        {itinerary.map((item, index) => {
                          const destination = destinations.find((d) => d.id === item.destinationId);
                          return (
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                              {(dragProvided) => (
                                <Card
                                  className="itinerary-item"
                                  size="small"
                                  ref={dragProvided.innerRef}
                                  {...dragProvided.draggableProps}
                                  {...dragProvided.dragHandleProps}
                                >
                                  <Row justify="space-between" align="middle">
                                    <Col>
                                      <Title level={5}>{destination?.title}</Title>
                                      <Text type="secondary">
                                        {moment(item.date).format('DD/MM/YYYY')} • {destination?.visitHours}h tham quan • {destination?.travelHours}h di chuyển
                                      </Text>
                                    </Col>
                                    <Col>
                                      <Space>
                                        <Badge count={item.order} />
                                        <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleRemoveItineraryItem(item.id)} />
                                      </Space>
                                    </Col>
                                  </Row>
                                  <Paragraph>{item.notes || 'Không có ghi chú.'}</Paragraph>
                                </Card>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                        {itinerary.length === 0 && <Text type="secondary">Chưa có điểm đến trong lịch trình.</Text>}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title="Tổng quan">
                <Statistic title="Tổng ngân sách" value={totalItineraryCost} />
                <Statistic title="Tổng thời gian di chuyển" value={`${totalTravelHours.toFixed(1)}h`} style={{ marginTop: 16 }} />
                <Alert
                  style={{ marginTop: 16 }}
                  type={overBudget ? 'error' : 'success'}
                  message={overBudget ? 'Ngân sách vượt hạn mức' : 'Ngân sách đang ổn'}
                />
              </Card>
            </Col>
          </Row>
        </Tabs.TabPane>

        <Tabs.TabPane tab="Quản lý ngân sách" key="budget">
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title="Ngân sách dự kiến">
                <Form layout="vertical">
                  <Form.Item label="Ăn uống">
                    <InputNumber
                      style={{ width: '100%' }}
                      value={budgetLimits.food}
                      formatter={(value) => tienVietNam(Number(value))}
                      parser={(value) => Number(value?.replace(/[^0-9]/g, '') || 0)}
                      onChange={(value) => handleBudgetChange('food', value)}
                    />
                  </Form.Item>
                  <Form.Item label="Lưu trú">
                    <InputNumber
                      style={{ width: '100%' }}
                      value={budgetLimits.stay}
                      formatter={(value) => tienVietNam(Number(value))}
                      parser={(value) => Number(value?.replace(/[^0-9]/g, '') || 0)}
                      onChange={(value) => handleBudgetChange('stay', value)}
                    />
                  </Form.Item>
                  <Form.Item label="Di chuyển">
                    <InputNumber
                      style={{ width: '100%' }}
                      value={budgetLimits.transport}
                      formatter={(value) => tienVietNam(Number(value))}
                      parser={(value) => Number(value?.replace(/[^0-9]/g, '') || 0)}
                      onChange={(value) => handleBudgetChange('transport', value)}
                    />
                  </Form.Item>
                  <Form.Item label="Chi phí khác">
                    <InputNumber
                      style={{ width: '100%' }}
                      value={budgetLimits.misc}
                      formatter={(value) => tienVietNam(Number(value))}
                      parser={(value) => Number(value?.replace(/[^0-9]/g, '') || 0)}
                      onChange={(value) => handleBudgetChange('misc', value)}
                    />
                  </Form.Item>
                </Form>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="Phân bổ chi phí">
                <DonutChart
                  xAxis={['Ăn uống', 'Lưu trú', 'Di chuyển', 'Khác']}
                  yAxis={[[itineraryCosts.food, itineraryCosts.stay, itineraryCosts.transport, itineraryCosts.misc]]}
                  yLabel={['Chi phí']}
                  colors={['#1890ff', '#52c41a', '#faad14', '#eb2f96']}
                  formatY={(value) => tienVietNam(value)}
                  showTotal
                  height={320}
                />
              </Card>
            </Col>
          </Row>
          <Card title="So sánh ngân sách" style={{ marginTop: 16 }}>
            <Table
              columns={[
                { title: 'Hạng mục', dataIndex: 'category', key: 'category' },
                { title: 'Dự kiến', dataIndex: 'budget', key: 'budget', render: (value: number) => tienVietNam(value) },
                { title: 'Thực tế', dataIndex: 'actual', key: 'actual', render: (value: number) => tienVietNam(value) },
                {
                  title: 'Trạng thái',
                  key: 'status',
                  render: (_: any, record: any) => (
                    record.actual > record.budget ? <Tag color="error">Vượt</Tag> : <Tag color="success">Ổn</Tag>
                  ),
                },
              ]}
              dataSource={[
                { key: 'food', category: 'Ăn uống', budget: budgetLimits.food, actual: itineraryCosts.food },
                { key: 'stay', category: 'Lưu trú', budget: budgetLimits.stay, actual: itineraryCosts.stay },
                { key: 'transport', category: 'Di chuyển', budget: budgetLimits.transport, actual: itineraryCosts.transport },
                { key: 'misc', category: 'Khác', budget: budgetLimits.misc, actual: itineraryCosts.misc },
              ]}
              pagination={false}
              rowKey="key"
            />
          </Card>
        </Tabs.TabPane>

        <Tabs.TabPane tab="Trang quản trị" key="admin">
          <Card title="Điểm đến" extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => openAdminDestination()}>Thêm</Button>}>
            <Table
              columns={[
                { title: 'Tên', dataIndex: 'title', key: 'title' },
                { title: 'Loại', dataIndex: 'type', key: 'type' },
                { title: 'Khu vực', dataIndex: 'region', key: 'region' },
                { title: 'Giá', dataIndex: 'price', key: 'price', render: (value: number) => tienVietNam(value) },
                { title: 'Rating', dataIndex: 'rating', key: 'rating', render: (value: number) => <Rate disabled value={value} allowHalf /> },
                {
                  title: 'Hành động',
                  key: 'action',
                  render: (_: any, record: Destination) => (
                    <Space>
                      <Button type="link" icon={<EditOutlined />} onClick={() => openAdminDestination(record)} />
                      <Popconfirm title="Xóa?" onConfirm={() => handleDeleteDestination(record.id)}>
                        <Button type="link" danger icon={<DeleteOutlined />} />
                      </Popconfirm>
                    </Space>
                  ),
                },
              ]}
              dataSource={destinations}
              rowKey="id"
              pagination={false}
            />
          </Card>

          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col xs={24} md={8}>
              <Card>
                <Statistic title="Lượt lịch trình" value={itinerary.length} />
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card>
                <Statistic title="Điểm đến" value={destinations.length} />
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card>
                <Statistic title="Doanh thu ước tính" value={tienVietNam(totalItineraryCost)} />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col xs={24} lg={12}>
              <Card title="Thống kê theo tháng">
                <ColumnChart
                  title="Hành trình"
                  xAxis={monthlySummary.map((item) => item.name)}
                  yAxis={[monthlySummary.map((item) => item.count)]}
                  yLabel={['Số lượng']}
                  colors={['#1890ff']}
                  height={320}
                />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="Địa điểm phổ biến">
                {destinationPopularity.length > 0 ? (
                  destinationPopularity.map((item) => (
                    <div key={item.title} className="popular-item">
                      <Text strong>{item.title}</Text>
                      <Tag color="blue">{item.count} lượt</Tag>
                    </div>
                  ))
                ) : (
                  <Text type="secondary">Chưa có dữ liệu</Text>
                )}
              </Card>
            </Col>
          </Row>
        </Tabs.TabPane>
      </Tabs>

      <Modal
        title={editingDestination ? 'Chỉnh sửa điểm đến' : 'Thêm điểm đến'}
        visible={adminModalOpen}
        onCancel={() => setAdminModalOpen(false)}
        onOk={() => destinationForm.submit()}
        width={720}
      >
        <Form form={destinationForm} layout="vertical" onFinish={handleAdminSubmit}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label="Tên" name="title" rules={[{ required: true }]}> <Input /> </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Loại hình" name="type" rules={[{ required: true }]}> 
                <Select>
                  <Option value="Biển">Biển</Option>
                  <Option value="Núi">Núi</Option>
                  <Option value="Thành phố">Thành phố</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label="Khu vực" name="region" rules={[{ required: true }]}> 
                <Select>
                  <Option value="Bắc">Bắc</Option>
                  <Option value="Trung">Trung</Option>
                  <Option value="Nam">Nam</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Rating" name="rating" rules={[{ required: true }]}> 
                <Rate allowHalf />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label="Giá" name="price" rules={[{ required: true }]}> 
                <InputNumber style={{ width: '100%' }} formatter={(value) => tienVietNam(Number(value))} parser={(value) => Number(value?.replace(/[^0-9]/g, '') || 0)} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="URL ảnh" name="image" rules={[{ required: true }]}> <Input /> </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label="Thời gian tham quan (h)" name="visitHours" rules={[{ required: true }]}> <InputNumber style={{ width: '100%' }} min={1} /> </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Thời gian di chuyển (h)" name="travelHours" rules={[{ required: true }]}> <InputNumber style={{ width: '100%' }} min={0} /> </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Mô tả" name="description" rules={[{ required: true }]}> <Input.TextArea rows={3} /> </Form.Item>
          <Title level={5}>Ngân sách</Title>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label="Ăn uống" name="foodBudget" rules={[{ required: true }]}> <InputNumber style={{ width: '100%' }} formatter={(value) => tienVietNam(Number(value))} parser={(value) => Number(value?.replace(/[^0-9]/g, '') || 0)} /> </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Lưu trú" name="stayBudget" rules={[{ required: true }]}> <InputNumber style={{ width: '100%' }} formatter={(value) => tienVietNam(Number(value))} parser={(value) => Number(value?.replace(/[^0-9]/g, '') || 0)} /> </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label="Di chuyển" name="transportBudget" rules={[{ required: true }]}> <InputNumber style={{ width: '100%' }} formatter={(value) => tienVietNam(Number(value))} parser={(value) => Number(value?.replace(/[^0-9]/g, '') || 0)} /> </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Khác" name="miscBudget" rules={[{ required: true }]}> <InputNumber style={{ width: '100%' }} formatter={(value) => tienVietNam(Number(value))} parser={(value) => Number(value?.replace(/[^0-9]/g, '') || 0)} /> </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default KeHoachDuLich;
