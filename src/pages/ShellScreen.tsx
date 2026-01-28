import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Leaf,
  ChevronRight,
  Sprout,
  Flower2,
  Sun,
  AlertTriangle,
  TrendingUp,
  Droplets,
  Plus,
} from 'lucide-react';
import { usePlantStore } from '@/store/plantStore';

const STAGE_CONFIG = {
  seedling: { label: 'Рассада', icon: Sprout, color: 'text-emerald-400' },
  vegetative: { label: 'Вегетация', icon: TrendingUp, color: 'text-green-400' },
  flowering: { label: 'Цветение', icon: Flower2, color: 'text-pink-400' },
  harvest: { label: 'Урожай', icon: Sun, color: 'text-yellow-400' },
  curing: { label: 'Сушка', icon: Droplets, color: 'text-amber-400' },
};

interface ShellScreenProps {
  onAddPlantClick: () => void;
}

export default function ShellScreen({ onAddPlantClick }: ShellScreenProps) {
  const { plants, tasks } = usePlantStore();

  const activePlants = plants.filter((p) => p.stage !== 'curing');
  const todayTasks = tasks.filter((t) => t.dueDate === 'today' && !t.completed);
  const upcomingTasks = tasks.filter((t) => !t.completed);

  return (
    <div className="space-y-4">
      {/* Overview Card */}
      <section className="glass-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-semibold text-foreground">Обзор</h2>
            <p className="text-sm text-muted-foreground">
              Сводка по растениям и ближайшим действиям
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-muted/30 text-center">
            <div className="text-2xl font-bold text-foreground">{plants.length}</div>
            <div className="text-xs text-muted-foreground">Растений</div>
          </div>
          <div className="p-3 rounded-lg bg-primary/10 text-center">
            <div className="text-2xl font-bold text-primary">{todayTasks.length}</div>
            <div className="text-xs text-muted-foreground">Задач сегодня</div>
          </div>
          <div className="p-3 rounded-lg bg-muted/30 text-center">
            <div className="text-2xl font-bold text-foreground">{activePlants.length}</div>
            <div className="text-xs text-muted-foreground">Активных</div>
          </div>
        </div>

        {todayTasks.length > 0 && (
          <Link
            to="/today"
            className="flex items-center justify-between mt-3 p-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Droplets className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {todayTasks.length} задач{todayTasks.length === 1 ? 'а' : ''} на сегодня
                </p>
                <p className="text-xs text-muted-foreground">
                  Нажмите, чтобы посмотреть
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </Link>
        )}
      </section>

      {/* Plants Card */}
      <section className="glass-card p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-foreground">Растения</h2>
            <p className="text-sm text-muted-foreground">
              Открой растение, чтобы увидеть статус
            </p>
          </div>
          <button
            onClick={onAddPlantClick}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Добавить
          </button>
        </div>

        <div className="space-y-3">
          {plants.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Leaf className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Нет растений</p>
              <p className="text-sm mt-1">Добавьте первое растение</p>
            </div>
          ) : (
            plants.map((plant) => {
              const stageConfig = STAGE_CONFIG[plant.stage];
              const StageIcon = stageConfig.icon;

              return (
                <Link
                  key={plant.id}
                  to={`/plants/${plant.id}`}
                  className="block p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:bg-card-hover transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                      <Leaf className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-foreground">
                          {plant.name}
                        </span>
                        <span className="pill pill-muted">{plant.cultivar}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <StageIcon className={`w-4 h-4 ${stageConfig.color}`} />
                        <span className={`text-sm ${stageConfig.color}`}>
                          {stageConfig.label}
                        </span>
                      </div>
                      {plant.recommendation && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-1">
                          💡 {plant.recommendation}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </section>

      {/* Alerts Card (optional PRO feature placeholder) */}
      <section className="glass-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-semibold text-foreground">Предупреждения</h2>
            <p className="text-sm text-muted-foreground">
              Сигналы и наблюдения
            </p>
          </div>
          <span className="pill pill-warning">2</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-warning/10">
            <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Низкая влажность
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Края листьев подсушены. Проверь увлажнитель.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-info/10">
            <TrendingUp className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Температура стабильна
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Последние 48ч в диапазоне 22-26°C
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
