import React, { useState } from 'react';
import {
  Container, Row, Col, Card, Table, Button, Form, Badge,
  InputGroup, Dropdown, Pagination, Spinner, Alert,
  Modal, Toast, ToastContainer
} from 'react-bootstrap';
import {
  FaSearch, FaFilter, FaEye, FaDownload, FaTrash, FaFilePdf,
  FaFileExcel, FaSync, FaFileAlt, FaCalendarAlt, FaUser,
  FaChartBar, FaCheckCircle, FaClock, FaPrint, FaEnvelope
} from 'react-icons/fa';
import './SavedReports.css';

const SavedReports = () => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });

  const [reports, setReports] = useState([
    { id: 1, title: 'Employee Attendance Summary', type: 'Attendance', format: 'PDF',
      status: 'Completed', size: '1.2 MB', createdBy: 'John Doe',
      generatedDate: '2026-01-20 14:30', period: 'Jan 1 - Jan 31, 2026',
      description: 'Monthly attendance report' },
    { id: 2, title: 'Department Performance Report', type: 'Performance', format: 'Excel',
      status: 'Completed', size: '2.5 MB', createdBy: 'Jane Smith',
      generatedDate: '2026-01-19 10:15', period: 'Q4 2025',
      description: 'Department performance metrics' },
    { id: 3, title: 'Leave Analysis Report', type: 'Leave', format: 'PDF',
      status: 'Completed', size: '0.8 MB', createdBy: 'Mike Johnson',
      generatedDate: '2026-01-18 16:45', period: 'Jan 1 - Jan 18, 2026',
      description: 'Employee leave patterns' },
    { id: 4, title: 'Project Progress Report', type: 'Project', format: 'PDF',
      status: 'Processing', size: '3.1 MB', createdBy: 'Sarah Williams',
      generatedDate: '2026-01-17 09:30', period: 'Dec 1 - Jan 17, 2026',
      description: 'Project status tracking' },
    { id: 5, title: 'Budget Allocation Report', type: 'Financial', format: 'Excel',
      status: 'Completed', size: '1.8 MB', createdBy: 'Robert Brown',
      generatedDate: '2026-01-16 11:20', period: 'Q4 2025',
      description: 'Budget allocation and usage' },
    { id: 6, title: 'Loan Applications Report', type: 'Loan', format: 'PDF',
      status: 'Completed', size: '1.1 MB', createdBy: 'Emily Davis',
      generatedDate: '2026-01-15 08:00', period: 'Jan 1 - Jan 15, 2026',
      description: 'Loan applications summary' },
    { id: 7, title: 'Payroll Report December', type: 'Payroll', format: 'Excel',
      status: 'Completed', size: '2.2 MB', createdBy: 'John Doe',
      generatedDate: '2026-01-10 15:00', period: 'Dec 1 - Dec 31, 2025',
      description: 'Monthly payroll report' },
    { id: 8, title: 'Recruitment Funnel Report', type: 'Recruitment', format: 'PDF',
      status: 'Failed', size: '0 MB', createdBy: 'Jane Smith',
      generatedDate: '2026-01-08 12:30', period: 'Q4 2025',
      description: 'Recruitment pipeline analytics' }
  ]);

  const showToast = (message, variant = 'success') => {
    setToast({ show: true, message, variant });
    setTimeout(() => setToast({ show: false, message: '', variant: 'success' }), 4000);
  };

  const filtered = reports.filter((r) => {
    const term = searchTerm.toLowerCase();
    const matches =
      r.title.toLowerCase().includes(term) ||
      r.type.toLowerCase().includes(term) ||
      r.createdBy.toLowerCase().includes(term);
    const matchesType = typeFilter === 'all' || r.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || r.status.toLowerCase() === statusFilter;
    return matches && matchesType && matchesStatus;
  });

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const getStatusBadge = (s) => {
    const map = {
      Completed: { v: 'success', i: <FaCheckCircle /> },
      Processing: { v: 'warning', i: <FaClock /> },
      Failed: { v: 'danger', i: <FaTrash /> }
    };
    const c = map[s] || map.Completed;
    return <Badge bg={c.v} className="status-badge">{c.i} {s}</Badge>;
  };

  const getFormatIcon = (f) => {
    const map = {
      PDF:   <FaFilePdf className="format-icon pdf" />,
      Excel: <FaFileExcel className="format-icon excel" />
    };
    return map[f] || <FaFileAlt />;
  };

  const getTypeBadge = (t) => {
    const map = {
      Attendance: 'primary',
      Performance: 'success',
      Leave: 'info',
      Project: 'warning',
      Financial: 'danger',
      Loan: 'secondary',
      Payroll: 'dark',
      Recruitment: 'primary'
    };
    return <Badge bg={map[t] || 'secondary'}>{t}</Badge>;
  };

  const handleView = (r) => {
    setSelectedReport(r);
    setShowViewModal(true);
  };

  const handleDelete = () => {
    setReports(reports.filter((r) => r.id !== selectedReport.id));
    setShowDeleteModal(false);
    setSelectedReport(null);
    showToast('Report deleted successfully');
  };

  const handleDownload = (r, fmt) => showToast(`Downloading ${fmt} for "${r.title}"...`, 'success');

  const handlePrint = (r) => {
    showToast(`Preparing "${r.title}" for printing...`);
  };

  return (
    <div className="saved-reports-page">
      <ToastContainer position="top-end" className="p-3">
        <Toast show={toast.show} onClose={() => setToast({ ...toast, show: false })}
          bg={toast.variant} delay={4000} autohide>
          <Toast.Header>
            <strong className="me-auto">
              {toast.variant === 'success' ? 'Success' : 'Error'}
            </strong>
          </Toast.Header>
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>

      <Container fluid>
        {/* Header */}
        <div className="page-header">
          <div>
            <h2 className="page-title">Saved Reports</h2>
            <p className="page-subtitle">Browse, download, and manage previously generated reports</p>
          </div>
          <div className="header-right">
            <Button variant="outline-secondary" className="me-2"
              onClick={() => showToast('Refreshing reports...')}>
              <FaSync className="me-1" /> Refresh
            </Button>
            <Button variant="outline-danger" className="me-2"
              onClick={() => showToast('Exporting all reports...')}>
              <FaFilePdf className="me-1" /> Export All
            </Button>
          </div>
        </div>

        {/* Stats */}
        <Row className="statistics-cards mb-4">
          {[
            { l: 'Total Reports', v: reports.length, c: 'primary', icon: <FaFileAlt /> },
            { l: 'Completed', v: reports.filter((r) => r.status === 'Completed').length, c: 'success', icon: <FaCheckCircle /> },
            { l: 'Processing', v: reports.filter((r) => r.status === 'Processing').length, c: 'warning', icon: <FaClock /> },
            { l: 'Failed', v: reports.filter((r) => r.status === 'Failed').length, c: 'danger', icon: <FaTrash /> }
          ].map((s, i) => (
            <Col lg={3} md={6} key={i} className="mb-3">
              <Card className={`stat-card total-card`}>
                <Card.Body>
                  <div className="stat-content">
                    <div className={`stat-icon-wrapper ${s.c}`}>{s.icon}</div>
                    <div className="stat-info">
                      <h3 className="stat-number">{s.v}</h3>
                      <p className="stat-label">{s.l}</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* List */}
        <Card className="list-card">
          <Card.Body>
            {/* Toolbar */}
            <div className="list-toolbar">
              <div className="toolbar-left">
                <InputGroup style={{ width: 300 }}>
                  <InputGroup.Text><FaSearch /></InputGroup.Text>
                  <Form.Control
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  />
                </InputGroup>
                <Dropdown className="me-2">
                  <Dropdown.Toggle variant="outline-secondary" size="sm">
                    <FaFilter className="me-1" />
                    {typeFilter === 'all' ? 'All Types' : typeFilter}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setTypeFilter('all')}>All Types</Dropdown.Item>
                    {['Attendance', 'Performance', 'Leave', 'Project', 'Financial', 'Loan', 'Payroll', 'Recruitment']
                      .map((t) => (
                        <Dropdown.Item key={t} onClick={() => setTypeFilter(t)}>{t}</Dropdown.Item>
                      ))}
                  </Dropdown.Menu>
                </Dropdown>
                <Dropdown>
                  <Dropdown.Toggle variant="outline-secondary" size="sm">
                    <FaFilter className="me-1" />
                    {statusFilter === 'all' ? 'All Status' : statusFilter}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setStatusFilter('all')}>All</Dropdown.Item>
                    <Dropdown.Item onClick={() => setStatusFilter('completed')}>Completed</Dropdown.Item>
                    <Dropdown.Item onClick={() => setStatusFilter('processing')}>Processing</Dropdown.Item>
                    <Dropdown.Item onClick={() => setStatusFilter('failed')}>Failed</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              <div className="toolbar-right">
                <span className="text-muted small">
                  {filtered.length} result{filtered.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Table */}
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : (
              <div className="table-responsive">
                <Table hover className="saved-reports-table">
                  <thead>
                    <tr>
                      <th style={{ width: 40 }}>#</th>
                      <th>Report Title</th>
                      <th>Type</th>
                      <th>Format</th>
                      <th>Period</th>
                      <th>Generated</th>
                      <th>Size</th>
                      <th>Status</th>
                      <th style={{ width: 220 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length > 0 ? currentItems.map((r, i) => (
                      <tr key={r.id}>
                        <td>{indexOfFirst + i + 1}</td>
                        <td>
                          <div className="report-title-cell">
                            <div className="report-title-text">{r.title}</div>
                            <div className="report-desc">{r.description}</div>
                          </div>
                        </td>
                        <td>{getTypeBadge(r.type)}</td>
                        <td>
                          <div className="format-cell">
                            {getFormatIcon(r.format)}
                            <span>{r.format}</span>
                          </div>
                        </td>
                        <td><small>{r.period}</small></td>
                        <td>
                          <div className="date-cell">
                            <FaCalendarAlt className="me-1" />
                            <small>{r.generatedDate}</small>
                          </div>
                        </td>
                        <td>{r.size}</td>
                        <td>{getStatusBadge(r.status)}</td>
                        <td>
                          <div className="action-buttons">
                            <Button variant="outline-primary" size="sm" className="me-1"
                              onClick={() => handleView(r)} title="View">
                              <FaEye />
                            </Button>
                            {r.status === 'Completed' && (
                              <>
                                <Button variant="outline-success" size="sm" className="me-1"
                                  onClick={() => handleDownload(r, 'PDF')} title="Download PDF">
                                  <FaFilePdf />
                                </Button>
                                <Button variant="outline-info" size="sm" className="me-1"
                                  onClick={() => handleDownload(r, 'Excel')} title="Download Excel">
                                  <FaFileExcel />
                                </Button>
                                <Button variant="outline-secondary" size="sm" className="me-1"
                                  onClick={() => handlePrint(r)} title="Print">
                                  <FaPrint />
                                </Button>
                              </>
                            )}
                            <Button variant="outline-danger" size="sm"
                              onClick={() => { setSelectedReport(r); setShowDeleteModal(true); }}
                              title="Delete">
                              <FaTrash />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="9" className="text-center py-5">
                          <FaFileAlt className="empty-icon" />
                          <p className="text-muted mb-0">No saved reports found</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="table-footer">
                <span className="text-muted small">
                  Showing {indexOfFirst + 1} to {Math.min(indexOfLast, filtered.length)} of {filtered.length} reports
                </span>
                <Pagination size="sm" className="mb-0">
                  <Pagination.First disabled={currentPage === 1} onClick={() => setCurrentPage(1)} />
                  <Pagination.Prev disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)} />
                  {[...Array(Math.min(totalPages, 5))].map((_, i) => (
                    <Pagination.Item key={i + 1} active={i + 1 === currentPage}
                      onClick={() => setCurrentPage(i + 1)}>{i + 1}</Pagination.Item>
                  ))}
                  <Pagination.Next disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)} />
                  <Pagination.Last disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(totalPages)} />
                </Pagination>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Delete Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Delete Report</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete <strong>{selectedReport?.title}</strong>?<br />
            <span className="text-danger small">This action cannot be undone.</span>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>
              <FaTrash className="me-1" /> Delete
            </Button>
          </Modal.Footer>
        </Modal>

        {/* View Modal */}
        <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>
              <FaFileAlt className="me-2" /> {selectedReport?.title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedReport && (
              <div>
                <Row className="mb-4">
                  <Col md={3}>
                    <div className="info-block">
                      <div className="info-label">Type</div>
                      <div className="info-value">{getTypeBadge(selectedReport.type)}</div>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="info-block">
                      <div className="info-label">Format</div>
                      <div className="info-value">
                        {getFormatIcon(selectedReport.format)} {selectedReport.format}
                      </div>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="info-block">
                      <div className="info-label">Size</div>
                      <div className="info-value">{selectedReport.size}</div>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="info-block">
                      <div className="info-label">Status</div>
                      <div className="info-value">{getStatusBadge(selectedReport.status)}</div>
                    </div>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col md={6}>
                    <div className="info-block">
                      <div className="info-label">Generated</div>
                      <div className="info-value">{selectedReport.generatedDate}</div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="info-block">
                      <div className="info-label">Created By</div>
                      <div className="info-value">
                        <FaUser className="me-1" /> {selectedReport.createdBy}
                      </div>
                    </div>
                  </Col>
                </Row>

                <div className="info-block mb-4">
                  <div className="info-label">Period</div>
                  <div className="info-value">{selectedReport.period}</div>
                </div>

                <div className="info-block mb-4">
                  <div className="info-label">Description</div>
                  <div className="info-value">{selectedReport.description}</div>
                </div>

                <hr />

                <div className="d-flex gap-2 flex-wrap">
                  <Button variant="success" onClick={() => handleDownload(selectedReport, 'PDF')}>
                    <FaFilePdf className="me-1" /> Download PDF
                  </Button>
                  <Button variant="info" onClick={() => handleDownload(selectedReport, 'Excel')}>
                    <FaFileExcel className="me-1" /> Download Excel
                  </Button>
                  <Button variant="secondary" onClick={() => handlePrint(selectedReport)}>
                    <FaPrint className="me-1" /> Print
                  </Button>
                  <Button variant="primary" onClick={() => showToast('Email sent!')}>
                    <FaEnvelope className="me-1" /> Email
                  </Button>
                </div>
              </div>
            )}
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};

export default SavedReports;