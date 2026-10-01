import React, { useState } from 'react';
import {
  Container, Row, Col, Card, Table, Button, Form, Badge,
  InputGroup, Dropdown, Pagination, Modal, Alert, Spinner
} from 'react-bootstrap';
import {
  FaSearch, FaFilter, FaEye, FaTrash, FaDownload, FaSync,
  FaCheck, FaTimes, FaClock, FaUserPlus, FaEnvelope,
  FaPhone, FaFileAlt, FaUserCheck
} from 'react-icons/fa';
import './ApplicantList.css';

const ApplicantList = () => {
  const [loading, setLoading] = useState(false);
  const [applicants, setApplicants] = useState([
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', phone: '+1 234 567 8901',
      position: 'Senior Software Engineer', experience: '6 years',
      skills: ['React', 'Node.js', 'Python'], status: 'Shortlisted',
      appliedDate: '2026-01-11', avatar: 'AJ' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', phone: '+1 345 678 9012',
      position: 'Marketing Manager', experience: '4 years',
      skills: ['Digital Marketing', 'SEO'], status: 'Interview',
      appliedDate: '2026-01-13', avatar: 'BS' },
    { id: 3, name: 'Carol White', email: 'carol@example.com', phone: '+1 456 789 0123',
      position: 'Electrical Engineer', experience: '4 years',
      skills: ['AutoCAD', 'Circuit Design'], status: 'Pending',
      appliedDate: '2026-01-10', avatar: 'CW' },
    { id: 4, name: 'David Green', email: 'david@example.com', phone: '+1 567 890 1234',
      position: 'Production Supervisor', experience: '6 years',
      skills: ['Lean Manufacturing'], status: 'Rejected',
      appliedDate: '2025-12-18', avatar: 'DG' },
    { id: 5, name: 'Eva Martinez', email: 'eva@example.com', phone: '+1 678 901 2345',
      position: 'HR Coordinator', experience: '2 years',
      skills: ['Recruitment', 'Training'], status: 'Hired',
      appliedDate: '2026-01-16', avatar: 'EM' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const filtered = applicants.filter((a) => {
    const term = searchTerm.toLowerCase();
    const matches =
      a.name.toLowerCase().includes(term) ||
      a.email.toLowerCase().includes(term) ||
      a.position.toLowerCase().includes(term);
    const matchesStatus = statusFilter === 'all' || a.status.toLowerCase() === statusFilter;
    return matches && matchesStatus;
  });

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const getStatusBadge = (s) => {
    const map = {
      Pending: { v: 'secondary', i: <FaClock /> },
      Shortlisted: { v: 'info', i: <FaUserCheck /> },
      Interview: { v: 'warning', i: <FaUserPlus /> },
      Hired: { v: 'success', i: <FaCheck /> },
      Rejected: { v: 'danger', i: <FaTimes /> }
    };
    const c = map[s] || map.Pending;
    return <Badge bg={c.v} className="status-badge">{c.i} {s}</Badge>;
  };

  const handleStatusChange = (id, newStatus) => {
    setApplicants(applicants.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
  };

  const handleDelete = () => {
    setApplicants(applicants.filter((a) => a.id !== selectedApplicant.id));
    setShowDeleteModal(false);
    setSelectedApplicant(null);
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="applicant-list-page">
      <Container fluid>
        {/* Header */}
        <div className="page-header">
          <div>
            <h2 className="page-title">Applicants</h2>
            <p className="page-subtitle">Manage all job applicants</p>
          </div>
          <div className="header-right">
            <Button variant="outline-secondary" className="me-2">
              <FaSync className="me-1" /> Refresh
            </Button>
            <Button variant="outline-secondary">
              <FaDownload className="me-1" /> Export
            </Button>
          </div>
        </div>

        {/* Stats */}
        <Row className="mb-4">
          {[
            { l: 'Total', v: applicants.length, c: 'primary' },
            { l: 'Shortlisted', v: applicants.filter((a) => a.status === 'Shortlisted').length, c: 'info' },
            { l: 'Interview', v: applicants.filter((a) => a.status === 'Interview').length, c: 'warning' },
            { l: 'Hired', v: applicants.filter((a) => a.status === 'Hired').length, c: 'success' }
          ].map((s, i) => (
            <Col lg={3} md={6} key={i} className="mb-3">
              <Card className={`stat-card border-${s.c}`}>
                <Card.Body>
                  <h3 className="stat-number">{s.v}</h3>
                  <p className="stat-label">{s.l}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Table */}
        <Card className="list-card">
          <Card.Body>
            <div className="list-toolbar">
              <div className="toolbar-left">
                <InputGroup style={{ width: 300 }}>
                  <InputGroup.Text><FaSearch /></InputGroup.Text>
                  <Form.Control
                    placeholder="Search applicants..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  />
                </InputGroup>
                <Dropdown>
                  <Dropdown.Toggle variant="outline-secondary" size="sm">
                    <FaFilter className="me-1" />
                    {statusFilter === 'all' ? 'All Status' : statusFilter}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setStatusFilter('all')}>All</Dropdown.Item>
                    <Dropdown.Item onClick={() => setStatusFilter('pending')}>Pending</Dropdown.Item>
                    <Dropdown.Item onClick={() => setStatusFilter('shortlisted')}>Shortlisted</Dropdown.Item>
                    <Dropdown.Item onClick={() => setStatusFilter('interview')}>Interview</Dropdown.Item>
                    <Dropdown.Item onClick={() => setStatusFilter('hired')}>Hired</Dropdown.Item>
                    <Dropdown.Item onClick={() => setStatusFilter('rejected')}>Rejected</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>

            <div className="table-responsive mt-3">
              <Table hover className="applicant-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Applicant</th>
                    <th>Position</th>
                    <th>Experience</th>
                    <th>Skills</th>
                    <th>Status</th>
                    <th>Applied</th>
                    <th style={{ width: 220 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((a, i) => (
                    <tr key={a.id}>
                      <td>{indexOfFirst + i + 1}</td>
                      <td>
                        <div className="applicant-info">
                          <div className="applicant-avatar">{a.avatar}</div>
                          <div>
                            <div className="applicant-name">{a.name}</div>
                            <div className="applicant-email">{a.email}</div>
                          </div>
                        </div>
                      </td>
                      <td><small>{a.position}</small></td>
                      <td>{a.experience}</td>
                      <td>
                        <div className="skills-cell">
                          {a.skills.slice(0, 2).map((s, idx) => (
                            <Badge key={idx} bg="light" text="dark" className="skill-badge">{s}</Badge>
                          ))}
                          {a.skills.length > 2 && (
                            <Badge bg="light" text="dark" className="skill-badge">+{a.skills.length - 2}</Badge>
                          )}
                        </div>
                      </td>
                      <td>{getStatusBadge(a.status)}</td>
                      <td>{formatDate(a.appliedDate)}</td>
                      <td>
                        <div className="action-buttons">
                          <Button variant="outline-primary" size="sm" className="me-1"
                            onClick={() => { setSelectedApplicant(a); setShowViewModal(true); }}>
                            <FaEye />
                          </Button>
                          {a.status === 'Pending' && (
                            <Button variant="outline-info" size="sm" className="me-1"
                              onClick={() => handleStatusChange(a.id, 'Shortlisted')}>
                              <FaUserCheck />
                            </Button>
                          )}
                          {a.status === 'Shortlisted' && (
                            <Button variant="outline-warning" size="sm" className="me-1"
                              onClick={() => handleStatusChange(a.id, 'Interview')}>
                              <FaUserPlus />
                            </Button>
                          )}
                          {a.status === 'Interview' && (
                            <Button variant="outline-success" size="sm" className="me-1"
                              onClick={() => handleStatusChange(a.id, 'Hired')}>
                              <FaCheck />
                            </Button>
                          )}
                          <Button variant="outline-danger" size="sm"
                            onClick={() => { setSelectedApplicant(a); setShowDeleteModal(true); }}>
                            <FaTrash />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="d-flex justify-content-between align-items-center mt-3">
                <small className="text-muted">
                  Showing {indexOfFirst + 1} to {Math.min(indexOfLast, filtered.length)} of {filtered.length}
                </small>
                <Pagination size="sm" className="mb-0">
                  <Pagination.Prev disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)} />
                  {[...Array(Math.min(totalPages, 5))].map((_, i) => (
                    <Pagination.Item key={i + 1} active={i + 1 === currentPage}
                      onClick={() => setCurrentPage(i + 1)}>{i + 1}</Pagination.Item>
                  ))}
                  <Pagination.Next disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)} />
                </Pagination>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* View Modal */}
        <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>Applicant Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedApplicant && (
              <div>
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="detail-avatar">{selectedApplicant.avatar}</div>
                  <div>
                    <h5 className="mb-1">{selectedApplicant.name}</h5>
                    <p className="text-muted mb-1">{selectedApplicant.position}</p>
                    <p className="text-muted mb-0 small">
                      <FaEnvelope className="me-1" /> {selectedApplicant.email} |
                      <FaPhone className="ms-2 me-1" /> {selectedApplicant.phone}
                    </p>
                  </div>
                  <div className="ms-auto">{getStatusBadge(selectedApplicant.status)}</div>
                </div>
                <hr />
                <p><strong>Experience:</strong> {selectedApplicant.experience}</p>
                <p><strong>Applied On:</strong> {formatDate(selectedApplicant.appliedDate)}</p>
                <p className="mb-2"><strong>Skills:</strong></p>
                <div className="d-flex flex-wrap gap-2">
                  {selectedApplicant.skills.map((s, i) => (
                    <Badge key={i} bg="primary">{s}</Badge>
                  ))}
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
            <Button variant="success"><FaFileAlt className="me-1" /> Download Resume</Button>
          </Modal.Footer>
        </Modal>

        {/* Delete Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Delete Applicant</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete <strong>{selectedApplicant?.name}</strong>?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}><FaTrash className="me-1" /> Delete</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default ApplicantList;