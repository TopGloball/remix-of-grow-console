import { useState } from 'react';
import { Droplets, Utensils, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMode } from '@/context/ModeContext';
import { useToast } from '@/hooks/use-toast';
import type { PlantActionType } from '@/types';

interface ActionButtonProps {
  actionType: PlantActionType;
  onAction: () => Promise<void>;
  disabled?: boolean;
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const actionConfig = {
  WATER: {
    icon: Droplets,
    label: 'Water',
    className: 'bg-blue-600 hover:bg-blue-700 text-white',
  },
  FEED: {
    icon: Utensils,
    label: 'Feed',
    className: 'bg-amber-600 hover:bg-amber-700 text-white',
  },
  COMPLETE: {
    icon: CheckCircle,
    label: 'Complete',
    className: 'bg-green-600 hover:bg-green-700 text-white',
  },
};

export function ActionButton({ actionType, onAction, disabled = false, size = 'default' }: ActionButtonProps) {
  const { canAct, isObserverMode } = useMode();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const config = actionConfig[actionType];
  const Icon = config.icon;

  const handleClick = async () => {
    if (!canAct) {
      toast({
        title: 'Observer Mode',
        description: 'Actions are disabled in observer mode.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      await onAction();
      toast({
        title: 'Action Complete',
        description: `${config.label} action recorded successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Action Failed',
        description: 'Could not perform action. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || loading || !canAct}
      size={size}
      className={config.className}
      title={isObserverMode ? 'Actions disabled in observer mode' : config.label}
    >
      {loading ? (
        <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
      ) : (
        <Icon className="mr-1.5 h-4 w-4" />
      )}
      {config.label}
    </Button>
  );
}

interface ActionButtonGroupProps {
  plantId: string;
  plantStatus: string;
  onWater: () => Promise<void>;
  onFeed: () => Promise<void>;
  onComplete: () => Promise<void>;
}

export function ActionButtonGroup({ plantId, plantStatus, onWater, onFeed, onComplete }: ActionButtonGroupProps) {
  const { canAct } = useMode();
  const isCompleted = plantStatus === 'COMPLETED';

  if (isCompleted) {
    return (
      <div className="text-sm text-muted-foreground italic">
        Plant completed — no actions available
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <ActionButton actionType="WATER" onAction={onWater} disabled={!canAct} />
      <ActionButton actionType="FEED" onAction={onFeed} disabled={!canAct} />
      <ActionButton actionType="COMPLETE" onAction={onComplete} disabled={!canAct} />
    </div>
  );
}
