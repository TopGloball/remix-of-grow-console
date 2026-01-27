import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPlant, getCultivars, getGrows } from '@/api/api';
import type { Cultivar, CreatePlantPayload, Grow } from '@/types';
import { useMode } from '@/context/ModeContext';
import { PageHeader } from '@/components/PageHeader';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function AddPlant() {
  const navigate = useNavigate();
  const { canAct, isObserverMode } = useMode();
  const [cultivars, setCultivars] = useState<Cultivar[]>([]);
  const [grows, setGrows] = useState<Grow[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [growId, setGrowId] = useState('');
  const [cultivarId, setCultivarId] = useState('');
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [ageInDays, setAgeInDays] = useState('');
  const [notes, setNotes] = useState('');
  const [medium, setMedium] = useState('');
  const [passportSource, setPassportSource] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [cultivarsRes, growsRes] = await Promise.all([
          getCultivars(),
          getGrows(),
        ]);
        setCultivars(cultivarsRes.data);
        setGrows(growsRes.data.filter(g => g.status === 'ACTIVE'));
        
        // Pre-select first active grow if available
        const activeGrows = growsRes.data.filter(g => g.status === 'ACTIVE');
        if (activeGrows.length > 0) {
          setGrowId(activeGrows[0].id);
        }
      } catch (err) {
        setError('Failed to load data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!growId) {
      setError('Please select a grow');
      return;
    }
    
    if (!cultivarId) {
      setError('Please select a cultivar');
      return;
    }

    if (!canAct) {
      setError('Actions are disabled in observer mode');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload: CreatePlantPayload = {
        growId,
        cultivarId,
        name: name.trim() || undefined,
        startDate: startDate || undefined,
        ageInDays: ageInDays ? parseInt(ageInDays, 10) : undefined,
        notes: notes.trim() || undefined,
        medium: medium.trim() || undefined,
        passportSource: passportSource.trim() || undefined,
      };

      await createPlant(payload);
      navigate('/');
    } catch (err) {
      setError('Failed to create plant');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <PageHeader title="Add Plant" backTo="/" backLabel="Back" />
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Add Plant" backTo="/" backLabel="Back" />

      <main className="mx-auto max-w-2xl px-4 py-6">
        {isObserverMode && (
          <div className="mb-4 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
            You are in observer mode. Creating plants is disabled.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Grow Selection */}
          <div className="space-y-2">
            <Label htmlFor="grow">Grow *</Label>
            <Select value={growId} onValueChange={setGrowId} disabled={!canAct}>
              <SelectTrigger id="grow" className="bg-card">
                <SelectValue placeholder="Select grow" />
              </SelectTrigger>
              <SelectContent>
                {grows.map((grow) => (
                  <SelectItem key={grow.id} value={grow.id}>
                    {grow.name} ({grow.environment.toLowerCase()})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {grows.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No active grows found. Create a grow first.
              </p>
            )}
          </div>

          {/* Cultivar Selection */}
          <div className="space-y-2">
            <Label htmlFor="cultivar">Cultivar / Strain *</Label>
            <Select value={cultivarId} onValueChange={setCultivarId} disabled={!canAct}>
              <SelectTrigger id="cultivar" className="bg-card">
                <SelectValue placeholder="Select cultivar" />
              </SelectTrigger>
              <SelectContent>
                {cultivars.map((cultivar) => (
                  <SelectItem key={cultivar.id} value={cultivar.id}>
                    {cultivar.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name (optional)</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Give your plant a name"
              className="bg-card"
              disabled={!canAct}
            />
          </div>

          {/* Date / Age */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  if (e.target.value) setAgeInDays('');
                }}
                className="bg-card"
                disabled={!canAct}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Or Age (days)</Label>
              <Input
                id="age"
                type="number"
                min="0"
                value={ageInDays}
                onChange={(e) => {
                  setAgeInDays(e.target.value);
                  if (e.target.value) setStartDate('');
                }}
                placeholder="e.g. 14"
                className="bg-card"
                disabled={!canAct}
              />
            </div>
          </div>

          {/* Medium / Environment */}
          <div className="space-y-2">
            <Label htmlFor="medium">Medium / Environment (optional)</Label>
            <Input
              id="medium"
              value={medium}
              onChange={(e) => setMedium(e.target.value)}
              placeholder="e.g. Coco coir, DWC, Soil"
              className="bg-card"
              disabled={!canAct}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any notes about this plant..."
              rows={3}
              className="bg-card"
              disabled={!canAct}
            />
          </div>

          {/* Advanced: Passport Source */}
          <details className="group">
            <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
              Advanced Options
            </summary>
            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="passportSource">Passport Source (optional)</Label>
                <Input
                  id="passportSource"
                  value={passportSource}
                  onChange={(e) => setPassportSource(e.target.value)}
                  placeholder="e.g. Clone from mother #3, Seed bank XYZ"
                  className="bg-card"
                  disabled={!canAct}
                />
                <p className="text-xs text-muted-foreground">
                  Track the origin of this plant for lineage purposes.
                </p>
              </div>
            </div>
          </details>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={submitting || !canAct || grows.length === 0}
          >
            {submitting ? 'Creating...' : 'Create Plant'}
          </Button>
        </form>
      </main>
    </div>
  );
}
