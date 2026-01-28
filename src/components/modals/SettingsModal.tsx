import { useState } from 'react';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const [notifications, setNotifications] = useState(true);
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm bg-popover border-border">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-semibold">Настройки</DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Notifications */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications" className="text-sm font-medium">
                Уведомления
              </Label>
              <p className="text-xs text-muted-foreground">
                Получать напоминания о задачах
              </p>
            </div>
            <Switch
              id="notifications"
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>

          {/* Units */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Единицы измерения</Label>
            <div className="flex gap-2">
              <button
                onClick={() => setUnits('metric')}
                className={cn(
                  'flex-1 py-2.5 px-4 rounded-lg border text-sm font-medium transition-all',
                  units === 'metric'
                    ? 'bg-primary/20 border-primary text-primary'
                    : 'bg-muted/30 border-border text-muted-foreground hover:text-foreground'
                )}
              >
                Метрические
              </button>
              <button
                onClick={() => setUnits('imperial')}
                className={cn(
                  'flex-1 py-2.5 px-4 rounded-lg border text-sm font-medium transition-all',
                  units === 'imperial'
                    ? 'bg-primary/20 border-primary text-primary'
                    : 'bg-muted/30 border-border text-muted-foreground hover:text-foreground'
                )}
              >
                Имперские
              </button>
            </div>
          </div>

          {/* App Info */}
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              GrowSmart v1.0.0 • UI Shell Demo
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
