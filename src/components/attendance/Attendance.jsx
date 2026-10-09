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
import attendanceService from '../../services/attendanceService';
import employeeService from '../../services/employeeService';
import './Attendance.css';

const Attendance = () => {
  const [loading, setLoading] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [employeesById, setEmployeesById] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [viewingRecord, setViewingRecord] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  // ==================== LOAD DATA ====================
  useEffect(() => {
    fetchAttendance();
  }, []);

  const normalizeAttendance = (item, employeeLookup = employeesById) => {
    const employeeRef = item.employeeId;
    const employeeId = employeeRef && typeof employeeRef === 'object'
      ? (employeeRef._id || employeeRef.id)
      : employeeRef;
    const employee = (employeeRef && typeof employeeRef === 'object' && employeeRef.name
      ? employeeRef
      : employeeLookup[String(employeeId)]) || {};
    const employeeName = employee.name || item.employeeName || 'Employee';
    return ({
    id: item._id || item.id,
    _id: item._id || item.id,
    employeeName,
    employeeId: employee.employeeCode || (typeof employeeId === 'object' ? '' : employeeId) || 'EMP001',
    employeeMongoId: employeeId,
    department: employee.department || item.department || 'General',
    date: item.date ? item.date.split('T')[0] : new Date().toISOString().split('T')[0],
    checkIn: item.checkIn || '--',
    checkOut: item.checkOut || '--',
    status: item.status || 'present',
    workingHours: item.workHours ? `${item.workHours}h` : '8h',
    overtime: item.overtime ? `${item.overtime}h` : '0h',
    avatar: employeeName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
    location: item.location?.name || 'Main Office',
    remarks: item.remarks || ''
  });
  };

  const fetchAttendance = async () => {
    setLoading(true);
    setError('');
    try {
      const employeeResult = await employeeService.getAllEmployees({ limit: 500 });
      if (employeeResult.success) {
        const payload = employeeResult.data;
        const employees = Array.isArray(payload) ? payload : (payload?.data || payload?.employees || []);
        setEmployeesById(Object.fromEntries(employees.map((employee) => [String(employee._id || employee.id), employee])));
      }
      const res = await attendanceService.getAllAttendance({ limit: 100 });
      if (res.success && res.data) {
        const list = Array.isArray(res.data) ? res.data : (res.data.data || []);
        if (list.length > 0) {
          // Resolve ids against the live employee list so records without a populated
          // employee reference still show the right person.
          const employeePayload = employeeResult?.data;
          const employeeList = Array.isArray(employeePayload) ? employeePayload : (employeePayload?.data || employeePayload?.employees || []);
          const lookup = Object.fromEntries(employeeList.map((employee) => [String(employee._id || employee.id), employee]));
          setAttendanceRecords(list.map((item) => normalizeAttendance(item, lookup)));
          return;
        }
      }
      setAttendanceRecords([]);
    } catch (err) {
      console.error('Error fetching attendance:', err);
      setError('Failed to load attendance records from database.');
    } finally {
      setLoading(false);
    }
  };

  // ==================== HANDLERS ====================
  const handleAdd = async (recordData) => {
    try {
      const payload = {
        employeeId: recordData.employeeMongoId || recordData.employeeId,
        status: (recordData.status || 'present').toLowerCase(),
        date: recordData.date || new Date().toISOString(),
        checkIn: recordData.checkIn && recordData.checkIn !== '--' ? recordData.checkIn : '09:00',
        checkOut: recordData.checkOut && recordData.checkOut !== '--' ? recordData.checkOut : '18:00'
      };
      const res = await attendanceService.createAttendance(payload);
      if (res.success) {
        await fetchAttendance();
        setShowForm(false);
        setSuccess('Attendance marked successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(res.error?.message || 'Failed to mark attendance');
      }
    } catch (err) {
      setError('Failed to mark attendance.');
    }
  };

  const handleUpdate = async (recordData) => {
    try {
      const id = recordData._id || recordData.id;
      const payload = {
        status: (recordData.status || 'present').toLowerCase(),
        checkIn: recordData.checkIn && recordData.checkIn !== '--' ? recordData.checkIn : undefined,
        checkOut: recordData.checkOut && recordData.checkOut !== '--' ? recordData.checkOut : undefined
      };
      const res = await attendanceService.updateAttendance(id, payload);
      if (res.success) {
        await fetchAttendance();
        setShowForm(false);
        setEditingRecord(null);
        setSuccess('Attendance record updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(res.error?.message || 'Failed to update attendance');
      }
    } catch (err) {
      setError('Failed to update attendance.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this attendance record from MongoDB?')) return;
    try {
      const res = await attendanceService.deleteAttendance(id);
      if (res.success) {
        setAttendanceRecords(prev => prev.filter(r => r.id !== id && r._id !== id));
        setSuccess('Attendance record deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(res.error?.message || 'Failed to delete attendance record');
      }
    } catch (err) {
      setError('Failed to delete attendance record.');
    }
  };

  const handleView = (record) => {
    setEditingRecord(record);
    setViewingRecord(true);
    setShowForm(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setViewingRecord(false);
    setShowForm(true);
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Name,Employee ID,Department,Date,Check In,Check Out,Status,Working Hours\n"
      + attendanceRecords.map(r => `"${r.employeeName}","${r.employeeId}","${r.department}","${r.date}","${r.checkIn}","${r.checkOut}","${r.status}","${r.workingHours}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `attendance_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                setViewingRecord(false);
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
            setViewingRecord(false);
          }}
          size={viewingRecord ? 'xl' : 'lg'}
          centered
          dialogClassName="attendance-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <FaCalendarCheck className="me-2" />
              {viewingRecord ? 'Attendance Details' : editingRecord ? 'View / Edit Attendance' : 'Mark Attendance'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {viewingRecord ? (
              <AttendanceDetails
                record={editingRecord}
                onEdit={() => setViewingRecord(false)}
                onDelete={() => {
                  handleDelete(editingRecord.id);
                  setShowForm(false);
                  setEditingRecord(null);
                  setViewingRecord(false);
                }}
                onClose={() => {
                  setShowForm(false);
                  setEditingRecord(null);
                  setViewingRecord(false);
                }}
              />
            ) : <AttendanceForm
              record={editingRecord}
              onSubmit={editingRecord ? handleUpdate : handleAdd}
              onCancel={() => {
                setShowForm(false);
                setEditingRecord(null);
                setViewingRecord(false);
              }}
            />}
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};

export default Attendance;
