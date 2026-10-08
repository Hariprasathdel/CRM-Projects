import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Table, Button, Form, Badge,
  InputGroup, Dropdown, Pagination, Modal, Alert, Spinner
} from 'react-bootstrap';
import {
  FaSearch, FaFilter, FaEye, FaTrash, FaDownload, FaSync,
  FaCheck, FaTimes, FaClock, FaUserPlus, FaEnvelope,
  FaPhone, FaFileAlt, FaUserCheck
} from 'react-icons/fa';
import recruitmentService from '../../services/recruitmentService';
import './ApplicantList.css';

const ApplicantList = ({
  applicants: propApplicants,
  onUpdateStatus,
  onDelete,
  selectedJob,
  searchTerm: parentSearchTerm,
  setSearchTerm: parentSetSearchTerm,
  filter: parentFilter,
  setFilter: parentSetFilter
}) => {
  const [loading, setLoading] = useState(false);
  const [internalApplicants, setInternalApplicants] = useState([]);
  const [searchTerm, setSearchTerm] = useState(parentSearchTerm || '');
  const [statusFilter, setStatusFilter] = useState(parentFilter || 'all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch applicants from MongoDB when not provided by parent
  useEffect(() => {
    if (!propApplicants || propApplicants.length === 0) {
      fetchApplicants();
    }
  }, [propApplicants]);

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const res = await recruitmentService.getAllApplicants();
      if (res.success && Array.isArray(res.data?.data || res.data)) {
        const list = res.data?.data || res.data;
        const normalized = list.map((a) => {
          const rawStatus = a.status || 'new';
          const displayStatus = 
            rawStatus === 'new' ? 'Pending' :
            rawStatus === 'screening' ? 'Pending' :
            rawStatus === 'shortlisted' ? 'Shortlisted' :
            rawStatus === 'interview_scheduled' || rawStatus === 'interviewed' || rawStatus === 'technical_round' ? 'Interview' :
            rawStatus === 'hired' ? 'Hired' :
            rawStatus === 'rejected' ? 'Rejected' :
            rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1);

          return {
            id: a._id || a.id,
            _id: a._id || a.id,
            name: a.fullName || `${a.firstName || ''} ${a.lastName || ''}`.trim() || 'Candidate',
            email: a.email || '',
            phone: a.phone || '',
            position: a.jobTitle || a.jobId?.jobTitle || a.position || 'Software Engineer',
            jobId: a.jobId?._id || a.jobId || '',
            experience: `${a.totalExperience || 3} years`,
            skills: Array.isArray(a.skills) && a.skills.length > 0 ? a.skills : ['Communication', 'Teamwork'],
            status: displayStatus,
            appliedDate: a.appliedDate ? new Date(a.appliedDate).toISOString().split('T')[0] : '2026-01-10',
            avatar: ((a.firstName ? a.firstName[0] : '') + (a.lastName ? a.lastName[0] : 'C')).toUpperCase() || 'AJ',
            rating: a.rating || 4.0
          };
        });
        setInternalApplicants(normalized);
      }
    } catch (err) {
      console.error('Error fetching applicants:', err);
      setError('Failed to load applicants from database.');
    } finally {
      setLoading(false);
    }
  };

  const applicants = propApplicants && propApplicants.length > 0 ? propApplicants : internalApplicants;

  // Filter logic
  const filtered = applicants.filter((a) => {
    const term = (parentSearchTerm !== undefined ? parentSearchTerm : searchTerm).toLowerCase();
    const activeFilter = parentFilter !== undefined ? parentFilter : statusFilter;
    
    // Filter by selected job if specified
    if (selectedJob) {
      const jobMatch = (a.position && a.position.toLowerCase().includes(selectedJob.title.toLowerCase())) ||
                       (a.jobId && (a.jobId === selectedJob.id || a.jobId === selectedJob._id));
      if (!jobMatch) return false;
    }

    const matches =
      (a.name && a.name.toLowerCase().includes(term)) ||
      (a.email && a.email.toLowerCase().includes(term)) ||
      (a.position && a.position.toLowerCase().includes(term));
    const matchesStatus = activeFilter === 'all' || (a.status && a.status.toLowerCase() === activeFilter.toLowerCase());
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

  const handleStatusChange = async (id, newStatus) => {
    if (onUpdateStatus) {
      onUpdateStatus(id, newStatus);
    } else {
      try {
        const res = await recruitmentService.updateApplicantStatus(id, newStatus);
        if (res.success) {
          setInternalApplicants((prev) =>
            prev.map((a) => (a.id === id || a._id === id ? { ...a, status: newStatus } : a))
          );
          setSuccess(`Applicant marked as ${newStatus}!`);
          setTimeout(() => setSuccess(''), 3000);
        } else {
          setError('Failed to update applicant status.');
        }
      } catch (err) {
        setError('Failed to update applicant status.');
      }
    }
  };

  const handleDelete = async () => {
    if (!selectedApplicant) return;
    const id = selectedApplicant.id || selectedApplicant._id;
    if (onDelete) {
      onDelete(id);
    } else {
      try {
        const res = await recruitmentService.deleteApplicant(id);
        if (res.success) {
          setInternalApplicants((prev) => prev.filter((a) => a.id !== id && a._id !== id));
          setSuccess('Applicant deleted successfully!');
          setTimeout(() => setSuccess(''), 3000);
        } else {
          setError('Failed to delete applicant from MongoDB.');
        }
      } catch (err) {
        setError('Failed to delete applicant.');
      }
    }
    setShowDeleteModal(false);
    setSelectedApplicant(null);
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';

  return (
    <div className="applicant-list-page">
      <Container fluid>
        {/* Header (Only on standalone page) */}
        {!propApplicants && (
          <div className="page-header mb-4">
            <div>
              <h2 className="page-title">Applicants Pipeline</h2>
              <p className="page-subtitle">Manage all active candidates stored in MongoDB</p>
            </div>
            <div className="header-right">
              <Button variant="outline-primary" className="me-2" onClick={fetchApplicants}>
                <FaSync className="me-1" /> Refresh
              </Button>
            </div>
          </div>
        )}

        {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
        {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

        {selectedJob && (
          <Alert variant="info" className="mb-3 d-flex justify-content-between align-items-center">
            <span>Filtering applicants for job: <strong>{selectedJob.title}</strong></span>
          </Alert>
        )}

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
              <div className="toolbar-left d-flex gap-2">
                <InputGroup style={{ width: 300 }}>
                  <InputGroup.Text><FaSearch /></InputGroup.Text>
                  <Form.Control
                    placeholder="Search applicants..."
                    value={parentSearchTerm !== undefined ? parentSearchTerm : searchTerm}
                    onChange={(e) => {
                      if (parentSetSearchTerm) parentSetSearchTerm(e.target.value);
                      else setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </InputGroup>
                <Dropdown>
                  <Dropdown.Toggle variant="outline-secondary" size="sm">
                    <FaFilter className="me-1" />
                    {(parentFilter !== undefined ? parentFilter : statusFilter) === 'all'
                      ? 'All Status'
                      : (parentFilter !== undefined ? parentFilter : statusFilter)}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => parentSetFilter ? parentSetFilter('all') : setStatusFilter('all')}>All</Dropdown.Item>
                    <Dropdown.Item onClick={() => parentSetFilter ? parentSetFilter('pending') : setStatusFilter('pending')}>Pending</Dropdown.Item>
                    <Dropdown.Item onClick={() => parentSetFilter ? parentSetFilter('shortlisted') : setStatusFilter('shortlisted')}>Shortlisted</Dropdown.Item>
                    <Dropdown.Item onClick={() => parentSetFilter ? parentSetFilter('interview') : setStatusFilter('interview')}>Interview</Dropdown.Item>
                    <Dropdown.Item onClick={() => parentSetFilter ? parentSetFilter('hired') : setStatusFilter('hired')}>Hired</Dropdown.Item>
                    <Dropdown.Item onClick={() => parentSetFilter ? parentSetFilter('rejected') : setStatusFilter('rejected')}>Rejected</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-muted">Loading applicants from MongoDB...</p>
              </div>
            ) : (
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
                    {currentItems.length > 0 ? (
                      currentItems.map((a, i) => (
                        <tr key={a.id || a._id || i}>
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
                          <td><small className="fw-semibold text-primary">{a.position}</small></td>
                          <td>{a.experience}</td>
                          <td>
                            <div className="skills-cell">
                              {a.skills && a.skills.slice(0, 2).map((s, idx) => (
                                <Badge key={idx} bg="light" text="dark" className="skill-badge">{s}</Badge>
                              ))}
                              {a.skills && a.skills.length > 2 && (
                                <Badge bg="light" text="dark" className="skill-badge">+{a.skills.length - 2}</Badge>
                              )}
                            </div>
                          </td>
                          <td>{getStatusBadge(a.status)}</td>
                          <td>{formatDate(a.appliedDate)}</td>
                          <td>
                            <div className="action-buttons">
                              <Button variant="outline-primary" size="sm" className="me-1"
                                onClick={() => { setSelectedApplicant(a); setShowViewModal(true); }}
                                title="View Details">
                                <FaEye />
                              </Button>
                              {a.status === 'Pending' && (
                                <Button variant="outline-info" size="sm" className="me-1"
                                  onClick={() => handleStatusChange(a.id || a._id, 'Shortlisted')}
                                  title="Shortlist Candidate">
                                  <FaUserCheck />
                                </Button>
                              )}
                              {(a.status === 'Shortlisted' || a.status === 'Pending') && (
                                <Button variant="outline-warning" size="sm" className="me-1"
                                  onClick={() => handleStatusChange(a.id || a._id, 'Interview')}
                                  title="Schedule Interview">
                                  <FaUserPlus />
                                </Button>
                              )}
                              {a.status === 'Interview' && (
                                <Button variant="outline-success" size="sm" className="me-1"
                                  onClick={() => handleStatusChange(a.id || a._id, 'Hired')}
                                  title="Hire Candidate">
                                  <FaCheck />
                                </Button>
                              )}
                              <Button variant="outline-danger" size="sm"
                                onClick={() => { setSelectedApplicant(a); setShowDeleteModal(true); }}
                                title="Delete Candidate">
                                <FaTrash />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center py-4 text-muted">
                          No applicants found matching the selected criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            )}

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
                  {selectedApplicant.skills && selectedApplicant.skills.map((s, i) => (
                    <Badge key={i} bg="primary">{s}</Badge>
                  ))}
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
          </Modal.Footer>
        </Modal>

        {/* Delete Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Delete Applicant</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete <strong>{selectedApplicant?.name}</strong> from MongoDB?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}><FaTrash className="me-1" /> Delete from MongoDB</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default ApplicantList;