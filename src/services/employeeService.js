import api, { handleResponse, handleError } from './api';

const EMPLOYEE_ENDPOINTS = {
  BASE: '/employees',
  BY_ID: (id) => `/employees/${id}`,
  BY_DEPARTMENT: (dept) => `/employees/department/${dept}`,
  SEARCH: '/employees/search',
  STATISTICS: '/employees/statistics',
  PERFORMANCE: (id) => `/employees/${id}/performance`,
  PROJECTS: (id) => `/employees/${id}/projects`
};

class EmployeeService {
  // Get all employees
  async getAllEmployees(params = {}) {
    try {
      const response = await api.get(EMPLOYEE_ENDPOINTS.BASE, { params });
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get employee by ID
  async getEmployeeById(id) {
    try {
      const response = await api.get(EMPLOYEE_ENDPOINTS.BY_ID(id));
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Create new employee
  async createEmployee(employeeData) {
    try {
      const response = await api.post(EMPLOYEE_ENDPOINTS.BASE, employeeData);
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Update employee
  async updateEmployee(id, employeeData) {
    try {
      const response = await api.put(EMPLOYEE_ENDPOINTS.BY_ID(id), employeeData);
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Delete employee
  async deleteEmployee(id) {
    try {
      const response = await api.delete(EMPLOYEE_ENDPOINTS.BY_ID(id));
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get employees by department
  async getEmployeesByDepartment(department) {
    try {
      const response = await api.get(EMPLOYEE_ENDPOINTS.BY_DEPARTMENT(department));
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Search employees
  async searchEmployees(query) {
    try {
      const response = await api.get(EMPLOYEE_ENDPOINTS.SEARCH, { params: { q: query } });
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get employee statistics
  async getStatistics() {
    try {
      const response = await api.get(EMPLOYEE_ENDPOINTS.STATISTICS);
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get employee performance
  async getEmployeePerformance(id) {
    try {
      const response = await api.get(EMPLOYEE_ENDPOINTS.PERFORMANCE(id));
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Update employee performance
  async updateEmployeePerformance(id, performanceData) {
    try {
      const response = await api.put(EMPLOYEE_ENDPOINTS.PERFORMANCE(id), performanceData);
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get employee projects
  async getEmployeeProjects(id) {
    try {
      const response = await api.get(EMPLOYEE_ENDPOINTS.PROJECTS(id));
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Upload employee avatar
  async uploadAvatar(id, file) {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await api.post(
        `${EMPLOYEE_ENDPOINTS.BY_ID(id)}/avatar`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Export employees
  async exportEmployees(format = 'csv') {
    try {
      const response = await api.get(`${EMPLOYEE_ENDPOINTS.BASE}/export`, {
        params: { format },
        responseType: 'blob'
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Import employees
  async importEmployees(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post(`${EMPLOYEE_ENDPOINTS.BASE}/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }
}

export default new EmployeeService();