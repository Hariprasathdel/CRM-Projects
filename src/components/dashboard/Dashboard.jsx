import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { FaSync, FaDownload, FaCalendarAlt } from 'react-icons/fa';
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
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const stats = {
    totalEmployees: 26,
    employeeGrowth: 4,
    present: 4,
    absent: 13,
    leave: 9,
    presentPercentage: 15,
    absentPercentage: 50,
    leavePercentage: 35
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="dashboard-page">
      <Container fluid>
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-left">
            <h2 className="page-title">Dashboard</h2>
            <p className="page-subtitle">
              Welcome back! Here's what's happening today
            </p>
          </div>
          <div className="header-right">
            <span className="last-updated">
              <FaCalendarAlt className="me-1" />
              Last updated: {lastUpdated.toLocaleString()}
            </span>
            <Button 
              variant="outline-primary" 
              size="sm" 
              onClick={handleRefresh}
              disabled={loading}
            >
              <FaSync className={loading ? 'spin' : ''} /> Refresh
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted">Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* Statistics Cards */}
            <Row className="g-4 mb-4">
              <Col xl={3} lg={6} md={6} sm={6} xs={12}>
                <TotalEmployeeCard 
                  total={stats.totalEmployees}
                  growth={stats.employeeGrowth}
                  percentage={100}
                />
              </Col>
              <Col xl={3} lg={6} md={6} sm={6} xs={12}>
                <DailyAttendanceStat 
                  type="present"
                  count={stats.present}
                  percentage={stats.presentPercentage}
                  total={stats.totalEmployees}
                />
              </Col>
              <Col xl={3} lg={6} md={6} sm={6} xs={12}>
                <DailyAttendanceStat 
                  type="absent"
                  count={stats.absent}
                  percentage={stats.absentPercentage}
                  total={stats.totalEmployees}
                />
              </Col>
              <Col xl={3} lg={6} md={6} sm={6} xs={12}>
                <DailyAttendanceStat 
                  type="leave"
                  count={stats.leave}
                  percentage={stats.leavePercentage}
                  total={stats.totalEmployees}
                />
              </Col>
            </Row>

            {/* Chart and Today Presents */}
            <Row className="g-4 mb-4">
              <Col xl={8} lg={12} md={12}>
                <ChartSection />
              </Col>
              <Col xl={4} lg={12} md={12}>
                <TodayPresents 
                  count={stats.present}
                  percentage={stats.presentPercentage}
                  total={stats.totalEmployees}
                />
              </Col>
            </Row>

            {/* Today Absents & Leave */}
            <Row className="g-4 mb-4">
              <Col xl={6} lg={6} md={12}>
                <TodayAbsents 
                  count={stats.absent}
                  percentage={stats.absentPercentage}
                  total={stats.totalEmployees}
                />
              </Col>
              <Col xl={6} lg={6} md={12}>
                <TodayLeave 
                  count={stats.leave}
                  percentage={stats.leavePercentage}
                  total={stats.totalEmployees}
                />
              </Col>
            </Row>

            {/* Leave Applications and Awards */}
            <Row className="g-4">
              <Col xl={6} lg={6} md={12}>
                <LeaveApplicationList />
              </Col>
              <Col xl={6} lg={6} md={12}>
                <EmployeeAwardList />
              </Col>
            </Row>
          </>
        )}
      </Container>
    </div>
  );
};

export default Dashboard;