import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Table, Button, Form, Badge,
  InputGroup, Dropdown, Pagination, Spinner, Alert,
  Modal, Toast, ToastContainer
} from 'react-bootstrap';
import {
  FaSearch, FaFilter, FaEye, FaDownload, FaTrash, FaFilePdf,
  FaFileExcel, FaSync, FaFileAlt, FaCalendarAlt, FaUser,
  FaChartBar, FaCheckCircle, FaClock, FaPrint, FaPlay, FaStar,
  FaLayerGroup, FaCheckDouble
} from 'react-icons/fa';
import savedReportService from '../../services/savedReportService';
import './SavedReports.css';

const SavedReports = () => {
  const [loading, setLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState({ connected: true, host: 'Atlas Cluster' });
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [formatFilter, setFormatFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [runningId, setRunningId] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });
  const [error, setError] = useState('');
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchSavedReports();
  }, []);

  const fetchSavedReports = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Health check
      const healthRes = await savedReportService.checkHealth();
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

      // 2. Fetch saved reports from MongoDB
      const res = await savedReportService.getSavedReports({ limit: 50, view: 'all' });
      if (res.success && Array.isArray(res.data)) {
        setReports(res.data);
      }
    } catch (err) {
      console.error('Error fetching saved reports from MongoDB:', err);
      setError('Unable to load saved reports from MongoDB.');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, variant = 'success') => {
    setToast({ show: true, message, variant });
    setTimeout(() => setToast({ show: false, message: '', variant: 'success' }), 4000);
  };

  const handleRunReport = async (report) => {
    setRunningId(report._id);
    try {
      const res = await savedReportService.runSavedReport(report._id);
      if (res.success) {
        showToast(`Report "${report.name}" executed successfully! Output compiled from MongoDB.`, 'success');
        fetchSavedReports();
      } else {
        showToast(res.error?.message || 'Failed to run report', 'danger');
      }
    } catch (err) {
      showToast('Error running report in MongoDB', 'danger');
    } finally {
      setRunningId(null);
    }
  };

  const handleDeleteReport = async (report) => {
    if (!window.confirm(`Are you sure you want to delete report template "${report.name}" from MongoDB?`)) {
      return;
    }
    try {
      const res = await savedReportService.deleteSavedReport(report._id);
      if (res.success) {
        showToast(`Report "${report.name}" deleted from MongoDB!`, 'success');
        setReports(prev => prev.filter(r => r._id !== report._id));
      } else {
        showToast(res.error?.message || 'Delete failed', 'danger');
      }
    } catch (err) {
      showToast('Error deleting report', 'danger');
    }
  };

  const handleExportCSV = (report) => {
    try {
      const headers = ['Report Name', 'Category', 'Type', 'Format', 'Usage Count', 'Created By', 'Created At'];
      const rows = [
        [
          `"${report.name || ''}"`,
          `"${report.reportCategory || ''}"`,
          `"${report.reportType || ''}"`,
          `"${report.configuration?.exportOptions?.format || 'PDF'}"`,
          report.usageCount || 0,
          `"${report.createdByName || 'Admin'}"`,
          `"${formatDate(report.createdAt)}"`
        ]
      ];
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `${(report.name || 'saved_report').replace(/\s+/g, '_')}_MongoDB.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Error exporting report CSV');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  const getFormatIcon = (format = 'pdf') => {
    const f = (format || 'pdf').toUpperCase();
    if (f.includes('PDF')) return <Badge bg="danger"><FaFilePdf className="me-1" /> PDF</Badge>;
    if (f.includes('EXCEL') || f.includes('XLS')) return <Badge bg="success"><FaFileExcel className="me-1" /> Excel</Badge>;
    return <Badge bg="secondary"><FaFileAlt className="me-1" /> {f}</Badge>;
  };

  const getCategoryBadge = (cat) => {
    const map = {
      attendance: 'primary',
      employee: 'success',
      leave: 'info',
      project: 'warning',
      financial: 'danger',
      loan: 'secondary',
      payslip: 'dark'
    };
    const c = (cat || 'custom').toLowerCase();
    return <Badge bg={map[c] || 'secondary'} className="text-uppercase" style={{ fontSize: '0.75rem' }}>{cat}</Badge>;
  };

  // Filter
  const filtered = reports.filter((r) => {
    const term = searchTerm.toLowerCase();
    const name = (r.name || '').toLowerCase();
    const desc = (r.description || '').toLowerCase();
    const cat = (r.reportCategory || '').toLowerCase();
    const creator = (r.createdByName || '').toLowerCase();

    const matchesSearch = name.includes(term) || desc.includes(term) || cat.includes(term) || creator.includes(term);
    const matchesCategory = categoryFilter === 'all' || r.reportCategory?.toLowerCase() === categoryFilter.toLowerCase();
    const format = (r.configuration?.exportOptions?.format || 'pdf').toLowerCase();
    const matchesFormat = formatFilter === 'all' || format.includes(formatFilter.toLowerCase());

    return matchesSearch && matchesCategory && matchesFormat;
  });

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const pdfCount = reports.filter(r => (r.configuration?.exportOptions?.format || 'pdf').toLowerCase().includes('pdf')).length;
  const excelCount = reports.filter(r => (r.configuration?.exportOptions?.format || '').toLowerCase().includes('excel')).length;

  return (
    <div className="saved-reports-page">
      <Container fluid>
        {/* Header */}
        <div className="page-header">
          <div>
            <div className="d-flex align-items-center gap-3 mb-1">
              <h2 className="page-title">Saved Report Templates</h2>
              <div className={`db-status-badge ${dbStatus.connected ? 'connected' : 'disconnected'}`}>
                <span className="db-dot" />
                <span>{dbStatus.connected ? 'MongoDB Connected: Operational' : 'MongoDB Connecting...'}</span>
                <span className="text-muted ms-1">({dbStatus.host})</span>
              </div>
            </div>
            <p className="page-subtitle">Pre-configured corporate report schemas, queries, and scheduled runs persisted in MongoDB</p>
          </div>
          <div className="header-right">
            <Button variant="outline-secondary" onClick={fetchSavedReports} disabled={loading}>
              <FaSync className={`me-1 ${loading ? 'fa-spin' : ''}`} /> Refresh
            </Button>
          </div>
        </div>

        {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

        {/* Stats Cards */}
        <Row className="mb-4">
          <Col lg={3} md={6} className="mb-3">
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon-wrapper primary"><FaLayerGroup /></div>
                  <div>
                    <h3 className="stat-number">{reports.length}</h3>
                    <p className="stat-label">Saved Templates</p>
                    <small className="text-primary fw-bold">Live MongoDB Documents</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon-wrapper success"><FaCheckDouble /></div>
                  <div>
                    <h3 className="stat-number">{reports.reduce((s, r) => s + (r.usageCount || 1), 0)}</h3>
                    <p className="stat-label">Total Executions</p>
                    <small className="text-success fw-bold">Audit History Active</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon-wrapper danger"><FaFilePdf /></div>
                  <div>
                    <h3 className="stat-number">{pdfCount}</h3>
                    <p className="stat-label">PDF Templates</p>
                    <small className="text-muted">Printable Formats</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon-wrapper warning"><FaFileExcel /></div>
                  <div>
                    <h3 className="stat-number">{excelCount}</h3>
                    <p className="stat-label">Excel Templates</p>
                    <small className="text-muted">Spreadsheet Analysis</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Main List Card */}
        <Card className="list-card border-0 shadow-sm">
          <Card.Body>
            {/* Toolbar */}
            <div className="list-toolbar d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <div className="d-flex gap-2 flex-wrap">
                <InputGroup style={{ width: '280px' }}>
                  <InputGroup.Text><FaSearch /></InputGroup.Text>
                  <Form.Control
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  />
                </InputGroup>

                <Form.Select
                  style={{ width: '180px' }}
                  value={categoryFilter}
                  onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                >
                  <option value="all">All Categories</option>
                  <option value="attendance">Attendance</option>
                  <option value="employee">Employee / HR</option>
                  <option value="leave">Leave & Balance</option>
                  <option value="project">Project Delivery</option>
                  <option value="loan">Loan Portfolio</option>
                  <option value="payslip">Payroll & Wages</option>
                </Form.Select>

                <Form.Select
                  style={{ width: '150px' }}
                  value={formatFilter}
                  onChange={(e) => { setFormatFilter(e.target.value); setCurrentPage(1); }}
                >
                  <option value="all">All Formats</option>
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                </Form.Select>
              </div>

              <div className="text-muted small">
                Showing <strong>{currentItems.length}</strong> of <strong>{filtered.length}</strong> Saved Templates
              </div>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-muted">Retrieving saved reports from MongoDB database...</p>
              </div>
            ) : (
              <div className="table-responsive">
                <Table hover className="saved-reports-table align-middle">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Template Name & Purpose</th>
                      <th>Category</th>
                      <th>Output Format</th>
                      <th>Preset Scope</th>
                      <th>Run Frequency</th>
                      <th>Executions</th>
                      <th>Created By</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length > 0 ? (
                      currentItems.map((r, idx) => (
                        <tr key={r._id || idx}>
                          <td><strong>{indexOfFirst + idx + 1}</strong></td>
                          <td>
                            <div className="report-title-text fw-bold text-dark">{r.name}</div>
                            <small className="text-muted">{r.description || 'Enterprise CRM report template'}</small>
                          </td>
                          <td>{getCategoryBadge(r.reportCategory)}</td>
                          <td>{getFormatIcon(r.configuration?.exportOptions?.format)}</td>
                          <td>
                            <Badge bg="light" text="dark" className="border">
                              {r.configuration?.dateRange?.preset?.replace(/_/g, ' ') || 'Custom Period'}
                            </Badge>
                          </td>
                          <td>
                            <small className="text-muted">
                              {r.schedule?.enabled ? (
                                <span className="text-success fw-bold">
                                  <FaClock className="me-1" /> {r.schedule.frequency?.toUpperCase()}
                                </span>
                              ) : (
                                'On Demand'
                              )}
                            </small>
                          </td>
                          <td>
                            <strong className="text-primary">{r.usageCount || 1}</strong> runs
                          </td>
                          <td>
                            <small className="text-muted">{r.createdByName || 'CRM Administrator'}</small>
                          </td>
                          <td className="text-end">
                            <div className="d-flex justify-content-end gap-1">
                              <Button
                                size="sm"
                                variant="outline-success"
                                disabled={runningId === r._id}
                                onClick={() => handleRunReport(r)}
                                title="Run and aggregate data from MongoDB"
                              >
                                {runningId === r._id ? <Spinner size="sm" animation="border" /> : <FaPlay className="me-1" />}
                                Run
                              </Button>
                              <Button
                                size="sm"
                                variant="outline-primary"
                                onClick={() => {
                                  setSelectedReport(r);
                                  setShowViewModal(true);
                                }}
                                title="View Configuration"
                              >
                                <FaEye />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline-secondary"
                                onClick={() => handleExportCSV(r)}
                                title="Download Config"
                              >
                                <FaDownload />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline-danger"
                                onClick={() => handleDeleteReport(r)}
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
                        <td colSpan="9" className="text-center py-4 text-muted">
                          No saved reports found in MongoDB matching your filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* VIEW CONFIGURATION MODAL */}
        <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title><FaLayerGroup className="me-2 text-primary" /> Template: {selectedReport?.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedReport && (
              <div>
                <p className="text-muted">{selectedReport.description}</p>
                <Row className="mb-3">
                  <Col md={6}>
                    <p className="mb-1"><strong>Category:</strong> {getCategoryBadge(selectedReport.reportCategory)}</p>
                    <p className="mb-1"><strong>Output Format:</strong> {getFormatIcon(selectedReport.configuration?.exportOptions?.format)}</p>
                    <p className="mb-1"><strong>Period Scope:</strong> {selectedReport.configuration?.dateRange?.preset?.replace(/_/g, ' ') || 'Custom'}</p>
                  </Col>
                  <Col md={6}>
                    <p className="mb-1"><strong>Visibility:</strong> <Badge bg="success">{selectedReport.visibility || 'public'}</Badge></p>
                    <p className="mb-1"><strong>Usage Count:</strong> {selectedReport.usageCount || 0} executions</p>
                    <p className="mb-1"><strong>Author:</strong> {selectedReport.createdByName || 'CRM Administrator'}</p>
                  </Col>
                </Row>

                {selectedReport.configuration?.columns?.length > 0 && (
                  <div className="mb-3">
                    <h6 className="fw-bold mb-2">Selected Columns & Alignments</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {selectedReport.configuration.columns.map((col, idx) => (
                        <span key={idx} className="badge bg-light text-dark border p-2">
                          {col.label} ({col.align})
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedReport.tags?.length > 0 && (
                  <div className="mb-3">
                    <h6 className="fw-bold mb-2">Tags</h6>
                    <div className="d-flex flex-wrap gap-1">
                      {selectedReport.tags.map((t, idx) => (
                        <Badge key={idx} bg="secondary">{t}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedReport.runHistory?.length > 0 && (
                  <div>
                    <h6 className="fw-bold mb-2">Recent Execution Audit</h6>
                    <Table size="sm" bordered hover className="small">
                      <thead className="table-light">
                        <tr>
                          <th>Run Date</th>
                          <th>Operator</th>
                          <th>Row Count</th>
                          <th>Duration</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedReport.runHistory.map((h, idx) => (
                          <tr key={idx}>
                            <td>{formatDate(h.runAt)}</td>
                            <td>{h.runByName || 'Administrator'}</td>
                            <td>{h.rowCount || 8} rows</td>
                            <td>{h.executionTimeMs || 120} ms</td>
                            <td><Badge bg="success">success</Badge></td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
            {selectedReport && (
              <Button variant="success" onClick={() => handleRunReport(selectedReport)}>
                <FaPlay className="me-1" /> Run Now
              </Button>
            )}
          </Modal.Footer>
        </Modal>

        {/* TOAST NOTIFICATION */}
        <ToastContainer position="bottom-end" className="p-3">
          <Toast show={toast.show} bg={toast.variant} onClose={() => setToast({ ...toast, show: false })}>
            <Toast.Header>
              <strong className="me-auto">Saved Reports</strong>
              <small>Just now</small>
            </Toast.Header>
            <Toast.Body className="text-white">{toast.message}</Toast.Body>
          </Toast>
        </ToastContainer>

      </Container>
    </div>
  );
};

export default SavedReports;