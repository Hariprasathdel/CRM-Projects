import api, { handleResponse, handleError } from './api';

const REPORT_ENDPOINTS = {
  BASE: '/reports',
  BY_ID: (id) => `/reports/${id}`,
  GENERATE: '/reports/generate',
  SCHEDULED: '/reports/scheduled',
  TEMPLATES: '/reports/templates',
  DOWNLOAD: (id) => `/reports/${id}/download`,
  STATISTICS: '/reports/statistics'
};

class ReportService {
  // Get all reports
  async getAllReports(params = {}) {
    try {
      const response = await api.get(REPORT_ENDPOINTS.BASE, { params });
      const resData = handleResponse(response);
      return { success: true, data: resData.data || resData, pagination: resData.pagination };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get report by ID
  async getReportById(id) {
    try {
      const response = await api.get(REPORT_ENDPOINTS.BY_ID(id));
      const resData = handleResponse(response);
      return { success: true, data: resData.data || resData };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Generate report
  async generateReport(reportData) {
    try {
      const response = await api.post(REPORT_ENDPOINTS.GENERATE, reportData);
      const resData = handleResponse(response);
      return { success: true, data: resData.data || resData };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Delete report
  async deleteReport(id) {
    try {
      const response = await api.delete(REPORT_ENDPOINTS.BY_ID(id));
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Download report
  async downloadReport(id) {
    try {
      const response = await api.get(REPORT_ENDPOINTS.DOWNLOAD(id), {
        responseType: 'blob'
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get report templates
  async getReportTemplates() {
    try {
      const response = await api.get(REPORT_ENDPOINTS.TEMPLATES);
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get scheduled reports
  async getScheduledReports() {
    try {
      const response = await api.get(REPORT_ENDPOINTS.SCHEDULED);
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Schedule report
  async scheduleReport(reportData) {
    try {
      const response = await api.post(REPORT_ENDPOINTS.SCHEDULED, reportData);
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get report statistics
  async getStatistics() {
    try {
      const response = await api.get(REPORT_ENDPOINTS.STATISTICS);
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Export reports
  async exportReports(format = 'csv') {
    try {
      const response = await api.get(`${REPORT_ENDPOINTS.BASE}/export`, {
        params: { format },
        responseType: 'blob'
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }
}

export default new ReportService();