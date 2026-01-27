import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPlantsDashboard, waterPlant, feedPlant } from '@/api/api';
import type { PlantDashboardItem } from '@/types';
import { useMode } from '@/context/ModeContext';
import { PageHeader } from '@/components/PageHeader';
import { StageBadge } from '@/components/StageBadge';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Droplets, Utensils, ChevronRight, Leaf } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Today() {
  const { canAct, isObserverMode } = useMode();
  const { toast } = useToast();
  const [plants, setPlants] = useState<PlantDashboardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function fetchPlants() {
      try {
        const response = await getPlantsDashboard();
        // Filter to only active plants with recommendations
        const withRecommendations = response.data.filter(
          (p) => p.status === 'ACTIVE' && p.todayRecommendation
        );
        setPlants(withRecommendations);
      } catch (err) {
        setError('Failed to load today\'s tasks');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPlants();
  }, []);

  const handleQuickAction = async (plantId: string, action: 'water' | 'feed') => {
    if (!canAct) {
      toast({
        title: 'Observer Mode',
        description: 'Actions are disabled in observer mode.',
        variant: 'destructive',
      });
      return;
    }

    setActionLoading(prev => ({ ...prev, [`${plantId}-${action}`]: true }));
    
    try {
      if (action === 'water') {
        await waterPlant(plantId);
      } else {
        await feedPlant(plantId);
      }
      toast({
        title: 'Action Recorded',
        description: `${action === 'water' ? 'Watering' : 'Feeding'} action logged.`,
      });
    } catch (err) {
      toast({
        title: 'Action Failed',
        description: 'Could not perform action. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(prev => ({ ...prev, [`${plantId}-${action}`]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Today" />

      <main className="mx-auto max-w-2xl px-4 py-6">
        {isObserverMode && (
          <div className="mb-4 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
            Observer mode — actions are disabled
          </div>
        )}

        {loading && <LoadingSpinner />}

        {error && (
          <div className="rounded-lg bg-destructive/10 p-4 text-center text-sm text-destructive">
            {error}
          </div>
        )}

        {!loading && !error && plants.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Leaf className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-foreground">All caught up!</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              No pending recommendations for today.
            </p>
            <Button asChild variant="outline" className="mt-4">
              <Link to="/">View All Plants</Link>
            </Button>
          </div>
        )}

        {!loading && !error && plants.length > 0 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {plants.length} plant{plants.length !== 1 ? 's' : ''} need attention today
            </p>

            <div className="space-y-3">
              {plants.map((plant) => {
                const displayName = plant.name || plant.cultivar.name;
                const waterKey = `${plant.id}-water`;
                const feedKey = `${plant.id}-feed`;

                return (
                  <Card key={plant.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      {/* Plant Info Row */}
                      <Link 
                        to={`/plants/${plant.id}`}
                        className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-foreground truncate">
                              {displayName}
                            </h3>
                            <StageBadge stage={plant.stage} />
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {plant.growName} • {plant.ageInDays} days
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      </Link>

                      {/* Recommendation */}
                      <div className="border-t border-border bg-accent/30 px-4 py-3">
                        <p className="text-sm text-foreground">
                          {plant.todayRecommendation}
                        </p>
                      </div>

                      {/* Quick Actions */}
                      {canAct && (
                        <div className="flex border-t border-border">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex-1 rounded-none h-11 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => handleQuickAction(plant.id, 'water')}
                            disabled={actionLoading[waterKey]}
                          >
                            <Droplets className="mr-1.5 h-4 w-4" />
                            {actionLoading[waterKey] ? 'Watering...' : 'Water'}
                          </Button>
                          <div className="w-px bg-border" />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex-1 rounded-none h-11 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                            onClick={() => handleQuickAction(plant.id, 'feed')}
                            disabled={actionLoading[feedKey]}
                          >
                            <Utensils className="mr-1.5 h-4 w-4" />
                            {actionLoading[feedKey] ? 'Feeding...' : 'Feed'}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
