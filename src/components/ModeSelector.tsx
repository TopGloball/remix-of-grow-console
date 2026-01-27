import { Settings } from 'lucide-react';
import { useMode } from '@/context/ModeContext';
import type { UIMode } from '@/config/app';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function ModeSelector() {
  const { uiMode, setMode } = useMode();

  return (
    <div className="flex items-center gap-2">
      <Settings className="h-4 w-4 text-muted-foreground" />
      <Select value={uiMode} onValueChange={(v) => setMode(v as UIMode)}>
        <SelectTrigger className="h-8 w-28 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="user">User</SelectItem>
          <SelectItem value="observer">Observer</SelectItem>
          <SelectItem value="dev">Dev</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
