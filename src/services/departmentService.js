import api, { handleResponse, handleError } from './api';

const DEPARTMENT_ENDPOINTS = {
  BASE: '/departments',
  BY_ID: (id) => `/departments/${id}`,
  STATISTICS: '/departments/statistics',
  EMPLOYEES: (id) => `/departments/${id}/employees`,
  BUDGET: (id) => `/departments/${id}/budget`
};

class DepartmentService {
  // Get all departments
  async getAllDepartments(params = {}) {
    try {
      const response = await api.get(DEPARTMENT_ENDPOINTS.BASE, { params });
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get department by ID
  async getDepartmentById(id) {
    try {
      const response = await api.get(DEPARTMENT_ENDPOINTS.BY_ID(id));
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Create department
  async createDepartment(departmentData) {
    try {
      const response = await api.post(DEPARTMENT_ENDPOINTS.BASE, departmentData);
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Update department
  async updateDepartment(id, departmentData) {
    try {
      const response = await api.put(DEPARTMENT_ENDPOINTS.BY_ID(id), departmentData);
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Delete department
  async deleteDepartment(id) {
    try {
      const response = await api.delete(DEPARTMENT_ENDPOINTS.BY_ID(id));
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get department statistics
  async getStatistics() {
    try {
      const response = await api.get(DEPARTMENT_ENDPOINTS.STATISTICS);
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get department employees
  async getDepartmentEmployees(id) {
    try {
      const response = await api.get(DEPARTMENT_ENDPOINTS.EMPLOYEES(id));
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Update department budget
  async updateDepartmentBudget(id, budgetData) {
    try {
      const response = await api.put(DEPARTMENT_ENDPOINTS.BUDGET(id), budgetData);
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Export departments
  async exportDepartments(format = 'csv') {
    try {
      const response = await api.get(`${DEPARTMENT_ENDPOINTS.BASE}/export`, {
        params: { format },
        responseType: 'blob'
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }
}

export default new DepartmentService();