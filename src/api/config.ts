// API Configuration
// Central location for all API endpoints

import { appConfig } from '@/config/app';

export const API_BASE_URL = appConfig.apiBaseUrl;

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH_LOGIN: '/api/v2/auth/login',
  AUTH_ME: '/api/v2/auth/me',
  
  // Grow endpoints
  GROWS_LIST: '/api/v2/grows',
  GROWS_CREATE: '/api/v2/grows',
  
  // Plant endpoints
  PLANTS_CREATE: '/api/v1/plants',
  PLANTS_DASHBOARD: '/api/v2/plants/dashboard',
  PLANT_DETAIL: (plantId: string) => `/api/v2/plants/${plantId}/detail`,
  
  // Plant action endpoints
  PLANT_ACTION_WATER: (plantId: string) => `/api/v2/plants/${plantId}/actions/water`,
  PLANT_ACTION_FEED: (plantId: string) => `/api/v2/plants/${plantId}/actions/feed`,
  PLANT_COMPLETE: (plantId: string) => `/api/v2/plants/${plantId}/complete`,
} as const;
