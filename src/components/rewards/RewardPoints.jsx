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
  ProgressBar
} from 'react-bootstrap';
import { 
  FaPlus, 
  FaDownload, 
  FaTrophy, 
  FaStar,
  FaMedal,
  FaGift,
  FaAward,
  FaChartBar,
  FaUsers,
  FaCheckCircle,
  FaClock,
  FaCrown
} from 'react-icons/fa';
import AwardList from './AwardList';
import AwardForm from './AwardForm';
import './RewardPoints.css';

const RewardPoints = () => {
  const [loading, setLoading] = useState(false);
  const [awards, setAwards] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAward, setEditingAward] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  // Mock data - In real app, this would come from API
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock Employees
      const mockEmployees = [
        { id: 1, name: 'John Doe', department: 'Software', points: 150, avatar: 'JD' },
        { id: 2, name: 'Jane Smith', department: 'Marketing', points: 120, avatar: 'JS' },
        { id: 3, name: 'Mike Johnson', department: 'Electrical', points: 180, avatar: 'MJ' },
        { id: 4, name: 'Sarah Williams', department: 'Production', points: 90, avatar: 'SW' },
        { id: 5, name: 'Robert Brown', department: 'Software', points: 200, avatar: 'RB' },
        { id: 6, name: 'Emily Davis', department: 'HR', points: 110, avatar: 'ED' }
      ];

      // Mock Awards
      const mockAwards = [
        {
          id: 1,
          employeeName: 'Honorato Imogene curry',
          employeeId: 'EMP001',
          department: 'Electrical',
          awardName: 'Gascapitol',
          awardType: 'Certificate',
          points: 50,
          date: '2026-08-22',
          reason: 'Outstanding performance in electrical engineering',
          status: 'Approved',
          approvedBy: 'HR Manager',
          avatar: 'HI'
        },
        {
          id: 2,
          employeeName: 'Jonathan Ibrahim Sheikh',
          employeeId: 'EMP002',
          department: 'Production',
          awardName: 'Coby Beach',
          awardType: 'Monetary',
          points: 75,
          date: '2026-11-30',
          reason: 'Excellent production efficiency improvement',
          status: 'Approved',
          approvedBy: 'Production Manager',
          avatar: 'JI'
        },
        {
          id: 3,
          employeeName: 'Maisha Lucy Zamora Gon',
          employeeId: 'EMP003',
          department: 'Software',
          awardName: 'Best Employee',
          awardType: 'Certificate',
          points: 100,
          date: '2026-08-22',
          reason: 'Employee of the month - August 2026',
          status: 'Approved',
          approvedBy: 'CEO',
          avatar: 'ML'
        },
        {
          id: 4,
          employeeName: 'Robert Brown',
          employeeId: 'EMP005',
          department: 'Software',
          awardName: 'Innovation Award',
          awardType: 'Monetary',
          points: 80,
          date: '2026-12-15',
          reason: 'Innovative solution for project optimization',
          status: 'Pending',
          approvedBy: null,
          avatar: 'RB'
        },
        {
          id: 5,
          employeeName: 'Emily Davis',
          employeeId: 'EMP006',
          department: 'HR',
          awardName: 'Team Player',
          awardType: 'Certificate',
          points: 60,
          date: '2026-12-20',
          reason: 'Excellent team collaboration and leadership',
          status: 'Pending',
          approvedBy: null,
          avatar: 'ED'
        }
      ];

      setEmployees(mockEmployees);
      setAwards(mockAwards);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAward = async (awardData) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newAward = {
        ...awardData,
        id: awards.length + 1,
        status: 'Pending',
        approvedBy: null,
        avatar: awardData.employeeName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
      };
      
      setAwards([newAward, ...awards]);
      
      // Update employee points
      const employee = employees.find(e => e.name === awardData.employeeName);
      if (employee) {
        const updatedEmployees = employees.map(emp => 
          emp.id === employee.id 
            ? { ...emp, points: emp.points + (awardData.points || 0) }
            : emp
        );
        setEmployees(updatedEmployees);
      }
      
      setShowForm(false);
      setSuccess('Award given successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to give award. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAward = async (awardData) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedAwards = awards.map(award => 
        award.id === awardData.id ? { ...award, ...awardData } : award
      );
      
      setAwards(updatedAwards);
      setShowForm(false);
      setEditingAward(null);
      setSuccess('Award updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to update award. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditAward = (award) => {
    setEditingAward(award);
    setShowForm(true);
  };

  const handleDeleteAward = async (id) => {
    if (window.confirm('Are you sure you want to delete this award?')) {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const awardToDelete = awards.find(a => a.id === id);
        setAwards(awards.filter(award => award.id !== id));
        
        // Remove points from employee
        if (awardToDelete) {
          const employee = employees.find(e => e.name === awardToDelete.employeeName);
          if (employee) {
            const updatedEmployees = employees.map(emp => 
              emp.id === employee.id 
                ? { ...emp, points: Math.max(0, emp.points - (awardToDelete.points || 0)) }
                : emp
            );
            setEmployees(updatedEmployees);
          }
        }
        
        setSuccess('Award deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        setError('Failed to delete award. Please try again.');
      }
    }
  };

  const handleApproveAward = async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedAwards = awards.map(award => 
        award.id === id ? { 
          ...award, 
          status: 'Approved',
          approvedBy: 'Current User',
          approvedDate: new Date().toISOString().split('T')[0]
        } : award
      );
      
      setAwards(updatedAwards);
      setSuccess('Award approved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to approve award. Please try again.');
    }
  };

  const handleRejectAward = async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedAwards = awards.map(award => 
        award.id === id ? { 
          ...award, 
          status: 'Rejected',
          approvedBy: 'Current User'
        } : award
      );
      
      setAwards(updatedAwards);
      setSuccess('Award rejected successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to reject award. Please try again.');
    }
  };

  const handleExport = () => {
    console.log('Exporting awards data...');
    setSuccess('Awards data exported successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const filteredAwards = awards.filter(award => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      award.employeeName.toLowerCase().includes(searchLower) ||
      award.department.toLowerCase().includes(searchLower) ||
      award.awardName.toLowerCase().includes(searchLower) ||
      award.reason.toLowerCase().includes(searchLower);
    
    const matchesFilter = filter === 'all' || award.status.toLowerCase() === filter;
    
    return matchesSearch && matchesFilter;
  });

  // Statistics
  const totalAwards = awards.length;
  const approvedAwards = awards.filter(a => a.status === 'Approved').length;
  const pendingAwards = awards.filter(a => a.status === 'Pending').length;
  const totalPoints = employees.reduce((sum, emp) => sum + emp.points, 0);
  const avgPoints = employees.length > 0 ? Math.round(totalPoints / employees.length) : 0;

  // Top employees by points
  const topEmployees = [...employees].sort((a, b) => b.points - a.points).slice(0, 3);

  return (
    <div className="rewards-page">
      <Container fluid>
        {/* Header Section */}
        <div className="rewards-header">
          <div className="header-left">
            <h2 className="page-title">Reward Points Management</h2>
            <p className="page-subtitle">Manage employee awards and reward points</p>
          </div>
          <div className="header-right">
            <Button 
              variant="primary" 
              className="me-2"
              onClick={() => {
                setEditingAward(null);
                setShowForm(true);
              }}
            >
              <FaPlus className="me-1" /> Give Award
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
                    <FaTrophy className="stat-icon" />
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">{totalAwards}</h3>
                    <p className="stat-label">Total Awards</p>
                    <small className="stat-detail">Given to employees</small>
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
                    <h3 className="stat-number">{approvedAwards}</h3>
                    <p className="stat-label">Approved</p>
                    <small className="stat-detail">Active awards</small>
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
                    <FaClock className="stat-icon" />
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">{pendingAwards}</h3>
                    <p className="stat-label">Pending</p>
                    <small className="stat-detail">Awaiting approval</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={3} md={6} className="mb-3">
            <Card className="stat-card points-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon-wrapper info">
                    <FaStar className="stat-icon" />
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">{totalPoints}</h3>
                    <p className="stat-label">Total Points</p>
                    <small className="stat-detail">Avg: {avgPoints} per employee</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Top Performers */}
        <Row className="mb-4">
          <Col xs={12}>
            <Card className="top-performers-card">
              <Card.Header>
                <h5 className="mb-0">
                  <FaCrown className="me-2 text-warning" />
                  Top Performers
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  {topEmployees.map((employee, index) => (
                    <Col key={employee.id} md={4} className="mb-3">
                      <div className="performer-card">
                        <div className="performer-rank">
                          {index === 0 && <FaCrown className="gold" />}
                          {index === 1 && <FaMedal className="silver" />}
                          {index === 2 && <FaMedal className="bronze" />}
                          <span className="rank-number">#{index + 1}</span>
                        </div>
                        <div className="performer-avatar">
                          {employee.avatar || employee.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="performer-info">
                          <h6 className="performer-name">{employee.name}</h6>
                          <p className="performer-department">{employee.department}</p>
                        </div>
                        <div className="performer-points">
                          <FaStar className="points-icon" />
                          <span className="points-value">{employee.points}</span>
                          <span className="points-label">pts</span>
                        </div>
                        <ProgressBar 
                          now={(employee.points / 200) * 100} 
                          variant={index === 0 ? 'warning' : index === 1 ? 'info' : 'success'}
                          className="performer-progress"
                          style={{ height: '4px' }}
                        />
                      </div>
                    </Col>
                  ))}
                </Row>
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

        {/* Award List */}
        <Card className="rewards-main-card">
          <Card.Body>
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-muted">Loading awards...</p>
              </div>
            ) : (
              <AwardList 
                awards={filteredAwards}
                onEdit={handleEditAward}
                onDelete={handleDeleteAward}
                onApprove={handleApproveAward}
                onReject={handleRejectAward}
                setShowForm={setShowForm}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filter={filter}
                setFilter={setFilter}
              />
            )}
          </Card.Body>
        </Card>

        {/* Award Form Modal */}
        <Modal 
          show={showForm} 
          onHide={() => {
            setShowForm(false);
            setEditingAward(null);
          }}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <FaGift className="me-2" />
              {editingAward ? 'Edit Award' : 'Give New Award'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AwardForm 
              award={editingAward}
              employees={employees}
              onSubmit={editingAward ? handleUpdateAward : handleAddAward}
              onCancel={() => {
                setShowForm(false);
                setEditingAward(null);
              }}
            />
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};

export default RewardPoints;
