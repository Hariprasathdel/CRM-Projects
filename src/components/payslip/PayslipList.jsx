import React, { useState } from 'react';
import {
  Table, Form, InputGroup, Button, Dropdown, Pagination, Badge,
  OverlayTrigger, Tooltip, Modal
} from 'react-bootstrap';
import {
  FaSearch, FaFilter, FaSort, FaSortUp, FaSortDown, FaEye, FaEdit,
  FaTrash, FaDownload, FaPrint, FaEnvelope, FaCheck, FaClock,
  FaFileExport, FaFileInvoice
} from 'react-icons/fa';
import './PayslipList.css';

const PayslipList = ({
  payslips,
  onView,
  onEdit,
  onDelete,
  onGenerate,
  onDownload,
  onSendEmail,
  formatCurrency
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState('generatedDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedRows, setSelectedRows] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filtered = payslips.filter((p) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      p.employeeName.toLowerCase().includes(term) ||
      p.employeeId.toLowerCase().includes(term) ||
      p.department.toLowerCase().includes(term) ||
      p.month.toLowerCase().includes(term);
    const matchesFilter = filter === 'all' || p.status.toLowerCase() === filter;
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

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    onDelete(deleteId);
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  return (
    <div className="payslip-list-wrapper">
      {/* Toolbar */}
      <div className="list-toolbar">
        <div className="toolbar-left">
          <InputGroup style={{ width: '300px' }}>
            <InputGroup.Text><FaSearch /></InputGroup.Text>
            <Form.Control
              placeholder="Search payslips..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </InputGroup>

          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" size="sm">
              <FaFilter className="me-1" />
              {filter === 'all' ? 'All Status' : filter}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setFilter('all')}>All Status</Dropdown.Item>
              <Dropdown.Item onClick={() => setFilter('generated')}>
                <FaCheck className="text-success me-1" /> Generated
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setFilter('pending')}>
                <FaClock className="text-warning me-1" /> Pending
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <div className="toolbar-right">
          <Button variant="outline-secondary" size="sm">
            <FaFileExport className="me-1" /> Export
          </Button>
        </div>
      </div>

      <div className="payslip-count">
        Showing {totalItems === 0 ? 0 : startIndex + 1} to {endIndex} of {totalItems} payslips
      </div>

      {/* Table */}
      <div className="table-responsive">
        <Table hover striped className="payslip-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}>
                <Form.Check
                  checked={currentData.length > 0 && selectedRows.length === currentData.length}
                  onChange={(e) => {
                    if (e.target.checked) setSelectedRows(currentData.map(i => i.id));
                    else setSelectedRows([]);
                  }}
                />
              </th>
              <th onClick={() => handleSort('employeeName')} style={{ cursor: 'pointer' }}>
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
              <th style={{ width: 230 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? currentData.map((p) => (
              <tr key={p.id} className={selectedRows.includes(p.id) ? 'table-active' : ''}>
                <td>
                  <Form.Check
                    checked={selectedRows.includes(p.id)}
                    onChange={() => setSelectedRows(prev =>
                      prev.includes(p.id) ? prev.filter(i => i !== p.id) : [...prev, p.id]
                    )}
                  />
                </td>
                <td>
                  <div className="employee-info">
                    <div className="employee-avatar">
                      {p.avatar || p.employeeName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="employee-details">
                      <div className="employee-name">{p.employeeName}</div>
                      <div className="employee-id">#{p.employeeId} • {p.department}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="month-info">
                    <FaFileInvoice className="month-icon" />
                    <span>{p.month} {p.year}</span>
                  </div>
                </td>
                <td><strong className="salary-value">{formatCurrency(p.netSalary)}</strong></td>
                <td>{getStatusBadge(p.status)}</td>
                <td>
                  <div className="action-buttons">
                    <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}>
                      <Button variant="outline-primary" size="sm" className="me-1" onClick={() => onView(p)}>
                        <FaEye />
                      </Button>
                    </OverlayTrigger>

                    {p.status === 'Pending' && (
                      <OverlayTrigger placement="top" overlay={<Tooltip>Generate</Tooltip>}>
                        <Button variant="outline-success" size="sm" className="me-1" onClick={() => onGenerate(p.id)}>
                          <FaCheck />
                        </Button>
                      </OverlayTrigger>
                    )}

                    {p.status === 'Generated' && (
                      <>
                        <OverlayTrigger placement="top" overlay={<Tooltip>Download</Tooltip>}>
                          <Button variant="outline-success" size="sm" className="me-1" onClick={() => onDownload(p)}>
                            <FaDownload />
                          </Button>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip>Print</Tooltip>}>
                          <Button variant="outline-info" size="sm" className="me-1" onClick={() => window.print()}>
                            <FaPrint />
                          </Button>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip>Send Email</Tooltip>}>
                          <Button variant="outline-primary" size="sm" className="me-1" onClick={() => onSendEmail(p)}>
                            <FaEnvelope />
                          </Button>
                        </OverlayTrigger>
                      </>
                    )}

                    <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                      <Button variant="outline-warning" size="sm" className="me-1" onClick={() => onEdit(p)}>
                        <FaEdit />
                      </Button>
                    </OverlayTrigger>

                    <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDeleteClick(p.id)}>
                        <FaTrash />
                      </Button>
                    </OverlayTrigger>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  <p className="text-muted mb-2">No payslips found</p>
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
            Showing {totalItems === 0 ? 0 : startIndex + 1} to {endIndex} of {totalItems} entries
          </span>
        </div>
        <div className="footer-right">
          <div className="items-per-page">
            <Form.Label className="me-2 mb-0">Show:</Form.Label>
            <Form.Select
              size="sm"
              value={itemsPerPage}
              onChange={(e) => { setItemsPerPage(parseInt(e.target.value)); setCurrentPage(1); }}
              style={{ width: 70 }}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </Form.Select>
          </div>

          <Pagination size="sm" className="mb-0">
            <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
            <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              let pageNum;
              if (totalPages <= 5) pageNum = i + 1;
              else if (currentPage <= 3) pageNum = i + 1;
              else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = currentPage - 2 + i;
              return (
                <Pagination.Item key={pageNum} active={pageNum === currentPage} onClick={() => setCurrentPage(pageNum)}>
                  {pageNum}
                </Pagination.Item>
              );
            })}
            <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages || totalPages === 0} />
            <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages || totalPages === 0} />
          </Pagination>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this payslip?</p>
          <p className="text-danger">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>
            <FaTrash className="me-1" /> Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PayslipList;