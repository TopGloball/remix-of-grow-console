import type { PlantSignal } from '@/types';
import { AlertCircle, Info, Zap } from 'lucide-react';
import { format } from 'date-fns';

interface SignalListProps {
  signals: PlantSignal[];
}

const signalIcons = {
  INFO: Info,
  WARNING: AlertCircle,
  ACTION: Zap,
};

const signalColors = {
  INFO: 'text-blue-500',
  WARNING: 'text-amber-500',
  ACTION: 'text-green-500',
};

export function SignalList({ signals }: SignalListProps) {
  if (signals.length === 0) {
    return (
      <div className="text-sm text-muted-foreground italic">No signals yet</div>
    );
  }

  return (
    <div className="space-y-2">
      {signals.map((signal) => {
        const Icon = signalIcons[signal.type];
        return (
          <div key={signal.id} className="flex items-start gap-3 rounded-lg border border-border bg-card/50 p-3">
            <Icon className={`mt-0.5 h-4 w-4 flex-shrink-0 ${signalColors[signal.type]}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">{signal.message}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {format(new Date(signal.timestamp), 'MMM d, yyyy h:mm a')}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
