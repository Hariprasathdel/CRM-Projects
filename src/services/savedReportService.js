import api, { handleResponse, handleError } from './api';

const ENDPOINTS = {
  REPORTS: '/saved-reports',
  REPORT_BY_ID: (id) => `/saved-reports/${id}`,
  RUN: (id) => `/saved-reports/${id}/run`,
  FAVORITE: (id) => `/saved-reports/${id}/favorite`,
  STATS: '/saved-reports/stats',
  HEALTH: '/health'
};

class SavedReportService {
  // Check health and MongoDB connection status
  async checkHealth() {
    try {
      const response = await api.get(ENDPOINTS.HEALTH);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get all saved reports from MongoDB
  async getSavedReports(params = {}) {
    try {
      const response = await api.get(ENDPOINTS.REPORTS, { params });
      const res = handleResponse(response);
      return {
        success: true,
        data: res.data || [],
        pagination: res.pagination || { page: 1, limit: 20, total: (res.data || []).length }
      };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get single saved report by ID
  async getSavedReportById(id) {
    try {
      const response = await api.get(ENDPOINTS.REPORT_BY_ID(id));
      const res = handleResponse(response);
      return { success: true, data: res.data || res };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Create a new saved report
  async createSavedReport(reportData) {
    try {
      const response = await api.post(ENDPOINTS.REPORTS, reportData);
      const res = handleResponse(response);
      return { success: true, data: res.data || res, message: res.message || 'Report saved successfully' };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Update saved report
  async updateSavedReport(id, reportData) {
    try {
      const response = await api.put(ENDPOINTS.REPORT_BY_ID(id), reportData);
      const res = handleResponse(response);
      return { success: true, data: res.data || res };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Delete saved report from MongoDB
  async deleteSavedReport(id) {
    try {
      const response = await api.delete(ENDPOINTS.REPORT_BY_ID(id));
      const res = handleResponse(response);
      return { success: true, data: res.data || res, message: res.message || 'Report deleted' };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Run / execute saved report
  async runSavedReport(id) {
    try {
      const response = await api.post(ENDPOINTS.RUN(id));
      const res = handleResponse(response);
      return { success: true, data: res.data || res, message: res.message || 'Report executed successfully' };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Toggle favorite
  async toggleFavorite(id) {
    try {
      const response = await api.patch(ENDPOINTS.FAVORITE(id));
      const res = handleResponse(response);
      return { success: true, data: res.data || res };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get statistics
  async getStatistics() {
    try {
      const response = await api.get(ENDPOINTS.STATS);
      const res = handleResponse(response);
      return { success: true, data: res.data || res };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }
}

export default new SavedReportService();
