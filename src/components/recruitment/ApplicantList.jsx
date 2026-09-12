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
  Modal
} from 'react-bootstrap';
import {
  FaSearch,
  FaFilter,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaEye,
  FaTrash,
  FaCheck,
  FaTimes,
  FaClock,
  FaFileAlt,
  FaFileExport,
  FaPrint,
  FaUserCheck,
  FaUserTimes,
  FaUserClock
} from 'react-icons/fa';
import './ApplicantList.css';

const ApplicantList = ({ 
  applicants, 
  onUpdateStatus, 
  onDelete,
  selectedJob,
  searchTerm,
  setSearchTerm,
  filter,
  setFilter
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState('appliedDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedRows, setSelectedRows] = useState([]);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

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

  // Filter applicants
  const filteredApplicants = applicants.filter(applicant => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      applicant.name.toLowerCase().includes(searchLower) ||
      applicant.position.toLowerCase().includes(searchLower) ||
      applicant.email.toLowerCase().includes(searchLower) ||
      applicant.skills.some(skill => skill.toLowerCase().includes(searchLower));
    
    const matchesFilter = filter === 'all' || applicant.status.toLowerCase() === filter;
    
    const matchesJob = !selectedJob || applicant.position === selectedJob.title;
    
    return matchesSearch && matchesFilter && matchesJob;
  });

  // Sort applicants
  const sortedApplicants = [...filteredApplicants].sort((a, b) => {
    let aVal = a[sortField] || '';
    let bVal = b[sortField] || '';
    
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();
    
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalItems = sortedApplicants.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentData = sortedApplicants.slice(startIndex, endIndex);

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
      'Pending': { variant: 'secondary', icon: <FaClock /> },
      'Shortlisted': { variant: 'info', icon: <FaUserClock /> },
      'Interview': { variant: 'warning', icon: <FaUserCheck /> },
      'Hired': { variant: 'success', icon: <FaCheck /> },
      'Rejected': { variant: 'danger', icon: <FaTimes /> }
    };
    const { variant, icon } = config[status] || config['Pending'];
    return (
      <Badge bg={variant} className="status-badge">
        {icon} {status}
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

  const handleViewResume = (applicant) => {
    setSelectedApplicant(applicant);
    setShowResumeModal(true);
  };

  return (
    <div className="applicant-list-wrapper">
      {/* Toolbar */}
      <div className="list-toolbar">
        <div className="toolbar-left">
          <InputGroup style={{ width: '300px' }}>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search applicants..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </InputGroup>
          
          <Dropdown className="me-2">
            <Dropdown.Toggle variant="outline-secondary" size="sm">
              <FaFilter className="me-1" /> 
              {filter === 'all' ? 'All Status' : filter}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleFilter('all')}>
                All Status
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleFilter('pending')}>
                <FaClock className="text-secondary me-1" /> Pending
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleFilter('shortlisted')}>
                <FaUserClock className="text-info me-1" /> Shortlisted
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleFilter('interview')}>
                <FaUserCheck className="text-warning me-1" /> Interview
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleFilter('hired')}>
                <FaCheck className="text-success me-1" /> Hired
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleFilter('rejected')}>
                <FaTimes className="text-danger me-1" /> Rejected
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

      {/* Applicant Count */}
      <div className="applicant-count">
        <span>
          Showing {startIndex + 1} to {endIndex} of {totalItems} applicants
        </span>
        {selectedJob && (
          <span className="ms-3">
            <Badge bg="primary">
              {selectedJob.title}
            </Badge>
          </span>
        )}
      </div>

      {/* Table */}
      <div className="table-responsive">
        <Table hover striped className="applicant-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>
                <Form.Check
                  type="checkbox"
                  checked={currentData.length > 0 && selectedRows.length === currentData.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th onClick={() => handleSort('name')} style={{ cursor: 'pointer', minWidth: '160px' }}>
                Applicant {getSortIcon('name')}
              </th>
              <th onClick={() => handleSort('position')} style={{ cursor: 'pointer' }}>
                Position {getSortIcon('position')}
              </th>
              <th onClick={() => handleSort('experience')} style={{ cursor: 'pointer' }}>
                Experience {getSortIcon('experience')}
              </th>
              <th onClick={() => handleSort('skills')} style={{ cursor: 'pointer' }}>
                Skills {getSortIcon('skills')}
              </th>
              <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                Status {getSortIcon('status')}
              </th>
              <th style={{ width: '200px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((applicant) => (
                <tr key={applicant.id} className={selectedRows.includes(applicant.id) ? 'table-active' : ''}>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={selectedRows.includes(applicant.id)}
                      onChange={() => handleSelectRow(applicant.id)}
                    />
                  </td>
                  <td>
                    <div className="applicant-info">
                      <div className="applicant-avatar">
                        {applicant.avatar || applicant.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="applicant-details">
                        <div className="applicant-name">{applicant.name}</div>
                        <div className="applicant-email">{applicant.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <Badge bg="secondary" className="position-badge">
                      {applicant.position}
                    </Badge>
                  </td>
                  <td>{applicant.experience}</td>
                  <td>
                    <div className="skills-list">
                      {applicant.skills.slice(0, 2).map((skill, index) => (
                        <Badge key={index} bg="light" text="dark" className="skill-badge">
                          {skill}
                        </Badge>
                      ))}
                      {applicant.skills.length > 2 && (
                        <Badge bg="light" text="dark" className="skill-badge">
                          +{applicant.skills.length - 2}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td>{getStatusBadge(applicant.status)}</td>
                  <td>
                    <div className="action-buttons">
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>View Resume</Tooltip>}
                      >
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          className="me-1"
                          onClick={() => handleViewResume(applicant)}
                        >
                          <FaFileAlt />
                        </Button>
                      </OverlayTrigger>
                      
                      {applicant.status === 'Pending' && (
                        <>
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Shortlist</Tooltip>}
                          >
                            <Button 
                              variant="outline-info" 
                              size="sm" 
                              className="me-1"
                              onClick={() => onUpdateStatus(applicant.id, 'Shortlisted')}
                            >
                              <FaUserClock />
                            </Button>
                          </OverlayTrigger>
                        </>
                      )}
                      
                      {applicant.status === 'Shortlisted' && (
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>Schedule Interview</Tooltip>}
                        >
                          <Button 
                            variant="outline-warning" 
                            size="sm" 
                            className="me-1"
                            onClick={() => onUpdateStatus(applicant.id, 'Interview')}
                          >
                            <FaUserCheck />
                          </Button>
                        </OverlayTrigger>
                      )}
                      
                      {applicant.status === 'Interview' && (
                        <>
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Hire</Tooltip>}
                          >
                            <Button 
                              variant="outline-success" 
                              size="sm" 
                              className="me-1"
                              onClick={() => onUpdateStatus(applicant.id, 'Hired')}
                            >
                              <FaCheck />
                            </Button>
                          </OverlayTrigger>
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Reject</Tooltip>}
                          >
                            <Button 
                              variant="outline-danger" 
                              size="sm" 
                              className="me-1"
                              onClick={() => onUpdateStatus(applicant.id, 'Rejected')}
                            >
                              <FaTimes />
                            </Button>
                          </OverlayTrigger>
                        </>
                      )}
                      
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Delete</Tooltip>}
                      >
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => onDelete(applicant.id)}
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
                <td colSpan="7" className="text-center py-4">
                  <div className="empty-state">
                    <p className="text-muted mb-2">No applicants found</p>
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

      {/* Resume View Modal */}
      <Modal 
        show={showResumeModal} 
        onHide={() => setShowResumeModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FaFileAlt className="me-2" />
            Resume - {selectedApplicant?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedApplicant && (
            <div className="resume-view">
              <div className="resume-header">
                <div className="resume-avatar-large">
                  {selectedApplicant.avatar || selectedApplicant.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="resume-info">
                  <h4>{selectedApplicant.name}</h4>
                  <p className="text-muted">{selectedApplicant.position}</p>
                  <p className="text-muted">{selectedApplicant.email} | {selectedApplicant.phone}</p>
                </div>
              </div>

              <hr />

              <div className="resume-section">
                <h6>Experience</h6>
                <p>{selectedApplicant.experience}</p>
              </div>

              <div className="resume-section">
                <h6>Skills</h6>
                <div className="skills-list">
                  {selectedApplicant.skills.map((skill, index) => (
                    <Badge key={index} bg="primary" className="skill-badge-large">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="resume-section">
                <h6>Status</h6>
                {getStatusBadge(selectedApplicant.status)}
              </div>

              <div className="resume-section">
                <h6>Applied Date</h6>
                <p>{formatDate(selectedApplicant.appliedDate)}</p>
              </div>

              <div className="resume-section">
                <h6>Resume File</h6>
                <Button variant="outline-primary" size="sm">
                  <FaFileAlt className="me-1" /> Download {selectedApplicant.resume}
                </Button>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowResumeModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => setShowResumeModal(false)}>
            <FaFileAlt className="me-1" /> Download Resume
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ApplicantList;