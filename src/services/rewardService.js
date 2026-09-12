import api, { handleResponse, handleError } from './api';

const REWARD_ENDPOINTS = {
  BASE: '/rewards',
  BY_ID: (id) => `/rewards/${id}`,
  BY_EMPLOYEE: (id) => `/rewards/employee/${id}`,
  STATISTICS: '/rewards/statistics',
  APPROVE: (id) => `/rewards/${id}/approve`,
  REJECT: (id) => `/rewards/${id}/reject`,
  POINTS: '/rewards/points',
  LEADERBOARD: '/rewards/leaderboard'
};

class RewardService {
  // Get all rewards
  async getAllRewards(params = {}) {
    try {
      const response = await api.get(REWARD_ENDPOINTS.BASE, { params });
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get reward by ID
  async getRewardById(id) {
    try {
      const response = await api.get(REWARD_ENDPOINTS.BY_ID(id));
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get rewards by employee
  async getRewardsByEmployee(employeeId) {
    try {
      const response = await api.get(REWARD_ENDPOINTS.BY_EMPLOYEE(employeeId));
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Create reward
  async createReward(rewardData) {
    try {
      const response = await api.post(REWARD_ENDPOINTS.BASE, rewardData);
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Update reward
  async updateReward(id, rewardData) {
    try {
      const response = await api.put(REWARD_ENDPOINTS.BY_ID(id), rewardData);
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Delete reward
  async deleteReward(id) {
    try {
      const response = await api.delete(REWARD_ENDPOINTS.BY_ID(id));
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Approve reward
  async approveReward(id) {
    try {
      const response = await api.put(REWARD_ENDPOINTS.APPROVE(id));
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Reject reward
  async rejectReward(id) {
    try {
      const response = await api.put(REWARD_ENDPOINTS.REJECT(id));
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get reward statistics
  async getStatistics() {
    try {
      const response = await api.get(REWARD_ENDPOINTS.STATISTICS);
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get points by employee
  async getEmployeePoints(employeeId) {
    try {
      const response = await api.get(`${REWARD_ENDPOINTS.POINTS}/${employeeId}`);
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get leaderboard
  async getLeaderboard(limit = 10) {
    try {
      const response = await api.get(REWARD_ENDPOINTS.LEADERBOARD, {
        params: { limit }
      });
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Export rewards
  async exportRewards(format = 'csv') {
    try {
      const response = await api.get(`${REWARD_ENDPOINTS.BASE}/export`, {
        params: { format },
        responseType: 'blob'
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }
}

export default new RewardService();