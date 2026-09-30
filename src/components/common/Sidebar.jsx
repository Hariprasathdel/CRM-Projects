import React, { useState } from 'react';
import { Nav, Navbar, Collapse, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaHome, FaUsers, FaBuilding, FaCalendarCheck, 
  FaFileAlt, FaHands, FaProjectDiagram, FaUserPlus,
  FaChartBar, FaTrophy, FaSignOutAlt, FaBars, 
  FaTimes, FaChevronDown, FaChevronRight
} from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMenu = (menuName) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <FaHome className="menu-icon" />,
      subMenus: []
    },
    {
      name: 'Attendance',
      path: '/attendance',
      icon: <FaCalendarCheck className="menu-icon" />,
      subMenus: [
        { name: 'All Attendance', path: '/attendance' },
        { name: 'Attendance Report', path: '/attendance/report' },
        // { name: 'Mark Attendance', path: '/attendance/mark' },
      ]
    },
    {
      name: 'Employee',
      path: '/employees',
      icon: <FaUsers className="menu-icon" />,
      subMenus: [
        { name: 'All Employees', path: '/employees' },
        { name: 'Employee Reports', path: '/employees/reports' }
        // { name: 'Add Employee', path: '/employees/add' },
      ]
    },
    {
      name: 'Department',
      path: '/department',
      icon: <FaBuilding className="menu-icon" />,
      subMenus: [
        { name: 'All Departments', path: '/department' },
        // { name: 'Add Department', path: '/department/add' }
      ]
    },
    {
      name: 'Leave',
      path: '/leave',
      icon: <FaFileAlt className="menu-icon" />,
      subMenus: [
        { name: 'Leave Applications', path: '/leave' },
        // { name: 'Apply Leave', path: '/leave/apply' },
        // { name: 'Leave Balance', path: '/leave/balance' }
      ]
    },
    {
      name: 'Loan',
      path: '/loan',
      icon: <FaHands className="menu-icon" />,
      subMenus: [
        { name: 'All Loans', path: '/loan' },
        // { name: 'Apply Loan', path: '/loan/apply' },
        // { name: 'Loan Reports', path: '/loan/reports' }
      ]
    },
    {
      name: 'Project Management',
      path: '/projects',
      icon: <FaProjectDiagram className="menu-icon" />,
      subMenus: [
        { name: 'All Projects', path: '/projects' },
        // { name: 'Add Project', path: '/projects/add' },
        // { name: 'Task Board', path: '/projects/tasks' }
      ]
    },
    {
      name: 'Payslip',
      path: '/payslip',
      icon: <FaFileAlt className="menu-icon" />,  
    subMenus: [
        { name: 'Generate Payslip', path: '/payslip' },
        // { name: 'Payslip History', path: '/payslip/history' }
      ]
    },
    {
      name: 'Recruitment',
      path: '/recruitment',
      icon: <FaUserPlus className="menu-icon" />,
      subMenus: [
        { name: 'Job Postings', path: '/recruitment' },
        // { name: 'Add Job Posting', path: '/recruitment/add' },
        // { name: 'Applicants', path: '/recruitment/applicants' }
      ]
    },
    {
      name: 'Reports',
      path: '/reports',
      icon: <FaChartBar className="menu-icon" />,
      subMenus: [
        { name: 'Generate Reports', path: '/reports' },
        // { name: 'Saved Reports', path: '/reports/saved' }
      ]
    },
    {
      name: 'Reward Points',
      path: '/rewards',
      icon: <FaTrophy className="menu-icon" />,
      subMenus: [
        { name: 'Award List', path: '/rewards' },
        // { name: 'Give Award', path: '/rewards/give' },
        // { name: 'Reward Reports', path: '/rewards/reports' }
      ]
    }
  ];

  return (
    <div className={`sidebar-wrapper ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          {!collapsed ? (
            <h4 className="logo-text">CRM Employee Dashboard</h4>
          ) : (
            <div className="logo-icon">E</div>
          )}
        </div>
        <Button 
          variant="light" 
          size="sm" 
          className="toggle-btn"
          onClick={toggleSidebar}
        >
          {collapsed ? <FaBars /> : <FaTimes />}
        </Button>
      </div>

      <div className="sidebar-menu">
        <Nav className="flex-column">
          {menuItems.map((item, index) => (
            <div key={index} className="menu-item-wrapper">
              {item.subMenus && item.subMenus.length > 0 ? (
                <>
                  <div 
                    className={`menu-item has-submenu ${isActive(item.path)}`}
                    onClick={() => toggleMenu(item.name)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="menu-item-content">
                      {item.icon}
                      {!collapsed && <span className="menu-label">{item.name}</span>}
                    </div>
                    {!collapsed && (
                      <span className="menu-arrow">
                        {expandedMenus[item.name] ? <FaChevronDown /> : <FaChevronRight />}
                      </span>
                    )}
                  </div>
                  <Collapse in={expandedMenus[item.name] && !collapsed}>
                    <div className="submenu">
                      {item.subMenus.map((sub, subIndex) => (
                        <Nav.Link 
                          key={subIndex}
                          as={Link} 
                          to={sub.path}
                          className={`submenu-item ${location.pathname === sub.path ? 'active' : ''}`}
                        >
                          <span className="submenu-dot">•</span>
                          <span className="submenu-label">{sub.name}</span>
                        </Nav.Link>
                      ))}
                    </div>
                  </Collapse>
                </>
              ) : (
                <Nav.Link 
                  as={Link} 
                  to={item.path}
                  className={`menu-item ${isActive(item.path)}`}
                >
                  <div className="menu-item-content">
                    {item.icon}
                    {!collapsed && <span className="menu-label">{item.name}</span>}
                  </div>
                </Nav.Link>
              )}
            </div>
          ))}

          <hr className="menu-divider" />
          
          <Nav.Link 
            onClick={handleLogout}
            className="menu-item logout-item"
          >
            <div className="menu-item-content">
              <FaSignOutAlt className="menu-icon text-danger" />
              {!collapsed && <span className="menu-label text-danger">Logout</span>}
            </div>
          </Nav.Link>
        </Nav>
      </div>

      {!collapsed && (
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">HP</div>
            <div className="user-details">
              <div className="user-name">Hari Prasath</div>
              <div className="user-role">Administrator</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;