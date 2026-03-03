import React, { useState, useEffect } from 'react';
import { Button, Input, InputNumber, Select, Table, Space, Typography, Modal, Form, DatePicker } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title, Text } = Typography;
const { Option } = Select;

// data types
interface Subject {
  id: string;
  name: string;
}
interface Session {
  id: string;
  subjectId: string;
  datetime: string; // ISO
  duration: number; // hours
  content: string;
  note: string;
}
interface Goals {
  perSubject: { [key: string]: number };
  total: number;
}

const STORAGE_KEYS = {
  subjects: 'studySubjects',
  sessions: 'studySessions',
  goals: 'studyGoals',
};

const load = <T,>(key: string, def: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch (e) {
    console.warn('load error', e);
  }
  return def;
};
const save = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const StudyTracker: React.FC = () => {
  const [form] = Form.useForm();
  // subjects
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newSubjectName, setNewSubjectName] = useState('');

  // sessions
  const [sessions, setSessions] = useState<Session[]>([]);
  const [subjectFilter, setSubjectFilter] = useState<string>('');
  const [sessionModalVisible, setSessionModalVisible] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);

  // goals
  const [goals, setGoals] = useState<Goals>({ perSubject: {}, total: 0 });

  useEffect(() => {
    setSubjects(load<Subject[]>(STORAGE_KEYS.subjects, []));
    setSessions(load<Session[]>(STORAGE_KEYS.sessions, []));
    setGoals(load<Goals>(STORAGE_KEYS.goals, { perSubject: {}, total: 0 }));
  }, []);

  // helpers
  const persistSubjects = (list: Subject[]) => {
    setSubjects(list);
    save(STORAGE_KEYS.subjects, list);
  };
  const persistSessions = (list: Session[]) => {
    setSessions(list);
    save(STORAGE_KEYS.sessions, list);
  };
  const persistGoals = (g: Goals) => {
    setGoals(g);
    save(STORAGE_KEYS.goals, g);
  };

  const addSubject = () => {
    const name = newSubjectName.trim();
    if (!name) return;
    if (subjects.find((s) => s.name === name)) return;
    const s: Subject = { id: Date.now().toString(), name };
    persistSubjects([...subjects, s]);
    setNewSubjectName('');
  };
  const updateSubject = (id: string, name: string) => {
    persistSubjects(subjects.map((s) => (s.id === id ? { ...s, name } : s)));
  };
  const deleteSubject = (id: string) => {
    if (!window.confirm('Xóa môn học này?')) return;
    persistSubjects(subjects.filter((s) => s.id !== id));
  };

  const addOrUpdateSession = (s: Session) => {
    if (s.id) {
      persistSessions(sessions.map((x) => (x.id === s.id ? s : x)));
    } else {
      s.id = Date.now().toString();
      persistSessions([...sessions, s]);
    }
  };
  const deleteSession = (id: string) => {
    if (!window.confirm('Xóa buổi học này?')) return;
    persistSessions(sessions.filter((s) => s.id !== id));
  };

  const filteredSessions = subjectFilter
    ? sessions.filter((s) => s.subjectId === subjectFilter)
    : sessions;

  const monthStart = moment().startOf('month');
  const monthEnd = moment().endOf('month');
  const sessionsThisMonth = sessions.filter((s) => {
    const d = moment(s.datetime);
    return d.isBetween(monthStart, monthEnd, undefined, '[]');
  });
  const hoursPerSubject: { [key: string]: number } = {};
  sessionsThisMonth.forEach((s) => {
    hoursPerSubject[s.subjectId] = (hoursPerSubject[s.subjectId] || 0) + s.duration;
  });
  const totalHours = sessionsThisMonth.reduce((acc, s) => acc + s.duration, 0);

  // UI
  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Quản lý tiến độ học tập</Title>

      {/* subjects */}
      <section style={{ marginBottom: 32 }}>
        <Title level={4}>Môn học</Title>
        <Space>
          <Input
            placeholder="Tên môn mới"
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)}
            onPressEnter={addSubject}
          />
          <Button type="primary" onClick={addSubject} icon={<PlusOutlined />}>
            Thêm
          </Button>
        </Space>
        <Table
          dataSource={subjects.map((s) => ({ key: s.id, ...s }))}
          pagination={false}
          style={{ marginTop: 8 }}
        >
          <Table.Column title="Tên môn" dataIndex="name" key="name" render={(text, record: any) => (
            <span
              style={{ cursor: 'pointer' }}
              onClick={() => {
                const newName = window.prompt('Tên môn mới', text);
                if (newName) updateSubject(record.id, newName);
              }}
            >{text}</span>
          )} />
          <Table.Column
            title="Hành động"
            key="action"
            render={(text, record: any) => (
              <Space>
                <Button icon={<DeleteOutlined />} size="small" onClick={() => deleteSubject(record.id)} />
              </Space>
            )}
          />
        </Table>
      </section>

      {/* sessions */}
      <section style={{ marginBottom: 32 }}>
        <Title level={4}>Buổi học</Title>
        <Space style={{ marginBottom: 8 }}>
          <Select
            style={{ width: 200 }}
            placeholder="Chọn môn"
            value={subjectFilter || undefined}
            onChange={(v) => setSubjectFilter(v)}
            allowClear
          >
            {subjects.map((s) => (
              <Option key={s.id} value={s.id}>
                {s.name}
              </Option>
            ))}
          </Select>
          <Button
            type="primary"
            onClick={() => {
              setEditingSession(null);
              setSessionModalVisible(true);
            }}
            icon={<PlusOutlined />}
          >
            Thêm buổi
          </Button>
        </Space>
        <Table
          dataSource={filteredSessions.map((s) => ({ key: s.id, ...s }))}
          pagination={false}
        >
          <Table.Column
            title="Môn"
            dataIndex="subjectId"
            key="subjectId"
            render={(id) => subjects.find((s) => s.id === id)?.name || ''}
          />
          <Table.Column
            title="Ngày giờ"
            dataIndex="datetime"
            key="datetime"
            render={(d) => moment(d).format('YYYY-MM-DD HH:mm')}
          />
          <Table.Column title="Thời lượng (h)" dataIndex="duration" key="duration" />
          <Table.Column title="Nội dung" dataIndex="content" key="content" />
          <Table.Column title="Ghi chú" dataIndex="note" key="note" />
          <Table.Column
            title="Hành động"
            key="action"
            render={(text, record: any) => (
              <Space>
                <Button
                  icon={<EditOutlined />}
                  size="small"
                  onClick={() => {
                    setEditingSession(record as Session);
                    setSessionModalVisible(true);
                  }}
                />
                <Button
                  icon={<DeleteOutlined />}
                  size="small"
                  onClick={() => deleteSession(record.id)}
                />
              </Space>
            )}
          />
        </Table>
      </section>

      {/* goals */}
      <section style={{ marginBottom: 32 }}>
        <Title level={4}>Mục tiêu hàng tháng</Title>
        <div>
          <Text>Tháng hiện tại: {moment().format('YYYY-MM')}</Text>
        </div>
        <div style={{ marginTop: 8 }}>
          <Text strong>Mục tiêu tổng (giờ): </Text>
          <InputNumber
            min={0}
            value={goals.total}
            onChange={(v) => persistGoals({ ...goals, total: v || 0 })}
          />
        </div>
        {subjects.map((s) => (
          <div key={s.id} style={{ marginTop: 8 }}>
            <Text>{s.name}: </Text>
            <InputNumber
              min={0}
              value={goals.perSubject[s.id] || 0}
              onChange={(v) =>
                persistGoals({
                  ...goals,
                  perSubject: { ...goals.perSubject, [s.id]: v || 0 },
                })
              }
            />{' '}
            <Text>
              ({hoursPerSubject[s.id] || 0}h){' '}
              {goals.perSubject[s.id] && hoursPerSubject[s.id] >= goals.perSubject[s.id]
                ? 'Đạt'
                : goals.perSubject[s.id]
                ? 'Chưa đạt'
                : ''}
            </Text>
          </div>
        ))}
        <div style={{ marginTop: 8 }}>
          <Text>
            Tổng giờ: {totalHours} / {goals.total} {' '}
            {goals.total && totalHours >= goals.total ? 'Đạt' : goals.total ? 'Chưa đạt' : ''}
          </Text>
        </div>
      </section>

      <Modal
        title={editingSession ? 'Sửa buổi học' : 'Thêm buổi học'}
        visible={sessionModalVisible}
        onCancel={() => setSessionModalVisible(false)}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              const s: Session = {
                id: editingSession?.id || '',
                subjectId: values.subjectId,
                datetime: values.datetime.toISOString(),
                duration: values.duration,
                content: values.content,
                note: values.note || '',
              };
              addOrUpdateSession(s);
              setSessionModalVisible(false);
            })
            .catch(() => {});
        }}
      >
        <Form form={form} layout="vertical" initialValues={{
          subjectId: editingSession?.subjectId,
          datetime: editingSession ? moment(editingSession.datetime) : moment(),
          duration: editingSession?.duration,
          content: editingSession?.content,
          note: editingSession?.note,
        }}>
          <Form.Item
            name="subjectId"
            label="Môn"
            rules={[{ required: true }]}
          >
            <Select>
              {subjects.map((s) => (
                <Option key={s.id} value={s.id}>{s.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="datetime" label="Ngày giờ" rules={[{ required: true }]}> 
            <DatePicker showTime />
          </Form.Item>
          <Form.Item name="duration" label="Thời lượng (giờ)" rules={[{ required: true }]}> 
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item name="content" label="Nội dung" rules={[{ required: true }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="note" label="Ghi chú">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StudyTracker;
