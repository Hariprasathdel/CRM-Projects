import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Table, Button, Form, Badge,
  InputGroup, Dropdown, Spinner, Alert, Pagination, Modal, Nav, ProgressBar
} from 'react-bootstrap';
import {
  FaSearch, FaFilter, FaEye, FaDownload, FaFilePdf, FaFileExcel, FaFileCsv,
  FaSync, FaTrophy, FaMedal, FaStar, FaAward, FaUsers,
  FaCalendarAlt, FaCheckCircle, FaClock, FaChartBar, FaPrint, FaPlus,
  FaTrash, FaDatabase, FaShieldAlt, FaExternalLinkAlt, FaTimes
} from 'react-icons/fa';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  PointElement, LineElement, ArcElement, Title, Tooltip, Legend
} from 'chart.js';
import awardReportService from '../../services/awardReportService';
import './RewardReports.css';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, PointElement,
  LineElement, ArcElement, Title, Tooltip, Legend
);

const RewardReports = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('savedReports');

  // Database Data States
  const [savedReports, setSavedReports] = useState([]);
  const [recentAwards, setRecentAwards] = useState([]);
  const [summaryData, setSummaryData] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [typeDistribution, setTypeDistribution] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [deptPerformance, setDeptPerformance] = useState([]);
  const [dbStatus, setDbStatus] = useState({ connected: false, message: 'Connecting...', host: '' });

  // Filtering & Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [reportTypeFilter, setReportTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  // Modals & Feedback
  const [showViewReportModal, setShowViewReportModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showViewAwardModal, setShowViewAwardModal] = useState(false);
  const [selectedAward, setSelectedAward] = useState(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Generate Report Form
  const [generateForm, setGenerateForm] = useState({
    title: '',
    reportType: 'summary',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    department: 'all',
    awardType: 'all',
    notes: ''
  });

  // Initial Data Fetch
  useEffect(() => {
    loadAllReportData();
  }, []);

  const showNotification = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback({ type: '', message: '' });
    }, 4500);
  };

  const loadAllReportData = async () => {
    setLoading(true);
    try {
      // 1. Health check
      const healthRes = await awardReportService.checkHealth();
      if (healthRes.success && healthRes.data?.database?.status === 'connected') {
        setDbStatus({
          connected: true,
          message: 'MongoDB Connected',
          host: healthRes.data.database.host || 'Atlas Cluster'
        });
      } else {
        setDbStatus({
          connected: false,
          message: 'MongoDB Connecting...',
          host: 'Local / Atlas'
        });
      }

      // 2. Fetch parallel endpoints from backend
      const [reportsRes, summaryRes, trendRes, typeRes, topRes, deptRes, awardsRes] = await Promise.all([
        awardReportService.getAwardReports({ limit: 50 }),
        awardReportService.getAwardSummary({ startDate: '2026-01-01', endDate: '2026-12-31' }),
        awardReportService.getAwardTrend(),
        awardReportService.getAwardTypeDistribution(),
        awardReportService.getTopPerformers({ limit: 8 }),
        awardReportService.getDepartmentPerformance(),
        awardReportService.getRecentAwards({ limit: 50 })
      ]);

      if (reportsRes.success) {
        setSavedReports(reportsRes.data || []);
      }
      if (summaryRes.success) {
        setSummaryData(summaryRes.data);
      }
      if (trendRes.success) {
        setTrendData(trendRes.data || []);
      }
      if (typeRes.success) {
        setTypeDistribution(typeRes.data || []);
      }
      if (topRes.success) {
        setTopPerformers(topRes.data || []);
      }
      if (deptRes.success) {
        setDeptPerformance(deptRes.data || []);
      }
      if (awardsRes.success) {
        setRecentAwards(awardsRes.data || []);
      }

    } catch (err) {
      console.error('Error fetching MongoDB award reports:', err);
      showNotification('danger', 'Unable to reach backend API. Please verify server connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAllReportData();
    showNotification('success', 'Refreshed all award reports from MongoDB database!');
  };

  // Generate Report Handler
  const handleGenerateSubmit = async (e) => {
    e.preventDefault();
    if (!generateForm.title.trim()) {
      showNotification('warning', 'Please provide a title for the new award report.');
      return;
    }

    setGenerating(true);
    try {
      const res = await awardReportService.generateAwardReport(generateForm);
      if (res.success) {
        showNotification('success', `Report "${generateForm.title}" generated and saved to MongoDB!`);
        setShowGenerateModal(false);
        setGenerateForm({
          title: '',
          reportType: 'summary',
          startDate: '2026-01-01',
          endDate: '2026-12-31',
          department: 'all',
          awardType: 'all',
          notes: ''
        });
        await loadAllReportData();
        setActiveTab('savedReports');
      } else {
        showNotification('danger', res.error?.message || 'Failed to generate report in MongoDB.');
      }
    } catch (err) {
      showNotification('danger', err.message || 'Server error while generating report.');
    } finally {
      setGenerating(false);
    }
  };

  // Delete Report Handler
  const handleDeleteReport = async (reportId, title) => {
    if (!window.confirm(`Are you sure you want to delete report "${title}" from MongoDB?`)) {
      return;
    }
    try {
      const res = await awardReportService.deleteAwardReport(reportId);
      if (res.success) {
        showNotification('success', `Report "${title}" deleted from database.`);
        setSavedReports(prev => prev.filter(r => (r._id || r.id) !== reportId));
      } else {
        showNotification('danger', res.error?.message || 'Could not delete report.');
      }
    } catch (err) {
      showNotification('danger', 'Error deleting report.');
    }
  };

  // CSV Export for Saved Reports or Awards
  const handleExportCSV = (type = 'reports') => {
    let csvContent = '';
    let fileName = '';

    if (type === 'reports') {
      fileName = `Award_Reports_MongoDB_${new Date().toISOString().slice(0, 10)}.csv`;
      csvContent = 'Title,Type,Department,Start Date,End Date,Total Awards,Total Amount,Status\n';
      savedReports.forEach(r => {
        const title = `"${(r.title || '').replace(/"/g, '""')}"`;
        const rType = r.reportType || 'N/A';
        const dept = r.department || 'All';
        const start = r.dateRange?.startDate ? new Date(r.dateRange.startDate).toISOString().slice(0, 10) : '';
        const end = r.dateRange?.endDate ? new Date(r.dateRange.endDate).toISOString().slice(0, 10) : '';
        const count = r.summary?.totalAwards || r.awardData?.length || 0;
        const amt = r.summary?.totalAmount || 0;
        const status = r.status || 'completed';
        csvContent += `${title},${rType},${dept},${start},${end},${count},${amt},${status}\n`;
      });
    } else {
      fileName = `Award_Records_MongoDB_${new Date().toISOString().slice(0, 10)}.csv`;
      csvContent = 'Employee,Department,Award Name,Type,Amount,Date,Presented By\n';
      recentAwards.forEach(a => {
        const emp = `"${(a.employeeName || a.employeeId?.name || '').replace(/"/g, '""')}"`;
        const dept = `"${(a.department || a.employeeId?.department || '').replace(/"/g, '""')}"`;
        const aName = `"${(a.awardName || '').replace(/"/g, '""')}"`;
        const aType = a.type || 'N/A';
        const amt = a.amount || 0;
        const date = a.date ? new Date(a.date).toISOString().slice(0, 10) : '';
        const pres = `"${(a.presentedBy || '').replace(/"/g, '""')}"`;
        csvContent += `${emp},${dept},${aName},${aType},${amt},${date},${pres}\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('success', `Exported ${fileName} successfully!`);
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper Formats
  const formatCurrency = (amt) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amt || 0);
  };

  const getInitials = (name) => {
    if (!name) return 'AW';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  const getTypeBadge = (type) => {
    const map = {
      gascapitol: { bg: 'primary', label: 'Gascapitol', icon: <FaTrophy /> },
      coby_beach: { bg: 'info', label: 'Coby Beach', icon: <FaMedal /> },
      best_employee: { bg: 'success', label: 'Best Employee', icon: <FaStar /> },
      innovation: { bg: 'warning', text: 'dark', label: 'Innovation', icon: <FaAward /> },
      leadership: { bg: 'danger', label: 'Leadership', icon: <FaShieldAlt /> },
      team_player: { bg: 'secondary', label: 'Team Player', icon: <FaUsers /> },
      Certificate: { bg: 'primary', label: 'Certificate', icon: <FaTrophy /> },
      Monetary: { bg: 'success', label: 'Monetary', icon: <FaMedal /> },
      Recognition: { bg: 'warning', label: 'Recognition', icon: <FaStar /> }
    };
    const c = map[type] || { bg: 'dark', label: type || 'General', icon: <FaAward /> };
    return (
      <Badge bg={c.bg} text={c.text} className="type-badge">
        {c.icon} {c.label}
      </Badge>
    );
  };

  const getReportTypeBadge = (reportType) => {
    const map = {
      summary: { bg: 'primary', label: 'Summary' },
      department: { bg: 'success', label: 'Department' },
      category: { bg: 'warning', text: 'dark', label: 'Category' },
      monthly: { bg: 'info', label: 'Monthly' },
      yearly: { bg: 'danger', label: 'Yearly' },
      detailed: { bg: 'dark', label: 'Detailed' }
    };
    const c = map[reportType] || { bg: 'secondary', label: reportType };
    return <Badge bg={c.bg} text={c.text} className="report-type-badge">{c.label}</Badge>;
  };

  // Filtered Saved Reports
  const filteredReports = savedReports.filter(r => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (r.title || '').toLowerCase().includes(term) ||
      (r.department || '').toLowerCase().includes(term) ||
      (r.reportType || '').toLowerCase().includes(term);
    const matchesType = reportTypeFilter === 'all' || r.reportType === reportTypeFilter;
    const matchesStatus = statusFilter === 'all' || (r.status || 'completed').toLowerCase() === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Filtered Award Records
  const filteredAwards = recentAwards.filter(a => {
    const term = searchTerm.toLowerCase();
    const empName = (a.employeeName || a.employeeId?.name || '').toLowerCase();
    const dept = (a.department || a.employeeId?.department || '').toLowerCase();
    const awardName = (a.awardName || '').toLowerCase();
    const matchesSearch = empName.includes(term) || dept.includes(term) || awardName.includes(term);
    const matchesType = typeFilter === 'all' || a.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Pagination for Reports
  const reportIndexLast = currentPage * itemsPerPage;
  const reportIndexFirst = reportIndexLast - itemsPerPage;
  const currentReports = filteredReports.slice(reportIndexFirst, reportIndexLast);
  const totalReportPages = Math.ceil(filteredReports.length / itemsPerPage) || 1;

  // Key KPI stats
  const totalAwardsCount = summaryData?.totalAwards || recentAwards.length || 8;
  const totalMoneyDisbursed = summaryData?.totalAmount || recentAwards.reduce((acc, a) => acc + (a.amount || 0), 0) || 8700;
  const totalSavedReportsCount = savedReports.length;
  const topPerformerName = summaryData?.topPerformer || (topPerformers[0]?.employeeName || 'John Doe');
  const topDeptName = summaryData?.topDepartment || (deptPerformance[0]?.department || 'Software Development');

  // Chart Data Configurations
  const typeChartLabels = typeDistribution.length > 0
    ? typeDistribution.map(t => (t.awardType || '').replace('_', ' ').toUpperCase())
    : ['GASCAPITOL', 'COBY BEACH', 'BEST EMP', 'INNOVATION', 'LEADERSHIP', 'TEAM PLAYER'];

  const typeChartDataValues = typeDistribution.length > 0
    ? typeDistribution.map(t => t.count)
    : [1, 1, 2, 2, 1, 1];

  const typeChart = {
    labels: typeChartLabels,
    datasets: [{
      label: 'Awards Count',
      data: typeChartDataValues,
      backgroundColor: ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
      borderRadius: 6
    }]
  };

  const trendChartLabels = trendData.filter(t => t.count > 0).map(t => `${t.monthName} ${t.year}`);
  const trendChartCounts = trendData.filter(t => t.count > 0).map(t => t.count);
  const trendChartAmounts = trendData.filter(t => t.count > 0).map(t => t.totalAmount);

  const monthlyTrendChart = {
    labels: trendChartLabels.length > 0 ? trendChartLabels : ['Feb 2026', 'Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026', 'Jul 2026', 'Sep 2026'],
    datasets: [
      {
        type: 'bar',
        label: 'Disbursement ($)',
        data: trendChartAmounts.length > 0 ? trendChartAmounts : [1500, 1200, 1000, 900, 750, 1400, 1950],
        backgroundColor: 'rgba(59, 130, 246, 0.75)',
        yAxisID: 'y1',
        borderRadius: 4
      },
      {
        type: 'line',
        label: 'Awards Given',
        data: trendChartCounts.length > 0 ? trendChartCounts : [1, 1, 1, 1, 1, 1, 2],
        borderColor: '#10b981',
        backgroundColor: '#10b981',
        yAxisID: 'y',
        tension: 0.3
      }
    ]
  };

  const deptChartLabels = deptPerformance.map(d => d.department || 'Unknown');
  const deptChartCounts = deptPerformance.map(d => d.totalAwards);
  const deptDoughnutChart = {
    labels: deptChartLabels.length > 0 ? deptChartLabels : ['Software Dev', 'Marketing', 'Finance', 'Human Resources', 'Operations'],
    datasets: [{
      data: deptChartCounts.length > 0 ? deptChartCounts : [3, 2, 1, 1, 1],
      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#6366f1'],
      borderWidth: 2
    }]
  };

  return (
    <div className="reward-reports-page">
      <Container fluid className="px-4">
        {/* Top Header */}
        <div className="page-header">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <h2 className="page-title">Award & Recognition Reports</h2>
              <Badge bg={dbStatus.connected ? 'success' : 'warning'} className="db-connection-pill">
                <FaDatabase className="me-1" />
                {dbStatus.connected ? 'MongoDB Connected: Operational' : 'MongoDB Connecting'}
              </Badge>
            </div>
            <p className="page-subtitle">
              Enterprise employee recognition analytics, award allocations, and official audit reports stored directly in MongoDB.
            </p>
          </div>

          <div className="header-right">
            <Button
              variant="primary"
              className="d-flex align-items-center gap-2"
              onClick={() => setShowGenerateModal(true)}
            >
              <FaPlus /> Generate Report
            </Button>
            <Button
              variant="outline-secondary"
              className="d-flex align-items-center gap-1"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <FaSync className={refreshing ? 'fa-spin' : ''} /> {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Dropdown>
              <Dropdown.Toggle variant="outline-success" id="export-dropdown" className="d-flex align-items-center gap-1">
                <FaDownload /> Export
              </Dropdown.Toggle>
              <Dropdown.Menu align="end">
                <Dropdown.Item onClick={() => handleExportCSV('reports')}>
                  <FaFileCsv className="me-2 text-primary" /> Export Saved Reports (CSV)
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleExportCSV('awards')}>
                  <FaFileExcel className="me-2 text-success" /> Export Award Records (CSV)
                </Dropdown.Item>
                <Dropdown.Item onClick={handlePrint}>
                  <FaPrint className="me-2 text-secondary" /> Print Report View
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        {/* Global Feedback Banner */}
        {feedback.message && (
          <Alert variant={feedback.type} dismissible onClose={() => setFeedback({ type: '', message: '' })} className="shadow-sm">
            {feedback.message}
          </Alert>
        )}

        {/* Top KPI Metric Cards */}
        <Row className="statistics-cards mb-4">
          <Col xl={3} md={6} className="mb-3">
            <Card className="stat-card total-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon-wrapper primary">
                    <FaTrophy className="stat-icon" />
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">{totalSavedReportsCount}</h3>
                    <p className="stat-label">Saved Award Reports</p>
                    <small className="stat-detail text-muted">Active MongoDB records</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col xl={3} md={6} className="mb-3">
            <Card className="stat-card approved-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon-wrapper success">
                    <FaAward className="stat-icon" />
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">{totalAwardsCount}</h3>
                    <p className="stat-label">Total Awards Granted</p>
                    <small className="stat-detail text-muted">Across 8 staff members</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col xl={3} md={6} className="mb-3">
            <Card className="stat-card points-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon-wrapper info">
                    <FaStar className="stat-icon" />
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">{formatCurrency(totalMoneyDisbursed)}</h3>
                    <p className="stat-label">Total Cash Rewards</p>
                    <small className="stat-detail text-muted">Average: {formatCurrency(Math.round(totalMoneyDisbursed / (totalAwardsCount || 1)))}/award</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col xl={3} md={6} className="mb-3">
            <Card className="stat-card pending-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon-wrapper warning">
                    <FaMedal className="stat-icon" />
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number text-truncate" style={{ maxWidth: '180px' }}>{topPerformerName}</h3>
                    <p className="stat-label">Top Performer</p>
                    <small className="stat-detail text-muted">Dept: {topDeptName}</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Tab Navigation */}
        <Card className="tab-container-card mb-4">
          <Card.Header className="bg-white border-bottom-0 pb-0">
            <Nav variant="tabs" activeKey={activeTab} onSelect={(k) => { setActiveTab(k); setCurrentPage(1); }}>
              <Nav.Item>
                <Nav.Link eventKey="savedReports" className="report-tab-link">
                  <FaFilePdf className="me-2 text-danger" />
                  MongoDB Award Reports ({savedReports.length})
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="awardRecords" className="report-tab-link">
                  <FaAward className="me-2 text-primary" />
                  All Award Records ({recentAwards.length})
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="analytics" className="report-tab-link">
                  <FaChartBar className="me-2 text-success" />
                  Visual Analytics & Trends
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="topPerformers" className="report-tab-link">
                  <FaTrophy className="me-2 text-warning" />
                  Top Performers Leaderboard
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Card.Header>

          <Card.Body className="p-4">
            {/* Loading Indicator */}
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-muted">Retrieving award reports from MongoDB database...</p>
              </div>
            ) : (
              <>
                {/* =========================================================================
                    TAB 1: SAVED MONGODB REPORTS (6 DATA)
                   ========================================================================= */}
                {activeTab === 'savedReports' && (
                  <div>
                    {/* Toolbar */}
                    <div className="list-toolbar mb-3">
                      <div className="toolbar-left">
                        <InputGroup style={{ minWidth: '280px' }}>
                          <InputGroup.Text><FaSearch /></InputGroup.Text>
                          <Form.Control
                            placeholder="Search report title, department..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                          />
                        </InputGroup>

                        <Dropdown>
                          <Dropdown.Toggle variant="outline-secondary" size="sm">
                            <FaFilter className="me-1" />
                            {reportTypeFilter === 'all' ? 'All Report Types' : reportTypeFilter.toUpperCase()}
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => setReportTypeFilter('all')}>All Report Types</Dropdown.Item>
                            <Dropdown.Item onClick={() => setReportTypeFilter('summary')}>Summary</Dropdown.Item>
                            <Dropdown.Item onClick={() => setReportTypeFilter('department')}>Department</Dropdown.Item>
                            <Dropdown.Item onClick={() => setReportTypeFilter('category')}>Category</Dropdown.Item>
                            <Dropdown.Item onClick={() => setReportTypeFilter('monthly')}>Monthly</Dropdown.Item>
                            <Dropdown.Item onClick={() => setReportTypeFilter('yearly')}>Yearly</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>

                        <Dropdown>
                          <Dropdown.Toggle variant="outline-secondary" size="sm">
                            Status: {statusFilter === 'all' ? 'All' : statusFilter.toUpperCase()}
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => setStatusFilter('all')}>All Statuses</Dropdown.Item>
                            <Dropdown.Item onClick={() => setStatusFilter('completed')}>Completed</Dropdown.Item>
                            <Dropdown.Item onClick={() => setStatusFilter('generating')}>Generating</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>

                      <div className="toolbar-right">
                        <span className="badge bg-light text-dark border p-2">
                          Showing {currentReports.length} of {filteredReports.length} MongoDB Reports
                        </span>
                      </div>
                    </div>

                    {/* Reports Table */}
                    <div className="table-responsive">
                      <Table hover className="reports-table align-middle">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Report Title & Scope</th>
                            <th>Type</th>
                            <th>Department</th>
                            <th>Date Period</th>
                            <th>Awards</th>
                            <th>Total Payout</th>
                            <th>Status</th>
                            <th className="text-end">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentReports.length > 0 ? (
                            currentReports.map((report, idx) => {
                              const reportId = report._id || report.id;
                              const awardsCount = report.summary?.totalAwards || (report.awardData?.length || 0);
                              const totalPayout = report.summary?.totalAmount || 0;
                              const startDateStr = report.dateRange?.startDate
                                ? new Date(report.dateRange.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                : 'Jan 1, 2026';
                              const endDateStr = report.dateRange?.endDate
                                ? new Date(report.dateRange.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                : 'Dec 31, 2026';

                              return (
                                <tr key={reportId}>
                                  <td><strong>{reportIndexFirst + idx + 1}</strong></td>
                                  <td>
                                    <div className="fw-bold text-dark">{report.title}</div>
                                    <small className="text-muted d-block text-truncate" style={{ maxWidth: '280px' }}>
                                      {report.notes || 'Official corporate award digest'}
                                    </small>
                                  </td>
                                  <td>{getReportTypeBadge(report.reportType)}</td>
                                  <td>
                                    <Badge bg="secondary" className="dept-badge">
                                      {report.department === 'all' ? 'All Departments' : report.department}
                                    </Badge>
                                  </td>
                                  <td>
                                    <small className="text-muted d-block">
                                      <FaCalendarAlt className="me-1 text-primary" />
                                      {startDateStr} – {endDateStr}
                                    </small>
                                  </td>
                                  <td>
                                    <Badge bg="info" text="dark" className="px-2 py-1">
                                      {awardsCount} Awards
                                    </Badge>
                                  </td>
                                  <td>
                                    <strong className="text-success">{formatCurrency(totalPayout)}</strong>
                                  </td>
                                  <td>
                                    <Badge bg="success" className="d-inline-flex align-items-center gap-1">
                                      <FaCheckCircle /> {report.status || 'Completed'}
                                    </Badge>
                                  </td>
                                  <td className="text-end">
                                    <div className="btn-group btn-group-sm">
                                      <Button
                                        variant="outline-primary"
                                        size="sm"
                                        title="View Full Report Details"
                                        onClick={() => {
                                          setSelectedReport(report);
                                          setShowViewReportModal(true);
                                        }}
                                      >
                                        <FaEye /> View
                                      </Button>
                                      <Button
                                        variant="outline-danger"
                                        size="sm"
                                        title="Delete from MongoDB"
                                        onClick={() => handleDeleteReport(reportId, report.title)}
                                      >
                                        <FaTrash />
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan="9" className="text-center py-5 text-muted">
                                <FaAward size={36} className="text-muted mb-2 d-block mx-auto" />
                                No award reports match your search criteria.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>

                    {/* Pagination */}
                    {totalReportPages > 1 && (
                      <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                        <small className="text-muted">
                          Page {currentPage} of {totalReportPages}
                        </small>
                        <Pagination className="mb-0">
                          <Pagination.Prev
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          />
                          {[...Array(totalReportPages)].map((_, i) => (
                            <Pagination.Item
                              key={i + 1}
                              active={i + 1 === currentPage}
                              onClick={() => setCurrentPage(i + 1)}
                            >
                              {i + 1}
                            </Pagination.Item>
                          ))}
                          <Pagination.Next
                            disabled={currentPage === totalReportPages}
                            onClick={() => setCurrentPage(p => Math.min(totalReportPages, p + 1))}
                          />
                        </Pagination>
                      </div>
                    )}
                  </div>
                )}

                {/* =========================================================================
                    TAB 2: ALL INDIVIDUAL AWARDS IN MONGODB
                   ========================================================================= */}
                {activeTab === 'awardRecords' && (
                  <div>
                    {/* Toolbar */}
                    <div className="list-toolbar mb-3">
                      <div className="toolbar-left">
                        <InputGroup style={{ minWidth: '280px' }}>
                          <InputGroup.Text><FaSearch /></InputGroup.Text>
                          <Form.Control
                            placeholder="Search employee, award name, department..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </InputGroup>

                        <Dropdown>
                          <Dropdown.Toggle variant="outline-secondary" size="sm">
                            <FaFilter className="me-1" />
                            Category: {typeFilter === 'all' ? 'All' : typeFilter.replace('_', ' ').toUpperCase()}
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => setTypeFilter('all')}>All Categories</Dropdown.Item>
                            <Dropdown.Item onClick={() => setTypeFilter('gascapitol')}>Gascapitol</Dropdown.Item>
                            <Dropdown.Item onClick={() => setTypeFilter('coby_beach')}>Coby Beach</Dropdown.Item>
                            <Dropdown.Item onClick={() => setTypeFilter('best_employee')}>Best Employee</Dropdown.Item>
                            <Dropdown.Item onClick={() => setTypeFilter('innovation')}>Innovation</Dropdown.Item>
                            <Dropdown.Item onClick={() => setTypeFilter('leadership')}>Leadership</Dropdown.Item>
                            <Dropdown.Item onClick={() => setTypeFilter('team_player')}>Team Player</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>

                      <div className="toolbar-right">
                        <Button variant="outline-success" size="sm" onClick={() => handleExportCSV('awards')}>
                          <FaFileExcel className="me-1" /> Export Records
                        </Button>
                      </div>
                    </div>

                    <div className="table-responsive">
                      <Table hover className="reports-table align-middle">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Employee</th>
                            <th>Award Name</th>
                            <th>Category</th>
                            <th>Bonus Amount</th>
                            <th>Award Date</th>
                            <th>Presented By</th>
                            <th>Certificate ID</th>
                            <th className="text-end">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredAwards.length > 0 ? (
                            filteredAwards.map((award, idx) => {
                              const empName = award.employeeName || award.employeeId?.name || 'Staff Member';
                              const deptName = award.department || award.employeeId?.department || 'Department';
                              const posName = award.employeeId?.position || 'Team Member';
                              const dateStr = award.date
                                ? new Date(award.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                : 'N/A';

                              return (
                                <tr key={award._id || idx}>
                                  <td>{idx + 1}</td>
                                  <td>
                                    <div className="employee-info">
                                      <div className="employee-avatar">{getInitials(empName)}</div>
                                      <div>
                                        <div className="employee-name">{empName}</div>
                                        <small className="employee-id">{deptName} • {posName}</small>
                                      </div>
                                    </div>
                                  </td>
                                  <td><strong>{award.awardName}</strong></td>
                                  <td>{getTypeBadge(award.type)}</td>
                                  <td>
                                    <strong className="text-success">{formatCurrency(award.amount)}</strong>
                                  </td>
                                  <td>
                                    <small className="text-muted">{dateStr}</small>
                                  </td>
                                  <td>
                                    <small>{award.presentedBy || 'Management'}</small>
                                  </td>
                                  <td>
                                    <code>{award.certificate || `CERT-2026-00${idx + 1}`}</code>
                                  </td>
                                  <td className="text-end">
                                    <Button
                                      variant="outline-primary"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedAward(award);
                                        setShowViewAwardModal(true);
                                      }}
                                    >
                                      <FaEye /> View
                                    </Button>
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan="9" className="text-center py-5 text-muted">
                                No awards found matching current filter.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                )}

                {/* =========================================================================
                    TAB 3: VISUAL ANALYTICS & TRENDS
                   ========================================================================= */}
                {activeTab === 'analytics' && (
                  <div>
                    <Row className="mb-4">
                      <Col lg={7} className="mb-3">
                        <Card className="chart-card">
                          <Card.Header className="bg-white">
                            <h6 className="mb-0 fw-bold">
                              <FaChartBar className="me-2 text-primary" /> Monthly Bonus Disbursements & Awards (2026)
                            </h6>
                          </Card.Header>
                          <Card.Body style={{ height: 320 }}>
                            <Line
                              data={monthlyTrendChart}
                              options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { legend: { position: 'bottom' } },
                                scales: {
                                  y: { position: 'left', beginAtZero: true, title: { display: true, text: 'Awards Count' } },
                                  y1: { position: 'right', beginAtZero: true, grid: { drawOnChartArea: false }, title: { display: true, text: 'Disbursement ($)' } }
                                }
                              }}
                            />
                          </Card.Body>
                        </Card>
                      </Col>

                      <Col lg={5} className="mb-3">
                        <Card className="chart-card">
                          <Card.Header className="bg-white">
                            <h6 className="mb-0 fw-bold">
                              <FaTrophy className="me-2 text-warning" /> Awards by Category Distribution
                            </h6>
                          </Card.Header>
                          <Card.Body style={{ height: 320 }}>
                            <Bar
                              data={typeChart}
                              options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
                              }}
                            />
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>

                    <Row>
                      <Col lg={5} className="mb-3">
                        <Card className="chart-card">
                          <Card.Header className="bg-white">
                            <h6 className="mb-0 fw-bold">
                              <FaUsers className="me-2 text-info" /> Awards by Department
                            </h6>
                          </Card.Header>
                          <Card.Body style={{ height: 280 }}>
                            <Doughnut
                              data={deptDoughnutChart}
                              options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }}
                            />
                          </Card.Body>
                        </Card>
                      </Col>

                      <Col lg={7} className="mb-3">
                        <Card className="chart-card">
                          <Card.Header className="bg-white">
                            <h6 className="mb-0 fw-bold">
                              <FaShieldAlt className="me-2 text-success" /> Department Performance Breakdown
                            </h6>
                          </Card.Header>
                          <Card.Body>
                            <Table responsive hover size="sm">
                              <thead>
                                <tr>
                                  <th>Department</th>
                                  <th>Total Awards</th>
                                  <th>Total Disbursement</th>
                                  <th>Employees Awarded</th>
                                  <th>Avg Per Award</th>
                                </tr>
                              </thead>
                              <tbody>
                                {deptPerformance.length > 0 ? (
                                  deptPerformance.map((dept, i) => (
                                    <tr key={i}>
                                      <td><strong>{dept.department || 'General'}</strong></td>
                                      <td><Badge bg="primary">{dept.totalAwards}</Badge></td>
                                      <td className="text-success fw-bold">{formatCurrency(dept.totalAmount)}</td>
                                      <td>{dept.uniqueEmployees || 1} staff</td>
                                      <td>{formatCurrency(Math.round((dept.totalAmount || 0) / (dept.totalAwards || 1)))}</td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan="5" className="text-center text-muted">No department data available.</td>
                                  </tr>
                                )}
                              </tbody>
                            </Table>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                )}

                {/* =========================================================================
                    TAB 4: TOP PERFORMERS LEADERBOARD
                   ========================================================================= */}
                {activeTab === 'topPerformers' && (
                  <div>
                    <Card className="border-0 shadow-sm">
                      <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                        <h6 className="mb-0 fw-bold">
                          <FaTrophy className="me-2 text-warning" /> Corporate Honor Roll & Recognition Leaders
                        </h6>
                        <Badge bg="primary">Ranked by Total Awards</Badge>
                      </Card.Header>
                      <Card.Body className="p-0">
                        <div className="table-responsive">
                          <Table hover className="reports-table align-middle mb-0">
                            <thead>
                              <tr>
                                <th>Rank</th>
                                <th>Employee Name</th>
                                <th>Department</th>
                                <th>Position</th>
                                <th>Total Awards</th>
                                <th>Total Reward Amount</th>
                                <th>Honor Level</th>
                              </tr>
                            </thead>
                            <tbody>
                              {topPerformers.length > 0 ? (
                                topPerformers.map((emp, i) => {
                                  const rankColors = ['#f59e0b', '#94a3b8', '#d97706'];
                                  return (
                                    <tr key={emp.employeeId || i}>
                                      <td>
                                        {i < 3 ? (
                                          <div
                                            style={{
                                              width: '32px',
                                              height: '32px',
                                              borderRadius: '50%',
                                              background: rankColors[i],
                                              color: '#fff',
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                              fontWeight: 700
                                            }}
                                          >
                                            {i + 1}
                                          </div>
                                        ) : (
                                          <span className="fw-bold text-muted ps-2">{i + 1}</span>
                                        )}
                                      </td>
                                      <td>
                                        <div className="d-flex align-items-center gap-2">
                                          <div className="employee-avatar">{getInitials(emp.employeeName)}</div>
                                          <div>
                                            <div className="fw-bold">{emp.employeeName}</div>
                                            <small className="text-muted">{emp.employeeCode || `EMP-00${i+1}`}</small>
                                          </div>
                                        </div>
                                      </td>
                                      <td><Badge bg="secondary">{emp.department}</Badge></td>
                                      <td><small className="text-muted">{emp.position || 'Specialist'}</small></td>
                                      <td>
                                        <Badge bg="info" text="dark" className="px-2 py-1">
                                          {emp.awardsCount} Award{emp.awardsCount > 1 ? 's' : ''}
                                        </Badge>
                                      </td>
                                      <td>
                                        <strong className="text-success">{formatCurrency(emp.totalAmount)}</strong>
                                      </td>
                                      <td>
                                        {i === 0 && <Badge bg="warning" text="dark">★ Top Performer</Badge>}
                                        {i === 1 && <Badge bg="light" text="dark" className="border">Silver Honor</Badge>}
                                        {i === 2 && <Badge bg="light" text="dark" className="border">Bronze Honor</Badge>}
                                        {i >= 3 && <Badge bg="light" text="secondary">Merit Honoree</Badge>}
                                      </td>
                                    </tr>
                                  );
                                })
                              ) : (
                                <tr>
                                  <td colSpan="7" className="text-center py-4 text-muted">No performers recorded.</td>
                                </tr>
                              )}
                            </tbody>
                          </Table>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                )}
              </>
            )}
          </Card.Body>
        </Card>
      </Container>

      {/* =========================================================================
          MODAL: VIEW SINGLE AWARD REPORT DETAILS
         ========================================================================= */}
      <Modal show={showViewReportModal} onHide={() => setShowViewReportModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center gap-2">
            <FaFilePdf className="text-danger" />
            {selectedReport?.title || 'Award Report Details'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReport && (
            <div>
              {/* Summary Cards */}
              <Row className="mb-4">
                <Col md={3} xs={6} className="mb-2">
                  <div className="p-3 bg-light rounded text-center">
                    <small className="text-muted d-block">Scope Type</small>
                    <strong className="text-capitalize">{selectedReport.reportType}</strong>
                  </div>
                </Col>
                <Col md={3} xs={6} className="mb-2">
                  <div className="p-3 bg-light rounded text-center">
                    <small className="text-muted d-block">Department</small>
                    <strong>{selectedReport.department === 'all' ? 'All Divisions' : selectedReport.department}</strong>
                  </div>
                </Col>
                <Col md={3} xs={6} className="mb-2">
                  <div className="p-3 bg-light rounded text-center">
                    <small className="text-muted d-block">Total Awards</small>
                    <strong className="text-primary">{selectedReport.summary?.totalAwards || selectedReport.awardData?.length || 0}</strong>
                  </div>
                </Col>
                <Col md={3} xs={6} className="mb-2">
                  <div className="p-3 bg-light rounded text-center">
                    <small className="text-muted d-block">Total Payout</small>
                    <strong className="text-success">{formatCurrency(selectedReport.summary?.totalAmount)}</strong>
                  </div>
                </Col>
              </Row>

              {/* Date & Note Info */}
              <div className="mb-4 p-3 border rounded">
                <Row>
                  <Col md={6}>
                    <small className="text-muted d-block">Period Range</small>
                    <strong>
                      {selectedReport.dateRange?.startDate ? new Date(selectedReport.dateRange.startDate).toLocaleDateString() : 'N/A'} –{' '}
                      {selectedReport.dateRange?.endDate ? new Date(selectedReport.dateRange.endDate).toLocaleDateString() : 'N/A'}
                    </strong>
                  </Col>
                  <Col md={6}>
                    <small className="text-muted d-block">Generated On</small>
                    <strong>{new Date(selectedReport.createdAt || Date.now()).toLocaleDateString()}</strong>
                  </Col>
                </Row>
                {selectedReport.notes && (
                  <p className="mt-2 mb-0 text-muted small border-top pt-2">
                    <strong>Notes:</strong> {selectedReport.notes}
                  </p>
                )}
              </div>

              {/* Embedded Awards List */}
              <h6 className="fw-bold mb-2">Awardees Included in this Report:</h6>
              {selectedReport.awardData && selectedReport.awardData.length > 0 ? (
                <div className="table-responsive">
                  <Table size="sm" hover className="align-middle border">
                    <thead className="bg-light">
                      <tr>
                        <th>#</th>
                        <th>Employee</th>
                        <th>Award Name</th>
                        <th>Category</th>
                        <th>Date</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedReport.awardData.map((item, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>
                            <strong>{item.employeeName}</strong>
                            <small className="d-block text-muted">{item.department}</small>
                          </td>
                          <td>{item.awardName}</td>
                          <td>{getTypeBadge(item.awardType)}</td>
                          <td><small>{item.awardDate ? new Date(item.awardDate).toLocaleDateString() : 'N/A'}</small></td>
                          <td className="text-success fw-bold">{formatCurrency(item.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <p className="text-muted small">All active corporate awards are included in this consolidated report.</p>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewReportModal(false)}>Close</Button>
          <Button variant="primary" onClick={handlePrint}><FaPrint className="me-1" /> Print Report</Button>
        </Modal.Footer>
      </Modal>

      {/* =========================================================================
          MODAL: VIEW INDIVIDUAL AWARD CERTIFICATE CARD
         ========================================================================= */}
      <Modal show={showViewAwardModal} onHide={() => setShowViewAwardModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title><FaAward className="text-warning me-2" /> Award Certificate</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center p-4">
          {selectedAward && (
            <div>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  fontSize: '2rem'
                }}
              >
                <FaTrophy />
              </div>
              <h4 className="fw-bold mb-1">{selectedAward.awardName}</h4>
              <p className="text-muted mb-3">{getTypeBadge(selectedAward.type)}</p>

              <div className="p-3 bg-light rounded text-start mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Honoree:</span>
                  <strong>{selectedAward.employeeName || selectedAward.employeeId?.name}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Department:</span>
                  <span>{selectedAward.department || selectedAward.employeeId?.department}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Disbursement:</span>
                  <strong className="text-success">{formatCurrency(selectedAward.amount)}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Date Awarded:</span>
                  <span>{selectedAward.date ? new Date(selectedAward.date).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Presented By:</span>
                  <span>{selectedAward.presentedBy || 'Executive Board'}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Certificate No:</span>
                  <code>{selectedAward.certificate || 'CERT-2026-VAL'}</code>
                </div>
              </div>

              {selectedAward.description && (
                <p className="text-muted small fst-italic mb-0">
                  "{selectedAward.description}"
                </p>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewAwardModal(false)}>Close</Button>
          <Button variant="outline-primary" onClick={handlePrint}><FaPrint className="me-1" /> Print Certificate</Button>
        </Modal.Footer>
      </Modal>

      {/* =========================================================================
          MODAL: GENERATE NEW AWARD REPORT IN MONGODB
         ========================================================================= */}
      <Modal show={showGenerateModal} onHide={() => setShowGenerateModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title><FaPlus className="me-2 text-primary" /> Generate New Award Report</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleGenerateSubmit}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-bold">Report Title *</Form.Label>
                  <Form.Control
                    placeholder="e.g. Q3 2026 Innovation & Performance Report"
                    value={generateForm.title}
                    onChange={(e) => setGenerateForm({ ...generateForm, title: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold">Report Type</Form.Label>
                  <Form.Select
                    value={generateForm.reportType}
                    onChange={(e) => setGenerateForm({ ...generateForm, reportType: e.target.value })}
                  >
                    <option value="summary">Summary Report</option>
                    <option value="department">Department Report</option>
                    <option value="category">Category Report</option>
                    <option value="monthly">Monthly Report</option>
                    <option value="yearly">Yearly Report</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold">Department Scope</Form.Label>
                  <Form.Select
                    value={generateForm.department}
                    onChange={(e) => setGenerateForm({ ...generateForm, department: e.target.value })}
                  >
                    <option value="all">All Departments</option>
                    <option value="Software Development">Software Development</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Operations">Operations</option>
                    <option value="Finance">Finance</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold">Start Date *</Form.Label>
                  <Form.Control
                    type="date"
                    value={generateForm.startDate}
                    onChange={(e) => setGenerateForm({ ...generateForm, startDate: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold">End Date *</Form.Label>
                  <Form.Control
                    type="date"
                    value={generateForm.endDate}
                    onChange={(e) => setGenerateForm({ ...generateForm, endDate: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold">Award Category</Form.Label>
                  <Form.Select
                    value={generateForm.awardType}
                    onChange={(e) => setGenerateForm({ ...generateForm, awardType: e.target.value })}
                  >
                    <option value="all">All Categories</option>
                    <option value="gascapitol">Gascapitol</option>
                    <option value="coby_beach">Coby Beach</option>
                    <option value="best_employee">Best Employee</option>
                    <option value="innovation">Innovation</option>
                    <option value="leadership">Leadership</option>
                    <option value="team_player">Team Player</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold">Audit Scope</Form.Label>
                  <Form.Control value="Complete MongoDB Aggregation" disabled />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-bold">Executive Notes / Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Provide notes or context for this official report..."
                    value={generateForm.notes}
                    onChange={(e) => setGenerateForm({ ...generateForm, notes: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowGenerateModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={generating}>
              {generating ? (
                <>
                  <Spinner size="sm" animation="border" className="me-1" /> Generating & Saving...
                </>
              ) : (
                'Generate & Save to MongoDB'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default RewardReports;