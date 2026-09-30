import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, Modal } from 'react-bootstrap';
import {
  FaPlus, FaSync, FaTasks, FaUser, FaClock, FaCheckCircle,
  FaPlay, FaPause, FaEdit, FaTrash, FaCalendarAlt, FaFlag
} from 'react-icons/fa';
import './TaskBoard.css';

const TaskBoard = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1, title: 'Design login page', project: 'E-commerce Platform',
      assignee: 'John Doe', priority: 'High', dueDate: '2026-02-15',
      description: 'Create responsive login UI', status: 'todo', avatar: 'JD'
    },
    {
      id: 2, title: 'API Integration', project: 'E-commerce Platform',
      assignee: 'Jane Smith', priority: 'High', dueDate: '2026-02-20',
      description: 'Integrate payment API', status: 'inprogress', avatar: 'JS'
    },
    {
      id: 3, title: 'Database Schema', project: 'HR System',
      assignee: 'Mike Johnson', priority: 'Medium', dueDate: '2026-02-10',
      description: 'Design ERD for HR', status: 'done', avatar: 'MJ'
    },
    {
      id: 4, title: 'User Testing', project: 'Mobile App',
      assignee: 'Sarah Williams', priority: 'Low', dueDate: '2026-03-01',
      description: 'Conduct usability tests', status: 'review', avatar: 'SW'
    },
    {
      id: 5, title: 'Write Documentation', project: 'HR System',
      assignee: 'Robert Brown', priority: 'Medium', dueDate: '2026-02-25',
      description: 'Write API docs', status: 'todo', avatar: 'RB'
    },
    {
      id: 6, title: 'Fix Bug #1234', project: 'Mobile App',
      assignee: 'Emily Davis', priority: 'High', dueDate: '2026-02-18',
      description: 'Crash on iOS', status: 'inprogress', avatar: 'ED'
    },
    {
      id: 7, title: 'Optimize Images', project: 'E-commerce Platform',
      assignee: 'David Wilson', priority: 'Low', dueDate: '2026-02-22',
      description: 'Compress product images', status: 'review', avatar: 'DW'
    },
    {
      id: 8, title: 'Set Up CI/CD', project: 'HR System',
      assignee: 'Laura Martinez', priority: 'Medium', dueDate: '2026-03-05',
      description: 'Automate deployment', status: 'done', avatar: 'LM'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null);

  const columns = [
    { key: 'todo', title: 'To Do', icon: <FaTasks />, color: '#64748b' },
    { key: 'inprogress', title: 'In Progress', icon: <FaPlay />, color: '#3b82f6' },
    { key: 'review', title: 'Review', icon: <FaPause />, color: '#eab308' },
    { key: 'done', title: 'Done', icon: <FaCheckCircle />, color: '#22c55e' }
  ];

  const getPriorityBadge = (p) => {
    const map = {
      High: 'danger',
      Medium: 'warning',
      Low: 'info'
    };
    return <Badge bg={map[p]} className="priority-badge"><FaFlag className="me-1" />{p}</Badge>;
  };

  const handleDragStart = (task) => setDraggedTask(task);

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (status) => {
    if (!draggedTask) return;
    setTasks(tasks.map((t) => (t.id === draggedTask.id ? { ...t, status } : t)));
    setDraggedTask(null);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this task?')) return;
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <div className="task-board-page">
      <Container fluid>
        {/* Header */}
        <div className="board-header">
          <div>
            <h2 className="page-title">Task Board</h2>
            <p className="page-subtitle">Drag and drop tasks between columns</p>
          </div>
          <div className="header-right">
            <Button variant="primary" className="me-2" onClick={() => setShowModal(true)}>
              <FaPlus className="me-1" /> New Task
            </Button>
            <Button variant="outline-secondary">
              <FaSync className="me-1" /> Refresh
            </Button>
          </div>
        </div>

        {/* Board */}
        <Row className="g-3 board-row">
          {columns.map((col) => {
            const columnTasks = tasks.filter((t) => t.status === col.key);
            return (
              <Col lg={3} md={6} key={col.key} className="board-column-col">
                <div
                  className="board-column"
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(col.key)}
                >
                  <div className="column-header" style={{ borderTopColor: col.color }}>
                    <div className="column-title">
                      <span className="column-icon" style={{ color: col.color }}>{col.icon}</span>
                      <span>{col.title}</span>
                    </div>
                    <Badge bg="secondary" pill>{columnTasks.length}</Badge>
                  </div>

                  <div className="column-body">
                    {columnTasks.map((task) => (
                      <Card
                        key={task.id}
                        className="task-card"
                        draggable
                        onDragStart={() => handleDragStart(task)}
                      >
                        <Card.Body>
                          <div className="task-top">
                            <div className="task-project">{task.project}</div>
                            <div className="task-actions">
                              <Button variant="light" size="sm" className="icon-btn"><FaEdit /></Button>
                              <Button variant="light" size="sm" className="icon-btn text-danger"
                                onClick={() => handleDelete(task.id)}>
                                <FaTrash />
                              </Button>
                            </div>
                          </div>

                          <h6 className="task-title">{task.title}</h6>
                          {task.description && (
                            <p className="task-desc">{task.description}</p>
                          )}

                          <div className="task-meta">
                            {getPriorityBadge(task.priority)}
                            <span className="task-date">
                              <FaCalendarAlt className="me-1" />
                              {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>

                          <div className="task-footer">
                            <div className="task-assignee">
                              <div className="assignee-avatar">{task.avatar}</div>
                              <span>{task.assignee}</span>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    ))}

                    {columnTasks.length === 0 && (
                      <div className="empty-column">
                        <p className="text-muted small mb-0">No tasks</p>
                      </div>
                    )}
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>

        {/* Create Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Create New Task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Task Title</Form.Label>
                <Form.Control type="text" placeholder="Enter task title" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Project</Form.Label>
                <Form.Select>
                  <option>E-commerce Platform</option>
                  <option>HR System</option>
                  <option>Mobile App</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Assignee</Form.Label>
                <Form.Select>
                  <option>John Doe</option>
                  <option>Jane Smith</option>
                  <option>Mike Johnson</option>
                </Form.Select>
              </Form.Group>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Priority</Form.Label>
                    <Form.Select>
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Due Date</Form.Label>
                    <Form.Control type="date" />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setShowModal(false)}>
              <FaPlus className="me-1" /> Create Task
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default TaskBoard;