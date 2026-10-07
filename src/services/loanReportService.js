import api, { handleResponse, handleError } from './api';

const ENDPOINTS = {
  REPORTS: '/loan-reports',
  REPORT_BY_ID: (id) => `/loan-reports/${id}`,
  GENERATE: '/loan-reports/generate',
  SUMMARY: '/loan-reports/summary',
  TREND: '/loan-reports/trend',
  STATUS_DISTRIBUTION: '/loan-reports/status-distribution',
  TOP_BORROWERS: '/loan-reports/top-borrowers',
  OVERDUE: '/loan-reports/overdue',
  LOANS: '/loans',
  HEALTH: '/health'
};

class LoanReportService {
  // Check health and MongoDB connection status
  async checkHealth() {
    try {
      const response = await api.get(ENDPOINTS.HEALTH);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get all loan reports from MongoDB
  async getLoanReports(params = {}) {
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

  // Get loan report by ID
  async getLoanReportById(id) {
    try {
      const response = await api.get(ENDPOINTS.REPORT_BY_ID(id));
      const res = handleResponse(response);
      return { success: true, data: res.data || res };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Generate a new loan report and persist in MongoDB
  async generateLoanReport(reportData) {
    try {
      const response = await api.post(ENDPOINTS.GENERATE, reportData);
      const res = handleResponse(response);
      return { success: true, data: res.data || res, message: res.message || 'Report generated' };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Delete loan report from MongoDB
  async deleteLoanReport(id) {
    try {
      const response = await api.delete(ENDPOINTS.REPORT_BY_ID(id));
      const res = handleResponse(response);
      return { success: true, data: res.data || res, message: res.message || 'Report deleted' };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get loan summary
  async getLoanSummary(params = {}) {
    try {
      const response = await api.get(ENDPOINTS.SUMMARY, { params });
      const res = handleResponse(response);
      return { success: true, data: res.data || res };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get loan trend
  async getLoanTrend(params = {}) {
    try {
      const response = await api.get(ENDPOINTS.TREND, { params });
      const res = handleResponse(response);
      return { success: true, data: res.data || res };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get loan status distribution
  async getLoanStatusDistribution() {
    try {
      const response = await api.get(ENDPOINTS.STATUS_DISTRIBUTION);
      const res = handleResponse(response);
      return { success: true, data: res.data || res };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get individual loan records from MongoDB
  async getAllLoans(params = {}) {
    try {
      const response = await api.get(ENDPOINTS.LOANS, { params });
      const res = handleResponse(response);
      return {
        success: true,
        data: res.data || (Array.isArray(res) ? res : []),
        pagination: res.pagination
      };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }
}

export default new LoanReportService();
