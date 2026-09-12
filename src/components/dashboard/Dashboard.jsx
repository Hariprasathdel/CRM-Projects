import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaUsers, FaUserCheck, FaUserTimes, FaUserClock } from 'react-icons/fa';
import TotalEmployeeCard from './TotalEmployeeCard';
import DailyAttendanceStat from './DailyAttendanceStat';
import ChartSection from './ChartSection';
import TodayPresents from './TodayPresents';
import TodayAbsents from './TodayAbsents';
import TodayLeave from './TodayLeave';
import LeaveApplicationList from './LeaveApplicationList';
import EmployeeAwardList from './EmployeeAwardList';
import './Dashboard.css';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEmployees: 26,
    employeeGrowth: 4,
    present: 4,
    absent: 13,
    leave: 9,
    presentPercentage: 15,
    absentPercentage: 50,
    leavePercentage: 35
  });

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const statsData = [
    {
      title: 'Total Employees',
      value: stats.totalEmployees,
      percentage: '100%',
      icon: <FaUsers />,
      color: 'primary',
      growth: `+${stats.employeeGrowth} from last week`
    },
    {
      title: 'Present Today',
      value: stats.present,
      percentage: `${stats.presentPercentage}%`,
      icon: <FaUserCheck />,
      color: 'success',
      growth: `${stats.present} out of ${stats.totalEmployees}`
    },
    {
      title: 'Absent Today',
      value: stats.absent,
      percentage: `${stats.absentPercentage}%`,
      icon: <FaUserTimes />,
      color: 'danger',
      growth: `${stats.absent} employees absent`
    },
    {
      title: 'On Leave',
      value: stats.leave,
      percentage: `${stats.leavePercentage}%`,
      icon: <FaUserClock />,
      color: 'warning',
      growth: `${stats.leave} on leave today`
    }
  ];

  return (
    <div className="dashboard-page">
      <Container fluid>
        {/* Page Header */}
        <div className="dashboard-header">
          <div>
            <h2 className="dashboard-title">Dashboard</h2>
            <p className="dashboard-subtitle">Welcome back! Here's what's happening today</p>
          </div>
          <div className="dashboard-actions">
            <span className="last-updated">
              Last updated: {new Date().toLocaleString()}
            </span>
          </div>
        </div>

        {/* Statistics Cards Row */}
        <Row className="g-4 mb-4">
          <Col lg={3} md={6} sm={6} xs={12}>
            <TotalEmployeeCard 
              total={stats.totalEmployees}
              growth={stats.employeeGrowth}
              loading={loading}
            />
          </Col>
          <Col lg={3} md={6} sm={6} xs={12}>
            <DailyAttendanceStat 
              type="present"
              count={stats.present}
              percentage={stats.presentPercentage}
              total={stats.totalEmployees}
              loading={loading}
            />
          </Col>
          <Col lg={3} md={6} sm={6} xs={12}>
            <DailyAttendanceStat 
              type="absent"
              count={stats.absent}
              percentage={stats.absentPercentage}
              total={stats.totalEmployees}
              loading={loading}
            />
          </Col>
          <Col lg={3} md={6} sm={6} xs={12}>
            <DailyAttendanceStat 
              type="leave"
              count={stats.leave}
              percentage={stats.leavePercentage}
              total={stats.totalEmployees}
              loading={loading}
            />
          </Col>
        </Row>

        {/* Chart and Today Presents Row */}
        <Row className="g-4 mb-4">
          <Col lg={8} md={12}>
            <ChartSection />
          </Col>
          <Col lg={4} md={12}>
            <TodayPresents 
              count={stats.present}
              percentage={stats.presentPercentage}
              total={stats.totalEmployees}
            />
          </Col>
        </Row>

        {/* Today Absents, Today Leave, and Quick Actions Row */}
        <Row className="g-4 mb-4">
          <Col lg={4} md={6}>
            <TodayAbsents 
              count={stats.absent}
              percentage={stats.absentPercentage}
              total={stats.totalEmployees}
            />
          </Col>
          <Col lg={4} md={6}>
            <TodayLeave 
              count={stats.leave}
              percentage={stats.leavePercentage}
              total={stats.totalEmployees}
            />
          </Col>
          <Col lg={4} md={12}>
            <div className="quick-actions-card">
              <h5 className="quick-actions-title">Quick Actions</h5>
              <div className="quick-actions-grid">
                <button className="quick-action-btn">
                  <span className="quick-action-icon">📋</span>
                  <span>Mark Attendance</span>
                </button>
                <button className="quick-action-btn">
                  <span className="quick-action-icon">📝</span>
                  <span>Apply Leave</span>
                </button>
                <button className="quick-action-btn">
                  <span className="quick-action-icon">👤</span>
                  <span>Add Employee</span>
                </button>
                <button className="quick-action-btn">
                  <span className="quick-action-icon">📊</span>
                  <span>Generate Report</span>
                </button>
              </div>
            </div>
          </Col>
        </Row>

        {/* Leave Applications and Awards Row */}
        <Row className="g-4">
          <Col lg={6} md={12}>
            <LeaveApplicationList />
          </Col>
          <Col lg={6} md={12}>
            <EmployeeAwardList />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;