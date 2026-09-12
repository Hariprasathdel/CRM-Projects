import React, { useState } from 'react';
import {
  Table,
  Form,
  InputGroup,
  Button,
  Pagination,
  Badge,
  OverlayTrigger,
  Tooltip,
  Modal,
  Card
} from 'react-bootstrap';
import {
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaDownload,
  FaTrash,
  FaEye,
  FaFileAlt,
  FaCalendarAlt,
  FaUser,
  FaFilePdf,
  FaFileExcel,
  FaFileWord,
  FaClock,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';
import './ReportViewer.css';

const ReportViewer = ({ reports, onDownload, onDelete, onView, getStatusBadge }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState('generatedDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

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

  // Filter reports
  const filteredReports = reports.filter(report => {
    const searchLower = searchTerm.toLowerCase();
    return (
      report.name.toLowerCase().includes(searchLower) ||
      report.type.toLowerCase().includes(searchLower) ||
      report.createdBy.toLowerCase().includes(searchLower) ||
      report.description.toLowerCase().includes(searchLower)
    );
  });

  // Sort reports
  const sortedReports = [...filteredReports].sort((a, b) => {
    let aVal = a[sortField] || '';
    let bVal = b[sortField] || '';
    
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();
    
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalItems = sortedReports.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentData = sortedReports.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort className="sort-icon" />;
    return sortDirection === 'asc' 
      ? <FaSortUp className="sort-icon active" />
      : <FaSortDown className="sort-icon active" />;
  };

  const getFormatIcon = (format) => {
    const config = {
      PDF: <FaFilePdf className="format-icon pdf" />,
      Excel: <FaFileExcel className="format-icon excel" />,
      Word: <FaFileWord className="format-icon word" />,
      CSV: <FaFileAlt className="format-icon csv" />
    };
    return config[format] || <FaFileAlt />;
  };

  const getFormatBadge = (format) => {
    const config = {
      PDF: 'danger',
      Excel: 'success',
      Word: 'primary',
      CSV: 'info'
    };
    return (
      <Badge bg={config[format] || 'secondary'} className="format-badge">
        {format}
      </Badge>
    );
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
    <div className="report-viewer-wrapper">
      {/* Toolbar */}
      <div className="list-toolbar">
        <div className="toolbar-left">
          <InputGroup style={{ width: '300px' }}>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search reports..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </InputGroup>
          
          <span className="text-muted report-count">
            {totalItems} report{totalItems !== 1 ? 's' : ''} found
          </span>
        </div>

        <div className="toolbar-right">
          <Form.Select
            size="sm"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            style={{ width: '100px' }}
          >
            <option value="5">5 per page</option>
            <option value="10">10 per page</option>
            <option value="25">25 per page</option>
            <option value="50">50 per page</option>
          </Form.Select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="table-responsive">
        <Table hover className="reports-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')} style={{ cursor: 'pointer', minWidth: '200px' }}>
                Report Name {getSortIcon('name')}
              </th>
              <th onClick={() => handleSort('type')} style={{ cursor: 'pointer' }}>
                Type {getSortIcon('type')}
              </th>
              <th onClick={() => handleSort('format')} style={{ cursor: 'pointer' }}>
                Format {getSortIcon('format')}
              </th>
              <th onClick={() => handleSort('generatedDate')} style={{ cursor: 'pointer' }}>
                Generated {getSortIcon('generatedDate')}
              </th>
              <th onClick={() => handleSort('size')} style={{ cursor: 'pointer' }}>
                Size {getSortIcon('size')}
              </th>
              <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                Status {getSortIcon('status')}
              </th>
              <th style={{ width: '160px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((report) => (
                <tr key={report.id}>
                  <td>
                    <div className="report-info">
                      <div className="report-icon-wrapper">
                        {report.icon || <FaFileAlt />}
                      </div>
                      <div className="report-details">
                        <div className="report-name">{report.name}</div>
                        <div className="report-description">{report.description}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <Badge bg="secondary" className="type-badge">
                      {report.type}
                    </Badge>
                  </td>
                  <td>
                    <div className="format-info">
                      {getFormatIcon(report.format)}
                      {getFormatBadge(report.format)}
                    </div>
                  </td>
                  <td>
                    <div className="date-info">
                      <FaCalendarAlt className="date-icon" />
                      {formatDate(report.generatedDate)}
                    </div>
                  </td>
                  <td>{report.size}</td>
                  <td>{getStatusBadge(report.status)}</td>
                  <td>
                    <div className="action-buttons">
                      {report.status === 'Completed' && (
                        <>
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>View Report</Tooltip>}
                          >
                            <Button 
                              variant="outline-primary" 
                              size="sm" 
                              className="me-1"
                              onClick={() => onView(report)}
                            >
                              <FaEye />
                            </Button>
                          </OverlayTrigger>
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Download</Tooltip>}
                          >
                            <Button 
                              variant="outline-success" 
                              size="sm" 
                              className="me-1"
                              onClick={() => onDownload(report)}
                            >
                              <FaDownload />
                            </Button>
                          </OverlayTrigger>
                        </>
                      )}
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Delete</Tooltip>}
                      >
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDeleteClick(report.id)}
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
                    <FaFileAlt className="empty-icon" />
                    <p className="text-muted">No reports found</p>
                    <p className="text-muted small">Generate a new report to get started</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Pagination */}
      {totalItems > 0 && (
        <div className="table-footer">
          <div className="footer-left">
            <span className="text-muted">
              Showing {startIndex + 1} to {endIndex} of {totalItems} reports
            </span>
          </div>

          <div className="footer-right">
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
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this report?</p>
          <p className="text-danger">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            <FaTrash className="me-1" /> Delete Report
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ReportViewer;