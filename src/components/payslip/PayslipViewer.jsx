import React from 'react';
import { Card, Row, Col, Button, Table, Badge } from 'react-bootstrap';
import { FaDownload, FaPrint, FaEnvelope, FaTimes, FaCheck, FaClock } from 'react-icons/fa';
import './PayslipViewer.css';

const PayslipViewer = ({ payslip, onDownload, onPrint, onSendEmail, onClose, formatCurrency }) => {
  if (!payslip) return null;

  const getStatusBadge = (status) => {
    const config = {
      Generated: { variant: 'success', icon: <FaCheck /> },
      Pending: { variant: 'warning', icon: <FaClock /> }
    };
    const { variant, icon } = config[status] || config.Pending;
    return (
      <Badge bg={variant} className="status-badge-large">
        {icon} {status}
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

  return (
    <div className="payslip-viewer">
      {/* Header */}
      <div className="payslip-viewer-header">
        <div className="company-info">
          <h4>Employee Management System</h4>
          <p>123 Business Street, City, State 12345</p>
          <p>Phone: (555) 123-4567 | Email: hr@company.com</p>
        </div>
        <div className="payslip-title">
          <h3>PAYSLIP</h3>
          <p>{payslip.month} {payslip.year}</p>
        </div>
      </div>

      {/* Employee Details */}
      <div className="payslip-employee-details">
        <Row>
          <Col md={6}>
            <div className="detail-row">
              <span className="detail-label">Employee Name:</span>
              <span className="detail-value">{payslip.employeeName}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Employee ID:</span>
              <span className="detail-value">{payslip.employeeId}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Department:</span>
              <span className="detail-value">{payslip.department}</span>
            </div>
          </Col>
          <Col md={6}>
            <div className="detail-row">
              <span className="detail-label">Position:</span>
              <span className="detail-value">{payslip.position}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Pay Date:</span>
              <span className="detail-value">{formatDate(payslip.payDate)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Status:</span>
              <span className="detail-value">{getStatusBadge(payslip.status)}</span>
            </div>
          </Col>
        </Row>
      </div>

      {/* Salary Details */}
      <Card className="payslip-salary-card">
        <Card.Header>
          <h6 className="mb-0">Salary Details</h6>
        </Card.Header>
        <Card.Body>
          <Table bordered className="payslip-table-details">
            <tbody>
              <tr>
                <td className="label-cell">Basic Salary</td>
                <td className="value-cell">{formatCurrency(payslip.basicSalary)}</td>
              </tr>
              <tr>
                <td className="label-cell">Allowance</td>
                <td className="value-cell">{formatCurrency(payslip.allowance)}</td>
              </tr>
              <tr>
                <td className="label-cell">Bonus</td>
                <td className="value-cell">{formatCurrency(payslip.bonus)}</td>
              </tr>
              <tr className="total-row">
                <td className="label-cell">Gross Salary</td>
                <td className="value-cell">
                  {formatCurrency((payslip.basicSalary || 0) + (payslip.allowance || 0) + (payslip.bonus || 0))}
                </td>
              </tr>
              <tr>
                <td className="label-cell">Deductions</td>
                <td className="value-cell text-danger">-{formatCurrency(payslip.deductions)}</td>
              </tr>
              <tr className="net-salary-row">
                <td className="label-cell"><strong>Net Salary</strong></td>
                <td className="value-cell"><strong>{formatCurrency(payslip.netSalary)}</strong></td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Additional Details */}
      <Row className="payslip-additional-details">
        <Col md={6}>
          <div className="detail-section">
            <h6>Attendance</h6>
            <div className="detail-row">
              <span className="detail-label">Working Days:</span>
              <span className="detail-value">{payslip.attendance}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Leave Taken:</span>
              <span className="detail-value">{payslip.leaveTaken}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Overtime:</span>
              <span className="detail-value">{payslip.overtime} hours</span>
            </div>
          </div>
        </Col>
        <Col md={6}>
          <div className="detail-section">
            <h6>Bank Details</h6>
            <div className="detail-row">
              <span className="detail-label">Bank:</span>
              <span className="detail-value">{payslip.bankName}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Account Number:</span>
              <span className="detail-value">{payslip.accountNumber}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Generated:</span>
              <span className="detail-value">{formatDate(payslip.generatedDate)}</span>
            </div>
          </div>
        </Col>
      </Row>

      {/* Footer */}
      <div className="payslip-viewer-footer">
        <p className="text-muted text-center">This is a computer-generated payslip. No signature required.</p>
      </div>

      {/* Actions */}
      <div className="payslip-viewer-actions">
        {payslip.status === 'Generated' && (
          <>
            <Button variant="success" onClick={onDownload}>
              <FaDownload className="me-1" /> Download
            </Button>
            <Button variant="info" onClick={onPrint}>
              <FaPrint className="me-1" /> Print
            </Button>
            <Button variant="primary" onClick={onSendEmail}>
              <FaEnvelope className="me-1" /> Send Email
            </Button>
          </>
        )}
        <Button variant="secondary" onClick={onClose}>
          <FaTimes className="me-1" /> Close
        </Button>
      </div>
    </div>
  );
};

export default PayslipViewer;