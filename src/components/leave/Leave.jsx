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

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockLeaves = [
        {
          id: 1,
          employeeName: 'John Doe',
          employeeId: 'EMP001',
          department: 'Software',
          type: 'Annual',
          startDate: '2026-01-20',
          endDate: '2026-01-22',
          totalDays: 3,
          reason: 'Family vacation',
          status: 'Approved',
          appliedDate: '2026-01-15',
          approvedBy: 'Jane Smith',
          approvedDate: '2026-01-16',
          remarks: 'Approved for 3 days',
          avatar: 'JD'
        },
        {
          id: 2,
          employeeName: 'Jane Smith',
          employeeId: 'EMP002',
          department: 'Marketing',
          type: 'Sick',
          startDate: '2026-01-18',
          endDate: '2026-01-19',
          totalDays: 2,
          reason: 'Flu symptoms',
          status: 'Pending',
          appliedDate: '2026-01-17',
          approvedBy: null,
          approvedDate: null,
          remarks: null,
          avatar: 'JS'
        },
        {
          id: 3,
          employeeName: 'Mike Johnson',
          employeeId: 'EMP003',
          department: 'Electrical',
          type: 'Emergency',
          startDate: '2026-01-16',
          endDate: '2026-01-16',
          totalDays: 1,
          reason: 'Family emergency',
          status: 'Approved',
          appliedDate: '2026-01-15',
          approvedBy: 'Sarah Williams',
          approvedDate: '2026-01-15',
          remarks: 'Approved',
          avatar: 'MJ'
        },
        {
          id: 4,
          employeeName: 'Sarah Williams',
          employeeId: 'EMP004',
          department: 'Production',
          type: 'Annual',
          startDate: '2026-01-25',
          endDate: '2026-01-29',
          totalDays: 5,
          reason: 'Annual vacation',
          status: 'Pending',
          appliedDate: '2026-01-20',
          approvedBy: null,
          approvedDate: null,
          remarks: null,
          avatar: 'SW'
        },
        {
          id: 5,
          employeeName: 'Robert Brown',
          employeeId: 'EMP005',
          department: 'Software',
          type: 'Sick',
          startDate: '2026-01-21',
          endDate: '2026-01-21',
          totalDays: 1,
          reason: 'Doctor appointment',
          status: 'Rejected',
          appliedDate: '2026-01-19',
          approvedBy: 'John Doe',
          approvedDate: '2026-01-20',
          remarks: 'Insufficient notice',
          avatar: 'RB'
        },
        {
          id: 6,
          employeeName: 'Emily Davis',
          employeeId: 'EMP006',
          department: 'HR',
          type: 'Personal',
          startDate: '2026-01-23',
          endDate: '2026-01-24',
          totalDays: 2,
          reason: 'Personal matters',
          status: 'Approved',
          appliedDate: '2026-01-18',
          approvedBy: 'Mike Johnson',
          approvedDate: '2026-01-19',
          remarks: 'Approved',
          avatar: 'ED'
        },
        {
          id: 7,
          employeeName: 'David Wilson',
          employeeId: 'EMP007',
          department: 'Finance',
          type: 'Annual',
          startDate: '2026-02-01',
          endDate: '2026-02-05',
          totalDays: 5,
          reason: 'International travel',
          status: 'Pending',
          appliedDate: '2026-01-22',
          approvedBy: null,
          approvedDate: null,
          remarks: null,
          avatar: 'DW'
        }
      ];

      setLeaves(mockLeaves);
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
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newLeave = {
        ...leaveData,
        id: leaves.length + 1,
        status: 'Pending',
        appliedDate: new Date().toISOString().split('T')[0],
        approvedBy: null,
        approvedDate: null,
        avatar: leaveData.employeeName.split(' ').map(n => n[0]).join('')
      };
      
      setLeaves([newLeave, ...leaves]);
      setShowForm(false);
      setSuccess('Leave application submitted successfully!');
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
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedLeaves = leaves.map(leave => 
        leave.id === leaveData.id ? { ...leave, ...leaveData } : leave
      );
      
      setLeaves(updatedLeaves);
      setShowForm(false);
      setEditingLeave(null);
      setSuccess('Leave application updated successfully!');
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
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setLeaves(leaves.filter(leave => leave.id !== id));
        setSuccess('Leave application deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        setError('Failed to delete leave application. Please try again.');
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
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedLeaves = leaves.map(leave => 
        leave.id === id ? { 
          ...leave, 
          status: 'Approved',
          approvedBy: 'Current User',
          approvedDate: new Date().toISOString().split('T')[0]
        } : leave
      );
      
      setLeaves(updatedLeaves);
      setSuccess('Leave application approved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to approve leave application. Please try again.');
    }
  };

  const handleRejectLeave = async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedLeaves = leaves.map(leave => 
        leave.id === id ? { 
          ...leave, 
          status: 'Rejected',
          approvedBy: 'Current User',
          approvedDate: new Date().toISOString().split('T')[0]
        } : leave
      );
      
      setLeaves(updatedLeaves);
      setSuccess('Leave application rejected successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to reject leave application. Please try again.');
    }
  };

  const handleExport = () => {
    console.log('Exporting leave data...');
    setSuccess('Leave data exported successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const filteredLeaves = leaves.filter(leave => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      leave.employeeName.toLowerCase().includes(searchLower) ||
      leave.employeeId.toLowerCase().includes(searchLower) ||
      leave.department.toLowerCase().includes(searchLower) ||
      leave.type.toLowerCase().includes(searchLower) ||
      leave.reason.toLowerCase().includes(searchLower);
    
    const matchesFilter = filter === 'all' || leave.status.toLowerCase() === filter;
    
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