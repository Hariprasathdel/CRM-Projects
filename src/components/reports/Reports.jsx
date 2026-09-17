import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Alert, 
  Spinner,
  Badge,
  Tabs,
  Tab,
  Modal
} from 'react-bootstrap';
import { 
  FaChartBar, 
  FaDownload, 
  FaFileAlt,
  FaUsers,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaProjectDiagram,
  FaUserCheck,
  FaClock,
  FaBuilding,
  FaCheckCircle,
  FaTimesCircle,
  FaSync
} from 'react-icons/fa';
import ReportGenerator from './ReportGenerator';
import ReportViewer from './ReportViewer';
import reportService from '../../services/reportService';
import './Reports.css';

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('viewer');
  const [selectedReport, setSelectedReport] = useState(null);
  const [generatedReports, setGeneratedReports] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch reports from MongoDB on mount
  useEffect(() => {
    fetchGeneratedReports();
  }, []);

  const fetchGeneratedReports = async () => {
    setLoading(true);
    try {
      const res = await reportService.getAllReports({ limit: 100 });
      if (res.success && Array.isArray(res.data)) {
        setGeneratedReports(res.data);
      } else {
        setError(res.error?.message || 'Failed to fetch reports from MongoDB');
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Unable to reach server. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async (reportData) => {
    setGenerating(true);
    setError('');
    try {
      const res = await reportService.generateReport(reportData);
      if (res.success) {
        setSuccess('Report generated successfully and saved to MongoDB!');
        setTimeout(() => setSuccess(''), 4000);
        await fetchGeneratedReports();
        setActiveTab('viewer');
      } else {
        setError(res.error?.message || 'Failed to generate report.');
      }
    } catch (err) {
      console.error('Error generating report:', err);
      setError(err.message || 'Failed to generate report. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadReport = async (report) => {
    try {
      const reportId = report._id || report.id;
      const title = report.title || report.name || 'report';
      const format = (report.format || 'CSV').toLowerCase();
      
      setSuccess(`Preparing download for ${title}...`);
      
      const res = await reportService.downloadReport(reportId);
      if (res.success && res.data) {
        const mime = format === 'json' ? 'application/json' : 'text/csv';
        const blob = new Blob([res.data], { type: `${mime};charset=utf-8;` });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.replace(/[^a-z0-9]/gi, '_')}.${format === 'json' ? 'json' : 'csv'}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        setSuccess(`Downloaded ${title}!`);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        // Fallback client-side CSV download
        downloadReportClientFallback(report);
      }
    } catch (err) {
      console.error('Error downloading report:', err);
      downloadReportClientFallback(report);
    }
  };

  const downloadReportClientFallback = (report) => {
    const title = report.title || report.name || 'report';
    const lines = [
      `"Report Title","${title}"`,
      `"Type","${report.type}"`,
      `"Status","${report.status || 'Completed'}"`,
      `"Generated Date","${report.createdAt || report.generatedDate || new Date().toISOString()}"`,
      `""`,
      `"Key","Value"`
    ];
    if (report.data && typeof report.data === 'object') {
      Object.entries(report.data).forEach(([k, v]) => {
        lines.push(`"${k}","${typeof v === 'object' ? JSON.stringify(v).replace(/"/g, '""') : String(v).replace(/"/g, '""')}"`);
      });
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, '_')}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    setSuccess(`Downloaded ${title} (CSV)!`);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleExportAll = () => {
    if (generatedReports.length === 0) {
      setError('No reports available to export.');
      return;
    }
    const lines = [
      `"ID","Title","Type","Format","Status","Size","Created At"`,
      ...generatedReports.map(r => 
        `"${r._id || r.id}","${(r.title || r.name || '').replace(/"/g, '""')}","${r.type}","${r.format}","${r.status}","${r.size || '1.0 MB'}","${r.createdAt || r.generatedDate}"`
      )
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crm_all_reports_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    setSuccess('Exported all reports to CSV!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDeleteReport = async (id) => {
    if (window.confirm('Are you sure you want to delete this report from MongoDB?')) {
      try {
        const res = await reportService.deleteReport(id);
        if (res.success) {
          setSuccess('Report deleted successfully from database!');
          setTimeout(() => setSuccess(''), 3000);
          setGeneratedReports(prev => prev.filter(r => (r._id || r.id) !== id));
        } else {
          setError(res.error?.message || 'Failed to delete report');
        }
      } catch (err) {
        console.error('Delete error:', err);
        setError('Failed to delete report');
      }
    }
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
  };

  const formatReportDate = (date) => {
    if (!date) return 'Recent';
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return date || 'Not available';

    return parsedDate.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const isCompleted = status === 'Completed' || status === 'generated';
    const isProcessing = status === 'Processing' || status === 'processing' || status === 'draft';
    
    if (isCompleted) {
      return (
        <Badge bg="success" className="status-badge">
          <FaCheckCircle className="me-1" /> Completed
        </Badge>
      );
    }
    if (isProcessing) {
      return (
        <Badge bg="warning" className="status-badge">
          <FaClock className="me-1" /> Processing
        </Badge>
      );
    }
    return (
      <Badge bg="danger" className="status-badge">
        <FaTimesCircle className="me-1" /> Failed
      </Badge>
    );
  };

  // Statistics derived directly from live reports
  const totalReports = generatedReports.length;
  const completedReports = generatedReports.filter(r => r.status === 'Completed' || r.status === 'generated').length;
  const processingReports = generatedReports.filter(r => r.status === 'Processing' || r.status === 'draft' || r.status === 'processing').length;

  return (
    <div className="reports-page">
      <Container fluid>
        {/* Header Section */}
        <div className="reports-header">
          <div className="header-left">
            <h2 className="page-title">Reports Management</h2>
            <p className="page-subtitle">Generate, view, and export live reports from MongoDB</p>
          </div>
          <div className="header-right">
            <Button 
              variant="outline-primary" 
              className="me-2"
              onClick={fetchGeneratedReports}
              disabled={loading}
            >
              <FaSync className={`me-1 ${loading ? 'fa-spin' : ''}`} /> Refresh
            </Button>
            <Button 
              variant="primary" 
              className="me-2"
              onClick={() => setActiveTab('generator')}
            >
              <FaChartBar className="me-1" /> Generate Report
            </Button>
            <Button 
              variant="outline-secondary"
              onClick={handleExportAll}
            >
              <FaDownload className="me-1" /> Export All
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <Row className="statistics-cards mb-4">
          <Col lg={4} md={6} className="mb-3">
            <Card className="stat-card total-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon-wrapper primary">
                    <FaFileAlt className="stat-icon" />
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">{totalReports}</h3>
                    <p className="stat-label">Total Reports</p>
                    <small className="stat-detail">MongoDB saved reports</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={4} md={6} className="mb-3">
            <Card className="stat-card completed-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon-wrapper success">
                    <FaCheckCircle className="stat-icon" />
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">{completedReports}</h3>
                    <p className="stat-label">Completed</p>
                    <small className="stat-detail">Ready to download</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={4} md={12} className="mb-3">
            <Card className="stat-card processing-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon-wrapper warning">
                    <FaClock className="stat-icon" />
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">{processingReports}</h3>
                    <p className="stat-label">Processing</p>
                    <small className="stat-detail">In progress</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Alerts */}
        {error && (
          <Alert variant="danger" onClose={() => setError('')} dismissible>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert variant="success" onClose={() => setSuccess('')} dismissible>
            {success}
          </Alert>
        )}

        {/* Main Content */}
        <Card className="reports-main-card">
          <Card.Body>
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className="reports-tabs"
            >
              <Tab eventKey="viewer" title={
                <span>
                  <FaFileAlt className="me-2" />
                  Report Viewer ({generatedReports.length})
                </span>
              }>
                {loading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3 text-muted">Loading live reports from MongoDB...</p>
                  </div>
                ) : (
                  <ReportViewer 
                    reports={generatedReports}
                    onDownload={handleDownloadReport}
                    onDelete={handleDeleteReport}
                    onView={handleViewReport}
                    getStatusBadge={getStatusBadge}
                  />
                )}
              </Tab>

              <Tab eventKey="generator" title={
                <span>
                  <FaChartBar className="me-2" />
                  Report Generator
                </span>
              }>
                {generating ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3 text-muted">Aggregating MongoDB data and generating report...</p>
                  </div>
                ) : (
                  <ReportGenerator onGenerate={handleGenerateReport} />
                )}
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>

        {/* Report Preview Modal */}
        <Modal
          show={Boolean(selectedReport)}
          onHide={() => setSelectedReport(null)}
          centered
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Report Preview</Modal.Title>
          </Modal.Header>
          {selectedReport && (
            <>
              <Modal.Body>
                <div className="report-preview-header d-flex align-items-center mb-3">
                  <div className="report-preview-icon me-3 p-3 bg-light rounded text-primary fs-3">
                    {selectedReport.icon || <FaFileAlt />}
                  </div>
                  <div>
                    <h5 className="mb-1">{selectedReport.title || selectedReport.name}</h5>
                    <p className="text-muted mb-0">{selectedReport.description || 'MongoDB CRM generated report'}</p>
                  </div>
                </div>

                <div className="report-preview-details row g-3 bg-light p-3 rounded mb-3">
                  <div className="col-6 col-md-4">
                    <span className="text-muted d-block small">Type</span>
                    <strong className="text-capitalize">{selectedReport.type || 'Custom'}</strong>
                  </div>
                  <div className="col-6 col-md-4">
                    <span className="text-muted d-block small">Format</span>
                    <strong>{selectedReport.format || 'PDF'}</strong>
                  </div>
                  <div className="col-6 col-md-4">
                    <span className="text-muted d-block small">Generated</span>
                    <strong>{formatReportDate(selectedReport.createdAt || selectedReport.generatedDate)}</strong>
                  </div>
                  <div className="col-6 col-md-4">
                    <span className="text-muted d-block small">File Size</span>
                    <strong>{selectedReport.size || '1.0 MB'}</strong>
                  </div>
                  <div className="col-6 col-md-4">
                    <span className="text-muted d-block small">Created by</span>
                    <strong>{selectedReport.generatedBy?.name || selectedReport.createdBy || 'Admin'}</strong>
                  </div>
                  <div className="col-6 col-md-4">
                    <span className="text-muted d-block small">Status</span>
                    {getStatusBadge(selectedReport.status)}
                  </div>
                </div>

                {selectedReport.data && (
                  <div>
                    <h6 className="fw-bold mb-2">Aggregated Report Summary</h6>
                    <div className="p-3 border rounded bg-white" style={{ maxHeight: '220px', overflowY: 'auto' }}>
                      <pre className="mb-0 small" style={{ whiteSpace: 'pre-wrap' }}>
                        {JSON.stringify(selectedReport.data, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setSelectedReport(null)}>
                  Close
                </Button>
                <Button
                  variant="success"
                  onClick={() => {
                    handleDownloadReport(selectedReport);
                    setSelectedReport(null);
                  }}
                >
                  <FaDownload className="me-1" /> Download Report
                </Button>
              </Modal.Footer>
            </>
          )}
        </Modal>
      </Container>
    </div>
  );
};

export default Reports;
