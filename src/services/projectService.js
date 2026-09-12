import api, { handleResponse, handleError } from './api';

const PROJECT_ENDPOINTS = {
  BASE: '/projects',
  BY_ID: (id) => `/projects/${id}`,
  BY_DEPARTMENT: (dept) => `/projects/department/${dept}`,
  STATISTICS: '/projects/statistics',
  TASKS: (id) => `/projects/${id}/tasks`,
  TEAM: (id) => `/projects/${id}/team`,
  PROGRESS: (id) => `/projects/${id}/progress`
};

class ProjectService {
  // Get all projects
  async getAllProjects(params = {}) {
    try {
      const response = await api.get(PROJECT_ENDPOINTS.BASE, { params });
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get project by ID
  async getProjectById(id) {
    try {
      const response = await api.get(PROJECT_ENDPOINTS.BY_ID(id));
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get projects by department
  async getProjectsByDepartment(department) {
    try {
      const response = await api.get(PROJECT_ENDPOINTS.BY_DEPARTMENT(department));
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Create project
  async createProject(projectData) {
    try {
      const response = await api.post(PROJECT_ENDPOINTS.BASE, projectData);
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Update project
  async updateProject(id, projectData) {
    try {
      const response = await api.put(PROJECT_ENDPOINTS.BY_ID(id), projectData);
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Delete project
  async deleteProject(id) {
    try {
      const response = await api.delete(PROJECT_ENDPOINTS.BY_ID(id));
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get project statistics
  async getStatistics() {
    try {
      const response = await api.get(PROJECT_ENDPOINTS.STATISTICS);
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get project tasks
  async getProjectTasks(id) {
    try {
      const response = await api.get(PROJECT_ENDPOINTS.TASKS(id));
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Update project tasks
  async updateProjectTasks(id, tasksData) {
    try {
      const response = await api.put(PROJECT_ENDPOINTS.TASKS(id), tasksData);
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Get project team
  async getProjectTeam(id) {
    try {
      const response = await api.get(PROJECT_ENDPOINTS.TEAM(id));
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Update project team
  async updateProjectTeam(id, teamData) {
    try {
      const response = await api.put(PROJECT_ENDPOINTS.TEAM(id), teamData);
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Update project progress
  async updateProjectProgress(id, progressData) {
    try {
      const response = await api.put(PROJECT_ENDPOINTS.PROGRESS(id), progressData);
      return { success: true, data: handleResponse(response) };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }

  // Export projects
  async exportProjects(format = 'csv') {
    try {
      const response = await api.get(`${PROJECT_ENDPOINTS.BASE}/export`, {
        params: { format },
        responseType: 'blob'
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  }
}

export default new ProjectService();