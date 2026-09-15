import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Tabs, 
  Tab,
  Badge,
  Dropdown,
  Alert,
  Spinner,
  Modal
} from 'react-bootstrap';
import { 
  FaCalendarAlt, 
  FaChartBar, 
  FaDownload, 
  FaFilter,
  FaPlus,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaClock as FaPending,
  FaEye,
  FaEdit,
  FaTrash
} from 'react-icons/fa';
import AttendanceForm from './AttendanceForm';
import AttendanceTable from './AttendanceTable';
import './Attendance.css';

const Attendance = () => {
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filter, setFilter] = useState('all');
  const [summary, setSummary] = useState({
    present: 0,
    absent: 0,
    leave: 0,
    total: 0
  });

  // Mock data - In real app, this would come from API
  useEffect(() => {
    fetchAttendanceData();
  }, [selectedDate]);

  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockData = [
        {
          id: 1,
          employeeName: 'John Doe',
          department: 'Software',
          date: '2026-01-15',
          checkIn: '09:00 AM',
          checkOut: '06:00 PM',
          status: 'present',
          workingHours: '8h',
          overtime: '1h',
          avatar: 'JD'
        },
        {
          id: 2,
          employeeName: 'Jane Smith',
          department: 'Marketing',
          date: '2026-01-15',
          checkIn: '09:30 AM',
          checkOut: '05:30 PM',
          status: 'present',
          workingHours: '7.5h',
          overtime: '0.5h',
          avatar: 'JS'
        },
        {
          id: 3,
          employeeName: 'Mike Johnson',
          department: 'Electrical',
          date: '2026-01-15',
          checkIn: '--',
          checkOut: '--',
          status: 'absent',
          workingHours: '0h',
          overtime: '0h',
          avatar: 'MJ'
        },
        {
          id: 4,
          employeeName: 'Sarah Williams',
          department: 'Production',
          date: '2026-01-15',
          checkIn: '--',
          checkOut: '--',
          status: 'leave',
          workingHours: '0h',
          overtime: '0h',
          avatar: 'SW',
          leaveReason: 'Personal Leave'
        },
        {
          id: 5,
          employeeName: 'Robert Brown',
          department: 'Software',
          date: '2026-01-15',
          checkIn: '08:45 AM',
          checkOut: '06:15 PM',
          status: 'present',
          workingHours: '9h',
          overtime: '1.5h',
          avatar: 'RB'
        },
        {
          id: 6,
          employeeName: 'Emily Davis',
          department: 'HR',
          date: '2026-01-15',
          checkIn: '09:15 AM',
          checkOut: '05:45 PM',
          status: 'present',
          workingHours: '7.5h',
          overtime: '0h',
          avatar: 'ED'
        }
      ];

      setAttendanceData(mockData);
      calculateSummary(mockData);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = (data) => {
    const present = data.filter(item => item.status === 'present').length;
    const absent = data.filter(item => item.status === 'absent').length;
    const leave = data.filter(item => item.status === 'leave').length;
    
    setSummary({
      present,
      absent,
      leave,
      total: data.length
    });
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      present: { variant: 'success', icon: <FaCheckCircle />, label: 'Present' },
      absent: { variant: 'danger', icon: <FaTimesCircle />, label: 'Absent' },
      leave: { variant: 'warning', icon: <FaPending />, label: 'On Leave' },
      late: { variant: 'warning', icon: <FaClock />, label: 'Late' },
    };
    
    const config = statusMap[status] || statusMap.present;
    return (
      <Badge bg={config.variant} className="status-badge">
        {config.icon} {config.label}
      </Badge>
    );
  };

  const getStatusCount = (status) => {
    return attendanceData.filter(item => item.status === status).length;
  };

  const filteredData = attendanceData.filter(item => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  const handleAddAttendance = (newAttendance) => {
    setAttendanceData([...attendanceData, newAttendance]);
    calculateSummary([...attendanceData, newAttendance]);
    setShowForm(false);
  };

  const handleViewAttendance = (attendance) => {
    setSelectedAttendance(attendance);
    setShowDetails(true);
  };

  const handleEditAttendance = (attendance) => {
    setSelectedAttendance(attendance);
    setShowForm(true);
  };

  const handleSaveAttendance = (attendance) => {
    if (selectedAttendance) {
      const updatedData = attendanceData.map(item =>
        item.id === selectedAttendance.id ? { ...item, ...attendance, id: item.id } : item
      );
      setAttendanceData(updatedData);
      calculateSummary(updatedData);
    } else {
      handleAddAttendance(attendance);
      return;
    }

    setSelectedAttendance(null);
    setShowForm(false);
  };

  const handleDeleteAttendance = () => {
    if (!recordToDelete) return;

    const updatedData = attendanceData.filter(item => item.id !== recordToDelete.id);
    setAttendanceData(updatedData);
    calculateSummary(updatedData);
    setRecordToDelete(null);
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedAttendance(null);
  };

  const handleExport = () => {
    // Implement export functionality
    console.log('Exporting attendance data...');
  };

  const handleRefresh = () => {
    fetchAttendanceData();
  };

  return (
    <div className="attendance-page">
      <Container fluid>
        {/* Header Section */}
        <div className="attendance-header">
          <div className="header-left">
            <h2 className="page-title">Attendance Management</h2>
            <p className="page-subtitle">Track and manage employee attendance</p>
          </div>
          <div className="header-right">
            <Button 
              variant="primary" 
              className="me-2"
              onClick={() => setShowForm(true)}
            >
              <FaPlus className="me-1" /> Mark Attendance
            </Button>
            <Button variant="outline-secondary" className="me-2" onClick={handleExport}>
              <FaDownload className="me-1" /> Export
            </Button>
            <Button variant="outline-primary" onClick={handleRefresh}>
              <FaCalendarAlt className="me-1" /> Today
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <Row className="summary-cards mb-4">
          <Col lg={3} md={6} className="mb-3">
            <Card className="summary-card present-card">
              <Card.Body>
                <div className="summary-icon">
                  <FaCheckCircle />
                </div>
                <div className="summary-content">
                  <h3 className="summary-number">{summary.present}</h3>
                  <p className="summary-label">Present</p>
                  <div className="summary-percentage">
                    {summary.total > 0 ? Math.round((summary.present / summary.total) * 100) : 0}%
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={3} md={6} className="mb-3">
            <Card className="summary-card absent-card">
              <Card.Body>
                <div className="summary-icon">
                  <FaTimesCircle />
                </div>
                <div className="summary-content">
                  <h3 className="summary-number">{summary.absent}</h3>
                  <p className="summary-label">Absent</p>
                  <div className="summary-percentage">
                    {summary.total > 0 ? Math.round((summary.absent / summary.total) * 100) : 0}%
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={3} md={6} className="mb-3">
            <Card className="summary-card leave-card">
              <Card.Body>
                <div className="summary-icon">
                  <FaPending />
                </div>
                <div className="summary-content">
                  <h3 className="summary-number">{summary.leave}</h3>
                  <p className="summary-label">On Leave</p>
                  <div className="summary-percentage">
                    {summary.total > 0 ? Math.round((summary.leave / summary.total) * 100) : 0}%
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={3} md={6} className="mb-3">
            <Card className="summary-card total-card">
              <Card.Body>
                <div className="summary-icon">
                  <FaChartBar />
                </div>
                <div className="summary-content">
                  <h3 className="summary-number">{summary.total}</h3>
                  <p className="summary-label">Total Employees</p>
                  <div className="summary-percentage">100%</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Main Content */}
        <Card className="attendance-main-card">
          <Card.Body>
            {/* Filter and Actions */}
            <div className="attendance-toolbar">
              <div className="toolbar-left">
                <Dropdown className="me-2">
                  <Dropdown.Toggle variant="outline-secondary">
                    <FaFilter className="me-1" /> 
                    {filter === 'all' ? 'All Status' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setFilter('all')}>All Status</Dropdown.Item>
                    <Dropdown.Item onClick={() => setFilter('present')}>
                      <FaCheckCircle className="text-success me-1" /> Present
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => setFilter('absent')}>
                      <FaTimesCircle className="text-danger me-1" /> Absent
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => setFilter('leave')}>
                      <FaPending className="text-warning me-1" /> On Leave
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                
                <div className="filter-chips">
                  <Button 
                    variant={filter === 'all' ? 'primary' : 'outline-secondary'}
                    size="sm"
                    onClick={() => setFilter('all')}
                  >
                    All ({summary.total})
                  </Button>
                  <Button 
                    variant={filter === 'present' ? 'success' : 'outline-secondary'}
                    size="sm"
                    onClick={() => setFilter('present')}
                  >
                    Present ({getStatusCount('present')})
                  </Button>
                  <Button 
                    variant={filter === 'absent' ? 'danger' : 'outline-secondary'}
                    size="sm"
                    onClick={() => setFilter('absent')}
                  >
                    Absent ({getStatusCount('absent')})
                  </Button>
                  <Button 
                    variant={filter === 'leave' ? 'warning' : 'outline-secondary'}
                    size="sm"
                    onClick={() => setFilter('leave')}
                  >
                    Leave ({getStatusCount('leave')})
                  </Button>
                </div>
              </div>
              
              <div className="toolbar-right">
                <div className="date-display">
                  <FaCalendarAlt className="me-1" />
                  <span>{selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
              </div>
            </div>

            {/* Attendance Table */}
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-muted">Loading attendance data...</p>
              </div>
            ) : (
              <AttendanceTable 
                data={filteredData} 
                getStatusBadge={getStatusBadge}
                onRefresh={handleRefresh}
                onView={handleViewAttendance}
                onEdit={handleEditAttendance}
                onDelete={setRecordToDelete}
              />
            )}
          </Card.Body>
        </Card>

        {/* Add Attendance Modal */}
        <Modal 
          show={showForm} 
          onHide={closeForm}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {selectedAttendance ? <FaEdit className="me-2" /> : <FaPlus className="me-2" />}
              {selectedAttendance ? 'Edit Attendance' : 'Mark Attendance'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AttendanceForm 
              onSubmit={handleSaveAttendance}
              onCancel={closeForm}
              initialData={selectedAttendance}
            />
          </Modal.Body>
        </Modal>

        <Modal show={showDetails} onHide={() => setShowDetails(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title><FaEye className="me-2" />Attendance Details</Modal.Title>
          </Modal.Header>
          {selectedAttendance && (
            <Modal.Body>
              <div className="employee-info mb-3">
                <div className="employee-avatar">{selectedAttendance.avatar}</div>
                <div className="employee-details">
                  <div className="employee-name">{selectedAttendance.employeeName}</div>
                  <div className="employee-id">#{selectedAttendance.employeeId || 'N/A'}</div>
                </div>
              </div>
              <p><strong>Department:</strong> {selectedAttendance.department}</p>
              <p><strong>Date:</strong> {new Date(selectedAttendance.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              <p><strong>Status:</strong> {getStatusBadge(selectedAttendance.status)}</p>
              <p><strong>Check In:</strong> {selectedAttendance.checkIn || '--'}</p>
              <p><strong>Check Out:</strong> {selectedAttendance.checkOut || '--'}</p>
              <p><strong>Working Hours:</strong> {selectedAttendance.workingHours}</p>
              {selectedAttendance.overtime && selectedAttendance.overtime !== '0h' && <p><strong>Overtime:</strong> {selectedAttendance.overtime}</p>}
              {selectedAttendance.leaveReason && <p><strong>Leave Reason:</strong> {selectedAttendance.leaveReason}</p>}
              {selectedAttendance.remarks && <p className="mb-0"><strong>Remarks:</strong> {selectedAttendance.remarks}</p>}
            </Modal.Body>
          )}
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDetails(false)}>Close</Button>
          </Modal.Footer>
        </Modal>

        <Modal show={Boolean(recordToDelete)} onHide={() => setRecordToDelete(null)} centered>
          <Modal.Header closeButton>
            <Modal.Title><FaTrash className="me-2" />Delete Attendance</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete the attendance record for <strong>{recordToDelete?.employeeName}</strong>? This action cannot be undone.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setRecordToDelete(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDeleteAttendance}><FaTrash className="me-1" />Delete</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default Attendance;
