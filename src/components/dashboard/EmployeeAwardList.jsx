import React from 'react';
import { Card, Table, Badge, Button, Image } from 'react-bootstrap';
import { FaTrophy, FaStar, FaMedal } from 'react-icons/fa';
import './Dashboard.css';

const EmployeeAwardList = () => {
  const awards = [
    {
      id: 1,
      name: 'Honorato Imogene curry',
      department: 'Electrical',
      award: 'Best Performer',
      date: '22-08-24',
      image: null,
      icon: <FaTrophy className="award-icon gold" />
    },
    {
      id: 2,
      name: 'Jonathan Ibrahim Sheikh',
      department: 'Production',
      award: 'Team Player',
      date: '30-11-01',
      image: null,
      icon: <FaMedal className="award-icon silver" />
    },
    {
      id: 3,
      name: 'Maisha Lucy Zamora Gon',
      department: 'Software',
      award: 'Best Employee',
      date: '22-08-24',
      image: null,
      icon: <FaStar className="award-icon gold" />
    },
    {
      id: 4,
      name: 'Rahul Kiran Sethi',
      department: 'Testing',
      award: 'Best Employee',
      date: '22-08-24',
      image: null,
      icon: <FaTrophy className="award-icon gold" />
    }
  ];

  return (
    <Card className="dashboard-card employee-award-card">
      <Card.Header className="card-header-with-actions">
        <div className="header-content">
          <h5 className="card-title">Employee Award List</h5>
          <span className="card-badge">{awards.length} awards</span>
        </div>
        <Button variant="outline-primary" size="sm">
          View All
        </Button>
      </Card.Header>
      <Card.Body className="p-0">
        <div className="awards-list">
          {awards.map((award, index) => (
            <div key={award.id} className="award-item">
              <div className="award-number">{String(index + 1).padStart(2, '0')}</div>
              <div className="award-avatar">
                {award.image ? (
                  <Image src={award.image} roundedCircle width={40} height={40} />
                ) : (
                  <div className="award-avatar-placeholder">
                    {award.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </div>
                )}
              </div>
              <div className="award-info">
                <div className="award-name">{award.name}</div>
                <div className="award-department">{award.department}</div>
              </div>
              <div className="award-details">
                <div className="award-icon-wrapper">
                  {award.icon}
                </div>
                <div className="award-name-badge">{award.award}</div>
              </div>
              <div className="award-date">{award.date}</div>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default EmployeeAwardList;
