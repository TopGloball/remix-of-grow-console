// API Layer
// All backend communication goes through this file
// Replace mock implementations with real fetch calls when connecting to backend

import { appConfig } from '@/config/app';
import { API_BASE_URL, API_ENDPOINTS } from './config';
import { MOCK_CULTIVARS, MOCK_GROWS, MOCK_PLANT_DETAILS, MOCK_PLANTS_DASHBOARD, MOCK_USER } from './mock-data';
import type {
  ApiDebugInfo,
  ApiResponse,
  CreateGrowPayload,
  CreatePlantPayload,
  Cultivar,
  Grow,
  LoginPayload,
  PerformActionPayload,
  Plant,
  PlantAction,
  PlantDashboardItem,
  PlantDetail,
  User,
} from '@/types';

// Debug log storage for dev mode
const debugLogs: ApiDebugInfo[] = [];
const MAX_DEBUG_LOGS = 50;

function logApiCall(info: ApiDebugInfo): void {
  debugLogs.unshift(info);
  if (debugLogs.length > MAX_DEBUG_LOGS) {
    debugLogs.pop();
  }
}

export function getDebugLogs(): ApiDebugInfo[] {
  return [...debugLogs];
}

export function clearDebugLogs(): void {
  debugLogs.length = 0;
}

