import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import AddPlant from "@/pages/AddPlant";
import PlantDetail from "@/pages/PlantDetail";
import Today from "@/pages/Today";
import Grows from "@/pages/Grows";
import AddGrow from "@/pages/AddGrow";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/plants/new" element={<AddPlant />} />
            <Route path="/plants/:plantId" element={<PlantDetail />} />
            <Route path="/today" element={<Today />} />
            <Route path="/grows" element={<Grows />} />
            <Route path="/grows/new" element={<AddGrow />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
