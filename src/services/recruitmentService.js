import api, { handleResponse, handleError } from './api';

const RECRUITMENT_ENDPOINTS = {
  JOBS: '/recruitment/jobs',
  JOB_BY_ID: (id) => `/recruitment/jobs/${id}`,
  APPLICANTS: '/recruitment/applicants',
  APPLICANT_BY_ID: (id) => `/recruitment/applicants/${id}`,
  APPLICANTS_BY_JOB: (id) => `/recruitment/jobs/${id}/applicants`,
  STATISTICS: '/recruitment/statistics',
  UPDATE_STATUS: (id) => `/recruitment/applicants/${id}/status`,
  INTERVIEW: (id) => `/recruitment/applicants/${id}/interview`
};

class RecruitmentService {
  // Job Postings
  async getAllJobs(params = {}) {
    try {
      const response = await api.get(RECRUITMENT_ENDPOINTS.JOBS, { params });
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  async getJobById(id) {
    try {
      const response = await api.get(RECRUITMENT_ENDPOINTS.JOB_BY_ID(id));
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  async createJob(jobData) {
    try {
      const response = await api.post(RECRUITMENT_ENDPOINTS.JOBS, jobData);
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  async updateJob(id, jobData) {
    try {
      const response = await api.put(RECRUITMENT_ENDPOINTS.JOB_BY_ID(id), jobData);
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  async deleteJob(id) {
    try {
      const response = await api.delete(RECRUITMENT_ENDPOINTS.JOB_BY_ID(id));
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Applicants
  async getAllApplicants(params = {}) {
    try {
      const response = await api.get(RECRUITMENT_ENDPOINTS.APPLICANTS, { params });
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  async getApplicantById(id) {
    try {
      const response = await api.get(RECRUITMENT_ENDPOINTS.APPLICANT_BY_ID(id));
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  async getApplicantsByJob(jobId) {
    try {
      const response = await api.get(RECRUITMENT_ENDPOINTS.APPLICANTS_BY_JOB(jobId));
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  async createApplicant(applicantData) {
    try {
      const response = await api.post(RECRUITMENT_ENDPOINTS.APPLICANTS, applicantData);
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  async updateApplicant(id, applicantData) {
    try {
      const response = await api.put(RECRUITMENT_ENDPOINTS.APPLICANT_BY_ID(id), applicantData);
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  async deleteApplicant(id) {
    try {
      const response = await api.delete(RECRUITMENT_ENDPOINTS.APPLICANT_BY_ID(id));
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Applicant Status Management
  async updateApplicantStatus(id, status) {
    try {
      const response = await api.put(RECRUITMENT_ENDPOINTS.UPDATE_STATUS(id), { status });
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Interview Management
  async scheduleInterview(id, interviewData) {
    try {
      const response = await api.post(RECRUITMENT_ENDPOINTS.INTERVIEW(id), interviewData);
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Statistics
  async getStatistics() {
    try {
      const response = await api.get(RECRUITMENT_ENDPOINTS.STATISTICS);
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Export
  async exportApplicants(format = 'csv') {
    try {
      const response = await api.get(`${RECRUITMENT_ENDPOINTS.APPLICANTS}/export`, {
        params: { format },
        responseType: 'blob'
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }
}

export default new RecruitmentService();