import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Timeline } from 'antd';
import { TrophyOutlined, FireOutlined, CalendarOutlined, AimOutlined } from '@ant-design/icons';
import Chart from 'react-apexcharts';
import moment from 'moment';
import { getWorkouts, getHealthMetrics, getGoals, initializeSampleData } from '../../services/fitness';
import { Workout, HealthMetric, Goal } from '../../models/fitness';

const FitnessDashboard: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    initializeSampleData();
    setWorkouts(getWorkouts());
    setHealthMetrics(getHealthMetrics());
    setGoals(getGoals());
  }, []);

  // Calculate stats
  const currentMonth = moment().format('YYYY-MM');
  const monthlyWorkouts = workouts.filter(w => w.date.startsWith(currentMonth));
  const totalWorkouts = monthlyWorkouts.length;
  const totalCalories = monthlyWorkouts.reduce((sum, w) => sum + w.calories, 0);
  const currentStreak = calculateStreak(workouts);
  const goalCompletion = goals.length > 0 ? (goals.filter(g => g.status === 'Achieved').length / goals.length) * 100 : 0;

  // Weekly workouts chart
  const weeklyData = getWeeklyWorkoutsData(workouts);

  // Weight change chart
  const weightData = getWeightChangeData(healthMetrics);

  // Recent workouts
  const recentWorkouts = workouts.slice(-5).reverse();

  function calculateStreak(workouts: Workout[]): number {
    let streak = 0;
    const today = moment();
    for (let i = 0; i < 365; i++) {
      const date = today.clone().subtract(i, 'days').format('YYYY-MM-DD');
      const hasWorkout = workouts.some(w => w.date === date && w.status === 'Completed');
      if (hasWorkout) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    return streak;
  }

  function getWeeklyWorkoutsData(workouts: Workout[]) {
    const weeks = [];
    const startOfMonth = moment().startOf('month');
    for (let i = 0; i < 4; i++) {
      const weekStart = startOfMonth.clone().add(i * 7, 'days');
      const weekEnd = weekStart.clone().add(6, 'days');
      const count = workouts.filter(w =>
        moment(w.date).isBetween(weekStart, weekEnd, null, '[]') && w.status === 'Completed'
      ).length;
      weeks.push(count);
    }
    return weeks;
  }

  function getWeightChangeData(metrics: HealthMetric[]) {
    const sorted = metrics.sort((a, b) => moment(a.date).diff(moment(b.date)));
    return {
      dates: sorted.map(m => moment(m.date).format('MMM DD')),
      weights: sorted.map(m => m.weight),
    };
  }

  const weeklyChartOptions = {
    chart: { type: 'bar' as const },
    xaxis: { categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'] },
    title: { text: 'Workouts per Week' },
  };

  const weightChartOptions = {
    chart: { type: 'line' as const },
    xaxis: { categories: weightData.dates },
    title: { text: 'Weight Change Over Time' },
  };

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Monthly Workouts"
              value={totalWorkouts}
              prefix={<TrophyOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Calories Burned"
              value={totalCalories}
              prefix={<FireOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Current Streak"
              value={currentStreak}
              suffix="days"
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Goals Completed"
              value={goalCompletion}
              suffix="%"
              prefix={<TargetOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card title="Weekly Workouts">
            <Chart
              options={weeklyChartOptions}
              series={[{ data: weeklyData }]}
              type="bar"
              height={300}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Weight Change">
            <Chart
              options={weightChartOptions}
              series={[{ data: weightData.weights }]}
              type="line"
              height={300}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Recent Workouts">
        <Timeline>
          {recentWorkouts.map(workout => (
            <Timeline.Item key={workout.id} color={workout.status === 'Completed' ? 'green' : 'red'}>
              <p>{moment(workout.date).format('MMM DD, YYYY')}</p>
              <p>{workout.type} - {workout.duration} min - {workout.calories} cal</p>
              {workout.notes && <p>{workout.notes}</p>}
            </Timeline.Item>
          ))}
        </Timeline>
      </Card>
    </div>
  );
};

export default FitnessDashboard;