import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaHeart, FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <Container fluid>
        <Row className="align-items-center">
          <Col md={6} className="footer-left">
            <div className="footer-copyright">
              © {currentYear} Employee Management System. 
              Made with <FaHeart className="heart-icon" /> by EMS Team
            </div>
          </Col>
          
          <Col md={6} className="footer-right">
            <div className="footer-links">
              <a href="#" className="footer-link">Privacy Policy</a>
              <span className="footer-divider">|</span>
              <a href="#" className="footer-link">Terms of Service</a>
              <span className="footer-divider">|</span>
              <a href="#" className="footer-link">Contact</a>
            </div>
            
            <div className="social-icons">
              <a href="#" className="social-link" aria-label="GitHub">
                <FaGithub />
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <FaTwitter />
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;