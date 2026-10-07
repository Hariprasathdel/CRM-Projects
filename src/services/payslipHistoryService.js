import api, { handleResponse, handleError } from './api';

const ENDPOINTS = {
  HISTORY: '/payslip-history',
  STATS: '/payslip-history/stats',
  RECENT: '/payslip-history/recent',
  MY_ACTIVITY: '/payslip-history/my-activity',
  TIMELINE: (id) => `/payslip-history/timeline/${id}`,
  PAYSLIP_BY_ID: (id) => `/payslip-history/payslip/${id}`,
  PAYSLIPS: '/payslips',
  HEALTH: '/health'
};

class PayslipHistoryService {
  // Check health and MongoDB connection status
  async checkHealth() {
    try {
      const response = await api.get(ENDPOINTS.HEALTH);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get all payslip history audit records from MongoDB
  async getPayslipHistory(params = {}) {
    try {
      const response = await api.get(ENDPOINTS.HISTORY, { params });
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

  // Get payslip history stats
  async getHistoryStats() {
    try {
      const response = await api.get(ENDPOINTS.STATS);
      const res = handleResponse(response);
      return { success: true, data: res.data || res };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get recent activity
  async getRecentActivity() {
    try {
      const response = await api.get(ENDPOINTS.RECENT);
      const res = handleResponse(response);
      return { success: true, data: res.data || res };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get timeline for payslip
  async getPayslipTimeline(payslipId) {
    try {
      const response = await api.get(ENDPOINTS.TIMELINE(payslipId));
      const res = handleResponse(response);
      return { success: true, data: res.data || res };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get payslips
  async getPayslips(params = {}) {
    try {
      const response = await api.get(ENDPOINTS.PAYSLIPS, { params });
      const res = handleResponse(response);
      return {
        success: true,
        data: res.data || (Array.isArray(res) ? res : [])
      };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }
}

export default new PayslipHistoryService();
