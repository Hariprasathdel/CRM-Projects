import React, { useState } from 'react';
import {
  Card,
  Form,
  Row,
  Col,
  Button,
  Alert,
  Spinner,
  Badge
} from 'react-bootstrap';
import {
  FaChartBar,
  FaFileAlt,
  FaCalendarAlt,
  FaUsers,
  FaBuilding,
  FaMoneyBillWave,
  FaProjectDiagram,
  FaClock,
  FaDownload,
  FaCog
} from 'react-icons/fa';
import './ReportGenerator.css';

const ReportGenerator = ({ onGenerate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    reportType: '',
    department: '',
    dateRange: 'this_month',
    startDate: '',
    endDate: '',
    format: 'PDF',
    includeCharts: true,
    includeSummary: true,
    includeDetails: false
  });

  const reportTypes = [
    { value: 'attendance', label: 'Attendance Report', icon: <FaClock /> },
    { value: 'performance', label: 'Performance Report', icon: <FaChartBar /> },
    { value: 'leave', label: 'Leave Report', icon: <FaCalendarAlt /> },
    { value: 'employee', label: 'Employee Report', icon: <FaUsers /> },
    { value: 'department', label: 'Department Report', icon: <FaBuilding /> },
    { value: 'financial', label: 'Financial Report', icon: <FaMoneyBillWave /> },
    { value: 'project', label: 'Project Report', icon: <FaProjectDiagram /> }
  ];

  const departments = ['All', 'Software', 'Marketing', 'Electrical', 'Production', 'HR', 'Finance'];
  const formats = ['PDF', 'Excel', 'CSV', 'Word'];
  const dateRanges = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'this_week', label: 'This Week' },
    { value: 'last_week', label: 'Last Week' },
    { value: 'this_month', label: 'This Month' },
    { value: 'last_month', label: 'Last Month' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.reportType) {
      setError('Please select a report type');
      return false;
    }
    if (formData.dateRange === 'custom') {
      if (!formData.startDate) {
        setError('Please select start date');
        return false;
      }
      if (!formData.endDate) {
        setError('Please select end date');
        return false;
      }
      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        setError('Start date must be before end date');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const reportData = {
        ...formData,
        name: `${reportTypes.find(r => r.value === formData.reportType)?.label}`,
        generatedDate: new Date().toLocaleString(),
        size: '0.5 MB',
        status: 'Processing'
      };
      
      await onGenerate(reportData);
      setLoading(false);
    } catch (error) {
      setError('Failed to generate report. Please try again.');
      setLoading(false);
    }
  };

  const selectedReportType = reportTypes.find(r => r.value === formData.reportType);

  return (
    <div className="report-generator-wrapper">
      {error && (
        <Alert variant="danger" onClose={() => setError('')} dismissible>
          {error}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col lg={8}>
            {/* Report Type */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">Report Type <span className="text-danger">*</span></Form.Label>
              <Row>
                {reportTypes.map((type) => (
                  <Col md={6} lg={4} key={type.value} className="mb-2">
                    <div 
                      className={`report-type-option ${formData.reportType === type.value ? 'active' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, reportType: type.value }))}
                    >
                      <div className="report-type-icon">{type.icon}</div>
                      <span className="report-type-label">{type.label}</span>
                    </div>
                  </Col>
                ))}
              </Row>
            </Form.Group>

            {/* Date Range */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">Date Range <span className="text-danger">*</span></Form.Label>
              <Form.Select
                name="dateRange"
                value={formData.dateRange}
                onChange={handleChange}
              >
                {dateRanges.map(range => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {formData.dateRange === 'custom' && (
              <Row className="mb-4">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
            )}

            {/* Department Filter */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">Department</Form.Label>
              <Form.Select
                name="department"
                value={formData.department}
                onChange={handleChange}
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col lg={4}>
            {/* Report Options */}
            <Card className="report-options-card">
              <Card.Header>
                <h6 className="mb-0">
                  <FaCog className="me-2" />
                  Report Options
                </h6>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Format</Form.Label>
                  <div className="format-options">
                    {formats.map(format => (
                      <div
                        key={format}
                        className={`format-option ${formData.format === format ? 'active' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, format }))}
                      >
                        {format}
                      </div>
                    ))}
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Include Charts"
                    name="includeCharts"
                    checked={formData.includeCharts}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Include Summary"
                    name="includeSummary"
                    checked={formData.includeSummary}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    label="Include Detailed Data"
                    name="includeDetails"
                    checked={formData.includeDetails}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Card.Body>
            </Card>

            {/* Selected Report Preview */}
            {selectedReportType && (
              <Card className="report-preview-card mt-3">
                <Card.Body>
                  <div className="preview-content">
                    <div className="preview-icon">{selectedReportType.icon}</div>
                    <div className="preview-info">
                      <h6>{selectedReportType.label}</h6>
                      <p className="text-muted small">
                        {formData.department || 'All Departments'} • 
                        {dateRanges.find(r => r.value === formData.dateRange)?.label}
                      </p>
                      <Badge bg="primary">{formData.format}</Badge>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>

        <div className="form-actions">
          <Button 
            variant="secondary" 
            onClick={() => {
              setFormData({
                reportType: '',
                department: '',
                dateRange: 'this_month',
                startDate: '',
                endDate: '',
                format: 'PDF',
                includeCharts: true,
                includeSummary: true,
                includeDetails: false
              });
            }}
          >
            Reset
          </Button>
          <Button 
            variant="primary" 
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Generating...
              </>
            ) : (
              <>
                <FaChartBar className="me-1" /> Generate Report
              </>
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ReportGenerator;