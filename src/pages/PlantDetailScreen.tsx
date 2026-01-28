import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  Leaf,
  Droplets,
  Utensils,
  StickyNote,
  Sprout,
  TrendingUp,
  Flower2,
  Sun,
  ChevronDown,
  Calendar,
  MapPin,
  AlertTriangle,
} from 'lucide-react';
import { usePlantStore } from '@/store/plantStore';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getPlantDetail } from '@/api/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import type { PlantStage } from '@/types';

const STAGE_CONFIG = {
  seedling: { label: 'Рассада', icon: Sprout, color: 'text-emerald-400', bgColor: 'bg-emerald-400' },
  vegetative: { label: 'Вегетация', icon: TrendingUp, color: 'text-green-400', bgColor: 'bg-green-400' },
  flowering: { label: 'Цветение', icon: Flower2, color: 'text-pink-400', bgColor: 'bg-pink-400' },
  harvest: { label: 'Урожай', icon: Sun, color: 'text-yellow-400', bgColor: 'bg-yellow-400' },
  curing: { label: 'Сушка', icon: Droplets, color: 'text-amber-400', bgColor: 'bg-amber-400' },
};

const ALL_STAGES = ['seedling', 'vegetative', 'flowering', 'harvest', 'curing'] as const;

// Helper to convert API stage format to UI format
function normalizeStage(stage: PlantStage): keyof typeof STAGE_CONFIG {
  const stageMap: Record<PlantStage, keyof typeof STAGE_CONFIG> = {
    SEEDLING: 'seedling',
    VEGETATIVE: 'vegetative',
    FLOWERING: 'flowering',
    HARVEST: 'harvest',
    DRYING: 'curing',
    CURING: 'curing',
  };
  return stageMap[stage] || 'seedling';
}

// Helper to convert UI stage format to API format for comparison
function getStageIndex(stage: PlantStage): number {
  const stageOrder: PlantStage[] = ['SEEDLING', 'VEGETATIVE', 'FLOWERING', 'HARVEST', 'CURING'];
  return stageOrder.indexOf(stage);
}

const TYPE_LABELS = {
  indoor: { label: 'Домашнее', icon: MapPin },
  outdoor: { label: 'Уличное', icon: MapPin },
  greenhouse: { label: 'Теплица', icon: MapPin },
};

