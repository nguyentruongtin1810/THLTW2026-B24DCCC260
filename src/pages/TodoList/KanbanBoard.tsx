import { Button, Card, Col, Row, Space, Tag, Typography } from 'antd';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

const { Text, Title } = Typography;

const statusLabels: Record<TodoList.TaskStatus, string> = {
  todo: 'Cần làm',
  inprogress: 'Đang làm',
  done: 'Hoàn thành',
};

const statusColors: Record<TodoList.TaskStatus, string> = {
  todo: '#5B8FF9',
  inprogress: '#F6BD16',
  done: '#29C3BE',
};

const priorityColors: Record<TodoList.TaskPriority, string> = {
  High: '#f5222d',
  Medium: '#fa8c16',
  Low: '#52c41a',
};

interface KanbanBoardProps {
  tasks: TodoList.TodoItem[];
  onStatusChange: (task: TodoList.TodoItem, status: TodoList.TaskStatus) => void;
  onEdit: (task: TodoList.TodoItem) => void;
  onDelete: (task: TodoList.TodoItem) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, onStatusChange, onEdit, onDelete }) => {
  const columns: TodoList.TaskStatus[] = ['todo', 'inprogress', 'done'];

  const groupedTasks = columns.reduce<Record<TodoList.TaskStatus, TodoList.TodoItem[]>>(
    (result, status) => ({ ...result, [status]: tasks.filter((task) => task.status === status) }),
    { todo: [], inprogress: [], done: [] },
  );

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;
    const movedTask = tasks.find((task) => task.id === draggableId);
    if (!movedTask) return;
    onStatusChange(movedTask, destination.droppableId as TodoList.TaskStatus);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Row gutter={[16, 16]}>
        {columns.map((status) => (
          <Col key={status} xs={24} sm={12} lg={8}>
            <Card
              title={<Title level={5}>{statusLabels[status]}</Title>}
              bodyStyle={{ minHeight: 480, backgroundColor: '#fafafa' }}
            >
              <Droppable droppableId={status}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} style={{ minHeight: 420 }}>
                    {groupedTasks[status].map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(providedDrag) => (
                          <Card
                            ref={providedDrag.innerRef}
                            {...providedDrag.draggableProps}
                            {...providedDrag.dragHandleProps}
                            size='small'
                            style={{ marginBottom: 12 }}
                          >
                            <Space direction='vertical' style={{ width: '100%' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                                <Text strong>{task.name}</Text>
                                <Tag color={priorityColors[task.priority]}>{task.priority}</Tag>
                              </div>
                              <Text type='secondary'>{task.description}</Text>
                              <Space wrap>
                                {task.tags.map((tag) => (
                                  <Tag key={tag}>{tag}</Tag>
                                ))}
                              </Space>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text type='secondary'>{task.deadline}</Text>
                                <Space>
                                  <Button size='small' type='link' onClick={() => onEdit(task)}>
                                    Sửa
                                  </Button>
                                  <Button size='small' type='link' danger onClick={() => onDelete(task)}>
                                    Xóa
                                  </Button>
                                </Space>
                              </div>
                            </Space>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {groupedTasks[status].length === 0 && (
                      <div style={{ marginTop: 12, textAlign: 'center', color: '#888' }}>
                        Không có task
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </Card>
          </Col>
        ))}
      </Row>
    </DragDropContext>
  );
};

export default KanbanBoard;
