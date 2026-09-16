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
  Badge
} from 'react-bootstrap';
import { 
  FaPlus, 
  FaDownload, 
  FaUpload, 
  FaBuilding, 
  FaUsers,
  FaChartBar,
  FaEdit,
  FaTrash
} from 'react-icons/fa';
import DepartmentList from './DepartmentList';
import DepartmentForm from './DepartmentForm';
import departmentService from '../../services/departmentService';
import './Department.css';

const Department = () => {
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  // Mock data - In real app, this would come from API
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await departmentService.getAllDepartments({ limit: 100 });
      if (res.success && res.data) {
        const list = res.data.data || res.data.departments || (Array.isArray(res.data) ? res.data : []);
        if (list.length > 0) {
          setDepartments(list.map(dept => ({
            ...dept,
            id: dept._id || dept.id,
            employeeCount: dept.employeeCount || 0,
            status: (dept.status || 'Active').charAt(0).toUpperCase() + (dept.status || 'Active').slice(1).toLowerCase(),
            manager: dept.head || dept.manager || 'Unassigned'
          })));
          return;
        }
      }
      setDepartments([]);
    } catch (err) {
      console.error('Error fetching departments:', err);
      setError('Failed to load departments from database.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDepartment = async (departmentData) => {
    setLoading(true);
    try {
      const payload = {
        ...departmentData,
        head: departmentData.manager || departmentData.head,
        status: (departmentData.status || 'active').toLowerCase()
      };
      const res = await departmentService.createDepartment(payload);
      if (res.success) {
        await fetchDepartments();
        setShowForm(false);
        setSuccess('Department added successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(res.error?.message || 'Failed to add department');
      }
    } catch (err) {
      setError(err.message || 'Failed to add department. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDepartment = async (departmentData) => {
    setLoading(true);
    try {
      const id = departmentData.id || departmentData._id;
      const payload = {
        ...departmentData,
        head: departmentData.manager || departmentData.head,
        status: (departmentData.status || 'active').toLowerCase()
      };
      const res = await departmentService.updateDepartment(id, payload);
      if (res.success) {
        await fetchDepartments();
        setShowForm(false);
        setEditingDepartment(null);
        setSuccess('Department updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(res.error?.message || 'Failed to update department');
      }
    } catch (err) {
      setError(err.message || 'Failed to update department. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDepartment = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        const res = await departmentService.deleteDepartment(id);
        if (res.success) {
          setDepartments(prev => prev.filter(dept => dept.id !== id && dept._id !== id));
          setSuccess('Department deleted successfully!');
          setTimeout(() => setSuccess(''), 3000);
        } else {
          setError(res.error?.message || 'Failed to delete department');
        }
      } catch (err) {
        setError(err.message || 'Failed to delete department. Please try again.');
      }
    }
  };

  const handleViewDepartment = (department) => {
    setSelectedDepartment(department);
  };

  const handleEditDepartment = (department) => {
    setEditingDepartment(department);
    setShowForm(true);
  };

  const handleExport = () => {
    console.log('Exporting department data...');
    setSuccess('Departments exported successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleImport = () => {
    console.log('Importing department data...');
    setSuccess('Departments imported successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const filteredDepartments = departments.filter(dept => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      dept.name.toLowerCase().includes(searchLower) ||
      dept.code.toLowerCase().includes(searchLower) ||
      dept.manager.toLowerCase().includes(searchLower) ||
      dept.location.toLowerCase().includes(searchLower);
    
    const matchesFilter = filter === 'all' || dept.status.toLowerCase() === filter;
    
    return matchesSearch && matchesFilter;
  });

  // Statistics
  const totalDepartments = departments.length;
  const activeDepartments = departments.filter(d => d.status === 'Active').length;
  const totalEmployees = departments.reduce((sum, dept) => sum + dept.employeeCount, 0);
  const totalBudget = departments.reduce((sum, dept) => sum + dept.budget, 0);

  return (
    <div className="department-page">
      <Container fluid>
        {/* Header Section */}
        <div className="department-header">
          <div className="header-left">
            <h2 className="page-title">Department Management</h2>
            <p className="page-subtitle">Manage all departments and their information</p>
          </div>
          <div className="header-right">
            <Button 
              variant="primary" 
              className="me-2"
              onClick={() => {
                setEditingDepartment(null);
                setShowForm(true);
              }}
            >
              <FaPlus className="me-1" /> Add Department
            </Button>
            <Button variant="outline-secondary" className="me-2" onClick={handleImport}>
              <FaUpload className="me-1" /> Import
            </Button>
            <Button variant="outline-secondary" onClick={handleExport}>
              <FaDownload className="me-1" /> Export
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <Row className="statistics-cards mb-4">
          <Col lg={3} md={6} className="mb-3">
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon-wrapper primary">
                    <FaBuilding className="stat-icon" />
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">{totalDepartments}</h3>
                    <p className="stat-label">Total Departments</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={3} md={6} className="mb-3">
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon-wrapper success">
                    <FaUsers className="stat-icon" />
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">{totalEmployees}</h3>
                    <p className="stat-label">Total Employees</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={3} md={6} className="mb-3">
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon-wrapper info">
                    <FaChartBar className="stat-icon" />
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">{activeDepartments}</h3>
                    <p className="stat-label">Active Departments</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={3} md={6} className="mb-3">
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon-wrapper warning">
                    <FaChartBar className="stat-icon" />
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">${(totalBudget / 1000).toFixed(0)}K</h3>
                    <p className="stat-label">Total Budget</p>
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

        {/* Department List */}
        <Card className="department-main-card">
          <Card.Body>
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-muted">Loading departments...</p>
              </div>
            ) : (
              <DepartmentList 
                departments={filteredDepartments}
                onView={handleViewDepartment}
                onEdit={handleEditDepartment}
                onDelete={handleDeleteDepartment}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filter={filter}
                setFilter={setFilter}
              />
            )}
          </Card.Body>
        </Card>

        {/* Department Form Modal */}
        <Modal 
          show={showForm} 
          onHide={() => {
            setShowForm(false);
            setEditingDepartment(null);
          }}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <FaBuilding className="me-2" />
              {editingDepartment ? 'Edit Department' : 'Add New Department'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <DepartmentForm 
              department={editingDepartment}
              onSubmit={editingDepartment ? handleUpdateDepartment : handleAddDepartment}
              onCancel={() => {
                setShowForm(false);
                setEditingDepartment(null);
              }}
            />
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};

export default Department;