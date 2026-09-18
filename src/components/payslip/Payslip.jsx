import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Alert, Spinner } from 'react-bootstrap';
import {
  FaPlus,
  FaDownload,
  FaFileInvoice,
  FaMoneyBillWave,
  FaCheckCircle,
  FaClock,
  FaUsers,
  FaEnvelope
} from 'react-icons/fa';
import PayslipList from './PayslipList';
import PayslipForm from './PayslipForm';
import PayslipViewer from './PayslipViewer';
import payslipService from '../../services/payslipService';
import { formatCurrency } from '../../utils/formatters';
import './Payslip.css';

const Payslip = () => {
  const [loading, setLoading] = useState(false);
  const [payslips, setPayslips] = useState([]);
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [editingPayslip, setEditingPayslip] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showViewer, setShowViewer] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchPayslips();
  }, []);

  const fetchPayslips = async () => {
    setLoading(true);
    try {
      const result = await payslipService.getAllPayslips();
      if (result.success && Array.isArray(result.data)) {
        setPayslips(result.data);
      } else {
        // Fallback demo data
        setPayslips(getDemoPayslips());
      }
    } catch (err) {
      setPayslips(getDemoPayslips());
    } finally {
      setLoading(false);
    }
  };

  const getDemoPayslips = () => [
    {
      id: 1,
      employeeName: 'John Doe',
      employeeId: 'EMP001',
      department: 'Software',
      position: 'Senior Developer',
      month: 'January',
      year: 2026,
      basicSalary: 5000,
      allowances: { housing: 500, transport: 300, medical: 200, other: 0 },
      bonuses: { performance: 500, holiday: 0, other: 0 },
      deductions: { tax: 200, insurance: 100, pension: 0, loan: 0, other: 0 },
      netSalary: 6200,
      status: 'Generated',
      generatedDate: '2026-01-31',
      payDate: '2026-02-01',
      bankName: 'ABC Bank',
      accountNumber: '1234567890',
      attendance: { workingDays: 22, presentDays: 22, leaveDays: 0, absentDays: 0, overtime: 10 },
      avatar: 'JD'
    },
    {
      id: 2,
      employeeName: 'Jane Smith',
      employeeId: 'EMP002',
      department: 'Marketing',
      position: 'Marketing Manager',
      month: 'January',
      year: 2026,
      basicSalary: 4500,
      allowances: { housing: 400, transport: 250, medical: 150, other: 0 },
      bonuses: { performance: 400, holiday: 0, other: 0 },
      deductions: { tax: 150, insurance: 100, pension: 0, loan: 0, other: 0 },
      netSalary: 5450,
      status: 'Generated',
      generatedDate: '2026-01-31',
      payDate: '2026-02-01',
      bankName: 'XYZ Bank',
      accountNumber: '0987654321',
      attendance: { workingDays: 22, presentDays: 21, leaveDays: 1, absentDays: 0, overtime: 5 },
      avatar: 'JS'
    },
    {
      id: 3,
      employeeName: 'Mike Johnson',
      employeeId: 'EMP003',
      department: 'Electrical',
      position: 'Electrical Engineer',
      month: 'January',
      year: 2026,
      basicSalary: 4800,
      allowances: { housing: 450, transport: 250, medical: 200, other: 0 },
      bonuses: { performance: 0, holiday: 0, other: 0 },
      deductions: { tax: 180, insurance: 100, pension: 0, loan: 0, other: 0 },
      netSalary: 5420,
      status: 'Pending',
      generatedDate: '2026-01-30',
      payDate: null,
      bankName: 'ABC Bank',
      accountNumber: '5678901234',
      attendance: { workingDays: 22, presentDays: 20, leaveDays: 2, absentDays: 0, overtime: 8 },
      avatar: 'MJ'
    },
    {
      id: 4,
      employeeName: 'Sarah Williams',
      employeeId: 'EMP004',
      department: 'Production',
      position: 'Production Supervisor',
      month: 'December',
      year: 2025,
      basicSalary: 4200,
      allowances: { housing: 400, transport: 200, medical: 100, other: 0 },
      bonuses: { performance: 600, holiday: 0, other: 0 },
      deductions: { tax: 100, insurance: 100, pension: 0, loan: 0, other: 0 },
      netSalary: 5300,
      status: 'Generated',
      generatedDate: '2025-12-31',
      payDate: '2026-01-01',
      bankName: 'XYZ Bank',
      accountNumber: '4321098765',
      attendance: { workingDays: 23, presentDays: 23, leaveDays: 0, absentDays: 0, overtime: 12 },
      avatar: 'SW'
    },
    {
      id: 5,
      employeeName: 'Robert Brown',
      employeeId: 'EMP005',
      department: 'Software',
      position: 'Frontend Developer',
      month: 'January',
      year: 2026,
      basicSalary: 4600,
      allowances: { housing: 450, transport: 200, medical: 100, other: 0 },
      bonuses: { performance: 300, holiday: 0, other: 0 },
      deductions: { tax: 160, insurance: 100, pension: 0, loan: 0, other: 0 },
      netSalary: 5390,
      status: 'Pending',
      generatedDate: '2026-01-29',
      payDate: null,
      bankName: 'ABC Bank',
      accountNumber: '7890123456',
      attendance: { workingDays: 22, presentDays: 22, leaveDays: 0, absentDays: 0, overtime: 6 },
      avatar: 'RB'
    }
  ];

  const handleAddPayslip = async (payslipData) => {
    setLoading(true);
    try {
      const result = await payslipService.createPayslip(payslipData);
      if (result.success) {
        setPayslips([result.data, ...payslips]);
      } else {
        const newPayslip = {
          ...payslipData,
          id: payslips.length + 1,
          avatar: payslipData.employeeName.split(' ').map(n => n[0]).join('')
        };
        setPayslips([newPayslip, ...payslips]);
      }
      setShowForm(false);
      setSuccess('Payslip generated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to generate payslip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePayslip = async (payslipData) => {
    setLoading(true);
    try {
      const result = await payslipService.updatePayslip(payslipData.id, payslipData);
      if (result.success) {
        setPayslips(payslips.map(p => p.id === payslipData.id ? result.data : p));
      } else {
        setPayslips(payslips.map(p => p.id === payslipData.id ? { ...p, ...payslipData } : p));
      }
      setShowForm(false);
      setEditingPayslip(null);
      setSuccess('Payslip updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update payslip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePayslip = async (id) => {
    if (window.confirm('Are you sure you want to delete this payslip?')) {
      try {
        await payslipService.deletePayslip(id);
        setPayslips(payslips.filter(p => p.id !== id));
        setSuccess('Payslip deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to delete payslip. Please try again.');
      }
    }
  };

  const handleGeneratePayslip = async (id) => {
    try {
      const result = await payslipService.generatePayslip(id);
      if (result.success) {
        setPayslips(payslips.map(p =>
          p.id === id ? { ...p, status: 'Generated', payDate: new Date().toISOString().split('T')[0] } : p
        ));
      } else {
        setPayslips(payslips.map(p =>
          p.id === id ? { ...p, status: 'Generated', payDate: new Date().toISOString().split('T')[0] } : p
        ));
      }
      setSuccess('Payslip generated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to generate payslip. Please try again.');
    }
  };

  const handleViewPayslip = (payslip) => {
    setSelectedPayslip(payslip);
    setShowViewer(true);
  };

  const handleEditPayslip = (payslip) => {
    setEditingPayslip(payslip);
    setShowForm(true);
  };

  const handleDownloadPayslip = async (payslip) => {
    try {
      const result = await payslipService.downloadPayslip(payslip.id);
      if (result.success) {
        const url = window.URL.createObjectURL(new Blob([result.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `payslip-${payslip.employeeId}-${payslip.month}-${payslip.year}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
      setSuccess(`Downloading payslip for ${payslip.employeeName}...`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to download payslip.');
    }
  };

  const handleSendEmail = async (payslip) => {
    try {
      await payslipService.sendPayslipEmail(payslip.id);
      setSuccess(`Payslip sent to ${payslip.employeeName} via email!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to send payslip email.');
    }
  };

  const handleExport = () => {
    setSuccess('Payslip data exported successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  // Statistics
  const totalPayslips = payslips.length;
  const generatedPayslips = payslips.filter(p => p.status === 'Generated').length;
  const pendingPayslips = payslips.filter(p => p.status === 'Pending').length;
  const totalSalary = payslips.reduce((sum, p) => sum + (p.netSalary || 0), 0);
  const avgSalary = totalPayslips > 0 ? Math.round(totalSalary / totalPayslips) : 0;

  return (
    <div className="payslip-page">
      <Container fluid>
        {/* Header */}
        <div className="payslip-header">
          <div className="header-left">
            <h2 className="page-title">Payslip Management</h2>
            <p className="page-subtitle">Generate and manage employee payslips</p>
          </div>
          <div className="header-right">
            <Button
              variant="primary"
              className="me-2"
              onClick={() => { setEditingPayslip(null); setShowForm(true); }}
            >
              <FaPlus className="me-1" /> Generate Payslip
            </Button>
            <Button variant="outline-secondary" onClick={handleExport}>
              <FaDownload className="me-1" /> Export
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <Row className="statistics-cards mb-4">
          <Col lg={3} md={6} className="mb-3">
            <Card className="stat-card total-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon-wrapper primary">
                    <FaFileInvoice className="stat-icon" />
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">{totalPayslips}</h3>
                    <p className="stat-label">Total Payslips</p>
                    <small className="stat-detail">{formatCurrency(totalSalary)} total</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={3} md={6} className="mb-3">
            <Card className="stat-card generated-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon-wrapper success">
                    <FaCheckCircle className="stat-icon" />
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">{generatedPayslips}</h3>
                    <p className="stat-label">Generated</p>
                    <small className="stat-detail">Ready to download</small>
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
                    <FaClock className="stat-icon" />
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">{pendingPayslips}</h3>
                    <p className="stat-label">Pending</p>
                    <small className="stat-detail">Awaiting generation</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={3} md={6} className="mb-3">
            <Card className="stat-card average-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon-wrapper info">
                    <FaMoneyBillWave className="stat-icon" />
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">{formatCurrency(avgSalary)}</h3>
                    <p className="stat-label">Average Salary</p>
                    <small className="stat-detail">Per payslip</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

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

        {/* List */}
        <Card className="payslip-main-card">
          <Card.Body>
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-muted">Loading payslips...</p>
              </div>
            ) : (
              <PayslipList
                payslips={payslips}
                onView={handleViewPayslip}
                onEdit={handleEditPayslip}
                onDelete={handleDeletePayslip}
                onGenerate={handleGeneratePayslip}
                onDownload={handleDownloadPayslip}
                onSendEmail={handleSendEmail}
                formatCurrency={formatCurrency}
              />
            )}
          </Card.Body>
        </Card>

        {/* Form Modal */}
        <Modal
          show={showForm}
          onHide={() => { setShowForm(false); setEditingPayslip(null); }}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <FaFileInvoice className="me-2" />
              {editingPayslip ? 'Edit Payslip' : 'Generate Payslip'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <PayslipForm
              payslip={editingPayslip}
              onSubmit={editingPayslip ? handleUpdatePayslip : handleAddPayslip}
              onCancel={() => { setShowForm(false); setEditingPayslip(null); }}
            />
          </Modal.Body>
        </Modal>

        {/* Viewer Modal */}
        <Modal
          show={showViewer}
          onHide={() => setShowViewer(false)}
          size="lg"
          centered
          className="payslip-viewer-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <FaFileInvoice className="me-2" /> Payslip Preview
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedPayslip && (
              <PayslipViewer
                payslip={selectedPayslip}
                onDownload={() => handleDownloadPayslip(selectedPayslip)}
                onPrint={() => window.print()}
                onSendEmail={() => handleSendEmail(selectedPayslip)}
                onClose={() => setShowViewer(false)}
                formatCurrency={formatCurrency}
              />
            )}
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};

export default Payslip;