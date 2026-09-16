import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Modal, 
  Alert, 
  Spinner,
  Badge,
  Tabs,
  Tab
} from 'react-bootstrap';
import { 
  FaPlus, 
  FaDownload, 
  FaCalendarAlt, 
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaChartBar
} from 'react-icons/fa';
import LeaveList from './LeaveList';
import LeaveApplication from './LeaveApplication';
import LeaveRequestForm from './LeaveRequestForm';
import leaveService from '../../services/leaveService';
import './Leave.css';

const Leave = () => {
  const [loading, setLoading] = useState(false);
  const [leaves, setLeaves] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showApplication, setShowApplication] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [editingLeave, setEditingLeave] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  // Mock data - In real app, this would come from API
  useEffect(() => {
    fetchLeaves();
  }, []);

  const normalizeLeave = (item) => ({
    id: item._id || item.id,
    _id: item._id || item.id,
    employeeId: typeof item.employeeId === 'object' ? (item.employeeId?.employeeId || item.employeeId?._id || 'EMP') : (item.employeeId || 'EMP'),
    employeeMongoId: typeof item.employeeId === 'object' ? item.employeeId?._id : item.employeeId,
    employeeName: item.employeeName || item.employeeId?.name || 'Employee',
    department: item.department || item.employeeId?.department || 'General',
    type: item.type ? (item.type.charAt(0).toUpperCase() + item.type.slice(1).toLowerCase()) : 'Annual',
    startDate: item.startDate ? item.startDate.split('T')[0] : '',
    endDate: item.endDate ? item.endDate.split('T')[0] : '',
    totalDays: item.daysCount || item.totalDays || item.durationInDays || 1,
    reason: item.reason || '',
    status: item.status ? (item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase()) : 'Pending',
    appliedDate: item.createdAt ? item.createdAt.split('T')[0] : (item.appliedDate || new Date().toISOString().split('T')[0]),
    approvedBy: item.approvedBy?.name || item.approvedBy || null,
    approvedDate: item.approvedAt ? item.approvedAt.split('T')[0] : (item.approvedDate || null),
    remarks: item.rejectionReason || item.notes || item.remarks || '',
    avatar: (item.employeeName || 'EM').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  });

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const res = await leaveService.getAllLeaves();
      if (res.success && res.data) {
        const rawList = Array.isArray(res.data) ? res.data : (res.data.data || []);
        setLeaves(rawList.map(normalizeLeave));
      } else {
        setLeaves([]);
      }
    } catch (error) {
      console.error('Error fetching leaves:', error);
      setError('Failed to load leave applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLeave = async (leaveData) => {
    setLoading(true);
    try {
      const payload = {
        employeeId: leaveData.employeeMongoId || leaveData.employeeId,
        employeeName: leaveData.employeeName,
        reason: leaveData.reason,
        type: (leaveData.type || 'annual').toLowerCase(),
        startDate: leaveData.startDate,
        endDate: leaveData.endDate
      };
      const res = await leaveService.createLeaveApplication(payload);
      if (res.success) {
        setShowForm(false);
        setSuccess('Leave application submitted successfully!');
        fetchLeaves();
      } else {
        setError(res.error || 'Failed to submit leave application.');
      }
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to submit leave application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLeave = async (leaveData) => {
    setLoading(true);
    try {
      const id = leaveData.id || leaveData._id;
      const res = await leaveService.updateLeaveApplication(id, leaveData);
      if (res.success) {
        setShowForm(false);
        setEditingLeave(null);
        setSuccess('Leave application updated successfully!');
        fetchLeaves();
      } else {
        setError(res.error || 'Failed to update leave application.');
      }
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to update leave application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLeave = async (id) => {
    if (window.confirm('Are you sure you want to delete this leave application?')) {
      try {
        setLoading(true);
        const res = await leaveService.deleteLeaveApplication(id);
        if (res.success) {
          setSuccess('Leave application deleted successfully!');
          fetchLeaves();
        } else {
          setError(res.error || 'Failed to delete leave application.');
        }
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        setError('Failed to delete leave application. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleViewLeave = (leave) => {
    setSelectedLeave(leave);
    setShowApplication(true);
  };

  const handleEditLeave = (leave) => {
    setEditingLeave(leave);
    setShowForm(true);
  };

  const handleApproveLeave = async (id) => {
    try {
      setLoading(true);
      const res = await leaveService.approveLeave(id);
      if (res.success) {
        setSuccess('Leave application approved successfully!');
        fetchLeaves();
      } else {
        setError(res.error || 'Failed to approve leave application.');
      }
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to approve leave application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectLeave = async (id) => {
    try {
      setLoading(true);
      const res = await leaveService.rejectLeave(id, 'Rejected by Admin');
      if (res.success) {
        setSuccess('Leave application rejected successfully!');
        fetchLeaves();
      } else {
        setError(res.error || 'Failed to reject leave application.');
      }
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to reject leave application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    console.log('Exporting leave data...');
    setSuccess('Leave data exported successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const filteredLeaves = leaves.filter(leave => {
    const searchLower = (searchTerm || '').toLowerCase();
    const matchesSearch = 
      (leave.employeeName || '').toLowerCase().includes(searchLower) ||
      String(leave.employeeId || '').toLowerCase().includes(searchLower) ||
      (leave.department || '').toLowerCase().includes(searchLower) ||
      (leave.type || '').toLowerCase().includes(searchLower) ||
      (leave.reason || '').toLowerCase().includes(searchLower);
    
    const matchesFilter = filter === 'all' || (leave.status || '').toLowerCase() === filter.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  // Statistics
  const totalLeaves = leaves.length;
  const pendingLeaves = leaves.filter(l => l.status === 'Pending').length;
  const approvedLeaves = leaves.filter(l => l.status === 'Approved').length;
  const rejectedLeaves = leaves.filter(l => l.status === 'Rejected').length;
  const totalDays = leaves.reduce((sum, leave) => sum + leave.totalDays, 0);

  return (
    <div className="leave-page">
      <Container fluid>
        {/* Header Section */}
        <div className="leave-header">
          <div className="header-left">
            <h2 className="page-title">Leave Management</h2>
            <p className="page-subtitle">Manage employee leave applications and requests</p>
          </div>
          <div className="header-right">
            <Button 
              variant="primary" 
              className="me-2"
              onClick={() => {
                setEditingLeave(null);
                setShowForm(true);
              }}
            >
              <FaPlus className="me-1" /> Apply Leave
            </Button>
            <Button variant="outline-secondary" onClick={handleExport}>
              <FaDownload className="me-1" /> Export
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <Row className="statistics-cards mb-4">
          <Col lg={3} md={6} className="mb-3">
            <Card className="stat-card total-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon-wrapper primary">
                    <FaCalendarAlt className="stat-icon" />
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">{totalLeaves}</h3>
                    <p className="stat-label">Total Applications</p>
                    <small className="stat-detail">{totalDays} total days</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={3} md={6} className="mb-3">
            <Card className="stat-card pending-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon-wrapper warning">
                    <FaHourglassHalf className="stat-icon" />
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">{pendingLeaves}</h3>
                    <p className="stat-label">Pending</p>
                    <small className="stat-detail">Awaiting approval</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={3} md={6} className="mb-3">
            <Card className="stat-card approved-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon-wrapper success">
                    <FaCheckCircle className="stat-icon" />
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">{approvedLeaves}</h3>
                    <p className="stat-label">Approved</p>
                    <small className="stat-detail">Accepted requests</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={3} md={6} className="mb-3">
            <Card className="stat-card rejected-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon-wrapper danger">
                    <FaTimesCircle className="stat-icon" />
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">{rejectedLeaves}</h3>
                    <p className="stat-label">Rejected</p>
                    <small className="stat-detail">Declined requests</small>
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

        {/* Leave List */}
        <Card className="leave-main-card">
          <Card.Body>
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-muted">Loading leave applications...</p>
              </div>
            ) : (
              <LeaveList 
                leaves={filteredLeaves}
                onView={handleViewLeave}
                onEdit={handleEditLeave}
                onDelete={handleDeleteLeave}
                onApprove={handleApproveLeave}
                onReject={handleRejectLeave}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filter={filter}
                setFilter={setFilter}
              />
            )}
          </Card.Body>
        </Card>

        {/* Leave Request Form Modal */}
        <Modal 
          show={showForm} 
          onHide={() => {
            setShowForm(false);
            setEditingLeave(null);
          }}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <FaCalendarAlt className="me-2" />
              {editingLeave ? 'Edit Leave Application' : 'Apply for Leave'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <LeaveRequestForm 
              leave={editingLeave}
              onSubmit={editingLeave ? handleUpdateLeave : handleAddLeave}
              onCancel={() => {
                setShowForm(false);
                setEditingLeave(null);
              }}
            />
          </Modal.Body>
        </Modal>

        {/* Leave Application Detail Modal */}
        <Modal 
          show={showApplication} 
          onHide={() => setShowApplication(false)}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <FaCalendarAlt className="me-2" />
              Leave Application Details
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedLeave && (
              <LeaveApplication 
                leave={selectedLeave}
                onApprove={handleApproveLeave}
                onReject={handleRejectLeave}
                onEdit={handleEditLeave}
                onDelete={handleDeleteLeave}
                onClose={() => setShowApplication(false)}
              />
            )}
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};

export default Leave;