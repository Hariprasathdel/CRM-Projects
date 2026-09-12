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
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock Employees
      const mockEmployees = [
        { id: 1, name: 'John Doe', department: 'Software', position: 'Senior Developer', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', department: 'Marketing', position: 'Marketing Manager', email: 'jane@example.com' },
        { id: 3, name: 'Mike Johnson', department: 'Electrical', position: 'Electrical Engineer', email: 'mike@example.com' },
        { id: 4, name: 'Sarah Williams', department: 'Production', position: 'Production Supervisor', email: 'sarah@example.com' },
        { id: 5, name: 'Robert Brown', department: 'Software', position: 'Frontend Developer', email: 'robert@example.com' }
      ];

      // Mock Payslips
      const mockPayslips = [
        {
          id: 1,
          employeeName: 'John Doe',
          employeeId: 'EMP001',
          department: 'Software',
          position: 'Senior Developer',
          month: 'January',
          year: 2026,
          basicSalary: 5000,
          allowance: 1000,
          bonus: 500,
          deductions: 300,
          netSalary: 6200,
          status: 'Generated',
          generatedDate: '2026-01-31',
          payDate: '2026-02-01',
          bankName: 'ABC Bank',
          accountNumber: '1234567890',
          attendance: 22,
          leaveTaken: 0,
          overtime: 10,
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
          allowance: 800,
          bonus: 400,
          deductions: 250,
          netSalary: 5450,
          status: 'Generated',
          generatedDate: '2026-01-31',
          payDate: '2026-02-01',
          bankName: 'XYZ Bank',
          accountNumber: '0987654321',
          attendance: 21,
          leaveTaken: 1,
          overtime: 5,
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
          allowance: 900,
          bonus: 0,
          deductions: 280,
          netSalary: 5420,
          status: 'Pending',
          generatedDate: '2026-01-30',
          payDate: null,
          bankName: 'ABC Bank',
          accountNumber: '5678901234',
          attendance: 20,
          leaveTaken: 2,
          overtime: 8,
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
          allowance: 700,
          bonus: 600,
          deductions: 200,
          netSalary: 5300,
          status: 'Generated',
          generatedDate: '2025-12-31',
          payDate: '2026-01-01',
          bankName: 'XYZ Bank',
          accountNumber: '4321098765',
          attendance: 23,
          leaveTaken: 0,
          overtime: 12,
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
          allowance: 750,
          bonus: 300,
          deductions: 260,
          netSalary: 5390,
          status: 'Pending',
          generatedDate: '2026-01-29',
          payDate: null,
          bankName: 'ABC Bank',
          accountNumber: '7890123456',
          attendance: 22,
          leaveTaken: 0,
          overtime: 6,
          avatar: 'RB'
        }
      ];

      setEmployees(mockEmployees);
      setPayslips(mockPayslips);
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
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newPayslip = {
        ...payslipData,
        id: payslips.length + 1,
        status: 'Pending',
        generatedDate: new Date().toISOString().split('T')[0],
        avatar: payslipData.employeeName.split(' ').map(n => n[0]).join('')
      };
      
      setPayslips([newPayslip, ...payslips]);
      setShowForm(false);
      setSuccess('Payslip generated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to generate payslip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePayslip = async (payslipData) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedPayslips = payslips.map(payslip => 
        payslip.id === payslipData.id ? { ...payslip, ...payslipData } : payslip
      );
      
      setPayslips(updatedPayslips);
      setShowForm(false);
      setEditingPayslip(null);
      setSuccess('Payslip updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to update payslip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePayslip = async (id) => {
    if (window.confirm('Are you sure you want to delete this payslip?')) {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setPayslips(payslips.filter(payslip => payslip.id !== id));
        setSuccess('Payslip deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
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
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedPayslips = payslips.map(payslip => 
        payslip.id === id ? { 
          ...payslip, 
          status: 'Generated',
          payDate: new Date().toISOString().split('T')[0]
        } : payslip
      );
      
      setPayslips(updatedPayslips);
      setSuccess('Payslip generated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to generate payslip. Please try again.');
    }
  };

  const handleDownloadPayslip = (payslip) => {
    console.log('Downloading payslip:', payslip.employeeName);
    setSuccess(`Downloading payslip for ${payslip.employeeName}...`);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handlePrintPayslip = (payslip) => {
    window.print();
  };

  const handleSendEmail = (payslip) => {
    console.log('Sending payslip email to:', payslip.employeeName);
    setSuccess(`Payslip sent to ${payslip.employeeName} via email!`);
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