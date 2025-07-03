import axios from 'axios';

// Create axios instance with base configuration
const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Don't set withCredentials for now to simplify CORS
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - check if backend is running on http://localhost:8080');
    }
    
    if (error.code === 'ERR_FAILED') {
      console.error('Request failed - this might be a CORS issue');
    }
    
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// User API calls
export const userAPI = {
  getAllUsers: () => api.get('/users'),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  getUsersByRole: (role) => api.get(`/users/role/${role}`),
};

// Project API calls
export const projectAPI = {
  getAllProjects: () => api.get('/projects'),
  getProjectById: (id) => api.get(`/projects/${id}`),
  createProject: (projectData) => api.post('/projects', projectData),
  updateProject: (id, projectData) => api.put(`/projects/${id}`, projectData),
  deleteProject: (id) => api.delete(`/projects/${id}`),
  getProjectsByUser: (userId) => api.get(`/projects/user/${userId}`),
  getProjectsByStatus: (status) => api.get(`/projects/status/${status}`),
};

// Feedback API calls
export const feedbackAPI = {
  getAllFeedback: () => api.get('/feedback'),
  getFeedbackById: (id) => api.get(`/feedback/${id}`),
  createFeedback: (feedbackData) => api.post('/feedback', feedbackData),
  updateFeedback: (id, feedbackData) => api.put(`/feedback/${id}`, feedbackData),
  deleteFeedback: (id) => api.delete(`/feedback/${id}`),
  getFeedbackByProject: (projectId) => api.get(`/feedback/project/${projectId}`),
};

export default api; 