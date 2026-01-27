import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus, LayoutGrid } from 'lucide-react';
import { getPlantsDashboard, getGrows } from '@/api/api';
import type { PlantDashboardItem, Grow } from '@/types';
import { useMode } from '@/context/ModeContext';
import { PageHeader } from '@/components/PageHeader';
import { PlantCard } from '@/components/PlantCard';
import { GrowCard } from '@/components/GrowCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EmptyState } from '@/components/EmptyState';
import { ModeSelector } from '@/components/ModeSelector';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Dashboard() {
  const { canAct, isDevMode } = useMode();
  const [searchParams] = useSearchParams();
  const selectedGrowId = searchParams.get('grow');
  
  const [plants, setPlants] = useState<PlantDashboardItem[]>([]);
  const [grows, setGrows] = useState<Grow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'plants' | 'grows'>('plants');

  useEffect(() => {
    async function fetchData() {
      try {
        const [plantsRes, growsRes] = await Promise.all([
          getPlantsDashboard(),
          getGrows(),
        ]);
        setPlants(plantsRes.data);
        setGrows(growsRes.data);
      } catch (err) {
        setError('Failed to load data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filter plants by selected grow
  const filteredPlants = selectedGrowId 
    ? plants.filter(p => p.growId === selectedGrowId)
    : plants;

  const activePlants = filteredPlants.filter((p) => p.status === 'ACTIVE');
  const completedPlants = filteredPlants.filter((p) => p.status !== 'ACTIVE');
  const activeGrows = grows.filter(g => g.status === 'ACTIVE');
  const archivedGrows = grows.filter(g => g.status === 'ARCHIVED');

  const selectedGrow = selectedGrowId ? grows.find(g => g.id === selectedGrowId) : null;

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader
        title={selectedGrow ? selectedGrow.name : "Grow Console"}
        backTo={selectedGrow ? "/" : undefined}
        backLabel={selectedGrow ? "All Grows" : undefined}
        action={
          <div className="flex items-center gap-2">
            {isDevMode && <ModeSelector />}
            {canAct && (
              <Button asChild size="sm">
                <Link to="/plants/new">
                  <Plus className="mr-1.5 h-4 w-4" />
                  Add Plant
                </Link>
              </Button>
            )}
          </div>
        }
      />

      <main className="mx-auto max-w-2xl px-4 py-6">
        {loading && <LoadingSpinner />}

        {error && (
          <div className="rounded-lg bg-destructive/10 p-4 text-center text-sm text-destructive">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* View Tabs - only show when not filtering by grow */}
            {!selectedGrowId && (
              <Tabs value={view} onValueChange={(v) => setView(v as 'plants' | 'grows')} className="mb-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="plants">Plants</TabsTrigger>
                  <TabsTrigger value="grows">
                    <LayoutGrid className="mr-1.5 h-4 w-4" />
                    Grows
                  </TabsTrigger>
                </TabsList>

                {/* Plants Tab */}
                <TabsContent value="plants" className="mt-4">
                  {plants.length === 0 ? (
                    <EmptyState
                      title="No plants yet"
                      description="Start your grow by adding your first plant."
                      actionLabel={canAct ? "Add Plant" : undefined}
                      actionTo={canAct ? "/plants/new" : undefined}
                    />
                  ) : (
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
                </TabsContent>

                {/* Grows Tab */}
                <TabsContent value="grows" className="mt-4">
                  {grows.length === 0 ? (
                    <EmptyState
                      title="No grows yet"
                      description="Create your first grow environment."
                      actionLabel={canAct ? "Create Grow" : undefined}
                      actionTo={canAct ? "/grows/new" : undefined}
                    />
                  ) : (
                    <div className="space-y-6">
                      {activeGrows.length > 0 && (
                        <section>
                          <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
                            Active Grows ({activeGrows.length})
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
                </TabsContent>
              </Tabs>
            )}

            {/* Filtered view when a grow is selected */}
            {selectedGrowId && (
              <div className="space-y-6">
                {filteredPlants.length === 0 ? (
                  <EmptyState
                    title="No plants in this grow"
                    description="Add a plant to get started."
                    actionLabel={canAct ? "Add Plant" : undefined}
                    actionTo={canAct ? "/plants/new" : undefined}
                  />
                ) : (
                  <>
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
                  </>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
