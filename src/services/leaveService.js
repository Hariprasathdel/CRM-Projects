import api, { handleResponse, handleError } from './api';

const LEAVE_ENDPOINTS = {
  BASE: '/leaves',
  BY_ID: (id) => `/leaves/${id}`,
  BY_EMPLOYEE: (id) => `/leaves/employee/${id}`,
  BY_STATUS: (status) => `/leaves/status/${status}`,
  STATISTICS: '/leaves/statistics',
  BALANCE: (id) => `/leaves/balance/${id}`,
  APPROVE: (id) => `/leaves/${id}/approve`,
  REJECT: (id) => `/leaves/${id}/reject`,
  TYPES: '/leaves/types'
};

class LeaveService {
  // Get all leaves
  async getAllLeaves(params = {}) {
    try {
      const response = await api.get(LEAVE_ENDPOINTS.BASE, { params });
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get leave by ID
  async getLeaveById(id) {
    try {
      const response = await api.get(LEAVE_ENDPOINTS.BY_ID(id));
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get leaves by employee
  async getLeavesByEmployee(employeeId, params = {}) {
    try {
      const response = await api.get(LEAVE_ENDPOINTS.BY_EMPLOYEE(employeeId), { params });
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get leaves by status
  async getLeavesByStatus(status) {
    try {
      const response = await api.get(LEAVE_ENDPOINTS.BY_STATUS(status));
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Create leave application
  async createLeaveApplication(leaveData) {
    try {
      const response = await api.post(LEAVE_ENDPOINTS.BASE, leaveData);
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Update leave application
  async updateLeaveApplication(id, leaveData) {
    try {
      const response = await api.put(LEAVE_ENDPOINTS.BY_ID(id), leaveData);
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Delete leave application
  async deleteLeaveApplication(id) {
    try {
      const response = await api.delete(LEAVE_ENDPOINTS.BY_ID(id));
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Approve leave
  async approveLeave(id, remarks = '') {
    try {
      const response = await api.put(LEAVE_ENDPOINTS.APPROVE(id), { remarks });
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Reject leave
  async rejectLeave(id, remarks = '') {
    try {
      const response = await api.put(LEAVE_ENDPOINTS.REJECT(id), { remarks });
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get leave statistics
  async getStatistics(params = {}) {
    try {
      const response = await api.get(LEAVE_ENDPOINTS.STATISTICS, { params });
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get leave balance
  async getLeaveBalance(employeeId) {
    try {
      const response = await api.get(LEAVE_ENDPOINTS.BALANCE(employeeId));
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get leave types
  async getLeaveTypes() {
    try {
      const response = await api.get(LEAVE_ENDPOINTS.TYPES);
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Export leaves
  async exportLeaves(params = {}) {
    try {
      const response = await api.get(`${LEAVE_ENDPOINTS.BASE}/export`, {
        params,
        responseType: 'blob'
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }
}

export default new LeaveService();