// Mock data for development
// Remove this file when connecting to real API

import type { Cultivar, PlantDashboardItem, PlantDetail, User } from '@/types';

export const MOCK_CULTIVARS: Cultivar[] = [
  { id: 'cult-1', name: 'Northern Lights' },
  { id: 'cult-2', name: 'Blue Dream' },
  { id: 'cult-3', name: 'OG Kush' },
  { id: 'cult-4', name: 'White Widow' },
  { id: 'cult-5', name: 'Sour Diesel' },
];

export const MOCK_USER: User = {
  id: 'user-1',
  email: 'grower@example.com',
  name: 'Home Grower',
};

export const MOCK_PLANTS_DASHBOARD: PlantDashboardItem[] = [
  {
    id: 'plant-1',
    name: 'Aurora',
    cultivar: { id: 'cult-1', name: 'Northern Lights' },
    stage: 'FLOWERING',
    status: 'ACTIVE',
    ageInDays: 52,
    todayRecommendation: 'Check trichomes. Consider flush if cloudy.',
  },
  {
    id: 'plant-2',
    name: null,
    cultivar: { id: 'cult-2', name: 'Blue Dream' },
    stage: 'VEGETATIVE',
    status: 'ACTIVE',
    ageInDays: 28,
    todayRecommendation: 'Top the plant today for better canopy spread.',
  },
  {
    id: 'plant-3',
    name: 'Frosty',
    cultivar: { id: 'cult-4', name: 'White Widow' },
    stage: 'CURING',
    status: 'COMPLETED',
    ageInDays: 120,
    todayRecommendation: null,
  },
];

export const MOCK_PLANT_DETAILS: Record<string, PlantDetail> = {
  'plant-1': {
    id: 'plant-1',
    name: 'Aurora',
    cultivar: { id: 'cult-1', name: 'Northern Lights' },
    stage: 'FLOWERING',
    status: 'ACTIVE',
    startDate: '2024-11-01',
    ageInDays: 52,
    notes: 'Slight nutrient burn on lower leaves week 3. Adjusted EC down.',
    todayRecommendation: 'Check trichomes. Consider flush if cloudy.',
    createdAt: '2024-11-01T10:00:00Z',
    updatedAt: '2024-12-23T08:30:00Z',
  },
  'plant-2': {
    id: 'plant-2',
    name: null,
    cultivar: { id: 'cult-2', name: 'Blue Dream' },
    stage: 'VEGETATIVE',
    status: 'ACTIVE',
    startDate: '2024-11-25',
    ageInDays: 28,
    notes: null,
    todayRecommendation: 'Top the plant today for better canopy spread.',
    createdAt: '2024-11-25T14:00:00Z',
    updatedAt: '2024-12-23T08:30:00Z',
  },
  'plant-3': {
    id: 'plant-3',
    name: 'Frosty',
    cultivar: { id: 'cult-4', name: 'White Widow' },
    stage: 'CURING',
    status: 'COMPLETED',
    startDate: '2024-08-20',
    ageInDays: 120,
    notes: 'Excellent yield. Dense buds. Kept as reference.',
    todayRecommendation: null,
    createdAt: '2024-08-20T09:00:00Z',
    updatedAt: '2024-12-18T16:00:00Z',
  },
};
