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
  getStudentsBySupervisor: (supervisorId) => api.get(`/users/supervisor/${supervisorId}/students`),
  getMyStudents: () => api.get('/users/my-students'),
  assignStudentToSupervisor: (studentId, supervisorId) => api.put(`/users/${studentId}/assign-supervisor/${supervisorId}`),
  removeStudentFromSupervisor: (studentId) => api.put(`/users/${studentId}/remove-supervisor`),
  supervisorRemoveStudent: (supervisorId, studentId) => api.put(`/users/supervisor/${supervisorId}/remove-student/${studentId}`),
};

// Project API calls
export const projectAPI = {
  getAllProjects: () => api.get('/projects'),
  getProjectById: (id) => api.get(`/projects/${id}`),
  createProject: (projectData) => api.post('/projects/submit', projectData),
  updateProject: (id, projectData) => api.put(`/projects/${id}`, projectData),
  deleteProject: (id) => api.delete(`/projects/${id}`),
  getProjectsByUser: (userId) => api.get(`/projects/student/${userId}`),
  getProjectsByStatus: (status) => api.get(`/projects/status/${status}`),
  getProjectsBySupervisorStudents: (supervisorId) => api.get(`/projects/supervisor/${supervisorId}/students`),
  getMyStudentsProjects: () => api.get('/projects/my-students'),
  approveProject: (id) => api.put(`/projects/${id}/approve`),
  rejectProject: (id) => api.put(`/projects/${id}/reject`),
  completeProject: (id) => api.put(`/projects/${id}/complete`),
  assignProjectsToSupervisors: () => api.post('/projects/assign-to-supervisors'),
};

// Progress Updates API calls
export const progressUpdateAPI = {
  getAllProgressUpdates: () => api.get('/progress-updates'),
  getProgressUpdateById: (id) => api.get(`/progress-updates/${id}`),
  createProgressUpdate: (progressData) => api.post('/progress-updates', progressData),
  updateProgressUpdate: (id, progressData) => api.put(`/progress-updates/${id}`, progressData),
  deleteProgressUpdate: (id) => api.delete(`/progress-updates/${id}`),
  getProgressUpdatesByProject: (projectId) => api.get(`/progress-updates/project/${projectId}`),
  getProgressUpdateByProjectAndWeek: (projectId, weekNumber) => api.get(`/progress-updates/project/${projectId}/week/${weekNumber}`),
  getProgressUpdateCountByProject: (projectId) => api.get(`/progress-updates/project/${projectId}/count`),
};

// Evaluations API calls
export const evaluationAPI = {
  getAllEvaluations: () => api.get('/evaluations'),
  getEvaluationById: (id) => api.get(`/evaluations/${id}`),
  createEvaluation: (evaluationData) => api.post('/evaluations', evaluationData),
  updateEvaluation: (id, evaluationData) => api.put(`/evaluations/${id}`, evaluationData),
  deleteEvaluation: (id) => api.delete(`/evaluations/${id}`),
  getEvaluationsByProject: (projectId) => api.get(`/evaluations/project/${projectId}`),
  getLatestEvaluationByProject: (projectId) => api.get(`/evaluations/project/${projectId}/latest`),
  getAverageScoreByProject: (projectId) => api.get(`/evaluations/project/${projectId}/average-score`),
  hasEvaluationForProject: (projectId) => api.get(`/evaluations/project/${projectId}/exists`),
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

// Document API calls
export const documentAPI = {
  uploadDocument: (formData) => api.post('/documents/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  getDocumentsBySupervisor: (supervisorId) => api.get(`/documents/supervisor/${supervisorId}`),
  getDocumentsForStudent: (studentId) => api.get(`/documents/student/${studentId}`),
  getGeneralDocumentsBySupervisor: (supervisorId) => api.get(`/documents/supervisor/${supervisorId}/general`),
  getStudentSpecificDocuments: (supervisorId, studentId) => api.get(`/documents/supervisor/${supervisorId}/student/${studentId}`),
  getDocumentById: (documentId) => api.get(`/documents/${documentId}`),
  downloadDocument: (documentId) => api.get(`/documents/download/${documentId}`, {
    responseType: 'blob',
  }),
  deleteDocument: (documentId) => api.delete(`/documents/${documentId}`),
};

export default api; 