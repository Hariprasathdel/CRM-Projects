import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Modal, 
  Alert, 
  Spinner,
  Badge,
  Tabs,
  Tab
} from 'react-bootstrap';
import { 
  FaPlus, 
  FaDownload, 
  FaUserPlus, 
  FaBriefcase,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaChartBar,
  FaUsers,
  FaFileAlt,
  FaCalendarAlt
} from 'react-icons/fa';
import JobPostings from './JobPostings';
import ApplicantList from './ApplicantList';
import './Recruitment.css';

const Recruitment = () => {
  const [loading, setLoading] = useState(false);
  const [jobPostings, setJobPostings] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [showJobForm, setShowJobForm] = useState(false);
  const [showApplicantForm, setShowApplicantForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('jobs');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  // Mock data - In real app, this would come from API
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock Job Postings
      const mockJobs = [
        {
          id: 1,
          title: 'Senior Software Engineer',
          department: 'Software',
          location: 'New York, NY',
          type: 'Full-time',
          experience: '5-7 years',
          salary: '$90,000 - $120,000',
          description: 'Looking for an experienced software engineer to lead our development team.',
          requirements: ['React', 'Node.js', 'Python', 'AWS', 'Docker'],
          status: 'Active',
          postedDate: '2026-01-10',
          applicants: 45,
          deadline: '2026-02-15',
          avatar: 'SS'
        },
        {
          id: 2,
          title: 'Marketing Manager',
          department: 'Marketing',
          location: 'Los Angeles, CA',
          type: 'Full-time',
          experience: '3-5 years',
          salary: '$70,000 - $90,000',
          description: 'Lead marketing campaigns and strategy for our products.',
          requirements: ['Digital Marketing', 'SEO', 'Content Strategy', 'Analytics'],
          status: 'Active',
          postedDate: '2026-01-12',
          applicants: 32,
          deadline: '2026-02-20',
          avatar: 'MM'
        },
        {
          id: 3,
          title: 'Electrical Engineer',
          department: 'Electrical',
          location: 'Chicago, IL',
          type: 'Full-time',
          experience: '3-5 years',
          salary: '$75,000 - $95,000',
          description: 'Design and develop electrical systems for industrial applications.',
          requirements: ['AutoCAD', 'Circuit Design', 'PLC', 'MATLAB'],
          status: 'Active',
          postedDate: '2026-01-08',
          applicants: 28,
          deadline: '2026-02-10',
          avatar: 'EE'
        },
        {
          id: 4,
          title: 'Production Supervisor',
          department: 'Production',
          location: 'Houston, TX',
          type: 'Full-time',
          experience: '5-7 years',
          salary: '$65,000 - $85,000',
          description: 'Oversee production operations and ensure quality standards.',
          requirements: ['Lean Manufacturing', 'Quality Control', 'Supply Chain'],
          status: 'Closed',
          postedDate: '2025-12-15',
          applicants: 56,
          deadline: '2026-01-15',
          avatar: 'PS'
        },
        {
          id: 5,
          title: 'HR Coordinator',
          department: 'HR',
          location: 'Boston, MA',
          type: 'Part-time',
          experience: '1-3 years',
          salary: '$40,000 - $55,000',
          description: 'Assist with recruitment, onboarding, and employee relations.',
          requirements: ['Recruitment', 'Employee Relations', 'Payroll', 'Training'],
          status: 'Active',
          postedDate: '2026-01-15',
          applicants: 18,
          deadline: '2026-03-01',
          avatar: 'HR'
        }
      ];

      // Mock Applicants
      const mockApplicants = [
        {
          id: 1,
          name: 'Alice Johnson',
          email: 'alice.johnson@example.com',
          phone: '+1 234 567 8901',
          position: 'Senior Software Engineer',
          experience: '6 years',
          skills: ['React', 'Node.js', 'Python', 'AWS'],
          status: 'Shortlisted',
          appliedDate: '2026-01-11',
          resume: 'alice_johnson_resume.pdf',
          avatar: 'AJ'
        },
        {
          id: 2,
          name: 'Bob Smith',
          email: 'bob.smith@example.com',
          phone: '+1 345 678 9012',
          position: 'Marketing Manager',
          experience: '4 years',
          skills: ['Digital Marketing', 'SEO', 'Content Strategy'],
          status: 'Interview',
          appliedDate: '2026-01-13',
          resume: 'bob_smith_resume.pdf',
          avatar: 'BS'
        },
        {
          id: 3,
          name: 'Carol White',
          email: 'carol.white@example.com',
          phone: '+1 456 789 0123',
          position: 'Electrical Engineer',
          experience: '4 years',
          skills: ['AutoCAD', 'Circuit Design', 'PLC'],
          status: 'Pending',
          appliedDate: '2026-01-10',
          resume: 'carol_white_resume.pdf',
          avatar: 'CW'
        },
        {
          id: 4,
          name: 'David Green',
          email: 'david.green@example.com',
          phone: '+1 567 890 1234',
          position: 'Production Supervisor',
          experience: '6 years',
          skills: ['Lean Manufacturing', 'Quality Control'],
          status: 'Rejected',
          appliedDate: '2025-12-18',
          resume: 'david_green_resume.pdf',
          avatar: 'DG'
        },
        {
          id: 5,
          name: 'Eva Martinez',
          email: 'eva.martinez@example.com',
          phone: '+1 678 901 2345',
          position: 'HR Coordinator',
          experience: '2 years',
          skills: ['Recruitment', 'Employee Relations', 'Training'],
          status: 'Hired',
          appliedDate: '2026-01-16',
          resume: 'eva_martinez_resume.pdf',
          avatar: 'EM'
        },
        {
          id: 6,
          name: 'Frank Wilson',
          email: 'frank.wilson@example.com',
          phone: '+1 789 012 3456',
          position: 'Senior Software Engineer',
          experience: '7 years',
          skills: ['React', 'Node.js', 'Docker', 'Kubernetes'],
          status: 'Shortlisted',
          appliedDate: '2026-01-12',
          resume: 'frank_wilson_resume.pdf',
          avatar: 'FW'
        }
      ];

      setJobPostings(mockJobs);
      setApplicants(mockApplicants);
    } catch (error) {
      console.error('Error fetching recruitment data:', error);
      setError('Failed to load recruitment data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddJob = async (jobData) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newJob = {
        ...jobData,
        id: jobPostings.length + 1,
        applicants: 0,
        postedDate: new Date().toISOString().split('T')[0],
        avatar: jobData.title.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
        status: 'Active'
      };
      
      setJobPostings([newJob, ...jobPostings]);
      setShowJobForm(false);
      setSuccess('Job posting created successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to create job posting. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateJob = async (jobData) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedJobs = jobPostings.map(job => 
        job.id === jobData.id ? { ...job, ...jobData } : job
      );
      
      setJobPostings(updatedJobs);
      setShowJobForm(false);
      setEditingJob(null);
      setSuccess('Job posting updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to update job posting. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (id) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setJobPostings(jobPostings.filter(job => job.id !== id));
        setSuccess('Job posting deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        setError('Failed to delete job posting. Please try again.');
      }
    }
  };

  const handleViewApplicants = (job) => {
    setSelectedJob(job);
    setActiveTab('applicants');
  };

  const handleUpdateApplicantStatus = async (id, status) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedApplicants = applicants.map(applicant => 
        applicant.id === id ? { ...applicant, status } : applicant
      );
      
      setApplicants(updatedApplicants);
      setSuccess(`Applicant status updated to ${status}!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to update applicant status. Please try again.');
    }
  };

  const handleDeleteApplicant = async (id) => {
    if (window.confirm('Are you sure you want to delete this applicant?')) {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setApplicants(applicants.filter(applicant => applicant.id !== id));
        setSuccess('Applicant deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        setError('Failed to delete applicant. Please try again.');
      }
    }
  };

  const handleExport = () => {
    console.log('Exporting recruitment data...');
    setSuccess('Data exported successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  // Statistics
  const totalJobs = jobPostings.length;
  const activeJobs = jobPostings.filter(j => j.status === 'Active').length;
  const totalApplicants = applicants.length;
  const shortlisted = applicants.filter(a => a.status === 'Shortlisted').length;
  const interviewed = applicants.filter(a => a.status === 'Interview').length;
  const hired = applicants.filter(a => a.status === 'Hired').length;

  return (
    <div className="recruitment-page">
      <Container fluid>
        {/* Header Section */}
        <div className="recruitment-header">
          <div className="header-left">
            <h2 className="page-title">Recruitment Management</h2>
            <p className="page-subtitle">Manage job postings and track applicants</p>
          </div>
          <div className="header-right">
            <Button 
              variant="primary" 
              className="me-2"
              onClick={() => {
                setEditingJob(null);
                setShowJobForm(true);
              }}
            >
              <FaPlus className="me-1" /> Post Job
            </Button>
            <Button variant="outline-secondary" onClick={handleExport}>
              <FaDownload className="me-1" /> Export
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <Row className="statistics-cards mb-4">
          <Col lg={3} md={6} className="mb-3">
            <Card className="stat-card total-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon-wrapper primary">
                    <FaBriefcase className="stat-icon" />
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">{totalJobs}</h3>
                    <p className="stat-label">Total Jobs</p>
                    <small className="stat-detail">{activeJobs} active positions</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={3} md={6} className="mb-3">
            <Card className="stat-card applicants-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon-wrapper info">
                    <FaUsers className="stat-icon" />
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">{totalApplicants}</h3>
                    <p className="stat-label">Total Applicants</p>
                    <small className="stat-detail">Across all positions</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={3} md={6} className="mb-3">
            <Card className="stat-card shortlisted-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon-wrapper warning">
                    <FaClock className="stat-icon" />
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">{shortlisted + interviewed}</h3>
                    <p className="stat-label">In Progress</p>
                    <small className="stat-detail">{shortlisted} shortlisted, {interviewed} interviewing</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={3} md={6} className="mb-3">
            <Card className="stat-card hired-card">
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-icon-wrapper success">
                    <FaCheckCircle className="stat-icon" />
                  </div>
                  <div className="stat-info">
                    <h3 className="stat-number">{hired}</h3>
                    <p className="stat-label">Hired</p>
                    <small className="stat-detail">Successful placements</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Alerts */}
        {error && (
          <Alert variant="danger" onClose={() => setError('')} dismissible>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert variant="success" onClose={() => setSuccess('')} dismissible>
            {success}
          </Alert>
        )}

        {/* Tabs */}
        <Card className="recruitment-main-card">
          <Card.Body>
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className="recruitment-tabs"
            >
              <Tab eventKey="jobs" title={
                <span>
                  <FaBriefcase className="me-2" />
                  Job Postings ({jobPostings.length})
                </span>
              }>
                {loading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3 text-muted">Loading job postings...</p>
                  </div>
                ) : (
                  <JobPostings 
                    jobs={jobPostings}
                    onViewApplicants={handleViewApplicants}
                    onEdit={setEditingJob}
                    onDelete={handleDeleteJob}
                    setShowForm={setShowJobForm}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filter={filter}
                    setFilter={setFilter}
                  />
                )}
              </Tab>
              
              <Tab eventKey="applicants" title={
                <span>
                  <FaUsers className="me-2" />
                  Applicants ({applicants.length})
                </span>
              }>
                {loading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3 text-muted">Loading applicants...</p>
                  </div>
                ) : (
                  <ApplicantList 
                    applicants={applicants}
                    onUpdateStatus={handleUpdateApplicantStatus}
                    onDelete={handleDeleteApplicant}
                    selectedJob={selectedJob}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filter={filter}
                    setFilter={setFilter}
                  />
                )}
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>

        {/* Job Form Modal */}
        <Modal 
          show={showJobForm} 
          onHide={() => {
            setShowJobForm(false);
            setEditingJob(null);
          }}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <FaBriefcase className="me-2" />
              {editingJob ? 'Edit Job Posting' : 'Create New Job Posting'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Job form would be implemented here */}
            <div className="text-center py-3">
              <p>Job form implementation would go here.</p>
              <Button 
                variant="primary" 
                onClick={() => {
                  setShowJobForm(false);
                  setEditingJob(null);
                }}
              >
                Close
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};

export default Recruitment;