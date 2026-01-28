import { Leaf, Plug, Settings } from 'lucide-react';

interface TopBarProps {
  onDevicesClick: () => void;
  onSettingsClick: () => void;
}

export function TopBar({ onDevicesClick, onSettingsClick }: TopBarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between px-4 h-14 max-w-lg mx-auto">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Leaf className="w-5 h-5 text-primary" />
          </div>
          <span className="font-semibold text-foreground">GrowSmart</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={onDevicesClick}
            className="w-10 h-10 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Устройства"
          >
            <Plug className="w-5 h-5" />
          </button>
          <button
            onClick={onSettingsClick}
            className="w-10 h-10 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Настройки"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
