import React, { useState } from 'react';
import {
  Table, Form, InputGroup, Button, Dropdown, Pagination,
  Badge, OverlayTrigger, Tooltip
} from 'react-bootstrap';
import {
  FaSearch, FaFilter, FaSort, FaSortUp, FaSortDown,
  FaEye, FaEdit, FaTrash, FaFileExport, FaPrint,
  FaUserCheck, FaUserTimes, FaUserClock, FaClock,
  FaCalendarAlt, FaMapMarkerAlt
} from 'react-icons/fa';
import './AttendanceTable.css';

const AttendanceTable = ({
  records,
  onView,
  onEdit,
  onDelete,
  selectedDate,
  setSelectedDate
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState('employeeName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRows, setSelectedRows] = useState([]);

  // ==================== SORTING ====================
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // ==================== FILTER ====================
  const filtered = records.filter((r) => {
    const term = searchTerm.toLowerCase();
    const matches =
      r.employeeName.toLowerCase().includes(term) ||
      r.employeeId.toLowerCase().includes(term) ||
      r.department.toLowerCase().includes(term);
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matches && matchesStatus;
  });

  // ==================== SORT ====================
  const sorted = [...filtered].sort((a, b) => {
    let aVal = a[sortField] || '';
    let bVal = b[sortField] || '';
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // ==================== PAGINATION ====================
  const totalItems = sorted.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentData = sorted.slice(startIndex, endIndex);

  // ==================== HELPERS ====================
  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort className="sort-icon" />;
    return sortDirection === 'asc'
      ? <FaSortUp className="sort-icon active" />
      : <FaSortDown className="sort-icon active" />;
  };

  const getStatusBadge = (status) => {
    const map = {
      present: { v: 'success', i: <FaUserCheck />, l: 'Present' },
      absent:  { v: 'danger',  i: <FaUserTimes />, l: 'Absent' },
      leave:   { v: 'warning', i: <FaUserClock />, l: 'On Leave' },
      late:    { v: 'info',    i: <FaClock />,     l: 'Late' }
    };
    const c = map[status] || map.present;
    return (
      <Badge bg={c.v} className="status-badge">
        {c.i} {c.l}
      </Badge>
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) setSelectedRows(currentData.map((r) => r.id));
    else setSelectedRows([]);
  };

  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // ==================== RENDER ====================
  return (
    <div className="attendance-table-wrapper">
      {/* Toolbar */}
      <div className="list-toolbar">
        <div className="toolbar-left">
          <InputGroup style={{ width: 280 }}>
            <InputGroup.Text><FaSearch /></InputGroup.Text>
            <Form.Control
              placeholder="Search employee..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </InputGroup>

          <Form.Control
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ width: 170 }}
          />

          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" size="sm">
              <FaFilter className="me-1" />
              {statusFilter === 'all' ? 'All Status' : statusFilter}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setStatusFilter('all')}>All Status</Dropdown.Item>
              <Dropdown.Item onClick={() => setStatusFilter('present')}>
                <FaUserCheck className="text-success me-1" /> Present
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setStatusFilter('absent')}>
                <FaUserTimes className="text-danger me-1" /> Absent
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setStatusFilter('leave')}>
                <FaUserClock className="text-warning me-1" /> On Leave
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setStatusFilter('late')}>
                <FaClock className="text-info me-1" /> Late
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          {selectedRows.length > 0 && (
            <span className="text-muted small">
              {selectedRows.length} selected
            </span>
          )}
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

      {/* Count */}
      <div className="attendance-count">
        Showing {totalItems === 0 ? 0 : startIndex + 1} to {endIndex} of {totalItems} records
      </div>

      {/* Table */}
      <div className="table-responsive">
        <Table hover striped className="attendance-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}>
                <Form.Check
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
              <th style={{ width: 150 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((r) => (
                <tr
                  key={r.id}
                  className={selectedRows.includes(r.id) ? 'table-active' : ''}
                >
                  <td>
                    <Form.Check
                      checked={selectedRows.includes(r.id)}
                      onChange={() => handleSelectRow(r.id)}
                    />
                  </td>
                  <td>
                    <div className="employee-info">
                      <div className="employee-avatar">{r.avatar}</div>
                      <div>
                        <div className="employee-name">{r.employeeName}</div>
                        <div className="employee-id">#{r.employeeId}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <Badge bg="secondary" className="dept-badge">{r.department}</Badge>
                  </td>
                  <td>
                    <small className="date-cell">
                      <FaCalendarAlt className="me-1" />
                      {r.date}
                    </small>
                  </td>
                  <td>{r.checkIn}</td>
                  <td>{r.checkOut}</td>
                  <td>{getStatusBadge(r.status)}</td>
                  <td>
                    <div className="hours-cell">
                      <span>{r.workingHours}</span>
                      {r.overtime && r.overtime !== '0h' && (
                        <small className="ot-text">+{r.overtime}</small>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-1"
                          onClick={() => onView(r)}
                        >
                          <FaEye />
                        </Button>
                      </OverlayTrigger>
                      <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                        <Button
                          variant="outline-warning"
                          size="sm"
                          className="me-1"
                          onClick={() => onEdit(r)}
                        >
                          <FaEdit />
                        </Button>
                      </OverlayTrigger>
                      <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => onDelete(r.id)}
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
                <td colSpan="9" className="text-center py-4">
                  <p className="text-muted mb-0">No attendance records found</p>
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
              onChange={(e) => {
                setItemsPerPage(parseInt(e.target.value));
                setCurrentPage(1);
              }}
              style={{ width: 70 }}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </Form.Select>
          </div>

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

export default AttendanceTable;