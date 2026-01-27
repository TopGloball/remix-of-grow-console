import { Link } from 'react-router-dom';
import type { PlantDashboardItem } from '@/types';
import { StatusBadge } from './StatusBadge';
import { StageBadge } from './StageBadge';

interface PlantCardProps {
  plant: PlantDashboardItem;
}

export function PlantCard({ plant }: PlantCardProps) {
  const displayName = plant.name || plant.cultivar.name;

  return (
    <Link
      to={`/plants/${plant.id}`}
      className="block rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/30 hover:bg-card-hover"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-medium text-foreground">
            {displayName}
          </h3>
          {plant.name && (
            <p className="mt-0.5 text-sm text-muted-foreground">
              {plant.cultivar.name}
            </p>
          )}
          <p className="mt-0.5 text-xs text-muted-foreground">
            {plant.growName}
          </p>
        </div>
        <StatusBadge status={plant.status} />
      </div>

      <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
        <StageBadge stage={plant.stage} />
        <span>Day {plant.ageInDays}</span>
      </div>

      {plant.todayRecommendation && (
        <div className="mt-3 rounded border-l-2 border-accent bg-accent/10 px-3 py-2">
          <p className="text-sm text-foreground">{plant.todayRecommendation}</p>
        </div>
      )}
    </Link>
  );
}
