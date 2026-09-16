import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Tabs, Tab, Modal, Alert, Spinner } from 'react-bootstrap';
import { FaPlus, FaDownload, FaFilter, FaSearch, FaUserPlus, FaUpload } from 'react-icons/fa';
import EmployeeList from './EmployeeList';
import EmployeeForm from './EmployeeForm';
import EmployeeDetails from './EmployeeDetails';
import employeeService from '../../services/employeeService';
import './Employee.css';

const normalizeEmployee = (emp) => {
  const parts = (emp.name || '').trim().split(' ');
  const firstName = emp.firstName || parts[0] || '';
  const lastName = emp.lastName || parts.slice(1).join(' ') || '';
  return {
    ...emp,
    id: emp._id || emp.id,
    firstName,
    lastName,
    name: emp.name || `${firstName} ${lastName}`.trim(),
    avatar: emp.avatar || ((firstName[0] || 'E') + (lastName[0] || 'M')).toUpperCase(),
    status: (emp.status || 'Active').charAt(0).toUpperCase() + (emp.status || 'Active').slice(1).toLowerCase(),
    performance: emp.performance || 'Good'
  };
};

const Employee = () => {
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [editingEmployee, setEditingEmployee] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await employeeService.getAllEmployees({ limit: 100 });
      if (res.success && res.data) {
        const list = res.data.data || res.data.employees || (Array.isArray(res.data) ? res.data : []);
        if (list.length > 0) {
          setEmployees(list.map(normalizeEmployee));
          return;
        }
      }
      setEmployees([]);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Failed to load employees from database.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async (employeeData) => {
    try {
      const name = `${employeeData.firstName || ''} ${employeeData.lastName || ''}`.trim() || employeeData.name;
      const payload = {
        ...employeeData,
        name,
        phone: employeeData.phone || '+1 555 123 4567',
        department: employeeData.department || 'Software Development',
        position: employeeData.position || 'Developer',
        status: (employeeData.status || 'active').toLowerCase()
      };
      const res = await employeeService.createEmployee(payload);
      if (res.success) {
        await fetchEmployees();
        setShowForm(false);
        setError('');
      } else {
        setError(res.error?.message || 'Failed to add employee');
      }
    } catch (err) {
      setError(err.message || 'Failed to add employee. Please try again.');
    }
  };

  const handleUpdateEmployee = async (employeeData) => {
    try {
      const name = `${employeeData.firstName || ''} ${employeeData.lastName || ''}`.trim() || employeeData.name;
      const payload = {
        ...employeeData,
        name,
        status: (employeeData.status || 'active').toLowerCase()
      };
      const id = employeeData.id || employeeData._id;
      const res = await employeeService.updateEmployee(id, payload);
      if (res.success) {
        await fetchEmployees();
        setShowForm(false);
        setEditingEmployee(null);
        setError('');
      } else {
        setError(res.error?.message || 'Failed to update employee');
      }
    } catch (err) {
      setError(err.message || 'Failed to update employee. Please try again.');
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const res = await employeeService.deleteEmployee(id);
        if (res.success) {
          setEmployees(prev => prev.filter(emp => emp.id !== id && emp._id !== id));
          setShowDetails(false);
          setError('');
        } else {
          setError(res.error?.message || 'Failed to delete employee');
        }
      } catch (err) {
        setError(err.message || 'Failed to delete employee. Please try again.');
      }
    }
  };

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowDetails(true);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleExport = () => {
    // Implement export functionality
    console.log('Exporting employee data...');
  };

  const handleImport = () => {
    // Implement import functionality
    console.log('Importing employee data...');
  };

  const filteredEmployees = employees.filter(emp => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      emp.firstName.toLowerCase().includes(searchLower) ||
      emp.lastName.toLowerCase().includes(searchLower) ||
      emp.email.toLowerCase().includes(searchLower) ||
      emp.department.toLowerCase().includes(searchLower) ||
      emp.position.toLowerCase().includes(searchLower);
    
    const matchesFilter = filter === 'all' || emp.status.toLowerCase() === filter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="employee-page">
      <Container fluid>
        {/* Header Section */}
        <div className="employee-header">
          <div className="header-left">
            <h2 className="page-title">Employee Management</h2>
            <p className="page-subtitle">Manage all employee information and records</p>
          </div>
          <div className="header-right">
            <Button 
              variant="primary" 
              className="me-2"
              onClick={() => {
                setEditingEmployee(null);
                setShowForm(true);
              }}
            >
              <FaPlus className="me-1" /> Add Employee
            </Button>
            <Button variant="outline-secondary" className="me-2" onClick={handleImport}>
              <FaUpload className="me-1" /> Import
            </Button>
            <Button variant="outline-secondary" onClick={handleExport}>
              <FaDownload className="me-1" /> Export
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="danger" onClose={() => setError('')} dismissible>
            {error}
          </Alert>
        )}

        {/* Employee List */}
        <Card className="employee-main-card">
          <Card.Body>
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-muted">Loading employees...</p>
              </div>
            ) : (
              <EmployeeList 
                employees={filteredEmployees}
                onView={handleViewEmployee}
                onEdit={handleEditEmployee}
                onDelete={handleDeleteEmployee}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filter={filter}
                setFilter={setFilter}
              />
            )}
          </Card.Body>
        </Card>

        {/* Employee Form Modal */}
        <Modal 
          show={showForm} 
          onHide={() => {
            setShowForm(false);
            setEditingEmployee(null);
          }}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <FaUserPlus className="me-2" />
              {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <EmployeeForm 
              employee={editingEmployee}
              onSubmit={editingEmployee ? handleUpdateEmployee : handleAddEmployee}
              onCancel={() => {
                setShowForm(false);
                setEditingEmployee(null);
              }}
            />
          </Modal.Body>
        </Modal>

        {/* Employee Details Modal */}
        <Modal 
          show={showDetails} 
          onHide={() => setShowDetails(false)}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Employee Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedEmployee && (
              <EmployeeDetails 
                employee={selectedEmployee}
                onEdit={() => {
                  setShowDetails(false);
                  handleEditEmployee(selectedEmployee);
                }}
                onDelete={() => handleDeleteEmployee(selectedEmployee.id)}
                onClose={() => setShowDetails(false)}
              />
            )}
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};

export default Employee;