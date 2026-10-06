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
import EmployeeReports from './components/employees/EmployeeReports';
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
import LoanReports from './components/loan/LoanReports';
import TaskBoard from './components/project/TaskBoard';
import PayslipHistory from './components/payslip/PayslipHistory';
import AddJobPosting from './components/recruitment/AddJobPosting';
import ApplicantList from './components/recruitment/ApplicantList';
import SavedReports from './components/reports/SavedReports';
import RewardReports from './components/rewards/RewardReports';
import AddDepartment from './components/department/AddDepartment';
import MarkAttendance from './components/attendance/MarkAttendance';
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

                <Route path="/employees/reports" element={
                  <PrivateRoute>
                    <EmployeeReports />
                  </PrivateRoute>
                } />
                
                <Route path="/department" element={
                  <PrivateRoute>
                    <Department />
                  </PrivateRoute>
                } />
                

                <Route path="/department/add" element={
                  <PrivateRoute>
                    <AddDepartment />
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
                

                <Route path="/attendance/mark" element={
                   <PrivateRoute> 
                     <MarkAttendance />
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

               <Route path="/loan/reports" element={
                 <PrivateRoute>
                   <LoanReports />
                 </PrivateRoute>
                } />
                
                <Route path="/projects" element={
                  <PrivateRoute>
                    <ProjectManagement />
                  </PrivateRoute>
                } />

               <Route path="/projects/tasks" element={
                 <PrivateRoute>
                  <TaskBoard />
                 </PrivateRoute>
                } />
                
                <Route path="/recruitment" element={
                  <PrivateRoute>
                    <Recruitment />
                  </PrivateRoute>
                } />

               <Route path="/recruitment/add" element={
                 <PrivateRoute>
                   <AddJobPosting />
                 </PrivateRoute>
                 } />

               <Route path="/recruitment/jobs/add" element={<Navigate to="/recruitment/add" replace />} />

              <Route path="/recruitment/applicants" element={
                <PrivateRoute>
                  <ApplicantList />
                  </PrivateRoute>
               } />
                
                <Route path="/reports" element={
                  <PrivateRoute>
                    <Reports />
                  </PrivateRoute>
                } />


               <Route path="/reports/saved" element={
                 <PrivateRoute>
                  <SavedReports />
                </PrivateRoute>
               } />
                
                <Route path="/rewards" element={
                  <PrivateRoute>
                    <RewardPoints />
                  </PrivateRoute>
                } />
                <Route path="/awards" element={<Navigate to="/rewards" replace />} />

                <Route path="/rewards/reports" element={
                  <PrivateRoute>
                    <RewardReports />
                  </PrivateRoute>
                } />
                <Route path="/awards/reports" element={<Navigate to="/rewards/reports" replace />} />
                <Route path="/awards/report" element={<Navigate to="/rewards/reports" replace />} />
                <Route path="/award-reports" element={<Navigate to="/rewards/reports" replace />} />
                
                <Route path="/payslip" element={
                  <PrivateRoute>
                    <Payslip />
                  </PrivateRoute>
                } />

               <Route path="/payslip/history" element={
                  <PrivateRoute>
                   <PayslipHistory />
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
