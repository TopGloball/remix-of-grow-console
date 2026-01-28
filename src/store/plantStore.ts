// Local state store for plants (mock data, no backend)
import { create } from 'zustand';

export interface CatalogItem {
  id: string;
  name: string;
  category: 'cannabis-auto' | 'cannabis-photo' | 'vegetables' | 'herbs' | 'flowers';
  description: string;
  wateringDays: number;
  lightHours: number;
  growthDays: number;
}

export interface Plant {
  id: string;
  name: string;
  cultivar: string;
  category: string;
  type: 'indoor' | 'outdoor' | 'greenhouse';
  stage: 'seedling' | 'vegetative' | 'flowering' | 'harvest' | 'curing';
  expectedHarvest: string | null;
  notes: string;
  createdAt: string;
  recommendation: string | null;
}

export interface Task {
  id: string;
  plantId: string;
  plantName: string;
  type: 'water' | 'feed' | 'check' | 'harvest' | 'transplant';
  description: string;
  dueDate: 'today' | 'tomorrow' | 'soon';
  completed: boolean;
}

interface PlantStore {
  plants: Plant[];
  tasks: Task[];
  addPlant: (plant: Omit<Plant, 'id' | 'createdAt'>) => void;
  removePlant: (id: string) => void;
  completeTask: (id: string) => void;
}

// Mock catalog data
export const CATALOG: CatalogItem[] = [
  {
    id: 'nl-1',
    name: 'Northern Lights',
    category: 'cannabis-photo',
    description: 'Классический индика-доминантный сорт',
    wateringDays: 2,
    lightHours: 18,
    growthDays: 89,
  },
  {
    id: 'ww-1',
    name: 'White Widow',
    category: 'cannabis-photo',
    description: 'Сбалансированный гибрид',
    wateringDays: 2,
    lightHours: 18,
    growthDays: 103,
  },
  {
    id: 'gg-1',
    name: 'Gorilla Glue',
    category: 'cannabis-photo',
    description: 'Мощный гибрид с высокой урожайностью',
    wateringDays: 2,
    lightHours: 18,
    growthDays: 95,
  },
  {
    id: 'ak-1',
    name: 'AK-47 Auto',
    category: 'cannabis-auto',
    description: 'Быстрорастущий автоцвет',
    wateringDays: 2,
    lightHours: 20,
    growthDays: 75,
  },
  {
    id: 'bd-1',
    name: 'Blue Dream',
    category: 'cannabis-photo',
    description: 'Сативо-доминантный гибрид с ягодным ароматом',
    wateringDays: 2,
    lightHours: 18,
    growthDays: 98,
  },
];

// Initial mock plants
const initialPlants: Plant[] = [
  {
    id: 'plant-1',
    name: 'Aurora',
    cultivar: 'Northern Lights',
    category: 'cannabis-photo',
    type: 'indoor',
    stage: 'flowering',
    expectedHarvest: '2026-02-15',
    notes: 'Отличный рост, немного листьев подгорело на 3 неделе',
    createdAt: '2025-11-01',
    recommendation: 'Проверь трихомы. Рассмотри промывку если мутные.',
  },
  {
    id: 'plant-2',
    name: 'Blue Dream #1',
    cultivar: 'Blue Dream',
    category: 'cannabis-photo',
    type: 'indoor',
    stage: 'vegetative',
    expectedHarvest: '2026-03-10',
    notes: '',
    createdAt: '2025-12-15',
    recommendation: 'Время для топпинга для лучшего распределения кроны.',
  },
  {
    id: 'plant-3',
    name: 'Gorilla',
    cultivar: 'Gorilla Glue',
    category: 'cannabis-photo',
    type: 'indoor',
    stage: 'seedling',
    expectedHarvest: '2026-04-20',
    notes: 'Только что проклюнулась',
    createdAt: '2026-01-25',
    recommendation: 'Полив сегодня. Почва пересохла.',
  },
];

// Initial mock tasks
const initialTasks: Task[] = [
  {
    id: 'task-1',
    plantId: 'plant-3',
    plantName: 'Gorilla',
    type: 'water',
    description: 'Полить растение (почва пересохла)',
    dueDate: 'today',
    completed: false,
  },
  {
    id: 'task-2',
    plantId: 'plant-1',
    plantName: 'Aurora',
    type: 'check',
    description: 'Проверить трихомы под лупой',
    dueDate: 'today',
    completed: false,
  },
  {
    id: 'task-3',
    plantId: 'plant-2',
    plantName: 'Blue Dream #1',
    type: 'feed',
    description: 'Внести удобрения (вег. фаза)',
    dueDate: 'tomorrow',
    completed: false,
  },
  {
    id: 'task-4',
    plantId: 'plant-2',
    plantName: 'Blue Dream #1',
    type: 'transplant',
    description: 'Топпинг для формирования кроны',
    dueDate: 'soon',
    completed: false,
  },
  {
    id: 'task-5',
    plantId: 'plant-1',
    plantName: 'Aurora',
    type: 'harvest',
    description: 'Подготовить зону сушки',
    dueDate: 'soon',
    completed: false,
  },
];

export const usePlantStore = create<PlantStore>((set) => ({
  plants: initialPlants,
  tasks: initialTasks,
  addPlant: (plantData) =>
    set((state) => ({
      plants: [
        ...state.plants,
        {
          ...plantData,
          id: `plant-${Date.now()}`,
          createdAt: new Date().toISOString().split('T')[0],
        },
      ],
    })),
  removePlant: (id) =>
    set((state) => ({
      plants: state.plants.filter((p) => p.id !== id),
      tasks: state.tasks.filter((t) => t.plantId !== id),
    })),
  completeTask: (id) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, completed: true } : t
      ),
    })),
}));
