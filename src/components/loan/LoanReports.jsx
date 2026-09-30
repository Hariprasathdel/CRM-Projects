import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Badge } from 'react-bootstrap';
import {
  FaChartBar, FaFilePdf, FaFileExcel, FaSync, FaMoneyBillWave,
  FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaDownload
} from 'react-icons/fa';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  ArcElement, Title, Tooltip, Legend
} from 'chart.js';
import './LoanReports.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const LoanReports = () => {
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    loanType: 'all',
    status: 'all'
  });

  // Demo report data
  const reportData = [
    { employeeName: 'John Doe', employeeId: 'EMP001', loanType: 'Personal', amount: 5000, interest: 8.5, tenure: 12, status: 'Approved' },
    { employeeName: 'Jane Smith', employeeId: 'EMP002', loanType: 'Car', amount: 15000, interest: 7.5, tenure: 24, status: 'Pending' },
    { employeeName: 'Mike Johnson', employeeId: 'EMP003', loanType: 'Education', amount: 8000, interest: 6.0, tenure: 18, status: 'Approved' },
    { employeeName: 'Sarah Williams', employeeId: 'EMP004', loanType: 'Emergency', amount: 3000, interest: 10.0, tenure: 6, status: 'Rejected' },
    { employeeName: 'Robert Brown', employeeId: 'EMP005', loanType: 'Home', amount: 25000, interest: 6.5, tenure: 36, status: 'Pending' }
  ];

  const summary = {
    totalLoans: reportData.length,
    approved: reportData.filter((r) => r.status === 'Approved').length,
    pending: reportData.filter((r) => r.status === 'Pending').length,
    rejected: reportData.filter((r) => r.status === 'Rejected').length,
    totalAmount: reportData.reduce((s, r) => s + r.amount, 0)
  };

  const formatCurrency = (a) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(a || 0);

  const statusChart = {
    labels: ['Approved', 'Pending', 'Rejected'],
    datasets: [{
      data: [summary.approved, summary.pending, summary.rejected],
      backgroundColor: ['rgba(34,197,94,0.85)', 'rgba(234,179,8,0.85)', 'rgba(239,68,68,0.85)'],
      borderWidth: 2
    }]
  };

  const typeChart = {
    labels: ['Personal', 'Car', 'Education', 'Emergency', 'Home'],
    datasets: [{
      label: 'Total Amount',
      data: [5000, 15000, 8000, 3000, 25000],
      backgroundColor: 'rgba(59,130,246,0.85)',
      borderRadius: 6
    }]
  };

  const chartOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
    scales: { y: { beginAtZero: true } }
  };

  const getStatusBadge = (s) => {
    const map = {
      Approved: { bg: 'success', icon: <FaCheckCircle /> },
      Pending: { bg: 'warning', icon: <FaHourglassHalf /> },
      Rejected: { bg: 'danger', icon: <FaTimesCircle /> }
    };
    const c = map[s] || map.Pending;
    return <Badge bg={c.bg}>{c.icon} {s}</Badge>;
  };

  return (
    <div className="loan-reports-page">
      <Container fluid>
        {/* Header */}
        <div className="report-header">
          <div>
            <h2 className="page-title">Loan Reports</h2>
            <p className="page-subtitle">Analyze loan applications and repayment data</p>
          </div>
          <div className="header-right">
            <Button variant="outline-secondary" className="me-2" onClick={() => setLoading(true)}>
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

        {/* Filters */}
        <Card className="filter-card mb-4">
          <Card.Body>
            <Row className="align-items-end g-3">
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control type="date" value={filters.startDate}
                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>End Date</Form.Label>
                  <Form.Control type="date" value={filters.endDate}
                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Loan Type</Form.Label>
                  <Form.Select value={filters.loanType}
                    onChange={(e) => setFilters({ ...filters, loanType: e.target.value })}>
                    <option value="all">All Types</option>
                    <option value="Personal">Personal</option>
                    <option value="Car">Car</option>
                    <option value="Home">Home</option>
                    <option value="Education">Education</option>
                    <option value="Emergency">Emergency</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Select value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
                    <option value="all">All Status</option>
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                    <option value="Rejected">Rejected</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Summary Cards */}
        <Row className="mb-4">
          <Col lg={3} md={6} className="mb-3">
            <Card className="summary-card border-primary">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-1">Total Loans</h6>
                    <h3 className="fw-bold mb-0">{summary.totalLoans}</h3>
                  </div>
                  <div className="summary-icon icon-blue"><FaMoneyBillWave /></div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <Card className="summary-card border-success">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-1">Approved</h6>
                    <h3 className="fw-bold text-success mb-0">{summary.approved}</h3>
                  </div>
                  <div className="summary-icon icon-green"><FaCheckCircle /></div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <Card className="summary-card border-warning">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-1">Pending</h6>
                    <h3 className="fw-bold text-warning mb-0">{summary.pending}</h3>
                  </div>
                  <div className="summary-icon icon-yellow"><FaHourglassHalf /></div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <Card className="summary-card border-info">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-1">Total Amount</h6>
                    <h5 className="fw-bold text-info mb-0">{formatCurrency(summary.totalAmount)}</h5>
                  </div>
                  <div className="summary-icon icon-info"><FaChartBar /></div>
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
                <h6 className="mb-0 fw-bold">Loan Status Distribution</h6>
              </Card.Header>
              <Card.Body style={{ height: 280 }}>
                <Doughnut data={statusChart} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
              </Card.Body>
            </Card>
          </Col>
          <Col lg={7} className="mb-3">
            <Card className="chart-card">
              <Card.Header className="bg-white">
                <h6 className="mb-0 fw-bold">Loan Amount by Type</h6>
              </Card.Header>
              <Card.Body style={{ height: 280 }}>
                <Bar data={typeChart} options={chartOpts} />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Details Table */}
        <Card className="report-table-card">
          <Card.Header className="bg-white">
            <h6 className="mb-0 fw-bold">Detailed Loan Report</h6>
          </Card.Header>
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table hover className="report-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Employee</th>
                    <th>ID</th>
                    <th>Loan Type</th>
                    <th>Amount</th>
                    <th>Interest</th>
                    <th>Tenure</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((r, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td><strong>{r.employeeName}</strong></td>
                      <td>{r.employeeId}</td>
                      <td><Badge bg="secondary">{r.loanType}</Badge></td>
                      <td><strong>{formatCurrency(r.amount)}</strong></td>
                      <td>{r.interest}%</td>
                      <td>{r.tenure} months</td>
                      <td>{getStatusBadge(r.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default LoanReports;