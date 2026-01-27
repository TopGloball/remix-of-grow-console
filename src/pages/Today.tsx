import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { getPlantsDashboard } from '@/api/api';
import type { PlantDashboardItem } from '@/types';
import { PageHeader } from '@/components/PageHeader';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EmptyState } from '@/components/EmptyState';

export default function Today() {
  const [plants, setPlants] = useState<PlantDashboardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPlants() {
      try {
        const response = await getPlantsDashboard();
        setPlants(response.data);
      } catch (err) {
        setError('Failed to load recommendations');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPlants();
  }, []);

  const plantsWithRecommendations = plants.filter(
    (p) => p.todayRecommendation && p.status === 'ACTIVE'
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Today" />

      <main className="mx-auto max-w-2xl px-4 py-6">
        {loading && <LoadingSpinner />}

        {error && (
          <div className="rounded-lg bg-destructive/10 p-4 text-center text-sm text-destructive">
            {error}
          </div>
        )}

        {!loading && !error && plantsWithRecommendations.length === 0 && (
          <EmptyState
            title="Nothing for today"
            description="No recommendations for your plants right now. Check back later."
          />
        )}

        {!loading && !error && plantsWithRecommendations.length > 0 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {plantsWithRecommendations.length} plant
              {plantsWithRecommendations.length !== 1 ? 's' : ''} need attention today
            </p>

            <div className="space-y-3">
              {plantsWithRecommendations.map((plant) => (
                <Link
                  key={plant.id}
                  to={`/plants/${plant.id}`}
                  className="block rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/30 hover:bg-card-hover"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-foreground">
                        {plant.name || plant.cultivar.name}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {plant.todayRecommendation}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
