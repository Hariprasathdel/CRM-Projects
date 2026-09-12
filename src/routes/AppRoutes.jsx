import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

// Import Pages
import Login from '../pages/Login';
import Register from '../pages/Register';
import DashboardPage from '../pages/DashboardPage';
import NotFound from '../pages/NotFound';

// Import Components
import Employee from '../components/employees/Employee';
import Department from '../components/department/Department';
import Attendance from '../components/attendance/Attendance';
import Leave from '../components/leave/Leave';
import Loan from '../components/loan/Loan';
import ProjectManagement from '../components/project/ProjectManagement';
import Recruitment from '../components/recruitment/Recruitment';
import Reports from '../components/reports/Reports';
import RewardPoints from '../components/rewards/RewardPoints';
import Payslip from '../components/payslip/Payslip';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } />
      
      {/* Root Redirect */}
      <Route path="/" element={
        <Navigate to={isAuthenticated ? '/dashboard' : '/login'} />
      } />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <PrivateRoute>
          <DashboardPage />
        </PrivateRoute>
      } />
      
      <Route path="/employees" element={
        <PrivateRoute>
          <Employee />
        </PrivateRoute>
      } />
      
      <Route path="/employees/:id" element={
        <PrivateRoute>
          <Employee />
        </PrivateRoute>
      } />
      
      <Route path="/department" element={
        <PrivateRoute>
          <Department />
        </PrivateRoute>
      } />
      
      <Route path="/attendance" element={
        <PrivateRoute>
          <Attendance />
        </PrivateRoute>
      } />
      
      <Route path="/leave" element={
        <PrivateRoute>
          <Leave />
        </PrivateRoute>
      } />
      
      <Route path="/loan" element={
        <PrivateRoute>
          <Loan />
        </PrivateRoute>
      } />
      
      <Route path="/projects" element={
        <PrivateRoute>
          <ProjectManagement />
        </PrivateRoute>
      } />
      
      <Route path="/recruitment" element={
        <PrivateRoute>
          <Recruitment />
        </PrivateRoute>
      } />
      
      <Route path="/reports" element={
        <PrivateRoute>
          <Reports />
        </PrivateRoute>
      } />
      
      <Route path="/rewards" element={
        <PrivateRoute>
          <RewardPoints />
        </PrivateRoute>
      } />
      
      <Route path="/payslip" element={
        <PrivateRoute>
          <Payslip />
        </PrivateRoute>
      } />
      
      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;