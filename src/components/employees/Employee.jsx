import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Tabs, Tab, Modal, Alert, Spinner } from 'react-bootstrap';
import { FaPlus, FaDownload, FaFilter, FaSearch, FaUserPlus, FaUpload } from 'react-icons/fa';
import EmployeeList from './EmployeeList';
import EmployeeForm from './EmployeeForm';
import EmployeeDetails from './EmployeeDetails';
import './Employee.css';

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

  // Mock data - In real app, this would come from API
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockEmployees = [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+1 234 567 8900',
          department: 'Software',
          position: 'Senior Developer',
          joinDate: '2023-01-15',
          status: 'Active',
          salary: 75000,
          address: '123 Main St, New York, NY 10001',
          emergencyContact: '+1 234 567 8901',
          avatar: 'JD',
          skills: ['React', 'Node.js', 'Python', 'AWS'],
          projects: ['E-commerce Platform', 'Mobile App'],
          performance: 'Excellent'
        },
        {
          id: 2,
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
          phone: '+1 345 678 9012',
          department: 'Marketing',
          position: 'Marketing Manager',
          joinDate: '2022-06-20',
          status: 'Active',
          salary: 65000,
          address: '456 Oak Ave, Los Angeles, CA 90001',
          emergencyContact: '+1 345 678 9013',
          avatar: 'JS',
          skills: ['Digital Marketing', 'SEO', 'Content Strategy', 'Analytics'],
          projects: ['Brand Campaign', 'Social Media Strategy'],
          performance: 'Good'
        },
        {
          id: 3,
          firstName: 'Mike',
          lastName: 'Johnson',
          email: 'mike.johnson@example.com',
          phone: '+1 456 789 0123',
          department: 'Electrical',
          position: 'Electrical Engineer',
          joinDate: '2021-09-10',
          status: 'Active',
          salary: 70000,
          address: '789 Pine Rd, Chicago, IL 60601',
          emergencyContact: '+1 456 789 0124',
          avatar: 'MJ',
          skills: ['AutoCAD', 'Circuit Design', 'PLC Programming', 'MATLAB'],
          projects: ['Factory Automation', 'Power Systems'],
          performance: 'Excellent'
        },
        {
          id: 4,
          firstName: 'Sarah',
          lastName: 'Williams',
          email: 'sarah.williams@example.com',
          phone: '+1 567 890 1234',
          department: 'Production',
          position: 'Production Supervisor',
          joinDate: '2020-03-05',
          status: 'Leave',
          salary: 58000,
          address: '321 Elm St, Houston, TX 77001',
          emergencyContact: '+1 567 890 1235',
          avatar: 'SW',
          skills: ['Lean Manufacturing', 'Quality Control', 'Supply Chain'],
          projects: ['Production Optimization', 'Quality Improvement'],
          performance: 'Good'
        },
        {
          id: 5,
          firstName: 'Robert',
          lastName: 'Brown',
          email: 'robert.brown@example.com',
          phone: '+1 678 901 2345',
          department: 'Software',
          position: 'Frontend Developer',
          joinDate: '2023-03-01',
          status: 'Active',
          salary: 68000,
          address: '654 Oak Dr, San Francisco, CA 94101',
          emergencyContact: '+1 678 901 2346',
          avatar: 'RB',
          skills: ['JavaScript', 'React', 'CSS', 'UI/UX Design'],
          projects: ['Dashboard Redesign', 'Mobile Responsive Site'],
          performance: 'Excellent'
        },
        {
          id: 6,
          firstName: 'Emily',
          lastName: 'Davis',
          email: 'emily.davis@example.com',
          phone: '+1 789 012 3456',
          department: 'HR',
          position: 'HR Coordinator',
          joinDate: '2022-11-12',
          status: 'Active',
          salary: 52000,
          address: '987 Maple Ave, Boston, MA 02101',
          emergencyContact: '+1 789 012 3457',
          avatar: 'ED',
          skills: ['Recruitment', 'Employee Relations', 'Payroll', 'Training'],
          projects: ['Onboarding Program', 'Employee Engagement'],
          performance: 'Good'
        }
      ];

      setEmployees(mockEmployees);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError('Failed to load employees. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async (employeeData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newEmployee = {
        ...employeeData,
        id: employees.length + 1,
        avatar: employeeData.firstName.charAt(0) + employeeData.lastName.charAt(0),
        status: 'Active',
        performance: 'Good'
      };
      
      setEmployees([...employees, newEmployee]);
      setShowForm(false);
      setError('');
    } catch (error) {
      setError('Failed to add employee. Please try again.');
    }
  };

  const handleUpdateEmployee = async (employeeData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedEmployees = employees.map(emp => 
        emp.id === employeeData.id ? { ...emp, ...employeeData } : emp
      );
      
      setEmployees(updatedEmployees);
      setShowForm(false);
      setEditingEmployee(null);
      setError('');
    } catch (error) {
      setError('Failed to update employee. Please try again.');
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setEmployees(employees.filter(emp => emp.id !== id));
        setShowDetails(false);
        setError('');
      } catch (error) {
        setError('Failed to delete employee. Please try again.');
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