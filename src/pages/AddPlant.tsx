import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPlant, getCultivars } from '@/api/api';
import type { Cultivar, CreatePlantPayload } from '@/types';
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
  const [cultivars, setCultivars] = useState<Cultivar[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [cultivarId, setCultivarId] = useState('');
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [ageInDays, setAgeInDays] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    async function fetchCultivars() {
      try {
        const response = await getCultivars();
        setCultivars(response.data);
      } catch (err) {
        setError('Failed to load cultivars');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCultivars();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!cultivarId) {
      setError('Please select a cultivar');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload: CreatePlantPayload = {
        cultivarId,
        name: name.trim() || undefined,
        startDate: startDate || undefined,
        ageInDays: ageInDays ? parseInt(ageInDays, 10) : undefined,
        notes: notes.trim() || undefined,
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
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="cultivar">Cultivar *</Label>
            <Select value={cultivarId} onValueChange={setCultivarId}>
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

          <div className="space-y-2">
            <Label htmlFor="name">Name (optional)</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Give your plant a name"
              className="bg-card"
            />
          </div>

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
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any notes about this plant..."
              rows={3}
              className="bg-card"
            />
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create Plant'}
          </Button>
        </form>
      </main>
    </div>
  );
}
