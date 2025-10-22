import axios, { AxiosInstance, AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
let accessToken: string | null = null;
let refreshToken: string | null = null;

// Set tokens
export const setTokens = (access: string, refresh: string) => {
  accessToken = access;
  refreshToken = refresh;
  localStorage.setItem('accessToken', access);
  localStorage.setItem('refreshToken', refresh);
};

// Get tokens from localStorage
export const getTokens = () => {
  if (typeof window !== 'undefined') {
    accessToken = localStorage.getItem('accessToken');
    refreshToken = localStorage.getItem('refreshToken');
  }
  return { accessToken, refreshToken };
};

// Clear tokens
export const clearTokens = () => {
  accessToken = null;
  refreshToken = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken: newAccessToken } = response.data;
          setTokens(newAccessToken, refreshToken);

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, clear tokens and redirect to login
          clearTokens();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
      } else {
        // No refresh token, redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

// API Types
export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
  profile: {
    bio?: string;
    avatarUrl?: string;
    website?: string;
    location?: string;
  };
  subscription: {
    plan: 'starter' | 'professional' | 'enterprise';
    status: 'active' | 'cancelled' | 'expired';
    expiresAt?: string;
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    notifications: {
      email: boolean;
      push: boolean;
    };
  };
}

export interface Project {
  _id: string;
  ownerId: User;
  title: string;
  description?: string;
  public: boolean;
  collaborators: {
    userId: User;
    role: 'editor' | 'viewer';
    addedAt: string;
  }[];
  designJson: {
    elements: any[];
    canvasSize: { width: number; height: number };
    version: string;
  };
  code: {
    html: string;
    css: string;
    js: string;
    framework: 'react' | 'vue' | 'angular' | 'plain';
  };
  versions: {
    versionId: string;
    snapshot: any;
    createdBy: string;
    createdAt: string;
    message?: string;
  }[];
  assets: string[];
  tags: string[];
  thumbnail?: string;
  stats: {
    views: number;
    likes: number;
    forks: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AIJob {
  jobId: string;
  type: 'design2code' | 'refine' | 'animation' | 'generate';
  status: 'queued' | 'running' | 'completed' | 'failed';
  result?: {
    code?: {
      html: string;
      css: string;
      js: string;
    };
    designJson?: any;
    s3Url?: string;
    message?: string;
  };
  error?: string;
  meta: {
    processingTime?: number;
    tokensUsed?: number;
    model?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Auth API
export const authAPI = {
  register: (data: { email: string; name: string; password: string }) =>
    api.post('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  refresh: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken }),

  me: () => api.get('/auth/me'),

  updateProfile: (data: Partial<User>) =>
    api.put('/auth/profile', data),

  logout: () => api.post('/auth/logout'),
};

// Projects API
export const projectsAPI = {
  list: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    tags?: string[];
  }) => api.get('/projects', { params }),

  listPublic: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    tags?: string[];
    sort?: 'recent' | 'popular' | 'views';
  }) => api.get('/projects/public', { params }),

  get: (id: string) => api.get(`/projects/${id}`),

  create: (data: Partial<Project>) => api.post('/projects', data),

  update: (id: string, data: Partial<Project> & {
    createVersion?: boolean;
    versionMessage?: string;
  }) => api.put(`/projects/${id}`, data),

  delete: (id: string) => api.delete(`/projects/${id}`),

  addCollaborator: (id: string, data: { email: string; role: 'editor' | 'viewer' }) =>
    api.post(`/projects/${id}/collaborators`, data),

  like: (id: string, liked: boolean) =>
    api.post(`/projects/${id}/like`, { liked }),
};

// AI API
export const aiAPI = {
  submitJob: (data: {
    type: 'design2code' | 'refine' | 'animation' | 'generate';
    input: any;
    projectId?: string;
    priority?: number;
  }) => api.post('/ai/jobs', data),

  getJob: (id: string) => api.get(`/ai/jobs/${id}`),

  listJobs: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
  }) => api.get('/ai/jobs', { params }),

  cancelJob: (id: string) => api.delete(`/ai/jobs/${id}`),

  getSuggestions: (data: {
    context: any;
    type?: 'general' | 'colors' | 'layout';
  }) => api.post('/ai/suggest', data),
};

// Assets API
export const assetsAPI = {
  getPresignedUrl: (data: {
    filename: string;
    contentType: string;
    size: number;
  }) => api.post('/assets/presign', data),

  completeUpload: (data: {
    filename: string;
    url: string;
    metadata?: any;
  }) => api.post('/assets/complete', data),

  list: (params?: {
    page?: number;
    limit?: number;
    type?: string;
  }) => api.get('/assets', { params }),

  get: (id: string) => api.get(`/assets/${id}`),

  delete: (id: string) => api.delete(`/assets/${id}`),
};

// Initialize tokens on app start
if (typeof window !== 'undefined') {
  getTokens();
}

export default api;