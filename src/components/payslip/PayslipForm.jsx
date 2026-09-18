import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Button, Alert, Spinner, Card } from 'react-bootstrap';
import {
  FaSave, FaTimes, FaUser, FaMoneyBillWave, FaBuilding,
  FaCalendarAlt, FaFileInvoice, FaCalculator
} from 'react-icons/fa';
import './PayslipForm.css';

const PayslipForm = ({ payslip, onSubmit, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    employeeName: '',
    employeeId: '',
    department: '',
    position: '',
    month: '',
    year: new Date().getFullYear(),
    basicSalary: '',
    allowance: 0,
    bonus: 0,
    deductions: 0,
    netSalary: 0,
    attendance: 22,
    leaveTaken: 0,
    overtime: 0,
    bankName: '',
    accountNumber: ''
  });

  const employees = [
    { id: 1, name: 'John Doe', department: 'Software', position: 'Senior Developer' },
    { id: 2, name: 'Jane Smith', department: 'Marketing', position: 'Marketing Manager' },
    { id: 3, name: 'Mike Johnson', department: 'Electrical', position: 'Electrical Engineer' },
    { id: 4, name: 'Sarah Williams', department: 'Production', position: 'Production Supervisor' },
    { id: 5, name: 'Robert Brown', department: 'Software', position: 'Frontend Developer' }
  ];

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  useEffect(() => {
    if (payslip) {
      setFormData({
        id: payslip.id,
        employeeName: payslip.employeeName || '',
        employeeId: payslip.employeeId || '',
        department: payslip.department || '',
        position: payslip.position || '',
        month: payslip.month || '',
        year: payslip.year || currentYear,
        basicSalary: payslip.basicSalary || '',
        allowance: payslip.allowance || 0,
        bonus: payslip.bonus || 0,
        deductions: payslip.deductions || 0,
        netSalary: payslip.netSalary || 0,
        attendance: payslip.attendance || 22,
        leaveTaken: payslip.leaveTaken || 0,
        overtime: payslip.overtime || 0,
        bankName: payslip.bankName || '',
        accountNumber: payslip.accountNumber || ''
      });
    }
  }, [payslip, currentYear]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const parsedValue = type === 'number' ? parseFloat(value) || 0 : value;

    setFormData(prev => ({ ...prev, [name]: parsedValue }));

    if (name === 'employeeName') {
      const emp = employees.find(e => e.name === value);
      if (emp) {
        setFormData(prev => ({
          ...prev,
          employeeId: `EMP${String(emp.id).padStart(3, '0')}`,
          department: emp.department,
          position: emp.position,
          bankName: 'ABC Bank',
          accountNumber: '1234567890'
        }));
      }
    }

    if (['basicSalary', 'allowance', 'bonus', 'deductions'].includes(name)) {
      setTimeout(() => calculateNetSalary(), 0);
    }

    if (error) setError('');
  };

  const calculateNetSalary = () => {
    const { basicSalary, allowance, bonus, deductions } = formData;
    const gross = (parseFloat(basicSalary) || 0) +
                  (parseFloat(allowance) || 0) +
                  (parseFloat(bonus) || 0);
    const net = gross - (parseFloat(deductions) || 0);
    setFormData(prev => ({ ...prev, netSalary: net }));
  };

  const validate = () => {
    if (!formData.employeeName.trim()) { setError('Please select an employee'); return false; }
    if (!formData.month) { setError('Please select a month'); return false; }
    if (!formData.year) { setError('Please select a year'); return false; }
    if (!formData.basicSalary || formData.basicSalary <= 0) { setError('Enter a valid basic salary'); return false; }
    if (!formData.bankName.trim()) { setError('Please enter bank name'); return false; }
    if (!formData.accountNumber.trim()) { setError('Please enter account number'); return false; }
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
      setError('Failed to save payslip. Please try again.');
      setLoading(false);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency', currency: 'USD',
      minimumFractionDigits: 0, maximumFractionDigits: 0
    }).format(amount || 0);

  return (
    <Form onSubmit={handleSubmit} className="payslip-form">
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Row>
        <Col md={8}>
          <Form.Group className="mb-3">
            <Form.Label><FaUser className="me-2" /> Employee <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              name="employeeName"
              placeholder="Select employee"
              value={formData.employeeName}
              onChange={handleChange}
              list="employeeList"
              disabled={!!payslip}
            />
            <datalist id="employeeList">
              {employees.map((emp, i) => <option key={i} value={emp.name} />)}
            </datalist>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Employee ID</Form.Label>
            <Form.Control type="text" value={formData.employeeId} readOnly className="readonly-field" />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label><FaBuilding className="me-2" /> Department</Form.Label>
            <Form.Control type="text" value={formData.department} readOnly className="readonly-field" />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Position</Form.Label>
            <Form.Control type="text" value={formData.position} readOnly className="readonly-field" />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label><FaCalendarAlt className="me-2" /> Month <span className="text-danger">*</span></Form.Label>
            <Form.Select name="month" value={formData.month} onChange={handleChange}>
              <option value="">Select Month</option>
              {months.map(m => <option key={m} value={m}>{m}</option>)}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label><FaCalendarAlt className="me-2" /> Year <span className="text-danger">*</span></Form.Label>
            <Form.Select name="year" value={formData.year} onChange={handleChange}>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Card className="salary-calc-card">
        <Card.Header>
          <h6 className="mb-0"><FaMoneyBillWave className="me-2" /> Salary Calculation</h6>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Basic Salary <span className="text-danger">*</span></Form.Label>
                <Form.Control type="number" name="basicSalary" placeholder="0"
                  value={formData.basicSalary} onChange={handleChange} min="0" />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Allowance</Form.Label>
                <Form.Control type="number" name="allowance" placeholder="0"
                  value={formData.allowance} onChange={handleChange} min="0" />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Bonus</Form.Label>
                <Form.Control type="number" name="bonus" placeholder="0"
                  value={formData.bonus} onChange={handleChange} min="0" />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Deductions</Form.Label>
                <Form.Control type="number" name="deductions" placeholder="0"
                  value={formData.deductions} onChange={handleChange} min="0" />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Working Days</Form.Label>
                <Form.Control type="number" name="attendance" value={formData.attendance}
                  onChange={handleChange} min="0" max="31" />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Overtime (hours)</Form.Label>
                <Form.Control type="number" name="overtime" value={formData.overtime}
                  onChange={handleChange} min="0" />
              </Form.Group>
            </Col>
          </Row>

          <div className="net-salary-display">
            <span className="net-salary-label">
              <FaCalculator className="me-2" /> Net Salary
            </span>
            <span className="net-salary-value">{formatCurrency(formData.netSalary)}</span>
          </div>
        </Card.Body>
      </Card>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Bank Name <span className="text-danger">*</span></Form.Label>
            <Form.Control type="text" name="bankName" placeholder="Enter bank name"
              value={formData.bankName} onChange={handleChange} />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Account Number <span className="text-danger">*</span></Form.Label>
            <Form.Control type="text" name="accountNumber" placeholder="Enter account number"
              value={formData.accountNumber} onChange={handleChange} />
          </Form.Group>
        </Col>
      </Row>

      <div className="form-actions">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          <FaTimes className="me-1" /> Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? (
            <><Spinner animation="border" size="sm" className="me-2" />Saving...</>
          ) : (
            <><FaSave className="me-1" />{payslip ? 'Update Payslip' : 'Generate Payslip'}</>
          )}
        </Button>
      </div>
    </Form>
  );
};

export default PayslipForm;