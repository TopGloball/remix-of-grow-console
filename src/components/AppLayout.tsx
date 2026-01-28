import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TopBar } from './TopBar';
import { TabBar } from './TabBar';
import { SettingsModal } from './modals/SettingsModal';
import { DevicesModal } from './modals/DevicesModal';
import { AddPlantModal } from './modals/AddPlantModal';

export function AppLayout() {
  const location = useLocation();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [devicesOpen, setDevicesOpen] = useState(false);
  const [addPlantOpen, setAddPlantOpen] = useState(false);

  // Hide bottom nav on plant detail page
  const isDetailPage = location.pathname.startsWith('/plants/') && location.pathname !== '/plants/new';

  return (
    <div className="relative min-h-screen bg-background">
      <TopBar
        onDevicesClick={() => setDevicesOpen(true)}
        onSettingsClick={() => setSettingsOpen(true)}
      />

      <main className="pt-14 pb-20 px-4 max-w-lg mx-auto">
        <div className="py-4">
          <Outlet context={{ onAddPlantClick: () => setAddPlantOpen(true) }} />
        </div>
      </main>

      {!isDetailPage && <TabBar onAddClick={() => setAddPlantOpen(true)} />}

      {/* Modals */}
      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
      <DevicesModal open={devicesOpen} onOpenChange={setDevicesOpen} />
      <AddPlantModal open={addPlantOpen} onOpenChange={setAddPlantOpen} />
    </div>
  );
}
