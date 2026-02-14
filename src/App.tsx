import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import MyAPIs from "./pages/MyAPIs";
import CreateAPI from "./pages/CreateAPI";
import EditAPI from "./pages/EditAPI";
import APIStats from "./pages/APIStats";
import Analytics from "./pages/Analytics";
import Billing from "./pages/Billing";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/my-apis" element={<ProtectedRoute><MyAPIs /></ProtectedRoute>} />
          <Route path="/create-api" element={<ProtectedRoute><CreateAPI /></ProtectedRoute>} />
          <Route path="/edit-api/:id" element={<ProtectedRoute><EditAPI /></ProtectedRoute>} />
          <Route path="/api-stats/:id" element={<ProtectedRoute><APIStats /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
