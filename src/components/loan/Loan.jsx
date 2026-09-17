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
import loanService from '../../services/loanService';
import employeeService from '../../services/employeeService';
import './Loan.css';

const Loan = () => {
  const [loading, setLoading] = useState(false);
  const [loans, setLoans] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showApplication, setShowApplication] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [editingLoan, setEditingLoan] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchLoans();
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await employeeService.getAllEmployees();
      if (res.success && Array.isArray(res.data)) {
        setEmployees(res.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const res = await loanService.getAllLoans();
      if (res.success && Array.isArray(res.data)) {
        const mappedLoans = res.data.map(l => {
          const empName = l.employeeId?.name || l.employeeName || 'Employee';
          const tenureMonths = l.tenure || 12;
          const totalAmt = l.amount || 5000;
          const monthly = l.monthlyInstallment || Math.round(totalAmt / tenureMonths);
          const rawStatus = l.status || 'pending';
          const statusDisplay = (rawStatus === 'active' || rawStatus === 'paid' || rawStatus === 'Approved')
            ? 'Approved' 
            : (rawStatus === 'defaulted' || rawStatus === 'Rejected' ? 'Rejected' : 'Pending');

          return {
            id: l._id || l.id,
            _id: l._id || l.id,
            employeeName: empName,
            employeeId: l.employeeId?.employeeId || l.employeeId?._id || 'EMP',
            department: l.employeeId?.department || l.department || 'Software',
            loanType: l.loanType || 'Personal',
            amount: totalAmt,
            interestRate: l.interestRate || 8.5,
            tenure: tenureMonths,
            monthlyPayment: monthly,
            status: statusDisplay,
            appliedDate: l.startDate ? new Date(l.startDate).toISOString().split('T')[0] : (l.createdAt ? new Date(l.createdAt).toISOString().split('T')[0] : '2026-01-10'),
            approvedDate: statusDisplay === 'Approved' ? '2026-01-12' : null,
            reason: l.reason || 'Personal loan request',
            avatar: empName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
          };
        });
        setLoans(mappedLoans);
      } else {
        setError(res.error?.message || 'Failed to load loan applications');
      }
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
      const targetEmp = employees.find(e => e.name === loanData.employeeName) || employees[0];
      const payload = {
        employeeId: targetEmp?._id,
        amount: Number(loanData.amount) || 5000,
        interestRate: Number(loanData.interestRate) || 8.5,
        tenure: Number(loanData.tenure) || 12,
        status: 'pending',
        monthlyInstallment: Number(loanData.monthlyPayment) || Math.round((Number(loanData.amount) || 5000) / (Number(loanData.tenure) || 12)),
        reason: loanData.reason || 'Personal loan request'
      };

      const res = await loanService.createLoan(payload);
      if (res.success) {
        setShowForm(false);
        setSuccess('Loan application submitted successfully to MongoDB!');
        setTimeout(() => setSuccess(''), 3000);
        await fetchLoans();
      } else {
        setError(res.error?.message || 'Failed to submit loan application.');
      }
    } catch (error) {
      setError(error.message || 'Failed to submit loan application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLoan = async (loanData) => {
    setLoading(true);
    try {
      const loanId = loanData._id || loanData.id;
      const payload = {
        amount: Number(loanData.amount),
        interestRate: Number(loanData.interestRate),
        tenure: Number(loanData.tenure),
        monthlyInstallment: Number(loanData.monthlyPayment),
        reason: loanData.reason
      };

      const res = await loanService.updateLoan(loanId, payload);
      if (res.success) {
        setShowForm(false);
        setEditingLoan(null);
        setSuccess('Loan application updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
        await fetchLoans();
      } else {
        setError(res.error?.message || 'Failed to update loan application.');
      }
    } catch (error) {
      setError(error.message || 'Failed to update loan application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLoan = async (id) => {
    if (window.confirm('Are you sure you want to delete this loan application from MongoDB?')) {
      try {
        const res = await loanService.deleteLoan(id);
        if (res.success) {
          setShowApplication(false);
          setSelectedLoan(null);
          setSuccess('Loan application deleted successfully!');
          setTimeout(() => setSuccess(''), 3000);
          setLoans(loans.filter(l => (l._id || l.id) !== id));
        } else {
          setError(res.error?.message || 'Failed to delete loan application.');
        }
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
      const res = await loanService.updateLoan(id, { status: 'active' });
      if (res.success) {
        setSuccess('Loan application approved successfully!');
        setTimeout(() => setSuccess(''), 3000);
        await fetchLoans();
        if (selectedLoan && (selectedLoan._id || selectedLoan.id) === id) {
          setSelectedLoan(prev => ({ ...prev, status: 'Approved' }));
        }
      } else {
        setError(res.error?.message || 'Failed to approve loan');
      }
    } catch (error) {
      setError('Failed to approve loan application. Please try again.');
    }
  };

  const handleRejectLoan = async (id) => {
    try {
      const res = await loanService.updateLoan(id, { status: 'defaulted' });
      if (res.success) {
        setSuccess('Loan application rejected successfully!');
        setTimeout(() => setSuccess(''), 3000);
        await fetchLoans();
        if (selectedLoan && (selectedLoan._id || selectedLoan.id) === id) {
          setSelectedLoan(prev => ({ ...prev, status: 'Rejected' }));
        }
      } else {
        setError(res.error?.message || 'Failed to reject loan');
      }
    } catch (error) {
      setError('Failed to reject loan application. Please try again.');
    }
  };

  const handleExport = () => {
    if (loans.length === 0) {
      setError('No loans to export');
      return;
    }
    const lines = [
      `"Employee","Amount","Tenure","Monthly","Status","Applied Date"`,
      ...loans.map(l => `"${l.employeeName}","$${l.amount}","${l.tenure} mos","$${l.monthlyPayment}","${l.status}","${l.appliedDate}"`)
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `loans_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
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
