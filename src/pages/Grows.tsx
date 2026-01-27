import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { getGrows } from '@/api/api';
import type { Grow } from '@/types';
import { useMode } from '@/context/ModeContext';
import { PageHeader } from '@/components/PageHeader';
import { GrowCard } from '@/components/GrowCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';

export default function Grows() {
  const { canAct } = useMode();
  const [grows, setGrows] = useState<Grow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGrows() {
      try {
        const response = await getGrows();
        setGrows(response.data);
      } catch (err) {
        setError('Failed to load grows');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchGrows();
  }, []);

  const activeGrows = grows.filter(g => g.status === 'ACTIVE');
  const archivedGrows = grows.filter(g => g.status === 'ARCHIVED');

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader
        title="Grows"
        action={
          canAct && (
            <Button asChild size="sm">
              <Link to="/grows/new">
                <Plus className="mr-1.5 h-4 w-4" />
                Create Grow
              </Link>
            </Button>
          )
        }
      />

      <main className="mx-auto max-w-2xl px-4 py-6">
        {loading && <LoadingSpinner />}

        {error && (
          <div className="rounded-lg bg-destructive/10 p-4 text-center text-sm text-destructive">
            {error}
          </div>
        )}

        {!loading && !error && grows.length === 0 && (
          <EmptyState
            title="No grows yet"
            description="Create your first grow environment to get started."
            actionLabel={canAct ? "Create Grow" : undefined}
            actionTo={canAct ? "/grows/new" : undefined}
          />
        )}

        {!loading && !error && grows.length > 0 && (
          <div className="space-y-6">
            {activeGrows.length > 0 && (
              <section>
                <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  Active ({activeGrows.length})
                </h2>
                <div className="space-y-3">
                  {activeGrows.map((grow) => (
                    <GrowCard key={grow.id} grow={grow} />
                  ))}
                </div>
              </section>
            )}

            {archivedGrows.length > 0 && (
              <section>
                <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  Archived ({archivedGrows.length})
                </h2>
                <div className="space-y-3">
                  {archivedGrows.map((grow) => (
                    <GrowCard key={grow.id} grow={grow} />
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
