import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Droplets,
  Utensils,
  Eye,
  Scissors,
  Package,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import { usePlantStore } from '@/store/plantStore';
import { getPlantsDashboard } from '@/api/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const TASK_ICONS = {
  water: Droplets,
  feed: Utensils,
  check: Eye,
  harvest: Scissors,
  transplant: Package,
};

const DUE_LABELS = {
  today: { label: 'Сегодня', className: 'pill-warning' },
  tomorrow: { label: 'Завтра', className: 'pill-info' },
  soon: { label: 'Скоро', className: 'pill-muted' },
};

export default function TodayScreen() {
  const { tasks, completeTask } = usePlantStore();

  // Fetch plants from API for recommendations
  const {
    data: plantsResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['plants', 'dashboard'],
    queryFn: async () => {
      const response = await getPlantsDashboard();
      return response.data;
    },
  });

  const pendingTasks = tasks.filter((t) => !t.completed);
  const todayCount = pendingTasks.filter((t) => t.dueDate === 'today').length;

  const groupedTasks = {
    today: pendingTasks.filter((t) => t.dueDate === 'today'),
    tomorrow: pendingTasks.filter((t) => t.dueDate === 'tomorrow'),
    soon: pendingTasks.filter((t) => t.dueDate === 'soon'),
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <section className="glass-card p-4">
          <LoadingSpinner />
        </section>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <section className="glass-card p-4">
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium text-foreground">Ошибка загрузки данных</p>
            <p className="text-sm mt-1">
              {error instanceof Error ? error.message : 'Не удалось загрузить данные'}
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Tasks Card */}
      <section className="glass-card p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-foreground">Задачи на сегодня</h2>
            <p className="text-sm text-muted-foreground">
              Список дел и напоминаний
            </p>
          </div>
          <span className={`pill ${todayCount > 0 ? 'pill-warning' : 'pill-primary'}`}>
            {pendingTasks.length}
          </span>
        </div>

        {pendingTasks.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-primary opacity-70" />
            <p className="font-medium text-foreground">Всё готово!</p>
            <p className="text-sm text-muted-foreground mt-1">
              Нет незавершённых задач
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedTasks).map(([key, taskList]) => {
              if (taskList.length === 0) return null;
              const dueConfig = DUE_LABELS[key as keyof typeof DUE_LABELS];

              return (
                <div key={key}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`pill ${dueConfig.className}`}>
                      {dueConfig.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {taskList.length} задач{taskList.length === 1 ? 'а' : ''}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {taskList.map((task) => {
                      const TaskIcon = TASK_ICONS[task.type];
                      return (
                        <div
                          key={task.id}
                          className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border"
                        >
                          <button
                            onClick={() => completeTask(task.id)}
                            className="w-8 h-8 rounded-lg bg-muted/50 hover:bg-primary/20 flex items-center justify-center flex-shrink-0 transition-colors group"
                          >
                            <TaskIcon className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <Link
                                to={`/plants/${task.plantId}`}
                                className="text-sm font-medium text-primary hover:underline"
                              >
                                {task.plantName}
                              </Link>
                            </div>
                            <p className="text-sm text-foreground mt-0.5">
                              {task.description}
                            </p>
                          </div>
                          <button
                            onClick={() => completeTask(task.id)}
                            className="text-xs text-muted-foreground hover:text-primary transition-colors"
                          >
                            Готово
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Signals Card */}
      <section className="glass-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-semibold text-foreground">Сигналы</h2>
            <p className="text-sm text-muted-foreground">
              Наблюдения и предупреждения
            </p>
          </div>
          <span className="pill pill-warning">2</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-warning/10">
            <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Сигнал: низкая влажность
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Края листьев подсушены. Проверь увлажнитель.
              </p>
            </div>
            <span className="pill pill-warning">warning</span>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
            <TrendingUp className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Температура стабильна
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Последние 48ч в диапазоне 22-26°C
              </p>
            </div>
            <span className="pill pill-muted">ok</span>
          </div>
        </div>
      </section>
    </div>
  );
}
