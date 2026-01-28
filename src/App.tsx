import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import ShellScreen from "@/pages/ShellScreen";
import TodayScreen from "@/pages/TodayScreen";
import PlantDetailScreen from "@/pages/PlantDetailScreen";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

// Wrapper components to handle outlet context
function ShellWrapper() {
  return <ShellScreen onAddPlantClick={() => {}} />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<ShellScreenWithContext />} />
            <Route path="/today" element={<TodayScreen />} />
            <Route path="/plants/:plantId" element={<PlantDetailScreen />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

// Component that uses outlet context
import { useOutletContext } from 'react-router-dom';

interface OutletContextType {
  onAddPlantClick: () => void;
}

function ShellScreenWithContext() {
  const context = useOutletContext<OutletContextType>();
  return <ShellScreen onAddPlantClick={context?.onAddPlantClick || (() => {})} />;
}

export default App;
