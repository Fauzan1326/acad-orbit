import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AcademicProvider } from "@/context/AcademicContext";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import AcademicControl from "./pages/AcademicControl";
import MasterData from "./pages/MasterData";
import SemesterView from "./pages/SemesterView";
import RoomView from "./pages/RoomView";
import TeacherView from "./pages/TeacherView";
import YearView from "./pages/YearView";
import ClashDetection from "./pages/ClashDetection";
import Analytics from "./pages/Analytics";
import Lookups from "./pages/Lookups";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground mt-3">Loading...</p>
        </div>
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/auth" element={<PublicRoute><Auth /></PublicRoute>} />
            <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected routes */}
            <Route path="/*" element={
              <ProtectedRoute>
                <AcademicProvider>
                  <AppLayout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/control" element={<AcademicControl />} />
                      <Route path="/master" element={<MasterData />} />
                      <Route path="/view/semester" element={<SemesterView />} />
                      <Route path="/view/room" element={<RoomView />} />
                      <Route path="/view/teacher" element={<TeacherView />} />
                      <Route path="/view/year" element={<YearView />} />
                      <Route path="/clashes" element={<ClashDetection />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/lookups" element={<Lookups />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </AppLayout>
                </AcademicProvider>
              </ProtectedRoute>
            } />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
