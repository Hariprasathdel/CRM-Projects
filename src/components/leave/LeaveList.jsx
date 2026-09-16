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
  FaCheck,
  FaTimes,
  FaClock,
  FaFileExport,
  FaPrint,
  FaCalendarAlt
} from 'react-icons/fa';
import './LeaveList.css';

const LeaveList = ({ 
  leaves, 
  onView, 
  onEdit, 
  onDelete,
  onApprove,
  onReject,
  searchTerm,
  setSearchTerm,
  filter,
  setFilter
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState('appliedDate');
  const [sortDirection, setSortDirection] = useState('desc');
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
  const sortedLeaves = [...leaves].sort((a, b) => {
    let aVal = a[sortField] || '';
    let bVal = b[sortField] || '';
    
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();
    
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalItems = sortedLeaves.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentData = sortedLeaves.slice(startIndex, endIndex);

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
      Approved: { variant: 'success', icon: <FaCheck /> },
      Pending: { variant: 'warning', icon: <FaClock /> },
      Rejected: { variant: 'danger', icon: <FaTimes /> }
    };
    const { variant, icon } = config[status] || config.Pending;
    return (
      <Badge bg={variant} className="status-badge">
        {icon} {status}
      </Badge>
    );
  };

  const getLeaveTypeBadge = (type) => {
    const config = {
      Annual: 'primary',
      Sick: 'info',
      Emergency: 'danger',
      Personal: 'secondary',
      Maternity: 'warning',
      Paternity: 'warning'
    };
    return (
      <Badge bg={config[type] || 'secondary'} className="type-badge">
        {type}
      </Badge>
    );
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="leave-list-wrapper">
      {/* Toolbar */}
      <div className="list-toolbar">
        <div className="toolbar-left">
          <InputGroup style={{ width: '300px' }}>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search by name, ID, department..."
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
              <Dropdown.Item onClick={() => handleFilter('pending')}>
                <FaClock className="text-warning me-1" /> Pending
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleFilter('approved')}>
                <FaCheck className="text-success me-1" /> Approved
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleFilter('rejected')}>
                <FaTimes className="text-danger me-1" /> Rejected
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

      {/* Leave Count */}
      <div className="leave-count">
        <span>
          Showing {startIndex + 1} to {endIndex} of {totalItems} applications
        </span>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <Table hover striped className="leave-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>
                <Form.Check
                  type="checkbox"
                  checked={currentData.length > 0 && selectedRows.length === currentData.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th onClick={() => handleSort('employeeName')} style={{ cursor: 'pointer', minWidth: '160px' }}>
                Employee {getSortIcon('employeeName')}
              </th>
              <th onClick={() => handleSort('type')} style={{ cursor: 'pointer' }}>
                Type {getSortIcon('type')}
              </th>
              <th onClick={() => handleSort('startDate')} style={{ cursor: 'pointer' }}>
                Duration {getSortIcon('startDate')}
              </th>
              <th onClick={() => handleSort('totalDays')} style={{ cursor: 'pointer', width: '80px' }}>
                Days {getSortIcon('totalDays')}
              </th>
              <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                Status {getSortIcon('status')}
              </th>
              <th style={{ width: '180px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((leave) => (
                <tr key={leave.id} className={selectedRows.includes(leave.id) ? 'table-active' : ''}>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={selectedRows.includes(leave.id)}
                      onChange={() => handleSelectRow(leave.id)}
                    />
                  </td>
                  <td>
                    <div className="employee-info">
                      <div className="employee-avatar">
                        {leave.avatar || (leave.employeeName || 'EM').split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="employee-details">
                        <div className="employee-name">{leave.employeeName}</div>
                        <div className="employee-id">#{leave.employeeId}</div>
                      </div>
                    </div>
                  </td>
                  <td>{getLeaveTypeBadge(leave.type)}</td>
                  <td>
                    <div className="duration-info">
                      <div className="duration-dates">
                        {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                      </div>
                    </div>
                  </td>
                  <td>
                    <Badge bg="secondary" className="days-badge">
                      {leave.totalDays} {leave.totalDays > 1 ? 'days' : 'day'}
                    </Badge>
                  </td>
                  <td>{getStatusBadge(leave.status)}</td>
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
                          onClick={() => onView(leave)}
                        >
                          <FaEye />
                        </Button>
                      </OverlayTrigger>
                      
                      {leave.status === 'Pending' && (
                        <>
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Approve</Tooltip>}
                          >
                            <Button 
                              variant="outline-success" 
                              size="sm" 
                              className="me-1"
                              onClick={() => onApprove(leave.id)}
                            >
                              <FaCheck />
                            </Button>
                          </OverlayTrigger>
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Reject</Tooltip>}
                          >
                            <Button 
                              variant="outline-danger" 
                              size="sm" 
                              className="me-1"
                              onClick={() => onReject(leave.id)}
                            >
                              <FaTimes />
                            </Button>
                          </OverlayTrigger>
                        </>
                      )}
                      
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Edit</Tooltip>}
                      >
                        <Button 
                          variant="outline-warning" 
                          size="sm" 
                          className="me-1"
                          onClick={() => onEdit(leave)}
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
                          onClick={() => onDelete(leave.id)}
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
                <td colSpan="7" className="text-center py-4">
                  <div className="empty-state">
                    <p className="text-muted mb-2">No leave applications found</p>
                    <Button variant="primary" size="sm">
                      Apply for Leave
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

export default LeaveList;