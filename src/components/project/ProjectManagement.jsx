import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Modal, 
  Alert, 
  Spinner,
  Badge,
  ProgressBar
} from 'react-bootstrap';
import { 
  FaPlus, 
  FaDownload, 
  FaProjectDiagram, 
  FaTasks,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaChartBar,
  FaUsers,
  FaCalendarAlt
} from 'react-icons/fa';
import ProjectList from './ProjectList';
import ProjectForm from './ProjectForm';
import projectService from '../../services/projectService';
import './ProjectManagement.css';

const ProjectManagement = () => {
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const statusMap = {
    'ongoing': 'In Progress',
    'completed': 'Completed',
    'on_hold': 'On Hold',
    'not_started': 'Planned',
    'in progress': 'In Progress',
    'on hold': 'On Hold',
    'planned': 'Planned'
  };

  const priorityMap = {
    'low': 'Low',
    'medium': 'Medium',
    'high': 'High',
    'critical': 'High'
  };

  const normalizeProject = (item) => ({
    id: item._id || item.id,
    _id: item._id || item.id,
    name: item.name || '',
    code: item.code || (item.name ? item.name.split(' ').map(w => w[0]).join('').toUpperCase() : 'PRJ'),
    description: item.description || '',
    department: item.department || 'General',
    manager: item.manager?.name || item.manager || 'Admin',
    startDate: item.startDate ? item.startDate.split('T')[0] : '',
    endDate: item.endDate ? item.endDate.split('T')[0] : '',
    status: statusMap[(item.status || '').toLowerCase()] || 'In Progress',
    priority: priorityMap[(item.priority || '').toLowerCase()] || 'Medium',
    budget: item.budget || 0,
    progress: item.progress || 0,
    teamMembers: Array.isArray(item.assignedEmployees) ? item.assignedEmployees.map(e => e?.name || e) : [],
    tasks: Array.isArray(item.tasks) ? item.tasks.length : 5,
    completedTasks: Math.round(((item.progress || 0) / 100) * (Array.isArray(item.tasks) && item.tasks.length > 0 ? item.tasks.length : 5)),
    avatar: (item.name || 'PR').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await projectService.getAllProjects();
      if (res.success && res.data) {
        const rawList = Array.isArray(res.data) ? res.data : (res.data.data || []);
        setProjects(rawList.map(normalizeProject));
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to load projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = async (projectData) => {
    setLoading(true);
    try {
      const payload = {
        name: projectData.name,
        code: projectData.code,
        description: projectData.description,
        department: projectData.department,
        startDate: projectData.startDate,
        endDate: projectData.endDate,
        budget: Number(projectData.budget) || 0,
        status: (projectData.status || 'ongoing').toLowerCase().replace(' ', '_'),
        priority: (projectData.priority || 'medium').toLowerCase()
      };
      const res = await projectService.createProject(payload);
      if (res.success) {
        setShowForm(false);
        setSuccess('Project created successfully!');
        fetchProjects();
      } else {
        setError(res.error || 'Failed to create project.');
      }
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProject = async (projectData) => {
    setLoading(true);
    try {
      const id = projectData.id || projectData._id;
      const res = await projectService.updateProject(id, projectData);
      if (res.success) {
        setShowForm(false);
        setEditingProject(null);
        setSuccess('Project updated successfully!');
        fetchProjects();
      } else {
        setError(res.error || 'Failed to update project.');
      }
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to update project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        setLoading(true);
        const res = await projectService.deleteProject(id);
        if (res.success) {
          setSuccess('Project deleted successfully!');
          fetchProjects();
        } else {
          setError(res.error || 'Failed to delete project.');
        }
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        setError('Failed to delete project. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleViewProject = (project) => {
    setSelectedProject(project);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleExport = () => {
    console.log('Exporting project data...');
    setSuccess('Projects exported successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const filteredProjects = projects.filter(project => {
    const searchLower = (searchTerm || '').toLowerCase();
    const matchesSearch = 
      (project.name || '').toLowerCase().includes(searchLower) ||
      (project.code || '').toLowerCase().includes(searchLower) ||
      (project.department || '').toLowerCase().includes(searchLower) ||
      (project.manager || '').toLowerCase().includes(searchLower) ||
      (project.description || '').toLowerCase().includes(searchLower);
    
    const matchesFilter = filter === 'all' || (project.status || '').toLowerCase().replace(' ', '') === filter;
    
    return matchesSearch && matchesFilter;
  });

  // Statistics
  const totalProjects = projects.length;
  const inProgress = projects.filter(p => p.status === 'In Progress').length;
  const completed = projects.filter(p => p.status === 'Completed').length;
  const planned = projects.filter(p => p.status === 'Planned').length;
  const onHold = projects.filter(p => p.status === 'On Hold').length;
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const avgProgress = totalProjects > 0 ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / totalProjects) : 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="project-page">
      <Container fluid>
        {/* Header Section */}
        <div className="project-header">
          <div className="header-left">
            <h2 className="page-title">Project Management</h2>
            <p className="page-subtitle">Manage all projects, tasks, and team assignments</p>
          </div>
          <div className="header-right">
            <Button 
              variant="primary" 
              className="me-2"
              onClick={() => {
                setEditingProject(null);
                setShowForm(true);
              }}
            >
              <FaPlus className="me-1" /> New Project
            </Button>
            <Button variant="outline-secondary" onClick={handleExport}>
              <FaDownload className="me-1" /> Export
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <Row className="statistics-cards mb-4">
          <Col lg={3} md={6} className="mb-3">
            <Card className="stat-card total-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon-wrapper primary">
                    <FaProjectDiagram className="stat-icon" />
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">{totalProjects}</h3>
                    <p className="stat-label">Total Projects</p>
                    <small className="stat-detail">{formatCurrency(totalBudget)} budget</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={3} md={6} className="mb-3">
            <Card className="stat-card progress-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon-wrapper info">
                    <FaChartBar className="stat-icon" />
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">{avgProgress}%</h3>
                    <p className="stat-label">Avg Progress</p>
                    <small className="stat-detail">Overall project completion</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={3} md={6} className="mb-3">
            <Card className="stat-card active-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon-wrapper success">
                    <FaCheckCircle className="stat-icon" />
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">{inProgress + completed}</h3>
                    <p className="stat-label">Active Projects</p>
                    <small className="stat-detail">{completed} completed</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={3} md={6} className="mb-3">
            <Card className="stat-card pending-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon-wrapper warning">
                    <FaClock className="stat-icon" />
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">{planned + onHold}</h3>
                    <p className="stat-label">Upcoming/Hold</p>
                    <small className="stat-detail">{planned} planned, {onHold} on hold</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Alerts */}
        {error && (
          <Alert variant="danger" onClose={() => setError('')} dismissible>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert variant="success" onClose={() => setSuccess('')} dismissible>
            {success}
          </Alert>
        )}

        {/* Project List */}
        <Card className="project-main-card">
          <Card.Body>
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-muted">Loading projects...</p>
              </div>
            ) : (
              <ProjectList 
                projects={filteredProjects}
                onView={handleViewProject}
                onEdit={handleEditProject}
                onDelete={handleDeleteProject}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filter={filter}
                setFilter={setFilter}
              />
            )}
          </Card.Body>
        </Card>

        {/* Project Form Modal */}
        <Modal 
          show={showForm} 
          onHide={() => {
            setShowForm(false);
            setEditingProject(null);
          }}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <FaProjectDiagram className="me-2" />
              {editingProject ? 'Edit Project' : 'Create New Project'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ProjectForm 
              project={editingProject}
              onSubmit={editingProject ? handleUpdateProject : handleAddProject}
              onCancel={() => {
                setShowForm(false);
                setEditingProject(null);
              }}
            />
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};

export default ProjectManagement;