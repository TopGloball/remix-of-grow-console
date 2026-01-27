// API Configuration
// Change this to your actual backend URL when connecting to real API

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH_LOGIN: '/api/v2/auth/login',
  AUTH_ME: '/api/v2/auth/me',
  
  // Plant endpoints
  PLANTS_CREATE: '/api/v1/plants',
  PLANTS_DASHBOARD: '/api/v2/plants/dashboard',
  PLANT_DETAIL: (plantId: string) => `/api/v2/plants/${plantId}/detail`,
} as const;
