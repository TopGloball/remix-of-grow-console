import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { getPlantsDashboard } from '@/api/api';
import type { PlantDashboardItem } from '@/types';
import { PageHeader } from '@/components/PageHeader';
import { PlantCard } from '@/components/PlantCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const [plants, setPlants] = useState<PlantDashboardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPlants() {
      try {
        const response = await getPlantsDashboard();
        setPlants(response.data);
      } catch (err) {
        setError('Failed to load plants');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPlants();
  }, []);

  const activePlants = plants.filter((p) => p.status === 'ACTIVE');
  const completedPlants = plants.filter((p) => p.status !== 'ACTIVE');

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader
        title="Grow Console"
        action={
          <Button asChild size="sm">
            <Link to="/plants/new">
              <Plus className="mr-1.5 h-4 w-4" />
              Add Plant
            </Link>
          </Button>
        }
      />

      <main className="mx-auto max-w-2xl px-4 py-6">
        {loading && <LoadingSpinner />}

        {error && (
          <div className="rounded-lg bg-destructive/10 p-4 text-center text-sm text-destructive">
            {error}
          </div>
        )}

        {!loading && !error && plants.length === 0 && (
          <EmptyState
            title="No plants yet"
            description="Start your grow by adding your first plant."
            actionLabel="Add Plant"
            actionTo="/plants/new"
          />
        )}

        {!loading && !error && plants.length > 0 && (
          <div className="space-y-6">
            {activePlants.length > 0 && (
              <section>
                <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  Active ({activePlants.length})
                </h2>
                <div className="space-y-3">
                  {activePlants.map((plant) => (
                    <PlantCard key={plant.id} plant={plant} />
                  ))}
                </div>
              </section>
            )}

            {completedPlants.length > 0 && (
              <section>
                <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  Completed ({completedPlants.length})
                </h2>
                <div className="space-y-3">
                  {completedPlants.map((plant) => (
                    <PlantCard key={plant.id} plant={plant} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
