import { NavLink } from 'react-router-dom';
import { LayoutGrid, Calendar, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', icon: LayoutGrid, label: 'Plants' },
  { to: '/today', icon: Calendar, label: 'Today' },
  { to: '/plants/new', icon: Plus, label: 'Add' },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-card">
      <div className="mx-auto flex max-w-2xl items-center justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex flex-1 flex-col items-center gap-1 py-3 text-xs transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
