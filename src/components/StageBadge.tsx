import type { PlantStage } from '@/types';
import { cn } from '@/lib/utils';

interface StageBadgeProps {
  stage: PlantStage;
}

const stageLabels: Record<PlantStage, string> = {
  SEEDLING: 'Seedling',
  VEGETATIVE: 'Veg',
  FLOWERING: 'Flower',
  HARVEST: 'Harvest',
  DRYING: 'Drying',
  CURING: 'Curing',
};

export function StageBadge({ stage }: StageBadgeProps) {
  return (
    <span className={cn('text-xs font-medium uppercase tracking-wide text-stage')}>
      {stageLabels[stage]}
    </span>
  );
}
