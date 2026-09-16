import api, { handleResponse, handleError } from './api';

const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh-token',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_EMAIL: '/auth/verify-email',
  ME: '/auth/me'
};

class AuthService {
  // Login user
  async login(email, password) {
    try {
      const response = await api.post(AUTH_ENDPOINTS.LOGIN, { email, password });
      const payload = handleResponse(response);
      // The API wraps the authenticated user and token in `data`. Normalize it
      // here so the auth context always receives the shape it expects.
      const credentials = payload.data ?? payload;
      const token = credentials.token;
      const user = credentials.user ?? (token ? { ...credentials, token: undefined } : null);

      if (!token || !user) {
        throw new Error(payload.message || 'The login response did not include session details.');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      return { success: true, data: { user, token } };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Register user
  async register(userData) {
    try {
      const response = await api.post(AUTH_ENDPOINTS.REGISTER, userData);
      const data = handleResponse(response);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Logout user
  async logout() {
    try {
      await api.post(AUTH_ENDPOINTS.LOGOUT);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return { success: true };
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return { success: false, error: handleError(error) };
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      const response = await api.get(AUTH_ENDPOINTS.ME);
      const payload = handleResponse(response);
      const user = payload.data ?? payload;
      return { success: true, data: user };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Refresh token
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await api.post(AUTH_ENDPOINTS.REFRESH_TOKEN, { refreshToken });
      const data = handleResponse(response);
      
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      
      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Forgot password
  async forgotPassword(email) {
    try {
      const response = await api.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
      const data = handleResponse(response);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Reset password
  async resetPassword(token, newPassword) {
    try {
      const response = await api.post(AUTH_ENDPOINTS.RESET_PASSWORD, { token, newPassword });
      const data = handleResponse(response);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Verify email
  async verifyEmail(token) {
    try {
      const response = await api.post(AUTH_ENDPOINTS.VERIFY_EMAIL, { token });
      const data = handleResponse(response);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token;
  }

  // Get user from localStorage
  getUser() {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      return null;
    }
  }

  // Get auth token
  getToken() {
    return localStorage.getItem('token');
  }
}

export default new AuthService();
