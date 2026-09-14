import React, { useState } from 'react';
import {
  Table,
  Badge,
  Button,
  Dropdown,
  Pagination,
  Form,
  InputGroup,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaFileExport,
  FaPrint
} from 'react-icons/fa';
import './Attendance.css';

const AttendanceTable = ({ data, getStatusBadge, onRefresh }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('employeeName');
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
  const filteredData = data.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.employeeName.toLowerCase().includes(searchLower) ||
      item.department.toLowerCase().includes(searchLower) ||
      item.status.toLowerCase().includes(searchLower) ||
      (item.leaveReason && item.leaveReason.toLowerCase().includes(searchLower))
    );
  });

  // Handle sort
  const sortedData = [...filteredData].sort((a, b) => {
    let aVal = a[sortField] || '';
    let bVal = b[sortField] || '';
    
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();
    
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalItems = sortedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentData = sortedData.slice(startIndex, endIndex);

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

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="attendance-table-wrapper">
      {/* Table Controls */}
      <div className="table-controls">
        <div className="controls-left">
          <InputGroup style={{ width: '300px' }}>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search by name, department, status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>

          <div className="table-export-actions">
            <Dropdown>
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
          
          <div className="selection-info">
            {selectedRows.length > 0 && (
              <span className="text-muted">
                {selectedRows.length} item{selectedRows.length > 1 ? 's' : ''} selected
              </span>
            )}
          </div>
        </div>

      </div>

      {/* Table */}
      <div className="table-responsive">
        <Table hover striped className="attendance-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>
                <Form.Check
                  type="checkbox"
                  checked={currentData.length > 0 && selectedRows.length === currentData.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th onClick={() => handleSort('employeeName')} style={{ cursor: 'pointer' }}>
                Employee {getSortIcon('employeeName')}
              </th>
              <th onClick={() => handleSort('department')} style={{ cursor: 'pointer' }}>
                Department {getSortIcon('department')}
              </th>
              <th onClick={() => handleSort('date')} style={{ cursor: 'pointer' }}>
                Date {getSortIcon('date')}
              </th>
              <th onClick={() => handleSort('checkIn')} style={{ cursor: 'pointer' }}>
                Check In {getSortIcon('checkIn')}
              </th>
              <th onClick={() => handleSort('checkOut')} style={{ cursor: 'pointer' }}>
                Check Out {getSortIcon('checkOut')}
              </th>
              <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                Status {getSortIcon('status')}
              </th>
              <th onClick={() => handleSort('workingHours')} style={{ cursor: 'pointer' }}>
                Hours {getSortIcon('workingHours')}
              </th>
              <th style={{ width: '144px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((item) => (
                <tr key={item.id} className={selectedRows.includes(item.id) ? 'table-active' : ''}>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={selectedRows.includes(item.id)}
                      onChange={() => handleSelectRow(item.id)}
                    />
                  </td>
                  <td>
                    <div className="employee-info">
                      <div className="employee-avatar">
                        {item.avatar || item.employeeName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="employee-details">
                        <div className="employee-name">{item.employeeName}</div>
                        <div className="employee-id">#{item.employeeId || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <Badge bg="secondary" className="department-badge">
                      {item.department}
                    </Badge>
                  </td>
                  <td>{formatDate(item.date)}</td>
                  <td>{item.checkIn || '--'}</td>
                  <td>{item.checkOut || '--'}</td>
                  <td>{getStatusBadge(item.status)}</td>
                  <td>
                    <div className="hours-info">
                      <div className="working-hours">{item.workingHours}</div>
                      {item.overtime && item.overtime !== '0h' && (
                        <small className="overtime">+{item.overtime} OT</small>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>View Details</Tooltip>}
                      >
                        <Button variant="outline-primary" size="sm" className="me-1">
                          <FaEye />
                        </Button>
                      </OverlayTrigger>
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Edit</Tooltip>}
                      >
                        <Button variant="outline-warning" size="sm" className="me-1">
                          <FaEdit />
                        </Button>
                      </OverlayTrigger>
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Delete</Tooltip>}
                      >
                        <Button variant="outline-danger" size="sm">
                          <FaTrash />
                        </Button>
                      </OverlayTrigger>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-4">
                  <div className="empty-state">
                    <p className="text-muted">No attendance records found</p>
                    <Button variant="primary" size="sm" onClick={onRefresh}>
                      Refresh Data
                    </Button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Table Footer with Pagination */}
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

export default AttendanceTable;
