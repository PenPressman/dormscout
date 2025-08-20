import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ConsentGuard from "@/components/ConsentGuard";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import FindDorm from "./pages/FindDorm";
import ShareDorm from "./pages/ShareDorm";
import DormProfile from "./pages/DormProfile";
import CreateDormProfile from "./pages/CreateDormProfile";
import EditDormProfile from "./pages/EditDormProfile";
import SavedDorms from "./pages/SavedDorms";
import MyPosts from "./pages/MyPosts";
import About from "./pages/About";
import EmailVerified from "./pages/EmailVerified";
import TermsOfService from "./pages/legal/TermsOfService";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import AdminConsents from "./pages/admin/Consents";
import AdminDashboard from "./pages/admin/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ConsentGuard>
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/email-verified" element={<EmailVerified />} />
            <Route path="/find" element={<FindDorm />} />
            <Route path="/share" element={<ShareDorm />} />
            <Route path="/dorm/create" element={<CreateDormProfile />} />
            <Route path="/dorm/edit/:id" element={<EditDormProfile />} />
            <Route path="/dorm/:id" element={<DormProfile />} />
            <Route path="/saved" element={<SavedDorms />} />
            <Route path="/my-posts" element={<MyPosts />} />
            <Route path="/about" element={<About />} />
            <Route path="/legal/terms-of-service" element={<TermsOfService />} />
            <Route path="/legal/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/consents" element={<AdminConsents />} />
            {/* Legacy routes for backward compatibility */}
            <Route path="/search" element={<FindDorm />} />
            <Route path="/upload" element={<ShareDorm />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </ConsentGuard>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;