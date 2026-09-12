import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import employeeService from '../services/employeeService';
import { useAuth } from '../hooks/useAuth';

// Create Employee Context
const EmployeeContext = createContext(null);

// Employee Provider Component
export const EmployeeProvider = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [departmentStats, setDepartmentStats] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  // Load all employees
  const loadEmployees = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await employeeService.getAllEmployees(params);
      if (result.success) {
        setEmployees(result.data.employees || result.data);
        setTotalEmployees(result.data.total || result.data.length || 0);
      } else {
        setError(result.error.message || 'Failed to load employees');
      }
    } catch (error) {
      setError('An error occurred while loading employees');
      console.error('Load employees error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load employee statistics
  const loadStatistics = useCallback(async () => {
    try {
      const result = await employeeService.getStatistics();
      if (result.success) {
        setDepartmentStats(result.data.departments || []);
      }
    } catch (error) {
      console.error('Load statistics error:', error);
    }
  }, []);

  // Employee endpoints are protected. Do not request them while the login page
  // is displayed, or while the authentication state is still being restored.
  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      setEmployees([]);
      setTotalEmployees(0);
      setDepartmentStats([]);
      setError(null);
      return;
    }

    void loadEmployees();
    void loadStatistics();
  }, [authLoading, isAuthenticated, loadEmployees, loadStatistics]);

  // Get employee by ID
  const getEmployeeById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await employeeService.getEmployeeById(id);
      if (result.success) {
        setSelectedEmployee(result.data);
        return { success: true, data: result.data };
      } else {
        setError(result.error.message || 'Employee not found');
        return { success: false, error: result.error };
      }
    } catch (error) {
      setError('An error occurred while fetching employee');
      return { success: false, error: { message: 'Employee not found' } };
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new employee
  const createEmployee = useCallback(async (employeeData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await employeeService.createEmployee(employeeData);
      if (result.success) {
        setEmployees(prev => [...prev, result.data]);
        setTotalEmployees(prev => prev + 1);
        await loadStatistics();
        return { success: true, data: result.data };
      } else {
        setError(result.error.message || 'Failed to create employee');
        return { success: false, error: result.error };
      }
    } catch (error) {
      setError('An error occurred while creating employee');
      return { success: false, error: { message: 'Failed to create employee' } };
    } finally {
      setLoading(false);
    }
  }, [loadStatistics]);

  // Update employee
  const updateEmployee = useCallback(async (id, employeeData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await employeeService.updateEmployee(id, employeeData);
      if (result.success) {
        setEmployees(prev => prev.map(emp => 
          emp.id === id ? { ...emp, ...result.data } : emp
        ));
        if (selectedEmployee && selectedEmployee.id === id) {
          setSelectedEmployee({ ...selectedEmployee, ...result.data });
        }
        return { success: true, data: result.data };
      } else {
        setError(result.error.message || 'Failed to update employee');
        return { success: false, error: result.error };
      }
    } catch (error) {
      setError('An error occurred while updating employee');
      return { success: false, error: { message: 'Failed to update employee' } };
    } finally {
      setLoading(false);
    }
  }, [selectedEmployee]);

  // Delete employee
  const deleteEmployee = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await employeeService.deleteEmployee(id);
      if (result.success) {
        setEmployees(prev => prev.filter(emp => emp.id !== id));
        setTotalEmployees(prev => prev - 1);
        if (selectedEmployee && selectedEmployee.id === id) {
          setSelectedEmployee(null);
        }
        await loadStatistics();
        return { success: true };
      } else {
        setError(result.error.message || 'Failed to delete employee');
        return { success: false, error: result.error };
      }
    } catch (error) {
      setError('An error occurred while deleting employee');
      return { success: false, error: { message: 'Failed to delete employee' } };
    } finally {
      setLoading(false);
    }
  }, [selectedEmployee, loadStatistics]);

  // Search employees
  const searchEmployees = useCallback(async (query) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await employeeService.searchEmployees(query);
      if (result.success) {
        setSearchResults(result.data);
        return { success: true, data: result.data };
      } else {
        setError(result.error.message || 'Search failed');
        return { success: false, error: result.error };
      }
    } catch (error) {
      setError('An error occurred while searching');
      return { success: false, error: { message: 'Search failed' } };
    } finally {
      setLoading(false);
    }
  }, []);

  // Get employees by department
  const getEmployeesByDepartment = useCallback(async (department) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await employeeService.getEmployeesByDepartment(department);
      if (result.success) {
        return { success: true, data: result.data };
      } else {
        setError(result.error.message || 'Failed to load department employees');
        return { success: false, error: result.error };
      }
    } catch (error) {
      setError('An error occurred while loading department employees');
      return { success: false, error: { message: 'Failed to load employees' } };
    } finally {
      setLoading(false);
    }
  }, []);

  // Upload employee avatar
  const uploadAvatar = useCallback(async (id, file) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await employeeService.uploadAvatar(id, file);
      if (result.success) {
        setEmployees(prev => prev.map(emp => 
          emp.id === id ? { ...emp, avatar: result.data.avatar } : emp
        ));
        if (selectedEmployee && selectedEmployee.id === id) {
          setSelectedEmployee({ ...selectedEmployee, avatar: result.data.avatar });
        }
        return { success: true, data: result.data };
      } else {
        setError(result.error.message || 'Failed to upload avatar');
        return { success: false, error: result.error };
      }
    } catch (error) {
      setError('An error occurred while uploading avatar');
      return { success: false, error: { message: 'Failed to upload avatar' } };
    } finally {
      setLoading(false);
    }
  }, [selectedEmployee]);

  // Export employees
  const exportEmployees = useCallback(async (format = 'csv') => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await employeeService.exportEmployees(format);
      if (result.success) {
        return { success: true, data: result.data };
      } else {
        setError(result.error.message || 'Failed to export employees');
        return { success: false, error: result.error };
      }
    } catch (error) {
      setError('An error occurred while exporting');
      return { success: false, error: { message: 'Failed to export' } };
    } finally {
      setLoading(false);
    }
  }, []);

  // Context value
  const value = {
    employees,
    selectedEmployee,
    loading,
    error,
    totalEmployees,
    departmentStats,
    searchResults,
    loadEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    searchEmployees,
    getEmployeesByDepartment,
    uploadAvatar,
    exportEmployees,
    setSelectedEmployee,
    loadStatistics
  };

  return (
    <EmployeeContext.Provider value={value}>
      {children}
    </EmployeeContext.Provider>
  );
};

// Custom hook to use employee context
export const useEmployee = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error('useEmployee must be used within an EmployeeProvider');
  }
  return context;
};

export default EmployeeContext;
