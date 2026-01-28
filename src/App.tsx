import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import ShellScreen from "@/pages/ShellScreen";
import TodayScreen from "@/pages/TodayScreen";
import PlantDetailScreen from "@/pages/PlantDetailScreen";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on 401 errors
        if (error?.status === 401) return false;
        return failureCount < 3;
      },
    },
  },
});

// Wrapper components to handle outlet context
function ShellWrapper() {
  return <ShellScreen onAddPlantClick={() => {}} />;
}

const App = () => {
  // No basename for Railway/Vercel deployment
  const basename = '/';

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter basename={basename}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                <Route path="/" element={<ShellScreenWithContext />} />
                <Route path="/today" element={<TodayScreen />} />
                <Route path="/plants/:plantId" element={<PlantDetailScreen />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

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
