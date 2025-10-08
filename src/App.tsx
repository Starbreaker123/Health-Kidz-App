
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { Suspense, lazy } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
const Index = lazy(() => import('./pages/Index'));
const Auth = lazy(() => import('./pages/Auth'));
const Children = lazy(() => import('./pages/Children'));
const Meals = lazy(() => import('./pages/Meals'));
const MobileProgress = lazy(() => import('./pages/MobileProgress'));
const EnhancedProgress = lazy(() => import('./pages/EnhancedProgress'));
const EnhancedAICoach = lazy(() => import('./pages/EnhancedAICoach'));
const EmailVerification = lazy(() => import('./pages/EmailVerification'));
const NotFound = lazy(() => import('./pages/NotFound'));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center p-6">
              <div className="flex items-center gap-3 text-gray-600">
                <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Loading…</span>
              </div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/verify" element={<EmailVerification />} />
              <Route path="/children" element={<ProtectedRoute><Children /></ProtectedRoute>} />
              <Route path="/meals" element={<ProtectedRoute><Meals /></ProtectedRoute>} />
              <Route path="/progress" element={<ProtectedRoute><MobileProgress /></ProtectedRoute>} />
              <Route path="/progress-enhanced" element={<ProtectedRoute><EnhancedProgress /></ProtectedRoute>} />
              <Route path="/ai-coach" element={<ProtectedRoute><EnhancedAICoach /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
