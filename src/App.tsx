import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AcademicProvider } from "@/context/AcademicContext";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
