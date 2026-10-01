import React, { useState } from 'react';
import {
  Container, Row, Col, Card, Table, Button, Form, Badge,
  InputGroup, Dropdown, Spinner, Alert, Pagination, Modal
} from 'react-bootstrap';
import {
  FaSearch, FaFilter, FaEye, FaDownload, FaFilePdf, FaFileExcel,
  FaSync, FaTrophy, FaMedal, FaStar, FaAward, FaUsers,
  FaCalendarAlt, FaCheckCircle, FaClock, FaChartBar, FaPrint
} from 'react-icons/fa';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  ArcElement, Title, Tooltip, Legend
} from 'chart.js';
import './RewardReports.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const RewardReports = () => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  // Demo award data
  const awards = [
    { id: 1, employeeName: 'John Doe', employeeId: 'EMP001', department: 'Software',
      awardName: 'Employee of the Month', awardType: 'Recognition', points: 100,
      status: 'Approved', date: '2026-01-15', approvedBy: 'Sarah Williams' },
    { id: 2, employeeName: 'Jane Smith', employeeId: 'EMP002', department: 'Marketing',
      awardName: 'Best Team Player', awardType: 'Certificate', points: 75,
      status: 'Approved', date: '2026-01-12', approvedBy: 'Mike Johnson' },
    { id: 3, employeeName: 'Mike Johnson', employeeId: 'EMP003', department: 'Electrical',
      awardName: 'Innovation Award', awardType: 'Monetary', points: 150,
      status: 'Approved', date: '2026-01-10', approvedBy: 'John Doe' },
    { id: 4, employeeName: 'Sarah Williams', employeeId: 'EMP004', department: 'Production',
      awardName: 'Excellence Award', awardType: 'Recognition', points: 120,
      status: 'Pending', date: '2026-01-08', approvedBy: null },
    { id: 5, employeeName: 'Robert Brown', employeeId: 'EMP005', department: 'Software',
      awardName: 'Innovation Award', awardType: 'Monetary', points: 200,
      status: 'Approved', date: '2026-01-05', approvedBy: 'Jane Smith' },
    { id: 6, employeeName: 'Emily Davis', employeeId: 'EMP006', department: 'HR',
      awardName: 'Team Player', awardType: 'Certificate', points: 60,
      status: 'Approved', date: '2026-01-03', approvedBy: 'John Doe' },
    { id: 7, employeeName: 'David Wilson', employeeId: 'EMP007', department: 'Finance',
      awardName: 'Best Performer', awardType: 'Recognition', points: 90,
      status: 'Pending', date: '2026-01-02', approvedBy: null },
    { id: 8, employeeName: 'Linda Martinez', employeeId: 'EMP008', department: 'Marketing',
      awardName: 'Creative Award', awardType: 'Monetary', points: 80,
      status: 'Approved', date: '2026-01-01', approvedBy: 'Jane Smith' }
  ];

  // Filter
  const filtered = awards.filter((a) => {
    const term = searchTerm.toLowerCase();
    const matches =
      a.employeeName.toLowerCase().includes(term) ||
      a.employeeId.toLowerCase().includes(term) ||
      a.awardName.toLowerCase().includes(term) ||
      a.department.toLowerCase().includes(term);
    const matchesType = typeFilter === 'all' || a.awardType === typeFilter;
    const matchesStatus = statusFilter === 'all' || a.status.toLowerCase() === statusFilter;
    return matches && matchesType && matchesStatus;
  });

  // Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  // Stats
  const totalAwards = awards.length;
  const approvedAwards = awards.filter((a) => a.status === 'Approved').length;
  const pendingAwards = awards.filter((a) => a.status === 'Pending').length;
  const totalPoints = awards.reduce((s, a) => s + a.points, 0);
  const totalEmployees = new Set(awards.map((a) => a.employeeId)).size;

  // Charts
  const typeChart = {
    labels: ['Certificate', 'Monetary', 'Recognition', 'Team Award'],
    datasets: [{
      label: 'Awards by Type',
      data: [
        awards.filter((a) => a.awardType === 'Certificate').length,
        awards.filter((a) => a.awardType === 'Monetary').length,
        awards.filter((a) => a.awardType === 'Recognition').length,
        awards.filter((a) => a.awardType === 'Team Award').length
      ],
      backgroundColor: ['#3b82f6', '#22c55e', '#eab308', '#8b5cf6'],
      borderRadius: 6
    }]
  };

  const statusChart = {
    labels: ['Approved', 'Pending'],
    datasets: [{
      data: [approvedAwards, pendingAwards],
      backgroundColor: ['rgba(34,197,94,0.85)', 'rgba(234,179,8,0.85)'],
      borderWidth: 2
    }]
  };

  const chartOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
    scales: { y: { beginAtZero: true } }
  };

  const doughnutOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } }
  };

  const getStatusBadge = (s) => {
    const map = {
      Approved: { v: 'success', i: <FaCheckCircle /> },
      Pending: { v: 'warning', i: <FaClock /> }
    };
    const c = map[s] || map.Pending;
    return <Badge bg={c.v} className="status-badge">{c.i} {s}</Badge>;
  };

  const getTypeBadge = (t) => {
    const map = {
      Certificate: { v: 'primary', i: <FaTrophy /> },
      Monetary:    { v: 'success', i: <FaMedal /> },
      Recognition: { v: 'warning', i: <FaStar /> },
      'Team Award': { v: 'info',   i: <FaAward /> }
    };
    const c = map[t] || map.Certificate;
    return <Badge bg={c.v} className="type-badge">{c.i} {t}</Badge>;
  };

  const getInitials = (name) =>
    name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  const handleView = (a) => {
    setSelectedReport(a);
    setShowViewModal(true);
  };

  const handleExport = (format) => {
    alert(`Exporting Reward Reports as ${format}...`);
  };

  return (
    <div className="reward-reports-page">
      <Container fluid>
        {/* Header */}
        <div className="page-header">
          <div>
            <h2 className="page-title">Reward Reports</h2>
            <p className="page-subtitle">Analyze employee awards and reward points</p>
          </div>
          <div className="header-right">
            <Button variant="outline-secondary" className="me-2" onClick={() => setLoading(true)}>
              <FaSync className="me-1" /> Refresh
            </Button>
            <Button variant="outline-danger" className="me-2" onClick={() => handleExport('PDF')}>
              <FaFilePdf className="me-1" /> PDF
            </Button>
            <Button variant="outline-success" onClick={() => handleExport('Excel')}>
              <FaFileExcel className="me-1" /> Excel
            </Button>
          </div>
        </div>

        {/* Stats */}
        <Row className="statistics-cards mb-4">
          <Col lg={3} md={6} className="mb-3">
            <Card className="stat-card total-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon-wrapper primary"><FaTrophy className="stat-icon" /></div>
                  <div className="stat-info">
                    <h3 className="stat-number">{totalAwards}</h3>
                    <p className="stat-label">Total Awards</p>
                    <small className="stat-detail">{totalEmployees} employees</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <Card className="stat-card approved-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon-wrapper success"><FaCheckCircle className="stat-icon" /></div>
                  <div className="stat-info">
                    <h3 className="stat-number">{approvedAwards}</h3>
                    <p className="stat-label">Approved</p>
                    <small className="stat-detail">Active awards</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <Card className="stat-card pending-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon-wrapper warning"><FaClock className="stat-icon" /></div>
                  <div className="stat-info">
                    <h3 className="stat-number">{pendingAwards}</h3>
                    <p className="stat-label">Pending</p>
                    <small className="stat-detail">Awaiting approval</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <Card className="stat-card points-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon-wrapper info"><FaStar className="stat-icon" /></div>
                  <div className="stat-info">
                    <h3 className="stat-number">{totalPoints}</h3>
                    <p className="stat-label">Total Points</p>
                    <small className="stat-detail">Avg: {Math.round(totalPoints / (totalAwards || 1))} pts</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Charts */}
        <Row className="mb-4">
          <Col lg={5} className="mb-3">
            <Card className="chart-card">
              <Card.Header className="bg-white">
                <h6 className="mb-0 fw-bold">
                  <FaChartBar className="me-2 text-success" /> Awards by Type
                </h6>
              </Card.Header>
              <Card.Body style={{ height: 280 }}>
                <Bar data={typeChart} options={chartOpts} />
              </Card.Body>
            </Card>
          </Col>
          <Col lg={7} className="mb-3">
            <Card className="chart-card">
              <Card.Header className="bg-white">
                <h6 className="mb-0 fw-bold">
                  <FaChartBar className="me-2 text-primary" /> Approval Status
                </h6>
              </Card.Header>
              <Card.Body style={{ height: 280 }}>
                <Doughnut data={statusChart} options={doughnutOpts} />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Table */}
        <Card className="list-card">
          <Card.Body>
            {/* Toolbar */}
            <div className="list-toolbar">
              <div className="toolbar-left">
                <InputGroup style={{ width: 300 }}>
                  <InputGroup.Text><FaSearch /></InputGroup.Text>
                  <Form.Control
                    placeholder="Search by employee, award..."
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
                    <Dropdown.Item onClick={() => setTypeFilter('Certificate')}>Certificate</Dropdown.Item>
                    <Dropdown.Item onClick={() => setTypeFilter('Monetary')}>Monetary</Dropdown.Item>
                    <Dropdown.Item onClick={() => setTypeFilter('Recognition')}>Recognition</Dropdown.Item>
                    <Dropdown.Item onClick={() => setTypeFilter('Team Award')}>Team Award</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

                <Dropdown>
                  <Dropdown.Toggle variant="outline-secondary" size="sm">
                    <FaFilter className="me-1" />
                    {statusFilter === 'all' ? 'All Status' : statusFilter}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setStatusFilter('all')}>All Status</Dropdown.Item>
                    <Dropdown.Item onClick={() => setStatusFilter('approved')}>Approved</Dropdown.Item>
                    <Dropdown.Item onClick={() => setStatusFilter('pending')}>Pending</Dropdown.Item>
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
                <p className="mt-3 text-muted">Loading...</p>
              </div>
            ) : (
              <div className="table-responsive">
                <Table hover className="reports-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Employee</th>
                      <th>Award Name</th>
                      <th>Type</th>
                      <th>Points</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th style={{ width: 140 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length > 0 ? currentItems.map((a, i) => (
                      <tr key={a.id}>
                        <td>{indexOfFirst + i + 1}</td>
                        <td>
                          <div className="employee-info">
                            <div className="employee-avatar">{getInitials(a.employeeName)}</div>
                            <div>
                              <div className="employee-name">{a.employeeName}</div>
                              <div className="employee-id">#{a.employeeId} • {a.department}</div>
                            </div>
                          </div>
                        </td>
                        <td><strong>{a.awardName}</strong></td>
                        <td>{getTypeBadge(a.awardType)}</td>
                        <td>
                          <Badge bg="primary" className="points-badge">
                            <FaStar className="me-1" /> {a.points}
                          </Badge>
                        </td>
                        <td>
                          <small>
                            <FaCalendarAlt className="me-1 text-muted" />
                            {new Date(a.date).toLocaleDateString('en-US', {
                              month: 'short', day: 'numeric', year: 'numeric'
                            })}
                          </small>
                        </td>
                        <td>{getStatusBadge(a.status)}</td>
                        <td>
                          <div className="action-buttons">
                            <Button variant="outline-primary" size="sm" className="me-1"
                              onClick={() => handleView(a)} title="View">
                              <FaEye />
                            </Button>
                            <Button variant="outline-success" size="sm" className="me-1"
                              onClick={() => handleExport('PDF')} title="Download PDF">
                              <FaFilePdf />
                            </Button>
                            <Button variant="outline-secondary" size="sm"
                              onClick={() => window.print()} title="Print">
                              <FaPrint />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="8" className="text-center py-5">
                          <p className="text-muted mb-0">No reward reports found</p>
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
                  Showing {indexOfFirst + 1} to {Math.min(indexOfLast, filtered.length)} of {filtered.length} awards
                </span>
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
        <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              <FaTrophy className="me-2 text-warning" /> Award Details
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedReport && (
              <div>
                <div className="text-center mb-4">
                  <div className="modal-avatar">{getInitials(selectedReport.employeeName)}</div>
                  <h5 className="mt-3 mb-1">{selectedReport.employeeName}</h5>
                  <p className="text-muted mb-0 small">
                    #{selectedReport.employeeId} • {selectedReport.department}
                  </p>
                </div>

                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Award</span>
                    <span className="detail-value">{selectedReport.awardName}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Type</span>
                    <span>{getTypeBadge(selectedReport.awardType)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Points</span>
                    <span className="detail-value text-warning">
                      <FaStar className="me-1" /> {selectedReport.points}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Date</span>
                    <span className="detail-value">
                      {new Date(selectedReport.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Status</span>
                    <span>{getStatusBadge(selectedReport.status)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Approved By</span>
                    <span className="detail-value">{selectedReport.approvedBy || 'N/A'}</span>
                  </div>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
            <Button variant="success" onClick={() => handleExport('PDF')}>
              <FaFilePdf className="me-1" /> Download
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default RewardReports;