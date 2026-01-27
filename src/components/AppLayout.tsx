import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { DebugPanel } from './DebugPanel';
import { ModeProvider } from '@/context/ModeContext';

export function AppLayout() {
  return (
    <ModeProvider>
      <div className="relative min-h-screen">
        <Outlet />
        <BottomNav />
        <DebugPanel />
      </div>
    </ModeProvider>
  );
}
