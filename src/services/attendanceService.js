import api, { handleResponse, handleError } from './api';

const ATTENDANCE_ENDPOINTS = {
  BASE: '/attendance',
  BY_ID: (id) => `/attendance/${id}`,
  BY_EMPLOYEE: (id) => `/attendance/employee/${id}`,
  BY_DATE: '/attendance/date',
  BY_RANGE: '/attendance/range',
  STATISTICS: '/attendance/statistics',
  SUMMARY: '/attendance/summary',
  TODAY: '/attendance/today',
  CHECK_IN: '/attendance/check-in',
  CHECK_OUT: '/attendance/check-out'
};

class AttendanceService {
  // Get all attendance records
  async getAllAttendance(params = {}) {
    try {
      const response = await api.get(ATTENDANCE_ENDPOINTS.BASE, { params });
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get attendance by ID
  async getAttendanceById(id) {
    try {
      const response = await api.get(ATTENDANCE_ENDPOINTS.BY_ID(id));
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get attendance by employee
  async getAttendanceByEmployee(employeeId, params = {}) {
    try {
      const response = await api.get(ATTENDANCE_ENDPOINTS.BY_EMPLOYEE(employeeId), { params });
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get attendance by date
  async getAttendanceByDate(date) {
    try {
      const response = await api.get(ATTENDANCE_ENDPOINTS.BY_DATE, { params: { date } });
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get attendance by date range
  async getAttendanceByDateRange(startDate, endDate) {
    try {
      const response = await api.get(ATTENDANCE_ENDPOINTS.BY_RANGE, {
        params: { startDate, endDate }
      });
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Create attendance record
  async createAttendance(attendanceData) {
    try {
      const response = await api.post(ATTENDANCE_ENDPOINTS.BASE, attendanceData);
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Update attendance record
  async updateAttendance(id, attendanceData) {
    try {
      const response = await api.put(ATTENDANCE_ENDPOINTS.BY_ID(id), attendanceData);
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Delete attendance record
  async deleteAttendance(id) {
    try {
      const response = await api.delete(ATTENDANCE_ENDPOINTS.BY_ID(id));
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Check-in
  async checkIn(employeeId) {
    try {
      const response = await api.post(ATTENDANCE_ENDPOINTS.CHECK_IN, { employeeId });
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Check-out
  async checkOut(employeeId) {
    try {
      const response = await api.post(ATTENDANCE_ENDPOINTS.CHECK_OUT, { employeeId });
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get today's attendance
  async getTodayAttendance() {
    try {
      const response = await api.get(ATTENDANCE_ENDPOINTS.TODAY);
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get attendance statistics
  async getStatistics(params = {}) {
    try {
      const response = await api.get(ATTENDANCE_ENDPOINTS.STATISTICS, { params });
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get attendance summary
  async getSummary(employeeId, params = {}) {
    try {
      const response = await api.get(ATTENDANCE_ENDPOINTS.SUMMARY, {
        params: { employeeId, ...params }
      });
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Export attendance
  async exportAttendance(params = {}) {
    try {
      const response = await api.get(`${ATTENDANCE_ENDPOINTS.BASE}/export`, {
        params,
        responseType: 'blob'
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Bulk create attendance
  async bulkCreateAttendance(attendanceData) {
    try {
      const response = await api.post(`${ATTENDANCE_ENDPOINTS.BASE}/bulk`, attendanceData);
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // ==================== ATTENDANCE REPORTS ====================

  // Get attendance report (live employee-wise data from MongoDB)
  async getAttendanceReport(params = {}) {
    try {
      const response = await api.get('/attendance-reports', { params });
      const payload = handleResponse(response);
      return { 
        success: true, 
        data: payload.data ?? payload, 
        pagination: payload.pagination 
      };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get attendance summary metrics
  async getAttendanceSummary(params = {}) {
    try {
      const response = await api.get('/attendance-reports/summary', { params });
      const payload = handleResponse(response);
      return { success: true, data: payload.data ?? payload };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get attendance daily trend
  async getAttendanceTrend(params = {}) {
    try {
      const response = await api.get('/attendance-reports/trend', { params });
      const payload = handleResponse(response);
      return { success: true, data: payload.data ?? payload };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get attendance grouped by department
  async getDepartmentReport(params = {}) {
    try {
      const response = await api.get('/attendance-reports/departments', { params });
      const payload = handleResponse(response);
      return { success: true, data: payload.data ?? payload };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get departments list for filter dropdowns
  async getDepartments() {
    try {
      const response = await api.get('/departments');
      const payload = handleResponse(response);
      return { success: true, data: payload.data ?? payload };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Export attendance report
  async exportAttendanceReport(format = 'csv', params = {}) {
    const response = await api.get('/attendance-reports/export', {
      params: { format, ...params },
      responseType: 'blob'
    });
    return response.data;
  }
}

export default new AttendanceService();