// Helper for real API calls
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const fullUrl = `${API_BASE_URL}${endpoint}`;
  const method = options?.method || 'GET';
  
  const response = await fetch(fullUrl, {
    credentials: 'include', // for cookie-based auth
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  const data = await response.json();
  
  // Log for dev mode
  logApiCall({
    endpoint,
    method,
    payload: options?.body ? JSON.parse(options.body as string) : undefined,
    response: data,
    timestamp: Date.now(),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return data;
}

// Simulate network delay for realistic UX
function delay(ms: number = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============ AUTH ============

export async function login(payload: LoginPayload): Promise<ApiResponse<User>> {
  if (appConfig.useMockData) {
    await delay();
    logApiCall({ endpoint: API_ENDPOINTS.AUTH_LOGIN, method: 'POST', payload, response: { data: MOCK_USER, success: true }, timestamp: Date.now() });
    return { data: MOCK_USER, success: true };
  }
  return apiCall<ApiResponse<User>>(API_ENDPOINTS.AUTH_LOGIN, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getMe(): Promise<ApiResponse<User>> {
  if (appConfig.useMockData) {
    await delay();
    logApiCall({ endpoint: API_ENDPOINTS.AUTH_ME, method: 'GET', response: { data: MOCK_USER, success: true }, timestamp: Date.now() });
    return { data: MOCK_USER, success: true };
  }
  return apiCall<ApiResponse<User>>(API_ENDPOINTS.AUTH_ME);
}

// ============ GROWS ============

export async function getGrows(): Promise<ApiResponse<Grow[]>> {
  if (appConfig.useMockData) {
    await delay();
    logApiCall({ endpoint: API_ENDPOINTS.GROWS_LIST, method: 'GET', response: { data: MOCK_GROWS, success: true }, timestamp: Date.now() });
    return { data: MOCK_GROWS, success: true };
  }
  return apiCall<ApiResponse<Grow[]>>(API_ENDPOINTS.GROWS_LIST);
}

export async function createGrow(payload: CreateGrowPayload): Promise<ApiResponse<Grow>> {
  if (appConfig.useMockData) {
    await delay(500);
    const newGrow: Grow = {
      id: `grow-${Date.now()}`,
      name: payload.name,
      environment: payload.environment,
      status: 'ACTIVE',
      plantCount: 0,
      createdAt: new Date().toISOString(),
    };
    logApiCall({ endpoint: API_ENDPOINTS.GROWS_CREATE, method: 'POST', payload, response: { data: newGrow, success: true }, timestamp: Date.now() });
    return { data: newGrow, success: true };
  }
  return apiCall<ApiResponse<Grow>>(API_ENDPOINTS.GROWS_CREATE, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ============ PLANTS ============

export async function createPlant(payload: CreatePlantPayload): Promise<ApiResponse<Plant>> {
  if (appConfig.useMockData) {
    await delay(500);
    const cultivar = MOCK_CULTIVARS.find((c) => c.id === payload.cultivarId) || MOCK_CULTIVARS[0];
    const newPlant: Plant = {
      id: `plant-${Date.now()}`,
      name: payload.name || null,
      cultivar,
      stage: 'SEEDLING',
      status: 'ACTIVE',
      startDate: payload.startDate || new Date().toISOString().split('T')[0],
      ageInDays: payload.ageInDays || 0,
      notes: payload.notes || null,
      growId: payload.growId,
    };
    logApiCall({ endpoint: API_ENDPOINTS.PLANTS_CREATE, method: 'POST', payload, response: { data: newPlant, success: true }, timestamp: Date.now() });
    return { data: newPlant, success: true };
  }
  return apiCall<ApiResponse<Plant>>(API_ENDPOINTS.PLANTS_CREATE, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getPlantsDashboard(): Promise<ApiResponse<PlantDashboardItem[]>> {
  if (appConfig.useMockData) {
    await delay();
    logApiCall({ endpoint: API_ENDPOINTS.PLANTS_DASHBOARD, method: 'GET', response: { data: MOCK_PLANTS_DASHBOARD, success: true }, timestamp: Date.now() });
    return { data: MOCK_PLANTS_DASHBOARD, success: true };
  }
  return apiCall<ApiResponse<PlantDashboardItem[]>>(API_ENDPOINTS.PLANTS_DASHBOARD);
}

export async function getPlantDetail(plantId: string): Promise<ApiResponse<PlantDetail>> {
  if (appConfig.useMockData) {
    await delay();
    const plant = MOCK_PLANT_DETAILS[plantId];
    if (!plant) {
      throw new Error('Plant not found');
    }
    logApiCall({ endpoint: API_ENDPOINTS.PLANT_DETAIL(plantId), method: 'GET', response: { data: plant, success: true }, timestamp: Date.now() });
    return { data: plant, success: true };
  }
  return apiCall<ApiResponse<PlantDetail>>(API_ENDPOINTS.PLANT_DETAIL(plantId));
}

// ============ PLANT ACTIONS ============

export async function waterPlant(plantId: string, payload?: PerformActionPayload): Promise<ApiResponse<PlantAction>> {
  const endpoint = API_ENDPOINTS.PLANT_ACTION_WATER(plantId);
  if (appConfig.useMockData) {
    await delay(400);
    const action: PlantAction = {
      id: `act-${Date.now()}`,
      type: 'WATER',
      performedAt: new Date().toISOString(),
      notes: payload?.notes || null,
    };
    logApiCall({ endpoint, method: 'POST', payload, response: { data: action, success: true }, timestamp: Date.now() });
    return { data: action, success: true };
  }
  return apiCall<ApiResponse<PlantAction>>(endpoint, {
    method: 'POST',
    body: JSON.stringify(payload || {}),
  });
}

export async function feedPlant(plantId: string, payload?: PerformActionPayload): Promise<ApiResponse<PlantAction>> {
  const endpoint = API_ENDPOINTS.PLANT_ACTION_FEED(plantId);
  if (appConfig.useMockData) {
    await delay(400);
    const action: PlantAction = {
      id: `act-${Date.now()}`,
      type: 'FEED',
      performedAt: new Date().toISOString(),
      notes: payload?.notes || null,
    };
    logApiCall({ endpoint, method: 'POST', payload, response: { data: action, success: true }, timestamp: Date.now() });
    return { data: action, success: true };
  }
  return apiCall<ApiResponse<PlantAction>>(endpoint, {
    method: 'POST',
    body: JSON.stringify(payload || {}),
  });
}

export async function completePlant(plantId: string, payload?: PerformActionPayload): Promise<ApiResponse<Plant>> {
  const endpoint = API_ENDPOINTS.PLANT_COMPLETE(plantId);
  if (appConfig.useMockData) {
    await delay(500);
    const existingPlant = MOCK_PLANT_DETAILS[plantId];
    if (!existingPlant) {
      throw new Error('Plant not found');
    }
    const completedPlant: Plant = {
      ...existingPlant,
      status: 'COMPLETED',
    };
    logApiCall({ endpoint, method: 'POST', payload, response: { data: completedPlant, success: true }, timestamp: Date.now() });
    return { data: completedPlant, success: true };
  }
  return apiCall<ApiResponse<Plant>>(endpoint, {
    method: 'POST',
    body: JSON.stringify(payload || {}),
  });
}

// ============ CULTIVARS (helper) ============

export async function getCultivars(): Promise<ApiResponse<Cultivar[]>> {
  if (appConfig.useMockData) {
    await delay(200);
    return { data: MOCK_CULTIVARS, success: true };
  }
  // In real API, this might be a separate endpoint or embedded in another response
  return apiCall<ApiResponse<Cultivar[]>>('/api/v1/cultivars');
}
