import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import FindDorm from "./pages/FindDorm";
import ShareDorm from "./pages/ShareDorm";
import DormProfile from "./pages/DormProfile";
import CreateDormProfile from "./pages/CreateDormProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/find" element={<FindDorm />} />
            <Route path="/share" element={<ShareDorm />} />
            <Route path="/dorm/create" element={<CreateDormProfile />} />
            <Route path="/dorm/:id" element={<DormProfile />} />
            {/* Legacy routes for backward compatibility */}
            <Route path="/search" element={<FindDorm />} />
            <Route path="/upload" element={<ShareDorm />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;