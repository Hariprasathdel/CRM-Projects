import React from 'react';
import { Row, Col, Button, Table, Badge, Card, ProgressBar } from 'react-bootstrap';
import {
  FaUser,
  FaBuilding,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaCheck,
  FaTimes,
  FaEdit,
  FaClock,
  FaFileInvoice,
  FaCreditCard,
  FaPercent,
  FaChartLine
} from 'react-icons/fa';
import './LoanDetails.css';

const LoanDetails = ({
  loan,
  onApprove,
  onReject,
  onEdit,
  onClose,
  formatCurrency
}) => {
  if (!loan) return null;

  const getStatusBadge = (status) => {
    const config = {
      Approved: { variant: 'success', icon: <FaCheck /> },
      Pending: { variant: 'warning', icon: <FaClock /> },
      Rejected: { variant: 'danger', icon: <FaTimes /> }
    };
    const { variant, icon } = config[status] || config.Pending;
    return (
      <Badge bg={variant} className="details-status-badge">
        {icon} {status}
      </Badge>
    );
  };

  const getLoanTypeBadge = (type) => {
    const config = {
      Personal: 'primary',
      Car: 'info',
      Home: 'success',
      Education: 'warning',
      Emergency: 'danger'
    };
    return (
      <Badge bg={config[type] || 'secondary'} className="details-type-badge">
        {type}
      </Badge>
    );
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate progress
  const paidAmount = (loan.payments || [])
    .filter((p) => p.status === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0);
  const progress = loan.totalPayment
    ? Math.round((paidAmount / loan.totalPayment) * 100)
    : 0;

  return (
    <div className="loan-details-wrapper">
      {/* Header */}
      <div className="details-header">
        <div className="details-avatar">
          {loan.avatar || loan.employeeName.split(' ').map((n) => n[0]).join('')}
        </div>
        <div className="details-title">
          <h4>{loan.employeeName}</h4>
          <div className="details-meta">
            <span>
              <FaUser className="me-1" /> {loan.employeeId}
            </span>
            <span className="meta-divider">|</span>
            <span>
              <FaBuilding className="me-1" /> {loan.department}
            </span>
            <span className="meta-divider">|</span>
            <span>{loan.position}</span>
          </div>
          <div className="details-badges">
            {getStatusBadge(loan.status)}
            {getLoanTypeBadge(loan.loanType)}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="details-actions">
        {loan.status === 'Pending' && (
          <>
            <Button variant="success" size="sm" onClick={() => onApprove(loan.id)}>
              <FaCheck className="me-1" /> Approve
            </Button>
            <Button variant="danger" size="sm" onClick={() => onReject(loan.id)}>
              <FaTimes className="me-1" /> Reject
            </Button>
          </>
        )}
        <Button variant="outline-primary" size="sm" onClick={() => onEdit(loan)}>
          <FaEdit className="me-1" /> Edit
        </Button>
        <Button variant="outline-secondary" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>

      {/* Main Content */}
      <Row className="details-content">
        <Col lg={7} md={12}>
          <Card className="details-card">
            <Card.Header className="details-card-header">
              <h6 className="mb-0">
                <FaFileInvoice className="me-2" /> Loan Information
              </h6>
            </Card.Header>
            <Card.Body>
              <Table borderless className="details-table">
                <tbody>
                  <tr>
                    <td className="label-cell">
                      <FaMoneyBillWave className="me-2" /> Loan Amount
                    </td>
                    <td className="value-cell">
                      <strong>{formatCurrency(loan.amount)}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td className="label-cell">
                      <FaPercent className="me-2" /> Interest Rate
                    </td>
                    <td className="value-cell">{loan.interestRate}%</td>
                  </tr>
                  <tr>
                    <td className="label-cell">
                      <FaClock className="me-2" /> Tenure
                    </td>
                    <td className="value-cell">{loan.tenure} months</td>
                  </tr>
                  <tr>
                    <td className="label-cell">
                      <FaCreditCard className="me-2" /> Monthly Payment
                    </td>
                    <td className="value-cell">
                      <strong>{formatCurrency(loan.monthlyPayment)}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td className="label-cell">
                      <FaChartLine className="me-2" /> Total Payment
                    </td>
                    <td className="value-cell">
                      {formatCurrency(loan.totalPayment)}
                    </td>
                  </tr>
                  <tr>
                    <td className="label-cell">Total Interest</td>
                    <td className="value-cell text-warning">
                      {formatCurrency(loan.totalInterest)}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          {loan.reason && (
            <Card className="details-card">
              <Card.Header className="details-card-header">
                <h6 className="mb-0">Reason</h6>
              </Card.Header>
              <Card.Body>
                <p className="mb-0 reason-text">{loan.reason}</p>
              </Card.Body>
            </Card>
          )}
        </Col>

        <Col lg={5} md={12}>
          <Card className="details-card">
            <Card.Header className="details-card-header">
              <h6 className="mb-0">
                <FaCalendarAlt className="me-2" /> Timeline
              </h6>
            </Card.Header>
            <Card.Body>
              <Table borderless className="details-table">
                <tbody>
                  <tr>
                    <td className="label-cell">Applied Date</td>
                    <td className="value-cell">{formatDate(loan.appliedDate)}</td>
                  </tr>
                  <tr>
                    <td className="label-cell">Approved Date</td>
                    <td className="value-cell">{formatDate(loan.approvedDate)}</td>
                  </tr>
                  <tr>
                    <td className="label-cell">Bank</td>
                    <td className="value-cell">{loan.bankName || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="label-cell">Account No.</td>
                    <td className="value-cell">{loan.accountNumber || 'N/A'}</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          {loan.status === 'Approved' && (
            <Card className="details-card">
              <Card.Header className="details-card-header">
                <h6 className="mb-0">Repayment Progress</h6>
              </Card.Header>
              <Card.Body>
                <div className="progress-wrapper">
                  <div className="progress-info">
                    <span className="progress-label">Paid</span>
                    <span className="progress-value">
                      {formatCurrency(paidAmount)} / {formatCurrency(loan.totalPayment)}
                    </span>
                  </div>
                  <ProgressBar
                    now={progress}
                    variant="success"
                    className="loan-progress-bar"
                    label={`${progress}%`}
                  />
                  <div className="progress-payments">
                    {(loan.payments || []).length > 0 ? (
                      loan.payments.slice(0, 3).map((p, i) => (
                        <div key={i} className="payment-item">
                          <span>{formatDate(p.paymentDate)}</span>
                          <span className="payment-amount">
                            {formatCurrency(p.amount)}
                          </span>
                          <Badge
                            bg={p.status === 'Paid' ? 'success' : 'warning'}
                            className="payment-status"
                          >
                            {p.status}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted mb-0 text-center small">
                        No payments yet
                      </p>
                    )}
                  </div>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default LoanDetails;