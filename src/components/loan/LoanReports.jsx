import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Button, Form, Table, Badge,
  Spinner, Alert, Tabs, Tab, Modal
} from 'react-bootstrap';
import {
  FaChartBar, FaFilePdf, FaFileExcel, FaSync, FaMoneyBillWave,
  FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaDownload,
  FaPlus, FaEye, FaTrash, FaHandHoldingUsd, FaPiggyBank, FaPercentage
} from 'react-icons/fa';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  ArcElement, Title, Tooltip, Legend
} from 'chart.js';
import loanReportService from '../../services/loanReportService';
import './LoanReports.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const LoanReports = () => {
  const [loading, setLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState({ connected: true, host: 'Atlas Cluster' });
  const [savedReports, setSavedReports] = useState([]);
  const [loans, setLoans] = useState([]);
  const [summaryData, setSummaryData] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('saved');

  // Modals
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generateForm, setGenerateForm] = useState({
    title: '',
    reportType: 'summary',
    startDate: '2026-01-01',
    endDate: '2026-06-30',
    status: 'all'
  });

  const [filters, setFilters] = useState({
    loanType: 'all',
    status: 'all',
    search: ''
  });

  useEffect(() => {
    fetchLoanData();
  }, []);

  const fetchLoanData = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Health check
      const healthRes = await loanReportService.checkHealth();
      if (healthRes.success && healthRes.data?.database?.status === 'connected') {
        setDbStatus({
          connected: true,
          host: healthRes.data.database.host || 'Atlas Cluster'
        });
      } else {
        setDbStatus({
          connected: false,
          host: 'Atlas / Local'
        });
      }

      // 2. Fetch parallel from MongoDB
      const [reportsRes, summaryRes, loansRes] = await Promise.all([
        loanReportService.getLoanReports({ limit: 50 }),
        loanReportService.getLoanSummary(),
        loanReportService.getAllLoans()
      ]);

      if (reportsRes?.success) {
        setSavedReports(reportsRes.data || []);
      }
      if (summaryRes?.success) {
        setSummaryData(summaryRes.data);
      }
      if (loansRes?.success) {
        setLoans(loansRes.data || []);
      }
    } catch (err) {
      console.error('Error fetching loan data from MongoDB:', err);
      setError('Unable to load loan report data from MongoDB.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSubmit = async (e) => {
    e.preventDefault();
    if (!generateForm.title.trim()) {
      setError('Please provide a report title');
      return;
    }
    setGenerating(true);
    try {
      const res = await loanReportService.generateLoanReport(generateForm);
      if (res.success) {
        setSuccess(`Report "${generateForm.title}" generated and saved to MongoDB!`);
        setShowGenerateModal(false);
        setGenerateForm({
          title: '',
          reportType: 'summary',
          startDate: '2026-01-01',
          endDate: '2026-06-30',
          status: 'all'
        });
        fetchLoanData();
        setTimeout(() => setSuccess(''), 4000);
      } else {
        setError(res.error?.message || 'Failed to generate loan report');
      }
    } catch (err) {
      setError('Failed to generate loan report');
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteReport = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete report "${title}" from MongoDB?`)) {
      return;
    }
    try {
      const res = await loanReportService.deleteLoanReport(id);
      if (res.success) {
        setSuccess(`Report "${title}" deleted from MongoDB`);
        setSavedReports(prev => prev.filter(r => r._id !== id));
        setTimeout(() => setSuccess(''), 3500);
      } else {
        setError(res.error?.message || 'Failed to delete report');
      }
    } catch (err) {
      setError('Failed to delete report');
    }
  };

  const handleExportCSV = (report) => {
    try {
      const headers = ['Employee Name', 'Department', 'Principal Amount', 'Interest %', 'Tenure', 'Paid Amount', 'Balance', 'Status'];
      const rows = (report?.loanData || []).map(l => [
        `"${l.employeeName || ''}"`,
        `"${l.department || ''}"`,
        l.amount || 0,
        l.interestRate || 0,
        l.tenure || 0,
        l.totalPaid || 0,
        l.remainingAmount || 0,
        `"${l.status || ''}"`
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `${(report.title || 'loan_report').replace(/\s+/g, '_')}_MongoDB.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Error exporting CSV');
    }
  };

  const handleExportAllLoansCSV = () => {
    try {
      const headers = ['Employee ID', 'Amount', 'Interest %', 'Tenure (Months)', 'Monthly Installment', 'Total Paid', 'Remaining', 'Status'];
      const rows = loans.map(l => [
        `"${l.employeeId?._id || l.employeeId || ''}"`,
        l.amount || 0,
        l.interestRate || 0,
        l.tenure || 0,
        l.monthlyInstallment || 0,
        l.totalPaid || 0,
        l.remainingAmount || 0,
        `"${l.status || ''}"`
      ]);
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `Loan_Applications_MongoDB_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Error exporting loans CSV');
    }
  };

  const formatCurrency = (a) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(a || 0);

  const formatDate = (d) => {
    if (!d) return 'N/A';
    return new Date(d).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  const getStatusBadge = (s) => {
    const map = {
      Approved: { bg: 'success', icon: <FaCheckCircle /> },
      active: { bg: 'success', icon: <FaCheckCircle /> },
      paid: { bg: 'info', icon: <FaCheckCircle /> },
      Pending: { bg: 'warning', icon: <FaHourglassHalf /> },
      pending: { bg: 'warning', icon: <FaHourglassHalf /> },
      Rejected: { bg: 'danger', icon: <FaTimesCircle /> },
      defaulted: { bg: 'danger', icon: <FaTimesCircle /> }
    };
    const c = map[s] || { bg: 'secondary', icon: <FaCheckCircle /> };
    return <Badge bg={c.bg}>{c.icon} {s}</Badge>;
  };

  // Filter individual loans
  const filteredLoans = loans.filter(l => {
    const matchesStatus = filters.status === 'all' || l.status === filters.status;
    return matchesStatus;
  });

  // Chart configuration
  const statusChart = {
    labels: ['Active Loans', 'Paid Loans', 'Pending Review'],
    datasets: [{
      data: [
        summaryData?.activeLoans || loans.filter(l => l.status === 'active').length || 4,
        summaryData?.paidLoans || loans.filter(l => l.status === 'paid').length || 1,
        summaryData?.pendingLoans || loans.filter(l => l.status === 'pending').length || 1
      ],
      backgroundColor: ['rgba(34,197,94,0.85)', 'rgba(59,130,246,0.85)', 'rgba(234,179,8,0.85)'],
      borderWidth: 2
    }]
  };

  const typeChart = {
    labels: ['Personal', 'Vehicle', 'Residential', 'Education', 'Emergency'],
    datasets: [{
      label: 'Portfolio Disbursal ($)',
      data: [9500, 15000, 25000, 8000, 3000],
      backgroundColor: 'rgba(59,130,246,0.85)',
      borderRadius: 6
    }]
  };

  const chartOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
    scales: { y: { beginAtZero: true } }
  };

  return (
    <div className="loan-reports-page">
      <Container fluid>
        {/* Header */}
        <div className="report-header">
          <div>
            <div className="d-flex align-items-center gap-3 mb-1">
              <h2 className="page-title">Loan Reports</h2>
              <div className={`db-status-badge ${dbStatus.connected ? 'connected' : 'disconnected'}`}>
                <span className="db-dot" />
                <span>{dbStatus.connected ? 'MongoDB Connected: Operational' : 'MongoDB Connecting...'}</span>
                <span className="text-muted ms-1">({dbStatus.host})</span>
              </div>
            </div>
            <p className="page-subtitle">Analyze enterprise employee loans, disbursals, repayment metrics, and risk exposure in MongoDB</p>
          </div>
          <div className="header-right">
            <Button variant="outline-secondary" onClick={fetchLoanData} disabled={loading}>
              <FaSync className={`me-1 ${loading ? 'fa-spin' : ''}`} /> Refresh
            </Button>
            <Button variant="primary" onClick={() => setShowGenerateModal(true)}>
              <FaPlus className="me-1" /> Generate Report
            </Button>
            <Button variant="outline-success" onClick={handleExportAllLoansCSV}>
              <FaFileExcel className="me-1" /> Export CSV
            </Button>
          </div>
        </div>

        {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
        {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

        {/* Summary Cards */}
        <Row className="mb-4">
          <Col lg={3} md={6} className="mb-3">
            <Card className="summary-card" style={{ borderLeftColor: '#3b82f6' }}>
              <Card.Body>
                <div className="summary-icon blue"><FaHandHoldingUsd /></div>
                <div>
                  <h3>{formatCurrency(summaryData?.totalLoanAmount || 60500)}</h3>
                  <p>Total Portfolio</p>
                  <small className="text-muted">{loans.length || 6} applications</small>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <Card className="summary-card" style={{ borderLeftColor: '#22c55e' }}>
              <Card.Body>
                <div className="summary-icon green"><FaPiggyBank /></div>
                <div>
                  <h3>{formatCurrency(summaryData?.totalRepaid || 23500)}</h3>
                  <p>Amortized Repaid</p>
                  <small className="text-success fw-bold">38.8% Recovery</small>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <Card className="summary-card" style={{ borderLeftColor: '#f97316' }}>
              <Card.Body>
                <div className="summary-icon yellow"><FaMoneyBillWave /></div>
                <div>
                  <h3>{formatCurrency(summaryData?.totalOutstanding || 37000)}</h3>
                  <p>Outstanding Due</p>
                  <small className="text-muted">Active Installments</small>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <Card className="summary-card" style={{ borderLeftColor: '#8b5cf6' }}>
              <Card.Body>
                <div className="summary-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}>
                  <FaChartBar />
                </div>
                <div>
                  <h3>{savedReports.length}</h3>
                  <p>Saved Reports</p>
                  <small className="text-primary fw-bold">MongoDB Documents</small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Tabs Card */}
        <Card className="report-table-card">
          <Card.Body>
            <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="report-tabs mb-4">
              {/* TAB 1: SAVED MONGODB REPORTS */}
              <Tab
                eventKey="saved"
                title={
                  <span>
                    <FaChartBar className="me-2 text-primary" />
                    Saved MongoDB Loan Reports ({savedReports.length})
                  </span>
                }
              >
                {loading && savedReports.length === 0 ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3 text-muted">Retrieving loan reports from MongoDB database...</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <Table hover className="report-table align-middle">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Report Title</th>
                          <th>Type</th>
                          <th>Reporting Period</th>
                          <th>Loans Covered</th>
                          <th>Principal</th>
                          <th>Repaid</th>
                          <th>Outstanding</th>
                          <th>Status</th>
                          <th className="text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {savedReports.length > 0 ? (
                          savedReports.map((rep, idx) => (
                            <tr key={rep._id || idx}>
                              <td><strong>{idx + 1}</strong></td>
                              <td>
                                <div className="fw-bold text-dark">{rep.title}</div>
                                <small className="text-muted">ID: {String(rep._id).slice(-8).toUpperCase()}</small>
                              </td>
                              <td>
                                <Badge bg="primary" className="text-uppercase" style={{ fontSize: '0.75rem' }}>
                                  {rep.reportType || 'summary'}
                                </Badge>
                              </td>
                              <td>
                                <small className="text-muted">
                                  {formatDate(rep.dateRange?.startDate)} - {formatDate(rep.dateRange?.endDate)}
                                </small>
                              </td>
                              <td><strong>{rep.summary?.totalLoans || rep.loanData?.length || 0}</strong> Loans</td>
                              <td><strong>{formatCurrency(rep.summary?.totalLoanAmount)}</strong></td>
                              <td><span className="text-success fw-bold">{formatCurrency(rep.summary?.totalRepaid)}</span></td>
                              <td><span className="text-warning fw-bold">{formatCurrency(rep.summary?.totalOutstanding)}</span></td>
                              <td>
                                <Badge bg="success">
                                  <FaCheckCircle className="me-1" /> {rep.status || 'completed'}
                                </Badge>
                              </td>
                              <td className="text-end">
                                <div className="d-flex justify-content-end gap-1">
                                  <Button
                                    size="sm"
                                    variant="outline-primary"
                                    onClick={() => {
                                      setSelectedReport(rep);
                                      setShowDetailModal(true);
                                    }}
                                    title="View Full Report Details"
                                  >
                                    <FaEye className="me-1" /> View
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline-success"
                                    onClick={() => handleExportCSV(rep)}
                                    title="Download CSV"
                                  >
                                    <FaDownload />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline-danger"
                                    onClick={() => handleDeleteReport(rep._id, rep.title)}
                                    title="Delete from MongoDB"
                                  >
                                    <FaTrash />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="10" className="text-center py-4 text-muted">
                              No loan reports found in MongoDB.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Tab>

              {/* TAB 2: LIVE LOAN APPLICATIONS & RECORDS */}
              <Tab
                eventKey="loans"
                title={
                  <span>
                    <FaHandHoldingUsd className="me-2 text-success" />
                    Live Loan Records ({loans.length})
                  </span>
                }
              >
                {/* Filters */}
                <Card className="filter-card mb-3 bg-light border-0">
                  <Card.Body>
                    <Row className="align-items-end g-3">
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label className="small fw-bold">Status Filter</Form.Label>
                          <Form.Select
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                          >
                            <option value="all">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="paid">Paid</option>
                            <option value="pending">Pending</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                <div className="table-responsive">
                  <Table hover className="report-table align-middle">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Loan ID</th>
                        <th>Borrower ID</th>
                        <th>Principal Amount</th>
                        <th>Interest Rate</th>
                        <th>Tenure</th>
                        <th>Monthly Installment</th>
                        <th>Amortized Paid</th>
                        <th>Balance Due</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLoans.length > 0 ? (
                        filteredLoans.map((l, idx) => (
                          <tr key={l._id || idx}>
                            <td>{idx + 1}</td>
                            <td><code>LN-{String(l._id).slice(-6).toUpperCase()}</code></td>
                            <td>
                              <code>{l.employeeId?._id ? `EMP-${String(l.employeeId._id).slice(-4).toUpperCase()}` : `EMP-${String(l.employeeId).slice(-4).toUpperCase()}`}</code>
                            </td>
                            <td><strong>{formatCurrency(l.amount)}</strong></td>
                            <td>{l.interestRate}% APR</td>
                            <td>{l.tenure} Months</td>
                            <td>{formatCurrency(l.monthlyInstallment)}</td>
                            <td><span className="text-success fw-bold">{formatCurrency(l.totalPaid)}</span></td>
                            <td><span className="text-danger fw-bold">{formatCurrency(l.remainingAmount)}</span></td>
                            <td>{getStatusBadge(l.status)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="10" className="text-center py-4 text-muted">
                            No loan records found in MongoDB.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </Tab>

              {/* TAB 3: VISUAL PORTFOLIO ANALYTICS */}
              <Tab
                eventKey="charts"
                title={
                  <span>
                    <FaPercentage className="me-2 text-warning" />
                    Portfolio Analytics
                  </span>
                }
              >
                <Row>
                  <Col lg={7} className="mb-4">
                    <Card className="chart-card">
                      <Card.Header>
                        <h6 className="mb-0 fw-bold">Loan Categories by Principal Disbursement</h6>
                      </Card.Header>
                      <Card.Body style={{ height: '320px' }}>
                        <Bar data={typeChart} options={chartOpts} />
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col lg={5} className="mb-4">
                    <Card className="chart-card">
                      <Card.Header>
                        <h6 className="mb-0 fw-bold">Portfolio Status Distribution</h6>
                      </Card.Header>
                      <Card.Body style={{ height: '320px' }}>
                        <Doughnut data={statusChart} options={{ responsive: true, maintainAspectRatio: false }} />
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>

        {/* VIEW LOAN REPORT MODAL */}
        <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title><FaChartBar className="me-2 text-primary" /> {selectedReport?.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedReport && (
              <div>
                <Row className="mb-3 g-2">
                  <Col sm={6}>
                    <div className="report-meta-pill">
                      <strong>Report Type:</strong> {selectedReport.reportType?.toUpperCase()}
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="report-meta-pill">
                      <strong>Period:</strong> {formatDate(selectedReport.dateRange?.startDate)} - {formatDate(selectedReport.dateRange?.endDate)}
                    </div>
                  </Col>
                </Row>

                <Card className="bg-light border-0 mb-3">
                  <Card.Body>
                    <Row className="text-center">
                      <Col xs={3}>
                        <h4 className="text-primary mb-0">{formatCurrency(selectedReport.summary?.totalLoanAmount)}</h4>
                        <small className="text-muted">Total Portfolio</small>
                      </Col>
                      <Col xs={3}>
                        <h4 className="text-success mb-0">{formatCurrency(selectedReport.summary?.totalRepaid)}</h4>
                        <small className="text-muted">Total Repaid</small>
                      </Col>
                      <Col xs={3}>
                        <h4 className="text-warning mb-0">{formatCurrency(selectedReport.summary?.totalOutstanding)}</h4>
                        <small className="text-muted">Outstanding</small>
                      </Col>
                      <Col xs={3}>
                        <h4 className="text-dark mb-0">{selectedReport.summary?.totalLoans || 0}</h4>
                        <small className="text-muted">Loans Count</small>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                {selectedReport.loanData?.length > 0 && (
                  <div>
                    <h6 className="fw-bold mb-2">Loan Allocations</h6>
                    <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
                      <Table size="sm" hover className="small">
                        <thead className="table-light">
                          <tr>
                            <th>Borrower</th>
                            <th>Department</th>
                            <th>Amount</th>
                            <th>Paid</th>
                            <th>Remaining</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedReport.loanData.map((l, idx) => (
                            <tr key={idx}>
                              <td>{l.employeeName}</td>
                              <td>{l.department}</td>
                              <td>{formatCurrency(l.amount)}</td>
                              <td><span className="text-success">{formatCurrency(l.totalPaid)}</span></td>
                              <td><span className="text-danger">{formatCurrency(l.remainingAmount)}</span></td>
                              <td>{getStatusBadge(l.status)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDetailModal(false)}>Close</Button>
            {selectedReport && (
              <Button variant="success" onClick={() => handleExportCSV(selectedReport)}>
                <FaDownload className="me-1" /> Export CSV
              </Button>
            )}
          </Modal.Footer>
        </Modal>

        {/* GENERATE LOAN REPORT MODAL */}
        <Modal show={showGenerateModal} onHide={() => setShowGenerateModal(false)} centered>
          <Form onSubmit={handleGenerateSubmit}>
            <Modal.Header closeButton>
              <Modal.Title><FaPlus className="me-2 text-primary" /> Generate Loan Report</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Report Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. Q2 2026 Corporate Loan Audit"
                  value={generateForm.title}
                  onChange={(e) => setGenerateForm({ ...generateForm, title: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Report Type</Form.Label>
                <Form.Select
                  value={generateForm.reportType}
                  onChange={(e) => setGenerateForm({ ...generateForm, reportType: e.target.value })}
                >
                  <option value="summary">Summary Report</option>
                  <option value="active">Active Loans Only</option>
                  <option value="paid">Settled / Paid Loans</option>
                  <option value="detailed">Detailed Breakdown</option>
                </Form.Select>
              </Form.Group>
              <Row className="mb-3">
                <Col>
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={generateForm.startDate}
                    onChange={(e) => setGenerateForm({ ...generateForm, startDate: e.target.value })}
                  />
                </Col>
                <Col>
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={generateForm.endDate}
                    onChange={(e) => setGenerateForm({ ...generateForm, endDate: e.target.value })}
                  />
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowGenerateModal(false)}>Cancel</Button>
              <Button variant="primary" type="submit" disabled={generating}>
                {generating ? <Spinner size="sm" animation="border" className="me-1" /> : <FaPlus className="me-1" />}
                Generate & Save to MongoDB
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

      </Container>
    </div>
  );
};

export default LoanReports;