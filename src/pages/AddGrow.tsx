import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGrow } from '@/api/api';
import type { GrowEnvironment } from '@/types';
import { useMode } from '@/context/ModeContext';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Home, Sun, Warehouse } from 'lucide-react';

const environmentOptions: { value: GrowEnvironment; label: string; icon: typeof Home }[] = [
  { value: 'INDOOR', label: 'Indoor', icon: Home },
  { value: 'OUTDOOR', label: 'Outdoor', icon: Sun },
  { value: 'GREENHOUSE', label: 'Greenhouse', icon: Warehouse },
];

export default function AddGrow() {
  const navigate = useNavigate();
  const { canAct, isObserverMode } = useMode();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [environment, setEnvironment] = useState<GrowEnvironment>('INDOOR');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Please enter a name for your grow');
      return;
    }

    if (!canAct) {
      setError('Actions are disabled in observer mode');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await createGrow({
        name: name.trim(),
        environment,
      });
      navigate('/');
    } catch (err) {
      setError('Failed to create grow');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Create Grow" backTo="/" backLabel="Back" />

      <main className="mx-auto max-w-2xl px-4 py-6">
        {isObserverMode && (
          <div className="mb-4 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
            You are in observer mode. Creating grows is disabled.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Main Tent, Backyard Garden"
              className="bg-card"
              disabled={!canAct}
            />
          </div>

          {/* Environment */}
          <div className="space-y-2">
            <Label>Environment *</Label>
            <div className="grid grid-cols-3 gap-3">
              {environmentOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = environment === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setEnvironment(option.value)}
                    disabled={!canAct}
                    className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-card hover:border-primary/50'
                    } ${!canAct ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Icon className={`h-6 w-6 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={submitting || !canAct}>
            {submitting ? 'Creating...' : 'Create Grow'}
          </Button>
        </form>
      </main>
    </div>
  );
}
