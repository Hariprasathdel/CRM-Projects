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

  // Mock data - In real app, this would come from API
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockProjects = [
        {
          id: 1,
          name: 'E-commerce Platform',
          code: 'ECP-2026',
          description: 'Building a scalable e-commerce platform with modern tech stack',
          department: 'Software',
          manager: 'John Doe',
          startDate: '2026-01-15',
          endDate: '2026-06-30',
          status: 'In Progress',
          priority: 'High',
          budget: 150000,
          progress: 65,
          teamMembers: ['John Doe', 'Robert Brown', 'Emily White'],
          tasks: 45,
          completedTasks: 29,
          avatar: 'EC'
        },
        {
          id: 2,
          name: 'Brand Campaign',
          code: 'BC-2026',
          description: 'Digital marketing campaign for brand awareness',
          department: 'Marketing',
          manager: 'Jane Smith',
          startDate: '2026-02-01',
          endDate: '2026-04-30',
          status: 'In Progress',
          priority: 'Medium',
          budget: 75000,
          progress: 40,
          teamMembers: ['Jane Smith', 'Sarah Johnson', 'Mike Wilson'],
          tasks: 30,
          completedTasks: 12,
          avatar: 'BC'
        },
        {
          id: 3,
          name: 'Factory Automation',
          code: 'FA-2026',
          description: 'Automating manufacturing processes with IoT',
          department: 'Electrical',
          manager: 'Mike Johnson',
          startDate: '2026-01-10',
          endDate: '2026-08-15',
          status: 'In Progress',
          priority: 'High',
          budget: 200000,
          progress: 30,
          teamMembers: ['Mike Johnson', 'David Lee', 'Anna Martinez'],
          tasks: 50,
          completedTasks: 15,
          avatar: 'FA'
        },
        {
          id: 4,
          name: 'Production Optimization',
          code: 'PO-2026',
          description: 'Optimizing production processes for efficiency',
          department: 'Production',
          manager: 'Sarah Williams',
          startDate: '2026-01-20',
          endDate: '2026-05-15',
          status: 'Completed',
          priority: 'Medium',
          budget: 100000,
          progress: 100,
          teamMembers: ['Sarah Williams', 'James Brown', 'Laura White'],
          tasks: 35,
          completedTasks: 35,
          avatar: 'PO'
        },
        {
          id: 5,
          name: 'Employee Onboarding System',
          code: 'EOS-2026',
          description: 'Digital onboarding system for new employees',
          department: 'HR',
          manager: 'Emily Davis',
          startDate: '2026-02-15',
          endDate: '2026-07-31',
          status: 'Planned',
          priority: 'Low',
          budget: 60000,
          progress: 0,
          teamMembers: ['Emily Davis', 'Karen Miller', 'Jason Taylor'],
          tasks: 25,
          completedTasks: 0,
          avatar: 'EO'
        },
        {
          id: 6,
          name: 'Financial Planning System',
          code: 'FPS-2026',
          description: 'Comprehensive financial planning and analysis system',
          department: 'Finance',
          manager: 'Robert Brown',
          startDate: '2026-01-05',
          endDate: '2026-06-30',
          status: 'On Hold',
          priority: 'High',
          budget: 120000,
          progress: 25,
          teamMembers: ['Robert Brown', 'Linda Taylor', 'Steven King'],
          tasks: 40,
          completedTasks: 10,
          avatar: 'FP'
        }
      ];

      setProjects(mockProjects);
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
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newProject = {
        ...projectData,
        id: projects.length + 1,
        progress: 0,
        tasks: 0,
        completedTasks: 0,
        avatar: projectData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
      };
      
      setProjects([newProject, ...projects]);
      setShowForm(false);
      setSuccess('Project created successfully!');
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
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedProjects = projects.map(project => 
        project.id === projectData.id ? { ...project, ...projectData } : project
      );
      
      setProjects(updatedProjects);
      setShowForm(false);
      setEditingProject(null);
      setSuccess('Project updated successfully!');
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
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setProjects(projects.filter(project => project.id !== id));
        setSuccess('Project deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        setError('Failed to delete project. Please try again.');
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
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      project.name.toLowerCase().includes(searchLower) ||
      project.code.toLowerCase().includes(searchLower) ||
      project.department.toLowerCase().includes(searchLower) ||
      project.manager.toLowerCase().includes(searchLower) ||
      project.description.toLowerCase().includes(searchLower);
    
    const matchesFilter = filter === 'all' || project.status.toLowerCase().replace(' ', '') === filter;
    
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