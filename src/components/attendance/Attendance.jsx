import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Button, Modal, Alert, Spinner,
  Badge
} from 'react-bootstrap';
import {
  FaPlus, FaDownload, FaCalendarCheck, FaUserCheck, FaUserTimes,
  FaUserClock, FaSync, FaPrint, FaChartBar
} from 'react-icons/fa';
import AttendanceTable from './AttendanceTable';
import AttendanceForm from './AttendanceForm';
import AttendanceDetails from './AttendanceDetails';
import './Attendance.css';

const Attendance = () => {
  const [loading, setLoading] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [viewingRecord, setViewingRecord] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  // ==================== LOAD DATA ====================
  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      setAttendanceRecords([
        {
          id: 1, employeeName: 'John Doe', employeeId: 'EMP001',
          department: 'Software', date: '2026-01-20',
          checkIn: '09:00 AM', checkOut: '06:00 PM', status: 'present',
          workingHours: '8h', overtime: '1h', avatar: 'JD',
          location: 'Main Office', remarks: 'On time'
        },
        {
          id: 2, employeeName: 'Jane Smith', employeeId: 'EMP002',
          department: 'Marketing', date: '2026-01-20',
          checkIn: '09:30 AM', checkOut: '05:30 PM', status: 'present',
          workingHours: '7.5h', overtime: '0.5h', avatar: 'JS',
          location: 'Main Office', remarks: ''
        },
        {
          id: 3, employeeName: 'Mike Johnson', employeeId: 'EMP003',
          department: 'Electrical', date: '2026-01-20',
          checkIn: '--', checkOut: '--', status: 'absent',
          workingHours: '0h', overtime: '0h', avatar: 'MJ',
          location: '--', remarks: 'Sick leave'
        },
        {
          id: 4, employeeName: 'Sarah Williams', employeeId: 'EMP004',
          department: 'Production', date: '2026-01-20',
          checkIn: '--', checkOut: '--', status: 'leave',
          workingHours: '0h', overtime: '0h', avatar: 'SW',
          location: '--', remarks: 'Personal leave'
        },
        {
          id: 5, employeeName: 'Robert Brown', employeeId: 'EMP005',
          department: 'Software', date: '2026-01-20',
          checkIn: '08:45 AM', checkOut: '06:15 PM', status: 'present',
          workingHours: '9h', overtime: '1.5h', avatar: 'RB',
          location: 'Remote', remarks: ''
        },
        {
          id: 6, employeeName: 'Emily Davis', employeeId: 'EMP006',
          department: 'HR', date: '2026-01-20',
          checkIn: '09:15 AM', checkOut: '05:45 PM', status: 'present',
          workingHours: '7.5h', overtime: '0h', avatar: 'ED',
          location: 'Main Office', remarks: ''
        },
        {
          id: 7, employeeName: 'David Wilson', employeeId: 'EMP007',
          department: 'Finance', date: '2026-01-20',
          checkIn: '09:45 AM', checkOut: '06:00 PM', status: 'late',
          workingHours: '7h', overtime: '0h', avatar: 'DW',
          location: 'Main Office', remarks: 'Traffic delay'
        }
      ]);
    } catch (err) {
      setError('Failed to load attendance records.');
    } finally {
      setLoading(false);
    }
  };

  // ==================== HANDLERS ====================
  const handleAdd = (recordData) => {
    const newRecord = {
      ...recordData,
      id: attendanceRecords.length + 1,
      avatar: recordData.employeeName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    };
    setAttendanceRecords([newRecord, ...attendanceRecords]);
    setShowForm(false);
    setSuccess('Attendance marked successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleUpdate = (recordData) => {
    setAttendanceRecords(
      attendanceRecords.map((r) =>
        r.id === recordData.id ? { ...r, ...recordData } : r
      )
    );
    setShowForm(false);
    setEditingRecord(null);
    setSuccess('Attendance record updated successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this attendance record?')) return;
    setAttendanceRecords(attendanceRecords.filter((r) => r.id !== id));
    setSuccess('Attendance record deleted successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleView = (record) => {
    setViewingRecord(record);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setShowForm(true);
  };

  const handleExport = () => {
    setSuccess('Attendance data exported successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  // ==================== STATS ====================
  const totalRecords = attendanceRecords.length;
  const presentCount = attendanceRecords.filter((r) => r.status === 'present').length;
  const absentCount = attendanceRecords.filter((r) => r.status === 'absent').length;
  const leaveCount = attendanceRecords.filter((r) => r.status === 'leave').length;
  const lateCount = attendanceRecords.filter((r) => r.status === 'late').length;

  return (
    <div className="attendance-page">
      <Container fluid>
        {/* Header */}
        <div className="attendance-header">
          <div className="header-left">
            <h2 className="page-title">Attendance Management</h2>
            <p className="page-subtitle">
              Track and manage employee attendance records
            </p>
          </div>
          <div className="header-right">
            <Button
              variant="primary"
              className="me-2"
              onClick={() => {
                setEditingRecord(null);
                setShowForm(true);
              }}
            >
              <FaPlus className="me-1" /> Mark Attendance
            </Button>
            <Button variant="outline-secondary" className="me-2" onClick={fetchAttendance}>
              <FaSync className="me-1" /> Refresh
            </Button>
            <Button variant="outline-secondary" className="me-2" onClick={handleExport}>
              <FaDownload className="me-1" /> Export
            </Button>
            <Button variant="outline-secondary" onClick={() => window.print()}>
              <FaPrint className="me-1" /> Print
            </Button>
          </div>
        </div>

        {/* Stats */}
        <Row className="statistics-cards mb-4">
          <Col lg={3} md={6} className="mb-3">
            <Card className="stat-card total-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon-wrapper primary">
                    <FaCalendarCheck className="stat-icon" />
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">{totalRecords}</h3>
                    <p className="stat-label">Total Records</p>
                    <small className="stat-detail">{selectedDate}</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <Card className="stat-card present-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon-wrapper success">
                    <FaUserCheck className="stat-icon" />
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">{presentCount}</h3>
                    <p className="stat-label">Present</p>
                    <small className="stat-detail">Checked in</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <Card className="stat-card absent-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon-wrapper danger">
                    <FaUserTimes className="stat-icon" />
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">{absentCount + lateCount}</h3>
                    <p className="stat-label">Absent / Late</p>
                    <small className="stat-detail">
                      {absentCount} absent, {lateCount} late
                    </small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <Card className="stat-card leave-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon-wrapper warning">
                    <FaUserClock className="stat-icon" />
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">{leaveCount}</h3>
                    <p className="stat-label">On Leave</p>
                    <small className="stat-detail">Approved leaves</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Alerts */}
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant="success" dismissible onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        {/* Table */}
        <Card className="attendance-main-card">
          <Card.Body>
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-muted">Loading attendance records...</p>
              </div>
            ) : (
              <AttendanceTable
                records={attendanceRecords}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
            )}
          </Card.Body>
        </Card>

        {/* Form Modal */}
        <Modal
          show={showForm}
          onHide={() => {
            setShowForm(false);
            setEditingRecord(null);
          }}
          size="xl"
          centered
          dialogClassName="attendance-form-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <FaCalendarCheck className="me-2" />
              {editingRecord ? 'View / Edit Attendance' : 'Mark Attendance'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AttendanceForm
              record={editingRecord}
              onSubmit={editingRecord ? handleUpdate : handleAdd}
              onCancel={() => {
                setShowForm(false);
                setEditingRecord(null);
              }}
            />
          </Modal.Body>
        </Modal>

        <Modal
          show={Boolean(viewingRecord)}
          onHide={() => setViewingRecord(null)}
          centered
          size="xl"
          dialogClassName="attendance-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>Attendance Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AttendanceDetails
              record={viewingRecord}
              onEdit={() => {
                setEditingRecord(viewingRecord);
                setViewingRecord(null);
                setShowForm(true);
              }}
              onDelete={() => {
                handleDelete(viewingRecord.id);
                setViewingRecord(null);
              }}
              onClose={() => setViewingRecord(null)}
            />
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};

export default Attendance;
