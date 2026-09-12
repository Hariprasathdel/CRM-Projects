import React, { useState } from 'react';
import {
  Table,
  Form,
  InputGroup,
  Button,
  Dropdown,
  Pagination,
  Badge,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';
import {
  FaSearch,
  FaFilter,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaEye,
  FaEdit,
  FaTrash,
  FaFileExport,
  FaPrint,
  FaUserCheck,
  FaUserTimes,
  FaUserClock
} from 'react-icons/fa';
import './EmployeeList.css';

const EmployeeList = ({ 
  employees, 
  onView, 
  onEdit, 
  onDelete,
  searchTerm,
  setSearchTerm,
  filter,
  setFilter
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState('firstName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedRows, setSelectedRows] = useState([]);

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Handle filter
  const handleFilter = (value) => {
    setFilter(value);
    setCurrentPage(1);
  };

  // Handle sort
  const sortedEmployees = [...employees].sort((a, b) => {
    let aVal = a[sortField] || '';
    let bVal = b[sortField] || '';
    
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();
    
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalItems = sortedEmployees.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentData = sortedEmployees.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(currentData.map(item => item.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort className="sort-icon" />;
    return sortDirection === 'asc' 
      ? <FaSortUp className="sort-icon active" />
      : <FaSortDown className="sort-icon active" />;
  };

  const getStatusBadge = (status) => {
    const config = {
      Active: { variant: 'success', icon: <FaUserCheck /> },
      Leave: { variant: 'warning', icon: <FaUserClock /> },
      Inactive: { variant: 'danger', icon: <FaUserTimes /> }
    };
    const { variant, icon } = config[status] || config.Active;
    return (
      <Badge bg={variant} className="status-badge">
        {icon} {status}
      </Badge>
    );
  };

  const getPerformanceBadge = (performance) => {
    const config = {
      Excellent: 'success',
      Good: 'info',
      Average: 'warning',
      Poor: 'danger'
    };
    return (
      <Badge bg={config[performance] || 'secondary'} className="performance-badge">
        {performance}
      </Badge>
    );
  };

  return (
    <div className="employee-list-wrapper">
      {/* Toolbar */}
      <div className="list-toolbar">
        <div className="toolbar-left">
          <InputGroup style={{ width: '300px' }}>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search by name, email, department..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </InputGroup>
          
          <Dropdown className="me-2">
            <Dropdown.Toggle variant="outline-secondary" size="sm">
              <FaFilter className="me-1" /> 
              {filter === 'all' ? 'All Status' : filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleFilter('all')}>
                All Status
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleFilter('active')}>
                <FaUserCheck className="text-success me-1" /> Active
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleFilter('leave')}>
                <FaUserClock className="text-warning me-1" /> On Leave
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleFilter('inactive')}>
                <FaUserTimes className="text-danger me-1" /> Inactive
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          
          <div className="selection-info">
            {selectedRows.length > 0 && (
              <span className="text-muted">
                {selectedRows.length} item{selectedRows.length > 1 ? 's' : ''} selected
              </span>
            )}
          </div>
        </div>

        <div className="toolbar-right">
          <Dropdown className="me-2">
            <Dropdown.Toggle variant="outline-secondary" size="sm">
              <FaFileExport className="me-1" /> Export
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>Export as CSV</Dropdown.Item>
              <Dropdown.Item>Export as Excel</Dropdown.Item>
              <Dropdown.Item>Export as PDF</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Button variant="outline-secondary" size="sm" onClick={() => window.print()}>
            <FaPrint className="me-1" /> Print
          </Button>
        </div>
      </div>

      {/* Employee Count */}
      <div className="employee-count">
        <span>
          Showing {startIndex + 1} to {endIndex} of {totalItems} employees
        </span>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <Table hover striped className="employee-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>
                <Form.Check
                  type="checkbox"
                  checked={currentData.length > 0 && selectedRows.length === currentData.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th onClick={() => handleSort('firstName')} style={{ cursor: 'pointer', minWidth: '180px' }}>
                Employee {getSortIcon('firstName')}
              </th>
              <th onClick={() => handleSort('department')} style={{ cursor: 'pointer' }}>
                Department {getSortIcon('department')}
              </th>
              <th onClick={() => handleSort('position')} style={{ cursor: 'pointer' }}>
                Position {getSortIcon('position')}
              </th>
              <th onClick={() => handleSort('joinDate')} style={{ cursor: 'pointer' }}>
                Join Date {getSortIcon('joinDate')}
              </th>
              <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                Status {getSortIcon('status')}
              </th>
              <th onClick={() => handleSort('performance')} style={{ cursor: 'pointer' }}>
                Performance {getSortIcon('performance')}
              </th>
              <th style={{ width: '140px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((employee) => (
                <tr key={employee.id} className={selectedRows.includes(employee.id) ? 'table-active' : ''}>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={selectedRows.includes(employee.id)}
                      onChange={() => handleSelectRow(employee.id)}
                    />
                  </td>
                  <td>
                    <div className="employee-info">
                      <div className="employee-avatar">
                        {employee.avatar || employee.firstName.charAt(0) + employee.lastName.charAt(0)}
                      </div>
                      <div className="employee-details">
                        <div className="employee-name">
                          {employee.firstName} {employee.lastName}
                        </div>
                        <div className="employee-email">{employee.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <Badge bg="secondary" className="department-badge">
                      {employee.department}
                    </Badge>
                  </td>
                  <td>{employee.position}</td>
                  <td>{new Date(employee.joinDate).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}</td>
                  <td>{getStatusBadge(employee.status)}</td>
                  <td>{getPerformanceBadge(employee.performance)}</td>
                  <td>
                    <div className="action-buttons">
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>View Details</Tooltip>}
                      >
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          className="me-1"
                          onClick={() => onView(employee)}
                        >
                          <FaEye />
                        </Button>
                      </OverlayTrigger>
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Edit</Tooltip>}
                      >
                        <Button 
                          variant="outline-warning" 
                          size="sm" 
                          className="me-1"
                          onClick={() => onEdit(employee)}
                        >
                          <FaEdit />
                        </Button>
                      </OverlayTrigger>
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Delete</Tooltip>}
                      >
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => onDelete(employee.id)}
                        >
                          <FaTrash />
                        </Button>
                      </OverlayTrigger>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  <div className="empty-state">
                    <p className="text-muted mb-2">No employees found</p>
                    <Button variant="primary" size="sm">
                      Add New Employee
                    </Button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="table-footer">
        <div className="footer-left">
          <span className="text-muted">
            Showing {startIndex + 1} to {endIndex} of {totalItems} entries
          </span>
        </div>

        <div className="footer-right">
          <div className="items-per-page">
            <Form.Label className="me-2 mb-0">Show:</Form.Label>
            <Form.Select
              size="sm"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              style={{ width: '70px' }}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </Form.Select>
          </div>

          <Pagination size="sm" className="mb-0">
            <Pagination.First 
              onClick={() => handlePageChange(1)} 
              disabled={currentPage === 1}
            />
            <Pagination.Prev 
              onClick={() => handlePageChange(currentPage - 1)} 
              disabled={currentPage === 1}
            />
            
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <Pagination.Item
                  key={pageNum}
                  active={pageNum === currentPage}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </Pagination.Item>
              );
            })}
            
            <Pagination.Next 
              onClick={() => handlePageChange(currentPage + 1)} 
              disabled={currentPage === totalPages}
            />
            <Pagination.Last 
              onClick={() => handlePageChange(totalPages)} 
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;