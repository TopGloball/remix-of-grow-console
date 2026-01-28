// Plant-related types matching backend contract

export type PlantStatus = 'ACTIVE' | 'FROZEN' | 'COMPLETED';

export type PlantStage = 'SEEDLING' | 'VEGETATIVE' | 'FLOWERING' | 'HARVEST' | 'DRYING' | 'CURING';

export type PlantActionType = 'WATER' | 'FEED' | 'COMPLETE';

export type GrowStatus = 'ACTIVE' | 'ARCHIVED';

export type GrowEnvironment = 'INDOOR' | 'OUTDOOR' | 'GREENHOUSE';

export interface Cultivar {
  id: string;
  name: string;
}

export interface Grow {
  id: string;
  name: string;
  environment: GrowEnvironment;
  status: GrowStatus;
  plantCount: number;
  createdAt: string;
}

export interface Plant {
  id: string;
  name: string | null;
  cultivar: Cultivar;
  stage: PlantStage;
  status: PlantStatus;
  startDate: string;
  ageInDays: number;
  notes: string | null;
  growId: string;
}

export interface PlantDashboardItem {
  id: string;
  name: string | null;
  cultivar: Cultivar;
  stage: PlantStage;
  status: PlantStatus;
  ageInDays: number;
  todayRecommendation: string | null;
  growId: string;
  growName: string;
}

export interface PlantSignal {
  id: string;
  type: 'INFO' | 'WARNING' | 'ACTION';
  message: string;
  timestamp: string;
}

export interface PlantAction {
  id: string;
  type: PlantActionType;
  performedAt: string;
  notes: string | null;
}

export interface PlantDetail extends Plant {
  todayRecommendation: string | null;
  createdAt: string;
  updatedAt: string;
  growName: string;
  signals: PlantSignal[];
  recentActions: PlantAction[];
}

export interface CreatePlantPayload {
  growId: string;
  cultivarId: string;
  name?: string;
  startDate?: string;
  ageInDays?: number;
  notes?: string;
  medium?: string;
  passportSource?: string;
}

export interface CreateGrowPayload {
  name: string;
  environment: GrowEnvironment;
}

export interface PerformActionPayload {
  notes?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string; // Backend doesn't return name, make it optional
}

export interface LoginPayload {
  email: string;
  password: string;
}

// API Response wrappers
export interface ApiResponse<T> {
  data: T;
  success: boolean;
}

// For dev mode debugging
export interface ApiDebugInfo {
  endpoint: string;
  method: string;
  payload?: unknown;
  response?: unknown;
  timestamp: number;
}
