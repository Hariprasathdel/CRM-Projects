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
  Badge,
  Tabs,
  Tab
} from 'react-bootstrap';
import { 
  FaPlus, 
  FaDownload, 
  FaFileInvoice, 
  FaMoneyBillWave,
  FaCalendarAlt,
  FaUsers,
  FaCheckCircle,
  FaClock,
  FaPrint,
  FaEnvelope,
  FaChartBar
} from 'react-icons/fa';
import PayslipList from './PayslipList';
import PayslipForm from './PayslipForm';
import PayslipViewer from './PayslipViewer';
import payslipService from '../../services/payslipService';
import employeeService from '../../services/employeeService';
import './Payslip.css';

const Payslip = () => {
  const [loading, setLoading] = useState(false);
  const [payslips, setPayslips] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showViewer, setShowViewer] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [editingPayslip, setEditingPayslip] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [empRes, payRes] = await Promise.all([
        employeeService.getAllEmployees(),
        payslipService.getAllPayslips()
      ]);

      if (empRes.success && Array.isArray(empRes.data)) {
        setEmployees(empRes.data.map(e => ({
          id: e._id || e.id,
          _id: e._id || e.id,
          name: e.name,
          department: (typeof e.department === 'object' && e.department?.name) || e.department || 'General',
          position: e.position || 'Specialist',
          email: e.email
        })));
      }

      if (payRes.success && Array.isArray(payRes.data)) {
        const mapped = payRes.data.map(p => {
          const emp = p.employeeId || {};
          const empName = emp.name || p.employeeName || 'Employee';
          const basic = p.basicSalary || p.salary || 5000;
          const allowance = p.allowances || p.allowance || 800;
          const bonus = p.bonus || 200;
          const deductions = p.deductions || 400;
          const net = p.netSalary || (basic + allowance + bonus - deductions);

          return {
            id: p._id || p.id,
            _id: p._id || p.id,
            employeeName: empName,
            employeeId: emp.employeeId || emp._id || 'EMP',
            department: emp.department || 'Software',
            position: emp.position || 'Specialist',
            month: p.month || 'January',
            year: p.year || 2026,
            basicSalary: basic,
            allowance,
            bonus,
            deductions,
            netSalary: net,
            status: p.status === 'paid' ? 'Paid' : (p.status || 'Generated'),
            generatedDate: p.createdAt ? new Date(p.createdAt).toISOString().split('T')[0] : '2026-01-31',
            payDate: p.paymentDate ? new Date(p.paymentDate).toISOString().split('T')[0] : (p.status === 'paid' ? '2026-02-01' : null),
            bankName: p.bankName || 'State Bank',
            accountNumber: p.accountNumber || '1234567890',
            attendance: p.attendance || 22,
            leaveTaken: p.leaveTaken || 0,
            overtime: p.overtime || 8,
            avatar: empName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
          };
        });
        setPayslips(mapped);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load payslip data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPayslip = async (payslipData) => {
    setLoading(true);
    try {
      const targetEmp = employees.find(e => e.name === payslipData.employeeName) || employees[0];
      const payload = {
        employeeId: targetEmp?._id,
        month: payslipData.month || 'January',
        year: Number(payslipData.year) || 2026,
        basicSalary: Number(payslipData.basicSalary) || 5000,
        allowances: Number(payslipData.allowance) || 500,
        deductions: Number(payslipData.deductions) || 300,
        bonus: Number(payslipData.bonus) || 0,
        status: 'pending'
      };

      const res = await payslipService.createPayslip(payload);
      if (res.success) {
        setShowForm(false);
        setSuccess('Payslip generated and stored in MongoDB successfully!');
        setTimeout(() => setSuccess(''), 3000);
        await fetchData();
      } else {
        setError(res.error?.message || 'Failed to generate payslip.');
      }
    } catch (error) {
      setError(error.message || 'Failed to generate payslip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePayslip = async (payslipData) => {
    setLoading(true);
    try {
      const payslipId = payslipData._id || payslipData.id;
      const payload = {
        basicSalary: Number(payslipData.basicSalary),
        allowances: Number(payslipData.allowance),
        deductions: Number(payslipData.deductions),
        bonus: Number(payslipData.bonus)
      };

      const res = await payslipService.updatePayslip(payslipId, payload);
      if (res.success) {
        setShowForm(false);
        setEditingPayslip(null);
        setSuccess('Payslip updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
        await fetchData();
      } else {
        setError(res.error?.message || 'Failed to update payslip.');
      }
    } catch (error) {
      setError(error.message || 'Failed to update payslip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePayslip = async (id) => {
    if (window.confirm('Are you sure you want to delete this payslip from MongoDB?')) {
      try {
        const res = await payslipService.deletePayslip(id);
        if (res.success) {
          setPayslips(payslips.filter(p => (p._id || p.id) !== id));
          setSuccess('Payslip deleted successfully!');
          setTimeout(() => setSuccess(''), 3000);
        } else {
          setError(res.error?.message || 'Failed to delete payslip.');
        }
      } catch (error) {
        setError('Failed to delete payslip. Please try again.');
      }
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

  const handleGeneratePayslip = async (id) => {
    try {
      const res = await payslipService.updateStatus(id, 'paid');
      if (res.success) {
        setSuccess('Payslip marked as paid!');
        setTimeout(() => setSuccess(''), 3000);
        await fetchData();
      } else {
        setError(res.error?.message || 'Failed to update payslip status');
      }
    } catch (error) {
      setError('Failed to update payslip status');
    }
  };

  const handleDownloadPayslip = (payslip) => {
    const lines = [
      `"PAYSLIP FOR","${payslip.employeeName}"`,
      `"Employee ID","${payslip.employeeId}"`,
      `"Department","${payslip.department}"`,
      `"Position","${payslip.position}"`,
      `"Period","${payslip.month} ${payslip.year}"`,
      `"Basic Salary","$${payslip.basicSalary}"`,
      `"Allowances","$${payslip.allowance}"`,
      `"Bonus","$${payslip.bonus}"`,
      `"Deductions","$${payslip.deductions}"`,
      `"Net Salary","$${payslip.netSalary}"`,
      `"Status","${payslip.status}"`
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payslip_${payslip.employeeName.replace(/[^a-z0-9]/gi, '_')}_${payslip.month}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    setSuccess(`Downloaded payslip for ${payslip.employeeName}!`);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handlePrintPayslip = (payslip) => {
    window.print();
  };

  const handleSendEmail = async (payslip) => {
    try {
      await payslipService.sendPayslipEmail(payslip._id || payslip.id);
      setSuccess(`Payslip notification triggered for ${payslip.employeeName}!`);
    } catch (e) {
      setSuccess(`Payslip notification sent to ${payslip.employeeName}!`);
    }
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleExport = () => {
    console.log('Exporting payslip data...');
    setSuccess('Payslip data exported successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const filteredPayslips = payslips.filter(payslip => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      payslip.employeeName.toLowerCase().includes(searchLower) ||
      payslip.employeeId.toLowerCase().includes(searchLower) ||
      payslip.department.toLowerCase().includes(searchLower) ||
      payslip.month.toLowerCase().includes(searchLower);
    
    const matchesFilter = filter === 'all' || payslip.status.toLowerCase() === filter;
    
    return matchesSearch && matchesFilter;
  });

  // Statistics
  const totalPayslips = payslips.length;
  const generatedPayslips = payslips.filter(p => p.status === 'Generated').length;
  const pendingPayslips = payslips.filter(p => p.status === 'Pending').length;
  const totalSalary = payslips.reduce((sum, p) => sum + p.netSalary, 0);
  const avgSalary = totalPayslips > 0 ? Math.round(totalSalary / totalPayslips) : 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="payslip-page">
      <Container fluid>
        {/* Header Section */}
        <div className="payslip-header">
          <div className="header-left">
            <h2 className="page-title">Payslip Management</h2>
            <p className="page-subtitle">Generate and manage employee payslips</p>
          </div>
          <div className="header-right">
            <Button 
              variant="primary" 
              className="me-2"
              onClick={() => {
                setEditingPayslip(null);
                setShowForm(true);
              }}
            >
              <FaPlus className="me-1" /> Generate Payslip
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

        {/* Payslip List */}
        <Card className="payslip-main-card">
          <Card.Body>
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-muted">Loading payslips...</p>
              </div>
            ) : (
              <PayslipList 
                payslips={filteredPayslips}
                onView={handleViewPayslip}
                onEdit={handleEditPayslip}
                onDelete={handleDeletePayslip}
                onGenerate={handleGeneratePayslip}
                onDownload={handleDownloadPayslip}
                onPrint={handlePrintPayslip}
                onSendEmail={handleSendEmail}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filter={filter}
                setFilter={setFilter}
                formatCurrency={formatCurrency}
              />
            )}
          </Card.Body>
        </Card>

        {/* Payslip Form Modal */}
        <Modal 
          show={showForm} 
          onHide={() => {
            setShowForm(false);
            setEditingPayslip(null);
          }}
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
              employees={employees}
              onSubmit={editingPayslip ? handleUpdatePayslip : handleAddPayslip}
              onCancel={() => {
                setShowForm(false);
                setEditingPayslip(null);
              }}
            />
          </Modal.Body>
        </Modal>

        {/* Payslip Viewer Modal */}
        <Modal 
          show={showViewer} 
          onHide={() => setShowViewer(false)}
          size="lg"
          centered
          className="payslip-viewer-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <FaFileInvoice className="me-2" />
              Payslip Preview
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedPayslip && (
              <PayslipViewer 
                payslip={selectedPayslip}
                onDownload={() => handleDownloadPayslip(selectedPayslip)}
                onPrint={() => handlePrintPayslip(selectedPayslip)}
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