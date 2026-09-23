import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Badge } from 'react-bootstrap';
import {
  FaChartBar,
  FaDownload,
  FaPrint,
  FaCalendarAlt,
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaUserClock
} from 'react-icons/fa';
import './AttendanceReport.css';

const AttendanceReport = () => {
  const [dateRange, setDateRange] = useState({
    startDate: '2026-01-01',
    endDate: '2026-01-31'
  });

  const [department, setDepartment] = useState('all');

  const reportData = [
    {
      id: 1,
      employeeName: 'John Doe',
      employeeId: 'EMP001',
      department: 'Software',
      presentDays: 22,
      absentDays: 1,
      leaveDays: 1,
      totalDays: 24,
      attendanceRate: 91.67,
      status: 'Good'
    },
    {
      id: 2,
      employeeName: 'Jane Smith',
      employeeId: 'EMP002',
      department: 'Marketing',
      presentDays: 21,
      absentDays: 0,
      leaveDays: 3,
      totalDays: 24,
      attendanceRate: 87.5,
      status: 'Good'
    },
    {
      id: 3,
      employeeName: 'Mike Johnson',
      employeeId: 'EMP003',
      department: 'Electrical',
      presentDays: 23,
      absentDays: 0,
      leaveDays: 1,
      totalDays: 24,
      attendanceRate: 95.83,
      status: 'Excellent'
    },
    {
      id: 4,
      employeeName: 'Sarah Williams',
      employeeId: 'EMP004',
      department: 'Production',
      presentDays: 20,
      absentDays: 2,
      leaveDays: 2,
      totalDays: 24,
      attendanceRate: 83.33,
      status: 'Average'
    },
    {
      id: 5,
      employeeName: 'Robert Brown',
      employeeId: 'EMP005',
      department: 'Software',
      presentDays: 24,
      absentDays: 0,
      leaveDays: 0,
      totalDays: 24,
      attendanceRate: 100,
      status: 'Excellent'
    }
  ];

  const summary = {
    totalEmployees: reportData.length,
    totalPresent: reportData.reduce((sum, r) => sum + r.presentDays, 0),
    totalAbsent: reportData.reduce((sum, r) => sum + r.absentDays, 0),
    totalLeave: reportData.reduce((sum, r) => sum + r.leaveDays, 0)
  };

  const getStatusBadge = (status) => {
    const config = {
      Excellent: 'success',
      Good: 'info',
      Average: 'warning',
      Poor: 'danger'
    };
    return <Badge bg={config[status] || 'secondary'}>{status}</Badge>;
  };

  return (
    <div className="attendance-report-page">
      <Container fluid>
        {/* Header */}
        <div className="report-header">
          <div>
            <h2 className="page-title">Attendance Report</h2>
            <p className="page-subtitle">
              View and analyze employee attendance data
            </p>
          </div>
          <div className="header-actions">
            <Button variant="outline-secondary" className="me-2">
              <FaPrint className="me-1" /> Print
            </Button>
            <Button variant="primary">
              <FaDownload className="me-1" /> Export
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="filter-card mb-4">
          <Card.Body>
            <Row className="align-items-end">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, startDate: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, endDate: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Department</Form.Label>
                  <Form.Select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    <option value="all">All Departments</option>
                    <option value="Software">Software</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Production">Production</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Summary Cards */}
        <Row className="mb-4">
          <Col lg={3} md={6} className="mb-3">
            <Card className="summary-card">
              <Card.Body>
                <div className="summary-icon blue">
                  <FaUsers />
                </div>
                <div>
                  <h3>{summary.totalEmployees}</h3>
                  <p>Total Employees</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <Card className="summary-card">
              <Card.Body>
                <div className="summary-icon green">
                  <FaUserCheck />
                </div>
                <div>
                  <h3>{summary.totalPresent}</h3>
                  <p>Total Present</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <Card className="summary-card">
              <Card.Body>
                <div className="summary-icon red">
                  <FaUserTimes />
                </div>
                <div>
                  <h3>{summary.totalAbsent}</h3>
                  <p>Total Absent</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <Card className="summary-card">
              <Card.Body>
                <div className="summary-icon yellow">
                  <FaUserClock />
                </div>
                <div>
                  <h3>{summary.totalLeave}</h3>
                  <p>Total Leave</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Report Table */}
        <Card className="report-table-card">
          <Card.Header>
            <h6 className="mb-0">
              <FaChartBar className="me-2" />
              Detailed Attendance Report
            </h6>
          </Card.Header>
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table hover className="report-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Present</th>
                    <th>Absent</th>
                    <th>Leave</th>
                    <th>Total Days</th>
                    <th>Rate</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((row, index) => (
                    <tr key={row.id}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="employee-cell">
                          <div className="emp-avatar">
                            {row.employeeName
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </div>
                          <div>
                            <div className="emp-name">{row.employeeName}</div>
                            <div className="emp-id">#{row.employeeId}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Badge bg="secondary">{row.department}</Badge>
                      </td>
                      <td>
                        <span className="text-success fw-bold">
                          {row.presentDays}
                        </span>
                      </td>
                      <td>
                        <span className="text-danger fw-bold">
                          {row.absentDays}
                        </span>
                      </td>
                      <td>
                        <span className="text-warning fw-bold">
                          {row.leaveDays}
                        </span>
                      </td>
                      <td>{row.totalDays}</td>
                      <td>
                        <strong>{row.attendanceRate}%</strong>
                      </td>
                      <td>{getStatusBadge(row.status)}</td>
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

export default AttendanceReport;