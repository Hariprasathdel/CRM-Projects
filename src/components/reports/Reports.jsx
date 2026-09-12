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
  Tab
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
  FaUserTimes,
  FaClock,
  FaBuilding,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';
import ReportGenerator from './ReportGenerator';
import ReportViewer from './ReportViewer';
import './Reports.css';

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('generator');
  const [selectedReport, setSelectedReport] = useState(null);
  const [generatedReports, setGeneratedReports] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Mock data - In real app, this would come from API
  useEffect(() => {
    fetchGeneratedReports();
  }, []);

  const fetchGeneratedReports = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockReports = [
        {
          id: 1,
          name: 'Employee Attendance Summary',
          type: 'Attendance',
          format: 'PDF',
          generatedDate: '2026-01-20 14:30',
          size: '1.2 MB',
          status: 'Completed',
          createdBy: 'John Doe',
          description: 'Monthly attendance report for January 2026',
          icon: <FaUserCheck />
        },
        {
          id: 2,
          name: 'Department Performance Report',
          type: 'Performance',
          format: 'Excel',
          generatedDate: '2026-01-19 10:15',
          size: '2.5 MB',
          status: 'Completed',
          createdBy: 'Jane Smith',
          description: 'Q4 2025 department performance metrics',
          icon: <FaBuilding />
        },
        {
          id: 3,
          name: 'Leave Analysis Report',
          type: 'Leave',
          format: 'PDF',
          generatedDate: '2026-01-18 16:45',
          size: '0.8 MB',
          status: 'Completed',
          createdBy: 'Mike Johnson',
          description: 'Employee leave patterns and trends',
          icon: <FaClock />
        },
        {
          id: 4,
          name: 'Project Progress Report',
          type: 'Project',
          format: 'PDF',
          generatedDate: '2026-01-17 09:30',
          size: '3.1 MB',
          status: 'Processing',
          createdBy: 'Sarah Williams',
          description: 'Project status and milestone tracking',
          icon: <FaProjectDiagram />
        },
        {
          id: 5,
          name: 'Budget Allocation Report',
          type: 'Financial',
          format: 'Excel',
          generatedDate: '2026-01-16 11:20',
          size: '1.8 MB',
          status: 'Completed',
          createdBy: 'Robert Brown',
          description: 'Department budget allocation and utilization',
          icon: <FaMoneyBillWave />
        }
      ];

      setGeneratedReports(mockReports);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setError('Failed to load reports. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async (reportData) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newReport = {
        id: generatedReports.length + 1,
        ...reportData,
        generatedDate: new Date().toLocaleString(),
        size: '0.5 MB',
        status: 'Completed',
        createdBy: 'Current User'
      };
      
      setGeneratedReports([newReport, ...generatedReports]);
      setSuccess('Report generated successfully!');
      setTimeout(() => setSuccess(''), 3000);
      setActiveTab('viewer');
    } catch (error) {
      setError('Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = (report) => {
    console.log('Downloading report:', report.name);
    setSuccess(`Downloading ${report.name}...`);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDeleteReport = (id) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      setGeneratedReports(generatedReports.filter(report => report.id !== id));
      setSuccess('Report deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
  };

  const getStatusBadge = (status) => {
    const config = {
      Completed: { variant: 'success', icon: <FaCheckCircle /> },
      Processing: { variant: 'warning', icon: <FaClock /> },
      Failed: { variant: 'danger', icon: <FaTimesCircle /> }
    };
    const { variant, icon } = config[status] || config.Completed;
    return (
      <Badge bg={variant} className="status-badge">
        {icon} {status}
      </Badge>
    );
  };

  // Statistics
  const totalReports = generatedReports.length;
  const completedReports = generatedReports.filter(r => r.status === 'Completed').length;
  const processingReports = generatedReports.filter(r => r.status === 'Processing').length;

  return (
    <div className="reports-page">
      <Container fluid>
        {/* Header Section */}
        <div className="reports-header">
          <div className="header-left">
            <h2 className="page-title">Reports Management</h2>
            <p className="page-subtitle">Generate, view, and manage reports</p>
          </div>
          <div className="header-right">
            <Button 
              variant="primary" 
              className="me-2"
              onClick={() => setActiveTab('generator')}
            >
              <FaChartBar className="me-1" /> Generate Report
            </Button>
            <Button variant="outline-secondary">
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
                    <small className="stat-detail">Generated reports</small>
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
              <Tab eventKey="generator" title={
                <span>
                  <FaChartBar className="me-2" />
                  Report Generator
                </span>
              }>
                {loading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3 text-muted">Loading...</p>
                  </div>
                ) : (
                  <ReportGenerator onGenerate={handleGenerateReport} />
                )}
              </Tab>
              
              <Tab eventKey="viewer" title={
                <span>
                  <FaFileAlt className="me-2" />
                  Report Viewer ({generatedReports.length})
                </span>
              }>
                {loading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3 text-muted">Loading reports...</p>
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
            </Tabs>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Reports;