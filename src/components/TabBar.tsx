import { NavLink } from 'react-router-dom';
import { LayoutGrid, CalendarCheck, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TabBarProps {
  onAddClick: () => void;
}

export function TabBar({ onAddClick }: TabBarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-md border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        <NavLink
          to="/"
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center gap-1 flex-1 h-full text-xs font-medium transition-colors',
              isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            )
          }
        >
          <LayoutGrid className="w-5 h-5" />
          <span>Shell</span>
        </NavLink>

        <NavLink
          to="/today"
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center gap-1 flex-1 h-full text-xs font-medium transition-colors',
              isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            )
          }
        >
          <CalendarCheck className="w-5 h-5" />
          <span>Today</span>
        </NavLink>

        <button
          onClick={onAddClick}
          className="flex flex-col items-center justify-center gap-1 flex-1 h-full text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <div className="w-10 h-10 -mt-4 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
            <Plus className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="-mt-1">Add Plant</span>
        </button>
      </div>
    </nav>
  );
}
