import React from 'react';
import { Row, Col, Button, Table, Badge, Card } from 'react-bootstrap';
import {
  FaDownload, FaPrint, FaEnvelope, FaTimes,
  FaCheck, FaClock
} from 'react-icons/fa';
import './PayslipViewer.css';

const PayslipViewer = ({
  payslip,
  onDownload,
  onPrint,
  onSendEmail,
  onClose,
  formatCurrency
}) => {
  if (!payslip) return null;

  const getStatusBadge = (status) => {
    const config = {
      Generated: { variant: 'success', icon: <FaCheck /> },
      Pending: { variant: 'warning', icon: <FaClock /> }
    };
    const { variant, icon } = config[status] || config.Pending;
    return (
      <Badge bg={variant} className="status-badge-viewer">
        {icon} {status}
      </Badge>
    );
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const allowances = payslip.allowances || {
    housing: payslip.allowance || 0,
    transport: 0,
    medical: 0,
    other: 0
  };

  const bonuses = payslip.bonuses || {
    performance: payslip.bonus || 0,
    holiday: 0,
    other: 0
  };

  const deductions = payslip.deductions || {
    tax: payslip.deductions || 0,
    insurance: 0,
    pension: 0,
    loan: 0,
    other: 0
  };

  const allowanceTotal = Object.values(allowances).reduce((s, v) => s + (v || 0), 0);
  const bonusTotal = Object.values(bonuses).reduce((s, v) => s + (v || 0), 0);
  const deductionTotal = Object.values(deductions).reduce((s, v) => s + (v || 0), 0);
  const gross = (payslip.basicSalary || 0) + allowanceTotal + bonusTotal;
  const net = gross - deductionTotal;

  return (
    <div className="payslip-viewer">
      {/* Header */}
      <div className="viewer-header">
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
      <div className="employee-details-box">
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
      <Card className="salary-details-card">
        <Card.Header>
          <h6 className="mb-0">Salary Details</h6>
        </Card.Header>
        <Card.Body className="p-0">
          <Table bordered className="salary-table mb-0">
            <tbody>
              <tr>
                <td className="label-cell">Basic Salary</td>
                <td className="value-cell">{formatCurrency(payslip.basicSalary)}</td>
              </tr>

              {allowanceTotal > 0 && (
                <tr>
                  <td className="label-cell">Allowances</td>
                  <td className="value-cell">{formatCurrency(allowanceTotal)}</td>
                </tr>
              )}

              {bonusTotal > 0 && (
                <tr>
                  <td className="label-cell">Bonuses</td>
                  <td className="value-cell">{formatCurrency(bonusTotal)}</td>
                </tr>
              )}

              <tr className="total-row">
                <td className="label-cell">Gross Salary</td>
                <td className="value-cell">{formatCurrency(gross)}</td>
              </tr>

              <tr>
                <td className="label-cell">Deductions</td>
                <td className="value-cell text-danger">-{formatCurrency(deductionTotal)}</td>
              </tr>

              <tr className="net-salary-row">
                <td className="label-cell"><strong>Net Salary</strong></td>
                <td className="value-cell"><strong>{formatCurrency(net)}</strong></td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Additional Info */}
      <Row className="additional-details">
        <Col md={6}>
          <div className="detail-section">
            <h6>Attendance</h6>
            <div className="detail-row">
              <span className="detail-label">Working Days:</span>
              <span className="detail-value">{payslip.attendance?.workingDays || 22}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Present Days:</span>
              <span className="detail-value">{payslip.attendance?.presentDays || 22}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Leave Days:</span>
              <span className="detail-value">{payslip.attendance?.leaveDays || 0}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Overtime:</span>
              <span className="detail-value">{payslip.attendance?.overtime || 0} hours</span>
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
              <span className="detail-label">Account No:</span>
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
      <div className="viewer-footer">
        <p className="text-muted text-center mb-0">
          This is a computer-generated payslip. No signature required.
        </p>
      </div>

      {/* Actions */}
      <div className="viewer-actions">
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