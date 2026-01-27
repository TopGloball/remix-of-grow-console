import type { Grow } from '@/types';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Leaf, Sun, Home, Warehouse } from 'lucide-react';

interface GrowCardProps {
  grow: Grow;
}

const environmentIcons = {
  INDOOR: Home,
  OUTDOOR: Sun,
  GREENHOUSE: Warehouse,
};

export function GrowCard({ grow }: GrowCardProps) {
  const Icon = environmentIcons[grow.environment];
  
  return (
    <Link to={`/?grow=${grow.id}`}>
      <Card className="transition-colors hover:border-primary/50">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">{grow.name}</h3>
                <p className="text-sm text-muted-foreground capitalize">
                  {grow.environment.toLowerCase()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {grow.status === 'ARCHIVED' && (
                <Badge variant="secondary" className="text-xs">Archived</Badge>
              )}
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Leaf className="h-4 w-4" />
                <span>{grow.plantCount}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
