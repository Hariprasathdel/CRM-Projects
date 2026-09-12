import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Sidebar from '../components/common/Sidebar';
import TotalEmployeeCard from '../components/dashboard/TotalEmployeeCard';
import DailyAttendanceStat from '../components/dashboard/DailyAttendanceStat';
import ChartSection from '../components/dashboard/ChartSection';
import TodayPresents from '../components/dashboard/TodayPresents';
import TodayAbsents from '../components/dashboard/TodayAbsents';
import TodayLeave from '../components/dashboard/TodayLeave';
import LeaveApplicationList from '../components/dashboard/LeaveApplicationList';
import EmployeeAwardList from '../components/dashboard/EmployeeAwardList';
import './DashboardPage.css';

const DashboardPage = () => {
  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className="main-content">
        <Container fluid className="p-4">
          <h2 className="mb-4">Dashboard</h2>
          
          <Row className="mb-4">
              <Col lg={3} md={6} className="mb-3">
                <TotalEmployeeCard />
              </Col>
            <Col lg={3} md={6} className="mb-3">
              <DailyAttendanceStat type="present" />
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <DailyAttendanceStat type="absent" />
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <DailyAttendanceStat type="leave" />
            </Col>
          </Row>

          <Row className="mb-4">
            <Col lg={8} className="mb-3">
              <ChartSection />
            </Col>
            <Col lg={4} className="mb-3">
              <TodayPresents />
            </Col>
          </Row>

          <Row className="mb-4">
            <Col lg={4} className="mb-3">
              <TodayAbsents />
            </Col>
            <Col lg={4} className="mb-3">
              <TodayLeave />
            </Col>
            <Col lg={4} className="mb-3">
              <Card className="p-3">
                <h5>Quick Actions</h5>
                <p>Add quick action buttons here</p>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col lg={6} className="mb-3">
              <LeaveApplicationList />
            </Col>
            <Col lg={6} className="mb-3">
              <EmployeeAwardList />
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default DashboardPage;