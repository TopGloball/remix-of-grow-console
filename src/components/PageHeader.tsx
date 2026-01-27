import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  backTo?: string;
  backLabel?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, backTo, backLabel, action }: PageHeaderProps) {
  return (
    <header className="border-b border-border bg-card px-4 py-4">
      <div className="mx-auto flex max-w-2xl items-center justify-between">
        <div className="flex items-center gap-3">
          {backTo && (
            <Link
              to={backTo}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
              {backLabel && <span>{backLabel}</span>}
            </Link>
          )}
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        </div>
        {action && <div>{action}</div>}
      </div>
    </header>
  );
}
