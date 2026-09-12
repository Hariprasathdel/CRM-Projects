import React, { useState } from 'react';
import {
  Table,
  Form,
  InputGroup,
  Button,
  Dropdown,
  Pagination,
  Badge,
  OverlayTrigger,
  Tooltip,
  ProgressBar,
  Modal
} from 'react-bootstrap';
import {
  FaSearch,
  FaFilter,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaEye,
  FaEdit,
  FaTrash,
  FaFileExport,
  FaPrint,
  FaProjectDiagram,
  FaUsers,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle
} from 'react-icons/fa';
import './ProjectList.css';

const ProjectList = ({ 
  projects, 
  onView, 
  onEdit, 
  onDelete,
  searchTerm,
  setSearchTerm,
  filter,
  setFilter
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedRows, setSelectedRows] = useState([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewProject, setViewProject] = useState(null);

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Handle filter
  const handleFilter = (value) => {
    setFilter(value);
    setCurrentPage(1);
  };

  // Handle sort
  const sortedProjects = [...projects].sort((a, b) => {
    let aVal = a[sortField] || '';
    let bVal = b[sortField] || '';
    
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();
    
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalItems = sortedProjects.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentData = sortedProjects.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(currentData.map(item => item.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort className="sort-icon" />;
    return sortDirection === 'asc' 
      ? <FaSortUp className="sort-icon active" />
      : <FaSortDown className="sort-icon active" />;
  };

  const getStatusBadge = (status) => {
    const config = {
      'In Progress': { variant: 'info', icon: <FaClock /> },
      'Completed': { variant: 'success', icon: <FaCheckCircle /> },
      'Planned': { variant: 'secondary', icon: <FaCalendarAlt /> },
      'On Hold': { variant: 'warning', icon: <FaExclamationTriangle /> }
    };
    const { variant, icon } = config[status] || config['Planned'];
    return (
      <Badge bg={variant} className="status-badge">
        {icon} {status}
      </Badge>
    );
  };

  const getPriorityBadge = (priority) => {
    const config = {
      High: 'danger',
      Medium: 'warning',
      Low: 'info'
    };
    return (
      <Badge bg={config[priority] || 'secondary'} className="priority-badge">
        {priority}
      </Badge>
    );
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'success';
    if (progress >= 50) return 'info';
    if (progress >= 30) return 'warning';
    return 'danger';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleViewClick = (project) => {
    setViewProject(project);
    setShowViewModal(true);
  };

  return (
    <div className="project-list-wrapper">
      {/* Toolbar */}
      <div className="list-toolbar">
        <div className="toolbar-left">
          <InputGroup style={{ width: '300px' }}>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search by name, code, manager..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </InputGroup>
          
          <Dropdown className="me-2">
            <Dropdown.Toggle variant="outline-secondary" size="sm">
              <FaFilter className="me-1" /> 
              {filter === 'all' ? 'All Status' : filter.replace(/([A-Z])/g, ' $1').trim()}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleFilter('all')}>
                All Status
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleFilter('inprogress')}>
                <FaClock className="text-info me-1" /> In Progress
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleFilter('completed')}>
                <FaCheckCircle className="text-success me-1" /> Completed
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleFilter('planned')}>
                <FaCalendarAlt className="text-secondary me-1" /> Planned
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleFilter('onhold')}>
                <FaExclamationTriangle className="text-warning me-1" /> On Hold
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          
          <div className="selection-info">
            {selectedRows.length > 0 && (
              <span className="text-muted">
                {selectedRows.length} item{selectedRows.length > 1 ? 's' : ''} selected
              </span>
            )}
          </div>
        </div>

        <div className="toolbar-right">
          <Dropdown className="me-2">
            <Dropdown.Toggle variant="outline-secondary" size="sm">
              <FaFileExport className="me-1" /> Export
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>Export as CSV</Dropdown.Item>
              <Dropdown.Item>Export as Excel</Dropdown.Item>
              <Dropdown.Item>Export as PDF</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Button variant="outline-secondary" size="sm" onClick={() => window.print()}>
            <FaPrint className="me-1" /> Print
          </Button>
        </div>
      </div>

      {/* Project Count */}
      <div className="project-count">
        <span>
          Showing {startIndex + 1} to {endIndex} of {totalItems} projects
        </span>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <Table hover striped className="project-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>
                <Form.Check
                  type="checkbox"
                  checked={currentData.length > 0 && selectedRows.length === currentData.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th onClick={() => handleSort('code')} style={{ cursor: 'pointer', width: '100px' }}>
                Code {getSortIcon('code')}
              </th>
              <th onClick={() => handleSort('name')} style={{ cursor: 'pointer', minWidth: '180px' }}>
                Project {getSortIcon('name')}
              </th>
              <th onClick={() => handleSort('department')} style={{ cursor: 'pointer' }}>
                Department {getSortIcon('department')}
              </th>
              <th onClick={() => handleSort('manager')} style={{ cursor: 'pointer' }}>
                Manager {getSortIcon('manager')}
              </th>
              <th onClick={() => handleSort('progress')} style={{ cursor: 'pointer', width: '140px' }}>
                Progress {getSortIcon('progress')}
              </th>
              <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                Status {getSortIcon('status')}
              </th>
              <th style={{ width: '140px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((project) => (
                <tr key={project.id} className={selectedRows.includes(project.id) ? 'table-active' : ''}>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={selectedRows.includes(project.id)}
                      onChange={() => handleSelectRow(project.id)}
                    />
                  </td>
                  <td>
                    <Badge bg="primary" className="code-badge">
                      {project.code}
                    </Badge>
                  </td>
                  <td>
                    <div className="project-info">
                      <div className="project-icon-wrapper">
                        <FaProjectDiagram className="project-icon" />
                      </div>
                      <div className="project-details">
                        <div className="project-name">{project.name}</div>
                        <div className="project-description">{project.description.substring(0, 50)}...</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <Badge bg="secondary" className="department-badge">
                      {project.department}
                    </Badge>
                  </td>
                  <td>{project.manager}</td>
                  <td>
                    <div className="progress-wrapper">
                      <ProgressBar 
                        now={project.progress} 
                        variant={getProgressColor(project.progress)}
                        className="project-progress"
                        style={{ height: '8px' }}
                      />
                      <span className="progress-label">{project.progress}%</span>
                    </div>
                    <div className="task-info">
                      <small>{project.completedTasks}/{project.tasks} tasks</small>
                    </div>
                  </td>
                  <td>
                    {getStatusBadge(project.status)}
                    <div className="priority-badge-wrapper">
                      {getPriorityBadge(project.priority)}
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>View Details</Tooltip>}
                      >
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          className="me-1"
                          onClick={() => handleViewClick(project)}
                        >
                          <FaEye />
                        </Button>
                      </OverlayTrigger>
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Edit</Tooltip>}
                      >
                        <Button 
                          variant="outline-warning" 
                          size="sm" 
                          className="me-1"
                          onClick={() => onEdit(project)}
                        >
                          <FaEdit />
                        </Button>
                      </OverlayTrigger>
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Delete</Tooltip>}
                      >
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => onDelete(project.id)}
                        >
                          <FaTrash />
                        </Button>
                      </OverlayTrigger>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  <div className="empty-state">
                    <p className="text-muted mb-2">No projects found</p>
                    <Button variant="primary" size="sm">
                      Create New Project
                    </Button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="table-footer">
        <div className="footer-left">
          <span className="text-muted">
            Showing {startIndex + 1} to {endIndex} of {totalItems} entries
          </span>
        </div>

        <div className="footer-right">
          <div className="items-per-page">
            <Form.Label className="me-2 mb-0">Show:</Form.Label>
            <Form.Select
              size="sm"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              style={{ width: '70px' }}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </Form.Select>
          </div>

          <Pagination size="sm" className="mb-0">
            <Pagination.First 
              onClick={() => handlePageChange(1)} 
              disabled={currentPage === 1}
            />
            <Pagination.Prev 
              onClick={() => handlePageChange(currentPage - 1)} 
              disabled={currentPage === 1}
            />
            
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <Pagination.Item
                  key={pageNum}
                  active={pageNum === currentPage}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </Pagination.Item>
              );
            })}
            
            <Pagination.Next 
              onClick={() => handlePageChange(currentPage + 1)} 
              disabled={currentPage === totalPages}
            />
            <Pagination.Last 
              onClick={() => handlePageChange(totalPages)} 
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>
      </div>

      {/* View Project Modal */}
      <Modal 
        show={showViewModal} 
        onHide={() => setShowViewModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FaProjectDiagram className="me-2" />
            Project Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewProject && (
            <div className="view-project-content">
              <div className="view-header">
                <div className="view-icon">
                  <FaProjectDiagram />
                </div>
                <div className="view-title">
                  <h4>{viewProject.name}</h4>
                  <Badge bg="primary" className="view-code">{viewProject.code}</Badge>
                  {getStatusBadge(viewProject.status)}
                  {getPriorityBadge(viewProject.priority)}
                </div>
              </div>

              <div className="view-description">
                <p>{viewProject.description}</p>
              </div>

              <div className="view-grid">
                <div className="view-item">
                  <span className="view-label">Department</span>
                  <span className="view-value">{viewProject.department}</span>
                </div>
                <div className="view-item">
                  <span className="view-label">Manager</span>
                  <span className="view-value">{viewProject.manager}</span>
                </div>
                <div className="view-item">
                  <span className="view-label">Start Date</span>
                  <span className="view-value">{formatDate(viewProject.startDate)}</span>
                </div>
                <div className="view-item">
                  <span className="view-label">End Date</span>
                  <span className="view-value">{formatDate(viewProject.endDate)}</span>
                </div>
                <div className="view-item">
                  <span className="view-label">Budget</span>
                  <span className="view-value">{formatCurrency(viewProject.budget)}</span>
                </div>
                <div className="view-item">
                  <span className="view-label">Progress</span>
                  <span className="view-value">
                    <ProgressBar 
                      now={viewProject.progress} 
                      variant={getProgressColor(viewProject.progress)}
                      style={{ height: '8px', width: '100%' }}
                    />
                    <span className="ms-2">{viewProject.progress}%</span>
                  </span>
                </div>
              </div>

              <div className="view-team">
                <h6>
                  <FaUsers className="me-2" />
                  Team Members ({viewProject.teamMembers?.length || 0})
                </h6>
                <div className="team-members">
                  {viewProject.teamMembers?.map((member, index) => (
                    <Badge key={index} bg="secondary" className="member-badge">
                      {member}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="view-tasks">
                <h6>
                  {/* <FaTasks className="me-2" /> */}
                  Tasks Progress
                </h6>
                <div className="task-stats">
                  <span className="task-stat">
                    <FaCheckCircle className="text-success me-1" />
                    Completed: {viewProject.completedTasks}
                  </span>
                  <span className="task-stat">
                    <FaClock className="text-warning me-1" />
                    Remaining: {viewProject.tasks - viewProject.completedTasks}
                  </span>
                  <span className="task-stat">
                    <FaProjectDiagram className="text-info me-1" />
                    Total: {viewProject.tasks}
                  </span>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
          <Button 
            variant="primary" 
            onClick={() => {
              setShowViewModal(false);
              onEdit(viewProject);
            }}
          >
            <FaEdit className="me-1" /> Edit Project
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProjectList;