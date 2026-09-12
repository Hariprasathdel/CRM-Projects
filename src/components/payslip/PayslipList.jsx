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
  FaDownload,
  FaPrint,
  FaEnvelope,
  FaCheck,
  FaTimes,
  FaClock,
  FaFileExport,
  FaFileInvoice
} from 'react-icons/fa';
import './PayslipList.css';

const PayslipList = ({ 
  payslips, 
  onView, 
  onEdit, 
  onDelete,
  onGenerate,
  onDownload,
  onPrint,
  onSendEmail,
  searchTerm,
  setSearchTerm,
  filter,
  setFilter,
  formatCurrency
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState('generatedDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedRows, setSelectedRows] = useState([]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilter = (value) => {
    setFilter(value);
    setCurrentPage(1);
  };

  const sortedPayslips = [...payslips].sort((a, b) => {
    let aVal = a[sortField] || '';
    let bVal = b[sortField] || '';
    
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();
    
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const totalItems = sortedPayslips.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentData = sortedPayslips.slice(startIndex, endIndex);

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
      Generated: { variant: 'success', icon: <FaCheck /> },
      Pending: { variant: 'warning', icon: <FaClock /> }
    };
    const { variant, icon } = config[status] || config.Pending;
    return (
      <Badge bg={variant} className="status-badge">
        {icon} {status}
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
    <div className="payslip-list-wrapper">
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
              {filter === 'all' ? 'All Status' : filter}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleFilter('all')}>
                All Status
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleFilter('generated')}>
                <FaCheck className="text-success me-1" /> Generated
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleFilter('pending')}>
                <FaClock className="text-warning me-1" /> Pending
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
        </div>
      </div>

      <div className="payslip-count">
        <span>
          Showing {startIndex + 1} to {endIndex} of {totalItems} payslips
        </span>
      </div>

      <div className="table-responsive">
        <Table hover striped className="payslip-table">
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
              <th onClick={() => handleSort('month')} style={{ cursor: 'pointer' }}>
                Month/Year {getSortIcon('month')}
              </th>
              <th onClick={() => handleSort('netSalary')} style={{ cursor: 'pointer' }}>
                Net Salary {getSortIcon('netSalary')}
              </th>
              <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                Status {getSortIcon('status')}
              </th>
              <th style={{ width: '220px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((payslip) => (
                <tr key={payslip.id} className={selectedRows.includes(payslip.id) ? 'table-active' : ''}>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={selectedRows.includes(payslip.id)}
                      onChange={() => handleSelectRow(payslip.id)}
                    />
                  </td>
                  <td>
                    <div className="employee-info">
                      <div className="employee-avatar">
                        {payslip.avatar || payslip.employeeName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="employee-details">
                        <div className="employee-name">{payslip.employeeName}</div>
                        <div className="employee-id">#{payslip.employeeId} • {payslip.department}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="month-info">
                      <FaFileInvoice className="month-icon" />
                      <span>{payslip.month} {payslip.year}</span>
                    </div>
                  </td>
                  <td>
                    <div className="salary-info">
                      <strong>{formatCurrency(payslip.netSalary)}</strong>
                    </div>
                  </td>
                  <td>{getStatusBadge(payslip.status)}</td>
                  <td>
                    <div className="action-buttons">
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>View</Tooltip>}
                      >
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          className="me-1"
                          onClick={() => onView(payslip)}
                        >
                          <FaEye />
                        </Button>
                      </OverlayTrigger>
                      
                      {payslip.status === 'Pending' && (
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>Generate</Tooltip>}
                        >
                          <Button 
                            variant="outline-success" 
                            size="sm" 
                            className="me-1"
                            onClick={() => onGenerate(payslip.id)}
                          >
                            <FaCheck />
                          </Button>
                        </OverlayTrigger>
                      )}
                      
                      {payslip.status === 'Generated' && (
                        <>
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Download</Tooltip>}
                          >
                            <Button 
                              variant="outline-success" 
                              size="sm" 
                              className="me-1"
                              onClick={() => onDownload(payslip)}
                            >
                              <FaDownload />
                            </Button>
                          </OverlayTrigger>
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Print</Tooltip>}
                          >
                            <Button 
                              variant="outline-info" 
                              size="sm" 
                              className="me-1"
                              onClick={() => onPrint(payslip)}
                            >
                              <FaPrint />
                            </Button>
                          </OverlayTrigger>
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Send Email</Tooltip>}
                          >
                            <Button 
                              variant="outline-primary" 
                              size="sm" 
                              className="me-1"
                              onClick={() => onSendEmail(payslip)}
                            >
                              <FaEnvelope />
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
                          onClick={() => onEdit(payslip)}
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
                          onClick={() => onDelete(payslip.id)}
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
                <td colSpan="6" className="text-center py-4">
                  <div className="empty-state">
                    <p className="text-muted mb-2">No payslips found</p>
                    <Button variant="primary" size="sm">
                      Generate Payslip
                    </Button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

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

export default PayslipList;