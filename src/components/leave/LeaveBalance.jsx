import React, { useState } from 'react';
import {
  Container, Row, Col, Card, Table, Button, Badge,
  ProgressBar, Form, InputGroup, Dropdown, Spinner,
  Alert, Modal
} from 'react-bootstrap';
import {
  FaSearch, FaSync, FaDownload, FaCalendarAlt, FaUserClock,
  FaCheckCircle, FaHourglassHalf, FaPlus, FaEye, FaPrint,
  FaUmbrellaBeach, FaHeartbeat, FaUserMd, FaBaby,
  FaBriefcase, FaUser, FaInfoCircle, FaArrowLeft
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import LeaveBalanceCard from './LeaveBalanceCard';
import './LeaveBalance.css';

const LeaveBalance = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear());
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // ==================== DEMO DATA ====================
  const [employees, setEmployees] = useState([
    {
      id: 1,
      employeeName: 'John Doe',
      employeeId: 'EMP001',
      department: 'Software',
      position: 'Senior Developer',
      avatar: 'JD',
      year: 2026,
      balances: {
        annual:    { total: 20, used: 5,  pending: 2, remaining: 13 },
        sick:      { total: 12, used: 2,  pending: 0, remaining: 10 },
        casual:    { total: 8,  used: 3,  pending: 1, remaining: 4  },
        maternity: { total: 90, used: 0,  pending: 0, remaining: 90 },
        paternity: { total: 10, used: 0,  pending: 0, remaining: 10 },
        unpaid:    { total: 0,  used: 2,  pending: 0, remaining: 0  }
      }
    },
    {
      id: 2,
      employeeName: 'Jane Smith',
      employeeId: 'EMP002',
      department: 'Marketing',
      position: 'Marketing Manager',
      avatar: 'JS',
      year: 2026,
      balances: {
        annual:    { total: 20, used: 8,  pending: 3, remaining: 9  },
        sick:      { total: 12, used: 4,  pending: 0, remaining: 8  },
        casual:    { total: 8,  used: 2,  pending: 0, remaining: 6  },
        maternity: { total: 90, used: 45, pending: 0, remaining: 45 },
        paternity: { total: 10, used: 0,  pending: 0, remaining: 10 },
        unpaid:    { total: 0,  used: 0,  pending: 0, remaining: 0  }
      }
    },
    {
      id: 3,
      employeeName: 'Mike Johnson',
      employeeId: 'EMP003',
      department: 'Electrical',
      position: 'Electrical Engineer',
      avatar: 'MJ',
      year: 2026,
      balances: {
        annual:    { total: 20, used: 3,  pending: 0, remaining: 17 },
        sick:      { total: 12, used: 1,  pending: 0, remaining: 11 },
        casual:    { total: 8,  used: 1,  pending: 0, remaining: 7  },
        maternity: { total: 0,  used: 0,  pending: 0, remaining: 0  },
        paternity: { total: 10, used: 5,  pending: 2, remaining: 3  },
        unpaid:    { total: 0,  used: 0,  pending: 0, remaining: 0  }
      }
    },
    {
      id: 4,
      employeeName: 'Sarah Williams',
      employeeId: 'EMP004',
      department: 'Production',
      position: 'Production Supervisor',
      avatar: 'SW',
      year: 2026,
      balances: {
        annual:    { total: 20, used: 15, pending: 5, remaining: 0  },
        sick:      { total: 12, used: 6,  pending: 0, remaining: 6  },
        casual:    { total: 8,  used: 4,  pending: 0, remaining: 4  },
        maternity: { total: 90, used: 0,  pending: 0, remaining: 90 },
        paternity: { total: 0,  used: 0,  pending: 0, remaining: 0  },
        unpaid:    { total: 0,  used: 3,  pending: 1, remaining: 0  }
      }
    },
    {
      id: 5,
      employeeName: 'Robert Brown',
      employeeId: 'EMP005',
      department: 'Software',
      position: 'Frontend Developer',
      avatar: 'RB',
      year: 2026,
      balances: {
        annual:    { total: 20, used: 2,  pending: 1, remaining: 17 },
        sick:      { total: 12, used: 0,  pending: 0, remaining: 12 },
        casual:    { total: 8,  used: 2,  pending: 0, remaining: 6  },
        maternity: { total: 0,  used: 0,  pending: 0, remaining: 0  },
        paternity: { total: 10, used: 0,  pending: 0, remaining: 10 },
        unpaid:    { total: 0,  used: 0,  pending: 0, remaining: 0  }
      }
    },
    {
      id: 6,
      employeeName: 'Emily Davis',
      employeeId: 'EMP006',
      department: 'HR',
      position: 'HR Coordinator',
      avatar: 'ED',
      year: 2026,
      balances: {
        annual:    { total: 20, used: 6,  pending: 0, remaining: 14 },
        sick:      { total: 12, used: 2,  pending: 1, remaining: 9  },
        casual:    { total: 8,  used: 3,  pending: 0, remaining: 5  },
        maternity: { total: 90, used: 30, pending: 0, remaining: 60 },
        paternity: { total: 0,  used: 0,  pending: 0, remaining: 0  },
        unpaid:    { total: 0,  used: 0,  pending: 0, remaining: 0  }
      }
    }
  ]);

  // ==================== LEAVE TYPES CONFIG ====================
  const leaveTypes = [
    { key: 'annual',    label: 'Annual Leave',    icon: <FaUmbrellaBeach />, color: 'primary',  bg: 'blue'   },
    { key: 'sick',      label: 'Sick Leave',      icon: <FaUserMd />,        color: 'danger',   bg: 'red'    },
    { key: 'casual',    label: 'Casual Leave',    icon: <FaUser />,          color: 'info',     bg: 'cyan'   },
    { key: 'maternity', label: 'Maternity Leave', icon: <FaBaby />,          color: 'warning',  bg: 'yellow' },
    { key: 'paternity', label: 'Paternity Leave', icon: <FaHeartbeat />,     color: 'success',  bg: 'green'  },
    { key: 'unpaid',    label: 'Unpaid Leave',    icon: <FaBriefcase />,     color: 'secondary', bg: 'gray'  }
  ];

  // ==================== FILTER ====================
  const filteredEmployees = employees.filter((e) => {
    const term = searchTerm.toLowerCase();
    const matches =
      e.employeeName.toLowerCase().includes(term) ||
      e.employeeId.toLowerCase().includes(term) ||
      e.department.toLowerCase().includes(term);
    const matchesDept = departmentFilter === 'all' || e.department === departmentFilter;
    return matches && matchesDept;
  });

  // ==================== STATS ====================
  const totalEmployees = filteredEmployees.length;
  const avgAnnualRemaining = totalEmployees > 0
    ? Math.round(
        filteredEmployees.reduce((s, e) => s + e.balances.annual.remaining, 0) / totalEmployees
      )
    : 0;
  const totalUsedThisYear = filteredEmployees.reduce(
    (s, e) =>
      s +
      Object.values(e.balances).reduce((acc, b) => acc + b.used, 0),
    0
  );
  const totalPendingRequests = filteredEmployees.reduce(
    (s, e) =>
      s +
      Object.values(e.balances).reduce((acc, b) => acc + b.pending, 0),
    0
  );

  // ==================== HELPERS ====================
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  const handleExport = () => {
    alert('Leave balance exported successfully!');
  };

  const handleViewHistory = (employee) => {
    setSelectedEmployee(employee);
    setShowHistoryModal(true);
  };

  const getDepartmentList = () =>
    [...new Set(employees.map((e) => e.department))];

  // ==================== RENDER ====================
  return (
    <div className="leave-balance-page">
      <Container fluid>
        {/* ==================== Header ==================== */}
        <div className="balance-header">
          <div className="header-left">
            <Button
              variant="outline-secondary"
              size="sm"
              className="back-btn me-3"
              onClick={() => navigate('/leave')}
            >
              <FaArrowLeft className="me-1" /> Back
            </Button>
            <div>
              <h2 className="page-title">Leave Balance</h2>
              <p className="page-subtitle">
                View and manage employee leave balances for {yearFilter}
              </p>
            </div>
          </div>
          <div className="header-right">
            <Form.Select
              size="sm"
              value={yearFilter}
              onChange={(e) => setYearFilter(parseInt(e.target.value))}
              style={{ width: 120 }}
              className="me-2"
            >
              {[2024, 2025, 2026, 2027].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </Form.Select>
            <Button
              variant="outline-secondary"
              className="me-2"
              onClick={handleRefresh}
            >
              <FaSync className="me-1" /> Refresh
            </Button>
            <Button variant="outline-secondary" onClick={handleExport}>
              <FaDownload className="me-1" /> Export
            </Button>
          </div>
        </div>

        {/* ==================== Stats ==================== */}
        <Row className="statistics-cards mb-4">
          <Col lg={3} md={6} className="mb-3">
            <Card className="stat-card total-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon-wrapper primary">
                    <FaUserClock className="stat-icon" />
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">{totalEmployees}</h3>
                    <p className="stat-label">Total Employees</p>
                    <small className="stat-detail">With leave balances</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <Card className="stat-card annual-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon-wrapper success">
                    <FaCheckCircle className="stat-icon" />
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">{avgAnnualRemaining}</h3>
                    <p className="stat-label">Avg. Annual Days Left</p>
                    <small className="stat-detail">Per employee</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <Card className="stat-card used-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon-wrapper warning">
                    <FaCalendarAlt className="stat-icon" />
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">{totalUsedThisYear}</h3>
                    <p className="stat-label">Total Days Used</p>
                    <small className="stat-detail">This year</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <Card className="stat-card pending-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon-wrapper info">
                    <FaHourglassHalf className="stat-icon" />
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">{totalPendingRequests}</h3>
                    <p className="stat-label">Pending Approvals</p>
                    <small className="stat-detail">Awaiting review</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* ==================== Info Alert ==================== */}
        <Alert variant="info" className="d-flex align-items-center mb-4">
          <FaInfoCircle className="me-2" />
          <span>
            <strong>Note:</strong> Leave balances are reset at the start of each calendar year.
            Any unused <strong>Annual</strong> leave can be carried forward up to 5 days.
          </span>
        </Alert>

        {/* ==================== Filters ==================== */}
        <Card className="filter-card mb-4">
          <Card.Body>
            <Row className="g-3 align-items-center">
              <Col md={6} lg={4}>
                <InputGroup>
                  <InputGroup.Text><FaSearch /></InputGroup.Text>
                  <Form.Control
                    placeholder="Search by name, ID or department..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={4} lg={3}>
                <Form.Select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                >
                  <option value="all">All Departments</option>
                  {getDepartmentList().map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={2} lg={2} className="text-end ms-auto">
                <span className="text-muted small">
                  {filteredEmployees.length} result{filteredEmployees.length !== 1 ? 's' : ''}
                </span>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* ==================== Employee Balance Cards ==================== */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted">Loading balances...</p>
          </div>
        ) : (
          <Row className="g-4">
            {filteredEmployees.map((emp) => (
              <Col xl={4} lg={6} md={12} key={emp.id}>
                <LeaveBalanceCard
                  employee={emp}
                  leaveTypes={leaveTypes}
                  onViewHistory={() => handleViewHistory(emp)}
                />
              </Col>
            ))}
            {filteredEmployees.length === 0 && (
              <Col xs={12}>
                <Card className="empty-card text-center py-5">
                  <FaUserClock className="empty-icon" />
                  <p className="text-muted mb-0">No employees found</p>
                </Card>
              </Col>
            )}
          </Row>
        )}

        {/* ==================== History Modal ==================== */}
        <Modal
          show={showHistoryModal}
          onHide={() => setShowHistoryModal(false)}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <FaCalendarAlt className="me-2" />
              Leave Usage History — {selectedEmployee?.employeeName}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedEmployee && (
              <>
                <div className="history-header">
                  <div className="history-avatar">{selectedEmployee.avatar}</div>
                  <div>
                    <h5 className="mb-1">{selectedEmployee.employeeName}</h5>
                    <p className="text-muted mb-0 small">
                      #{selectedEmployee.employeeId} • {selectedEmployee.department}
                    </p>
                  </div>
                </div>

                <hr />

                <h6 className="mb-3">Balance Summary</h6>
                <Row className="g-3 mb-4">
                  {leaveTypes.map((type) => {
                    const bal = selectedEmployee.balances[type.key];
                    if (!bal || bal.total === 0) return null;
                    return (
                      <Col md={6} key={type.key}>
                        <div className={`history-balance-box box-${type.bg}`}>
                          <div className="box-header">
                            <span className="box-icon">{type.icon}</span>
                            <span className="box-label">{type.label}</span>
                          </div>
                          <div className="box-body">
                            <div className="box-row">
                              <span>Total</span>
                              <strong>{bal.total} days</strong>
                            </div>
                            <div className="box-row">
                              <span>Used</span>
                              <strong className="text-danger">{bal.used} days</strong>
                            </div>
                            <div className="box-row">
                              <span>Pending</span>
                              <strong className="text-warning">{bal.pending} days</strong>
                            </div>
                            <div className="box-row total-row">
                              <span>Remaining</span>
                              <strong className="text-success">
                                {bal.remaining} days
                              </strong>
                            </div>
                          </div>
                        </div>
                      </Col>
                    );
                  })}
                </Row>

                <h6 className="mb-3">Recent Leave Requests</h6>
                <Table bordered hover size="sm">
                  <thead className="bg-light">
                    <tr>
                      <th>Type</th>
                      <th>From</th>
                      <th>To</th>
                      <th>Days</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><Badge bg="primary">Annual</Badge></td>
                      <td>2026-01-10</td>
                      <td>2026-01-12</td>
                      <td>3</td>
                      <td><Badge bg="success">Approved</Badge></td>
                    </tr>
                    <tr>
                      <td><Badge bg="danger">Sick</Badge></td>
                      <td>2026-02-05</td>
                      <td>2026-02-06</td>
                      <td>2</td>
                      <td><Badge bg="success">Approved</Badge></td>
                    </tr>
                    <tr>
                      <td><Badge bg="info">Casual</Badge></td>
                      <td>2026-03-15</td>
                      <td>2026-03-15</td>
                      <td>1</td>
                      <td><Badge bg="warning">Pending</Badge></td>
                    </tr>
                  </tbody>
                </Table>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowHistoryModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={() => window.print()}>
              <FaPrint className="me-1" /> Print
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default LeaveBalance;