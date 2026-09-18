import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { FaTrophy, FaMedal, FaStar, FaAward } from 'react-icons/fa';
import './Dashboard.css';

const EmployeeAwardList = () => {
  const awards = [
    {
      id: 1,
      sl: '01',
      name: 'Honorato Imogene Curry',
      department: 'Electrical',
      award: 'Gascapitol',
      date: '22-08-24',
      icon: <FaTrophy className="award-icon gold" />
    },
    {
      id: 2,
      sl: '02',
      name: 'Jonathan Ibrahim Sheikh',
      department: 'Production',
      award: 'Coby Beach',
      date: '30-11-01',
      icon: <FaMedal className="award-icon silver" />
    },
    {
      id: 3,
      sl: '03',
      name: 'Maisha Lucy Zamora Gon',
      department: 'Software',
      award: 'Best Employee',
      date: '22-08-24',
      icon: <FaStar className="award-icon gold" />
    },
    {
      id: 4,
      sl: '04',
      name: 'Sarah Williams',
      department: 'Marketing',
      award: 'Best Performer',
      date: '30-11-01',
      icon: <FaAward className="award-icon bronze" />
    },
    {
      id: 5,
      sl: '05',
      name: 'Thomas Goodman',
      department: 'Finance',
      award: 'Employee of the Month',
      date: '22-08-24',
      icon: <FaTrophy className="award-icon gold" />
    },
    {
      id: 6,
      sl: '06',
      name: 'Linda Martinez',
      department: 'HR',
      award: 'Best Team Player',
      date: '30-11-01',
      icon: <FaMedal className="award-icon silver" />
    }
  ];

  const getInitials = (name) =>
    name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <Card className="dashboard-card award-list-card h-100">
      <Card.Header className="card-header-custom">
        <div>
          <h5 className="card-title">
            <FaAward className="me-2 text-warning" />
            Employee Award List
          </h5>
          <span className="card-badge">{awards.length} awards</span>
        </div>
        <Button variant="outline-primary" size="sm">
          View All
        </Button>
      </Card.Header>

      <Card.Body className="p-0">
        <div className="award-list-scroll" tabIndex="0" aria-label="Employee awards table">
          <div className="award-list">
            {/* Header Row */}
            <div className="award-header-row">
              <div className="award-col-sl">SL.</div>
              <div className="award-col-avatar">Image</div>
              <div className="award-col-name">Name</div>
              <div className="award-col-dept">Department</div>
              <div className="award-col-award">Award</div>
              <div className="award-col-date">Date</div>
            </div>

            {awards.map((item) => (
              <div key={item.id} className="award-row">
                <div className="award-col-sl">
                  <Badge bg="light" text="dark" className="sl-badge">
                    {item.sl}
                  </Badge>
                </div>
                <div className="award-col-avatar">
                  <div className="award-avatar">{getInitials(item.name)}</div>
                </div>
                <div className="award-col-name">
                  <div className="award-name">{item.name}</div>
                </div>
                <div className="award-col-dept">
                  <Badge bg="secondary" className="dept-badge">
                    {item.department}
                  </Badge>
                </div>
                <div className="award-col-award">
                  <div className="award-type">
                    {item.icon}
                    <span className="award-type-name">{item.award}</span>
                  </div>
                </div>
                <div className="award-col-date">{item.date}</div>
              </div>
            ))}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default EmployeeAwardList;
