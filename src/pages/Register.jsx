import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Form, 
  Button, 
  Alert, 
  Spinner,
  InputGroup,
  ProgressBar
} from 'react-bootstrap';
import { 
  FaUser, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaBuilding,
  FaEnvelope,
  FaPhone,
  FaShieldAlt,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  // Password strength states
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: 'Weak',
    color: 'danger'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Check password strength when password changes
    if (name === 'password') {
      checkPasswordStrength(value);
    }

    if (error) setError('');
  };

  const checkPasswordStrength = (password) => {
    let score = 0;
    let label = 'Weak';
    let color = 'danger';

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score >= 4) { label = 'Strong'; color = 'success'; }
    else if (score >= 3) { label = 'Good'; color = 'info'; }
    else if (score >= 2) { label = 'Fair'; color = 'warning'; }
    else { label = 'Weak'; color = 'danger'; }

    setPasswordStrength({ score, label, color });
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError('First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return false;
    }
    if (!formData.company.trim()) {
      setError('Company name is required');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!formData.agreeTerms) {
      setError('You must agree to the Terms and Conditions');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success - redirect to login
      setSuccess('Registration successful! Please login to continue.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      setError('Registration failed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="register-page">
      <Container fluid className="register-container">
        <Row className="register-row">
          {/* Left Column - Register Form */}
          <Col lg={6} md={12} className="register-form-col">
            <div className="register-form-wrapper">
              <div className="register-brand">
                <div className="brand-icon">
                  <FaBuilding />
                </div>
                <h1 className="brand-name">EMS</h1>
                <p className="brand-tagline">Employee Management System</p>
              </div>

              <Card className="register-card">
                <Card.Body className="p-4">
                  <div className="register-header">
                    <h3 className="register-title">Create Account</h3>
                    <p className="register-subtitle">Join us and start managing your workforce</p>
                  </div>

                  {error && (
                    <Alert variant="danger" className="register-alert" dismissible>
                      <Alert.Heading className="alert-heading">
                        <FaShieldAlt className="me-2" />
                        Registration Error
                      </Alert.Heading>
                      <p>{error}</p>
                    </Alert>
                  )}

                  {success && (
                    <Alert variant="success" className="register-alert" dismissible>
                      <Alert.Heading className="alert-heading">
                        <FaCheckCircle className="me-2" />
                        Registration Successful!
                      </Alert.Heading>
                      <p>{success}</p>
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="form-label">
                            <FaUser className="me-2" />
                            First Name <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="firstName"
                            placeholder="Enter first name"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="form-control-lg"
                            disabled={loading}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="form-label">
                            <FaUser className="me-2" />
                            Last Name <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="lastName"
                            placeholder="Enter last name"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="form-control-lg"
                            disabled={loading}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label className="form-label">
                        <FaEnvelope className="me-2" />
                        Email Address <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-control-lg"
                        disabled={loading}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="form-label">
                        <FaPhone className="me-2" />
                        Phone Number <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={handleChange}
                        className="form-control-lg"
                        disabled={loading}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="form-label">
                        <FaBuilding className="me-2" />
                        Company Name <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="company"
                        placeholder="Enter company name"
                        value={formData.company}
                        onChange={handleChange}
                        className="form-control-lg"
                        disabled={loading}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="form-label">
                        <FaLock className="me-2" />
                        Password <span className="text-danger">*</span>
                      </Form.Label>
                      <InputGroup>
                        <Form.Control
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          placeholder="Create a password"
                          value={formData.password}
                          onChange={handleChange}
                          className="form-control-lg"
                          disabled={loading}
                          required
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={togglePasswordVisibility}
                          className="password-toggle"
                          disabled={loading}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </Button>
                      </InputGroup>
                      
                      {formData.password && (
                        <div className="password-strength mt-2">
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="strength-label">Password Strength:</span>
                            <span className={`strength-text text-${passwordStrength.color}`}>
                              {passwordStrength.label}
                            </span>
                          </div>
                          <ProgressBar 
                            now={(passwordStrength.score / 5) * 100} 
                            variant={passwordStrength.color}
                            className="strength-bar"
                            style={{ height: '4px' }}
                          />
                          <small className="text-muted">
                            {passwordStrength.score >= 4 ? 'Excellent password!' :
                             passwordStrength.score >= 3 ? 'Good password, add more characters for extra security.' :
                             'Use at least 8 characters with uppercase, lowercase, numbers, and symbols.'}
                          </small>
                        </div>
                      )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="form-label">
                        <FaLock className="me-2" />
                        Confirm Password <span className="text-danger">*</span>
                      </Form.Label>
                      <InputGroup>
                        <Form.Control
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="form-control-lg"
                          disabled={loading}
                          required
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={toggleConfirmPasswordVisibility}
                          className="password-toggle"
                          disabled={loading}
                        >
                          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </Button>
                      </InputGroup>
                      {formData.confirmPassword && formData.password && (
                        <div className="password-match mt-1">
                          {formData.password === formData.confirmPassword ? (
                            <span className="text-success">
                              <FaCheckCircle className="me-1" /> Passwords match
                            </span>
                          ) : (
                            <span className="text-danger">
                              <FaTimesCircle className="me-1" /> Passwords do not match
                            </span>
                          )}
                        </div>
                      )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Check
                        type="checkbox"
                        name="agreeTerms"
                        label={
                          <span className="terms-label">
                            I agree to the <a href="#" className="terms-link">Terms and Conditions</a> and 
                            <a href="#" className="terms-link"> Privacy Policy</a>
                          </span>
                        }
                        checked={formData.agreeTerms}
                        onChange={handleChange}
                        disabled={loading}
                        className="terms-check"
                      />
                    </Form.Group>

                    <Button 
                      variant="primary" 
                      type="submit" 
                      className="register-btn"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Creating Account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </Button>

                    <div className="register-footer">
                      <p className="login-link">
                        Already have an account? <Link to="/login" className="login-link-text">Sign In</Link>
                      </p>
                    </div>
                  </Form>
                </Card.Body>
              </Card>

              <div className="register-copyright">
                <p>&copy; {new Date().getFullYear()} EMS. All rights reserved.</p>
              </div>
            </div>
          </Col>

          {/* Right Column - Hero Section */}
          <Col lg={6} md={12} className="register-hero-col d-none d-lg-block">
            <div className="register-hero">
              <div className="hero-content">
                <div className="hero-icon">
                  <FaBuilding />
                </div>
                <h2 className="hero-title">Start Your Journey</h2>
                <p className="hero-description">
                  Join thousands of companies using EMS to streamline their 
                  HR operations. Get started with a free trial today.
                </p>
                <div className="hero-benefits">
                  <div className="hero-benefit">
                    <div className="benefit-check">
                      <FaCheckCircle />
                    </div>
                    <div>
                      <h6>Free 30-Day Trial</h6>
                      <p>No credit card required</p>
                    </div>
                  </div>
                  <div className="hero-benefit">
                    <div className="benefit-check">
                      <FaCheckCircle />
                    </div>
                    <div>
                      <h6>Full Feature Access</h6>
                      <p>All premium features included</p>
                    </div>
                  </div>
                  <div className="hero-benefit">
                    <div className="benefit-check">
                      <FaCheckCircle />
                    </div>
                    <div>
                      <h6>24/7 Support</h6>
                      <p>Dedicated support team</p>
                    </div>
                  </div>
                </div>
                <div className="hero-testimonial">
                  <div className="testimonial-avatar-group">
                    <div className="testimonial-avatar">JD</div>
                    <div className="testimonial-avatar">JS</div>
                    <div className="testimonial-avatar">MK</div>
                    <div className="testimonial-avatar-plus">+</div>
                  </div>
                  <div className="testimonial-text">
                    <p>"EMS transformed our HR operations. Highly recommended!"</p>
                    <span className="testimonial-author">- John Doe, CEO</span>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;