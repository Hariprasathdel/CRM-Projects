import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Badge,
  InputGroup,
  Form,
  Dropdown,
  Pagination,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';
import {
  FaSearch,
  FaFilter,
  FaEye,
  FaEdit,
  FaTrash,
  FaUsers,
  FaCalendarAlt,
  FaMapMarker,
  FaClock,
  FaDollarSign,
  FaFileExport,
  FaPrint
} from 'react-icons/fa';
import './JobPostings.css';

const JobPostings = ({ 
  jobs, 
  onViewApplicants, 
  onEdit, 
  onDelete,
  setShowForm,
  searchTerm,
  setSearchTerm,
  filter,
  setFilter
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

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

  // Filter and search
  const filteredJobs = jobs.filter(job => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      job.title.toLowerCase().includes(searchLower) ||
      job.department.toLowerCase().includes(searchLower) ||
      job.location.toLowerCase().includes(searchLower);
    
    const matchesFilter = filter === 'all' || job.status.toLowerCase() === filter;
    
    return matchesSearch && matchesFilter;
  });

  // Pagination
  const totalItems = filteredJobs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentData = filteredJobs.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const getStatusBadge = (status) => {
    return (
      <Badge bg={status === 'Active' ? 'success' : 'secondary'} className="status-badge">
        {status}
      </Badge>
    );
  };

  const getTypeBadge = (type) => {
    const config = {
      'Full-time': 'primary',
      'Part-time': 'info',
      'Contract': 'warning',
      'Internship': 'secondary'
    };
    return (
      <Badge bg={config[type] || 'secondary'} className="type-badge">
        {type}
      </Badge>
    );
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="job-postings-wrapper">
      {/* Toolbar */}
      <div className="list-toolbar">
        <div className="toolbar-left">
          <InputGroup style={{ width: '300px' }}>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </InputGroup>
          
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" size="sm">
              <FaFilter className="me-1" /> 
              {filter === 'all' ? 'All Status' : filter}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleFilter('all')}>
                All Status
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleFilter('active')}>
                Active
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleFilter('closed')}>
                Closed
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <div className="toolbar-right">
          <Button variant="outline-secondary" size="sm" className="me-2">
            <FaFileExport className="me-1" /> Export
          </Button>
          <Button variant="outline-secondary" size="sm" onClick={() => window.print()}>
            <FaPrint className="me-1" /> Print
          </Button>
        </div>
      </div>

      {/* Job Cards Grid */}
      <Row className="job-cards">
        {currentData.length > 0 ? (
          currentData.map((job) => (
            <Col lg={6} xl={4} key={job.id} className="mb-4">
              <Card className="job-card">
                <Card.Body>
                  <div className="job-card-header">
                    <div className="job-avatar">
                      {job.avatar || job.title.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                    <div className="job-title-wrapper">
                      <h5 className="job-title">{job.title}</h5>
                      <div className="job-meta">
                        <span className="job-department">{job.department}</span>
                        {getStatusBadge(job.status)}
                      </div>
                    </div>
                  </div>

                  <div className="job-details">
                    <div className="job-detail-item">
                      <FaMapMarker className="detail-icon" />
                      <span>{job.location}</span>
                    </div>
                    <div className="job-detail-item">
                      <FaClock className="detail-icon" />
                      <span>{job.type}</span>
                      {getTypeBadge(job.type)}
                    </div>
                    <div className="job-detail-item">
                      <FaDollarSign className="detail-icon" />
                      <span>{job.salary}</span>
                    </div>
                    <div className="job-detail-item">
                      <FaCalendarAlt className="detail-icon" />
                      <span>Posted: {formatDate(job.postedDate)}</span>
                    </div>
                    <div className="job-detail-item">
                      <FaUsers className="detail-icon" />
                      <span>{job.applicants} applicants</span>
                    </div>
                  </div>

                  <div className="job-description">
                    <p className="text-muted">{job.description.substring(0, 100)}...</p>
                  </div>

                  <div className="job-requirements">
                    {job.requirements.slice(0, 3).map((req, index) => (
                      <Badge key={index} bg="light" text="dark" className="requirement-badge">
                        {req}
                      </Badge>
                    ))}
                    {job.requirements.length > 3 && (
                      <Badge bg="light" text="dark" className="requirement-badge">
                        +{job.requirements.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <div className="job-card-actions">
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => onViewApplicants(job)}
                    >
                      <FaUsers className="me-1" /> View Applicants
                    </Button>
                    <Button 
                      variant="outline-warning" 
                      size="sm"
                      onClick={() => onEdit(job)}
                    >
                      <FaEdit />
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => onDelete(job.id)}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col xs={12}>
            <div className="empty-state text-center py-5">
              <p className="text-muted">No job postings found</p>
              <Button variant="primary" onClick={() => setShowForm(true)}>
                Create New Job Posting
              </Button>
            </div>
          </Col>
        )}
      </Row>

      {/* Pagination */}
      {totalItems > 0 && (
        <div className="table-footer">
          <div className="footer-left">
            <span className="text-muted">
              Showing {startIndex + 1} to {endIndex} of {totalItems} jobs
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
                <option value="3">3</option>
                <option value="6">6</option>
                <option value="9">9</option>
                <option value="12">12</option>
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
      )}
    </div>
  );
};

export default JobPostings;