import api, { handleResponse, handleError } from './api';

const LOAN_ENDPOINTS = {
  BASE: '/loans',
  BY_ID: (id) => `/loans/${id}`,
  STATS: '/loans/stats'
};

class LoanService {
  async getAllLoans(params = {}) {
    try {
      const response = await api.get(LOAN_ENDPOINTS.BASE, { params });
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  async getLoanById(id) {
    try {
      const response = await api.get(LOAN_ENDPOINTS.BY_ID(id));
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  async createLoan(loanData) {
    try {
      const response = await api.post(LOAN_ENDPOINTS.BASE, loanData);
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  async updateLoan(id, loanData) {
    try {
      const response = await api.put(LOAN_ENDPOINTS.BY_ID(id), loanData);
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  async deleteLoan(id) {
    try {
      const response = await api.delete(LOAN_ENDPOINTS.BY_ID(id));
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  async getLoanStats() {
    try {
      const response = await api.get(LOAN_ENDPOINTS.STATS);
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }
}

export default new LoanService();
