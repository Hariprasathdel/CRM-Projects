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
  Badge
} from 'react-bootstrap';
import { 
  FaPlus, 
  FaDownload, 
  FaMoneyBillWave, 
  FaHands,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaChartBar,
  FaWallet,
  FaCreditCard
} from 'react-icons/fa';
import LoanList from './LoanList';
import LoanApplication from './LoanApplication';
import LoanDetails from './LoanDetails';
import './Loan.css';

const Loan = () => {
  const [loading, setLoading] = useState(false);
  const [loans, setLoans] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showApplication, setShowApplication] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [editingLoan, setEditingLoan] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  // Mock data - In real app, this would come from API
  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockLoans = [
        {
          id: 1,
          employeeName: 'John Doe',
          employeeId: 'EMP001',
          department: 'Software',
          loanType: 'Personal',
          amount: 5000,
          interestRate: 8.5,
          tenure: 12,
          monthlyPayment: 436.25,
          status: 'Approved',
          appliedDate: '2026-01-10',
          approvedDate: '2026-01-12',
          reason: 'Home renovation',
          avatar: 'JD'
        },
        {
          id: 2,
          employeeName: 'Jane Smith',
          employeeId: 'EMP002',
          department: 'Marketing',
          loanType: 'Car',
          amount: 15000,
          interestRate: 7.5,
          tenure: 24,
          monthlyPayment: 674.55,
          status: 'Pending',
          appliedDate: '2026-01-15',
          approvedDate: null,
          reason: 'New car purchase',
          avatar: 'JS'
        },
        {
          id: 3,
          employeeName: 'Mike Johnson',
          employeeId: 'EMP003',
          department: 'Electrical',
          loanType: 'Education',
          amount: 8000,
          interestRate: 6.0,
          tenure: 18,
          monthlyPayment: 465.23,
          status: 'Approved',
          appliedDate: '2026-01-08',
          approvedDate: '2026-01-10',
          reason: 'MBA program',
          avatar: 'MJ'
        },
        {
          id: 4,
          employeeName: 'Sarah Williams',
          employeeId: 'EMP004',
          department: 'Production',
          loanType: 'Emergency',
          amount: 3000,
          interestRate: 10.0,
          tenure: 6,
          monthlyPayment: 515.27,
          status: 'Rejected',
          appliedDate: '2026-01-14',
          approvedDate: '2026-01-15',
          reason: 'Medical emergency',
          avatar: 'SW'
        },
        {
          id: 5,
          employeeName: 'Robert Brown',
          employeeId: 'EMP005',
          department: 'Software',
          loanType: 'Home',
          amount: 25000,
          interestRate: 6.5,
          tenure: 36,
          monthlyPayment: 766.48,
          status: 'Pending',
          appliedDate: '2026-01-18',
          approvedDate: null,
          reason: 'House down payment',
          avatar: 'RB'
        },
        {
          id: 6,
          employeeName: 'Emily Davis',
          employeeId: 'EMP006',
          department: 'HR',
          loanType: 'Personal',
          amount: 4500,
          interestRate: 9.0,
          tenure: 12,
          monthlyPayment: 393.58,
          status: 'Approved',
          appliedDate: '2026-01-05',
          approvedDate: '2026-01-07',
          reason: 'Debt consolidation',
          avatar: 'ED'
        }
      ];

      setLoans(mockLoans);
    } catch (error) {
      console.error('Error fetching loans:', error);
      setError('Failed to load loan applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLoan = async (loanData) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newLoan = {
        ...loanData,
        id: loans.length + 1,
        status: 'Pending',
        appliedDate: new Date().toISOString().split('T')[0],
        approvedDate: null,
        avatar: loanData.employeeName.split(' ').map(n => n[0]).join('')
      };
      
      setLoans([newLoan, ...loans]);
      setShowForm(false);
      setSuccess('Loan application submitted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to submit loan application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLoan = async (loanData) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedLoans = loans.map(loan => 
        loan.id === loanData.id ? { ...loan, ...loanData } : loan
      );
      
      setLoans(updatedLoans);
      setShowForm(false);
      setEditingLoan(null);
      setSuccess('Loan application updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to update loan application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLoan = async (id) => {
    if (window.confirm('Are you sure you want to delete this loan application?')) {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setLoans(loans.filter(loan => loan.id !== id));
        setShowApplication(false);
        setSelectedLoan(null);
        setSuccess('Loan application deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        setError('Failed to delete loan application. Please try again.');
      }
    }
  };

  const handleViewLoan = (loan) => {
    setSelectedLoan(loan);
    setShowApplication(true);
  };

  const handleEditLoan = (loan) => {
    setShowApplication(false);
    setEditingLoan(loan);
    setShowForm(true);
  };

  const handleApproveLoan = async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedLoans = loans.map(loan => 
        loan.id === id ? { 
          ...loan, 
          status: 'Approved',
          approvedDate: new Date().toISOString().split('T')[0]
        } : loan
      );
      
      setLoans(updatedLoans);
      setSelectedLoan(updatedLoans.find(loan => loan.id === id) || null);
      setSuccess('Loan application approved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to approve loan application. Please try again.');
    }
  };

  const handleRejectLoan = async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedLoans = loans.map(loan => 
        loan.id === id ? { 
          ...loan, 
          status: 'Rejected',
          approvedDate: new Date().toISOString().split('T')[0]
        } : loan
      );
      
      setLoans(updatedLoans);
      setSelectedLoan(updatedLoans.find(loan => loan.id === id) || null);
      setSuccess('Loan application rejected successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to reject loan application. Please try again.');
    }
  };

  const handleExport = () => {
    console.log('Exporting loan data...');
    setSuccess('Loan data exported successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const filteredLoans = loans.filter(loan => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      loan.employeeName.toLowerCase().includes(searchLower) ||
      loan.employeeId.toLowerCase().includes(searchLower) ||
      loan.department.toLowerCase().includes(searchLower) ||
      loan.loanType.toLowerCase().includes(searchLower) ||
      loan.reason.toLowerCase().includes(searchLower);
    
    const matchesFilter = filter === 'all' || loan.status.toLowerCase() === filter;
    
    return matchesSearch && matchesFilter;
  });

  // Statistics
  const totalLoans = loans.length;
  const pendingLoans = loans.filter(l => l.status === 'Pending').length;
  const approvedLoans = loans.filter(l => l.status === 'Approved').length;
  const rejectedLoans = loans.filter(l => l.status === 'Rejected').length;
  const totalAmount = loans.reduce((sum, loan) => sum + loan.amount, 0);
  const avgAmount = totalLoans > 0 ? totalAmount / totalLoans : 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="loan-page">
      <Container fluid>
        {/* Header Section */}
        <div className="loan-header">
          <div className="header-left">
            <h2 className="page-title">Loan Management</h2>
            <p className="page-subtitle">Manage employee loan applications and approvals</p>
          </div>
          <div className="header-right">
            <Button 
              variant="primary" 
              className="me-2"
              onClick={() => {
                setEditingLoan(null);
                setShowForm(true);
              }}
            >
              <FaPlus className="me-1" /> Apply Loan
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
                    <FaMoneyBillWave className="stat-icon" />
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">{totalLoans}</h3>
                    <p className="stat-label">Total Applications</p>
                    <small className="stat-detail">{formatCurrency(totalAmount)} total</small>
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
                    <h3 className="stat-number">{pendingLoans}</h3>
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
                    <h3 className="stat-number">{approvedLoans}</h3>
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
                    <h3 className="stat-number">{rejectedLoans}</h3>
                    <p className="stat-label">Rejected</p>
                    <small className="stat-detail">Declined requests</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Additional Statistics */}
        <Row className="statistics-cards mb-4">
          <Col lg={4} md={6} className="mb-3">
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon-wrapper info">
                    <FaWallet className="stat-icon" />
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">{formatCurrency(avgAmount)}</h3>
                    <p className="stat-label">Average Loan Amount</p>
                    <small className="stat-detail">Per application</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={4} md={6} className="mb-3">
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon-wrapper primary">
                    <FaCreditCard className="stat-icon" />
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">{formatCurrency(totalAmount)}</h3>
                    <p className="stat-label">Total Loan Amount</p>
                    <small className="stat-detail">All applications</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={4} md={12} className="mb-3">
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon-wrapper success">
                    <FaHands className="stat-icon" />
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">
                      {totalLoans > 0 ? Math.round((approvedLoans / totalLoans) * 100) : 0}%
                    </h3>
                    <p className="stat-label">Approval Rate</p>
                    <small className="stat-detail">{approvedLoans} approved out of {totalLoans}</small>
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

        {/* Loan List */}
        <Card className="loan-main-card">
          <Card.Body>
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-muted">Loading loan applications...</p>
              </div>
            ) : (
              <LoanList 
                loans={filteredLoans}
                onView={handleViewLoan}
                onEdit={handleEditLoan}
                onDelete={handleDeleteLoan}
                onApprove={handleApproveLoan}
                onReject={handleRejectLoan}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filter={filter}
                setFilter={setFilter}
              />
            )}
          </Card.Body>
        </Card>

        {/* Loan Application Form Modal */}
        <Modal 
          show={showForm} 
          onHide={() => {
            setShowForm(false);
            setEditingLoan(null);
          }}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <FaMoneyBillWave className="me-2" />
              {editingLoan ? 'Edit Loan Application' : 'Apply for Loan'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <LoanApplication 
              loan={editingLoan}
              onSubmit={editingLoan ? handleUpdateLoan : handleAddLoan}
              onCancel={() => {
                setShowForm(false);
                setEditingLoan(null);
              }}
            />
          </Modal.Body>
        </Modal>

        {/* Loan Application Detail Modal */}
        <Modal
          show={showApplication}
          onHide={() => {
            setShowApplication(false);
            setSelectedLoan(null);
          }}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title><FaMoneyBillWave className="me-2" />Loan Application Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <LoanDetails
              loan={selectedLoan}
              onApprove={handleApproveLoan}
              onReject={handleRejectLoan}
              onEdit={handleEditLoan}
              onDelete={handleDeleteLoan}
              onClose={() => {
                setShowApplication(false);
                setSelectedLoan(null);
              }}
            />
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};

export default Loan;
