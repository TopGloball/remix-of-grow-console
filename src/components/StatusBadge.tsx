import type { PlantStatus } from '@/types';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: PlantStatus;
}

const statusStyles: Record<PlantStatus, string> = {
  ACTIVE: 'bg-status-active/15 text-status-active border-status-active/30',
  FROZEN: 'bg-status-frozen/15 text-status-frozen border-status-frozen/30',
  COMPLETED: 'bg-status-completed/15 text-status-completed border-status-completed/30',
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
        statusStyles[status]
      )}
    >
      {status}
    </span>
  );
}
