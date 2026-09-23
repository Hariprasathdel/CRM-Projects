import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


// Import Providers
import { AuthProvider } from './context/AuthContext';
import { EmployeeProvider } from './context/EmployeeContext';
import { ThemeProvider } from './context/ThemeContext';

// Import Pages
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardPage from './pages/DashboardPage';
import NotFound from './pages/NotFound';
import PrivateRoute from './routes/PrivateRoute';

// Import Components
import Employee from './components/employees/Employee';
import Department from './components/department/Department';
import Attendance from './components/attendance/Attendance';
import AttendanceReport from './components/attendance/AttendanceReport';
import Leave from './components/leave/Leave';
import Loan from './components/loan/Loan';
import ProjectManagement from './components/project/ProjectManagement';
import Recruitment from './components/recruitment/Recruitment';
import Reports from './components/reports/Reports';
import RewardPoints from './components/rewards/RewardPoints';
import Payslip from './components/payslip/Payslip';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <EmployeeProvider>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Navigate to="/dashboard" />} />
                
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

                <Route path="/attendance/report" element={
                  <PrivateRoute>
                    <AttendanceReport />
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
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </Router>
        </EmployeeProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
