import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Table, Button, Form, Badge,
  InputGroup, Dropdown, Spinner, Alert, Modal, Pagination
} from 'react-bootstrap';
import {
  FaSearch, FaFilter, FaEye, FaDownload, FaPrint, FaEnvelope,
  FaSync, FaFileInvoiceDollar, FaCheck, FaClock, FaCalendarAlt,
  FaFilePdf, FaFileExcel, FaUser, FaBuilding, FaMoneyBillWave
} from 'react-icons/fa';
import './PayslipHistory.css';

const PayslipHistory = () => {
  const [loading, setLoading] = useState(false);
  const [payslips, setPayslips] = useState([]);
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      setPayslips([
        {
          id: 1, employeeName: 'John Doe', employeeId: 'EMP001',
          department: 'Software', position: 'Senior Developer',
          month: 'January', year: 2026, basicSalary: 5000,
          allowances: 1000, bonuses: 500, deductions: 300,
          netSalary: 6200, status: 'Generated',
          generatedDate: '2026-01-31', payDate: '2026-02-01',
          bankName: 'ABC Bank', accountNumber: '1234567890', avatar: 'JD'
        },
        {
          id: 2, employeeName: 'Jane Smith', employeeId: 'EMP002',
          department: 'Marketing', position: 'Marketing Manager',
          month: 'January', year: 2026, basicSalary: 4500,
          allowances: 800, bonuses: 400, deductions: 250,
          netSalary: 5450, status: 'Generated',
          generatedDate: '2026-01-31', payDate: '2026-02-01',
          bankName: 'XYZ Bank', accountNumber: '0987654321', avatar: 'JS'
        },
        {
          id: 3, employeeName: 'Mike Johnson', employeeId: 'EMP003',
          department: 'Electrical', position: 'Electrical Engineer',
          month: 'January', year: 2026, basicSalary: 4800,
          allowances: 900, bonuses: 0, deductions: 280,
          netSalary: 5420, status: 'Pending',
          generatedDate: '2026-01-30', payDate: null,
          bankName: 'ABC Bank', accountNumber: '5678901234', avatar: 'MJ'
        },
        {
          id: 4, employeeName: 'Sarah Williams', employeeId: 'EMP004',
          department: 'Production', position: 'Production Supervisor',
          month: 'December', year: 2025, basicSalary: 4200,
          allowances: 700, bonuses: 600, deductions: 200,
          netSalary: 5300, status: 'Generated',
          generatedDate: '2025-12-31', payDate: '2026-01-01',
          bankName: 'XYZ Bank', accountNumber: '4321098765', avatar: 'SW'
        },
        {
          id: 5, employeeName: 'Robert Brown', employeeId: 'EMP005',
          department: 'Software', position: 'Frontend Developer',
          month: 'January', year: 2026, basicSalary: 4600,
          allowances: 750, bonuses: 300, deductions: 260,
          netSalary: 5390, status: 'Generated',
          generatedDate: '2026-01-29', payDate: '2026-01-31',
          bankName: 'ABC Bank', accountNumber: '7890123456', avatar: 'RB'
        },
        {
          id: 6, employeeName: 'Emily Davis', employeeId: 'EMP006',
          department: 'HR', position: 'HR Coordinator',
          month: 'December', year: 2025, basicSalary: 4000,
          allowances: 600, bonuses: 400, deductions: 180,
          netSalary: 4820, status: 'Generated',
          generatedDate: '2025-12-31', payDate: '2026-01-01',
          bankName: 'ABC Bank', accountNumber: '9876543210', avatar: 'ED'
        }
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (a) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency', currency: 'USD', minimumFractionDigits: 0
    }).format(a || 0);

  const formatDate = (d) => {
    if (!d) return 'N/A';
    return new Date(d).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  const getStatusBadge = (s) => {
    const map = {
      Generated: { bg: 'success', icon: <FaCheck /> },
      Pending: { bg: 'warning', icon: <FaClock /> }
    };
    const c = map[s] || map.Pending;
    return <Badge bg={c.bg} className="status-badge">{c.icon} {s}</Badge>;
  };

  // Filtering
  const filtered = payslips.filter((p) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      p.employeeName.toLowerCase().includes(term) ||
      p.employeeId.toLowerCase().includes(term) ||
      p.department.toLowerCase().includes(term);
    const matchesStatus = statusFilter === 'all' || p.status.toLowerCase() === statusFilter;
    const matchesMonth = monthFilter === 'all' || p.month === monthFilter;
    return matchesSearch && matchesStatus && matchesMonth;
  });

  // Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  // Stats
  const totalPayslips = payslips.length;
  const generatedCount = payslips.filter((p) => p.status === 'Generated').length;
  const pendingCount = payslips.filter((p) => p.status === 'Pending').length;
  const totalPayout = payslips.reduce((s, p) => s + p.netSalary, 0);

  const handleView = (p) => {
    setSelectedPayslip(p);
    setShowViewModal(true);
  };

  const handleDownload = (p) => {
    alert(`Downloading payslip for ${p.employeeName} - ${p.month} ${p.year}`);
  };

  const handlePrint = (p) => {
    window.print();
  };

  const handleSendEmail = (p) => {
    alert(`Email sent to ${p.employeeName}`);
  };

  return (
    <div className="payslip-history-page">
      <Container fluid>
        {/* Header */}
        <div className="history-header">
          <div>
            <h2 className="page-title">Payslip History</h2>
            <p className="page-subtitle">View and manage all previously generated payslips</p>
          </div>
          <div className="header-right">
            <Button variant="outline-secondary" className="me-2" onClick={fetchHistory}>
              <FaSync className="me-1" /> Refresh
            </Button>
            <Button variant="outline-danger" className="me-2">
              <FaFilePdf className="me-1" /> PDF
            </Button>
            <Button variant="outline-success">
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
                  <div className="stat-icon-wrapper primary">
                    <FaFileInvoiceDollar className="stat-icon" />
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">{totalPayslips}</h3>
                    <p className="stat-label">Total Payslips</p>
                    <small className="stat-detail">{formatCurrency(totalPayout)} total</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <Card className="stat-card generated-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon-wrapper success">
                    <FaCheck className="stat-icon" />
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">{generatedCount}</h3>
                    <p className="stat-label">Generated</p>
                    <small className="stat-detail">Ready to download</small>
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
                    <h3 className="stat-number">{pendingCount}</h3>
                    <p className="stat-label">Pending</p>
                    <small className="stat-detail">Awaiting generation</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <Card className="stat-card average-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon-wrapper info">
                    <FaMoneyBillWave className="stat-icon" />
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">{formatCurrency(totalPayout / (totalPayslips || 1))}</h3>
                    <p className="stat-label">Avg Salary</p>
                    <small className="stat-detail">Per payslip</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Filters + Table */}
        <Card className="history-main-card">
          <Card.Body>
            {/* Toolbar */}
            <div className="list-toolbar">
              <div className="toolbar-left">
                <InputGroup style={{ width: 280 }}>
                  <InputGroup.Text><FaSearch /></InputGroup.Text>
                  <Form.Control
                    placeholder="Search by name, ID..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  />
                </InputGroup>

                <Dropdown className="me-2">
                  <Dropdown.Toggle variant="outline-secondary" size="sm">
                    <FaFilter className="me-1" />
                    {statusFilter === 'all' ? 'All Status' : statusFilter}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setStatusFilter('all')}>All Status</Dropdown.Item>
                    <Dropdown.Item onClick={() => setStatusFilter('generated')}>
                      <FaCheck className="text-success me-1" /> Generated
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => setStatusFilter('pending')}>
                      <FaClock className="text-warning me-1" /> Pending
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

                <Form.Select
                  size="sm"
                  value={monthFilter}
                  onChange={(e) => { setMonthFilter(e.target.value); setCurrentPage(1); }}
                  style={{ width: 150 }}
                >
                  <option value="all">All Months</option>
                  {months.map((m) => <option key={m} value={m}>{m}</option>)}
                </Form.Select>
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
                <p className="mt-3 text-muted">Loading payslip history...</p>
              </div>
            ) : (
              <div className="table-responsive">
                <Table hover className="history-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Employee</th>
                      <th>Month/Year</th>
                      <th>Basic</th>
                      <th>Net Salary</th>
                      <th>Pay Date</th>
                      <th>Status</th>
                      <th style={{ width: 200 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length > 0 ? currentItems.map((p, i) => (
                      <tr key={p.id}>
                        <td>{indexOfFirst + i + 1}</td>
                        <td>
                          <div className="employee-info">
                            <div className="employee-avatar">
                              {p.avatar || p.employeeName.split(' ').map((n) => n[0]).join('')}
                            </div>
                            <div>
                              <div className="employee-name">{p.employeeName}</div>
                              <div className="employee-id">#{p.employeeId} • {p.department}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="month-info">
                            <FaFileInvoiceDollar className="month-icon" />
                            <span>{p.month} {p.year}</span>
                          </div>
                        </td>
                        <td>{formatCurrency(p.basicSalary)}</td>
                        <td><strong className="salary-value">{formatCurrency(p.netSalary)}</strong></td>
                        <td>{formatDate(p.payDate)}</td>
                        <td>{getStatusBadge(p.status)}</td>
                        <td>
                          <div className="action-buttons">
                            <Button variant="outline-primary" size="sm" className="me-1"
                              onClick={() => handleView(p)} title="View">
                              <FaEye />
                            </Button>
                            {p.status === 'Generated' && (
                              <>
                                <Button variant="outline-success" size="sm" className="me-1"
                                  onClick={() => handleDownload(p)} title="Download">
                                  <FaDownload />
                                </Button>
                                <Button variant="outline-info" size="sm" className="me-1"
                                  onClick={() => handlePrint(p)} title="Print">
                                  <FaPrint />
                                </Button>
                                <Button variant="outline-warning" size="sm"
                                  onClick={() => handleSendEmail(p)} title="Send Email">
                                  <FaEnvelope />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="8" className="text-center py-4">
                          <p className="text-muted mb-0">No payslip history found</p>
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
                  Showing {indexOfFirst + 1} to {Math.min(indexOfLast, filtered.length)} of {filtered.length}
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
        <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>
              <FaFileInvoiceDollar className="me-2" /> Payslip Details
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedPayslip && (
              <div className="payslip-detail-view">
                <div className="detail-header">
                  <div className="detail-avatar">
                    {selectedPayslip.avatar || selectedPayslip.employeeName.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h5 className="mb-1">{selectedPayslip.employeeName}</h5>
                    <p className="text-muted mb-1">
                      {selectedPayslip.position} • {selectedPayslip.department}
                    </p>
                    <p className="text-muted mb-0 small">
                      #{selectedPayslip.employeeId} • {selectedPayslip.month} {selectedPayslip.year}
                    </p>
                  </div>
                  <div className="ms-auto">
                    {getStatusBadge(selectedPayslip.status)}
                  </div>
                </div>

                <hr />

                <Row className="g-3">
                  <Col md={6}>
                    <div className="detail-box">
                      <div className="detail-box-label">Basic Salary</div>
                      <div className="detail-box-value">{formatCurrency(selectedPayslip.basicSalary)}</div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="detail-box">
                      <div className="detail-box-label">Allowances</div>
                      <div className="detail-box-value text-primary">{formatCurrency(selectedPayslip.allowances)}</div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="detail-box">
                      <div className="detail-box-label">Bonuses</div>
                      <div className="detail-box-value text-success">{formatCurrency(selectedPayslip.bonuses)}</div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="detail-box">
                      <div className="detail-box-label">Deductions</div>
                      <div className="detail-box-value text-danger">-{formatCurrency(selectedPayslip.deductions)}</div>
                    </div>
                  </Col>
                </Row>

                <div className="net-salary-box mt-3">
                  <span>Net Salary</span>
                  <span>{formatCurrency(selectedPayslip.netSalary)}</span>
                </div>

                <hr />

                <Row>
                  <Col md={6}>
                    <div className="info-row">
                      <span><FaBuilding className="me-2" /> Bank</span>
                      <strong>{selectedPayslip.bankName}</strong>
                    </div>
                    <div className="info-row">
                      <span><FaUser className="me-2" /> Account No.</span>
                      <strong>{selectedPayslip.accountNumber}</strong>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="info-row">
                      <span><FaCalendarAlt className="me-2" /> Generated</span>
                      <strong>{formatDate(selectedPayslip.generatedDate)}</strong>
                    </div>
                    <div className="info-row">
                      <span><FaCalendarAlt className="me-2" /> Pay Date</span>
                      <strong>{formatDate(selectedPayslip.payDate)}</strong>
                    </div>
                  </Col>
                </Row>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
            <Button variant="info" onClick={() => handlePrint(selectedPayslip)}>
              <FaPrint className="me-1" /> Print
            </Button>
            <Button variant="success" onClick={() => handleDownload(selectedPayslip)}>
              <FaDownload className="me-1" /> Download
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default PayslipHistory;