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
  FaMoneyBillWave
} from 'react-icons/fa';
import './LoanList.css';

const LoanList = ({
  loans,
  onView,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  formatCurrency
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState('appliedDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedRows, setSelectedRows] = useState([]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filtered = loans.filter((l) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      l.employeeName.toLowerCase().includes(term) ||
      l.employeeId.toLowerCase().includes(term) ||
      l.department.toLowerCase().includes(term) ||
      l.loanType.toLowerCase().includes(term) ||
      l.reason.toLowerCase().includes(term);
    const matchesFilter = filter === 'all' || l.status.toLowerCase() === filter;
    return matchesSearch && matchesFilter;
  });

  const sorted = [...filtered].sort((a, b) => {
    let aVal = a[sortField] || '';
    let bVal = b[sortField] || '';
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const totalItems = sorted.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentData = sorted.slice(startIndex, endIndex);

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

  const getLoanTypeBadge = (type) => {
    const config = {
      Personal: 'primary',
      Car: 'info',
      Home: 'success',
      Education: 'warning',
      Emergency: 'danger'
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
    <div className="loan-list-wrapper">
      {/* Toolbar */}
      <div className="list-toolbar">
        <div className="toolbar-left">
          <InputGroup style={{ width: '300px' }}>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search loans..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </InputGroup>

          <Dropdown className="me-2">
            <Dropdown.Toggle variant="outline-secondary" size="sm">
              <FaFilter className="me-1" />
              {filter === 'all'
                ? 'All Status'
                : filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setFilter('all')}>
                All Status
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setFilter('pending')}>
                <FaClock className="text-warning me-1" /> Pending
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setFilter('approved')}>
                <FaCheck className="text-success me-1" /> Approved
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setFilter('rejected')}>
                <FaTimes className="text-danger me-1" /> Rejected
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          {selectedRows.length > 0 && (
            <span className="selection-info text-muted">
              {selectedRows.length} selected
            </span>
          )}
        </div>

        <div className="toolbar-right">
          <Form.Select
            size="sm"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(parseInt(e.target.value));
              setCurrentPage(1);
            }}
            style={{ width: '100px' }}
          >
            <option value="5">5 / page</option>
            <option value="10">10 / page</option>
            <option value="25">25 / page</option>
            <option value="50">50 / page</option>
          </Form.Select>
        </div>
      </div>

      {/* Loan count */}
      <div className="loan-count">
        Showing {totalItems === 0 ? 0 : startIndex + 1} to {endIndex} of{' '}
        {totalItems} applications
      </div>

      {/* Table */}
      <div className="table-responsive">
        <Table hover striped className="loan-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}>
                <Form.Check
                  checked={
                    currentData.length > 0 &&
                    selectedRows.length === currentData.length
                  }
                  onChange={(e) => {
                    if (e.target.checked)
                      setSelectedRows(currentData.map((i) => i.id));
                    else setSelectedRows([]);
                  }}
                />
              </th>
              <th
                onClick={() => handleSort('employeeName')}
                style={{ cursor: 'pointer' }}
              >
                Employee {getSortIcon('employeeName')}
              </th>
              <th
                onClick={() => handleSort('loanType')}
                style={{ cursor: 'pointer' }}
              >
                Type {getSortIcon('loanType')}
              </th>
              <th
                onClick={() => handleSort('amount')}
                style={{ cursor: 'pointer' }}
              >
                Amount {getSortIcon('amount')}
              </th>
              <th
                onClick={() => handleSort('tenure')}
                style={{ cursor: 'pointer' }}
              >
                Tenure {getSortIcon('tenure')}
              </th>
              <th
                onClick={() => handleSort('monthlyPayment')}
                style={{ cursor: 'pointer' }}
              >
                Monthly {getSortIcon('monthlyPayment')}
              </th>
              <th
                onClick={() => handleSort('status')}
                style={{ cursor: 'pointer' }}
              >
                Status {getSortIcon('status')}
              </th>
              <th style={{ width: 200 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((loan) => (
                <tr
                  key={loan.id}
                  className={selectedRows.includes(loan.id) ? 'table-active' : ''}
                >
                  <td>
                    <Form.Check
                      checked={selectedRows.includes(loan.id)}
                      onChange={() =>
                        setSelectedRows((prev) =>
                          prev.includes(loan.id)
                            ? prev.filter((i) => i !== loan.id)
                            : [...prev, loan.id]
                        )
                      }
                    />
                  </td>
                  <td>
                    <div className="employee-info">
                      <div className="employee-avatar">
                        {loan.avatar ||
                          loan.employeeName
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                      </div>
                      <div className="employee-details">
                        <div className="employee-name">{loan.employeeName}</div>
                        <div className="employee-id">
                          #{loan.employeeId} • {loan.department}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{getLoanTypeBadge(loan.loanType)}</td>
                  <td>
                    <div className="amount-info">
                      <FaMoneyBillWave className="amount-icon" />
                      <span className="amount-value">
                        {formatCurrency(loan.amount)}
                      </span>
                    </div>
                  </td>
                  <td>
                    <Badge bg="secondary" className="tenure-badge">
                      {loan.tenure} mo
                    </Badge>
                  </td>
                  <td>
                    <div className="monthly-payment">
                      <strong>{formatCurrency(loan.monthlyPayment)}</strong>
                      <small className="interest-rate">
                        ({loan.interestRate}%)
                      </small>
                    </div>
                  </td>
                  <td>{getStatusBadge(loan.status)}</td>
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
                          onClick={() => onView(loan)}
                        >
                          <FaEye />
                        </Button>
                      </OverlayTrigger>

                      {loan.status === 'Pending' && (
                        <>
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Approve</Tooltip>}
                          >
                            <Button
                              variant="outline-success"
                              size="sm"
                              className="me-1"
                              onClick={() => onApprove(loan.id)}
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
                              onClick={() => onReject(loan.id)}
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
                          onClick={() => onEdit(loan)}
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
                          onClick={() => onDelete(loan.id)}
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
                  <p className="text-muted mb-0">No loan applications found</p>
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
            Showing {totalItems === 0 ? 0 : startIndex + 1} to {endIndex} of{' '}
            {totalItems} entries
          </span>
        </div>
        <div className="footer-right">
          <Pagination size="sm" className="mb-0">
            <Pagination.First
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            />
            <Pagination.Prev
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            />
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              let pageNum;
              if (totalPages <= 5) pageNum = i + 1;
              else if (currentPage <= 3) pageNum = i + 1;
              else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = currentPage - 2 + i;
              return (
                <Pagination.Item
                  key={pageNum}
                  active={pageNum === currentPage}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Pagination.Item>
              );
            })}
            <Pagination.Next
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
            />
            <Pagination.Last
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
            />
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default LoanList;