export default function PlantDetailScreen() {
  const { plantId } = useParams<{ plantId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { tasks } = usePlantStore();

  // Fetch plant detail from API
  const {
    data: plantResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['plant', plantId],
    queryFn: async () => {
      if (!plantId) throw new Error('Plant ID is required');
      const response = await getPlantDetail(plantId);
      return response.data;
    },
    enabled: !!plantId,
  });

  const plant = plantResponse;
  const plantTasks = tasks.filter((t) => t.plantId === plantId && !t.completed);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !plant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Leaf className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
          <p className="text-lg font-medium text-foreground">Растение не найдено</p>
          <p className="text-sm text-muted-foreground mt-1">
            {error instanceof Error ? error.message : 'Не удалось загрузить данные растения'}
          </p>
          <Link to="/" className="text-primary hover:underline mt-2 inline-block">
            Вернуться на главную
          </Link>
        </div>
      </div>
    );
  }

  const normalizedStage = normalizeStage(plant.stage);
  const stageConfig = STAGE_CONFIG[normalizedStage];
  const StageIcon = stageConfig.icon;
  const currentStageIndex = getStageIndex(plant.stage);
  const plantName = plant.name || plant.cultivar.name || 'Без названия';

  const handleAction = (action: string) => {
    toast({
      title: `${action} выполнено`,
      description: `Действие "${action}" записано для ${plant.name}`,
    });
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-14 z-30 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3 max-w-lg mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-semibold text-foreground">{plantName}</h1>
            <p className="text-sm text-muted-foreground">{plant.cultivar.name}</p>
          </div>
        </div>
      </header>

      <main className="px-4 py-4 max-w-lg mx-auto space-y-4">
        {/* Stage Pills */}
        <div className="flex gap-1 overflow-x-auto pb-2">
          {ALL_STAGES.map((stage, index) => {
            const config = STAGE_CONFIG[stage];
            const isActive = stage === normalizedStage;
            const isPast = index < ALL_STAGES.indexOf(normalizedStage);
            const Icon = config.icon;

            return (
              <div
                key={stage}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? `${config.bgColor}/20 ${config.color} border border-current`
                    : isPast
                    ? 'bg-muted/50 text-muted-foreground'
                    : 'bg-muted/30 text-muted-foreground/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {config.label}
              </div>
            );
          })}
        </div>

        {/* Plant Identity Card */}
        <section className="glass-card p-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
              <Leaf className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-foreground">{plantName}</h2>
              <p className="text-sm text-muted-foreground">{plant.cultivar.name}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Возраст: {plant.ageInDays} дн.
                </div>
                {plant.startDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(plant.startDate).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* What Next Card */}
        {plant.todayRecommendation && (
          <section className="glass-card p-4 bg-primary/5 border-primary/20">
            <h3 className="font-medium text-foreground mb-2">Что дальше?</h3>
            <p className="text-sm text-muted-foreground">{plant.todayRecommendation}</p>
          </section>
        )}

        {/* Action Buttons */}
        <section className="glass-card p-4">
          <h3 className="font-medium text-foreground mb-3">Действия</h3>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              className="flex flex-col items-center gap-1.5 h-auto py-4"
              onClick={() => handleAction('Полив')}
            >
              <Droplets className="w-5 h-5 text-blue-400" />
              <span className="text-xs">Полить</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center gap-1.5 h-auto py-4"
              onClick={() => handleAction('Подкормка')}
            >
              <Utensils className="w-5 h-5 text-amber-400" />
              <span className="text-xs">Подкормить</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center gap-1.5 h-auto py-4"
              onClick={() => handleAction('Заметка')}
            >
              <StickyNote className="w-5 h-5 text-purple-400" />
              <span className="text-xs">Заметка</span>
            </Button>
          </div>
        </section>

        {/* Tasks */}
        {plantTasks.length > 0 && (
          <section className="glass-card p-4">
            <h3 className="font-medium text-foreground mb-3">Задачи</h3>
            <div className="space-y-2">
              {plantTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"
                >
                  <div className="w-2 h-2 rounded-full bg-warning" />
                  <span className="text-sm text-foreground">{task.description}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Notes */}
        {plant.notes && (
          <section className="glass-card p-4">
            <h3 className="font-medium text-foreground mb-2">Заметки</h3>
            <p className="text-sm text-muted-foreground">{plant.notes}</p>
          </section>
        )}

        {/* History (collapsed) */}
        {plant.recentActions && plant.recentActions.length > 0 && (
          <details className="glass-card">
            <summary className="flex items-center justify-between p-4 cursor-pointer">
              <h3 className="font-medium text-foreground">История действий</h3>
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            </summary>
            <div className="px-4 pb-4 pt-0 border-t border-border">
              <div className="space-y-3 mt-3">
                {plant.recentActions.map((action) => {
                  const isWater = action.type === 'WATER';
                  const isFeed = action.type === 'FEED';
                  const ActionIcon = isWater ? Droplets : isFeed ? Utensils : StickyNote;
                  const actionLabel = isWater ? 'Полив' : isFeed ? 'Подкормка' : 'Действие';
                  const iconColor = isWater ? 'text-blue-400' : isFeed ? 'text-amber-400' : 'text-purple-400';
                  const bgColor = isWater ? 'bg-blue-500/20' : isFeed ? 'bg-amber-500/20' : 'bg-purple-500/20';
                  const actionDate = new Date(action.performedAt);
                  const daysAgo = Math.floor((Date.now() - actionDate.getTime()) / (1000 * 60 * 60 * 24));
                  const dateLabel = daysAgo === 0 ? 'Сегодня' : daysAgo === 1 ? 'Вчера' : `${daysAgo} дня назад`;

                  return (
                    <div key={action.id} className="flex items-center gap-3 text-sm">
                      <div className={`w-8 h-8 rounded-full ${bgColor} flex items-center justify-center`}>
                        <ActionIcon className={`w-4 h-4 ${iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-foreground">{actionLabel}</p>
                        {action.notes && (
                          <p className="text-xs text-muted-foreground">{action.notes}</p>
                        )}
                        <p className="text-xs text-muted-foreground">{dateLabel}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </details>
        )}
      </main>
    </div>
  );
}
