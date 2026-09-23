import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Button, Form, Table, Badge,
  Spinner, Alert, Tabs, Tab
} from 'react-bootstrap';
import {
  FaSync, FaFilePdf, FaFileExcel, FaUsers, FaUserCheck,
  FaUserTimes, FaUserClock, FaChartBar, FaBriefcase, FaStar
} from 'react-icons/fa';
import employeeService from '../../services/employeeService';
import './EmployeeReports.css';

const EmployeeReports = () => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [byDepartment, setByDepartment] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('report');

  const [filters, setFilters] = useState({
    department: '',
    status: '',
    performance: '',
    search: ''
  });

  const [pagination, setPagination] = useState({
    page: 1, limit: 10, total: 0, pages: 0
  });

  const [sortConfig, setSortConfig] = useState({
    sortBy: 'firstName', sortOrder: 'asc'
  });

  useEffect(() => {
    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pagination.page, sortConfig]);

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

      const [reportRes, summaryRes, deptRes, perfRes] = await Promise.all([
        employeeService.getEmployeeReport(params),
        employeeService.getEmployeeReportSummary(filters),
        employeeService.getEmployeeByDepartmentReport(),
        employeeService.getEmployeePerformanceReport()
      ]);

      setReportData(reportRes?.success ? reportRes.data : getDemoReport());
      setSummary(summaryRes?.success ? summaryRes.data : getDemoSummary());
      setByDepartment(deptRes?.success ? deptRes.data : getDemoDepartments());
      setPerformance(perfRes?.success ? perfRes.data : getDemoPerformance());

      if (reportRes?.pagination) {
        setPagination((prev) => ({ ...prev, ...reportRes.pagination }));
      }
    } catch {
      setError('Failed to load data. Showing demo data.');
      setReportData(getDemoReport());
      setSummary(getDemoSummary());
      setByDepartment(getDemoDepartments());
      setPerformance(getDemoPerformance());
    } finally {
      setLoading(false);
    }
  };

  // Demo data fallback
  const getDemoReport = () => [
    {
      _id: '1', employeeId: 'EMP001', firstName: 'John', lastName: 'Doe',
      email: 'john@example.com', phone: '+1 234 567 8900',
      departmentName: 'Software', position: 'Senior Developer',
      joinDate: '2023-01-15', status: 'Active', salary: 75000,
      performance: 'Excellent', attendanceRate: 95.5
    },
    {
      _id: '2', employeeId: 'EMP002', firstName: 'Jane', lastName: 'Smith',
      email: 'jane@example.com', phone: '+1 345 678 9012',
      departmentName: 'Marketing', position: 'Marketing Manager',
      joinDate: '2022-06-20', status: 'Active', salary: 65000,
      performance: 'Good', attendanceRate: 88.2
    },
    {
      _id: '3', employeeId: 'EMP003', firstName: 'Mike', lastName: 'Johnson',
      email: 'mike@example.com', phone: '+1 456 789 0123',
      departmentName: 'Electrical', position: 'Engineer',
      joinDate: '2021-09-10', status: 'Active', salary: 70000,
      performance: 'Excellent', attendanceRate: 96.8
    },
    {
      _id: '4', employeeId: 'EMP004', firstName: 'Sarah', lastName: 'Williams',
      email: 'sarah@example.com', phone: '+1 567 890 1234',
      departmentName: 'Production', position: 'Supervisor',
      joinDate: '2020-03-05', status: 'Leave', salary: 58000,
      performance: 'Good', attendanceRate: 83.3
    },
    {
      _id: '5', employeeId: 'EMP005', firstName: 'Robert', lastName: 'Brown',
      email: 'robert@example.com', phone: '+1 678 901 2345',
      departmentName: 'Software', position: 'Frontend Developer',
      joinDate: '2023-03-01', status: 'Active', salary: 68000,
      performance: 'Excellent', attendanceRate: 100
    }
  ];

  const getDemoSummary = () => ({
    total: 5, active: 4, inactive: 0, onLeave: 1
  });

  const getDemoDepartments = () => [
    { departmentName: 'Software', total: 2, active: 2, onLeave: 0, avgSalary: 71500 },
    { departmentName: 'Marketing', total: 1, active: 1, onLeave: 0, avgSalary: 65000 },
    { departmentName: 'Electrical', total: 1, active: 1, onLeave: 0, avgSalary: 70000 },
    { departmentName: 'Production', total: 1, active: 0, onLeave: 1, avgSalary: 58000 }
  ];

  const getDemoPerformance = () => [
    { performance: 'Excellent', count: 3, avgSalary: 71000 },
    { performance: 'Good', count: 2, avgSalary: 61500 }
  ];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleExport = async (format) => {
    try {
      const blob = await employeeService.exportEmployeeReport(format, filters);
      const url = URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `employee-report-${new Date().toISOString().split('T')[0]}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      alert(`Failed to export ${format.toUpperCase()}`);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      Active: 'success',
      Inactive: 'secondary',
      Leave: 'warning',
      Terminated: 'danger'
    };
    return <Badge bg={config[status] || 'secondary'}>{status}</Badge>;
  };

  const getPerformanceBadge = (perf) => {
    const config = {
      Excellent: 'success',
      Good: 'info',
      Average: 'warning',
      Poor: 'danger'
    };
    return <Badge bg={config[perf] || 'secondary'}>{perf}</Badge>;
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency', currency: 'USD',
      minimumFractionDigits: 0, maximumFractionDigits: 0
    }).format(amount || 0);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  return (
    <div className="employee-reports-page">
      <Container fluid>
        {/* Header */}
        <div className="report-header">
          <div>
            <h2 className="page-title">Employee Reports</h2>
            <p className="page-subtitle">Analyze employee data and performance</p>
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
                  <Form.Label>Search</Form.Label>
                  <Form.Control
                    type="text"
                    name="search"
                    placeholder="Search by name, ID, email..."
                    value={filters.search}
                    onChange={handleFilterChange}
                  />
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
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Leave">On Leave</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Performance</Form.Label>
                  <Form.Select name="performance" value={filters.performance} onChange={handleFilterChange}>
                    <option value="">All Performance</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Average">Average</option>
                    <option value="Poor">Poor</option>
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
                    <h3>{summary.total || 0}</h3>
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
                    <h3>{summary.active || 0}</h3>
                    <p>Active Employees</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <Card className="summary-card">
                <Card.Body>
                  <div className="summary-icon red"><FaUserTimes /></div>
                  <div>
                    <h3>{summary.inactive || 0}</h3>
                    <p>Inactive</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <Card className="summary-card">
                <Card.Body>
                  <div className="summary-icon yellow"><FaUserClock /></div>
                  <div>
                    <h3>{summary.onLeave || 0}</h3>
                    <p>On Leave</p>
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
              {/* Detailed Report */}
              <Tab eventKey="report" title={<span><FaChartBar className="me-2" />Detailed Report</span>}>
                {loading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3 text-muted">Loading...</p>
                  </div>
                ) : (
                  <>
                    <div className="table-responsive">
                      <Table hover className="report-table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Employee</th>
                            <th>ID</th>
                            <th>Department</th>
                            <th>Position</th>
                            <th>Join Date</th>
                            <th>Salary</th>
                            <th>Status</th>
                            <th>Performance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportData.length > 0 ? reportData.map((emp, idx) => (
                            <tr key={emp._id || idx}>
                              <td>{(pagination.page - 1) * pagination.limit + idx + 1}</td>
                              <td>
                                <div className="employee-cell">
                                  <div className="emp-avatar">
                                    {(emp.firstName?.[0] || '') + (emp.lastName?.[0] || '')}
                                  </div>
                                  <div>
                                    <div className="emp-name">
                                      {emp.firstName} {emp.lastName}
                                    </div>
                                    <div className="emp-email">{emp.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td>{emp.employeeId}</td>
                              <td><Badge bg="secondary">{emp.departmentName || 'N/A'}</Badge></td>
                              <td>{emp.position}</td>
                              <td>{formatDate(emp.joinDate)}</td>
                              <td>{formatCurrency(emp.salary)}</td>
                              <td>{getStatusBadge(emp.status)}</td>
                              <td>{getPerformanceBadge(emp.performance)}</td>
                            </tr>
                          )) : (
                            <tr>
                              <td colSpan="9" className="text-center py-4 text-muted">
                                No employees found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>

                    {pagination.pages > 1 && (
                      <div className="pagination-wrapper">
                        <span className="text-muted small">
                          Page {pagination.page} of {pagination.pages} ({pagination.total} records)
                        </span>
                        <div>
                          <Button variant="outline-secondary" size="sm"
                            disabled={pagination.page === 1}
                            onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}>
                            Previous
                          </Button>
                          <Button variant="outline-secondary" size="sm" className="ms-2"
                            disabled={pagination.page === pagination.pages}
                            onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}>
                            Next
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </Tab>

              {/* By Department */}
              <Tab eventKey="department" title={<span><FaBriefcase className="me-2" />By Department</span>}>
                <div className="table-responsive">
                  <Table hover className="report-table">
                    <thead>
                      <tr>
                        <th>Department</th>
                        <th>Total</th>
                        <th>Active</th>
                        <th>Inactive</th>
                        <th>On Leave</th>
                        <th>Avg Salary</th>
                      </tr>
                    </thead>
                    <tbody>
                      {byDepartment.map((row, i) => (
                        <tr key={i}>
                          <td><Badge bg="primary">{row.departmentName}</Badge></td>
                          <td><strong>{row.total}</strong></td>
                          <td><span className="text-success fw-bold">{row.active}</span></td>
                          <td><span className="text-secondary fw-bold">{row.inactive}</span></td>
                          <td><span className="text-warning fw-bold">{row.onLeave}</span></td>
                          <td>{formatCurrency(row.avgSalary)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Tab>

              {/* By Performance */}
              <Tab eventKey="performance" title={<span><FaStar className="me-2" />By Performance</span>}>
                <div className="table-responsive">
                  <Table hover className="report-table">
                    <thead>
                      <tr>
                        <th>Performance</th>
                        <th>Employee Count</th>
                        <th>Average Salary</th>
                      </tr>
                    </thead>
                    <tbody>
                      {performance.map((row, i) => (
                        <tr key={i}>
                          <td>{getPerformanceBadge(row.performance)}</td>
                          <td><strong>{row.count}</strong></td>
                          <td>{formatCurrency(row.avgSalary)}</td>
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

export default EmployeeReports;