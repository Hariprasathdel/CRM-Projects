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
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaClock,
  FaFileExport,
  FaPrint,
  FaGift,
  FaTrophy,
  FaMedal,
  FaStar
} from 'react-icons/fa';
import './AwardList.css';

const AwardList = ({ 
  awards, 
  onEdit, 
  onDelete,
  onApprove,
  onReject,
  setShowForm,
  searchTerm,
  setSearchTerm,
  filter,
  setFilter
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState('date');
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
  const sortedAwards = [...awards].sort((a, b) => {
    let aVal = a[sortField] || '';
    let bVal = b[sortField] || '';
    
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();
    
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalItems = sortedAwards.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentData = sortedAwards.slice(startIndex, endIndex);

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

  const getAwardTypeIcon = (type) => {
    const config = {
      Certificate: <FaTrophy className="award-type-icon certificate" />,
      Monetary: <FaMedal className="award-type-icon monetary" />,
      Recognition: <FaStar className="award-type-icon recognition" />,
      'Team Award': <FaGift className="award-type-icon team" />
    };
    return config[type] || <FaGift />;
  };

  const getAwardTypeBadge = (type) => {
    const config = {
      Certificate: 'info',
      Monetary: 'success',
      Recognition: 'warning',
      'Team Award': 'primary'
    };
    return (
      <Badge bg={config[type] || 'secondary'} className="type-badge">
        {type}
      </Badge>
    );
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="award-list-wrapper">
      {/* Toolbar */}
      <div className="list-toolbar">
        <div className="toolbar-left">
          <InputGroup style={{ width: '300px' }}>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search awards..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </InputGroup>
          
          <Dropdown className="me-2">
            <Dropdown.Toggle variant="outline-secondary" size="sm">
              <FaFilter className="me-1" /> 
              {filter === 'all' ? 'All Status' : filter}
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

      {/* Award Count */}
      <div className="award-count">
        <span>
          Showing {startIndex + 1} to {endIndex} of {totalItems} awards
        </span>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <Table hover striped className="award-table">
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
              <th onClick={() => handleSort('awardName')} style={{ cursor: 'pointer', minWidth: '140px' }}>
                Award {getSortIcon('awardName')}
              </th>
              <th onClick={() => handleSort('department')} style={{ cursor: 'pointer' }}>
                Department {getSortIcon('department')}
              </th>
              <th onClick={() => handleSort('awardType')} style={{ cursor: 'pointer' }}>
                Type {getSortIcon('awardType')}
              </th>
              <th onClick={() => handleSort('points')} style={{ cursor: 'pointer' }}>
                Points {getSortIcon('points')}
              </th>
              <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                Status {getSortIcon('status')}
              </th>
              <th style={{ width: '180px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((award) => (
                <tr key={award.id} className={selectedRows.includes(award.id) ? 'table-active' : ''}>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={selectedRows.includes(award.id)}
                      onChange={() => handleSelectRow(award.id)}
                    />
                  </td>
                  <td>
                    <div className="employee-info">
                      <div className="employee-avatar">
                        {award.avatar || award.employeeName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </div>
                      <div className="employee-details">
                        <div className="employee-name">{award.employeeName}</div>
                        <div className="employee-id">#{award.employeeId}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="award-info">
                      <span className="award-icon">{getAwardTypeIcon(award.awardType)}</span>
                      <span className="award-name">{award.awardName}</span>
                    </div>
                  </td>
                  <td>
                    <Badge bg="secondary" className="department-badge">
                      {award.department}
                    </Badge>
                  </td>
                  <td>{getAwardTypeBadge(award.awardType)}</td>
                  <td>
                    <Badge bg="primary" className="points-badge">
                      <FaStar className="points-star" /> {award.points}
                    </Badge>
                  </td>
                  <td>{getStatusBadge(award.status)}</td>
                  <td>
                    <div className="action-buttons">
                      {award.status === 'Pending' && (
                        <>
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Approve</Tooltip>}
                          >
                            <Button 
                              variant="outline-success" 
                              size="sm" 
                              className="me-1"
                              onClick={() => onApprove(award.id)}
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
                              onClick={() => onReject(award.id)}
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
                          onClick={() => onEdit(award)}
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
                          onClick={() => onDelete(award.id)}
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
                    <p className="text-muted mb-2">No awards found</p>
                    <Button variant="primary" size="sm" onClick={() => setShowForm(true)}>
                      Give New Award
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

export default AwardList;