import { Link } from 'react-router-dom';
import { Sprout } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
}

export function EmptyState({ title, description, actionLabel, actionTo }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-4 rounded-full bg-muted p-4">
        <Sprout className="h-8 w-8 text-muted-foreground" />
      </div>
      <h2 className="mb-2 text-lg font-medium text-foreground">{title}</h2>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">{description}</p>
      {actionLabel && actionTo && (
        <Button asChild>
          <Link to={actionTo}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  );
}
