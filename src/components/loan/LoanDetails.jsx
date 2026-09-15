import React from 'react';
import { Badge, Button, Card, Col, ListGroup, Row } from 'react-bootstrap';
import {
  FaBuilding,
  FaCheck,
  FaClock,
  FaEdit,
  FaFileAlt,
  FaMoneyBillWave,
  FaTimes,
  FaTrash,
  FaUser
} from 'react-icons/fa';
import './LoanDetails.css';

const LoanDetails = ({ loan, onApprove, onReject, onEdit, onDelete, onClose }) => {
  if (!loan) return null;

  const formatCurrency = (amount) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount || 0);

  const formatDate = (date) => date ? new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  }) : 'Not available';

  const statusVariant = { Approved: 'success', Pending: 'warning', Rejected: 'danger' };
  const statusIcon = loan.status === 'Approved' ? <FaCheck /> : loan.status === 'Rejected' ? <FaTimes /> : <FaClock />;

  return (
    <div className="loan-details">
      <div className="loan-details-header">
        <div className="loan-details-avatar">{loan.avatar || loan.employeeName.split(' ').map((name) => name[0]).join('')}</div>
        <div>
          <h4 className="mb-1">{loan.employeeName}</h4>
          <div className="text-muted small"><FaUser className="me-1" />#{loan.employeeId} <span className="mx-2">|</span><FaBuilding className="me-1" />{loan.department}</div>
          <div className="mt-2 d-flex gap-2">
            <Badge bg={statusVariant[loan.status] || 'secondary'} className="loan-details-badge">{statusIcon} {loan.status}</Badge>
            <Badge bg="primary" className="loan-details-badge">{loan.loanType}</Badge>
          </div>
        </div>
      </div>

      <div className="loan-details-actions">
        {loan.status === 'Pending' && <>
          <Button size="sm" variant="success" onClick={() => onApprove(loan.id)}><FaCheck className="me-1" />Approve</Button>
          <Button size="sm" variant="danger" onClick={() => onReject(loan.id)}><FaTimes className="me-1" />Reject</Button>
        </>}
        <Button size="sm" variant="outline-warning" onClick={() => onEdit(loan)}><FaEdit className="me-1" />Edit</Button>
        <Button size="sm" variant="outline-danger" onClick={() => onDelete(loan.id)}><FaTrash className="me-1" />Delete</Button>
        <Button size="sm" variant="outline-secondary" onClick={onClose}>Close</Button>
      </div>

      <Row className="g-3">
        <Col md={7}>
          <Card className="loan-details-card h-100">
            <Card.Header><FaFileAlt className="me-2" />Loan Details</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item><span>Loan amount</span><strong><FaMoneyBillWave className="text-success me-1" />{formatCurrency(loan.amount)}</strong></ListGroup.Item>
              <ListGroup.Item><span>Interest rate</span><strong>{loan.interestRate}%</strong></ListGroup.Item>
              <ListGroup.Item><span>Tenure</span><strong>{loan.tenure} months</strong></ListGroup.Item>
              <ListGroup.Item><span>Monthly payment</span><strong>{formatCurrency(loan.monthlyPayment)}</strong></ListGroup.Item>
              <ListGroup.Item><span>Purpose</span><strong>{loan.reason || 'Not provided'}</strong></ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
        <Col md={5}>
          <Card className="loan-details-card h-100">
            <Card.Header><FaClock className="me-2" />Application Status</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item><span>Status</span><Badge bg={statusVariant[loan.status] || 'secondary'}>{statusIcon} {loan.status}</Badge></ListGroup.Item>
              <ListGroup.Item><span>Applied on</span><strong>{formatDate(loan.appliedDate)}</strong></ListGroup.Item>
              <ListGroup.Item><span>{loan.status === 'Pending' ? 'Next step' : 'Processed on'}</span><strong>{loan.status === 'Pending' ? 'Awaiting approval' : formatDate(loan.approvedDate)}</strong></ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LoanDetails;
