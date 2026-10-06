import api, { handleResponse, handleError } from './api';

const ENDPOINTS = {
  REPORTS: '/award-reports',
  REPORT_BY_ID: (id) => `/award-reports/${id}`,
  GENERATE: '/award-reports/generate',
  SUMMARY: '/award-reports/summary',
  TREND: '/award-reports/trend',
  TYPE_DISTRIBUTION: '/award-reports/type-distribution',
  TOP_PERFORMERS: '/award-reports/top-performers',
  RECENT: '/award-reports/recent',
  DEPT_PERFORMANCE: '/award-reports/department-performance',
  AWARDS: '/awards',
  AWARD_BY_ID: (id) => `/awards/${id}`,
  AWARDS_STATS: '/awards/stats',
  HEALTH: '/health'
};

class AwardReportService {
  // Check health and MongoDB connection status
  async checkHealth() {
    try {
      const response = await api.get(ENDPOINTS.HEALTH);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get all award reports from MongoDB
  async getAwardReports(params = {}) {
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

  // Get award report by ID
  async getAwardReportById(id) {
    try {
      const response = await api.get(ENDPOINTS.REPORT_BY_ID(id));
      const res = handleResponse(response);
      return { success: true, data: res.data || res };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Generate a new award report and persist in MongoDB
  async generateAwardReport(reportData) {
    try {
      const response = await api.post(ENDPOINTS.GENERATE, reportData);
      const res = handleResponse(response);
      return { success: true, data: res.data || res, message: res.message };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Delete an award report
  async deleteAwardReport(id) {
    try {
      const response = await api.delete(ENDPOINTS.REPORT_BY_ID(id));
      const res = handleResponse(response);
      return { success: true, data: res };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get quick award summary
  async getAwardSummary(params = {}) {
    try {
      const response = await api.get(ENDPOINTS.SUMMARY, { params });
      const res = handleResponse(response);
      return { success: true, data: res.data || res };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get monthly award trend
  async getAwardTrend(params = {}) {
    try {
      const response = await api.get(ENDPOINTS.TREND, { params });
      const res = handleResponse(response);
      return { success: true, data: res.data || [] };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get award type distribution
  async getAwardTypeDistribution(params = {}) {
    try {
      const response = await api.get(ENDPOINTS.TYPE_DISTRIBUTION, { params });
      const res = handleResponse(response);
      return { success: true, data: res.data || [] };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get top performers
  async getTopPerformers(params = {}) {
    try {
      const response = await api.get(ENDPOINTS.TOP_PERFORMERS, { params });
      const res = handleResponse(response);
      return { success: true, data: res.data || [] };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get recent awards
  async getRecentAwards(params = {}) {
    try {
      const response = await api.get(ENDPOINTS.RECENT, { params });
      const res = handleResponse(response);
      return { success: true, data: res.data || [] };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get department performance
  async getDepartmentPerformance(params = {}) {
    try {
      const response = await api.get(ENDPOINTS.DEPT_PERFORMANCE, { params });
      const res = handleResponse(response);
      return { success: true, data: res.data || [] };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get all awards from MongoDB
  async getAllAwards(params = {}) {
    try {
      const response = await api.get(ENDPOINTS.AWARDS, { params });
      const res = handleResponse(response);
      return {
        success: true,
        data: res.data || [],
        pagination: res.pagination || { total: (res.data || []).length }
      };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Create award
  async createAward(data) {
    try {
      const response = await api.post(ENDPOINTS.AWARDS, data);
      const res = handleResponse(response);
      return { success: true, data: res.data || res };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Update award
  async updateAward(id, data) {
    try {
      const response = await api.put(ENDPOINTS.AWARD_BY_ID(id), data);
      const res = handleResponse(response);
      return { success: true, data: res.data || res };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Delete award
  async deleteAward(id) {
    try {
      const response = await api.delete(ENDPOINTS.AWARD_BY_ID(id));
      const res = handleResponse(response);
      return { success: true, data: res };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }
}

export default new AwardReportService();
