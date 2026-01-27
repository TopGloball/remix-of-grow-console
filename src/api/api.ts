// API Layer
// All backend communication goes through this file
// Replace mock implementations with real fetch calls when connecting to backend

import { API_BASE_URL, API_ENDPOINTS } from './config';
import { MOCK_CULTIVARS, MOCK_PLANT_DETAILS, MOCK_PLANTS_DASHBOARD, MOCK_USER } from './mock-data';
import type {
  ApiResponse,
  CreatePlantPayload,
  Cultivar,
  LoginPayload,
  Plant,
  PlantDashboardItem,
  PlantDetail,
  User,
} from '@/types';

// Set to true to use real API, false for mock data
const USE_MOCK = true;

// Helper for real API calls (unused while mocking)
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    credentials: 'include', // for cookie-based auth
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

// Simulate network delay for realistic UX
function delay(ms: number = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============ AUTH ============

export async function login(payload: LoginPayload): Promise<ApiResponse<User>> {
  if (USE_MOCK) {
    await delay();
    return { data: MOCK_USER, success: true };
  }
  return apiCall<ApiResponse<User>>(API_ENDPOINTS.AUTH_LOGIN, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getMe(): Promise<ApiResponse<User>> {
  if (USE_MOCK) {
    await delay();
    return { data: MOCK_USER, success: true };
  }
  return apiCall<ApiResponse<User>>(API_ENDPOINTS.AUTH_ME);
}

// ============ PLANTS ============

export async function createPlant(payload: CreatePlantPayload): Promise<ApiResponse<Plant>> {
  if (USE_MOCK) {
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
    };
    return { data: newPlant, success: true };
  }
  return apiCall<ApiResponse<Plant>>(API_ENDPOINTS.PLANTS_CREATE, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getPlantsDashboard(): Promise<ApiResponse<PlantDashboardItem[]>> {
  if (USE_MOCK) {
    await delay();
    return { data: MOCK_PLANTS_DASHBOARD, success: true };
  }
  return apiCall<ApiResponse<PlantDashboardItem[]>>(API_ENDPOINTS.PLANTS_DASHBOARD);
}

export async function getPlantDetail(plantId: string): Promise<ApiResponse<PlantDetail>> {
  if (USE_MOCK) {
    await delay();
    const plant = MOCK_PLANT_DETAILS[plantId];
    if (!plant) {
      throw new Error('Plant not found');
    }
    return { data: plant, success: true };
  }
  return apiCall<ApiResponse<PlantDetail>>(API_ENDPOINTS.PLANT_DETAIL(plantId));
}

// ============ CULTIVARS (helper) ============

export async function getCultivars(): Promise<ApiResponse<Cultivar[]>> {
  if (USE_MOCK) {
    await delay(200);
    return { data: MOCK_CULTIVARS, success: true };
  }
  // In real API, this might be a separate endpoint or embedded in another response
  return apiCall<ApiResponse<Cultivar[]>>('/api/v1/cultivars');
}
