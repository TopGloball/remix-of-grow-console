import { useState } from 'react';
import { X, Sun, Moon, Sprout, Flower2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { usePlantStore } from '@/store/plantStore';

interface DevicesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LIGHT_MODES = [
  { id: 'veg', label: 'Вегетация', hours: 18, icon: Sprout },
  { id: 'flower', label: 'Цветение', hours: 12, icon: Flower2 },
  { id: 'seedling', label: 'Рассада', hours: 20, icon: Sun },
  { id: 'night', label: 'Ночь', hours: 0, icon: Moon },
];

export function DevicesModal({ open, onOpenChange }: DevicesModalProps) {
  const { toast } = useToast();
  const { plants } = usePlantStore();
  const [name, setName] = useState('');
  const [deviceType, setDeviceType] = useState('lighting');
  const [linkedPlant, setLinkedPlant] = useState('none');
  const [lightMode, setLightMode] = useState('veg');
  const [deviceId, setDeviceId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Устройство добавлено',
      description: `${name || 'Новое устройство'} успешно добавлено`,
    });
    onOpenChange(false);
    // Reset form
    setName('');
    setDeviceType('lighting');
    setLinkedPlant('none');
    setLightMode('veg');
    setDeviceId('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm bg-popover border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-semibold">Добавить устройство</DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-4">
          {/* Name */}
          <div className="form-field">
            <Label htmlFor="device-name" className="form-label">
              Название
            </Label>
            <Input
              id="device-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Лампа в гроутенте"
              className="form-input"
            />
          </div>

          {/* Device Type */}
          <div className="form-field">
            <Label className="form-label">Тип устройства</Label>
            <Select value={deviceType} onValueChange={setDeviceType}>
              <SelectTrigger className="form-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="lighting">Освещение</SelectItem>
                <SelectItem value="fan">Вентиляция</SelectItem>
                <SelectItem value="humidifier">Увлажнитель</SelectItem>
                <SelectItem value="sensor">Датчик</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Link to Plant */}
          <div className="form-field">
            <Label className="form-label">Привязать к растению</Label>
            <Select value={linkedPlant} onValueChange={setLinkedPlant}>
              <SelectTrigger className="form-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="none">Без привязки</SelectItem>
                {plants.map((plant) => (
                  <SelectItem key={plant.id} value={plant.id}>
                    {plant.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Light Mode (only for lighting) */}
          {deviceType === 'lighting' && (
            <div className="form-field">
              <Label className="form-label">Режим освещения</Label>
              <div className="grid grid-cols-2 gap-2">
                {LIGHT_MODES.map((mode) => {
                  const Icon = mode.icon;
                  const isActive = lightMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setLightMode(mode.id)}
                      className={`flex items-center justify-between gap-2 px-3 py-3 rounded-lg border text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-primary/20 border-primary text-primary'
                          : 'bg-muted/30 border-border text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span>{mode.label}</span>
                      </div>
                      <span className="text-xs opacity-70">{mode.hours}ч</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Device ID */}
          <div className="form-field">
            <Label htmlFor="device-id" className="form-label">
              ID устройства (опционально)
            </Label>
            <Input
              id="device-id"
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              placeholder="MAC адрес или ID"
              className="form-input"
            />
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full h-12 text-base font-medium">
            Добавить
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
