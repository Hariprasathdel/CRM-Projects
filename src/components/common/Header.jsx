import React, { useState } from 'react';
import { 
  Navbar, 
  Container, 
  Nav, 
  Dropdown, 
  Badge,
  Form,
  InputGroup,
  Button,
  Offcanvas
} from 'react-bootstrap';
import { 
  FaBell, 
  FaEnvelope, 
  FaSearch, 
  FaUserCircle,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
  FaBars
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ toggleSidebar }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const notifications = [
    { id: 1, title: 'New leave request', time: '5 min ago', read: false },
    { id: 2, title: 'Employee added successfully', time: '1 hour ago', read: false },
    { id: 3, title: 'Project deadline approaching', time: '2 hours ago', read: true },
    { id: 4, title: 'Award given to John Doe', time: '1 day ago', read: true },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Implement search functionality
  };

  return (
    <>
      <Navbar className="header-navbar" expand="lg">
        <Container fluid>
          {/* Left side - Toggle and Brand */}
          <div className="header-left">
            <Button 
              variant="light" 
              className="sidebar-toggle-btn"
              onClick={toggleSidebar}
            >
              <FaBars />
            </Button>
            <Navbar.Brand className="brand-text">
              <span className="brand-icon">🏢</span>
              <span className="brand-name">Employee Management</span>
            </Navbar.Brand>
          </div>

          {/* Middle - Search Bar */}
          <div className="header-center">
            <Form onSubmit={handleSearch} className="search-form">
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Search employees, projects, departments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <Button variant="primary" type="submit" className="search-btn">
                  <FaSearch />
                </Button>
              </InputGroup>
            </Form>
          </div>

          {/* Right side - Actions */}
          <div className="header-right">
            <Nav className="align-items-center">
              {/* Notifications */}
              <Dropdown 
                show={showNotifications}
                onToggle={() => setShowNotifications(!showNotifications)}
                align="end"
              >
                <Dropdown.Toggle variant="light" className="notification-toggle">
                  <FaBell className="nav-icon" />
                  <Badge bg="danger" className="notification-badge">
                    {notifications.filter(n => !n.read).length}
                  </Badge>
                </Dropdown.Toggle>

                <Dropdown.Menu className="notification-menu">
                  <div className="notification-header">
                    <h6>Notifications</h6>
                    <Button variant="link" size="sm">Mark all as read</Button>
                  </div>
                  <div className="notification-list">
                    {notifications.map(notification => (
                      <Dropdown.Item key={notification.id} className="notification-item">
                        <div className="notification-content">
                          <div className={`notification-title ${!notification.read ? 'unread' : ''}`}>
                            {notification.title}
                          </div>
                          <div className="notification-time">{notification.time}</div>
                        </div>
                      </Dropdown.Item>
                    ))}
                  </div>
                  <div className="notification-footer">
                    <Button variant="link" size="sm" className="w-100">
                      View all notifications
                    </Button>
                  </div>
                </Dropdown.Menu>
              </Dropdown>

              {/* Messages */}
              <Nav.Link className="message-link">
                <FaEnvelope className="nav-icon" />
                <Badge bg="primary" className="message-badge">3</Badge>
              </Nav.Link>

              {/* User Profile */}
              <Dropdown align="end">
                <Dropdown.Toggle variant="light" className="profile-toggle">
                  <div className="profile-info">
                    <div className="profile-avatar">
                      <FaUserCircle className="avatar-icon" />
                    </div>
                    <div className="profile-details d-none d-md-block">
                      <div className="profile-name">John Doe</div>
                      <div className="profile-role">Administrator</div>
                    </div>
                  </div>
                </Dropdown.Toggle>

                <Dropdown.Menu className="profile-menu">
                  <Dropdown.Header className="profile-menu-header">
                    <div className="profile-menu-avatar">
                      <FaUserCircle />
                    </div>
                    <div>
                      <div className="profile-menu-name">John Doe</div>
                      <div className="profile-menu-email">john.doe@example.com</div>
                    </div>
                  </Dropdown.Header>
                  
                  <Dropdown.Divider />
                  
                  <Dropdown.Item as={Link} to="/profile">
                    <FaUserCircle className="dropdown-icon" /> My Profile
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/settings">
                    <FaCog className="dropdown-icon" /> Settings
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/help">
                    <FaQuestionCircle className="dropdown-icon" /> Help
                  </Dropdown.Item>
                  
                  <Dropdown.Divider />
                  
                  <Dropdown.Item onClick={handleLogout} className="logout-item">
                    <FaSignOutAlt className="dropdown-icon text-danger" /> 
                    <span className="text-danger">Logout</span>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </div>
        </Container>
      </Navbar>

      {/* Mobile Sidebar Overlay */}
      <div className="sidebar-overlay" onClick={toggleSidebar}></div>
    </>
  );
};

export default Header;