import api, { handleResponse, handleError } from './api';

const PAYSLIP_ENDPOINTS = {
  BASE: '/payslips',
  BY_ID: (id) => `/payslips/${id}`,
  BY_EMPLOYEE: (id) => `/payslips/employee/${id}`,
  BY_MONTH: (month, year) => `/payslips/month/${month}/${year}`,
  STATISTICS: '/payslips/statistics',
  GENERATE: '/payslips/generate',
  DOWNLOAD: (id) => `/payslips/${id}/download`,
  SEND_EMAIL: (id) => `/payslips/${id}/email`,
  BULK_GENERATE: '/payslips/bulk-generate'
};

class PayslipService {
  // Get all payslips
  async getAllPayslips(params = {}) {
    try {
      const response = await api.get(PAYSLIP_ENDPOINTS.BASE, { params });
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get payslip by ID
  async getPayslipById(id) {
    try {
      const response = await api.get(PAYSLIP_ENDPOINTS.BY_ID(id));
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get payslips by employee
  async getPayslipsByEmployee(employeeId, params = {}) {
    try {
      const response = await api.get(PAYSLIP_ENDPOINTS.BY_EMPLOYEE(employeeId), { params });
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get payslips by month and year
  async getPayslipsByMonth(month, year) {
    try {
      const response = await api.get(PAYSLIP_ENDPOINTS.BY_MONTH(month, year));
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Create payslip (single)
  async createPayslip(payslipData) {
    try {
      const response = await api.post(PAYSLIP_ENDPOINTS.BASE, payslipData);
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Update payslip
  async updatePayslip(id, payslipData) {
    try {
      const response = await api.put(PAYSLIP_ENDPOINTS.BY_ID(id), payslipData);
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Delete payslip
  async deletePayslip(id) {
    try {
      const response = await api.delete(PAYSLIP_ENDPOINTS.BY_ID(id));
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Generate payslip
  async generatePayslip(employeeId, month, year) {
    try {
      const response = await api.post(PAYSLIP_ENDPOINTS.GENERATE, {
        employeeId,
        month,
        year
      });
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Bulk generate payslips
  async bulkGeneratePayslips(month, year, department = null) {
    try {
      const response = await api.post(PAYSLIP_ENDPOINTS.BULK_GENERATE, {
        month,
        year,
        department
      });
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Download payslip
  async downloadPayslip(id) {
    try {
      const response = await api.get(PAYSLIP_ENDPOINTS.DOWNLOAD(id), {
        responseType: 'blob'
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Send payslip via email
  async sendPayslipEmail(id, email = null) {
    try {
      const response = await api.post(PAYSLIP_ENDPOINTS.SEND_EMAIL(id), { email });
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get payslip statistics
  async getStatistics(params = {}) {
    try {
      const response = await api.get(PAYSLIP_ENDPOINTS.STATISTICS, { params });
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Export payslips
  async exportPayslips(params = {}) {
    try {
      const response = await api.get(`${PAYSLIP_ENDPOINTS.BASE}/export`, {
        params,
        responseType: 'blob'
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Calculate salary details
  async calculateSalary(employeeId, month, year) {
    try {
      const response = await api.post(`${PAYSLIP_ENDPOINTS.BASE}/calculate`, {
        employeeId,
        month,
        year
      });
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get payslip preview
  async getPayslipPreview(id) {
    try {
      const response = await api.get(`${PAYSLIP_ENDPOINTS.BY_ID(id)}/preview`);
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get payroll summary
  async getPayrollSummary(month, year) {
    try {
      const response = await api.get(`${PAYSLIP_ENDPOINTS.BASE}/summary`, {
        params: { month, year }
      });
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }
}

export default new PayslipService();