import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Button, Alert, Spinner, Card } from 'react-bootstrap';
import {
  FaSave,
  FaTimes,
  FaUser,
  FaMoneyBillWave,
  FaClock,
  FaComment,
  FaBuilding,
  FaCalculator,
  FaPercent
} from 'react-icons/fa';
import './LoanApplication.css';

const LoanApplication = ({ loan, onSubmit, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    employeeName: '',
    employeeId: '',
    department: '',
    position: '',
    loanType: 'Personal',
    amount: '',
    interestRate: '',
    tenure: '',
    monthlyPayment: 0,
    totalPayment: 0,
    totalInterest: 0,
    reason: '',
    bankName: '',
    accountNumber: ''
  });

  const loanTypes = ['Personal', 'Car', 'Home', 'Education', 'Emergency'];

  const departments = [
    'Software',
    'Marketing',
    'Electrical',
    'Production',
    'HR',
    'Finance'
  ];

  const employees = [
    { id: 1, name: 'John Doe', department: 'Software', position: 'Senior Developer' },
    { id: 2, name: 'Jane Smith', department: 'Marketing', position: 'Marketing Manager' },
    { id: 3, name: 'Mike Johnson', department: 'Electrical', position: 'Electrical Engineer' },
    { id: 4, name: 'Sarah Williams', department: 'Production', position: 'Production Supervisor' },
    { id: 5, name: 'Robert Brown', department: 'Software', position: 'Frontend Developer' },
    { id: 6, name: 'Emily Davis', department: 'HR', position: 'HR Coordinator' }
  ];

  useEffect(() => {
    if (loan) {
      setFormData({
        id: loan.id,
        employeeName: loan.employeeName || '',
        employeeId: loan.employeeId || '',
        department: loan.department || '',
        position: loan.position || '',
        loanType: loan.loanType || 'Personal',
        amount: loan.amount || '',
        interestRate: loan.interestRate || '',
        tenure: loan.tenure || '',
        monthlyPayment: loan.monthlyPayment || 0,
        totalPayment: loan.totalPayment || 0,
        totalInterest: loan.totalInterest || 0,
        reason: loan.reason || '',
        bankName: loan.bankName || '',
        accountNumber: loan.accountNumber || ''
      });
    }
  }, [loan]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Auto-fill employee details
    if (name === 'employeeName') {
      const emp = employees.find((x) => x.name === value);
      if (emp) {
        setFormData((prev) => ({
          ...prev,
          employeeId: `EMP${String(emp.id).padStart(3, '0')}`,
          department: emp.department,
          position: emp.position,
          bankName: 'ABC Bank',
          accountNumber: '1234567890'
        }));
      }
    }

    // Recalculate when key fields change
    if (['amount', 'interestRate', 'tenure'].includes(name)) {
      setTimeout(() => calculateLoan(), 0);
    }

    if (error) setError('');
  };

  const calculateLoan = () => {
    const { amount, interestRate, tenure } = formData;
    const P = parseFloat(amount) || 0;
    const r = (parseFloat(interestRate) || 0) / 100 / 12;
    const n = parseFloat(tenure) || 0;

    if (P > 0 && n > 0) {
      let monthly;
      if (r === 0) {
        monthly = P / n;
      } else {
        monthly = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      }
      const totalPay = monthly * n;
      const totalInt = totalPay - P;

      setFormData((prev) => ({
        ...prev,
        monthlyPayment: parseFloat(monthly.toFixed(2)),
        totalPayment: parseFloat(totalPay.toFixed(2)),
        totalInterest: parseFloat(totalInt.toFixed(2))
      }));
    }
  };

  const validate = () => {
    if (!formData.employeeName.trim()) {
      setError('Please select an employee');
      return false;
    }
    if (!formData.department) {
      setError('Department is required');
      return false;
    }
    if (!formData.loanType) {
      setError('Please select a loan type');
      return false;
    }
    if (!formData.amount || formData.amount <= 0) {
      setError('Please enter a valid loan amount');
      return false;
    }
    if (formData.interestRate === '' || formData.interestRate < 0) {
      setError('Please enter a valid interest rate');
      return false;
    }
    if (!formData.tenure || formData.tenure <= 0) {
      setError('Please enter a valid tenure');
      return false;
    }
    if (!formData.reason.trim()) {
      setError('Please provide a reason');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
      setLoading(false);
    } catch (err) {
      setError('Failed to submit loan application.');
      setLoading(false);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount || 0);

  return (
    <Form onSubmit={handleSubmit} className="loan-application-form">
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>
              <FaUser className="me-2" /> Employee Name{' '}
              <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="employeeName"
              placeholder="Select employee"
              value={formData.employeeName}
              onChange={handleChange}
              list="loanEmployeeList"
              disabled={!!loan}
            />
            <datalist id="loanEmployeeList">
              {employees.map((e, i) => (
                <option key={i} value={e.name} />
              ))}
            </datalist>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Employee ID</Form.Label>
            <Form.Control
              type="text"
              value={formData.employeeId}
              readOnly
              className="readonly-field"
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>
              <FaBuilding className="me-2" /> Department
            </Form.Label>
            <Form.Control
              type="text"
              value={formData.department}
              readOnly
              className="readonly-field"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Position</Form.Label>
            <Form.Control
              type="text"
              value={formData.position}
              readOnly
              className="readonly-field"
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>
              <FaMoneyBillWave className="me-2" /> Loan Type{' '}
              <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              name="loanType"
              value={formData.loanType}
              onChange={handleChange}
            >
              {loanTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Amount <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="number"
              name="amount"
              placeholder="Enter loan amount"
              value={formData.amount}
              onChange={handleChange}
              min="0"
              step="100"
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>
              <FaPercent className="me-2" /> Interest Rate (%){' '}
              <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="number"
              name="interestRate"
              placeholder="e.g., 8.5"
              value={formData.interestRate}
              onChange={handleChange}
              min="0"
              max="30"
              step="0.5"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>
              <FaClock className="me-2" /> Tenure (months){' '}
              <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="number"
              name="tenure"
              placeholder="Enter tenure in months"
              value={formData.tenure}
              onChange={handleChange}
              min="1"
              max="60"
            />
          </Form.Group>
        </Col>
      </Row>

      {formData.monthlyPayment > 0 && (
        <Card className="loan-calculation-card mb-3">
          <Card.Body>
            <div className="calculation-content">
              <FaCalculator className="calculation-icon" />
              <div className="calculation-info">
                <div className="calculation-label">Monthly Payment</div>
                <div className="calculation-value">
                  {formatCurrency(formData.monthlyPayment)}
                </div>
              </div>
              <div className="calculation-details">
                <span>Principal: {formatCurrency(formData.amount)}</span>
                <span>•</span>
                <span>Interest: {formData.interestRate}%</span>
                <span>•</span>
                <span>{formData.tenure} months</span>
              </div>
            </div>
            <div className="calculation-grid">
              <div className="calc-item">
                <span className="calc-label">Total Payment</span>
                <span className="calc-value">
                  {formatCurrency(formData.totalPayment)}
                </span>
              </div>
              <div className="calc-item">
                <span className="calc-label">Total Interest</span>
                <span className="calc-value text-warning">
                  {formatCurrency(formData.totalInterest)}
                </span>
              </div>
            </div>
          </Card.Body>
        </Card>
      )}

      <Form.Group className="mb-3">
        <Form.Label>
          <FaComment className="me-2" /> Reason <span className="text-danger">*</span>
        </Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="reason"
          placeholder="Enter reason for loan"
          value={formData.reason}
          onChange={handleChange}
        />
      </Form.Group>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Bank Name</Form.Label>
            <Form.Control
              type="text"
              name="bankName"
              placeholder="Enter bank name"
              value={formData.bankName}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Account Number</Form.Label>
            <Form.Control
              type="text"
              name="accountNumber"
              placeholder="Enter account number"
              value={formData.accountNumber}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <div className="form-actions">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          <FaTimes className="me-1" /> Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Submitting...
            </>
          ) : (
            <>
              <FaSave className="me-1" />
              {loan ? 'Update Application' : 'Submit Application'}
            </>
          )}
        </Button>
      </div>
    </Form>
  );
};

export default LoanApplication;