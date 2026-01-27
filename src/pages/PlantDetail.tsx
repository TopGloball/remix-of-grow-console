import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPlantDetail, waterPlant, feedPlant, completePlant } from '@/api/api';
import type { PlantDetail as PlantDetailType } from '@/types';
import { useMode } from '@/context/ModeContext';
import { PageHeader } from '@/components/PageHeader';
import { StatusBadge } from '@/components/StatusBadge';
import { StageBadge } from '@/components/StageBadge';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ActionButtonGroup } from '@/components/ActionButton';
import { SignalList } from '@/components/SignalList';
import { ActionHistory } from '@/components/ActionHistory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

export default function PlantDetail() {
  const { plantId } = useParams<{ plantId: string }>();
  const navigate = useNavigate();
  const { canAct } = useMode();
  const [plant, setPlant] = useState<PlantDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlant = async () => {
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
  };

  useEffect(() => {
    fetchPlant();
  }, [plantId]);

  const handleWater = async () => {
    if (!plantId) return;
    await waterPlant(plantId);
    await fetchPlant(); // Refresh data
  };

  const handleFeed = async () => {
    if (!plantId) return;
    await feedPlant(plantId);
    await fetchPlant();
  };

  const handleComplete = async () => {
    if (!plantId) return;
    await completePlant(plantId);
    await fetchPlant();
  };

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

  // Define stages for progression display
  const allStages = ['SEEDLING', 'VEGETATIVE', 'FLOWERING', 'HARVEST', 'DRYING', 'CURING'];
  const currentStageIndex = allStages.indexOf(plant.stage);

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title={displayName} backTo="/" backLabel="Back" />

      <main className="mx-auto max-w-2xl px-4 py-6">
        <div className="space-y-6">
          {/* Header Card */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">{displayName}</h2>
                  {plant.name && (
                    <p className="mt-0.5 text-muted-foreground">{plant.cultivar.name}</p>
                  )}
                  <p className="mt-1 text-sm text-muted-foreground">{plant.growName}</p>
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

              {/* Stage Progression */}
              <div className="mt-6">
                <div className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Stage Progression
                </div>
                <div className="flex gap-1">
                  {allStages.map((stage, index) => (
                    <div
                      key={stage}
                      className={`flex-1 h-2 rounded-full ${
                        index <= currentStageIndex
                          ? 'bg-primary'
                          : 'bg-muted'
                      }`}
                      title={stage}
                    />
                  ))}
                </div>
                <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                  <span>Seedling</span>
                  <span>Curing</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Today Recommendation */}
          {plant.todayRecommendation && (
            <Card className="border-l-4 border-l-accent">
              <CardContent className="p-4">
                <h3 className="mb-2 text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  Today's Recommendation
                </h3>
                <p className="text-foreground">{plant.todayRecommendation}</p>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          {plant.status === 'ACTIVE' && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ActionButtonGroup
                  plantId={plant.id}
                  plantStatus={plant.status}
                  onWater={handleWater}
                  onFeed={handleFeed}
                  onComplete={handleComplete}
                />
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {plant.notes && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-foreground">{plant.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Signals & History Tabs */}
          <Tabs defaultValue="signals">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signals">Signals</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signals" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <SignalList signals={plant.signals} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <ActionHistory actions={plant.recentActions} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
