import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Alert, Spinner } from 'react-bootstrap';
import {
  FaPlus,
  FaDownload,
  FaMoneyBillWave,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaWallet,
  FaCreditCard,
  FaHands
} from 'react-icons/fa';
import LoanList from './LoanList';
import LoanApplication from './LoanApplication';
import LoanDetails from './LoanDetails';
import './Loan.css';

const Loan = () => {
  const [loading, setLoading] = useState(false);
  const [loans, setLoans] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [editingLoan, setEditingLoan] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      setLoans([
        {
          id: 1,
          employeeName: 'John Doe',
          employeeId: 'EMP001',
          department: 'Software',
          position: 'Senior Developer',
          loanType: 'Personal',
          amount: 5000,
          interestRate: 8.5,
          tenure: 12,
          monthlyPayment: 436.25,
          totalPayment: 5235,
          totalInterest: 235,
          status: 'Approved',
          appliedDate: '2026-01-10',
          approvedDate: '2026-01-12',
          reason: 'Home renovation',
          bankName: 'ABC Bank',
          accountNumber: '1234567890',
          avatar: 'JD',
          payments: [
            { paymentDate: '2026-02-01', amount: 436.25, status: 'Paid' },
            { paymentDate: '2026-03-01', amount: 436.25, status: 'Paid' }
          ]
        },
        {
          id: 2,
          employeeName: 'Jane Smith',
          employeeId: 'EMP002',
          department: 'Marketing',
          position: 'Marketing Manager',
          loanType: 'Car',
          amount: 15000,
          interestRate: 7.5,
          tenure: 24,
          monthlyPayment: 674.55,
          totalPayment: 16189.20,
          totalInterest: 1189.20,
          status: 'Pending',
          appliedDate: '2026-01-15',
          approvedDate: null,
          reason: 'New car purchase',
          bankName: 'XYZ Bank',
          accountNumber: '0987654321',
          avatar: 'JS',
          payments: []
        },
        {
          id: 3,
          employeeName: 'Mike Johnson',
          employeeId: 'EMP003',
          department: 'Electrical',
          position: 'Electrical Engineer',
          loanType: 'Education',
          amount: 8000,
          interestRate: 6.0,
          tenure: 18,
          monthlyPayment: 465.23,
          totalPayment: 8374.14,
          totalInterest: 374.14,
          status: 'Approved',
          appliedDate: '2026-01-08',
          approvedDate: '2026-01-10',
          reason: 'MBA program',
          bankName: 'ABC Bank',
          accountNumber: '5678901234',
          avatar: 'MJ',
          payments: []
        },
        {
          id: 4,
          employeeName: 'Sarah Williams',
          employeeId: 'EMP004',
          department: 'Production',
          position: 'Production Supervisor',
          loanType: 'Emergency',
          amount: 3000,
          interestRate: 10.0,
          tenure: 6,
          monthlyPayment: 515.27,
          totalPayment: 3091.62,
          totalInterest: 91.62,
          status: 'Rejected',
          appliedDate: '2026-01-14',
          approvedDate: '2026-01-15',
          reason: 'Medical emergency',
          bankName: 'XYZ Bank',
          accountNumber: '4321098765',
          avatar: 'SW',
          payments: []
        },
        {
          id: 5,
          employeeName: 'Robert Brown',
          employeeId: 'EMP005',
          department: 'Software',
          position: 'Frontend Developer',
          loanType: 'Home',
          amount: 25000,
          interestRate: 6.5,
          tenure: 36,
          monthlyPayment: 766.48,
          totalPayment: 27593.28,
          totalInterest: 2593.28,
          status: 'Pending',
          appliedDate: '2026-01-18',
          approvedDate: null,
          reason: 'House down payment',
          bankName: 'ABC Bank',
          accountNumber: '7890123456',
          avatar: 'RB',
          payments: []
        },
        {
          id: 6,
          employeeName: 'Emily Davis',
          employeeId: 'EMP006',
          department: 'HR',
          position: 'HR Coordinator',
          loanType: 'Personal',
          amount: 4500,
          interestRate: 9.0,
          tenure: 12,
          monthlyPayment: 393.58,
          totalPayment: 4722.96,
          totalInterest: 222.96,
          status: 'Approved',
          appliedDate: '2026-01-05',
          approvedDate: '2026-01-07',
          reason: 'Debt consolidation',
          bankName: 'ABC Bank',
          accountNumber: '9876543210',
          avatar: 'ED',
          payments: [
            { paymentDate: '2026-02-01', amount: 393.58, status: 'Paid' }
          ]
        }
      ]);
    } catch (err) {
      setError('Failed to load loan data.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLoan = (loanData) => {
    const newLoan = {
      ...loanData,
      id: loans.length + 1,
      status: 'Pending',
      appliedDate: new Date().toISOString().split('T')[0],
      approvedDate: null,
      avatar: loanData.employeeName.split(' ').map(n => n[0]).join(''),
      payments: []
    };
    setLoans([newLoan, ...loans]);
    setShowForm(false);
    setSuccess('Loan application submitted successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleUpdateLoan = (loanData) => {
    setLoans(loans.map(l => l.id === loanData.id ? { ...l, ...loanData } : l));
    setShowForm(false);
    setEditingLoan(null);
    setSuccess('Loan updated successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDeleteLoan = (id) => {
    if (window.confirm('Are you sure you want to delete this loan application?')) {
      setLoans(loans.filter(l => l.id !== id));
      setSuccess('Loan deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleApprove = (id) => {
    setLoans(loans.map(l =>
      l.id === id
        ? { ...l, status: 'Approved', approvedDate: new Date().toISOString().split('T')[0] }
        : l
    ));
    setSuccess('Loan approved successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleReject = (id) => {
    setLoans(loans.map(l =>
      l.id === id
        ? { ...l, status: 'Rejected', approvedDate: new Date().toISOString().split('T')[0] }
        : l
    ));
    setSuccess('Loan rejected.');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleView = (loan) => {
    setSelectedLoan(loan);
    setShowDetails(true);
  };

  const handleEdit = (loan) => {
    setEditingLoan(loan);
    setShowForm(true);
  };

  const handleExport = () => {
    setSuccess('Loan data exported successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  // Statistics
  const totalLoans = loans.length;
  const pendingLoans = loans.filter(l => l.status === 'Pending').length;
  const approvedLoans = loans.filter(l => l.status === 'Approved').length;
  const rejectedLoans = loans.filter(l => l.status === 'Rejected').length;
  const totalAmount = loans.reduce((sum, l) => sum + l.amount, 0);
  const avgAmount = totalLoans > 0 ? totalAmount / totalLoans : 0;
  const approvalRate = totalLoans > 0 ? Math.round((approvedLoans / totalLoans) * 100) : 0;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);

  return (
    <div className="loan-page">
      <Container fluid>
        {/* Header */}
        <div className="loan-header">
          <div className="header-left">
            <h2 className="page-title">Loan Management</h2>
            <p className="page-subtitle">
              Manage employee loan applications and approvals
            </p>
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
                    <small className="stat-detail">
                      {formatCurrency(totalAmount)} total
                    </small>
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

        {/* Secondary Stats */}
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
                    <p className="stat-label">Average Loan</p>
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
                    <h3 className="stat-number">{approvalRate}%</h3>
                    <p className="stat-label">Approval Rate</p>
                    <small className="stat-detail">
                      {approvedLoans} approved out of {totalLoans}
                    </small>
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

        {/* Loan List */}
        <Card className="loan-main-card">
          <Card.Body>
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-muted">Loading loans...</p>
              </div>
            ) : (
              <LoanList
                loans={loans}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDeleteLoan}
                onApprove={handleApprove}
                onReject={handleReject}
                formatCurrency={formatCurrency}
              />
            )}
          </Card.Body>
        </Card>

        {/* Application Form Modal */}
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

        {/* Loan Details Modal */}
        <Modal
          show={showDetails}
          onHide={() => setShowDetails(false)}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <FaMoneyBillWave className="me-2" /> Loan Details
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedLoan && (
              <LoanDetails
                loan={selectedLoan}
                onApprove={handleApprove}
                onReject={handleReject}
                onEdit={handleEdit}
                onClose={() => setShowDetails(false)}
                formatCurrency={formatCurrency}
              />
            )}
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};

export default Loan;