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
  Tooltip,
  Modal
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
  FaUsers,
  FaBuilding,
  FaDollarSign,
  FaMapMarker
} from 'react-icons/fa';
import './DepartmentList.css';

const DepartmentList = ({ 
  departments, 
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
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedRows, setSelectedRows] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [viewDepartment, setViewDepartment] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

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
  const sortedDepartments = [...departments].sort((a, b) => {
    let aVal = a[sortField] || '';
    let bVal = b[sortField] || '';
    
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();
    
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalItems = sortedDepartments.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentData = sortedDepartments.slice(startIndex, endIndex);

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
    return (
      <Badge bg={status === 'Active' ? 'success' : 'secondary'} className="status-badge">
        {status}
      </Badge>
    );
  };

  const handleViewClick = (department) => {
    setViewDepartment(department);
    setShowViewModal(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    onDelete(deleteId);
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="department-list-wrapper">
      {/* Toolbar */}
      <div className="list-toolbar">
        <div className="toolbar-left">
          <InputGroup style={{ width: '300px' }}>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search by name, code, manager..."
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
                Active
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleFilter('inactive')}>
                Inactive
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

      {/* Department Count */}
      <div className="department-count">
        <span>
          Showing {startIndex + 1} to {endIndex} of {totalItems} departments
        </span>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <Table hover striped className="department-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>
                <Form.Check
                  type="checkbox"
                  checked={currentData.length > 0 && selectedRows.length === currentData.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th onClick={() => handleSort('code')} style={{ cursor: 'pointer', width: '80px' }}>
                Code {getSortIcon('code')}
              </th>
              <th onClick={() => handleSort('name')} style={{ cursor: 'pointer', minWidth: '180px' }}>
                Department Name {getSortIcon('name')}
              </th>
              <th onClick={() => handleSort('manager')} style={{ cursor: 'pointer' }}>
                Manager {getSortIcon('manager')}
              </th>
              <th onClick={() => handleSort('employeeCount')} style={{ cursor: 'pointer' }}>
                Employees {getSortIcon('employeeCount')}
              </th>
              <th onClick={() => handleSort('budget')} style={{ cursor: 'pointer' }}>
                Budget {getSortIcon('budget')}
              </th>
              <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                Status {getSortIcon('status')}
              </th>
              <th style={{ width: '140px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((department) => (
                <tr key={department.id} className={selectedRows.includes(department.id) ? 'table-active' : ''}>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={selectedRows.includes(department.id)}
                      onChange={() => handleSelectRow(department.id)}
                    />
                  </td>
                  <td>
                    <Badge bg="primary" className="code-badge">
                      {department.code}
                    </Badge>
                  </td>
                  <td>
                    <div className="department-info">
                      <div className="department-icon-wrapper">
                        <FaBuilding className="department-icon" />
                      </div>
                      <div className="department-details">
                        <div className="department-name">{department.name}</div>
                        <div className="department-location">
                          <FaMapMarker className="me-1" />
                          {department.location}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{department.manager}</td>
                  <td>
                    <div className="employee-count-badge">
                      <FaUsers className="me-1" />
                      {department.employeeCount}
                    </div>
                  </td>
                  <td>{formatCurrency(department.budget)}</td>
                  <td>{getStatusBadge(department.status)}</td>
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
                          onClick={() => handleViewClick(department)}
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
                          onClick={() => onEdit(department)}
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
                          onClick={() => handleDeleteClick(department.id)}
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
                    <p className="text-muted mb-2">No departments found</p>
                    <Button variant="primary" size="sm">
                      Add New Department
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

      {/* View Department Modal */}
      <Modal 
        show={showViewModal} 
        onHide={() => setShowViewModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FaBuilding className="me-2" />
            Department Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewDepartment && (
            <div className="view-department-content">
              <div className="view-header">
                <div className="view-icon">
                  <FaBuilding />
                </div>
                <div className="view-title">
                  <h4>{viewDepartment.name}</h4>
                  <Badge bg="primary" className="view-code">{viewDepartment.code}</Badge>
                  {getStatusBadge(viewDepartment.status)}
                </div>
              </div>

              <div className="view-grid">
                <div className="view-item">
                  <span className="view-label">Manager</span>
                  <span className="view-value">{viewDepartment.manager}</span>
                </div>
                <div className="view-item">
                  <span className="view-label">Location</span>
                  <span className="view-value">{viewDepartment.location}</span>
                </div>
                <div className="view-item">
                  <span className="view-label">Employees</span>
                  <span className="view-value">{viewDepartment.employeeCount}</span>
                </div>
                <div className="view-item">
                  <span className="view-label">Budget</span>
                  <span className="view-value">{formatCurrency(viewDepartment.budget)}</span>
                </div>
                <div className="view-item">
                  <span className="view-label">Established</span>
                  <span className="view-value">
                    {new Date(viewDepartment.establishedDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              <div className="view-description">
                <h6>Description</h6>
                <p>{viewDepartment.description}</p>
              </div>

              {viewDepartment.projects && viewDepartment.projects.length > 0 && (
                <div className="view-projects">
                  <h6>Projects</h6>
                  <div className="projects-list">
                    {viewDepartment.projects.map((project, index) => (
                      <Badge key={index} bg="info" className="project-badge">
                        {project}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {viewDepartment.employees && viewDepartment.employees.length > 0 && (
                <div className="view-employees">
                  <h6>Team Members</h6>
                  <div className="employees-list">
                    {viewDepartment.employees.map((employee, index) => (
                      <Badge key={index} bg="secondary" className="employee-badge">
                        {employee}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
          <Button 
            variant="primary" 
            onClick={() => {
              setShowViewModal(false);
              onEdit(viewDepartment);
            }}
          >
            <FaEdit className="me-1" /> Edit Department
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this department?</p>
          <p className="text-danger">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            <FaTrash className="me-1" /> Delete Department
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DepartmentList;