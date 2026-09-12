import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container, 
  Row, 
  Col, 
  Card, 
  Form, 
  Button, 
  Alert, 
  Spinner,
  InputGroup
} from 'react-bootstrap';
import { 
  FaUser, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaBuilding,
  FaShieldAlt
} from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await login(email.trim(), password);

      if (!result.success) {
        setError(result.error?.message || 'Invalid email or password. Please try again.');
        return;
      }

      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }

      const destination = location.state?.from?.pathname || '/dashboard';
      navigate(destination, { replace: true });
    } catch {
      setError('Login failed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page">
      <Container fluid className="login-container">
        <Row className="login-row">
          <Col xs={12} className="login-form-col">
            <div className="login-form-wrapper">
              <div className="login-brand">
                <div className="brand-icon">
                  <FaBuilding />
                </div>
                <h1 className="brand-name">CRM</h1>
                <p className="brand-tagline">Customer Relationship Management</p>
              </div>

              <Card className="login-card">
                <Card.Body className="p-4">
                  <div className="login-header">
                    <h3 className="login-title">Welcome Back</h3>
                    <p className="login-subtitle">Sign in to your account to continue</p>
                  </div>

                  {error && (
                    <Alert variant="danger" className="login-alert" dismissible>
                      <Alert.Heading className="alert-heading">
                        <FaShieldAlt className="me-2" />
                        Login Failed
                      </Alert.Heading>
                      <p>{error}</p>
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label">
                        <FaUser className="me-2" />
                        Email Address
                      </Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control-lg"
                        disabled={loading}
                        autoFocus
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="form-label">
                        <FaLock className="me-2" />
                        Password
                      </Form.Label>
                      <InputGroup>
                        <Form.Control
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="form-control-lg"
                          disabled={loading}
                        />
                        <Button
                          type="button"
                          variant="outline-secondary"
                          onClick={togglePasswordVisibility}
                          className="password-toggle"
                          disabled={loading}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </Button>
                      </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-3 d-flex justify-content-between align-items-center">
                      <Form.Check
                        type="checkbox"
                        label="Remember me"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        disabled={loading}
                        className="remember-check"
                      />
                      <a href="mailto:support@crm.com?subject=Password%20reset" className="forgot-password">
                        Forgot Password?
                      </a>
                    </Form.Group>

                    <Button 
                      variant="primary" 
                      type="submit" 
                      className="login-btn"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Signing in...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </Button>

                    <div className="login-footer">
                      <p className="demo-credentials">
                        <span className="demo-label">Demo Credentials:</span>
                        <br />
                        <span className="demo-text">Email: admin@crm.com</span>
                        <br />
                        <span className="demo-text">Password: password123</span>
                      </p>
                    </div>
                  </Form>
                </Card.Body>
              </Card>

              <div className="login-copyright">
                <p>&copy; {new Date().getFullYear()} EMS. All rights reserved.</p>
              </div>
            </div>
          </Col>

        </Row>
      </Container>
    </div>
  );
};

export default Login;
