import api, { handleResponse, handleError } from './api';

const ENDPOINTS = {
  REPORTS: '/employee-reports',
  REPORT_BY_ID: (id) => `/employee-reports/${id}`,
  GENERATE: '/employee-reports/generate',
  SUMMARY: '/employee-reports/summary',
  TREND: '/employee-reports/trend',
  DEPT_DISTRIBUTION: '/employee-reports/department-distribution',
  STATUS_DISTRIBUTION: '/employee-reports/status-distribution',
  GENDER_DISTRIBUTION: '/employee-reports/gender-distribution',
  EMPLOYEES: '/employees',
  HEALTH: '/health'
};

class EmployeeReportService {
  // Check health and MongoDB connection status
  async checkHealth() {
    try {
      const response = await api.get(ENDPOINTS.HEALTH);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get all employee reports from MongoDB
  async getEmployeeReports(params = {}) {
    try {
      const response = await api.get(ENDPOINTS.REPORTS, { params });
      const res = handleResponse(response);
      return {
        success: true,
        data: res.data || [],
        pagination: res.pagination || { page: 1, limit: 10, total: (res.data || []).length }
      };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get employee report by ID
  async getEmployeeReportById(id) {
    try {
      const response = await api.get(ENDPOINTS.REPORT_BY_ID(id));
      const res = handleResponse(response);
      return { success: true, data: res.data || res };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Generate a new employee report and persist in MongoDB
  async generateEmployeeReport(reportData) {
    try {
      const response = await api.post(ENDPOINTS.GENERATE, reportData);
      const res = handleResponse(response);
      return { success: true, data: res.data || res, message: res.message || 'Report generated' };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Delete employee report from MongoDB
  async deleteEmployeeReport(id) {
    try {
      const response = await api.delete(ENDPOINTS.REPORT_BY_ID(id));
      const res = handleResponse(response);
      return { success: true, data: res.data || res, message: res.message || 'Report deleted' };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get summary analytics
  async getSummary(params = {}) {
    try {
      const response = await api.get(ENDPOINTS.SUMMARY, { params });
      const res = handleResponse(response);
      return { success: true, data: res.data || res };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get department distribution
  async getDepartmentDistribution() {
    try {
      const response = await api.get(ENDPOINTS.DEPT_DISTRIBUTION);
      const res = handleResponse(response);
      return { success: true, data: res.data || res };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get status distribution
  async getStatusDistribution() {
    try {
      const response = await api.get(ENDPOINTS.STATUS_DISTRIBUTION);
      const res = handleResponse(response);
      return { success: true, data: res.data || res };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get employee growth trend
  async getTrend(params = {}) {
    try {
      const response = await api.get(ENDPOINTS.TREND, { params });
      const res = handleResponse(response);
      return { success: true, data: res.data || res };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get live employees list
  async getEmployees(params = {}) {
    try {
      const response = await api.get(ENDPOINTS.EMPLOYEES, { params });
      const res = handleResponse(response);
      return {
        success: true,
        data: res.data || res.employees || (Array.isArray(res) ? res : []),
        pagination: res.pagination
      };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }
}

export default new EmployeeReportService();
