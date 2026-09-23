import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Button, Form, Table, Badge,
  Spinner, Alert, Tabs, Tab
} from 'react-bootstrap';
import {
  FaDownload, FaPrint, FaFilePdf, FaFileExcel, FaSync,
  FaUsers, FaUserCheck, FaUserTimes, FaUserClock, FaChartBar
} from 'react-icons/fa';
import attendanceService from '../../services/attendanceService';
import './AttendanceReport.css';

const AttendanceReport = () => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [trend, setTrend] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('report');

  const [filters, setFilters] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    department: '',
    status: ''
  });

  const [pagination, setPagination] = useState({
    page: 1, limit: 10, total: 0, pages: 0
  });

  const [sortConfig, setSortConfig] = useState({
    sortBy: 'employeeName', sortOrder: 'asc'
  });

  // Load departments
  useEffect(() => {
    loadDepartments();
  }, []);

  useEffect(() => {
    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pagination.page, pagination.limit, sortConfig]);

  const loadDepartments = async () => {
    try {
      const result = await attendanceService.getDepartments?.();
      if (result?.success) setDepartments(result.data);
    } catch {
      setDepartments([
        { _id: '1', name: 'Software' },
        { _id: '2', name: 'Marketing' },
        { _id: '3', name: 'HR' }
      ]);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
        sortBy: sortConfig.sortBy,
        sortOrder: sortConfig.sortOrder
      };

      const [reportRes, summaryRes, trendRes, deptRes] = await Promise.all([
        attendanceService.getAttendanceReport(params),
        attendanceService.getAttendanceSummary(filters),
        attendanceService.getAttendanceTrend(filters),
        attendanceService.getDepartmentReport(filters)
      ]);

      // Fallback demo data if API fails
      setReportData(reportRes?.success ? reportRes.data : getDemoReport());
      setSummary(summaryRes?.success ? summaryRes.data : getDemoSummary());
      setTrend(trendRes?.success ? trendRes.data : getDemoTrend());
      setDepartments(deptRes?.success ? deptRes.data : getDemoDepartments());

      if (reportRes?.pagination) {
        setPagination((prev) => ({ ...prev, ...reportRes.pagination }));
      }
    } catch (err) {
      setError('Failed to load report data. Showing demo data.');
      setReportData(getDemoReport());
      setSummary(getDemoSummary());
      setTrend(getDemoTrend());
      setDepartments(getDemoDepartments());
    } finally {
      setLoading(false);
    }
  };

  // Demo data fallbacks
  const getDemoReport = () => [
    { _id: '1', employeeName: 'John Doe', employeeId: 'EMP001', department: 'Software',
      position: 'Senior Developer', presentDays: 22, absentDays: 1, leaveDays: 1,
      lateDays: 0, totalDays: 24, attendanceRate: 91.67, performanceStatus: 'Good',
      totalWorkingHours: 176, totalOvertime: 8 },
    { _id: '2', employeeName: 'Jane Smith', employeeId: 'EMP002', department: 'Marketing',
      position: 'Marketing Manager', presentDays: 21, absentDays: 0, leaveDays: 3,
      lateDays: 0, totalDays: 24, attendanceRate: 87.5, performanceStatus: 'Good',
      totalWorkingHours: 168, totalOvertime: 4 },
    { _id: '3', employeeName: 'Mike Johnson', employeeId: 'EMP003', department: 'Electrical',
      position: 'Engineer', presentDays: 23, absentDays: 0, leaveDays: 1,
      lateDays: 0, totalDays: 24, attendanceRate: 95.83, performanceStatus: 'Excellent',
      totalWorkingHours: 184, totalOvertime: 12 },
    { _id: '4', employeeName: 'Sarah Williams', employeeId: 'EMP004', department: 'Production',
      position: 'Supervisor', presentDays: 20, absentDays: 2, leaveDays: 2,
      lateDays: 0, totalDays: 24, attendanceRate: 83.33, performanceStatus: 'Average',
      totalWorkingHours: 160, totalOvertime: 0 },
    { _id: '5', employeeName: 'Robert Brown', employeeId: 'EMP005', department: 'Software',
      position: 'Frontend Developer', presentDays: 24, absentDays: 0, leaveDays: 0,
      lateDays: 0, totalDays: 24, attendanceRate: 100, performanceStatus: 'Excellent',
      totalWorkingHours: 192, totalOvertime: 16 }
  ];

  const getDemoSummary = () => ({
    totalEmployees: 5, totalPresent: 110, totalAbsent: 3,
    totalLeave: 7, totalLate: 0, avgWorkingHours: 176,
    totalOvertime: 40
  });

  const getDemoTrend = () => [
    { date: '2026-01-01', present: 22, absent: 1, leave: 1, late: 0 },
    { date: '2026-01-02', present: 23, absent: 0, leave: 1, late: 0 },
    { date: '2026-01-03', present: 21, absent: 2, leave: 1, late: 0 },
    { date: '2026-01-04', present: 24, absent: 0, leave: 0, late: 0 }
  ];

  const getDemoDepartments = () => [
    { _id: '1', departmentName: 'Software', totalRecords: 46, present: 46, absent: 0, attendanceRate: 100 },
    { _id: '2', departmentName: 'Marketing', totalRecords: 24, present: 21, absent: 0, attendanceRate: 87.5 },
    { _id: '3', departmentName: 'Electrical', totalRecords: 24, present: 23, absent: 0, attendanceRate: 95.83 },
    { _id: '4', departmentName: 'Production', totalRecords: 24, present: 20, absent: 2, attendanceRate: 83.33 }
  ];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSort = (field) => {
    setSortConfig((prev) => ({
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleExport = async (format) => {
    try {
      const blob = await attendanceService.exportAttendanceReport(format, filters);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download',
        `attendance-report-${new Date().toISOString().split('T')[0]}.${format === 'pdf' ? 'pdf' : 'xlsx'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert(`Failed to export ${format.toUpperCase()}`);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      Excellent: 'success',
      Good: 'info',
      Average: 'warning',
      Poor: 'danger'
    };
    return <Badge bg={config[status] || 'secondary'} className="status-badge">{status}</Badge>;
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="attendance-report-page">
      <Container fluid>
        {/* Header */}
        <div className="report-header">
          <div>
            <h2 className="page-title">Attendance Report</h2>
            <p className="page-subtitle">Analyze employee attendance data</p>
          </div>
          <div className="header-actions">
            <Button variant="outline-secondary" className="me-2" onClick={fetchAllData}>
              <FaSync className="me-1" /> Refresh
            </Button>
            <Button variant="outline-danger" className="me-2" onClick={() => handleExport('pdf')}>
              <FaFilePdf className="me-1" /> PDF
            </Button>
            <Button variant="outline-success" onClick={() => handleExport('excel')}>
              <FaFileExcel className="me-1" /> Excel
            </Button>
          </div>
        </div>

        {error && <Alert variant="warning" dismissible onClose={() => setError('')}>{error}</Alert>}

        {/* Filters */}
        <Card className="filter-card mb-4">
          <Card.Body>
            <Row className="align-items-end g-3">
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control type="date" name="startDate"
                    value={filters.startDate} onChange={handleFilterChange} />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>End Date</Form.Label>
                  <Form.Control type="date" name="endDate"
                    value={filters.endDate} onChange={handleFilterChange} />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Department</Form.Label>
                  <Form.Select name="department" value={filters.department} onChange={handleFilterChange}>
                    <option value="">All Departments</option>
                    <option value="Software">Software</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Production">Production</option>
                    <option value="HR">HR</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Select name="status" value={filters.status} onChange={handleFilterChange}>
                    <option value="">All Status</option>
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="leave">Leave</option>
                    <option value="late">Late</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Summary Cards */}
        {summary && (
          <Row className="mb-4">
            <Col lg={3} md={6} className="mb-3">
              <Card className="summary-card">
                <Card.Body>
                  <div className="summary-icon blue"><FaUsers /></div>
                  <div>
                    <h3>{summary.totalEmployees || 0}</h3>
                    <p>Total Employees</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <Card className="summary-card">
                <Card.Body>
                  <div className="summary-icon green"><FaUserCheck /></div>
                  <div>
                    <h3>{summary.totalPresent || 0}</h3>
                    <p>Total Present</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <Card className="summary-card">
                <Card.Body>
                  <div className="summary-icon red"><FaUserTimes /></div>
                  <div>
                    <h3>{summary.totalAbsent || 0}</h3>
                    <p>Total Absent</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <Card className="summary-card">
                <Card.Body>
                  <div className="summary-icon yellow"><FaUserClock /></div>
                  <div>
                    <h3>{summary.totalLeave || 0}</h3>
                    <p>Total Leave</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Tabs */}
        <Card className="report-tabs-card">
          <Card.Body>
            <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="report-tabs">
              <Tab eventKey="report" title={
                <span><FaChartBar className="me-2" />Detailed Report</span>
              }>
                {loading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3 text-muted">Loading report...</p>
                  </div>
                ) : (
                  <>
                    <div className="table-responsive">
                      <Table hover className="report-table">
                        <thead>
                          <tr>
                            <th onClick={() => handleSort('employeeName')} style={{ cursor: 'pointer' }}>#</th>
                            <th onClick={() => handleSort('employeeName')} style={{ cursor: 'pointer' }}>Employee</th>
                            <th onClick={() => handleSort('employeeId')} style={{ cursor: 'pointer' }}>ID</th>
                            <th onClick={() => handleSort('department')} style={{ cursor: 'pointer' }}>Department</th>
                            <th onClick={() => handleSort('presentDays')} style={{ cursor: 'pointer' }}>Present</th>
                            <th onClick={() => handleSort('absentDays')} style={{ cursor: 'pointer' }}>Absent</th>
                            <th onClick={() => handleSort('leaveDays')} style={{ cursor: 'pointer' }}>Leave</th>
                            <th onClick={() => handleSort('totalDays')} style={{ cursor: 'pointer' }}>Total</th>
                            <th onClick={() => handleSort('attendanceRate')} style={{ cursor: 'pointer' }}>Rate</th>
                            <th onClick={() => handleSort('performanceStatus')} style={{ cursor: 'pointer' }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportData.length > 0 ? reportData.map((row, idx) => (
                            <tr key={row._id || idx}>
                              <td>{(pagination.page - 1) * pagination.limit + idx + 1}</td>
                              <td>
                                <div className="employee-cell">
                                  <div className="emp-avatar">
                                    {row.employeeName?.split(' ').map(n => n[0]).join('') || 'NA'}
                                  </div>
                                  <div>
                                    <div className="emp-name">{row.employeeName}</div>
                                    <div className="emp-position">{row.position}</div>
                                  </div>
                                </div>
                              </td>
                              <td>{row.employeeId}</td>
                              <td><Badge bg="secondary">{row.department}</Badge></td>
                              <td><span className="text-success fw-bold">{row.presentDays}</span></td>
                              <td><span className="text-danger fw-bold">{row.absentDays}</span></td>
                              <td><span className="text-warning fw-bold">{row.leaveDays}</span></td>
                              <td>{row.totalDays}</td>
                              <td><strong>{row.attendanceRate?.toFixed(1)}%</strong></td>
                              <td>{getStatusBadge(row.performanceStatus)}</td>
                            </tr>
                          )) : (
                            <tr><td colSpan="10" className="text-center py-4 text-muted">No data available</td></tr>
                          )}
                        </tbody>
                      </Table>
                    </div>

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                      <div className="pagination-wrapper">
                        <span className="text-muted small">
                          Page {pagination.page} of {pagination.pages} ({pagination.total} records)
                        </span>
                        <div className="pagination-buttons">
                          <Button variant="outline-secondary" size="sm"
                            disabled={pagination.page === 1}
                            onClick={() => handlePageChange(pagination.page - 1)}>
                            Previous
                          </Button>
                          <Button variant="outline-secondary" size="sm" className="ms-2"
                            disabled={pagination.page === pagination.pages}
                            onClick={() => handlePageChange(pagination.page + 1)}>
                            Next
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </Tab>

              <Tab eventKey="trend" title="Daily Trend">
                <div className="table-responsive">
                  <Table hover className="report-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Present</th>
                        <th>Absent</th>
                        <th>Leave</th>
                        <th>Late</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trend.map((row, i) => (
                        <tr key={i}>
                          <td>{row.date}</td>
                          <td><span className="text-success">{row.present}</span></td>
                          <td><span className="text-danger">{row.absent}</span></td>
                          <td><span className="text-warning">{row.leave}</span></td>
                          <td>{row.late}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Tab>

              <Tab eventKey="departments" title="By Department">
                <div className="table-responsive">
                  <Table hover className="report-table">
                    <thead>
                      <tr>
                        <th>Department</th>
                        <th>Total Records</th>
                        <th>Present</th>
                        <th>Absent</th>
                        <th>Leave</th>
                        <th>Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departments.map((row, i) => (
                        <tr key={i}>
                          <td><Badge bg="primary">{row.departmentName || row.name}</Badge></td>
                          <td>{row.totalRecords || 0}</td>
                          <td><span className="text-success">{row.present || 0}</span></td>
                          <td><span className="text-danger">{row.absent || 0}</span></td>
                          <td><span className="text-warning">{row.leave || 0}</span></td>
                          <td><strong>{(row.attendanceRate || 0).toFixed(1)}%</strong></td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default AttendanceReport;