import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHome, FaSearch, FaArrowLeft } from 'react-icons/fa';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-page">
      <Container>
        <Row className="not-found-row">
          <Col md={8} lg={6} className="mx-auto text-center">
            <div className="not-found-content">
              <div className="error-animation">
                <div className="error-code">404</div>
                <div className="error-circle"></div>
                <div className="error-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>

              <h1 className="error-title">Page Not Found</h1>
              <p className="error-description">
                Oops! The page you're looking for doesn't exist or has been moved.
                Let's get you back on track.
              </p>

              <div className="error-actions">
                <Button 
                  as={Link} 
                  to="/dashboard" 
                  variant="primary" 
                  className="error-btn-primary"
                >
                  <FaHome className="me-2" />
                  Go to Dashboard
                </Button>
                <Button 
                  onClick={() => window.history.back()} 
                  variant="outline-secondary" 
                  className="error-btn-secondary"
                >
                  <FaArrowLeft className="me-2" />
                  Go Back
                </Button>
              </div>

              <div className="error-help">
                <p className="help-text">
                  <FaSearch className="help-icon" />
                  Looking for something specific? Check the navigation menu or 
                  contact support if you need assistance.
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default NotFound;