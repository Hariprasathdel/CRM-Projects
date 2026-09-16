import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from '../components/common/Sidebar';
import TotalEmployeeCard from '../components/dashboard/TotalEmployeeCard';
import DailyAttendanceStat from '../components/dashboard/DailyAttendanceStat';
import ChartSection from '../components/dashboard/ChartSection';
import TodayPresents from '../components/dashboard/TodayPresents';
import TodayAbsents from '../components/dashboard/TodayAbsents';
import TodayLeave from '../components/dashboard/TodayLeave';
import LeaveApplicationList from '../components/dashboard/LeaveApplicationList';
import EmployeeAwardList from '../components/dashboard/EmployeeAwardList';
import api from '../services/api';
import './DashboardPage.css';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await api.get('/dashboard/stats');
        setStats(response.data);
      } catch (err) {
        console.error('Failed to load live dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const totalEmployees = stats?.totalEmployees ?? 8;
  const growth = stats?.employeeGrowth?.percentage ?? 100;
  const attendance = stats?.attendance || {};

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className="main-content">
        <Container fluid className="p-4">
          <h2 className="mb-4">Dashboard</h2>
          
          <Row className="mb-4">
            <Col lg={3} md={6} className="mb-3">
              <TotalEmployeeCard 
                total={totalEmployees} 
                growth={growth} 
                loading={loading} 
              />
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <DailyAttendanceStat 
                type="present" 
                count={attendance.presentCount ?? 6} 
                percentage={attendance.present ?? 75} 
                total={totalEmployees} 
                loading={loading} 
              />
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <DailyAttendanceStat 
                type="absent" 
                count={attendance.absentCount ?? 1} 
                percentage={attendance.absent ?? 13} 
                total={totalEmployees} 
                loading={loading} 
              />
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <DailyAttendanceStat 
                type="leave" 
                count={attendance.leaveCount ?? 1} 
                percentage={attendance.leave ?? 13} 
                total={totalEmployees} 
                loading={loading} 
              />
            </Col>
          </Row>

          <Row className="mb-4">
            <Col lg={8} className="mb-3">
              <ChartSection />
            </Col>
            <Col lg={4} className="mb-3">
              <TodayPresents 
                count={attendance.presentCount ?? 6} 
                percentage={attendance.present ?? 75} 
                total={totalEmployees} 
              />
            </Col>
          </Row>

          <Row className="mb-4">
            <Col lg={6} className="mb-3">
              <TodayAbsents 
                count={attendance.absentCount ?? 1} 
                percentage={attendance.absent ?? 13} 
                total={totalEmployees} 
              />
            </Col>
            <Col lg={6} className="mb-3">
              <TodayLeave 
                count={attendance.leaveCount ?? 1} 
                percentage={attendance.leave ?? 13} 
                total={totalEmployees} 
              />
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

