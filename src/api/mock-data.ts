// Mock data for development
// Remove this file when connecting to real API

import type { Cultivar, Grow, PlantDashboardItem, PlantDetail, User } from '@/types';

export const MOCK_CULTIVARS: Cultivar[] = [
  { id: 'cult-1', name: 'Northern Lights' },
  { id: 'cult-2', name: 'Blue Dream' },
  { id: 'cult-3', name: 'OG Kush' },
  { id: 'cult-4', name: 'White Widow' },
  { id: 'cult-5', name: 'Sour Diesel' },
  { id: 'cult-6', name: 'Girl Scout Cookies' },
  { id: 'cult-7', name: 'AK-47' },
];

export const MOCK_USER: User = {
  id: 'user-1',
  email: 'grower@example.com',
  name: 'Home Grower',
};

export const MOCK_GROWS: Grow[] = [
  {
    id: 'grow-1',
    name: 'Main Tent',
    environment: 'INDOOR',
    status: 'ACTIVE',
    plantCount: 2,
    createdAt: '2024-10-01T10:00:00Z',
  },
  {
    id: 'grow-2',
    name: 'Backyard Garden',
    environment: 'OUTDOOR',
    status: 'ACTIVE',
    plantCount: 1,
    createdAt: '2024-09-15T08:00:00Z',
  },
  {
    id: 'grow-3',
    name: 'Winter 2023',
    environment: 'INDOOR',
    status: 'ARCHIVED',
    plantCount: 4,
    createdAt: '2023-11-01T10:00:00Z',
  },
];

export const MOCK_PLANTS_DASHBOARD: PlantDashboardItem[] = [
  {
    id: 'plant-1',
    name: 'Aurora',
    cultivar: { id: 'cult-1', name: 'Northern Lights' },
    stage: 'FLOWERING',
    status: 'ACTIVE',
    ageInDays: 52,
    todayRecommendation: 'Check trichomes. Consider flush if cloudy.',
    growId: 'grow-1',
    growName: 'Main Tent',
  },
  {
    id: 'plant-2',
    name: null,
    cultivar: { id: 'cult-2', name: 'Blue Dream' },
    stage: 'VEGETATIVE',
    status: 'ACTIVE',
    ageInDays: 28,
    todayRecommendation: 'Top the plant today for better canopy spread.',
    growId: 'grow-1',
    growName: 'Main Tent',
  },
  {
    id: 'plant-4',
    name: 'Sunny',
    cultivar: { id: 'cult-5', name: 'Sour Diesel' },
    stage: 'VEGETATIVE',
    status: 'ACTIVE',
    ageInDays: 35,
    todayRecommendation: 'Water today. Soil moisture is low.',
    growId: 'grow-2',
    growName: 'Backyard Garden',
  },
  {
    id: 'plant-3',
    name: 'Frosty',
    cultivar: { id: 'cult-4', name: 'White Widow' },
    stage: 'CURING',
    status: 'COMPLETED',
    ageInDays: 120,
    todayRecommendation: null,
    growId: 'grow-3',
    growName: 'Winter 2023',
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
    growId: 'grow-1',
    growName: 'Main Tent',
    todayRecommendation: 'Check trichomes. Consider flush if cloudy.',
    createdAt: '2024-11-01T10:00:00Z',
    updatedAt: '2024-12-23T08:30:00Z',
    signals: [
      { id: 'sig-1', type: 'INFO', message: 'Entered flowering stage', timestamp: '2024-12-10T10:00:00Z' },
      { id: 'sig-2', type: 'WARNING', message: 'High humidity detected (78%)', timestamp: '2024-12-20T14:00:00Z' },
      { id: 'sig-3', type: 'ACTION', message: 'Recommended: Check trichomes', timestamp: '2024-12-23T08:00:00Z' },
    ],
    recentActions: [
      { id: 'act-1', type: 'WATER', performedAt: '2024-12-22T09:00:00Z', notes: '2L pH 6.2' },
      { id: 'act-2', type: 'FEED', performedAt: '2024-12-20T09:00:00Z', notes: 'Bloom nutrients, half strength' },
      { id: 'act-3', type: 'WATER', performedAt: '2024-12-18T10:00:00Z', notes: null },
    ],
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
    growId: 'grow-1',
    growName: 'Main Tent',
    todayRecommendation: 'Top the plant today for better canopy spread.',
    createdAt: '2024-11-25T14:00:00Z',
    updatedAt: '2024-12-23T08:30:00Z',
    signals: [
      { id: 'sig-4', type: 'ACTION', message: 'Ready for topping', timestamp: '2024-12-23T08:00:00Z' },
    ],
    recentActions: [
      { id: 'act-4', type: 'WATER', performedAt: '2024-12-21T09:00:00Z', notes: null },
      { id: 'act-5', type: 'FEED', performedAt: '2024-12-19T09:00:00Z', notes: 'Veg nutrients' },
    ],
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
    growId: 'grow-3',
    growName: 'Winter 2023',
    todayRecommendation: null,
    createdAt: '2024-08-20T09:00:00Z',
    updatedAt: '2024-12-18T16:00:00Z',
    signals: [
      { id: 'sig-5', type: 'INFO', message: 'Harvest completed', timestamp: '2024-11-28T10:00:00Z' },
      { id: 'sig-6', type: 'INFO', message: 'Curing started', timestamp: '2024-12-05T10:00:00Z' },
    ],
    recentActions: [
      { id: 'act-6', type: 'COMPLETE', performedAt: '2024-12-05T10:00:00Z', notes: 'Moved to cure jars' },
    ],
  },
  'plant-4': {
    id: 'plant-4',
    name: 'Sunny',
    cultivar: { id: 'cult-5', name: 'Sour Diesel' },
    stage: 'VEGETATIVE',
    status: 'ACTIVE',
    startDate: '2024-11-18',
    ageInDays: 35,
    notes: 'Outdoor grow. Strong sun exposure.',
    growId: 'grow-2',
    growName: 'Backyard Garden',
    todayRecommendation: 'Water today. Soil moisture is low.',
    createdAt: '2024-11-18T08:00:00Z',
    updatedAt: '2024-12-23T08:30:00Z',
    signals: [
      { id: 'sig-7', type: 'WARNING', message: 'Soil moisture below threshold', timestamp: '2024-12-23T07:00:00Z' },
      { id: 'sig-8', type: 'ACTION', message: 'Water needed', timestamp: '2024-12-23T08:00:00Z' },
    ],
    recentActions: [
      { id: 'act-7', type: 'WATER', performedAt: '2024-12-20T08:00:00Z', notes: '3L' },
      { id: 'act-8', type: 'FEED', performedAt: '2024-12-17T08:00:00Z', notes: 'Organic compost tea' },
    ],
  },
};
