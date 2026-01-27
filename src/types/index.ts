// Plant-related types matching backend contract

export type PlantStatus = 'ACTIVE' | 'FROZEN' | 'COMPLETED';

export type PlantStage = 'SEEDLING' | 'VEGETATIVE' | 'FLOWERING' | 'HARVEST' | 'DRYING' | 'CURING';

export interface Cultivar {
  id: string;
  name: string;
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
}

export interface PlantDashboardItem {
  id: string;
  name: string | null;
  cultivar: Cultivar;
  stage: PlantStage;
  status: PlantStatus;
  ageInDays: number;
  todayRecommendation: string | null;
}

export interface PlantDetail extends Plant {
  todayRecommendation: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlantPayload {
  cultivarId: string;
  name?: string;
  startDate?: string;
  ageInDays?: number;
  notes?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
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
