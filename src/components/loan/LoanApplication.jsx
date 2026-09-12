import React, { useState, useEffect } from 'react';
import {
  Form,
  Row,
  Col,
  Button,
  Alert,
  Spinner,
  Card
} from 'react-bootstrap';
import { 
  FaSave, 
  FaTimes, 
  FaUser, 
  FaMoneyBillWave, 
  FaClock, 
  FaComment,
  FaBuilding,
  FaCalculator,
  FaPercent,
  FaCalendarAlt
} from 'react-icons/fa';
import './LoanApplication.css';

const LoanApplication = ({ loan, onSubmit, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    employeeName: '',
    employeeId: '',
    department: '',
    loanType: 'Personal',
    amount: '',
    interestRate: '',
    tenure: '',
    monthlyPayment: 0,
    reason: '',
    remarks: ''
  });

  const loanTypes = ['Personal', 'Car', 'Home', 'Education', 'Emergency', 'Medical', 'Business', 'Bikes'];
  const departments = ['Software', 'Marketing', 'Electrical', 'Production', 'HR', 'Finance'];
  const employees = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams', 'Robert Brown', 'Emily Davis'];

  useEffect(() => {
    if (loan) {
      setFormData({
        id: loan.id,
        employeeName: loan.employeeName || '',
        employeeId: loan.employeeId || '',
        department: loan.department || '',
        loanType: loan.loanType || 'Personal',
        amount: loan.amount || '',
        interestRate: loan.interestRate || '',
        tenure: loan.tenure || '',
        monthlyPayment: loan.monthlyPayment || 0,
        reason: loan.reason || '',
        remarks: loan.remarks || ''
      });
    }
  }, [loan]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Calculate monthly payment when amount, interest rate, or tenure changes
    if (['amount', 'interestRate', 'tenure'].includes(name)) {
      calculateMonthlyPayment();
    }
    
    if (error) setError('');
  };

  const calculateMonthlyPayment = () => {
    const { amount, interestRate, tenure } = formData;
    if (amount && interestRate && tenure) {
      const P = parseFloat(amount);
      const r = parseFloat(interestRate) / 100 / 12;
      const n = parseFloat(tenure);
      
      if (r === 0) {
        setFormData(prev => ({
          ...prev,
          monthlyPayment: P / n
        }));
      } else {
        const monthlyPayment = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
        setFormData(prev => ({
          ...prev,
          monthlyPayment: parseFloat(monthlyPayment.toFixed(2))
        }));
      }
    }
  };

  const validateForm = () => {
    if (!formData.employeeName.trim()) {
      setError('Employee name is required');
      return false;
    }
    if (!formData.employeeId.trim()) {
      setError('Employee ID is required');
      return false;
    }
    if (!formData.department) {
      setError('Department is required');
      return false;
    }
    if (!formData.loanType) {
      setError('Loan type is required');
      return false;
    }
    if (!formData.amount || formData.amount <= 0) {
      setError('Valid loan amount is required');
      return false;
    }
    if (!formData.interestRate || formData.interestRate < 0) {
      setError('Valid interest rate is required');
      return false;
    }
    if (!formData.tenure || formData.tenure <= 0) {
      setError('Valid tenure is required');
      return false;
    }
    if (!formData.reason.trim()) {
      setError('Reason is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      setLoading(false);
    } catch (error) {
      setError('Failed to submit loan application. Please try again.');
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount || 0);
  };

  return (
    <Form onSubmit={handleSubmit} className="loan-application-form">
      {error && (
        <Alert variant="danger" className="mb-3" onClose={() => setError('')} dismissible>
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
        </Alert>
      )}

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>
              <FaUser className="me-2" /> Employee Name <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="employeeName"
              placeholder="Enter employee name"
              value={formData.employeeName}
              onChange={handleChange}
              list="employeeList"
            />
            <datalist id="employeeList">
              {employees.map((emp, index) => (
                <option key={index} value={emp} />
              ))}
            </datalist>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Employee ID <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              name="employeeId"
              placeholder="Enter employee ID"
              value={formData.employeeId}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>
              <FaBuilding className="me-2" /> Department <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              name="department"
              value={formData.department}
              onChange={handleChange}
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>
              <FaMoneyBillWave className="me-2" /> Loan Type <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              name="loanType"
              value={formData.loanType}
              onChange={handleChange}
            >
              {loanTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>
              <FaMoneyBillWave className="me-2" /> Amount <span className="text-danger">*</span>
            </Form.Label>
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

        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>
              <FaPercent className="me-2" /> Interest Rate (%) <span className="text-danger">*</span>
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

        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>
              <FaClock className="me-2" /> Tenure (months) <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="number"
              name="tenure"
              placeholder="Enter tenure"
              value={formData.tenure}
              onChange={handleChange}
              min="1"
              max="60"
            />
          </Form.Group>
        </Col>
      </Row>

      {formData.monthlyPayment > 0 && (
        <Card className="calculation-card mb-3">
          <Card.Body>
            <div className="calculation-content">
              <FaCalculator className="calculation-icon" />
              <div className="calculation-info">
                <div className="calculation-label">Monthly Payment</div>
                <div className="calculation-value">{formatCurrency(formData.monthlyPayment)}</div>
              </div>
              <div className="calculation-details">
                <span>Total: {formatCurrency(formData.amount)}</span>
                <span>•</span>
                <span>Interest: {formData.interestRate}%</span>
                <span>•</span>
                <span>{formData.tenure} months</span>
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

      <Form.Group className="mb-3">
        <Form.Label>
          <FaComment className="me-2" /> Remarks (Optional)
        </Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          name="remarks"
          placeholder="Additional remarks"
          value={formData.remarks}
          onChange={handleChange}
        />
      </Form.Group>

      <div className="form-actions">
        <Button 
          variant="secondary" 
          onClick={onCancel}
          disabled={loading}
        >
          <FaTimes className="me-1" /> Cancel
        </Button>
        <Button 
          variant="primary" 
          type="submit"
          disabled={loading}
        >
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