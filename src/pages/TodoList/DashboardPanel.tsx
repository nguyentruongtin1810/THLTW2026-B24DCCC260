import { Card, Col, Row, Statistic } from 'antd';

interface DashboardPanelProps {
  total: number;
  completed: number;
  overdue: number;
}

const DashboardPanel: React.FC<DashboardPanelProps> = ({ total, completed, overdue }) => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} lg={8}>
        <Card>
          <Statistic title='Tổng task' value={total} />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={8}>
        <Card>
          <Statistic title='Task hoàn thành' value={completed} />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={8}>
        <Card>
          <Statistic title='Task quá hạn' value={overdue} />
        </Card>
      </Col>
    </Row>
  );
};

export default DashboardPanel;
