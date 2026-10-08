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
import loanService from '../../services/loanService';
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

  const normalizeLoan = (item) => {
    const rawStatus = (item.status || 'pending').toLowerCase();
    const displayStatus = rawStatus === 'active' || rawStatus === 'approved' ? 'Approved' :
                          rawStatus === 'paid' ? 'Paid' :
                          rawStatus === 'rejected' ? 'Rejected' : 'Pending';

    return {
      id: item._id || item.id,
      _id: item._id || item.id,
      employeeName: item.employeeId?.name || item.employeeName || 'Employee',
      employeeId: item.employeeId?.employeeCode || (typeof item.employeeId === 'object' ? `EMP-${String(item.employeeId._id).slice(-4).toUpperCase()}` : item.employeeId || 'EMP001'),
      employeeMongoId: item.employeeId?._id || item.employeeId,
      department: item.employeeId?.department || item.department || 'General',
      position: item.employeeId?.position || item.position || 'Staff',
      loanType: item.loanType || item.purpose || 'Personal',
      amount: item.amount || 5000,
      interestRate: item.interestRate || 8.0,
      tenure: item.tenure || 12,
      monthlyPayment: item.monthlyInstallment || item.monthlyPayment || 400,
      totalPayment: item.totalRepayment || item.totalPayment || (item.amount ? item.amount * 1.08 : 5400),
      totalInterest: item.totalInterest || (item.amount ? item.amount * 0.08 : 400),
      status: displayStatus,
      appliedDate: item.startDate ? item.startDate.split('T')[0] : (item.createdAt ? item.createdAt.split('T')[0] : '2026-01-10'),
      approvedDate: item.approvedAt ? item.approvedAt.split('T')[0] : (displayStatus === 'Approved' ? '2026-01-12' : null),
      reason: item.purpose || item.reason || 'General expenses',
      bankName: item.bankName || 'Corporate Bank',
      accountNumber: item.accountNumber || '**** **** 1234',
      avatar: (item.employeeId?.name || item.employeeName || 'EM').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
      payments: Array.isArray(item.paymentHistory) ? item.paymentHistory : []
    };
  };

  const fetchLoans = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await loanService.getAllLoans({ limit: 100 });
      if (res.success && res.data) {
        const list = Array.isArray(res.data) ? res.data : (res.data.data || []);
        if (list.length > 0) {
          setLoans(list.map(normalizeLoan));
          return;
        }
      }
      setLoans([]);
    } catch (err) {
      console.error('Error fetching loans:', err);
      setError('Failed to load loans from database.');
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
