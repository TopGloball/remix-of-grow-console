import type { PlantAction } from '@/types';
import { Droplets, Utensils, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

interface ActionHistoryProps {
  actions: PlantAction[];
}

const actionIcons = {
  WATER: Droplets,
  FEED: Utensils,
  COMPLETE: CheckCircle,
};

const actionColors = {
  WATER: 'text-blue-500 bg-blue-500/10',
  FEED: 'text-amber-500 bg-amber-500/10',
  COMPLETE: 'text-green-500 bg-green-500/10',
};

export function ActionHistory({ actions }: ActionHistoryProps) {
  if (actions.length === 0) {
    return (
      <div className="text-sm text-muted-foreground italic">No actions recorded</div>
    );
  }

  return (
    <div className="space-y-2">
      {actions.map((action) => {
        const Icon = actionIcons[action.type];
        const colorClasses = actionColors[action.type];
        return (
          <div key={action.id} className="flex items-start gap-3">
            <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${colorClasses}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground capitalize">
                  {action.type.toLowerCase()}
                </span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(action.performedAt), 'MMM d, h:mm a')}
                </span>
              </div>
              {action.notes && (
                <p className="text-xs text-muted-foreground mt-0.5">{action.notes}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
