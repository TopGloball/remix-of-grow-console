import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPlantDetail } from '@/api/api';
import type { PlantDetail as PlantDetailType } from '@/types';
import { PageHeader } from '@/components/PageHeader';
import { StatusBadge } from '@/components/StatusBadge';
import { StageBadge } from '@/components/StageBadge';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function PlantDetail() {
  const { plantId } = useParams<{ plantId: string }>();
  const [plant, setPlant] = useState<PlantDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPlant() {
      if (!plantId) return;
      
      try {
        const response = await getPlantDetail(plantId);
        setPlant(response.data);
      } catch (err) {
        setError('Failed to load plant details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPlant();
  }, [plantId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <PageHeader title="Plant Details" backTo="/" backLabel="Back" />
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !plant) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <PageHeader title="Plant Details" backTo="/" backLabel="Back" />
        <div className="mx-auto max-w-2xl px-4 py-6">
          <div className="rounded-lg bg-destructive/10 p-4 text-center text-sm text-destructive">
            {error || 'Plant not found'}
          </div>
        </div>
      </div>
    );
  }

  const displayName = plant.name || plant.cultivar.name;

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title={displayName} backTo="/" backLabel="Back" />

      <main className="mx-auto max-w-2xl px-4 py-6">
        <div className="space-y-6">
          {/* Header info */}
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-foreground">{displayName}</h2>
                {plant.name && (
                  <p className="mt-0.5 text-muted-foreground">{plant.cultivar.name}</p>
                )}
              </div>
              <StatusBadge status={plant.status} />
            </div>

            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Stage: </span>
                <StageBadge stage={plant.stage} />
              </div>
              <div>
                <span className="text-muted-foreground">Age: </span>
                <span className="font-medium">{plant.ageInDays} days</span>
              </div>
              <div>
                <span className="text-muted-foreground">Started: </span>
                <span className="font-medium">{plant.startDate}</span>
              </div>
            </div>
          </div>

          {/* Today recommendation */}
          {plant.todayRecommendation && (
            <div className="rounded-lg border-l-4 border-accent bg-card p-4">
              <h3 className="mb-2 text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Today's Recommendation
              </h3>
              <p className="text-foreground">{plant.todayRecommendation}</p>
            </div>
          )}

          {/* Notes */}
          {plant.notes && (
            <div className="rounded-lg border border-border bg-card p-4">
              <h3 className="mb-2 text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Notes
              </h3>
              <p className="whitespace-pre-wrap text-foreground">{plant.notes}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
