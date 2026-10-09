import React, { useState, useMemo } from 'react';
import {
  Container, Row, Col, Card, Button, Badge, Form,
  Modal, Dropdown, InputGroup, OverlayTrigger, Tooltip
} from 'react-bootstrap';
import {
  FaPlus, FaSearch, FaFilter, FaSync, FaTasks, FaPlay,
  FaPause, FaCheckCircle, FaEdit, FaTrash, FaUser,
  FaCalendarAlt, FaFlag, FaCommentDots, FaPaperclip,
  FaEllipsisV, FaBars
} from 'react-icons/fa';
import './TaskBoard.css';

const TaskBoard = () => {
  // ==================== STATE ====================
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [viewMode, setViewMode] = useState('board'); // 'board' | 'list'

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project: 'E-commerce Platform',
    assignee: '',
    priority: 'Medium',
    dueDate: '',
    status: 'todo'
  });

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Design login page',
      description: 'Create a responsive login UI with validation',
      project: 'E-commerce Platform',
      assignee: 'John Doe',
      priority: 'High',
      dueDate: '2026-02-15',
      status: 'todo',
      comments: 3,
      attachments: 2,
      avatar: 'JD'
    },
    {
      id: 2,
      title: 'API Integration',
      description: 'Integrate payment API with Stripe',
      project: 'E-commerce Platform',
      assignee: 'Jane Smith',
      priority: 'High',
      dueDate: '2026-02-20',
      status: 'inprogress',
      comments: 5,
      attachments: 1,
      avatar: 'JS'
    },
    {
      id: 3,
      title: 'Database Schema',
      description: 'Design ERD for HR module',
      project: 'HR System',
      assignee: 'Mike Johnson',
      priority: 'Medium',
      dueDate: '2026-02-10',
      status: 'done',
      comments: 2,
      attachments: 3,
      avatar: 'MJ'
    },
    {
      id: 4,
      title: 'User Testing',
      description: 'Conduct usability testing sessions',
      project: 'Mobile App',
      assignee: 'Sarah Williams',
      priority: 'Low',
      dueDate: '2026-03-01',
      status: 'review',
      comments: 4,
      attachments: 0,
      avatar: 'SW'
    },
    {
      id: 5,
      title: 'Write Documentation',
      description: 'Write API docs and user guides',
      project: 'HR System',
      assignee: 'Robert Brown',
      priority: 'Medium',
      dueDate: '2026-02-25',
      status: 'todo',
      comments: 1,
      attachments: 2,
      avatar: 'RB'
    },
    {
      id: 6,
      title: 'Fix Bug #1234',
      description: 'App crashes on iOS 17',
      project: 'Mobile App',
      assignee: 'Emily Davis',
      priority: 'High',
      dueDate: '2026-02-18',
      status: 'inprogress',
      comments: 6,
      attachments: 1,
      avatar: 'ED'
    },
    {
      id: 7,
      title: 'Code Review',
      description: 'Review PR #452 for auth module',
      project: 'E-commerce Platform',
      assignee: 'John Doe',
      priority: 'Medium',
      dueDate: '2026-02-12',
      status: 'review',
      comments: 2,
      attachments: 0,
      avatar: 'JD'
    },
    {
      id: 8,
      title: 'Deploy to Staging',
      description: 'Deploy latest build to staging server',
      project: 'HR System',
      assignee: 'Mike Johnson',
      priority: 'High',
      dueDate: '2026-02-08',
      status: 'done',
      comments: 0,
      attachments: 0,
      avatar: 'MJ'
    }
  ]);

  // ==================== COLUMNS ====================
  const columns = [
    { key: 'todo',       title: 'To Do',       color: '#64748b', icon: <FaTasks /> },
    { key: 'inprogress', title: 'In Progress', color: '#3b82f6', icon: <FaPlay /> },
    { key: 'review',     title: 'Review',      color: '#eab308', icon: <FaPause /> },
    { key: 'done',       title: 'Done',        color: '#22c55e', icon: <FaCheckCircle /> }
  ];

  // ==================== HELPERS ====================
  const getPriorityBadge = (priority) => {
    const map = {
      High:   { bg: 'danger',  color: '#dc2626' },
      Medium: { bg: 'warning', color: '#ca8a04' },
      Low:    { bg: 'info',    color: '#0891b2' }
    };
    const c = map[priority] || map.Medium;
    return (
      <Badge bg={c.bg} className="priority-badge">
        <FaFlag className="me-1" /> {priority}
      </Badge>
    );
  };

  const formatDate = (d) => {
    if (!d) return 'N/A';
    return new Date(d).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric'
    });
  };

  const isOverdue = (dueDate, status) => {
    if (!dueDate || status === 'done') return false;
    return new Date(dueDate) < new Date();
  };

  // ==================== FILTER ====================
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        t.title.toLowerCase().includes(term) ||
        t.description.toLowerCase().includes(term) ||
        t.project.toLowerCase().includes(term) ||
        t.assignee.toLowerCase().includes(term);
      const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
      const matchesAssignee = assigneeFilter === 'all' || t.assignee === assigneeFilter;
      return matchesSearch && matchesPriority && matchesAssignee;
    });
  }, [tasks, searchTerm, priorityFilter, assigneeFilter]);

  const uniqueAssignees = useMemo(
    () => [...new Set(tasks.map((t) => t.assignee))],
    [tasks]
  );

  // ==================== DRAG & DROP ====================
  const handleDragStart = (task) => setDraggedTask(task);

  const handleDragOver = (e, columnKey) => {
    e.preventDefault();
    setDragOverColumn(columnKey);
  };

  const handleDragLeave = () => setDragOverColumn(null);

  const handleDrop = (columnKey) => {
    if (!draggedTask) return;
    setTasks((prev) =>
      prev.map((t) => (t.id === draggedTask.id ? { ...t, status: columnKey } : t))
    );
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  // ==================== CRUD ====================
  const handleOpenNew = (defaultStatus = 'todo') => {
    setEditingTask(null);
    setFormData({
      title: '', description: '',
      project: 'E-commerce Platform',
      assignee: '', priority: 'Medium',
      dueDate: '', status: defaultStatus
    });
    setShowTaskModal(true);
  };

  const handleOpenEdit = (task) => {
    setEditingTask(task);
    setFormData({ ...task });
    setShowTaskModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingTask) {
      setTasks((prev) =>
        prev.map((t) => (t.id === editingTask.id ? { ...t, ...formData } : t))
      );
    } else {
      const newTask = {
        ...formData,
        id: Date.now(),
        avatar: formData.assignee
          ? formData.assignee.split(' ').map((n) => n[0]).join('').toUpperCase()
          : 'NA',
        comments: 0,
        attachments: 0
      };
      setTasks((prev) => [newTask, ...prev]);
    }
    setShowTaskModal(false);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this task?')) return;
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setPriorityFilter('all');
    setAssigneeFilter('all');
  };

  // ==================== RENDER TASK CARD ====================
  const renderTaskCard = (task) => (
    <Card
      key={task.id}
      className="task-card"
      draggable
      onDragStart={() => handleDragStart(task)}
      onDragEnd={() => setDraggedTask(null)}
    >
      <Card.Body>
        {/* Header */}
        <div className="task-header">
          <div className="task-project">{task.project}</div>
          <Dropdown align="end">
            <Dropdown.Toggle variant="light" size="sm" className="task-menu-btn">
              <FaEllipsisV />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleOpenView(task)}>
                <FaBars className="me-2" /> View
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleOpenEdit(task)}>
                <FaEdit className="me-2" /> Edit
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item className="text-danger" onClick={() => handleDelete(task.id)}>
                <FaTrash className="me-2" /> Delete
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        {/* Title & Description */}
        <h6 className="task-title">{task.title}</h6>
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}

        {/* Meta */}
        <div className="task-meta">
          {getPriorityBadge(task.priority)}
          <span className={`task-date ${isOverdue(task.dueDate, task.status) ? 'overdue' : ''}`}>
            <FaCalendarAlt className="me-1" />
            {formatDate(task.dueDate)}
          </span>
        </div>

        {/* Footer */}
        <div className="task-footer">
          <OverlayTrigger placement="top" overlay={<Tooltip>{task.assignee}</Tooltip>}>
            <div className="task-assignee-avatar">{task.avatar}</div>
          </OverlayTrigger>

          <div className="task-stats">
            {task.comments > 0 && (
              <span className="task-stat">
                <FaCommentDots /> {task.comments}
              </span>
            )}
            {task.attachments > 0 && (
              <span className="task-stat">
                <FaPaperclip /> {task.attachments}
              </span>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <div className="task-board-page">
      <Container fluid>
        {/* Header */}
        <div className="board-header">
          <div>
            <h2 className="page-title">Task Board</h2>
            <p className="page-subtitle">
              Drag and drop tasks between columns to update their status
            </p>
          </div>
          <div className="header-right">
            <Button variant="primary" className="me-2" onClick={() => handleOpenNew()}>
              <FaPlus className="me-1" /> New Task
            </Button>
            <Button variant="outline-secondary" onClick={() => window.location.reload()}>
              <FaSync className="me-1" /> Refresh
            </Button>
          </div>
        </div>

        {/* Toolbar */}
        <Card className="board-toolbar mb-4">
          <Card.Body>
            <Row className="g-3 align-items-center">
              <Col lg={4} md={6}>
                <InputGroup>
                  <InputGroup.Text><FaSearch /></InputGroup.Text>
                  <Form.Control
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Col>

              <Col lg={3} md={6}>
                <Form.Select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <option value="all">All Priorities</option>
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </Form.Select>
              </Col>

              <Col lg={3} md={6}>
                <Form.Select
                  value={assigneeFilter}
                  onChange={(e) => setAssigneeFilter(e.target.value)}
                >
                  <option value="all">All Assignees</option>
                  {uniqueAssignees.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </Form.Select>
              </Col>

              <Col lg={2} md={6} className="text-end">
                <Button variant="outline-secondary" size="sm" onClick={handleResetFilters}>
                  <FaFilter className="me-1" /> Reset
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Board */}
        <Row className="board-row g-3">
          {columns.map((col) => {
            const columnTasks = filteredTasks.filter((t) => t.status === col.key);
            const isDragOver = dragOverColumn === col.key;

            return (
              <Col xl={3} lg={6} md={6} sm={12} key={col.key}>
                <div
                  className={`board-column ${isDragOver ? 'drag-over' : ''}`}
                  onDragOver={(e) => handleDragOver(e, col.key)}
                  onDragLeave={handleDragLeave}
                  onDrop={() => handleDrop(col.key)}
                >
                  {/* Column Header */}
                  <div className="column-header" style={{ borderTopColor: col.color }}>
                    <div className="column-title">
                      <span className="column-icon" style={{ color: col.color }}>
                        {col.icon}
                      </span>
                      <span>{col.title}</span>
                    </div>
                    <Badge bg="secondary" pill className="column-count">
                      {columnTasks.length}
                    </Badge>
                  </div>

                  {/* Column Body */}
                  <div className="column-body">
                    {columnTasks.length > 0 ? (
                      columnTasks.map(renderTaskCard)
                    ) : (
                      <div className="empty-column">
                        <FaTasks className="empty-icon" />
                        <p className="mb-0">No tasks</p>
                      </div>
                    )}

                    {/* Add Task Button */}
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="add-task-btn"
                      onClick={() => handleOpenNew(col.key)}
                    >
                      <FaPlus className="me-1" /> Add Task
                    </Button>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>

        {/* Task Modal */}
        <Modal
          show={showTaskModal}
          onHide={() => setShowTaskModal(false)}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Task Title <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  placeholder="Enter task title"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Describe the task..."
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Project</Form.Label>
                    <Form.Select
                      name="project"
                      value={formData.project}
                      onChange={handleFormChange}
                    >
                      <option value="E-commerce Platform">E-commerce Platform</option>
                      <option value="HR System">HR System</option>
                      <option value="Mobile App">Mobile App</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Assignee</Form.Label>
                    <Form.Select
                      name="assignee"
                      value={formData.assignee}
                      onChange={handleFormChange}
                    >
                      <option value="">Select Assignee</option>
                      {uniqueAssignees.map((a) => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Priority</Form.Label>
                    <Form.Select
                      name="priority"
                      value={formData.priority}
                      onChange={handleFormChange}
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Due Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleFormChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      name="status"
                      value={formData.status}
                      onChange={handleFormChange}
                    >
                      {columns.map((c) => (
                        <option key={c.key} value={c.key}>{c.title}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowTaskModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {editingTask ? 'Update Task' : 'Create Task'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
    </div>
  );
};

export default TaskBoard;